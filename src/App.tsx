import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import AuthPage from "./pages/auth/AuthPage";
import { Navigate } from "react-router-dom";
import Datenschutz from "./pages/legal/Datenschutz";
import Impressum from "./pages/legal/Impressum";
import Dashboard from "./pages/Dashboard";
import BrandingsPage from "./pages/admin/BrandingsPage";
import BrandingDetailPage from "./pages/admin/BrandingDetailPage";
import UsersPage from "./pages/admin/UsersPage";
import UserDetailPage from "./pages/admin/UserDetailPage";
import TransactionsPage from "./pages/admin/TransactionsPage";
import WithdrawalsPage from "./pages/admin/WithdrawalsPage";
import AdminCampaignsPage from "./pages/admin/AdminCampaignsPage";
import AdminCampaignDetailPage from "./pages/admin/AdminCampaignDetailPage";
import TicketsPage from "./pages/admin/TicketsPage";
import TicketDetailPage from "./pages/admin/TicketDetailPage";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import AdminProtectedRoute from "./components/auth/AdminProtectedRoute";
import { AdvertiserLayout } from "./components/advertiser/AdvertiserLayout";
import AdvertiserDashboard from "./pages/advertiser/AdvertiserDashboard";
import RentAccountPage from "./pages/advertiser/RentAccountPage";
import DepositPage from "./pages/advertiser/DepositPage";
import CampaignsPage from "./pages/advertiser/CampaignsPage";
import CampaignEditPage from "./pages/advertiser/CampaignEditPage";
import StatisticsPage from "./pages/advertiser/StatisticsPage";
import ApiDocsPage from "./pages/advertiser/ApiDocsPage";
import SettingsPage from "./pages/advertiser/SettingsPage";
import SupportPage from "./pages/advertiser/SupportPage";
import NewTicketPage from "./pages/advertiser/NewTicketPage";
import AdvertiserTicketDetailPage from "./pages/advertiser/AdvertiserTicketDetailPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Navigate to="/auth" replace />} />
            <Route path="/auth" element={<AuthPage />} />
            <Route path="/auth/login" element={<Navigate to="/auth" replace />} />
            <Route path="/auth/register" element={<Navigate to="/auth?mode=register" replace />} />
            <Route path="/auth/forgot-password" element={<Navigate to="/auth" replace />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/advertiser" element={<AdvertiserLayout />}>
                <Route index element={<AdvertiserDashboard />} />
                <Route path="rent-account" element={<RentAccountPage />} />
                <Route path="deposit" element={<DepositPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="campaigns/edit/:id" element={<CampaignEditPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="api" element={<ApiDocsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="support" element={<SupportPage />} />
                <Route path="support/new" element={<NewTicketPage />} />
                <Route path="support/:id" element={<AdvertiserTicketDetailPage />} />
              </Route>
            </Route>
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/users" element={<UsersPage />} />
              <Route path="/admin/users/:id" element={<UserDetailPage />} />
              <Route path="/admin/campaigns" element={<AdminCampaignsPage />} />
              <Route path="/admin/campaigns/:id" element={<AdminCampaignDetailPage />} />
              <Route path="/admin/transactions" element={<TransactionsPage />} />
              <Route path="/admin/withdrawals" element={<WithdrawalsPage />} />
              <Route path="/admin/brandings" element={<BrandingsPage />} />
              <Route path="/admin/brandings/:id" element={<BrandingDetailPage />} />
              <Route path="/admin/tickets" element={<TicketsPage />} />
              <Route path="/admin/tickets/:id" element={<TicketDetailPage />} />
            </Route>
            <Route path="/datenschutz" element={<Datenschutz />} />
            <Route path="/impressum" element={<Impressum />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
