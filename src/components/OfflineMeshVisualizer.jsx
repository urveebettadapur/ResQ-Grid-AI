import React, { useState, useEffect } from 'react';
import { 
  Radio, 
  WifiOff, 
  Smartphone, 
  Send, 
  CheckCircle2, 
  Server, 
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { getOfflineQueue, clearOfflineQueue, getMeshPeerCount } from '../services/offlineStorage';
import { playSuccessChime } from '../services/audioAlerts';

export default function OfflineMeshVisualizer({ isSimulatedOffline, onSyncOfflinePackets }) {
  const [queue, setQueue] = useState([]);
  const [peerCount, setPeerCount] = useState(4);
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => {
    setQueue(getOfflineQueue());
    setPeerCount(getMeshPeerCount());
  }, [isSimulatedOffline]);

  const handleSyncAll = () => {
    setIsSyncing(true);
    setTimeout(() => {
      onSyncOfflinePackets(queue);
      clearOfflineQueue();
      setQueue([]);
      setIsSyncing(false);
      playSuccessChime();
    }, 1500);
  };

  return (
    <div className="bg-slate-900/80 rounded-2xl border border-slate-800 p-4 shadow-xl space-y-3 text-xs">
      
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <div className="p-1.5 rounded-lg bg-purple-600/20 text-purple-400 border border-purple-500/30">
            <Radio className="w-4 h-4 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-sm text-white">Offline P2P Mesh Network Simulator</h3>
            <p className="text-[11px] text-slate-400">BLE / WiFi-Direct hop relay when cell towers fail</p>
          </div>
        </div>
        <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
          isSimulatedOffline 
            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30 animate-pulse' 
            : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
        }`}>
          {isSimulatedOffline ? 'MESH RELAY ACTIVE' : 'DIRECT 4G LTE'}
        </span>
      </div>

      {/* Visual Mesh Relay Topology Diagram */}
      <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between text-[11px] text-slate-400">
          <span>Relay Topology</span>
          <span className="font-mono text-purple-400 font-bold">{peerCount} Peer Phones in Range</span>
        </div>

        {/* Nodes Visualizer */}
        <div className="flex items-center justify-between gap-1 text-center font-mono text-[10px]">
          {/* Node 1: Citizen Phone */}
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300">
            <Smartphone className="w-4 h-4 text-red-400" />
            <span className="font-bold">Victim Phone</span>
            <span className="text-[9px] text-slate-400">0% Signal</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-purple-400 animate-pulse" />

          {/* Node 2: Mesh Peer Hop 1 */}
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800 border border-purple-500/30 text-purple-300">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Peer Node #1</span>
            <span className="text-[9px] text-slate-400">BLE Hop</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-purple-400 animate-pulse" />

          {/* Node 3: Mesh Peer Hop 2 */}
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-slate-800 border border-purple-500/30 text-purple-300">
            <Radio className="w-4 h-4 text-purple-400" />
            <span>Peer Node #2</span>
            <span className="text-[9px] text-slate-400">WiFi-Direct</span>
          </div>

          <ArrowRight className="w-3.5 h-3.5 text-purple-400 animate-pulse" />

          {/* Node 4: Satellite/Cell Gateway */}
          <div className="flex flex-col items-center gap-1 p-2 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300">
            <Server className="w-4 h-4 text-blue-400" />
            <span className="font-bold">Command Base</span>
            <span className="text-[9px] text-emerald-400">Satellite Sync</span>
          </div>
        </div>
      </div>

      {/* Queued Packets Count & Flush Trigger */}
      <div className="flex items-center justify-between p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60">
        <div>
          <div className="font-bold text-white text-xs">
            Local Outbox: <span className="text-purple-400">{queue.length} Beacons Queued</span>
          </div>
          <p className="text-[10px] text-slate-400">Encrypted in browser IndexedDB cache</p>
        </div>

        {queue.length > 0 && (
          <button
            onClick={handleSyncAll}
            disabled={isSyncing}
            className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 shadow transition"
          >
            <Send className="w-3.5 h-3.5" />
            <span>{isSyncing ? 'Syncing...' : 'Flush to Gateway'}</span>
          </button>
        )}
      </div>

    </div>
  );
}
