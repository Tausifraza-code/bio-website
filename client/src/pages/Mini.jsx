import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/slice/profileSlice";
import { fetchContactButtons } from "../redux/slice/contactButtonsSlice";
import Payment from "./Payment";
import { getMyProducts } from "../redux/slice/productSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaXTwitter,
  FaGlobe,
  FaLink,
} from "react-icons/fa6";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  MessageCircle,
  Share2,
  UserPlus,
  ShieldCheck,
  ShoppingBag,
  Award,
  CheckCircle2,
  Zap,
  Eye,
  Check,
  Send,
  X,
  Palette,
  Maximize2,
  ScanLine,
  Sun,
  Moon,
  Gem,
  Crown,
  Leaf,
  ChevronRight,
  MonitorSmartphone,
  ArrowUpRight,
  Copy,
  IndianRupee,
  Image as ImageIcon,
} from "lucide-react";

/* =========================================================
   THEME DATA
========================================================= */

const themes = [
  {
    id: "executive",
    name: "Executive Royal",
    colors: ["#1e3a8a", "#7c3aed"],
    icon: Crown,
  },
  {
    id: "emerald",
    name: "Emerald Luxe",
    colors: ["#10b981", "#14b8a6"],
    icon: Leaf,
  },
  {
    id: "rose",
    name: "Rose Gold & Champagne",
    colors: ["#f43f5e", "#fb923c"],
    icon: Gem,
  },
  {
    id: "obsidian",
    name: "Obsidian Noir & Platinum",
    colors: ["#334155", "#94a3b8"],
    icon: Moon,
  },
  {
    id: "sunset",
    name: "Sunset Amber & Coral",
    colors: ["#f59e0b", "#f97316"],
    icon: Sun,
  },
];

const hasValidProfile = (profile) => {
  if (!profile || typeof profile !== "object") return false;

  const firstName = profile.firstName?.trim() || "";
  const lastName = profile.lastName?.trim() || "";
  const businessName = profile.businessName?.trim() || "";

  const isDemo =
    /^(ankit'?s business|my business|your name)$/i.test(businessName) ||
    /^(ankit|your name)$/i.test(firstName);

  if (isDemo) return false;

  return Boolean(
    firstName ||
    lastName ||
    businessName ||
    profile.phone?.trim() ||
    profile.email?.trim(),
  );
};

const bannerImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200",
];

/* =========================================================
   GALLERY HELPERS
========================================================= */

const normalizeGalleryImages = (raw) => {
  if (!Array.isArray(raw)) return [];

  return raw
    .map((item, index) => {
      if (typeof item === "string") {
        const url = item.trim();
        return url ? { url, alt: `Gallery image ${index + 1}`, caption: "" } : null;
      }

      if (!item || typeof item !== "object") return null;

      const url = [item.url, item.src, item.image, item.imageUrl, item.path].find(
        (value) => typeof value === "string" && value.trim(),
      );

      if (!url) return null;

      const caption =
        typeof item.caption === "string" && item.caption.trim()
          ? item.caption.trim()
          : typeof item.title === "string" && item.title.trim()
            ? item.title.trim()
            : "";

      return {
        url: url.trim(),
        alt:
          (typeof item.alt === "string" && item.alt.trim()) ||
          caption ||
          `Gallery image ${index + 1}`,
        caption,
      };
    })
    .filter(Boolean);
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Mini = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, isVerified, loading } = useSelector(
    (state) => state.profile,
  );

  const { products = [], loading: productsLoading } = useSelector(
    (state) => state.product || {},
  );

  const { buttons: contactButtons = [], loaded: contactButtonsLoaded } =
    useSelector((state) => state.contactButtons || {});

  const [profileChecked, setProfileChecked] = useState(false);
  const [activeTheme, setActiveTheme] = useState("sunset");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  useEffect(() => {
    let mounted = true;

    dispatch(fetchMyProfile())
      .unwrap()
      .then((savedProfile) => {
        if (!mounted) return;

        if (!hasValidProfile(savedProfile)) {
          navigate("/editprofile", { replace: true });
          return;
        }

        setActiveTheme(savedProfile.activeTheme || "sunset");
        setProfileChecked(true);
      })
      .catch((error) => {
        if (!mounted) return;

        console.error("Profile load failed:", error);
        navigate("/editprofile", { replace: true });
      });

    return () => {
      mounted = false;
    };
  }, [dispatch, navigate]);

  useEffect(() => {
    dispatch(getMyProducts());
  }, [dispatch]);

  useEffect(() => {
    if (!contactButtonsLoaded) dispatch(fetchContactButtons());
  }, [dispatch, contactButtonsLoaded]);

  const profileData = profile || {};
  const productList = Array.isArray(products) ? products : [];

  const buttonSource = Array.isArray(profileData.contactButtons)
    ? profileData.contactButtons
    : contactButtons;
  const visibleButtons = [...buttonSource]
    .filter((button) => button.enabled)
    .sort((a, b) => a.order - b.order);

  const [standeeCode, setStandeeCode] = useState("");
  const [standeeActivated, setStandeeActivated] = useState(false);

  const [isPreviewMode, setIsPreviewMode] = useState(true);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewData, setReviewData] = useState({
    name: "",
    review: "",
  });

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  const [formSubmitted, setFormSubmitted] = useState(false);

  /* =========================================================
     BUSINESS INFORMATION
  ========================================================= */

  const businessInfo = {
    name: [profileData.firstName, profileData.lastName]
      .filter(Boolean)
      .join(" "),

    role: profileData.jobTitle || "",

    location:
      [profileData?.city, profileData?.state, profileData?.pincode]
        .filter(Boolean)
        .join(", ") || "Location not added",

    status: "Profile Actively Monitored",

    about:
      profileData?.bio ||
      profileData?.headline ||
      "Welcome to my business! Contact me for business inquiries.",

    phone: profileData?.phone || "",

    whatsapp: profileData?.whatsapp || "",

    email: profileData?.email || "",

    website: profileData?.website || profileData?.websiteUrl || "",

    address:
      [
        profileData?.shopUnit,
        profileData?.area,
        profileData?.city,
        profileData?.state,
        profileData?.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "Address not added",

    logo: profileData?.logo || null,

    avatar: profileData?.avatar || null,

    banner: profileData?.banner || null,

    qrCode: profileData?.qrCode || null,

    industry: profileData?.industry || "",

    businessName: profileData?.businessName || "My Business",

    headline: profileData?.headline || "",

    businessHours: profileData?.businessHours || "",

    mapLink: profileData?.mapLink || "",

    upiId: profileData?.upiId || "",

    isVerified: isVerified === true,
  };

  /* ---------------------------------------------------------
     GALLERY DATA (profile gallery, fallback = product images)
  --------------------------------------------------------- */

  const galleryImages = useMemo(() => {
    const fromProfile = normalizeGalleryImages(
      profileData.gallery ||
        profileData.galleryImages ||
        profileData.businessGallery ||
        profileData.images,
    );

    if (fromProfile.length > 0) return fromProfile;

    // Fallback: product images (taaki gallery section khaali na dikhe)
    const fromProducts = [];
    productList.forEach((product) => {
      if (!Array.isArray(product?.images)) return;
      product.images.forEach((image) => {
        if (image?.url) {
          fromProducts.push({
            url: image.url,
            alt: image.alt || product.name || "Gallery image",
            caption: product.name || "",
          });
        }
      });
    });

    return fromProducts;
  }, [
    profileData.gallery,
    profileData.galleryImages,
    profileData.businessGallery,
    profileData.images,
    productList,
  ]);

  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  const themeStyles = {
    executive: {
      primary: "#1e3a8a",
      secondary: "#7c3aed",
      background: "#0f172a",
      surface: "#172554",
      text: "#ffffff",
    },
    emerald: {
      primary: "#10b981",
      secondary: "#14b8a6",
      background: "#062c25",
      surface: "#104438",
      text: "#ecfdf5",
    },
    rose: {
      primary: "#f43f5e",
      secondary: "#fb923c",
      background: "#2b1420",
      surface: "#49202f",
      text: "#fff1f2",
    },
    obsidian: {
      primary: "#94a3b8",
      secondary: "#475569",
      background: "#09090b",
      surface: "#18181b",
      text: "#f4f4f5",
    },
    sunset: {
      primary: "#f59e0b",
      secondary: "#f97316",
      background: "#24130b",
      surface: "#3b2113",
      text: "#fff7ed",
    },
  };

  const currentTheme = themeStyles[activeTheme] || themeStyles.sunset;
  const themeVariables = {
    "--profile-primary": currentTheme.primary,
    "--profile-secondary": currentTheme.secondary,
    "--profile-background": currentTheme.background,
    "--profile-surface": currentTheme.surface,
    "--profile-text": currentTheme.text,
  };

  /* =========================================================
     ACTION HANDLERS
  ========================================================= */

  const handleActivateStandee = () => {
    if (!standeeCode.trim()) return;

    setStandeeActivated(true);
  };

  const handleWhatsApp = () => {
    const number = businessInfo.whatsapp || businessInfo.phone;

    if (!number) {
      alert("WhatsApp number is not available.");
      return;
    }

    const cleanNumber = number.replace(/\D/g, "");

    window.open(
      `https://wa.me/${cleanNumber}?text=${encodeURIComponent(
        "Hi, I'm interested in your business.",
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCall = () => {
    window.location.href = `tel:${businessInfo.phone.replace(/\s/g, "")}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: businessInfo.name,
      text: `Check out ${businessInfo.name}'s business`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (error) {
        // User cancelled the share dialog.
      }
    } else {
      handleCopyLink();
    }
  };

  const handleSaveContact = () => {
    const escapeVCard = (value = "") =>
      String(value)
        .trim()
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

    const lines = ["BEGIN:VCARD", "VERSION:3.0"];

    const fullName = [profileData.firstName, profileData.lastName]
      .filter((value) => value?.trim())
      .join(" ")
      .trim();

    const displayName = fullName || profileData.businessName?.trim() || "";

    if (displayName) {
      lines.push(`FN:${escapeVCard(displayName)}`);
    }

    if (profileData.businessName?.trim()) {
      lines.push(`ORG:${escapeVCard(profileData.businessName)}`);
    }

    if (profileData.jobTitle?.trim()) {
      lines.push(`TITLE:${escapeVCard(profileData.jobTitle)}`);
    }

    if (profileData.phone?.trim()) {
      lines.push(`TEL;TYPE=CELL:${escapeVCard(profileData.phone)}`);
    }

    if (profileData.whatsapp?.trim()) {
      lines.push(
        `item1.URL:${escapeVCard(
          `https://wa.me/${profileData.whatsapp.replace(/\D/g, "")}`,
        )}`,
        "item1.X-ABLabel:WhatsApp",
      );
    }

    if (profileData.email?.trim()) {
      lines.push(`EMAIL:${escapeVCard(profileData.email)}`);
    }

    const website =
      profileData.website?.trim() || profileData.websiteUrl?.trim();

    if (website) {
      const websiteUrl = /^https?:\/\//i.test(website)
        ? website
        : `https://${website}`;

      lines.push(`URL:${escapeVCard(websiteUrl)}`);
    }

    const address = [
      profileData.shopUnit,
      profileData.area,
      profileData.landmark,
      profileData.city,
      profileData.state,
      profileData.pincode,
    ]
      .filter((value) => value?.trim())
      .join(", ");

    if (address) {
      lines.push(`ADR;TYPE=WORK:;;${escapeVCard(address)};;;;`);
    }

    if (profileData.bio?.trim()) {
      lines.push(`NOTE:${escapeVCard(profileData.bio)}`);
    } else if (profileData.headline?.trim()) {
      lines.push(`NOTE:${escapeVCard(profileData.headline)}`);
    }

    // Contact file mein koi useful detail na ho toh download na karein.
    if (
      !displayName &&
      !profileData.phone?.trim() &&
      !profileData.email?.trim()
    ) {
      alert("Contact download karne ke liye pehle profile details add karein.");
      return;
    }

    lines.push("END:VCARD");

    const blob = new Blob([`${lines.join("\r\n")}\r\n`], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    const filename = (displayName || "contact")
      .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
      .trim();

    anchor.href = url;
    anchor.download = `${filename || "contact"}.vcf`;

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    // Download start hone ke baad temporary URL release karein.
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);

    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      // Clipboard access can be unavailable in some browsers.
    }
  };

  const handleEnquire = () => {
    document.getElementById("inquiry-form")?.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    setTimeout(() => {
      document.getElementById("inquiry-name")?.focus();
    }, 600);
  };

  const handleContactClick = (type) => {
    if (type === "phone") {
      handleCall();
    } else if (type === "email") {
      window.location.href = `mailto:${businessInfo.email}`;
    } else if (type === "website") {
      if (!businessInfo.website) return;

      const websiteUrl = /^https?:\/\//i.test(businessInfo.website)
        ? businessInfo.website
        : `https://${businessInfo.website}`;

      window.open(websiteUrl, "_blank", "noopener,noreferrer");
    } else if (type === "address") {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(
          businessInfo.address,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (type === "upi") {
      if (!profileData.upiId?.trim()) {
        alert("UPI ID is not available.");
        return;
      }

      setShowPayment(true);
    }
  };

  const handleConfiguredButton = (button) => {
    switch (button.actionType) {
      case "call":
        handleCall();
        break;
      case "whatsapp":
        handleWhatsApp();
        break;
      case "email":
        if (businessInfo.email) window.location.href = `mailto:${businessInfo.email}`;
        break;
      case "directions":
        window.open(
          profileData.mapLink || `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`,
          "_blank",
          "noopener,noreferrer",
        );
        break;
      case "share":
        handleShare();
        break;
      case "website":
      case "customLink":
        if (button.customUrl) {
          window.open(button.customUrl, "_blank", "noopener,noreferrer");
        }
        break;
      case "saveContact":
        handleSaveContact();
        break;
      case "upi":
        handleContactClick("upi");
        break;
      default:
        break;
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();

    setFormSubmitted(true);

    setTimeout(() => {
      setFormSubmitted(false);

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });
    }, 3000);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    setReviewSubmitted(true);

    setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);

      setReviewData({
        name: "",
        review: "",
      });

      setReviewRating(5);
    }, 2000);
  };

  /* =========================================================
     RENDER
  ========================================================= */

  if (loading || !profileChecked || !profile) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#071326] text-slate-100 selection:bg-cyan-300/30">
      {/* BACKGROUND DECORATION */}

      <div
        className="pointer-events-none absolute inset-0 opacity-[0.035]"
        style={{
          backgroundImage:
            "radial-gradient(circle, #67e8f9 1px, transparent 1px)",
          backgroundSize: "30px 30px",
        }}
      />

      <div className="pointer-events-none absolute -top-48 left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[150px]" />

      <div className="pointer-events-none absolute right-[-180px] top-[650px] h-[400px] w-[400px] rounded-full bg-blue-500/[0.06] blur-[130px]" />

      <main className="relative mx-auto max-w-[1600px] px-4 py-5 sm:px-6 sm:py-6 xl:px-8">
        {/* =====================================================
            01. STANDEE ACTIVATION
        ===================================================== */}

        <section className="mb-7">
          <div className="relative overflow-hidden rounded-[26px] border border-[#29435f] bg-gradient-to-br from-[#10243c] via-[#0b1b30] to-[#08172a] shadow-[0_20px_65px_rgba(0,0,0,0.22)]">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent" />

            <div className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

            <div className="relative grid grid-cols-1 gap-6 p-5 sm:p-7 lg:grid-cols-[1.15fr_0.85fr] lg:items-center lg:gap-9 lg:p-8">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-60" />
                    <span className="relative h-2 w-2 rounded-full bg-cyan-300" />
                  </span>

                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">
                    Business Setup
                  </span>
                </div>

                <h1 className="mt-4 max-w-xl text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px] lg:leading-[1.15]">
                  Link Your Physical
                  <span className="mt-1 block bg-gradient-to-r from-cyan-200 via-cyan-300 to-blue-300 bg-clip-text text-transparent">
                    Counter Standee
                  </span>
                </h1>

                <p className="mt-3 max-w-lg text-base leading-7 text-slate-300">
                  Received your acrylic counter standee? Connect it once to go
                  live and help customers discover your digital business card.
                </p>

                <div className="mt-5 flex flex-wrap items-center gap-3">
                  <span
                    className={`inline-flex items-center gap-2 rounded-xl border px-3.5 py-2.5 text-sm font-semibold ${
                      standeeActivated
                        ? "border-emerald-300/25 bg-emerald-300/[0.08] text-emerald-200"
                        : "border-amber-300/25 bg-amber-300/[0.07] text-amber-200"
                    }`}
                  >
                    {standeeActivated ? (
                      <CheckCircle2 size={17} />
                    ) : (
                      <span className="h-2 w-2 rounded-full bg-amber-300" />
                    )}

                    {standeeActivated ? "Standee Activated" : "Action Required"}
                  </span>

                  <span className="inline-flex items-center gap-2 text-sm text-slate-300">
                    <ShieldCheck size={17} className="text-cyan-300" />
                    One-time setup
                  </span>
                </div>
              </div>

              {/* ACTIVATION CARD */}

              <div className="rounded-[22px] border border-[#38516e] bg-[#08172a]/90 p-5 shadow-xl sm:p-6">
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08]">
                    <ScanLine size={23} className="text-cyan-200" />
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white">
                      Activate Your Standee
                    </h3>

                    <p className="mt-1 text-sm text-slate-300">
                      Enter your unique standee code
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="standee-code"
                  className="mb-2 block text-xs font-bold uppercase tracking-[0.12em] text-slate-300"
                >
                  Standee Code
                </label>

                <input
                  id="standee-code"
                  type="text"
                  value={standeeCode}
                  onChange={(event) =>
                    setStandeeCode(event.target.value.toUpperCase())
                  }
                  disabled={standeeActivated}
                  placeholder="E.G., XR-1001 OR SHOPX007"
                  className="w-full rounded-xl border border-[#38516e] bg-[#10213a] px-4 py-3.5 text-base font-semibold tracking-wider text-white outline-none transition placeholder:text-sm placeholder:font-medium placeholder:tracking-normal placeholder:text-slate-400 focus:border-cyan-300/70 focus:ring-4 focus:ring-cyan-300/[0.08] disabled:cursor-not-allowed disabled:opacity-60"
                />

                <button
                  type="button"
                  onClick={handleActivateStandee}
                  disabled={standeeActivated || !standeeCode.trim()}
                  className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3.5 text-base font-bold text-[#071326] shadow-[0_8px_24px_rgba(34,211,238,0.12)] transition duration-200 hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
                >
                  <Check size={18} strokeWidth={2.5} />
                  {standeeActivated ? "Standee Activated" : "Activate Standee"}
                </button>

                <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-[#29435f]/70 bg-[#10213a]/60 p-3">
                  <ShieldCheck
                    size={17}
                    className="mt-0.5 shrink-0 text-cyan-300"
                  />

                  <p className="text-sm leading-6 text-slate-300">
                    Enter the code printed on your physical standee. Once
                    activated, customers scanning your standee can reach your
                    page instantly.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =====================================================
            02. PAGE HEADER
        ===================================================== */}

        <section className="mb-6">
          <div className="flex flex-col gap-4 xl:flex-row xl:items-end xl:justify-between">
            <div>
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-cyan-200">
                <MonitorSmartphone size={17} />

                <span className="uppercase tracking-[0.14em]">
                  Website Studio
                </span>
              </div>

              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                Live Mini Website <span className="text-cyan-300">Preview</span>
              </h2>

              <p className="mt-2 max-w-2xl text-base leading-7 text-slate-300">
                Experience your digital business card exactly as your
                prospective customers see it when they open your shared link or
                scan your QR code.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={() => navigate("/theme")}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#10213a] px-5 py-3 text-sm font-semibold text-slate-100 transition hover:border-cyan-300/50 hover:bg-[#142b46] hover:text-cyan-100"
              >
                <Palette size={18} />
                Change Theme
                <ChevronRight size={16} />
              </button>

              <button
                type="button"
                onClick={() => setIsPreviewMode(true)}
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-bold text-[#071326] shadow-lg shadow-cyan-400/10 transition hover:brightness-110 active:scale-[0.98]"
              >
                <Maximize2 size={17} />
                Full Screen Mode
              </button>
            </div>
          </div>
        </section>

        {/* =====================================================
            03. THEME SELECTOR
        ===================================================== */}

        <section id="theme-selector" className="mb-7 scroll-mt-24">
          <div className="overflow-hidden rounded-[24px] border border-[#29435f] bg-[#0b1b30] shadow-[0_16px_45px_rgba(0,0,0,0.12)]">
            <div className="flex flex-col gap-3 border-b border-[#29435f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
              <div className="flex items-center">
                <div>
                  <h3 className="text-base font-bold text-white">
                    Website Appearance
                  </h3>

                  <p className="mt-1 text-sm text-slate-300">
                    Choose your preferred visual theme
                  </p>
                </div>
              </div>

              <span className="inline-flex w-fit items-center gap-2 rounded-lg border border-[#38516e] bg-[#10213a] px-3 py-2 text-sm text-slate-300">
                Active:
                <span className="font-bold text-cyan-200">
                  {activeThemeData?.name}
                </span>
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 p-4 sm:grid-cols-2 sm:p-5 md:grid-cols-3 xl:grid-cols-5">
              {themes.map((theme) => {
                const isActive = activeTheme === theme.id;
                const Icon = theme.icon;

                return (
                  <button
                    type="button"
                    key={theme.id}
                    onClick={() => setActiveTheme(theme.id)}
                    aria-pressed={isActive}
                    className={`group relative overflow-hidden rounded-2xl border p-4 text-left transition-all duration-200 ${
                      isActive
                        ? "border-cyan-300/60 bg-cyan-300/[0.07] shadow-[0_0_0_1px_rgba(34,211,238,0.10)]"
                        : "border-[#29435f] bg-[#08172a] hover:border-[#54718e] hover:bg-[#10213a]"
                    }`}
                  >
                    {isActive && (
                      <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-cyan-300 to-blue-400" />
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex -space-x-1">
                        {theme.colors.map((color, index) => (
                          <span
                            key={`${theme.id}-${index}`}
                            className="h-8 w-8 rounded-full border-[3px] border-[#0b1b30] shadow-sm"
                            style={{ backgroundColor: color }}
                          />
                        ))}
                      </div>

                      {isActive && (
                        <span className="flex h-6 w-6 items-center justify-center rounded-full bg-cyan-300 text-[#071326]">
                          <Check size={14} strokeWidth={3} />
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-start gap-2.5">
                      <div
                        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg ${
                          isActive
                            ? "bg-cyan-300/15 text-cyan-200"
                            : "bg-[#132942] text-slate-300"
                        }`}
                      >
                        <Icon size={18} />
                      </div>

                      <div className="min-w-0">
                        <p
                          className={`text-sm font-bold leading-5 ${
                            isActive ? "text-white" : "text-slate-200"
                          }`}
                        >
                          {theme.name}
                        </p>

                        <p className="mt-1 text-xs text-slate-300">
                          {isActive ? "Currently selected" : "Select theme"}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </section>

        {/* =====================================================
            04. PREVIEW STATUS BAR
        ===================================================== */}

        {isPreviewMode && (
          <section className="mb-4">
            <div className="flex flex-col gap-3 rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 sm:flex-row sm:items-center sm:justify-between sm:px-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.08]">
                  <Eye size={20} className="text-amber-300" />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-base font-bold text-white">
                      Customer Preview
                    </h3>

                    <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-300/20 bg-emerald-300/[0.07] px-2 py-1 text-xs font-bold uppercase tracking-wide text-emerald-200">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                      Interactive
                    </span>
                  </div>

                  <p className="mt-1 text-sm leading-5 text-slate-300">
                    Preview the business profile and customer actions.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsPreviewMode(false)}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#10213a] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/40 hover:text-cyan-200"
              >
                <X size={16} />
                Back to Editor
              </button>
            </div>
          </section>
        )}

        {/* =====================================================
            05. PREMIUM WEBSITE PREVIEW
        ===================================================== */}

        {isPreviewMode && (
          <section className="pb-10">
            <div className="mx-auto w-full max-w-[1200px]">
              {/* BROWSER FRAME */}

              <div className="overflow-hidden rounded-[28px] border border-[#45414a] bg-[#17171c] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.42)] sm:rounded-[32px] sm:p-3">
                <div className="overflow-hidden rounded-[22px] border border-[#34343c] bg-[#111116]">
                  {/* BROWSER TOP BAR */}

                  <div className="flex items-center justify-between gap-3 border-b border-white/[0.08] bg-[#17171c] px-4 py-3 sm:px-6">
                    <div className="flex shrink-0 items-center gap-2">
                      <span className="h-3 w-3 rounded-full bg-rose-400/90" />
                      <span className="h-3 w-3 rounded-full bg-amber-300/90" />
                      <span className="h-3 w-3 rounded-full bg-emerald-300/90" />
                    </div>

                    <div className="flex min-w-0 flex-1 items-center justify-center gap-2 rounded-xl border border-[#353b49] bg-[#090b10] px-3 py-2.5 sm:max-w-[440px]">
                      <ShieldCheck
                        size={16}
                        className="shrink-0 text-amber-300"
                      />

                      <span className="truncate text-sm font-medium text-slate-200">
                        {businessInfo.website}
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleCopyLink}
                      title="Copy website link"
                      aria-label="Copy website link"
                      className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#353b49] bg-[#202029] text-slate-200 transition hover:border-amber-300/50 hover:text-amber-200"
                    >
                      {copied ? <Check size={18} /> : <Copy size={18} />}
                    </button>
                  </div>

                  {/* CUSTOMER WEBSITE */}

                  <div
                    style={{
                      ...themeVariables,
                      background: `linear-gradient(
    180deg,
    ${currentTheme.background} 0%,
    ${currentTheme.surface} 55%,
    ${currentTheme.background} 100%
  )`,
                      color: currentTheme.text,
                    }}
                    className="transition-colors duration-500"
                  >
                    {/* SWIPER THEMING (product cards / gallery / modal) */}
                    <style>{`
                      .product-cards-swiper,
                      .gallery-swiper,
                      .product-modal-swiper {
                        --swiper-theme-color: ${currentTheme.primary};
                        --swiper-navigation-color: ${currentTheme.primary};
                        --swiper-navigation-size: 16px;
                      }

                      .product-cards-swiper .swiper-button-next,
                      .product-cards-swiper .swiper-button-prev {
                        width: 34px;
                        height: 34px;
                        border-radius: 9999px;
                        background: rgba(0, 0, 0, 0.55);
                        border: 1px solid ${currentTheme.primary}55;
                        backdrop-filter: blur(6px);
                        color: ${currentTheme.primary};
                      }

                      .product-cards-swiper .swiper-button-next::after,
                      .product-cards-swiper .swiper-button-prev::after {
                        font-size: 13px;
                        font-weight: 800;
                      }

                      .product-cards-swiper .swiper-button-disabled {
                        opacity: 0.3;
                      }

                      .product-cards-swiper .swiper-pagination-bullet,
                      .gallery-swiper .swiper-pagination-bullet,
                      .product-modal-swiper .swiper-pagination-bullet {
                        background: ${currentTheme.text};
                        opacity: 0.35;
                      }

                      .product-cards-swiper .swiper-pagination-bullet-active,
                      .gallery-swiper .swiper-pagination-bullet-active,
                      .product-modal-swiper .swiper-pagination-bullet-active {
                        background: ${currentTheme.primary};
                        opacity: 1;
                      }

                      .product-cards-swiper .swiper-slide,
                      .gallery-swiper .swiper-slide {
                        height: auto;
                      }
                    `}</style>

                    {/* BANNER */}

                    <div className="relative h-56 overflow-hidden sm:h-72 lg:h-[340px]">
                      {(businessInfo.banner
                        ? [businessInfo.banner]
                        : bannerImages
                      ).map((image, index) => (
                        <img
                          key={image}
                          src={image}
                          alt={`Business banner ${index + 1}`}
                          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
                            index === currentSlide ? "opacity-100" : "opacity-0"
                          }`}
                        />
                      ))}

                      <div className="absolute inset-0 bg-gradient-to-b from-black/35 via-black/10 to-[#17171c]" />

                      <div className="absolute left-4 top-4 sm:left-7 sm:top-6">
                        <span className="inline-flex items-center rounded-full border border-amber-200/30 bg-[#111116]/75 px-3.5 py-2.5 text-xs font-bold uppercase tracking-[0.12em] text-white shadow-lg backdrop-blur-xl sm:text-sm">
                          Featured Business
                        </span>
                      </div>

                      <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between gap-3 sm:bottom-7 sm:left-7 sm:right-7">
                        <div>
                          <p className="text-xs font-bold uppercase tracking-[0.18em] text-amber-100/90 sm:text-sm">
                            Discover
                          </p>

                          <p className="mt-1.5 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">
                            Your Business, Your Identity
                          </p>
                        </div>

                        <div className="flex shrink-0 gap-1.5 pb-1">
                          {bannerImages.map((_, index) => (
                            <button
                              key={index}
                              type="button"
                              onClick={() => setCurrentSlide(index)}
                              aria-label={`Show banner ${index + 1}`}
                              aria-pressed={currentSlide === index}
                              className={`h-2.5 rounded-full transition-all duration-300 ${
                                currentSlide === index
                                  ? "w-8 bg-amber-300"
                                  : "w-2.5 bg-white/60 hover:bg-white"
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* PROFILE */}

                    <div className="px-5 pb-6 sm:px-8 sm:pb-7 lg:px-10">
                      <div className="-mt-12 mb-5 flex flex-wrap items-end justify-between gap-3 sm:-mt-14">
                        <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-2xl border-4 border-[#17171c] bg-[#25242a] shadow-2xl sm:h-28 sm:w-28">
                          {businessInfo.avatar && (
                            <img
                              src={businessInfo.avatar}
                              alt={businessInfo.name}
                              className="h-full w-full object-cover"
                            />
                          )}
                        </div>

                        {loading ? (
                          <span
                            role="status"
                            className="mb-1 inline-flex items-center gap-2 rounded-full border border-slate-400/30 bg-slate-400/10 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-slate-300 sm:text-sm"
                          >
                            Checking verification...
                          </span>
                        ) : isVerified === true ? (
                          <span className="mb-1 inline-flex items-center gap-2 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-emerald-300 sm:text-sm">
                            <ShieldCheck size={16} />✓ Verified
                          </span>
                        ) : isVerified === false ? (
                          <span className="mb-1 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3.5 py-2.5 text-xs font-bold uppercase tracking-wide text-amber-300 sm:text-sm">
                            <ShieldCheck size={16} />
                            Not Verified
                          </span>
                        ) : null}
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5">
                        <h3 className="text-3xl font-bold tracking-tight text-white sm:text-4xl lg:text-[42px]">
                          {businessInfo.name}
                        </h3>

                        {loading ? (
                          <span role="status">Checking verification...</span>
                        ) : isVerified === true ? (
                          <span
                            title="Verified business profile"
                            className="inline-flex items-center gap-1 rounded-full bg-emerald-400/10 px-2.5 py-1 text-sm font-bold text-emerald-300"
                          >
                            <Check size={16} strokeWidth={3} />
                            Verified
                          </span>
                        ) : isVerified === false ? (
                          <span className="rounded-full bg-amber-400/10 px-2.5 py-1 text-xs font-semibold text-amber-300">
                            Not Verified
                          </span>
                        ) : null}
                      </div>

                      <p className="mt-2 text-base font-medium text-slate-300 sm:text-lg">
                        {businessInfo.role}
                      </p>

                      <p className="mt-3 flex items-start gap-2 text-sm leading-6 text-slate-300 sm:text-base">
                        <MapPin
                          size={18}
                          className="mt-0.5 shrink-0 text-amber-300"
                        />

                        {businessInfo.location}
                      </p>

                      <div className="mt-3 inline-flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-200/[0.06] px-3.5 py-2.5">
                        <span className="relative flex h-2 w-2">
                          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-300 opacity-50" />
                          <span className="relative h-2 w-2 rounded-full bg-amber-300" />
                        </span>

                        <span className="text-xs font-bold uppercase tracking-wide text-amber-200 sm:text-sm">
                          {businessInfo.status}
                        </span>
                      </div>

                      {/* ACTION BUTTONS */}

                      {visibleButtons.length > 0 && (
                      <div className="mt-5 grid grid-cols-3 gap-3 sm:grid-cols-8">
                        {visibleButtons.map((button) => {
                          const buttonIcons = {
                            link: ArrowUpRight,
                            phone: Phone,
                            whatsapp: MessageCircle,
                            email: Mail,
                            location: MapPin,
                            share: Share2,
                            website: Globe,
                            contact: UserPlus,
                            upi: IndianRupee,
                          };
                          const ButtonIcon = buttonIcons[button.icon] || ArrowUpRight;

                          return (
                            <ActionButton
                              key={button._id || button.id || button.buttonId || `${button.actionType}-${button.order}`}
                              icon={button.actionType === "saveContact" && saved ? Check : ButtonIcon}
                              label={button.actionType === "saveContact" && saved ? "Saved" : button.label}
                              onClick={() => handleConfiguredButton(button)}
                              primary={button.actionType === "saveContact"}
                            />
                          );
                        })}
                      </div>
                      )}

                      {/* DYNAMIC SOCIAL PROFILE SHORTCUTS */}
                      {Array.isArray(profileData.socialCards) &&
                        profileData.socialCards.some((card) =>
                          card.url?.trim(),
                        ) && (
                          <div className="mt-4 flex flex-wrap gap-2.5">
                            {profileData.socialCards
                              .filter((card) => card.url?.trim())
                              .map((card, index) => {
                                const platformKey =
                                  `${card.platform || ""} ${card.platformName || ""} ${card.icon || ""}`.toLowerCase();
                                const platformName =
                                  card.platformName ||
                                  (card.platform
                                    ? card.platform.charAt(0).toUpperCase() +
                                      card.platform.slice(1)
                                    : "Social Profile");
                                const rawUrl = card.url.trim();
                                const socialUrl = /^https?:\/\//i.test(rawUrl)
                                  ? rawUrl
                                  : `https://${rawUrl}`;
                                const SocialIcon = platformKey.includes(
                                  "instagram",
                                )
                                  ? FaInstagram
                                  : platformKey.includes("linkedin")
                                    ? FaLinkedinIn
                                    : platformKey.includes("facebook")
                                      ? FaFacebookF
                                      : platformKey.includes("youtube")
                                        ? FaYoutube
                                        : platformKey.includes("whatsapp")
                                          ? FaWhatsapp
                                          : platformKey.includes("telegram")
                                            ? FaTelegram
                                            : platformKey.includes("twitter") ||
                                                /\bx\b/.test(platformKey)
                                              ? FaXTwitter
                                              : platformKey.includes(
                                                    "custom",
                                                  ) ||
                                                  platformKey.includes("link")
                                                ? FaLink
                                                : FaGlobe;

                                return (
                                  <a
                                    key={
                                      card._id ||
                                      card.id ||
                                      `${card.platform}-${index}`
                                    }
                                    href={socialUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={`Open ${platformName} profile`}
                                    className="inline-flex items-center gap-2 rounded-xl border px-3 py-2 transition hover:-translate-y-0.5 hover:brightness-110"
                                    style={{
                                      borderColor: `${currentTheme.primary}45`,
                                      backgroundColor: `${currentTheme.primary}10`,
                                      color: currentTheme.text,
                                    }}
                                  >
                                    <span
                                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg"
                                      style={{
                                        backgroundColor: `${currentTheme.primary}20`,
                                      }}
                                    >
                                      <SocialIcon
                                        size={16}
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <span className="text-sm font-semibold">
                                      {platformName}
                                    </span>
                                    <ArrowUpRight
                                      size={14}
                                      className="shrink-0 opacity-70"
                                    />
                                  </a>
                                );
                              })}
                          </div>
                        )}
                    </div>

                    {/* ABOUT */}

                    <WarmSection
                      icon={Award}
                      title="About the Business"
                      theme={currentTheme}
                    >
                      <div className="rounded-2xl border border-amber-200/15 bg-gradient-to-br from-amber-200/[0.07] to-transparent p-5 sm:p-6">
                        <p className="text-base leading-7 text-slate-200 sm:text-lg sm:leading-8">
                          {businessInfo.about}
                        </p>
                      </div>
                    </WarmSection>

                    {/* =================================================
                        PRODUCTS  (CARD SWIPE — IMAGE STATIC)
                    ================================================= */}

                    <WarmSection
                      icon={ShoppingBag}
                      title="Featured Products & Services"
                      theme={currentTheme}
                      action={
                        <span
                          className="rounded-lg border px-3 py-2 text-sm font-semibold"
                          style={{
                            borderColor: `${currentTheme.primary}40`,
                            backgroundColor: `${currentTheme.primary}14`,
                            color: currentTheme.text,
                          }}
                        >
                          {productList.length}{" "}
                          {productList.length === 1 ? "item" : "items"}
                        </span>
                      }
                    >
                      {productList.length > 0 ? (
                        <div className="px-1">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={16}
                            slidesPerView={1}
                            navigation={productList.length > 1}
                            pagination={{
                              clickable: true,
                              dynamicBullets: productList.length > 3,
                            }}
                            breakpoints={{
                              640: { slidesPerView: 2, spaceBetween: 16 },
                              1024: { slidesPerView: 3, spaceBetween: 18 },
                            }}
                            className="product-cards-swiper pb-11"
                          >
                            {productList.map((product) => {
                              const productImages = Array.isArray(product.images)
                                ? product.images.filter((img) => img?.url)
                                : [];
                              const coverImage = productImages[0] || null;
                              const extraCount = productImages.length - 1;

                              return (
                                <SwiperSlide
                                  key={product._id}
                                  className="h-auto"
                                >
                                  <div
                                    onClick={() => setSelectedProduct(product)}
                                    className="group flex h-full cursor-pointer flex-col overflow-hidden rounded-2xl border border-white/10 transition duration-300 hover:border-[var(--profile-primary)] hover:shadow-lg hover:shadow-black/10"
                                    style={{
                                      backgroundColor: currentTheme.surface,
                                      color: currentTheme.text,
                                    }}
                                  >
                                    {/* STATIC COVER IMAGE */}
                                    {coverImage ? (
                                      <div className="relative h-40 w-full overflow-hidden bg-black/20">
                                        <img
                                          src={coverImage.url}
                                          alt={coverImage.alt || product.name}
                                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                                        />

                                        {extraCount > 0 && (
                                          <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md border border-white/20 bg-black/60 px-2 py-1 text-[10px] font-bold text-white backdrop-blur-sm">
                                            <ImageIcon size={11} />
                                            +{extraCount}
                                          </span>
                                        )}

                                        <div className="pointer-events-none absolute bottom-2 left-1/2 z-10 -translate-x-1/2 rounded-md border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] font-semibold text-white backdrop-blur-sm">
                                          Tap to view
                                        </div>
                                      </div>
                                    ) : (
                                      <div
                                        className="flex h-40 items-center justify-center text-5xl"
                                        style={{
                                          background: `linear-gradient(135deg, ${currentTheme.primary}24, ${currentTheme.secondary}10)`,
                                        }}
                                      >
                                        📦
                                      </div>
                                    )}

                                    {/* PRODUCT INFO — COMPACT */}
                                    <div className="flex flex-1 flex-col p-3.5">
                                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                                        <div className="min-w-0">
                                          <h5
                                            className="text-base font-bold leading-6"
                                            style={{ color: currentTheme.text }}
                                          >
                                            {product.name}
                                          </h5>

                                          <span
                                            className="mt-1.5 inline-flex rounded-md border px-2.5 py-1 text-[11px] font-semibold"
                                            style={{
                                              borderColor: `${currentTheme.primary}40`,
                                              backgroundColor: `${currentTheme.primary}14`,
                                              color: currentTheme.text,
                                            }}
                                          >
                                            {product.category || "General"}
                                          </span>
                                        </div>

                                        <span
                                          className="shrink-0 text-base font-extrabold"
                                          style={{ color: currentTheme.primary }}
                                        >
                                          ₹
                                          {Number(
                                            product.price || 0,
                                          ).toLocaleString("en-IN")}
                                        </span>
                                      </div>

                                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-300 sm:text-sm">
                                        {product.description}
                                      </p>

                                      <div className="mt-auto flex flex-wrap items-center gap-2 pt-3">
                                        <span className="inline-flex items-center gap-1.5 rounded-md border border-emerald-400/20 bg-emerald-400/[0.08] px-2 py-1 text-[11px] font-bold text-emerald-300">
                                          <CheckCircle2 size={13} />
                                          {product.status === "active"
                                            ? "Available"
                                            : "Unavailable"}
                                        </span>

                                        <button
                                          type="button"
                                          onClick={(event) => {
                                            event.stopPropagation();
                                            setSelectedProduct(product);
                                          }}
                                          className="ml-auto inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-bold transition hover:brightness-110 active:scale-[0.98]"
                                          style={{
                                            background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                                            color: currentTheme.text,
                                          }}
                                        >
                                          View Product
                                          <ArrowUpRight size={14} />
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl border p-8 text-center"
                          style={{
                            borderColor: `${currentTheme.primary}30`,
                            backgroundColor: `${currentTheme.primary}08`,
                          }}
                        >
                          <ShoppingBag
                            size={35}
                            className="mx-auto"
                            style={{ color: currentTheme.primary }}
                          />

                          <p className="mt-3 text-base font-semibold text-white">
                            No products available
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Products and services will appear here.
                          </p>
                        </div>
                      )}
                    </WarmSection>

                    {/* =================================================
                        GALLERY  (FEATURED PRODUCTS KE NICHE)
                    ================================================= */}

                    <WarmSection
                      icon={ImageIcon}
                      title="Business Gallery"
                      theme={currentTheme}
                      action={
                        <span
                          className="rounded-lg border px-3 py-2 text-sm font-semibold"
                          style={{
                            borderColor: `${currentTheme.primary}40`,
                            backgroundColor: `${currentTheme.primary}14`,
                            color: currentTheme.text,
                          }}
                        >
                          {galleryImages.length}{" "}
                          {galleryImages.length === 1 ? "photo" : "photos"}
                        </span>
                      }
                    >
                      {galleryImages.length > 0 ? (
                        <div className="px-1">
                          <Swiper
                            modules={[Navigation, Pagination]}
                            spaceBetween={12}
                            slidesPerView={1.15}
                            navigation={galleryImages.length > 2}
                            pagination={{
                              clickable: true,
                              dynamicBullets: galleryImages.length > 4,
                            }}
                            breakpoints={{
                              480: { slidesPerView: 2, spaceBetween: 12 },
                              768: { slidesPerView: 3, spaceBetween: 14 },
                              1100: { slidesPerView: 4, spaceBetween: 14 },
                            }}
                            className="gallery-swiper pb-11"
                          >
                            {galleryImages.map((image, index) => (
                              <SwiperSlide
                                key={`${image.url}-${index}`}
                                className="h-auto"
                              >
                                <button
                                  type="button"
                                  onClick={() => setSelectedGalleryImage(image)}
                                  className="group relative block h-full w-full overflow-hidden rounded-2xl border transition duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-black/20"
                                  style={{
                                    borderColor: `${currentTheme.primary}40`,
                                    backgroundColor: currentTheme.surface,
                                  }}
                                  aria-label={`View ${image.alt}`}
                                >
                                  <div className="h-40 w-full overflow-hidden sm:h-44">
                                    <img
                                      src={image.url}
                                      alt={image.alt}
                                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                                    />
                                  </div>

                                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80" />

                                  <div className="pointer-events-none absolute inset-x-0 bottom-0 flex items-center justify-between gap-2 p-3">
                                    <span className="truncate text-left text-xs font-semibold text-white sm:text-sm">
                                      {image.caption || image.alt}
                                    </span>

                                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-white/25 bg-black/50 text-white backdrop-blur-sm">
                                      <Maximize2 size={13} />
                                    </span>
                                  </div>
                                </button>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        </div>
                      ) : (
                        <div
                          className="rounded-2xl border p-8 text-center"
                          style={{
                            borderColor: `${currentTheme.primary}30`,
                            backgroundColor: `${currentTheme.primary}08`,
                          }}
                        >
                          <ImageIcon
                            size={35}
                            className="mx-auto"
                            style={{ color: currentTheme.primary }}
                          />

                          <p className="mt-3 text-base font-semibold text-white">
                            No gallery photos yet
                          </p>

                          <p className="mt-1 text-sm text-slate-400">
                            Business photos will appear here.
                          </p>
                        </div>
                      )}
                    </WarmSection>

                    {/* CONTACT */}

                    <WarmSection
                      icon={Phone}
                      title="Contact & Business Information"
                      theme={currentTheme}
                    >
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <ContactRow
                          icon={Phone}
                          label="Call Business"
                          value={businessInfo.phone}
                          theme={currentTheme}
                          onClick={() => handleContactClick("phone")}
                        />

                        <ContactRow
                          icon={Mail}
                          label="Email Business"
                          value={businessInfo.email}
                          theme={currentTheme}
                          onClick={() => handleContactClick("email")}
                        />

                        <ContactRow
                          icon={Globe}
                          label="Business Website"
                          value={businessInfo.website}
                          theme={currentTheme}
                          onClick={() => handleContactClick("website")}
                        />

                        <ContactRow
                          icon={MapPin}
                          label="Business Address"
                          value={businessInfo.address}
                          theme={currentTheme}
                          onClick={() => handleContactClick("address")}
                        />

                        {businessInfo.upiId && (
                          <ContactRow
                            icon={IndianRupee}
                            label="Pay with UPI"
                            value={businessInfo.upiId}
                            theme={currentTheme}
                            onClick={() => handleContactClick("upi")}
                          />
                        )}
                      </div>

                      {/* SOCIAL PROFILES SAVED FROM THE DASHBOARD */}
                      {Array.isArray(profileData.socialCards) &&
                        profileData.socialCards.length > 0 && (
                          <div
                            className="mt-5 border-t pt-5"
                            style={{ borderColor: `${currentTheme.primary}40` }}
                          >
                            <div className="mb-3">
                              <h4
                                className="text-lg font-bold"
                                style={{ color: currentTheme.text }}
                              >
                                Social Media & Profiles
                              </h4>
                              <p className="mt-1 text-sm text-slate-300">
                                Connect with us on our social platforms.
                              </p>
                            </div>

                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                              {profileData.socialCards.map((social, index) => {
                                const socialName =
                                  social.platform === "custom"
                                    ? social.platformName || "Social Profile"
                                    : social.platformName ||
                                      (social.platform
                                        ? social.platform
                                            .charAt(0)
                                            .toUpperCase() +
                                          social.platform.slice(1)
                                        : "Social Profile");
                                const rawUrl = (social.url || "").trim();
                                const socialUrl = rawUrl
                                  ? /^https?:\/\//i.test(rawUrl)
                                    ? rawUrl
                                    : `https://${rawUrl}`
                                  : "";

                                return (
                                  <a
                                    key={
                                      social._id ||
                                      social.id ||
                                      `${social.platform}-${index}`
                                    }
                                    href={socialUrl || undefined}
                                    target={socialUrl ? "_blank" : undefined}
                                    rel={
                                      socialUrl
                                        ? "noopener noreferrer"
                                        : undefined
                                    }
                                    onClick={
                                      !socialUrl
                                        ? (event) => event.preventDefault()
                                        : undefined
                                    }
                                    className={`group flex min-w-0 items-center gap-3 rounded-2xl border p-4 transition ${
                                      socialUrl
                                        ? "hover:-translate-y-0.5 hover:shadow-lg"
                                        : "cursor-default"
                                    }`}
                                    style={{
                                      borderColor: `${currentTheme.primary}40`,
                                      backgroundColor: `${currentTheme.primary}0D`,
                                      color: currentTheme.text,
                                    }}
                                  >
                                    <span
                                      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border"
                                      style={{
                                        borderColor: `${currentTheme.primary}45`,
                                        backgroundColor: `${currentTheme.primary}20`,
                                        color: currentTheme.primary,
                                      }}
                                    >
                                      <Globe size={20} />
                                    </span>
                                    <span className="min-w-0 flex-1">
                                      <span className="block truncate text-sm font-bold">
                                        {socialName}
                                      </span>
                                      {social.handle && (
                                        <span
                                          className="mt-1 block truncate text-sm"
                                          style={{
                                            color: currentTheme.primary,
                                          }}
                                        >
                                          {social.handle}
                                        </span>
                                      )}
                                      {social.description && (
                                        <span className="mt-1 block break-words text-xs text-slate-300">
                                          {social.description}
                                        </span>
                                      )}
                                    </span>
                                    {socialUrl && (
                                      <ArrowUpRight
                                        size={17}
                                        className="shrink-0 opacity-70 transition group-hover:opacity-100"
                                      />
                                    )}
                                  </a>
                                );
                              })}
                            </div>
                          </div>
                        )}
                    </WarmSection>

                    {/* REVIEWS */}

                    <WarmSection
                      icon={Star}
                      title="Customer Experience & Trust"
                      theme={currentTheme}
                      action={
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="inline-flex items-center gap-2 rounded-lg border border-amber-200/20 bg-amber-200/[0.07] px-3 py-2 text-sm font-bold text-amber-200 transition hover:bg-amber-200/[0.12]"
                        >
                          <Star size={15} />
                          Write Review
                        </button>
                      }
                    >
                      <div className="relative overflow-hidden rounded-2xl border border-amber-200/15 bg-gradient-to-br from-amber-200/[0.07] via-transparent to-orange-300/[0.04] p-5 text-center sm:p-7">
                        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-amber-300/[0.06] blur-3xl" />

                        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-amber-200/30 bg-gradient-to-br from-amber-300 to-orange-300 shadow-lg shadow-amber-400/10">
                          <Star size={28} className="fill-white text-white" />
                        </div>

                        <p className="relative mt-4 text-lg font-bold text-white sm:text-xl">
                          Be the First to Share Your Experience
                        </p>

                        <p className="relative mx-auto mt-2 max-w-lg text-sm leading-7 text-slate-300 sm:text-base">
                          Your feedback helps others discover and trust this
                          business.
                        </p>

                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="relative mt-4 inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-300 px-5 py-3 text-sm font-bold text-[#201305] shadow-lg shadow-amber-500/[0.08] transition hover:brightness-110 active:scale-[0.98]"
                        >
                          <Zap size={17} />
                          Write a Review
                        </button>
                      </div>
                    </WarmSection>

                    {/* INQUIRY FORM */}

                    <WarmSection
                      icon={Mail}
                      title="Share Your Contact / Business Inquiry"
                      theme={currentTheme}
                    >
                      <form
                        id="inquiry-form"
                        onSubmit={handleFormSubmit}
                        className="rounded-2xl border border-white/10 p-5 sm:p-6"
                        style={{
                          backgroundColor: currentTheme.surface,
                          color: currentTheme.text,
                        }}
                      >
                        <div className="mb-4">
                          <h5 className="text-xl font-bold text-white">
                            Let's Connect
                          </h5>

                          <p className="mt-1.5 text-sm leading-6 text-slate-300 sm:text-base">
                            Share your details and message with the business.
                          </p>
                        </div>

                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                          <input
                            id="inquiry-name"
                            type="text"
                            required
                            value={formData.name}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                name: event.target.value,
                              })
                            }
                            placeholder="Your Name"
                            className="w-full rounded-xl border bg-[var(--profile-surface)] px-4 py-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-[var(--profile-primary)] focus:ring-4 focus:ring-[var(--profile-primary)]/10"
                            style={{
                              borderColor: `${currentTheme.primary}66`,
                              color: currentTheme.text,
                            }}
                          />

                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(event) =>
                              setFormData({
                                ...formData,
                                phone: event.target.value,
                              })
                            }
                            placeholder="Phone Number"
                            className="w-full rounded-xl border bg-[var(--profile-surface)] px-4 py-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-[var(--profile-primary)] focus:ring-4 focus:ring-[var(--profile-primary)]/10"
                            style={{
                              borderColor: `${currentTheme.primary}66`,
                              color: currentTheme.text,
                            }}
                          />
                        </div>

                        <input
                          type="email"
                          value={formData.email}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              email: event.target.value,
                            })
                          }
                          placeholder="Email Address"
                          className="mt-3 w-full rounded-xl border bg-[var(--profile-surface)] px-4 py-3.5 text-base outline-none transition placeholder:text-slate-400 focus:border-[var(--profile-primary)] focus:ring-4 focus:ring-[var(--profile-primary)]/10"
                          style={{
                            borderColor: `${currentTheme.primary}66`,
                            color: currentTheme.text,
                          }}
                        />

                        <textarea
                          rows={4}
                          value={formData.message}
                          onChange={(event) =>
                            setFormData({
                              ...formData,
                              message: event.target.value,
                            })
                          }
                          placeholder="Your Message"
                          className="mt-3 w-full resize-y rounded-xl border bg-[var(--profile-surface)] px-4 py-3.5 text-base leading-7 outline-none transition placeholder:text-slate-400 focus:border-[var(--profile-primary)] focus:ring-4 focus:ring-[var(--profile-primary)]/10"
                          style={{
                            borderColor: `${currentTheme.primary}66`,
                            color: currentTheme.text,
                          }}
                        />

                        <button
                          type="submit"
                          disabled={formSubmitted}
                          className="mt-3 flex w-full items-center justify-center gap-2.5 rounded-xl px-4 py-3.5 text-base font-bold shadow-lg transition hover:brightness-110 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                          style={{
                            background: `linear-gradient(90deg, ${currentTheme.primary}, ${currentTheme.secondary})`,
                            color: currentTheme.text,
                          }}
                        >
                          {formSubmitted ? (
                            <>
                              <Check size={18} strokeWidth={2.5} />
                              Inquiry Sent!
                            </>
                          ) : (
                            <>
                              <Send size={17} />
                              Submit Inquiry
                            </>
                          )}
                        </button>
                      </form>
                    </WarmSection>

                    {/* QR CODE SECTION */}
                    {businessInfo.qrCode && (
                      <WarmSection
                        icon={ScanLine}
                        title="Scan & Connect"
                        theme={currentTheme}
                      >
                        <div
                          className="flex flex-col items-center rounded-2xl border p-6 text-center sm:p-8"
                          style={{
                            borderColor: `${currentTheme.primary}55`,
                            backgroundColor: `${currentTheme.primary}12`,
                          }}
                        >
                          <h5
                            className="text-xl font-bold"
                            style={{ color: currentTheme.text }}
                          >
                            Connect With Us
                          </h5>

                          <p className="mt-2 max-w-md text-sm leading-6 text-slate-300">
                            Scan this QR code to connect with our business.
                          </p>

                          <div
                            className="mt-5 rounded-2xl border bg-white p-4 shadow-lg"
                            style={{
                              borderColor: `${currentTheme.primary}66`,
                            }}
                          >
                            <img
                              src={businessInfo.qrCode}
                              alt="Business QR Code"
                              className="h-48 w-48 object-contain sm:h-56 sm:w-56"
                            />
                          </div>

                          <p className="mt-4 text-xs text-slate-400">
                            Scan using your phone camera
                          </p>
                        </div>
                      </WarmSection>
                    )}

                    {/* FOOTER */}

                    <footer
                      className="border-t px-5 py-6 text-center"
                      style={{
                        borderColor: `${currentTheme.primary}40`,
                        backgroundColor: currentTheme.surface,
                        color: currentTheme.text,
                      }}
                    >
                      <div
                        className="mx-auto mb-3 h-px w-16"
                        style={{ backgroundColor: currentTheme.primary }}
                      />

                      <p className="text-sm text-slate-300 sm:text-base">
                        Powered by{" "}
                        <span
                          className="font-bold tracking-wide"
                          style={{ color: currentTheme.primary }}
                        >
                          biowebsite
                        </span>
                      </p>

                      <p className="mt-1.5 text-xs text-slate-400 sm:text-sm">
                        Your business. Your identity.
                      </p>
                    </footer>
                  </div>
                </div>
              </div>

              <p className="mt-3 text-center text-sm leading-6 text-slate-300">
                This is a preview of how your digital business card is presented
                to customers.
              </p>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          06. PRODUCT DETAILS MODAL (IMAGE SWIPE + PAY UPI)
      ===================================================== */}

      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedProduct(null);
            }
          }}
        >
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-[#45414a] bg-[#17171c] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-[#45414a] bg-[#22222a]/90 text-slate-300 backdrop-blur transition hover:border-rose-300/30 hover:text-rose-200"
            >
              <X size={18} />
            </button>

            {/* MODAL IMAGE SWIPER (swipeable) */}
            {Array.isArray(selectedProduct.images) &&
            selectedProduct.images.filter((image) => image?.url).length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={
                  selectedProduct.images.filter((image) => image?.url).length > 1
                }
                pagination={{ clickable: true }}
                spaceBetween={0}
                slidesPerView={1}
                loop={
                  selectedProduct.images.filter((image) => image?.url).length > 1
                }
                className="product-modal-swiper h-60 w-full sm:h-80"
              >
                {selectedProduct.images
                  .filter((image) => image?.url)
                  .map((image, index) => (
                    <SwiperSlide key={image._id || index}>
                      <img
                        src={image.url}
                        alt={image.alt || selectedProduct.name}
                        className="h-full w-full object-cover"
                      />
                    </SwiperSlide>
                  ))}
              </Swiper>
            ) : (
              <div
                className="flex h-60 items-center justify-center text-7xl sm:h-80"
                style={{
                  background: `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.secondary}15)`,
                }}
              >
                📦
              </div>
            )}

            {/* MODAL CONTENT */}
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                    {selectedProduct.name}
                  </h3>

                  <span className="mt-2 inline-flex rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200">
                    {selectedProduct.category || "General"}
                  </span>
                </div>

                <span className="text-2xl font-extrabold text-amber-300 sm:text-3xl">
                  ₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">
                {selectedProduct.description}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 size={16} />
                  {selectedProduct.status === "active"
                    ? "Available"
                    : "Unavailable"}
                </span>

                {/* PAY WITH UPI */}
                {businessInfo.upiId && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      handleContactClick("upi");
                    }}
                    className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:brightness-110 active:scale-[0.98]"
                    style={{
                      borderColor: `${currentTheme.primary}55`,
                      backgroundColor: `${currentTheme.primary}18`,
                      color: currentTheme.text,
                    }}
                  >
                    <IndianRupee size={16} />
                    Pay with UPI
                  </button>
                )}

                {businessInfo.whatsapp || businessInfo.phone ? (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedProduct(null);
                      handleWhatsApp();
                    }}
                    className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 text-sm font-bold text-[#062c25] transition hover:brightness-110 active:scale-[0.98]"
                  >
                    <FaWhatsapp size={16} />
                    Enquire on WhatsApp
                  </button>
                ) : null}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          07. GALLERY LIGHTBOX
      ===================================================== */}

      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/85 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedGalleryImage(null);
            }
          }}
        >
          <div className="relative w-full max-w-3xl">
            <button
              type="button"
              onClick={() => setSelectedGalleryImage(null)}
              aria-label="Close gallery image"
              className="absolute -top-3 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-[#45414a] bg-[#22222a]/90 text-slate-300 backdrop-blur transition hover:border-rose-300/30 hover:text-rose-200 sm:-right-3"
            >
              <X size={18} />
            </button>

            <div className="overflow-hidden rounded-[24px] border border-[#45414a] bg-[#17171c]">
              <img
                src={selectedGalleryImage.url}
                alt={selectedGalleryImage.alt}
                className="max-h-[75vh] w-full object-contain"
              />

              {selectedGalleryImage.caption && (
                <div className="border-t border-white/10 px-5 py-4">
                  <p className="text-sm font-semibold text-white">
                    {selectedGalleryImage.caption}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* =====================================================
          08. REVIEW MODAL
      ===================================================== */}

      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowReviewModal(false);
            }
          }}
        >
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[26px] border border-[#45414a] bg-[#17171c] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-7">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-amber-300/70 to-transparent" />

            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#45414a] bg-[#22222a] text-slate-300 transition hover:border-rose-300/30 hover:text-rose-200"
            >
              <X size={18} />
            </button>

            {reviewSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-300 to-orange-300 shadow-lg shadow-amber-400/10">
                  <Check
                    size={29}
                    className="text-[#171116]"
                    strokeWidth={2.5}
                  />
                </div>

                <h3 className="mt-5 text-xl font-bold text-white">
                  Thank You!
                </h3>

                <p className="mt-2 text-base text-slate-300">
                  Thank you for your review!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/[0.08]">
                    <Star size={22} className="text-amber-300" />
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Write a Review
                    </h3>

                    <p className="mt-1 text-sm text-slate-300">
                      Share your experience with this business.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="review-name"
                  className="mb-2 block text-sm font-semibold text-slate-200"
                >
                  Your Name
                </label>

                <input
                  id="review-name"
                  required
                  value={reviewData.name}
                  onChange={(event) =>
                    setReviewData({
                      ...reviewData,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#45414a] bg-[#101116] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/[0.06]"
                />

                <p className="mb-3 mt-5 text-sm font-semibold text-slate-200">
                  Your Rating
                </p>

                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setReviewRating(number)}
                      aria-label={`Rate ${number} out of 5`}
                      className="transition hover:scale-110"
                    >
                      <Star
                        size={28}
                        className={
                          number <= reviewRating
                            ? "fill-amber-300 text-amber-300"
                            : "text-slate-500"
                        }
                      />
                    </button>
                  ))}
                </div>

                <label
                  htmlFor="review-message"
                  className="mb-2 mt-5 block text-sm font-semibold text-slate-200"
                >
                  Your Review
                </label>

                <textarea
                  id="review-message"
                  required
                  rows={4}
                  value={reviewData.review}
                  onChange={(event) =>
                    setReviewData({
                      ...reviewData,
                      review: event.target.value,
                    })
                  }
                  placeholder="Tell us about your experience..."
                  className="w-full resize-y rounded-xl border border-[#45414a] bg-[#101116] px-4 py-3.5 text-base leading-7 text-white outline-none transition placeholder:text-slate-400 focus:border-amber-300/60 focus:ring-4 focus:ring-amber-300/[0.06]"
                />

                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-300 to-orange-300 px-4 py-3.5 text-base font-bold text-[#201305] transition hover:brightness-110 active:scale-[0.99]"
                >
                  <Send size={17} />
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Payment
        isOpen={showPayment}
        onClose={() => setShowPayment(false)}
        upiId={profileData.upiId || ""}
        businessName={profileData.businessName || "My Business"}
        businessImage={profileData.logo || profileData.avatar || ""}
      />
    </div>
  );
};

/* =========================================================
   REUSABLE COMPONENTS
========================================================= */

const ActionButton = ({ icon: Icon, label, onClick, primary = false }) => (
  <button
    type="button"
    onClick={onClick}
    className={`group flex min-w-0 flex-col items-center justify-center gap-2.5 rounded-2xl border px-3 py-4 transition duration-200 hover:-translate-y-0.5 active:scale-[0.98] ${
      primary
        ? "border-emerald-400/30 bg-emerald-400/[0.10] hover:bg-emerald-400/[0.16]"
        : "border-white/10 bg-white/[0.025] hover:border-amber-300/30 hover:bg-amber-300/[0.05]"
    }`}
  >
    <span
      className={`flex h-11 w-11 items-center justify-center rounded-xl transition ${
        primary
          ? "bg-emerald-400/15 text-emerald-300"
          : "bg-amber-300/[0.08] text-amber-200 group-hover:bg-amber-300/[0.14]"
      }`}
    >
      <Icon size={20} />
    </span>

    <span className="text-center text-sm font-semibold leading-5 text-white">
      {label}
    </span>
  </button>
);

const ContactRow = ({ icon: Icon, label, value, onClick, theme }) => (
  <button
    type="button"
    onClick={onClick}
    className="group flex min-w-0 items-center gap-3 rounded-2xl border p-4 text-left transition duration-200 hover:border-[var(--profile-primary)] hover:brightness-110 active:scale-[0.99]"
    style={{
      backgroundColor: theme.surface,
      borderColor: `${theme.primary}40`,
      color: theme.text,
    }}
  >
    <span
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border transition"
      style={{
        borderColor: `${theme.primary}55`,
        backgroundColor: `${theme.primary}20`,
        color: theme.text,
      }}
    >
      <Icon size={19} />
    </span>

    <span className="min-w-0 flex-1">
      <span
        className="block text-xs font-bold uppercase tracking-[0.1em] opacity-70"
        style={{ color: theme.text }}
      >
        {label}
      </span>

      <span
        className="mt-1.5 block truncate text-sm font-semibold sm:text-base"
        style={{ color: theme.text }}
      >
        {value}
      </span>
    </span>

    <ChevronRight
      size={18}
      className="shrink-0 transition group-hover:translate-x-0.5"
      style={{ color: theme.primary }}
    />
  </button>
);

const WarmSection = ({ icon: Icon, title, action, children, theme }) => (
  <section
    className="border-t px-5 py-5 sm:px-8 sm:py-6 lg:px-10"
    style={{ borderColor: `${theme.primary}30` }}
  >
    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
      <h4
        className="flex min-w-0 items-center gap-3 text-sm font-bold leading-6 tracking-wide sm:text-base"
        style={{ color: theme.text }}
      >
        <span
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border"
          style={{
            borderColor: `${theme.primary}55`,
            backgroundColor: `${theme.primary}20`,
          }}
        >
          <Icon size={19} style={{ color: theme.text }} />
        </span>

        {title}
      </h4>

      {action}
    </div>

    {children}
  </section>
);

export default Mini;