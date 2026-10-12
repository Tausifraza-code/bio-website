
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
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
} from "lucide-react";

const sidebarItems = [
  {
    id: "mini",
    label: "Live Mini Website View",
    icon: MonitorSmartphone,
    path: "/mini",
  },
  {
    id: "editprofile",
    label: "Edit Profile & Address",
    icon: UserRoundPen,
    path: "/editprofile",
  },
  {
    id: "payment",
    label: "UPI & Payments",
    icon: Wallet,
    path: "/payment",
    badge: { text: "Setup", color: "amber" },
  },
  {
    id: "themes",
    label: "Website Themes",
    icon: Palette,
    path: "/theme",
    badge: { text: "5 Themes", color: "violet" },
  },
  {
    id: "manageproducts",
    label: "Manage Products",
    icon: Package,
    path: "/manageproducts",
    badge: { text: "1", color: "slate" },
  },
  {
    id: "socialcard",
    label: "Social Media Cards",
    icon: Share2,
    path: "/socialcard",
    badge: { text: "Thumbnails", color: "rose" },
  },
  {
    id: "leads",
    label: "Leads & Inquiries",
    icon: MessagesSquare,
    path: "/leads",
  },
  {
    id: "refer",
    label: "Refer & Earn",
    icon: Gift,
    path: "/refer",
    badge: { text: "New", color: "emerald" },
  },
  {
    id: "qrcode",
    label: "QR Code & Sharing",
    icon: QrCode,
    path: "/qrcode",
  },
];

const badgeColors = {
  amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
  slate: "border-slate-300/20 bg-slate-300/10 text-slate-200",
  rose: "border-rose-300/25 bg-rose-300/10 text-rose-200",
  emerald: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
};

const DashboardSidebar = ({
  collapsed,
  activeNavItem,
  onNavClick,
  onToggle,
  onPreview,
  onLogout,
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (item) => {
    onNavClick?.(item.id);
    navigate(item.path);
  };

  return (
    <aside
      className={`hidden shrink-0 lg:block ${
        collapsed ? "w-[76px]" : "w-[270px] xl:w-[285px]"
      } transition-[width] duration-300`}
    >
      <div
        className={`sticky top-[92px] overflow-hidden rounded-[20px] border border-[#29435f] bg-[#0b1b30] p-2.5 shadow-[0_16px_45px_rgba(0,0,0,0.28)] ${
          collapsed ? "px-2" : "sm:p-3"
        }`}
      >
        {/* TOP ACCENT */}
        <div className="absolute left-5 right-5 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-80" />

        {/* HEADER */}
        <div
          className={`mb-3 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex items-center gap-2.5 px-1">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                <MonitorSmartphone
                  size={20}
                  className="text-cyan-300"
                />
              </div>

              <div>
                <h2 className="text-base font-bold tracking-wide text-white">
                  Workspace
                </h2>
                <p className="mt-0.5 text-xs text-slate-300">
                  Manage your business
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-200 transition-all hover:border-cyan-300/50 hover:bg-[#193754] hover:text-cyan-200 active:scale-95"
          >
            {collapsed ? (
              <ChevronRight size={19} />
            ) : (
              <ChevronLeft size={19} />
            )}
          </button>
        </div>

        {/* SECTION TITLE */}
        {!collapsed && (
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Main Navigation
            </span>

            <span className="rounded-md border border-[#38516e] bg-[#132942] px-2 py-0.5 text-xs font-semibold text-slate-200">
              {sidebarItems.length}
            </span>
          </div>
        )}

        {/* NAVIGATION ITEMS */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`) ||
              (activeNavItem === item.id &&
                location.pathname === item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group relative flex w-full items-center rounded-xl border text-sm font-medium transition-all duration-200 ${
                  collapsed
                    ? "justify-center px-0 py-2.5"
                    : "gap-2.5 px-2.5 py-2"
                } ${
                  active
                    ? "border-cyan-300/35 bg-gradient-to-r from-cyan-300/15 to-blue-400/[0.07] text-white shadow-[0_4px_15px_rgba(0,0,0,0.12)]"
                    : "border-transparent bg-transparent text-slate-200 hover:border-[#38516e]/70 hover:bg-[#132942] hover:text-white"
                }`}
              >
                {/* ACTIVE INDICATOR */}
                {active && (
                  <span className="absolute bottom-1.5 left-0 top-1.5 w-[3px] rounded-r-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.5)]" />
                )}

                {/* ICON BOX */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    active
                      ? "bg-cyan-300/15 text-cyan-200"
                      : "bg-[#132942] text-slate-300 group-hover:bg-[#1a3855] group-hover:text-cyan-200"
                  }`}
                >
                  <Icon
                    size={19}
                    strokeWidth={active ? 2.2 : 1.9}
                  />
                </span>

                {!collapsed && (
                  <>
                    <span className="min-w-0 flex-1 truncate text-left text-sm font-semibold">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-0.5 text-[11px] font-bold ${
                          active
                            ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-100"
                            : badgeColors[item.badge.color]
                        }`}
                      >
                        {item.badge.text}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* DIVIDER */}
        <div className="my-3.5 h-px bg-gradient-to-r from-transparent via-[#38516e] to-transparent" />

        {/* QUICK ACTIONS */}
        {!collapsed && (
          <p className="mb-2 px-2 text-xs font-bold uppercase tracking-wider text-slate-300">
            Quick Actions
          </p>
        )}

        <div className="space-y-1">
          {/* PREVIEW */}
          <button
            type="button"
            onClick={() =>
              onPreview ? onPreview() : navigate("/preview")
            }
            title={collapsed ? "Open Preview" : undefined}
            className={`group flex w-full items-center rounded-xl border border-transparent text-sm font-semibold text-slate-200 transition-all hover:border-cyan-300/20 hover:bg-[#132942] hover:text-white ${
              collapsed
                ? "justify-center px-0 py-2.5"
                : "gap-2.5 px-2.5 py-2"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#132942] text-cyan-200 transition-colors group-hover:bg-cyan-300/10">
              <ExternalLink size={19} />
            </span>

            {!collapsed && <span>Open Preview</span>}
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`group flex w-full items-center rounded-xl border border-transparent text-sm font-semibold text-slate-200 transition-all hover:border-rose-300/20 hover:bg-rose-400/[0.08] hover:text-rose-200 ${
              collapsed
                ? "justify-center px-0 py-2.5"
                : "gap-2.5 px-2.5 py-2"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#132942] text-rose-200 transition-colors group-hover:bg-rose-300/10">
              <LogOut size={19} />
            </span>

            {!collapsed && <span>Logout</span>}
          </button>
        </div>

        {/* WORKSPACE FOOTER CARD */}
        {!collapsed && (
          <div className="mt-3.5 rounded-xl border border-[#38516e]/80 bg-gradient-to-br from-[#132942] to-[#0d2037] p-2.5">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-300/20 bg-cyan-300/10">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-white">
                  BioWebsite Workspace
                </p>
                <p className="mt-0.5 text-xs text-slate-300">
                  Your business, your identity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};

export default DashboardSidebar;
