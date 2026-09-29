# VERIFICATION ENGINE SPECIFICATION — PRAMAAN

**Document Status:** Core Verification Logic & Decision-Support State Machine  
**Core Innovation:** Three-State Uncertainty-Aware Verdicts + Provenance Traceability  

---

## 1. The Core Four-State Verdict Model

Traditional bid evaluation platforms force a binary `PASS` or `FAIL`, or generate an arbitrary percentage score (e.g., `83% Compliant`). This is catastrophic in government procurement because:
1. It conceals external system downtime behind an arbitrary failure.
2. It conceals low-confidence AI guesses behind confident-looking badges.
3. It strips away the legal rationale required by the Central Vigilance Commission (CVC).

PRAMAAN implements a strict **Four-State Verdict Machine**:

```
                       ┌─────────────────────────┐
                       │   Tender Requirement    │
                       │   + Submitted Evidence  │
                       └────────────┬────────────┘
                                    │
                                    ▼
                       ┌─────────────────────────┐
                       │  Can Evidence & Source  │
                       │      be Obtained?       │
                       └──────┬───────────┬──────┘
                              │           │
                       NO ────┘           └──── YES
                       │                        │
                       ▼                        ▼
             ┌──────────────────┐     ┌───────────────────┐
             │   UNVERIFIABLE   │     │  Cross-Check Fact │
             │ (Reason Logged)  │     │   Across Sources  │
             └─────────┬────────┘     └───────┬─────┬─────┘
                       │                      │     │
                       │        Discrepancy ──┘     └── Matching Fact
                       │        │                       │
                       │        ▼                       ▼
                       │  ┌──────────────┐     ┌──────────────────┐
                       │  │ CONTRADICTED │     │ Passes Threshold │
                       │  │(Side-by-Side)│     │     Rule?        │
                       │  └──────┬───────┘     └────┬────────┬────┘
                       │         │                  │        │
                       │         │            NO ───┘        └── YES
                       │         │            │                  │
                       │         │            ▼                  ▼
                       │         │     ┌──────────────┐   ┌──────────────┐
                       │         │     │ CONTRADICTED │   │   VERIFIED   │
                       │         │     │ (Rule Fail)  │   │  (Grounding) │
                       │         │     └──────┬───────┘   └──────┬───────┘
                       │         │            │                  │
                       ▼         ▼            ▼                  ▼
                       ───────────────────────────────────────────
                               OFFICER-IN-THE-LOOP REVIEW
                         (Recommends Action -> Officer Decides)
                                         │
                                         ▼
                                   PENDING REVIEW
                             (If human sign-off needed)
```

### Detailed State Definitions:

#### 1. `VERIFIED`
- **Definition:** The submitted document evidence was unambiguously extracted, matched the authoritative registry (if applicable), and deterministically satisfied the tender threshold rule.
- **Example:** Requirement requires Turnover $\ge ₹10\text{ Cr}$. CA Certificate explicitly certifies $₹12.5\text{ Cr}$, UDIN is valid, ITR confirms $>₹10\text{ Cr}$, and GST portal shows active status.
- **System Action:** Mark `VERIFIED`. Attach exact page coordinates and registry timestamps.

#### 2. `CONTRADICTED`
- **Definition:** A definitive conflict was identified between two submitted documents, between a document and an authoritative registry, or between extracted facts and mandatory tender rules.
- **Example A (Internal In-Bid Conflict):** Bid Cover Letter declares Turnover $= ₹12.0\text{ Cr}$, but attached CA Certificate certifies Turnover $= ₹9.0\text{ Cr}$.
- **Example B (Document vs Registry):** Udyam Certificate claims active Micro Enterprise status, but live Udyam portal registry shows status was `CANCELLED` prior to tender submission.
- **Example C (Threshold Failure):** Extracted turnover is $₹8.0\text{ Cr}$, failing the $₹10.0\text{ Cr}$ mandatory threshold.
- **System Action:** Mark `CONTRADICTED`. Generate visual comparison card highlighting exact discrepancy and numerical $\Delta$.

#### 3. `UNVERIFIABLE`
- **Definition:** Compliance cannot be proved or disproved due to an external system outage, missing mandatory attachment, illegible scan, or corrupted file.
- **Example A:** The GSTN gateway returned an HTTP 504 Gateway Timeout after 3 retries during the live review.
- **Example B:** The bidder uploaded a scanned OEM Authorization letter with severe blur ($OCR\text{ confidence} < 0.40$), making the product category illegible.
- **System Action:** Mark `UNVERIFIABLE`. Log explicit reason code (`ERR_ADAPTER_TIMEOUT`, `ERR_SCAN_ILLEGIBLE`). Route to the officer's priority review queue with a "Retry Source Check" or "Request Clarification" action.

#### 4. `PENDING REVIEW`
- **Definition:** System analysis completed, but an edge case, low extraction confidence ($<0.85$), or a non-standard clause requires explicit human officer evaluation.
- **System Action:** Flag for officer sign-off. Never allow automated bypass.

---

## 2. Multi-Dimensional Evidence Evaluation Framework

To determine the verdict and calculate calibrated confidence, every finding evaluates four fundamental dimensions:

$$\text{Confidence Score} = w_1 \cdot \text{ExtractionConfidence} + w_2 \cdot \text{SourceAuthority} + w_3 \cdot \text{FreshnessScore} + w_4 \cdot \text{ConsistencyScore}$$

| Dimension | Range | Measurement Metric |
| :--- | :--- | :--- |
| **1. Extraction Confidence** | $0.00 - 1.00$ | Character OCR confidence + Model token logprob certainty. |
| **2. Source Authority** | Tier 1 to 4 | - **Tier 1:** Authoritative Central Government Registry (GSTN, MCA21, Udyam API).<br>- **Tier 2:** Legally Certified Third-Party Document (CA Signed Certificate with valid UDIN).<br>- **Tier 3:** Commercial Counterparty Document (OEM Authorization Letter).<br>- **Tier 4:** Bidder Self-Declaration / Unsigned Cover Letter. |
| **3. Temporal Freshness** | $0.00 - 1.00$ | Recency of check. A certificate verified 60 days ago has a lower freshness score than one verified live today. If $ValidUntil < EvaluationDate$, freshness drops to $0.00$. |
| **4. Consistency Score** | Binary / Scaled | $1.00$ if all submitted documents state identical values; $0.00$ if any two submitted values disagree. |

---

## 3. Structured Reason Codes Taxonomy

Every non-`VERIFIED` verdict is tagged with a deterministic, machine-readable reason code:

```
REASON_CODES:
├── REASON_CONTRADICTED
│   ├── ERR_THRESHOLD_NOT_MET           (Extracted value < Tender minimum)
│   ├── ERR_CROSS_DOC_VALUE_MISMATCH     (Doc A says X, Doc B says Y)
│   ├── ERR_REGISTRY_STATUS_REVOKED      (Portal shows Cancelled / Suspended)
│   ├── ERR_DEBARRED_BLACKLISTED         (Entity listed on CPPP / GeM Debarment)
│   ├── ERR_TEMPORAL_EXPIRED             (Document validity lapsed before evaluation)
│   └── ERR_OEM_SCOPE_MISMATCH           (OEM authorization covers wrong equipment)
│
├── REASON_UNVERIFIABLE
│   ├── ERR_ADAPTER_TIMEOUT_504          (External registry did not respond)
│   ├── ERR_ADAPTER_RATE_LIMIT_429       (Registry query quota exhausted)
│   ├── ERR_MANDATORY_DOC_MISSING        (Required attachment not uploaded)
│   ├── ERR_DOC_SCAN_ILLEGIBLE           (OCR confidence below minimum threshold)
│   └── ERR_UNRESOLVED_IDENTITY_DRIFT    (Name on PAN differs from GST beyond fuzzy threshold)
│
└── REASON_SECURITY_ANOMALY
    ├── SEC_PROMPT_INJECTION_DETECTED    (Adversarial text directive found in PDF)
    └── SEC_TAMPERED_METADATA_DETECTED   (Malformed PDF stream or forged header)
```

---

## 4. Special Verification Engines

### 4.1 In-Bid Contradiction Engine
- **Mechanism:** Cross-references fields bearing identical semantic tags across document types:
  $$\text{Field: Turnover} \quad\longleftrightarrow\quad \{\text{Bid Form}, \text{CA Certificate}, \text{Balance Sheet}, \text{ITR-V}\}$$
- If $|\text{Value}_{\text{BidForm}} - \text{Value}_{\text{CACert}}| > \epsilon$, a `Contradiction` object is instantiated, locking the verdict to `CONTRADICTED` and rendering the visual comparison panel.

### 4.2 Make-in-India (MII) BoM Re-Derivation Engine
- Many bidders upload a self-declaration asserting *"100% Local Content"*, yet submit a detailed Bill of Materials (BoM) containing imported components (e.g., Japanese seals or German forged flanges).
- **The Engine:**
  1. Extracts all line items from the submitted BoM table: $\text{Description}, \text{CountryOfOrigin}, \text{TotalCostINR}$.
  2. Partitions costs: $\text{DomesticCosts} = \sum \text{Cost}_{Origin = \text{'INDIA'}}$, $\text{ImportedCosts} = \sum \text{Cost}_{Origin \neq \text{'INDIA'}}$.
  3. Recomputes true local content:
     $$\text{Actual Local Content \%} = \frac{\text{DomesticCosts}}{\text{DomesticCosts} + \text{ImportedCosts}} \times 100$$
  4. Compares $\text{Actual Local Content \%}$ with $\text{Declared Local Content \%}$. If declared is $80\%$ but recomputed is $42\%$, it flags an immediate `CONTRADICTED — MII_ARITHMETIC_MISMATCH`.

### 4.3 Temporal Staleness & Expiry Engine
- Captures two distinct timestamps for every statutory registration:
  - $T_{\text{DocDate}}$: Date certificate was issued / downloaded by bidder.
  - $T_{\text{EvalDate}}$: Current tender evaluation timestamp.
- Queries external registry adapter to confirm status at $T_{\text{EvalDate}}$.
- If status was `ACTIVE` at $T_{\text{DocDate}}$ but is `SUSPENDED` or `CANCELLED` at $T_{\text{EvalDate}}$, system marks `CONTRADICTED — ERR_REGISTRY_STATUS_REVOKED` and highlights the exact date of cancellation.

---

## 5. Cross-Bidder Relationship & Collusion Signal Engine

Public procurement frequently suffers from "cover bidding" or "cartelization" where shell entities submit synthetic bids to satisfy the minimum 3-bidder requirement or rig L1 prices.

### 5.1 Evaluated Relationship Signals
1. **Shared Banking Coordinates:** Identical Bank Account Number + IFSC across different bidding entities.
2. **Shared Corporate Governance:** Identical Director Name or Director Identification Number (DIN) across competing bidders.
3. **Shared Contact Infrastructure:** Identical phone number, email domain, or registered office street address.
4. **Shared Technical Proposal Boilerplate:** Document embedding cosine similarity $> 0.90$ across technical methodology sections, or identical unique typographical errors in separate bidder proposals.
5. **Workstation Metadata Fingerprint:** Identical PDF Creator, Author string, and modification timestamps within minutes of each other across competing bids.

### 5.2 Strict Legal & Operational Framing: Signals, Not Defamation

> [!CAUTION]
> **MANDATORY TERMINOLOGY RULE:**  
> The system **NEVER** outputs defamatory labels such as `"FRAUD"`, `"CRIMINAL"`, or `"ILLEGAL COLLUSION"`.  
> Legitimate corporate groups may legally share certain administrative infrastructure.  
> The system strictly asserts:  
> **`"RELATIONSHIP SIGNAL DETECTED — FOR OFFICER REVIEW"`**  
> accompanied by the neutral, factual evidence:  
> *"Bidder 4 (Apex Valves) and Bidder 5 (Zenith Flow) share Bank Account: HDFC0001234 - 50200088991122 and exhibit 94% text similarity in Technical Proposal Section 3."*
