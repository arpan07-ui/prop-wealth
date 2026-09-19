import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Shield, Lock, Mail, Eye, EyeOff, AlertCircle, CheckCircle2,
  ArrowRight, Loader2, KeyRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';

const MyAdminPage: React.FC = () => {
  const navigate = useNavigate();
  const { setAdminOverride, isAdmin } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // If already authenticated as admin, redirect to /admin
  React.useEffect(() => {
    if (isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, navigate]);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = password.trim();

    if (!cleanEmail || !cleanPass) {
      setError('Please enter your administrator credentials.');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      // 1. Authenticate with Supabase Auth
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password: cleanPass,
      });

      if (authError) {
        throw authError;
      }

      if (data?.user) {
        // Verify admin role in profiles or whitelist
        const { data: prof } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .maybeSingle();

        const adminEmails = [
          'admin@propxwealth.com',
          'admin@propxwealthx.com',
          'renoxg1@gmail.com',
          'waleed@propxwealth.com'
        ];

        const isAuthorized = adminEmails.includes(cleanEmail) || prof?.role === 'admin';

        if (isAuthorized) {
          setAdminOverride(true);
          setSuccess('Access verified. Redirecting to Command Center...');
          setTimeout(() => navigate('/admin'), 600);
        } else {
          setError('Access denied: Your account does not have administrator permissions.');
        }
      }
    } catch (err: any) {
      console.error('Admin authentication failure:', err);
      setError('Invalid credentials or unauthorized access. Verify your administrator email and password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#060608] text-white flex flex-col justify-center items-center px-4 py-12 relative overflow-hidden font-sans select-none">
      {/* Discreet dark ambient glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-[#F0C41B]/5 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-1/4 w-[350px] h-[350px] bg-sky-500/[0.03] rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full max-w-sm relative z-10">
        
        {/* Secure Portal Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-[#121216] border border-white/10 text-[#F0C41B] mb-4 shadow-2xl">
            <Shield size={28} />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full text-[10px] font-black uppercase tracking-widest bg-white/5 text-white/50 border border-white/10 mb-2">
            <KeyRound size={11} className="text-[#F0C41B]" />
            Restricted System
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Staff Authentication
          </h1>
          <p className="text-white/40 text-xs mt-1">
            Internal Platform Administration Gateway
          </p>
        </div>

        {/* Secure Login Box */}
        <div className="bg-[#0f0f12] border border-white/10 rounded-2xl p-6 sm:p-7 shadow-2xl relative">
          
          {error && (
            <div className="mb-4 p-3 bg-rose-500/10 border border-rose-500/20 rounded-xl text-rose-300 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
              <div className="leading-relaxed">{error}</div>
            </div>
          )}

          {success && (
            <div className="mb-4 p-3 bg-emerald-500/15 border border-emerald-500/30 rounded-xl text-emerald-300 text-xs flex items-center gap-2.5 font-semibold animate-fadeIn">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
              <span>{success}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                Administrator Email
              </label>
              <div className="relative">
                <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type="email"
                  required
                  autoComplete="username"
                  placeholder="Enter email address"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F0C41B] transition-colors"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-white/50 mb-1.5 uppercase tracking-wider">
                Password
              </label>
              <div className="relative">
                <Lock size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-white/30" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  placeholder="Enter password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full bg-black/50 border border-white/10 rounded-xl pl-10 pr-10 py-2.5 text-xs sm:text-sm text-white placeholder-white/20 focus:outline-none focus:border-[#F0C41B] transition-colors"
                />
                <button
                  type="button"
                  tabIndex={-1}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-white/30 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#F0C41B] hover:bg-yellow-300 text-black font-black py-3 rounded-xl text-xs sm:text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-[#F0C41B]/20 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Verifying Credentials...</span>
                  </>
                ) : (
                  <>
                    <Shield size={15} />
                    <span>Authorize & Sign In</span>
                    <ArrowRight size={14} />
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Security Notice */}
          <div className="mt-6 pt-4 border-t border-white/5 text-center">
            <div className="flex items-center justify-center gap-1.5 text-[10px] text-white/30 font-medium">
              <Lock size={10} className="text-[#F0C41B]" />
              <span>TLS 1.3 256-Bit Encrypted Internal Gateway</span>
            </div>
          </div>
        </div>

        {/* Return to Portal */}
        <div className="text-center mt-6">
          <Link to="/" className="text-xs text-white/30 hover:text-white/70 transition-colors">
            ← Return to Trader Portal
          </Link>
        </div>

      </div>
    </div>
  );
};

export default MyAdminPage;
