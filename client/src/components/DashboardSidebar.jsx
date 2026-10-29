import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
  MonitorSmartphone,
  UserRoundPen,
  Wallet,
  Palette,
  LayoutTemplate,
  Package,
  Share2,
  MessagesSquare,
  Gift,
  QrCode,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ExternalLink,
  Images,
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
  // {
  //   id: "payment",
  //   label: "UPI & Payments",
  //   icon: Wallet,
  //   path: "/upi-payments",
  //   badge: { text: "Setup", color: "amber" },
  // },
  {
    id: "themes",
    label: "Website Themes",
    icon: Palette,
    path: "/theme",
    // badge: { text: "5 Themes", color: "violet" },
  },
  {
    id: "profilelayouts",
    label: "Profile Layouts",
    icon: LayoutTemplate,
    path: "/profile-layouts",
    // badge: { text: "10 Layouts", color: "violet" },
  },
  {
    id: "manageproducts",
    label: "Manage Products",
    icon: Package,
    path: "/manageproducts",
    // badge: { text: "1", color: "slate" },
  },
  {
    id: "Gallery",
    label: "Gallery Section",
    icon: Images,
    path: "/gallery",
    // badge: { text: "1", color: "slate" },
  },
  {
    id: "contactbuttons",
    label: "Contact Buttons",
    description: "Manage mini website actions",
    icon: MessagesSquare,
    path: "/contact-buttons",
    // badge: "Manage",
  },
  {
    id: "socialcard",
    label: "Social Media Cards",
    icon: Share2,
    path: "/socialcard",
    // badge: { text: "Thumbnails", color: "rose" },
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
    // badge: { text: "New", color: "emerald" },
  },
  {
    id: "qrcode",
    label: "QR Code & Sharing",
    icon: QrCode,
    path: "/qrcode",
  },
];

const badgeColors = {
  amber: "border-amber-300/20 bg-amber-300/[0.08] text-amber-200",
  violet: "border-violet-300/20 bg-violet-300/[0.08] text-violet-200",
  slate: "border-slate-300/15 bg-slate-300/[0.07] text-slate-300",
  rose: "border-rose-300/20 bg-rose-300/[0.08] text-rose-200",
  emerald: "border-emerald-300/20 bg-emerald-300/[0.08] text-emerald-200",
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
      className={`sticky top-[82px] hidden h-fit shrink-0 self-start lg:block ${
        collapsed ? "w-[76px]" : "w-[250px] xl:w-[270px]"
      } transition-[width] duration-300`}
    >
      <div
        className={`relative flex h-[calc(100vh-98px)] max-h-[calc(100vh-98px)] flex-col overflow-hidden rounded-[18px] border border-[#123A60] bg-[#031B36] shadow-[0_18px_50px_rgba(0,0,0,0.32)] ${
          collapsed ? "p-2" : "p-2.5"
        }`}
      >
        {/* TOP CYAN ACCENT */}
        <div className="absolute left-4 right-4 top-0 h-[2px] rounded-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-90" />

        {/* SIDEBAR HEADER */}
        <div
          className={`mb-2 flex shrink-0 items-center ${
            collapsed ? "justify-center" : "justify-between"
          }`}
        >
          {!collapsed && (
            <div className="flex min-w-0 items-center gap-2.5 px-1.5">
              {/* Logo */}
              <div className="relative flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300 to-blue-600 shadow-[0_0_16px_rgba(34,211,238,0.12)]">
                <div className="absolute inset-[2px] rounded-[10px] bg-[#041D38]" />

                <span className="relative z-10 text-base font-black italic text-cyan-300">
                  B
                </span>
              </div>

              {/* Brand */}
              <div className="min-w-0">
                <p className="truncate text-sm font-bold leading-none text-white">
                  BioWebsite
                </p>

                <p className="mt-1 text-[9px] font-medium text-cyan-300/70">
                  Dashboard
                </p>
              </div>
            </div>
          )}

          {/* COLLAPSE BUTTON */}
          <button
            type="button"
            onClick={onToggle}
            title={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#164467] bg-[#082443] text-slate-400 transition-all duration-200 hover:border-cyan-400/40 hover:bg-[#0B2D50] hover:text-cyan-200 active:scale-95"
          >
            {collapsed ? <ChevronRight size={17} /> : <ChevronLeft size={17} />}
          </button>
        </div>

        {/* DIVIDER */}
        <div className="mb-2 h-px shrink-0 bg-gradient-to-r from-transparent via-[#164467] to-transparent" />

        {/* SECTION HEADER */}
        {!collapsed && (
          <div className="mb-1.5 flex shrink-0 items-center justify-between px-2">
            {/* <span className="text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Main Menu
            </span>

            <span className="rounded-md border border-[#164467] bg-[#082443] px-1.5 py-0.5 text-[9px] font-semibold text-slate-400">
              {sidebarItems.length}
            </span> */}
          </div>
        )}

        {/* NAVIGATION - INDEPENDENT SCROLL */}
        <nav className="min-h-0 flex-1 space-y-1 overflow-y-auto overscroll-contain pr-0.5 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#164467]">
          {sidebarItems.map((item) => {
            const Icon = item.icon;

            const active =
              location.pathname === item.path ||
              location.pathname.startsWith(`${item.path}/`) ||
              (activeNavItem === item.id && location.pathname === item.path);

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleNavigation(item)}
                title={collapsed ? item.label : undefined}
                aria-current={active ? "page" : undefined}
                className={`group relative flex w-full items-center rounded-xl border text-left transition-all duration-200 ${
                  collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-2 py-2"
                } ${
                  active
                    ? "border-cyan-400/20 bg-gradient-to-r from-cyan-400/[0.13] via-blue-400/[0.06] to-transparent text-white shadow-[0_5px_18px_rgba(0,0,0,0.15)]"
                    : "border-transparent text-slate-400 hover:border-[#164467]/80 hover:bg-[#082443] hover:text-slate-100"
                }`}
              >
                {/* ACTIVE LEFT INDICATOR */}
                {active && (
                  <span className="absolute bottom-2 left-0 top-2 w-[3px] rounded-r-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.65)]" />
                )}

                {/* ICON */}
                <span
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-all duration-200 ${
                    active
                      ? "bg-cyan-400/15 text-cyan-200"
                      : "bg-[#082443] text-slate-400 group-hover:bg-[#0B2D50] group-hover:text-cyan-200"
                  }`}
                >
                  <Icon size={17} strokeWidth={active ? 2.15 : 1.8} />
                </span>

                {/* LABEL AND BADGE */}
                {!collapsed && (
                  <>
                    <span
                      className={`min-w-0 flex-1 truncate text-[11px] font-semibold ${
                        active
                          ? "text-white"
                          : "text-slate-300 group-hover:text-white"
                      }`}
                    >
                      {item.label}
                    </span>

                    {item.badge && (
                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-[3px] text-[8px] font-bold ${
                          active
                            ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-100"
                            : typeof item.badge === "object"
                              ? badgeColors[item.badge.color]
                              : "border-cyan-300/20 bg-cyan-300/[0.07] text-cyan-200"
                        }`}
                      >
                        {typeof item.badge === "object"
                          ? item.badge.text
                          : item.badge}
                      </span>
                    )}
                  </>
                )}
              </button>
            );
          })}
        </nav>

        {/* BOTTOM SECTION */}
        <div className="mt-2 shrink-0">
          <div className="mb-2 h-px bg-gradient-to-r from-transparent via-[#164467] to-transparent" />

          {!collapsed && (
            <p className="mb-1.5 px-2 text-[9px] font-bold uppercase tracking-[0.14em] text-slate-500">
              Quick Actions
            </p>
          )}

          {/* PREVIEW */}
          <button
            type="button"
            onClick={() => (onPreview ? onPreview() : navigate("/preview"))}
            title={collapsed ? "Open Preview" : undefined}
            className={`group flex w-full items-center rounded-xl border border-transparent text-slate-300 transition-all duration-200 hover:border-cyan-400/15 hover:bg-[#082443] hover:text-white ${
              collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-2 py-2"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#082443] text-cyan-200 transition-colors group-hover:bg-cyan-400/10">
              <ExternalLink size={17} />
            </span>

            {!collapsed && (
              <span className="text-[11px] font-semibold">Open Preview</span>
            )}
          </button>

          {/* LOGOUT */}
          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`group mt-1 flex w-full items-center rounded-xl border border-transparent text-slate-400 transition-all duration-200 hover:border-rose-400/15 hover:bg-rose-400/[0.07] hover:text-rose-200 ${
              collapsed ? "justify-center px-0 py-2.5" : "gap-2.5 px-2 py-2"
            }`}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#082443] text-rose-300/80 transition-colors group-hover:bg-rose-400/10 group-hover:text-rose-200">
              <LogOut size={17} />
            </span>

            {!collapsed && (
              <span className="text-[11px] font-semibold">Logout</span>
            )}
          </button>

          {/* WORKSPACE CARD */}
          {!collapsed && (
            <div className="mt-2.5 rounded-xl border border-cyan-400/10 bg-gradient-to-br from-[#082443] to-[#061D38] p-2.5">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-cyan-400/15 bg-cyan-400/[0.08]">
                  <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_9px_rgba(34,211,238,0.65)]" />
                </div>

                <div className="min-w-0">
                  <p className="truncate text-[10px] font-bold text-white">
                    BioWebsite Workspace
                  </p>

                  <p className="mt-0.5 truncate text-[8px] text-slate-500">
                    Your business, your identity.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};

export default DashboardSidebar;
