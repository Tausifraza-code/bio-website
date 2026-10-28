
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Menu,
  ExternalLink,
  Copy,
  LogOut,
  Check,
  MessageCircle,
  ChevronDown,
  Zap,
} from "lucide-react";

const DashboardNavbar = ({
  subdomain = "",
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
  const navigate = useNavigate();

  const [copied, setCopied] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ==========================================
  // OPEN CARD PREVIEW
  // Route: /card-preview/:subdomain
  // ==========================================
  const handlePreview = () => {
    if (!subdomain) {
      console.warn("Subdomain is not available for card preview.");
      return;
    }

    setProfileOpen(false);

    navigate(`/card-preview/${encodeURIComponent(subdomain)}`);
  };

  // ==========================================
  // COPY PROFILE LINK
  // ==========================================
  const handleCopy = async () => {
    const profileLink = subdomain
      ? `${window.location.origin}/card-preview/${encodeURIComponent(subdomain)}`
      : window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(profileLink);
      } else {
        const input = document.createElement("textarea");

        input.value = profileLink;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const success = document.execCommand("copy");

        document.body.removeChild(input);

        if (!success) {
          throw new Error("Copy failed");
        }
      }

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (error) {
      console.error("Unable to copy profile link:", error);
    }

    onCopyLink?.();
  };

  // ==========================================
  // WHATSAPP SHARE
  // ==========================================
  const handleWhatsAppShare = () => {
    const profileLink = subdomain
      ? `${window.location.origin}/card-preview/${encodeURIComponent(subdomain)}`
      : window.location.href;

    const message =
      `Hey! 👋\n\n` +
      `Check out my ${businessName} online profile:\n\n` +
      `${profileLink}\n\n` +
      `Thank you for visiting!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#031B36]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      {/* Top cyan line */}
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />

      <div className="flex h-[68px] items-center justify-between px-4 sm:px-5 lg:px-7">
        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-3">
          {/* Mobile Menu */}
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#082443] text-cyan-300 transition-all duration-200 hover:border-cyan-300/35 hover:bg-[#0B2D50] active:scale-95 lg:hidden"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          {/* BioWebsite Logo */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
              <div className="absolute inset-[2px] rounded-[10px] bg-[#041D38]" />

              <span className="relative z-10 text-lg font-black italic text-cyan-300">
                B
              </span>
            </div>

            {/* Brand Name */}
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold leading-none tracking-[-0.02em] text-white sm:text-base">
                BioWebsite
              </p>

              <p className="mt-1 text-[9px] font-medium tracking-[0.04em] text-cyan-300/80 sm:text-[10px]">
                Your Digital Identity
              </p>
            </div>
          </div>
        </div>

        {/* RIGHT SECTION */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-2.5">
          {/* Preview */}
          <button
            type="button"
            onClick={handlePreview}
            className="hidden h-9 items-center gap-2 rounded-lg border border-[#1B456A] bg-[#082443] px-3.5 text-[11px] font-semibold text-slate-300 transition-all duration-200 hover:border-cyan-400/40 hover:bg-[#0B2D50] hover:text-cyan-200 active:scale-[0.97] sm:flex"
          >
            <ExternalLink size={14} />
            <span>Preview</span>
          </button>

          {/* Copy Link */}
          <button
            type="button"
            onClick={handleCopy}
            className={`hidden h-9 items-center gap-2 rounded-lg border px-3.5 text-[11px] font-semibold transition-all duration-200 active:scale-[0.97] md:flex ${
              copied
                ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-200"
                : "border-[#1B456A] bg-[#082443] text-slate-300 hover:border-cyan-400/40 hover:bg-[#0B2D50] hover:text-cyan-200"
            }`}
          >
            {copied ? (
              <>
                <Check size={14} />
                <span>Copied</span>
              </>
            ) : (
              <>
                <Copy size={14} />
                <span>Copy Link</span>
              </>
            )}
          </button>

          {/* Vertical Divider */}
          <div className="mx-1 hidden h-8 w-px bg-[#1B456A] md:block" />

          {/* PROFILE */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              className="flex h-10 items-center gap-2 rounded-xl border border-transparent px-1.5 transition-all duration-200 hover:border-cyan-400/10 hover:bg-[#082443] sm:gap-2.5 sm:px-2"
            >
              {/* Avatar */}
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 p-[1.5px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#082443]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={ownerName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-sm font-bold text-cyan-300">
                        {ownerName?.charAt(0)?.toUpperCase() || "A"}
                      </span>
                    )}
                  </div>
                </div>

                {/* Online */}
                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#031B36] bg-cyan-400" />
              </div>

              {/* User Info */}
              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[130px] truncate text-[12px] font-semibold text-white">
                  {ownerName}
                </p>

                <p className="mt-0.5 max-w-[150px] truncate text-[9px] text-slate-500">
                  {role}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-500 transition-transform duration-200 sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {/* Profile Dropdown */}
            {profileOpen && (
              <div className="absolute right-0 top-[calc(100%+10px)] w-[250px] overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#061D38] shadow-[0_18px_50px_rgba(0,0,0,0.40)]">
                {/* User Header */}
                <div className="border-b border-[#143655] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 p-[1.5px]">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#082443]">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={ownerName}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span className="font-bold text-cyan-300">
                            {ownerName?.charAt(0)?.toUpperCase() || "A"}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {ownerName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {role}
                      </p>
                    </div>
                  </div>

                  {/* Status */}
                  {status && (
                    <div className="mt-3 flex items-center gap-2 rounded-lg border border-amber-400/15 bg-amber-400/[0.06] px-2.5 py-2">
                      <Zap
                        size={12}
                        className="shrink-0 text-amber-300"
                      />

                      <span className="truncate text-[9px] font-semibold tracking-[0.04em] text-amber-300">
                        {status}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dropdown Actions */}
                <div className="p-2">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-[#0B2D50] hover:text-cyan-200"
                  >
                    <ExternalLink size={15} />
                    View Public Profile
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-[#0B2D50] hover:text-cyan-200"
                  >
                    <Copy size={15} />
                    Copy Profile Link
                  </button>

                  <div className="my-1 border-t border-[#143655]" />

                  <button
                    type="button"
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-rose-300 transition-colors hover:bg-rose-400/10"
                  >
                    <LogOut size={15} />
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile Logout */}
          <button
            type="button"
            onClick={onLogout}
            title="Logout"
            aria-label="Logout"
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-rose-400/15 bg-rose-400/[0.04] text-slate-400 transition-all duration-200 hover:border-rose-400/30 hover:bg-rose-400/10 hover:text-rose-300 active:scale-95 sm:hidden"
          >
            <LogOut size={15} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default DashboardNavbar;
