import React, { useEffect, useRef } from 'react';
import { Season } from '../types';
import { SEASON_PALETTES } from '../constants';

interface TerrainProps {
  season: Season;
  isNight: boolean;
}

const Terrain: React.FC<TerrainProps> = ({ season, isNight }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const heightMap = useRef<number[][]>([]);
  const COLS = 60;
  const ROWS = 35;

  // Perlin-like noise helpers
  const fade = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a: number, b: number, t: number) => a + t * (b - a);
  
  const PERM = useRef<number[]>([]);

  useEffect(() => {
    const p = Array.from({ length: 512 }, (_, i) => (i < 256 ? i : 0));
    for (let i = 255; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [p[i], p[j]] = [p[j], p[i]];
    }
    for (let i = 0; i < 256; i++) p[i + 256] = p[i];
    PERM.current = p;
  }, []);

  const grad = (h: number, x: number, y: number) => {
    const dirs = [[1, 1], [-1, 1], [1, -1], [-1, -1], [1, 0], [-1, 0], [0, 1], [0, -1]];
    const [gx, gy] = dirs[h & 7];
    return gx * x + gy * y;
  };

  const noise2D = (x: number, y: number) => {
    const p = PERM.current;
    if (p.length === 0) return 0;
    const X = Math.floor(x) & 255, Y = Math.floor(y) & 255;
    x -= Math.floor(x); y -= Math.floor(y);
    const u = fade(x), v = fade(y);
    const a = p[X] + Y, b = p[X + 1] + Y;
    return lerp(
      lerp(grad(p[a], x, y), grad(p[b], x - 1, y), u),
      lerp(grad(p[a + 1], x, y - 1), grad(p[b + 1], x - 1, y - 1), u),
      v
    );
  };

  const fbm = (x: number, y: number, octaves = 4) => {
    let v = 0, amp = 0.5, freq = 1, max = 0;
    for (let i = 0; i < octaves; i++) {
      v += noise2D(x * freq, y * freq) * amp;
      max += amp; amp *= 0.5; freq *= 2.1;
    }
    return v / max;
  };

  const initTerrain = () => {
    const map: number[][] = [];
    const seed = Math.random() * 100;
    for (let r = 0; r <= ROWS; r++) {
      map[r] = [];
      for (let c = 0; c <= COLS; c++) {
        map[r][c] = fbm(c / 20 + seed, r / 20 + seed);
      }
    }
    heightMap.current = map;
  };

  useEffect(() => {
    initTerrain();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', resize);
    resize();

    const draw = (timestamp: number) => {
      const W = canvas.width, H = canvas.height;
      ctx.clearRect(0, 0, W, H);
      
      const palette = isNight ? {
        sky: ['#010203','#020508','#03080e','#050d18','#0a1428','#101c38','#182548'],
        terrain: ['#020402','#050a05','#080f08','#0d1a0d','#122012','#1a2e1a','#243a24'],
        fog: 'rgba(5,10,15,0.5)'
      } : SEASON_PALETTES[season];

      // Sky gradient
      const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.65);
      palette.sky.forEach((c, i) => skyGrad.addColorStop(i / (palette.sky.length - 1), c));
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Stars at night
      if (isNight) {
        ctx.save();
        const starSeed = 42;
        for (let i = 0; i < 200; i++) {
          const sx = ((i * 137.508 + starSeed) % 1) * W;
          const sy = ((i * 251.317 + starSeed) % 0.55) * H;
          const bri = 0.3 + 0.7 * ((i * 73.21) % 1);
          const twinkle = 0.6 + 0.4 * Math.sin(timestamp / 1000 + i);
          ctx.globalAlpha = bri * twinkle * 0.8;
          ctx.fillStyle = '#ffffff';
          ctx.beginPath();
          ctx.arc(sx, sy, (i % 3 === 0 ? 1.2 : 0.7), 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.restore();

        // Moon
        const moonX = W * 0.75, moonY = H * 0.18;
        const moonGlow = ctx.createRadialGradient(moonX, moonY, 0, moonX, moonY, 60);
        moonGlow.addColorStop(0, 'rgba(200,210,230,0.15)');
        moonGlow.addColorStop(1, 'rgba(200,210,230,0)');
        ctx.fillStyle = moonGlow;
        ctx.fillRect(moonX - 60, moonY - 60, 120, 120);
        ctx.fillStyle = '#dde8f0';
        ctx.beginPath(); ctx.arc(moonX, moonY, 22, 0, Math.PI * 2); ctx.fill();
      } else {
        // Sun glow
        const sunX = W * 0.72, sunY = H * 0.2;
        if (season !== 'Winter') {
          const sunGlow = ctx.createRadialGradient(sunX, sunY, 0, sunX, sunY, 180);
          sunGlow.addColorStop(0, 'rgba(255,240,180,0.18)');
          sunGlow.addColorStop(0.4, 'rgba(255,220,120,0.06)');
          sunGlow.addColorStop(1, 'rgba(255,200,80,0)');
          ctx.fillStyle = sunGlow;
          ctx.fillRect(0, 0, W, H * 0.5);
        }
      }

      // Terrain
      const horizonY = H * 0.42;
      const terrainH = H - horizonY;
      const driftX = Math.sin(timestamp * 0.00007) * 8;

      if (heightMap.current.length > 0) {
        for (let row = 0; row < ROWS; row++) {
          const t = row / ROWS;
          const y0 = horizonY + t * t * terrainH;
          const y1 = horizonY + ((row + 1) / ROWS) * ((row + 1) / ROWS) * terrainH;

          for (let col = 0; col < COLS; col++) {
            const x0 = (col / COLS) * W + driftX - 20;
            const x1 = ((col + 1) / COLS) * W + driftX - 20;

            const h = (heightMap.current[row][col] + heightMap.current[row][col + 1] +
                       heightMap.current[row + 1][col] + heightMap.current[row + 1][col + 1]) / 4;
            const elevation = (h + 0.5) * 0.5;

            const terr = palette.terrain;
            const ci = Math.min(Math.floor(elevation * (terr.length - 1)), terr.length - 2);
            const blend = (elevation * (terr.length - 1)) - ci;

            const light = 0.3 + elevation * 0.6 + t * 0.2;
            const shade = isNight ? light * 0.4 : light;

            const hexToRgb = (hex: string) => {
              const r = parseInt(hex.slice(1, 3), 16);
              const g = parseInt(hex.slice(3, 5), 16);
              const b = parseInt(hex.slice(5, 7), 16);
              return [r, g, b];
            };
            const c0 = hexToRgb(terr[ci]);
            const c1 = hexToRgb(terr[Math.min(ci + 1, terr.length - 1)]);
            const rc = Math.round(lerp(c0[0], c1[0], blend) * shade);
            const gc = Math.round(lerp(c0[1], c1[1], blend) * shade);
            const bc = Math.round(lerp(c0[2], c1[2], blend) * shade);

            ctx.fillStyle = `rgb(${Math.min(255, rc)},${Math.min(255, gc)},${Math.min(255, bc)})`;
            ctx.fillRect(Math.floor(x0), Math.floor(y0), Math.ceil(x1 - x0) + 1, Math.ceil(y1 - y0) + 1);

            const fogA = t * 0.3;
            if (fogA > 0.05) {
              const fogColor = season === 'Winter' ? '20,30,50' : '20,40,20';
              ctx.fillStyle = `rgba(${fogColor},${fogA})`;
              ctx.fillRect(Math.floor(x0), Math.floor(y0), Math.ceil(x1 - x0) + 1, Math.ceil(y1 - y0) + 1);
            }
          }
        }
      }

      animationFrameId = requestAnimationFrame(draw);
    };

    animationFrameId = requestAnimationFrame(draw);

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [season, isNight]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full z-0"
    />
  );
};

export default Terrain;
