import React, { useState } from 'react';
import { Save, Globe, Bell, Shield, Palette, Database, AlertTriangle } from 'lucide-react';

const Toggle: React.FC<{ checked: boolean; onChange: () => void; label: string; desc?: string }> = ({ checked, onChange, label, desc }) => (
    <div className="flex items-center justify-between p-4 bg-black/20 rounded-xl border border-white/5 hover:border-white/8 transition-colors">
        <div>
            <p className="text-white text-sm font-medium">{label}</p>
            {desc && <p className="text-xs text-white/40 mt-0.5">{desc}</p>}
        </div>
        <button
            onClick={onChange}
            className={'relative w-10 h-5 rounded-full transition-colors ' + (checked ? 'bg-yellow-400' : 'bg-white/10')}
        >
            <div className={'absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-all ' + (checked ? 'left-5' : 'left-0.5')} />
        </button>
    </div>
);

const Section: React.FC<{ icon: React.ElementType; title: string; children: React.ReactNode }> = ({ icon: Icon, title, children }) => (
    <div className="bg-[#111113] border border-white/5 rounded-2xl overflow-hidden">
        <div className="px-6 py-4 border-b border-white/5 flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center">
                <Icon size={16} className="text-yellow-400" />
            </div>
            <h3 className="text-white font-bold text-sm">{title}</h3>
        </div>
        <div className="p-6 space-y-4">{children}</div>
    </div>
);

const AdminSettingsPage: React.FC = () => {
    const [saved, setSaved] = useState(false);
    const [settings, setSettings] = useState({
        platformName: 'PROPxWEALTH',
        supportEmail: 'support@propxwealth.com',
        contactPhone: '',
        siteUrl: 'https://propxwealth.com',
        metaTitle: 'PROPxWEALTH - Best Prop Trading Firm Reviews',
        metaDesc: 'Discover and compare the best prop trading firms. Read reviews, compare challenges, and find the right funded trading program for you.',
        publicRegistrations: true,
        maintenanceMode: false,
        emailNotifications: true,
        reviewNotifications: true,
        payoutNotifications: true,
        firmApplicationNotifications: true,
        requireEmailVerification: false,
        allowGoogleLogin: true,
        allowDiscordLogin: true,
        twoFactorAdmin: false,
        darkMode: true,
        primaryColor: '#F0C41B',
    });

    const toggle = (key: keyof typeof settings) => {
        setSettings(s => ({ ...s, [key]: !s[key as keyof typeof settings] }));
    };

    const handleSave = () => {
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
    };

    return (
        <div className="flex flex-col gap-5 max-w-4xl">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-white tracking-tight">Platform Settings</h2>
                    <p className="text-white/40 text-xs mt-1">Configure global settings for PROPxWEALTH.</p>
                </div>
                <button
                    onClick={handleSave}
                    className={'flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm transition-all ' + (saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-400 text-black hover:bg-yellow-300')}
                >
                    <Save size={16} />
                    {saved ? 'Saved!' : 'Save Changes'}
                </button>
            </div>

            <Section icon={Globe} title="General Configuration">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                        { label: 'Platform Name', key: 'platformName', type: 'text' },
                        { label: 'Support Email', key: 'supportEmail', type: 'email' },
                        { label: 'Contact Phone', key: 'contactPhone', type: 'tel', placeholder: '+1 (555) 000-0000' },
                        { label: 'Site URL', key: 'siteUrl', type: 'url' },
                    ].map(({ label, key, type, placeholder }) => (
                        <div key={key} className="space-y-1.5">
                            <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">{label}</label>
                            <input
                                type={type}
                                value={(settings as any)[key]}
                                placeholder={placeholder}
                                onChange={e => setSettings(s => ({ ...s, [key]: e.target.value }))}
                                className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white placeholder-white/20 focus:border-yellow-400/40 focus:outline-none transition-colors"
                            />
                        </div>
                    ))}
                </div>
            </Section>

            <Section icon={Globe} title="SEO Configuration">
                <div className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Meta Title</label>
                        <input
                            type="text"
                            value={settings.metaTitle}
                            onChange={e => setSettings(s => ({ ...s, metaTitle: e.target.value }))}
                            className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400/40 focus:outline-none transition-colors"
                        />
                        <div className="text-[11px] text-white/30">{settings.metaTitle.length}/60 chars recommended</div>
                    </div>
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Meta Description</label>
                        <textarea
                            value={settings.metaDesc}
                            onChange={e => setSettings(s => ({ ...s, metaDesc: e.target.value }))}
                            rows={3}
                            className="w-full bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400/40 focus:outline-none transition-colors resize-none"
                        />
                        <div className="text-[11px] text-white/30">{settings.metaDesc.length}/160 chars recommended</div>
                    </div>
                </div>
            </Section>

            <Section icon={Shield} title="Access & Authentication">
                <div className="space-y-3">
                    <Toggle checked={settings.publicRegistrations} onChange={() => toggle('publicRegistrations')} label="Public Registrations" desc="Allow new users to create accounts via OAuth" />
                    <Toggle checked={settings.allowGoogleLogin} onChange={() => toggle('allowGoogleLogin')} label="Google Login" desc="Allow users to sign in with Google" />
                    <Toggle checked={settings.allowDiscordLogin} onChange={() => toggle('allowDiscordLogin')} label="Discord Login" desc="Allow users to sign in with Discord" />
                    <Toggle checked={settings.requireEmailVerification} onChange={() => toggle('requireEmailVerification')} label="Require Email Verification" desc="Users must verify email before accessing the platform" />
                    <Toggle checked={settings.twoFactorAdmin} onChange={() => toggle('twoFactorAdmin')} label="2FA for Admins" desc="Require two-factor authentication for admin accounts" />
                </div>
            </Section>

            <Section icon={Bell} title="Notification Preferences">
                <div className="space-y-3">
                    <Toggle checked={settings.emailNotifications} onChange={() => toggle('emailNotifications')} label="Email Notifications" desc="Receive email alerts for platform events" />
                    <Toggle checked={settings.reviewNotifications} onChange={() => toggle('reviewNotifications')} label="New Review Alerts" desc="Get notified when a new review is submitted" />
                    <Toggle checked={settings.payoutNotifications} onChange={() => toggle('payoutNotifications')} label="Payout Claim Alerts" desc="Get notified when a payout claim is submitted" />
                    <Toggle checked={settings.firmApplicationNotifications} onChange={() => toggle('firmApplicationNotifications')} label="Firm Application Alerts" desc="Get notified when a firm submits an application" />
                </div>
            </Section>

            <Section icon={Palette} title="Appearance">
                <div className="space-y-4">
                    <Toggle checked={settings.darkMode} onChange={() => toggle('darkMode')} label="Dark Mode" desc="Use dark theme across the platform" />
                    <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-white/50 uppercase tracking-wider">Brand Color</label>
                        <div className="flex items-center gap-3">
                            <input
                                type="color"
                                value={settings.primaryColor}
                                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                                className="w-12 h-10 rounded-xl border border-white/8 bg-transparent cursor-pointer"
                            />
                            <input
                                type="text"
                                value={settings.primaryColor}
                                onChange={e => setSettings(s => ({ ...s, primaryColor: e.target.value }))}
                                className="flex-1 bg-black/30 border border-white/8 rounded-xl px-4 py-2.5 text-sm text-white focus:border-yellow-400/40 focus:outline-none transition-colors font-mono"
                            />
                        </div>
                    </div>
                </div>
            </Section>

            <Section icon={Database} title="Platform Controls">
                <div className="space-y-3">
                    <Toggle checked={settings.maintenanceMode} onChange={() => toggle('maintenanceMode')} label="Maintenance Mode" desc="Disable public access to the site (admins still have access)" />
                </div>
                {settings.maintenanceMode && (
                    <div className="mt-4 flex items-start gap-3 p-4 bg-orange-400/10 border border-orange-400/20 rounded-xl">
                        <AlertTriangle size={16} className="text-orange-400 flex-shrink-0 mt-0.5" />
                        <div className="text-xs text-orange-400">
                            <div className="font-bold mb-1">Maintenance Mode Active</div>
                            <div className="text-orange-400/70">The site is currently offline for regular visitors. Only admins can access the platform.</div>
                        </div>
                    </div>
                )}
            </Section>

            <div className="flex justify-end">
                <button
                    onClick={handleSave}
                    className={'flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold text-sm transition-all ' + (saved ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-yellow-400 text-black hover:bg-yellow-300')}
                >
                    <Save size={16} />
                    {saved ? 'All Changes Saved!' : 'Save Changes'}
                </button>
            </div>
        </div>
    );
};

export default AdminSettingsPage;