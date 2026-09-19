import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    isAdmin: boolean;
    loading: boolean;
    signInWithGoogle: (redirectTo?: string) => Promise<void>;
    signInWithDiscord: (redirectTo?: string) => Promise<void>;
    signInWithPassword: (email: string, password: string) => Promise<any>;
    setAdminOverride: (status: boolean) => void;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<Session | null>(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initAuth = async () => {
            try {
                // Handle OAuth redirect hash tokens (#access_token=...&refresh_token=...)
                if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token=')) {
                    try {
                        const hash = window.location.hash.startsWith('#') ? window.location.hash.substring(1) : window.location.hash;
                        const params = new URLSearchParams(hash);
                        const accessToken = params.get('access_token');
                        const refreshToken = params.get('refresh_token');

                        if (accessToken) {
                            const { data, error: setSessionErr } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken || ''
                            });

                            if (!setSessionErr && data?.session) {
                                setSession(data.session);
                                setUser(data.session.user);
                                await checkAdminStatus(data.session.user);

                                // Clean the raw JWT hash from URL bar
                                window.history.replaceState(null, '', window.location.pathname + window.location.search);

                                // Redirect to dashboard if landing from auth
                                if (window.location.pathname === '/' || window.location.pathname === '/login' || window.location.pathname === '/signup') {
                                    window.location.href = '/dashboard';
                                    return;
                                }
                            }
                        }
                    } catch (hashErr) {
                        console.warn('OAuth hash extraction warning:', hashErr);
                    }
                }

                // 1. Get initial session
                const { data: { session }, error } = await supabase.auth.getSession();
                if (error) throw error;

                setSession(session);
                setUser(session?.user ?? null);

                if (session?.user) {
                    await checkAdminStatus(session.user);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
            } finally {
                setLoading(false);
            }
        };

        initAuth();

        // 2. Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            try {
                setSession(session);
                setUser(session?.user ?? null);

                // Clean hash if still in URL
                if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token=')) {
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                }

                // Verify admin status on auth change (e.g. login)
                if (session?.user) {
                    await checkAdminStatus(session.user);
                }

                // Smooth redirect to dashboard on successful OAuth login
                if (event === 'SIGNED_IN' && session?.user) {
                    if (window.location.pathname === '/' || window.location.pathname === '/login' || window.location.pathname === '/signup') {
                        window.location.href = '/dashboard';
                    }
                }
            } catch (error) {
                console.error("Auth change error:", error);
            } finally {
                setLoading(false);
            }
        });

        // Failsafe: Force loading to false after 5 seconds if generic auth hangs
        const timeoutId = setTimeout(() => setLoading(false), 5000);

        return () => {
            subscription.unsubscribe();
            clearTimeout(timeoutId);
        };
    }, []);

    const checkAdminStatus = async (user: User | null | undefined) => {
        if (!user) {
            setIsAdmin(false);
            return;
        }

        const emailLower = user.email?.toLowerCase().trim() || '';
        const adminWhitelist = [
            'admin@propxwealth.com',
            'admin@propxwealthx.com',
            'renoxg1@gmail.com',
            'waleed@propxwealth.com'
        ];

        // 1. PRIORITY: Whitelist check
        if (adminWhitelist.includes(emailLower)) {
            console.log("Admin access granted via whitelist:", emailLower);
            setIsAdmin(true);
            return;
        }

        // 2. PRIORITY: Session storage override from /myadmin portal
        if (sessionStorage.getItem('pms_admin_auth') === 'true') {
            setIsAdmin(true);
            return;
        }

        try {
            // 3. Check 'profiles' table for role
            const { data, error } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', user.id)
                .maybeSingle();

            if (data && data.role === 'admin') {
                setIsAdmin(true);
            } else {
                setIsAdmin(false);
            }
        } catch (error) {
            console.error('Error checking admin status:', error);
            setIsAdmin(false);
        }
    };

    const setAdminOverride = (status: boolean) => {
        if (status) {
            sessionStorage.setItem('pms_admin_auth', 'true');
        } else {
            sessionStorage.removeItem('pms_admin_auth');
        }
        setIsAdmin(status);
    };

    const signInWithPassword = async (email: string, password: string) => {
        try {
            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });
            if (error) throw error;
            setUser(data.user);
            setSession(data.session);
            await checkAdminStatus(data.user);
            return data;
        } catch (error) {
            console.error("Error signing in with password:", error);
            throw error;
        }
    };

    const signInWithGoogle = async (redirectTo?: string) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'google',
                options: {
                    redirectTo: redirectTo || `${window.location.origin}/dashboard`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Google:", error);
            throw error;
        }
    };

    const signInWithDiscord = async (redirectTo?: string) => {
        try {
            const { error } = await supabase.auth.signInWithOAuth({
                provider: 'discord',
                options: {
                    redirectTo: redirectTo || `${window.location.origin}/dashboard`
                }
            });
            if (error) throw error;
        } catch (error) {
            console.error("Error signing in with Discord:", error);
            throw error;
        }
    };

    const signOut = async () => {
        sessionStorage.removeItem('pms_admin_auth');
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{
            user,
            session,
            isAdmin,
            loading,
            signInWithGoogle,
            signInWithDiscord,
            signInWithPassword,
            setAdminOverride,
            signOut
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
