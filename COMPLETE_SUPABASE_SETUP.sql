-- =====================================================================
-- COMPLETE SUPABASE MASTER MIGRATION & DATA RESTORATION SCRIPT
-- RUN THIS ENTIRE SCRIPT IN YOUR NEW SUPABASE SQL EDITOR
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. PROFILES TABLE & AUTH TRIGGER
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT,
    full_name TEXT,
    role TEXT DEFAULT 'trader' CHECK (role IN ('trader', 'firm_owner', 'admin')),
    status TEXT DEFAULT 'active',
    avatar_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON public.profiles;
CREATE POLICY "Public profiles are viewable by everyone"
ON public.profiles FOR SELECT
USING (true);

DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
CREATE POLICY "Users can update their own profile"
ON public.profiles FOR UPDATE
USING (auth.uid() = id);

DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
CREATE POLICY "Users can insert their own profile"
ON public.profiles FOR INSERT
WITH CHECK (auth.uid() = id);

-- Automatic Profile Creation Trigger on Auth Signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        new.id,
        new.email,
        COALESCE(new.raw_user_meta_data->>'full_name', ''),
        COALESCE(new.raw_user_meta_data->>'role', 'trader')
    )
    ON CONFLICT (id) DO UPDATE SET
        email = EXCLUDED.email,
        full_name = EXCLUDED.full_name;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();

-- 3. FIRMS TABLE
CREATE TABLE IF NOT EXISTS public.firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    website TEXT,
    affiliate_link TEXT,
    logo_url TEXT,
    rating NUMERIC DEFAULT 4.5,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    description TEXT,
    founded_year TEXT,
    hq_location TEXT,
    profit_split TEXT,
    scaling_plan TEXT,
    platforms TEXT[] DEFAULT '{}',
    payment_methods TEXT[] DEFAULT '{}',
    max_funding TEXT,
    scaling BOOLEAN DEFAULT true,
    payout_frequency TEXT,
    news_trading BOOLEAN DEFAULT false,
    weekend_holding BOOLEAN DEFAULT false,
    ea_allowed BOOLEAN DEFAULT false,
    free_trial BOOLEAN DEFAULT false,
    refund_policy TEXT,
    min_trading_days TEXT,
    max_daily_drawdown TEXT,
    max_overall_drawdown TEXT,
    discount_code TEXT DEFAULT 'WEALTHX',
    avg_payout_time TEXT,
    payout_percentage NUMERIC DEFAULT 95,
    last_30_days_payouts TEXT,
    payout_growth TEXT,
    drawdown TEXT,
    leverage TEXT,
    tags TEXT[] DEFAULT '{}',
    favicon TEXT,
    scaling_plan_details TEXT,
    show_in_hero BOOLEAN DEFAULT false,
    trading_type TEXT DEFAULT 'forex',
    rules_url TEXT
);

ALTER TABLE public.firms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Firms viewable by everyone" ON public.firms;
CREATE POLICY "Firms viewable by everyone" ON public.firms FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can modify firms" ON public.firms;
CREATE POLICY "Admins can modify firms" ON public.firms FOR ALL USING (true) WITH CHECK (true);

-- 4. CHALLENGES TABLE
CREATE TABLE IF NOT EXISTS public.challenges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    account_size TEXT,
    price TEXT,
    profit_target TEXT,
    daily_drawdown TEXT,
    max_drawdown TEXT,
    min_trading_days TEXT,
    max_leverage TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    challenge_type TEXT DEFAULT '2-Step'
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Challenges viewable by everyone" ON public.challenges;
CREATE POLICY "Challenges viewable by everyone" ON public.challenges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can modify challenges" ON public.challenges;
CREATE POLICY "Admins can modify challenges" ON public.challenges FOR ALL USING (true) WITH CHECK (true);

-- 5. REVIEWS TABLE
CREATE TABLE IF NOT EXISTS public.reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    user_name TEXT,
    rating NUMERIC NOT NULL,
    comment TEXT,
    status TEXT DEFAULT 'approved',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    user_id UUID
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Reviews viewable by everyone" ON public.reviews;
CREATE POLICY "Reviews viewable by everyone" ON public.reviews FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert review" ON public.reviews;
CREATE POLICY "Anyone can insert review" ON public.reviews FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can modify reviews" ON public.reviews;
CREATE POLICY "Admins can modify reviews" ON public.reviews FOR ALL USING (true) WITH CHECK (true);

-- 6. BLOG_POSTS TABLE
CREATE TABLE IF NOT EXISTS public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT NOT NULL UNIQUE,
    excerpt TEXT,
    content TEXT NOT NULL,
    cover_image TEXT,
    category TEXT DEFAULT 'General',
    tags TEXT[] DEFAULT '{}',
    author TEXT DEFAULT 'PROPxWEALTH',
    read_time INTEGER DEFAULT 5,
    meta_title TEXT,
    meta_description TEXT,
    status TEXT DEFAULT 'published',
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Blog posts viewable by everyone" ON public.blog_posts;
CREATE POLICY "Blog posts viewable by everyone" ON public.blog_posts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage blog posts" ON public.blog_posts;
CREATE POLICY "Admins can manage blog posts" ON public.blog_posts FOR ALL USING (true) WITH CHECK (true);

-- 7. COMPETITIONS TABLE
CREATE TABLE IF NOT EXISTS public.competitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE SET NULL,
    firm_name TEXT,
    title TEXT NOT NULL,
    description TEXT,
    prize_pool TEXT,
    entry_fee TEXT,
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    join_url TEXT,
    image_url TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    tasks JSONB DEFAULT '[]'::jsonb
);

ALTER TABLE public.competitions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Competitions viewable by everyone" ON public.competitions;
CREATE POLICY "Competitions viewable by everyone" ON public.competitions FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage competitions" ON public.competitions;
CREATE POLICY "Admins can manage competitions" ON public.competitions FOR ALL USING (true) WITH CHECK (true);

-- 8. TRUST_BADGES TABLE
CREATE TABLE IF NOT EXISTS public.trust_badges (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    badge_type TEXT NOT NULL,
    issued_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.trust_badges ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Trust badges viewable by everyone" ON public.trust_badges;
CREATE POLICY "Trust badges viewable by everyone" ON public.trust_badges FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage badges" ON public.trust_badges;
CREATE POLICY "Admins can manage badges" ON public.trust_badges FOR ALL USING (true) WITH CHECK (true);

-- 9. OFFERS TABLE
CREATE TABLE IF NOT EXISTS public.offers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    code TEXT,
    discount TEXT,
    expiry_date TIMESTAMPTZ,
    verified BOOLEAN DEFAULT true,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.offers ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Offers viewable by everyone" ON public.offers;
CREATE POLICY "Offers viewable by everyone" ON public.offers FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage offers" ON public.offers;
CREATE POLICY "Admins can manage offers" ON public.offers FOR ALL USING (true) WITH CHECK (true);

-- 10. REWARDS TABLE
CREATE TABLE IF NOT EXISTS public.rewards (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    description TEXT,
    cost INTEGER DEFAULT 0,
    image_url TEXT,
    code TEXT,
    status TEXT DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.rewards ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Rewards viewable by everyone" ON public.rewards;
CREATE POLICY "Rewards viewable by everyone" ON public.rewards FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage rewards" ON public.rewards;
CREATE POLICY "Admins can manage rewards" ON public.rewards FOR ALL USING (true) WITH CHECK (true);

-- 11. SAVED_FIRMS (Favorites)
CREATE TABLE IF NOT EXISTS public.saved_firms (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, firm_id)
);

ALTER TABLE public.saved_firms ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users can see own saved firms" ON public.saved_firms;
CREATE POLICY "Users can see own saved firms" ON public.saved_firms FOR ALL USING (auth.uid() = user_id);

-- 12. CLICKS TABLE (Tracking)
CREATE TABLE IF NOT EXISTS public.clicks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE SET NULL,
    page_source TEXT,
    user_id UUID,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.clicks ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can record clicks" ON public.clicks;
CREATE POLICY "Anyone can record clicks" ON public.clicks FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Admins can view clicks" ON public.clicks;
CREATE POLICY "Admins can view clicks" ON public.clicks FOR SELECT USING (true);

-- 13. PAYOUTS TABLE
CREATE TABLE IF NOT EXISTS public.payouts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    firm_id UUID REFERENCES public.firms(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    currency TEXT DEFAULT 'USD',
    status TEXT DEFAULT 'pending',
    trader_name TEXT,
    payout_date TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.payouts ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Payouts viewable by everyone" ON public.payouts;
CREATE POLICY "Payouts viewable by everyone" ON public.payouts FOR SELECT USING (true);
DROP POLICY IF EXISTS "Admins can manage payouts" ON public.payouts;
CREATE POLICY "Admins can manage payouts" ON public.payouts FOR ALL USING (true) WITH CHECK (true);

-- 14. BACKTEST SESSIONS & TRADES
CREATE TABLE IF NOT EXISTS public.backtest_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    session_type TEXT DEFAULT 'BACKTEST',
    initial_balance NUMERIC DEFAULT 10000,
    current_balance NUMERIC DEFAULT 10000,
    pair TEXT DEFAULT 'EURUSD',
    start_date TIMESTAMPTZ,
    end_date TIMESTAMPTZ,
    challenge_rules JSONB,
    challenge_status JSONB,
    notes TEXT,
    last_replay_time NUMERIC,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.backtest_sessions ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Users manage own backtest sessions" ON public.backtest_sessions;
CREATE POLICY "Users manage own backtest sessions" ON public.backtest_sessions FOR ALL USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.backtest_trades (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    backtest_session_id UUID REFERENCES public.backtest_sessions(id) ON DELETE CASCADE,
    pair TEXT,
    type TEXT,
    entry_price NUMERIC,
    exit_price NUMERIC,
    size NUMERIC,
    pnl NUMERIC,
    entry_date TIMESTAMPTZ,
    exit_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.backtest_trades ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Trades viewable via backtest session" ON public.backtest_trades;
CREATE POLICY "Trades viewable via backtest session" ON public.backtest_trades FOR ALL USING (true);

-- =============================================
-- DATA FOR FIRMS (13 rows)
-- =============================================
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('bde6adeb-d179-44a3-8366-5e97b39c6119', 'ATS FUNDED', 'https://app.atsfunded.com/rc/d9nquw5b', 'https://app.atsfunded.com/rc/d9nquw5b', 'https://atsfunded.com/logo.png', 4.7, 'active', '2026-01-18T19:37:57.171061+00:00', 'ATS Funded is a crypto-focused prop firm backed by the STP regulated broker Pure Market, providing institutional-grade execution and market access.
The firm offers trading on 200+ cryptocurrency pairs, alongside forex, indices, commodities, and metals, through ATS Terminal and MetaTrader 5.
ATS Funded is the only proprietary trading firm to offer a 1% fixed monthly salary, combined with a transparent, merit-based funding and scaling system supported by defined risk management rules.', '2025', 'Panama', 'Upto 90%', 'true', '{"ATS TERMINAL","MT5(coming soon)"}', NULL, '400000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'SPOT', '40 Minutes', 100, '$26,231', '+12%', '10%', '1:100', '{"Crypto"}', 'https://consumersiteimages.trustpilot.net/business-units/690b30169f77e13c6edd7b07-198x149-2x.avif', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('58f5e229-9a56-4632-89be-2abd266b7457', 'FundingPips', 'https://www.fundingpips.com/en', 'https://www.fundingpips.com/en', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTWWVI4Lua_yqgBsbuPaozKUFRaISh376drdg&s', 4.5, 'active', '2026-01-10T13:13:53.28567+00:00', '  FundingPips is a global prop trading firm providing flexible funding models that help traders scale with real capital and transparent rules', '2022', 'Dubai', 'Upto 90%', 'true', '{"Mt4","mt5","tradelocker","ctrader"}', NULL, '200000', false, NULL, true, true, true, false, NULL, NULL, NULL, NULL, '', '12 Hours', 95, '$4.2M+', '+12%', '10%', '1:100', '{}', 'https://media.propfirmmatch.com/system/b5filxasbwwrg110uhxvgv4v/675854fe6df8f98dc09b6caf_FundingPips-Logotype.svg', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('d024b25c-7f60-4bff-9e7c-62c8be18bdd9', 'GoatFundedTrader', 'https://app.goatfundedtrader.com/', 'https://app.goatfundedtrader.com/', 'https://downloads.intercomcdn.com/i/o/409973/020a02dd3d98303ff284f0d7/f38abb2fc74e98d5be348d22282330a9.png', 4, 'active', '2026-01-12T12:59:31.156455+00:00', '...Goat Funded Trader (GFT) is a proprietary trading firm that provides traders with access to large simulated accounts (up to $2M) to trade Forex, stocks, crypto, and ETFs, offering flexible models, up to ', '2022', 'Hongkong', 'Up to 90%', 'true', '{"Matchtrader","Mt5","mt4","ctrader","volumetrica"}', NULL, '200000', false, 'Bi-Weekly', true, true, true, false, '', '', '', '', '', '12 Hours', 95, '$4.2M+', '+12%', '10%', '1:100', '{}', 'https://media.propfirmmatch.com/system/snpmynmfec5dmk6z5i00vtci/66a38d8804221b2cebdada78_IMG_9711.png', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('7d9d5712-52f0-494c-a1f8-6e126e0cf836', 'Funded Next', 'https://fundednext.com/', 'https://fundednext.com/', 'https://fundednext.com/_next/image?url=https%3A%2F%2Fdirslur24ie1a.cloudfront.net%2Ffundednext%2FFundednext%20logo_White%20(1).png&w=384&q=75', 4.5, 'active', '2026-02-17T16:03:39.175446+00:00', 'FundedNext, based in the United Arab Emirates and established in March 2022, is a CFD proprietary trading firm offering 1 Step, 2 Steps and Instant programs. The 1-Step evaluation provides a 10% or 25% profit target option; the 2-Step evaluation offers either 8% then 5% or 10% then 5% targets, with maximum total drawdown limits ranging from 6% to 10%. Account sizes range from $6,000 to $200,000. Supported platforms include MT5, cTrader, Match Trader and MT4. Tradable instruments include Forex (e.g., EURUSD, GBPJPY), precious metals (XAGUSD, XAUUSD) and indices (AUS200, GER30, SPX500). The firm has a 4.4/5 review score from 694 reviews. The firm provides a set of structured evaluation paths and market access for traders.', '2022', 'Dubai , UAE', 'UPTO 90%', 'true', '{"Mt4","mt5","match trader","ctrader"}', NULL, '300000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'SPOT', '6 Hours', 72, '$200M+', '+23%', '10%', '1:100', '{}', 'https://media.propfirmmatch.com/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/qhbxdzpcco86uuzxsc9yp8v2/Firm=FundedNext,_Category=Prop_Firm.svg', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('b6783837-c110-413d-9260-d1d207ef87f3', 'Nexgen ProTrader Funding', 'https://nexgenprotraderfunding.com/', 'https://nexgenprotraderfunding.com/', 'http://zainenterprisespakistan.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-03-at-7.48.14-PM.jpeg', 4.7, 'active', '2026-01-28T12:37:06.176465+00:00', 'Founded in 2024 and headquartered in Sarasota, Florida (USA), NexGen Pro Trader Funding is a futures-focused proprietary trading firm designed for traders who value transparency, fast payouts, and broad platform flexibility. The firm provides high-leverage access to futures markets while maintaining clearly defined rules and a trader-friendly payout structure.

NexGen offers a structured profit-split model. During the first 60 trading days, payouts are capped as per schedule. Traders then receive a 90% profit split up to the 16th payout, and 100% profit split after the 16th payout, making it one of the more competitive long-term payout models in the industry. Average payout times are fast, with PayPal payouts processed within hours, wire transfers overnight, and ACH payouts taking 4–5 business days for the first payout, then overnight thereafter. In the last 30 days alone, NexGen has paid out $91,899, with monthly payout growth ranging between 150%–250%.

The firm supports an extensive list of trading platforms, including TradingView as its primary platform, along with Sierra Chart (Denali data required), CQG (browser and desktop), MultiCharts, Bookmap, Jigsaw, MotiveWave, GoCharting, and several others.

Traders can manage up to 10 evaluation accounts and 5 funded $150K accounts, with higher limits available after 60 trading days on a case-by-case basis. News trading is allowed on evaluation accounts, while red-flag news trading is restricted on semi-live accounts. Overnight and weekend holding is not permitted.

With a 4.7 Trustpilot rating, organic trader reviews, and a strong payout record, NexGen Pro Trader Funding positions itself as a reliable and growing futures prop firm.', '2024', 'Sarasota FL USA', '90%', 'true', '{"Sierra Chart - requires Denali data to be purchased from them in order to use Sierra/CQG","CQG- browser and desktop versions","Multi Charts","Bluewater  Agenda Trader","ZlanTrader","AdvancedTS","MotiveWave","Book Map","Jigsaw","Linn Soft","Rocket Scooter","Go Charting"}', NULL, '200000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, '', '12 Hours', 95, '$4.2M+', '+12%', '10%', '1:100', '{"Futures"}', 'http://zainenterprisespakistan.com/wp-content/uploads/2026/02/WhatsApp-Image-2026-02-03-at-7.48.14-PM.jpeg', 'Yes (every 3 months)', true, 'futures', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('b421c2d7-d288-4fdc-a789-957e5f2e8883', 'Klein Funded', 'https://kleinfunding.com/', 'https://kleinfunding.com/', 'https://kleinfunding.com/@repo/uploads/img/f7003fbd03aaf5fbf0d5672ff48f3f1a.png', 4.5, 'active', '2026-02-17T16:13:39.105501+00:00', 'Klein Funding is a newer, crypto-native prop firm launched in late 2024 and registered in London, UK. It occupies a completely different niche — everything runs through Bybit, making it the first crypto prop firm to officially partner with that exchange. Rather than forex or indices, traders access 700+ crypto pairs with leverage up to 1:100, zero spreads, and near-zero commissions. It offers 1-Step, 2-Step, 3-Step, and Instant Pro programs, with customizable drawdown (6–14%) and profit splits from 40% up to 100%. Funded accounts go up to $200K (with Instant Pro scaling to $2M). Payouts are notably fast — often within 12–24 hours — and the support team is consistently praised across Trustpilot and Discord. It won the FundedTrading "Best Crypto Prop Firm 2025" award despite being barely a year old. The tradeoff: it''s newer, the website has had stability issues, and long-term payout consistency is still being proven. It''s best suited to experienced crypto traders, not forex-focused ones.', '2023', 'London , UK', '40-100 Customizable', 'true', '{}', NULL, '200000', false, NULL, true, true, true, false, NULL, NULL, NULL, NULL, 'SPOT', '12 Hours', 95, '$9.2M+', '+12%', '6-14%', '1:100', '{}', 'https://media.propfirmmatch.com/system/xta5h2hxgneomd5a1etp370g/677e807215048a8bbd8f576d_I0gPh4QX_400x400-(3)_processed.png', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('e33c3634-2f7f-47ee-818d-2e0eb6adfafa', 'EverCrest Funding', 'https://evercrestfunding.com/', 'https://evercrestfunding.com/', 'https://consumersiteimages.trustpilot.net/business-units/697265b7fb05178b81d8e8e6-198x149-2x.avif', 4.4, 'active', '2026-03-02T11:54:29.376203+00:00', 'Evercrest Funding is a proprietary trading firm designed for skilled traders. We seek consistently profitable individuals who can adapt to market conditions, manage risk effectively, and execute a disciplined trading strategy.', '2022', 'Dubai , UAE', 'UPTO 90%', 'true', '{"MT5"}', NULL, '200000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'SPOT', '15 Hours', 95, '$5.6M+', '+32%', '10%', '1:100', '{}', 'https://consumersiteimages.trustpilot.net/business-units/697265b7fb05178b81d8e8e6-198x149-2x.avif', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('90650081-ea93-4bf1-88cb-bdffdd97078d', 'FunderBlu', 'https://funderblu.com/', 'https://funderblu.com/', 'https://consumersiteimages.trustpilot.net/business-units/691b1057b88d4a1a5dce05ed-198x149-2x.avif', 4.7, 'active', '2026-03-12T14:19:29.978633+00:00', 'Funderblu — A Prop Firm That Puts Traders First At Funderblu, our goal is simple: give traders a fair, fast, and transparent path to real funding. Our Evaluation Models are built to be clear, affordable, and beginner-friendly, while still giving experienced traders the flexibility they need. Choose from our streamlined 1-Step, 2-Step, or our premium Funderblu Prime model — all designed to help you scale with confidence. We’re known for our same-day payouts, responsive support, and a ruleset that keeps trading simple. Earn up to 100% reward split, access up to $300,000 simulated capital, and scale all the way to a Million Dollars through our clean, transparent scaling plan. No hidden rules. No payout delays. No headaches. Just a prop firm built on trust, clarity, and trader success. Funderblu — where traders feel supported, respected, and treated fairly.', '2022', 'FunderBlu Company Limited 78933601 Unit 2A, 17/F, Glenealy Tower, No.1, Hong Kong', 'UPTO 90%', 'true', '{"MT5","cTrader","Match Trader","TradLocker"}', NULL, '200000', false, NULL, true, true, true, false, NULL, NULL, NULL, NULL, 'SPOT', '12 Hours', 95, '$2.2M+', '+32%', '10%', '1:100', '{}', 'https://consumersiteimages.trustpilot.net/business-units/691b1057b88d4a1a5dce05ed-198x149-2x.avif', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('df65dd71-85a2-4444-ba12-c9c8b0b61d79', 'PropShop Trader', 'https://propshoptrader.com/', 'https://propshoptrader.com/', 'https://pbs.twimg.com/profile_images/1772208321203744768/qfakWkZD_400x400.jpg', 4.3, 'active', '2026-03-19T09:27:48.230656+00:00', 'PropShopTrader is a multi-asset proprietary trading firm offering stock and futures evaluations. Build consistency, meet benchmarks, and transition to real Rewards', '2023', 'Panama City, Panama', 'Upto 90%', 'true', '{"TickBlaze"}', NULL, '200000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'SPOT', '12 Hours', 95, '$8.2M+', '+62%', '10%', '1:100', '{"Futures"}', 'https://pbs.twimg.com/profile_images/1772208321203744768/qfakWkZD_400x400.jpg', 'Yes (every 3 months)', true, 'futures', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('e7024fb0-5406-4d7c-a8cb-bdf1ca165df8', 'Aqua Funded', 'https://www.aquafunded.com/', 'https://www.aquafunded.com/', 'https://consumersiteimages.trustpilot.net/business-units/655d05de4566964946df0d80-198x149-1x.avif', 4.5, 'active', '2026-05-28T19:41:01.098126+00:00', 'At Aqua Funded, we pride ourselves on being a leading prop firm dedicated to transforming trader’s aspirations into reality. With a commitment to transparency and unwavering support, we provide funded accounts, empowering individuals to navigate the financial markets with confidence. Join our community where expertise meets opportunity, and together, we chart a course to financial success.
', '2024', 'UAE', 'UPTO 90%', 'false', '{"MT5"}', NULL, '400000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'NOBLE', '12 Hours', 95, '$9.2M+', '+12%', '10%', '1:100', '{}', 'https://consumersiteimages.trustpilot.net/business-units/655d05de4566964946df0d80-198x149-1x.avif', 'Yes (every 3 months)', true, 'forex', 'https://help.aquafunded.com/en/?_gl=1*140lwqv*_gcl_au*MTIwMjE3NTMwOC4xNzc5OTk2OTU2') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('ab1bfda6-9a70-4a5a-9930-67a157625516', 'Elysium Forex', 'https://elysiumforex.com/', 'https://elysiumforex.com/', 'https://marvicosmetics.com/wp-content/uploads/2026/03/Black-and-Gold-Minimalist-Real-Estate-Logo-3.png', 4.7, 'active', '2026-03-26T04:19:37.904532+00:00', '💼 Elysium Forex – Trust. Transparency. Guaranteed Payouts. Welcome to Elysium Forex, where integrity isn’t just a word — it’s the foundation of everything we do. At Elysium Forex, we understand that in the world of trading, trust is earned through consistent performance, transparent communication, and above all, honoring every single commitment we make. That’s why we’ve built our reputation on one simple promise: you will always get paid. On time. Without hassle. Without exceptions. ✅ 100% Guaranteed Payouts – No Delays', '2025', 'USA', 'UPTO 90%', 'false', '{"Match Trader","cTrader","DXTrade"}', NULL, '1000000', false, NULL, false, true, true, false, NULL, NULL, NULL, NULL, 'SPOT', '4 Hours', 90, '$1.6M+', '+18%', '10%', '1:50', '{}', 'https://marvicosmetics.com/wp-content/uploads/2026/03/Black-and-Gold-Minimalist-Real-Estate-Logo-3.png', 'Yes (every 3 months)', true, 'forex', NULL) ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('9e798275-05b6-45b4-9ffb-4267c899c306', 'Sure Leverage Funding', 'https://sureleveragefunding.com/', 'https://sureleveragefunding.com/', 'https://assets.tradelocker.com/hub/sureleverage-png-logo-100-100.png', 4.4, 'active', '2026-07-20T10:56:03.656709+00:00', 'Founded in 2023, Sure Leverage is a forward-thinking proprietary trading firm committed to empowering traders through flexible funding programs and accessible capital.

With a range of challenge types, up to 100% profit splits, and no time limits on most programs, we provide traders the freedom to grow at their own pace. Our platform supports a wide range of strategies and trading styles, backed by fast payouts and reliable support.

At Sure Leverage, our mission is to create real opportunities for traders to prove their skills and succeed in the markets.', '2023', 'UAE', '100%', 'true', '{"MT5","TRADELOCKER"}', NULL, '400000', false, NULL, false, false, true, false, NULL, NULL, NULL, NULL, 'NOBLE', '12 Hours', 95, '$4.2M+', '+12%', '10%', '1:100', '{}', 'https://assets.tradelocker.com/hub/sureleverage-png-logo-100-100.png', 'Yes (every 3 months)', true, 'forex', 'https://help.sureleveragefunding.com/en/') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.firms (id, name, website, affiliate_link, logo_url, rating, status, created_at, description, founded_year, hq_location, profit_split, scaling_plan, platforms, payment_methods, max_funding, scaling, payout_frequency, news_trading, weekend_holding, ea_allowed, free_trial, refund_policy, min_trading_days, max_daily_drawdown, max_overall_drawdown, discount_code, avg_payout_time, payout_percentage, last_30_days_payouts, payout_growth, drawdown, leverage, tags, favicon, scaling_plan_details, show_in_hero, trading_type, rules_url) VALUES ('550fbeba-1aa6-4104-af29-0f67fed29fd2', 'Goat Funded Futures', 'https://goatfundedfutures.com/', 'https://goatfundedfutures.com/', 'https://media.propfirmmatch.com/cdn-cgi/image/width=110,quality=85,format=auto/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/tvn5lrpvoypvywtvtia1dple/bzo2uxppu0h141l99zzkl1a5.svg', 4.7, 'active', '2026-07-17T16:14:32.309456+00:00', 'Goat Funded Futures, established in November 2024 and based in Hong Kong, offers futures trading programs through 1 Step and Instant evaluation pathways. The firm supports a comprehensive range of trading platforms including TradingView, Tickblaze, Quantower, Tradovate, Volumetrica Trading, NinjaTrader, ATAS Orderflow Trading, Deepmap, and Deepcharts. With a review score of 4.4 out of 5 based on 24 reviews, Goat Funded Futures positions itself as a newer entrant in the prop trading sector focused exclusively on futures markets with multiple platform options for traders.', '2025', 'HK', '90%', 'true', '{"DEEPCHARTS","TRADEOVATE","ATAS","NINJATRADER"}', NULL, '750000', false, NULL, true, false, true, false, NULL, NULL, NULL, NULL, 'NOBLE', '12 Hours', 95, '$6.2M+', '+12%', 'EOD', '1:100', '{}', 'https://media.propfirmmatch.com/cdn-cgi/image/width=110,quality=85,format=auto/user_2s2hlBXYjq3Z0JvbQ39DazaaarZ/tvn5lrpvoypvywtvtia1dple/bzo2uxppu0h141l99zzkl1a5.svg', 'Yes (every 3 months)', false, 'futures', 'https://help.goatfundedfutures.com/en/') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR CHALLENGES (12 rows)
-- =============================================
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('df8f0fd1-2c44-441a-b1fd-149ee905cf5d', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', '2-Step Evaluation', '$10,000', '$99', '8%', '5%', '10%', '5', NULL, '2026-03-14T08:12:24.014775+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('6b49525b-89a4-4c89-8e4b-b36c309730df', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', '1-Step Evaluation', '$10,000', '$49', '8%', '5%', '10%', '5', NULL, '2026-03-14T08:12:24.014775+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('a19d2b3e-19c7-4330-8dec-9158abc4dce1', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '2-Step Evaluation', '$10,000', '$59', '8%+5%', '5%', '10%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('e525de36-c429-472f-8d1a-3909db16778a', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '2 Step', '$25,000', '$159', '8%+5%', '5%', '10%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('ea3bf6dc-8935-4bdc-84e7-2e8b7340609d', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '2 Step', '$50,000', '$309', '8%+5%', '5%', '10%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('0694f824-eab5-43e5-bd7e-e1be08519e59', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '2 Step', '$100,000', '$629', '8%+5%', '5%', '10%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('d37655ac-38d8-4629-a8a5-b1fa4af77d9a', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '2 Step', '$200,000', '$1,249', '8%+5%', '5%', '10%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '2-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('a8a57fa8-5cf0-4b56-b65d-0ce9eb66f8b1', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '1-Step Evaluation', '$10,000', '$99', '10%', '4%', '7%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('b9aa10f9-19f8-44c1-b870-4041f96840c7', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '1-Step Evaluation ', '$25,000', '$219', '10%', '4%', '7%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('ec386a75-de81-4ddf-9e8d-b4ce3ed6240e', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '1-Step Evaluation', '$100,000', '$699', '10%', '4%', '7%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('1226a72d-b04b-4430-ac4d-e5676f1bbf81', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '1-Step Evaluation', '$50,000', '$399', '10%', '4%', '7%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.challenges (id, firm_id, name, account_size, price, profit_target, daily_drawdown, max_drawdown, min_trading_days, max_leverage, created_at, challenge_type) VALUES ('4457e499-4da0-4a5c-a74d-b5a38bc7e8e8', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '1-Step Evaluation', '$200,000', '$1,499', '10%', '4%', '7%', '5', NULL, '2026-03-14T08:12:30.724927+00:00', '1-Step') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR REVIEWS (72 rows)
-- =============================================
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('3423cb35-10cf-4536-92a2-127e4b061351', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 4, 'I received my first payout via Deel within 24 hours. Incredible speed!', 'approved', '2026-03-08T05:37:01.929238+00:00', '7a2c322c-230c-49d5-8143-2e4ac0cf5721') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('0d712d44-68d3-4838-bc47-a8309c9ea040', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-01-26T22:56:00.4892+00:00', '924f2d10-d05e-4161-975c-72554e3b3155') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('457d28b6-5c63-4391-9151-582990058238', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-01-20T08:40:57.434674+00:00', '1ff0209d-aafe-49fa-8615-f4088fc24d58') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('b108d948-9546-4270-990c-eba1ec832d31', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'Been trading with them for 6 months, zero issues with withdrawals. Fast processing too.', 'approved', '2026-03-14T02:00:04.572539+00:00', '2351792c-55c0-4f7e-b6a3-8ec57000e4c7') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('3cb4d62f-d09e-455e-907a-3910ae32cead', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-22T19:06:37.533495+00:00', '2105feff-d7ce-471d-b02b-99b227407cb0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('0a6e3248-f0ba-4502-a2f5-2b24712bc425', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-02-03T04:37:22.498027+00:00', '65fbf64f-046f-496d-8981-7331057f6ab0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('e2b1c640-ae6d-480a-8cb5-b4663c703980', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 5, 'Customer support is top notch, highly recommended! They answered all my questions.', 'approved', '2026-03-04T10:39:13.700052+00:00', '2105feff-d7ce-471d-b02b-99b227407cb0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('23e1019a-5175-4683-a862-ed0f35778092', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 4, 'Very transparent and trustworthy. I gladly recommend them to any serious trader.', 'approved', '2026-02-25T20:13:24.906433+00:00', '1d93ea14-66df-46d5-8eee-db292c292d98') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('246a0f18-981c-4510-b70d-dd09b386aad8', 'bde6adeb-d179-44a3-8366-5e97b39c6119', NULL, 4, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-03-06T16:10:31.310011+00:00', '613b1df3-00d4-44aa-bbd9-eea4fcf9fac5') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('ccdd809b-e75f-4ac5-a201-a02f005e9b5c', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 4, 'Very transparent and trustworthy. I gladly recommend them to any serious trader.', 'approved', '2026-02-14T05:46:38.353019+00:00', '5f080051-cbeb-4d02-8a16-2c6047c945e9') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('5185cf2d-4a19-4c10-8671-645dbb2c1230', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-02-12T12:43:17.302075+00:00', '6277f03c-1d76-463d-ba8f-4c9b5ded7077') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('ead4ea54-0c95-468b-80e4-9c1a58856a47', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-02-18T09:24:29.971414+00:00', 'ebf75299-1c9b-4f18-beaf-e99da7a34c87') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('930bc89c-1c35-4939-8ea6-c793278a1d2a', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-02-20T20:07:12.855177+00:00', 'd272a11e-6aa3-4683-840b-933ac712e61a') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('d011a9db-c06e-4787-8c44-f1bf9e45066d', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 4, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-03-16T12:49:41.581815+00:00', '7db8ad49-b3f4-425d-8c21-bf490a9961b5') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('ffc53973-4630-4a27-b6f2-4ea4b23708a7', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-02-11T18:15:45.30182+00:00', 'd769e7fa-ff2d-492a-abb3-4cd9e08661f7') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('08383f5e-f6b5-44bb-8457-f11be1d40255', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 4, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-02-12T03:47:10.675496+00:00', '50bd129f-69c7-4112-9ce5-f496b0152dee') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('87379333-c55d-44a2-adb5-108c1b40482a', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-09T14:33:05.277974+00:00', '696353ca-9f86-42bb-be80-3d8b070852e8') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('c0e3829d-b564-4588-9c98-b6e754cd9da3', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-02-28T19:03:44.66058+00:00', 'dfa81d84-de23-447d-aa64-5478b3aa99ae') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('b29cbc43-6a22-445b-a65b-75ce1b9af531', '58f5e229-9a56-4632-89be-2abd266b7457', NULL, 5, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-02-26T15:57:27.963598+00:00', '6235ee92-84c8-462b-a35c-a7e782be8ad1') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('5a0c9f1c-46bd-4b86-a762-f8b54adb5609', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 4, 'Slightly strict drawdown rules but it makes you a much better and disciplined trader.', 'approved', '2026-02-19T19:19:37.133598+00:00', '2beaf983-a7ca-486b-8d88-e2b9c37a338e') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('5911c489-e5fd-4019-a875-02bab10419eb', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 4, 'Been trading with them for 6 months, zero issues with withdrawals. Fast processing too.', 'approved', '2026-02-26T22:52:27.166498+00:00', '1ff0209d-aafe-49fa-8615-f4088fc24d58') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('5c830602-7aea-4787-8fd3-3d3c8de6531b', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 5, 'One of the best prop firms in the industry right now. Highly trustworthy.', 'approved', '2026-03-18T00:56:32.325386+00:00', 'f979946a-364a-487a-962f-809c145fb211') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('96fc454a-7851-4fd2-bc3c-2aef73cdefba', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 5, 'Slightly strict drawdown rules but it makes you a much better and disciplined trader.', 'approved', '2026-01-31T19:06:21.053772+00:00', 'd687c376-8eb6-4254-a0ad-2c8e61b857c4') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('1b4d714b-d958-404c-b897-f24e65b5fbb6', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-03-01T20:15:30.967964+00:00', '49eb8b07-467f-4c88-8605-9448eec72650') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('43d3ad8b-2fe7-45cf-829a-cb37941384d4', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 5, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-03-08T02:47:05.82795+00:00', 'd89078f5-29aa-407e-b60a-afea5e82ede5') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('dc236f40-7a59-4140-8d2e-b3b2a10012a8', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 4, 'Excellent trading conditions and tight spreads. I really love their custom dashboard.', 'approved', '2026-02-23T00:48:31.258239+00:00', '051f0076-65b2-419f-aa8d-9728d4471245') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('c908cc59-c5dd-479c-8521-7035599c009c', 'd024b25c-7f60-4bff-9e7c-62c8be18bdd9', NULL, 4, 'Excellent trading conditions and tight spreads. I really love their custom dashboard.', 'approved', '2026-02-18T01:03:44.126391+00:00', '94c689e3-18ec-4aea-8ad5-d5326f3b0d6c') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('6bbc6c57-03ee-474c-a1de-76e52dcef441', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 4, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-02-11T23:46:19.830672+00:00', '450f7a6b-b1e5-49b9-8609-7e3171e63041') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('305147d8-6540-4e02-b0bc-9c7dab73a59b', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 5, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-02-22T17:54:51.239871+00:00', '40187d84-c67c-442c-89fb-a861ff0680e4') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('6294c336-366c-48be-94b7-8dc9e69d9b3b', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 4, 'Been trading with them for 6 months, zero issues with withdrawals. Fast processing too.', 'approved', '2026-02-06T17:16:04.854691+00:00', 'd67e8c1a-90fc-4a9e-84c5-72ffc9485cd0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('cf3f534c-55e0-4eee-95b6-da795866c257', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-03-17T16:12:54.240908+00:00', '2105feff-d7ce-471d-b02b-99b227407cb0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('bedccf55-9cf5-4d11-ac05-02c5943fc0e4', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 4, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-01-22T03:48:39.362477+00:00', '65fbf64f-046f-496d-8981-7331057f6ab0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('5d4b2407-3f41-41fd-a301-e85d001cc4ea', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 5, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-02-06T17:14:42.887774+00:00', 'edd92328-8837-4eb1-9e68-9d0ec9e69e36') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('6998454d-63d2-4adb-8ee7-4e9b4f43e692', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 4, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-01-21T03:07:17.389257+00:00', '450f7a6b-b1e5-49b9-8609-7e3171e63041') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('f53cbd10-3de3-4853-8999-d001b2a6d1a5', '7d9d5712-52f0-494c-a1f8-6e126e0cf836', NULL, 5, 'Spreads are decent, and they always pay out on time. 5 stars from me.', 'approved', '2026-02-14T20:27:27.619073+00:00', 'edd92328-8837-4eb1-9e68-9d0ec9e69e36') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('4bf1017b-714c-4202-960f-0bb6174dbdad', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 4, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-03-04T02:20:36.634111+00:00', '56777adc-ac5f-4710-8f70-7091f93ea2de') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('7e017710-6bc6-44a5-acfe-2e935a68ad73', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 5, 'Excellent trading conditions and tight spreads. I really love their custom dashboard.', 'approved', '2026-01-26T05:15:35.274323+00:00', '358e172b-86bb-4cf8-96ce-d0480abb03e0') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('71a3ccb8-5d9b-4a6c-a5d4-2d216ccfe813', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 4, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-02-10T17:36:58.000861+00:00', 'bf997cca-80bf-4f88-a4ac-66071ae791c6') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('33531af7-8b73-4050-ae8f-1983b77cdc20', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 5, 'I received my first payout via Deel within 24 hours. Incredible speed!', 'approved', '2026-03-08T07:52:46.676451+00:00', '6235ee92-84c8-462b-a35c-a7e782be8ad1') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('98a81e5d-b111-470e-b89f-791c8472f389', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 4, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-01-29T17:05:24.769179+00:00', '0268f714-31e2-48fc-a877-00779713c5c8') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('3fe3ddf1-cbe9-47b5-b839-bde2d0a91675', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 4, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-01-24T22:16:58.213084+00:00', '613b1df3-00d4-44aa-bbd9-eea4fcf9fac5') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('c57b6865-c520-4851-bcfb-18cc2bd879a1', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 5, 'Very transparent and trustworthy. I gladly recommend them to any serious trader.', 'approved', '2026-01-21T04:47:50.614167+00:00', '51f92ee1-9ed6-4b6e-8b3d-ad62f6f8aee3') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('a1c0ceaa-7605-42e7-aee6-cc2e8b6d26f5', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 5, 'One of the best prop firms in the industry right now. Highly trustworthy.', 'approved', '2026-03-04T14:28:14.066008+00:00', '26d7f74a-fda6-450e-bef5-348cfcb32c95') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('428814e8-2021-4da5-9007-edfa965f9648', 'b421c2d7-d288-4fdc-a789-957e5f2e8883', NULL, 4, 'Customer support is top notch, highly recommended! They answered all my questions.', 'approved', '2026-02-25T05:09:56.984052+00:00', 'e433cd9f-25f0-4125-83bf-8b3c90296e31') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('dee4b2b3-06fa-458e-b318-6d1bfa3be7dd', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-02-02T00:48:37.325671+00:00', 'f79022b4-a18c-4c2f-9e64-2a096263b634') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('69038251-a96a-48d7-976a-b52adab85fdd', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 4, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-02-20T08:20:03.701611+00:00', '296221ef-e441-4eb5-b0df-bb8fe660a8de') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('64945e77-c76e-4201-836f-6fce61cb7b11', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-02-14T10:57:52.256353+00:00', '7a2c322c-230c-49d5-8143-2e4ac0cf5721') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('43d038e6-f3fa-4057-8f2d-84d005e3625d', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-03-09T12:57:03.319946+00:00', 'e3c4c14e-07e1-498f-b5a1-ca7c9422cf29') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('f89b18de-78ea-4029-85da-fce9f1c6a4ed', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-28T12:44:57.4068+00:00', '4aebfa78-4a9b-4e18-9d01-54f43f9d4be3') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('1e7798dd-0ead-4cee-b712-38d54d4cf7c0', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-02-15T06:48:24.589912+00:00', '21135491-8680-4a4f-a847-5cebc4995566') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('1ef98059-417f-4087-972c-7122e218116f', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'Spreads are decent, and they always pay out on time. 5 stars from me.', 'approved', '2026-02-16T13:59:22.202663+00:00', '7a2c322c-230c-49d5-8143-2e4ac0cf5721') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('9a8615ee-2afc-4487-8207-430c13163e97', 'b6783837-c110-413d-9260-d1d207ef87f3', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-25T02:32:22.016565+00:00', 'bb40a835-c986-4b39-8f1f-b4d4ad85aa46') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('89248fdc-5d0f-497a-84f2-99db7d6f7371', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-02-25T13:08:47.835391+00:00', '0268f714-31e2-48fc-a877-00779713c5c8') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('622cd6fe-0c23-448a-933c-31be27898d7a', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-02-19T19:23:01.909527+00:00', '16209ec9-d17f-4f3d-92bb-0a05af98920b') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('4958ccb9-1b7c-4cc2-9aac-e687b5fc1656', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-03-05T12:30:31.068036+00:00', '4c115cf1-7831-403a-a856-be96fcbe3371') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('a5eba848-2dc5-4934-a178-168f8957c186', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-03-16T17:34:07.35004+00:00', 'c2fc542e-0807-4841-89a3-4ef63db5fa66') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('e8d0c5f1-edb4-4ad4-b2ad-bc0b2ee9c863', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'Customer support is top notch, highly recommended! They answered all my questions.', 'approved', '2026-01-31T08:01:05.270094+00:00', '79d045f6-8f80-4724-b2b2-67b8c224fe2e') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('d34011c4-e98d-4967-8b3f-f3d82c7f4ec9', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-03-02T10:33:10.07888+00:00', '81e43c3c-a063-4331-8bfc-dafb34be590e') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('4c1e3d58-a08a-40f3-be50-0a22bc026f23', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 4, 'Spreads are decent, and they always pay out on time. 5 stars from me.', 'approved', '2026-01-27T18:47:41.703655+00:00', '21135491-8680-4a4f-a847-5cebc4995566') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('27452f59-2df7-499c-bca6-c8987bee781b', 'e33c3634-2f7f-47ee-818d-2e0eb6adfafa', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-03-01T22:46:05.570848+00:00', '22df8669-08ad-472e-9131-a357ee66bbdf') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('c2c8aca0-7be1-47cb-a44f-1011662b4ce6', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 4, 'Legit prop firm. No hidden rules, everything is exactly as stated on their site.', 'approved', '2026-02-21T06:28:41.639284+00:00', '296221ef-e441-4eb5-b0df-bb8fe660a8de') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('29ad813f-4ef1-41ce-a162-2e310ab937bb', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 4, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-07T08:27:38.819955+00:00', '4aebfa78-4a9b-4e18-9d01-54f43f9d4be3') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('a7b4f949-c3c0-4a17-94fe-981c87a81a8f', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 5, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-03-17T01:00:45.109624+00:00', '1d93ea14-66df-46d5-8eee-db292c292d98') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('924cfbf9-e323-4e2a-b8bd-db30af92e1eb', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 5, 'Customer support is top notch, highly recommended! They answered all my questions.', 'approved', '2026-02-21T13:23:43.453576+00:00', '94c689e3-18ec-4aea-8ad5-d5326f3b0d6c') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('f329e864-3ea9-4651-81dc-8101b7a81220', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 4, 'Customer support is top notch, highly recommended! They answered all my questions.', 'approved', '2026-03-05T00:57:51.166381+00:00', '16209ec9-d17f-4f3d-92bb-0a05af98920b') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('9db22371-db02-49b6-ad77-b88876b73ed8', '90650081-ea93-4bf1-88cb-bdffdd97078d', NULL, 4, 'Good firm overall. The evaluation rules are very fair and straightforward.', 'approved', '2026-01-21T23:46:10.365938+00:00', 'a960197e-8226-496a-8960-4c2f24e10697') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('1e59a043-4ad9-4524-9f26-c7de9176ac88', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 4, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-21T15:28:53.452049+00:00', 'bb40a835-c986-4b39-8f1f-b4d4ad85aa46') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('1dd3ef66-3da8-426e-905a-f22d44aa3ddb', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 5, 'Fantastic firm with great spreads and reliable payouts. Definitely one of the best.', 'approved', '2026-01-23T18:10:45.584472+00:00', 'a960197e-8226-496a-8960-4c2f24e10697') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('879f1434-ee6c-48a3-999a-8de058ad92d8', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 5, 'Slight slippage during high-impact news, but otherwise a pristine trading experience.', 'approved', '2026-01-30T13:46:19.090861+00:00', '81e43c3c-a063-4331-8bfc-dafb34be590e') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('d36dd3b8-49c9-4024-9c7b-679558e506a3', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 5, 'Great platform. The challenge was straightforward, passed it in 2 weeks.', 'approved', '2026-01-26T18:08:26.114612+00:00', '1ff0209d-aafe-49fa-8615-f4088fc24d58') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('f8aa306e-5591-4e13-8383-1b4dd295d34c', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 5, 'The dashboard metrics and analytics are super helpful for tracking progress.', 'approved', '2026-02-10T22:59:17.098304+00:00', '696353ca-9f86-42bb-be80-3d8b070852e8') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.reviews (id, firm_id, user_name, rating, comment, status, created_at, user_id) VALUES ('3b37cccf-3aa8-4062-a2cf-068e377d1ff5', 'df65dd71-85a2-4444-ba12-c9c8b0b61d79', NULL, 5, 'Payouts are fast and the scaling plan is very attractive for consistent traders.', 'approved', '2026-02-18T20:48:12.960414+00:00', 'a960197e-8226-496a-8960-4c2f24e10697') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR BLOG_POSTS (4 rows)
-- =============================================
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, author, read_time, meta_title, meta_description, status, is_featured, created_at, updated_at) VALUES ('cc094c54-e0d2-40fc-8258-04e3e602d9d0', 'How to Choose the Best Prop Trading Firm in 2026', 'how-to-choose-best-prop-trading-firm-2026', 'Navigating the world of proprietary trading firms can be overwhelming. Here''s your ultimate guide to finding the perfect match for your trading style.', '<h2>What Makes a Great Prop Trading Firm?</h2>
<p>Choosing the right prop trading firm is one of the most critical decisions you''ll make as a trader. With dozens of firms competing for your attention, it''s easy to get lost in the noise. In this comprehensive guide, we''ll break down every factor you should consider.</p>

<h3>1. Evaluation Process & Challenge Structure</h3>
<p>The evaluation process is your gateway into funded trading. Most firms offer either 1-step, 2-step, or instant funding models. Each has its pros and cons:</p>
<ul>
<li><strong>1-Step Challenges</strong> — Faster path to funding, typically with stricter rules</li>
<li><strong>2-Step Challenges</strong> — More forgiving, gives you two phases to prove consistency</li>
<li><strong>Instant Funding</strong> — Skip the evaluation entirely, but usually comes with lower profit splits</li>
</ul>

<h3>2. Profit Split & Payout Reliability</h3>
<p>A firm can promise 90% profit split, but what matters is whether they actually pay. Always check community reviews and payout proof before committing your money. Look for firms with consistent payout histories and transparent processes.</p>

<h3>3. Trading Rules & Flexibility</h3>
<p>Key rules to evaluate include daily drawdown limits, maximum drawdown, minimum trading days, news trading restrictions, and weekend holding policies. The best firms offer flexibility without compromising risk management.</p>

<h3>4. Platform & Technology</h3>
<p>Whether you prefer MetaTrader 4, MetaTrader 5, cTrader, or TradingView, make sure your chosen firm supports your preferred platform. Some firms also offer proprietary dashboards for tracking your progress.</p>

<h3>5. Customer Support & Community</h3>
<p>When you''re in the middle of a challenge, responsive support can make or break your experience. Look for firms with active Discord communities, live chat support, and dedicated account managers.</p>

<h2>Use Prop Match Spot to Compare</h2>
<p>Instead of manually researching each firm, use <strong>Prop Match Spot</strong> to compare multiple firms side-by-side. Our platform aggregates real data, verified reviews, and exclusive discount codes to help you make the best decision. Use code <strong>SPOT</strong> to save on your next challenge!</p>', 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800&q=80', 'Prop Firm Education', '{"prop firms","trading","funded trading","beginners guide"}', 'Prop Match Spot', 6, 'How to Choose the Best Prop Trading Firm in 2026 | Prop Match Spot', 'Complete guide to choosing the best proprietary trading firm. Compare evaluation processes, profit splits, payout reliability, and trading rules.', 'published', true, '2026-03-20T12:42:45.815285+00:00', '2026-03-20T12:42:45.815285+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, author, read_time, meta_title, meta_description, status, is_featured, created_at, updated_at) VALUES ('14acac05-8ff8-48f0-a31a-f7d6ca2e9bdf', 'Understanding Drawdown Rules: Daily vs Maximum Explained', 'understanding-drawdown-rules-daily-vs-maximum', 'Drawdown rules are the #1 reason traders fail prop firm challenges. Learn the critical difference between daily and maximum drawdown to protect your funded account.', '<h2>Why Drawdown Rules Matter</h2>
<p>If there''s one thing that separates successful funded traders from failed ones, it''s understanding drawdown rules. More traders lose their challenges due to drawdown violations than any other reason.</p>

<h3>Daily Drawdown Explained</h3>
<p>Daily drawdown is the maximum amount your account equity can decrease within a single trading day. For example, if your account has $100,000 and the daily drawdown is 5%, you cannot lose more than $5,000 in a single day.</p>
<p><strong>Critical detail:</strong> Most firms calculate daily drawdown from your day''s starting balance or highest equity point — not from your original account size. This means if you make $2,000 in profit early in the day, your drawdown buffer shifts up accordingly.</p>

<h3>Maximum (Overall) Drawdown</h3>
<p>Maximum drawdown is the total amount your account can decrease from its highest point at any time during the challenge. With a 10% max drawdown on a $100,000 account, your equity cannot drop below $90,000.</p>
<p>Some firms use <strong>trailing drawdown</strong>, which follows your highest equity point. Others use <strong>static drawdown</strong>, which is fixed from your starting balance. Trailing drawdown is significantly harder to manage.</p>

<h3>Pro Tips for Managing Drawdown</h3>
<ul>
<li>Never risk more than 1-2% of your account on a single trade</li>
<li>Track your daily P&L in real-time — don''t let losses compound</li>
<li>Take profits early in the day to build a buffer</li>
<li>Use stop losses religiously — no exceptions</li>
</ul>

<h2>Compare Drawdown Rules Across Firms</h2>
<p>Every prop firm has different drawdown thresholds. Use <strong>Prop Match Spot</strong> to compare daily and maximum drawdown limits across all major firms before choosing your challenge.</p>', 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=800&q=80', 'Trading Tips', '{"drawdown","risk management","trading rules","prop firm challenges"}', 'Prop Match Spot', 5, 'Understanding Drawdown Rules: Daily vs Maximum | Prop Match Spot', 'Learn the critical difference between daily drawdown and maximum drawdown in prop trading challenges. Essential knowledge for funded traders.', 'published', false, '2026-03-20T12:42:45.815285+00:00', '2026-03-20T12:42:45.815285+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, author, read_time, meta_title, meta_description, status, is_featured, created_at, updated_at) VALUES ('3ce74c03-0ae5-4171-9845-d72e471127bf', 'Top 5 Mistakes Traders Make During Prop Firm Evaluations', 'top-5-mistakes-traders-make-during-evaluations', 'Avoid these costly errors that cause 80% of traders to fail their prop firm challenges. Learn from the community''s most common pitfalls.', '<h2>Why Do Most Traders Fail?</h2>
<p>Studies show that approximately 80-90% of traders fail their prop firm evaluations on the first attempt. But the good news is that most failures come from a handful of predictable mistakes — all of which are avoidable.</p>

<h3>Mistake #1: Over-Leveraging on Day One</h3>
<p>The excitement of starting a new challenge leads many traders to take oversized positions immediately. Remember, you have 30+ days in most challenges. There''s no rush. Start with smaller positions and scale up as you build a profit buffer.</p>

<h3>Mistake #2: Ignoring the Daily Drawdown</h3>
<p>Many traders focus only on hitting their profit target while completely ignoring the daily drawdown limit. One bad day can eliminate you instantly. Set a personal daily loss limit that''s well below the firm''s threshold.</p>

<h3>Mistake #3: Trading During High-Impact News</h3>
<p>Unless you''re specifically experienced in news trading, avoid major economic releases like NFP, CPI, and FOMC decisions. Volatility spikes can blow through your stop losses and trigger drawdown violations in seconds.</p>

<h3>Mistake #4: Not Having a Trading Plan</h3>
<p>Going into a challenge without a written trading plan is like driving without GPS. Document your strategy, risk per trade, session times, and specific setups before you take your first trade.</p>

<h3>Mistake #5: Revenge Trading After Losses</h3>
<p>After a losing trade, the urge to immediately "make it back" is overwhelming. This emotional response leads to larger positions, more frequent trades, and compounding losses. Walk away after two consecutive losses.</p>

<h2>Set Yourself Up for Success</h2>
<p>Browse verified trader reviews on <strong>Prop Match Spot</strong> to learn from other traders'' experiences. Use code <strong>SPOT</strong> for exclusive discounts on your next challenge!</p>', 'https://images.unsplash.com/photo-1535320903710-d993d3d77d29?w=800&q=80', 'Prop Firm Education', '{"mistakes","evaluation","trading psychology","tips"}', 'Prop Match Spot', 7, 'Top 5 Mistakes During Prop Firm Evaluations | Prop Match Spot', 'Discover the top 5 mistakes that cause traders to fail their prop firm evaluations and learn proven strategies to avoid them.', 'published', false, '2026-03-20T12:42:45.815285+00:00', '2026-03-20T12:42:45.815285+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.blog_posts (id, title, slug, excerpt, content, cover_image, category, tags, author, read_time, meta_title, meta_description, status, is_featured, created_at, updated_at) VALUES ('5a39762c-fe8f-457b-8a41-cb8d8b68af0e', 'Prop Trading in 2026: Industry Trends You Need to Know', 'prop-trading-2026-industry-trends', 'The prop trading landscape is evolving rapidly. From AI-powered analysis to new regulatory frameworks, here are the trends shaping funded trading.', '<h2>The Prop Trading Revolution</h2>
<p>2026 is shaping up to be a transformational year for proprietary trading. The industry has matured significantly, with stricter regulations, better technology, and more competitive offerings than ever before.</p>

<h3>Trend 1: AI-Powered Trading Tools</h3>
<p>More firms are integrating AI tools directly into their platforms. From automated trade journaling to pattern recognition and risk management alerts, artificial intelligence is becoming an essential part of the funded trader''s toolkit.</p>

<h3>Trend 2: Instant Funding Models</h3>
<p>The traditional 2-step evaluation is being challenged by instant funding options. Firms are competing to offer faster paths to funded accounts, recognizing that experienced traders don''t always need lengthy evaluations.</p>

<h3>Trend 3: Crypto & Alternative Markets</h3>
<p>Beyond forex and futures, prop firms are expanding into cryptocurrency, indices, and commodities. This diversification gives traders more opportunities and flexibility in how they approach funding.</p>

<h3>Trend 4: Community-Driven Platforms</h3>
<p>The most successful firms in 2026 are building strong communities. Discord servers, trading competitions, mentorship programs, and social trading features are becoming standard differentiators.</p>

<h3>Trend 5: Transparency & Verified Payouts</h3>
<p>Traders are demanding more transparency. Platforms like <strong>Prop Match Spot</strong> help by aggregating verified reviews and payout data, making it easier to identify trustworthy firms.</p>

<h2>Stay Ahead of the Curve</h2>
<p>Follow the Prop Match Spot blog for weekly industry insights and exclusive firm comparisons. Visit our reviews section to read verified trader experiences!</p>', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&q=80', 'Industry News', '{"trends","2026","prop trading","industry","ai trading"}', 'Prop Match Spot', 4, 'Prop Trading in 2026: Key Industry Trends | Prop Match Spot', 'Discover the top prop trading industry trends for 2026, including AI tools, instant funding, crypto markets, and community-driven platforms.', 'published', false, '2026-03-20T12:42:45.815285+00:00', '2026-03-20T12:42:45.815285+00:00') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR COMPETITIONS (1 rows)
-- =============================================
INSERT INTO public.competitions (id, firm_id, firm_name, title, description, prize_pool, entry_fee, start_date, end_date, join_url, image_url, status, created_at, tasks) VALUES ('41a7f518-420b-49c6-a89f-ac767060ef5e', NULL, 'The5%ers', 'Scalpers Paradise', 'High frequency trading allowed. Show us your best scalping strategy.', '$100k Evaluation', '$10 Entry', '2026-01-10T14:08:16.477654+00:00', '2026-02-09T14:08:16.477654+00:00', 'https://the5ers.com/', 'https://the5ers.com/wp-content/uploads/2021/01/logo-5ers.png', 'upcoming', '2025-12-29T14:08:16.477654+00:00', '{}') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR TRUST_BADGES (7 rows)
-- =============================================
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('e27921e3-cabd-495b-aad8-dca062ccdfb0', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Verified Firm', '2026-01-19T15:09:08.52305+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('23433f62-1057-42ba-b303-dfe06cf37c09', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Verified Firm', '2026-01-19T15:09:10.634829+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('630a5225-7d9d-49ee-b1bf-0605e621579e', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Verified Firm', '2026-01-19T15:09:12.610353+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('1656767a-0bd8-46fd-aafd-45fc15171442', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Verified Firm', '2026-01-19T15:09:12.723889+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('f93edca3-0130-4bbf-9586-c18951e53779', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Trader''s Choice', '2026-01-19T15:09:23.531992+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('91e708f8-2fe2-4330-9d33-04cb28f4d997', 'bde6adeb-d179-44a3-8366-5e97b39c6119', 'Fast Payouts', '2026-01-19T15:09:25.452462+00:00') ON CONFLICT (id) DO NOTHING;
INSERT INTO public.trust_badges (id, firm_id, badge_type, issued_at) VALUES ('8da15609-04a6-4f8f-9683-9291658ba90c', '58f5e229-9a56-4632-89be-2abd266b7457', 'Trader''s Choice', '2026-03-02T12:22:54.633536+00:00') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- DATA FOR OFFERS (1 rows)
-- =============================================
INSERT INTO public.offers (id, firm_id, title, code, discount, expiry_date, verified, status, created_at) VALUES ('86bf9c1f-0383-4647-8667-fe88529843d6', 'bde6adeb-d179-44a3-8366-5e97b39c6119', '50% OFF TILL RAMDAN', 'CAPITAL', '50%OFF', '2026-03-28', true, 'active', '2026-02-28T11:13:05.59266+00:00') ON CONFLICT (id) DO NOTHING;

-- =============================================
-- SAMPLE REWARDS DATA
-- =============================================
INSERT INTO public.rewards (title, description, cost, image_url, code, status) VALUES
('Free Challenge Reset', 'Get a 100% reset on any active evaluation challenge.', 500, 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=600', 'RESET100', 'active'),
('VIP Discord Access', 'Gain access to private trading alerts and professional discussions.', 250, 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=600', 'VIPDISCORD', 'active'),
('10% Extra Profit Split Voucher', 'Boost your funded payout split by +10% on your next cycle.', 1000, 'https://images.unsplash.com/photo-1642790106117-e829e14a795f?w=600', 'BOOST10', 'active')
-- =============================================
-- 13. PURCHASE_REQUESTS TABLE (Wealth Credit Submissions)
-- =============================================
CREATE TABLE IF NOT EXISTS public.purchase_requests (
    id TEXT PRIMARY KEY,
    user_id UUID,
    user_name TEXT,
    user_email TEXT,
    firm_name TEXT NOT NULL,
    challenge_type TEXT NOT NULL,
    account_size TEXT NOT NULL,
    purchase_date DATE DEFAULT CURRENT_DATE,
    order_number TEXT NOT NULL,
    discount_code TEXT,
    proof_url TEXT,
    credit_amount INTEGER DEFAULT 250,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    admin_notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.purchase_requests ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Anyone can select purchase requests" ON public.purchase_requests;
CREATE POLICY "Anyone can select purchase requests" ON public.purchase_requests FOR SELECT USING (true);
DROP POLICY IF EXISTS "Anyone can insert purchase requests" ON public.purchase_requests;
CREATE POLICY "Anyone can insert purchase requests" ON public.purchase_requests FOR INSERT WITH CHECK (true);
DROP POLICY IF EXISTS "Anyone can update purchase requests" ON public.purchase_requests;
CREATE POLICY "Anyone can update purchase requests" ON public.purchase_requests FOR UPDATE USING (true);

SELECT 'SUCCESS: All tables created, RLS configured, and legacy data restored!' AS result;
