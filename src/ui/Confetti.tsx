import { useEffect, useState } from 'react';

interface ConfettiPiece {
    id: number;
    x: number;
    y: number;
    rotation: number;
    scale: number;
    color: string;
    delay: number;
    duration: number;
    type: 'circle' | 'square' | 'triangle';
}

interface ConfettiProps {
    isActive: boolean;
    variant: 'civils' | 'impostor';
}

const CIVIL_COLORS = ['#f97316', '#ea580c', '#fb923c', '#fdba74', '#fbbf24', '#f59e0b'];
const IMPOSTOR_COLORS = ['#f97316', '#ea580c', '#c2410c', '#fb923c', '#fdba74', '#f59e0b'];

export function Confetti({ isActive, variant }: ConfettiProps) {
    const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

    useEffect(() => {
        if (!isActive) {
            setPieces([]);
            return;
        }

        const colors = variant === 'civils' ? CIVIL_COLORS : IMPOSTOR_COLORS;
        const newPieces: ConfettiPiece[] = [];

        for (let i = 0; i < 100; i++) {
            newPieces.push({
                id: i,
                x: Math.random() * 100,
                y: -10 - Math.random() * 20,
                rotation: Math.random() * 360,
                scale: 0.5 + Math.random() * 0.8,
                color: colors[Math.floor(Math.random() * colors.length)],
                delay: Math.random() * 2,
                duration: 3 + Math.random() * 3,
                type: ['circle', 'square', 'triangle'][Math.floor(Math.random() * 3)] as ConfettiPiece['type']
            });
        }

        setPieces(newPieces);

        // Limpiar después de la animación
        const timeout = setTimeout(() => {
            setPieces([]);
        }, 8000);

        return () => clearTimeout(timeout);
    }, [isActive, variant]);

    if (!isActive || pieces.length === 0) return null;

    return (
        <div className="confetti-container">
            {pieces.map((piece) => (
                <div
                    key={piece.id}
                    className={`confetti-piece confetti-${piece.type}`}
                    style={{
                        '--x': `${piece.x}vw`,
                        '--rotation': `${piece.rotation}deg`,
                        '--scale': piece.scale,
                        '--color': piece.color,
                        '--delay': `${piece.delay}s`,
                        '--duration': `${piece.duration}s`,
                        left: `${piece.x}%`,
                    } as React.CSSProperties}
                />
            ))}
            <style>{`
                .confetti-container {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 1000;
                    overflow: hidden;
                }

                .confetti-piece {
                    position: absolute;
                    top: -20px;
                    width: 12px;
                    height: 12px;
                    background: var(--color);
                    animation: confetti-fall var(--duration) ease-out var(--delay) forwards;
                    transform: rotate(var(--rotation)) scale(var(--scale));
                }

                .confetti-circle {
                    border-radius: 50%;
                }

                .confetti-square {
                    border-radius: 2px;
                }

                .confetti-triangle {
                    width: 0;
                    height: 0;
                    background: transparent;
                    border-left: 6px solid transparent;
                    border-right: 6px solid transparent;
                    border-bottom: 12px solid var(--color);
                }

                @keyframes confetti-fall {
                    0% {
                        transform: translateY(0) rotate(0deg) scale(var(--scale));
                        opacity: 1;
                    }
                    100% {
                        transform: translateY(120vh) rotate(720deg) scale(0);
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

// Componente de partículas de fondo flotantes
export function FloatingParticles() {
    return (
        <div className="floating-particles-bg">
            {[...Array(30)].map((_, i) => (
                <span
                    key={i}
                    className="floating-particle"
                    style={{
                        '--x': `${Math.random() * 100}%`,
                        '--y': `${Math.random() * 100}%`,
                        '--duration': `${15 + Math.random() * 20}s`,
                        '--delay': `${Math.random() * 10}s`,
                        '--size': `${2 + Math.random() * 4}px`,
                        '--opacity': 0.1 + Math.random() * 0.3,
                    } as React.CSSProperties}
                />
            ))}
            <style>{`
                .floating-particles-bg {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    pointer-events: none;
                    z-index: 0;
                    overflow: hidden;
                }

                .floating-particle {
                    position: absolute;
                    left: var(--x);
                    top: var(--y);
                    width: var(--size);
                    height: var(--size);
                    background: rgba(255, 255, 255, var(--opacity));
                    border-radius: 50%;
                    animation: particle-drift var(--duration) ease-in-out var(--delay) infinite;
                }

                @keyframes particle-drift {
                    0%, 100% {
                        transform: translate(0, 0) scale(1);
                        opacity: var(--opacity);
                    }
                    25% {
                        transform: translate(30px, -50px) scale(1.2);
                    }
                    50% {
                        transform: translate(-20px, -100px) scale(0.8);
                        opacity: calc(var(--opacity) * 0.5);
                    }
                    75% {
                        transform: translate(40px, -30px) scale(1.1);
                    }
                }
            `}</style>
        </div>
    );
}

// Efecto de ondas de luz para victorias
export function VictoryWaves({ variant }: { variant: 'civils' | 'impostor' }) {
    const colors = variant === 'civils'
        ? ['rgba(16, 185, 129, 0.3)', 'rgba(14, 165, 233, 0.2)']
        : ['rgba(239, 68, 68, 0.3)', 'rgba(249, 115, 22, 0.2)'];

    return (
        <div className="victory-waves">
            {[0, 1, 2].map((i) => (
                <div
                    key={i}
                    className="wave"
                    style={{
                        '--delay': `${i * 0.5}s`,
                        '--color1': colors[0],
                        '--color2': colors[1],
                    } as React.CSSProperties}
                />
            ))}
            <style>{`
                .victory-waves {
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    pointer-events: none;
                    z-index: 999;
                }

                .victory-waves .wave {
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 100px;
                    height: 100px;
                    border-radius: 50%;
                    background: radial-gradient(circle, var(--color1) 0%, var(--color2) 50%, transparent 70%);
                    animation: wave-expand 2s ease-out var(--delay) infinite;
                }

                @keyframes wave-expand {
                    0% {
                        width: 100px;
                        height: 100px;
                        opacity: 1;
                    }
                    100% {
                        width: 800px;
                        height: 800px;
                        opacity: 0;
                    }
                }
            `}</style>
        </div>
    );
}

