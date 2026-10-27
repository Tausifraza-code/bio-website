import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";

import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardMobileSidebar from "../components/DashboardMobileSidebar";
import PaymentModal from "../components/PaymentModal";

const DashboardLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const [activeNavItem, setActiveNavItem] = useState("mini");

  const [showPayModal, setShowPayModal] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastTimer, setToastTimer] = useState(null);

  const [cardActionNotice, setCardActionNotice] = useState("");
  const [cardActionNoticeTimer, setCardActionNoticeTimer] =
    useState(null);

  /* =========================================================
     ACTIVE SIDEBAR ITEM
  ========================================================= */

  useEffect(() => {
    const routeMap = {
      "/mini": "mini",
      "/editprofile": "editprofile",
      "/upi-payments": "payment",
      "/theme": "themes",
      "/manageproducts": "manageproducts",
      "/gallery": "Gallery",
      "/contact-buttons": "contactbuttons",
      "/socialcard": "socialcard",
      "/leads": "leads",
      "/refer": "refer",
      "/qrcode": "qrcode",
    };

    const currentPath = location.pathname;

    const matchedRoute = Object.keys(routeMap).find(
      (path) =>
        currentPath === path ||
        currentPath.startsWith(`${path}/`)
    );

    if (matchedRoute) {
      setActiveNavItem(routeMap[matchedRoute]);
    }
  }, [location.pathname]);

  /* =========================================================
     CLEANUP TIMERS
  ========================================================= */

  useEffect(() => {
    return () => {
      if (toastTimer) {
        clearTimeout(toastTimer);
      }

      if (cardActionNoticeTimer) {
        clearTimeout(cardActionNoticeTimer);
      }
    };
  }, [toastTimer, cardActionNoticeTimer]);

  /* =========================================================
     TOAST
  ========================================================= */

  const showToast = (message) => {
    setToastMessage(message);

    if (toastTimer) {
      clearTimeout(toastTimer);
    }

    const timer = setTimeout(() => {
      setToastMessage("");
    }, 3000);

    setToastTimer(timer);
  };

  /* =========================================================
     CARD ACTION NOTICE
  ========================================================= */

  const showCardActionNotice = (message) => {
    setCardActionNotice(message);

    if (cardActionNoticeTimer) {
      clearTimeout(cardActionNoticeTimer);
    }

    const timer = setTimeout(() => {
      setCardActionNotice("");
    }, 3000);

    setCardActionNoticeTimer(timer);
  };

  /* =========================================================
     PREVIEW
  ========================================================= */

  const handlePreview = () => {
    navigate("/preview");
  };

  /* =========================================================
     LOGOUT
  ========================================================= */

  const handleLogout = () => {
    window.location.href = "/";
  };

  /* =========================================================
     NAVIGATION
  ========================================================= */

  const handleNavClick = (id) => {
    setActiveNavItem(id);

    // Close mobile sidebar
    setSidebarOpen(false);

    if (id === "preview") {
      handlePreview();
      return;
    }

    if (id === "plans") {
      setShowPayModal(true);
      return;
    }

    const sectionMap = {
      overview: "dashboard-overview",
      profile: "dashboard-profile",
      themes: "dashboard-themes",
      qr: "dashboard-qr",
      settings: "dashboard-settings",
    };

    const targetId = sectionMap[id];

    if (targetId) {
      requestAnimationFrame(() => {
        const element = document.getElementById(targetId);

        if (element) {
          element.scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
        }
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#061426]  text-slate-100">
      {/* =======================================================
          DASHBOARD NAVBAR
      ======================================================= */}

      <DashboardNavbar
        ownerName="Your Business"
        businessName="BioWebsite"
        role="Business Owner / Professional"
        onMenuClick={() => setSidebarOpen(true)}
        onPreview={handlePreview}
        onLogout={handleLogout}
      />

      {/* =======================================================
          MOBILE SIDEBAR
      ======================================================= */}

      <DashboardMobileSidebar
        open={sidebarOpen}
        activeNavItem={activeNavItem}
        onClose={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        onPreview={handlePreview}
        onLogout={handleLogout}
      />

      {/* =======================================================
          MAIN DASHBOARD SHELL
      ======================================================= */}

      <main className="mx-auto flex w-full max-w-[1600px] items-start gap-4 px-2 py-4 sm:px-5 lg:gap-5 lg:px-6 xl:px-7">
        {/* =====================================================
            DESKTOP SIDEBAR
        ===================================================== */}

        <DashboardSidebar
          collapsed={sidebarCollapsed}
          activeNavItem={activeNavItem}
          onNavClick={handleNavClick}
          onToggle={() =>
            setSidebarCollapsed(
              (previous) => !previous
            )
          }
          onPreview={handlePreview}
          onLogout={handleLogout}
        />

        {/* =====================================================
            CONTENT AREA

            NOTE:
            Abhi profile/layout design ko intentionally touch
            nahi kar rahe hain.
        ===================================================== */}

        <div className="min-w-0 flex-1">
          <div className="min-h-[calc(100vh-105px)] min-w-0">
            <Outlet
              context={{
                showToast,
                showCardActionNotice,
                setShowPayModal,
                handlePreview,
                handleLogout,
              }}
            />
          </div>
        </div>
      </main>

      {/* =======================================================
          PAYMENT MODAL
      ======================================================= */}

      {showPayModal && (
        <PaymentModal
          onClose={() => setShowPayModal(false)}
        />
      )}

      {/* =======================================================
          GENERAL TOAST
      ======================================================= */}

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-[#082443] px-4 py-3 text-sm font-medium text-cyan-50 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          {toastMessage}
        </div>
      )}

      {/* =======================================================
          CARD ACTION NOTICE
      ======================================================= */}

      {cardActionNotice && (
        <div className="fixed bottom-20 left-1/2 z-[99] -translate-x-1/2 rounded-xl border border-cyan-300/20 bg-[#082443] px-4 py-3 text-sm font-medium text-cyan-50 shadow-[0_12px_40px_rgba(0,0,0,0.35)]">
          {cardActionNotice}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;