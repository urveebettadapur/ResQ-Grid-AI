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
  Clock
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
  onOpenSitrepModal
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
    <header className="sticky top-0 z-50 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 px-4 py-2.5 shadow-xl">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        
        {/* Logo & Tactical DEFCON Indicator */}
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-700 shadow-lg shadow-red-500/20 border border-red-400/30">
            <Radio className="w-5 h-5 text-white animate-pulse" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                ResQ-Grid<span className="text-red-500">.AI</span>
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
                LIVE GIS
              </span>
            </div>
            <p className="text-xs text-slate-400 hidden sm:block">
              Autonomous Disaster Response & Satellite Relief Coordinator
            </p>
          </div>
        </div>

        {/* Center: Live Tactical KPI Badges */}
        <div className="hidden lg:flex items-center gap-3 font-mono text-xs">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700/60 text-slate-300">
            <Clock className="w-3.5 h-3.5 text-blue-400" />
            <span>UTC+5:30 <strong className="text-white">{currentTime}</strong></span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300">
            <ShieldAlert className="w-3.5 h-3.5 text-red-400 animate-bounce" />
            <span>Active SOS: <strong className="text-white">{incidentCount}</strong> (<span className="text-red-400 font-bold">{criticalCount} Critical</span>)</span>
          </div>

          {/* Scenario Selector */}
          <select 
            value={activeScenarioKey}
            onChange={(e) => setActiveScenarioKey(e.target.value)}
            className="bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-red-500 cursor-pointer"
          >
            {Object.keys(scenarios).map(key => (
              <option key={key} value={key}>
                📍 {scenarios[key].name} ({scenarios[key].location})
              </option>
            ))}
          </select>
        </div>

        {/* Right Actions: Mode Switcher, SITREP, QR Code, Sound */}
        <div className="flex items-center gap-2">
          {/* View Mode Toggle: Desktop Mission Control vs Mobile Civilian SOS */}
          <div className="bg-slate-800/90 p-1 rounded-xl border border-slate-700 flex items-center shadow-inner">
            <button
              onClick={() => setViewMode('command')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
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
            className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all"
            title="Generate Official Disaster SITREP Report"
          >
            <FileText className="w-3.5 h-3.5 text-blue-400" />
            <span>SITREP</span>
          </button>

          {/* Mobile QR Code Modal Trigger (for Judges) */}
          <button
            onClick={onOpenQrModal}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-600/20 hover:bg-purple-600/30 text-purple-300 border border-purple-500/30 text-xs font-semibold transition-all"
            title="Scan QR Code to open Mobile SOS on Phone"
          >
            <QrCode className="w-3.5 h-3.5 text-purple-400" />
            <span className="hidden md:inline">Phone QR</span>
          </button>

          {/* Sound Mute Toggle */}
          <button
            onClick={handleMuteToggle}
            className={`p-2 rounded-lg border transition-all ${
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
