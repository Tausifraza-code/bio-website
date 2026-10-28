
import React, { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  MonitorSmartphone,
  UserRoundPen,
  Wallet,
  Palette,
  Package,
  Share2,
  MessagesSquare,
  Gift,
  QrCode,
  X,
  LogOut,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  LayoutTemplate,
} from "lucide-react";

const sidebarItems = [
  {
    id: "mini",
    label: "Live Mini Website",
    description: "View your business website",
    icon: MonitorSmartphone,
    path: "/mini",
  },
  {
    id: "editprofile",
    label: "Edit Profile",
    description: "Manage business details",
    icon: UserRoundPen,
    path: "/editprofile",
  },
  // {
  //   id: "payment",
  //   label: "UPI & Payments",
  //   description: "Payment setup and UPI",
  //   icon: Wallet,
  //   path: "/payment",
  //   badge: "Setup",
  // },
  {
    id: "themes",
    label: "Website Themes",
    description: "Customize your website",
    icon: Palette,
    path: "/theme",
    badge: "5 Themes",
  },
  {
    id: "profilelayouts",
    label: "Profile Layouts",
    description: "Choose your profile design",
    icon: LayoutTemplate,
    path: "/profile-layouts",
    badge: "10 Layouts",
  },
  {
    id: "manageproducts",
    label: "Manage Products",
    description: "Add and manage products",
    icon: Package,
    path: "/manageproducts",
    badge: "1",
  },
  {
    id: "contactbuttons",
    label: "Contact Buttons",
    description: "Manage mini website actions",
    icon: MessagesSquare,
    path: "/contact-buttons",
    badge: "Manage",
  },
  {
    id: "socialcard",
    label: "Social Media Cards",
    description: "Create promotional cards",
    icon: Share2,
    path: "/socialcard",
    badge: "Cards",
  },
  {
    id: "leads",
    label: "Leads & Inquiries",
    description: "Manage customer inquiries",
    icon: MessagesSquare,
    path: "/leads",
  },
  {
    id: "refer",
    label: "Refer & Earn",
    description: "Invite and earn rewards",
    icon: Gift,
    path: "/refer",
    badge: "New",
  },
  {
    id: "qrcode",
    label: "QR Code & Sharing",
    description: "Share your business online",
    icon: QrCode,
    path: "/qrcode",
  },
];

const DashboardMobileSidebar = ({
  open,
  activeNavItem,
  onClose,
  onNavClick,
  onPreview,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Close the sidebar when the Escape key is pressed.
  useEffect(() => {
    if (!open) return;

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose?.();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [open, onClose]);

  // Prevent the page behind the sidebar from scrolling on mobile.
  useEffect(() => {
    if (!open) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [open]);

  const isItemActive = (item) => {
    const currentPath = location.pathname.replace(/\/+$/, "") || "/";
    const itemPath = item.path.replace(/\/+$/, "") || "/";

    return (
      activeNavItem === item.id ||
      currentPath === itemPath ||
      currentPath.startsWith(`${itemPath}/`)
    );
  };

  const handleNavigation = (item) => {
    onNavClick?.(item.id);
    navigate(item.path);
    onClose?.();
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      navigate("/preview");
    }

    onClose?.();
  };

  const handleLogout = () => {
    onClose?.();
    onLogout?.();
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close navigation menu"
        tabIndex={open ? 0 : -1}
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-[#020817]/75 backdrop-blur-sm transition-opacity duration-300 lg:hidden ${open
            ? "pointer-events-auto opacity-100"
            : "pointer-events-none opacity-0"
          }`}
      />

      {/* Mobile Sidebar */}
      <aside
        id="dashboard-mobile-sidebar"
        aria-label="Dashboard navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[100] flex h-[100dvh] w-[min(88vw,360px)] flex-col overflow-hidden border-r border-cyan-400/15 bg-[#06162B] text-white shadow-[20px_0_70px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-in-out lg:hidden ${open ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        {/* Top Branding */}
        <div className="relative shrink-0 overflow-hidden border-b border-white/[0.07] px-5 pb-5 pt-[max(1.25rem,env(safe-area-inset-top))]">
          <div className="pointer-events-none absolute -right-12 -top-16 h-40 w-40 rounded-full bg-cyan-400/10 blur-3xl" />

          <div className="relative flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-gradient-to-br from-cyan-300 to-cyan-500 text-[#042039] shadow-lg shadow-cyan-500/15">
                <LayoutDashboard size={22} strokeWidth={2.4} />
              </div>

              <div className="min-w-0">
                <h2 className="truncate text-base font-extrabold tracking-tight text-white">
                  BioWebsite
                </h2>
                <p className="mt-0.5 text-[11px] font-medium tracking-wide text-slate-400">
                  BUSINESS WORKSPACE
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={onClose}
              aria-label="Close sidebar"
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-white/[0.04] text-slate-300 transition hover:border-cyan-300/30 hover:bg-cyan-300/10 hover:text-cyan-300 active:scale-95"
            >
              <X size={20} />
            </button>
          </div>

          {/* Workspace Card */}
          <div className="relative mt-5 rounded-2xl border border-cyan-300/15 bg-gradient-to-r from-[#0C2946] to-[#0A2038] p-4">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-300">
                <MonitorSmartphone size={20} />
              </div>

              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-bold text-white">
                  Your Workspace
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  Your business, your identity
                </p>
              </div>

              <span className="h-2 w-2 shrink-0 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.6)]" />
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="shrink-0 px-5 pb-3 pt-5">
          <div className="flex items-center justify-between">
            <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
              Main Navigation
            </p>

            <span className="rounded-lg border border-white/[0.07] bg-white/[0.04] px-2 py-1 text-[10px] font-bold tabular-nums text-slate-400">
              {sidebarItems.length} ITEMS
            </span>
          </div>
        </div>

        {/* Scrollable Navigation Items */}
        <nav className="min-h-0 flex-1 space-y-1.5 overflow-y-auto overscroll-contain px-3 pb-5 [scrollbar-color:#1e425d_transparent] [scrollbar-width:thin]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = isItemActive(item);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl border px-3 py-3 text-left transition-all duration-200 active:scale-[0.99] ${active
                    ? "border-cyan-300/25 bg-gradient-to-r from-cyan-400/[0.15] to-cyan-400/[0.04] shadow-[inset_3px_0_0_#22d3ee]"
                    : "border-transparent bg-transparent hover:border-white/[0.06] hover:bg-white/[0.04]"
                  }`}
              >
                {/* Icon */}
                <div
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border transition-all duration-200 ${active
                      ? "border-cyan-300/20 bg-cyan-300/15 text-cyan-300"
                      : "border-white/[0.06] bg-[#0C2037] text-slate-400 group-hover:border-cyan-300/15 group-hover:text-cyan-300"
                    }`}
                >
                  <Icon size={19} strokeWidth={active ? 2.2 : 1.8} />
                </div>

                {/* Label and Description */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className={`truncate text-[13px] font-bold ${active
                          ? "text-cyan-200"
                          : "text-slate-200 group-hover:text-white"
                        }`}
                    >
                      {item.label}
                    </span>

                    {active && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(103,232,249,0.7)]" />
                    )}
                  </div>

                  <p className="mt-1 truncate text-[11px] leading-4 text-slate-500 transition-colors group-hover:text-slate-400">
                    {item.description}
                  </p>
                </div>

                {/* Optional Badge */}
                {item.badge && (
                  <span
                    className={`shrink-0 rounded-lg border px-2 py-1 text-[9px] font-bold ${active
                        ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                        : item.badge === "New"
                          ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-300"
                          : "border-white/[0.07] bg-white/[0.04] text-slate-400"
                      }`}
                  >
                    {item.badge}
                  </span>
                )}

                <ChevronRight
                  size={15}
                  className={`shrink-0 transition-all duration-200 ${active
                      ? "translate-x-0 text-cyan-300"
                      : "-translate-x-1 text-slate-600 opacity-0 group-hover:translate-x-0 group-hover:text-slate-300 group-hover:opacity-100"
                    }`}
                />
              </button>
            );
          })}
        </nav>

        {/* Bottom Quick Actions */}
        <div className="shrink-0 border-t border-white/[0.07] bg-[#041225] px-4 pb-[max(1rem,env(safe-area-inset-bottom))] pt-4">
          <p className="mb-3 px-1 text-[10px] font-extrabold uppercase tracking-[0.2em] text-slate-500">
            Quick Actions
          </p>

          <button
            type="button"
            onClick={handlePreview}
            className="group flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-gradient-to-r from-cyan-300 to-cyan-400 px-4 py-3 text-sm font-extrabold text-[#06213A] shadow-lg shadow-cyan-500/10 transition hover:from-cyan-200 hover:to-cyan-300 active:scale-[0.98]"
          >
            <ExternalLink size={17} />
            <span>Open Preview</span>
            <ChevronRight
              size={16}
              className="ml-auto transition-transform group-hover:translate-x-0.5"
            />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm font-semibold text-slate-400 transition hover:border-rose-400/20 hover:bg-rose-400/[0.07] hover:text-rose-300 active:scale-[0.98]"
          >
            <LogOut size={17} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardMobileSidebar;
