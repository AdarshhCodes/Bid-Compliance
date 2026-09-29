# IMPLEMENTATION ROADMAP & 36-HOUR BUILD PLAN — PRAMAAN

**Document Status:** Execution Playbook & Engineering Task Breakdown  
**Guiding Principle:** *Prefer ONE deep, completely functional, auditable workflow over TEN shallow, half-baked screens.*  

---

## 1. 36-Hour Scope Control Matrix

| Tier | Focus Area | Mandatory Deliverables | Rationale |
| :--- | :--- | :--- | :--- |
| **P0 (Absolute Must-Have)** | Core End-to-End Investigation Flow | - CPCL Tender & 7 Synthetic Bidders.<br>- Three-State Verdict Engine (`VERIFIED`, `CONTRADICTED`, `UNVERIFIABLE`).<br>- Side-by-Side Contradiction Viewer (Bidder 2 Turnover discrepancy).<br>- Mock Registry Adapters with simulated GSTN timeout (Bidder 7).<br>- Officer Override Modal with mandatory rationale.<br>- Tamper-evident SHA-256 Decision Reconstruction Ledger. | Minimum viable proof of the core thesis: "We verify claims against evidence and show our work." |
| **P1 (Key Differentiators)** | Advanced Intelligence & Defensibility | - Interactive Cross-Bidder Relationship Graph (Bidders 4 & 5 shared bank account).<br>- Temporal Staleness Engine (Bidder 3 cancelled Udyam).<br>- Semantic OEM Authorization mismatch detector (Bidder 6).<br>- Prompt-Injection Adversarial Text Scanner & Alert.<br>- BoM Local-Content Arithmetic Re-derivation. | The specific capabilities that win against 20 generic hackathon RAG chatbots. |
| **P2 (Nice-to-Have)** | Workflow Polish & Automation | - Comprehensive PDF export of evaluation audit dossier.<br>- Fuzzy identity reconciliation tool for minor trade-name variations.<br>- RAG natural-language assistant for officer Q&A ("Why did clause 4.2 fail?"). | Enhances demo richness if time permits after P0 & P1 are stable. |
| **CUT-FIRST (Immediate Drops if Delayed)** | High-Effort Non-Critical Elements | - Complex user management / multi-role SSO login screens.<br>- Live WebSocket streaming of OCR progress.<br>- Multi-tender comparison analytics.<br>- Complex 3D animations or decorative dashboard charts. | Adds zero value to the core procurement evaluation thesis. |

---

## 2. Phased Implementation Roadmap

```
Phase 0: Brain & Architecture (COMPLETED)
   │
   ▼
Phase 1: Project Scaffolding & Core Foundations (COMPLETED)
   │
   ▼
Phase 2: CPCL Tender & Synthetic Bidder Dossier Seeding (NEXT)
   │
   ▼
Phase 3: Document Ingestion & Dual-Engine OCR Pipeline
   │
   ▼
Phase 4: Evidence Extraction & Bounding-Box Grounding
   │
   ▼
Phase 5: Verification Engine & Polymorphic Adapters
   │
   ▼
Phase 6: Side-by-Side Contradiction Inspector
   │
   ▼
Phase 7: Cross-Bidder Graph Intelligence Engine
   │
   ▼
Phase 8: Officer Review & Tamper-Evident Ledger
   │
   ▼
Phase 9: Judge Interactive Cockpit & Fault-Injection
   │
   ▼
Phase 10: Final Polish, Rehearsal & Hardening
```

---

### Phase 1: Project Scaffolding & Core Foundations
- **Goal:** Establish clean, decoupled repository structure with typed contracts, database models, and design system variables.
- **Tasks:**
  - Initialize React 18 + TypeScript frontend with investigative design system tokens.
  - Initialize FastAPI backend with Pydantic v2 schemas mirroring `DATA_MODEL.md`.
  - Configure SQLite / PostgreSQL persistence for local development.
- **Dependencies:** `DESIGN_SYSTEM.md`, `DATA_MODEL.md`.
- **Definition of Done (DoD):** Frontend renders layout shell; Backend returns API health check; typed data schemas compile without errors.
- **Risks:** Over-engineering build tooling. Keep dependencies minimal and rock-solid.

---

### Phase 2: CPCL Tender & Synthetic Bidder Dossier Seeding
- **Goal:** Create realistic CPCL valve procurement tender (`CPCL/2026/VALVES-7701`) and generate high-fidelity synthetic PDFs for the 7 demo bidders.
- **Tasks:**
  - Draft authentic tender specification with clauses for Turnover, GST, Udyam, OEM Authorization, and Make-in-India.
  - Generate 7 bidder submission bundles with deliberate edge cases:
    - Bidder 1: 100% compliant clean bundle.
    - Bidder 2: Cover letter (₹12 Cr) vs CA Certificate (₹9 Cr).
    - Bidder 3: Valid-looking Udyam cert cancelled 2 weeks prior.
    - Bidders 4 & 5: Proposals sharing Bank Account `HDFC0001234 : 50200088991122` and identical text.
    - Bidder 6: OEM letter for domestic plumbing valves instead of refinery valves.
    - Bidder 7: Standard files configured to trigger GST adapter timeout.
- **Dependencies:** Phase 1 complete.
- **Definition of Done (DoD):** All 7 bidder PDF bundles generated, stored in asset directory, and seeded in database.

---

### Phase 3: Ingestion & Dual-Engine OCR Pipeline
- **Goal:** Process uploaded PDFs, extract metadata, and generate character-level coordinate tokens.
- **Tasks:**
  - Implement PyMuPDF native text and vector coordinate extractor.
  - Implement fallback OCR routine for scanned pages.
  - Implement Document Classifier (GST, Udyam, CA Cert, OEM, BoM).
- **Dependencies:** Phase 2 complete.
- **Definition of Done (DoD):** Every PDF page converted to token stream with normalized bounding boxes `[ymin, xmin, ymax, xmax]`.

---

### Phase 4: Evidence Extraction & Bounding-Box Grounding
- **Goal:** Transform unstructured text and tables into first-class `EvidenceRecord` objects.
- **Tasks:**
  - Build structured extraction routines for financial turnover, dates, UDIN, and registration IDs.
  - Build BoM table extractor for domestic vs imported line items.
  - Implement regex checksum validators (Luhn for GSTIN, PAN format).
  - Ground each extracted fact to page number and bounding box coordinates.
- **Dependencies:** Phase 3 complete.
- **Definition of Done (DoD):** Database populated with first-class `Evidence` rows linked to coordinates.

---

### Phase 5: Verification Engine & Polymorphic Adapters
- **Goal:** Implement the Four-State Verdict Machine and external registry adapters.
- **Tasks:**
  - Implement `VerificationAdapter` interface.
  - Build `MockGSTNAdapter`, `MockUdyamAdapter`, `MockMCAAdapter`, `MockDebarmentAdapter`.
  - Implement deterministic threshold and date comparison rules.
  - Implement circuit-breaker logic supporting the `UNVERIFIABLE` state.
- **Dependencies:** Phase 4 complete.
- **Definition of Done (DoD):** Verification engine evaluates all 7 bidders and correctly assigns `VERIFIED`, `CONTRADICTED`, and `UNVERIFIABLE` verdicts.

---

### Phase 6: Side-by-Side Contradiction Inspector
- **Goal:** Deliver the visual centerpiece of PRAMAAN: the synchronized split-screen contradiction viewer.
- **Tasks:**
  - Build PDF viewer component with canvas bounding box highlight overlay.
  - Build dual-document split view for Bidder 2 displaying Cover Letter on left and CA Certificate on right.
  - Render dynamic delta callout: $\Delta = -₹3.00\text{ Cr } (-25.0\%)$.
- **Dependencies:** Phase 5 complete.
- **Definition of Done (DoD):** Clicking "Inspect Contradiction" smoothly navigates to exact pages with yellow bounding boxes highlighted.

---

### Phase 7: Cross-Bidder Graph Intelligence Engine
- **Goal:** Deliver the whole-tender collusion detection visualizer.
- **Tasks:**
  - Implement relationship graph traversal (extracting shared bank accounts, addresses, directors).
  - Implement proposal text similarity comparator.
  - Build interactive D3.js / Cytoscape graph view rendering node-link topology.
  - Build slide-out forensic drawer detailing shared coordinates on edge click.
- **Dependencies:** Phase 5 complete.
- **Definition of Done (DoD):** Graph renders with Bidder 4 & 5 highlighted in purple; clicking edge opens shared bank account forensic drawer.

---

### Phase 8: Officer Review & Tamper-Evident Ledger
- **Goal:** Enable human officer overrides and record immutable cryptographic audit events.
- **Tasks:**
  - Build Officer Review Workload Queue sorted by $(Uncertainty \times Materiality)$.
  - Build Officer Override Modal enforcing categorized reason and minimum 30-character justification.
  - Implement append-only audit table with SHA-256 hash chaining:
    $$\text{CurrentHash} = \text{SHA256}(\text{Index} \,\|\, \text{PriorHash} \,\|\, \text{Timestamp} \,\|\, \text{PayloadHash})$$
  - Build Decision Reconstruction Screen replaying timeline and cryptographic proofs.
- **Dependencies:** Phase 6 complete.
- **Definition of Done (DoD):** Officer overrides Bidder 7 or 2; new block commits instantaneously to audit ledger with valid SHA-256 chain.

---

### Phase 9: Judge Interactive Cockpit & Fault-Injection
- **Goal:** Arm the team with interactive demo controls to let judges test the system live.
- **Tasks:**
  - Build "Simulate GSTN Gateway Outage" button.
  - Build "Adversarial Prompt-Injection Test" button showing injection defense.
  - Build "Tender Clause Selector" allowing judges to inspect any requirement.
- **Dependencies:** Phases 1–8 complete.
- **Definition of Done (DoD):** All 3 wow moments triggered via one-click presenter controls.

---

### Phase 10: Final Polish, Rehearsal & Hardening
- **Goal:** Eliminate all console errors, test projector resolutions, and conduct timed pitch dry-runs.
- **Tasks:**
  - Audit all UI elements against WCAG AAA contrast and design tokens.
  - Verify zero uncaught JavaScript errors in browser DevTools.
  - Conduct 3 full dress rehearsals of the 7-minute pitch.
- **Dependencies:** All phases complete.
- **Definition of Done (DoD):** Ready for Grand Finale jury presentation.
