
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
    <header className="sticky top-0 z-40 border-b border-cyan-400/10 bg-[#071326]/95 shadow-[0_8px_30px_rgba(0,0,0,0.20)] backdrop-blur-2xl">
      {/* Electric cyan accent line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-300 via-blue-500 to-transparent" />

      <div className="mx-auto flex h-[76px] max-w-[1600px] items-center justify-between gap-3 px-4 sm:px-6 lg:px-8">
        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-3 sm:gap-4">
          {/* Mobile menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#10213a] text-cyan-300 transition-all duration-200 hover:border-cyan-300/40 hover:bg-[#163453] active:scale-95 lg:hidden"
          >
            <Menu size={20} />
          </button>

          {/* Business avatar */}
          <div className="relative shrink-0">
            <div className="h-11 w-11 rounded-2xl bg-gradient-to-br from-cyan-300 to-blue-500 p-[2px] shadow-[0_0_18px_rgba(34,211,238,0.10)]">
              <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-[14px] bg-[#10213a]">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={businessName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <span className="text-lg font-bold text-cyan-300">
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>
            </div>

            {/* Online indicator */}
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full border-[3px] border-[#071326] bg-cyan-300" />
          </div>

          {/* Business details */}
          <div className="min-w-0">
            <div className="flex min-w-0 flex-wrap items-center gap-2">
              <p className="max-w-[220px] truncate text-sm font-semibold tracking-[-0.02em] text-slate-50 sm:max-w-none sm:text-[15px]">
                {businessName}
              </p>

              {status && (
                <span className="hidden items-center gap-1.5 rounded-lg border border-amber-400/20 bg-amber-400/[0.07] px-2 py-1 text-[9px] font-semibold tracking-[0.07em] text-amber-300 sm:inline-flex">
                  <Zap size={11} />
                  {status}
                </span>
              )}
            </div>

            <p className="mt-1 truncate text-[11px] text-slate-400 sm:text-xs">
              <span className="font-medium text-slate-200">
                {ownerName}
              </span>
              <span className="mx-1.5 text-slate-600">/</span>
              <span>{role}</span>
            </p>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            className="hidden h-10 items-center gap-2 rounded-xl bg-cyan-300 px-4 text-xs font-bold text-[#071326] shadow-sm shadow-cyan-400/10 transition-all duration-200 hover:bg-cyan-200 hover:shadow-md hover:shadow-cyan-400/20 active:scale-[0.97] sm:flex"
          >
            <Menu size={16} strokeWidth={2.2} />
            <span>Menu</span>
          </button>

          {/* Card Preview */}
          <button
            type="button"
            onClick={onPreview}
            className="hidden h-10 items-center gap-2 rounded-xl border border-[#29425f] bg-[#10213a]/80 px-3.5 text-xs font-medium text-slate-200 transition-all duration-200 hover:border-cyan-300/40 hover:bg-[#15314e] hover:text-cyan-200 active:scale-[0.97] sm:flex"
          >
            <ExternalLink size={15} />
            <span>Card Preview</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className={`hidden h-10 items-center gap-2 rounded-xl border px-3.5 text-xs font-medium transition-all duration-200 active:scale-[0.97] md:flex ${
              copied
                ? "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                : "border-[#29425f] bg-[#10213a]/80 text-slate-300 hover:border-cyan-300/30 hover:bg-[#15314e] hover:text-cyan-200"
            }`}
          >
            {copied ? (
              <>
                <Check size={15} />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy size={15} />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Divider */}
          <div className="mx-1 hidden h-7 w-px bg-[#29425f] md:block" />

          {/* Logout */}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-rose-400/15 bg-rose-400/[0.04] text-slate-400 transition-all duration-200 hover:border-rose-400/35 hover:bg-rose-400/10 hover:text-rose-300 active:scale-95"
          >
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
