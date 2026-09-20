import React from 'react';
import { 
  Navigation, 
  ShieldCheck, 
  AlertTriangle, 
  Clock, 
  MapPin, 
  Compass, 
  Ship, 
  ArrowRight,
  Zap
} from 'lucide-react';
import { playDispatchAck } from '../services/audioAlerts';

export default function RouteOptimizer({ 
  scenario, 
  selectedIncident, 
  activeRoute, 
  selectedHub, 
  setSelectedHub, 
  onCalculateRoute,
  onLaunchDispatch 
}) {
  const hubs = scenario.reliefHubs || [];

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl text-xs space-y-3">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-blue-600/20 text-blue-400 border border-blue-500/30">
            <Navigation className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">A* Safe-Corridor Route Optimizer</h3>
            <p className="text-[11px] text-slate-400">Dynamic obstacle avoidance around flood zones</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/30">
          GIS GRAPH ROUTER
        </span>
      </div>

      {/* Origin & Destination Selectors */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {/* Origin Hub */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            📍 Origin Relief Hub:
          </label>
          <select
            value={selectedHub?.id || (hubs[0] && hubs[0].id) || ''}
            onChange={(e) => {
              const hub = hubs.find(h => h.id === e.target.value);
              setSelectedHub(hub);
            }}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            {hubs.map(h => (
              <option key={h.id} value={h.id}>
                {h.name} ({h.fleet.activeBoats} Boats, {h.fleet.activeDrones} Drones)
              </option>
            ))}
          </select>
        </div>

        {/* Target Incident */}
        <div>
          <label className="block text-[11px] font-semibold text-slate-400 mb-1">
            🎯 Target SOS Incident:
          </label>
          <div className="p-2 rounded-xl bg-slate-800 border border-slate-700 text-slate-200 text-xs flex items-center justify-between">
            <span className="truncate">
              {selectedIncident ? `${selectedIncident.id} - ${selectedIncident.address}` : 'Select an SOS from list or map'}
            </span>
          </div>
        </div>
      </div>

      {/* Calculate Route Action Button */}
      <button
        onClick={onCalculateRoute}
        disabled={!selectedIncident}
        className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
          selectedIncident 
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30' 
            : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'
        }`}
      >
        <Compass className="w-4 h-4 animate-spin" style={{ animationDuration: '6s' }} />
        <span>Calculate AI Safe Extraction Path</span>
      </button>

      {/* Computed Route Telemetry Card */}
      {activeRoute && (
        <div className="p-3 rounded-xl bg-slate-800/80 border border-blue-500/40 space-y-2 animate-fadeIn">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Optimal Safe Path Found</span>
            </span>
            <span className="font-mono text-emerald-400 font-bold">
              ETA: {activeRoute.etaMinutes} mins
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-[11px] font-mono py-1.5 bg-slate-900/80 rounded-lg">
            <div>
              <div className="text-slate-400 text-[10px]">Traversed Dist</div>
              <div className="font-bold text-white">{activeRoute.distanceKm} km</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Direct Vector</div>
              <div className="font-bold text-slate-300">{activeRoute.directDistanceKm} km</div>
            </div>
            <div>
              <div className="text-slate-400 text-[10px]">Detour Buffer</div>
              <div className="font-bold text-amber-400">{activeRoute.hasDetour ? '+2.8 km' : 'Direct'}</div>
            </div>
          </div>

          {/* Avoided Hazards List */}
          {activeRoute.avoidedHazards?.length > 0 && (
            <div className="text-[11px] text-amber-300 bg-amber-500/10 p-2 rounded-lg border border-amber-500/20 space-y-0.5">
              <div className="font-bold flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span>Hazards Successfully Bypassed:</span>
              </div>
              <ul className="list-disc list-inside text-[10px] text-amber-200/90 pl-1">
                {activeRoute.avoidedHazards.map((haz, idx) => (
                  <li key={idx}>{haz}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Launch Mission Button */}
          <button
            onClick={onLaunchDispatch}
            className="w-full py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:brightness-110 text-white font-bold flex items-center justify-center gap-2 shadow-lg shadow-red-600/30 transition"
          >
            <Ship className="w-4 h-4" />
            <span>Launch Rescue Squad & Stream Telemetry</span>
          </button>
        </div>
      )}

    </div>
  );
}
