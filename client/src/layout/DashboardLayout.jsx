import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import DashboardNavbar from "../components/DashboardNavbar";
import DashboardSidebar from "../components/DashboardSidebar";
import DashboardMobileSidebar from "../components/DashboardMobileSidebar";
import PaymentModal from "../components/PaymentModal";

const DashboardLayout = () => {
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("overview");

  const [showPayModal, setShowPayModal] = useState(false);

  const [toastMessage, setToastMessage] = useState("");
  const [toastTimer, setToastTimer] = useState(null);

  const [cardActionNotice, setCardActionNotice] = useState("");
  const [cardActionNoticeTimer, setCardActionNoticeTimer] =
    useState(null);

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

  const handlePreview = () => {
    window.location.href = "/preview";
  };

  const handleLogout = () => {
    window.location.href = "/";
  };

  const handleNavClick = (id) => {
    setActiveNavItem(id);
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
    <div className="min-h-screen bg-[#080b1b] text-slate-100">
      <DashboardNavbar
        ownerName="Your Business"
        onMenuClick={() => setSidebarOpen(true)}
        onPreview={handlePreview}
        onLogout={handleLogout}
      />

      <DashboardMobileSidebar
        open={sidebarOpen}
        activeNavItem={activeNavItem}
        onClose={() => setSidebarOpen(false)}
        onNavClick={handleNavClick}
        onPreview={handlePreview}
        onLogout={handleLogout}
      />

      <main className="mx-auto flex max-w-[1500px] items-start gap-5 px-4 py-5 sm:px-6 lg:px-8">
        <DashboardSidebar
          collapsed={sidebarCollapsed}
          activeNavItem={activeNavItem}
          onNavClick={handleNavClick}
          onToggle={() =>
            setSidebarCollapsed((previous) => !previous)
          }
          onPreview={handlePreview}
          onLogout={handleLogout}
        />

        <div className="min-w-0 flex-1">
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
      </main>

      {showPayModal && (
        <PaymentModal
          onClose={() => setShowPayModal(false)}
        />
      )}

      {toastMessage && (
        <div className="fixed bottom-5 left-1/2 z-[100] -translate-x-1/2 rounded-2xl border border-white/10 bg-[#11182c] px-4 py-3 text-sm font-medium text-white shadow-2xl">
          {toastMessage}
        </div>
      )}

      {cardActionNotice && (
        <div className="fixed bottom-20 left-1/2 z-[99] -translate-x-1/2 rounded-2xl border border-[#5448ea]/20 bg-[#151b35] px-4 py-3 text-sm font-medium text-slate-100 shadow-2xl">
          {cardActionNotice}
        </div>
      )}
    </div>
  );
};

export default DashboardLayout;