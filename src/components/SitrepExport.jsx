import React from 'react';
import { 
  FileText, 
  Printer, 
  X, 
  ShieldAlert, 
  CheckCircle2, 
  Users, 
  Droplet, 
  Building2,
  Calendar,
  Clock,
  Download
} from 'lucide-react';

export default function SitrepExport({ scenario, incidents, isOpen, onClose }) {
  if (!isOpen) return null;

  const totalIncidents = incidents.length;
  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL').length;
  const rescuedCount = incidents.filter(i => i.status === 'RESCUED').length;
  const pendingCount = incidents.filter(i => i.status === 'PENDING').length;

  const totalAffected = incidents.reduce((acc, i) => {
    const hc = i.headcount || { adults: 1, children: 0, infants: 0 };
    return acc + (hc.adults || 0) + (hc.children || 0) + (hc.infants || 0);
  }, 0);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto font-sans">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-400" />
            <div>
              <h2 className="font-extrabold text-base text-white">Disaster Situation Report (SITREP)</h2>
              <p className="text-xs text-slate-400">UN OCHA & National Disaster Response Standard Format</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>Print / Export PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Document Body */}
        <div id="sitrep-print-area" className="p-6 overflow-y-auto space-y-5 text-xs text-slate-200">
          
          {/* Document Header */}
          <div className="border-b-2 border-slate-700 pb-3 flex justify-between items-start">
            <div>
              <div className="text-[10px] font-mono text-blue-400 uppercase tracking-widest font-bold">
                OFFICIAL SITUATION REPORT #04
              </div>
              <h1 className="text-lg font-black text-white mt-0.5">
                {scenario.name.toUpperCase()} — {scenario.location.toUpperCase()}
              </h1>
              <p className="text-slate-400 text-xs mt-0.5">Sector: {scenario.region}</p>
            </div>
            <div className="text-right font-mono text-[11px] text-slate-400">
              <div>Date: <strong>{new Date().toLocaleDateString()}</strong></div>
              <div>Time: <strong>{new Date().toLocaleTimeString()} IST</strong></div>
              <div className="text-red-400 font-bold mt-1">STATUS: {scenario.severityLevel}</div>
            </div>
          </div>

          {/* Key Operational Metrics */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              1. Executive Summary & Incident Statistics
            </h3>
            <div className="grid grid-cols-4 gap-2 text-center font-mono">
              <div className="p-2.5 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="text-[10px] text-slate-400 uppercase">Total SOS Beacons</div>
                <div className="text-base font-bold text-white mt-1">{totalIncidents}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-red-500/10 border border-red-500/30">
                <div className="text-[10px] text-red-300 uppercase">Critical Triage</div>
                <div className="text-base font-bold text-red-400 mt-1">{criticalCount}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30">
                <div className="text-[10px] text-emerald-300 uppercase">Rescued / Safe</div>
                <div className="text-base font-bold text-emerald-400 mt-1">{rescuedCount}</div>
              </div>
              <div className="p-2.5 rounded-xl bg-blue-500/10 border border-blue-500/30">
                <div className="text-[10px] text-blue-300 uppercase">Total Headcount</div>
                <div className="text-base font-bold text-blue-400 mt-1">{totalAffected} souls</div>
              </div>
            </div>
          </div>

          {/* Environmental Conditions */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              2. Meteorological & Hydrological Telemetry
            </h3>
            <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 grid grid-cols-3 gap-2">
              <div>Rainfall (24h): <strong className="text-white">{scenario.weather.rainfall}</strong></div>
              <div>Peak Wind: <strong className="text-white">{scenario.weather.windSpeed}</strong></div>
              <div>Water Gauge: <strong className="text-blue-400">{scenario.weather.riverLevel}</strong></div>
            </div>
          </div>

          {/* Active Relief Hubs & Shelter Allocations */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              3. Shelter Capacity & Resource Inventory
            </h3>
            <div className="overflow-x-auto border border-slate-700 rounded-xl">
              <table className="w-full text-left">
                <thead className="bg-slate-800 text-slate-300 font-mono text-[10px] uppercase">
                  <tr>
                    <th className="p-2">Hub Name</th>
                    <th className="p-2">Capacity</th>
                    <th className="p-2">Occupancy</th>
                    <th className="p-2">Water (L)</th>
                    <th className="p-2">Boats / Drones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800 text-slate-200">
                  {scenario.reliefHubs?.map(hub => (
                    <tr key={hub.id} className="hover:bg-slate-800/40">
                      <td className="p-2 font-medium">{hub.name}</td>
                      <td className="p-2 font-mono">{hub.capacity}</td>
                      <td className="p-2 font-mono">{hub.currentOccupancy} ({Math.round((hub.currentOccupancy/hub.capacity)*100)}%)</td>
                      <td className="p-2 font-mono">{hub.supplies.potableWaterLiters.toLocaleString()} L</td>
                      <td className="p-2 font-mono">{hub.fleet.activeBoats} Boats, {hub.fleet.activeDrones} Drones</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Strategic Recommendations */}
          <div>
            <h3 className="font-bold text-slate-300 uppercase tracking-wider text-[11px] mb-2">
              4. AI Tactical Recommendations & Priority Actions
            </h3>
            <ul className="list-disc list-inside space-y-1 text-slate-300 bg-slate-800/40 p-3 rounded-xl border border-slate-700">
              <li>Deploy high-clearance amphibious rescue craft to Sector 4 (Water depth exceeding 2.2m).</li>
              <li>Airstream medical trauma kits with O- Negative blood units to Gauhati Medical Center Hub.</li>
              <li>Maintain offline mesh repeaters across North Bank due to severed optical fiber corridors.</li>
            </ul>
          </div>

        </div>

      </div>
    </div>
  );
}
