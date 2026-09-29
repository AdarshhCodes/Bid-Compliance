# ARCHITECTURE DECISION RECORDS (ADR) — PRAMAAN

**Document Status:** Permanent Architectural Log  
**Authority:** Mandatory guidance for all engineers, architects, and AI sessions.  
**Constraint:** Do NOT alter these decisions without formal ADR deprecation.  

---

## Index of Architectural Decisions

- **ADR-001:** Division of Responsibilities: Probabilistic AI vs. Deterministic Rule Engines
- **ADR-002:** Evidence-First Architecture: Grounding All Claims in First-Class Provenance Records
- **ADR-003:** Adoption of the Three-State Uncertainty-Aware Verdict Model (`UNVERIFIABLE`)
- **ADR-004:** Strict Human-in-the-Loop: Procurement Officer as the Sole Statutory Authority
- **ADR-005:** High-Fidelity Synthetic Dataset with Realistic Edge Cases for Hackathon Demonstration
- **ADR-006:** Common Verification Adapter Interface for Live and Mock Government Registries
- **ADR-007:** Cryptographic Hash-Chained Audit Ledger vs. Distributed Blockchain
- **ADR-008:** Whole-Tender Graph Relationship Intelligence vs. Single-Bid Siloed Processing
- **ADR-009:** Adversarial Document Sandboxing and Prompt-Injection Defense
- **ADR-010:** Isolation of RAG to Officer Q&A Explanations (Never for Verdict Generation)

---

### ADR-001: Probabilistic AI vs. Deterministic Rule Engine
- **Status:** `ACCEPTED`
- **Context:** Large Language Models excel at understanding messy natural language and non-standard layouts, but are prone to stochastic hallucinations, arithmetic errors, and non-deterministic behavior. Government procurement requires zero arithmetic error and 100% legal defensibility.
- **Decision:** AI is strictly restricted to perception, layout classification, unstructured text extraction, and semantic synonymy matching. All arithmetic (sums, averages, local-content percentages), threshold comparisons ($\ge, \le$), date checks, and regex/checksum validations must be executed by pure Python deterministic logic.
- **Alternatives Considered:** 
  1. *End-to-End LLM Verification:* Prompting an LLM: "Is this bidder compliant with clause 4.2?"
- **Why Rejected:** An LLM cannot be audited under the Indian Evidence Act; its calculations cannot be mathematically proven; and it occasionally outputs hallucinations on high-value numbers.
- **Consequences:** (+) Zero arithmetic hallucinations; legally defensible; (+) High performance. (-) Requires dedicated schemas and extraction normalization parsers.

---

### ADR-002: Evidence as First-Class Relational Entities
- **Status:** `ACCEPTED`
- **Context:** Most document Q&A tools generate free-form text with loose conversational references ("Based on the CA certificate on page 2...").
- **Decision:** Model `Evidence` as a first-class structured database entity with strict coordinates (`document_id`, `page_number`, `bounding_box`, `raw_text`, `confidence`, `extracted_at`, `provenance_badge`). Verifications link directly to Evidence IDs via foreign keys.
- **Alternatives Considered:** Storing citations as unstructured Markdown text inside verdict strings.
- **Why Rejected:** Prevents programmatic UI split-screen rendering, automated coordinate zooming, and forensic cross-referencing.
- **Consequences:** (+) Powers the side-by-side interactive document inspector; (+) Enables instantaneous audit verification. (-) Requires tracking normalized bounding boxes across PDF pages.

---

### ADR-003: First-Class `UNVERIFIABLE` State
- **Status:** `ACCEPTED`
- **Context:** Binary pass/fail engines classify an unreachable external API (e.g., GSTN gateway timeout) as either a false pass or an unfair disqualification.
- **Decision:** Introduce `UNVERIFIABLE` as a co-equal first-class verdict alongside `VERIFIED` and `CONTRADICTED`, accompanied by structured reason codes (`ERR_ADAPTER_TIMEOUT_504`, `ERR_SCAN_ILLEGIBLE`).
- **Alternatives Considered:** Defaulting to `FAILED` or retrying indefinitely.
- **Why Rejected:** Defaulting to fail penalizes honest bidders when government servers drop connections; retrying indefinitely blocks procurement deadlines.
- **Consequences:** (+) Reflects real-world operational reality; builds jury and officer trust. (-) Requires dedicated UI workflows and officer intervention screens for unverifiable claims.

---

### ADR-004: Procurement Officer as the Sole Decision-Maker
- **Status:** `ACCEPTED`
- **Context:** Automated decision-making in public procurement violates General Financial Rules (GFR 2017) and Central Vigilance Commission (CVC) statutory guidelines.
- **Decision:** PRAMAAN is architected strictly as a **decision-support platform**. The system surfaces evidence, flags contradictions, and calculates mathematical deviations, but **never** emits a legally binding "Qualified" or "Disqualified" status. The final determination is executed by the human officer.
- **Alternatives Considered:** Autonomous automated disqualification for threshold failures.
- **Why Rejected:** Legally invalid in Indian public sector procurement; would create severe liability for CPCL.
- **Consequences:** (+) 100% compliant with government procurement laws. (-) Requires full officer review and override workflows.

---

### ADR-005: High-Fidelity Synthetic Demo Dataset
- **Status:** `ACCEPTED`
- **Context:** Hackathon teams lack legal authorization to access live, private GeM bid packets or real-time production GSTN/MCA21 APIs.
- **Decision:** Build a high-fidelity synthetic dataset consisting of 7 realistic bidders (~300 pages) incorporating authentic CPCL tender clauses and realistic edge cases. Prominently tag all demo records with `[SYNTHETIC DEMO DATA]`.
- **Alternatives Considered:** Fabricating live integration claims or using 2-page dummy PDFs.
- **Why Rejected:** Fabricating live API claims destroys technical credibility during jury cross-examination; toy PDFs fail to demonstrate real engineering depth.
- **Consequences:** (+) Complete control over reproducible demo failure scenarios; total ethical honesty. (-) Requires up-front effort to construct realistic corporate documents.

---

### ADR-006: Polymorphic Verification Adapter Interface
- **Status:** `ACCEPTED`
- **Context:** During the hackathon, external registries are simulated; in production, they must connect to live government gateways (API Setu / NIC).
- **Decision:** Define an abstract base class `VerificationAdapter` with a standard `verify(claim)` contract. Implement `MockRegistryAdapter` for the prototype and document `LiveGovernmentAdapter` for enterprise deployment.
- **Alternatives Considered:** Hardcoding mock responses directly in route handlers.
- **Why Rejected:** Makes transitioning to live production APIs impossible without rewriting the verification engine.
- **Consequences:** (+) Zero architectural changes required when authorized live API keys become available.

---

### ADR-007: Hash-Chained Audit Ledger vs. Blockchain
- **Status:** `ACCEPTED`
- **Context:** Government procurement demands tamper-evident audit trails that withstand CVC and RTI scrutiny. Many hackathons propose complex Ethereum / Hyperledger blockchains.
- **Decision:** Implement an append-only PostgreSQL ledger with SHA-256 cryptographic hash-chaining and hourly Merkle tree roots.
- **Alternatives Considered:** Public or private permissioned blockchain (Hyperledger Fabric, Polygon).
- **Why Rejected:** Blockchain introduces unnecessary latency, gas fees, complex node infrastructure, and massive engineering overhead for a single-organization procurement audit requirement.
- **Consequences:** (+) Sub-millisecond write speeds; zero operational complexity; mathematical tamper-evidence.

---

### ADR-008: Whole-Tender Graph Relationship Intelligence
- **Status:** `ACCEPTED`
- **Context:** Procurement fraud often occurs via collusive bidding cartels sharing infrastructure across seemingly competing bids. Evaluating bids in per-bid silos renders these patterns invisible.
- **Decision:** Maintain a tender-wide property graph (NetworkX / Neo4j) linking bidders through shared bank accounts, addresses, phone numbers, directors, and document similarity hashes.
- **Alternatives Considered:** Siloed single-bid evaluation pipelines.
- **Why Rejected:** Misses the single biggest systemic risk in public procurement: anti-competitive collusion.
- **Consequences:** (+) Major competitive differentiator; visually stunning for juries. (-) Requires multi-bid ingestion prior to running graph traversals.

---

### ADR-009: Document Text Sandboxing & Prompt-Injection Resistance
- **Status:** `ACCEPTED`
- **Context:** Adversarial bidders can embed white-text instructions inside uploaded PDFs to trick naive LLM parsers into marking them compliant.
- **Decision:** Treat all extracted document text as untrusted string data encapsulated inside isolated `<UNTRUSTED_DOCUMENT_CONTENT>` envelopes. Pre-screen text with an adversarial directive scanner.
- **Alternatives Considered:** Directly formatting raw extracted text into generative prompt templates.
- **Why Rejected:** Leaves the platform vulnerable to prompt-injection exploits.
- **Consequences:** (+) Enterprise-grade security posture; protects procurement integrity.

---

### ADR-010: Isolation of RAG to Officer Q&A Explanations
- **Status:** `ACCEPTED`
- **Context:** RAG pipelines are frequently used for core compliance checking, but vector search can retrieve irrelevant clauses and miss strict negative constraints.
- **Decision:** RAG is strictly confined to the conversational officer-facing assistant ("Explain why clause 4.2 was flagged"). Core verification is driven by deterministic rule engines and structured evidence matching.
- **Alternatives Considered:** Using RAG to retrieve and evaluate all tender clauses.
- **Why Rejected:** Vector similarity does not understand strict boolean logic or financial arithmetic.
- **Consequences:** (+) Eliminates retrieval hallucination in core verdicts.
