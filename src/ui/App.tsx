import { useState, useCallback, useEffect, useRef } from 'react';
import { translate } from '../i18n';
import { AdSlot } from './ads/AdSlot';

import { FlipCard } from './FlipCard';
import { ConsentBanner } from '../components/ConsentBanner';
import { Footer } from '../components/Footer';
import { LegalPage } from '../components/LegalPage';
import { RulesPage } from '../components/RulesPage';
import { Confetti, VictoryWaves } from './Confetti';
import {
  Locale,
  GamePhase,
  GameMode,
  Player,
  PlayerIcon,
  PLAYER_ICONS,
  WORD_DATA,
  THEME_CONFIG,
  getWordsForCategory,
  getSimilarWord
} from '../types';

import { CONFIG } from '../config';

// ============================================
// CONFIGURACIÓN
// ============================================
// Moved to config.ts

// ============================================
// TIPOS
// ============================================
interface GameConfig {
  mode: GameMode;
  topic: string;
  categories: string[]; // Changed from single category to array
  numPlayers: number;
  numImpostors: number;
  impostorClueEnabled: boolean; // Pista (palabra similar) para el impostor
  aiType?: 'suggest' | 'custom';
}

interface LocalGameState {
  players: Player[];
  secretWord: string;
  impostorClue: string; // Palabra similar para el impostor
  currentTurnIndex: number;
  startingPlayerIndex: number;
  winner: 'civils' | 'impostor' | null;
}

// ============================================
// COMPONENTE PRINCIPAL
// ============================================
export function App() {
  const [locale, setLocale] = useState<Locale>('es');
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    if (typeof window !== 'undefined' && window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
      return 'light';
    }
    return 'dark';
  });
  const [phase, setPhase] = useState<GamePhase>('home');
  const [gameType, setGameType] = useState<'local' | 'online'>('local');
  const [config, setConfig] = useState<GameConfig>({
    mode: 'random',
    topic: '',
    categories: ['general'],
    aiType: 'suggest',
    numPlayers: 4,
    numImpostors: 1,
    impostorClueEnabled: true
  });

  // Local game state
  const [players, setPlayers] = useState<Player[]>([]);
  const [localGame, setLocalGame] = useState<LocalGameState | null>(null);
  const [roleRevealed, setRoleRevealed] = useState(false);
  const [selectedVote, setSelectedVote] = useState<string | null>(null);
  const [voteRevealed, setVoteRevealed] = useState(false);

  // Online state
  const [roomCode, setRoomCode] = useState('');
  const [playerId, setPlayerId] = useState<string | null>(null);
  const playerIdRef = useRef<string | null>(null);
  const [wsConnected, setWsConnected] = useState(false);
  const wsRef = useRef<WebSocket | null>(null);
  const [onlineGameState, setOnlineGameState] = useState<{
    secretWord: string | null;
    currentTurn: number;
    phase: 'lobby' | 'playing' | 'hints' | 'vote' | 'results';
    winner: 'civils' | 'impostor' | null;
  } | null>(null);
  const [localSelectedVote, setLocalSelectedVote] = useState<string | null>(null);

  // Online rooms state
  interface PublicRoom {
    code: string;
    playerCount: number;
    maxPlayers: number;
    topic: string;
    name?: string;
  }
  const [publicRooms, setPublicRooms] = useState<PublicRoom[]>([]);
  const [playerName, setPlayerName] = useState('');
  const [joinCode, setJoinCode] = useState('');
  const [onlineTab, setOnlineTab] = useState<'join' | 'create'>('join');
  const [isPublicRoom, setIsPublicRoom] = useState(true);
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [onlineError, setOnlineError] = useState('');
  const [roomName, setRoomName] = useState('');

  // UI state
  const [showIconPicker, setShowIconPicker] = useState<number | null>(null);
  const [showInterstitial, setShowInterstitial] = useState(false);
  const [adCountdown, setAdCountdown] = useState(CONFIG.AD_DURATION);
  const [isLoadingWord, setIsLoadingWord] = useState(false);
  const [generatedAIWord, setGeneratedAIWord] = useState<{ word: string; hint?: string } | null>(null);
  const [hideStickyAd, setHideStickyAd] = useState(() => {
    if (typeof window === 'undefined') return false;
    return sessionStorage.getItem('esimpostor_hide_sticky_ad') === 'true';
  });

  // Legal page state
  const [legalPage, setLegalPage] = useState<'privacy' | 'terms' | 'cookies' | 'legal' | null>(null);
  const [showRules, setShowRules] = useState(false);

  // Admin route (panel de estadísticas)
  const isAdminRoute = typeof window !== 'undefined' && window.location.pathname === '/admin';
  const [adminPin, setAdminPin] = useState('');
  const [adminStats, setAdminStats] = useState<any | null>(null);
  const [adminError, setAdminError] = useState('');
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminClosingRoom, setAdminClosingRoom] = useState<string | null>(null);


  const t = useCallback((key: string, params?: Record<string, string>) =>
    translate(locale, key, params), [locale]);

  const loadAdminStats = async () => {
    setAdminError('');
    if (!adminPin.trim()) {
      setAdminError(t('admin.pinRequired'));
      setAdminStats(null);
      return;
    }
    setAdminLoading(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/api/admin?pin=${encodeURIComponent(adminPin.trim())}`);
      const data = await res.json();
      if (!res.ok) {
        setAdminError(data.error || t('admin.unauthorized'));
        setAdminStats(null);
      } else {
        setAdminStats(data);
      }
    } catch (e) {
      console.error('Error loading admin stats', e);
      setAdminError(t('admin.networkError'));
      setAdminStats(null);
    } finally {
      setAdminLoading(false);
    }
  };

  const adminCloseRoom = async (code: string) => {
    if (!adminPin.trim()) {
      setAdminError(t('admin.pinRequired'));
      return;
    }
    setAdminClosingRoom(code);
    try {
      const res = await fetch(`${CONFIG.API_URL}/api/admin/rooms/${encodeURIComponent(code)}?pin=${encodeURIComponent(adminPin.trim())}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.ok) {
        setAdminError(data.error || 'No se pudo cerrar la sala');
      } else {
        // Recargar stats para reflejar cambios
        await loadAdminStats();
      }
    } catch (e) {
      console.error('Error closing room', e);
      setAdminError(t('admin.networkError'));
    } finally {
      setAdminClosingRoom(null);
    }
  };

  // Función compartida para renderizar la sección de temas
  const renderThemesSection = (onInterstitial?: () => void) => (
    <div className="themes-section" style={{ marginTop: '40px' }}>
      <h2 className="themes-title">
        <span className="themes-icon">🎨</span>
        {t('theme.title')}
      </h2>

      {/* Select móvil */}
      <div className="theme-select-mobile">
        <select
          className="theme-select"
          value={config.mode === 'random' ? 'random' : (config.categories[0] || 'general')}
          onChange={(e) => {
            const value = e.target.value;
            if (value === 'random') {
              setConfig(c => ({ ...c, mode: 'random', categories: [], topic: '' }));
            } else {
              setConfig(c => ({ ...c, mode: 'list', categories: [value], topic: '' }));
            }
          }}
        >
          <option value="random">🎲 {t('theme.random')}</option>
          {THEME_CONFIG.map(themeItem => (
            <option key={themeItem.id} value={themeItem.id}>
              {themeItem.icon} {t(`cat.${themeItem.id}`)}
            </option>
          ))}
        </select>

        {/* Mobile Custom Theme Input */}
        <div className="ai-theme-card-mobile" style={{ marginTop: '12px' }}>
          <div className="ai-theme-header">
            <span className="ai-theme-icon">✨</span>
            <span className="ai-theme-title">{t('theme.custom')}</span>
          </div>
          <div className="ai-theme-input-row">
            <input
              type="text"
              className="ai-theme-input"
              value={config.topic}
              onChange={(e) => {
                const value = e.target.value;
                setConfig((c) => ({
                  ...c,
                  mode: value.trim().length > 0 ? 'ai' : (c.categories.length > 0 ? 'list' : 'random'),
                  categories: value.trim().length > 0 ? [] : c.categories,
                  topic: value,
                }));
              }}
              placeholder={t('theme.custom.placeholder')}
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && config.topic.trim()) {
                  // Asegurar que el modo sea AI
                  setConfig((c) => ({ ...c, mode: 'ai', categories: [], topic: c.topic }));
                  // Mostrar intersticial
                  if (onInterstitial) {
                    onInterstitial();
                  } else {
                    setShowInterstitial(true);
                  }
                }
              }}
            />
            <button
              className="ai-theme-btn"
              disabled={!config.topic.trim()}
              onClick={() => {
                if (!config.topic.trim()) return;
                // Asegurar que el modo sea AI
                setConfig((c) => ({ ...c, mode: 'ai', categories: [], topic: c.topic }));
                // Mostrar intersticial
                if (onInterstitial) {
                  onInterstitial();
                } else {
                  setShowInterstitial(true);
                }
              }}
            >
              {t('theme.custom.send')}
            </button>
          </div>
        </div>
      </div>

      {/* Grid desktop */}
      <div className="theme-grid theme-grid-desktop" style={{ marginBottom: '40px' }}>
        <button
          className={`theme-card ${config.mode === 'random' ? 'selected' : ''}`}
          onClick={() => setConfig(c => ({
            ...c,
            mode: c.mode === 'random' ? 'list' : 'random',
            categories: c.mode === 'random' ? ['general'] : c.categories,
            topic: ''
          }))}
        >
          {config.mode === 'random' && (
            <span className="theme-check">✓</span>
          )}
          <span className="theme-icon">🎲</span>
          <span className="theme-name">
            {t('theme.random')}
          </span>
        </button>

        {THEME_CONFIG.map(themeItem => {
          const isSelected = config.mode === 'list' && config.categories.includes(themeItem.id);
          return (
            <button
              key={themeItem.id}
              className={`theme-card ${isSelected ? 'selected' : ''}`}
              onClick={(e) => {
                e.preventDefault();
                if (config.mode === 'random') {
                  setConfig(c => ({
                    ...c,
                    mode: 'list',
                    categories: [themeItem.id],
                    topic: ''
                  }));
                } else {
                  setConfig(c => {
                    const newCategories = c.categories.includes(themeItem.id)
                      ? (c.categories.length > 1 ? c.categories.filter(cat => cat !== themeItem.id) : c.categories)
                      : [...c.categories, themeItem.id];
                    return { ...c, mode: 'list', categories: newCategories, topic: '' };
                  });
                }
              }}
            >
              {isSelected && <span className="theme-check">✓</span>}
              <span className="theme-icon">{themeItem.icon}</span>
              <span className="theme-name">{t(`cat.${themeItem.id}`)}</span>
            </button>
          );
        })}
        {/* AI Custom Theme */}
        <div className="ai-theme-card">
          <div className="ai-theme-header">
            <span className="ai-theme-icon">✨</span>
            <span className="ai-theme-title">{t('theme.custom')}</span>
          </div>
          <div className="ai-theme-input-row">
            <input
              type="text"
              className="ai-theme-input"
              value={config.topic}
              onChange={(e) => {
                const value = e.target.value;
                setConfig((c) => ({
                  ...c,
                  mode: value.trim().length > 0 ? 'ai' : (c.categories.length > 0 ? 'list' : 'random'),
                  categories: value.trim().length > 0 ? [] : c.categories,
                  topic: value,
                }));
              }}
              placeholder={t('theme.custom.placeholder')}
              maxLength={60}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && config.topic.trim()) {
                  setConfig((c) => ({ ...c, mode: 'ai', categories: [] }));
                  if (onInterstitial) {
                    onInterstitial();
                  } else {
                    setShowInterstitial(true);
                  }
                }
              }}
            />
            <button
              className="ai-theme-btn"
              disabled={!config.topic.trim()}
              onClick={() => {
                if (!config.topic.trim()) return;
                setConfig((c) => ({ ...c, mode: 'ai', categories: [] }));
                if (onInterstitial) {
                  onInterstitial();
                } else {
                  setShowInterstitial(true);
                }
              }}
            >
              {t('theme.custom.send')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================
  // ADS: MEDIR ALTURA DEL STICKY (MÓVIL) PARA NO TAPAR CONTENIDO
  // ============================================
  useEffect(() => {
    const root = document.documentElement;
    if (hideStickyAd) {
      root.style.setProperty('--sticky-ad-height', `0px`);
      return;
    }

    const el = document.querySelector<HTMLElement>('.ad-sticky-mobile');
    if (!el) return;

    const update = () => {
      const h = Math.max(0, el.offsetHeight || 0);
      root.style.setProperty('--sticky-ad-height', `${h}px`);
    };

    update();
    const ro = new ResizeObserver(() => update());
    ro.observe(el);
    window.addEventListener('resize', update, { passive: true });

    return () => {
      ro.disconnect();
      window.removeEventListener('resize', update);
    };
  }, [hideStickyAd]);

  // ============================================
  // FUNCIÓN RESET - VOLVER A HOME
  // ============================================
  const handleGoHome = useCallback(() => {
    setPhase('home');
    setConfig(c => ({ ...c, topic: '', mode: 'random' }));
    setLocalGame(null);
    setPlayers([]);
    setRoleRevealed(false);
    setSelectedVote(null);
    setVoteRevealed(false);
    setRoomCode('');
    setJoinCode('');
    setOnlineError('');
    setPublicRooms([]);
    // Close WS if open
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
    }
  }, []);

  // ============================================
  // INTERSTITIAL CON COUNTDOWN REAL
  // ============================================
  useEffect(() => {
    if (!showInterstitial) return;

    setAdCountdown(CONFIG.AD_DURATION);
    const interval = setInterval(() => {
      setAdCountdown((prev: number) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [showInterstitial]);

  // Resetear palabra generada cuando cambia el tema o modo
  useEffect(() => {
    if (config.mode !== 'ai' || !config.topic.trim()) {
      setGeneratedAIWord(null);
    }
  }, [config.mode, config.topic]);

  // Resetear palabra generada cuando cambia el tema o modo
  useEffect(() => {
    if (config.mode !== 'ai' || !config.topic.trim()) {
      setGeneratedAIWord(null);
    }
  }, [config.mode, config.topic]);

  // ============================================
  // INICIALIZAR JUGADORES
  // ============================================
  const initPlayers = useCallback((num: number) => {
    const newPlayers: Player[] = [];
    for (let i = 0; i < num; i++) {
      newPlayers.push({
        id: `p${i}`,
        name: `Jugador ${i + 1}`,
        icon: PLAYER_ICONS[i % PLAYER_ICONS.length],
        role: 'civil',
        hasSeenRole: false
      });
    }
    setPlayers(newPlayers);
  }, []);

  useEffect(() => {
    if (phase === 'setup' && players.length !== config.numPlayers) {
      initPlayers(config.numPlayers);
    }
  }, [phase, config.numPlayers, players.length, initPlayers]);

  // ============================================
  // GENERAR PALABRA CON IA (GEMINI)
  // ============================================
  const generateWordWithAI = async (): Promise<{ word: string; hint?: string }> => {
    setIsLoadingWord(true);
    try {
      const res = await fetch(`${CONFIG.API_URL}/api/generate-word`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: config.topic,
          category: config.categories[0] || 'general',
          needHint: config.impostorClueEnabled
        })
      });
      const data = await res.json();
      return {
        word: data.word || 'MISTERIO',
        hint: data.hint
      };
    } catch {
      // Fallback local
      const fallback = ['MISTERIO', 'AVENTURA', 'TESORO', 'MAGIA', 'SOMBRA'];
      const word = fallback[Math.floor(Math.random() * fallback.length)];
      return {
        word,
        hint: config.impostorClueEnabled ? 'CONCEPTO' : undefined
      };
    } finally {
      setIsLoadingWord(false);
    }
  };

  // ============================================
  // INICIAR JUEGO LOCAL
  // ============================================
  const startLocalGameWithWord = async (preGeneratedWord?: string, preGeneratedHint?: string) => {
    // Asignar roles aleatoriamente
    const indices = [...Array(players.length).keys()].sort(() => Math.random() - 0.5);
    const impostorIndices = new Set(indices.slice(0, config.numImpostors));

    const playersWithRoles = players.map((p, i) => ({
      ...p,
      role: impostorIndices.has(i) ? 'impostor' : 'civil',
      hasSeenRole: false,
      hint: undefined,
      votedFor: undefined
    })) as Player[];

    // Generar palabra secreta
    let secretWord: string;
    // Obtener lista de palabras combinada de todas las categorías
    let wordList: string[] = [];

    // Si es modo lista, combinamos las categorías seleccionadas
    if (config.mode === 'list') {
      config.categories.forEach(cat => {
        const catWords = getWordsForCategory(cat);
        wordList = [...wordList, ...catWords];
      });
      if (wordList.length === 0) {
        wordList = getWordsForCategory('general'); // Fallback
      }
    } else if (config.mode === 'random') {
      // Modo aleatorio: combinar TODAS las categorías disponibles
      const allCategories = ['general', 'animals', 'food', 'movies', 'sports', 'places', 'professions', 'technology', 'music', 'history', 'nature', 'fantasy'];
      allCategories.forEach(cat => {
        const catWords = getWordsForCategory(cat);
        wordList = [...wordList, ...catWords];
      });
      if (wordList.length === 0) {
        wordList = getWordsForCategory('general'); // Fallback
      }
    } else {
      // Modo AI (si llegamos aquí sin palabra, usamos fallback general)
      wordList = getWordsForCategory('general');
    }

    // Fallback por seguridad
    if (wordList.length === 0) wordList = ['MISTERIO'];

    let impostorClue: string;

    if (config.mode === 'ai') {
      // Si ya tenemos una palabra pre-generada, usarla
      if (preGeneratedWord) {
        secretWord = preGeneratedWord;
        // Si tenemos una pista pre-generada, usarla; si no, generar una
        if (preGeneratedHint) {
          impostorClue = preGeneratedHint;
        } else if (config.impostorClueEnabled) {
          // Si la pista está habilitada pero no se generó, intentar generar con IA
          try {
            const aiResult = await generateWordWithAI();
            impostorClue = aiResult.hint || getSimilarWord('general', secretWord);
          } catch (e) {
            const clueContext = config.categories[0] || 'general';
            impostorClue = getSimilarWord(clueContext, secretWord);
          }
        } else {
          const clueContext = config.categories[0] || 'general';
          impostorClue = getSimilarWord(clueContext, secretWord);
        }
      } else {
        // Intentar generar con IA
        try {
          const aiResult = await generateWordWithAI();
          secretWord = aiResult.word;
          // Si la pista está habilitada y se generó, usarla
          if (config.impostorClueEnabled && aiResult.hint) {
            impostorClue = aiResult.hint;
          } else {
            const clueContext = config.categories[0] || 'general';
            impostorClue = getSimilarWord(clueContext, secretWord);
          }
        } catch (e) {
          console.error('AI Error', e);
          secretWord = wordList[Math.floor(Math.random() * wordList.length)];
          const clueContext = config.categories[0] || 'general';
          impostorClue = getSimilarWord(clueContext, secretWord);
        }
      }
    } else {
      // Modo lista: elegir aleatoriamente de la lista combinada
      secretWord = wordList[Math.floor(Math.random() * wordList.length)];
      // Generar palabra similar para el impostor
      const clueContext = config.categories[0] || 'general';
      impostorClue = getSimilarWord(clueContext, secretWord);
    }

    // INICIO ALEATORIO - no siempre jugador 1
    const startingPlayerIndex = Math.floor(Math.random() * players.length);

    setPlayers(playersWithRoles);
    setLocalGame({
      players: playersWithRoles,
      secretWord,
      impostorClue,
      currentTurnIndex: startingPlayerIndex,
      startingPlayerIndex,
      winner: null
    });
    setRoleRevealed(false);
    setPhase('turn-reveal');
    setShowInterstitial(false);
  };

  // Wrapper para mantener compatibilidad
  const startLocalGame = async () => {
    return startLocalGameWithWord();
  };

  const handleInterstitialComplete = async () => {
    if (adCountdown > 0 || isLoadingWord) return;

    // Si estamos en modo AI, generar la palabra ANTES de cerrar el intersticial
    if (config.mode === 'ai' && config.topic.trim()) {
      // Mantener el intersticial abierto y mostrar loading
      setIsLoadingWord(true);

      try {
        // Generar palabra con IA (esto puede tardar)
        const aiResult = await generateWordWithAI();

        if (aiResult && aiResult.word) {
          // Guardar la palabra y pista generadas
          setGeneratedAIWord(aiResult);
          // Cerrar intersticial
          setShowInterstitial(false);
          setIsLoadingWord(false);

          // Si estamos en setup, ir a players
          if (phase === 'setup') {
            if (players.length !== config.numPlayers) {
              initPlayers(config.numPlayers);
            }
            setPhase('setup-players');
          } else if (phase === 'online-setup') {
            if (!playerName.trim()) {
              setOnlineError(t('online.yourName'));
              return;
            }
            await createOnlineRoom(isPublicRoom);
          } else {
            // Iniciar juego directamente con la palabra ya generada
            await startLocalGameWithWord(aiResult.word, aiResult.hint);
          }
        } else {
          // Si no se generó palabra, usar fallback
          setIsLoadingWord(false);
          setShowInterstitial(false);
          if (phase === 'setup') {
            if (players.length !== config.numPlayers) {
              initPlayers(config.numPlayers);
            }
            setPhase('setup-players');
          } else if (phase === 'online-setup') {
            if (!playerName.trim()) {
              setOnlineError(t('online.yourName'));
              return;
            }
            await createOnlineRoom(isPublicRoom);
          } else {
            await startLocalGame();
          }
        }
      } catch (e) {
        console.error('Error generating word:', e);
        setIsLoadingWord(false);
        // En caso de error, continuar con fallback
        setShowInterstitial(false);
        if (phase === 'setup') {
          if (players.length !== config.numPlayers) {
            initPlayers(config.numPlayers);
          }
          setPhase('setup-players');
        } else if (phase === 'online-setup') {
          if (!playerName.trim()) {
            setOnlineError(t('online.yourName'));
            return;
          }
          await createOnlineRoom(isPublicRoom);
        } else {
          await startLocalGame();
        }
      }
    } else {
      // Modo lista o random: cerrar intersticial y continuar normalmente
      setShowInterstitial(false);

      if (phase === 'setup') {
        if (players.length !== config.numPlayers) {
          initPlayers(config.numPlayers);
        }
        setPhase('setup-players');
      } else if (phase === 'online-setup') {
        if (!playerName.trim()) {
          setOnlineError(t('online.yourName'));
          return;
        }
        await createOnlineRoom(isPublicRoom);
      } else {
        await startLocalGame();
      }
    }
  };

  const handleStartGame = async () => {
    // Si tenemos una palabra generada con IA, usarla
    if (config.mode === 'ai' && generatedAIWord) {
      await startLocalGameWithWord(generatedAIWord.word, generatedAIWord.hint);
      // Limpiar la palabra generada después de usarla
      setGeneratedAIWord(null);
    } else {
      // Modo lista o random: iniciar juego normalmente
      await startLocalGame();
    }
  };

  // ============================================
  // FLUJO DE JUEGO LOCAL
  // ============================================
  const handleRevealRole = () => setRoleRevealed(true);

  // Función para obtener el siguiente índice circular
  const getNextIndex = (currentIdx: number, totalPlayers: number, startIdx: number): number | null => {
    const nextIdx = (currentIdx + 1) % totalPlayers;
    // Si volvemos al inicio, hemos dado la vuelta completa
    if (nextIdx === startIdx) return null;
    return nextIdx;
  };

  // Contar cuántos jugadores han visto su rol
  const countPlayersWhoSawRole = () => {
    return players.filter(p => p.hasSeenRole).length;
  };

  const handleNextTurn = () => {
    if (!localGame) return;

    const updated = [...players];
    updated[localGame.currentTurnIndex] = { ...updated[localGame.currentTurnIndex], hasSeenRole: true };
    setPlayers(updated);

    const seenCount = countPlayersWhoSawRole() + 1; // +1 porque acabamos de marcar este

    if (seenCount < players.length) {
      // Siguiente jugador
      const nextIdx = (localGame.currentTurnIndex + 1) % players.length;
      setLocalGame(prev => prev ? { ...prev, currentTurnIndex: nextIdx } : null);
      setRoleRevealed(false);
    } else {
      // Todos han visto su rol - ir a discusión (sin votación manual)
      setPhase('discussion');
    }
  };

  // Contar cuántos jugadores han votado
  const countPlayersWhoVoted = () => {
    return players.filter(p => p.votedFor).length;
  };

  const handleConfirmVote = () => {
    if (!localGame || !selectedVote) return;

    const updated = [...players];
    updated[localGame.currentTurnIndex] = { ...updated[localGame.currentTurnIndex], votedFor: selectedVote };
    setPlayers(updated);
    setSelectedVote(null);
    setVoteRevealed(false);

    const votesCount = countPlayersWhoVoted() + 1; // +1 porque acabamos de votar

    if (votesCount < players.length) {
      const nextIdx = (localGame.currentTurnIndex + 1) % players.length;
      setLocalGame(prev => prev ? { ...prev, currentTurnIndex: nextIdx } : null);
    } else {
      // Calcular ganador
      const votes: Record<string, number> = {};
      updated.forEach(p => {
        if (p.votedFor) votes[p.votedFor] = (votes[p.votedFor] || 0) + 1;
      });
      const maxVotes = Math.max(...Object.values(votes), 0);
      const mostVoted = Object.entries(votes).filter(([, v]) => v === maxVotes).map(([k]) => k);
      const impostors = updated.filter(p => p.role === 'impostor');
      const allImpostorsVoted = impostors.every(imp => mostVoted.includes(imp.id));
      const winner = allImpostorsVoted ? 'civils' : 'impostor';

      setLocalGame(prev => prev ? { ...prev, winner } : null);
      setPhase('results');
    }
  };

  const handlePlayAgain = () => {
    setPhase('setup');
    setLocalGame(null);
    initPlayers(config.numPlayers);
  };

  // ============================================
  // ONLINE: FUNCIONES DE SALAS
  // ============================================
  const loadPublicRooms = async () => {
    try {
      const res = await fetch(`${CONFIG.API_URL}/api/rooms/public`);
      const data = await res.json();
      setPublicRooms(data.rooms || []);
    } catch (e) {
      console.error('Error loading rooms:', e);
      setPublicRooms([]);
    }
  };

  const createOnlineRoom = async (isPublic: boolean) => {
    if (!playerName.trim()) {
      setOnlineError('Introduce tu nombre');
      return;
    }
  if (!roomName.trim()) {
    setOnlineError(t('online.roomNameRequired') || 'Pon un nombre a la sala');
    return;
  }
    if (config.numPlayers < 3) {
      setOnlineError(t('setup.minPlayers'));
      return;
    }
    setIsCreatingRoom(true);
    setOnlineError('');

    try {
      const res = await fetch(`${CONFIG.API_URL}/api/rooms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          config: {
            mode: config.mode,
            topic: config.topic,
            category: config.categories[0] || 'general',
            numImpostors: config.numImpostors,
            numPlayers: config.numPlayers,
            impostorClueEnabled: config.impostorClueEnabled,
            isPublic,
            roomName: roomName.trim()
          }
        })
      });
      const data = await res.json();
      if (data.code) {
        // El creador debe unirse para obtener un playerId real en la sala
        await joinOnlineRoom(data.code);
      } else {
        setOnlineError('Error creando sala');
      }
    } catch (e) {
      console.error('Error creating room:', e);
      setOnlineError('Error de conexión');
    } finally {
      setIsCreatingRoom(false);
    }
  };

  const joinOnlineRoom = async (code: string) => {
    if (!playerName.trim()) {
      setOnlineError('Introduce tu nombre');
      return;
    }
    if (!code || code.length < 4) {
      setOnlineError('Código inválido');
      return;
    }
    setOnlineError('');

    try {
      const res = await fetch(`${CONFIG.API_URL}/api/rooms/${code.toUpperCase()}/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ player: { name: playerName, icon: '🦊' } })
      });
      const data = await res.json();
      if (data.playerId) {
        setRoomCode(code.toUpperCase());
        setPlayerId(data.playerId);
        connectToRoom(code.toUpperCase(), data.playerId);
        setPhase('lobby');
      } else {
        setOnlineError(data.error || 'No se pudo unir');
      }
    } catch {
      setOnlineError('Sala no encontrada');
    }
  };

  useEffect(() => {
    // Recargar salas públicas cada 5 segundos cuando estamos en online-setup
    if (phase === 'online-setup') {
      loadPublicRooms();
      const interval = setInterval(loadPublicRooms, 8000);
      return () => clearInterval(interval);
    }
  }, [phase]);

  useEffect(() => {
    playerIdRef.current = playerId;
  }, [playerId]);

  const connectToRoom = (code: string, explicitPlayerId?: string) => {
    if (wsRef.current) wsRef.current.close();

    // Determine WS Protocol
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const host = CONFIG.API_URL.replace(/^https?:\/\//, '');
    const wsUrl = `${protocol}//${host}/api/rooms/${code}/ws`;

    console.log('Connecting to:', wsUrl); // Debug

    const ws = new WebSocket(wsUrl);
    wsRef.current = ws;

    ws.onopen = () => {
      console.log('WS Connected');
      setWsConnected(true);
      const effectivePlayerId = explicitPlayerId || playerIdRef.current;
      if (!effectivePlayerId) {
        setOnlineError('No se pudo conectar a la sala');
        try { ws.close(); } catch { /* noop */ }
        return;
      }
      ws.send(JSON.stringify({ type: 'connect', playerId: effectivePlayerId }));
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('WS Message:', data);

      if (data.type === 'state' || data.type === 'game-started' || data.type === 'player-joined' || data.type === 'player-connected' || data.type === 'player-disconnected') {
        const roomState = data.state || data;

        // Actualizar estado del juego online
        setOnlineGameState({
          secretWord: roomState.secretWord || null,
          currentTurn: roomState.currentTurn || 0,
          phase: roomState.phase || 'lobby',
          winner: roomState.winner || null
        });

        // Actualizar jugadores
        if (roomState.players) {
          setPlayers(roomState.players.map((p: any) => ({
            id: p.id,
            name: p.name || 'Anonymous',
            icon: p.icon || '👤',
            role: p.role || 'civil',
            hasSeenRole: p.role ? true : false, // Si tiene rol, ya lo vio
            hint: p.hint,
            votedFor: p.votedFor
          })));
        }

        // Actualizar fase según el estado del servidor
        if (roomState.phase === 'lobby') {
          setPhase('lobby');
        } else if (roomState.phase === 'hints' || roomState.phase === 'playing') {
          setPhase('online-hints');
        } else if (roomState.phase === 'vote') {
          setPhase('online-vote');
        } else if (roomState.phase === 'results') {
          setPhase('online-results');
        }
      }
    };

    ws.onclose = () => setWsConnected(false);
  };

  // ============================================
  // HELPERS
  // ============================================
  const updatePlayerName = (i: number, name: string) => {
    const updated = [...players];
    updated[i].name = name;
    setPlayers(updated);
  };

  const updatePlayerIcon = (i: number, icon: string) => {
    const updated = [...players];
    updated[i].icon = icon as PlayerIcon;
    setPlayers(updated);
    setShowIconPicker(null);
  };

  const usedIcons = new Set(players.map(p => p.icon));
  const currentPlayer = localGame ? players[localGame.currentTurnIndex] : null;

  // ============================================
  // RENDER
  // ============================================
  return (
    <div className={`app-shell ${theme}`} data-theme={theme}>
      <ConsentBanner locale={locale} />

      {/* Header */}
      <header className="app-header">
        <div className="app-header-inner">
          <div className="brand" onClick={handleGoHome} style={{ cursor: 'pointer' }}>
            <div className="brand-logo">🎭</div>
            <div className="brand-text">
              <div className="brand-name">És Impostor</div>
              <div className="brand-tagline">{t('brand.subtitle')}</div>
            </div>
          </div>
          {/* Controles en desktop */}
          <div className="header-actions header-actions-desktop">
            {/* Toggle Tema Animado */}
            <div
              className="toggle-container"
              data-state={theme === 'dark' ? 'right' : 'left'}
              onClick={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
              title="Cambiar tema"
              role="group"
              aria-label="Cambiar tema claro u oscuro"
            >
              <div className="toggle-slider" />

              <button
                className={`toggle-option ${theme === 'light' ? 'active' : ''}`}
                type="button"
                aria-label="Tema claro"
              >
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="5" />
                  <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                </svg>
              </button>
              <button
                className={`toggle-option ${theme === 'dark' ? 'active' : ''}`}
                type="button"
                aria-label="Tema oscuro"
              >
                <svg className="theme-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                </svg>
              </button>
            </div>

            {/* Toggle Idioma Animado */}
            <div
              className="toggle-container"
              data-state={locale === 'ca' ? 'right' : 'left'}
              onClick={() => setLocale(prev => prev === 'es' ? 'ca' : 'es')}
              title="Cambiar idioma"
              role="group"
              aria-label="Cambiar idioma entre español y catalán"
            >
              <div className="toggle-slider" />

              <button
                className={`toggle-option font-bold ${locale === 'es' ? 'active' : ''}`}
                type="button"
                aria-label="Idioma español"
              >
                ES
              </button>
              <button
                className={`toggle-option font-bold ${locale === 'ca' ? 'active' : ''}`}
                type="button"
                aria-label="Idioma catalán"
              >
                CA
              </button>
            </div>
          </div>

        </div>
      </header>

      {/* Content */}
      <div className="app-content">
        <div className="main-layout">
          {/* Ad Sidebar IZQUIERDO */}
          <aside className="ad-sidebar">
            {[0].map((i) => (
              <AdSlot
                // Reutilizamos el mismo slot; AdSense decide el relleno
                key={i}
                client={CONFIG.ADSENSE_CLIENT}
                slot={CONFIG.ADSENSE_SLOTS.sidebarLeft}
                format="vertical"
                label={t('ads.sidebar')}
              />
            ))}
          </aside>

          {/* Game Area - CENTRO */}
          <main className="game-area">
            <div className="game-card">
              <div className="game-card-content">

                {/* ========== ADMIN PANEL (/admin) ========== */}
                {isAdminRoute && (
                  <div className="screen screen-scroll fade-in">
                    <div className="setup-container">
                      <div className="setup-header">
                        <div className="setup-title-area">
                          <h1 className="setup-title">{t('admin.title')}</h1>
                        </div>
                      </div>

                      <div className="config-card-wide">
                        <div className="config-card-glow name" />
                        <div className="setup-title-area" style={{ marginBottom: '8px' }}>
                          <span className="config-card-icon" style={{ fontSize: '24px' }}>🔑</span>
                          <h3 style={{ margin: 0, fontSize: '18px' }}>{t('admin.pinLabel')}</h3>
                        </div>
                        <div className="online-join-row">
                          <input
                            type="password"
                            className="online-input"
                            value={adminPin}
                            onChange={(e) => setAdminPin(e.target.value)}
                            placeholder={t('admin.pinPlaceholder')}
                            maxLength={12}
                          />
                          <button
                            className="online-join-btn"
                            onClick={loadAdminStats}
                            disabled={adminLoading}
                          >
                            {adminLoading ? '...' : t('admin.view')}
                          </button>
                        </div>
                      </div>

                      {adminError && (
                        <div className="online-error" style={{ marginTop: '12px' }}>
                          <span className="error-icon">⚠️</span>
                          <span>{adminError}</span>
                        </div>
                      )}

                      {adminStats && (
                        <div className="config-card-wide" style={{ marginTop: '20px' }}>
                          <div className="config-card-glow join" />
                          <div className="setup-title-area" style={{ marginBottom: '8px' }}>
                            <span className="config-card-icon" style={{ fontSize: '24px' }}>📊</span>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>{t('admin.statsTitle')}</h3>
                          </div>
                          <ul style={{ listStyle: 'none', padding: 0, margin: '8px 0', display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '14px' }}>
                            <li>{t('admin.totalRooms')}: <strong>{adminStats.totalRoomsCreated}</strong></li>
                            <li>{t('admin.publicRooms')}: <strong>{adminStats.publicRooms}</strong></li>
                            <li>
                              {t('admin.geminiCalls')}:&nbsp;
                              <strong>
                                {adminStats.geminiWindowCount ?? adminStats.totalGeminiCalls}
                                {adminStats.geminiDailyLimit
                                  ? ` / ${adminStats.geminiDailyLimit} (${adminStats.geminiUsagePct ?? Math.round(((adminStats.geminiWindowCount ?? 0) / adminStats.geminiDailyLimit) * 100)}%)`
                                  : ''}
                              </strong>
                            </li>
                          </ul>
                          <div style={{ marginTop: '8px', fontSize: '12px', opacity: 0.7 }}>
                            {t('admin.lastUpdate')}: {new Date(adminStats.timestamp).toLocaleTimeString()}
                          </div>
                          {adminStats.geminiNearLimit && (
                            <div style={{ marginTop: '8px', fontSize: '12px', color: 'var(--color-warning)' }}>
                              {t('admin.geminiNearLimit')}
                            </div>
                          )}
                          {adminStats.publicRoomsDetail && adminStats.publicRoomsDetail.length > 0 && (
                            <div style={{ marginTop: '16px' }}>
                              <h4 style={{ margin: '0 0 8px', fontSize: '14px' }}>{t('admin.publicRoomsList')}</h4>
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '220px', overflowY: 'auto' }}>
                                {adminStats.publicRoomsDetail.map((room: any) => (
                                  <div
                                    key={room.code}
                                    style={{
                                      padding: '8px 10px',
                                      borderRadius: '10px',
                                      border: '1px solid var(--color-border)',
                                      background: 'var(--color-bg-element)',
                                      display: 'flex',
                                      flexDirection: 'column',
                                      gap: '4px',
                                      fontSize: '12px'
                                    }}
                                  >
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                        {t('admin.code')}: {room.code}
                                      </span>
                                      <span>
                                        {t('admin.players')}: {room.playerCount}/{room.maxPlayers}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                      <span>{t('admin.name')}: {room.name || '-'}</span>
                                      <span>
                                        {t('admin.topic')}: {room.topic}
                                      </span>
                                    </div>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', opacity: 0.8 }}>
                                      <span>
                                        {t('admin.ageMinutes')}: {Math.floor((Date.now() - room.createdAt) / 60000)} min
                                      </span>
                                      <button
                                        type="button"
                                        className="btn btn-ghost"
                                        style={{ fontSize: '11px', padding: '4px 8px' }}
                                        onClick={() => adminCloseRoom(room.code)}
                                        disabled={adminClosingRoom === room.code}
                                      >
                                        {adminClosingRoom === room.code ? t('admin.closing') : t('admin.closeRoom')}
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {!isAdminRoute && (
                  <>
                {/* ========== HOME ========== */}
                {phase === 'home' && (
                  <div className="screen fade-in">
                    <div className="home-hero">
                      <div className="screen-icon">🎭</div>
                      <h1 className="home-title">{t('home.title')}</h1>
                      <p className="home-subtitle">{t('home.subtitle')}</p>

                      <div className="home-buttons">
                        <button
                          className="home-btn-3d home-btn-local"
                          onClick={() => {
                            setGameType('local');
                            initPlayers(config.numPlayers);
                            setPhase('setup');
                          }}
                        >
                          <span className="btn-icon-3d">📱</span>
                          {t('home.localGame')}
                        </button>
                        <button
                          className="home-btn-3d home-btn-online"
                          onClick={() => {
                            setGameType('online');
                            setPhase('online-setup');
                            loadPublicRooms();
                          }}
                        >
                          <span className="btn-icon-3d">🌐</span>
                          {t('home.onlineGame')}
                        </button>
                        <button
                          className="home-btn-3d home-btn-rules"
                          onClick={() => setShowRules(true)}
                        >
                          <span className="btn-icon-3d">📖</span>
                          {t('rules.button')}
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========== ONLINE SETUP - SELECCIÓN DE SALAS ========== */}
                {phase === 'online-setup' && (
                  <div className="screen screen-scroll fade-in">
                    <div className="setup-container">
                      {/* Header */}
                      <div className="setup-header">
                        <button className="btn-back-glow" onClick={handleGoHome}>←</button>
                        <div className="setup-title-area">
                          <h1 className="setup-title">{t('online.title')}</h1>
                        </div>
                      </div>

                      {onlineError && (
                        <div className="online-error">
                          <span className="error-icon">⚠️</span>
                          <span>{onlineError}</span>
                        </div>
                      )}

                      {/* Your Name */}
                      <div className="config-card-wide">
                        <div className="config-card-glow name" />
                        <div className="setup-title-area" style={{ marginBottom: '8px' }}>
                          <span className="config-card-icon" style={{ fontSize: '24px' }}>👤</span>
                          <h3 style={{ margin: 0, fontSize: '18px' }}>{t('online.yourName')}</h3>
                        </div>
                        <input
                          id="online-name-input"
                          type="text"
                          className="online-input"
                          value={playerName}
                          onChange={(e) => setPlayerName(e.target.value)}
                          placeholder={t('online.namePlaceholder')}
                          maxLength={20}
                        />
                      </div>

                      {/* Tab Switcher */}
                      <div className="online-tabs">
                        <button
                          className={`online-tab ${onlineTab === 'join' ? 'active' : ''}`}
                          onClick={() => { setOnlineTab('join'); loadPublicRooms(); }}
                        >
                          <span className="tab-icon">🔑</span>
                          {t('online.joinRoom')}
                        </button>
                        <button
                          className={`online-tab ${onlineTab === 'create' ? 'active' : ''}`}
                          onClick={() => setOnlineTab('create')}
                        >
                          <span className="tab-icon">✨</span>
                          {t('online.createRoom')}
                        </button>
                      </div>

                      {/* Tab Content: JOIN */}
                      {onlineTab === 'join' && (
                        <div className="tab-content fade-in">
                          {/* Join by Code */}
                          <div className="config-card-wide">
                            <div className="config-card-glow join" />
                            <div className="setup-title-area" style={{ marginBottom: '8px' }}>
                              <span className="config-card-icon" style={{ fontSize: '24px' }}>🔑</span>
                              <h3 style={{ margin: 0, fontSize: '18px' }}>{t('online.joinRoom')}</h3>
                            </div>
                            <div className="online-join-row">
                              <input
                                type="text"
                                className="online-code-input"
                                value={joinCode}
                                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                                placeholder="ABCD"
                                maxLength={6}
                              />
                              <button
                                className="online-join-btn"
                                onClick={() => joinCode && joinOnlineRoom(joinCode)}
                                disabled={!joinCode || joinCode.length < 4 || !playerName.trim()}
                              >
                                {t('online.join')}
                              </button>
                            </div>
                          </div>

                          {/* Public Rooms List */}
                            <div className="public-rooms-section" style={{ marginTop: '40px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px', position: 'relative' }}>
                              <h2 className="themes-title" style={{ margin: 0, textAlign: 'center' }}>
                                <span className="themes-icon">🌍</span>
                                {t('online.publicRooms')}
                              </h2>
                              <button
                                type="button"
                                className="rooms-refresh-btn"
                                onClick={loadPublicRooms}
                                title={t('online.refresh') || 'Actualizar'}
                              >
                                ↻
                              </button>
                            </div>

                            <div className="rooms-grid">
                              {publicRooms.length > 0 ? (
                                publicRooms.map(room => (
                                  <button
                                    key={room.code}
                                    className="room-card-premium"
                                    onClick={() => !playerName.trim() ? setOnlineError(t('online.yourName')) : joinOnlineRoom(room.code)}
                                  >
                                    <div className="room-info">
                                      <span className="room-code">{room.code}</span>
                                      <div className="room-meta">
                                        <span className="room-name">{room.name || t('online.unnamedRoom')}</span>
                                        <span className="room-players">
                                          <span className="room-icon">👥</span>
                                          {room.playerCount}/{room.maxPlayers}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="room-topic-area">
                                      <span className="room-topic-label">{t('theme.title')}:</span>
                                      <span className="room-topic">{room.topic || t('theme.random')}</span>
                                    </div>
                                    <div className="room-join-hint">{t('online.join')}</div>
                                  </button>
                                ))
                              ) : (
                                <div className="no-rooms">
                                  <p>{t('online.noRooms')}</p>
                                  <p className="text-sm opacity-60">{t('online.createOne')}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Tab Content: CREATE */}
                      {onlineTab === 'create' && (
                        <div className="tab-content fade-in">
                          {/* Room name */}
                          <div className="config-card-wide" style={{ marginBottom: '16px' }}>
                            <div className="config-card-glow name" />
                            <div className="setup-title-area" style={{ marginBottom: '8px' }}>
                              <span className="config-card-icon" style={{ fontSize: '24px' }}>🏷️</span>
                              <h3 style={{ margin: 0, fontSize: '18px' }}>{t('online.roomName')}</h3>
                            </div>
                            <input
                              type="text"
                              className="online-input"
                              value={roomName}
                              onChange={(e) => setRoomName(e.target.value)}
                              placeholder={t('online.roomNamePlaceholder')}
                              maxLength={24}
                            />
                          </div>

                          <div className="config-row-online">
                            {/* Players */}
                            <div className="config-card-premium">
                              <div className="config-card-glow players" />
                              <span className="config-card-icon">👥</span>
                              <span className="config-card-label">{t('setup.numPlayers')}</span>
                              <div className="number-selector-premium">
                                <button className="num-btn minus" onClick={() => setConfig(c => ({ ...c, numPlayers: Math.max(3, c.numPlayers - 1), numImpostors: Math.min(c.numImpostors, Math.max(3, c.numPlayers - 1) - 1) }))} disabled={config.numPlayers <= 3}>−</button>
                                <span className="num-value">{config.numPlayers}</span>
                                <button className="num-btn plus" onClick={() => setConfig(c => ({ ...c, numPlayers: Math.min(12, c.numPlayers + 1) }))} disabled={config.numPlayers >= 12}>+</button>
                              </div>
                            </div>

                            {/* Impostores */}
                            <div className="config-card-premium">
                              <div className="config-card-glow impostors" />
                              <span className="config-card-icon">🎭</span>
                              <span className="config-card-label">{t('setup.numImpostors')}</span>
                              <div className="number-selector-premium">
                                <button className="num-btn minus" onClick={() => setConfig(c => ({ ...c, numImpostors: Math.max(1, c.numImpostors - 1) }))} disabled={config.numImpostors <= 1}>−</button>
                                <span className="num-value">{config.numImpostors}</span>
                                <button className="num-btn plus" onClick={() => setConfig(c => ({ ...c, numImpostors: Math.min(config.numPlayers - 1, config.numImpostors + 1) }))} disabled={config.numImpostors >= config.numPlayers - 1}>+</button>
                              </div>
                            </div>

                            {/* Pista Toggle (Horizontal Card) */}
                            <div className="config-card-premium">
                              <div className="config-card-glow clue" />
                              <span className="config-card-icon">💡</span>
                              <span className="config-card-label">{t('setup.clue')}</span>
                              <button
                                className={`toggle-premium ${config.impostorClueEnabled ? 'active' : ''}`}
                                onClick={() => setConfig(c => ({ ...c, impostorClueEnabled: !c.impostorClueEnabled }))}
                              />
                            </div>

                            {/* Public Toggle (Horizontal Card) */}
                            <div className="config-card-premium">
                              <div className="config-card-glow create" />
                              <span className="config-card-icon">🌍</span>
                              <span className="config-card-label">{t('online.makePublic')}</span>
                              <button
                                className={`toggle-premium ${isPublicRoom ? 'active' : ''}`}
                                onClick={() => setIsPublicRoom(!isPublicRoom)}
                              />
                            </div>
                          </div>

                          {/* Themes Section */}
                          {renderThemesSection()}

                          {/* Create Button */}
                          <button
                            className="setup-next-btn"
                            onClick={() => {
                              if (!playerName.trim()) {
                                setOnlineError(t('online.yourName'));
                                const nameInput = document.getElementById('online-name-input');
                                if (nameInput) {
                                  nameInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                                  (nameInput as HTMLInputElement).focus();
                                }
                                return;
                              }
                              if (!roomName.trim()) {
                                setOnlineError(t('online.roomNameRequired'));
                                return;
                              }
                              createOnlineRoom(isPublicRoom);
                            }}
                            disabled={isCreatingRoom}
                          >
                            {isCreatingRoom ? (
                              <><span className="spinner">⏳</span> {t('online.creating')}</>
                            ) : (
                              <><span>{t('online.createRoom')}</span> <span className="btn-arrow">→</span></>
                            )}
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* ========== SETUP ========== */}
                {phase === 'setup' && gameType === 'local' && (
                  <div className="screen screen-scroll fade-in">
                    <div className="setup-container">
                      {/* Header */}
                      <div className="setup-header">
                        <button className="btn-back-glow" onClick={handleGoHome}>←</button>
                        <div className="setup-title-area">
                          <h1 className="setup-title">{t('setup.title')}</h1>
                        </div>
                      </div>

                      <div style={{ width: '100%' }}>
                        {/* Config Cards Row */}
                        <div className="config-grid-local">
                          {/* Jugadores */}
                          <div className="config-card-premium">
                            <div className="config-card-glow players" />
                            <span className="config-card-icon">👥</span>
                            <span className="config-card-label">{t('setup.numPlayers')}</span>
                            <div className="number-selector-premium">
                              <button className="num-btn minus" onClick={() => setConfig(c => ({ ...c, numPlayers: Math.max(3, c.numPlayers - 1), numImpostors: Math.min(c.numImpostors, Math.max(3, c.numPlayers - 1) - 1) }))} disabled={config.numPlayers <= 3}>−</button>
                              <span className="num-value">{config.numPlayers}</span>
                              <button className="num-btn plus" onClick={() => setConfig(c => ({ ...c, numPlayers: Math.min(12, c.numPlayers + 1) }))} disabled={config.numPlayers >= 12}>+</button>
                            </div>
                          </div>

                          {/* Impostores */}
                          <div className="config-card-premium">
                            <div className="config-card-glow impostors" />
                            <span className="config-card-icon">🎭</span>
                            <span className="config-card-label">{t('setup.numImpostors')}</span>
                            <div className="number-selector-premium">
                              <button className="num-btn minus" onClick={() => setConfig(c => ({ ...c, numImpostors: Math.max(1, c.numImpostors - 1) }))} disabled={config.numImpostors <= 1}>−</button>
                              <span className="num-value">{config.numImpostors}</span>
                              <button className="num-btn plus" onClick={() => setConfig(c => ({ ...c, numImpostors: Math.min(config.numPlayers - 1, config.numImpostors + 1) }))} disabled={config.numImpostors >= config.numPlayers - 1}>+</button>
                            </div>
                          </div>

                          {/* Pista */}
                          <div className="config-card-premium clue-card">
                            <div className="config-card-glow clue" />
                            <span className="config-card-icon">💡</span>
                            <span className="config-card-label">{t('setup.clue')}</span>
                            <button
                              className={`toggle-premium ${config.impostorClueEnabled ? 'active' : ''}`}
                              onClick={() => setConfig(c => ({ ...c, impostorClueEnabled: !c.impostorClueEnabled }))}
                            />
                          </div>
                        </div>

                        {/* Themes Section */}
                        {renderThemesSection()}

                        {/* Bottom Action */}
                        <button className="setup-next-btn" onClick={() => {
                          if (players.length !== config.numPlayers) {
                            initPlayers(config.numPlayers);
                          }
                          setPhase('setup-players');
                        }}>
                          <span>{t('setup.next')}</span>
                          <span className="btn-arrow">→</span>
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ========== SETUP PLAYERS (NOMBRES) ========== */}
                {phase === 'setup-players' && (
                  <div className="screen screen-scroll fade-in">
                    <div className="setup-container">
                      {/* Header */}
                      <div className="setup-header">
                        <button className="btn-back-glow" onClick={() => setPhase('setup')}>←</button>
                        <div className="setup-title-area">
                          <h1 className="setup-title">{t('setup.players')}</h1>
                        </div>
                      </div>

                      {/* Lista de jugadores */}
                      <div className="players-grid-premium">
                        {players.map((p, i) => (
                          <div key={p.id} className="player-card-premium">
                            <button
                              className="player-icon-premium"
                              onClick={() => {
                                const icons = [...PLAYER_ICONS] as unknown as string[];
                                const usedByOthers = new Set(
                                  players.filter((_, idx) => idx !== i).map(pl => pl.icon)
                                );
                                const currentIdx = Math.max(0, icons.indexOf(p.icon));

                                let nextIcon = p.icon;
                                for (let step = 1; step <= icons.length; step++) {
                                  const candidate = icons[(currentIdx + step) % icons.length];
                                  if (!usedByOthers.has(candidate as PlayerIcon)) {
                                    nextIcon = candidate as PlayerIcon;
                                    break;
                                  }
                                }

                                updatePlayerIcon(i, nextIcon);
                              }}
                            >
                              {p.icon}
                            </button>
                            <input
                              className="player-name-premium"
                              value={p.name}
                              onChange={(e) => updatePlayerName(i, e.target.value)}
                              placeholder={`${t('setup.player')} ${i + 1}`}
                              maxLength={12}
                            />
                          </div>
                        ))}
                      </div>

                      {/* Bottom Action */}
                      <button
                        className="setup-next-btn start-btn"
                        onClick={handleStartGame}
                        disabled={players.length < 3 || players.some(p => !p.name.trim()) || isLoadingWord}
                      >
                        <span>{isLoadingWord ? '...' : (players.length < 3 ? t('setup.minPlayers') : t('setup.start'))}</span>
                      </button>
                    </div>
                  </div>
                )}

                {/* ========== LOBBY (ONLINE) ========== */}
                {phase === 'lobby' && (
                  <div className="screen screen-scroll fade-in">
                    <div className="lobby-header">
                      <p className="text-soft text-sm uppercase tracking-wider">{t('lobby.roomCode')}</p>
                      <div className="room-code-display" onClick={() => navigator.clipboard.writeText(roomCode)}>
                        {roomCode}
                        <span className="copy-icon">📋</span>
                      </div>
                    </div>

                    <h2 className="screen-title text-xl mt-4">{t('lobby.waitingPlayers')}</h2>

                    <div className="players-grid mt-4">
                      {players.map((p) => (
                        <div key={p.id} className="player-card">
                          <div className="player-card-icon">{p.icon}</div>
                          <div className="player-card-name font-bold">{p.name}</div>
                        </div>
                      ))}
                      {/* Placeholders */}
                      {[...Array(Math.max(0, config.numPlayers - players.length))].map((_, i) => (
                        <div key={`empty-${i}`} className="player-card opacity-30 border-dashed">
                          <div className="player-card-icon">👤</div>
                          <div className="player-card-name">...</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-8 w-full" style={{ justifyContent: 'center', maxWidth: 420, margin: '32px auto 0' }}>
                      <button className="btn btn-ghost" onClick={handleGoHome}>{t('setup.back')}</button>
                      <button
                        className="btn btn-primary flex-1"
                        disabled={players.length < 3 || !wsConnected}
                        onClick={() => {
                          if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
                            wsRef.current.send(JSON.stringify({ type: 'start-game' }));
                          }
                        }}
                      >
                        {t('setup.start')} →
                      </button>
                    </div>
                  </div>
                )}

                {/* ========== TURN REVEAL CON FLIP CARD ========== */}
                {phase === 'turn-reveal' && localGame && currentPlayer && (
                  <div className="screen fade-in">
                    <h1 className="screen-title">{t('turn.passDevice', { player: currentPlayer.name })}</h1>

                    <FlipCard
                      key={currentPlayer.id}
                      icon={currentPlayer.icon}
                      name={currentPlayer.name}
                      role={currentPlayer.role as 'civil' | 'impostor'}
                      secretWord={localGame.secretWord}
                      clue={localGame.impostorClue}
                      clueEnabled={config.impostorClueEnabled}
                      onFlipped={() => setRoleRevealed(true)}
                      t={t}
                    />

                    {roleRevealed && (
                      <button className="btn btn-primary btn-large" onClick={handleNextTurn}>
                        {countPlayersWhoSawRole() + 1 < players.length
                          ? t('turn.next')
                          : '¡A discutir!'} →
                      </button>
                    )}
                  </div>
                )}

                {/* ========== DISCUSSION - Sin votación manual ========== */}
                {phase === 'discussion' && localGame && (
                  <div className="screen fade-in">
                    <div className="screen-icon">💬</div>
                    <h1 className="screen-title">{t('discussion.title')}</h1>
                    <p className="screen-subtitle">{t('discussion.subtitle')}</p>
                    <p className="screen-subtitle" style={{ marginTop: '8px', opacity: 0.7 }}>
                      {t('discussion.hint')}
                    </p>

                    <button
                      className="btn btn-primary btn-large"
                      onClick={() => setPhase('results')}
                      style={{ marginTop: '24px' }}
                    >
                      {t('discussion.reveal')}
                    </button>
                  </div>
                )}

                {/* ========== VOTE (para online) ========== */}
                {phase === 'vote' && localGame && currentPlayer && (
                  <div className="screen fade-in">
                    {!voteRevealed ? (
                      <>
                        <div className="screen-icon bounce">{currentPlayer.icon}</div>
                        <h1 className="screen-title">{t('vote.passDevice', { player: currentPlayer.name })}</h1>
                        <button className="btn btn-primary btn-large" onClick={() => setVoteRevealed(true)}>
                          👆 {t('vote.tapToVote')}
                        </button>
                      </>
                    ) : (
                      <>
                        <h1 className="screen-title">{t('vote.title')}</h1>
                        <p className="screen-subtitle">{t('vote.selectImpostor')}</p>

                        <div className="vote-grid">
                          {players.map(p => (
                            <button
                              key={p.id}
                              className={`vote-option ${selectedVote === p.id ? 'selected' : ''} ${p.id === currentPlayer.id ? 'disabled' : ''}`}
                              onClick={() => p.id !== currentPlayer.id && setSelectedVote(p.id)}
                            >
                              <span className="vote-option-icon">{p.icon}</span>
                              <span className="vote-option-name">{p.name}</span>
                            </button>
                          ))}
                        </div>

                        <button className="btn btn-primary btn-large mt-4" onClick={handleConfirmVote} disabled={!selectedVote}>
                          {t('vote.confirm')} →
                        </button>
                      </>
                    )}
                  </div>
                )}

                {/* ========== ONLINE HINTS (Pistas) ========== */}
                {phase === 'online-hints' && onlineGameState && (
                  <div className="screen fade-in">
                    {(() => {
                      const currentPlayerData = players.find(p => p.id === playerId);
                      const isMyTurn = onlineGameState.currentTurn < players.length && players[onlineGameState.currentTurn]?.id === playerId;
                      const currentTurnPlayer = players[onlineGameState.currentTurn];

                      return (
                        <>
                          <h1 className="screen-title">
                            {isMyTurn ? t('online.turn.yours') : t('online.turn.others', { icon: currentTurnPlayer?.icon, name: currentTurnPlayer?.name })}
                          </h1>
                          <p className="screen-subtitle">
                            {isMyTurn
                              ? t('online.hint.instruction')
                              : t('online.hint.waiting', { player: currentTurnPlayer?.name })
                            }
                          </p>

                          {currentPlayerData && (
                            <div style={{
                              padding: '20px',
                              background: 'var(--color-bg-card)',
                              borderRadius: '16px',
                              border: '2px solid var(--color-border)',
                              marginTop: '24px',
                              maxWidth: '500px',
                              width: '100%'
                            }}>
                              <div style={{ marginBottom: '16px' }}>
                                <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '8px', color: 'var(--color-text)' }}>
                                  Tu rol: {currentPlayerData.role === 'impostor' ? t('online.role.impostor') : t('online.role.civil')}
                                </div>
                                {currentPlayerData.role === 'civil' && onlineGameState.secretWord && (
                                  <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-secondary)', fontFamily: 'var(--font-mono)' }}>
                                    {t('online.secretWord', { word: onlineGameState.secretWord })}
                                  </div>
                                )}
                                {currentPlayerData.role === 'impostor' && (
                                  <>
                                    <div style={{ fontSize: '14px', color: 'var(--color-warning)', marginBottom: currentPlayerData.impostorClue ? '8px' : '0' }}>
                                      {t('online.impostorWarning')}
                                    </div>
                                    {currentPlayerData.impostorClue && (
                                      <div style={{ fontSize: '18px', fontWeight: '700', color: 'var(--color-primary)', fontFamily: 'var(--font-mono)' }}>
                                        {t('results.theClue')}: {currentPlayerData.impostorClue}
                                      </div>
                                    )}
                                  </>
                                )}
                              </div>

                              {isMyTurn && !currentPlayerData.hint && (
                                <div style={{ display: 'flex', gap: '8px' }}>
                                  <input
                                    type="text"
                                    className="input"
                                    placeholder={t('online.placeholder')}
                                    maxLength={50}
                                    onKeyDown={(e) => {
                                      if (e.key === 'Enter' && e.currentTarget.value.trim() && wsRef.current) {
                                        wsRef.current.send(JSON.stringify({
                                          type: 'submit-hint',
                                          hint: e.currentTarget.value.trim()
                                        }));
                                        e.currentTarget.value = '';
                                      }
                                    }}
                                    style={{ flex: 1 }}
                                  />
                                  <button
                                    className="btn btn-primary"
                                    onClick={(e) => {
                                      const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                                      if (input.value.trim() && wsRef.current) {
                                        wsRef.current.send(JSON.stringify({
                                          type: 'submit-hint',
                                          hint: input.value.trim()
                                        }));
                                        input.value = '';
                                      }
                                    }}
                                  >
                                    {t('online.send')}
                                  </button>
                                </div>
                              )}

                              {currentPlayerData.hint && (
                                <div style={{
                                  padding: '12px',
                                  background: 'var(--color-bg-element)',
                                  borderRadius: '8px',
                                  fontSize: '16px',
                                  fontWeight: '600'
                                }}>
                                  {t('online.yourHint', { hint: currentPlayerData.hint })}
                                </div>
                              )}
                            </div>
                          )}

                          <div style={{ marginTop: '24px', width: '100%', maxWidth: '500px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-soft)' }}>
                              {t('online.hintsReceived')}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {players.map((p, idx) => (
                                <div
                                  key={p.id}
                                  style={{
                                    padding: '12px',
                                    background: idx < onlineGameState.currentTurn ? 'var(--color-bg-card)' : 'var(--color-bg-element)',
                                    border: `2px solid ${idx < onlineGameState.currentTurn ? 'var(--color-secondary)' : 'var(--color-border)'}`,
                                    borderRadius: '8px',
                                    opacity: idx < onlineGameState.currentTurn ? 1 : 0.5,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px'
                                  }}
                                >
                                  <span style={{ fontSize: '24px' }}>{p.icon}</span>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '14px', fontWeight: '600' }}>{p.name}</div>
                                    {p.hint ? (
                                      <div style={{ fontSize: '13px', color: 'var(--color-text-soft)', fontStyle: 'italic' }}>
                                        "{p.hint}"
                                      </div>
                                    ) : (
                                      <div style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>
                                        {idx === onlineGameState.currentTurn ? t('online.typing') : t('online.pending')}
                                      </div>
                                    )}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* ========== ONLINE VOTE (Votación) ========== */}
                {phase === 'online-vote' && onlineGameState && (
                  <div className="screen fade-in">
                    {(() => {
                      const currentPlayerData = players.find(p => p.id === playerId);
                      const isMyTurn = onlineGameState.currentTurn < players.length && players[onlineGameState.currentTurn]?.id === playerId;
                      const currentTurnPlayer = players[onlineGameState.currentTurn];

                      return (
                        <>
                          <h1 className="screen-title">
                            {isMyTurn ? t('online.vote.yours') : t('online.vote.waiting', { player: currentTurnPlayer?.name || '...' })}
                          </h1>
                          <p className="screen-subtitle">
                            {isMyTurn
                              ? t('online.vote.instruction')
                              : t('online.vote.waiting', { player: currentTurnPlayer?.name || '...' })
                            }
                          </p>

                          {isMyTurn && !currentPlayerData?.votedFor && (
                            <div className="vote-grid" style={{ marginTop: '24px' }}>
                              {players.map(p => (
                                <button
                                  key={p.id}
                                  className={`vote-option ${localSelectedVote === p.id ? 'selected' : ''} ${p.id === playerId ? 'disabled' : ''}`}
                                  onClick={() => p.id !== playerId && setLocalSelectedVote(p.id)}
                                  disabled={p.id === playerId}
                                >
                                  <span className="vote-option-icon">{p.icon}</span>
                                  <span className="vote-option-name">{p.name}</span>
                                </button>
                              ))}
                            </div>
                          )}

                          {isMyTurn && !currentPlayerData?.votedFor && (
                            <button
                              className="btn btn-primary btn-large mt-4"
                              onClick={() => {
                                if (localSelectedVote && wsRef.current) {
                                  wsRef.current.send(JSON.stringify({
                                    type: 'submit-vote',
                                    votedFor: localSelectedVote
                                  }));
                                  setLocalSelectedVote(null);
                                }
                              }}
                              disabled={!localSelectedVote}
                            >
                              {t('online.confirmVote')} →
                            </button>
                          )}

                          {currentPlayerData?.votedFor && (
                            <div style={{
                              padding: '20px',
                              background: 'var(--color-bg-card)',
                              borderRadius: '16px',
                              border: '2px solid var(--color-primary)',
                              marginTop: '24px',
                              textAlign: 'center'
                            }}>
                              <div style={{ fontSize: '16px', fontWeight: '600', marginBottom: '8px' }}>
                                {t('online.votedAlready')}
                              </div>
                              <div style={{ fontSize: '14px', color: 'var(--color-text-soft)' }}>
                                {t('online.votedFor', { player: players.find(p => p.id === currentPlayerData.votedFor)?.name || '?' })}
                              </div>
                            </div>
                          )}

                          <div style={{ marginTop: '24px', width: '100%', maxWidth: '500px' }}>
                            <div style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: 'var(--color-text-soft)' }}>
                              {t('online.votes')}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                              {players.map((p, idx) => (
                                <div
                                  key={p.id}
                                  style={{
                                    padding: '12px',
                                    background: p.votedFor ? 'var(--color-bg-card)' : 'var(--color-bg-element)',
                                    border: `2px solid ${p.votedFor ? 'var(--color-primary)' : 'var(--color-border)'}`,
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between'
                                  }}
                                >
                                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <span style={{ fontSize: '24px' }}>{p.icon}</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600' }}>{p.name}</span>
                                  </div>
                                  {p.votedFor ? (
                                    <span style={{ fontSize: '14px', color: 'var(--color-primary)' }}>
                                      → {players.find(pl => pl.id === p.votedFor)?.name || '?'}
                                    </span>
                                  ) : (
                                    <span style={{ fontSize: '12px', color: 'var(--color-text-soft)' }}>{t('online.pending')}</span>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>
                )}

                {/* ========== ONLINE RESULTS (Resultados) ========== */}
                {phase === 'online-results' && onlineGameState && (
                  <div className="screen fade-in">
                    <Confetti isActive={true} variant={onlineGameState.winner === 'civils' ? 'civils' : 'impostor'} />
                    <VictoryWaves variant={onlineGameState.winner === 'civils' ? 'civils' : 'impostor'} />
                    <div className={`reveal-card ${onlineGameState.winner === 'civils' ? 'civils-win' : 'impostor-wins'}`}>
                      <h1 className="reveal-title">
                        {onlineGameState.winner === 'civils' ? '🎉 ' + t('results.civilsWin') : '😈 ' + t('results.impostorWins')}
                      </h1>

                      <div className="reveal-section">
                        <div className="reveal-label">{t('results.theImpostor')}</div>
                        <div className="reveal-impostor">
                          {players.filter(p => p.role === 'impostor').map(p => (
                            <div key={p.id} className="reveal-impostor-item">
                              <span className="reveal-impostor-icon">{p.icon}</span>
                              <span className="reveal-impostor-name">{p.name}</span>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="reveal-section">
                        <div className="reveal-label">{t('results.theWord')}</div>
                        <div className="reveal-word">{onlineGameState.secretWord}</div>
                      </div>

                      <div className="reveal-section" style={{ marginTop: '20px' }}>
                        <div className="reveal-label">{t('online.allHints')}</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '12px' }}>
                          {players.map(p => (
                            <div key={p.id} style={{
                              padding: '10px',
                              background: 'rgba(255,255,255,0.1)',
                              borderRadius: '8px',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '12px'
                            }}>
                              <span>{p.icon}</span>
                              <span style={{ fontWeight: '600' }}>{p.name}:</span>
                              <span style={{ fontStyle: 'italic', color: 'var(--color-text-soft)' }}>"{p.hint || t('online.noHint')}"</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button className="btn btn-ghost" onClick={handleGoHome}>{t('results.backHome')}</button>
                      <button
                        className="btn btn-secondary"
                        onClick={() => {
                          if (wsRef.current) {
                            wsRef.current.send(JSON.stringify({ type: 'play-again' }));
                          }
                        }}
                      >
                        {t('results.playAgain')} 🔄
                      </button>
                    </div>
                  </div>
                )}

                {/* ========== RESULTS - Resumen de partida (LOCAL) ========== */}
                {phase === 'results' && localGame && (
                  <div className="screen fade-in">
                    <Confetti isActive={true} variant="civils" />

                    <div className="setup-header">
                      <div className="setup-title-area">
                        <h1 className="setup-title">{t('results.summary')}</h1>
                      </div>
                    </div>

                    <div className="reveal-card summary-card" style={{ marginTop: 0 }}>

                      {/* Resumen de jugadores */}
                      <div className="summary-section">
                        <div className="summary-grid">
                          {/* Civiles */}
                          <div className="summary-group civils">
                            <div className="summary-group-title">{t('results.civils')}</div>
                            <div className="summary-players">
                              {players.filter(p => p.role === 'civil').map(p => (
                                <div key={p.id} className="summary-player">
                                  <span className="summary-player-icon">{p.icon}</span>
                                  <span className="summary-player-name">{p.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>

                          {/* Impostores */}
                          <div className="summary-group impostors">
                            <div className="summary-group-title">{t('results.theImpostor')}</div>
                            <div className="summary-players">
                              {players.filter(p => p.role === 'impostor').map(p => (
                                <div key={p.id} className="summary-player impostor">
                                  <span className="summary-player-icon">{p.icon}</span>
                                  <span className="summary-player-name">{p.name}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Palabra secreta */}
                      <div className="summary-section word-section">
                        <div className="summary-label">{t('results.theWord')}</div>
                        <div className="summary-word">{localGame.secretWord}</div>
                      </div>

                      {/* Pista si estaba habilitada */}
                      {config.impostorClueEnabled && localGame.impostorClue && (
                        <div className="summary-section clue-section">
                          <div className="summary-label">{t('results.theClue')}</div>
                          <div className="summary-clue">{localGame.impostorClue}</div>
                        </div>
                      )}
                    </div>

                    <div className="flex gap-3 mt-4">
                      <button className="btn btn-ghost" onClick={handleGoHome}>{t('results.backHome')}</button>
                      <button className="btn btn-primary" onClick={handlePlayAgain}>{t('results.playAgain')}</button>
                    </div>
                  </div>
                )}
                </>
                )}

              </div>
            </div>



          </main>

          {/* Ad Sidebar DERECHO */}
          <aside className="ad-sidebar">
            {[0].map((i) => (
              <AdSlot
                key={i}
                client={CONFIG.ADSENSE_CLIENT}
                slot={CONFIG.ADSENSE_SLOTS.sidebarRight}
                format="vertical"
                label={t('ads.sidebar')}
              />
            ))}
          </aside>
        </div>
      </div >

      {/* Ad Sticky Mobile - ELIMINADO POR AHORA */}
      {/* 
        !hideStickyAd && (
          <div className="ad-sticky-mobile">
            <button
              type="button"
              className="ad-sticky-close"
              aria-label="Ocultar anuncio"
              onClick={() => {
                sessionStorage.setItem('esimpostor_hide_sticky_ad', 'true');
                setHideStickyAd(true);
              }}
            >
              ×
            </button>
            <AdSlot client={CONFIG.ADSENSE_CLIENT} slot={CONFIG.ADSENSE_SLOTS.stickyMobile} format="horizontal" label={t('ads.sticky')} />
          </div>
        )
      */}

      {/* Modal iconos */}
      {
        showIconPicker !== null && (
          <div className="modal-overlay" onClick={() => setShowIconPicker(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <h3 className="modal-title">{t('setup.selectIcon')}</h3>
              <div className="icon-grid">
                {PLAYER_ICONS.map(icon => (
                  <button
                    key={icon}
                    className={`icon-option ${players[showIconPicker]?.icon === icon ? 'selected' : ''} ${usedIcons.has(icon) && players[showIconPicker]?.icon !== icon ? 'used' : ''}`}
                    onClick={() => !(usedIcons.has(icon) && players[showIconPicker]?.icon !== icon) && updatePlayerIcon(showIconPicker, icon)}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )
      }

      {/* INTERSTITIAL FULLSCREEN - MAXIMIZAR REVENUE */}
      {
        showInterstitial && (
          <div className="interstitial-overlay">
            <div className="interstitial-timer">{adCountdown}</div>

            {isLoadingWord ? (
              <>
                <div className="loading-spinner" style={{ borderColor: 'rgba(249, 115, 22, 0.2)', borderTopColor: '#f97316' }}></div>
                <p className="interstitial-text" style={{ marginTop: '20px' }}>
                  {t('ads.interstitial.generating')}
                </p>
                <p className="interstitial-text" style={{ fontSize: '14px', opacity: 0.7, marginTop: '8px' }}>
                  {t('ads.interstitial.wait')}
                </p>
              </>
            ) : (
              <p className="interstitial-text">{t('ads.interstitial.body')}</p>
            )}

            <div className="interstitial-ad" style={{ minWidth: '336px', minHeight: '280px' }}>
              <AdSlot
                client={CONFIG.ADSENSE_CLIENT}
                slot={CONFIG.ADSENSE_SLOTS.interstitial}
                format="rectangle"
                label={t('ads.interstitial.title')}
              />
            </div>

            <button
              className="btn btn-primary"
              onClick={handleInterstitialComplete}
              disabled={adCountdown > 0 || isLoadingWord}
              style={{
                background: adCountdown > 0 || isLoadingWord ? 'rgba(100, 116, 139, 0.5)' : 'linear-gradient(135deg, #f97316 0%, #dc2626 100%)',
                boxShadow: adCountdown > 0 || isLoadingWord ? 'none' : '0 4px 12px rgba(249, 115, 22, 0.4)',
                minWidth: '220px',
                fontSize: '16px',
                fontWeight: '700',
                padding: '16px 40px',
                borderRadius: '50px',
                textTransform: 'uppercase',
                letterSpacing: '1px',
                color: adCountdown > 0 || isLoadingWord ? 'rgba(255, 255, 255, 0.7)' : 'white',
                border: 'none',
                cursor: adCountdown > 0 || isLoadingWord ? 'not-allowed' : 'pointer'
              }}
            >
              {isLoadingWord
                ? t('ads.interstitial.generating')
                : adCountdown > 0
                  ? `${t('ads.interstitial.btn')} (${adCountdown}s)`
                  : t('ads.interstitial.btn')}
            </button>
          </div>
        )
      }

      {/* Footer */}
      <Footer locale={locale} onLegalClick={setLegalPage} />

      {/* Legal Page Modal */}
      {
        legalPage && (
          <LegalPage
            locale={locale}
            page={legalPage}
            onClose={() => setLegalPage(null)}
          />
        )
      }

      {/* Rules Page Modal */}
      {
        showRules && (
          <RulesPage
            locale={locale}
            onClose={() => setShowRules(false)}
          />
        )
      }
    </div >
  );
}
