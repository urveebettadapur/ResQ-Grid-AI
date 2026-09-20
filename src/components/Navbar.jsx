import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  ShieldAlert, 
  Smartphone, 
  Monitor, 
  Volume2, 
  VolumeX, 
  QrCode, 
  Activity, 
  Layers, 
  DownloadCloud,
  FileText,
  Clock,
  ChevronDown,
  BookOpen,
  Presentation
} from 'lucide-react';
import { toggleAudioMute, getAudioMuteState, playRadarPing } from '../services/audioAlerts';

export default function Navbar({ 
  viewMode, 
  setViewMode, 
  activeScenarioKey, 
  setActiveScenarioKey, 
  scenarios, 
  incidentCount, 
  criticalCount,
  onOpenQrModal,
  onOpenSitrepModal,
  onOpenGuideModal
}) {
  const [isMuted, setIsMuted] = useState(getAudioMuteState());
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleMuteToggle = () => {
    const nextState = toggleAudioMute();
    setIsMuted(nextState);
    if (!nextState) playRadarPing();
  };

  return (
    <header className="sticky top-0 z-50 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 px-2 sm:px-4 py-2 shadow-2xl w-full">
      <div className="w-full max-w-[1700px] mx-auto flex items-center justify-between gap-2 sm:gap-3">
        
        {/* Left: Logo & Live Tactical Indicator */}
        <div className="flex items-center gap-2 sm:gap-2.5 shrink-0">
          <div className="relative flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-500/20 border border-red-400/30">
            <Radio className="w-4 h-4 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ResQ-Grid<span className="text-red-500">.AI</span>
              </span>
              <span className="px-1.5 py-0.2 rounded text-[9px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                LIVE GIS
              </span>
            </div>
          </div>
        </div>

        {/* Center: Live Tactical KPI Badges & Scenario Selector */}
        <div className="flex items-center gap-2 font-mono text-xs overflow-x-auto py-0.5">
          
          {/* Time badge */}
          <div className="hidden xl:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300 text-[11px] shrink-0">
            <Clock className="w-3 h-3 text-blue-400" />
            <span>UTC+5:30 <strong className="text-white">{currentTime}</strong></span>
          </div>

          {/* Active SOS badge */}
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 text-[11px] shrink-0">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>Active SOS: <strong className="text-white">{incidentCount}</strong> (<span className="text-red-400 font-bold">{criticalCount} Critical</span>)</span>
          </div>

          {/* Scenario Selector */}
          <div className="relative shrink-0 max-w-[160px] sm:max-w-xs">
            <select 
              value={activeScenarioKey}
              onChange={(e) => setActiveScenarioKey(e.target.value)}
              className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2 py-1 pr-5 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer w-full truncate"
            >
              {Object.keys(scenarios).map(key => (
                <option key={key} value={key}>
                  📍 {scenarios[key].name} ({scenarios[key].location.split('&')[0]})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right Actions: Presentation, Protocols, Mode Switcher, SITREP, QR Code, Sound */}
        <div className="flex items-center gap-1 sm:gap-1.5 shrink-0">
          
          {/* Pitch Deck PPT Presentation Link */}
          <a
            href="/presentation.html"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all shrink-0"
            title="Open Official 7-Slide Pitch Deck (PPT)"
          >
            <Presentation className="w-3.5 h-3.5 text-indigo-400" />
            <span className="hidden lg:inline">Pitch Slides</span>
          </a>

          {/* Disaster Protocol Guide Button */}
          <button
            onClick={onOpenGuideModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 border border-emerald-500/30 text-xs font-semibold transition-all shrink-0"
            title="Disaster Response Quick Guide (NIDM Protocols)"
          >
            <BookOpen className="w-3.5 h-3.5 text-emerald-400" />
            <span className="hidden lg:inline">Protocols</span>
          </button>

          {/* View Mode Toggle: Desktop Mission Control vs Mobile Civilian SOS */}
          <div className="bg-slate-800/90 p-0.5 sm:p-1 rounded-xl border border-slate-700 flex items-center shadow-inner shrink-0">
            <button
              onClick={() => setViewMode('command')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'command'
                  ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mission Control Satellite Command"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Command Hub</span>
            </button>

            <button
              onClick={() => setViewMode('mobile')}
              className={`flex items-center gap-1 px-2 sm:px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                viewMode === 'mobile'
                  ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
              title="Mobile Civilian SOS PWA View"
            >
              <Smartphone className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Civilian SOS</span>
            </button>
          </div>

          {/* SITREP Button */}
          <button
            onClick={onOpenSitrepModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all shrink-0"
            title="Generate Official Disaster SITREP Report"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span className="hidden sm:inline">SITREP</span>
          </button>

          {/* Mobile QR Code Modal Trigger */}
          <button
            onClick={onOpenQrModal}
            className="flex items-center gap-1 px-2 py-1 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all shrink-0"
            title="Scan QR Code to open Mobile SOS on Phone"
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Phone QR</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`p-1.5 rounded-lg border transition-all shrink-0 ${
              isMuted 
                ? 'bg-slate-800 text-slate-500 border-slate-700' 
                : 'bg-slate-800 text-emerald-400 border-emerald-500/40 hover:bg-slate-700'
            }`}
            title={isMuted ? "Unmute Tactical Sonar Sounds" : "Mute Sound Effects"}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4 animate-pulse" />}
          </button>
        </div>

      </div>
    </header>
  );
}
