import React, { useState } from "react";
import {
  Menu,
  ExternalLink,
  Copy,
  LogOut,
  Check,
  Zap,
} from "lucide-react";

const DashboardNavbar = ({
  ownerName = "ankit",
  businessName = "ankit's Business",
  role = "Business Owner / Professional",
  avatarUrl = "",
  status = "ACTIVATION PENDING",
  onMenuClick,
  onPreview,
  onCopyLink,
  onLogout,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {}
    onCopyLink?.();
  };

  return (
    <header className="sticky top-0 z-40 border-b border-emerald-500/10 bg-[#04140f]/90 backdrop-blur-2xl">
      {/* Top accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-emerald-400 via-cyan-400 to-transparent" />

      <div className="mx-auto flex h-[76px] max-w-[1500px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">

        {/* ---------- LEFT ---------- */}
        <div className="flex min-w-0 items-center gap-3">

          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/5 text-emerald-300 transition hover:bg-emerald-500/10 lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Avatar with glow ring */}
          <div className="relative shrink-0">
            <div className="absolute inset-0 rounded-full bg-emerald-400/30 blur-md" />
            <div className="relative h-11 w-11 overflow-hidden rounded-full ring-2 ring-emerald-400/60">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={businessName}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-emerald-400 to-cyan-500 text-sm font-black text-[#04140f]">
                  {businessName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
            {/* Pulsing online dot */}
            <span className="absolute -bottom-0.5 -right-0.5 flex h-3.5 w-3.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-[#04140f] bg-emerald-400" />
            </span>
          </div>

          {/* Name + badge + subtitle */}
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <p className="truncate text-[15px] font-bold text-white">
                {businessName}
              </p>

              {status && (
                <span className="hidden items-center gap-1 rounded-full border border-amber-400/40 bg-amber-400/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-300 sm:inline-flex">
                  <Zap size={10} className="fill-amber-300" />
                  {status}
                </span>
              )}
            </div>

            <p className="truncate text-[11px] text-emerald-200/60">
              <span className="font-semibold text-emerald-100/90">{ownerName}</span>
              <span className="mx-1 text-emerald-500/50">·</span>
              {role}
            </p>
          </div>
        </div>

        {/* ---------- RIGHT ---------- */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">

          {/* Menu button — gradient emerald→cyan */}
          <button
            type="button"
            onClick={onMenuClick}
            className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-3.5 py-2.5 text-xs font-bold text-[#04140f] shadow-lg shadow-emerald-500/25 transition hover:shadow-emerald-400/40 hover:brightness-110 active:scale-[0.97] sm:flex"
          >
            <Menu size={15} />
            Menu
          </button>

          {/* Card Preview — amber/gold outline */}
          <button
            type="button"
            onClick={onPreview}
            className="hidden items-center gap-2 rounded-xl border border-amber-400/50 bg-amber-400/5 px-3.5 py-2.5 text-xs font-bold text-amber-300 transition hover:border-amber-400 hover:bg-amber-400/10 active:scale-[0.97] sm:flex"
          >
            <ExternalLink size={15} />
            Card Preview
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className="hidden items-center gap-2 rounded-xl border border-emerald-500/20 bg-emerald-500/5 px-3.5 py-2.5 text-xs font-bold text-emerald-200 transition hover:bg-emerald-500/10 active:scale-[0.97] md:flex"
          >
            {copied ? (
              <>
                <Check size={15} className="text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                Copy Link
              </>
            )}
          </button>

          {/* Divider */}
          <div className="hidden h-7 w-px bg-emerald-500/20 md:block" />

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/5 text-red-300 transition hover:border-red-400/40 hover:bg-red-500/15 active:scale-[0.95]"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;