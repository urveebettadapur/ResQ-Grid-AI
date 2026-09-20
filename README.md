# ResQ-Grid AI 🚨

### Explainable, Adaptive Disaster-Response Coordination

ResQ-Grid AI is an AI-powered disaster-response decision-support platform designed to help relief coordinators prioritize civilian SOS requests, allocate limited relief resources, and adapt response recommendations as disaster conditions change.

During disasters, critical information about civilian needs, resource availability, road accessibility, and relief hubs can change rapidly. ResQ-Grid AI aims to connect these fragmented operational inputs into a unified system that supports faster, more transparent, and resource-aware decision-making.

---

## 🎯 Problem Statement

Disaster-response operations can break down when communication infrastructure fails, situational information becomes outdated, and emergency requests compete for limited response capacity.

### 📡 Helpline Congestion & Blackouts

During floods and cyclones, cellular infrastructure can become unavailable or overloaded. Traditional emergency helplines can receive large volumes of unstructured requests while providing limited geospatial context to responders.

### 🗺️ Static Maps Fail in Dynamic Floods

Conventional GPS navigation does not inherently account for rapidly changing flood depths, submerged bridges, road debris, or electrical hazards. A route that is safe under normal conditions can become dangerous during an active disaster.

### ⏱️ The Lost "Golden Hour"

First responders need a way to distinguish urgent cases from lower-priority requests. Infants, pregnant civilians, people with serious injuries, and other high-risk cases may require immediate attention.

ResQ-Grid AI addresses these challenges through:

* Structured civilian SOS intake.
* Explainable emergency triage recommendations.
* Geospatial visualization of incidents and hazards.
* Dynamic safe-corridor routing.
* Resource-aware response coordination.
* Adaptive recommendations as conditions change.

---

# 🚨 Core Solution

ResQ-Grid AI brings civilian distress signals, GIS intelligence, emergency triage, and response routing into a unified coordination platform.

The system is built around three primary components:

### 1. 📱 Zero-Internet Civilian SOS Portal

A 1-tap emergency interface designed to capture critical information with minimal user interaction.

Features include:

* Emergency SOS beacon.
* Live GPS location capture.
* Camera-based damage evidence.
* Microphone voice-note recording.
* Local data persistence.
* Hop-to-Hop P2P relay architecture.

The current browser implementation demonstrates the **software-side mesh relay mechanism**. Physical device-to-device communication without cellular connectivity is planned as a future hardware extension.

### 2. 🛰️ High-Resolution Satellite GIS Mission Control

The mission-control interface provides a geospatial view of disaster conditions and response activity.

It combines:

* Esri ArcGIS World Imagery.
* Dynamic flood-depth polygons.
* Hazard markers.
* Incident locations.
* Relief/response locations.
* Active responder tracking.
* Weather-related situational information.

Flood inundation vectors can represent depths ranging from approximately **0.6 m to 2.8 m** in the demonstration environment.

### 3. 🧭 A* Dynamic Safe-Corridor Router

The routing engine calculates response paths while considering disaster-specific obstacles.

The system uses:

* A* pathfinding.
* Haversine distance calculations.
* Flooded-zone avoidance.
* Blocked-bridge avoidance.
* Electrical/power hazard avoidance.
* Distance and ETA calculations.

Instead of treating the shortest conventional route as automatically safe, the system incorporates disaster-zone constraints into the route calculation.

---

# 👥 Target Users

ResQ-Grid AI is designed around a multi-stakeholder emergency ecosystem.

### 🧑‍🚒 First Responders

**NDRF / SDRF / Coast Guard / Red Cross field teams**

Responders can use the platform to access:

* SOS locations.
* Survivor information.
* Geospatial hazards.
* Safe response corridors.
* Audio distress recordings.
* Incident evidence.

### 🆘 Stranded Disaster Victims

Civilians in crisis zones can provide:

* One-tap SOS requests.
* GPS location.
* Voice distress information.
* Damage photographs.
* Emergency context.

The interface is designed to minimize the amount of interaction required during a high-stress situation.

### 🖥️ Emergency Operations Center

Disaster-management commanders can use the mission-control interface to coordinate:

* Incoming SOS requests.
* Triage priorities.
* Relief resources.
* Response teams.
* Shelter capacity.
* Medical supplies.
* Situation reports.

The intended information flow is:

**Stranded Civilians → Emergency Operations Center → First Responders**

---

# 🧠 Explainable Emergency Triage

A central component of ResQ-Grid AI is its **Multi-Factor Clinical/Spatial Scorer**.

Instead of producing an unexplained priority value, the system evaluates identifiable factors contributing to emergency urgency.

The demonstration scoring model produces an urgency score from:

**0 → 100**

Factors can include:

* Infant headcount.
* Water-rise conditions.
* Medical trauma.
* Spatial/disaster context.

### Example

An SOS request involving:

* Multiple civilians.
* Infants.
* Rapidly rising water.
* Serious medical trauma.

can receive a higher urgency score than a request involving a lower-risk situation.

The purpose is not simply to produce a number, but to provide an interpretable basis for why an incident has been prioritized.

---

# 🗺️ GIS & Disaster Intelligence

The GIS layer combines satellite imagery with custom disaster overlays.

### Mapping Stack

* **Leaflet.js**
* **Esri ArcGIS World Imagery**
* **GeoJSON**
* Dynamic inundation-depth vectors
* Hazard markers
* Incident markers
* Response routes

The demonstration environment uses flood-depth visualization ranging from approximately:

**0.6 m → 2.8 m**

This allows the routing layer and operations interface to reason about disaster conditions beyond conventional road-network information.

---

# 🧭 Dynamic Safe-Corridor Routing

The routing subsystem uses an **A* Safe-Corridor Algorithm** combined with **Haversine distance calculations**.

Conceptually:

```text
SOS / Mission Request
        ↓
Identify Origin & Destination
        ↓
Load Disaster Constraints
        ↓
Identify Unsafe Zones
        ↓
A* Pathfinding
        ↓
Remove Hazardous Corridors
        ↓
Calculate Distance & ETA
        ↓
Safe Response Route
```

The routing system is designed to avoid conditions such as:

* Submerged bridges.
* Flooded zones.
* Blocked roads.
* High-voltage hazards.

This provides responders with a disaster-aware route rather than relying solely on conventional shortest-path navigation.

---

# 🔄 Hop-to-Hop Mesh Relay

One of ResQ-Grid AI's key architectural concepts is a **Hop-to-Hop Mesh Relay**.

The software prototype uses:

* **BroadcastChannel API**
* **IndexedDB**
* Packet identifiers.
* Deduplication.
* Hop-count tracking.
* Local outbox queuing.

The relay logic follows a concept similar to:

```text
SOS Device
    ↓
Hop 1
    ↓
Hop 2
    ↓
Hop 3
    ↓
Hop 4
    ↓
Hop 5
    ↓
Gateway / Connected Device
```

Each packet maintains a hop count. As it is forwarded, the hop count is decremented:

```text
5 → 4 → 3 → 2 → 1 → 0
```

Previously seen packet IDs are deduplicated to prevent unnecessary repeated forwarding.

IndexedDB provides a local outbox mechanism so that messages can persist locally before forwarding.

### ⚠️ Current Implementation vs Future Hardware

The current browser implementation demonstrates the **software relay architecture between nearby browser contexts/devices where the browser platform permits it**.

A browser's BroadcastChannel API does **not** itself create physical radio communication between disconnected devices.

True zero-cellular physical mesh communication is therefore planned through dedicated hardware such as LoRa-based radios.

---

# 🎙️ Emergency Audio & Media Capture

ResQ-Grid AI incorporates browser-native media capabilities for collecting emergency evidence.

### Camera

The Camera File API enables users to attach photographs documenting:

* Structural damage.
* Flooding.
* Blocked routes.
* Other visible disaster conditions.

### Voice

HTML5 **MediaRecorder** enables emergency voice-note recording and playback.

Voice recordings can provide contextual information that may be difficult to capture through structured forms, particularly when users are under stress.

### Tactical Audio

The platform also uses the **Web Audio API** to synthesize interface sounds such as:

* Sonar sweeps.
* Emergency alerts.
* Dispatch radio chimes.

These sounds are generated in-browser without requiring external audio assets.

---

# 🏗️ Technical Architecture

```text
┌───────────────────────────────┐
│       Civilian SOS Input      │
│ GPS • Photo • Voice • SOS     │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│    Hop-to-Hop Mesh Relay      │
│ BroadcastChannel + IndexedDB  │
│ Deduplication + Hop TTL       │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│        SOS Validation         │
│ Structured Incident Data      │
└───────────────┬───────────────┘
                │
                ▼
┌─────────────────────────────────────────┐
│        GIS + Explainable Triage         │
│                                         │
│ Leaflet + Esri GIS                      │
│ Flood Depth GeoJSON                     │
│ Multi-Factor Urgency Scoring            │
└───────────────┬─────────────────────────┘
                │
                ▼
┌───────────────────────────────┐
│   Emergency Operations Center │
│ Incidents • Resources • Routes│
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│    A* Safe-Corridor Router    │
│ Flood • Bridge • Power Hazard │
│ Distance + ETA                │
└───────────────┬───────────────┘
                │
                ▼
┌───────────────────────────────┐
│       First Responders        │
│     Rescue / Relief Teams     │
└───────────────────────────────┘
```

---

# 🛠️ Technology Stack

| Subsystem            | Technologies                          | Purpose                                           |
| -------------------- | ------------------------------------- | ------------------------------------------------- |
| Frontend Framework   | React 19, Vite, Tailwind CSS          | Responsive emergency coordination interface       |
| GIS Engine           | Leaflet.js, Esri ArcGIS World Imagery | Satellite mapping and geospatial visualization    |
| Disaster Overlays    | GeoJSON                               | Flood-depth and hazard visualization              |
| Mesh Relay           | BroadcastChannel API, IndexedDB       | Local packet relay, deduplication and persistence |
| Pathfinding          | A* Safe-Corridor Algorithm            | Disaster-aware response routing                   |
| Distance Calculation | Haversine                             | Geographic distance and ETA calculations          |
| Explainable AI       | Multi-Factor Clinical/Spatial Scorer  | 0–100 emergency urgency scoring                   |
| Audio Capture        | HTML5 MediaRecorder                   | Emergency voice recording                         |
| Camera Capture       | Camera File API                       | Disaster-damage photo attachments                 |
| Tactical Audio       | Web Audio API                         | Sonar, alert and dispatch sounds                  |
| Deployment           | Vercel Edge CDN                       | Web deployment and HTTPS                          |

---

# 📊 System Workflow

```text
1. Civilian submits SOS
          ↓
2. Location + emergency evidence captured
          ↓
3. SOS packet validated
          ↓
4. Incident enters mission-control system
          ↓
5. Explainable urgency score calculated
          ↓
6. Incident visualized on GIS
          ↓
7. Disaster hazards evaluated
          ↓
8. A* calculates safe response corridor
          ↓
9. Operations center assigns response
          ↓
10. First responder receives mission information
```

The system is designed around a continuous response loop:

**MONITOR → TRIAGE → ROUTE → RESPOND → ADAPT**

---

# 💻 Running the Project

## Prerequisites

Make sure you have:

* Node.js
* npm

installed on your system.

## Clone the Repository

```bash
git clone https://github.com/urveebettadapur/ResQ-Grid-AI.git
cd ResQ-Grid-AI
```

## Install Dependencies

```bash
npm install
```

## Start the Development Server

```bash
npm run dev
```

The application can then be accessed through the local development URL displayed by Vite.

---

# 🌐 Deployment

The project is deployed using **Vercel Edge CDN** with HTTPS support.

**Live Demo:**

[ResQ-Grid AI — Live Demo](https://res-q-grid-ai-iota.vercel.app/?utm_source=chatgpt.com)

---

# 📈 Market & Impact

The project presentation identifies the following **stated/projected opportunity metrics**:

### $31.5B Market Size

The supplied project material identifies a **$31.5B Global Disaster Preparedness & Emergency Management SaaS market**, with an **8.4% CAGR**.

### B2G Government Contracts

The proposed business model is based on annual SaaS licensing for disaster-management organizations and public-sector agencies, including:

* State Disaster Management Authorities.
* Municipalities.
* Emergency response organizations.
* NDRF battalions.

### +65% Latency Reduction

The supplied project material states a target impact metric of reducing emergency dispatch response time from approximately **45 minutes to under 15 minutes**.

These figures are presented as **projected/stated opportunity and impact metrics**, rather than independently verified measurements of the current prototype.

---

# 🚀 Scalability & Roadmap

ResQ-Grid AI is designed to evolve beyond a browser-based coordination platform.

## Phase 1 — Physical Mesh Connectivity

### LoRaWAN Physical Mesh Hardware

Integrate approximately **$15 off-the-shelf LoRa radio transceivers** to provide long-range communication independent of cellular infrastructure.

Target:

**Up to 15 km zero-cellular radio propagation**

---

## Phase 2 — Autonomous Logistics

### Autonomous Drone Autopilot

Future integration with the **MAVLink telemetry API** could allow autonomous medical-supply drones to follow computed A* safe corridors.

Potential workflow:

```text
Medical SOS
    ↓
Triage
    ↓
Safe Corridor Calculation
    ↓
Drone Dispatch
    ↓
MAVLink Telemetry
    ↓
Medical Supply Drop
```

---

## Phase 3 — Satellite Flood Intelligence

### Sentinel-1 Satellite SAR Feeds

Future integration with **Sentinel-1 Synthetic Aperture Radar (SAR)** data could provide automated flood-boundary updates.

The proposed roadmap targets:

**Automated 6-hour flood-boundary synchronization**

This would allow the GIS layer to incorporate updated satellite-derived flood information rather than relying exclusively on manually supplied disaster overlays.

---

# 🔮 If We Had More Time

Three additional capabilities are planned as future extensions.

### 1. WebBluetooth Physical Dongle Driver

Direct browser pairing with BLE emergency wristbands and beacons could enable telemetry from unconscious or incapacitated survivors.

**Survivor Telemetry**

---

### 2. On-Device Edge Vision Damage AI

An in-browser TensorFlow/OpenCV model could analyze uploaded photographs and classify visual indicators such as:

* Rooftop entrapment.
* Structural cracks.
* Visible disaster damage.

**Edge Computer Vision**

---

### 3. SMS Twilio Two-Way Fallback Bridge

A bidirectional SMS integration could allow basic emergency information exchange with 2G feature phones.

The proposed architecture would translate SMS requests into structured incidents within the GIS mission matrix.

**Universal SMS Access**

---

# 🗺️ Project Roadmap

```text
CURRENT
   │
   ▼
Web-Based Emergency Coordination
   │
   ├── Civilian SOS
   ├── GIS Mission Control
   ├── Explainable Triage
   ├── A* Safe Corridors
   └── Browser-Based Mesh Relay
   │
   ▼
NEXT
Physical LoRa Mesh
   │
   ▼
AUTONOMOUS RESPONSE
Drone Logistics + MAVLink
   │
   ▼
SATELLITE INTELLIGENCE
Sentinel-1 SAR Flood Detection
   │
   ▼
UNIVERSAL ACCESS
BLE Survivor Telemetry + SMS
```

---

# 🧩 Key Differentiators

### Explainable Triage

Emergency priorities are based on identifiable factors rather than an opaque priority label.

### Disaster-Aware Routing

A* routing incorporates disaster constraints such as flooded regions, blocked bridges, and power hazards.

### Resilient Communication Architecture

The project explores communication continuity through local persistence, packet deduplication, hop-count limits, and a future physical mesh layer.

### Integrated GIS Mission Control

SOS requests, disaster conditions, hazards, and response routes are brought together in a single operational interface.

### Edge-Oriented Architecture

The roadmap progressively moves intelligence and communication closer to the field through physical mesh hardware, edge computer vision, autonomous logistics, and satellite intelligence.

---

# ⚠️ Current Prototype Scope

ResQ-Grid AI is a **hackathon prototype and decision-support platform**, not a certified emergency-response system.

The current implementation demonstrates the software architecture and interaction model for:

* Emergency SOS intake.
* Geospatial incident visualization.
* Explainable urgency scoring.
* Disaster-aware routing.
* Media capture.
* Browser-based relay mechanisms.

Physical LoRa communication, autonomous drone deployment, Sentinel-1 automated ingestion, BLE survivor telemetry, and SMS fallback are **roadmap capabilities**, not claims about the current prototype.

Likewise, projected market figures and response-time improvements should not be interpreted as independently validated operational results.

---

# 🎯 Vision

Disaster response should not depend on a single communication channel, a static map, or an unexplained priority queue.

ResQ-Grid AI aims to build a resilient coordination layer that connects:

**Emergency Signals → Explainable Intelligence → Safe Routing → Coordinated Action**

> **From emergency signals to coordinated, explainable action.**

---

## 👩‍💻 Project

**ResQ-Grid AI**

**Explainable, Adaptive Disaster-Response Coordination**

Repository: [GitHub Repository](https://github.com/urveebettadapur/ResQ-Grid-AI?utm_source=chatgpt.com)

Live Demo: [ResQ-Grid AI](https://res-q-grid-ai-iota.vercel.app/?utm_source=chatgpt.com)
