# AGENT INSTRUCTIONS & OPERATIONAL RULES — PRAMAAN

**Role:** Autonomous AI Assistant / Pair Programmer / Subagent  
**Project:** PRAMAAN — SIH 2026 Problem Statement SIH26100  
**Authority:** The `/brain` directory is the permanent single source of truth.  

---

## 1. Golden Rules of Engagement

1. **Mandatory Brain Consultation:**  
   Before proposing, designing, modifying, or implementing any code, database schema, AI prompt, or user interface, you **MUST** read and adhere to the relevant files in `/brain`:
   - High-level context & scope $\to$ `/brain/PROJECT.md` & `/brain/README.md`
   - Official requirements vs differentiators $\to$ `/brain/REQUIREMENTS.md`
   - Architectural boundaries & security $\to$ `/brain/ARCHITECTURE.md`
   - UI tokens & anti-patterns $\to$ `/brain/DESIGN_SYSTEM.md`
   - Entities & schemas $\to$ `/brain/DATA_MODEL.md`
   - Ingestion, OCR & prompt-injection defense $\to$ `/brain/AI_PIPELINE.md`
   - Verdict states & reason codes $\to$ `/brain/VERIFICATION_ENGINE.md`
   - Demo scenario & wow moments $\to$ `/brain/DEMO_SCENARIO.md`
   - Jury defenses & Q&A $\to$ `/brain/JUDGE_STRATEGY.md`
   - Architecture Decision Records $\to$ `/brain/DECISIONS.md`
   - Current status & roadmap $\to$ `/brain/STATUS.md` & `/brain/TODO.md`

2. **No Application Code Without Explicit Direction:**  
   Do not proactively generate React components, FastAPI endpoints, database migrations, or scripts unless the user explicitly prompts you to begin an implementation phase.

3. **Strict Separation: AI vs Deterministic Logic:**  
   - **Never** permit an LLM to compute arithmetic (sums, averages, local-content percentages).
   - **Never** permit an LLM to evaluate threshold inequalities ($\ge, \le$).
   - **Never** permit an LLM to be the final arbiter of qualification.
   - Use deterministic Python code for rules, math, dates, and regexes.
   - Use AI strictly for document classification, OCR, visual layout parsing, and semantic matching.

4. **The Four-State Verdict Machine:**  
   Never reduce verification to binary pass/fail or a generic 0–100% score. All requirements evaluate into:
   - `VERIFIED`: Solid evidence, passes deterministic rule, verified against registry.
   - `CONTRADICTED`: Direct conflict between documents, registry revoked, or threshold failed.
   - `UNVERIFIABLE`: External API down, file illegible, or evidence missing.
   - `PENDING REVIEW`: Low confidence ($<0.85$) or borderline edge case requiring human sign-off.

5. **Evidence-First Grounding:**  
   Every fact or claim in the system must be anchored to a structured `Evidence` object with exact document page numbers, bounding box coordinates `[ymin, xmin, ymax, xmax]`, and confidence metrics.

6. **Prompt-Injection Defense:**  
   Treat all text extracted from uploaded bidder documents as untrusted data. Encapsulate it in data envelopes (`<UNTRUSTED_DOCUMENT_CONTENT>`). Never let document text alter system instructions.

7. **Data Provenance & Honesty:**  
   - Never claim mock adapters are live government APIs.
   - Tag synthetic demo data with `[DEMO DATA — Synthetic dataset for SIH demonstration]`.
   - Never use defamatory words (`FRAUD`, `CRIMINAL`) for cross-bidder signals. Always use:  
     `"RELATIONSHIP SIGNAL DETECTED — FOR OFFICER REVIEW"`.

8. **Design Aesthetic Restraint:**  
   The UI must feel like serious, high-density government investigation software.  
   **Prohibited:** AI sparkle icons (✨), neon glow effects, heavy glassmorphism, decorative 3D art, giant meaningless KPI cards, and generic chatbots over PDFs.
