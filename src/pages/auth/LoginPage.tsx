import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Lock, ArrowRight, Eye, EyeOff, AlertCircle, Loader2 } from 'lucide-react';
import { useProcurement } from '../../context/ProcurementContext';

const DEMO_OFFICER_ID = 'CPCL-PROC-0841';
const DEMO_PASSWORD = 'Cpcl@2026';

export const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useProcurement();

  const [officerId, setOfficerId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedId = officerId.trim();
    if (!trimmedId || !password) {
      setError('Employee Code and password are both required.');
      return;
    }

    setIsSubmitting(true);

    // Simulated authentication latency for a believable prototype login flow.
    window.setTimeout(() => {
      const isValid =
        trimmedId.toLowerCase() === DEMO_OFFICER_ID.toLowerCase() && password === DEMO_PASSWORD;

      if (!isValid) {
        setError('Invalid Employee Code or password. Use the demo credentials shown below.');
        setIsSubmitting(false);
        return;
      }

      login();
      navigate('/dashboard', { replace: true });
    }, 450);
  };

  const fillDemoCredentials = () => {
    setOfficerId(DEMO_OFFICER_ID);
    setPassword(DEMO_PASSWORD);
    setError('');
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-[#071524] text-slate-100 px-4 py-8 relative overflow-hidden">
      {/* Subtle background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#10375c0a_1px,transparent_1px),linear-gradient(to_bottom,#10375c0a_1px,transparent_1px)] bg-[size:32px_32px]"></div>

      <div className="max-w-md w-full relative z-10">
        {/* CPCL & Portal Badge */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-md bg-blue-600 text-white shadow-md mb-3">
            <Shield className="w-8 h-8" />
          </div>
          <h1 className="text-2xl font-black tracking-wider uppercase text-white">
            BidSure AI
          </h1>
          <p className="text-xs text-blue-300 font-medium tracking-wide mt-1">
            AI-Assisted Procurement Bid Verification Platform
          </p>
          <div className="mt-2 text-[11px] text-slate-400 font-mono">
            CHENNAI PETROLEUM CORPORATION LIMITED (CPCL)
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-[#0A2540] border border-slate-700/80 rounded-lg p-6 shadow-xl">
          <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-700/60 text-xs">
            <span className="font-semibold uppercase tracking-wider text-slate-300">
              Procurement Officer Login
            </span>
            <span className="inline-flex items-center gap-1 text-slate-400 font-medium text-[11px] uppercase tracking-wide">
              Prototype Access
            </span>
          </div>

          {error && (
            <div className="mb-4 p-2.5 rounded border border-rose-500/40 bg-rose-950/40 text-rose-200 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <div>
              <label htmlFor="officerId" className="block text-xs font-medium text-slate-300 mb-1">
                Officer Employee Code / GeM ID
              </label>
              <input
                id="officerId"
                type="text"
                value={officerId}
                onChange={(e) => setOfficerId(e.target.value)}
                placeholder="e.g. CPCL-PROC-0841"
                autoComplete="username"
                className="w-full px-3 py-2 text-sm bg-slate-900/90 border border-slate-600 rounded text-white font-mono placeholder:text-slate-600 focus:border-blue-500 focus:outline-hidden"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-medium text-slate-300 mb-1">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  autoComplete="current-password"
                  className="w-full px-3 py-2 pr-10 text-sm bg-slate-900/90 border border-slate-600 rounded text-white font-mono placeholder:text-slate-600 focus:border-blue-500 focus:outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                  aria-pressed={showPassword}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-0.5"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <div className="bg-slate-900/60 p-3 rounded border border-slate-800 text-[11px] text-slate-300">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">Demo Credentials</span>
                <button
                  type="button"
                  onClick={fillDemoCredentials}
                  className="text-blue-400 hover:text-blue-300 font-semibold underline underline-offset-2"
                >
                  Autofill
                </button>
              </div>
              <div className="mt-1.5 font-mono text-slate-300">
                <div>Employee Code: {DEMO_OFFICER_ID}</div>
                <div>Password: {DEMO_PASSWORD}</div>
              </div>
              <div className="text-slate-500 mt-1">
                Signs in as R. K. Ramanathan, Chief Procurement Officer — Manali Refinery Commercial Division.
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed text-white rounded text-sm font-semibold flex items-center justify-center gap-2 transition-colors shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Signing In...</span>
                </>
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-4 pt-3 border-t border-slate-800 text-center flex items-center justify-center gap-1.5">
            <Lock className="w-3 h-3 text-slate-500 shrink-0" />
            <p className="text-[10px] text-slate-400 leading-normal">
              Prototype environment for authorized CPCL procurement reviewers. BidSure AI is an advisory
              decision-support tool — it does not connect to any live government system in this demo.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
