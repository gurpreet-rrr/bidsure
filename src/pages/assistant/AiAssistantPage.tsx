import React, { useState } from 'react';
import { Bot, Send, AlertCircle } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
  timestamp: string;
  evidenceRef?: string;
}

export const AiAssistantPage: React.FC = () => {
  const { activeTender } = useProcurement();

  const [inputPrompt, setInputPrompt] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'MSG-1',
      sender: 'assistant',
      text: 'Good day, Officer Ramanathan. I am your CSAP Procurement Assistant. I can answer inquiries regarding tender eligibility benchmarks, bidder discrepancy findings, EMD reconciliation data, and clause-level compliance scores based on your active tender case (GEM/2026/CPCL/001). How may I assist your scrutiny today?',
      timestamp: '10:00 AM',
    },
  ]);

  const quickQuestions = [
    'Why is ABC Industrial Solutions under manual review?',
    'What is the discrepancy found in National Safety Systems?',
    'Why was Prime Tech Solutions granted EMD exemption?',
    'Show me the OEM Authorization clause requirement.',
  ];

  const handleSendMessage = (textToSend?: string) => {
    const text = textToSend || inputPrompt;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `USER-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    };

    let replyText = '';
    let evidence = '';

    const lower = text.toLowerCase();
    if (lower.includes('abc industrial') || lower.includes('manual review')) {
      replyText =
        'ABC Industrial Solutions scored 92% overall compliance with LOW risk. However, under Clause 5.1(b), their Manufacturer Authorization Form (MAF) from Dräger Safety India Ltd expires on 30 October 2026. This provides only 55 days of validity from technical bid opening (05 Sep 2026), whereas the tender stipulates a mandatory 90-day validity window (required until 04 Dec 2026). It is flagged for officer clarification.';
      evidence = 'EVD-001 (OEM Authorization Deficit)';
    } else if (lower.includes('national safety') || lower.includes('discrepancy')) {
      replyText =
        'National Safety Systems exhibits HIGH risk (score: 68). Two primary critical deficits were detected: (1) EMD Shortfall: They submitted ₹1,50,000 via NEFT transaction TXN881294, which is ₹50,000 short of the mandatory ₹2,00,000 requirement. (2) Financial turnover averages ₹3.46 Cr against required ₹5.00 Cr benchmark. Under Clause 3.1, deficient EMD is liable for summary disqualification.';
      evidence = 'EVD-003 (EMD Shortfall)';
    } else if (lower.includes('prime tech') || lower.includes('msme') || lower.includes('exemption')) {
      replyText =
        'Prime Tech Solutions (BID-004) submitted Udyam Certificate UDYAM-TN-02-0089142 as a registered Micro/Small Enterprise (MSE) under NIC Manufacturing codes. As per Public Procurement Policy for MSEs Order 2012, they are legally exempt from depositing EMD. Their 3-year turnover is ₹8.40 Cr, and local content is 85%.';
    } else if (lower.includes('oem') || lower.includes('clause 5.1')) {
      replyText =
        'Clause 5.1(b) of GEM/2026/CPCL/001 requires all non-manufacturing bidders to provide an OEM Authorization Form directly from the manufacturer guaranteeing back-to-back replacement warranty and service support, valid for at least 90 calendar days from the date of technical bid opening.';
    } else {
      replyText = `Based on the current tender data for ${activeTender?.title || 'this tender'}, 4 bidders are currently evaluated: Prime Tech Solutions (96% Compliant), ABC Industrial Solutions (92% Compliant, 1 discrepancy), Bharat Engineering Works (87% Compliant), and National Safety Systems (74% Compliant, deficient EMD). Officer sign-off is pending.`;
    }

    const aiMsg: ChatMessage = {
      id: `AI-${Date.now()}`,
      sender: 'assistant',
      text: replyText,
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      evidenceRef: evidence || undefined,
    };

    setMessages((prev) => [...prev, userMsg, aiMsg]);
    setInputPrompt('');
  };

  return (
    <div className="space-y-4 max-w-4xl mx-auto">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-600 rounded text-white shadow-xs">
              <Bot className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-base font-bold text-slate-900">CSAP Procurement Assistant</h1>
              <span className="text-[11px] text-indigo-700 font-semibold uppercase tracking-wider">
                Advisory Decision Support Copilot
              </span>
            </div>
          </div>
          <span className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded font-mono border border-slate-200">
            Case: GEM/2026/CPCL/001
          </span>
        </div>

        <div className="mt-3 p-2 bg-indigo-50/70 border border-indigo-200 rounded text-[11px] text-indigo-950 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-indigo-600 shrink-0" />
          <span>
            <strong>Statutory Rule Notice:</strong> Responses are generated from submitted bid OCR text and CPPP rules. The Procurement Officer retains statutory authority for all contract awards and disqualifications.
          </span>
        </div>
      </div>

      {/* Quick Questions */}
      <div className="flex flex-wrap gap-2">
        {quickQuestions.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => handleSendMessage(q)}
            className="text-xs bg-white hover:bg-indigo-50 hover:border-indigo-300 border border-slate-200 text-slate-700 px-3 py-1.5 rounded-full transition-colors font-medium shadow-2xs"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Chat Messages */}
      <div className="bg-white border border-slate-200 rounded-md p-4 shadow-2xs min-h-[380px] max-h-[500px] overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-3 text-xs ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="w-7 h-7 rounded bg-indigo-700 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Bot className="w-4 h-4" />
              </div>
            )}

            <div
              className={`p-3.5 rounded-md max-w-xl ${
                msg.sender === 'user'
                  ? 'bg-blue-600 text-white font-medium'
                  : 'bg-slate-50 border border-slate-200 text-slate-800'
              }`}
            >
              <div className="flex items-center justify-between gap-4 mb-1 text-[10px] opacity-80">
                <span className="font-bold uppercase tracking-wider">
                  {msg.sender === 'user' ? 'Procurement Officer' : 'CSAP Copilot'}
                </span>
                <span>{msg.timestamp}</span>
              </div>
              <p className="leading-relaxed">{msg.text}</p>
              {msg.evidenceRef && (
                <div className="mt-2 pt-2 border-t border-slate-200 text-[11px] font-mono text-indigo-700 font-semibold">
                  Linked Evidence: {msg.evidenceRef}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="w-7 h-7 rounded bg-blue-900 text-white flex items-center justify-center shrink-0 mt-0.5 font-bold text-[11px]">
                RK
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Input Box */}
      <div className="bg-white p-2 rounded-md border border-slate-200 shadow-2xs flex items-center gap-2">
        <input
          type="text"
          placeholder="Ask a question regarding tender clauses, bidder discrepancies, or EMD status..."
          value={inputPrompt}
          onChange={(e) => setInputPrompt(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSendMessage();
          }}
          className="flex-1 px-3 py-2 text-xs text-slate-900 bg-transparent focus:outline-hidden"
        />
        <button
          type="button"
          onClick={() => handleSendMessage()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-xs"
        >
          <span>Ask</span>
          <Send className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
};
