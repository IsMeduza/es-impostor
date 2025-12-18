/**
 * ES IMPOSTOR - Cloudflare Worker Backend
 * Salas en tiempo real + Generaci�n de palabras con Gemini Flash
 */

export interface Env {
  ROOMS: DurableObjectNamespace;
  gemini_key: string;
  GEMINI_DAILY_LIMIT?: string;
}

interface PublicRoomInfo {
  code: string;
  playerCount: number;
  maxPlayers: number;
  topic: string;
  name?: string;
  createdAt: number;
  phase?: 'lobby' | 'reveal' | 'hints' | 'vote' | 'results';
}

const publicRooms: Map<string, PublicRoomInfo> = new Map();
const ADMIN_PIN = 'poiu1234';

let totalRoomsCreated = 0;
let totalGeminiCalls = 0;
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

    const corsHeaders = {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    };

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders });
    }

    try {
      if (env.GEMINI_DAILY_LIMIT) {
        const parsed = parseInt(env.GEMINI_DAILY_LIMIT, 10);
        if (!Number.isNaN(parsed) && parsed > 0 && parsed < 100000) {
          GEMINI_DAILY_LIMIT = parsed;
        }
      }

      if (path === '/api/health') {
        return json({ ok: true, service: 'es-impostor-worker' }, corsHeaders);
      }

      if (path === '/api/admin' && request.method === 'GET') {
        const pin = url.searchParams.get('pin') || '';
        if (pin !== ADMIN_PIN) {
          return json({ error: 'Unauthorized' }, corsHeaders, 401);
        }

        const now = Date.now();
        for (const [code, room] of publicRooms) {
          const isOld = now - room.createdAt > 15 * 60 * 1000;
          const isEmpty = room.playerCount <= 0;
          if (isOld && isEmpty) {
            publicRooms.delete(code);
          }
        }

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

      if (path === '/api/generate-word' && request.method === 'POST') {
        const body = await request.json() as { topic?: string; category?: string; needHint?: boolean };
        const result = await generateWordWithGemini(env.gemini_key, body.topic, body.category, body.needHint);
        return json({ word: result.word, hint: result.hint }, corsHeaders);
      }

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

        if (body.config.isPublic && data.success) {
          publicRooms.set(code, {
            code,
            playerCount: 0,
            maxPlayers: body.config.numPlayers || 6,
            topic: body.config.topic || body.config.category || 'general',
            name: body.config.roomName || '',
            createdAt: Date.now()
          });
        }

        return json(data, corsHeaders);
      }

      if (path === '/api/rooms/public' && request.method === 'GET') {
        const now = Date.now();
        for (const [code, room] of publicRooms) {
          const isOld = now - room.createdAt > 15 * 60 * 1000;
          const isEmpty = room.playerCount <= 0;
          if (isOld && isEmpty) {
            publicRooms.delete(code);
          }
        }

        const updatedRooms: PublicRoomInfo[] = [];
        for (const [code, info] of publicRooms) {
          try {
            const roomId = env.ROOMS.idFromName(code);
            const room = env.ROOMS.get(roomId);
            const stateResp = await room.fetch(new Request('https://room/state'));
            const state = await stateResp.json() as RoomState | { error: string };
            if ((state as any).error) {
              publicRooms.delete(code);
              continue;
            }
            const s = state as RoomState;
            info.playerCount = s.players.length;
            info.phase = s.phase;
            publicRooms.set(code, info);
            updatedRooms.push(info);
          } catch {
            publicRooms.delete(code);
          }
        }

        const rooms = updatedRooms
          .filter(r => r.playerCount < r.maxPlayers && r.phase === 'lobby')
          .slice(0, 20);

        return json({ rooms }, corsHeaders);
      }

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
        try {
          const info = publicRooms.get(code);
          const count = (data as any)?.state?.players?.length;
          if (info && typeof count === 'number') {
            info.playerCount = count;
            publicRooms.set(code, info);
          }
        } catch { /* noop */ }
        return json(data, corsHeaders);
      }

      if (path.startsWith('/api/rooms/') && path.endsWith('/ws')) {
        const code = path.split('/')[3].toUpperCase();
        const roomId = env.ROOMS.idFromName(code);
        const room = env.ROOMS.get(roomId);
        return room.fetch(request);
      }

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
  mode: 'list' | 'ai' | 'random';
  topic: string;
  category: string;
  categories: string[];
  numImpostors: number;
  numPlayers: number;
  numRounds: number;
  isPublic: boolean;
  impostorClueEnabled?: boolean;
  roomName?: string;
}

interface Player {
  id: string;
  name: string;
  icon: string;
  role?: 'civil' | 'impostor';
  hint?: string;
  impostorClue?: string;
  votedFor?: string;
  connected: boolean;
  isReady: boolean;
  hasSeenRole: boolean;
  suspectedBy: string[];
}

interface PlayerJoin {
  name: string;
  icon: string;
}

interface RoomState {
  code: string;
  config: RoomConfig;
  players: Player[];
  hostId: string | null;
  phase: 'lobby' | 'reveal' | 'hints' | 'vote' | 'results';
  secretWord: string | null;
  currentRound: number;
  winner: 'civils' | 'impostor' | null;
  createdAt: number;
}

export class RoomsDurableObject {
  state: DurableObjectState;
  env: Env;
  sessions: Map<WebSocket, string> = new Map();
  roomState: RoomState | null = null;

  readonly availableIcons: string[] = ['🦊', '🐱', '🐶', '🐼', '🐵', '🐸', '🦁', '🐰', '🐻', '🐨', '🐷', '🐙'];

  constructor(state: DurableObjectState, env: Env) {
    this.state = state;
    this.env = env;
  }

  async fetch(request: Request): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;

    if (request.headers.get('Upgrade') === 'websocket') {
      return this.handleWebSocket(request);
    }

    if (path === '/create' && request.method === 'POST') {
      const body = await request.json() as { code: string; config: RoomConfig };
      this.roomState = {
        code: body.code,
        config: body.config,
        players: [],
        hostId: null,
        phase: 'lobby',
        secretWord: null,
        currentRound: 1,
        winner: null,
        createdAt: Date.now(),
      };
      await this.state.storage.put('room', this.roomState);
      return json({ code: body.code, success: true });
    }

    if (path === '/join' && request.method === 'POST') {
      const player = await request.json() as PlayerJoin;
      if (!this.roomState) {
        this.roomState = await this.state.storage.get('room') as RoomState | null;
      }

      if (!this.roomState) {
        return json({ error: 'Room not found' }, {}, 404);
      }

      if (this.roomState.phase !== 'lobby') {
        return json({ error: 'Game already started' }, {}, 400);
      }

      if (this.roomState.players.length >= this.roomState.config.numPlayers) {
        return json({ error: 'Room is full' }, {}, 400);
      }

      const usedIcons = new Set(this.roomState.players.map(p => p.icon));
      let finalIcon = player.icon || '🦊';
      if (usedIcons.has(finalIcon)) {
        const available = this.availableIcons.find(icon => !usedIcons.has(icon));
        if (available) {
          finalIcon = available;
        }
      }

      const newPlayer: Player = {
        id: crypto.randomUUID(),
        name: player.name,
        icon: finalIcon,
        connected: true,
        isReady: false,
        hasSeenRole: false,
        suspectedBy: [],
      };

      this.roomState.players.push(newPlayer);

      if (this.roomState.players.length === 1) {
        this.roomState.hostId = newPlayer.id;
      }

      await this.state.storage.put('room', this.roomState);
      this.broadcast({ type: 'player-joined', player: newPlayer, state: this.roomState });

      return json({ playerId: newPlayer.id, state: this.roomState });
    }

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

    server.addEventListener('close', async () => {
      const playerId = this.sessions.get(server);
      if (playerId && this.roomState) {
        const player = this.roomState.players.find(p => p.id === playerId);
        if (player) {
          player.connected = false;
          
          // Contar jugadores conectados restantes
          const connectedPlayers = this.roomState.players.filter(p => p.connected);
          
          if (connectedPlayers.length === 0) {
            // No queda nadie - marcar sala como cerrada
            this.roomState.phase = 'lobby'; // Reset para limpieza
            this.roomState.players = []; // Limpiar jugadores
            this.roomState.hostId = null;
            await this.state.storage.put('room', this.roomState);
            // La sala se limpiará de publicRooms en el próximo GET /api/rooms/public
          } else {
            // Si el host se desconecta, transferir a otro jugador conectado
            if (this.roomState.hostId === playerId) {
              const newHost = connectedPlayers[0];
              if (newHost) {
                this.roomState.hostId = newHost.id;
                this.broadcast({ type: 'host-changed', newHostId: newHost.id, state: this.roomState });
              }
            }
            
            await this.state.storage.put('room', this.roomState);
            this.broadcast({ type: 'player-disconnected', playerId, state: this.roomState });
          }
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
      case 'connect': {
        this.sessions.set(ws, data.playerId);
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player) {
          player.connected = true;
          this.broadcast({ type: 'player-connected', playerId: data.playerId, state: this.roomState });
        }
        ws.send(JSON.stringify({ type: 'state', state: this.roomState }));
        break;
      }

      case 'toggle-ready': {
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player && this.roomState.phase === 'lobby') {
          player.isReady = !player.isReady;
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'state', state: this.roomState });
        }
        break;
      }

      case 'change-icon': {
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player && this.roomState.phase === 'lobby') {
          const usedIcons = new Set(this.roomState.players.filter(p => p.id !== data.playerId).map(p => p.icon));
          if (!usedIcons.has(data.icon)) {
            player.icon = data.icon;
            await this.state.storage.put('room', this.roomState);
            this.broadcast({ type: 'state', state: this.roomState });
          }
        }
        break;
      }

      case 'start-game': {
        const isHost = this.roomState.hostId === data.playerId;
        const allReady = this.roomState.players.every(p => p.isReady);
        const enoughPlayers = this.roomState.players.length >= 3;

        if (isHost && allReady && enoughPlayers && this.roomState.phase === 'lobby') {
          await this.startGame();
        }
        break;
      }

      case 'role-seen': {
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player && this.roomState.phase === 'reveal') {
          player.hasSeenRole = true;
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'state', state: this.roomState });

          if (this.roomState.players.every(p => p.hasSeenRole)) {
            this.roomState.phase = 'hints';
            await this.state.storage.put('room', this.roomState);
            this.broadcast({ type: 'state', state: this.roomState });
          }
        }
        break;
      }

      case 'submit-hint': {
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player && this.roomState.phase === 'hints' && !player.hint) {
          player.hint = data.hint;
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'state', state: this.roomState });

          if (this.roomState.players.every(p => p.hint)) {
            this.roomState.phase = 'vote';
            await this.state.storage.put('room', this.roomState);
            this.broadcast({ type: 'state', state: this.roomState });
          }
        }
        break;
      }

      case 'suspect-player': {
        const suspect = this.roomState.players.find(p => p.id === data.suspectId);
        if (suspect && data.playerId !== data.suspectId) {
          if (suspect.suspectedBy.includes(data.playerId)) {
            suspect.suspectedBy = suspect.suspectedBy.filter(id => id !== data.playerId);
          } else {
            suspect.suspectedBy.push(data.playerId);
          }
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'state', state: this.roomState });
        }
        break;
      }

      case 'submit-vote': {
        const player = this.roomState.players.find(p => p.id === data.playerId);
        if (player && this.roomState.phase === 'vote' && !player.votedFor) {
          player.votedFor = data.votedFor;
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'state', state: this.roomState });

          if (this.roomState.players.every(p => p.votedFor)) {
            this.calculateResults();
            await this.state.storage.put('room', this.roomState);
            this.broadcast({ type: 'state', state: this.roomState });
          }
        }
        break;
      }

      case 'play-again': {
        this.roomState.phase = 'lobby';
        this.roomState.secretWord = null;
        this.roomState.currentRound = 1;
        this.roomState.winner = null;
        this.roomState.players.forEach(p => {
          p.role = undefined;
          p.hint = undefined;
          p.impostorClue = undefined;
          p.votedFor = undefined;
          p.isReady = false;
          p.hasSeenRole = false;
          p.suspectedBy = [];
        });
        await this.state.storage.put('room', this.roomState);
        this.broadcast({ type: 'state', state: this.roomState });
        break;
      }

      case 'kick-player': {
        if (this.roomState.hostId === data.playerId && this.roomState.phase === 'lobby') {
          this.roomState.players = this.roomState.players.filter(p => p.id !== data.kickId);
          await this.state.storage.put('room', this.roomState);
          this.broadcast({ type: 'player-kicked', kickedId: data.kickId, state: this.roomState });
        }
        break;
      }
    }
  }

  async startGame() {
    if (!this.roomState) return;

    const indices = [...Array(this.roomState.players.length).keys()];
    indices.sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(indices.slice(0, this.roomState.config.numImpostors));

    this.roomState.players.forEach((p, i) => {
      p.role = impostorIndices.has(i) ? 'impostor' : 'civil';
      p.hint = undefined;
      p.impostorClue = undefined;
      p.votedFor = undefined;
      p.hasSeenRole = false;
      p.suspectedBy = [];
    });

    let secretWord = 'MISTERIO';
    let clue = '';

    const config = this.roomState.config;

    if (config.mode === 'ai' && config.topic) {
      const result = await generateWordWithGemini(
        this.env.gemini_key,
        config.topic,
        undefined,
        config.impostorClueEnabled
      );
      secretWord = result.word;
      clue = result.hint || '';
    } else if (config.mode === 'random' || (config.mode === 'list' && config.categories?.length > 0)) {
      const lists: Record<string, string[]> = {
        general: ['CASA', 'COCHE', 'LIBRO', 'MESA', 'RELOJ', 'VENTANA', 'ESPEJO', 'TEL�FONO', 'ORDENADOR', 'SILLA'],
        animals: ['GATO', 'PERRO', 'ELEFANTE', 'LE�N', 'TIGRE', 'DELF�N', '�GUILA', 'SERPIENTE', 'CABALLO', 'CONEJO'],
        food: ['PIZZA', 'PASTA', 'SUSHI', 'TACOS', 'PAELLA', 'HAMBURGUESA', 'HELADO', 'CHOCOLATE', 'ENSALADA', 'TORTILLA'],
        movies: ['TITANIC', 'AVATAR', 'MATRIX', 'JOKER', 'FROZEN', 'COCO', 'GLADIATOR', 'BATMAN', 'SPIDERMAN', 'SHREK'],
        sports: ['F�TBOL', 'TENIS', 'BALONCESTO', 'NATACI�N', 'CICLISMO', 'GOLF', 'BOXEO', 'ATLETISMO', 'SURF', 'ESQU�'],
        places: ['PLAYA', 'MONTA�A', 'CIUDAD', 'DESIERTO', 'SELVA', 'ISLA', 'MUSEO', 'PARQUE', 'HOSPITAL', 'COLEGIO'],
        professions: ['M�DICO', 'PROFESOR', 'BOMBERO', 'POLIC�A', 'COCINERO', 'PILOTO', 'ARQUITECTO', 'ACTOR', 'M�SICO', 'INGENIERO'],
      };

      const categoryHints: Record<string, string> = {
        general: 'OBJETO',
        animals: 'SER VIVO',
        food: 'SE COME',
        movies: 'CINE',
        sports: 'ACTIVIDAD',
        places: 'SITIO',
        professions: 'TRABAJO',
      };

      let category = 'general';
      if (config.mode === 'random') {
        const allCategories = Object.keys(lists);
        category = allCategories[Math.floor(Math.random() * allCategories.length)];
      } else if (config.categories?.length > 0) {
        category = config.categories[Math.floor(Math.random() * config.categories.length)];
      }

      const wordList = lists[category] || lists.general;
      secretWord = wordList[Math.floor(Math.random() * wordList.length)];

      if (config.impostorClueEnabled) {
        clue = categoryHints[category] || 'ALGO';
      }
    }

    this.roomState.secretWord = secretWord;

    if (config.impostorClueEnabled && clue) {
      this.roomState.players.forEach(p => {
        if (p.role === 'impostor') {
          p.impostorClue = clue;
        }
      });
    }

    this.roomState.phase = 'reveal';
    this.roomState.currentRound = 1;

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

    const impostors = this.roomState.players.filter(p => p.role === 'impostor').map(p => p.id);
    const impostorCaught = mostVoted.some(id => impostors.includes(id));

    this.roomState.winner = impostorCaught ? 'civils' : 'impostor';
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
  const now = Date.now();
  if (now - geminiWindowStart > 24 * 60 * 60 * 1000) {
    geminiWindowStart = now;
    geminiWindowCount = 0;
  }

  if (geminiWindowCount >= GEMINI_DAILY_LIMIT) {
    const fallback = ['MISTERIO', 'AVENTURA', 'TESORO', 'MAGIA', 'SOMBRA', 'SECRETO'];
    return { word: fallback[Math.floor(Math.random() * fallback.length)], hint: needHint ? 'CONCEPTO' : undefined };
  }

  totalGeminiCalls++;
  geminiWindowCount++;

  if (!apiKey || apiKey.includes('XXXX')) {
    const fallback = ['MISTERIO', 'AVENTURA', 'TESORO', 'MAGIA', 'SOMBRA', 'SECRETO'];
    return { word: fallback[Math.floor(Math.random() * fallback.length)], hint: 'CONCEPTO' };
  }

  const basePrompt = topic
    ? `Tema: "${topic}"`
    : `Categor�a: "${category || 'general'}"`;

  const instruction = needHint
    ? `Genera un JSON con dos campos: "word" (palabra en espa�ol, sustantivo com�n, may�sculas) y "hint" (otra palabra tambi�n en may�sculas, relacionada pero NO la misma, para dar como pista). Solo JSON.`
    : `Genera solo una palabra en espa�ol (sustantivo com�n, may�sculas) relacionada. Solo texto.`;

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
        return { word: 'MISTERIO', hint: 'ALGO' };
      }
    } else {
      const word = text.trim().toUpperCase().replace(/[^A-Z�������]/g, '');
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
