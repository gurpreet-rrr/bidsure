import React, { useState } from 'react';
import { Download, CheckCircle2, Eye, X } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';
import { AiAdvisoryBanner } from '../../components/ui/AiAdvisoryBanner';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { RiskBadge } from '../../components/ui/RiskBadge';

interface ReportDefinition {
  id: string;
  title: string;
  category: string;
  description: string;
  format: string;
}

const reports: ReportDefinition[] = [
  {
    id: 'REP-01',
    title: 'Technical Evaluation Summary',
    category: 'Committee Minutes',
    description: 'Evaluation sheet summarizing compliance and risk standing for every bid on the active tender.',
    format: 'PDF (Prototype)',
  },
  {
    id: 'REP-02',
    title: 'Bidder Discrepancy & Evidence Dossier',
    category: 'Audit & Compliance',
    description: 'Clause-by-clause discrepancy log with document excerpts and verification timestamps.',
    format: 'PDF (Prototype)',
  },
  {
    id: 'REP-03',
    title: 'EMD Reconciliation Report',
    category: 'Financial / Treasury',
    description: 'Bank/BG-wise EMD status and MSME exemption validation across all bids.',
    format: 'CSV / PDF (Prototype)',
  },
  {
    id: 'REP-04',
    title: 'Vendor Risk Summary',
    category: 'Risk Management',
    description: 'Financial, statutory, and document risk factors identified across all bidders.',
    format: 'PDF (Prototype)',
  },
  {
    id: 'REP-05',
    title: 'Audit Trail Export',
    category: 'System Log',
    description: 'Chronological export of AI verification events and officer determinations.',
    format: 'JSON / PDF (Prototype)',
  },
];

export const ReportsPage: React.FC = () => {
  const { activeTender, bids } = useProcurement();
  const [downloadSuccess, setDownloadSuccess] = useState<string | null>(null);
  const [previewReport, setPreviewReport] = useState<ReportDefinition | null>(null);

  const tenderBids = bids.filter((b) => b.tenderId === activeTender?.id);

  const handleDownload = (title: string) => {
    setDownloadSuccess(title);
    window.setTimeout(() => setDownloadSuccess(null), 3000);
  };

  return (
    <div className="space-y-5">
      <AiAdvisoryBanner compact />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Procurement Reports
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Report exports for the active tender case
            {activeTender && (
              <span className="ml-2 font-mono text-blue-700 font-medium">({activeTender.id})</span>
            )}
          </p>
        </div>
        {downloadSuccess && (
          <span className="text-xs font-semibold bg-emerald-50 text-emerald-800 border border-emerald-300 px-3 py-1 rounded flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Prototype export generated: {downloadSuccess}
          </span>
        )}
      </div>

      <div className="p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
        These reports are illustrative. No real file is generated in this prototype — "Preview" shows the
        underlying data and "Export" simulates the download.
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {reports.map((rep) => (
          <div
            key={rep.id}
            className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="font-mono font-bold text-blue-700">{rep.id}</span>
                <span className="text-[11px] font-semibold bg-slate-100 text-slate-600 px-2 py-0.5 rounded">
                  {rep.category}
                </span>
              </div>
              <h3 className="text-sm font-bold text-slate-900 mt-1">{rep.title}</h3>
              <p className="text-xs text-slate-600 mt-1 leading-relaxed">{rep.description}</p>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
              <span className="text-slate-400 font-mono text-[11px]">{rep.format}</span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setPreviewReport(rep)}
                  className="px-2.5 py-1 bg-white border border-slate-300 hover:bg-slate-50 rounded text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleDownload(rep.title)}
                  className="px-3 py-1 bg-slate-100 hover:bg-blue-600 hover:text-white rounded text-slate-700 font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Report Preview Modal */}
      {previewReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-xs p-4">
          <div className="bg-white border border-slate-300 rounded-lg max-w-2xl w-full max-h-[85vh] overflow-y-auto shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b border-slate-200 sticky top-0 bg-white">
              <div>
                <div className="text-[11px] font-mono text-blue-700 font-bold">{previewReport.id}</div>
                <h3 className="text-sm font-bold text-slate-900">{previewReport.title}</h3>
              </div>
              <button
                type="button"
                onClick={() => setPreviewReport(null)}
                aria-label="Close preview"
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 text-xs">
              <div className="mb-3 pb-3 border-b border-slate-100 text-slate-600">
                Tender: <span className="font-mono font-semibold text-slate-800">{activeTender?.id}</span> —{' '}
                {activeTender?.title}
              </div>

              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-600 font-semibold uppercase text-[11px]">
                  <tr>
                    <th className="py-2 px-2.5">Bidder</th>
                    <th className="py-2 px-2.5 text-center">Compliance</th>
                    <th className="py-2 px-2.5">Risk</th>
                    <th className="py-2 px-2.5">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {tenderBids.map((b) => (
                    <tr key={b.id}>
                      <td className="py-2 px-2.5 font-semibold text-slate-800">
                        {b.companyName}
                        <div className="text-[10px] text-slate-400 font-mono font-normal">{b.id}</div>
                      </td>
                      <td className="py-2 px-2.5 text-center font-mono">{b.overallComplianceScore}%</td>
                      <td className="py-2 px-2.5">
                        <RiskBadge level={b.riskLevel} score={b.riskScore} />
                      </td>
                      <td className="py-2 px-2.5">
                        <StatusBadge status={b.status} size="sm" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-4 p-2.5 bg-slate-50 border border-slate-200 rounded text-[11px] text-slate-500">
                This preview is generated live from current prototype data. A production version of CSAP
                would render this as a formatted, exportable document.
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
