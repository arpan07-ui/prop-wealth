import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Sparkles, ArrowLeft, Coins, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { signInWithGoogle, signInWithDiscord, user } = useAuth();
    const [loadingProvider, setLoadingProvider] = useState<'google' | 'discord' | null>(null);
    const [error, setError] = useState<string | null>(null);

    // If already logged in, offer quick navigation to dashboard
    React.useEffect(() => {
        if (user) {
            navigate('/dashboard');
        }
    }, [user, navigate]);

    const handleGoogleLogin = async () => {
        try {
            setError(null);
            setLoadingProvider('google');
            await signInWithGoogle(`${window.location.origin}/dashboard`);
        } catch (err: any) {
            setError(err?.message || 'Google sign-in could not be initiated. Please try again.');
            setLoadingProvider(null);
        }
    };

    const handleDiscordLogin = async () => {
        try {
            setError(null);
            setLoadingProvider('discord');
            await signInWithDiscord(`${window.location.origin}/dashboard`);
        } catch (err: any) {
            setError(err?.message || 'Discord sign-in could not be initiated. Please try again.');
            setLoadingProvider(null);
        }
    };

    return (
        <div className="min-h-screen bg-[#070605] text-white flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden select-none">
            {/* Ambient Background Aura Lights */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#F0C41B]/15 via-[#F6AE13]/8 to-transparent rounded-full blur-[140px] pointer-events-none" />
            <div className="absolute bottom-10 right-10 w-[350px] h-[350px] bg-[#5865F2]/10 rounded-full blur-[120px] pointer-events-none" />
            <div className="absolute top-10 left-10 w-[300px] h-[300px] bg-[#F0C41B]/5 rounded-full blur-[100px] pointer-events-none" />

            {/* Subtle Grid Pattern Overlay */}
            <div 
                className="absolute inset-0 pointer-events-none opacity-20"
                style={{
                    backgroundImage: `radial-gradient(rgba(240, 196, 27, 0.25) 1px, transparent 1px)`,
                    backgroundSize: '32px 32px'
                }}
            />

            {/* Top Navigation - Back Button */}
            <div className="absolute top-6 left-6 z-20">
                <Link
                    to="/"
                    className="inline-flex items-center gap-2 text-xs font-semibold text-neutral-400 hover:text-[#F0C41B] px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 backdrop-blur-md transition-all duration-200 group"
                >
                    <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                    Back to Home
                </Link>
            </div>

            {/* Main Auth Container */}
            <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
                {/* Brand Logo & Header */}
                <div className="flex flex-col items-center text-center mb-8">
                    <Link to="/" className="inline-block transition-transform duration-300 hover:scale-105 mb-4">
                        <img 
                            src="/wealth-logo.png" 
                            alt="PROPxWEALTH" 
                            className="h-10 sm:h-12 w-auto object-contain drop-shadow-[0_4px_20px_rgba(240,196,27,0.3)]" 
                        />
                    </Link>

                    {/* Verified Badge */}
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F0C41B]/10 border border-[#F0C41B]/25 text-[#F0C41B] text-[11px] font-bold tracking-wider uppercase mb-3 shadow-[0_0_15px_rgba(240,196,27,0.15)]">
                        <Sparkles size={12} className="animate-pulse" />
                        Trader Portal
                    </div>

                    <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                        Welcome Back
                    </h1>
                    <p className="mt-2 text-sm text-neutral-400 max-w-sm">
                        Sign in instantly with your social account to access evaluations, stats & rewards.
                    </p>
                </div>

                {/* Glassmorphic Login Card */}
                <div className="relative rounded-3xl bg-[#0e0d0a]/85 backdrop-blur-2xl border border-white/10 hover:border-[#F0C41B]/20 p-6 sm:p-8 shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(240,196,27,0.05)] transition-all duration-300">
                    
                    {/* Golden top accent edge */}
                    <div className="absolute top-0 inset-x-8 h-px bg-gradient-to-r from-transparent via-[#F0C41B]/50 to-transparent" />

                    {/* Error Banner */}
                    {error && (
                        <div className="mb-6 p-3.5 rounded-xl bg-red-500/10 border border-red-500/25 flex items-start gap-2.5 text-xs text-red-300 animate-fade-in">
                            <AlertCircle size={16} className="shrink-0 text-red-400 mt-0.5" />
                            <span>{error}</span>
                        </div>
                    )}

                    {/* Social Buttons Stack */}
                    <div className="space-y-3.5">
                        
                        {/* Google Login Button */}
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            disabled={loadingProvider !== null}
                            className="w-full relative group overflow-hidden flex items-center justify-center gap-3.5 py-3.5 px-5 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-[0.99] border border-white/15 hover:border-white/30 text-white font-semibold text-sm transition-all duration-200 shadow-[0_4px_20px_rgba(0,0,0,0.4)] disabled:opacity-60 disabled:cursor-not-allowed"
                        >
                            {/* Hover light sheen effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                            {loadingProvider === 'google' ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-[#F0C41B]" />
                                    <span>Connecting to Google...</span>
                                </>
                            ) : (
                                <>
                                    {/* Google G Icon */}
                                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                                        <path
                                            fill="#4285F4"
                                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        />
                                        <path
                                            fill="#34A853"
                                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        />
                                        <path
                                            fill="#FBBC05"
                                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        />
                                        <path
                                            fill="#EA4335"
                                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        />
                                    </svg>
                                    <span className="font-medium text-white group-hover:text-white">
                                        Continue with Google
                                    </span>
                                </>
                            )}
                        </button>

                        {/* Discord Login Button */}
                        <button
                            type="button"
                            onClick={handleDiscordLogin}
                            disabled={loadingProvider !== null}
                            className="w-full relative group overflow-hidden flex items-center justify-center gap-3.5 py-3.5 px-5 rounded-2xl bg-[#5865F2] hover:bg-[#4752C4] active:scale-[0.99] text-white font-semibold text-sm transition-all duration-200 shadow-[0_4px_25px_rgba(88,101,242,0.35)] disabled:opacity-60 disabled:cursor-not-allowed border border-white/10"
                        >
                            {/* Hover light sheen effect */}
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />

                            {loadingProvider === 'discord' ? (
                                <>
                                    <Loader2 size={18} className="animate-spin text-white" />
                                    <span>Connecting to Discord...</span>
                                </>
                            ) : (
                                <>
                                    {/* Discord Official Icon */}
                                    <svg className="w-5 h-5 shrink-0 fill-current" viewBox="0 0 127.14 96.36">
                                        <path d="M107.7,8.07A105.15,105.15,0,0,0,81.47,0a72.06,72.06,0,0,0-3.36,6.83A97.68,97.68,0,0,0,49,6.83,72.37,72.37,0,0,0,45.64,0,105.89,105.89,0,0,0,19.39,8.09C2.79,32.65-1.71,56.6.54,80.21h0A105.73,105.73,0,0,0,32.71,96.36,77.7,77.7,0,0,0,39.6,85.25a68.42,68.42,0,0,1-10.85-5.18c.91-.66,1.8-1.34,2.66-2a75.57,75.57,0,0,0,64.32,0c.87.71,1.76,1.39,2.66,2a68.68,68.68,0,0,1-10.87,5.19,77,77,0,0,0,6.89,11.1A105.25,105.25,0,0,0,126.6,80.22h0C129.24,52.84,122.09,29.11,107.7,8.07ZM42.45,65.69C36.18,65.69,31,60,31,53s5-12.74,11.43-12.74S54,45.91,53.89,53,48.84,65.69,42.45,65.69Zm42.24,0C78.41,65.69,73.25,60,73.25,53s5-12.74,11.44-12.74S96.23,45.91,96.12,53,91.08,65.69,84.69,65.69Z"/>
                                    </svg>
                                    <span className="font-medium text-white">
                                        Continue with Discord
                                    </span>
                                </>
                            )}
                        </button>
                    </div>

                    {/* Features / Security Checklist */}
                    <div className="mt-8 pt-6 border-t border-white/5 space-y-2.5">
                        <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                            <CheckCircle2 size={14} className="text-[#F0C41B] shrink-0" />
                            <span>One-click login • No password to remember</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                            <ShieldCheck size={14} className="text-[#F0C41B] shrink-0" />
                            <span>Encrypted with Supabase 256-Bit OAuth 2.0</span>
                        </div>
                        <div className="flex items-center gap-2.5 text-xs text-neutral-400">
                            <Coins size={14} className="text-[#F0C41B] shrink-0" />
                            <span>Instant access to Wealth Tokens & Rewards</span>
                        </div>
                    </div>

                    {/* Switch to Signup */}
                    <div className="mt-6 pt-5 border-t border-white/5 text-center">
                        <p className="text-xs text-neutral-400">
                            New to PROPxWEALTH?{' '}
                            <Link 
                                to="/signup" 
                                className="font-bold text-[#F0C41B] hover:text-[#ffd747] underline underline-offset-2 transition-colors ml-1"
                            >
                                Create Free Account &rarr;
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer Legal Note */}
                <div className="mt-6 text-center">
                    <p className="text-[11px] text-neutral-500 max-w-xs mx-auto leading-relaxed">
                        By logging in, you agree to PROPxWEALTH's{' '}
                        <Link to="/terms" className="text-neutral-400 hover:text-white underline">Terms of Service</Link>{' '}
                        and{' '}
                        <Link to="/privacy" className="text-neutral-400 hover:text-white underline">Privacy Policy</Link>.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
