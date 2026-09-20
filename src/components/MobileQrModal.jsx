import React, { useState, useEffect } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, Smartphone, X, ExternalLink, ShieldCheck, Sparkles } from 'lucide-react';

export default function MobileQrModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [currentUrl, setCurrentUrl] = useState('');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const url = new URL(window.location.href);
      url.searchParams.set('mode', 'mobile');
      setCurrentUrl(url.toString());
    }
  }, []);

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 font-sans animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-sm p-6 shadow-2xl text-slate-100 text-center relative overflow-hidden">
        
        {/* Glow Background */}
        <div className="absolute -top-12 -left-12 w-32 h-32 bg-purple-600/30 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute -bottom-12 -right-12 w-32 h-32 bg-red-600/30 rounded-full blur-3xl pointer-events-none"></div>

        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="flex flex-col items-center gap-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-600 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-600/30">
            <Smartphone className="w-6 h-6 text-white" />
          </div>
          <h2 className="font-extrabold text-lg text-white">Live Mobile SOS Test</h2>
          <p className="text-xs text-slate-400 max-w-xs">
            Scan this QR code with your phone camera to experience the <strong>Civilian SOS App</strong> directly on your mobile device!
          </p>
        </div>

        {/* QR Code Container */}
        <div className="mt-5 p-4 rounded-2xl bg-white shadow-2xl inline-block border-4 border-purple-500/30">
          <QRCodeSVG 
            value={currentUrl || 'https://resq-grid-ai.vercel.app?mode=mobile'} 
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        {/* Instructions */}
        <div className="mt-4 p-3 rounded-xl bg-slate-800/80 border border-slate-700 text-left text-xs space-y-1.5">
          <div className="font-bold text-purple-300 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Multi-Device Demo:</span>
          </div>
          <p className="text-slate-300 text-[11px]">
            1. Open Camera on your phone & scan QR.
          </p>
          <p className="text-slate-300 text-[11px]">
            2. Tap <strong>Broadcast Emergency SOS</strong> on your phone.
          </p>
          <p className="text-slate-300 text-[11px]">
            3. Watch the <strong>Satellite Map ring and update live</strong> on this screen!
          </p>
        </div>

        {/* Direct Link button */}
        <a
          href={currentUrl || '#'}
          target="_blank"
          rel="noreferrer"
          className="mt-4 w-full py-2 px-4 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold flex items-center justify-center gap-1.5 transition border border-slate-700"
        >
          <ExternalLink className="w-3.5 h-3.5" />
          <span>Open Mobile View in New Tab</span>
        </a>

      </div>
    </div>
  );
}
