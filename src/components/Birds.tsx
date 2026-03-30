import React, { useEffect, useRef } from 'react';

interface Bird {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  flock: number;
  flap: number;
  flapSpeed: number;
}

const Birds: React.FC<{ isNight: boolean }> = ({ isNight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    const birds: Bird[] = Array.from({ length: 18 }, (_, i) => ({
      x: Math.random() * window.innerWidth * 1.5 - window.innerWidth * 0.5,
      y: window.innerHeight * (0.08 + Math.random() * 0.3),
      vx: 0.4 + Math.random() * 0.8,
      vy: (Math.random() - 0.5) * 0.15,
      size: 2 + Math.random() * 3,
      phase: Math.random() * Math.PI * 2,
      flock: Math.floor(i / 5),
      flap: Math.random() * Math.PI * 2,
      flapSpeed: 0.04 + Math.random() * 0.03
    }));

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const drawBird = (x: number, y: number, size: number, flapAngle: number) => {
      const w = size * 3.5;
      const h = Math.sin(flapAngle) * size * 1.2;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x - w / 2, y - h, x - w, y + size * 0.3);
      ctx.moveTo(x, y);
      ctx.quadraticCurveTo(x + w / 2, y - h, x + w, y + size * 0.3);
      ctx.stroke();
    };

    const animate = (timestamp: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const W = canvas.width;
      const H = canvas.height;

      birds.forEach((b) => {
        b.flap += b.flapSpeed;
        b.x += b.vx;
        b.vy += Math.sin(timestamp * 0.0003 + b.phase) * 0.008;
        b.vy *= 0.98;
        b.y += b.vy;

        // Flock slight attraction
        const flockBirds = birds.filter(ob => ob.flock === b.flock);
        const cx = flockBirds.reduce((a, ob) => a + ob.x, 0) / flockBirds.length;
        const cy = flockBirds.reduce((a, ob) => a + ob.y, 0) / flockBirds.length;
        b.vx += (cx - b.x) * 0.0002;
        b.vy += (cy - b.y) * 0.0002;

        if (b.x > W + 60) {
          b.x = -60;
          b.y = H * (0.06 + Math.random() * 0.3);
        }
        b.y = Math.max(H * 0.04, Math.min(H * 0.45, b.y));

        const alpha = isNight ? 0.2 : 0.45;
        ctx.strokeStyle = `rgba(200,180,150,${alpha})`;
        ctx.lineWidth = b.size * 0.35;
        ctx.lineCap = 'round';
        drawBird(b.x, b.y, b.size, b.flap);
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [isNight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-20"
    />
  );
};

export default Birds;
