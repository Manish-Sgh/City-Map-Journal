import React, { useEffect, useRef } from 'react';
import { Season } from '../types';
import { SEASON_PALETTES } from '../constants';

interface AtmosphereProps {
  season: Season;
  isNight: boolean;
}

const Atmosphere: React.FC<AtmosphereProps> = ({ season, isNight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: Particle[] = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    class Particle {
      x!: number;
      y!: number;
      size!: number;
      speed!: number;
      drift!: number;
      opacity!: number;
      rotation!: number;
      spin!: number;

      constructor() {
        this.reset();
        this.y = Math.random() * window.innerHeight;
      }

      reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = -20;
        this.size = 1 + Math.random() * 4;
        this.speed = 0.3 + Math.random() * 0.8;
        this.drift = (Math.random() - 0.5) * 0.5;
        this.opacity = 0.3 + Math.random() * 0.6;
        this.rotation = Math.random() * Math.PI * 2;
        this.spin = (Math.random() - 0.5) * 0.05;
      }

      update() {
        this.y += this.speed;
        this.x += this.drift + Math.sin(Date.now() * 0.0005 + this.x) * 0.2;
        this.rotation += this.spin;
        if (this.y > window.innerHeight + 20) this.reset();
      }

      draw() {
        if (!ctx) return;
        const colors = SEASON_PALETTES[season].particleColors;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        ctx.save();
        ctx.globalAlpha = this.opacity * 0.6;
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (season === 'Spring') {
          ctx.fillStyle = color + '0.8)';
          ctx.beginPath();
          ctx.ellipse(0, 0, this.size * 1.5, this.size * 0.7, 0, 0, Math.PI * 2);
          ctx.fill();
        } else if (season === 'Autumn') {
          ctx.fillStyle = color + '0.7)';
          ctx.beginPath();
          ctx.moveTo(0, -this.size);
          ctx.quadraticCurveTo(this.size, 0, 0, this.size);
          ctx.quadraticCurveTo(-this.size, 0, 0, -this.size);
          ctx.fill();
        } else if (season === 'Winter') {
          ctx.fillStyle = color + '0.9)';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.6, 0, Math.PI * 2);
          ctx.fill();
        } else {
          ctx.fillStyle = color + '0.5)';
          ctx.beginPath();
          ctx.arc(0, 0, this.size * 0.5, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();
      }
    }

    const init = () => {
      particles = Array.from({ length: 60 }, () => new Particle());
    };

    init();

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.update();
        p.draw();
      });
      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season]);

  return (
    <>
      {/* Vignette Overlay */}
      <div className="vignette" />

      {/* Fog Layers */}
      <div 
        className="fog-bottom" 
        style={{ background: `linear-gradient(to top, ${SEASON_PALETTES[season].fog} 0%, transparent 100%)` }} 
      />
      <div className="fog-top" />

      {/* Season Specific Particles */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-30"
      />

      {/* Season Specific Overlay */}
      <div 
        className="fixed inset-0 pointer-events-none z-30 transition-all duration-2000"
        style={{ backgroundColor: SEASON_PALETTES[season].tint }}
      />

      {/* Night Overlay */}
      {isNight && (
        <div className="fixed inset-0 pointer-events-none z-20 bg-bg-deep/30" />
      )}
    </>
  );
};

export default Atmosphere;
