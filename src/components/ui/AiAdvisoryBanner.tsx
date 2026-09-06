import React from 'react';
import { Info } from 'lucide-react';

interface AiAdvisoryBannerProps {
  /** @deprecated the banner is always rendered in this compact form now; kept so existing call sites don't need to change. */
  compact?: boolean;
  className?: string;
}

/**
 * A single, consistent notice used across every page — not a hero banner.
 * One line the officer reads once and then ignores, not a poster.
 */
export const AiAdvisoryBanner: React.FC<AiAdvisoryBannerProps> = ({ className = '' }) => {
  return (
    <div
      className={`flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 rounded text-xs text-slate-600 ${className}`}
    >
      <Info className="w-3.5 h-3.5 text-slate-400 shrink-0" />
      <span>
        AI findings are advisory only — the procurement officer makes the final decision.
      </span>
    </div>
  );
};
