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
  ShieldAlert,
  Repeat,
  Zap,
  Activity,
  Terminal
} from 'lucide-react';
import { hopRelayManager } from '../services/hopRelayEngine';
import { playSosAlert, playSuccessChime, playRadarPing } from '../services/audioAlerts';

export default function HopRelayTerminal({ onRelayPacketToCentral, isSimulatedOffline }) {
  const [logs, setLogs] = useState([]);
  const [activePackets, setActivePackets] = useState([]);
  const [myNodeId, setMyNodeId] = useState(hopRelayManager.deviceId);
  const [isRelayingSimulation, setIsRelayingSimulation] = useState(false);

  useEffect(() => {
    // Subscribe to real mesh events
    const unsubscribe = hopRelayManager.subscribe((packet, eventType) => {
      const logEntry = {
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        eventType,
        sosId: packet.sos_id,
        sender: packet.sender_device_id,
        hopsRemaining: packet.hops_remaining,
        category: packet.emergency_type || packet.category || 'EMERGENCY',
        relayChain: packet.relay_chain || [packet.sender_device_id]
      };

      setLogs(prev => [logEntry, ...prev.slice(0, 25)]);
      setActivePackets(prev => {
        const filtered = prev.filter(p => p.sos_id !== packet.sos_id);
        return [packet, ...filtered];
      });

      if (eventType === 'RECEIVED') {
        playRadarPing();
      }

      // Auto-forward to Central GIS Dashboard if we act as a gateway
      if (onRelayPacketToCentral) {
        onRelayPacketToCentral(packet);
      }
    });

    return () => unsubscribe();
  }, [onRelayPacketToCentral]);

  // Simulate Multi-Hop Peer Propagation (Device A ➔ Device B ➔ Device C ➔ Gateway)
  const handleSimulateMultiHop = () => {
    setIsRelayingSimulation(true);
    playSosAlert();

    const originPacket = {
      sos_id: `SOS-MESH-${Math.floor(1000 + Math.random() * 9000)}`,
      sender_device_id: `CIVILIAN-${Math.floor(100 + Math.random() * 900)}`,
      emergency_type: 'TRAPPED_WATER',
      message: 'Submerged building 2nd floor, water rising rapidly!',
      location: [26.1950, 91.7580],
      waterDepth: '2.2m',
      headcount: { adults: 3, children: 2, infants: 1, pets: 0 },
      address: 'Brahmaputra Embankment Sector 3',
      hops_remaining: 5,
      relay_chain: ['NODE-PHONE-A']
    };

    // Step 1: Originated on Device A
    setLogs(prev => [{
      id: Math.random().toString(36).substring(2, 9),
      time: new Date().toLocaleTimeString(),
      eventType: 'ORIGINATED',
      sosId: originPacket.sos_id,
      sender: originPacket.sender_device_id,
      hopsRemaining: 5,
      category: 'TRAPPED_WATER',
      relayChain: ['NODE-PHONE-A']
    }, ...prev]);

    // Step 2: Hop 1 to Peer Phone B after 800ms
    setTimeout(() => {
      const hop1Packet = {
        ...originPacket,
        hops_remaining: 4,
        last_relayed_by: 'NODE-PHONE-B',
        relay_chain: ['NODE-PHONE-A', 'NODE-PHONE-B']
      };
      playRadarPing();
      setLogs(prev => [{
        id: Math.random().toString(36).substring(2, 9),
        time: new Date().toLocaleTimeString(),
        eventType: 'HOP_RELAY',
        sosId: hop1Packet.sos_id,
        sender: 'NODE-PHONE-B',
        hopsRemaining: 4,
        category: 'TRAPPED_WATER',
        relayChain: hop1Packet.relay_chain
      }, ...prev]);

      // Step 3: Hop 2 to Volunteer Walkie-Node C after 1600ms
      setTimeout(() => {
        const hop2Packet = {
          ...hop1Packet,
          hops_remaining: 3,
          last_relayed_by: 'NODE-VOLUNTEER-C',
          relay_chain: ['NODE-PHONE-A', 'NODE-PHONE-B', 'NODE-VOLUNTEER-C']
        };
        playRadarPing();
        setLogs(prev => [{
          id: Math.random().toString(36).substring(2, 9),
          time: new Date().toLocaleTimeString(),
          eventType: 'HOP_RELAY',
          sosId: hop2Packet.sos_id,
          sender: 'NODE-VOLUNTEER-C',
          hopsRemaining: 3,
          category: 'TRAPPED_WATER',
          relayChain: hop2Packet.relay_chain
        }, ...prev]);

        // Step 4: Reached Command Base Satellite Gateway after 2400ms
        setTimeout(() => {
          const finalPacket = {
            ...hop2Packet,
            hops_remaining: 2,
            last_relayed_by: myNodeId,
            relay_chain: [...hop2Packet.relay_chain, `${myNodeId} (GATEWAY)`],
            id: hop2Packet.sos_id,
            priority: 'CRITICAL',
            urgencyScore: 95,
            aiRationale: 'Critical priority (95/100): Multi-hop relay received via 3 peer nodes. Trapped in 2.2m water with 1 infant.'
          };

          playSuccessChime();
          setLogs(prev => [{
            id: Math.random().toString(36).substring(2, 9),
            time: new Date().toLocaleTimeString(),
            eventType: 'GATEWAY_DELIVERED',
            sosId: finalPacket.sos_id,
            sender: `${myNodeId} (COMMAND GATEWAY)`,
            hopsRemaining: 2,
            category: 'TRAPPED_WATER',
            relayChain: finalPacket.relay_chain
          }, ...prev]);

          if (onRelayPacketToCentral) {
            onRelayPacketToCentral(finalPacket);
          }
          setIsRelayingSimulation(false);
        }, 1000);

      }, 900);

    }, 800);
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
            <h3 className="font-bold text-sm text-white">Hop-to-Hop Mesh Relay Engine</h3>
            <p className="text-[11px] text-slate-400">Zero-Internet peer broadcast & multi-hop forwarding</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/30 font-bold">
            NODE ID: {myNodeId}
          </span>
        </div>
      </div>

      {/* Visual Live Relay Chain Simulation Banner */}
      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2.5">
        <div className="flex items-center justify-between text-[11px] text-slate-300">
          <span className="font-bold flex items-center gap-1 text-purple-300">
            <Activity className="w-3.5 h-3.5" />
            <span>Active Hop-by-Hop Topology</span>
          </span>
          <span className="font-mono text-[10px] text-emerald-400">
            P2P BroadcastChannel Active
          </span>
        </div>

        <div className="flex items-center justify-between gap-1 text-center font-mono text-[10px] overflow-x-auto py-1">
          {/* Node 1 */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-red-950/60 border border-red-500/40 text-red-300 shrink-0">
            <Smartphone className="w-3.5 h-3.5 text-red-400" />
            <span className="font-bold">Origin (0% Net)</span>
            <span className="text-[8px] text-slate-400">Hops: 5</span>
          </div>

          <ArrowRight className="w-3 h-3 text-purple-400 animate-pulse shrink-0" />

          {/* Node 2 */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-800 border border-purple-500/30 text-purple-300 shrink-0">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Peer Hop #1</span>
            <span className="text-[8px] text-slate-400">Hops: 4</span>
          </div>

          <ArrowRight className="w-3 h-3 text-purple-400 animate-pulse shrink-0" />

          {/* Node 3 */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-slate-800 border border-purple-500/30 text-purple-300 shrink-0">
            <Radio className="w-3.5 h-3.5 text-purple-400" />
            <span>Peer Hop #2</span>
            <span className="text-[8px] text-slate-400">Hops: 3</span>
          </div>

          <ArrowRight className="w-3 h-3 text-purple-400 animate-pulse shrink-0" />

          {/* Node 4 (Command Gateway) */}
          <div className="flex flex-col items-center p-1.5 rounded-lg bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 shrink-0">
            <Server className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-bold">Satellite Gateway</span>
            <span className="text-[8px] text-emerald-400">Delivered</span>
          </div>
        </div>

        {/* Multi-Hop Interactive Trigger Button */}
        <button
          onClick={handleSimulateMultiHop}
          disabled={isRelayingSimulation}
          className={`w-full py-2 px-3 rounded-xl font-bold flex items-center justify-center gap-2 transition ${
            isRelayingSimulation
              ? 'bg-purple-700 text-white animate-pulse'
              : 'bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-700 hover:brightness-110 text-white shadow-lg shadow-purple-600/30'
          }`}
        >
          <Repeat className="w-4 h-4 animate-spin" style={{ animationDuration: '4s' }} />
          <span>{isRelayingSimulation ? 'Relaying Packet Across Mesh Hops...' : 'Simulate Multi-Device Hop2Hop Propagation'}</span>
        </button>
      </div>

      {/* Real-time Terminal Packet Logs */}
      <div className="p-2.5 rounded-xl bg-slate-950 border border-slate-800 space-y-1.5">
        <div className="flex items-center justify-between text-[10px] text-slate-400 font-mono">
          <span className="flex items-center gap-1 text-slate-300 font-bold">
            <Terminal className="w-3 h-3 text-purple-400" />
            <span>Mesh Packet Traffic Stream</span>
          </span>
          <span>{logs.length} Packets Relayed</span>
        </div>

        <div className="h-28 overflow-y-auto font-mono text-[10px] space-y-1 text-slate-300 pr-1">
          {logs.length === 0 ? (
            <div className="text-slate-500 text-center py-6">
              Listening on local mesh channel. Send an SOS or simulate hop to see packet propagation.
            </div>
          ) : (
            logs.map(log => (
              <div 
                key={log.id} 
                className={`p-1.5 rounded flex items-center justify-between gap-2 border ${
                  log.eventType === 'GATEWAY_DELIVERED'
                    ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
                    : log.eventType === 'ORIGINATED'
                    ? 'bg-red-950/40 border-red-500/30 text-red-300'
                    : 'bg-slate-900 border-purple-500/20 text-purple-300'
                }`}
              >
                <div className="truncate flex-1">
                  <span className="text-slate-400">[{log.time}]</span> <strong>{log.sosId}</strong>: {log.eventType} via {log.sender}
                </div>
                <div className="shrink-0 font-bold">
                  Hops: {log.hopsRemaining}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

    </div>
  );
}
