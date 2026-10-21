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
import Payment from "./pages/Payment";
import QrCode from "./pages/Qr";
import Refer from "./pages/Refer";
import SocialCard from "./pages/SocialCard";
import WebsiteTheme from "./pages/WebsiteTheme";

import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

// admin imports

import AdminLayout from "./admin/components/AdminLayout";
import AdminDashboard from "./admin/pages/AdminDashboard";

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
        <Route path="mini" element={<Mini />} />
        <Route path="payment" element={<Payment />} />
        <Route path="theme" element={<WebsiteTheme />} />
        <Route path="qrcode" element={<QrCode />} />
        <Route path="refer" element={<Refer />} />
        <Route path="/socialcard" element={<SocialCard />} />
      </Route>


      {/* Admin Pages */}
      <Route element={<AdminLayout />}>
        <Route path="/admin" element={<AdminDashboard />} />
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
