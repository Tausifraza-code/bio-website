import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  GitBranch,
  CreditCard,
  QrCode,
  Settings,
  LogOut,
  ShieldCheck,
  X,
  PanelLeftClose,
  PanelLeftOpen,
} from "lucide-react";

const menuItems = [
  {
    label: "Overview",
    path: "/admin",
    icon: LayoutDashboard,
  },
  {
    label: "Users",
    path: "/admin/users",
    icon: Users,
  },
  {
    label: "Referrals",
    path: "/admin/referrals",
    icon: GitBranch,
  },
  {
    label: "QR Management",
    path: "/admin/qr-management",
    icon: QrCode,
  },
  {
    label: "Plans",
    path: "/admin/plans",
    icon: CreditCard,
  },

  {
    label: "Settings",
    path: "/admin/settings",
    icon: Settings,
  },
];

export default function AdminSidebar({
  open = true,
  onClose,
  onLogout,
  branding,
  collapsed = false,
  onToggleCollapse,
}) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar overlay"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-50 flex flex-col border-r border-slate-200 bg-white text-slate-900 transition-all duration-300 dark:border-slate-800 dark:bg-[#0b1728] dark:text-white lg:translate-x-0 ${
          collapsed ? "w-64 lg:w-[120px]" : "w-64"
        } ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div
          className={`relative flex h-20 shrink-0 items-center border-b border-slate-200 dark:border-slate-800 ${
            collapsed ? "justify-center px-2" : "justify-between px-4"
          }`}
        >
          {/* Logo */}
          <div className="flex min-w-0 items-center gap-3">
            {branding?.websiteLogo ? (
              <img
                src={branding.websiteLogo}
                alt="Logo"
                className="h-11 w-11 shrink-0 rounded-lg object-contain"
              />
            ) : (
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800">
                <ShieldCheck size={23} className="text-cyan-500" />
              </div>
            )}

            <div className={collapsed ? "lg:hidden" : ""}>
              <h2 className="truncate font-bold">
                {branding?.websiteName || "BIO Admin"}
              </h2>
            </div>
          </div>

          {/* Minimize / Expand Button */}
          <button
            type="button"
            onClick={onToggleCollapse}
            aria-label={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            title={collapsed ? "Expand sidebar" : "Minimize sidebar"}
            className={`hidden h-8 w-8 shrink-0 items-center justify-center rounded-lg transition-colors hover:bg-slate-100 dark:hover:bg-slate-800 lg:flex ${
              collapsed ? "absolute right-1 top-1/2 -translate-y-1/2" : ""
            }`}
          >
            {collapsed ? (
              <PanelLeftOpen size={18} />
            ) : (
              <PanelLeftClose size={18} />
            )}
          </button>

          <button
            type="button"
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-2 hover:bg-slate-100 dark:hover:bg-slate-800 lg:hidden"
          >
            <X size={19} />
          </button>
        </div>

        <div className={`px-4 pb-2 pt-6 ${collapsed ? "lg:hidden" : ""}`}>
          <p className="px-3 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-400">
            Workspace
          </p>
        </div>

        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-2">
          {menuItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/admin"}
                onClick={onClose}
                title={collapsed ? item.label : undefined}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-all ${
                    collapsed ? "lg:justify-center lg:px-0" : ""
                  } ${
                    isActive
                      ? "bg-cyan-500/10 text-cyan-700 ring-1 ring-cyan-500/20 dark:text-cyan-300"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800/70 dark:hover:text-white"
                  }`
                }
              >
                <Icon size={19} strokeWidth={1.8} />
                <span className={collapsed ? "lg:hidden" : ""}>
                  {item.label}
                </span>
              </NavLink>
            );
          })}
        </nav>

        <div className="border-t border-slate-200 p-4 dark:border-slate-800">
          <div
            className={`mb-3 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/60 ${
              collapsed ? "lg:hidden" : ""
            }`}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300">
                <ShieldCheck size={19} />
              </div>

              <div className="min-w-0">
                <p className="truncate text-sm font-semibold">Administrator</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Admin access
                </p>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onLogout}
            title={collapsed ? "Logout" : undefined}
            className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold text-red-600 transition hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10 ${
              collapsed ? "lg:justify-center lg:px-0" : ""
            }`}
          >
            <LogOut size={19} />
            <span className={collapsed ? "lg:hidden" : ""}>Logout</span>
          </button>
        </div>
      </aside>
    </>
  );
}
