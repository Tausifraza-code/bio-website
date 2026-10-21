import { useCallback, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";

export default function AdminLayout() {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("adminTheme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    // Use the same theme attribute as the existing BIO website.
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("adminTheme", theme);
    } catch {
      // Theme remains functional if localStorage is unavailable.
    }
  }, [theme]);

  const handleMenuClick = useCallback(() => {
    setSidebarOpen((open) => !open);
  }, []);

  const handleSidebarClose = useCallback(() => {
    setSidebarOpen(false);
  }, []);

  const handleThemeToggle = useCallback(() => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem("bioToken");
    navigate("/login", { replace: true });
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-[#07111f] dark:text-white">
      <AdminSidebar
        open={sidebarOpen}
        onClose={handleSidebarClose}
        onLogout={handleLogout}
      />

      <div className="min-h-screen lg:pl-64">
        <AdminHeader
          onMenuClick={handleMenuClick}
          theme={theme}
          onThemeToggle={handleThemeToggle}
        />

        <main className="mx-auto w-full max-w-[1600px] p-4 sm:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
