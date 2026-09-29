# DESIGN SYSTEM SPECIFICATION — PRAMAAN

**Document Status:** Enterprise UX Baseline & Visual Token System  
**Interface Personality:** Government-Grade, Investigative, High-Density, Evidence-Centric  
**Primary User Question Answered by UI:** *"What does the officer need to investigate next?"*  

---

## 1. Visual Philosophy & Design Principles

PRAMAAN is designed for serious procurement officers, technical evaluation committees, and vigilance officers who make high-stakes financial and legal determinations. It intentionally rejects the casual aesthetic of consumer SaaS.

### 1.1 Strict Aesthetic Boundaries

| What PRAMAAN UI IS | What PRAMAAN UI IS NOT (Anti-Patterns) |
| :--- | :--- |
| **Investigative Workspace:** Information-dense, structured tables, precise typographic hierarchy. | **Fluffy SaaS Dashboard:** Gigantic empty cards, huge decorative numbers with no context. |
| **Evidence-First:** Every finding directly shows page numbers, bounding boxes, and citations. | **Black-Box AI:** Opaque single "compliance score" ring (e.g. 78%) or circular progress charts. |
| **Trustworthy Government Palette:** Slate, Navy, Crisp White, Muted Charcoal, Controlled Accents. | **Cyberpunk / Neon / Glassmorphism:** Heavy blurs, rainbow gradients, dark glowing buttons. |
| **Rigorous State Machine:** Explicit `VERIFIED`, `CONTRADICTED`, `UNVERIFIABLE`, `PENDING REVIEW`. | **Binary Pass/Fail:** Simplistic green/red tags with zero distinction between failure and unknown. |
| **Subtle & Purposeful:** Crisp transitions (150ms ease), micro-interactions showing data relationships. | **Bouncy Cartoon Animations:** AI sparkles (✨), floating 3D graphics, meaningless spinning badges. |
| **Transparent Provenance:** Clear badges for `MOCK / SYNTHETIC` vs `LIVE` data sources. | **Fake Claims:** Fabricated real-time pulse dots claiming live NIC connection when mocked. |

---

## 2. Color System & Semantic Tokens

The color palette is built around rigorous WCAG AAA contrast standards, designed for all-day operational scrutiny under standard office lighting or low-fatigue dark mode.

### 2.1 The Official Enterprise UI/UX Palette (Reference Guide Specification)
Directly specified in the **PRAMAAN High-Class UI/UX Reference Guide (PDF & Screenshots)**:
- **Persistent Dark Navy Sidebar (`#0C1527` / `#101B33`):** Government authority, stable institutional navigation, high focus.
- **Forensic Investigation Canvas (`#F4F6FA` / `#FFFFFF`):** Crisp white/slate document inspection workspace, paper-contrast for viewing certified financial attachments and CA balance sheets.
- **Active Navigation Accent (`#2563EB` / `#3B82F6`):** Standard enterprise blue for selected states and investigation CTAs.
- **Semantic Verdict Tokens (Paired with explicit text):**
  - **VERIFIED:** Green `#10B981` (Surface: `#ECFDF5`, Border: `#A7F3D0`, Text: `#065F46`)
  - **CONTRADICTED:** Red `#EF4444` (Surface: `#FEF2F2`, Border: `#FCA5A5`, Text: `#991B1B`)
  - **UNVERIFIABLE:** Amber `#F59E0B` (Surface: `#FFFBEB`, Border: `#FDE68A`, Text: `#92400E`)
  - **RELATIONSHIP:** Purple `#8B5CF6` (Surface: `#FAF5FF`, Border: `#DDD6FE`, Text: `#5B21B6`)
  - **PENDING REVIEW:** Slate/Blue `#3B82F6` (Surface: `#EFF6FF`, Border: `#BFDBFE`, Text: `#1E40AF`)

```css
:root {
  /* Sidebar & Brand (Dark Navy Institutional) */
  --sidebar-bg:            #0C1527;
  --sidebar-surface:       #101B33;
  --sidebar-border:        #1E2D4A;
  --sidebar-text:          #E2E8F0;
  --sidebar-text-muted:    #8496B3;
  --sidebar-active-bg:     #1A2849;
  --sidebar-active-border: #3B82F6;

  /* Main Workspace (Crisp Forensic White & Off-White) */
  --bg-canvas:             #F4F6FA;
  --bg-surface:            #FFFFFF;
  --bg-surface-elevated:   #F8FAFC;
  --bg-surface-hover:      #F1F5F9;

  /* Structural Borders */
  --border-subtle:         #EDF2F7;
  --border-default:        #E2E8F0;
  --border-strong:         #CBD5E1;
  --border-accent:         #2563EB;

  /* Typography */
  --text-primary:          #0F172A;
  --text-secondary:        #475569;
  --text-muted:            #64748B;
  --text-dim:              #94A3B8;
}
```

### 2.2 Semantic Verdict Tokens (Grounded in Palette)

Every verdict in PRAMAAN has an uncompromising, distinctive color token, border treatment, and icon:

```css
:root {
  /* State 1: VERIFIED (Petrol Teal Anchor) */
  --verdict-verified-bg:      rgba(50, 170, 169, 0.18);
  --verdict-verified-border:  #32AAA9;
  --verdict-verified-text:    #62D5D4;
  --verdict-verified-dot:     #32AAA9;

  /* State 2: CONTRADICTED (Brick Crimson Anchor) */
  --verdict-contradicted-bg:      rgba(168, 32, 32, 0.22);
  --verdict-contradicted-border:  #A82020;
  --verdict-contradicted-text:    #FCA5A5;
  --verdict-contradicted-dot:     #A82020;

  /* State 3: UNVERIFIABLE (Warm Cream / Gold Anchor) */
  --verdict-unverifiable-bg:      rgba(248, 224, 164, 0.15);
  --verdict-unverifiable-border:  #D8B768;
  --verdict-unverifiable-text:    #F8E0A4;
  --verdict-unverifiable-dot:     #F8E0A4;

  /* State 4: PENDING REVIEW (Deep Mahogany / Muted Red Anchor) */
  --verdict-pending-bg:       rgba(108, 27, 26, 0.35);
  --verdict-pending-border:   #9E3534;
  --verdict-pending-text:     #F1B2B1;
  --verdict-pending-dot:      #C94C4B;
}

  /* Anomaly & Relationship Alert (Deep Violet) */
  --signal-anomaly-bg:        #FAF5FF;
  --signal-anomaly-border:    #7C3AED;
  --signal-anomaly-text:      #5B21B6;
}
```

### 2.3 Data Provenance Badges
- `[SYNTHETIC DEMO DATA]`: `#F1F5F9` background, `#475569` text, dashed border `#94A3B8`.
- `[EXTRACTED FROM PDF]`: `#F0FDF4` background, `#166534` text, solid border `#86EFAC`.
- `[REGISTRY ADAPTER]`: `#EFF6FF` background, `#1E40AF` text, solid border `#93C5FD`.
- `[OFFICER OVERRIDE]`: `#FFF7ED` background, `#C2410C` text, double border `#FB923C`.

---

## 3. Typography & Hierarchy

The interface utilizes clean, highly legible fonts engineered for numerical precision, tabular data, and legal text.

- **Primary UI & Document Font:** `Inter`, `Roboto`, or system `-apple-system, BlinkMacSystemFont, "Segoe UI"`
- **Monospace Font (UDIN, PAN, GSTIN, Hashes, BoM Line Items):** `JetBrains Mono`, `Fira Code`, or `ui-monospace`

### Typographic Scale:
- **Tender Identifier / Master Title:** `20px` (`1.25rem`), Semi-Bold (600), Letter-spacing `-0.01em`
- **Section Headers / Bidder Names:** `16px` (`1.0rem`), Semi-Bold (600)
- **Table Headings / Metadata Labels:** `12px` (`0.75rem`), Medium (500), Uppercase, Letter-spacing `+0.05em`, Color: `--pramaan-gray-500`
- **Body / Clause Text:** `14px` (`0.875rem`), Regular (400), Line-height `1.5`
- **Identifiers & Numeric Values (Turnover, Dates, BBox coords):** `13px` (`0.8125rem`), Monospace, Weight 500

---

## 4. Layout Architecture & Workspace Zones

The interface is organized into a cohesive, high-efficiency investigative cockpit:

```
┌────────────────────────────────────────────────────────────────────────────┐
│ TOP BAR: Tender Header (CPCL/2026/TECH-091) | Status: IN EVALUATION | Mode │
├──────────────┬─────────────────────────────────────────────────────────────┤
│ SIDEBAR      │ MAIN INVESTIGATION WORKSPACE                                │
│              │                                                             │
│ • Overview   │ ┌─────────────────────────────────────────────────────────┐ │
│ • Workload   │ │ TRIAGE QUEUE: Ranked by (Uncertainty × Materiality)     │ │
│   Queue (7)  │ └─────────────────────────────────────────────────────────┘ │
│ • Cross-     │ ┌─────────────────────────────────────────────────────────┐ │
│   Bidder     │ │ REQUIREMENT COMPLIANCE MATRIX                           │ │
│   Graph      │ │ [Clause] | [Requirement] | [Claim] | [Verdict] | [Action]│
│ • Decision   │ ├──────────┼───────────────┼─────────┼───────────┼─────────┤ │
│   Ledger     │ │ Cl 4.2   │ Turnover >=10C│ ₹12 Cr  │ CONFLICT  │ Inspect │ │
│ • Export     │ │ Cl 5.1   │ GST Active    │ Active  │ UNVERIFY  │ Retry   │ │
│              │ └──────────┴───────────────┴─────────┴───────────┴─────────┘ │
│              │ ┌─────────────────────────────────────────────────────────┐ │
│              │ │ SPLIT-SCREEN EVIDENCE INSPECTOR                         │ │
│              │ │ Left: Extracted Fact & Rule | Right: Source PDF Viewer  │ │
│              │ └─────────────────────────────────────────────────────────┘ │
└──────────────┴─────────────────────────────────────────────────────────────┘
```

### 4.1 Zone Breakdown:
1. **Contextual Top Bar:** Displays Tender ID, CPCL Work Order Title, Due Date, Total Bidders (7), and Global System Status banner (highlighting adapter circuit-breaker state if simulated down).
2. **Left Navigation Rail:** Compact 64px/220px collapsible menu focusing on analytical modes:
   - Tender Command Center
   - Officer Workload Triage Queue
   - Bidder Dossier & Evidence Matrix
   - Cross-Bidder Relationship Graph
   - Tamper-Evident Decision Ledger
3. **Split-Screen Evidence Inspector:**
   - **Left Panel (40% width):** Clause requirement, extracted value from Bidder document, adapter verification response, deterministic rule check result, and Officer Action modal.
   - **Right Panel (60% width):** High-resolution PDF Document Viewer rendering the original file with yellow highlight bounding boxes bounding the cited text, page navigation, and side-by-side comparison for conflicting documents.

---

## 5. Component Specifications & Interaction Patterns

### 5.1 Three-State Verdict Badges
Verdict badges are never mere colored dots; they communicate condition and reason:
- `[ ✓ VERIFIED ]`: Emerald badge with checkmark and confidence tooltip (`Source: GSTN API (Live Mock) | Checked: 10:14 IST`).
- `[ ⚠ CONTRADICTED ]`: Crimson badge with warning triangle (`Bid Form ₹12 Cr ≠ CA Cert ₹9 Cr`).
- `[ ? UNVERIFIABLE ]`: Amber badge with help circle (`Gateway Timeout on GSTN Endpoint`).
- `[ ◷ PENDING REVIEW ]`: Slate blue badge with clock icon (`Awaiting Officer Confirmation`).

### 5.2 The Side-by-Side Contradiction Comparator
When a contradiction is detected (e.g., Bidder 2 Turnover discrepancy):
- The UI renders a dual-column synchronized viewer:
  - **Column A:** Bid Submission Cover Letter, Page 3, Section "Financial Summary", highlighting `₹12,00,00,000`.
  - **Column B:** CA Turnover Certificate (UDIN 24089123AAAAA), Page 1, Paragraph 2, highlighting `₹9,00,00,000`.
- An inline Delta Callout displays:
  $$\Delta = -₹3.00\text{ Cr } (-25.0\%)\quad\implies\quad\text{Clause Threshold: ₹10.00 Cr (FAILED)}$$

### 5.3 Cross-Bidder Relationship Graph Visualizer
- **Nodes:**
  - Bidders: Square nodes, branded with bidder abbreviation. Color indicates overall triage risk.
  - Entities: Circular nodes with distinct icons:
    - 🏦 Bank Account (IFSC + Acc)
    - 👤 Director / DIN
    - 📍 Office Address
    - 📄 Document Template Fingerprint / Metadata Hash
- **Edges:**
  - Solid Red: Direct identity overlap (shared bank account or shared director).
  - Dashed Amber: Technical document similarity ($\ge 85\%$ lexical or vector overlap).
- **Interactive Inspection:** Clicking an edge opens a forensic comparison drawer detailing the exact shared attribute.

### 5.4 Officer Override Modal (Accountability-Enforcing)
When an officer overrides any automated verdict:
1. The system displays a mandatory dialogue:
   - Selected Finding: `Annual Turnover Requirement (Cl 4.2)`
   - System Verdict: `CONTRADICTED`
   - Proposed Officer Action: `[ QUALIFY WITH CLARIFICATION ]` or `[ DISQUALIFY ]`
   - Mandatory Reason Dropdown:
     - "Typographical error verified via ITR backup"
     - "Subcontractor turnover accepted per special clause 4.2.1"
     - "Clarification requested under GeM GTC Rule 14"
     - "Other (Requires detailed justification)"
   - Written Justification Box: Minimum 30 characters required.
   - Confirmation: *"This action will be cryptographically signed and permanently committed to the tamper-evident audit ledger."*

---

## 6. Micro-Animations & State Transitions

1. **Duration:** 150ms to 200ms maximum.
2. **Easing:** `cubic-bezier(0.16, 1, 0.3, 1)` (snappy entry, zero bounce).
3. **Purposeful States:**
   - **Hover:** Border shifts from `--pramaan-gray-200` to `--pramaan-navy-700`. Zero 3D lift or heavy shadows.
   - **Active Evidence Highlight:** Bounding boxes on PDFs pulse gently once on page load (opacity 0.4 to 0.8), then settle into solid border highlight.
   - **Adapter Timeout Simulation:** If an adapter fails, the status badge transitions smoothly from loading spinner to amber alert with error code `ERR_ADAPTER_TIMEOUT_504`.
