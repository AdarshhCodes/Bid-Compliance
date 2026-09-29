# PROJECT IDENTITY & CHARTER — PRAMAAN (प्रमाण)

**System Name:** PRAMAAN (प्रमाण — Sanskrit for "Proof", "Evidence", "Means of Valid Knowledge")  
**Tagline:** Evidence-First Bid Compliance Verification for GeM Procurement  
**Hackathon Event:** Smart India Hackathon (SIH) 2026  
**Problem Statement ID:** SIH26100  
**Nodal Ministry:** Ministry of Petroleum & Natural Gas (MoPNG)  
**Beneficiary Organization:** Chennai Petroleum Corporation Limited (CPCL)  
**Category:** Software | **Theme:** Smart Automation  

---

## 1. Executive Summary & Core Identity

Public procurement in India via the Government e-Marketplace (GeM) and CPSEs like Chennai Petroleum Corporation Limited (CPCL) processes tens of thousands of crores annually under strict regulatory oversight (General Financial Rules 2017, Public Procurement Policy for MSEs, Make in India Order, GeM General Terms and Conditions). 

Today, evaluating technical bids is a grueling manual bottleneck. Tender Evaluation Committees (TEC) must comb through 300–800 pages of PDF submissions per bidder, manually verifying statutory registrations (GSTN, PAN, Udyam), turnover declarations, CA certificates, OEM authorizations, and blacklisting status across 5–10 disconnected government web portals.

**PRAMAAN** is an **evidence-first, uncertainty-aware, decision-support platform** built for government procurement officers. It does not replace the human officer with an opaque artificial intelligence; instead, it synthesizes submitted bid documents with authoritative registries, verifies claims against deterministic rules, surfaces internal contradictions and cross-bidder collusion patterns, and presents an auditable clause-to-evidence graph.

> **Foundational Principle:**  
> *"PRAMAAN is a decision-support system, not an autonomous decision maker. AI doesn't decide who is qualified. It shows the officer exactly what the evidence says, where it disagrees, and what is still unknown."*

---

## 2. Target Users & Stakeholder Ecosystem

### Primary User: Tender Evaluation Committee (TEC) Member / CPCL Procurement Officer
- **Role:** Technical or commercial officer responsible for scrutinizing bids submitted against high-value CPCL and GeM tenders.
- **Statutory Burden:** Personally accountable to Central Vigilance Commission (CVC), Comptroller and Auditor General (CAG), and Right to Information (RTI) queries for any oversight or wrongful qualification/disqualification.
- **Current Frustrations:**
  - Tedious repetitive re-typing of registration IDs into slow, captcha-protected government portals.
  - Inability to verify whether a snapshot certificate uploaded by a bidder was revoked/suspended weeks later.
  - Inability to detect if two seemingly competing bidders submitted documents from the same computer, share bank accounts, or copied technical text word-for-word.
  - Severe time pressure resulting in superficial checking of complex calculations (e.g., local-content / Make-in-India percentages).
  - The constant dread of future audit inquiries requiring manual reconstruction of why a vendor was accepted 18 months prior.

### Secondary Users & Stakeholders:
1. **Head of Procurement / Vigilance Officer (CPCL / MoPNG):** Needs aggregate compliance visibility across tenders, anomaly tracking, and an incontrovertible audit log for grievance redressal and CVC scrutiny.
2. **GeM Platform Scrutiny Teams:** Central teams seeking automated pre-filtering of rogue sellers before bids reach CPSE buyers.
3. **Legitimate MSME / Startup Bidders:** Suffer when shell companies or collusive cartels manipulate tender requirements or submit falsified certificates without detection.

---

## 3. The Real Procurement Workflow Deconstructed

The official procurement lifecycle follows these sequential stages:
```
Tender Creation (CPCL / GeM) 
  → Bid Submission (Technical + Commercial Packets) 
  → Bid Opening & Document Harvesting
  → Technical Eligibility Screening  <-- [PRAMAAN CORE OPERATIONAL ZONE]
  → Technical Evaluation (Specs & BoM)
  → L1 Price Determination & Confirmation
  → Award of Contract (AoC)
  → Post-Award Audit (CVC / CAG / RTI) <-- [PRAMAAN AUDIT RECONSTRUCTION ZONE]
```

### Where Manual Effort Concentrates Today:
1. **Certificate Verification:** Opening 5–10 external browser tabs (GST portal, MCA21, Udyam, EPFO, ESIC, CPPP debarment) per bidder to re-type IDs and check active status.
2. **Cross-Document Reconciliation:** Comparing financial numbers (e.g., Average Annual Turnover) across the CA Certificate (with UDIN), audited balance sheets, ITR acknowledgments, and the bidder's summary declaration table.
3. **OEM Authorization Auditing:** Scrutinizing authorization letters to verify (a) specific tender reference, (b) validity period, (c) signatory authority, and (d) exact item/equipment scope.
4. **Make-in-India (MII) Verification:** Verifying declared local-content percentage against the Bill of Materials (BoM) line items rather than just trusting the self-declaration.

---

## 4. Hidden Failure Modes The Problem Statement Leaves Unsaid

Through deep domain analysis, PRAMAAN identifies 5 critical failure modes that standard AI prototypes miss:

1. **Silent Staleness (Temporal Validity Decay):**  
   A bidder uploads a genuine GST or Udyam certificate valid on the day of download. By the time the tender is evaluated 45 days later, the registration has been cancelled or suspended for non-filing. Traditional document checking sees a valid PDF; PRAMAAN checks current status at evaluation time.
2. **Internally Valid but Externally False:**  
   A PDF document may have no visual tampering (authentic letterhead, clean layout), yet state facts that the issuing authority's registry directly refutes.
3. **Cross-Bidder Collusion Blindspot:**  
   When bids are evaluated in per-bid silos, officers cannot see that Bidder A and Bidder B share the same bank account number/IFSC, share registered office addresses, have overlapping directors, or uploaded PDFs created on the exact same workstation within 4 minutes.
4. **Lack of Retrospective Defensibility:**  
   Years after a tender award, when challenged in High Court or before the CVC, the procurement officer must recreate their decision context. If the evaluation was an opaque AI score or an unrecorded manual review, defending the decision is impossible.
5. **Government API Unavailability:**  
   External government endpoints frequently suffer downtime, rate limits, or network timeouts. A system that crashes or defaults to "fail" when a portal is down is non-viable in government operations.

---

## 5. Scope vs. Non-Scope

### In-Scope (PRAMAAN System Boundaries)
- **Tender Ingestion:** Parsing tender eligibility criteria, mandatory clauses, and threshold rules from GeM bid documents.
- **Bid Document Ingestion & Classification:** Processing PDFs (scanned and digital), identifying document categories (GST, Udyam, CA Turnover, OEM Authorization, Make-in-India declarations, ITR, Board Resolutions).
- **Evidence Extraction & Provenance:** Extracting exact facts with page citations, bounding box metadata, and confidence scores.
- **Deterministic & Adapter Verification:** Executing rule engines for threshold checks and querying authoritative registries (live where available, high-fidelity mock adapters for SIH demo).
- **Contradiction Detection:** Automatic detection of conflicting numbers or dates across documents submitted by the same bidder.
- **Cross-Bidder Graph Intelligence:** Surface shared entities (bank accounts, directors, addresses, document template fingerprints) across the whole tender.
- **Three-State Verdict Generation:** Rendering every requirement strictly as `VERIFIED`, `CONTRADICTED`, or `UNVERIFIABLE`.
- **Officer Investigation UI:** Side-by-side evidence preview, manual override with mandatory rationale logging, and exportable compliance matrices.
- **Tamper-Evident Audit Ledger:** Cryptographically linked decision reconstruction log recording rule versions, model versions, evidence snapshots, and officer actions.

### Explicit Non-Scope
- **Automated Disqualification:** PRAMAAN never disqualifies or approves a bidder autonomously.
- **Financial L1 Price Bidding:** Commercial price packet opening and reverse auctions are outside scope; focus is strictly on technical eligibility and statutory compliance.
- **Legal Advisory / Statutory Adjudication:** PRAMAAN flags signals and rule violations; it does not render legal opinions.
- **Direct Live Write-Back to GeM/NIC Databases:** During the SIH prototype phase, PRAMAAN operates as an independent review platform and does not modify official government records.

---

## 6. Core Product Principles

1. **Evidence Over Confidence:** Never display a naked claim or score. If the system cannot highlight the exact sentence, table cell, or registry response, it has no authority to make a statement.
2. **Honest Uncertainty (`UNVERIFIABLE`):** When an API fails, a document is illegible, or evidence is inconclusive, state `UNVERIFIABLE` with the exact root cause. Never guess or hallucinate compliance.
3. **Deterministic Separation:** Arithmetic, dates, PAN/GSTIN regexes, and policy thresholds must be computed by deterministic software rules, **never** delegated to an LLM.
4. **Adversarial Robustness:** Treat every submitted document as potentially adversarial data. Defend against prompt-injection attacks embedded in PDF text.
5. **Total Reconstructibility:** Any audit conducted 5 years later must be able to replay the exact state of evidence, rules, model versions, and human inputs at the moment of decision.
