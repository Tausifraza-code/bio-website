
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
    path: "/dashboard",
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
  amber: "border-amber-400/40 bg-amber-400/10 text-amber-300",
  violet: "border-violet-400/40 bg-violet-400/10 text-violet-300",
  slate: "border-white/20 bg-white/5 text-slate-300",
  rose: "border-rose-400/40 bg-rose-400/10 text-rose-300",
  emerald: "border-emerald-400/40 bg-emerald-400/10 text-emerald-300",
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
    if (onNavClick) {
      onNavClick(item.id);
    }

    navigate(item.path);
  };

  return (
    <aside
      className={`hidden shrink-0 lg:block ${
        collapsed ? "w-[68px]" : "w-[260px] xl:w-[275px]"
      } transition-all duration-300`}
    >
      <div className="sticky top-[92px] rounded-[24px] border border-emerald-500/15 bg-[#04140f]/80 p-3 shadow-xl shadow-black/30 backdrop-blur-xl">
        {/* ---------- HEADER ---------- */}
        <div
          className={`mb-3 flex items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="px-2">
              <p className="text-[11px] font-bold uppercase tracking-wider text-emerald-300/80">
                Navigation
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 transition hover:bg-emerald-500/10"
          >
            {collapsed ? (
              <ChevronRight size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </button>
        </div>

        {/* ---------- MENU ---------- */}
        <nav className="space-y-1">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              (activeNavItem === item.id &&
                location.pathname === item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group flex w-full items-center rounded-xl text-[13px] font-medium transition ${
                  collapsed
                    ? "justify-center px-0 py-3"
                    : "gap-3 px-3 py-2.5"
                } ${
                  active
                    ? "bg-gradient-to-r from-emerald-400 to-cyan-500 text-[#04140f] shadow-lg shadow-emerald-500/25"
                    : "text-slate-300 hover:bg-emerald-500/10 hover:text-white"
                }`}
              >
                <Icon
                  size={18}
                  className={`shrink-0 ${
                    active
                      ? "text-[#04140f]"
                      : "text-emerald-300/70 group-hover:text-emerald-300"
                  }`}
                />

                {!collapsed && (
                  <>
                    <span className="flex-1 truncate text-left">
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={`rounded-md border px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide ${
                          active
                            ? "border-[#04140f]/30 bg-[#04140f]/20 text-[#04140f]"
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

        {/* ---------- DIVIDER ---------- */}
        <div className="my-3 h-px bg-emerald-500/15" />

        {/* ---------- FOOTER ACTIONS ---------- */}
        <div className="space-y-1">
          <button
            type="button"
            onClick={() =>
              onPreview ? onPreview() : navigate("/preview")
            }
            title={collapsed ? "Open Preview" : undefined}
            className={`flex w-full items-center rounded-xl text-[13px] font-medium text-slate-300 transition hover:bg-emerald-500/10 hover:text-white ${
              collapsed
                ? "justify-center px-0 py-3"
                : "gap-3 px-3 py-2.5"
            }`}
          >
            <ExternalLink
              size={18}
              className="shrink-0 text-emerald-300/70"
            />
            {!collapsed && <span>Open Preview</span>}
          </button>

          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center rounded-xl text-[13px] font-medium text-slate-300 transition hover:bg-red-500/10 hover:text-red-300 ${
              collapsed
                ? "justify-center px-0 py-3"
                : "gap-3 px-3 py-2.5"
            }`}
          >
            <LogOut
              size={18}
              className="shrink-0 text-red-300/70"
            />
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
