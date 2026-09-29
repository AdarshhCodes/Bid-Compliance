# DEMONSTRATION SCENARIO & JURY INTERACTION PLAYBOOK — PRAMAAN

**Document Status:** Hackathon Demonstration Blueprint & Scripted Flow  
**Core Thematic Arc:** From Black-Box Suspicion to Evidentiary Proof  
**Target Time:** 6 to 8 minutes live presentation + 4 minutes interactive Q&A  

---

## 1. Demo Setup & Synthetic Dataset Specification

To avoid unreliable public internet or unauthorized live government database access during the hackathon, the live demonstration runs against a high-fidelity synthetic procurement dataset.

- **Tender Context:** CPCL (Chennai Petroleum Corporation Limited)
- **Tender Reference:** `CPCL/2026/VALVES-7701`
- **Work Title:** *"Procurement of High-Pressure API-6D Ball Valves & Pipeline Fittings for Manali Refinery Expansion"*
- **Estimated Tender Value:** ₹18.50 Crores
- **Mandatory Requirements:**
  1. Average Annual Turnover (Last 3 FYs) $\ge ₹10.00\text{ Crores}$
  2. Active GST Registration with zero return filing defaults in last 6 months
  3. Valid MSME / Udyam Certificate (for EMD & tender fee exemption)
  4. Non-Debarred Status on CPPP / GeM Central Watchlist
  5. OEM Authorization explicitly covering API-6D Pipeline Valves
  6. Minimum 50% Local Content under Make-in-India (Class-II Supplier)
- **Bidding Entities (7 Synthetic Bidders):**

```
┌────────────────────────────────────────────────────────────────────────┐
│                        THE 7 SYNTHETIC BIDDERS                         │
├──────────┬─────────────────────────────┬───────────────────────────────┤
│ ID       │ Legal Entity Name           │ Demonstration Role            │
├──────────┼─────────────────────────────┼───────────────────────────────┤
│ Bidder 1 │ Hindustan Valves Corp Ltd   │ Clean Benchmark (All VERIFIED)│
│ Bidder 2 │ Bharat Fluid Systems Pvt    │ Turnover Contradiction (9v12) │
│ Bidder 3 │ Chennai Petro Controls      │ Cancelled Udyam (Staleness)   │
│ Bidder 4 │ Apex Industrial Tech        │ Cartel Signal A (Shared Bank) │
│ Bidder 5 │ Zenith Flow Equipments      │ Cartel Signal B (Shared Bank) │
│ Bidder 6 │ Precision Piping Solutions  │ OEM Category Mismatch         │
│ Bidder 7 │ Deccan Heavy Engineering    │ GST Adapter Timeout (Graceful)│
└──────────┴─────────────────────────────┴───────────────────────────────┘
```

---

## 2. Minute-by-Minute Live Presentation Script

### Minute 0:00 – 1:00 | The Opening Hook & Reframing
- **Presenter Action:** Display Title Slide. Do NOT open with a login page or generic dashboard.
- **Spoken Script:**
  > *"Respected Members of the Jury, in government procurement through GeM, billions of rupees are awarded based on technical compliance. Yet today, officers must manually read hundreds of PDF pages across dozens of tabs. When AI is brought in, most systems give the officer an opaque 85% compliance score. If an officer accepts an AI score that later turns out to be wrong, the officer goes to jail or faces a CVC inquiry, not the AI.*  
  > *PRAMAAN was built on one uncompromising principle: AI does not decide who is qualified. It shows the officer exactly what the evidence says, where it disagrees, and what is still unknown. We don't score bids. We verify claims against evidence and show our work."*

---

### Minute 1:00 – 2:30 | The Investigation Workspace & Bidder 1 vs 2 (Contradiction)
- **Presenter Action:** Open the active CPCL tender. The Officer Workload Queue shows 7 bidders ranked by uncertainty $\times$ materiality.
- **Click:** Select **Bidder 2 (Bharat Fluid Systems)**.
- **The Screen Shows:** A prominent crimson alert: `CONTRADICTION DETECTED — CLAUSE 4.2 TURNOVER`.
- **Click:** Click "Inspect Contradiction".
- **The Split-Screen Activates (WOW MOMENT 1):**
  - **Left Viewer:** Bid Submission Cover Letter, Page 3, highlighting self-declared turnover: **₹12.00 Cr**.
  - **Right Viewer:** Uploaded CA Turnover Certificate with UDIN, Page 1, paragraph 2, highlighting certified turnover: **₹9.00 Cr**.
  - **The System Callout:**
    > *"Declared ₹12 Cr exceeds CA certified ₹9 Cr. Threshold is ₹10 Cr. Bidder FAILS mandatory requirement."*
- **Presenter Narrative:**
  > *"No manual cross-checking. The system extracts the values, identifies that the CA certificate refutes the cover letter, computes the mathematical delta, and flags that the true certified turnover fails CPCL's ₹10 Cr cutoff."*

---

### Minute 2:30 – 3:45 | Temporal Staleness & Freshness (Bidder 3)
- **Click:** Select **Bidder 3 (Chennai Petro Controls)**.
- **The Screen Shows:** Requirement: `MSME / Udyam EMD Exemption`. Verdict: `CONTRADICTED — REGISTRY STATUS REVOKED`.
- **The Inspector Reveals:**
  - Bidder uploaded an authentic, un-tampered Udyam certificate PDF dated 6 months ago.
  - Right drawer displays live query response from the Udyam Registry Adapter:
    `Status: CANCELLED (Effective: August 14, 2026 — 2 weeks before bid submission)`.
- **Presenter Narrative:**
  > *"Every other AI platform looks at the PDF, sees a valid certificate, and marks it green. PRAMAAN verifies dynamic temporal freshness. The registration was revoked two weeks before bid submission. A snapshot PDF is not proof of current status."*

---

### Minute 3:45 – 5:00 | Cross-Bidder Relationship Intelligence (Bidders 4 & 5)
- **Click:** Navigate to the **Cross-Bidder Relationship Graph**.
- **The Screen Shows (WOW MOMENT 2):** An interactive network graph of all bidders in the tender.
- **The Visual Anomaly:** A bright purple clustered edge connects **Bidder 4 (Apex Industrial Tech)** and **Bidder 5 (Zenith Flow Equipments)**.
- **Click:** Click the connecting edge.
- **The Relationship Drawer Expands:**
  1. **Financial Node:** Both entities share the exact same Bank Account number: `HDFC0001234 : 50200088991122`.
  2. **Text Fingerprint Node:** Bidder 4 and Bidder 5 have a `94.2%` structural text similarity in their technical proposals, including an identical unique typo in paragraph 4 (*"hydrolic"* instead of *"hydraulic"*).
- **Presenter Narrative:**
  > *"When an officer evaluates bids one by one, they never see cross-bidder collusion. PRAMAAN analyzes the tender as an interconnected graph. We don't defame anyone as 'fraud' — we surface the objective signal: two supposedly competing bidders share the same bank account and identical technical text."*

---

### Minute 5:00 – 6:15 | Semantic Clause Checking & Graceful Degradation (Bidders 6 & 7)
- **Click:** Quick glance at **Bidder 6 (Precision Piping Solutions)**.
  - Requirement: OEM Authorization for API-6D Valves.
  - Verdict: `CONTRADICTED — OEM_AUTHORIZATION_CATEGORY_MISMATCH`.
  - Evidence: Bidder submitted an authentic OEM letter from L&T, but the letter authorizes them for *domestic water valves*, not high-pressure refinery pipeline valves. Proves semantic understanding beyond "document exists".
- **Presenter Action (WOW MOMENT 3 — Live Fault Injection):**
  - Switch to **Bidder 7 (Deccan Heavy Engineering)**.
  - Live interaction: Click "Simulate GSTN Gateway Outage" (or trigger a timeout on the adapter).
  - The system initiates the query. After 2.5 seconds, the circuit breaker trips.
  - **The Screen Shows:**
    - Verdict: **`UNVERIFIABLE — ERR_ADAPTER_TIMEOUT_504`** (Amber badge).
    - Status: *"GSTN portal did not respond after 3 retries. System does NOT assume compliance. Routed to Officer Priority Queue for manual retry."*
- **Presenter Narrative:**
  > *"Watch what happened. The system did NOT crash. It did NOT guess. It did NOT mark it failed. It honestly labeled the check UNVERIFIABLE, preserving system integrity when government infrastructure fails."*

---

### Minute 6:15 – 7:30 | Officer Override & Tamper-Evident Audit Reconstruction
- **Presenter Action:** Act as the Procurement Officer on Bidder 7 or Bidder 2.
- **Interaction:**
  - Open Officer Review Action on Bidder 7.
  - Select Action: `OVERRIDE TO VERIFIED (MANUAL HARDCOPY INSPECTION)`.
  - Select Reason Category: `OFFLINE PHYSICAL CERTIFICATE VERIFIED`.
  - Type mandatory rationale: *"Physical sealed GST clearance certificate dated 28/09/2026 produced by vendor and verified manually."*
  - Click **Commit Decision**.
- **Click:** Navigate to the **Decision Reconstruction Screen (The Audit Ledger)**.
- **The Screen Shows:**
  - A chronological, immutable event timeline.
  - Block #108 commits instantly with SHA-256 hash:
    `Hash: 7f8a9e... | PriorHash: 3b1c2d... | Actor: Officer_CPCL_4410`
  - Clicking the block displays the full retrospective snapshot: the exact rule version, the evidence as it existed at that second, the officer's written reason, and the cryptographic seal.
- **Closing Punchline:**
  > *"Five years from now, when the CVC or a High Court asks why this bid was handled this way, CPCL does not need to hunt for lost emails or trust someone's memory. PRAMAAN reconstructs the exact truth in two seconds."*

---

## 3. Interactive Jury Challenges (Letting the Judges Drive)

Prepare the demo laptop to invite the jury to test the system directly:

1. **Jury Challenge 1: "Can I click the document to see if you really found the text?"**
   - **Response:** Hand mouse to judge. Let them click any row in the Requirement Matrix. Watch the PDF viewer instantly navigate to page 2, zoom in, and highlight the bounding box.
2. **Jury Challenge 2: "What if the bidder uploaded an empty or corrupt file?"**
   - **Response:** Click "Upload Corrupt Test PDF" in the sandbox tab. The ingestion pipeline catches the malformed header, rejects it with `ERR_CORRUPT_PAYLOAD`, and flags the requirement as `UNVERIFIABLE — FILE_DAMAGED`.
3. **Jury Challenge 3: "Show me what happens if an officer tries to override without a reason."**
   - **Response:** Try to submit the override modal with an empty reason box. The interface disables the button, displaying: *"Mandatory statutory accountability requirement: minimum 30 characters of justification required."*

---

## 4. Emergency Backup & Resilience Plan

| Failure Point | Probability | Fallback Procedure |
| :--- | :---: | :--- |
| **Localhost Server Crash** | Low | Single Docker Compose restart script ready; static JSON fallback service boots in 5 seconds. |
| **Screen Resolution Mismatch** | Medium | UI built with strict responsive viewport breakpoints (`min-width: 1280px` optimized for projectors). |
| **Model API Latency Spikes** | Medium | Demo mode operates on pre-indexed extraction vectors with instant client-side retrieval; live AI extraction can be toggled via a dedicated "Live Re-Extract" button if requested by jury. |
| **Browser Video Recording** | Zero-risk | High-resolution walkthrough video pre-recorded and accessible via single keystroke (`Ctrl+Shift+D`) if hardware completely fails. |
