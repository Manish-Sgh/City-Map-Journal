import React from 'react';
import { Season } from '../types';
import { SEASONS } from '../constants';

interface TopBarProps {
  season: Season;
  setSeason: (season: Season) => void;
  isNight: boolean;
  setIsNight: (isNight: boolean) => void;
  isSoundOn: boolean;
  setIsSoundOn: (isSoundOn: boolean) => void;
  onOpenJournal: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ 
  season, 
  setSeason, 
  isNight, 
  setIsNight, 
  isSoundOn, 
  setIsSoundOn,
  onOpenJournal
}) => {
  return (
    <div id="topbar" className="fixed top-0 left-0 right-0 h-16 z-[100] flex items-center justify-between px-7 bg-gradient-to-b from-bg-deep/85 to-transparent">
      <div className="logo text-[22px] font-heading font-light tracking-[0.08em] text-ivory drop-shadow-[0_0_30px_rgba(200,169,110,0.4)]">
        Journal <span className="text-gold font-normal">App</span>
      </div>

      <div className="topbar-center flex items-center gap-1.5">
        <div className="season-switcher flex items-center bg-bg-primary/75 border border-border rounded-[40px] p-1 gap-0.5 backdrop-blur-xl">
          {SEASONS.map((s) => (
            <button
              key={s}
              className={`season-btn flex items-center gap-1.5 px-3.5 py-1.5 rounded-[30px] border-none bg-transparent font-ui text-[10px] tracking-[0.12em] cursor-pointer transition-all duration-400 whitespace-nowrap ${
                season === s 
                  ? 'bg-gold/15 text-gold border border-gold/30 shadow-[0_0_12px_rgba(200,169,110,0.5)]' 
                  : 'text-text-muted hover:text-text-primary hover:bg-gold/8'
              }`}
              onClick={() => setSeason(s)}
            >
              <span className="icon text-[13px]">
                {s === 'Spring' ? '🌸' : s === 'Summer' ? '☀️' : s === 'Autumn' ? '🍂' : '❄️'}
              </span>
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="topbar-right flex items-center gap-3">
        <div 
          className={`icon-btn w-[38px] h-[38px] rounded-full border border-border bg-bg-primary/70 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 text-[15px] ${
            isNight ? 'border-gold-dim text-gold' : 'text-text-muted hover:border-border-hover hover:text-gold'
          }`}
          onClick={() => setIsNight(!isNight)}
          title="Toggle Day/Night"
        >
          {isNight ? '🌙' : '🌅'}
        </div>
        <div 
          className={`icon-btn w-[38px] h-[38px] rounded-full border border-border bg-bg-primary/70 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 text-[15px] text-text-muted hover:border-border-hover hover:text-gold`}
          onClick={onOpenJournal}
          title="My Journal"
        >
          📖
        </div>
        <div 
          className={`icon-btn w-[38px] h-[38px] rounded-full border border-border bg-bg-primary/70 backdrop-blur-md flex items-center justify-center cursor-pointer transition-all duration-300 text-[15px] ${
            isSoundOn ? 'border-gold-dim text-gold' : 'text-text-muted hover:border-border-hover hover:text-gold'
          }`}
          onClick={() => setIsSoundOn(!isSoundOn)}
          title="Toggle Sound"
        >
          {isSoundOn ? (
            <div className="flex items-end gap-[2px] h-4">
              <div className="w-[3px] bg-gold rounded-[2px] h-2 animate-[wave_1s_ease-in-out_infinite]" />
              <div className="w-[3px] bg-gold rounded-[2px] h-3.5 animate-[wave_1s_ease-in-out_infinite_0.15s]" />
              <div className="w-[3px] bg-gold rounded-[2px] h-2.5 animate-[wave_1s_ease-in-out_infinite_0.3s]" />
              <div className="w-[3px] bg-gold rounded-[2px] h-4 animate-[wave_1s_ease-in-out_infinite_0.45s]" />
            </div>
          ) : (
            '♪'
          )}
        </div>
      </div>
    </div>
  );
};

export default TopBar;
