import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  Tender,
  Bid,
  Bidder,
  OfficerDecisionRecord,
  AuditEvent,
  DashboardMetrics,
} from '../types';
import { findTenderByIdOrSlug, findBidById } from '../types';
import { mockTenders, mockBids } from '../data/mockData';

interface VerificationProgressState {
  isRunning: boolean;
  currentStep: number;
  steps: { name: string; status: 'pending' | 'in-progress' | 'completed' | 'flagged' }[];
  completed: boolean;
}

interface ProcurementContextType {
  tenders: Tender[];
  bids: Bid[];
  bidders: Bidder[];
  activeTenderId: string;
  activeBidId: string;
  activeBidderId: string;
  setActiveTenderId: (id: string) => void;
  setActiveBidId: (id: string) => void;
  setActiveBidderId: (id: string) => void;
  selectBid: (bidId: string, tenderId?: string) => void;
  selectTender: (tenderId: string) => void;
  activeTender: Tender | undefined;
  activeBid: Bid | undefined;
  activeBidder: Bidder | undefined;
  verificationProgress: VerificationProgressState;
  startAiVerification: (bidId: string) => Promise<void>;
  submitOfficerDecision: (decision: OfficerDecisionRecord) => void;
  metrics: DashboardMetrics;
  currentUser: {
    name: string;
    designation: string;
    organization: string;
    badgeId: string;
    email: string;
  };
  isAuthenticated: boolean;
  login: () => void;
  logout: () => void;
}

const initialVerificationSteps = [
  { name: 'Documents OCR Extraction', status: 'pending' as const },
  { name: 'Government Registry Cross-Check (GSTN / MCA21)', status: 'pending' as const },
  { name: 'EMD & Payment Gateway Reconciliation', status: 'pending' as const },
  { name: 'Tender Rule & Eligibility Evaluation', status: 'pending' as const },
  { name: 'Discrepancy & Deficit Detection', status: 'pending' as const },
  { name: 'Compliance & Multi-Vector Risk Calculation', status: 'pending' as const },
];

const ProcurementContext = createContext<ProcurementContextType | undefined>(undefined);

const BIDS_STORAGE_KEY = 'bidsure.bids';

/**
 * This is a frontend-only prototype with no backend, so officer decisions only ever live in
 * browser state. Persisting them to sessionStorage means a demo survives an accidental page
 * refresh mid-review instead of silently reverting to the original mock data.
 */
const loadPersistedBids = (): Bid[] => {
  try {
    const raw = sessionStorage.getItem(BIDS_STORAGE_KEY);
    if (raw) return JSON.parse(raw) as Bid[];
  } catch {
    // Corrupt or unavailable storage — fall back to the canonical demo dataset.
  }
  return mockBids;
};

export const ProcurementProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [tenders] = useState<Tender[]>(mockTenders);
  const [bids, setBids] = useState<Bid[]>(loadPersistedBids);
  const [activeTenderId, setActiveTenderId] = useState<string>('GEM/2026/CPCL/001');
  const [activeBidId, _setActiveBidId] = useState<string>('BID-001');
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(
    () => sessionStorage.getItem('bidsure.session') === 'active'
  );

  useEffect(() => {
    try {
      sessionStorage.setItem(BIDS_STORAGE_KEY, JSON.stringify(bids));
    } catch {
      // Best-effort only — persistence is a demo convenience, not a requirement.
    }
  }, [bids]);

  const [verificationProgress, setVerificationProgress] = useState<VerificationProgressState>({
    isRunning: false,
    currentStep: 0,
    steps: initialVerificationSteps,
    completed: true,
  });

  const currentUser = {
    name: 'R. K. Ramanathan',
    designation: 'Chief Procurement Officer (CPO)',
    organization: 'Chennai Petroleum Corporation Limited (CPCL)',
    badgeId: 'CPCL-PROC-0841',
    email: 'rk.ramanathan@cpcl.co.in',
  };

  const activeTender = findTenderByIdOrSlug(tenders, activeTenderId) || tenders[0];
  const activeBid = findBidById(bids, activeBidId) || bids[0];
  const activeBidder = activeBid;

  const setActiveBidId = (id: string) => {
    _setActiveBidId(id);
    const found = findBidById(bids, id);
    if (found && found.tenderId) {
      setActiveTenderId(found.tenderId);
    }
  };

  const setActiveBidderId = setActiveBidId;

  const selectBid = (bidId: string, tenderId?: string) => {
    _setActiveBidId(bidId);
    if (tenderId) {
      setActiveTenderId(tenderId);
    } else {
      const found = findBidById(bids, bidId);
      if (found && found.tenderId) {
        setActiveTenderId(found.tenderId);
      }
    }
  };

  const selectTender = (tenderId: string) => {
    setActiveTenderId(tenderId);
  };

  const login = () => {
    sessionStorage.setItem('bidsure.session', 'active');
    setIsAuthenticated(true);
  };
  const logout = () => {
    sessionStorage.removeItem('bidsure.session');
    sessionStorage.removeItem(BIDS_STORAGE_KEY);
    setIsAuthenticated(false);
    setBids(mockBids);
    setActiveTenderId('GEM/2026/CPCL/001');
    _setActiveBidId('BID-001');
  };

  const startAiVerification = async (targetBidId: string) => {
    setVerificationProgress({
      isRunning: true,
      currentStep: 0,
      steps: initialVerificationSteps.map((s, idx) => ({
        ...s,
        status: idx === 0 ? 'in-progress' : 'pending',
      })),
      completed: false,
    });

    for (let step = 0; step < initialVerificationSteps.length; step++) {
      // Step simulation delay
      await new Promise((resolve) => setTimeout(resolve, 500));

      setVerificationProgress((prev) => ({
        ...prev,
        currentStep: step + 1,
        steps: prev.steps.map((s, idx) => {
          if (idx < step) return { ...s, status: 'completed' };
          if (idx === step) {
            // Flag specific steps for specific bids
            const isFlagged =
              (step === 4 && targetBidId === 'BID-001') ||
              (step === 3 && targetBidId === 'BID-002') ||
              ((step === 2 || step === 4) && targetBidId === 'BID-003');
            return { ...s, status: isFlagged ? 'flagged' : 'completed' };
          }
          if (idx === step + 1) return { ...s, status: 'in-progress' };
          return s;
        }),
      }));
    }

    setVerificationProgress((prev) => ({
      ...prev,
      isRunning: false,
      completed: true,
    }));
  };

  const submitOfficerDecision = (decision: OfficerDecisionRecord) => {
    const targetId = decision.bidId || decision.bidderId;
    setBids((prev) =>
      prev.map((b) => {
        if (b.id === targetId || b.bidId === targetId) {
          const auditEvent: AuditEvent = {
            id: `AUD-${Date.now().toString().slice(-4)}`,
            timestamp: new Date().toLocaleString('en-IN', {
              day: '2-digit',
              month: 'short',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            }),
            actor: `${decision.officerName} (${decision.officerDesignation})`,
            actorRole: 'Procurement Officer',
            actionType: 'OFFICER_ACTION',
            summary: `Formal Officer Decision: ${decision.decision.replace(/_/g, ' ')}`,
            details: decision.remarks,
            hash: `REF-${Math.random().toString(16).substring(2, 10).toUpperCase()}`,
            bidId: b.id,
            tenderId: b.tenderId,
          };

          const newStatus =
            decision.decision === 'APPROVE'
              ? 'RECOMMENDED_ACCEPT'
              : decision.decision === 'REJECT'
              ? 'DISQUALIFIED'
              : decision.decision === 'REQUEST_CLARIFICATION'
              ? 'CLARIFICATION_SEEKED'
              : 'UNDER_REVIEW';

          const newStatusLabel =
            decision.decision === 'APPROVE'
              ? 'Recommended Accept'
              : decision.decision === 'REJECT'
              ? 'Disqualified'
              : decision.decision === 'REQUEST_CLARIFICATION'
              ? 'Clarification Sought'
              : 'Under Committee Review';

          return {
            ...b,
            status: newStatus,
            statusLabel: newStatusLabel,
            officerDecision: decision,
            auditTrail: [auditEvent, ...b.auditTrail],
          };
        }
        return b;
      })
    );
  };

  // Synchronized dynamic dashboard metrics derived from the authoritative bids and tenders
  const metrics: DashboardMetrics = {
    activeTenders: tenders.filter((t) => t.status !== 'AWARDED' && t.status !== 'CANCELLED').length,
    bidsUnderVerification: bids.length,
    fullyCompliant: bids.filter((b) => b.overallComplianceScore >= 95).length,
    pendingReviews: bids.filter((b) => !b.officerDecision).length,
    highRisk: bids.filter((b) => b.riskLevel === 'HIGH' || b.riskLevel === 'CRITICAL').length,
    averageCompliance: Math.round(
      bids.reduce((sum, b) => sum + b.overallComplianceScore, 0) / (bids.length || 1)
    ),
  };

  return (
    <ProcurementContext.Provider
      value={{
        tenders,
        bids,
        bidders: bids,
        activeTenderId,
        activeBidId,
        activeBidderId: activeBidId,
        setActiveTenderId,
        setActiveBidId,
        setActiveBidderId,
        selectBid,
        selectTender,
        activeTender,
        activeBid,
        activeBidder,
        verificationProgress,
        startAiVerification,
        submitOfficerDecision,
        metrics,
        currentUser,
        isAuthenticated,
        login,
        logout,
      }}
    >
      {children}
    </ProcurementContext.Provider>
  );
};

export const useProcurement = () => {
  const context = useContext(ProcurementContext);
  if (!context) {
    throw new Error('useProcurement must be used within a ProcurementProvider');
  }
  return context;
};
