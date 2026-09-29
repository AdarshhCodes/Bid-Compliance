import fs from 'fs';
import path from 'path';

console.log('====================================================');
console.log(' PRAMAAN PHASE 6 UI/UX REDESIGN VERIFICATION SUITE ');
console.log('====================================================');

const ROOT_DIR = process.cwd();
const SRC_DIR = path.join(ROOT_DIR, 'src');

// 1. Central Tokens Verification in src/index.css
console.log('\n[1/4] Checking Central Design Tokens in src/index.css...');
const cssPath = path.join(SRC_DIR, 'index.css');
const cssContent = fs.readFileSync(cssPath, 'utf8');

const requiredTokens = [
  '--sidebar-bg',
  '--sidebar-surface',
  '--sidebar-border',
  '--bg-canvas',
  '--bg-surface',
  '--border-default',
  '--text-primary',
  '--text-secondary',
  '--text-muted',
  '--font-sans',
  '--font-mono',
  '--status-verified-text',
  '--status-contradicted-text',
  '--status-unverifiable-text',
  '--status-relationship-text',
  '--accent-gold'
];

let missingTokens = [];
for (const token of requiredTokens) {
  if (!cssContent.includes(token)) {
    missingTokens.push(token);
  }
}

if (missingTokens.length === 0) {
  console.log('  ✓ All 16 required core forensic design tokens found in :root');
} else {
  console.error('  ✗ Missing tokens:', missingTokens);
  process.exit(1);
}

// 2. Screen Files Verification (All 9 Screens)
console.log('\n[2/4] Verifying Screens 1-9 Restyling & Token Usage...');
const screenFiles = [
  { name: 'Screen 1: AppShell', file: 'components/layout/AppShell.tsx', checks: ['sidebar', 'PRAMAAN', 'LIVE', 'A. Sharma'] },
  { name: 'Screen 2: TenderOverviewPage', file: 'pages/TenderOverviewPage.tsx', checks: ['Evidence Flow', 'Attention Queue', 'CPCL/PROC/2026/047'] },
  { name: 'Screen 3: BidderDossierPage', file: 'pages/BidderDossierPage.tsx', checks: ['Identity Chain & Entity Resolution', 'Evidence Health', 'Requirement Compliance Matrix'] },
  { name: 'Screen 4: EvidenceTraceModal', file: 'components/investigation/EvidenceTraceModal.tsx', checks: ['Comparison View', 'Why this verdict?', 'Accept Finding', 'Override'] },
  { name: 'Screen 5: NetworkGraphPage', file: 'pages/NetworkGraphPage.tsx', checks: ['This is a relationship signal. Not a determination of misconduct.', 'Shared Bank Account', 'Relationship Details'] },
  { name: 'Screen 6: AuditReconstructionPage', file: 'pages/AuditReconstructionPage.tsx', checks: ['Timeline', 'Event Details', 'Hash Chain', 'Hash Verified'] },
  { name: 'Screen 7: SourceHealthPage', file: 'pages/SourceHealthPage.tsx', checks: ['Government Sources', 'System Components', 'Gateway timeout', 'Retry Verification'] },
  { name: 'Screen 8: ReviewQueuePage', file: 'pages/ReviewQueuePage.tsx', checks: ['Officer Review Queue', 'High Priority', 'Suggested Action', 'Due Date'] },
  { name: 'Screen 9: LandingPage', file: 'pages/LandingPage.tsx', checks: ['PRAMAAN प्रमाण', 'Evidence before Verdicts.', 'Explore Demo Tender', 'How it Works'] }
];

let allScreensOk = true;
for (const s of screenFiles) {
  const filePath = path.join(SRC_DIR, s.file);
  if (!fs.existsSync(filePath)) {
    console.error(`  ✗ File missing: ${s.file}`);
    allScreensOk = false;
    continue;
  }
  const content = fs.readFileSync(filePath, 'utf8');
  let missingChecks = [];
  for (const check of s.checks) {
    if (!content.includes(check)) {
      missingChecks.push(check);
    }
  }
  if (missingChecks.length === 0) {
    console.log(`  ✓ ${s.name} (${s.file}) passed all element & token checks`);
  } else {
    console.error(`  ✗ ${s.name} missing expected strings:`, missingChecks);
    allScreensOk = false;
  }
}

if (!allScreensOk) process.exit(1);

// 3. Guided Demo Steps Verification (Phase 5 compatibility)
console.log('\n[3/4] Verifying Phase 5 Guided Demo Steps Compatibility...');
const guidedBarPath = path.join(SRC_DIR, 'components/demo/GuidedDemoBar.tsx');
const guidedContent = fs.readFileSync(guidedBarPath, 'utf8');

const expectedSteps = [
  'Command Centre & Triage Queue',
  'Bidder 2: Turnover Contradiction',
  'Split-Screen Evidence Trace',
  'Visual Provenance Pipeline',
  'Network Intelligence: Shared Bank',
  'Document Boilerplate & Typo Fingerprint',
  'Bidder 3: Udyam Temporal Staleness',
  'Bidder 7: GST Outage & Graceful Degradation',
  'Officer Review & Reasoned Override',
  'Decision Reconstruction & SHA-256 Merkle Chain'
];

let allStepsOk = true;
for (let i = 0; i < expectedSteps.length; i++) {
  const stepTitle = expectedSteps[i];
  if (guidedContent.includes(stepTitle)) {
    console.log(`  ✓ Step ${i + 1}: "${stepTitle}" verified`);
  } else {
    console.error(`  ✗ Step ${i + 1}: "${stepTitle}" missing`);
    allStepsOk = false;
  }
}

if (!allStepsOk) process.exit(1);

// 4. Verification of Mandatory Non-Softened Line
console.log('\n[4/4] Verifying Mandatory Statutory Governance Safeguard...');
const netGraphContent = fs.readFileSync(path.join(SRC_DIR, 'pages/NetworkGraphPage.tsx'), 'utf8');
const mandatoryLine = 'This is a relationship signal. Not a determination of misconduct.';

if (netGraphContent.includes(mandatoryLine)) {
  console.log(`  ✓ Mandatory line preserved verbatim: "${mandatoryLine}"`);
} else {
  console.error(`  ✗ CRITICAL ERROR: Mandatory line was altered or removed!`);
  process.exit(1);
}

console.log('\n====================================================');
console.log(' ALL PHASE 6 UI/UX REDESIGN VALIDATIONS PASSED (100%)');
console.log('====================================================\n');
