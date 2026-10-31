
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Menu,
  ExternalLink,
  Copy,
  LogOut,
  Check,
  ChevronDown,
  Zap,
} from "lucide-react";

import { getMe, logoutUser, logout } from "../redux/slice/authSlice";

const DashboardNavbar = ({
  subdomain = "",
  ownerName,
  businessName,
  role,
  avatarUrl = "",
  status = "ACTIVATION PENDING",
  onMenuClick,
  onPreview,
  onCopyLink,
  onLogout,
}) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const dropdownRef = useRef(null);

  const { user, token, getMeLoading } = useSelector(
    (state) => state.auth || {},
  );

  const [copied, setCopied] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // ==========================================
  // GET CURRENT USER FROM BACKEND
  // ==========================================
  useEffect(() => {
    if (token || localStorage.getItem("bioToken")) {
      dispatch(getMe());
    }
  }, [dispatch, token]);

  // ==========================================
  // LOGGED-IN USER NAME
  // ONLY BACKEND USER NAME IS USED
  // ==========================================
  const loggedInUserName =
    typeof user?.fullName === "string"
      ? user.fullName.trim()
      : "";

  // ==========================================
  // DISPLAY NAME
  // ==========================================
  const displayName = loggedInUserName;

  // ==========================================
  // BUSINESS NAME
  // ==========================================
  const displayBusinessName =
    typeof user?.businessName === "string"
      ? user.businessName.trim()
      : typeof businessName === "string"
        ? businessName.trim()
        : "";

  // ==========================================
  // ROLE
  // ==========================================
  const displayRole =
    typeof user?.role === "string" && user.role.trim()
      ? user.role.charAt(0).toUpperCase() + user.role.slice(1)
      : typeof role === "string"
        ? role
        : "";

  // ==========================================
  // AVATAR INITIAL
  // STRICTLY FROM LOGGED-IN USER FULL NAME
  // ==========================================
  const displayInitial = loggedInUserName
    ? loggedInUserName.charAt(0).toUpperCase()
    : "";

  // ==========================================
  // CLOSE DROPDOWN ON OUTSIDE CLICK / ESC
  // ==========================================
  useEffect(() => {
    if (!profileOpen) return;

    const handleClickOutside = (event) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target)
      ) {
        setProfileOpen(false);
      }
    };

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setProfileOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [profileOpen]);

  const buildPreviewUrl = () => {
    if (!subdomain) return "";

    return `${window.location.origin}/card-preview/${encodeURIComponent(
      subdomain,
    )}`;
  };

const handlePreview = () => {
  setProfileOpen(false);

  if (!subdomain) {
    alert(
      "Preview not available. Please complete your profile (subdomain required).",
    );
    return;
  }

  const previewUrl = buildPreviewUrl();

  // Always open preview in a new tab
  const newTab = window.open(previewUrl, "_blank");

  if (!newTab) {
    alert(
      "Please allow pop-ups in your browser to open the preview in a new tab."
    );
    return;
  }

  if (typeof onPreview === "function") {
    onPreview();
  }
};

  // ==========================================
  // COPY PUBLIC LINK
  // ==========================================
  const handleCopy = async () => {
    setProfileOpen(false);

    const profileLink = subdomain
      ? buildPreviewUrl()
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

    if (typeof onCopyLink === "function") {
      onCopyLink();
    }
  };

  // ==========================================
  // WHATSAPP SHARE
  // ==========================================
  const handleWhatsAppShare = () => {
    setProfileOpen(false);

    const profileLink = subdomain
      ? buildPreviewUrl()
      : window.location.href;

    const message =
      `Hey! 👋\n\n` +
      `Check out my ${
        displayBusinessName || displayName || "online"
      } profile:\n\n` +
      `${profileLink}\n\n` +
      `Thank you for visiting!`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // ==========================================
  // LOGOUT — CONNECTED TO BACKEND
  // ==========================================
  const handleLogout = async () => {
    setProfileOpen(false);

    try {
      await dispatch(logoutUser()).unwrap();

      if (typeof onLogout === "function") {
        onLogout();
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Backend logout failed:", error);

      // Clear local session even if backend request fails.
      dispatch(logout());

      if (typeof onLogout === "function") {
        onLogout();
      } else {
        navigate("/login");
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 border-b border-cyan-400/10 bg-[#031B36]/95 shadow-[0_8px_30px_rgba(0,0,0,0.25)] backdrop-blur-xl">
      <div className="h-[2px] w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-transparent" />

      <div className="flex h-[68px] items-center justify-between px-4 sm:px-5 lg:px-7">
        {/* LEFT SECTION */}
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            aria-label="Open menu"
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#082443] text-cyan-300 transition-all duration-200 hover:border-cyan-300/35 hover:bg-[#0B2D50] active:scale-95 lg:hidden"
          >
            <Menu size={20} strokeWidth={2} />
          </button>

          {/* Logo */}
          <div className="flex min-w-0 items-center gap-2.5">
            <div className="relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-cyan-300 via-cyan-400 to-blue-600 shadow-[0_0_18px_rgba(34,211,238,0.18)]">
              <div className="absolute inset-[2px] rounded-[10px] bg-[#041D38]" />

              <span className="relative z-10 text-lg font-black italic text-cyan-300">
                B
              </span>
            </div>

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
          {/* Preview Button */}
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

          <div className="mx-1 hidden h-8 w-px bg-[#1B456A] md:block" />

          {/* PROFILE DROPDOWN */}
          <div className="relative" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setProfileOpen((prev) => !prev)}
              aria-expanded={profileOpen}
              aria-haspopup="true"
              aria-controls="profile-dropdown"
              className="flex h-10 items-center gap-2 rounded-xl border border-transparent px-1.5 transition-all duration-200 hover:border-cyan-400/10 hover:bg-[#082443] sm:gap-2.5 sm:px-2"
            >
              {/* PROFILE AVATAR */}
              <div className="relative shrink-0">
                <div className="h-9 w-9 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 p-[1.5px]">
                  <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#082443]">
                    {avatarUrl ? (
                      <img
                        src={avatarUrl}
                        alt={displayName}
                        className="h-full w-full object-cover"
                      />
                    ) : getMeLoading ? (
                      <span className="text-xs font-bold text-cyan-300">
                        ...
                      </span>
                    ) : (
                      <span className="text-sm font-bold text-cyan-300">
                        {displayInitial}
                      </span>
                    )}
                  </div>
                </div>

                <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full border-2 border-[#031B36] bg-cyan-400" />
              </div>

              <div className="hidden min-w-0 text-left sm:block">
                <p className="max-w-[130px] truncate text-[12px] font-semibold text-white">
                  {getMeLoading && !displayName
                    ? "Loading..."
                    : displayName}
                </p>

                <p className="mt-0.5 max-w-[150px] truncate text-[9px] text-slate-500">
                  {displayRole}
                </p>
              </div>

              <ChevronDown
                size={14}
                className={`hidden text-slate-500 transition-transform duration-200 sm:block ${
                  profileOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            {profileOpen && (
              <div
                id="profile-dropdown"
                className="absolute right-0 top-[calc(100%+10px)] w-[250px] overflow-hidden rounded-2xl border border-cyan-400/10 bg-[#061D38] shadow-[0_18px_50px_rgba(0,0,0,0.40)]"
              >
                {/* User Header */}
                <div className="border-b border-[#143655] p-4">
                  <div className="flex items-center gap-3">
                    <div className="h-11 w-11 shrink-0 rounded-full bg-gradient-to-br from-cyan-300 to-blue-500 p-[1.5px]">
                      <div className="flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#082443]">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={displayName}
                            className="h-full w-full object-cover"
                          />
                        ) : getMeLoading ? (
                          <span className="text-xs font-bold text-cyan-300">
                            ...
                          </span>
                        ) : (
                          <span className="font-bold text-cyan-300">
                            {displayInitial}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white">
                        {displayName}
                      </p>

                      <p className="mt-0.5 truncate text-[10px] text-slate-500">
                        {displayRole}
                      </p>
                    </div>
                  </div>

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

                {/* Actions */}
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

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-xs font-medium text-slate-300 transition-colors hover:bg-[#0B2D50] hover:text-cyan-200"
                  >
                    <svg
                      className="h-[15px] w-[15px] text-emerald-400"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                    </svg>

                    Share on WhatsApp
                  </button>

                  <div className="my-1 border-t border-[#143655]" />

                  <button
                    type="button"
                    onClick={handleLogout}
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
            onClick={handleLogout}
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
