import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  ShieldAlert, 
  AlertTriangle, 
  Zap, 
  Flame, 
  Droplets, 
  Mountain, 
  Wind, 
  HeartHandshake, 
  PhoneCall, 
  CheckCircle2, 
  XCircle,
  Clock,
  Sparkles
} from 'lucide-react';

export default function DisasterGuideModal({ isOpen, onClose }) {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState('ALL');

  const protocols = [
    {
      id: 'earthquake',
      name: 'Earthquake',
      category: 'SEISMIC',
      timeSensitivity: 'CRITICAL (Seconds)',
      sensitivityColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      badgeColor: 'bg-amber-600',
      icon: '🏚️',
      summary: 'Act the moment shaking begins. Shaking > 2 minutes indicates major rupture.',
      before: [
        'Prepare 72-hour emergency survival kit (water, food, flashlight, first aid).',
        'Identify safe spots in every room: under sturdy desk, table, or against interior walls.',
        'Secure heavy furniture, water heaters, and hanging objects.'
      ],
      during: [
        'DROP, COVER, HOLD ON! Protect head and neck beneath sturdy furniture.',
        'Stay indoors until shaking stops. Avoid windows, mirrors, facades, and elevators.',
        'If outdoors: Move immediately to open area away from buildings, powerlines, and trees.'
      ],
      after: [
        'Check for injuries and apply first aid before moving.',
        'Smell for gas leaks; turn off main gas/power valve if damaged. Do NOT use matches/open flames.',
        'Expect aftershocks. Stay out of damaged structural buildings.'
      ],
      pictorialAction: 'DROP ➔ COVER ➔ HOLD ON'
    },
    {
      id: 'lightning',
      name: 'Thunder & Lightning',
      category: 'METEOROLOGICAL',
      timeSensitivity: 'CRITICAL (Seconds to Minutes)',
      sensitivityColor: 'bg-orange-500/20 text-orange-400 border-orange-500/30',
      badgeColor: 'bg-blue-600',
      icon: '⚡',
      summary: 'When thunder roars, go indoors. You are within strike range if thunder is audible.',
      before: [
        'Monitor weather radar alerts. Postpone outdoor activities when thunderstorms approach.'
      ],
      during: [
        'Indoors: Unplug appliances. Avoid bathing, running water, landline phones, and concrete walls.',
        'Outdoors: Get off bicycles/vehicles. NEVER shelter under isolated tall trees or tin sheds.',
        'If trapped in open: Crouch low on balls of feet (feet touching, head tucked down). Do NOT lie flat.'
      ],
      after: [
        'Victim Safety: Lightning victims carry NO electrical charge; it is 100% safe to touch and treat them.',
        'Call 102/108 immediately and begin CPR / rescue breathing if pulse is absent.'
      ],
      pictorialAction: 'LIGHTNING CROUCH (FEET TOGETHER, NO TREES)'
    },
    {
      id: 'fire',
      name: 'Urban & Structural Fire',
      category: 'THERMAL',
      timeSensitivity: 'CRITICAL (Seconds)',
      sensitivityColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      badgeColor: 'bg-red-600',
      icon: '🔥',
      summary: 'Every second counts. Raise alarm, crawl below smoke layer, get out and dial 101.',
      before: [
        'Conduct fire safety audits; ensure 2 clear escape exits in home/office.',
        'Maintain functional smoke alarms and ABC dry-powder fire extinguishers.'
      ],
      during: [
        'Act: Dial 101 immediately. Stay calm, leave belongings, exit via stairs (never elevators).',
        'Trapped by smoke: Crawl low on hands and knees (clean air is 30-60cm above floor). Breathe through wet cloth.',
        'Clothes on fire: STOP, DROP, and ROLL. Smother flames with heavy blanket or coat.'
      ],
      after: [
        'Burns First Aid: Pour cool, clean running water over burns for 10-15 minutes.',
        'NEVER peel off stuck clothing or apply toothpaste, butter, or oil to burn wounds.'
      ],
      pictorialAction: 'STOP ➔ DROP ➔ ROLL'
    },
    {
      id: 'flood',
      name: 'Flash Floods & Waterlogging',
      category: 'HYDROLOGICAL',
      timeSensitivity: 'HIGH (Minutes to Hours)',
      sensitivityColor: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      badgeColor: 'bg-cyan-600',
      icon: '🌊',
      summary: 'Turn around, do not drown. 15cm of flowing water knocks people over; 30cm floats vehicles.',
      before: [
        'Know community evacuation shelters and safe high-ground routes.',
        'Install check valves in plumbing to prevent sewer backup into house.'
      ],
      during: [
        'Move immediately to higher floors or designated community high ground.',
        'Turn off main electricity breaker and gas cylinder valves before evacuating.',
        'NEVER attempt to walk, swim, or drive through flooded underpasses or currents.'
      ],
      after: [
        'Do not touch electrical equipment or submerged power cables.',
        'Boil all water vigorously before drinking to prevent cholera/waterborne epidemic.'
      ],
      pictorialAction: 'EVACUATE TO HIGH GROUND • BOIL WATER'
    },
    {
      id: 'landslide',
      name: 'Landslide & Mudflow',
      category: 'GEOLOGICAL',
      timeSensitivity: 'CRITICAL (Seconds to Minutes)',
      sensitivityColor: 'bg-red-500/20 text-red-400 border-red-500/30',
      badgeColor: 'bg-amber-700',
      icon: '⛰️',
      summary: 'Warning signs: Cracking trees, rolling boulders, sudden change from clear to muddy river flow.',
      before: [
        'Plant deep-rooted vegetation on slopes; avoid constructing on steep valley flow paths.'
      ],
      during: [
        'Move quickly away from the path of flow in a perpendicular direction.',
        'If escape is impossible: Curl into a tight ball and protect your head with arms.'
      ],
      after: [
        'Stay away from the slide area; secondary collapses frequently occur after initial flow.'
      ],
      pictorialAction: 'MOVE PERPENDICULAR TO FLOW PATH'
    },
    {
      id: 'cyclone',
      name: 'Cyclone & Storm Surge',
      category: 'METEOROLOGICAL',
      timeSensitivity: 'HIGH (Hours to Days)',
      sensitivityColor: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      badgeColor: 'bg-purple-600',
      icon: '🌀',
      summary: 'Category 4/5 coastal storm surges can breach sea walls. Evacuate when orders are issued.',
      before: [
        'Board up glass windows; secure or store loose outdoor metal sheets, signs, and furniture.',
        'Keep battery-operated radio tuned to IMD / Disaster Management broadcasts.'
      ],
      during: [
        'Stay indoors in the strongest central room away from windows and glass.',
        'Beware of the "Eye of the Cyclone": Brief calm followed by violent reverse winds.'
      ],
      after: [
        'Do not venture out until official all-clear is issued by authorities.'
      ],
      pictorialAction: 'BOARD WINDOWS • RADIO TELEMETRY'
    }
  ];

  const filtered = activeTab === 'ALL' ? protocols : protocols.filter(p => p.category === activeTab);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 font-sans overflow-y-auto animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-3xl w-full max-w-4xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden text-slate-100">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-gradient-to-tr from-blue-600 to-cyan-600 text-white shadow-lg shadow-blue-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="font-extrabold text-base sm:text-lg text-white">Disaster Response Quick Guide</h2>
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                  NIDM / NDMA STANDARD
                </span>
              </div>
              <p className="text-xs text-slate-400">Condensed Life-Saving Protocols for Various Hazards & Emergencies</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filter Tabs & Helplines Strip */}
        <div className="px-4 py-2.5 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
            {['ALL', 'SEISMIC', 'METEOROLOGICAL', 'THERMAL', 'HYDROLOGICAL', 'GEOLOGICAL'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-2.5 py-1 rounded-lg font-medium text-[11px] transition whitespace-nowrap ${
                  activeTab === tab
                    ? 'bg-blue-600 text-white shadow'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Emergency SOS Hotlines */}
          <div className="flex items-center gap-2 text-[11px] font-mono text-slate-300">
            <PhoneCall className="w-3.5 h-3.5 text-red-400" />
            <span>National Helplines: <strong className="text-red-400">112 (All)</strong> | <strong className="text-amber-400">101 (Fire)</strong> | <strong className="text-emerald-400">108 (Ambulance)</strong></span>
          </div>
        </div>

        {/* Protocols Scroll Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4 text-xs">
          {filtered.map(item => (
            <div 
              key={item.id}
              className="p-4 rounded-2xl bg-slate-800/60 border border-slate-700/80 hover:border-slate-600 transition shadow-lg space-y-3"
            >
              {/* Card Header */}
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-700/60 pb-2.5">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{item.icon}</span>
                  <div>
                    <h3 className="font-extrabold text-base text-white">{item.name}</h3>
                    <p className="text-[11px] text-slate-300">{item.summary}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className={`px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold border ${item.sensitivityColor}`}>
                    <Clock className="w-3 h-3 inline mr-1" />
                    {item.timeSensitivity}
                  </span>
                </div>
              </div>

              {/* Action Banner */}
              <div className="p-2 rounded-xl bg-slate-900 border border-slate-700 flex items-center justify-between text-xs">
                <span className="font-bold text-amber-400 font-mono text-[11px]">
                  ⚡ KEY ACTION: {item.pictorialAction}
                </span>
                <span className="text-[10px] text-slate-400 uppercase font-mono">
                  {item.category}
                </span>
              </div>

              {/* Before / During / After Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 text-slate-200 text-[11px]">
                {/* Before */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-emerald-400 uppercase text-[10px] mb-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Before (Preparedness)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {item.before.map((b, idx) => (
                      <li key={idx} className="leading-snug">{b}</li>
                    ))}
                  </ul>
                </div>

                {/* During */}
                <div className="p-2.5 rounded-xl bg-red-950/20 border border-red-500/20">
                  <div className="font-bold text-red-400 uppercase text-[10px] mb-1 flex items-center gap-1">
                    <ShieldAlert className="w-3 h-3" />
                    <span>During (Immediate Action)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-200">
                    {item.during.map((d, idx) => (
                      <li key={idx} className="leading-snug font-medium">{d}</li>
                    ))}
                  </ul>
                </div>

                {/* After */}
                <div className="p-2.5 rounded-xl bg-slate-900/60 border border-slate-800">
                  <div className="font-bold text-blue-400 uppercase text-[10px] mb-1 flex items-center gap-1">
                    <HeartHandshake className="w-3 h-3" />
                    <span>After (Recovery & First Aid)</span>
                  </div>
                  <ul className="list-disc list-inside space-y-1 text-slate-300">
                    {item.after.map((a, idx) => (
                      <li key={idx} className="leading-snug">{a}</li>
                    ))}
                  </ul>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
}
