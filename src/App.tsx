import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppShell } from './components/layout/AppShell';
import { LandingPage } from './pages/LandingPage';
import { TenderOverviewPage } from './pages/TenderOverviewPage';
import { BidderDossierPage } from './pages/BidderDossierPage';
import { NetworkGraphPage } from './pages/NetworkGraphPage';
import { AuditReconstructionPage } from './pages/AuditReconstructionPage';
import { AuditLedgerPage } from './pages/AuditLedgerPage';
import { ProductionReadinessPage } from './pages/ProductionReadinessPage';
import { SourceHealthPage } from './pages/SourceHealthPage';
import { VerificationEnginePage } from './pages/VerificationEnginePage';
import { EvidenceExplorerPage } from './pages/EvidenceExplorerPage';
import { AnomaliesPage } from './pages/AnomaliesPage';
import { ReviewQueuePage } from './pages/ReviewQueuePage';
import { SecurityEventsPage } from './pages/SecurityEventsPage';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Landing Page */}
        <Route path="/" element={<LandingPage />} />

        {/* Shell Wrapped Routes */}
        <Route element={<AppShell />}>
          <Route path="/tender" element={<TenderOverviewPage />} />
          <Route path="/tender/:tenderId/bidders" element={<TenderOverviewPage />} />
          <Route path="/tender/:tenderId/bidder/:bidderId" element={<BidderDossierPage />} />
          <Route path="/tender/:tenderId/network" element={<NetworkGraphPage />} />
          <Route path="/tender/:tenderId/audit/reconstruction" element={<AuditReconstructionPage />} />
          <Route path="/tender/:tenderId/audit" element={<AuditLedgerPage />} />
          <Route path="/tender/:tenderId/source-health" element={<SourceHealthPage />} />
          <Route path="/tender/:tenderId/requirements" element={<VerificationEnginePage />} />
          <Route path="/tender/:tenderId/evidence" element={<EvidenceExplorerPage />} />
          <Route path="/tender/:tenderId/anomalies" element={<AnomaliesPage />} />
          <Route path="/tender/:tenderId/review-queue" element={<ReviewQueuePage />} />
          <Route path="/tender/:tenderId/security" element={<SecurityEventsPage />} />
          <Route path="/tender/:tenderId/production" element={<ProductionReadinessPage />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
