import React, { useState, useEffect } from 'react';

const Compass: React.FC = () => {
  const [bearing, setBearing] = useState(0);
  const [drift, setDrift] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setDrift((prev) => prev + (Math.random() - 0.5) * 0.5);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  const handleClick = () => {
    setBearing((prev) => (prev + 45) % 360);
  };

  return (
    <div 
      id="compass" 
      className="fixed bottom-8 left-8 z-50 w-[90px] h-[90px] opacity-85 hover:opacity-100 transition-opacity cursor-pointer drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]"
      onClick={handleClick}
    >
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <radialGradient id="cg" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#2d4a2d" stopOpacity="0.9"/>
            <stop offset="100%" stopColor="#0a160a" stopOpacity="0.95"/>
          </radialGradient>
        </defs>
        {/* Outer ring */}
        <circle cx="50" cy="50" r="48" fill="url(#cg)" stroke="#c8a96e" strokeWidth="0.6" strokeOpacity="0.4"/>
        <circle cx="50" cy="50" r="42" fill="none" stroke="#c8a96e" strokeWidth="0.3" strokeOpacity="0.25"/>
        {/* Tick marks */}
        <g stroke="#c8a96e" strokeOpacity="0.4" strokeWidth="0.5">
          <line x1="50" y1="5" x2="50" y2="11"/>
          <line x1="50" y1="89" x2="50" y2="95"/>
          <line x1="5" y1="50" x2="11" y2="50"/>
          <line x1="89" y1="50" x2="95" y2="50"/>
          {/* Diagonals */}
          <line x1="19" y1="14" x2="22" y2="19"/>
          <line x1="81" y1="14" x2="78" y2="19"/>
          <line x1="19" y1="86" x2="22" y2="81"/>
          <line x1="81" y1="86" x2="78" y2="81"/>
        </g>
        {/* Cardinal letters */}
        <text x="50" y="20" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="8" fill="#c8a96e" letterSpacing="1">N</text>
        <text x="50" y="85" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="#8a7a6a" letterSpacing="1">S</text>
        <text x="83" y="53" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="#8a7a6a" letterSpacing="1">E</text>
        <text x="17" y="53" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="7" fill="#8a7a6a" letterSpacing="1">W</text>
        {/* Needle group (rotatable) */}
        <g 
          style={{ transformOrigin: '50px 50px', transform: `rotate(${bearing + drift}deg)`, transition: 'transform 2s cubic-bezier(0.25, 0.46, 0.45, 0.94)' }}
        >
          {/* North needle (gold) */}
          <polygon points="50,18 46.5,52 50,48 53.5,52" fill="#c8a96e"/>
          {/* South needle (dark) */}
          <polygon points="50,82 46.5,48 50,52 53.5,48" fill="#3d5a3d"/>
          {/* Center cap */}
          <circle cx="50" cy="50" r="4" fill="#0a160a" stroke="#c8a96e" strokeWidth="0.8"/>
          <circle cx="50" cy="50" r="2" fill="#c8a96e"/>
        </g>
        {/* Degree ring text */}
        <text x="50" y="97" textAnchor="middle" fontFamily="Cinzel,serif" fontSize="5" fill="#5a4e40" letterSpacing="0.5">360°</text>
      </svg>
    </div>
  );
};

export default Compass;
