import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Terrain from './components/Terrain';
import TopBar from './components/TopBar';
import Birds from './components/Birds';
import Compass from './components/Compass';
import Atmosphere from './components/Atmosphere';
import AmbientSound from './components/AmbientSound';
import { Season, Entry } from './types';
import { DEMO_LOCATIONS } from './constants';

const App: React.FC = () => {
  const [season, setSeason] = useState<Season>('Summer');
  const [isNight, setIsNight] = useState<boolean>(false);
  const [isSoundOn, setIsSoundOn] = useState<boolean>(false);
  const [isIntroOpen, setIsIntroOpen] = useState<boolean>(true);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(false);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);
  const [isEntryModalOpen, setIsEntryModalOpen] = useState<boolean>(false);
  const [selectedLocation, setSelectedLocation] = useState<any>(null);
  const [timeStr, setTimeStr] = useState<string>('--:--');
  const [dateStr, setDateStr] = useState<string>('');
  const [entries, setEntries] = useState<Entry[]>([]);
  const [newEntry, setNewEntry] = useState<Partial<Entry>>({
    title: '',
    body: '',
    mood: '',
    tags: [],
  });
  const [toast, setToast] = useState<string | null>(null);

  // Update Time
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const days = ['SUNDAY', 'MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY'];
      const months = ['JANUARY', 'FEBRUARY', 'MARCH', 'APRIL', 'MAY', 'JUNE', 'JULY', 'AUGUST', 'SEPTEMBER', 'OCTOBER', 'NOVEMBER', 'DECEMBER'];
      setDateStr(`${days[now.getDay()]}, ${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`);
      const h = String(now.getHours()).padStart(2, '0');
      const m = String(now.getMinutes()).padStart(2, '0');
      setTimeStr(`${h}:${m}`);
    };
    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2400);
  };

  const handleOpenLocation = (loc: any) => {
    setSelectedLocation(loc);
    setIsRightSidebarOpen(true);
  };

  const handleSaveEntry = () => {
    if (!newEntry.title?.trim()) {
      showToast('Please add a title');
      return;
    }
    const entry: Entry = {
      id: Math.random().toString(36).substr(2, 9),
      title: newEntry.title || '',
      body: newEntry.body || '',
      mood: newEntry.mood || '😊',
      location: {
        name: selectedLocation?.name || 'Unknown Location',
        lat: selectedLocation?.lat || '0',
        lng: selectedLocation?.lng || '0',
        x: selectedLocation?.x || '50%',
        y: selectedLocation?.y || '50%',
      },
      tags: newEntry.tags || [],
      date: new Date().toLocaleString(),
      weather: '☀️ 22°C',
      season: season,
    };
    setEntries([entry, ...entries]);
    setIsEntryModalOpen(false);
    setNewEntry({ title: '', body: '', mood: '', tags: [] });
    showToast('Entry saved ✦');
  };

  return (
    <div className={`relative w-full h-screen overflow-hidden season-${season.toLowerCase()}`}>
      {/* CANVASES */}
      <Terrain season={season} isNight={isNight} />
      {!isNight && <Birds isNight={isNight} />}
      
      {/* ATMOSPHERE */}
      <Atmosphere season={season} isNight={isNight} />

      {/* TOP BAR */}
      <TopBar 
        season={season} 
        setSeason={(s) => { setSeason(s); showToast(`${s} mode`); }} 
        isNight={isNight} 
        setIsNight={(n) => { setIsNight(n); showToast(n ? 'Night mode' : 'Day mode'); }} 
        isSoundOn={isSoundOn} 
        setIsSoundOn={setIsSoundOn}
        onOpenJournal={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
      />

      {/* DATE/TIME */}
      <div id="datetime-display" className="fixed top-20 right-7 z-90 text-right opacity-70">
        <div className="date-text font-ui text-[10px] tracking-[0.18em] text-text-muted">{dateStr}</div>
        <div className="time-text font-heading text-[26px] font-light text-ivory tracking-[0.06em] leading-none">{timeStr}</div>
      </div>

      {/* COMPASS */}
      <Compass />

      {/* AMBIENT SOUND */}
      <AmbientSound season={season} isNight={isNight} isSoundOn={isSoundOn} />

      {/* ADD ENTRY BUTTON */}
      <button 
        id="add-entry-btn" 
        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-90 flex items-center gap-2.5 px-8 py-3.5 rounded-[2px] border border-gold-dim bg-bg-primary/85 backdrop-blur-xl cursor-pointer transition-all duration-400 font-ui text-[11px] tracking-[0.22em] text-gold uppercase shadow-[0_0_40px_rgba(200,169,110,0.12)] hover:bg-gold/10 hover:border-gold/50 hover:shadow-[0_0_60px_rgba(200,169,110,0.2)]"
        onClick={() => setIsEntryModalOpen(true)}
      >
        <div className="add-icon w-[18px] h-[18px] rounded-full border border-gold flex items-center justify-center text-[14px] leading-none">+</div>
        Add Entry
      </button>

      {/* COORDINATE DISPLAY */}
      <div id="coord-display" className="fixed bottom-[88px] right-8 z-90 font-ui text-[9px] tracking-[0.12em] text-text-dim text-right pointer-events-none">
        <div>28.6139° N, 77.2090° E</div>
        <div className="mt-0.5">ZOOM 14 · PITCH 45°</div>
      </div>

      {/* LEFT SIDEBAR TOGGLE */}
      <div 
        className="left-sidebar-toggle fixed top-1/2 left-0 -translate-y-1/2 z-[81] w-[22px] h-[60px] bg-bg-primary/85 border border-border border-l-0 rounded-r-[4px] flex items-center justify-center cursor-pointer text-text-muted text-[10px] [writing-mode:vertical-rl] tracking-[0.15em] font-ui transition-all duration-300 backdrop-blur-md hover:text-gold hover:border-border-hover"
        style={{ left: isLeftSidebarOpen ? '300px' : '0' }}
        onClick={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
      >
        JOURNAL
      </div>

      {/* LEFT SIDEBAR */}
      <motion.div 
        id="left-sidebar" 
        className="fixed top-16 left-0 bottom-0 w-[300px] z-[80] bg-sidebar-bg border-r border-border backdrop-blur-[20px] flex flex-col"
        initial={false}
        animate={{ x: isLeftSidebarOpen ? 0 : -300 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="left-header p-5 pb-3.5 border-b border-border flex-shrink-0">
          <div className="left-header-title font-heading text-[20px] font-light text-ivory">My Journal</div>
          <div className="left-header-sub font-ui text-[9px] tracking-[0.18em] text-text-dim mt-0.5 uppercase">{season} 2026 · {entries.length} ENTRIES</div>
        </div>
        <div className="left-body flex-1 overflow-y-auto p-4">
          <div className="sidebar-section-title font-ui text-[9px] tracking-[0.22em] text-text-muted uppercase mb-3.5 pb-2 border-b border-border">Recent Entries</div>
          {entries.map((entry) => (
            <div key={entry.id} className="entry-card p-3.5 mb-2.5 border border-border rounded-[2px] bg-white/2 cursor-pointer transition-all duration-300 hover:border-border-hover hover:bg-gold/4">
              <div className="entry-date font-ui text-[9px] tracking-[0.14em] text-gold mb-1.5 uppercase">{entry.date}</div>
              <div className="entry-title font-heading text-[17px] font-normal text-text-primary mb-1.5 leading-[1.3]">{entry.title}</div>
              <div className="entry-preview font-body text-[14px] text-text-muted line-clamp-2 leading-[1.5]">{entry.body}</div>
              <div className="entry-meta flex items-center gap-2.5 mt-2">
                <span className="entry-mood text-[14px]">{entry.mood}</span>
                <span className="entry-weather font-ui text-[9px] tracking-[0.1em] text-text-dim uppercase">{entry.weather}</span>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* RIGHT SIDEBAR */}
      <motion.div 
        id="right-sidebar" 
        className="fixed top-16 right-0 bottom-0 w-[380px] z-[80] bg-sidebar-bg border-l border-border backdrop-blur-[20px] flex flex-col"
        initial={false}
        animate={{ x: isRightSidebarOpen ? 0 : 380 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
      >
        <div className="sidebar-header p-6 pb-4 border-b border-border flex-shrink-0 relative">
          <div className="sidebar-location-img w-full h-[140px] object-cover rounded-[2px] mb-4 bg-gradient-to-br from-bg-tertiary to-forest-mid flex items-center justify-center overflow-hidden relative">
            {/* Mini terrain placeholder */}
            <div className="w-full h-full bg-forest-mid/20" />
          </div>
          <div className="location-tag font-ui text-[9px] tracking-[0.2em] text-gold uppercase mb-1.5">📍 Location Details</div>
          <div className="location-name font-heading text-[24px] font-normal text-ivory mb-1 leading-[1.2]">{selectedLocation?.name || 'Select a location'}</div>
          <div className="location-coords font-body text-[13px] text-text-dim tracking-[0.04em]">{selectedLocation?.lat}, {selectedLocation?.lng}</div>
          <button 
            className="sidebar-close absolute top-5 right-5 w-7 h-7 rounded-full border border-border bg-transparent color-text-muted text-[14px] flex items-center justify-center cursor-pointer transition-all duration-200 hover:border-gold-dim hover:text-gold"
            onClick={() => setIsRightSidebarOpen(false)}
          >
            ✕
          </button>
        </div>
        <div className="sidebar-body flex-1 overflow-y-auto p-5 pb-6">
          <div className="sidebar-section-title font-ui text-[9px] tracking-[0.22em] text-text-muted uppercase mb-3.5 pb-2 border-b border-border">Journal Entries Here</div>
          {entries.filter(e => e.location.name === selectedLocation?.name).map((entry) => (
            <div key={entry.id} className="entry-card p-3.5 mb-2.5 border border-border rounded-[2px] bg-white/2 cursor-pointer transition-all duration-300 hover:border-border-hover hover:bg-gold/4">
              <div className="entry-date font-ui text-[9px] tracking-[0.14em] text-gold mb-1.5 uppercase">{entry.date}</div>
              <div className="entry-title font-heading text-[17px] font-normal text-text-primary mb-1.5 leading-[1.3]">{entry.title}</div>
              <div className="entry-preview font-body text-[14px] text-text-muted line-clamp-2 leading-[1.5]">{entry.body}</div>
              <div className="entry-meta flex items-center gap-2.5 mt-2">
                <span className="entry-mood text-[14px]">{entry.mood}</span>
                <span className="entry-weather font-ui text-[9px] tracking-[0.1em] text-text-dim uppercase">{entry.weather} · {entry.season}</span>
              </div>
            </div>
          ))}
          <div className="mt-5 sidebar-section-title font-ui text-[9px] tracking-[0.22em] text-text-muted uppercase mb-3.5 pb-2 border-b border-border">About This Place</div>
          <p className="text-[14px] text-text-muted leading-[1.65] font-body">
            {selectedLocation?.description || 'A beautiful location in your world. Document your memories here.'}
          </p>
        </div>
      </motion.div>

      {/* MAP PINS */}
      {DEMO_LOCATIONS.map((loc, i) => (
        <div 
          key={i} 
          className="map-pin absolute z-50 cursor-pointer -translate-x-1/2 -translate-y-full group"
          style={{ left: loc.x, top: loc.y }}
          onClick={() => handleOpenLocation(loc)}
        >
          <div className="pin-label font-ui text-[9px] tracking-[0.12em] text-gold bg-bg-primary/85 border border-border px-2 py-0.5 rounded-[2px] whitespace-nowrap text-center mb-1 backdrop-blur-md opacity-0 transition-opacity duration-300 group-hover:opacity-100">
            {loc.name}
          </div>
          <div className="pin-dot w-3 h-3 rounded-full bg-gold border-2 border-gold/40 mx-auto shadow-[0_0_0_0_rgba(200,169,110,0.4)] animate-[pinPulse_2.5s_ease-in-out_infinite] relative z-[2] group-hover:shadow-[0_0_0_8px_rgba(200,169,110,0.15)]" />
        </div>
      ))}

      {/* INTRO OVERLAY */}
      <AnimatePresence>
        {isIntroOpen && (
          <motion.div 
            id="intro" 
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-bg-deep/92 backdrop-blur-[4px]"
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <motion.div 
              className="intro-subtitle font-ui text-[11px] tracking-[0.35em] text-gold uppercase mb-5"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 1 }}
            >
              A Personal Journal
            </motion.div>
            <motion.div 
              className="intro-title font-heading text-[clamp(42px,6vw,72px)] font-light text-ivory text-center leading-[1.15] mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Your days, <em className="text-gold not-italic">mapped</em><br />to the world
            </motion.div>
            <motion.div 
              className="intro-desc font-body text-[17px] text-text-muted mb-12 tracking-[0.03em]"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 1 }}
            >
              Every place holds a story. Begin yours.
            </motion.div>
            <motion.div 
              className="intro-btns flex gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9, duration: 1 }}
            >
              <button 
                className="btn-primary px-9 py-3.5 rounded-[2px] border border-gold bg-transparent font-ui text-[11px] tracking-[0.2em] text-gold cursor-pointer transition-all duration-400 uppercase hover:bg-gold/12"
                onClick={() => { setIsIntroOpen(false); setIsSoundOn(true); }}
              >
                Explore the Map
              </button>
              <button 
                className="btn-secondary px-9 py-3.5 rounded-[2px] border border-border bg-transparent font-ui text-[11px] tracking-[0.2em] text-text-muted cursor-pointer transition-all duration-400 uppercase hover:text-text-primary hover:border-border-hover"
                onClick={() => setIsIntroOpen(false)}
              >
                Start without audio
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ENTRY MODAL */}
      <AnimatePresence>
        {isEntryModalOpen && (
          <div id="entry-modal" className="fixed inset-0 z-[150] flex items-center justify-center">
            <motion.div 
              className="modal-backdrop absolute inset-0 bg-bg-deep/70 backdrop-blur-[8px]"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsEntryModalOpen(false)}
            />
            <motion.div 
              className="modal-panel relative z-[1] w-[min(560px,92vw)] max-h-[85vh] bg-bg-primary/96 border border-border rounded-[2px] overflow-y-auto p-9"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 30 }}
            >
              <div className="modal-title font-ui text-[11px] tracking-[0.25em] text-gold mb-6 uppercase">✦ New Journal Entry</div>
              <div className="form-field mb-5">
                <label className="field-label font-ui text-[9px] tracking-[0.18em] text-text-dim uppercase mb-2 block">Title</label>
                <input 
                  className="field-input w-full bg-white/3 border border-border rounded-[2px] p-[11px_14px] text-text-primary font-body text-[16px] transition-all outline-none focus:border-gold/40 placeholder:text-text-dim placeholder:italic" 
                  type="text" 
                  placeholder="What happened today..."
                  value={newEntry.title}
                  onChange={(e) => setNewEntry({ ...newEntry, title: e.target.value })}
                />
              </div>
              <div className="form-field mb-5">
                <label className="field-label font-ui text-[9px] tracking-[0.18em] text-text-dim uppercase mb-2 block">Entry</label>
                <textarea 
                  className="field-input w-full bg-white/3 border border-border rounded-[2px] p-[11px_14px] text-text-primary font-body text-[16px] transition-all outline-none focus:border-gold/40 placeholder:text-text-dim placeholder:italic resize-vertical min-h-[110px] leading-[1.6]" 
                  placeholder="Write freely... what did you see, feel, think?"
                  value={newEntry.body}
                  onChange={(e) => setNewEntry({ ...newEntry, body: e.target.value })}
                />
              </div>
              <div className="form-field mb-5">
                <label className="field-label font-ui text-[9px] tracking-[0.18em] text-text-dim uppercase mb-2 block">Mood</label>
                <div className="mood-picker flex gap-2.5 flex-wrap">
                  {['😊', '😔', '🧘', '🤩', '🥱', '😤'].map((m) => (
                    <button 
                      key={m}
                      className={`mood-opt w-[42px] h-[42px] rounded-full border border-border bg-transparent text-[20px] cursor-pointer transition-all flex items-center justify-center hover:border-border-hover hover:scale-110 ${newEntry.mood === m ? 'border-gold bg-gold/10' : ''}`}
                      onClick={() => setNewEntry({ ...newEntry, mood: m })}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              </div>
              <div className="form-field mb-5">
                <label className="field-label font-ui text-[9px] tracking-[0.18em] text-text-dim uppercase mb-2 block">Location (click map to pin)</label>
                <input 
                  className="field-input w-full bg-white/3 border border-border rounded-[2px] p-[11px_14px] text-text-primary font-body text-[16px] transition-all outline-none focus:border-gold/40 placeholder:text-text-dim placeholder:italic" 
                  type="text" 
                  placeholder="📍 Click on the map to set location" 
                  value={selectedLocation ? `${selectedLocation.name} (${selectedLocation.lat}, ${selectedLocation.lng})` : ''}
                  readOnly 
                />
              </div>
              <div className="form-field mb-5">
                <label className="field-label font-ui text-[9px] tracking-[0.18em] text-text-dim uppercase mb-2 block">Tags</label>
                <input 
                  className="field-input w-full bg-white/3 border border-border rounded-[2px] p-[11px_14px] text-text-primary font-body text-[16px] transition-all outline-none focus:border-gold/40 placeholder:text-text-dim placeholder:italic" 
                  type="text" 
                  placeholder="#walk  #nature  #morning"
                  value={newEntry.tags?.join(' ')}
                  onChange={(e) => setNewEntry({ ...newEntry, tags: e.target.value.split(' ') })}
                />
              </div>
              <div className="modal-actions flex gap-3 mt-7">
                <button 
                  className="modal-save flex-1 p-3.5 rounded-[2px] border border-gold-dim bg-gold/8 font-ui text-[11px] tracking-[0.18em] text-gold cursor-pointer transition-all uppercase hover:bg-gold/15"
                  onClick={handleSaveEntry}
                >
                  Save Entry
                </button>
                <button 
                  className="modal-cancel p-[13px_24px] rounded-[2px] border border-border bg-transparent font-ui text-[11px] tracking-[0.15em] text-text-muted cursor-pointer transition-all hover:text-text-primary"
                  onClick={() => setIsEntryModalOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* TOAST */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            className="toast fixed top-20 left-1/2 -translate-x-1/2 z-[300] bg-bg-primary/95 border border-gold-dim p-[12px_24px] rounded-[2px] font-ui text-[10px] tracking-[0.18em] text-gold backdrop-blur-xl pointer-events-none"
            initial={{ opacity: 0, y: -10, x: '-50%' }}
            animate={{ opacity: 1, y: 0, x: '-50%' }}
            exit={{ opacity: 0 }}
          >
            {toast}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default App;
