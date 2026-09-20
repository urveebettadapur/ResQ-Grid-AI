import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { 
  QrCode, 
  Smartphone, 
  X, 
  ExternalLink, 
  ShieldCheck, 
  Sparkles, 
  Copy, 
  Check, 
  Wifi, 
  Globe 
} from 'lucide-react';

export default function MobileQrModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  // Real Deployed Vercel URL
  const deployedCloudUrl = 'https://res-q-grid-ai-iota.vercel.app/?mode=mobile';
  const defaultNetworkUrl = 'http://10.84.160.220:5173/?mode=mobile';

  // Default to the live Cloud URL so scanning works everywhere (cellular, any Wi-Fi)
  const [selectedUrl, setSelectedUrl] = useState(deployedCloudUrl);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Keep deployed URL as default for universal mobile scanning
    setSelectedUrl(deployedCloudUrl);
  }, [isOpen]);

  const handleCopy = () => {
    navigator.clipboard.writeText(selectedUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-md p-6 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        
        {/* Glow Background */}
        <div className="absolute -top-12 -left-12 w-36 h-36 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-36 h-36 bg-emerald-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-600 to-rose-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-extrabold text-lg text-white">Live Mobile SOS on Your Phone</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Scan this QR code with your phone camera to launch the live <strong>Civilian SOS App</strong> instantly!
          </p>
        </div>

        {/* Network Mode Switcher */}
        <div className="mt-4 flex items-center justify-center gap-2 bg-slate-800/80 p-1 rounded-xl border border-slate-700 text-xs">
          <button
            onClick={() => setSelectedUrl(deployedCloudUrl)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              selectedUrl.includes('vercel.app') ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>⚡ Live Cloud (Vercel)</span>
          </button>

          <button
            onClick={() => setSelectedUrl(defaultNetworkUrl)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg font-medium transition ${
              selectedUrl.includes('10.84.160.220') ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Wifi className="w-3.5 h-3.5" />
            <span>Local Wi-Fi</span>
          </button>
        </div>

        {/* QR Code Canvas */}
        <div className="mt-4 p-4 rounded-2xl bg-white shadow-2xl inline-block border-4 border-purple-500/40">
          <QRCodeSVG 
            value={selectedUrl} 
            size={185}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Live URL Display & Copy */}
        <div className="mt-4 flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-xl p-2 text-xs">
          <span className="font-mono text-[11px] text-purple-300 truncate flex-1 text-left px-1">
            {selectedUrl}
          </span>
          <button
            onClick={handleCopy}
            className="px-2.5 py-1 rounded-lg bg-slate-700 hover:bg-slate-600 text-white font-semibold flex items-center gap-1 text-[11px] transition shrink-0"
            title="Copy URL"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>
        </div>

        {/* Instructions */}
        <div className="mt-3 p-3 rounded-xl bg-slate-800/60 border border-slate-700/80 text-left text-xs space-y-1">
          <div className="font-bold text-purple-300 flex items-center gap-1 text-[11px]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Instant Live Testing:</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            1. Open Camera on your phone and point at the QR code.
          </p>
          <p className="text-slate-300 text-[11px]">
            2. Tap the link to launch the <strong>ResQ-Grid Civilian Portal</strong>.
          </p>
          <p className="text-slate-300 text-[11px]">
            3. Tap <strong>Broadcast Emergency SOS</strong> $\to$ watch the <strong>Satellite Mission Control map flash and update live!</strong>
          </p>
        </div>

      </div>
    </div>
  );
}
