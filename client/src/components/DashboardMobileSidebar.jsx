import React from "react";
import {
  X,
  LayoutDashboard,
  UserRound,
  Palette,
  Eye,
  CreditCard,
  QrCode,
  Settings,
  ExternalLink,
  LogOut,
} from "lucide-react";

const sidebarItems = [
  {
    id: "overview",
    label: "Overview",
    icon: LayoutDashboard,
  },
  {
    id: "profile",
    label: "Profile",
    icon: UserRound,
  },
  {
    id: "themes",
    label: "Themes",
    icon: Palette,
  },
  {
    id: "preview",
    label: "Preview",
    icon: Eye,
  },
  {
    id: "plans",
    label: "Plans & Payment",
    icon: CreditCard,
  },
  {
    id: "qr",
    label: "QR Code",
    icon: QrCode,
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
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
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 lg:hidden">
      <button
        type="button"
        aria-label="Close sidebar"
        onClick={onClose}
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
      />

      <aside className="relative h-full w-[88vw] max-w-[310px] overflow-y-auto bg-[#090e1f] p-4 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-base font-black text-white">
              Dashboard
            </p>
            <p className="mt-1 text-[11px] text-slate-500">
              Manage your profile
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10 hover:text-white"
          >
            <X size={18} />
          </button>
        </div>

        <nav className="space-y-1.5">
          {sidebarItems.map((item) => {
            const Icon = item.icon;
            const active = activeNavItem === item.id;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => onNavClick(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition ${
                  active
                    ? "bg-[#5448ea] text-white shadow-lg shadow-[#5448ea]/20"
                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                }`}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="my-5 h-px bg-white/10" />

        <div className="space-y-1.5">
          <button
            type="button"
            onClick={onPreview}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-white/5 hover:text-white"
          >
            <ExternalLink size={18} />
            <span>Open Preview</span>
          </button>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium text-slate-400 transition hover:bg-red-500/10 hover:text-red-300"
          >
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </div>
  );
};

export default DashboardMobileSidebar;