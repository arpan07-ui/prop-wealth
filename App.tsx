import React from 'react';
import { BrowserRouter, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import Footer from './components/Footer';
import BrowseFirmsPage from './pages/BrowseFirmsPage';
import FirmDetailPage from './pages/FirmDetailPage';
import FirmReviewsPage from './pages/FirmReviewsPage';
import AllReviewsPage from './pages/AllReviewsPage';
import BlogListPage from './pages/BlogListPage';
import BlogPostPage from './pages/BlogPostPage';
import ComparePage from './pages/ComparePage';
import OffersPage from './pages/OffersPage';
import UserDashboard from './pages/UserDashboard';
import CompetitionsPage from './pages/CompetitionsPage';
import CompetitionDetailPage from './pages/CompetitionDetailPage';
import PropFirmRulesPage from './pages/PropFirmRulesPage';
import RewardsPage from './pages/RewardsPage';
import AboutUsPage from './pages/AboutUsPage';
import ContactUsPage from './pages/ContactUsPage';
import TermsOfServicePage from './pages/TermsOfServicePage';
import PrivacyPolicyPage from './pages/PrivacyPolicyPage';
import RiskDisclosurePage from './pages/RiskDisclosurePage';
import WealthAIPage from './pages/NobleAIPage';
import WealthReplayDashboard from './pages/NobleReplayDashboard';
import ReplaySessionPage from './pages/ReplaySessionPage';
import AdminLayout from './components/AdminLayout';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFirmsPage from './pages/admin/AdminFirmsPage';
import AdminReviewsPage from './pages/admin/AdminReviewsPage';
import AdminPurchasesPage from './pages/admin/AdminPurchasesPage';
import AdminPayoutsPage from './pages/admin/AdminPayoutsPage';
import AdminBadgesPage from './pages/admin/AdminBadgesPage';
import AdminOffersPage from './pages/admin/AdminOffersPage';
import AdminBlogPage from './pages/admin/AdminBlogPage';
import AdminUsersPage from './pages/admin/AdminUsersPage';
import AdminRewardsPage from './pages/admin/AdminRewardsPage';
import AdminCompetitionsPage from './pages/admin/AdminCompetitionsPage';
import AdminMarketingPage from './pages/admin/AdminMarketingPage';
import AdminSettingsPage from './pages/admin/AdminSettingsPage';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/auth/LoginPage';
import SignupPage from './pages/auth/SignupPage';
import MyAdminPage from './pages/auth/MyAdminPage';
import { ComparisonProvider } from './context/ComparisonContext';
import { ModalProvider } from './context/ModalContext';
import GlobalModal from './components/GlobalModal';
import ComparisonFloatingBar from './components/ComparisonFloatingBar';
import PayoutNotification from './components/PayoutNotification';
import SiteBackgroundOverlay from './components/SiteBackgroundOverlay';
import RouteSEO from './components/RouteSEO';



// ScrollToTop Component - Scrolls to top on route change
const ScrollToTop: React.FC = () => {
  const { pathname } = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
};

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode; role?: 'admin' | 'user' }> = ({ children, role }) => {
  const { user, isAdmin, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen bg-gray-900 flex items-center justify-center text-white">Loading...</div>;
  }

  if (role === 'admin') {
    if (!isAdmin) {
      return <Navigate to="/myadmin" replace />;
    }
    return <>{children}</>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};

// Main Layout Component (Requires Router Context)
const MainLayout = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/' || location.pathname === '/forex' || location.pathname === '/crypto';
  const isOffersPage = location.pathname.endsWith('/offers');
  const isAdminPage = location.pathname.includes('/admin') || location.pathname.includes('/myadmin');
  const isAuthPage = location.pathname.includes('/login') || location.pathname.includes('/signup') || location.pathname.includes('/myadmin');
  const isReplaySessionPage = location.pathname.includes('/session/');

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-white selection:bg-[#F0C41B] selection:text-black relative overflow-x-hidden">
      <RouteSEO />
      {!isLandingPage && <SiteBackgroundOverlay />}
      <ScrollToTop />
      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <Navbar />}

      <main className="flex-grow relative z-10">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/firms" element={<BrowseFirmsPage />} />
          <Route path="/firm/:id" element={<FirmDetailPage />} />
          <Route path="/firm/:id/reviews" element={<FirmReviewsPage />} />
          <Route path="/reviews" element={<AllReviewsPage />} />
          <Route path="/blog" element={<BlogListPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/compare" element={<ComparePage />} />
          <Route path="/competitions" element={<CompetitionsPage />} />
          <Route path="/competition/:id" element={<CompetitionDetailPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/rewards" element={<RewardsPage />} />
          <Route path="/rules" element={<PropFirmRulesPage />} />
          <Route path="/faq" element={<PropFirmRulesPage />} />

          {/* Info Pages */}
          <Route path="/about" element={<AboutUsPage />} />
          <Route path="/contact" element={<ContactUsPage />} />
          <Route path="/terms" element={<TermsOfServicePage />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/risk" element={<RiskDisclosurePage />} />
          <Route path="/wealth-ai" element={<WealthAIPage />} />
          <Route path="/wealth-replay" element={<WealthReplayDashboard />} />
          <Route path="/session/:sessionId" element={<ReplaySessionPage />} />

          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/myadmin" element={<MyAdminPage />} />

          {/* Admin Routes - Protected */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="firms" element={<AdminFirmsPage />} />
            <Route path="purchases" element={<AdminPurchasesPage />} />
            <Route path="reviews" element={<AdminReviewsPage />} />
            <Route path="payouts" element={<AdminPayoutsPage />} />
            <Route path="badges" element={<AdminBadgesPage />} />
            <Route path="offers" element={<AdminOffersPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="rewards" element={<AdminRewardsPage />} />
            <Route path="marketing" element={<AdminMarketingPage />} />
            <Route path="blog" element={<AdminBlogPage />} />
            <Route path="competitions" element={<AdminCompetitionsPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
          </Route>

          {/* Protected User Dashboard */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <UserDashboard />
            </ProtectedRoute>
          } />

        </Routes>
      </main>

      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <Footer />}

      {/* Global Comparison Floating Bar */}
      {!isAdminPage && !isReplaySessionPage && <ComparisonFloatingBar />}

      {/* Social Proof Payout Notifications */}
      {!isAdminPage && !isAuthPage && !isReplaySessionPage && <PayoutNotification />}

      {/* Global Welcome Popup - Excluded from Admin/Auth pages */}
      {/* Welcome Popup removed */}
    </div>
  );
};
import { TradeModeProvider } from './context/TradeModeContext';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ModalProvider>
          <ComparisonProvider>
            <TradeModeProvider>
              <Routes>
                {/* Forex prefixed routes */}
                <Route path="/forex/*" element={<MainLayout />} />

                {/* Crypto prefixed routes */}
                <Route path="/crypto/*" element={<MainLayout />} />
                
                {/* Default (Futures) routes */}
                <Route path="/*" element={<MainLayout />} />
              </Routes>
              <GlobalModal />
            </TradeModeProvider>
          </ComparisonProvider>
        </ModalProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
