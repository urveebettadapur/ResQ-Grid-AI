import React from 'react';
import { 
  Building2, 
  Droplet, 
  Heart, 
  PackageCheck, 
  Ship, 
  Zap, 
  TrendingUp, 
  AlertCircle 
} from 'lucide-react';

export default function ResourceInventory({ scenario }) {
  const hubs = scenario.reliefHubs || [];

  // Calculate aggregated metrics
  const totalCapacity = hubs.reduce((acc, h) => acc + h.capacity, 0);
  const totalOccupancy = hubs.reduce((acc, h) => acc + h.currentOccupancy, 0);
  const totalWater = hubs.reduce((acc, h) => acc + (h.supplies?.potableWaterLiters || 0), 0);
  const totalBlood = hubs.reduce((acc, h) => acc + (h.supplies?.bloodUnitsO_Neg || 0), 0);
  const totalBoats = hubs.reduce((acc, h) => acc + (h.fleet?.rescueBoats || 0), 0);
  const activeBoats = hubs.reduce((acc, h) => acc + (h.fleet?.activeBoats || 0), 0);

  const occupancyPercent = totalCapacity > 0 ? Math.round((totalOccupancy / totalCapacity) * 100) : 0;

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-4 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
            <Building2 className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Relief Hubs & Resource Allocation</h3>
            <p className="text-[11px] text-slate-400">Live inventory balancing & shelter telemetry</p>
          </div>
        </div>
        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
          INVENTORY SYNC
        </span>
      </div>

      {/* Aggregate KPI Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {/* Shelter Capacity */}
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center justify-between">
            <span>Shelter Load</span>
            <span className="font-mono text-emerald-400 font-bold">{occupancyPercent}%</span>
          </div>
          <div className="font-bold text-white text-base mt-1">
            {totalOccupancy.toLocaleString()} <span className="text-xs font-normal text-slate-400">/ {totalCapacity.toLocaleString()}</span>
          </div>
          <div className="w-full bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
            <div 
              className={`h-full rounded-full ${occupancyPercent > 85 ? 'bg-red-500' : 'bg-emerald-500'}`}
              style={{ width: `${occupancyPercent}%` }}
            ></div>
          </div>
        </div>

        {/* Potable Water */}
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Droplet className="w-3 h-3 text-blue-400" />
            <span>Potable Water</span>
          </div>
          <div className="font-bold text-blue-400 text-base mt-1">
            {(totalWater / 1000).toFixed(1)}k <span className="text-xs font-normal text-slate-400">Liters</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Estimated: 4.5 days supply</div>
        </div>

        {/* Blood Supply */}
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Heart className="w-3 h-3 text-red-400" />
            <span>O- Blood Units</span>
          </div>
          <div className="font-bold text-red-400 text-base mt-1">
            {totalBlood} <span className="text-xs font-normal text-slate-400">units</span>
          </div>
          <div className="text-[10px] text-amber-400 mt-1">⚠️ Critical threshold</div>
        </div>

        {/* Fleet Utilization */}
        <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700/60">
          <div className="text-[10px] text-slate-400 uppercase font-semibold flex items-center gap-1">
            <Ship className="w-3 h-3 text-cyan-400" />
            <span>Rescue Fleet</span>
          </div>
          <div className="font-bold text-cyan-400 text-base mt-1">
            {activeBoats} / {totalBoats} <span className="text-xs font-normal text-slate-400">Active</span>
          </div>
          <div className="text-[10px] text-slate-400 mt-1">Deployable reserve: {totalBoats - activeBoats}</div>
        </div>
      </div>

      {/* Individual Hub Cards */}
      <div className="space-y-2 pt-1">
        <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
          Individual Hub Capacities
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
          {hubs.map(hub => {
            const hubOccupancyPct = Math.round((hub.currentOccupancy / hub.capacity) * 100);
            return (
              <div key={hub.id} className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 space-y-1.5">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold text-white text-xs truncate" title={hub.name}>{hub.name}</h5>
                  <span className="font-mono text-[10px] text-slate-400">{hubOccupancyPct}%</span>
                </div>
                <div className="w-full bg-slate-700 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full ${hubOccupancyPct > 80 ? 'bg-red-500' : 'bg-blue-500'}`}
                    style={{ width: `${hubOccupancyPct}%` }}
                  ></div>
                </div>
                <div className="text-[10px] text-slate-300 grid grid-cols-2 gap-1 pt-1 font-mono">
                  <div>Water: <strong>{(hub.supplies.potableWaterLiters/1000).toFixed(0)}k L</strong></div>
                  <div>Boats: <strong>{hub.fleet.activeBoats}/{hub.fleet.rescueBoats}</strong></div>
                  <div>Medic Kits: <strong>{hub.supplies.medicKits}</strong></div>
                  <div>Contact: <strong className="text-blue-400">{hub.contact.slice(-8)}</strong></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
}
