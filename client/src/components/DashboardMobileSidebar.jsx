
import React from "react";
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
} from "lucide-react";

const sidebarItems = [
  {
    id: "mini",
    label: "Live Mini Website View",
    description: "View your business website",
    icon: MonitorSmartphone,
    path: "/mini",
  },
  {
    id: "editprofile",
    label: "Edit Profile & Address",
    description: "Manage business details",
    icon: UserRoundPen,
    path: "/editprofile",
  },
  {
    id: "payment",
    label: "UPI & Payments",
    description: "Payment setup and UPI",
    icon: Wallet,
    path: "/payment",
    badge: "Setup",
  },
  {
    id: "themes",
    label: "Website Themes",
    description: "Customize your website",
    icon: Palette,
    path: "/theme",
    badge: "5 Themes",
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
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[90] bg-black/65 backdrop-blur-[3px] transition-opacity duration-300 lg:hidden ${
          open
            ? "visible opacity-100"
            : "invisible pointer-events-none opacity-0"
        }`}
        aria-hidden="true"
      />

      {/* MOBILE SIDEBAR */}
      <aside
        aria-label="Mobile dashboard navigation"
        aria-hidden={!open}
        className={`fixed inset-y-0 left-0 z-[100] flex h-[100dvh] w-[min(88vw,340px)] flex-col overflow-hidden border-r border-[#29435f] bg-[#0b1b30] shadow-[15px_0_50px_rgba(0,0,0,0.4)] transition-transform duration-300 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* TOP ACCENT */}
        <div className="absolute left-6 right-6 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

        {/* HEADER */}
        <div className="flex shrink-0 items-center justify-between border-b border-[#29435f] px-4 py-4">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10">
              <MonitorSmartphone
                size={23}
                className="text-cyan-300"
              />
            </div>

            <div className="min-w-0">
              <h2 className="text-base font-bold tracking-wide text-white">
                Workspace
              </h2>

              <p className="mt-0.5 text-xs text-slate-300">
                Manage your business
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200 active:scale-95"
          >
            <X size={20} />
          </button>
        </div>

        {/* WORKSPACE INFO */}
        <div className="shrink-0 px-4 pb-3 pt-4">
          <div className="rounded-2xl border border-[#38516e]/80 bg-gradient-to-br from-[#132942] to-[#0d2037] p-3">
            <div className="flex items-center gap-3">
              <div className="min-w-0 flex-1">
                <p className="text-sm font-bold text-white">
                  BioWebsite
                </p>

                <p className="mt-1 text-xs text-slate-300">
                  Your business, your identity.
                </p>
              </div>

              <span
                className="h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.6)]"
                title="Workspace"
              />
            </div>
          </div>
        </div>

        {/* NAVIGATION TITLE */}
        <div className="flex shrink-0 items-center justify-between px-5 pb-2 pt-1">
          <p className="text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
            Main Navigation
          </p>

          <span className="rounded-md border border-[#38516e] bg-[#132942] px-2 py-0.5 text-[11px] font-bold text-slate-200">
            {sidebarItems.length}
          </span>
        </div>

        {/* SCROLLABLE NAVIGATION */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain px-3 pb-4">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`) ||
              activeNavItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item)}
                aria-current={active ? "page" : undefined}
                className={`group relative flex w-full items-center gap-3 overflow-hidden rounded-xl border px-3 py-3 text-left transition-all duration-200 active:scale-[0.98] ${
                  active
                    ? "border-cyan-300/30 bg-gradient-to-r from-cyan-300/15 to-blue-400/[0.07] shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
                    : "border-transparent bg-transparent hover:border-[#38516e]/70 hover:bg-[#132942]"
                }`}
              >
                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                )}

                {/* ICON */}
                <span
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-colors ${
                    active
                      ? "bg-cyan-300/15 text-cyan-200"
                      : "bg-[#132942] text-slate-300 group-hover:bg-[#1a3855] group-hover:text-cyan-200"
                  }`}
                >
                  <Icon
                    size={20}
                    strokeWidth={active ? 2.2 : 1.9}
                  />
                </span>

                {/* LABEL AND DESCRIPTION */}
                <span className="min-w-0 flex-1">
                  <span
                    className={`block truncate text-[13px] font-semibold ${
                      active ? "text-white" : "text-slate-200"
                    }`}
                  >
                    {item.label}
                  </span>

                  <span className="mt-1 block truncate text-[11px] text-slate-300">
                    {item.description}
                  </span>
                </span>

                {/* BADGE */}
                {item.badge && (
                  <span
                    className={`shrink-0 rounded-md border px-1.5 py-1 text-[10px] font-bold ${
                      active
                        ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                        : "border-[#38516e] bg-[#132942] text-slate-200"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}

                <ChevronRight
                  size={15}
                  className={`shrink-0 transition-transform ${
                    active
                      ? "translate-x-0 text-cyan-200"
                      : "text-slate-300 group-hover:translate-x-0.5 group-hover:text-cyan-200"
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* FOOTER / QUICK ACTIONS */}
        <div className="shrink-0 border-t border-[#29435f] bg-[#0b1b30] p-3 pb-[max(12px,env(safe-area-inset-bottom))]">
          <p className="mb-2 px-1 text-[11px] font-bold uppercase tracking-[0.16em] text-slate-300">
            Quick Actions
          </p>

          <button
            type="button"
            onClick={handlePreview}
            className="group flex w-full items-center gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-3 py-2.5 text-left transition hover:border-cyan-300/40 hover:bg-cyan-300/10 active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#132942] text-cyan-200 group-hover:text-cyan-100">
              <ExternalLink size={19} />
            </span>

            <span className="flex-1 text-sm font-semibold text-white">
              Open Preview
              <span className="mt-0.5 block text-[11px] font-normal text-slate-300">
                See your live website
              </span>
            </span>

            <ChevronRight size={17} className="text-cyan-200" />
          </button>

          <button
            type="button"
            onClick={handleLogout}
            className="group mt-2 flex w-full items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-left transition hover:border-rose-300/20 hover:bg-rose-400/[0.08] active:scale-[0.98]"
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#132942] text-rose-200 transition-colors group-hover:bg-rose-300/10">
              <LogOut size={19} />
            </span>

            <span className="flex-1 text-sm font-semibold text-slate-200 group-hover:text-rose-200">
              Logout
              <span className="mt-0.5 block text-[11px] font-normal text-slate-300">
                Sign out of your account
              </span>
            </span>
          </button>
        </div>
      </aside>
    </>
  );
};

export default DashboardMobileSidebar;
