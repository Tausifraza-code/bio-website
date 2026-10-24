import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CardPreview from "./pages/CardPreview";
import Dashboard from "./pages/Dashboard";

import DashboardLayout from "./layout/DashboardLayout";
import EditProfile from "./pages/EditProfile";
import Leads from "./pages/Leads";
import ManageProducts from "./pages/ManageProducts";
import Mini from "./pages/Mini";
import QrCode from "./pages/Qr";
import Refer from "./pages/Refer";
import SocialCard from "./pages/SocialCard";
import ContactButtons from "./pages/ContactButtons";
import WebsiteTheme from "./pages/WebsiteTheme";
import UpiPaymentSettings from "./pages/UpiPaymentSettings";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// admin imports

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";
import AdminLogin from "./admin/pages/AdminLogin";
import AdminUsers from "./admin/pages/AdminUsers";
import AdminReferrals from "./admin/pages/AdminReferrals";
import Gallery from "./pages/Gallery";

function App() {
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("bio-theme") || "dark";

      document.documentElement.dataset.theme = savedTheme;
    } catch {
      document.documentElement.dataset.theme = "dark";
    }
  }, []);

  return (
    <Routes>
      {/* Landing Page */}
      <Route path="/" element={<Home />} />

      {/* Authentication Pages */}
      <Route path="/login" element={<AuthPage />} />
      <Route path="/register" element={<AuthPage />} />

      {/* Preview Pages */}
      <Route path="/preview" element={<CardPreview />} />
      <Route path="/card-preview" element={<CardPreview />} />

      {/* Dashboard Layout with Outlet */}
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />

        <Route path="editprofile" element={<EditProfile />} />
        <Route path="leads" element={<Leads />} />
        <Route path="manageproducts" element={<ManageProducts />} />
        <Route path="gallery" element={<Gallery />} />
        <Route path="mini" element={<Mini />} />
        <Route path="payment" element={<Navigate to="/mini" replace />} />
        <Route path="theme" element={<WebsiteTheme />} />
        <Route path="qrcode" element={<QrCode />} />
        <Route path="refer" element={<Refer />} />
        <Route path="contact-buttons" element={<ContactButtons />} />
        <Route path="socialcard" element={<SocialCard />} />
        <Route path="/upi-payments" element={<UpiPaymentSettings />} />
      </Route>

      {/* Admin Login — public login page */}
      <Route path="/admin/login" element={<AdminLogin />} />

      {/* Admin Dashboard */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
        <Route path="/admin/users" element={<AdminUsers />} />
        <Route path="/admin/referrals" element={<AdminReferrals />} />
      </Route>

      {/* Password Reset Pages */}
      <Route path="/forgot-password" element={<ForgotPassword />} />

      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
