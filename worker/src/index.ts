/**
 * ES IMPOSTOR - Cloudflare Worker Backend
 * Salas en tiempo real + Generación de palabras con Gemini Flash
 */

export interface Env {
  ROOMS: DurableObjectNamespace;
  gemini_key: string;
  // Opcional: límite diario de Gemini configurable vía variable de entorno (string -> number)
  GEMINI_DAILY_LIMIT?: string;
}

// Tipo para info de sala pública
interface PublicRoomInfo {
  code: string;
  playerCount: number;
  maxPlayers: number;
  topic: string;
  name?: string;
  createdAt: number;
  phase?: 'lobby' | 'playing' | 'hints' | 'vote' | 'results';
}

// Almacenamiento en memoria de salas públicas activas
const publicRooms: Map<string, PublicRoomInfo> = new Map();

// PIN de admin (cámbialo antes de desplegar)
const ADMIN_PIN = 'poiu1234';

// Métricas simples en memoria (se reinician al redeploy)
let totalRoomsCreated = 0;
let totalGeminiCalls = 0;

// Ventana simple para limitar uso de Gemini y evitar sustos de coste
// Valor por defecto razonable; se puede sobreescribir con env.GEMINI_DAILY_LIMIT
let GEMINI_DAILY_LIMIT = 500;
let geminiWindowStart = Date.now();
let geminiWindowCount = 0;

// ============================================
// HANDLER PRINCIPAL
// ============================================
export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      // Permitir sobreescribir el límite diario de Gemini desde el entorno
      if (env.GEMINI_DAILY_LIMIT) {
        const parsed = parseInt(env.GEMINI_DAILY_LIMIT, 10);
        if (!Number.isNaN(parsed) && parsed > 0 && parsed < 100000) {
          GEMINI_DAILY_LIMIT = parsed;
        }
      }
      // Health check
      if (path === '/api/health') {
        return json({ ok: true, service: 'es-impostor-worker' }, corsHeaders);
      }

      // Panel admin (stats básicas)
      if (path === '/api/admin' && request.method === 'GET') {
        const pin = url.searchParams.get('pin') || '';
        if (pin !== ADMIN_PIN) {
          return json({ error: 'Unauthorized' }, corsHeaders, 401);
        }

        // No limpiamos aquí para no tocar el mapa; solo mostramos estado actual
        const roomsArray = Array.from(publicRooms.values());

        const usagePct = GEMINI_DAILY_LIMIT > 0
          ? Math.min(100, Math.round((geminiWindowCount / GEMINI_DAILY_LIMIT) * 100))
          : 0;

        return json({
          timestamp: Date.now(),
          totalRoomsCreated,
          totalGeminiCalls,
          publicRooms: roomsArray.length,
          publicRoomsDetail: roomsArray,
          geminiDailyLimit: GEMINI_DAILY_LIMIT,
          geminiWindowCount,
          geminiWindowStart,
          geminiUsagePct: usagePct,
          geminiNearLimit: usagePct >= 80
        }, corsHeaders);
      }

      // Generar palabra con IA
      if (path === '/api/generate-word' && request.method === 'POST') {
        const body = await request.json() as { topic?: string; category?: string; needHint?: boolean };
        const result = await generateWordWithGemini(env.gemini_key, body.topic, body.category, body.needHint);
        return json({ word: result.word, hint: result.hint }, corsHeaders);
      }

      // Crear sala
      if (path === '/api/rooms' && request.method === 'POST') {
        const body = await request.json() as { config: RoomConfig };
        const code = generateRoomCode();
        const roomId = env.ROOMS.idFromName(code);
        const room = env.ROOMS.get(roomId);

        const response = await room.fetch(new Request('https://room/create', {
          method: 'POST',
          body: JSON.stringify({ code, config: body.config }),
        }));

        const data = await response.json() as { code: string; success: boolean };

        if (data.success) {
          totalRoomsCreated++;
        }

        // Si es pública, registrar en la lista
        if (body.config.isPublic && data.success) {
          publicRooms.set(code, {
            code,
            playerCount: 0,
            maxPlayers: body.config.numPlayers || 4,
            topic: body.config.topic || body.config.category || 'general',
            name: body.config.roomName || '',
            createdAt: Date.now()
          });
        }

        return json(data, corsHeaders);
      }

      // Listar salas públicas
      if (path === '/api/rooms/public' && request.method === 'GET') {
        // Limpiar solo salas realmente inactivas:
        // - creadas hace más de 15 minutos
        // - y sin jugadores (playerCount <= 0)
        const now = Date.now();
        for (const [code, room] of publicRooms) {
          const isOld = now - room.createdAt > 15 * 60 * 1000; // >15 min
          const isEmpty = room.playerCount <= 0;
          if (isOld && isEmpty) {
            publicRooms.delete(code);
          }
        }

        // Actualizar estado real de cada sala para saber si sigue en lobby
        const updatedRooms: PublicRoomInfo[] = [];
        for (const [code, info] of publicRooms) {
          try {
            const roomId = env.ROOMS.idFromName(code);
            const room = env.ROOMS.get(roomId);
            const stateResp = await room.fetch(new Request('https://room/state'));
            const state = await stateResp.json() as RoomState | { error: string };
            if ((state as any).error) {
              // Si la sala ya no existe, eliminarla
              publicRooms.delete(code);
              continue;
            }
            const s = state as RoomState;
            info.playerCount = s.players.length;
            info.phase = s.phase;
            publicRooms.set(code, info);
            updatedRooms.push(info);
          } catch {
            // Si hay error al leer estado, dejamos la sala fuera de la lista pública
            publicRooms.delete(code);
          }
        }

        const rooms = updatedRooms
          .filter(r => r.playerCount < r.maxPlayers && r.phase === 'lobby')
          .slice(0, 20); // Máximo 20 salas

        return json({ rooms }, corsHeaders);
      }

      // Admin: cerrar sala pública manualmente
      if (path.startsWith('/api/admin/rooms/') && request.method === 'DELETE') {
        const pin = url.searchParams.get('pin') || '';
        if (pin !== ADMIN_PIN) {
          return json({ error: 'Unauthorized' }, corsHeaders, 401);
        }
        const parts = path.split('/');
        const code = (parts[parts.length - 1] || '').toUpperCase();
        if (!code || !publicRooms.has(code)) {
          return json({ ok: false, error: 'Room not found' }, corsHeaders, 404);
        }
        publicRooms.delete(code);
        return json({ ok: true, code }, corsHeaders);
      }

      // Unirse a sala
      if (path.startsWith('/api/rooms/') && path.endsWith('/join') && request.method === 'POST') {
        const code = path.split('/')[3].toUpperCase();
        const body = await request.json() as { player: PlayerJoin };
        const roomId = env.ROOMS.idFromName(code);
        const room = env.ROOMS.get(roomId);

        const response = await room.fetch(new Request('https://room/join', {
          method: 'POST',
          body: JSON.stringify(body.player),
        }));

        const data = await response.json();
        // Mantener contador de salas públicas (aproximado)
        try {
          const info = publicRooms.get(code);
          const count = (data as any)?.state?.players?.length;
          if (info && typeof count === 'number') {
            info.playerCount = count;
            publicRooms.set(code, info);
          }
        } catch {
          // noop
        }
        return json(data, corsHeaders);
      }

      // WebSocket para sala
      if (path.startsWith('/api/rooms/') && path.endsWith('/ws')) {
        const code = path.split('/')[3].toUpperCase();
        const roomId = env.ROOMS.idFromName(code);
        const room = env.ROOMS.get(roomId);
        return room.fetch(request);
      }

      // Estado de sala
      if (path.startsWith('/api/rooms/') && request.method === 'GET') {
        const code = path.split('/')[3].toUpperCase();
        const roomId = env.ROOMS.idFromName(code);
        const room = env.ROOMS.get(roomId);

        const response = await room.fetch(new Request('https://room/state'));
        const data = await response.json();
        return json(data, corsHeaders);
      }

      return json({ error: 'Not found' }, corsHeaders, 404);
    } catch (err) {
      console.error(err);
      return json({ error: 'Internal error' }, corsHeaders, 500);
    }
  },
};

// ============================================
// DURABLE OBJECT: ROOM
// ============================================
interface RoomConfig {
  mode: 'list' | 'ai';
  topic: string;
  category: string;
  numImpostors: number;
  numPlayers: number; // máximo de jugadores
  isPublic: boolean; // sala pública o privada
  impostorClueEnabled?: boolean; // Pistas para impostores
  roomName?: string; // Nombre visible de la sala
}

interface Player {
  id: string;
  name: string;
  icon: string;
  role?: 'civil' | 'impostor';
  hint?: string; // Pista dada por el jugador
  impostorClue?: string; // Pista recibida por el impostor
  votedFor?: string;
  connected: boolean;
}

interface PlayerJoin {
  name: string;
  icon: string;
}

interface RoomState {
  code: string;
  config: RoomConfig;
  players: Player[];
  phase: 'lobby' | 'playing' | 'hints' | 'vote' | 'results';
  secretWord: string | null;
  currentTurn: number;
  winner: 'civils' | 'impostor' | null;
  createdAt: number;
}

export class RoomsDurableObject {
  state: DurableObjectState;
  env: Env;
  sessions: Map<WebSocket, string> = new Map();
  roomState: RoomState | null = null;

  // Conjunto fijo de iconos para online (evitar iconos repetidos dentro de una sala)
  onlineIcons: string[] = ['🦊', '🐱', '🐶', '🐼', '🐵', '🐸', '🐯', '🐰', '🐻', '🐨', '🐷', '🐙'];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    // WebSocket upgrade
    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }

    // Crear sala
    if (path === '/create' && request.method === 'POST') {
      const body = await request.json() as { code: string; config: RoomConfig };
      this.roomState = {
        code: body.code,
        config: body.config,
        players: [],
        phase: 'lobby',
        secretWord: null,
        currentTurn: 0,
        winner: null,
        createdAt: Date.now(),
      };
      await this.state.storage.put('room', this.roomState);
      return json({ code: body.code, success: true });
    }

    // Unirse a sala
    if (path === '/join' && request.method === 'POST') {
      const player = await request.json() as PlayerJoin;
      if (!this.roomState) {
        this.roomState = await this.state.storage.get('room') as RoomState | null;
      }

      if (!this.roomState) {
        return json({ error: 'Room not found' }, {}, 404);
      }

      // Asegurar icono único dentro de la sala
      const usedIcons = new Set(this.roomState.players.map(p => p.icon));
      let finalIcon = player.icon || '🦊';
      if (usedIcons.has(finalIcon)) {
        const available = this.onlineIcons.find(icon => !usedIcons.has(icon));
        if (available) {
          finalIcon = available;
        }
      }

      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: player.name,
        icon: finalIcon,
        connected: true,
      };

      this.roomState.players.push(newPlayer);
      await this.state.storage.put('room', this.roomState);
      this.broadcast({ type: 'player-joined', player: newPlayer, state: this.roomState });

      return json({ playerId: newPlayer.id, state: this.roomState });
    }

    // Estado actual
    if (path === '/state') {
      if (!this.roomState) {
        this.roomState = await this.state.storage.get('room') as RoomState | null;
      }
      return json(this.roomState || { error: 'Room not found' });
    }

    return json({ error: 'Unknown action' }, {}, 400);
  }

  async handleWebSocket(request: Request): Promise<Response> {
    const pair = new WebSocketPair();
    const [client, server] = Object.values(pair);

    server.accept();

    server.addEventListener('message', async (event) => {
      try {
        const data = JSON.parse(event.data as string);
        await this.handleMessage(server, data);
      } catch (e) {
        console.error('WS message error:', e);
      }
    });

    server.addEventListener('close', () => {
      const playerId = this.sessions.get(server);
      if (playerId && this.roomState) {
        const player = this.roomState.players.find(p => p.id === playerId);
        if (player) {
          player.connected = false;
          this.broadcast({ type: 'player-disconnected', playerId });
        }
      }
      this.sessions.delete(server);
    });

    return new Response(null, { status: 101, webSocket: client });
  }

  async handleMessage(ws: WebSocket, data: any) {
    if (!this.roomState) {
      this.roomState = await this.state.storage.get('room') as RoomState | null;
    }
    if (!this.roomState) return;

    switch (data.type) {
      case 'connect':
        this.sessions.set(ws, data.playerId);
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player) {
          player.connected = true;
          this.broadcast({ type: 'player-connected', playerId: data.playerId });
        }
        ws.send(JSON.stringify({ type: 'state', state: this.roomState }));
        break;

      case 'start-game':
        if (this.roomState.players.length >= 3) {
          await this.startGame();
        }
        break;

      case 'submit-hint':
        this.roomState.players[this.roomState.currentTurn].hint = data.hint;
        this.roomState.currentTurn++;

        if (this.roomState.currentTurn >= this.roomState.players.length) {
          this.roomState.phase = 'vote';
          this.roomState.currentTurn = 0;
        }

        await this.state.storage.put('room', this.roomState);
        this.broadcast({ type: 'state', state: this.roomState });
        break;

      case 'submit-vote':
        this.roomState.players[this.roomState.currentTurn].votedFor = data.votedFor;
        this.roomState.currentTurn++;

        if (this.roomState.currentTurn >= this.roomState.players.length) {
          this.calculateResults();
        }

        await this.state.storage.put('room', this.roomState);
        this.broadcast({ type: 'state', state: this.roomState });
        break;

      case 'play-again':
        this.roomState.phase = 'lobby';
        this.roomState.secretWord = null;
        this.roomState.currentTurn = 0;
        this.roomState.winner = null;
        this.roomState.players.forEach(p => {
          p.role = undefined;
          p.hint = undefined;
          p.impostorClue = undefined;
          p.votedFor = undefined;
        });
        await this.state.storage.put('room', this.roomState);
        this.broadcast({ type: 'state', state: this.roomState });
        break;
    }
  }

  async startGame() {
    if (!this.roomState) return;

    // Asignar roles
    const indices = [...Array(this.roomState.players.length).keys()];
    indices.sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(indices.slice(0, this.roomState.config.numImpostors));

    this.roomState.players.forEach((p, i) => {
      p.role = impostorIndices.has(i) ? 'impostor' : 'civil';
      p.hint = undefined;
      p.impostorClue = undefined; // Resetear pista anterior
      p.votedFor = undefined;
    });

    // Generar palabra y pista (sí aplica)
    let secretWord = 'MISTERIO';
    let clue = '';

    if (this.roomState.config.mode === 'ai') {
      const result = await generateWordWithGemini(
        this.env.gemini_key,
        this.roomState.config.topic,
        this.roomState.config.category,
        this.roomState.config.impostorClueEnabled
      );
      secretWord = result.word;
      clue = result.hint || '';
    } else {
      const lists: Record<string, string[]> = {
        general: ['CASA', 'COCHE', 'LIBRO', 'MESA', 'RELOJ', 'VENTANA', 'ESPEJO'],
        animals: ['GATO', 'PERRO', 'ELEFANTE', 'LEÓN', 'TIGRE', 'DELFÍN', 'ÁGUILA'],
        food: ['PIZZA', 'PASTA', 'SUSHI', 'TACOS', 'PAELLA', 'HAMBURGUESA', 'HELADO'],
        movies: ['TITANIC', 'AVATAR', 'MATRIX', 'INCEPTION', 'JOKER', 'FROZEN', 'COCO'],
        custom: ['SOMBRA', 'MISTERIO', 'SECRETO', 'AVENTURA', 'MAGIA', 'TESORO'],
      };

      const category = this.roomState.config.category in lists ? this.roomState.config.category : 'general';
      const wordList = lists[category];
      secretWord = wordList[Math.floor(Math.random() * wordList.length)];

      if (this.roomState.config.impostorClueEnabled) {
        // Mapeo simple de pistas para el modo lista
        const fallbacks: Record<string, string> = {
          general: 'OBJETO',
          animals: 'ANIMAL',
          food: 'COMIDA',
          movies: 'PELÍCULA',
          custom: 'ALGO'
        };
        // Intentar dar una pista algo más específica si es posible, pero por ahora genérica
        clue = fallbacks[category] || 'COSA';
      }
    }

    this.roomState.secretWord = secretWord;

    // Asignar pista a los impostores
    if (this.roomState.config.impostorClueEnabled && clue) {
      this.roomState.players.forEach(p => {
        if (p.role === 'impostor') {
          p.impostorClue = clue;
        }
      });
    }

    this.roomState.phase = 'hints';
    this.roomState.currentTurn = 0;

    await this.state.storage.put('room', this.roomState);
    this.broadcast({ type: 'game-started', state: this.roomState });
  }

  calculateResults() {
    if (!this.roomState) return;

    const votes: Record<string, number> = {};
    this.roomState.players.forEach(p => {
      if (p.votedFor) votes[p.votedFor] = (votes[p.votedFor] || 0) + 1;
    });

    const maxVotes = Math.max(...Object.values(votes), 0);
    const mostVoted = Object.entries(votes).filter(([, v]) => v === maxVotes).map(([k]) => k);
    const impostor = this.roomState.players.find(p => p.role === 'impostor');

    this.roomState.winner = mostVoted.includes(impostor?.id || '') ? 'civils' : 'impostor';
    this.roomState.phase = 'results';
  }

  broadcast(message: any) {
    const msg = JSON.stringify(message);
    for (const ws of this.sessions.keys()) {
      try {
        ws.send(msg);
      } catch (e) {
        // WebSocket closed
      }
    }
  }
}

// ============================================
// GEMINI FLASH API
// ============================================
async function generateWordWithGemini(apiKey: string, topic?: string, category?: string, needHint?: boolean): Promise<{ word: string, hint?: string }> {
  // Ventana diaria simple para limitar uso
  const now = Date.now();
  if (now - geminiWindowStart > 24 * 60 * 60 * 1000) {
    geminiWindowStart = now;
    geminiWindowCount = 0;
  }

  // Si llegamos al límite diario, usamos fallback local sin llamar a la API
  if (geminiWindowCount >= GEMINI_DAILY_LIMIT) {
    const fallback = ['MISTERIO', 'AVENTURA', 'TESORO', 'MAGIA', 'SOMBRA', 'SECRETO'];
    return { word: fallback[Math.floor(Math.random() * fallback.length)], hint: needHint ? 'CONCEPTO' : undefined };
  }

  // Contar todas las llamadas (tanto desde API como desde salas online)
  totalGeminiCalls++;
  geminiWindowCount++;
  if (!apiKey || apiKey.includes('XXXX')) {
    // Fallback si no hay API key
    const fallback = ['MISTERIO', 'AVENTURA', 'TESORO', 'MAGIA', 'SOMBRA', 'SECRETO'];
    return { word: fallback[Math.floor(Math.random() * fallback.length)], hint: 'CONCEPTO' };
  }

  /* 
    Prompt optimizado:
    Si needHint es true, pedimos JSON con { word: "...", hint: "..." }
    Si no, pedimos solo texto (para mantener compatibilidad o simplicidad, pero mejor siempre JSON)
  */

  const basePrompt = topic
    ? `Tema: "${topic}"`
    : `Categoría: "${category || 'general'}"`;

  const instruction = needHint
    ? `Genera un JSON con dos campos: "word" (palabra en español, sustantivo común, mayúsculas) y "hint" (otra palabra también en mayúsculas, relacionada pero NO la misma, para dar como pista). Solo JSON.`
    : `Genera solo una palabra en español (sustantivo común, mayúsculas) relacionada. Solo texto.`;

  const prompt = `${basePrompt}. ${instruction}`;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{ parts: [{ text: prompt }] }],
          generationConfig: {
            temperature: 0.9,
            maxOutputTokens: 50,
            responseMimeType: needHint ? "application/json" : "text/plain"
          },
        }),
      }
    );

    const data = await response.json() as any;
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    if (needHint) {
      try {
        const json = JSON.parse(text);
        return {
          word: json.word?.toUpperCase() || 'ERROR',
          hint: json.hint?.toUpperCase() || 'COSA'
        };
      } catch (e) {
        // Fallback si falla el parseo
        return { word: 'MISTERIO', hint: 'ALGO' };
      }
    } else {
      const word = text.trim().toUpperCase().replace(/[^A-ZÁÉÍÓÚÑÜ]/g, '');
      return { word: word || 'MISTERIO' };
    }

  } catch (e) {
    console.error('Gemini error:', e);
    return { word: 'MISTERIO', hint: 'ERROR' };
  }
}

// ============================================
// UTILIDADES
// ============================================
function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let code = '';
  for (let i = 0; i < 4; i++) {
    code += chars[Math.floor(Math.random() * chars.length)];
  }
  return code;
}

function json(data: any, headers: Record<string, string> = {}, status = 200): Response {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  });
}
