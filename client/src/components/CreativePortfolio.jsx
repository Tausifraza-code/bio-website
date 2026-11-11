import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";

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
  CheckCircle2,
  Clock,
  Download,
  Image as ImageIcon,
  ArrowUpRight,
  ScanLine,
  QrCode,
  Send,
  Zap,
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
  Layers,
  Star,
  MessageSquare,
  ExternalLink,
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

const CreativePortfolio = ({
  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
  productList = [],
  galleryImages = [],
  qrTargetUrl = "",
  qrFetching = false,
  formData = { name: "", phone: "", email: "", message: "" },
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
  onGalleryClick = () => {},
  onGalleryWhatsAppInquiry = () => {},
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

  // SOCIAL ICONS
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

  // ORIGINAL SOCIAL BRAND COLORS
  const getSocialColor = (social = {}) => {
    const key = resolveSocialPlatform(social);

    if (key.includes("instagram")) return "#E4405F";
    if (key.includes("linkedin")) return "#0A66C2";
    if (key.includes("facebook")) return "#1877F2";
    if (key.includes("youtube")) return "#FF0000";
    if (key.includes("whatsapp")) return "#25D366";
    if (key.includes("telegram")) return "#26A5E4";
    if (key.includes("twitter") || key === "x") return "#000000";
    if (key.includes("github")) return "#24292e";
    if (key.includes("pinterest")) return "#E60023";
    if (key.includes("discord")) return "#5865F2";
    if (key.includes("snapchat")) return "#FFFC00";
    if (key.includes("threads")) return "#000000";
    if (key.includes("tiktok")) return "#000000";
    if (key.includes("reddit")) return "#FF4500";
    if (key.includes("twitch")) return "#9146FF";
    if (key.includes("spotify")) return "#1DB954";

    return "#907836";
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

  // CONTACT INFORMATION
  const contactItems = [
    {
      Icon: Phone,
      label: "Phone Number",
      value: phone,
      type: "phone",
      sub: "Call anytime",
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: whatsapp,
      type: "whatsapp",
      sub: "Chat with me",
    },
    {
      Icon: Mail,
      label: "Email Address",
      value: email,
      type: "email",
      sub: "Drop me a mail",
    },
    {
      Icon: Globe,
      label: "Website",
      value: website,
      type: "website",
      sub: "Visit my website",
    },
    {
      Icon: MapPin,
      label: "Location",
      value: address || location,
      type: "address",
      sub: "Find my location",
    },
    {
      Icon: Clock,
      label: "Business Hours",
      value: businessHours,
      type: "hours",
      sub: "Working hours",
    },
  ].filter((item) => item.value);

  // THEME STYLES
  const sectionLabel =
    "text-[10px] font-black uppercase tracking-[2.5px] text-[#D95D08]";

  const sectionHeading =
    "mt-2 text-2xl font-black tracking-tight text-[#1C130B] sm:text-3xl lg:text-4xl";

  const cardClass =
    "rounded-2xl border border-[#EFE3D3] bg-white shadow-[0_4px_24px_-4px_rgba(28,19,11,0.06)]";

  const inputClass =
    "w-full min-w-0 rounded-xl border border-[#E8D9C5] bg-[#FAF6F0] px-4 py-3 text-sm text-[#1C130B] placeholder:text-[#9C826A] outline-none transition focus:border-[#D95D08] focus:bg-white focus:ring-4 focus:ring-orange-500/10 disabled:opacity-50";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-900/15 transition hover:-translate-y-0.5 hover:brightness-105 active:scale-95";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full border border-[#E4D2BC] bg-white px-5 py-3 text-xs font-bold text-[#C2410C] shadow-sm transition hover:border-[#EA580C] hover:bg-[#FAF3EA] active:scale-95";

  return (
    <div className="creative-portfolio relative w-full min-w-0 overflow-hidden bg-[#FAF5EF] pb-24 font-sans text-[#2C1D11]">
      {/* =====================================
          PROFILE / HERO SECTION
      ====================================== */}
      <section
        id="creative-home"
        className="w-full px-3 pb-4 pt-3 sm:px-6 sm:pb-2 sm:pt-5 lg:px-8 xl:px-10"
      >
        <div className="relative w-full overflow-hidden rounded-[24px] border border-[#E8D9C5] bg-gradient-to-b from-[#FAF4EC] to-[#F5ECE0] shadow-[0_12px_40px_-15px_rgba(28,19,11,0.08)] sm:rounded-[30px]">
          {/* COVER BANNER */}
          <div className="relative h-48 overflow-hidden bg-gradient-to-r from-[#EA580C] via-[#D95D08] to-[#9A3412] sm:h-56 md:h-64">
            {banner && (
              <img
                src={banner}
                alt="Profile banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#1C130B]/40 via-transparent to-black/20" />

            {/* SHARE AND SCAN */}
            <div className="absolute right-3 top-3 z-20 flex items-center gap-2 sm:right-5 sm:top-5">
              <button
                type="button"
                onClick={onShare}
                aria-label="Share profile"
                className="flex h-10 w-10 items-center justify-center rounded-full border border-white/40 bg-black/25 text-white shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-[#C2410C] sm:h-11 sm:w-11 active:scale-95"
              >
                <Share2 size={17} />
              </button>

              <button
                type="button"
                onClick={onOpenQr}
                aria-label="Scan QR code"
                className="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/25 px-4 text-xs font-bold text-white shadow-md backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-[#C2410C] sm:h-11 sm:px-5 active:scale-95"
              >
                <QrCode size={16} />
                <span>Scan QR</span>
              </button>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8">
              <span className="rounded-full border border-white/35 bg-white/20 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[2px] text-white backdrop-blur-md">
                Digital Profile
              </span>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="relative px-4 pb-6 sm:px-6 sm:pb-8 lg:px-9">
            {/* AVATAR + NAME */}
            <div className="-mt-14 flex min-w-0 flex-col items-center gap-3 text-center sm:-mt-[72px] sm:flex-row sm:items-end sm:gap-6 sm:text-left">
              {/* PROFILE IMAGE + LOGO */}
              <div className="relative h-28 w-28 shrink-0 overflow-visible sm:h-36 sm:w-36">
                <div className="h-full w-full overflow-hidden rounded-[26px] border-4 border-white bg-white shadow-xl ring-1 ring-black/5 sm:rounded-[32px]">
                  {avatar ? (
                    <img
                      src={avatar}
                      alt={name || "Profile"}
                      className="h-full w-full object-cover"
                    />
                  ) : logo ? (
                    <img
                      src={logo}
                      alt="Business logo"
                      className="h-full w-full object-contain p-2"
                    />
                  ) : (
                    <div className="flex h-full items-center justify-center bg-[#FCE9D6]">
                      <UserRound size={54} className="text-[#D95D08]" />
                    </div>
                  )}
                </div>

                {/* BUSINESS LOGO */}
                {avatar && logo && (
                  <div className="absolute -bottom-2 -right-2 z-10 h-12 w-12 overflow-hidden rounded-full border-[3px] border-white bg-white shadow-lg sm:h-14 sm:w-14">
                    <img
                      src={logo}
                      alt="Business logo"
                      className="h-full w-full object-contain p-1"
                    />
                  </div>
                )}
              </div>

              {/* PROFILE NAME AND DETAILS */}
              <div className="min-w-0 w-full flex-1 pb-1 sm:w-auto">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="max-w-full break-words text-2xl font-black tracking-tight text-[#1C130B] sm:text-3xl lg:text-4xl">
                    {name || businessName || "Your Name"}
                  </h1>

                  {isVerified && (
                    <CheckCircle2
                      size={21}
                      className="fill-[#EA580C] text-white"
                      title="Verified Profile"
                    />
                  )}

                  {isVerified && (
                    <span className="rounded-full border border-[#E8D9C5] bg-[#F7EFE5] px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#9A3412]">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 break-words text-sm font-bold text-[#D95D08] sm:text-base">
                  {role || industry || "Professional"}
                </p>

                {/* RATING STARS */}
                <a
                  href="#creative-reviews"
                  onClick={(e) => {
                    e.preventDefault();
                    document
                      .getElementById("creative-reviews")
                      ?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="mt-1.5 flex items-center justify-center gap-1.5 sm:justify-start cursor-pointer transition hover:opacity-90"
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
                            : "fill-transparent text-[#D4C3A3]"
                        }
                      />
                    ))}
                  </div>
                  <span className="text-sm font-black text-[#1C130B]">
                    {displayRating}
                  </span>
                  <span className="text-xs font-semibold text-[#8C6D50]">
                    ({reviewsCount} {reviewsCount === 1 ? "review" : "reviews"})
                  </span>
                </a>

                {(location || industry) && (
                  <div className="mt-2 flex flex-wrap justify-center gap-x-4 gap-y-2 text-xs text-[#8C6D50] sm:justify-start">
                    {location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="shrink-0 text-[#D95D08]" />
                        {location}
                      </span>
                    )}

                    {industry && (
                      <span className="inline-flex items-center gap-1">
                        <BriefcaseBusiness
                          size={13}
                          className="shrink-0 text-[#D95D08]"
                        />
                        {industry}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* PROFILE ACTIONS */}
            <div className="mt-5 grid grid-cols-3 gap-2.5 sm:flex sm:flex-wrap sm:justify-start sm:gap-2.5">
              {visibleButtons.length > 0 ? (
                visibleButtons.map((button, index) => (
                  <button
                    key={button._id || button.id || index}
                    type="button"
                    onClick={() => onConfiguredButton(button)}
                    className={`flex h-11 min-w-0 w-full items-center justify-center gap-1.5 rounded-full px-2 text-[10px] font-bold shadow-sm transition hover:-translate-y-0.5 sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-xs active:scale-95 ${
                      button.actionType === "whatsapp"
                        ? "bg-[#25D366] text-white hover:bg-[#1DA851] shadow-emerald-600/10"
                        : button.actionType === "call"
                          ? "bg-gradient-to-r from-[#EA580C] to-[#C2410C] text-white hover:brightness-105 shadow-orange-600/10"
                          : "border border-[#E4D2BC] bg-white text-[#C2410C] hover:border-[#EA580C] hover:bg-[#FAF3EA]"
                    }`}
                  >
                    <span className="truncate flex items-center gap-1.5">
                      {renderContactButtonIcon(button)}
                      {button.label}
                    </span>
                    <ArrowUpRight size={13} className="shrink-0" />
                  </button>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onContactClick("phone")}
                    className={`${primaryButton} h-11 w-full min-w-0 gap-1.5 px-2 text-[10px] sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-xs`}
                  >
                    <Phone size={14} className="shrink-0" />
                    <span className="truncate">Call Now</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => onContactClick("whatsapp")}
                    className={`${secondaryButton} h-11 w-full min-w-0 gap-1.5 px-2 text-[10px] sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-xs`}
                  >
                    <MessageCircle size={14} className="shrink-0" />
                    <span className="truncate">WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={onShare}
                    className={`${secondaryButton} h-11 w-full min-w-0 gap-1.5 px-2 text-[10px] sm:h-auto sm:w-auto sm:px-5 sm:py-3 sm:text-xs`}
                  >
                    <Share2 size={14} className="shrink-0" />
                    <span className="truncate">Share Profile</span>
                  </button>
                </>
              )}
            </div>

            {/* SOCIAL LINKS */}
            {socialLinks.length > 0 && (
              <div className="mt-5 border-t border-[#E8D9C5] pt-4">
                <div className="flex flex-col items-center gap-2.5 sm:flex-row sm:items-center sm:justify-start sm:gap-3">
                  <span className="text-[10px] font-black uppercase tracking-[1.8px] text-[#8C6D50] shrink-0">
                    Connect
                  </span>

                  <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                    {socialLinks.map((social, index) => {
                      const Icon = getSocialIcon(social);
                      const platform = resolveSocialPlatform(social);

                      return (
                        <a
                          key={social._id || `${platform}-${index}`}
                          href={normalizeUrl(social.url)}
                          target="_blank"
                          rel="noopener noreferrer"
                          title={social.platformName || social.platform}
                          className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E4D2BC] bg-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-md active:scale-95"
                          style={{ color: getSocialColor(social) }}
                        >
                          <Icon size={15} />
                        </a>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================
          ABOUT SECTION
      ====================================== */}
      <section
        id="creative-about"
        className="w-full px-4 py-3 sm:px-7 sm:py-5 lg:px-10"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-[#EFE3D3] bg-gradient-to-br from-[#FAF5EF] via-white to-[#F7EFE5] p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[#FEDCB8]/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-[#FDE1C1]/50 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">
            {/* LEFT CONTENT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D9C5] bg-white px-3.5 py-1.5 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#D95D08]" />
                <p className={sectionLabel}>About Us</p>
              </div>

              <h2 className="mt-3 text-3xl font-black leading-tight tracking-tight text-[#1C130B] sm:text-4xl lg:text-5xl">
                A Little About
                <span className="block text-[#D95D08]">
                  {businessName || name || "Our Business"}
                </span>
              </h2>

              <p className="mt-3 max-w-2xl text-sm leading-8 text-[#5C4533] sm:text-base">
                {about ||
                  "I am passionate about creating meaningful digital experiences. I combine creativity, technology and smart strategies to build solutions that make a difference."}
              </p>

              {industry && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-[#E8D9C5] bg-white px-4 py-2.5 text-xs font-bold text-[#D95D08] shadow-sm">
                  <BriefcaseBusiness size={15} />
                  {industry}
                </div>
              )}
            </div>

            {/* RIGHT HIGHLIGHT CARD */}
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="rounded-[24px] border border-[#E8D9C5] bg-white/95 p-6 shadow-[0_12px_35px_-8px_rgba(28,19,11,0.08)] backdrop-blur sm:p-7">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[2px] text-[#D95D08]">
                      Our Identity
                    </p>
                    <h3 className="mt-1 text-xl font-black text-[#1C130B]">
                      Who We Are
                    </h3>
                  </div>

                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FAF0E6] text-[#D95D08]">
                    <ShieldCheck size={23} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-[#FAF5EF] p-3.5 border border-[#EFE3D3]">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D95D08] shadow-sm">
                      <BriefcaseBusiness size={16} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D50]">
                        Business
                      </p>
                      <p className="mt-0.5 break-words text-sm font-extrabold text-[#1C130B]">
                        {businessName || name || "Our Business"}
                      </p>
                    </div>
                  </div>

                  {industry && (
                    <div className="flex items-start gap-3 rounded-xl bg-[#FAF5EF] p-3.5 border border-[#EFE3D3]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D95D08] shadow-sm">
                        <Layers size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D50]">
                          Industry
                        </p>
                        <p className="mt-0.5 break-words text-sm font-extrabold text-[#1C130B]">
                          {industry}
                        </p>
                      </div>
                    </div>
                  )}

                  {(location || address) && (
                    <div className="flex items-start gap-3 rounded-xl bg-[#FAF5EF] p-3.5 border border-[#EFE3D3]">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#D95D08] shadow-sm">
                        <MapPin size={16} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#8C6D50]">
                          Location
                        </p>
                        <p className="mt-0.5 break-words text-sm font-extrabold text-[#1C130B]">
                          {address || location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isVerified && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-2.5 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={16} />
                    Verified Profile
                  </div>
                )}
              </div>

              <div className="absolute -right-2.5 -top-2.5 -z-10 h-full w-full rounded-[24px] border-2 border-[#E8D9C5]/80" />
            </div>
          </div>
        </div>
      </section>

      {/* =====================================
          PRODUCTS SECTION
      ====================================== */}

      {productList.length > 0 && (
        <section
          id="creative-work"
          className="w-full overflow-hidden px-4 py-4 sm:px-7 sm:py-6 lg:px-10"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={sectionLabel}>Featured Products</p>
              <h2 className={sectionHeading}>Our Products</h2>
              <p className="mt-1 text-xs text-[#8C6D50]">
                Quality products built for your success. Explore our latest
                collection.
              </p>
            </div>

            <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#D95D08]">
              Explore Collection
              <ArrowRight size={14} />
            </span>
          </div>

          <div className="product-swiper-wrap">
            <Swiper
              modules={[Pagination, A11y, Autoplay]}
              spaceBetween={14}
              slidesPerView={1}
              loop={productList.length > 1}
              grabCursor={true}
              watchOverflow={true}
              speed={600}
              autoplay={
                productList.length > 1
                  ? {
                      delay: 3500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="!overflow-visible !pb-8"
            >
              {productList.map((product, index) => {
                const cover = product.images?.find((item) => item?.url)?.url;

                return (
                  <SwiperSlide key={product._id || index} className="!h-auto">
                    <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-[#EFE3D3] bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D95D08]/40">
                      {/* Product Click Area */}
                      <button
                        type="button"
                        onClick={() => onProductClick(product)}
                        className="group flex w-full min-w-0 flex-1 flex-col text-left"
                      >
                        <div className="relative m-2.5 h-44 overflow-hidden rounded-xl bg-[#F5ECE0] sm:h-48">
                          {cover ? (
                            <img
                              src={cover}
                              alt={product.name}
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full items-center justify-center">
                              <ImageIcon size={32} className="text-[#CA9959]" />
                            </div>
                          )}

                          <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#D95D08] shadow backdrop-blur-sm sm:h-8 sm:w-8">
                            <ArrowUpRight size={14} />
                          </span>

                          {product.category && (
                            <span className="absolute bottom-2.5 left-2.5 rounded-md bg-[#1C130B]/80 px-2.5 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                              {product.category}
                            </span>
                          )}
                        </div>

                        <div className="flex flex-1 flex-col p-4 pt-1">
                          <h3 className="truncate text-sm font-extrabold text-[#1C130B] sm:text-base">
                            {product.name}
                          </h3>

                          <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-5 text-[#7C634E]">
                            {product.description}
                          </p>

                          <div className="mt-auto flex items-center justify-between gap-2 pt-3">
                            <p className="truncate text-base font-black text-[#1C130B] sm:text-lg">
                              ₹
                              {Number(product.price || 0).toLocaleString(
                                "en-IN",
                              )}
                            </p>

                            {/* WhatsApp Query Icon */}
                            <span
                              role="button"
                              tabIndex={0}
                              aria-label="WhatsApp Query"
                              onClick={(event) => {
                                event.stopPropagation();
                                onProductWhatsAppInquiry(product);
                              }}
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
                              className="flex h-8 w-8 shrink-0 cursor-pointer items-center justify-center rounded-full border border-[#25D366] text-[#25D366] transition hover:bg-[#25D366] hover:text-white"
                            >
                              <FaWhatsapp size={16} />
                            </span>
                          </div>
                        </div>
                      </button>

                      {/* Pay Now Button */}
                      <div className="px-4 pb-4">
                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1C130B] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#D95D08] active:scale-[0.98]"
                        >
                          Pay Now
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <style>{`
        .product-swiper-wrap .swiper-pagination {
          bottom: 0 !important;
        }

        .product-swiper-wrap .swiper-pagination-bullet {
          width: 7px;
          height: 7px;
          background: #D95D08;
          opacity: 0.3;
        }

        .product-swiper-wrap .swiper-pagination-bullet-active {
          width: 20px;
          border-radius: 20px;
          opacity: 1;
        }
      `}</style>
          </div>
        </section>
      )}

      {/* =====================================
          GALLERY SECTION
      ====================================== */}
      <section
        id="creative-gallery"
        className="w-full overflow-hidden bg-[#F5ECE0] px-4 py-5 sm:px-7 sm:py-6 lg:px-10"
      >
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-[#E8D9C5] bg-white px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-[#D95D08]" />
              <p className={sectionLabel}>Visual Stories</p>
            </div>

            <h2 className={sectionHeading}>Gallery & Our Work</h2>

            <p className="mt-1 text-xs leading-6 text-[#8C6D50] sm:text-sm">
              Explore some moments, projects and creative work.
            </p>
          </div>

          {galleryImages.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs font-bold text-[#D95D08]">
              <span>Swipe to explore</span>
              <ArrowRight size={14} />
            </div>
          )}
        </div>

        {galleryImages.length > 0 ? (
          <div className="gallery-swiper-wrap relative">
            <Swiper
              modules={[Pagination, A11y, Autoplay]}
              slidesPerView={1}
              spaceBetween={14}
              loop={galleryImages.length > 1}
              grabCursor={true}
              watchOverflow={true}
              speed={600}
              autoplay={
                galleryImages.length > 1
                  ? {
                      delay: 3800,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              breakpoints={{
                640: {
                  slidesPerView: 2,
                  spaceBetween: 16,
                },
                1024: {
                  slidesPerView: 3,
                  spaceBetween: 20,
                },
              }}
              className="!overflow-visible !pb-10"
            >
              {galleryImages.map((image, index) => (
                <SwiperSlide key={`${image.url}-${index}`} className="!h-auto">
                  <div className="flex h-full flex-col overflow-hidden rounded-[22px] border border-[#EFE3D3] bg-white shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-[#D95D08]/40">
                    {/* Gallery Image Preview */}
                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="group relative block aspect-[4/3] w-full overflow-hidden bg-[#F5ECE0] text-left"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || `Gallery ${index + 1}`}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-[#1C130B]/75 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />

                      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between gap-2 p-3 sm:p-4">
                        <div className="min-w-0">
                          <span className="text-[9px] font-bold uppercase tracking-[2px] text-[#FEDCB8]">
                            Our Work
                          </span>

                          <p className="mt-0.5 truncate text-xs font-extrabold text-white sm:text-sm">
                            {image.alt || `Gallery ${index + 1}`}
                          </p>
                        </div>

                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white text-[#D95D08] shadow transition group-hover:bg-[#D95D08] group-hover:text-white sm:h-9 sm:w-9">
                          <ArrowUpRight size={15} />
                        </span>
                      </div>
                    </button>

                    {/* WhatsApp Inquiry */}
                    <div className="p-3.5 sm:p-4">
                      <button
                        type="button"
                        onClick={() => onGalleryWhatsAppInquiry(image)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-xs font-bold text-white shadow-sm transition hover:bg-[#1DA851] active:scale-[0.98]"
                      >
                        <FaWhatsapp size={16} />
                        WhatsApp Inquiry
                      </button>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <style>{`
              .gallery-swiper-wrap .swiper-pagination {
                bottom: 0 !important;
              }

              .gallery-swiper-wrap .swiper-pagination-bullet {
                width: 7px;
                height: 7px;
                background: #D95D08;
                opacity: 0.3;
              }

              .gallery-swiper-wrap .swiper-pagination-bullet-active {
                width: 20px;
                border-radius: 20px;
                opacity: 1;
              }
            `}</style>
          </div>
        ) : (
          <div className="flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-dashed border-[#E8D9C5] bg-white text-center">
            <ImageIcon size={40} className="text-[#CA9959]" />
            <p className="mt-3 text-sm font-semibold text-[#8C6D50]">
              No gallery images added yet.
            </p>
          </div>
        )}
      </section>

      {/* =====================================
          REVIEWS SECTION — SLIDE ANIMATION
      ====================================== */}
      <section
        id="creative-reviews"
        className="w-full bg-[#FAF5EF] px-4 py-8 sm:px-7 sm:py-10 lg:px-10"
      >
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#F5E6D3] text-[#D95D08]">
                <MessageSquare size={15} />
              </span>
              <p className={sectionLabel}>Testimonials</p>
            </div>
            <div className="mt-1 flex items-center gap-3">
              <h2 className={sectionHeading}>Reviews & Ratings</h2>
              <div className="flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-black text-[#1C130B] shadow-sm border border-[#EFE3D3]">
                <Star size={13} className="fill-amber-400 text-amber-400" />
                <span>{displayRating}</span>
                <span className="text-[#8C7A6B] font-semibold">
                  ({reviewsCount})
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={onWriteReview}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#D95D08]/20 transition-all hover:opacity-95 hover:shadow-lg active:scale-[0.98] sm:text-sm"
          >
            <Star size={14} className="fill-white" />
            <span>Write a Review</span>
          </button>
        </div>

        {/* REVIEWS SLIDER */}
        <div className="creative-reviews-swiper relative">
          <Swiper
            modules={[Pagination, A11y, Autoplay]}
            slidesPerView={1}
            spaceBetween={14}
            loop={displayReviews.length > 1}
            grabCursor={true}
            watchOverflow={true}
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
            className="!overflow-visible !pb-10"
          >
            {displayReviews.map((review, index) => {
              const initial = (review.reviewerName || "U")
                .charAt(0)
                .toUpperCase();
              const ratingVal = Number(review.rating) || 5;

              return (
                <SwiperSlide key={review._id || index} className="!h-auto">
                  <div className="flex h-full flex-col justify-between rounded-2xl border border-[#EFE3D3] bg-white p-5 sm:p-6 shadow-sm shadow-amber-950/5 transition duration-300 hover:border-[#D95D08]/40 hover:shadow-md">
                    <div>
                      {/* Reviewer Header */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#EA580C] to-[#C2410C] text-white font-black text-sm shadow-sm">
                            {initial}
                          </div>
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-extrabold text-[#1C130B]">
                              {review.reviewerName}
                            </h3>
                            <p className="text-[11px] text-[#8C7A6B]">
                              {review.createdAt
                                ? new Date(review.createdAt).toLocaleDateString(
                                    "en-US",
                                    {
                                      month: "short",
                                      day: "numeric",
                                      year: "numeric",
                                    },
                                  )
                                : "Verified Client"}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-0.5 shrink-0 text-amber-400">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={14}
                              className={
                                s <= ratingVal
                                  ? "fill-amber-400 text-amber-400"
                                  : "text-slate-200 fill-transparent"
                              }
                            />
                          ))}
                        </div>
                      </div>

                      {/* Comment */}
                      <p className="mt-3.5 text-xs leading-relaxed text-[#4A3B2C] line-clamp-3 sm:text-sm">
                        "{review.comment}"
                      </p>
                    </div>

                    <div className="mt-4 flex items-center gap-1.5 text-[11px] font-bold text-[#D95D08]">
                      <CheckCircle2 size={13} className="text-[#D95D08]" />
                      <span>Verified Client</span>
                    </div>
                  </div>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>

        <style>{`
          .creative-reviews-swiper .swiper-pagination {
            bottom: 0 !important;
          }
          .creative-reviews-swiper .swiper-pagination-bullet {
            width: 7px;
            height: 7px;
            background: #D95D08;
            opacity: 0.3;
          }
          .creative-reviews-swiper .swiper-pagination-bullet-active {
            width: 22px;
            border-radius: 20px;
            background: #D95D08;
            opacity: 1;
          }
        `}</style>
      </section>

      {/* =====================================
          CONTACT + INQUIRY SECTION
      ====================================== */}
      <section
        id="creative-contact"
        className="w-full bg-[#FAF5EF] px-4 py-8 sm:px-7 sm:py-10 lg:px-10"
      >
        <div className="mb-6">
          <p className={sectionLabel}>Get In Touch</p>
          <h2 className={sectionHeading}>Let's Talk Together</h2>
        </div>

        <div className="grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-12">
          {/* CONTACT BANNER - DESKTOP ONLY */}
          <div className="relative hidden min-h-[280px] min-w-0 flex-col justify-between overflow-hidden rounded-2xl bg-gradient-to-br from-[#1C130B] via-[#2E1B0F] to-[#452814] p-7 text-white shadow-lg shadow-black/10 lg:col-span-4 lg:flex">
            {banner && (
              <img
                src={banner}
                alt="Contact background"
                className="absolute inset-0 h-full w-full object-cover opacity-15"
              />
            )}

            <div className="relative">
              <span className="inline-block rounded-full border border-[#D95D08]/30 bg-[#D95D08]/15 px-3 py-1 text-[9px] font-black uppercase tracking-[2px] text-[#FB923C]">
                Get In Touch
              </span>

              <h2 className="mt-4 text-2xl font-black leading-tight tracking-tight text-white xl:text-3xl">
                Let's Create Something Great Together
              </h2>

              <p className="mt-3 text-xs leading-6 text-white/80">
                Have a project or collaboration in mind? Share your ideas and
                let's bring them to life.
              </p>
            </div>

            <div className="relative pt-6">
              <button
                type="button"
                onClick={() => onContactClick("email")}
                className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] px-5 py-3 text-xs font-bold text-white shadow-md shadow-orange-950/30 transition hover:opacity-95"
              >
                <Send size={14} />
                Send a Message
              </button>
            </div>
          </div>

          {/* INQUIRY FORM */}
          <div
            className={`${cardClass} order-2 min-w-0 p-5 sm:order-none sm:p-7 lg:col-span-5`}
          >
            {formSubmitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                  <CheckCircle2 size={35} />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#1C130B]">
                  Inquiry Submitted!
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-[#8C7A6B]">
                  Thank you for reaching out. We will contact you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={onFormSubmit} className="space-y-4">
                <div className="mb-4">
                  <h3 className="text-lg font-black text-[#1C130B]">
                    Send an Inquiry
                  </h3>
                  <p className="mt-1 text-xs text-[#8C7A6B]">
                    Fill in your details and we'll be in touch.
                  </p>
                </div>

                {inquirySubmitError && (
                  <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-600">
                    {inquirySubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={formData.name}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={formData.phone}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                    setFormData({ ...formData, email: e.target.value })
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
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#EA580C] to-[#C2410C] py-3.5 text-sm font-bold text-white shadow-md shadow-[#D95D08]/20 transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {inquirySubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={15} />
                      Send Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* CONTACT INFORMATION */}
          <div className="order-1 flex min-w-0 flex-col gap-4 sm:order-none lg:col-span-3">
            <div className={`${cardClass} min-w-0 p-5`}>
              <h3 className="mb-4 text-sm font-black text-[#1C130B]">
                Contact Information
              </h3>

              <div className="space-y-2.5">
                {contactItems.map((item) => (
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
                    className="group flex w-full min-w-0 items-center gap-3 rounded-xl p-2 text-left transition hover:bg-[#F5EFE6] active:scale-[0.99] disabled:cursor-default disabled:hover:bg-transparent"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#FFF7ED] text-[#D95D08] border border-[#FDE68A]/30 transition group-hover:bg-[#D95D08] group-hover:text-white">
                      <item.Icon size={15} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span className="block break-all text-[12px] font-extrabold text-[#1C130B] transition group-hover:text-[#D95D08]">
                        {item.value}
                      </span>
                      <span className="mt-0.5 block text-[10px] text-[#8C7A6B]">
                        {item.sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SOCIAL MEDIA */}
            {socialLinks.length > 0 && (
              <div className={`${cardClass} min-w-0 p-5`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-[2px] text-[#D95D08]">
                      Stay Connected
                    </p>
                    <h3 className="mt-0.5 text-sm font-black text-[#1C130B]">
                      Social Media
                    </h3>
                  </div>
                  <span className="rounded-full border border-[#EFE3D3] bg-[#FAF5EF] px-2.5 py-0.5 text-[9px] font-bold text-[#D95D08]">
                    {socialLinks.length} account
                    {socialLinks.length !== 1 ? "s" : ""}
                  </span>
                </div>

                <div className="mt-4 creative-social-swiper">
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
                    className={socialLinks.length > 1 ? "pb-7" : ""}
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
                        }[platform] || "#D95D08";
                      const platformIconColor =
                        {
                          instagram: "#E4405F",
                          youtube: "#FF0000",
                          facebook: "#1877F2",
                          whatsapp: "#25D366",
                          linkedin: "#0A66C2",
                          telegram: "#26A5E4",
                          twitter: "#000000",
                          x: "#000000",
                          github: "#24292e",
                          pinterest: "#E60023",
                          discord: "#5865F2",
                          snapchat: "#FFFC00",
                          tiktok: "#EE1D52",
                          reddit: "#FF4500",
                          threads: "#000000",
                          twitch: "#9146FF",
                          spotify: "#1DB954",
                        }[platform] || "#D95D08";
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
                      const badgeIconColor = isLightBadge
                        ? "#000000"
                        : "#ffffff";

                      return (
                        <SwiperSlide key={social._id || `${platform}-${index}`}>
                          <a
                            href={normalizeUrl(social.url)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col rounded-xl border border-[#EFE3D3] bg-white p-3.5 transition hover:border-[#D95D08]/50 hover:shadow-sm active:scale-[0.98]"
                          >
                            {/* Top row: avatar + info */}
                            <div className="flex items-center gap-3">
                              <div className="relative h-12 w-12 shrink-0">
                                {social.profileImage ? (
                                  <img
                                    src={social.profileImage}
                                    alt={displayName}
                                    className="h-12 w-12 rounded-full object-cover ring-2 ring-[#EFE3D3]"
                                  />
                                ) : (
                                  <div
                                    className="flex h-12 w-12 items-center justify-center rounded-full"
                                    style={{
                                      background: `${platformIconColor}18`,
                                    }}
                                  >
                                    <Icon
                                      size={20}
                                      style={{ color: platformIconColor }}
                                    />
                                  </div>
                                )}
                                <div
                                  className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white"
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
                                  <p className="truncate text-xs font-black text-[#1C130B]">
                                    {displayName}
                                  </p>
                                  {social.verifiedTick && (
                                    <CheckCircle2
                                      size={11}
                                      className="shrink-0 text-[#D95D08]"
                                    />
                                  )}
                                </div>
                                {social.handle && (
                                  <p className="truncate text-[10px] font-semibold text-[#D95D08]">
                                    {social.handle}
                                  </p>
                                )}
                                {social.audience && (
                                  <p className="mt-0.5 text-[9px] text-[#8C7A6B]">
                                    {social.audience}
                                  </p>
                                )}
                              </div>
                            </div>
                            {/* Description */}
                            {social.description && (
                              <p className="mt-2.5 line-clamp-2 text-[10px] leading-relaxed text-[#5C4825]">
                                {social.description}
                              </p>
                            )}
                            {/* CTA Button */}
                            <div
                              className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-1.5 text-[11px] font-bold text-white shadow-sm"
                              style={{ background: platformCtaBg }}
                            >
                              <Icon size={11} />
                              <span>{ctaLabel}</span>
                              <ExternalLink
                                size={10}
                                className="ml-auto opacity-80"
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
                    .creative-social-swiper .swiper-pagination {
                      bottom: 0 !important;
                    }
                    .creative-social-swiper .swiper-pagination-bullet {
                      background: #D95D08;
                      opacity: 0.3;
                    }
                    .creative-social-swiper .swiper-pagination-bullet-active {
                      background: #D95D08;
                      opacity: 1;
                      width: 16px;
                      border-radius: 8px;
                    }
                  `}</style>
                )}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =====================================
          QR SCANNER SECTION
      ====================================== */}
      {qrTargetUrl && (
        <section className="relative w-full overflow-hidden px-4 py-10 sm:px-7 sm:py-16 lg:px-10">
          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#140D07] via-[#24150B] to-[#3A2210] p-6 text-white shadow-[0_20px_60px_rgba(20,13,7,0.25)] sm:p-8 lg:p-10">
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[35px] border-white/5" />

            <div className="relative grid items-center gap-9 lg:grid-cols-12 lg:gap-12">
              {/* SCANNER CONTENT */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 backdrop-blur">
                  <ScanLine size={14} className="text-[#FDBA74]" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-[#FDBA74]">
                    Digital Connection
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Scan.
                  <span className="text-[#EA580C]"> Connect.</span>
                  <br />
                  Grow Together.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-white/80 sm:text-base">
                  Connect with us instantly. Scan this QR code to access our
                  digital profile, contact information and business details in
                  seconds.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-[#EA580C] to-[#C2410C] px-6 py-3.5 text-xs font-extrabold text-white shadow-lg shadow-orange-950/40 transition hover:-translate-y-0.5 hover:opacity-95"
                  >
                    <ScanLine size={16} />
                    Open QR Scanner
                    <ArrowUpRight size={15} />
                  </button>

                  {!qrFetching && (
                    <a
                      href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                        qrTargetUrl,
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <Download size={16} />
                      Download QR
                    </a>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <CheckCircle2 size={16} className="text-[#EA580C]" />
                    Instant Access
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <ShieldCheck size={16} className="text-[#EA580C]" />
                    Easy Connection
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-white/90">
                    <Zap size={16} className="text-[#EA580C]" />
                    Quick & Simple
                  </div>
                </div>
              </div>

              {/* QR CODE CARD */}
              <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <div className="w-full max-w-[310px] rounded-2xl border border-[#EFE3D3] bg-white p-5 text-center shadow-2xl sm:p-6">
                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF7ED] text-[#D95D08] border border-[#FDE68A]/30">
                    <ScanLine size={24} />
                  </div>

                  <h3 className="mt-4 text-lg font-black text-[#1C130B]">
                    Scan to Connect
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-[#8C7A6B]">
                    Point your camera at the QR code
                  </p>

                  <div className="mx-auto mt-5 flex min-h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-[#EFE3D3] bg-[#FAF5EF] p-3">
                    {qrFetching ? (
                      <div className="flex h-[190px] w-[190px] items-center justify-center text-sm font-semibold text-[#8C7A6B]">
                        Loading QR...
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white p-2 shadow-sm">
                        <QRCodeCanvas
                          value={qrTargetUrl}
                          size={190}
                          level="H"
                          includeMargin
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[1.5px] text-[#D95D08]">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready to Scan
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-[#8C7A6B]">
                    Share your profile with one simple scan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* CREATE YOUR BIO SITES BUTTON */}
      <div className="flex justify-center px-5 py-6">
        <a
          href="/"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-full border border-[#D95D08]/30 bg-gradient-to-r from-[#D95D08]/10 to-[#f59e0b]/10 px-6 py-2.5 text-xs font-bold tracking-wide text-[#D95D08] shadow-lg shadow-[#D95D08]/10 transition-all duration-200 hover:border-[#D95D08]/60 hover:from-[#D95D08]/20 hover:to-[#f59e0b]/20 hover:text-[#9A3412] hover:shadow-[#D95D08]/20"
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
    </div>
  );
};

export default CreativePortfolio;
