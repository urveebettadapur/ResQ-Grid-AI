import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import SatelliteMap from './components/SatelliteMap';
import MobileCivilianSOS from './components/MobileCivilianSOS';
import TriageMatrix from './components/TriageMatrix';
import RouteOptimizer from './components/RouteOptimizer';
import ResourceInventory from './components/ResourceInventory';
import OfflineMeshVisualizer from './components/OfflineMeshVisualizer';
import SitrepExport from './components/SitrepExport';
import MobileQrModal from './components/MobileQrModal';

import { DISASTER_SCENARIOS } from './services/disasterData';
import { calculateSafeRoute } from './services/routingEngine';
import { calculateUrgencyScore, rankIncidentsByUrgency } from './services/triageEngine';
import { playDispatchAck, playSuccessChime, playSosAlert } from './services/audioAlerts';

export default function App() {
  // Check if URL has ?mode=mobile (e.g. from QR scan)
  const [viewMode, setViewMode] = useState('command'); // 'command' | 'mobile'
  const [activeScenarioKey, setActiveScenarioKey] = useState('flood_brahmaputra');
  
  const currentScenario = DISASTER_SCENARIOS[activeScenarioKey] || DISASTER_SCENARIOS.flood_brahmaputra;

  const [incidents, setIncidents] = useState(currentScenario.initialIncidents || []);
  const [selectedIncident, setSelectedIncident] = useState(null);
  const [selectedHub, setSelectedHub] = useState(currentScenario.reliefHubs?.[0] || null);
  const [activeRoute, setActiveRoute] = useState(null);
  
  const [isSimulatedOffline, setIsSimulatedOffline] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const [isSitrepModalOpen, setIsSitrepModalOpen] = useState(false);

  // Sync state when scenario changes
  useEffect(() => {
    const scenario = DISASTER_SCENARIOS[activeScenarioKey];
    if (scenario) {
      setIncidents(scenario.initialIncidents || []);
      setSelectedIncident(null);
      setSelectedHub(scenario.reliefHubs?.[0] || null);
      setActiveRoute(null);
    }
  }, [activeScenarioKey]);

  // URL mode detection on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      if (params.get('mode') === 'mobile' || window.innerWidth < 768) {
        setViewMode('mobile');
      }
    }
  }, []);

  // Handle incoming SOS Broadcast (from Mobile view)
  const handleSubmitSOS = (newIncident) => {
    playSosAlert();
    setIncidents(prev => rankIncidentsByUrgency([newIncident, ...prev]));
    setSelectedIncident(newIncident);
  };

  // Sync offline packets flushed from mesh
  const handleSyncOfflinePackets = (packets) => {
    if (!packets || packets.length === 0) return;
    setIncidents(prev => {
      const combined = [...packets, ...prev];
      return rankIncidentsByUrgency(combined);
    });
  };

  // Select an incident & auto-calculate initial route
  const handleSelectIncident = (incident) => {
    setSelectedIncident(incident);
    if (selectedHub && incident) {
      const route = calculateSafeRoute(selectedHub, incident, currentScenario);
      setActiveRoute(route);
    }
  };

  // Calculate Safe Corridor Route
  const handleCalculateRoute = () => {
    if (selectedHub && selectedIncident) {
      const route = calculateSafeRoute(selectedHub, selectedIncident, currentScenario);
      setActiveRoute(route);
      playDispatchAck();
    }
  };

  // Dispatch Rescue Squad Action
  const handleDispatchRescue = (incident) => {
    playDispatchAck();
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incident.id) {
        return {
          ...inc,
          status: 'DISPATCHED',
          assignedUnit: 'Boat Unit Bravo-3 (NDRF)'
        };
      }
      return inc;
    }));

    if (selectedHub) {
      const route = calculateSafeRoute(selectedHub, incident, currentScenario);
      setActiveRoute(route);
    }
  };

  // Mark Survivor as Rescued
  const handleMarkRescued = (incidentId) => {
    playSuccessChime();
    setIncidents(prev => prev.map(inc => {
      if (inc.id === incidentId) {
        return {
          ...inc,
          status: 'RESCUED',
          priority: 'RESCUED',
          urgencyScore: 0
        };
      }
      return inc;
    }));
  };

  const criticalCount = incidents.filter(i => i.priority === 'CRITICAL' && i.status !== 'RESCUED').length;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      
      {/* Tactical Navbar */}
      <Navbar
        viewMode={viewMode}
        setViewMode={setViewMode}
        activeScenarioKey={activeScenarioKey}
        setActiveScenarioKey={setActiveScenarioKey}
        scenarios={DISASTER_SCENARIOS}
        incidentCount={incidents.length}
        criticalCount={criticalCount}
        onOpenQrModal={() => setIsQrModalOpen(true)}
        onOpenSitrepModal={() => setIsSitrepModalOpen(true)}
      />

      {/* Main View Switcher */}
      {viewMode === 'mobile' ? (
        <div className="flex-1 p-2 sm:p-4 flex justify-center items-start">
          <MobileCivilianSOS
            onSubmitSOS={handleSubmitSOS}
            isSimulatedOffline={isSimulatedOffline}
            setIsSimulatedOffline={setIsSimulatedOffline}
          />
        </div>
      ) : (
        /* MISSION CONTROL COMMAND HUB (Desktop / Laptop View) */
        <main className="flex-1 p-3 lg:p-4 max-w-[1600px] w-full mx-auto grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4">
          
          {/* LEFT 7 COLS: High-Resolution Satellite GIS Map & Safe Corridor */}
          <div className="lg:col-span-7 flex flex-col gap-3 min-h-[550px]">
            <div className="flex-1 h-full min-h-[450px]">
              <SatelliteMap
                scenario={currentScenario}
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelectIncident={handleSelectIncident}
                activeRoute={activeRoute}
                onDispatchRescue={handleDispatchRescue}
              />
            </div>

            {/* Safe Corridor Route Optimizer Panel */}
            <RouteOptimizer
              scenario={currentScenario}
              selectedIncident={selectedIncident}
              activeRoute={activeRoute}
              selectedHub={selectedHub}
              setSelectedHub={setSelectedHub}
              onCalculateRoute={handleCalculateRoute}
              onLaunchDispatch={() => handleDispatchRescue(selectedIncident)}
            />
          </div>

          {/* RIGHT 5 COLS: AI Triage Matrix, Inventory & Offline Mesh */}
          <div className="lg:col-span-5 flex flex-col gap-3">
            
            {/* AI Geo-Triage Priority Feed */}
            <div className="h-[440px]">
              <TriageMatrix
                incidents={incidents}
                selectedIncident={selectedIncident}
                onSelectIncident={handleSelectIncident}
                onDispatchRescue={handleDispatchRescue}
                onMarkRescued={handleMarkRescued}
              />
            </div>

            {/* Offline Mesh Relay Simulator */}
            <OfflineMeshVisualizer
              isSimulatedOffline={isSimulatedOffline}
              onSyncOfflinePackets={handleSyncOfflinePackets}
            />

            {/* Resource Inventory & Shelter Balancer */}
            <ResourceInventory
              scenario={currentScenario}
            />
          </div>

        </main>
      )}

      {/* Modals: Official SITREP Report & Mobile QR Code */}
      <SitrepExport
        scenario={currentScenario}
        incidents={incidents}
        isOpen={isSitrepModalOpen}
        onClose={() => setIsSitrepModalOpen(false)}
      />

      <MobileQrModal
        isOpen={isQrModalOpen}
        onClose={() => setIsQrModalOpen(false)}
      />

    </div>
  );
}
