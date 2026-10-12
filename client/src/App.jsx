import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

import Home from "./pages/Home";
import AuthPage from "./pages/AuthPage";
import CardPreview from "./pages/CardPreview";
import Dashboard from "./pages/Dashboard";

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

      {/* Admin / Customer Dashboard */}
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Unknown URL */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
