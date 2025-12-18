import { useEffect, useRef } from 'react';

interface ParticleBackgroundProps {
  theme: 'dark' | 'light';
}

export function ParticleBackground({ theme }: ParticleBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configuración según el tema
    const config = {
      particleCount: theme === 'dark' ? 80 : 60,
      particleSpeed: 0.5,
      connectionDistance: 120,
      particleSize: theme === 'dark' ? 2 : 1.5,
      particleColor: theme === 'dark' 
        ? 'rgba(255, 255, 255, 0.5)' 
        : 'rgba(100, 116, 139, 0.4)',
      connectionColor: theme === 'dark'
        ? 'rgba(255, 255, 255, 0.1)'
        : 'rgba(100, 116, 139, 0.15)',
      glowColor: theme === 'dark'
        ? 'rgba(249, 115, 22, 0.1)'
        : 'rgba(249, 115, 22, 0.05)'
    };

    // Ajustar tamaño del canvas
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Clase Partícula
    class Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      color: string;

      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * config.particleSpeed;
        this.vy = (Math.random() - 0.5) * config.particleSpeed;
        this.radius = config.particleSize;
        this.color = config.particleColor;
      }

      update() {
        this.x += this.vx;
        this.y += this.vy;

        // Rebote en los bordes
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;

        // Mantener dentro del canvas
        this.x = Math.max(0, Math.min(canvas.width, this.x));
        this.y = Math.max(0, Math.min(canvas.height, this.y));
      }

      draw() {
        if (!ctx) return;
        
        // Glow effect
        const gradient = ctx.createRadialGradient(
          this.x, this.y, 0,
          this.x, this.y, this.radius * 3
        );
        gradient.addColorStop(0, config.glowColor);
        gradient.addColorStop(1, 'transparent');
        
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius * 3, 0, Math.PI * 2);
        ctx.fill();

        // Partícula principal
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // Crear partículas
    const particles: Particle[] = [];
    for (let i = 0; i < config.particleCount; i++) {
      particles.push(new Particle());
    }

    // Función de animación
    let animationId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Actualizar y dibujar partículas
      particles.forEach(particle => {
        particle.update();
        particle.draw();
      });

      // Dibujar conexiones
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const distance = Math.sqrt(dx * dx + dy * dy);

          if (distance < config.connectionDistance) {
            const opacity = (1 - distance / config.connectionDistance) * 0.5;
            ctx.strokeStyle = config.connectionColor.replace('0.1', opacity.toString());
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.stroke();
          }
        }
      }

      animationId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationId);
    };
  }, [theme]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  );
}

