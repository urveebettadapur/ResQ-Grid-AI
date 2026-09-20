import React, { useState, useEffect } from 'react';
import { 
  AlertOctagon, 
  MapPin, 
  Users, 
  HeartHandshake, 
  Camera, 
  Mic, 
  MicOff, 
  Wifi, 
  WifiOff, 
  Send, 
  CheckCircle2, 
  Clock, 
  ShieldCheck,
  ChevronRight,
  Radio,
  Share2,
  PhoneCall,
  Volume2
} from 'lucide-react';
import { playSosAlert, playSuccessChime } from '../services/audioAlerts';
import { saveToOfflineQueue, getOfflineQueue, getMeshPeerCount } from '../services/offlineStorage';
import { calculateUrgencyScore } from '../services/triageEngine';

export default function MobileCivilianSOS({ onSubmitSOS, isSimulatedOffline, setIsSimulatedOffline }) {
  const [category, setCategory] = useState('TRAPPED_WATER');
  const [adults, setAdults] = useState(2);
  const [childrenCount, setChildrenCount] = useState(1);
  const [infants, setInfants] = useState(0);
  const [medicalNote, setMedicalNote] = useState('');
  const [waterDepth, setWaterDepth] = useState('2.0m (Rooftop)');
  
  // Geolocation states
  const [coords, setCoords] = useState([26.1920, 91.7540]);
  const [address, setAddress] = useState('Kamrup Metro Sector, Near Riverbank');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState('± 4 meters');

  // Media Capture states
  const [photoCaptured, setPhotoCaptured] = useState(null);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [voiceRecorded, setVoiceRecorded] = useState(false);

  // Submission / Status state
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [peerCount, setPeerCount] = useState(4);

  useEffect(() => {
    setOfflineQueue(getOfflineQueue());
    setPeerCount(getMeshPeerCount());
  }, []);

  // Fetch real device GPS
  const handleFetchGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setCoords([latitude, longitude]);
          setGpsAccuracy(`± ${Math.round(accuracy)}m`);
          setAddress(`GPS Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`);
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS fallback to disaster sector coordinates:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 5000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Trigger SOS Beacon
  const handleBroadcastSOS = () => {
    playSosAlert();

    const newIncident = {
      id: `SOS-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      location: coords,
      address,
      category,
      headcount: { adults, children: childrenCount, infants, pets: 0 },
      waterDepth,
      medicalCondition: medicalNote || 'Immediate extraction required',
      reporter: 'Civilian Field User',
      phone: '+91-98765-XXXXX',
      status: 'PENDING',
      meshHops: isSimulatedOffline ? Math.floor(1 + Math.random() * 3) : 0,
      photo: photoCaptured,
      hasVoiceNote: voiceRecorded
    };

    // Run AI Triage Engine
    const triageResult = calculateUrgencyScore(newIncident);
    newIncident.urgencyScore = triageResult.urgencyScore;
    newIncident.priority = triageResult.priority;
    newIncident.aiRationale = triageResult.aiRationale;

    if (isSimulatedOffline) {
      const queuedPacket = saveToOfflineQueue(newIncident);
      setOfflineQueue(getOfflineQueue());
      setActiveBroadcast({ ...newIncident, isQueuedOffline: true });
    } else {
      onSubmitSOS(newIncident);
      setActiveBroadcast(newIncident);
    }
  };

  // Mock Photo Attachment
  const handleCapturePhoto = () => {
    // Generate simulated camera snapshot of flood/hazard
    setPhotoCaptured('https://images.unsplash.com/photo-1547683905-f686c993aae5?auto=format&fit=crop&w=600&q=80');
  };

  // Voice Note Toggle
  const handleToggleVoice = () => {
    if (!isRecordingVoice) {
      setIsRecordingVoice(true);
      setTimeout(() => {
        setIsRecordingVoice(false);
        setVoiceRecorded(true);
      }, 3000);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto min-h-screen bg-slate-950 text-slate-100 p-4 pb-24 font-sans">
      
      {/* Mobile Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-slate-800/80 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-red-600 flex items-center justify-center font-bold text-white shadow-lg shadow-red-600/30">
            SOS
          </div>
          <div>
            <h1 className="font-extrabold text-sm tracking-tight text-white">ResQ-Grid Civilian</h1>
            <p className="text-[10px] text-slate-400">Emergency Mesh Node #892</p>
          </div>
        </div>

        {/* Offline Mesh Simulator Pill */}
        <button
          onClick={() => setIsSimulatedOffline(!isSimulatedOffline)}
          className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-mono font-bold border transition ${
            isSimulatedOffline 
              ? 'bg-amber-500/20 text-amber-300 border-amber-500/40 animate-pulse'
              : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
          }`}
          title="Click to toggle Cellular Breakdown / Offline Mesh Relay"
        >
          {isSimulatedOffline ? <WifiOff className="w-3.5 h-3.5" /> : <Wifi className="w-3.5 h-3.5" />}
          <span>{isSimulatedOffline ? 'OFFLINE MESH' : '4G LTE ONLINE'}</span>
        </button>
      </div>

      {/* Mesh Peer Connection Banner */}
      {isSimulatedOffline && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-2.5 mb-4 text-xs text-amber-200 flex items-center gap-2">
          <Radio className="w-4 h-4 text-amber-400 animate-spin" />
          <span>Cell towers down. <strong>{peerCount} peer devices</strong> connected via BLE/WiFi Mesh.</span>
        </div>
      )}

      {/* Active Broadcast Progress Banner */}
      {activeBroadcast && (
        <div className="bg-gradient-to-r from-red-950/80 to-slate-900 border border-red-500/40 rounded-2xl p-4 mb-5 shadow-2xl">
          <div className="flex items-center justify-between mb-2">
            <span className="px-2 py-0.5 rounded bg-red-600 text-white font-mono font-bold text-xs">
              BEACON TRANSMITTED
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {activeBroadcast.id}</span>
          </div>

          <h2 className="font-bold text-white text-base">Rescue Signal Logged</h2>
          <p className="text-xs text-slate-300 mt-1">
            AI Priority Score: <strong className="text-red-400">{activeBroadcast.urgencyScore}/100 ({activeBroadcast.priority})</strong>
          </p>

          {/* Stepper Flow */}
          <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
            <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Signal Logged
            </div>
            <div className="p-1.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
              ➔ AI Triaged
            </div>
            <div className="p-1.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Boat Dispatch
            </div>
          </div>

          {activeBroadcast.isQueuedOffline && (
            <p className="text-[11px] text-amber-300 mt-2">
              ⚠️ Queued in local Mesh Outbox. Relaying across peer nodes to nearest gateway.
            </p>
          )}
        </div>
      )}

      {/* Category Selection */}
      <div className="mb-4">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          1. Select Emergency Type
        </label>
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => setCategory('TRAPPED_WATER')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
              category === 'TRAPPED_WATER'
                ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🌊</span>
            <div>
              <div className="font-bold text-xs">Trapped in Flood</div>
              <div className="text-[10px] text-slate-400">Rooftop / Rising Water</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('MEDICAL_TRAUMA')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
              category === 'MEDICAL_TRAUMA'
                ? 'bg-red-600/20 border-red-500 text-white shadow-lg shadow-red-600/20'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🚑</span>
            <div>
              <div className="font-bold text-xs">Critical Medical</div>
              <div className="text-[10px] text-slate-400">Injury / Cardiac / Insulin</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('FOOD_WATER_DEPLETED')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
              category === 'FOOD_WATER_DEPLETED'
                ? 'bg-orange-600/20 border-orange-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🍞</span>
            <div>
              <div className="font-bold text-xs">Food & Potable Water</div>
              <div className="text-[10px] text-slate-400">Rations Exhausted</div>
            </div>
          </button>

          <button
            onClick={() => setCategory('STRUCTURAL_COLLAPSE')}
            className={`p-3 rounded-xl border text-left transition flex flex-col justify-between h-20 ${
              category === 'STRUCTURAL_COLLAPSE'
                ? 'bg-purple-600/20 border-purple-500 text-white shadow-lg'
                : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
            }`}
          >
            <span className="text-xl">🏚️</span>
            <div>
              <div className="font-bold text-xs">Structural Collapse</div>
              <div className="text-[10px] text-slate-400">Debris Entrapment</div>
            </div>
          </button>
        </div>
      </div>

      {/* Headcount Steppers */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-blue-400" />
            <span>2. People Requiring Extraction</span>
          </label>
        </div>

        <div className="grid grid-cols-3 gap-2 text-center">
          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Adults</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button 
                onClick={() => setAdults(Math.max(1, adults - 1))}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >-</button>
              <span className="font-bold text-sm text-white">{adults}</span>
              <button 
                onClick={() => setAdults(adults + 1)}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >+</button>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-slate-400 uppercase font-semibold">Children</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button 
                onClick={() => setChildrenCount(Math.max(0, childrenCount - 1))}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >-</button>
              <span className="font-bold text-sm text-white">{childrenCount}</span>
              <button 
                onClick={() => setChildrenCount(childrenCount + 1)}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >+</button>
            </div>
          </div>

          <div className="p-2 rounded-xl bg-slate-800/80 border border-slate-700/60">
            <div className="text-[10px] text-red-400 uppercase font-bold">Infants (0-2y)</div>
            <div className="flex items-center justify-center gap-2 mt-1">
              <button 
                onClick={() => setInfants(Math.max(0, infants - 1))}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >-</button>
              <span className="font-bold text-sm text-red-400">{infants}</span>
              <button 
                onClick={() => setInfants(infants + 1)}
                className="w-6 h-6 rounded bg-slate-700 text-white font-bold"
              >+</button>
            </div>
          </div>
        </div>
      </div>

      {/* GPS & Water Depth Location */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl mb-4">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-red-400" />
            <span>3. Live Geolocation</span>
          </label>
          <button
            onClick={handleFetchGps}
            disabled={isLocating}
            className="text-[11px] font-bold text-blue-400 hover:text-blue-300 flex items-center gap-1"
          >
            <span>{isLocating ? 'Locking GPS...' : '📍 Refresh GPS'}</span>
          </button>
        </div>

        <div className="p-2 rounded-xl bg-slate-800/60 border border-slate-700/50 text-xs">
          <div className="text-slate-200 font-medium">{address}</div>
          <div className="flex items-center justify-between mt-1 text-[10px] text-slate-400 font-mono">
            <span>Lat: {coords[0].toFixed(4)}, Lng: {coords[1].toFixed(4)}</span>
            <span className="text-emerald-400 font-bold">GPS Accuracy: {gpsAccuracy}</span>
          </div>
        </div>

        {/* Water Depth Selector */}
        <div className="mt-3">
          <label className="text-[11px] text-slate-400 block mb-1">Current Water Level / Environment</label>
          <select
            value={waterDepth}
            onChange={(e) => setWaterDepth(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 text-slate-200 text-xs rounded-xl p-2 focus:outline-none"
          >
            <option value="2.5m (Submerged 1st floor, on roof)">2.5m+ (Submerged 1st floor, on rooftop)</option>
            <option value="1.5m (Chest deep water)">1.5m (Chest deep water)</option>
            <option value="0.8m (Knee deep water)">0.8m (Knee deep water)</option>
            <option value="Dry High Ground (Cut off)">Dry High Ground (Cut off by water)</option>
          </select>
        </div>
      </div>

      {/* Multi-Modal Attachments: Photo + Voice Note */}
      <div className="grid grid-cols-2 gap-2 mb-6">
        {/* Photo Snap Button */}
        <button
          onClick={handleCapturePhoto}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
            photoCaptured 
              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300' 
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          <Camera className="w-4 h-4 text-blue-400" />
          <span>{photoCaptured ? '📷 Photo Attached' : 'Attach Photo'}</span>
        </button>

        {/* Voice Note Button */}
        <button
          onClick={handleToggleVoice}
          className={`p-3 rounded-2xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
            isRecordingVoice 
              ? 'bg-red-600 text-white animate-pulse' 
              : voiceRecorded
              ? 'bg-emerald-600/20 border-emerald-500 text-emerald-300'
              : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
          }`}
        >
          {isRecordingVoice ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4 text-red-400" />}
          <span>{isRecordingVoice ? 'Recording (3s)...' : voiceRecorded ? '🎙️ Voice Attached' : 'Record Voice SOS'}</span>
        </button>
      </div>

      {/* GIANT 1-TAP SOS EMERGENCY BROADCAST BUTTON */}
      <div className="relative flex flex-col items-center">
        <button
          onClick={handleBroadcastSOS}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-600 to-red-700 text-white font-extrabold text-base tracking-wider uppercase shadow-2xl shadow-red-600/40 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 border border-red-400/40"
        >
          <AlertOctagon className="w-6 h-6 animate-pulse" />
          <span>BROADCAST EMERGENCY SOS</span>
        </button>
        <p className="text-[11px] text-slate-400 text-center mt-2">
          {isSimulatedOffline 
            ? '⚡ Relaying via Offline Mesh (No Internet Required)' 
            : '🔒 Encrypted transmission directly to NDRF & Disaster Command'}
        </p>
      </div>

    </div>
  );
}
