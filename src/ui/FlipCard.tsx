import { useState, useEffect, useRef } from 'react';

interface FlipCardProps {
    icon: string;
    name: string;
    role: 'civil' | 'impostor';
    secretWord?: string;
    clue?: string;
    clueEnabled?: boolean;
    onFlipped?: () => void;
    t: (key: string, params?: Record<string, string>) => string;
}

export function FlipCard({
    icon,
    name,
    role,
    secretWord,
    clue,
    clueEnabled = true,
    onFlipped,
    t
}: FlipCardProps) {
    const [phase, setPhase] = useState<'front' | 'showing' | 'hidden' | 'ready'>('front');
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
    const [canFlip, setCanFlip] = useState(true);
    const cardRef = useRef<HTMLDivElement>(null);
    const timerRef = useRef<NodeJS.Timeout | null>(null);

    // Reset cuando cambia el jugador
    useEffect(() => {
        setPhase('front');
        setCanFlip(true);
        if (timerRef.current) {
            clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    }, [icon, name]);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!cardRef.current) return;
        
        const rect = cardRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        
        const x = (e.clientX - centerX) / (rect.width / 2);
        const y = (e.clientY - centerY) / (rect.height / 2);
        
        setMousePosition({ x, y });
    };

    const handleMouseLeave = () => {
        setMousePosition({ x: 0, y: 0 });
    };

    const handleClick = () => {
        if (!canFlip) return;

        if (phase === 'front' || phase === 'ready') {
            // Girar para mostrar el rol
            setPhase('showing');
            setCanFlip(false);
            onFlipped?.();

            // Después de 5 segundos, volver a girar automáticamente
            timerRef.current = setTimeout(() => {
                setPhase('hidden');
                // Después de volver a girar automáticamente, permitir volver a girar inmediatamente
                setPhase('ready');
                setCanFlip(true);
            }, 5000);
        }
    };

    // Limpiar timer al desmontar
    useEffect(() => {
        return () => {
            if (timerRef.current) {
                clearTimeout(timerRef.current);
            }
        };
    }, []);

    const rotateX = mousePosition.y * 15;
    const rotateY = mousePosition.x * -15;
    const glowX = (mousePosition.x + 1) * 50;
    const glowY = (mousePosition.y + 1) * 50;
    const isFlipped = phase === 'showing';
    const isClickable = (phase === 'front' || phase === 'ready') && canFlip;

    return (
        <div className="flip-card-container">
            <div
                ref={cardRef}
                className={`flip-card ${isFlipped ? 'flipped' : ''} ${isClickable ? 'clickable' : ''}`}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{
                    cursor: isClickable ? 'pointer' : 'default',
                    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transition: 'none'
                }}
            >
                <div className="flip-card-inner">
                    {/* FRENTE - Toca para revelar */}
                    <div className="flip-card-front">
                        <div 
                            className="flip-card-glow" 
                            style={{
                                background: `radial-gradient(circle at ${glowX}% ${glowY}%, rgba(255, 77, 106, 0.3), transparent 60%)`,
                                transition: 'background 0.1s ease-out'
                            }}
                        />
                        {isClickable && <div className="flip-card-pulse-indicator" />}
                        <div className="flip-card-icon-3d">{icon}</div>
                        <div className="flip-card-name">{name}</div>
                    </div>

                    {/* REVERSO - Rol y palabra */}
                    <div className={`flip-card-back ${role}`}>
                        <div className="flip-card-back-pattern" />

                        <div className="flip-card-icon-3d">{icon}</div>

                        <div className={`flip-card-role-badge ${role}`}>
                            {role === 'civil' ? t('turn.youAreCivil') : t('turn.youAreImpostor')}
                        </div>

                        {role === 'civil' ? (
                            <div className="flip-card-word-container">
                                <span className="word-label">{t('turn.secretWord')}</span>
                                <span className="word-value">{secretWord}</span>
                            </div>
                        ) : (
                            <div className="flip-card-impostor-info">
                                <p className="impostor-warning">{t('turn.noWord')}</p>
                                {clueEnabled && clue && (
                                    <div className="clue-box">
                                        <span className="clue-label">💡 {t('turn.clue')}</span>
                                        <span className="clue-value">{clue}</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {phase === 'showing' && (
                            <div className="flip-card-timer">
                                <div className="timer-bar" />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
