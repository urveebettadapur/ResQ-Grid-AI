import React, { useState } from 'react';
import { 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Navigation, 
  Ship, 
  CheckCircle2, 
  Clock, 
  ChevronDown, 
  ChevronUp, 
  Search, 
  Filter,
  Sparkles,
  Info,
  Camera,
  Volume2,
  Radio
} from 'lucide-react';
import { playDispatchAck, playSuccessChime } from '../services/audioAlerts';

export default function TriageMatrix({ 
  incidents, 
  selectedIncident, 
  onSelectIncident, 
  onDispatchRescue,
  onMarkRescued 
}) {
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedId, setExpandedId] = useState(null);
  const [viewPhotoModalUrl, setViewPhotoModalUrl] = useState(null);

  const getPriorityBadge = (priority, score, isLiveUser) => {
    switch (priority) {
      case 'CRITICAL':
        return (
          <div className="flex items-center gap-1">
            {isLiveUser && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40 animate-pulse">
                LIVE
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">
              CRITICAL ({score})
            </span>
          </div>
        );
      case 'HIGH':
        return (
          <div className="flex items-center gap-1">
            {isLiveUser && (
              <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-purple-500/30 text-purple-300 border border-purple-400/40 animate-pulse">
                LIVE
              </span>
            )}
            <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-orange-500/20 text-orange-400 border border-orange-500/30">
              HIGH ({score})
            </span>
          </div>
        );
      case 'MODERATE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-yellow-500/20 text-yellow-400 border border-yellow-500/30">MODERATE ({score})</span>;
      case 'RESCUED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">RESCUED</span>;
      default:
        return <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-blue-500/20 text-blue-400 border border-blue-500/30">{priority}</span>;
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'TRAPPED_WATER': return '🌊';
      case 'MEDICAL_TRAUMA': return '🚑';
      case 'FOOD_WATER_DEPLETED': return '🍞';
      case 'STRUCTURAL_COLLAPSE': return '🏚️';
      case 'ELDERLY_ISOLATED': return '👵';
      default: return '🆘';
    }
  };

  const filteredIncidents = incidents.filter(item => {
    const matchesCategory = filterCategory === 'ALL' || item.category === filterCategory;
    const matchesSearch = 
      item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.medicalCondition?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full bg-slate-900/80 rounded-2xl border border-slate-800 shadow-xl overflow-hidden">
      
      {/* Header with Search & Filter */}
      <div className="p-3.5 border-b border-slate-800/80 bg-slate-900/90 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-red-600/20 text-red-400 border border-red-500/30">
              <ShieldAlert className="w-4 h-4" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">AI Geo-Triage Priority Feed</h2>
              <p className="text-[11px] text-slate-400">Ranked by Explainable Urgency Scoring Engine</p>
            </div>
          </div>
          <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 border border-slate-700">
            {filteredIncidents.length} Active
          </span>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="Search by ID, location, or injury..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-slate-800/70 border border-slate-700/80 rounded-xl pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-red-500"
          />
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
          {['ALL', 'TRAPPED_WATER', 'MEDICAL_TRAUMA', 'FOOD_WATER_DEPLETED'].map(cat => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-2.5 py-1 rounded-lg font-medium whitespace-nowrap transition text-[11px] ${
                filterCategory === cat
                  ? 'bg-red-600 text-white shadow'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat === 'ALL' ? 'All Incidents' : cat.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {/* Incident List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {filteredIncidents.length === 0 ? (
          <div className="text-center py-10 text-slate-500 text-xs">
            No emergency reports matching current filters.
          </div>
        ) : (
          filteredIncidents.map(incident => {
            const isSelected = selectedIncident?.id === incident.id;
            const isExpanded = expandedId === incident.id;
            const isRescued = incident.status === 'RESCUED';

            return (
              <div
                key={incident.id}
                onClick={() => onSelectIncident(incident)}
                className={`p-3 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-slate-800/90 border-red-500/60 shadow-lg shadow-red-500/10'
                    : 'bg-slate-800/40 border-slate-700/60 hover:bg-slate-800/70'
                }`}
              >
                {/* Top Row: ID, Category & Priority */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="text-base">{getCategoryIcon(incident.category)}</span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-bold text-xs text-white">{incident.id}</span>
                        <span className="text-[10px] text-slate-400 font-mono">• {incident.timestamp}</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    {getPriorityBadge(incident.priority, incident.urgencyScore, incident.isLiveUserSOS)}
                  </div>
                </div>

                {/* Location & Headcount */}
                <p className="text-xs font-medium text-slate-200 mt-2 line-clamp-1">
                  📍 {incident.address}
                </p>

                <div className="flex items-center gap-3 mt-1.5 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <Users className="w-3 h-3 text-blue-400" />
                    <span>{incident.headcount?.adults || 1}A, {incident.headcount?.children || 0}C, {incident.headcount?.infants || 0}I</span>
                  </span>
                  <span>Water: <strong className="text-slate-200">{incident.waterDepth || '1.0m'}</strong></span>
                  {incident.meshHops > 0 && (
                    <span className="text-purple-400">📡 {incident.meshHops} Hops</span>
                  )}
                </div>

                {/* Medical Condition */}
                {incident.medicalCondition && (
                  <p className="text-[11px] text-red-300 mt-1 line-clamp-1">
                    ⚠️ {incident.medicalCondition}
                  </p>
                )}

                {/* REAL Evidence Badges: Photo Thumbnail & Voice Note Player */}
                {(incident.photo || incident.audioNoteUrl) && (
                  <div className="mt-2 p-2 rounded-lg bg-slate-900/90 border border-slate-700/70 flex flex-col gap-2">
                    <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                      Attached Media Evidence
                    </div>
                    <div className="flex items-center gap-3">
                      {incident.photo && (
                        <div 
                          onClick={(e) => {
                            e.stopPropagation();
                            setViewPhotoModalUrl(incident.photo);
                          }}
                          className="relative group cursor-pointer"
                        >
                          <img 
                            src={incident.photo} 
                            alt="Damage evidence" 
                            className="w-12 h-12 rounded-lg object-cover border border-slate-600 group-hover:scale-105 transition"
                          />
                          <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition text-[9px] text-white font-bold">
                            View
                          </div>
                        </div>
                      )}

                      {incident.audioNoteUrl && (
                        <div className="flex-1" onClick={(e) => e.stopPropagation()}>
                          <div className="text-[10px] text-red-300 font-semibold mb-0.5 flex items-center gap-1">
                            <Volume2 className="w-3 h-3 text-red-400" />
                            <span>Victim Voice Note</span>
                          </div>
                          <audio controls src={incident.audioNoteUrl} className="w-full h-7" />
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Action Buttons & AI Rationale Toggle */}
                <div className="flex items-center justify-between gap-2 mt-2.5 pt-2 border-t border-slate-700/50">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setExpandedId(isExpanded ? null : incident.id);
                    }}
                    className="flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-medium"
                  >
                    <Sparkles className="w-3 h-3" />
                    <span>Explain AI Triage</span>
                    {isExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  <div className="flex items-center gap-1.5">
                    {!isRescued ? (
                      <>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onDispatchRescue(incident);
                          }}
                          className="px-2.5 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-[11px] flex items-center gap-1 shadow transition"
                        >
                          <Ship className="w-3 h-3" />
                          <span>Dispatch</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            onMarkRescued(incident.id);
                          }}
                          className="px-2 py-1 rounded-lg bg-emerald-600/20 hover:bg-emerald-600/40 text-emerald-300 border border-emerald-500/30 text-[11px] font-semibold transition"
                          title="Mark Survivor as Rescued"
                        >
                          ✓ Rescued
                        </button>
                      </>
                    ) : (
                      <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Resolved</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Expandable Explainable AI Rationale Breakdown */}
                {isExpanded && (
                  <div className="mt-2.5 p-2.5 rounded-xl bg-slate-900 border border-amber-500/30 text-xs space-y-1.5 animate-fadeIn">
                    <div className="flex items-center gap-1.5 text-amber-400 font-bold text-[11px]">
                      <Info className="w-3.5 h-3.5" />
                      <span>Transparent AI Decision Weights:</span>
                    </div>
                    <p className="text-slate-300 text-[11px]">{incident.aiRationale}</p>
                    <div className="text-[10px] text-slate-500 font-mono pt-1 border-t border-slate-800">
                      Evaluated: Category Risk + Demographics + Flood Vector + Structural Stability
                    </div>
                  </div>
                )}

              </div>
            );
          })
        )}
      </div>

      {/* Photo Enlarger Modal */}
      {viewPhotoModalUrl && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 cursor-pointer"
          onClick={() => setViewPhotoModalUrl(null)}
        >
          <div className="relative max-w-xl max-h-[85vh] overflow-hidden rounded-2xl border border-slate-700 bg-slate-900 p-2">
            <img 
              src={viewPhotoModalUrl} 
              alt="Expanded Damage Evidence" 
              className="max-w-full max-h-[75vh] object-contain rounded-xl mx-auto" 
            />
            <p className="text-center text-xs text-slate-400 mt-2 font-mono">Click anywhere to close</p>
          </div>
        </div>
      )}

    </div>
  );
}
