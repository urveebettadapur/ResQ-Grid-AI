import React, { useState, useEffect } from 'react';
import { 
  MapContainer, 
  TileLayer, 
  Marker, 
  Popup, 
  Polygon, 
  Polyline, 
  Circle, 
  useMap 
} from 'react-leaflet';
import L from 'leaflet';
import { 
  Layers, 
  Compass, 
  Eye, 
  Navigation, 
  AlertTriangle, 
  ShieldAlert, 
  Home, 
  Crosshair,
  Radio,
  Zap,
  Ship,
  Wind
} from 'lucide-react';
import { playDispatchAck, playRadarPing } from '../services/audioAlerts';

// Leaflet default icon fix for bundlers
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
});

// Custom HTML Pin Generator for Leaflet
function createCustomIcon(colorClass, label, pulse = false) {
  return L.divIcon({
    className: 'custom-leaflet-marker',
    html: `
      <div class="relative flex items-center justify-center">
        ${pulse ? `<div class="absolute w-8 h-8 rounded-full ${colorClass} opacity-40 animate-ping"></div>` : ''}
        <div class="w-6 h-6 rounded-full border-2 border-white shadow-xl flex items-center justify-center font-bold text-[10px] text-white ${colorClass}">
          ${label}
        </div>
      </div>
    `,
    iconSize: [24, 24],
    iconAnchor: [12, 12],
    popupAnchor: [0, -14],
  });
}

// Controller to smoothly pan & zoom map when scenario changes
function MapRecenter({ center, zoom }) {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo(center, zoom, { duration: 1.5 });
    }
  }, [center, zoom, map]);
  return null;
}

export default function SatelliteMap({
  scenario,
  incidents,
  selectedIncident,
  onSelectIncident,
  activeRoute,
  onDispatchRescue
}) {
  const [mapLayer, setMapLayer] = useState('satellite'); // 'satellite' | 'street' | 'dark'
  const [showInundation, setShowInundation] = useState(true);
  const [showHazards, setShowHazards] = useState(true);
  const [showRadarScan, setShowRadarScan] = useState(true);

  // Map Tile Layers
  const tileLayers = {
    satellite: {
      name: 'High-Res Satellite (Esri)',
      url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      attribution: 'Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community'
    },
    dark: {
      name: 'Dark Tactical View',
      url: 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png',
      attribution: '&copy; OpenStreetMap contributors &copy; CARTO'
    },
    street: {
      name: 'OpenStreetMap',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; OpenStreetMap contributors'
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'CRITICAL': return 'bg-red-600';
      case 'HIGH': return 'bg-orange-500';
      case 'MODERATE': return 'bg-amber-500';
      case 'RESCUED': return 'bg-emerald-500';
      default: return 'bg-blue-600';
    }
  };

  return (
    <div className="relative w-full h-full min-h-[500px] rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-slate-950">
      
      {/* Real-time Radar Scan Sweep Effect */}
      {showRadarScan && (
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden opacity-30">
          <div className="w-full h-full radar-sweep-cone animate-radar-sweep origin-center"></div>
          <div className="absolute inset-0 border border-blue-500/20 rounded-full scale-75 animate-ping-slow"></div>
        </div>
      )}

      {/* Floating Tactical Layer HUD */}
      <div className="absolute top-3 right-3 z-20 flex flex-col gap-2">
        <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-xl flex items-center gap-1.5 text-xs text-slate-300">
          <Layers className="w-4 h-4 text-blue-400" />
          <button
            onClick={() => setMapLayer('satellite')}
            className={`px-2 py-1 rounded font-medium transition ${mapLayer === 'satellite' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            🛰️ Satellite
          </button>
          <button
            onClick={() => setMapLayer('dark')}
            className={`px-2 py-1 rounded font-medium transition ${mapLayer === 'dark' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            🌑 Tactical
          </button>
          <button
            onClick={() => setMapLayer('street')}
            className={`px-2 py-1 rounded font-medium transition ${mapLayer === 'street' ? 'bg-blue-600 text-white' : 'hover:bg-slate-800'}`}
          >
            🗺️ Street
          </button>
        </div>

        {/* Layer Toggles */}
        <div className="bg-slate-900/90 backdrop-blur-md p-2 rounded-xl border border-slate-700/80 shadow-xl flex flex-col gap-1.5 text-xs">
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input 
              type="checkbox" 
              checked={showInundation} 
              onChange={(e) => setShowInundation(e.target.checked)}
              className="rounded bg-slate-800 border-slate-600 text-blue-600 focus:ring-0"
            />
            <span>🌊 Flood Inundation Zones</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input 
              type="checkbox" 
              checked={showHazards} 
              onChange={(e) => setShowHazards(e.target.checked)}
              className="rounded bg-slate-800 border-slate-600 text-red-600 focus:ring-0"
            />
            <span>⚠️ Road / Bridge Hazards</span>
          </label>
          <label className="flex items-center gap-2 cursor-pointer text-slate-300 hover:text-white">
            <input 
              type="checkbox" 
              checked={showRadarScan} 
              onChange={(e) => setShowRadarScan(e.target.checked)}
              className="rounded bg-slate-800 border-slate-600 text-emerald-600 focus:ring-0"
            />
            <span>📡 Tactical Radar Sweep</span>
          </label>
        </div>
      </div>

      {/* Floating Bottom Left: Environmental Telemetry */}
      <div className="absolute bottom-4 left-4 z-20 bg-slate-900/90 backdrop-blur-md p-3 rounded-xl border border-slate-700/80 shadow-2xl text-xs font-mono max-w-xs">
        <div className="flex items-center gap-2 text-red-400 font-bold mb-1">
          <ShieldAlert className="w-4 h-4 animate-pulse" />
          <span>{scenario.severityLevel}</span>
        </div>
        <p className="text-slate-300 font-sans font-medium text-sm">{scenario.location}</p>
        <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-slate-800 text-[11px] text-slate-400">
          <div>Rainfall: <span className="text-white font-bold">{scenario.weather.rainfall}</span></div>
          <div>Wind: <span className="text-white font-bold">{scenario.weather.windSpeed}</span></div>
          <div className="col-span-2">Water Gauge: <span className="text-blue-400 font-bold">{scenario.weather.riverLevel}</span></div>
        </div>
      </div>

      {/* Leaflet Map Canvas */}
      <MapContainer
        center={scenario.center}
        zoom={scenario.zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <MapRecenter center={scenario.center} zoom={scenario.zoom} />

        <TileLayer
          url={tileLayers[mapLayer].url}
          attribution={tileLayers[mapLayer].attribution}
          maxZoom={19}
        />

        {/* 1. Inundation Flood Polygons */}
        {showInundation && scenario.inundationZones?.map(zone => (
          <Polygon
            key={zone.id}
            positions={zone.coordinates}
            pathOptions={{
              color: zone.color,
              fillColor: zone.fillColor,
              fillOpacity: zone.fillOpacity,
              weight: 2,
              dashArray: '4, 4'
            }}
          >
            <Popup>
              <div className="p-1 font-sans">
                <div className="flex items-center gap-2 font-bold text-red-400 text-sm">
                  <span>🌊 {zone.name}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">Water Depth: <strong>{zone.depthMeters} meters</strong></p>
                <p className="text-[11px] text-red-300 mt-0.5">High-speed current. Impassable for wheeled vehicles.</p>
              </div>
            </Popup>
          </Polygon>
        ))}

        {/* 2. Blocked Hazards (Bridge Collapses, Downed Power Lines) */}
        {showHazards && scenario.blockedHazards?.map(hazard => (
          <Marker
            key={hazard.id}
            position={hazard.location}
            icon={createCustomIcon('bg-amber-600', '⚠️')}
          >
            <Popup>
              <div className="p-1 font-sans max-w-xs">
                <div className="flex items-center gap-1.5 font-bold text-amber-400 text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>{hazard.title}</span>
                </div>
                <p className="text-xs text-slate-300 mt-1">{hazard.description}</p>
                <div className="mt-2 text-[10px] font-mono px-2 py-0.5 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
                  FLAGGED IMPASSABLE NODE
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 3. Relief Hubs & Emergency Shelters */}
        {scenario.reliefHubs?.map(hub => (
          <Marker
            key={hub.id}
            position={hub.location}
            icon={createCustomIcon('bg-blue-600', '🏥')}
          >
            <Popup>
              <div className="p-1 font-sans max-w-xs">
                <div className="flex items-center gap-1.5 font-bold text-blue-400 text-sm">
                  <Home className="w-4 h-4" />
                  <span>{hub.name}</span>
                </div>
                <div className="mt-2 text-xs text-slate-300 space-y-1">
                  <div>Capacity: <strong>{hub.currentOccupancy} / {hub.capacity}</strong> (Occupancy {Math.round((hub.currentOccupancy/hub.capacity)*100)}%)</div>
                  <div>Potable Water: <strong>{hub.supplies.potableWaterLiters.toLocaleString()} L</strong></div>
                  <div>Blood Units (O-): <strong>{hub.supplies.bloodUnitsO_Neg} units</strong></div>
                  <div>Rescue Fleet: <strong>{hub.fleet.activeBoats}/{hub.fleet.rescueBoats} Boats, {hub.fleet.activeDrones}/{hub.fleet.autonomousDrones} Drones</strong></div>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 4. Active Fleet Units (Boats & Drones) */}
        {scenario.activeFleet?.map(unit => (
          <Marker
            key={unit.id}
            position={unit.location}
            icon={createCustomIcon(unit.type === 'RESCUE_BOAT' ? 'bg-cyan-500' : 'bg-purple-600', unit.type === 'RESCUE_BOAT' ? '🚤' : '🛸', true)}
          >
            <Popup>
              <div className="p-1 font-sans">
                <div className="font-bold text-cyan-400 text-sm">{unit.name}</div>
                <div className="text-xs text-slate-300 mt-1">Status: <span className="font-mono text-emerald-400">{unit.status}</span></div>
                <div className="text-xs text-slate-400">Speed: {unit.speed}</div>
                {unit.targetIncidentId && (
                  <div className="text-xs text-amber-300 mt-1 font-mono">Target: {unit.targetIncidentId} (ETA {unit.etaMinutes}m)</div>
                )}
              </div>
            </Popup>
          </Marker>
        ))}

        {/* 5. SOS Civilian Distress Incidents */}
        {incidents.map(incident => {
          const isSelected = selectedIncident?.id === incident.id;
          const isRescued = incident.status === 'RESCUED';
          const colorClass = getPriorityColor(incident.priority);

          return (
            <React.Fragment key={incident.id}>
              {/* Pulsing Beacon Radius on Map */}
              {!isRescued && (
                <Circle
                  center={incident.location}
                  radius={incident.priority === 'CRITICAL' ? 350 : 200}
                  pathOptions={{
                    color: incident.priority === 'CRITICAL' ? '#ef4444' : '#f97316',
                    fillColor: incident.priority === 'CRITICAL' ? '#ef4444' : '#f97316',
                    fillOpacity: 0.15,
                    weight: 1
                  }}
                />
              )}

              <Marker
                position={incident.location}
                icon={createCustomIcon(colorClass, incident.priority === 'CRITICAL' ? '🚨' : '🆘', !isRescued)}
                eventHandlers={{
                  click: () => onSelectIncident(incident)
                }}
              >
                <Popup>
                  <div className="p-1 font-sans max-w-xs">
                    <div className="flex items-center justify-between gap-2 border-b border-slate-700 pb-1.5 mb-1.5">
                      <span className="font-mono font-bold text-red-400 text-xs">{incident.id}</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        incident.priority === 'CRITICAL' ? 'bg-red-500/20 text-red-300' : 'bg-orange-500/20 text-orange-300'
                      }`}>
                        {incident.priority} ({incident.urgencyScore}/100)
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-white">{incident.address}</p>
                    
                    <div className="text-xs text-slate-300 mt-1.5 space-y-1">
                      <div>Headcount: <strong>{incident.headcount?.adults || 1} Adults, {incident.headcount?.children || 0} Children, {incident.headcount?.infants || 0} Infants</strong></div>
                      <div>Condition: <span className="text-red-300">{incident.medicalCondition || 'Trapped'}</span></div>
                      <div>Water Depth: <strong>{incident.waterDepth || '1.5m'}</strong></div>
                      <div>Mesh Relay: <span className="font-mono text-purple-300">{incident.meshHops || 0} peer hops</span></div>
                    </div>

                    {/* AI Rationale Snippet */}
                    <div className="mt-2 p-1.5 rounded bg-slate-800/80 border border-slate-700 text-[11px] text-slate-300">
                      <strong className="text-amber-400">AI Triage:</strong> {incident.aiRationale}
                    </div>

                    {/* Quick Dispatch Button */}
                    {!isRescued && (
                      <button
                        onClick={() => onDispatchRescue(incident)}
                        className="mt-2.5 w-full py-1.5 px-3 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-red-600/30 transition"
                      >
                        <Ship className="w-3.5 h-3.5" />
                        <span>Dispatch Rescue Boat / Drone</span>
                      </button>
                    )}
                  </div>
                </Popup>
              </Marker>
            </React.Fragment>
          );
        })}

        {/* 6. Active Safe Corridor Polyline */}
        {activeRoute && (
          <Polyline
            positions={activeRoute.waypoints}
            pathOptions={{
              color: '#38bdf8',
              weight: 5,
              opacity: 0.9,
              dashArray: '8, 6'
            }}
          />
        )}

      </MapContainer>
    </div>
  );
}
