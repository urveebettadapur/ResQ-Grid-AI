// Comprehensive Disaster Scenarios & Real-Time GIS Telemetry Datasets

export const DISASTER_SCENARIOS = {
  flood_brahmaputra: {
    id: "flood_brahmaputra",
    name: "Urban Flash Flood & River Inundation",
    location: "Guwahati & Kamrup Metro Sector",
    region: "Brahmaputra River Basin",
    type: "FLOOD",
    severityLevel: "DEFCON 1 - CRITICAL",
    center: [26.1825, 91.7580],
    zoom: 13,
    weather: {
      temperature: "26°C",
      rainfall: "148 mm/24h",
      windSpeed: "42 km/h",
      riverLevel: "51.4m (1.8m above danger mark)",
      trend: "Rising +6 cm/hr"
    },
    inundationZones: [
      {
        id: "zone-1",
        name: "North Bank Deep Submersion",
        depthMeters: 2.8,
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.35,
        coordinates: [
          [26.2050, 91.7300],
          [26.2180, 91.7550],
          [26.2100, 91.7850],
          [26.1920, 91.7700],
          [26.1900, 91.7400]
        ]
      },
      {
        id: "zone-2",
        name: "Central Lowland Waterlogging",
        depthMeters: 1.4,
        color: "#f97316",
        fillColor: "#f97316",
        fillOpacity: 0.3,
        coordinates: [
          [26.1750, 91.7450],
          [26.1850, 91.7700],
          [26.1780, 91.7950],
          [26.1620, 91.7800],
          [26.1650, 91.7500]
        ]
      },
      {
        id: "zone-3",
        name: "South Hills Runoff Zone",
        depthMeters: 0.6,
        color: "#eab308",
        fillColor: "#eab308",
        fillOpacity: 0.25,
        coordinates: [
          [26.1550, 91.7200],
          [26.1650, 91.7400],
          [26.1500, 91.7650],
          [26.1400, 91.7350]
        ]
      }
    ],
    blockedHazards: [
      {
        id: "hazard-1",
        type: "BRIDGE_COLLAPSE",
        title: "Saraighat Old Approach Inundated",
        location: [26.1915, 91.6980],
        description: "Debris flow & submerged pylons. Impassable for land vehicles."
      },
      {
        id: "hazard-2",
        type: "POWER_GRID_FAILURE",
        title: "High-Voltage Substation 33kV Flooded",
        location: [26.1790, 91.7620],
        description: "Live electrical hazard in water. Safe distance: 150m."
      },
      {
        id: "hazard-3",
        type: "LANDSLIDE_BLOCKAGE",
        title: "Kamakya Hill Road Blocked",
        location: [26.1680, 91.7050],
        description: "120m mudslide barrier. Heavy earthmovers deployed."
      }
    ],
    reliefHubs: [
      {
        id: "hub-1",
        name: "NDRF Sector 1 Headquarters",
        type: "PRIMARY_COMMAND",
        location: [26.1850, 91.7250],
        capacity: 850,
        currentOccupancy: 412,
        supplies: {
          potableWaterLiters: 14500,
          foodPackets: 3200,
          bloodUnitsO_Neg: 45,
          bloodUnitsA_Pos: 120,
          medicKits: 350
        },
        fleet: {
          rescueBoats: 8,
          activeBoats: 5,
          autonomousDrones: 6,
          activeDrones: 4,
          ambulances: 12,
          activeAmbulances: 9
        },
        contact: "+91-361-2890112"
      },
      {
        id: "hub-2",
        name: "Gauhati Medical College Relief Hub",
        type: "TRAUMA_CENTER",
        location: [26.1580, 91.7720],
        capacity: 1200,
        currentOccupancy: 890,
        supplies: {
          potableWaterLiters: 8000,
          foodPackets: 1800,
          bloodUnitsO_Neg: 22,
          bloodUnitsA_Pos: 65,
          medicKits: 620
        },
        fleet: {
          rescueBoats: 3,
          activeBoats: 2,
          autonomousDrones: 2,
          activeDrones: 1,
          ambulances: 18,
          activeAmbulances: 14
        },
        contact: "+91-361-2529457"
      },
      {
        id: "hub-3",
        name: "Khanapara Safe High-Ground Shelter",
        type: "COMMUNITY_SHELTER",
        location: [26.1280, 91.8150],
        capacity: 2500,
        currentOccupancy: 1140,
        supplies: {
          potableWaterLiters: 25000,
          foodPackets: 7500,
          bloodUnitsO_Neg: 10,
          bloodUnitsA_Pos: 40,
          medicKits: 200
        },
        fleet: {
          rescueBoats: 2,
          activeBoats: 1,
          autonomousDrones: 4,
          activeDrones: 2,
          ambulances: 6,
          activeAmbulances: 4
        },
        contact: "+91-361-2334991"
      }
    ],
    initialIncidents: [
      {
        id: "SOS-8921",
        timestamp: "6 mins ago",
        location: [26.2020, 91.7510],
        address: "Brahmaputra Bank Ward 4, Submerged 2-Storey House",
        category: "TRAPPED_WATER",
        priority: "CRITICAL",
        urgencyScore: 96,
        headcount: { adults: 4, children: 3, infants: 1, pets: 1 },
        waterDepth: "2.4m (Rooftop retreat)",
        medicalCondition: "Infant dehydration + Elderly hypothermia",
        reporter: "Arun Das",
        phone: "+91-98640-XXXXX",
        status: "DISPATCHED",
        meshHops: 2,
        assignedUnit: "Boat Unit Bravo-3",
        notes: "Roof access only. Power lines submerged nearby. Flashlight signaling on east terrace.",
        aiRationale: "Critical priority (96/100): Water depth >2.2m with 1 infant and elderly hypothermia. Rooftop margin remaining: 45cm."
      },
      {
        id: "SOS-8922",
        timestamp: "12 mins ago",
        location: [26.1880, 91.7690],
        address: "Paltan Bazar St. Francis Lane",
        category: "MEDICAL_TRAUMA",
        priority: "CRITICAL",
        urgencyScore: 92,
        headcount: { adults: 2, children: 0, infants: 0, pets: 0 },
        waterDepth: "1.2m",
        medicalCondition: "Diabetic coma + Deep puncture wound from submerged iron sheet",
        reporter: "Sunita Sharma",
        phone: "+91-94351-XXXXX",
        status: "PENDING",
        meshHops: 1,
        assignedUnit: null,
        notes: "Patient losing consciousness. Bleeding controlled temporarily with tourniquet.",
        aiRationale: "Critical priority (92/100): Time-sensitive diabetic emergency with active trauma hemorrhage. Direct ambulance access blocked, requires amphibious rescue."
      },
      {
        id: "SOS-8923",
        timestamp: "19 mins ago",
        location: [26.1710, 91.7820],
        address: "Christian Basti Commercial Complex, 1st Floor",
        category: "FOOD_WATER_DEPLETED",
        priority: "HIGH",
        urgencyScore: 78,
        headcount: { adults: 14, children: 5, infants: 2, pets: 0 },
        waterDepth: "1.6m (Ground floor flooded)",
        medicalCondition: "No immediate trauma, clean water exhausted 18h ago",
        reporter: "Manoj Baishya",
        phone: "+91-97060-XXXXX",
        status: "PENDING",
        meshHops: 3,
        assignedUnit: null,
        notes: "Multiple families grouped on dry 1st floor. Urgent need for potable water and infant formula.",
        aiRationale: "High priority (78/100): High vulnerability headcount (21 persons including 2 infants) without clean water. Structure is structurally stable."
      },
      {
        id: "SOS-8924",
        timestamp: "28 mins ago",
        location: [26.1610, 91.7390],
        address: "Bharalumukh Riverside Settlement",
        category: "STRUCTURAL_COLLAPSE",
        priority: "CRITICAL",
        urgencyScore: 95,
        headcount: { adults: 6, children: 2, infants: 0, pets: 2 },
        waterDepth: "2.1m",
        medicalCondition: "2 persons trapped under collapsed tin canopy",
        reporter: "Dipak Talukdar",
        phone: "+91-98540-XXXXX",
        status: "EN_ROUTE",
        meshHops: 0,
        assignedUnit: "Rescue Drone Air-1 + NDRF Squad Alpha",
        notes: "Structure shifting due to fast water current. Acoustic cutters required.",
        aiRationale: "Critical priority (95/100): Structural instability in 2.1m swift water with active entrapment."
      },
      {
        id: "SOS-8925",
        timestamp: "35 mins ago",
        location: [26.1490, 91.7580],
        address: "Dispur Capital Sector Housing",
        category: "ELDERLY_ISOLATED",
        priority: "MODERATE",
        urgencyScore: 64,
        headcount: { adults: 2, children: 0, infants: 0, pets: 1 },
        waterDepth: "0.7m",
        medicalCondition: "Mobility impaired, wheelchair bound",
        reporter: "Priya Goswami",
        phone: "+91-91270-XXXXX",
        status: "RESCUED",
        meshHops: 1,
        assignedUnit: "Ambulance Med-4",
        notes: "Safely evacuated to Khanapara Shelter. Vital signs stable.",
        aiRationale: "Moderate priority (64/100): Wheelchair evacuation completed successfully. Zero immediate threat."
      }
    ],
    activeFleet: [
      {
        id: "unit-boat-1",
        name: "NDRF Boat Bravo-3",
        type: "RESCUE_BOAT",
        location: [26.1950, 91.7420],
        status: "EN_ROUTE",
        targetIncidentId: "SOS-8921",
        speed: "18 km/h",
        crew: 4,
        capacity: 8,
        etaMinutes: 4
      },
      {
        id: "unit-drone-1",
        name: "SkyGuard Recon Drone Air-1",
        type: "SURVEILLANCE_DRONE",
        location: [26.1750, 91.7480],
        status: "THERMAL_SCANNING",
        targetIncidentId: "SOS-8924",
        speed: "55 km/h",
        battery: "82%",
        payload: "Medic Pack + Thermal Cam",
        etaMinutes: 2
      },
      {
        id: "unit-amb-1",
        name: "ALS Ambulance Unit-7",
        type: "AMBULANCE",
        location: [26.1660, 91.7650],
        status: "PATROLLING_PERIMETER",
        targetIncidentId: null,
        speed: "35 km/h",
        oxygenCylinders: 4,
        etaMinutes: 0
      }
    ]
  },

  cyclone_chennai: {
    id: "cyclone_chennai",
    name: "Coastal Super Cyclone & Storm Surge",
    location: "Chennai Coastal & Marina Sector",
    region: "Bay of Bengal Corridor",
    type: "CYCLONE",
    severityLevel: "RED ALERT - CATEGORY 4",
    center: [13.0827, 80.2707],
    zoom: 12,
    weather: {
      temperature: "24°C",
      rainfall: "210 mm/24h",
      windSpeed: "135 km/h gusts",
      riverLevel: "Storm Surge 3.2m above tide",
      trend: "Landfall imminent in 2 hours"
    },
    inundationZones: [
      {
        id: "c-zone-1",
        name: "Marina Beach Coastal Inundation",
        depthMeters: 3.2,
        color: "#ef4444",
        fillColor: "#ef4444",
        fillOpacity: 0.35,
        coordinates: [
          [13.0400, 80.2750],
          [13.0700, 80.2850],
          [13.1000, 80.2950],
          [13.0900, 80.3150],
          [13.0350, 80.2950]
        ]
      }
    ],
    blockedHazards: [
      {
        id: "c-haz-1",
        type: "UPROOTED_TREES",
        title: "ECR Highway Blocked by 15 Uprooted Banyan Trees",
        location: [13.0300, 80.2650],
        description: "Power lines down. Chainsaw crew en route."
      }
    ],
    reliefHubs: [
      {
        id: "c-hub-1",
        name: "Jawaharlal Nehru Stadium Cyclone Shelter",
        type: "PRIMARY_COMMAND",
        location: [13.0830, 80.2780],
        capacity: 5000,
        currentOccupancy: 2890,
        supplies: {
          potableWaterLiters: 40000,
          foodPackets: 12000,
          bloodUnitsO_Neg: 50,
          bloodUnitsA_Pos: 150,
          medicKits: 800
        },
        fleet: {
          rescueBoats: 12,
          activeBoats: 8,
          autonomousDrones: 8,
          activeDrones: 6,
          ambulances: 24,
          activeAmbulances: 18
        },
        contact: "+91-44-25619200"
      }
    ],
    initialIncidents: [
      {
        id: "CYC-102",
        timestamp: "8 mins ago",
        location: [13.0550, 80.2800],
        address: "Santhome High Road Coastal Colony",
        category: "TRAPPED_WATER",
        priority: "CRITICAL",
        urgencyScore: 98,
        headcount: { adults: 8, children: 4, infants: 2, pets: 1 },
        waterDepth: "2.9m (Storm surge sea ingress)",
        medicalCondition: "Multiple lacerations from shattered window glass",
        reporter: "R. Karthik",
        phone: "+91-98401-XXXXX",
        status: "DISPATCHED",
        meshHops: 1,
        assignedUnit: "Coast Guard Amphibian 02",
        notes: "High wind gusts. Evacuation via reinforced rigid-inflatable boat.",
        aiRationale: "Critical priority (98/100): Direct coastal storm surge + 2 infants + high wind structural damage."
      }
    ],
    activeFleet: []
  }
};
