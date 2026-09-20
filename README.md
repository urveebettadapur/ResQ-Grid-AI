
# ResQ-Grid AI 🚨

### Explainable, Adaptive Disaster-Response Coordination

ResQ-Grid AI is an AI-powered disaster-response decision-support platform designed to help relief coordinators prioritize civilian SOS requests, allocate limited relief resources, and adapt response recommendations as disaster conditions change.

During disasters, critical information about civilian needs, resource availability, road accessibility, and relief hubs can change rapidly. ResQ-Grid AI aims to connect these fragmented operational inputs into a unified system that supports faster, more transparent, and resource-aware decision-making.

---

## 🎯 Problem Statement

Disaster-response operations often involve multiple simultaneous SOS requests, limited relief supplies, changing road conditions, and uneven resource distribution.

Conventional coordination approaches can struggle to continuously reassess priorities and resource assignments when conditions change.

ResQ-Grid AI addresses this challenge through:

- Structured SOS intake and prioritization.
- Explainable emergency triage recommendations.
- Intelligent matching of requests with relief resources.
- Adaptive reallocation when conditions change.
- Geospatial visualization of incidents, resources, and response routes.

---

## 💡 Core Features

### 1. Structured SOS Intake
Convert civilian emergency reports into structured information, including:

- Location
- Emergency category
- Severity
- Number of affected individuals
- Required assistance
- Additional contextual details

### 2. Explainable SOS Triage
Prioritize emergency requests using a transparent scoring framework based on factors such as:

- Immediate danger
- Medical urgency
- Number of affected individuals
- Vulnerability
- Waiting time
- Availability of alternatives

The system provides an explanation alongside each prioritization recommendation.

### 3. Resource Matching Engine
Match emergency requests with available relief hubs and resources based on:

- Resource availability
- Emergency priority
- Distance
- Existing allocations
- Hub capacity
- Estimated response feasibility

### 4. Adaptive Resource Reallocation
Reassess resource assignments when operational conditions change, such as:

- A relief hub running out of supplies
- A road becoming inaccessible
- A new high-priority SOS request
- A relief hub becoming unavailable

The system generates updated recommendations and explains the reason for each change.

### 5. Geospatial Response Visualization
Display relevant operational information through an interactive map, including:

- SOS locations
- Relief hubs
- Resource availability
- Suggested assignments
- Potentially inaccessible routes

### 6. Offline Queue Simulation
Demonstrate how emergency reports could be queued during connectivity disruptions and synchronized when connectivity is restored.

> Offline communication and network behavior will be simulated in the MVP and will not represent a production-ready mesh network.

---

## ⭐ Key Differentiators

### Adaptive Resource Allocation
Rather than making a one-time assignment, the system reassesses resource distribution as emergency conditions evolve.

### Explainable Decisions
Triage and allocation recommendations are accompanied by understandable reasoning based on the available inputs.

### Resource Scarcity Awareness
The system considers limited inventory, existing allocations, and competing emergency requests instead of relying only on proximity.

---

## 🏗️ Proposed Technology Stack

| Component | Technology |
|---|---|
| Backend | Python, FastAPI |
| AI / NLP | LLM APIs, LangChain |
| Data Processing | Python, Pandas |
| Database | SQLite / SQL |
| Geospatial Logic | NetworkX, Geospatial Libraries |
| Frontend | Streamlit / Web Interface |
| Visualization | Interactive Maps |
| Version Control | Git & GitHub |

*The final technology stack may evolve during implementation.*

---

## 🔄 Proposed System Workflow

1. A civilian SOS request is submitted.
2. The request is structured into actionable information.
3. The triage engine generates a priority recommendation.
4. Available relief resources and hubs are evaluated.
5. The resource matching engine recommends an allocation.
6. The recommendation is displayed with an explanation.
7. A simulated disruption changes the operational conditions.
8. The system reassesses and generates an updated allocation.

---

## 🌊 Initial Use Case

### Urban Flood Relief Coordination

The initial prototype focuses on coordinating relief during an urban flooding scenario.

Example:

- Multiple civilian SOS requests are received.
- Several relief hubs have limited medical supplies.
- One hub becomes inaccessible due to a simulated road closure.
- A new high-priority medical request is submitted.
- ResQ-Grid AI reassesses existing assignments and recommends an updated resource distribution.

This scenario demonstrates how the system responds to changing conditions rather than relying on static assignments.

---

## ⚠️ Project Scope and Limitations

ResQ-Grid AI is intended as a **decision-support prototype**, not an autonomous emergency-dispatch system.

The prototype will not claim to:

- Replace trained emergency responders.
- Provide clinically validated medical triage.
- Guarantee real-world route accessibility.
- Operate a production-ready SMS or mesh communication network.
- Independently make final emergency-response decisions.

Human oversight remains essential for real-world deployment.

---

## 🚀 Project Status

**Status:** In Development

This project is being developed as part of **HACKDAY 1.0** under the theme *Tech for a Better Tomorrow*.

The current focus is developing a functional MVP demonstrating explainable SOS prioritization, resource matching, and adaptive reallocation in a simulated disaster environment.

---

## 👥 Team

- **Urvee Bettadapur** — Developer
- **Prince Kumar** — Developer

---

## 🔮 Future Scope

Potential future enhancements include:

- Integration with verified emergency and government data sources.
- Real-time disaster and road-condition updates.
- Secure SMS-based emergency reporting.
- Multi-agency coordination.
- More advanced geospatial optimization.
- Historical data analysis for resource planning.
- Integration with verified NGO and relief-provider networks.

---

## 📄 License

License information will be added as the project develops.
