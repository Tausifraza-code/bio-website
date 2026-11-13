import React from "react";
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
  Copy,
  CreditCard,
  Bookmark,
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
import SnapchatIcon from "./icons/SnapchatIcon";

const MinimalLuxury = ({
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
    websiteUrl = "",
    address = "",
    logo = null,
    avatar = null,
    banner = null,
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
    upiId = "",
    mapLink = "",
  } = businessInfo;

  const [copiedUpi, setCopiedUpi] = React.useState(false);

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
    snapchat: SnapchatIcon,
    tiktok: FaTiktok,
    reddit: FaReddit,
    threads: FaThreads,
    twitch: FaTwitch,
    spotify: FaSpotify,
    medium: FaMedium,
  };

  const socialColors = {
    instagram: "bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976]",
    facebook: "bg-[#1877F2]",
    whatsapp: "bg-[#25D366]",
    youtube: "bg-[#FF0000]",
    linkedin: "bg-[#0A66C2]",
    twitter: "bg-[#000000]",
    x: "bg-[#000000]",
    telegram: "bg-[#26A5E4]",
    pinterest: "bg-[#E60023]",
    snapchat: "bg-[#FFFC00] text-black",
    github: "bg-[#181717]",
    tiktok: "bg-[#000000]",
    threads: "bg-[#000000]",
    discord: "bg-[#5865F2]",
    reddit: "bg-[#FF4500]",
    twitch: "bg-[#9146FF]",
    spotify: "bg-[#1DB954]",
    medium: "bg-[#000000]",
    website: "bg-[#4285F4]",
  };

  const normalizePlatform = (social = {}) => {
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
    const platform = normalizePlatform(social);

    const found = Object.keys(socialIconMap).find((item) =>
      platform.includes(item),
    );

    return found ? socialIconMap[found] : FaLink;
  };

  const normalizeUrl = (url = "") => {
    if (!url) return "";

    const value = String(url).trim();

    if (!value) return "";

    if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
      return value;
    }

    return `https://${value}`;
  };

  const renderContactButtonIcon = (button = {}, isPrimary = false) => {
    const type = (
      button.actionType ||
      button.value ||
      button.type ||
      ""
    ).toLowerCase();
    const label = (button.label || "").toLowerCase();
    const icon = (button.icon || "").toLowerCase();

    const iconSize = 19;
    const iconClass = isPrimary
      ? "shrink-0 text-white"
      : "shrink-0 text-[#24415F] group-hover:text-[#12BCEB] transition-colors";

    if (
      type === "googlebusiness" ||
      icon === "google" ||
      label.includes("google")
    ) {
      return <GoogleBusinessIcon size={iconSize} className="shrink-0" />;
    }
    if (
      type === "whatsapp" ||
      icon === "whatsapp" ||
      label.includes("whatsapp")
    ) {
      return <FaWhatsapp size={iconSize} className={iconClass} />;
    }
    if (
      type === "call" ||
      type === "phone" ||
      icon === "phone" ||
      label.includes("call") ||
      label === "phone"
    ) {
      return <Phone size={iconSize} className={iconClass} />;
    }
    if (
      type === "email" ||
      type === "mail" ||
      icon === "mail" ||
      label.includes("email") ||
      label.includes("mail")
    ) {
      return <Mail size={iconSize} className={iconClass} />;
    }
    if (
      type === "savecontact" ||
      type === "save" ||
      type === "contact" ||
      label.includes("save")
    ) {
      return (
        <UserRoundPlus
          size={iconSize}
          className={
            isPrimary
              ? "shrink-0 text-white"
              : "shrink-0 text-[#24415F] group-hover:text-[#12BCEB] transition-colors"
          }
        />
      );
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
      return <IndianRupee size={iconSize} className={iconClass} />;
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
      return <MapPin size={iconSize} className={iconClass} />;
    }
    if (type === "share" || icon === "share" || label.includes("share")) {
      return <Share2 size={iconSize} className={iconClass} />;
    }
    if (
      type === "website" ||
      type === "web" ||
      icon === "globe" ||
      label.includes("website") ||
      label.includes("web")
    ) {
      return <Globe size={iconSize} className={iconClass} />;
    }
    if (type === "customlink" || type === "link" || icon === "link") {
      return <Link2 size={iconSize} className={iconClass} />;
    }
    return <ExternalLink size={iconSize} className={iconClass} />;
  };

  const swiperAutoplay = {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  const inputClass =
    "w-full rounded-xl border border-[#DFE8F1] bg-[#F8FBFD] px-4 py-3.5 text-sm text-[#10233F] placeholder:text-[#8B9AAF] outline-none transition focus:border-[#12BCEB] focus:ring-4 focus:ring-[#12BCEB]/10 disabled:opacity-50";

  const configuredButtons = Array.isArray(visibleButtons) ? visibleButtons : [];

  const products = Array.isArray(productList) ? productList : [];

  const gallery = Array.isArray(galleryImages)
    ? galleryImages.filter((image) => image?.url)
    : [];

  const socials = Array.isArray(socialLinks)
    ? socialLinks.filter((social) => social?.url)
    : [];

  const firstSocialLinks = socials;

  const contactButtons = configuredButtons;

  const hasBusinessName = Boolean(businessName || name);

  const hasWebsite = Boolean(website || websiteUrl);

  const handleCopyUpi = async () => {
    if (!upiId) return;

    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);

      window.setTimeout(() => {
        setCopiedUpi(false);
      }, 1800);
    } catch (error) {
      console.error("UPI copy failed:", error);
    }
  };

  const handleMobileAction = (type) => {
    if (type === "saveContact") {
      onConfiguredButton({ actionType: "saveContact" });
      return;
    }

    if (type === "save") {
      onOpenQr();
      return;
    }

    onContactClick({ actionType: type });
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById("mobile-profile-qr");

    if (!canvas) return;

    try {
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = imageUrl;
      link.download = `${businessName || name || "profile"}-qr.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-[#F3F6FA] text-[#0A2540]"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="block">
        <main className="mx-auto w-full max-w-[430px] overflow-hidden px-2 pb-6 pt-1 md:max-w-[560px] lg:max-w-[680px] lg:pt-3">
          {/* HERO */}
          <section
            id="premium-home"
            className="relative overflow-hidden rounded-[28px] border border-[#E2EAF1] bg-white shadow-[0_10px_35px_-10px_rgba(8,43,92,0.10)]"
          >
            {/* COVER */}
            <div className="relative h-[190px] overflow-hidden bg-[#082B5C] sm:h-[210px]">
              {banner ? (
                <img
                  src={banner}
                  alt={businessName || name || "Cover"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#061833] via-[#082B5C] to-[#12BCEB]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/15 to-black/25" />

              {/* LOGO AND PROFILE LABEL */}
              <div className="absolute left-3.5 top-3.5 z-10 flex items-center gap-2 sm:left-4 sm:top-4">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-white p-1 shadow-lg">
                  {logo ? (
                    <img
                      src={logo}
                      alt={businessName || name || "Logo"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <UserRound size={15} className="text-[#082B5C]" />
                  )}
                </div>

                {hasBusinessName && (
                  <div className="max-w-[210px] truncate rounded-full border border-white/25 bg-black/40 px-3 py-1 text-[11px] font-bold text-white shadow-sm backdrop-blur-md md:text-[12px]">
                    {businessName || name}
                  </div>
                )}
              </div>

              {/* VERIFIED */}
              {isVerified && (
                <div className="absolute right-3.5 top-3.5 z-10 sm:right-4 sm:top-4">
                  <div className="flex items-center gap-1 rounded-full border border-white/30 bg-white/95 px-2.5 py-1 text-[9px] font-black tracking-wider text-[#082B5C] shadow-md backdrop-blur-md">
                    <CheckCircle2 size={11} className="text-[#12BCEB]" />
                    VERIFIED
                  </div>
                </div>
              )}

              {/* COVER ACTIONS */}
              <div className="absolute bottom-3.5 right-3.5 z-10 flex items-center gap-2 sm:bottom-4 sm:right-4">
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Share profile"
                  title="Share Profile"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-black/35 text-white shadow-md backdrop-blur-md transition-all hover:bg-black/55 hover:scale-105 active:scale-95"
                >
                  <Share2 size={15} />
                </button>

                <button
                  type="button"
                  onClick={onOpenQr}
                  aria-label="Scan profile QR"
                  title="Scan Profile QR"
                  className="flex h-9 w-9 items-center justify-center rounded-full border border-white/35 bg-[#12BCEB] text-white shadow-md backdrop-blur-md transition-all hover:bg-[#0FAADC] hover:scale-105 active:scale-95"
                >
                  <QrCode size={16} />
                </button>
              </div>
            </div>

            {/* PROFILE */}
            <div className="relative px-4 pb-4 sm:px-5 sm:pb-5">
              <div className="relative -mt-[5px] min-h-[96px]">
                {/* AVATAR */}
                <div className="relative h-[86px] w-[86px] shrink-0 rounded-2xl border-[3.5px] border-white bg-white shadow-[0_10px_25px_-5px_rgba(8,43,92,0.22)] ring-1 ring-black/5">
                  <div className="h-full w-full overflow-hidden rounded-[12px] bg-[#E8F8FD]">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <UserRound size={38} className="text-[#8AA4BD]" />
                      </div>
                    )}
                  </div>

                  {isVerified && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#12BCEB] text-white shadow">
                      <CheckCircle2 size={11} />
                    </span>
                  )}
                </div>

                {/* PROFILE INFO */}
                {(name || role || location) && (
                  <div className="absolute left-[98px] right-0 top-[2px]">
                    {name && (
                      <div className="flex items-center gap-1">
                        <h1 className="truncate text-[16px] font-black tracking-[-0.02em] text-[#082B5C] sm:text-[18px]">
                          {name}
                        </h1>

                        {isVerified && (
                          <CheckCircle2
                            size={14}
                            className="shrink-0 fill-[#12BCEB] text-white"
                          />
                        )}
                      </div>
                    )}

                    {role && (
                      <p className="mt-0.5 truncate text-[13px] font-semibold text-[#486581] sm:text-[14px]">
                        {role}
                      </p>
                    )}

                    {/* RATING STARS */}
                    <a
                      href="#minimal-reviews"
                      onClick={(e) => {
                        e.preventDefault();
                        document
                          .getElementById("minimal-reviews")
                          ?.scrollIntoView({ behavior: "smooth" });
                      }}
                      className="mt-0.5 inline-flex items-center gap-1.5 text-[12px] cursor-pointer transition hover:opacity-85"
                      title="View reviews and ratings"
                    >
                      <div className="flex items-center gap-0.5 text-amber-400">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            size={12}
                            className={
                              star <= Math.round(Number(displayRating))
                                ? "fill-amber-400 text-amber-400"
                                : "fill-transparent text-slate-300"
                            }
                          />
                        ))}
                      </div>
                      <span className="font-bold text-[#082B5C]">
                        {displayRating}
                      </span>
                      <span className="font-medium text-[#71839A]">
                        ({reviewsCount}{" "}
                        {reviewsCount === 1 ? "review" : "reviews"})
                      </span>
                    </a>

                    {location && (
                      <a
                        href={
                          mapLink ||
                          `https://maps.google.com/?q=${encodeURIComponent(
                            location,
                          )}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() =>
                          onContactClick && onContactClick("directions")
                        }
                        title="Open in Google Maps"
                        className="group mt-0.5 inline-flex items-center gap-1 text-[12px] font-medium text-[#627D98] transition hover:text-[#12BCEB] cursor-pointer"
                      >
                        <MapPin
                          size={11}
                          className="shrink-0 text-[#12BCEB] transition-transform group-hover:scale-110"
                        />
                        <span className="truncate group-hover:underline">{location}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* SOCIAL ICONS */}
              {firstSocialLinks.length > 0 && (
                <div className="mt-2.5 flex flex-wrap items-center gap-2">
                  {firstSocialLinks.map((social, index) => {
                    const Icon = getSocialIcon(social);
                    const platform = normalizePlatform(social);
                    const brandColor = socialColors[platform] || "bg-[#64748B]";

                    return (
                      <a
                        key={social._id || `${platform}-${index}`}
                        href={normalizeUrl(social.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          social.platformName ||
                          social.platform ||
                          "Social link"
                        }
                        className={`group relative flex h-[31px] w-[31px] shrink-0 cursor-pointer items-center justify-center rounded-full text-white shadow-sm transition-all duration-300 ease-out hover:-translate-y-1 hover:scale-110 hover:shadow-lg hover:shadow-black/20 hover:brightness-110 active:scale-95 active:translate-y-0 ${brandColor}`}
                      >
                        <Icon
                          size={13}
                          className="transition-transform duration-300 ease-out group-hover:scale-110"
                        />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* QUICK ACTIONS */}
              {contactButtons.length > 0 && (
                <div className="mt-3.5">
                  <div
                    className={`grid gap-2 ${
                      contactButtons.length <= 2
                        ? "grid-cols-2"
                        : contactButtons.length === 3
                          ? "grid-cols-3"
                          : "grid-cols-2 xs:grid-cols-3 sm:grid-cols-4"
                    }`}
                  >
                    {contactButtons.map((button, index) => {
                      const type = (
                        button.actionType ||
                        button.value ||
                        button.type ||
                        ""
                      ).toLowerCase();
                      const label = (button.label || "").toLowerCase();
                      const isSave =
                        type === "savecontact" ||
                        type === "save" ||
                        label.includes("save") ||
                        button.buttonId === "save-contact";

                      const hasSaveInList = contactButtons.some((b) => {
                        const bType = (
                          b.actionType ||
                          b.value ||
                          b.type ||
                          ""
                        ).toLowerCase();
                        const bLabel = (b.label || "").toLowerCase();
                        return (
                          bType === "savecontact" ||
                          bType === "save" ||
                          bLabel.includes("save") ||
                          b.buttonId === "save-contact"
                        );
                      });

                      const isHighlighted =
                        isSave || (index === 0 && !hasSaveInList);

                      return (
                        <button
                          key={button._id || button.id || index}
                          type="button"
                          onClick={() => onConfiguredButton(button)}
                          className={`group flex min-h-[72px] flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 transition-all duration-200 active:scale-95 ${
                            isHighlighted
                              ? "border-transparent bg-gradient-to-br from-[#12BCEB] to-[#0BA8D6] text-white shadow-md shadow-[#12BCEB]/25 hover:brightness-105"
                              : "border-[#E1EAF2] bg-[#F8FBFC] text-[#1E3A5F] shadow-sm hover:border-[#12BCEB]/50 hover:bg-white hover:text-[#082B5C] hover:shadow-sm"
                          }`}
                        >
                          <div className="flex h-5 items-center justify-center">
                            {renderContactButtonIcon(button, isHighlighted)}
                          </div>
                          <span className="w-full px-0.5 text-center text-[10.5px] font-bold leading-tight break-words">
                            {button.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          </section>

          {/* ABOUT */}
          {about && (
            <section className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-4 shadow-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                About
              </p>
              <p className="mt-2 whitespace-pre-line text-[13.5px] leading-relaxed text-[#4A6480]">
                {about}
              </p>
            </section>
          )}

          {/* BUSINESS DETAILS */}
          {(hasBusinessName ||
            industry ||
            phone ||
            email ||
            hasWebsite ||
            address) && (
            <section className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Business Details
                  </p>

                  {hasBusinessName && (
                    <h2 className="mt-1 text-[16px] font-black text-[#082B5C]">
                      {businessName || name}
                    </h2>
                  )}
                </div>

                {industry && (
                  <span className="rounded-full border border-[#CDEEF9] bg-[#E8F8FD] px-3 py-1 text-[11px] font-bold text-[#087DA1]">
                    {industry}
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
                {phone && (
                  <button
                    type="button"
                    onClick={() => onContactClick({ actionType: "call" })}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#E9F0F6] bg-[#F8FBFC] p-2.5 sm:p-3 text-left transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FD] text-[#12BCEB] transition group-hover:scale-105 group-hover:bg-[#12BCEB] group-hover:text-white">
                      <Phone size={13} />
                    </div>

                    <span className="truncate text-[12px] font-bold text-[#3E5771] transition group-hover:text-[#082B5C]">
                      {phone}
                    </span>
                  </button>
                )}

                {email && (
                  <button
                    type="button"
                    onClick={() => onContactClick({ actionType: "email" })}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#E9F0F6] bg-[#F8FBFC] p-2.5 sm:p-3 text-left transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FD] text-[#12BCEB] transition group-hover:scale-105 group-hover:bg-[#12BCEB] group-hover:text-white">
                      <Mail size={13} />
                    </div>

                    <span className="truncate text-[12px] font-bold text-[#3E5771] transition group-hover:text-[#082B5C]">
                      {email}
                    </span>
                  </button>
                )}

                {hasWebsite && (
                  <button
                    type="button"
                    onClick={() =>
                      onContactClick({
                        actionType: "website",
                        customUrl: website || websiteUrl,
                      })
                    }
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#E9F0F6] bg-[#F8FBFC] p-2.5 sm:p-3 text-left transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FD] text-[#12BCEB] transition group-hover:scale-105 group-hover:bg-[#12BCEB] group-hover:text-white">
                      <Globe size={13} />
                    </div>

                    <span className="truncate text-[12px] font-bold text-[#3E5771] transition group-hover:text-[#082B5C]">
                      {website || websiteUrl}
                    </span>
                  </button>
                )}

                {address && (
                  <button
                    type="button"
                    onClick={() => onContactClick({ actionType: "directions" })}
                    className="group flex min-w-0 items-center gap-3 rounded-xl border border-[#E9F0F6] bg-[#F8FBFC] p-2.5 sm:p-3 text-left transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FD] text-[#12BCEB] transition group-hover:scale-105 group-hover:bg-[#12BCEB] group-hover:text-white">
                      <MapPin size={13} />
                    </div>

                    <span className="min-w-0 whitespace-normal break-words text-[12px] font-bold leading-relaxed text-[#405B75]">
                      {address}
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* PRODUCTS */}
          {products.length > 0 && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Featured Product Collection
                  </p>
                </div>

                <span className="text-[10px] font-bold text-[#7C8EA2]">
                  Swipe →
                </span>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={12}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 14,
                  },
                }}
                loop={products.length > 1}
                speed={600}
                autoplay={
                  products.length > 1
                    ? {
                        delay: 3500,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                pagination={
                  products.length > 1
                    ? {
                        clickable: true,
                        dynamicBullets: true,
                      }
                    : false
                }
                className="mobile-product-swiper !pb-7"
              >
                {products.map((product, index) => {
                  const cover = product.images?.find((item) => item?.url)?.url;

                  return (
                    <SwiperSlide key={product._id || index}>
                      <div className="overflow-hidden rounded-2xl border border-[#E1EAF2] bg-white shadow-sm transition-all duration-300 hover:border-[#12BCEB]/50 hover:shadow-md">
                        {/* Product Click Area */}
                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="group block w-full text-left"
                        >
                          <div className="relative h-[175px] overflow-hidden bg-[#EEF5F9] sm:h-[150px]">
                            {cover ? (
                              <img
                                src={cover}
                                alt={product.name || "Product"}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon
                                  size={25}
                                  className="text-[#9CB1C5]"
                                />
                              </div>
                            )}

                            {product.category && (
                              <span className="absolute bottom-2 left-2 rounded-md bg-[#082B5C]/80 px-2 py-0.5 text-[10px] font-semibold text-white backdrop-blur-sm">
                                {product.category}
                              </span>
                            )}
                          </div>

                          <div className="p-3 sm:p-3.5">
                            {product.name && (
                              <h3 className="truncate text-[14px] font-black text-[#183250] sm:text-[15px]">
                                {product.name}
                              </h3>
                            )}

                            {product.description && (
                              <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-[#7C8EA2]">
                                {product.description}
                              </p>
                            )}
                          </div>
                        </button>

                        {/* Price + WhatsApp Icon */}
                        <div className="flex items-center justify-between px-3 pb-3 sm:px-3.5 sm:pb-3.5">
                          {product.price !== undefined &&
                            product.price !== null &&
                            product.price !== "" && (
                              <span className="text-[16px] font-black text-[#082B5C]">
                                ₹{Number(product.price).toLocaleString("en-IN")}
                              </span>
                            )}

                          <button
                            type="button"
                            onClick={() => onProductWhatsAppInquiry(product)}
                            aria-label="WhatsApp Inquiry"
                            title="WhatsApp Inquiry"
                            className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#25D366]/10 text-[#25D366] transition hover:bg-[#25D366] hover:text-white active:scale-95"
                          >
                            <FaWhatsapp size={18} />
                          </button>
                        </div>

                        {/* PAY NOW BUTTON */}
                        <div className="px-3 pb-3 sm:px-3.5 sm:pb-3.5">
                          <button
                            type="button"
                            onClick={() => onProductClick(product)}
                            className="flex w-full items-center justify-center rounded-xl bg-[#082B5C] py-2.5 text-[12px] font-bold text-white transition hover:bg-[#12BCEB] active:scale-[0.98]"
                          >
                            Pay Now
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </section>
          )}

          {/* GALLERY */}
          {gallery.length > 0 && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Gallery
                  </p>

                  <h2 className="mt-1 text-[14px] font-black text-[#082B5C]">
                    Photos
                  </h2>
                </div>

                <span className="text-[8px] font-bold text-[#7C8EA2]">
                  Swipe →
                </span>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={12}
                slidesPerView={1}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 14,
                  },
                }}
                loop={gallery.length > 1}
                speed={600}
                autoplay={
                  gallery.length > 1
                    ? {
                        delay: 3800,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                pagination={
                  gallery.length > 1
                    ? {
                        clickable: true,
                        dynamicBullets: true,
                      }
                    : false
                }
                className="mobile-gallery-swiper !pb-6"
              >
                {gallery.map((image, index) => (
                  <SwiperSlide key={image._id || `${image.url}-${index}`}>
                    <div className="overflow-hidden rounded-2xl border border-[#E1EAF2] bg-white p-2.5 shadow-sm transition-all duration-300 hover:border-[#12BCEB]/50 hover:shadow-md">
                      <button
                        type="button"
                        onClick={() => onGalleryClick(image)}
                        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EEF5F9] lg:aspect-[16/10]"
                      >
                        <img
                          src={image.url}
                          alt={image.alt || image.title || "Gallery image"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />

                        <span className="absolute bottom-2 left-2 rounded-full bg-[#082B5C]/80 px-2 py-0.5 text-[8px] font-bold text-white backdrop-blur-sm">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </button>

                      {/* WhatsApp Gallery Inquiry */}
                      <div className="mt-2.5">
                        <button
                          type="button"
                          onClick={() => onGalleryWhatsAppInquiry(image)}
                          className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] py-2.5 text-[11px] font-bold text-white transition hover:bg-[#1DA851] active:scale-[0.98]"
                        >
                          <FaWhatsapp size={16} />
                          WhatsApp Inquiry
                        </button>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {/* ================================== */}
          {/* REVIEWS — SLIDE ANIMATION CAROUSEL */}
          {/* ================================== */}
          <section
            id="minimal-reviews"
            className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                  Client Reviews
                </p>
                <div className="mt-0.5 flex items-center gap-1.5">
                  <h2 className="text-[15px] font-black text-[#082B5C]">
                    Reviews & Ratings
                  </h2>
                  <div className="flex items-center gap-1 rounded-full border border-[#CDEEF9] bg-[#E8F8FD] px-2.5 py-0.5 text-[11px] font-bold text-[#082B5C]">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span>{displayRating}</span>
                    <span className="text-[#71839A]">({reviewsCount})</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={onWriteReview}
                className="flex items-center justify-center gap-1.5 rounded-xl bg-[#082B5C] px-3.5 py-2 text-[11px] font-bold text-white shadow-sm transition hover:bg-[#12BCEB] active:scale-[0.98]"
              >
                <Star size={12} className="fill-white" />
                <span>Write Review</span>
              </button>
            </div>

            {/* SLIDE ANIMATION */}
            <div className="minimal-reviews-swiper relative">
              <Swiper
                modules={[Autoplay, Pagination]}
                slidesPerView={1}
                spaceBetween={10}
                loop={displayReviews.length > 1}
                speed={600}
                autoplay={{
                  delay: 3500,
                  disableOnInteraction: false,
                  pauseOnMouseEnter: true,
                }}
                breakpoints={{
                  640: { slidesPerView: 2, spaceBetween: 12 },
                  1024: { slidesPerView: 2, spaceBetween: 12 },
                }}
                pagination={{ clickable: true, dynamicBullets: true }}
                className="!pb-7"
              >
                {displayReviews.map((review, index) => {
                  const initial = (review.reviewerName || "U")
                    .charAt(0)
                    .toUpperCase();
                  const ratingVal = Number(review.rating) || 5;

                  return (
                    <SwiperSlide key={review._id || index} className="!h-auto">
                      <div className="flex h-full flex-col justify-between rounded-xl border border-[#E2EAF1] bg-[#F8FBFC] p-3.5 transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm">
                        <div>
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB] font-bold text-xs border border-[#CDEEF9]">
                                {initial}
                              </div>
                              <div className="min-w-0">
                                <h3 className="truncate text-xs font-bold text-[#082B5C]">
                                  {review.reviewerName}
                                </h3>
                                <p className="text-[10px] text-[#71839A]">
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
                                  size={11}
                                  className={
                                    s <= ratingVal
                                      ? "fill-amber-400 text-amber-400"
                                      : "text-slate-300 fill-transparent"
                                  }
                                />
                              ))}
                            </div>
                          </div>

                          <p className="mt-2 text-xs leading-relaxed text-[#304D6C] line-clamp-3">
                            "{review.comment}"
                          </p>
                        </div>

                        <div className="mt-2.5 flex items-center gap-1 text-[10px] font-bold text-[#12BCEB]">
                          <CheckCircle2 size={11} className="text-[#12BCEB]" />
                          <span>Verified Review</span>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            <style>{`
              .minimal-reviews-swiper .swiper-pagination {
                bottom: 0 !important;
              }
              .minimal-reviews-swiper .swiper-pagination-bullet {
                background: #082B5C;
                opacity: 0.25;
              }
              .minimal-reviews-swiper .swiper-pagination-bullet-active {
                background: #12BCEB;
                opacity: 1;
              }
            `}</style>
          </section>

          {/* SOCIAL MEDIA */}
          {socials.length > 0 && (
            <section className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Stay Connected
                  </p>
                  <h2 className="mt-1 text-[15px] font-black text-[#082B5C]">
                    Social Media
                  </h2>
                </div>
                <span className="rounded-full border border-[#E2EAF1] bg-[#F8FBFC] px-2.5 py-0.5 text-[9px] font-bold text-[#12BCEB]">
                  {socials.length} account{socials.length !== 1 ? "s" : ""}
                </span>
              </div>

              <div className="mt-3 minimal-social-swiper">
                <Swiper
                  modules={[Autoplay, Pagination]}
                  slidesPerView={1}
                  spaceBetween={12}
                  loop={socials.length > 1}
                  speed={500}
                  autoplay={{
                    delay: 3500,
                    disableOnInteraction: false,
                    pauseOnMouseEnter: true,
                  }}
                  pagination={socials.length > 1 ? { clickable: true } : false}
                  className={socials.length > 1 ? "pb-7" : ""}
                >
                  {socials.map((social, index) => {
                    const Icon = getSocialIcon(social);
                    const platform = normalizePlatform(social);
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
                      }[platform] || "#12BCEB";
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
                        snapchat: "#000000",
                        tiktok: "#EE1D52",
                        reddit: "#FF4500",
                        threads: "#000000",
                        twitch: "#9146FF",
                        spotify: "#1DB954",
                      }[platform] || "#12BCEB";
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
                          className="flex flex-col rounded-xl border border-[#E2EAF1] bg-[#F8FBFC] p-3.5 transition duration-200 hover:border-[#12BCEB]/40 hover:bg-white hover:shadow-sm active:scale-[0.98]"
                        >
                          {/* Top row: avatar + info */}
                          <div className="flex items-center gap-3">
                            <div className="relative h-12 w-12 shrink-0">
                              {social.profileImage ? (
                                <img
                                  src={social.profileImage}
                                  alt={displayName}
                                  className="h-12 w-12 rounded-full object-cover ring-2 ring-[#E0E9F1]"
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
                                <p className="truncate text-xs font-black text-[#082B5C]">
                                  {displayName}
                                </p>
                                {social.verifiedTick && (
                                  <CheckCircle2
                                    size={11}
                                    className="shrink-0 text-[#12BCEB]"
                                  />
                                )}
                              </div>
                              {social.handle && (
                                <p className="truncate text-[10px] font-semibold text-[#12BCEB]">
                                  {social.handle}
                                </p>
                              )}
                              {social.audience && (
                                <p className="mt-0.5 text-[9px] text-[#71839A]">
                                  {social.audience}
                                </p>
                              )}
                            </div>
                          </div>
                          {/* Description */}
                          {social.description && (
                            <p className="mt-2.5 line-clamp-2 text-[10px] leading-relaxed text-[#405B75]">
                              {social.description}
                            </p>
                          )}
                          {/* CTA Button */}
                          <div
                            className="mt-2.5 flex w-full items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-[11px] font-bold text-white shadow-sm"
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

              {socials.length > 1 && (
                <style>{`
                  .minimal-social-swiper .swiper-pagination {
                    bottom: 0 !important;
                  }
                  .minimal-social-swiper .swiper-pagination-bullet {
                    background: #12BCEB;
                    opacity: 0.3;
                  }
                  .minimal-social-swiper .swiper-pagination-bullet-active {
                    background: #12BCEB;
                    opacity: 1;
                    width: 16px;
                    border-radius: 8px;
                  }
                `}</style>
              )}
            </section>
          )}

          {/* BUSINESS HOURS */}
          {businessHours && (
            <section className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-4 shadow-sm">
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                  <Clock size={15} />
                </div>

                <h3 className="text-[16px] font-black text-[#082B5C]">
                  Business Hours
                </h3>
              </div>

              <div className="mt-3 rounded-xl border border-[#DCEAF5] bg-[#F4F9FD] p-3.5">
                <p className="whitespace-pre-line text-[12.5px] font-semibold leading-relaxed text-[#183250]">
                  {businessHours}
                </p>
              </div>
            </section>
          )}

          {/* CONTACT FORM */}
          <section
            id="premium-contact"
            className="mx-0 mt-3 overflow-hidden rounded-2xl border border-[#E2EAF1] bg-white shadow-sm"
          >
            <div className="bg-gradient-to-r from-[#082B5C] via-[#0A346E] to-[#0D448C] p-4 text-white">
              <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                Contact
              </p>

              <h2 className="mt-1.5 text-[17px] font-black leading-tight">
                {businessName ? `Contact ${businessName}` : "Send an Inquiry"}
              </h2>
            </div>

            <div className="p-4">
              {formSubmitted ? (
                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                    <CheckCircle2 size={25} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#082B5C]">
                    Inquiry Submitted Successfully!
                  </h3>
                </div>
              ) : (
                <form onSubmit={onFormSubmit} className="space-y-3">
                  {inquirySubmitError && (
                    <div className="rounded-xl border border-red-200 bg-red-50 p-2.5 text-[11px] text-red-600">
                      {inquirySubmitError}
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name || ""}
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
                    value={formData.phone || ""}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={formData.email || ""}
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
                    placeholder="Message"
                    value={formData.message || ""}
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
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#082B5C] py-3 text-[12px] font-bold text-white shadow-sm transition hover:bg-[#12BCEB] hover:shadow-md disabled:opacity-50 active:scale-[0.98]"
                  >
                    {inquirySubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={13} />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* QR CODE */}
          <section
            id="premium-qr"
            className="mx-0 mt-3 rounded-2xl border border-[#E2EAF1] bg-white p-5 shadow-sm text-center"
          >
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
              <ScanLine size={17} />
            </div>

            <h3 className="mt-2 text-[14px] font-black text-[#082B5C]">
              Scan to Connect
            </h3>

            <p className="mt-1 text-[10px] text-[#71839A]">
              Scan the QR code to visit this profile
            </p>

            <div className="mx-auto mt-3.5 flex w-fit items-center justify-center rounded-2xl border border-[#E2EAF1] bg-white p-3 shadow-sm">
              {qrFetching ? (
                <div className="flex h-[130px] w-[130px] items-center justify-center text-[10px] text-[#71839A]">
                  Loading QR...
                </div>
              ) : qrTargetUrl ? (
                <QRCodeCanvas
                  id="mobile-profile-qr"
                  value={qrTargetUrl}
                  size={130}
                  level="H"
                  includeMargin
                />
              ) : (
                <div className="flex h-[130px] w-[130px] items-center justify-center text-[10px] text-[#71839A]">
                  QR unavailable
                </div>
              )}
            </div>

            {qrTargetUrl && !qrFetching && (
              <button
                type="button"
                onClick={handleDownloadQr}
                className="mx-auto mt-3.5 flex w-full items-center justify-center gap-2 rounded-xl border border-[#CDEEF9] bg-[#E8F8FD] py-2.5 text-[11.5px] font-bold text-[#087DA1] transition-all hover:border-[#12BCEB] hover:bg-[#12BCEB] hover:text-white active:scale-[0.98]"
              >
                <Download size={13} />
                Download QR
              </button>
            )}
          </section>

          {/* CREATE YOUR BIO SITES BUTTON */}
          <div className="flex justify-center px-5 py-6">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full border border-[#12BCEB]/40 bg-gradient-to-r from-[#12BCEB]/10 to-[#0891b2]/10 px-6 py-2.5 text-xs font-bold tracking-wide text-[#12BCEB] shadow-md shadow-[#12BCEB]/10 transition-all duration-200 hover:border-[#12BCEB]/70 hover:from-[#12BCEB]/20 hover:to-[#0891b2]/20 hover:text-[#0FAADC] hover:shadow-[#12BCEB]/20"
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
        </main>
      </div>

      {/* SWIPER STYLES */}
      <style>{`
        .mobile-product-swiper,
        .mobile-gallery-swiper {
          width: 100%;
          overflow: hidden;
        }

        .mobile-product-swiper .swiper-slide,
        .mobile-gallery-swiper .swiper-slide {
          height: auto;
        }

        .mobile-product-swiper .swiper-pagination,
        .mobile-gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .mobile-product-swiper .swiper-pagination-bullet,
        .mobile-gallery-swiper .swiper-pagination-bullet {
          background: #082B5C;
          opacity: 0.25;
        }

        .mobile-product-swiper .swiper-pagination-bullet-active,
        .mobile-gallery-swiper .swiper-pagination-bullet-active {
          background: #12BCEB;
          opacity: 1;
          width: 16px;
          border-radius: 8px;
        }
      `}</style>
    </div>
  );
};

export default MinimalLuxury;
