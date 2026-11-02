import React, { useState } from 'react';
import { X, Lock, Mail, User, Sparkles, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const { login, register, demoLogin } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [experienceLevel, setExperienceLevel] = useState<'Beginner' | 'Intermediate' | 'Advanced' | 'Competitive'>('Intermediate');
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccessMsg(null);
    setSubmitting(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        onClose();
      } else if (mode === 'signup') {
        if (!username.trim()) throw new Error('Username is required');
        if (password.length < 6) throw new Error('Password must be at least 6 characters');
        await register({ username, email, password, experienceLevel });
        onClose();
      } else if (mode === 'forgot') {
        const res = await api.resetPassword(email);
        setSuccessMsg(res.message);
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemo = async (type: 'alex' | 'sarah') => {
    setSubmitting(true);
    setError(null);
    try {
      await demoLogin(type);
      onClose();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-[#111417] border border-[#252C2E] rounded-2xl shadow-2xl overflow-hidden p-6 text-[#F3F5F2]">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-[#929B9C] hover:text-[#F3F5F2] hover:bg-[#151A1E] rounded-lg transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-[#B8F36B]/10 border border-[#B8F36B]/30 text-[#B8F36B] mb-3">
            <Lock className="w-6 h-6" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">
            {mode === 'login' && 'Sign in to CodeArena'}
            {mode === 'signup' && 'Create your Developer Account'}
            {mode === 'forgot' && 'Reset your Password'}
          </h2>
          <p className="text-sm text-[#929B9C] mt-1">
            {mode === 'login' && 'Access competitive contests, track submissions, and ask Gemini'}
            {mode === 'signup' && 'Join thousands of competitive programmers sharpening their skills'}
            {mode === 'forgot' && 'Enter your email to receive temporary recovery credentials'}
          </p>
        </div>

        {/* Quick Demo Accounts */}
        <div className="mb-5 p-3 rounded-xl bg-[#151A1E] border border-[#252C2E]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-[#929B9C] flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#B8F36B]" /> Instant Demo Profiles
            </span>
            <span className="text-[11px] text-[#B8F36B]/80 font-mono">1-Click</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => handleQuickDemo('alex')}
              disabled={submitting}
              className="px-3 py-2 text-left bg-[#1A2024] hover:bg-[#252C2E] hover:border-[#B8F36B]/40 border border-[#252C2E] rounded-lg transition-all"
            >
              <div className="text-xs font-semibold text-[#F3F5F2]">Alex Chen</div>
              <div className="text-[11px] text-[#B8F36B] font-mono">Rating 1845 • 12 Streak</div>
            </button>
            <button
              type="button"
              onClick={() => handleQuickDemo('sarah')}
              disabled={submitting}
              className="px-3 py-2 text-left bg-[#1A2024] hover:bg-[#252C2E] hover:border-[#69D5C5]/40 border border-[#252C2E] rounded-lg transition-all"
            >
              <div className="text-xs font-semibold text-[#F3F5F2]">Sarah Lin</div>
              <div className="text-[11px] text-[#69D5C5] font-mono">Rating 1610 • 6 Streak</div>
            </button>
          </div>
        </div>

        <div className="relative flex items-center justify-center my-4">
          <div className="border-t border-[#252C2E] w-full" />
          <span className="bg-[#111417] px-3 text-xs text-[#929B9C] uppercase font-mono">Or Continue With Email</span>
          <div className="border-t border-[#252C2E] w-full" />
        </div>

        {/* Error / Success feedback */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="mb-4 p-3 rounded-lg bg-[#B8F36B]/10 border border-[#B8F36B]/30 text-[#B8F36B] text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-3.5">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#929B9C] mb-1">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-2.5 w-4 h-4 text-[#929B9C]" />
                <input
                  type="text"
                  required
                  placeholder="e.g. AlgoWizard"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-[#929B9C] mb-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 w-4 h-4 text-[#929B9C]" />
              <input
                type="email"
                required
                placeholder="developer@codearena.dev"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-medium text-[#929B9C]">Password</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setMode('forgot'); setError(null); }}
                    className="text-xs text-[#B8F36B] hover:underline"
                  >
                    Forgot?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-2.5 w-4 h-4 text-[#929B9C]" />
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] placeholder-[#929B9C]/50 focus:outline-none focus:border-[#B8F36B]"
                />
              </div>
            </div>
          )}

          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-medium text-[#929B9C] mb-1">Experience Level</label>
              <select
                value={experienceLevel}
                onChange={e => setExperienceLevel(e.target.value as any)}
                className="w-full px-3 py-2 bg-[#151A1E] border border-[#252C2E] rounded-lg text-sm text-[#F3F5F2] focus:outline-none focus:border-[#B8F36B]"
              >
                <option value="Beginner">Beginner (Starting with DSA)</option>
                <option value="Intermediate">Intermediate (Practicing LeetCode / NeetCode)</option>
                <option value="Advanced">Advanced (Interview Ready)</option>
                <option value="Competitive">Competitive (Codeforces / ICPC)</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full mt-2 py-2.5 px-4 bg-[#B8F36B] hover:bg-[#a5db5f] text-[#0B0D0F] font-bold rounded-lg text-sm flex items-center justify-center gap-2 transition-colors disabled:opacity-50 cursor-pointer"
          >
            {submitting ? 'Authenticating...' : mode === 'login' ? 'Sign In' : mode === 'signup' ? 'Create Account' : 'Send Recovery Link'}
            {!submitting && <ArrowRight className="w-4 h-4" />}
          </button>
        </form>

        {/* Footer Mode Switch */}
        <div className="mt-5 text-center text-xs text-[#929B9C]">
          {mode === 'login' ? (
            <p>
              Don't have an account yet?{' '}
              <button
                type="button"
                onClick={() => { setMode('signup'); setError(null); }}
                className="text-[#B8F36B] hover:underline font-medium"
              >
                Sign Up
              </button>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => { setMode('login'); setError(null); }}
                className="text-[#B8F36B] hover:underline font-medium"
              >
                Sign In
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
