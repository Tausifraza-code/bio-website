import { useCallback, useEffect, useState } from "react";
import { Navigate, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import { adminLogout } from "../../redux/slice/adminSlice";

export default function AdminLayout() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const adminToken = useSelector((state) => state.admin.token);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("adminTheme") === "dark" ? "dark" : "light";
    } catch {
      return "light";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("adminTheme", theme);
    } catch {
      // Theme preference is optional.
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
    dispatch(adminLogout());
    navigate("/admin/login", { replace: true });
  }, [dispatch, navigate]);

  // Protect the admin dashboard.
  if (!adminToken) {
    return <Navigate to="/admin/login" replace />;
  }

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
