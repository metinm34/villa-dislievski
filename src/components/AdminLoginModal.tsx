import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Shield, KeyRound, Lock, User, X, Loader2, Sparkles, CheckCircle2 } from 'lucide-react';
import { AdminUser } from '../types';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AdminUser, token: string) => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
}) => {
  const [email, setEmail] = useState('admin@villadislievski.com');
  const [password, setPassword] = useState('luxury2026');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Authentication failed');
      }

      // Store token in localStorage
      localStorage.setItem('villa_admin_token', data.token);
      localStorage.setItem('villa_admin_user', JSON.stringify(data.user));

      onLoginSuccess(data.user, data.token);
      onClose();
    } catch (err: any) {
      setErrorMsg(err.message || 'Login error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFillDemo = () => {
    setEmail('admin@villadislievski.com');
    setPassword('luxury2026');
    setErrorMsg(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.94, y: 15 }}
        transition={{ duration: 0.3 }}
        className="relative w-full max-w-md rounded-2xl bg-[#16161A] border border-[#E6D5B8]/35 p-6 sm:p-8 shadow-2xl shadow-black"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-[#A19A8C] hover:text-white hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-full border border-[#E6D5B8]/40 bg-[#1F1E24] flex items-center justify-center mx-auto mb-3 text-[#E6D5B8] shadow-inner">
            <KeyRound className="w-6 h-6" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.25em] text-[#E6D5B8] font-semibold">
            Concierge & General Management
          </span>
          <h3 className="font-serif-luxury text-2xl font-bold text-white mt-1">
            ADMIN PORTAL
          </h3>
          <p className="text-xs text-[#A19A8C] mt-1 font-light">
            Secure JWT authentication for Villa Dislievski reservations
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-lg bg-red-950/40 border border-red-500/40 text-red-200 text-xs text-center">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A19A8C] mb-1.5 font-medium">
              Administrator Email
            </label>
            <div className="relative">
              <User className="w-4 h-4 text-[#A19A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@villadislievski.com"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101013] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#68635B] focus:outline-none focus:border-[#E6D5B8] transition-colors"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] uppercase tracking-wider text-[#A19A8C] mb-1.5 font-medium">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#A19A8C] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[#101013] border border-[#E6D5B8]/20 text-xs text-white placeholder-[#68635B] focus:outline-none focus:border-[#E6D5B8] transition-colors"
              />
            </div>
          </div>

          {/* Quick Demo Credentials Fill Button */}
          <div className="pt-1">
            <button
              type="button"
              onClick={handleFillDemo}
              className="w-full py-1.5 rounded-lg text-[11px] bg-[#1F1E24] text-[#E6D5B8] hover:bg-[#2A2722] border border-[#E6D5B8]/15 flex items-center justify-center space-x-1.5 transition-colors"
            >
              <Sparkles className="w-3 h-3 text-[#E6D5B8]" />
              <span>Auto-Fill Demo Admin Credentials (`luxury2026`)</span>
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3.5 rounded-full text-xs uppercase tracking-[0.2em] font-bold bg-[#E6D5B8] text-[#0F0F11] hover:bg-white hover:shadow-xl hover:shadow-[#E6D5B8]/20 transition-all duration-300 flex items-center justify-center space-x-2 active:scale-98 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Verifying Credentials...</span>
              </>
            ) : (
              <>
                <Shield className="w-4 h-4" />
                <span>Access Protected Dashboard</span>
              </>
            )}
          </button>
        </form>

      </motion.div>
    </div>
  );
};
