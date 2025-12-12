import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import ForgotPassword from "./pages/auth/ForgotPassword";
import Dashboard from "./pages/Dashboard";
import BrandingsPage from "./pages/admin/BrandingsPage";
import BrandingDetailPage from "./pages/admin/BrandingDetailPage";
import AccountsPage from "./pages/admin/AccountsPage";
import AccountDetailPage from "./pages/admin/AccountDetailPage";
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
import StatisticsPage from "./pages/advertiser/StatisticsPage";
import SettingsPage from "./pages/advertiser/SettingsPage";
import SupportPage from "./pages/advertiser/SupportPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth/login" element={<Login />} />
            <Route path="/auth/register" element={<Register />} />
            <Route path="/auth/forgot-password" element={<ForgotPassword />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/advertiser" element={<AdvertiserLayout />}>
                <Route index element={<AdvertiserDashboard />} />
                <Route path="rent-account" element={<RentAccountPage />} />
                <Route path="deposit" element={<DepositPage />} />
                <Route path="campaigns" element={<CampaignsPage />} />
                <Route path="statistics" element={<StatisticsPage />} />
                <Route path="settings" element={<SettingsPage />} />
                <Route path="support" element={<SupportPage />} />
              </Route>
            </Route>
            <Route element={<AdminProtectedRoute />}>
              <Route path="/admin/brandings" element={<BrandingsPage />} />
              <Route path="/admin/brandings/:id" element={<BrandingDetailPage />} />
              <Route path="/admin/accounts" element={<AccountsPage />} />
              <Route path="/admin/accounts/:id" element={<AccountDetailPage />} />
              <Route path="/admin/tickets" element={<TicketsPage />} />
              <Route path="/admin/tickets/:id" element={<TicketDetailPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
