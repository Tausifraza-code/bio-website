import React, { useEffect, useRef, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Share2,
  UserRound,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Download,
  Image as ImageIcon,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Palette,
  Headset,
  ExternalLink,
  ScanLine,
  QrCode,
  Send,
  Star,
  MessageSquare,
  UserRoundPlus,
  Wallet,
  IndianRupee,
  Link2,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaXTwitter,
  FaGithub,
  FaPinterest,
  FaDiscord,
  FaSnapchat,
  FaTiktok,
  FaReddit,
  FaThreads,
  FaTwitch,
  FaSpotify,
  FaMedium,
  FaLink,
} from "react-icons/fa6";
import GoogleBusinessIcon from "./icons/GoogleBusinessIcon";

// ============================================
// EXECUTIVE PRO LAYOUT
// Premium Dark Navy + Electric Cyan
// Responsive: Mobile, Tablet and Desktop
// ============================================
// Responsive: Mobile, Tablet and Desktop
// ============================================

const ExecutivePro = ({
  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
  productList = [],
  galleryImages = [],

  qrTargetUrl = "",
  qrFetching = false,

  formData = {
    name: "",
    phone: "",
    email: "",
    message: "",
  },

  setFormData = () => {},
  onFormSubmit = () => {},

  inquirySubmitting = false,
  inquirySubmitError = null,
  formSubmitted = false,

  onConfiguredButton = () => {},
  onShare = () => {},
  onOpenQr = () => {},
  onProductClick = () => {},
  onProductWhatsAppInquiry = () => {},
  onGalleryWhatsAppInquiry = () => {},
  onGalleryClick = () => {},
  onContactClick = () => {},
  reviews = [],
  totalReviews = 0,
  averageRating = 0,
  onWriteReview = () => {},
}) => {
  const demoReviews = [
    {
      _id: "demo-rev-1",
      reviewerName: "Rahul Verma",
      rating: 5,
      comment:
        "Outstanding service! Highly professional, great communication and exceeded all expectations. Will definitely work together again.",
      createdAt: "2026-10-28T10:00:00.000Z",
    },
    {
      _id: "demo-rev-2",
      reviewerName: "Priya Sharma",
      rating: 5,
      comment:
        "Truly top-notch experience! Very responsive, prompt delivery, and superb quality of work. Highly recommended!",
      createdAt: "2026-10-31T14:30:00.000Z",
    },
    {
      _id: "demo-rev-3",
      reviewerName: "Ankit Patel",
      rating: 5,
      comment:
        "Extremely satisfied with the service. Reliable, punctual and very polite staff. 5 stars all the way!",
      createdAt: "2026-11-02T09:15:00.000Z",
    },
  ];

  const displayReviews =
    Array.isArray(reviews) && reviews.length > 0 ? reviews : demoReviews;

  const displayRating =
    averageRating > 0
      ? Number(averageRating).toFixed(1)
      : Array.isArray(reviews) && reviews.length > 0
        ? (
            reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
            reviews.length
          ).toFixed(1)
        : "5.0";

  const reviewsCount =
    totalReviews > 0
      ? totalReviews
      : Array.isArray(reviews) && reviews.length > 0
        ? reviews.length
        : 2;

  const {
    name = "",
    role = "",
    location = "",
    about = "",
    phone = "",
    whatsapp = "",
    email = "",
    website = "",
    address = "",
    logo = null,
    avatar = null,
    banner = null,
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
  } = businessInfo;

  const primaryColor = "#22D3EE";

  const socialIconMap = {
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    facebook: FaFacebookF,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    twitter: FaXTwitter,
    x: FaXTwitter,
    github: FaGithub,
    pinterest: FaPinterest,
    discord: FaDiscord,
    snapchat: FaSnapchat,
    tiktok: FaTiktok,
    reddit: FaReddit,
    threads: FaThreads,
    twitch: FaTwitch,
    spotify: FaSpotify,
    medium: FaMedium,
  };

  const resolveSocialPlatform = (social = {}) => {
    if (!social) return "link";
    if (typeof social === "string") {
      const s = social.trim().toLowerCase();
      if (s && s !== "custom") {
        if (/pinter|pintr|pin\.it/.test(s)) return "pinterest";
        if (/telegr|t\.me|tg\b/.test(s)) return "telegram";
        if (/snapchat|snap\b/.test(s)) return "snapchat";
        if (/threads?|threads\.net/.test(s)) return "threads";
        if (/tiktok|tik\s*tok/.test(s)) return "tiktok";
        return s;
      }
      return s || "link";
    }

    const platform = String(social.platform || "")
      .trim()
      .toLowerCase();
    const platformName = String(social.platformName || "")
      .trim()
      .toLowerCase();
    const url = String(social.url || "")
      .trim()
      .toLowerCase();
    const icon = String(social.icon || "")
      .trim()
      .toLowerCase();

    // Check specific known platform first if not "custom"
    const knownKeys = [
      "instagram",
      "facebook",
      "youtube",
      "whatsapp",
      "linkedin",
      "twitter",
      "x",
      "telegram",
      "snapchat",
      "threads",
      "tiktok",
      "pinterest",
      "github",
      "discord",
      "reddit",
      "twitch",
      "spotify",
      "medium",
      "behance",
      "dribbble",
      "quora",
      "tumblr",
      "slack",
      "skype",
    ];
    if (platform && platform !== "custom" && knownKeys.includes(platform)) {
      return platform;
    }

    const combined = `${platformName} ${url} ${icon} ${platform}`.toLowerCase();

    if (/pinter|pintr|pin\.it/.test(combined)) return "pinterest";
    if (/telegr|t\.me|tg\b/.test(combined)) return "telegram";
    if (/snapchat|snap\b/.test(combined)) return "snapchat";
    if (/threads?|threads\.net/.test(combined)) return "threads";
    if (/tiktok|tik\s*tok/.test(combined)) return "tiktok";
    if (/insta|ig\b/.test(combined)) return "instagram";
    if (/faceb|fb\.com|fb\.me|messenger/.test(combined)) return "facebook";
    if (/youtu|yt\b/.test(combined)) return "youtube";
    if (/whats?app|wa\.me/.test(combined)) return "whatsapp";
    if (/linkedi?n/.test(combined)) return "linkedin";
    if (/twitt|x\.com|\btweet\b/.test(combined)) return "twitter";
    if (/githu?b/.test(combined)) return "github";
    if (/discord/.test(combined)) return "discord";
    if (/reddit/.test(combined)) return "reddit";
    if (/twitch/.test(combined)) return "twitch";
    if (/spotify/.test(combined)) return "spotify";
    if (/medium/.test(combined)) return "medium";
    if (/behance/.test(combined)) return "behance";
    if (/dribb?le/.test(combined)) return "dribbble";
    if (/quora/.test(combined)) return "quora";
    if (/tumblr/.test(combined)) return "tumblr";
    if (/vimeo/.test(combined)) return "vimeo";
    if (/soundcloud/.test(combined)) return "soundcloud";
    if (/slack/.test(combined)) return "slack";
    if (/skype/.test(combined)) return "skype";

    return platformName.replace(/[^a-z0-9]/g, "") || platform || "link";
  };

  const getSocialIcon = (social = {}) => {
    const platform = resolveSocialPlatform(social);

    const found = Object.keys(socialIconMap).find((item) =>
      platform.includes(item),
    );

    return found ? socialIconMap[found] : FaLink;
  };

  const normalizeUrl = (url = "") => {
    if (!url) return "#";

    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const renderContactButtonIcon = (button = {}) => {
    const type = (
      button.actionType ||
      button.value ||
      button.type ||
      ""
    ).toLowerCase();
    const label = (button.label || "").toLowerCase();
    const icon = (button.icon || "").toLowerCase();

    if (
      type === "googlebusiness" ||
      icon === "google" ||
      label.includes("google")
    ) {
      return <GoogleBusinessIcon size={14} className="shrink-0" />;
    }
    if (
      type === "whatsapp" ||
      icon === "whatsapp" ||
      label.includes("whatsapp")
    ) {
      return <FaWhatsapp size={14} className="shrink-0" />;
    }
    if (
      type === "call" ||
      type === "phone" ||
      icon === "phone" ||
      label.includes("call") ||
      label === "phone"
    ) {
      return <Phone size={13} className="shrink-0" />;
    }
    if (
      type === "email" ||
      type === "mail" ||
      icon === "mail" ||
      label.includes("email") ||
      label.includes("mail")
    ) {
      return <Mail size={13} className="shrink-0" />;
    }
    if (
      type === "savecontact" ||
      type === "save" ||
      type === "contact" ||
      label.includes("save")
    ) {
      return <UserRoundPlus size={13} className="shrink-0" />;
    }
    if (
      type === "upi" ||
      icon === "upi" ||
      icon === "wallet" ||
      icon === "rupee" ||
      label.includes("upi") ||
      label.includes("rupee") ||
      label.includes("payment")
    ) {
      return <IndianRupee size={13} className="shrink-0" />;
    }
    if (
      type === "directions" ||
      type === "location" ||
      type === "map" ||
      icon === "location" ||
      icon === "mappin" ||
      label.includes("location") ||
      label.includes("direction")
    ) {
      return <MapPin size={13} className="shrink-0" />;
    }
    if (type === "share" || icon === "share" || label.includes("share")) {
      return <Share2 size={13} className="shrink-0" />;
    }
    if (
      type === "website" ||
      type === "web" ||
      icon === "globe" ||
      label.includes("website") ||
      label.includes("web")
    ) {
      return <Globe size={13} className="shrink-0" />;
    }
    if (type === "customlink" || type === "link" || icon === "link") {
      return <Link2 size={13} className="shrink-0" />;
    }
    return <ArrowUpRight size={13} className="shrink-0" />;
  };

  const panelClass =
    "rounded-2xl border border-[#1E3654]/80 bg-[#0E1E33]/90 backdrop-blur-md p-5 sm:p-6 transition-all duration-300 hover:border-cyan-400/40 shadow-lg shadow-black/20";

  const headingClass = "text-lg font-bold tracking-tight text-white sm:text-xl";

  const inputClass =
    "w-full rounded-xl border border-[#1E3654] bg-[#071326] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/15 disabled:opacity-50";

  return (
    <div className="executive-pro relative w-full overflow-hidden rounded-[20px] border border-[#1E3654] bg-[#071326] text-white shadow-2xl shadow-black/50 sm:rounded-[28px]">
      {/* AMBIENT BACKGROUND GLOW */}
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[450px] w-[600px] -translate-x-1/2 rounded-full bg-cyan-500/5 blur-[120px]" />
      <div className="pointer-events-none absolute top-1/3 -right-40 h-[350px] w-[450px] rounded-full bg-blue-600/5 blur-[100px]" />

      {/* ================================== */}
      {/* HERO BANNER */}
      {/* ================================== */}

      <section className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[390px]">
        <img
          src={
            banner ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600"
          }
          alt="Business banner"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#071326]/30 via-[#071326]/55 to-[#071326]" />

        <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-7">
          <div className="flex items-center gap-2">
            {logo ? (
              <img
                src={logo}
                alt="Business logo"
                className="h-10 w-10 rounded-xl border border-white/20 bg-white object-contain p-1 shadow-md"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 backdrop-blur-md">
                <span className="text-lg font-black text-cyan-300">B</span>
              </div>
            )}

            <span className="text-lg font-black tracking-wide text-white drop-shadow">
              Bio<span className="text-cyan-400">.</span>
            </span>
          </div>
        </div>

        {/* HERO ACTIONS */}

        <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-8 sm:top-7">
          <button
            type="button"
            onClick={onShare}
            aria-label="Share profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#071326]/70 text-white backdrop-blur-md transition hover:border-cyan-400 hover:text-cyan-300 active:scale-95 shadow-md"
          >
            <Share2 size={18} />
          </button>

          <button
            type="button"
            onClick={onOpenQr}
            aria-label="Open QR code"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#071326] shadow-lg shadow-cyan-400/25 transition hover:brightness-105 active:scale-95"
          >
            <QrCode size={19} />
          </button>
        </div>

        {/* HERO BOTTOM LABEL */}

        <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
          <p className="text-xs font-bold uppercase tracking-[3px] text-cyan-300">
            Professional Digital Identity
          </p>

          <p className="mt-1 text-sm text-slate-300">
            Welcome to my digital space
          </p>
        </div>
      </section>

      {/* ================================== */}
      {/* PROFILE HEADER */}
      {/* ================================== */}

      <section className="relative px-5 pb-5 sm:px-8 lg:px-10">
        <div className="flex flex-col items-center gap-5 sm:items-start md:flex-row md:items-end">
          {/* PROFILE IMAGE */}

          <div className="-mt-16 relative h-32 w-32 shrink-0 sm:-mt-20 sm:h-40 sm:w-40">
            <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#071326] ring-2 ring-cyan-400/30 bg-[#0E1E33] shadow-[0_0_35px_rgba(34,211,238,0.22)]">
              {avatar ? (
                <img
                  src={avatar}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <UserRound size={48} className="text-slate-500" />
                </div>
              )}
            </div>

            {logo && (
              <div className="absolute bottom-1 right-0 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-2 border-[#071326] ring-1 ring-cyan-400/30 bg-white shadow-lg">
                <img
                  src={logo}
                  alt="Business logo"
                  className="h-full w-full object-contain"
                />
              </div>
            )}
          </div>

          {/* PROFILE DETAILS */}

          <div className="min-w-0 flex-1 pb-2 text-center sm:text-left">
            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {name || "Your Name"}
              </h1>

              {isVerified && (
                <span title="Verified Profile">
                  <CheckCircle2
                    size={23}
                    className="fill-cyan-400 text-[#071326]"
                  />
                </span>
              )}
            </div>

            <p className="mt-1.5 text-sm font-bold text-cyan-400 sm:text-base">
              {role || "Business Professional"}
            </p>

            {/* RATING STARS */}
            <a
              href="#reviews-section"
              onClick={(e) => {
                e.preventDefault();
                document
                  .getElementById("reviews-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
              className="mt-2 flex items-center justify-center gap-1.5 sm:justify-start cursor-pointer transition hover:opacity-90"
              title="View reviews and ratings"
            >
              <div className="flex items-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    size={15}
                    className={
                      star <= Math.round(Number(displayRating))
                        ? "fill-amber-400 text-amber-400"
                        : "fill-transparent text-slate-600"
                    }
                  />
                ))}
              </div>
              <span className="text-sm font-black text-white">
                {displayRating}
              </span>
              <span className="text-xs font-semibold text-slate-400">
                ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
              </span>
            </a>

            <p className="mt-1 text-sm text-slate-300 font-medium">
              {businessName || "My Business"}
            </p>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
              <MapPin size={14} className="text-cyan-400 shrink-0" />
              <span>{location || "Location not added"}</span>
            </p>
          </div>
        </div>

        {/* CONTACT BUTTONS */}

        <div className="mt-6 grid grid-cols-3 gap-2 sm:gap-2.5">
          {visibleButtons.map((button, index) => (
            <button
              key={button._id || button.id || index}
              type="button"
              onClick={() => onConfiguredButton(button)}
              className={`flex items-center justify-center gap-1.5 rounded-xl px-2.5 py-2.5 text-[11px] font-bold transition-all duration-200 active:scale-[0.98] sm:text-xs ${
                button.actionType === "call"
                  ? "bg-gradient-to-r from-cyan-400 to-cyan-300 text-[#071326] shadow-md shadow-cyan-400/20 hover:brightness-105"
                  : button.actionType === "whatsapp"
                    ? "bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 hover:brightness-105"
                    : "border border-[#1E3654] bg-[#0E1E33] text-white hover:border-cyan-400/50 hover:bg-[#132942] hover:text-cyan-300"
              }`}
            >
              {renderContactButtonIcon(button)}
              <span className="truncate">{button.label}</span>
              <ArrowUpRight size={12} className="shrink-0 opacity-70" />
            </button>
          ))}
        </div>

        {/* SOCIAL ICONS */}

        {socialLinks.length > 0 && (
          <div className="mt-5 grid grid-cols-5 gap-2 sm:flex sm:flex-wrap sm:justify-center sm:gap-2.5">
            {socialLinks.map((social, index) => {
              const Icon = getSocialIcon(social);
              const platform = resolveSocialPlatform(social);

              const brandColors = {
                instagram:
                  "text-[#E4405F] hover:border-[#E4405F]/60 hover:bg-[#E4405F]/10",
                facebook:
                  "text-[#1877F2] hover:border-[#1877F2]/60 hover:bg-[#1877F2]/10",
                linkedin:
                  "text-[#0A66C2] hover:border-[#0A66C2]/60 hover:bg-[#0A66C2]/10",
                whatsapp:
                  "text-[#25D366] hover:border-[#25D366]/60 hover:bg-[#25D366]/10",
                youtube:
                  "text-[#FF0000] hover:border-[#FF0000]/60 hover:bg-[#FF0000]/10",
                twitter:
                  "text-[#1DA1F2] hover:border-[#1DA1F2]/60 hover:bg-[#1DA1F2]/10",
                x: "text-white hover:border-white/60 hover:bg-white/10",
                telegram:
                  "text-[#26A5E4] hover:border-[#26A5E4]/60 hover:bg-[#26A5E4]/10",
                github: "text-white hover:border-white/60 hover:bg-white/10",
                pinterest:
                  "text-[#E60023] hover:border-[#E60023]/60 hover:bg-[#E60023]/10",
                discord:
                  "text-[#5865F2] hover:border-[#5865F2]/60 hover:bg-[#5865F2]/10",
                snapchat:
                  "text-[#FFFC00] hover:border-[#FFFC00]/60 hover:bg-[#FFFC00]/10",
                tiktok: "text-white hover:border-white/60 hover:bg-white/10",
                reddit:
                  "text-[#FF4500] hover:border-[#FF4500]/60 hover:bg-[#FF4500]/10",
                threads: "text-white hover:border-white/60 hover:bg-white/10",
                twitch:
                  "text-[#9146FF] hover:border-[#9146FF]/60 hover:bg-[#9146FF]/10",
                spotify:
                  "text-[#1DB954] hover:border-[#1DB954]/60 hover:bg-[#1DB954]/10",
              };

              const brandColor =
                brandColors[platform] ||
                "text-slate-300 hover:border-cyan-400/60 hover:bg-cyan-400/10";

              return (
                <a
                  key={social._id || `${platform}-${index}`}
                  href={normalizeUrl(social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platformName || social.platform}
                  className={`flex h-10 w-full items-center justify-center rounded-xl border border-[#1E3654] bg-[#0E1E33] ${brandColor} shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md sm:h-10 sm:w-10`}
                >
                  <Icon size={17} />
                </a>
              );
            })}
          </div>
        )}
      </section>

      {/* ================================== */}
      {/* MAIN CONTENT GRID */}
      {/* ================================== */}

      <main className="grid grid-cols-1 gap-5 px-5 pb-8 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-10">
        {/* LEFT COLUMN */}

        <aside className="flex flex-col gap-5 lg:col-span-4">
          {/* CONTACT INFORMATION */}

          <section className={panelClass}>
            <h2 className={headingClass}>Contact Information</h2>

            <div className="mt-5 space-y-2.5">
              {[
                {
                  Icon: Phone,
                  label: "Phone",
                  value: phone,
                  type: "phone",
                },
                {
                  Icon: MessageCircle,
                  label: "WhatsApp",
                  value: whatsapp,
                  type: "whatsapp",
                },
                {
                  Icon: Mail,
                  label: "Email",
                  value: email,
                  type: "email",
                },
                {
                  Icon: Globe,
                  label: "Website",
                  value: website,
                  type: "website",
                },
                {
                  Icon: MapPin,
                  label: "Address",
                  value: address,
                  type: "address",
                },
                {
                  Icon: Clock,
                  label: "Business Hours",
                  value: businessHours,
                  type: "hours",
                },
              ]
                .filter((item) => item.value)
                .map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    disabled={item.type === "hours"}
                    onClick={() => {
                      if (item.type === "hours") return;
                      if (item.type === "website") {
                        onContactClick({
                          actionType: "website",
                          customUrl: item.value,
                        });
                      } else if (item.type === "address") {
                        onContactClick({ actionType: "directions" });
                      } else {
                        onContactClick(item.type);
                      }
                    }}
                    className="group flex w-full min-w-0 items-start gap-3 rounded-xl p-2 text-left transition hover:bg-[#071326]/70 active:scale-[0.99] disabled:cursor-default disabled:hover:bg-transparent"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400 group-hover:text-[#071326] group-hover:shadow-md group-hover:shadow-cyan-400/20">
                      <item.Icon size={17} />
                    </div>

                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 transition group-hover:text-cyan-400">
                        {item.label}
                      </p>

                      <p className="mt-0.5 break-all text-xs font-medium leading-5 text-slate-200 transition group-hover:text-cyan-300 sm:text-sm">
                        {item.value}
                      </p>
                    </div>
                  </button>
                ))}
            </div>
          </section>

          {/* QR CODE */}

          <section
            className={`${panelClass} hidden flex flex-col items-center text-center lg:flex`}
          >
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
              <ScanLine size={22} />
            </div>

            <h2 className={headingClass}>Scan My QR</h2>

            <p className="mt-1 text-xs text-slate-400">
              Scan to visit my digital profile
            </p>

            <div className="mt-5 flex min-h-[190px] w-full items-center justify-center rounded-2xl border border-[#1E3654] bg-[#071326] p-4 shadow-inner">
              {qrFetching ? (
                <p className="text-sm text-slate-400">Loading QR...</p>
              ) : qrTargetUrl ? (
                <div className="rounded-xl bg-white p-3 shadow-lg">
                  <QRCodeCanvas
                    id="executive-pro-qr"
                    value={qrTargetUrl}
                    size={155}
                    level="H"
                    includeMargin
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-500">QR code not available</p>
              )}
            </div>

            {qrTargetUrl && (
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrTargetUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-[#071326] shadow-sm active:scale-[0.98]"
              >
                <Download size={16} />
                Download QR
              </a>
            )}
          </section>
        </aside>

        {/* RIGHT COLUMN */}

        <div className="flex min-w-0 flex-col gap-5 lg:col-span-8">
          {/* ABOUT ME */}

          <section className={panelClass}>
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                  Get to know me
                </p>

                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  About Me
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
                <UserRound size={22} />
              </div>
            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {about ||
                "Welcome to my business! Contact me for business inquiries."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">
              {industry && (
                <span className="rounded-lg border border-cyan-400/25 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                  {industry}
                </span>
              )}

              {businessName && (
                <span className="rounded-lg border border-[#1E3654] bg-[#071326] px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {businessName}
                </span>
              )}
            </div>
          </section>

          {/* ================================== */}
          {/* PRODUCTS — SINGLE CARD AUTO SLIDE  */}
          {/* ================================== */}

          {productList.length > 0 && (
            <section className={panelClass}>
              <div className="mb-5 flex items-center justify-between gap-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                    Explore collection
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                    Featured Products
                  </h2>
                </div>

                <span className="rounded-full border border-cyan-400/25 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {productList.length} Items
                </span>
              </div>

              <div className="executive-product-swiper">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={14}
                  loop={productList.length > 1}
                  speed={600}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={
                    productList.length > 1 ? { clickable: true } : false
                  }
                  className={productList.length > 1 ? "pb-8" : ""}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 14 },
                    1024: { slidesPerView: 3, spaceBetween: 16 },
                  }}
                >
                  {productList.map((product) => {
                    const cover = product.images?.find(
                      (item) => item?.url,
                    )?.url;
                    return (
                      <SwiperSlide key={product._id}>
                        <div className="overflow-hidden rounded-2xl border border-[#1E3654] bg-[#071326] shadow-lg shadow-black/30 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/10">
                          {/* PRODUCT IMAGE */}
                          <button
                            type="button"
                            onClick={() => onProductClick(product)}
                            className="group block w-full overflow-hidden text-left"
                          >
                            <div className="relative h-48 overflow-hidden bg-[#0A1626] sm:h-44">
                              {cover ? (
                                <img
                                  src={cover}
                                  alt={product.name}
                                  loading="lazy"
                                  className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                                />
                              ) : (
                                <div className="flex h-full items-center justify-center">
                                  <ImageIcon
                                    size={30}
                                    className="text-slate-500"
                                  />
                                </div>
                              )}

                              <span className="absolute right-2.5 top-2.5 rounded-lg border border-white/10 bg-[#071326]/80 p-1.5 text-cyan-300 backdrop-blur-md">
                                <ArrowUpRight size={14} />
                              </span>

                              {product.category && (
                                <span className="absolute bottom-2.5 left-2.5 rounded-md border border-cyan-400/30 bg-[#071326]/85 px-2 py-0.5 text-[10px] font-semibold text-cyan-300 backdrop-blur-md">
                                  {product.category}
                                </span>
                              )}
                            </div>

                            <div className="p-4">
                              <h3 className="text-sm font-bold leading-snug text-white transition group-hover:text-cyan-300">
                                {product.name}
                              </h3>

                              <p className="mt-1.5 line-clamp-2 text-xs leading-5 text-slate-400">
                                {product.description}
                              </p>

                              {/* PRICE + WHATSAPP */}
                              <div className="mt-3 flex items-center justify-between gap-2">
                                <p className="text-lg font-black text-cyan-400">
                                  ₹
                                  {Number(product.price || 0).toLocaleString(
                                    "en-IN",
                                  )}
                                </p>

                                <span
                                  onClick={(event) => {
                                    event.stopPropagation();
                                    onProductWhatsAppInquiry(product);
                                  }}
                                  role="button"
                                  tabIndex={0}
                                  onKeyDown={(event) => {
                                    if (
                                      event.key === "Enter" ||
                                      event.key === " "
                                    ) {
                                      event.preventDefault();
                                      event.stopPropagation();
                                      onProductWhatsAppInquiry(product);
                                    }
                                  }}
                                  aria-label={`WhatsApp inquiry for ${product.name}`}
                                  title="WhatsApp Inquiry"
                                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 text-white shadow-md shadow-emerald-500/20 transition hover:brightness-110 active:scale-95"
                                >
                                  <FaWhatsapp size={18} />
                                </span>
                              </div>
                            </div>
                          </button>

                          {/* PAY NOW BUTTON */}
                          <div className="px-4 pb-4">
                            <button
                              type="button"
                              onClick={() => onProductClick(product)}
                              className="flex w-full items-center justify-center rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-2.5 text-sm font-extrabold text-[#071326] shadow-md shadow-cyan-400/20 transition hover:brightness-105 active:scale-[0.98]"
                            >
                              Pay Now
                            </button>
                          </div>
                        </div>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>
            </section>
          )}

          {/* ================================== */}
          {/* GALLERY — SINGLE CARD AUTO SLIDE   */}
          {/* ================================== */}

          <section className={panelClass}>
            <div className="mb-5 flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                  Our work
                </p>

                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  Gallery
                </h2>
              </div>

              <span className="rounded-full border border-[#1E3654] bg-[#071326] px-3 py-1 text-xs font-semibold text-slate-400">
                {galleryImages.length} Photos
              </span>
            </div>

            {galleryImages.length > 0 ? (
              <div className="executive-gallery-swiper">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={14}
                  loop={galleryImages.length > 1}
                  speed={600}
                  autoplay={{
                    delay: 3800,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={
                    galleryImages.length > 1 ? { clickable: true } : false
                  }
                  className={galleryImages.length > 1 ? "pb-8" : ""}
                  breakpoints={{
                    640: { slidesPerView: 2, spaceBetween: 14 },
                    1024: { slidesPerView: 3, spaceBetween: 16 },
                  }}
                >
                  {galleryImages.map((image, index) => (
                    <SwiperSlide key={image._id || image.id || index}>
                      <div className="overflow-hidden rounded-2xl border border-[#1E3654] bg-[#071326] shadow-lg shadow-black/30 transition-all duration-300 hover:border-cyan-400/50 hover:shadow-cyan-500/10">
                        {/* GALLERY IMAGE */}
                        <button
                          type="button"
                          onClick={() => onGalleryClick(image)}
                          className="group relative block aspect-[4/3] w-full overflow-hidden"
                          aria-label={`View gallery image ${index + 1}`}
                        >
                          <img
                            src={image.url}
                            alt={image.alt || `Gallery ${index + 1}`}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-108"
                          />

                          <div className="absolute inset-0 flex items-center justify-center bg-[#071326]/50 opacity-0 backdrop-blur-xs transition group-hover:opacity-100">
                            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-cyan-400/20 text-cyan-300 border border-cyan-400/40">
                              <ArrowUpRight size={20} />
                            </span>
                          </div>

                          {image.alt && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#071326]/95 via-[#071326]/60 to-transparent px-3 py-2 opacity-0 transition group-hover:opacity-100">
                              <p className="truncate text-xs font-semibold text-white">
                                {image.alt}
                              </p>
                            </div>
                          )}
                        </button>

                        {/* WHATSAPP INQUIRY BUTTON */}
                        <div className="p-3">
                          <button
                            type="button"
                            onClick={() => onGalleryWhatsAppInquiry(image)}
                            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-400 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-500/20 transition hover:brightness-105 active:scale-[0.98]"
                          >
                            <FaWhatsapp size={16} className="shrink-0" />
                            <span>WhatsApp</span>
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#1E3654] py-10 text-center bg-[#071326]/50">
                <ImageIcon size={35} className="mx-auto text-slate-500" />

                <p className="mt-3 text-sm text-slate-400">
                  No gallery images added yet.
                </p>
              </div>
            )}
          </section>

          {/* ================================== */}
          {/* SOCIAL MEDIA & PROFILES — SWIPER   */}
          {/* ================================== */}
          {socialLinks.length > 0 && (
            <section className={panelClass}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[9px] font-black uppercase tracking-[2px] text-cyan-400">
                    Social Media &amp; Profiles
                  </p>
                </div>
                <span className="rounded-full border border-[#1E3654] bg-[#071326] px-2.5 py-0.5 text-[9px] font-bold text-cyan-400">
                  {socialLinks.length} account
                  {socialLinks.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-3 executive-social-swiper">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={12}
                  loop={socialLinks.length > 1}
                  speed={500}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={
                    socialLinks.length > 1 ? { clickable: true } : false
                  }
                  className={socialLinks.length > 1 ? "pb-8" : ""}
                >
                  {socialLinks.map((social, index) => {
                    const Icon = getSocialIcon(social);
                    const platform = resolveSocialPlatform(social);
                    const platformCtaBg =
                      {
                        instagram:
                          "linear-gradient(135deg,#f09433,#e6683c,#dc2743,#cc2366,#bc1888)",
                        youtube: "#FF0000",
                        facebook: "#1877F2",
                        whatsapp: "#25D366",
                        linkedin: "#0A66C2",
                        telegram: "#26A5E4",
                        twitter: "#1a1a2e",
                        x: "#1a1a2e",
                        github: "#24292e",
                        pinterest: "#E60023",
                        discord: "#5865F2",
                        snapchat: "#FFFC00",
                        tiktok: "#010101",
                        reddit: "#FF4500",
                        threads: "#000000",
                        twitch: "#9146FF",
                        spotify: "#1DB954",
                      }[platform] || "#22d3ee";
                    const platformIconColor =
                      {
                        instagram: "#E4405F",
                        youtube: "#FF0000",
                        facebook: "#1877F2",
                        whatsapp: "#25D366",
                        linkedin: "#0A66C2",
                        telegram: "#26A5E4",
                        twitter: "#ffffff",
                        x: "#ffffff",
                        github: "#ffffff",
                        pinterest: "#E60023",
                        discord: "#5865F2",
                        snapchat: "#FFFC00",
                        tiktok: "#EE1D52",
                        reddit: "#FF4500",
                        threads: "#ffffff",
                        twitch: "#9146FF",
                        spotify: "#1DB954",
                      }[platform] || "#22d3ee";
                    const displayName =
                      social.platformName && social.platformName.trim()
                        ? social.platformName.trim()
                        : social.platform && social.platform !== "custom"
                          ? social.platform
                          : platform !== "link"
                            ? platform.charAt(0).toUpperCase() +
                              platform.slice(1)
                            : "Social";
                    const ctaLabel =
                      social.ctaLabel ||
                      (platform === "telegram" ? "Join Channel" : "Visit");
                    const isLightBadge = [
                      "github",
                      "twitter",
                      "x",
                      "threads",
                      "snapchat",
                    ].includes(platform);
                    const badgeBg =
                      {
                        snapchat: "#FFFC00",
                        github: "#ffffff",
                        twitter: "#ffffff",
                        x: "#ffffff",
                        threads: "#ffffff",
                      }[platform] || platformIconColor;
                    const badgeIconColor = isLightBadge ? "#000000" : "#ffffff";

                    return (
                      <SwiperSlide key={social._id || `${platform}-${index}`}>
                        <a
                          href={normalizeUrl(social.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex flex-col rounded-xl border border-[#1E3654] bg-[#071326] p-4 transition hover:border-cyan-400/40 active:scale-[0.98]"
                        >
                          {/* Top row: avatar + info */}
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0">
                              {social.profileImage ? (
                                <img
                                  src={social.profileImage}
                                  alt={displayName}
                                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#1E3654]"
                                />
                              ) : (
                                <div
                                  className="flex h-12 w-12 items-center justify-center rounded-full"
                                  style={{
                                    background: `${platformIconColor}22`,
                                  }}
                                >
                                  <Icon
                                    size={20}
                                    style={{ color: platformIconColor }}
                                  />
                                </div>
                              )}
                              <div
                                className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-[#071326]"
                                style={{ background: badgeBg }}
                              >
                                <Icon
                                  size={10}
                                  style={{ color: badgeIconColor }}
                                />
                              </div>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-1">
                                <p className="truncate text-sm font-black text-white">
                                  {displayName}
                                </p>
                                {social.verifiedTick && (
                                  <CheckCircle2
                                    size={12}
                                    className="shrink-0 text-cyan-400"
                                  />
                                )}
                              </div>
                              {social.handle && (
                                <p className="truncate text-[11px] font-semibold text-cyan-400">
                                  {social.handle}
                                </p>
                              )}
                              {social.audience && (
                                <p className="mt-0.5 text-[10px] text-slate-400">
                                  {social.audience}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Description */}
                          {social.description && (
                            <p className="mt-3 line-clamp-2 text-[11px] leading-relaxed text-slate-300">
                              {social.description}
                            </p>
                          )}
                          {/* CTA Button */}
                          <div
                            className="mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-xs font-bold text-white shadow-sm"
                            style={{ background: platformCtaBg }}
                          >
                            <Icon size={12} />
                            <span>{ctaLabel}</span>
                            <ExternalLink
                              size={11}
                              className="ml-auto opacity-70"
                            />
                          </div>
                        </a>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </div>

              {socialLinks.length > 1 && (
                <style>{`
                  .executive-social-swiper .swiper-pagination {
                    bottom: 0 !important;
                  }
                  .executive-social-swiper .swiper-pagination-bullet {
                    background: #22D3EE;
                    opacity: 0.3;
                  }
                  .executive-social-swiper .swiper-pagination-bullet-active {
                    background: #22D3EE;
                    opacity: 1;
                    width: 16px;
                    border-radius: 8px;
                  }
                  .executive-product-swiper .swiper-pagination {
                    bottom: 0 !important;
                  }
                  .executive-product-swiper .swiper-pagination-bullet {
                    background: #22D3EE;
                    opacity: 0.3;
                  }
                  .executive-product-swiper .swiper-pagination-bullet-active {
                    background: #22D3EE;
                    opacity: 1;
                    width: 16px;
                    border-radius: 8px;
                  }
                  .executive-gallery-swiper .swiper-pagination {
                    bottom: 0 !important;
                  }
                  .executive-gallery-swiper .swiper-pagination-bullet {
                    background: #22D3EE;
                    opacity: 0.3;
                  }
                  .executive-gallery-swiper .swiper-pagination-bullet-active {
                    background: #22D3EE;
                    opacity: 1;
                    width: 16px;
                    border-radius: 8px;
                  }
                `}</style>
              )}
            </section>
          )}

          {/* ================================== */}
          {/* REVIEWS — SLIDE ANIMATION CAROUSEL */}
          {/* ================================== */}
          <section id="reviews-section" className={panelClass}>
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                  Client Feedback
                </p>
                <div className="mt-1 flex items-center gap-2">
                  <h2 className="text-xl font-black text-white sm:text-2xl">
                    Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-1.5 rounded-full bg-cyan-400/10 px-3 py-0.5 text-xs font-bold text-cyan-300 border border-cyan-400/20">
                    <Star size={12} className="fill-amber-400 text-amber-400" />
                    <span>{displayRating}</span>
                    <span className="text-slate-400">({reviewsCount})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onWriteReview}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-2.5 text-xs font-extrabold text-[#071326] transition hover:brightness-105 active:scale-[0.98] sm:text-sm shadow-lg shadow-cyan-400/15"
              >
                <Star size={15} className="fill-[#071326]" />
                <span>Write a Review</span>
              </button>
            </div>

            {/* SLIDE ANIMATION CAROUSEL */}
            <div className="executive-reviews-swiper relative">
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={14}
                loop={displayReviews.length > 1}
                speed={600}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 14 },
                  1024: { slidesPerView: 2, spaceBetween: 16 },
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="!pb-9"
              >
                {displayReviews.map((review, index) => {
                  const initial = (review.reviewerName || "U")
                    .charAt(0)
                    .toUpperCase();
                  const ratingVal = Number(review.rating) || 5;

                  return (
                    <SwiperSlide key={review._id || index} className="!h-auto">
                      <div className="flex h-full flex-col justify-between rounded-xl border border-[#1E3654] bg-[#071326] p-4.5 transition-all duration-300 hover:border-cyan-400/40 shadow-sm">
                        <div>
                          {/* Top: Avatar, Name & Stars */}
                          <div className="flex items-start justify-between gap-3">
                            <div className="flex items-center gap-2.5">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-300 font-extrabold border border-cyan-400/20 text-sm">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <h3 className="truncate text-sm font-bold text-white">
                                  {review.reviewerName}
                                </h3>
                                <p className="text-[11px] text-slate-400">
                                  {review.createdAt
                                    ? new Date(
                                        review.createdAt,
                                      ).toLocaleDateString("en-US", {
                                        month: "short",
                                        day: "numeric",
                                        year: "numeric",
                                      })
                                    : "Verified Client"}
                                </p>
                              </div>
                            </div>

                            <div className="flex items-center gap-0.5 shrink-0 text-amber-400">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={13}
                                  className={
                                    s <= ratingVal
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-600 fill-transparent"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          {/* Review comment */}
                          <p className="mt-3 text-xs leading-relaxed text-slate-300 line-clamp-3 sm:text-sm">
                            "{review.comment}"
                          </p>
                        </div>

                        {/* Subtle Verified badge */}
                        <div className="mt-3 flex items-center gap-1.5 text-[11px] font-semibold text-cyan-400/80">
                          <CheckCircle2 size={13} className="text-cyan-400" />
                          <span>Verified Feedback</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            <style>{`
              .executive-reviews-swiper .swiper-pagination {
                bottom: 0 !important;
              }
              .executive-reviews-swiper .swiper-pagination-bullet {
                background: #22D3EE;
                opacity: 0.3;
              }
              .executive-reviews-swiper .swiper-pagination-bullet-active {
                background: #22D3EE;
                opacity: 1;
                width: 18px;
                border-radius: 9px;
              }
            `}</style>
          </section>

          {/* INQUIRY FORM */}

          <section className="overflow-hidden rounded-2xl border border-cyan-400/25 bg-gradient-to-br from-[#0E1E33] via-[#0B182B] to-[#071326] p-6 sm:p-7 shadow-xl">
            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                Let's work together
              </p>

              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Let's Build Something Great
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Have a project in mind? Send me a message and let's discuss it.
              </p>
            </div>

            {formSubmitted ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center">
                <CheckCircle2 size={35} className="mx-auto text-emerald-400" />

                <p className="mt-3 font-bold text-emerald-300">
                  Inquiry submitted successfully!
                </p>
              </div>
            ) : (
              <form onSubmit={onFormSubmit} className="space-y-3.5">
                {inquirySubmitError && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                    {inquirySubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />
                </div>

                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  disabled={inquirySubmitting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className={inputClass}
                />

                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  disabled={inquirySubmitting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 py-3.5 text-sm font-black text-[#071326] shadow-lg shadow-cyan-400/20 transition hover:brightness-105 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {inquirySubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={17} />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </section>
        </div>
      </main>

      {/* MOBILE QR CODE - BOTTOM POSITION */}
      <section
        className={`${panelClass} mx-5 mb-8 flex flex-col items-center text-center sm:mx-8 lg:hidden`}
      >
        <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400">
          <ScanLine size={22} />
        </div>

        <h2 className={headingClass}>Scan My QR</h2>

        <p className="mt-1 text-xs text-slate-400">
          Scan to visit my digital profile
        </p>

        <div className="mt-5 flex min-h-[190px] w-full items-center justify-center rounded-2xl border border-[#1E3654] bg-[#071326] p-4 shadow-inner">
          {qrFetching ? (
            <p className="text-sm text-slate-400">Loading QR...</p>
          ) : qrTargetUrl ? (
            <div className="rounded-xl bg-white p-3 shadow-lg">
              <QRCodeCanvas
                value={qrTargetUrl}
                size={155}
                level="H"
                includeMargin
              />
            </div>
          ) : (
            <p className="text-xs text-slate-500">QR code not available</p>
          )}
        </div>

        {qrTargetUrl && (
          <a
            href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrTargetUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-[#071326] shadow-sm active:scale-[0.98]"
          >
            <Download size={16} />
            Download QR
          </a>
        )}
      </section>

      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <footer className="border-t border-[#1E3654] bg-[#050D1A] px-5 py-7 text-center sm:px-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              Bio<span className="text-cyan-400">.</span>
            </span>

            <span className="text-xs text-slate-500">
              Professional Digital Identity
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {name || businessName}. All rights
            reserved.
          </p>
        </div>

        <p className="mt-5 text-[11px] text-slate-600">
          Powered by <span className="font-bold text-cyan-400">BIO SITES</span>
        </p>

        {/* CREATE YOUR BIO SITES BUTTON */}
        <div className="mt-6 flex justify-center">
          <a
            href="/"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-blue-500/10 px-6 py-2.5 text-xs font-bold tracking-wide text-cyan-300 shadow-lg shadow-cyan-500/10 backdrop-blur-sm transition-all duration-200 hover:border-cyan-400/80 hover:from-cyan-500/20 hover:to-blue-500/20 hover:text-cyan-200 hover:shadow-cyan-500/20"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M12 2L2 7l10 5 10-5-10-5z" />
              <path d="M2 17l10 5 10-5" />
              <path d="M2 12l10 5 10-5" />
            </svg>
            Create Your BIO SITES
          </a>
        </div>
      </footer>
    </div>
  );
};

export default ExecutivePro;
