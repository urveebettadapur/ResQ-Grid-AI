import React, { useState, useEffect, useRef } from 'react';
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
  Volume2,
  Trash2,
  Play,
  Pause,
  Image as ImageIcon
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
  const [waterDepth, setWaterDepth] = useState('1.8m (Chest deep water)');
  
  // Geolocation states (Defaults to dynamic GPS)
  const [coords, setCoords] = useState([12.9716, 77.5946]); // Bengaluru default
  const [address, setAddress] = useState('Bengaluru Metro Area, Karnataka');
  const [isLocating, setIsLocating] = useState(false);
  const [gpsAccuracy, setGpsAccuracy] = useState('± 3 meters');

  // REAL Media Capture states
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const fileInputRef = useRef(null);

  // REAL Microphone Audio Recording states
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [audioBlobUrl, setAudioBlobUrl] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const timerIntervalRef = useRef(null);

  // Submission / Status state
  const [activeBroadcast, setActiveBroadcast] = useState(null);
  const [offlineQueue, setOfflineQueue] = useState([]);
  const [peerCount, setPeerCount] = useState(4);

  // Fetch real device GPS on initial mount
  useEffect(() => {
    handleFetchGps();
    setOfflineQueue(getOfflineQueue());
    setPeerCount(getMeshPeerCount());
  }, []);

  // Fetch real hardware device GPS
  const handleFetchGps = () => {
    setIsLocating(true);
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const { latitude, longitude, accuracy } = pos.coords;
          setCoords([latitude, longitude]);
          setGpsAccuracy(`± ${Math.round(accuracy)}m`);
          setAddress(`Live GPS: ${latitude.toFixed(4)}, ${longitude.toFixed(4)} (Accuracy: ±${Math.round(accuracy)}m)`);
          setIsLocating(false);
        },
        (err) => {
          console.warn('GPS permission denied or timeout, using default location:', err);
          setIsLocating(false);
        },
        { enableHighAccuracy: true, timeout: 8000 }
      );
    } else {
      setIsLocating(false);
    }
  };

  // REAL Photo Handler (File picker / Camera snapshot)
  const handlePhotoSelect = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setPhotoDataUrl(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // REAL Voice Audio Recording using HTML5 MediaRecorder API
  const handleStartRecording = async () => {
    try {
      audioChunksRef.current = [];
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
        const url = URL.createObjectURL(audioBlob);
        setAudioBlobUrl(url);
        // Stop all audio tracks
        stream.getTracks().forEach(track => track.stop());
      };

      mediaRecorder.start();
      setIsRecording(true);
      setRecordingSeconds(0);

      timerIntervalRef.current = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);

    } catch (err) {
      console.error('Microphone access error:', err);
      alert('Microphone access denied or not supported on this browser. Please enable microphone permissions.');
    }
  };

  const handleStopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      clearInterval(timerIntervalRef.current);
    }
  };

  const handleDeleteAudio = () => {
    setAudioBlobUrl(null);
    setRecordingSeconds(0);
  };

  // Trigger SOS Beacon Broadcast
  const handleBroadcastSOS = () => {
    playSosAlert();

    const newIncident = {
      id: `SOS-LIVE-${Math.floor(1000 + Math.random() * 9000)}`,
      timestamp: 'Just now',
      location: coords,
      address,
      category,
      headcount: { adults, children: childrenCount, infants, pets: 0 },
      waterDepth,
      medicalCondition: medicalNote || 'Immediate evacuation & relief required',
      reporter: 'Live Citizen User',
      phone: '+91-98800-XXXXX',
      status: 'PENDING',
      isLiveUserSOS: true, // Flags this as an actual real citizen distress beacon
      meshHops: isSimulatedOffline ? Math.floor(1 + Math.random() * 3) : 0,
      photo: photoDataUrl,
      audioNoteUrl: audioBlobUrl
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
              LIVE BEACON TRANSMITTED
            </span>
            <span className="text-xs text-slate-400 font-mono">ID: {activeBroadcast.id}</span>
          </div>

          <h2 className="font-bold text-white text-base">Emergency Distress Logged</h2>
          <p className="text-xs text-slate-300 mt-1">
            AI Triage Severity: <strong className="text-red-400">{activeBroadcast.urgencyScore}/100 ({activeBroadcast.priority})</strong>
          </p>

          {/* Stepper Flow */}
          <div className="mt-3 grid grid-cols-3 gap-1 text-[10px] font-mono text-center">
            <div className="p-1.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
              ✓ Signal Logged
            </div>
            <div className="p-1.5 rounded bg-blue-500/20 text-blue-300 border border-blue-500/40 animate-pulse">
              ➔ Nearest Hub Linked
            </div>
            <div className="p-1.5 rounded bg-slate-800 text-slate-400 border border-slate-700">
              Dispatching Squad
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
            <span>{isLocating ? 'Locking GPS...' : '📍 Refresh Live GPS'}</span>
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
            <option value="2.5m+ (Submerged 1st floor, on rooftop)">2.5m+ (Submerged 1st floor, on rooftop)</option>
            <option value="1.8m (Chest deep water)">1.8m (Chest deep water)</option>
            <option value="0.9m (Knee deep water)">0.9m (Knee deep water)</option>
            <option value="Dry High Ground (Cut off by flood)">Dry High Ground (Cut off by flood)</option>
          </select>
        </div>
      </div>

      {/* REAL Multi-Modal Attachments: Real Photo & Real Voice Note */}
      <div className="bg-slate-900/80 border border-slate-800 p-3.5 rounded-2xl mb-6 space-y-3">
        <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
          <Camera className="w-3.5 h-3.5 text-blue-400" />
          <span>4. Attach Real Evidence (Photo & Voice)</span>
        </label>

        {/* Hidden File Input for Real Camera/Photo */}
        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handlePhotoSelect}
          className="hidden"
        />

        {/* Photo Button & Preview */}
        <div>
          {!photoDataUrl ? (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition text-slate-200"
            >
              <ImageIcon className="w-4 h-4 text-blue-400" />
              <span>📷 Take Photo / Upload Damage Image</span>
            </button>
          ) : (
            <div className="relative p-2 rounded-xl bg-slate-800 border border-emerald-500/40 flex items-center gap-3">
              <img 
                src={photoDataUrl} 
                alt="Damage evidence" 
                className="w-14 h-14 object-cover rounded-lg border border-slate-700" 
              />
              <div className="flex-1 text-xs">
                <div className="font-bold text-emerald-400">✓ Photo Attached</div>
                <div className="text-[10px] text-slate-400">Ready to transmit with SOS packet</div>
              </div>
              <button
                type="button"
                onClick={() => setPhotoDataUrl(null)}
                className="p-1.5 rounded-lg bg-red-600/20 text-red-400 hover:bg-red-600/40"
                title="Remove photo"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Real Microphone Voice Recorder */}
        <div>
          {!audioBlobUrl ? (
            <div className="flex items-center gap-2">
              {!isRecording ? (
                <button
                  type="button"
                  onClick={handleStartRecording}
                  className="w-full p-2.5 rounded-xl border border-slate-700 bg-slate-800/80 hover:bg-slate-700 text-xs font-semibold flex items-center justify-center gap-2 transition text-slate-200"
                >
                  <Mic className="w-4 h-4 text-red-400" />
                  <span>🎙️ Record Real Voice SOS Message</span>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleStopRecording}
                  className="w-full p-2.5 rounded-xl bg-red-600 text-white text-xs font-bold flex items-center justify-center gap-2 animate-pulse shadow-lg shadow-red-600/40"
                >
                  <MicOff className="w-4 h-4" />
                  <span>Stop Recording ({recordingSeconds}s)</span>
                </button>
              )}
            </div>
          ) : (
            <div className="p-2.5 rounded-xl bg-slate-800 border border-emerald-500/40 space-y-1.5">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-emerald-400 flex items-center gap-1.5">
                  <Volume2 className="w-4 h-4" />
                  <span>Voice Note Recorded ({recordingSeconds}s)</span>
                </span>
                <button
                  type="button"
                  onClick={handleDeleteAudio}
                  className="p-1 rounded bg-red-600/20 text-red-400 hover:bg-red-600/40 text-[10px]"
                >
                  Delete
                </button>
              </div>
              {/* Real Audio Player */}
              <audio controls src={audioBlobUrl} className="w-full h-8 mt-1" />
            </div>
          )}
        </div>
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
