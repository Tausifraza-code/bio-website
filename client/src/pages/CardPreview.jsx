import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import api from "../redux/api";
import { getPublicQRUrl } from "../utils/qrUrl";

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
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Copy,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
  Download,
  Check,
  Clock,
  Image as ImageIcon,
  Maximize2,
  X,
  UserPlus,
  IndianRupee,
  Navigation as NavigationIcon,
} from "lucide-react";

/* ============================================================
   THEMES — aligned with Mini.jsx primary/accent colors
   ============================================================ */
const themes = {
  executive: {
    primary: "#1e3a8a",
    accent: "#7c3aed",
    background: "#0c1630",
    surface: "#152447",
    card: "#101c38",
    text: "#f8fafc",
    muted: "#a5b4cf",
    border: "#33466c",
  },
  emerald: {
    primary: "#10b981",
    accent: "#14b8a6",
    background: "#062c25",
    surface: "#104438",
    card: "#0c382f",
    text: "#ecfdf5",
    muted: "#a7cfc3",
    border: "#216653",
  },
  rose: {
    primary: "#f43f5e",
    accent: "#fb923c",
    background: "#321722",
    surface: "#49202f",
    card: "#24151d",
    text: "#fff1f2",
    muted: "#e7bdc8",
    border: "#71404e",
  },
  obsidian: {
    primary: "#334155",
    accent: "#94a3b8",
    background: "#09090b",
    surface: "#18181b",
    card: "#111114",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    border: "#3f3f46",
  },
  sunset: {
    primary: "#f59e0b",
    accent: "#f97316",
    background: "#24130b",
    surface: "#3b2113",
    card: "#191513",
    text: "#fff7ed",
    muted: "#d6bba4",
    border: "#65452f",
  },
};

const PROFILE_LAYOUTS = [
  { id: "modern-business", name: "Modern Business" },
  { id: "minimal-card", name: "Minimal Card" },
  { id: "creator-portfolio", name: "Creator Portfolio" },
  { id: "corporate-executive", name: "Corporate Executive" },
  { id: "storefront", name: "Storefront" },
  { id: "freelancer-pro", name: "Freelancer Pro" },
  { id: "elegant-profile", name: "Elegant Profile" },
  { id: "agency-pro", name: "Agency Pro" },
  { id: "digital-card", name: "Digital Card" },
  { id: "service-pro", name: "Service Pro" },
];

const LAYOUT_FAMILY = {
  "modern-business": "business",
  "corporate-executive": "business",
  "minimal-card": "card",
  "elegant-profile": "card",
  "digital-card": "card",
  "creator-portfolio": "showcase",
  "agency-pro": "showcase",
  storefront: "utility",
  "freelancer-pro": "utility",
  "service-pro": "utility",
};

const FLAT_LAYOUTS = [
  "minimal-card",
  "creator-portfolio",
  "storefront",
  "freelancer-pro",
  "elegant-profile",
  "agency-pro",
  "digital-card",
  "service-pro",
];

const defaultBanner =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600";

/* ============================================================
   HELPERS
   ============================================================ */
const normalizeGalleryImages = (raw) => {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((item, index) => {
      if (typeof item === "string") {
        const url = item.trim();
        return url
          ? { url, alt: `Gallery image ${index + 1}`, caption: "" }
          : null;
      }
      if (!item || typeof item !== "object") return null;
      const url = [
        item.url,
        item.src,
        item.image,
        item.imageUrl,
        item.path,
      ].find((v) => typeof v === "string" && v.trim());
      if (!url) return null;
      const caption = item.caption?.trim() || item.title?.trim() || "";
      return {
        url: url.trim(),
        alt: item.alt?.trim() || caption || `Gallery image ${index + 1}`,
        caption,
      };
    })
    .filter(Boolean);
};

const BUTTON_ICON_MAP = {
  call: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  saveContact: Download,
  share: Share2,
  website: Globe,
  directions: NavigationIcon,
  upi: IndianRupee,
  customLink: FaLink,
};

const SOCIAL_ICON_MAP = [
  ["instagram", FaInstagram],
  ["linkedin", FaLinkedinIn],
  ["facebook", FaFacebookF],
  ["youtube", FaYoutube],
  ["whatsapp", FaWhatsapp],
  ["telegram", FaTelegram],
  ["website", FaGlobe],
];
const SOCIAL_BRAND_MAP = {
  instagram: { color: "#E4405F", label: "Instagram" },
  facebook: { color: "#1877F2", label: "Facebook" },
  linkedin: { color: "#0A66C2", label: "LinkedIn" },
  youtube: { color: "#FF0000", label: "YouTube" },
  whatsapp: { color: "#25D366", label: "WhatsApp" },
  telegram: { color: "#26A5E4", label: "Telegram" },
  twitter: { color: "#1DA1F2", label: "X (Twitter)" },
};

const getSocialIcon = (platform = "") => {
  const v = platform.toLowerCase();
  if (v.includes("twitter") || v === "x") return FaXTwitter;
  const found = SOCIAL_ICON_MAP.find(([k]) => v.includes(k));
  return found ? found[1] : FaLink;
};

const getSocialBrand = (platform = "") => {
  const v = (platform || "").toLowerCase();
  if (v.includes("twitter") || v === "x") return SOCIAL_BRAND_MAP.twitter;
  if (v.includes("web")) return { color: "#22d3ee", label: "Website" };
  const key = Object.keys(SOCIAL_BRAND_MAP).find((k) => v.includes(k));
  return key
    ? SOCIAL_BRAND_MAP[key]
    : { color: "#22d3ee", label: platform || "Link" };
};

/* ============================================================
   MAIN COMPONENT
   ============================================================ */
function CardPreview() {
  const { subdomain } = useParams();

  const [profile, setProfile] = useState(null);
  const [qrPath, setQrPath] = useState("");
  const [products, setProducts] = useState([]);
  const [galleryRaw, setGalleryRaw] = useState([]);
  const [contactButtons, setContactButtons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("share");
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  /* -------- FETCH PUBLIC PROFILE + ALL DATA -------- */
  useEffect(() => {
    let cancelled = false;

    const fetchPublicProfile = async () => {
      setLoading(true);
      setProfileError("");
      setProfile(null);
      setQrPath("");
      setProducts([]);
      setGalleryRaw([]);
      setContactButtons([]);

      try {
        if (!subdomain) throw new Error("Business profile URL is missing.");

        const response = await api.get(
          `/profile/public/${encodeURIComponent(subdomain)}`,
        );
        const data = response.data;
        const pubProfile = data?.profile;

        if (!data?.success || !pubProfile)
          throw new Error("Business profile was not found.");
        if (cancelled) return;

        setProfile(pubProfile);
        setQrPath(typeof data.qrPath === "string" ? data.qrPath : "");

        // Products
        const prods = data.products || pubProfile.products || [];
        setProducts(Array.isArray(prods) ? prods : []);

        // Gallery
        const galleryData =
          data.gallery ||
          pubProfile.gallery ||
          pubProfile.galleryImages ||
          pubProfile.businessGallery ||
          pubProfile.images ||
          [];
        setGalleryRaw(Array.isArray(galleryData) ? galleryData : []);

        // Contact buttons
        const btns = data.contactButtons || pubProfile.contactButtons || [];
        setContactButtons(
          (Array.isArray(btns) ? btns : [])
            .filter((b) => b && b.enabled !== false && b.enabled !== "false")
            .sort((a, b) => (a.order ?? 0) - (b.order ?? 0)),
        );
      } catch (error) {
        if (!cancelled) {
          setProfileError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load this business profile.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchPublicProfile();
    return () => {
      cancelled = true;
    };
  }, [subdomain]);

  /* -------- THEME + LAYOUT -------- */
  const theme = themes[profile?.activeTheme] || themes.sunset;

  const activeLayout = useMemo(() => {
    if (!profile?.activeLayout) return "modern-business";
    return PROFILE_LAYOUTS.some((l) => l.id === profile.activeLayout)
      ? profile.activeLayout
      : "modern-business";
  }, [profile?.activeLayout]);

  const layoutFamily = LAYOUT_FAMILY[activeLayout] || "business";
  const isFlatLayout = FLAT_LAYOUTS.includes(activeLayout);
  const activeLayoutData = PROFILE_LAYOUTS.find((l) => l.id === activeLayout);

  /* -------- DERIVED DATA -------- */
  const businessInfo = useMemo(() => {
    if (!profile) return null;
    return {
      name:
        [profile.firstName, profile.lastName].filter(Boolean).join(" ") ||
        "Your Name",
      role: profile.jobTitle || profile.role || "Business Owner / Professional",
      location:
        [
          profile.shopUnit,
          profile.area,
          profile.city,
          profile.state,
          profile.pincode,
        ]
          .filter(Boolean)
          .join(", ") || "India",
      about:
        profile.bio ||
        profile.headline ||
        `Welcome to ${profile.businessName || "our business"}! Contact us for business inquiries.`,
      phone: profile.phone || "",
      whatsapp: profile.whatsapp || profile.phone || "",
      email: profile.email || "",
      website: profile.website || profile.websiteUrl || "",
      address:
        [
          profile.shopUnit,
          profile.area,
          profile.city,
          profile.state,
          profile.pincode,
        ]
          .filter(Boolean)
          .join(", ") || "India",
      logo: profile.logo || "",
      avatar: profile.avatar || "",
      banner: profile.banner || defaultBanner,
      industry: profile.industry || "",
      businessName: profile.businessName || "My Business",
      businessHours: profile.businessHours || "",
      upiId: profile.upiId || "",
      isVerified: profile.isVerified !== false,
      mapLink: profile.mapLink || "",
    };
  }, [profile]);

  const galleryImages = useMemo(
    () => normalizeGalleryImages(galleryRaw),
    [galleryRaw],
  );
  const socialLinks = useMemo(
    () => (profile?.socialCards || []).filter((s) => s?.url),
    [profile?.socialCards],
  );
  const productList = Array.isArray(products) ? products : [];

  const qrValue = useMemo(() => {
    return getPublicQRUrl(qrPath);
  }, [qrPath]);

  const isQrImage = false;

  /* -------- HANDLERS -------- */
  const openWhatsApp = () => {
    const number = (businessInfo?.whatsapp || "").replace(/\D/g, "");
    if (!number)
      return alert("WhatsApp number has not been added to this profile.");
    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(`Hi, I'm interested in ${businessInfo.businessName}.`)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCall = () => {
    const phone = (businessInfo?.phone || "").replace(/\s/g, "");
    if (!phone) return alert("Phone number is not available.");
    window.location.href = `tel:${phone}`;
  };

  const handleEmail = () => {
    if (!businessInfo?.email) return alert("Email is not available.");
    window.location.href = `mailto:${businessInfo.email}`;
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy the link. Please copy it from the address bar.");
    }
  };

  const openQrModal = (tab = "share") => {
    setQrModalTab(tab);
    setShowQrModal(true);
  };

  const handleDownloadQR = (
    canvasId = "public-qr-modal-canvas",
    filename = "bio-website-qr.png",
  ) => {
    if (!qrValue) return alert("Profile QR code is not available.");
    const canvas = document.getElementById(canvasId);
    if (!canvas) return alert("QR code is not ready yet.");
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessInfo?.businessName || "Business Profile",
          text: `Check out ${businessInfo?.businessName || "this business"}`,
          url: window.location.href,
        });
      } catch {
        /* cancelled */
      }
    } else {
      copyLink();
    }
  };

  const handleSaveContact = () => {
    if (!profile) return;
    const esc = (v = "") =>
      String(v)
        .trim()
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    const fullName = [profile.firstName, profile.lastName]
      .filter((v) => v?.trim())
      .join(" ")
      .trim();
    const displayName = fullName || profile.businessName?.trim() || "";
    if (displayName) lines.push(`FN:${esc(displayName)}`);
    if (profile.businessName?.trim())
      lines.push(`ORG:${esc(profile.businessName)}`);
    if (profile.jobTitle?.trim()) lines.push(`TITLE:${esc(profile.jobTitle)}`);
    if (profile.phone?.trim())
      lines.push(`TEL;TYPE=CELL:${esc(profile.phone)}`);
    if (profile.email?.trim()) lines.push(`EMAIL:${esc(profile.email)}`);

    const website = profile.website?.trim() || profile.websiteUrl?.trim();
    if (website)
      lines.push(
        `URL:${esc(/^https?:\/\//i.test(website) ? website : `https://${website}`)}`,
      );

    const address = [
      profile.shopUnit,
      profile.area,
      profile.city,
      profile.state,
      profile.pincode,
    ]
      .filter((v) => v?.trim())
      .join(", ");
    if (address) lines.push(`ADR;TYPE=WORK:;;${esc(address)};;;;`);

    const note = profile.bio?.trim() || profile.headline?.trim();
    if (note) lines.push(`NOTE:${esc(note)}`);
    lines.push("END:VCARD");

    const blob = new Blob([`${lines.join("\r\n")}\r\n`], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${(displayName || "contact").replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").trim() || "contact"}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleConfiguredButton = (button) => {
    if (!button) return;
    switch (button.actionType) {
      case "call":
        return handleCall();
      case "whatsapp":
        return openWhatsApp();
      case "email":
        return handleEmail();
      case "directions":
        return window.open(
          profile?.mapLink ||
            `https://maps.google.com/?q=${encodeURIComponent(businessInfo?.address || "")}`,
          "_blank",
          "noopener,noreferrer",
        );
      case "share":
        return shareProfile();
      case "website":
      case "customLink":
        if (!button.customUrl)
          return alert("This button has no link configured.");
        return window.open(
          /^https?:\/\//i.test(button.customUrl)
            ? button.customUrl
            : `https://${button.customUrl}`,
          "_blank",
          "noopener,noreferrer",
        );
      case "saveContact":
        return handleSaveContact();
      case "upi":
        if (!businessInfo?.upiId) return alert("UPI ID is not available.");
        return (window.location.href = `upi://pay?pa=${encodeURIComponent(businessInfo.upiId)}&pn=${encodeURIComponent(businessInfo.businessName)}`);
      default:
        return;
    }
  };

  const submitInquiry = (event) => {
    event.preventDefault();
    // Placeholder — connect public inquiry endpoint here
    setFormSubmitted(true);
    setForm({ name: "", phone: "", email: "", message: "" });
    setTimeout(() => setFormSubmitted(false), 4000);
  };

  /* -------- LOADING / ERROR -------- */
  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        Loading business profile...
      </main>
    );
  }

  if (profileError || !profile || !businessInfo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
        <h1 className="text-2xl font-bold">Profile unavailable</h1>
        <p>{profileError || "This business profile could not be found."}</p>
        <Link to="/" className="underline">
          Go to Home
        </Link>
      </main>
    );
  }

  /* -------- ACCENT STYLE -------- */
  const accentGradient = `linear-gradient(100deg, ${theme.primary}, ${theme.accent})`;

  return (
    <main
      className="min-h-screen px-3 py-4 sm:px-5 sm:py-6"
      style={{ background: theme.background, color: theme.text }}
    >
      <style>{`
        .mini-profile-preview {
          --layout-radius: 24px;
          --layout-gap: 24px;
          --layout-padding: 24px;
          background: var(--theme-bg);
          color: var(--theme-text);
          border-radius: var(--layout-radius);
          transition: border-radius 200ms ease;
        }
        .mini-profile-preview .mini-profile-hero { height: 280px; transition: height 200ms ease; }
        .mini-profile-preview .mini-profile-header { position: relative; }
        .mini-profile-preview .mini-profile-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: var(--layout-gap);
          padding: 0 var(--layout-padding) 40px;
        }
        .mini-profile-preview .mini-profile-left,
        .mini-profile-preview .mini-profile-right {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 20px;
        }
        .mini-profile-preview .mini-profile-panel {
          min-width: 0;
          background: var(--theme-surface);
          border: 1px solid var(--theme-border);
          border-radius: 18px;
        }
        .mini-profile-preview[data-flat-layout="true"] .mini-profile-left,
        .mini-profile-preview[data-flat-layout="true"] .mini-profile-right {
          display: contents;
        }

        /* CARD family */
        .mini-profile-preview[data-layout-family="card"] .mini-profile-hero { height: 90px; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-header {
          text-align: center;
          background: linear-gradient(180deg, var(--theme-surface), var(--theme-bg));
          padding-top: 8px;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-identity-row {
          margin-top: -50px !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center;
          gap: 12px !important;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-identity { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-actions {
          flex-direction: column; align-items: stretch; gap: 8px !important; padding-inline: 8px;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-actions > button,
        .mini-profile-preview[data-layout-family="card"] .mini-profile-actions > a {
          width: 100%; justify-content: center;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-socials { justify-content: center !important; }

        /* SHOWCASE family */
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-hero { height: 400px; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-header { text-align: center; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-identity-row {
          flex-direction: column !important; align-items: center !important;
          margin-top: -80px !important; gap: 16px !important;
        }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-identity { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-actions,
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-socials { justify-content: center !important; }

        /* UTILITY family */
        .mini-profile-preview[data-layout-family="utility"] .mini-profile-hero { height: 180px; }
        .mini-profile-preview[data-profile-layout="storefront"] .mini-profile-panel[data-panel="products"] { order: -30; }
        .mini-profile-preview[data-profile-layout="storefront"] .mini-profile-hero { height: 220px; }
        .mini-profile-preview[data-profile-layout="service-pro"] .mini-profile-panel[data-panel="inquiry"] { order: -30; }
        .mini-profile-preview[data-profile-layout="service-pro"] .mini-profile-panel[data-panel="contact"] { order: -20; }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-hero { height: 140px; }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-panel[data-panel="about"] { order: -20; }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-panel[data-panel="inquiry"] { order: -10; }

        /* Per-layout */
        .mini-profile-preview[data-profile-layout="minimal-card"] { --layout-radius: 14px; --layout-gap: 14px; --layout-padding: 16px; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] { --layout-radius: 26px; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] .mini-profile-hero { height: 340px; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] .mini-profile-panel[data-panel="gallery"] { order: -20; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] .mini-profile-panel[data-panel="about"] { order: -10; }
        .mini-profile-preview[data-profile-layout="agency-pro"] .mini-profile-hero { height: 310px; }
        .mini-profile-preview[data-profile-layout="agency-pro"] .mini-profile-panel[data-panel="about"] { order: -20; }
        .mini-profile-preview[data-profile-layout="agency-pro"] .mini-profile-panel[data-panel="social"] { order: -10; }
        .mini-profile-preview[data-profile-layout="corporate-executive"] { --layout-radius: 8px; }
        .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-hero { height: 200px; }
        .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-panel { border-radius: 8px; }
        .mini-profile-preview[data-profile-layout="elegant-profile"] { --layout-radius: 28px; }
        .mini-profile-preview[data-profile-layout="elegant-profile"] .mini-profile-hero { height: 100px; }
        .mini-profile-preview[data-profile-layout="elegant-profile"] .mini-profile-header { text-align: center; }
        .mini-profile-preview[data-profile-layout="elegant-profile"] .mini-profile-identity-row {
          flex-direction: column !important; align-items: center !important; margin-top: -50px !important;
        }
        .mini-profile-preview[data-profile-layout="digital-card"] { --layout-radius: 30px; --layout-gap: 12px; --layout-padding: 12px; }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-hero { height: 90px; }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-panel[data-panel="qr"] { order: -30; }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-panel[data-panel="contact"] { order: -20; }

        @media (min-width: 1024px) {
          .mini-profile-preview .mini-profile-main { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); }
          .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-main { grid-template-columns: minmax(0, 5fr) minmax(0, 7fr); }
          .mini-profile-preview[data-flat-layout="true"] .mini-profile-main { grid-template-columns: minmax(0, 1fr); }
        }
        @media (max-width: 640px) {
          .mini-profile-preview .mini-profile-hero { height: 200px; }
          .mini-profile-preview[data-layout-family="card"] .mini-profile-hero { height: 80px; }
          .mini-profile-preview[data-layout-family="showcase"] .mini-profile-hero { height: 260px; }
        }
      `}</style>

      <div className="mx-auto w-full max-w-[1120px]">
        {/* TOP BAR */}
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.border}`,
          }}
        >
          <div className="flex items-center gap-3">
            <ShieldCheck size={20} style={{ color: theme.primary }} />
            <span
              className="text-sm font-semibold"
              style={{ color: theme.muted }}
            >
              {activeLayoutData?.name || "Modern Business"} layout
            </span>
          </div>
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={{ background: accentGradient, color: "#ffffff" }}
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Card Link"}
          </button>
        </div>

        {/* MAIN PREVIEW WRAPPER */}
        <article
          className="mini-profile-preview overflow-hidden border shadow-2xl"
          data-profile-layout={activeLayout}
          data-layout-family={layoutFamily}
          data-flat-layout={isFlatLayout ? "true" : undefined}
          style={{
            "--theme-bg": theme.background,
            "--theme-surface": theme.surface,
            "--theme-card": theme.card,
            "--theme-text": theme.text,
            "--theme-muted": theme.muted,
            "--theme-border": theme.border,
            "--theme-primary": theme.primary,
            "--theme-accent": theme.accent,
            borderColor: theme.border,
          }}
        >
          {/* HERO */}
          <div className="mini-profile-hero relative w-full overflow-hidden">
            <img
              src={businessInfo.banner}
              alt={`${businessInfo.businessName} banner`}
              className="h-full w-full object-cover object-center"
            />
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to top, ${theme.background}, ${theme.background}66, transparent)`,
              }}
            />

            <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
              <span
                className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-xs font-extrabold uppercase tracking-wider"
                style={{
                  background: "rgba(10,10,10,0.65)",
                  color: "#ffffff",
                  borderColor: theme.primary,
                }}
              >
                <Star size={13} style={{ color: theme.primary }} />
                Featured Business
              </span>
            </div>

            <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
              {/* Share Profile */}
              <button
                type="button"
                onClick={() => openQrModal("share")}
                title="Share profile"
                aria-label="Share profile"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/60 text-white backdrop-blur-sm hover:bg-black/75"
              >
                <Share2 size={17} />
              </button>
              {/* View QR Code */}
              <button
                type="button"
                onClick={() => openQrModal("myqr")}
                title="View QR Code"
                aria-label="View QR Code"
                className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-950"
                style={{ background: theme.primary }}
              >
                <QrCode size={19} />
              </button>
            </div>
          </div>

          {/* HEADER */}
          <div className="mini-profile-header px-4 sm:px-8 md:px-10">
            <div className="mini-profile-identity-row -mt-16 flex flex-col items-center gap-4 sm:-mt-20 sm:gap-5 md:flex-row md:items-end">
              <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
                <div
                  className="h-full w-full overflow-hidden rounded-full border-4 shadow-2xl"
                  style={{
                    borderColor: theme.background,
                    background: theme.surface,
                  }}
                >
                  {businessInfo.avatar ? (
                    <img
                      src={businessInfo.avatar}
                      alt={businessInfo.name}
                      className="h-full w-full object-cover"
                    />
                  ) : businessInfo.logo ? (
                    <img
                      src={businessInfo.logo}
                      alt={businessInfo.businessName}
                      className="h-full w-full object-contain p-3"
                    />
                  ) : (
                    <div
                      className="flex h-full items-center justify-center"
                      style={{ color: theme.muted }}
                    >
                      <UserPlus size={40} />
                    </div>
                  )}
                </div>
                {businessInfo.logo && businessInfo.avatar && (
                  <div
                    className="absolute -bottom-1 -right-1 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 bg-white shadow-lg sm:h-11 sm:w-11"
                    style={{ borderColor: theme.background }}
                  >
                    <img
                      src={businessInfo.logo}
                      alt={businessInfo.businessName}
                      className="h-full w-full object-contain"
                    />
                  </div>
                )}
              </div>

              <div className="pb-2 text-center md:text-left">
                <div className="mini-profile-identity flex flex-wrap items-center justify-center gap-2 md:justify-start">
                  <h1
                    className="text-2xl font-extrabold sm:text-3xl md:text-4xl"
                    style={{ color: theme.text }}
                  >
                    {businessInfo.name}
                  </h1>
                  {businessInfo.isVerified && (
                    <CheckCircle2 size={22} style={{ color: theme.primary }} />
                  )}
                </div>
                <p
                  className="mt-1 font-semibold"
                  style={{ color: theme.primary }}
                >
                  {businessInfo.role}
                </p>
                <p className="text-sm" style={{ color: theme.muted }}>
                  {businessInfo.businessName}
                </p>
                <p
                  className="mt-1 flex items-center justify-center gap-1 text-xs md:justify-start"
                  style={{ color: theme.muted }}
                >
                  <MapPin size={12} />
                  {businessInfo.location}
                </p>
              </div>
            </div>

            {/* DYNAMIC BUTTONS */}
            {contactButtons.length > 0 ? (
              <div className="mini-profile-actions flex flex-wrap justify-center gap-2 py-5 md:justify-start">
                {contactButtons.map((button, index) => {
                  const Icon = BUTTON_ICON_MAP[button.actionType] || FaLink;
                  const isSave = button.actionType === "saveContact";
                  const FinalIcon = isSave && saved ? Check : Icon;
                  const label =
                    isSave && saved
                      ? "Contact Saved"
                      : button.label || button.actionType;
                  return (
                    <button
                      key={button.id || button.buttonId || button._id || index}
                      type="button"
                      onClick={() => handleConfiguredButton(button)}
                      className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition hover:brightness-110"
                      style={{ background: accentGradient, color: "#ffffff" }}
                    >
                      <FinalIcon size={16} />
                      {label}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="mini-profile-actions flex flex-wrap justify-center gap-2 py-5 md:justify-start">
                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
                  style={{ background: accentGradient, color: "#fff" }}
                >
                  <MessageCircle size={16} />
                  WhatsApp
                </button>
                <button
                  type="button"
                  onClick={handleCall}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
                  style={{
                    background: theme.surface,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <Phone size={16} />
                  Call
                </button>
                <button
                  type="button"
                  onClick={shareProfile}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
                  style={{
                    background: theme.surface,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  <Share2 size={16} />
                  Share
                </button>
                <button
                  type="button"
                  onClick={handleSaveContact}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold"
                  style={{
                    background: theme.surface,
                    color: theme.text,
                    border: `1px solid ${theme.border}`,
                  }}
                >
                  {saved ? <Check size={16} /> : <Download size={16} />}
                  {saved ? "Saved" : "Save Contact"}
                </button>
              </div>
            )}

            {/* SOCIAL ICONS */}
            {socialLinks.length > 0 && (
              <div className="mini-profile-socials flex flex-wrap justify-center gap-2 pb-6 md:justify-start">
                {socialLinks.map((social, index) => {
                  const SocialIcon = getSocialIcon(social.platform);
                  return (
                    <a
                      key={social._id || `${social.platform}-${index}`}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.platform || "Social link"}
                      className="flex h-10 w-10 items-center justify-center rounded-xl"
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.surface,
                        color: theme.text,
                      }}
                    >
                      <SocialIcon size={18} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          {/* MAIN GRID */}
          <div className="mini-profile-main">
            {/* LEFT */}
            <div className="mini-profile-left">
              {/* CONTACT DETAILS */}
              <div data-panel="contact" className="mini-profile-panel p-5">
                <h3 className="mb-4 font-bold" style={{ color: theme.text }}>
                  Contact Details
                </h3>
                <div className="space-y-4 text-sm">
                  {[
                    {
                      Icon: Phone,
                      text: businessInfo.phone || "Phone not provided",
                    },
                    {
                      Icon: MessageCircle,
                      text: businessInfo.whatsapp || "WhatsApp not provided",
                    },
                    {
                      Icon: Mail,
                      text: businessInfo.email || "Email not provided",
                      br: true,
                    },
                    {
                      Icon: Globe,
                      text: businessInfo.website || "Website not provided",
                      br: true,
                    },
                    { Icon: MapPin, text: businessInfo.address },
                    {
                      Icon: Clock,
                      text: businessInfo.businessHours || "Hours not provided",
                    },
                  ].map(({ Icon, text, br }, i) => (
                    <p
                      key={i}
                      className={`flex gap-3 ${br ? "break-all" : ""}`}
                      style={{ color: theme.text }}
                    >
                      <Icon
                        size={16}
                        className="shrink-0"
                        style={{ color: theme.primary }}
                      />
                      {text}
                    </p>
                  ))}
                </div>
              </div>

              {/* QR CODE */}
              <div
                id="public-qr-section"
                data-panel="qr"
                className="mini-profile-panel flex flex-col items-center p-5 text-center"
              >
                <h3
                  className="mb-3 text-base font-bold"
                  style={{ color: theme.text }}
                >
                  Scan QR Code
                </h3>
                {qrValue ? (
                  <div className="mb-3 rounded-xl bg-white p-3">
                    <QRCodeCanvas
                      id="public-qr-canvas"
                      value={qrValue}
                      size={160}
                      level="H"
                      includeMargin
                    />
                  </div>
                ) : (
                  <div
                    className="mb-3 flex h-40 w-40 items-center justify-center rounded-xl text-sm"
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.card,
                      color: theme.muted,
                    }}
                  >
                    QR not available
                  </div>
                )}
                <p className="mb-3 text-xs" style={{ color: theme.muted }}>
                  Scan to visit this profile
                </p>
                {!isQrImage && qrValue && (
                  <button
                    type="button"
                    onClick={() => {
                      const canvas =
                        document.getElementById("public-qr-canvas");
                      if (!canvas) return;
                      const link = document.createElement("a");
                      link.href = canvas.toDataURL("image/png");
                      link.download = "profile-qr.png";
                      document.body.appendChild(link);
                      link.click();
                      link.remove();
                    }}
                    className="flex w-full items-center justify-center gap-2 rounded-lg py-2 text-sm font-bold"
                    style={{
                      border: `1px solid ${theme.primary}`,
                      color: theme.primary,
                      background: theme.card,
                    }}
                  >
                    <Download size={16} />
                    Download QR
                  </button>
                )}
              </div>

              {/* SOCIAL LINK CARDS */}
              {socialLinks.length > 0 && (
                <div data-panel="social" className="mini-profile-panel p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3
                      className="flex items-center gap-2 text-sm font-bold"
                      style={{ color: theme.text }}
                    >
                      <span
                        className="flex h-6 w-6 items-center justify-center rounded-md"
                        style={{ background: theme.card, color: theme.primary }}
                      >
                        <FaLink size={11} />
                      </span>
                      Social Links
                    </h3>
                    <span
                      className="rounded-full px-2 py-0.5 text-[10px] font-bold"
                      style={{
                        border: `1px solid ${theme.primary}44`,
                        background: theme.card,
                        color: theme.primary,
                      }}
                    >
                      {socialLinks.length} linked
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {socialLinks.map((social, index) => {
                      const SocialIcon = getSocialIcon(social.platform);
                      const brand = getSocialBrand(social.platform);
                      return (
                        <a
                          key={social._id || `${social.platform}-${index}`}
                          href={social.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 transition hover:-translate-y-0.5"
                          style={{
                            border: `1px solid ${theme.border}`,
                            background: theme.card,
                          }}
                        >
                          <div
                            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white"
                            style={{
                              background: `linear-gradient(135deg, ${brand.color}, ${brand.color}bb)`,
                            }}
                          >
                            <SocialIcon size={14} />
                          </div>
                          <span
                            className="flex-1 truncate text-[11.5px] font-semibold"
                            style={{ color: theme.text }}
                          >
                            {brand.label}
                          </span>
                        </a>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* REVIEWS */}
              <div data-panel="reviews" className="mini-profile-panel p-5">
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className="text-base font-bold"
                    style={{ color: theme.text }}
                  >
                    Reviews
                  </h3>
                  <button
                    type="button"
                    onClick={() => alert("Review submission coming soon.")}
                    className="rounded-lg px-3 py-1.5 text-xs font-bold"
                    style={{
                      border: `1px solid ${theme.primary}`,
                      background: theme.card,
                      color: theme.primary,
                    }}
                  >
                    Write Review
                  </button>
                </div>
                <p className="text-sm" style={{ color: theme.muted }}>
                  Be the first to share your experience with this business.
                </p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="mini-profile-right">
              {/* ABOUT */}
              <div data-panel="about" className="mini-profile-panel p-5 sm:p-6">
                <h3
                  className="mb-3 text-lg font-bold"
                  style={{ color: theme.text }}
                >
                  About Me
                </h3>
                <p
                  className="text-sm leading-7 whitespace-pre-line"
                  style={{ color: theme.text }}
                >
                  {businessInfo.about}
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {businessInfo.industry && (
                    <span
                      className="rounded-md px-3 py-1 text-xs"
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.card,
                        color: theme.primary,
                      }}
                    >
                      {businessInfo.industry}
                    </span>
                  )}
                  <span
                    className="rounded-md px-3 py-1 text-xs"
                    style={{
                      border: `1px solid ${theme.border}`,
                      background: theme.card,
                      color: theme.primary,
                    }}
                  >
                    {businessInfo.businessName}
                  </span>
                </div>
              </div>

              {/* PRODUCTS */}
              {productList.length > 0 && (
                <div
                  data-panel="products"
                  className="mini-profile-panel overflow-hidden p-5 sm:p-6"
                >
                  <div className="mb-4 flex items-center justify-between">
                    <h3
                      className="flex items-center gap-2 text-lg font-bold"
                      style={{ color: theme.text }}
                    >
                      <ShoppingBag size={18} style={{ color: theme.primary }} />
                      Featured Products
                    </h3>
                    <span className="text-xs" style={{ color: theme.muted }}>
                      {productList.length} items
                    </span>
                  </div>
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={16}
                    slidesPerView={1}
                    navigation={productList.length > 2}
                    pagination={{ clickable: true }}
                    loop={productList.length > 2}
                    autoplay={
                      productList.length > 1
                        ? {
                            delay: 3000,
                            disableOnInteraction: false,
                            pauseOnMouseEnter: true,
                          }
                        : false
                    }
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 2 },
                    }}
                    className="pb-10"
                  >
                    {productList.map((product) => {
                      const cover = product.images?.find(
                        (img) => img?.url,
                      )?.url;
                      return (
                        <SwiperSlide key={product._id || product.id}>
                          <button
                            type="button"
                            onClick={() => setSelectedProduct(product)}
                            className="group w-full overflow-hidden rounded-xl text-left"
                            style={{
                              border: `1px solid ${theme.border}`,
                              background: theme.card,
                            }}
                          >
                            <div
                              className="h-36"
                              style={{ background: theme.surface }}
                            >
                              {cover ? (
                                <img
                                  src={cover}
                                  alt={product.name}
                                  className="h-full w-full object-cover"
                                />
                              ) : (
                                <div
                                  className="flex h-full items-center justify-center"
                                  style={{ color: theme.muted }}
                                >
                                  <ImageIcon size={30} />
                                </div>
                              )}
                            </div>
                            <div className="p-3">
                              <h4
                                className="truncate text-sm font-bold"
                                style={{ color: theme.text }}
                              >
                                {product.name}
                              </h4>
                              <p
                                className="mt-1 truncate text-xs"
                                style={{ color: theme.muted }}
                              >
                                {product.description}
                              </p>
                              <p
                                className="mt-3 font-extrabold"
                                style={{ color: theme.primary }}
                              >
                                ₹
                                {Number(product.price || 0).toLocaleString(
                                  "en-IN",
                                )}
                              </p>
                            </div>
                          </button>
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </div>
              )}

              {/* GALLERY */}
              <div
                data-panel="gallery"
                className="mini-profile-panel p-5 sm:p-6"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3
                    className="text-lg font-bold"
                    style={{ color: theme.text }}
                  >
                    Gallery
                  </h3>
                  <span className="text-sm" style={{ color: theme.primary }}>
                    {galleryImages.length} photos
                  </span>
                </div>
                {galleryImages.length > 0 ? (
                  <Swiper
                    modules={[Autoplay, Navigation, Pagination]}
                    spaceBetween={12}
                    slidesPerView={2}
                    navigation={galleryImages.length > 3}
                    pagination={{ clickable: true }}
                    loop={galleryImages.length > 3}
                    autoplay={{
                      delay: 2500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }}
                    breakpoints={{
                      640: { slidesPerView: 2 },
                      1024: { slidesPerView: 3 },
                    }}
                    className="pb-10"
                  >
                    {galleryImages.map((image, index) => (
                      <SwiperSlide key={`${image.url}-${index}`}>
                        <button
                          type="button"
                          onClick={() => setSelectedGalleryImage(image)}
                          className="group relative aspect-video w-full overflow-hidden rounded-xl"
                        >
                          <img
                            src={image.url}
                            alt={image.alt}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                            <Maximize2 size={20} className="text-white" />
                          </span>
                        </button>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                ) : (
                  <div
                    className="rounded-xl py-8 text-center"
                    style={{ border: `1px dashed ${theme.border}` }}
                  >
                    <ImageIcon
                      size={32}
                      className="mx-auto mb-2"
                      style={{ color: theme.muted }}
                    />
                    <p className="text-sm" style={{ color: theme.muted }}>
                      No gallery images added yet.
                    </p>
                  </div>
                )}
              </div>

              {/* INQUIRY */}
              <div
                data-panel="inquiry"
                className="mini-profile-panel p-5 sm:p-6"
              >
                <h3
                  className="mb-4 text-lg font-bold"
                  style={{ color: theme.text }}
                >
                  Send an Inquiry
                </h3>
                {formSubmitted ? (
                  <div
                    className="rounded-xl p-4 text-sm font-semibold"
                    style={{
                      border: `1px solid ${theme.primary}44`,
                      background: theme.card,
                      color: theme.primary,
                    }}
                  >
                    Thank you! Your inquiry has been submitted successfully.
                  </div>
                ) : (
                  <form onSubmit={submitInquiry} className="space-y-3">
                    {[
                      {
                        type: "text",
                        key: "name",
                        placeholder: "Your Name",
                        required: true,
                      },
                      {
                        type: "tel",
                        key: "phone",
                        placeholder: "Phone",
                        required: true,
                      },
                      {
                        type: "email",
                        key: "email",
                        placeholder: "Email (optional)",
                        required: false,
                      },
                    ].map(({ type, key, placeholder, required }) => (
                      <input
                        key={key}
                        type={type}
                        required={required}
                        value={form[key]}
                        onChange={(e) =>
                          setForm({ ...form, [key]: e.target.value })
                        }
                        placeholder={placeholder}
                        className="w-full rounded-lg px-3.5 py-2.5 text-sm outline-none"
                        style={{
                          border: `1px solid ${theme.border}`,
                          background: theme.card,
                          color: theme.text,
                        }}
                      />
                    ))}
                    <textarea
                      rows={3}
                      required
                      value={form.message}
                      onChange={(e) =>
                        setForm({ ...form, message: e.target.value })
                      }
                      placeholder="Message"
                      className="w-full resize-none rounded-lg px-3.5 py-2.5 text-sm outline-none"
                      style={{
                        border: `1px solid ${theme.border}`,
                        background: theme.card,
                        color: theme.text,
                      }}
                    />
                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-lg py-2.5 text-sm font-bold"
                      style={{ background: accentGradient, color: "#ffffff" }}
                    >
                      <Send size={16} />
                      Submit Inquiry
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <footer
            className="px-5 py-6 text-center sm:px-8"
            style={{
              borderTop: `1px solid ${theme.border}`,
              background: theme.surface,
            }}
          >
            <ShieldCheck
              size={22}
              className="mx-auto"
              style={{ color: theme.primary }}
            />
            <p
              className="mt-2 text-base font-extrabold"
              style={{ color: theme.text }}
            >
              {businessInfo.businessName}
            </p>
            <p className="mt-2 text-sm" style={{ color: theme.muted }}>
              {businessInfo.about}
            </p>
            <button
              type="button"
              onClick={shareProfile}
              className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold"
              style={{ background: accentGradient, color: "#ffffff" }}
            >
              <Share2 size={17} />
              Share Business Card
            </button>
            <p className="mt-4 text-xs" style={{ color: theme.muted }}>
              © {new Date().getFullYear()} {businessInfo.businessName}. All
              rights reserved.
            </p>
          </footer>
        </article>
      </div>

      {/* SHARE / MY QR / POSTER MODAL */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) setShowQrModal(false);
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Share profile and QR code"
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-7"
            style={{ background: theme.surface, borderColor: theme.border }}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{ background: theme.card, color: theme.text }}
            >
              <X size={18} />
            </button>
            <h2
              className="mb-5 pr-10 text-xl font-bold"
              style={{ color: theme.text }}
            >
              Share Your Profile
            </h2>
            <div className="mb-5 grid grid-cols-3 gap-2">
              {[
                { id: "share", label: "Share" },
                { id: "myqr", label: "My QR" },
                { id: "poster", label: "Poster" },
              ].map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setQrModalTab(tab.id)}
                  className="rounded-lg border px-3 py-2 text-sm font-semibold"
                  style={
                    qrModalTab === tab.id
                      ? {
                          borderColor: theme.primary,
                          background: `${theme.primary}22`,
                          color: theme.primary,
                        }
                      : {
                          borderColor: theme.border,
                          background: theme.card,
                          color: theme.muted,
                        }
                  }
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {qrModalTab === "share" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={shareProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold"
                  style={{ background: accentGradient, color: "#fff" }}
                >
                  <Share2 size={17} /> Share Profile
                </button>
                <button
                  type="button"
                  onClick={copyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 font-semibold"
                  style={{
                    borderColor: theme.border,
                    background: theme.card,
                    color: theme.text,
                  }}
                >
                  <Copy size={17} />{" "}
                  {copied ? "Link Copied!" : "Copy Profile Link"}
                </button>
              </div>
            )}

            {qrModalTab === "myqr" && (
              <div className="flex flex-col items-center">
                {qrValue ? (
                  <>
                    <div className="mb-5 rounded-xl bg-white p-4">
                      <QRCodeCanvas
                        id="public-qr-modal-canvas"
                        value={qrValue}
                        size={220}
                        level="H"
                        includeMargin
                      />
                    </div>
                    <p
                      className="mb-4 break-all text-center text-xs"
                      style={{ color: theme.muted }}
                    >
                      {qrValue}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadQR(
                          "public-qr-modal-canvas",
                          "bio-website-qr.png",
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold"
                      style={{
                        borderColor: theme.primary,
                        background: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Download size={16} /> Download QR Code
                    </button>
                  </>
                ) : (
                  <p className="py-8 text-sm" style={{ color: theme.muted }}>
                    QR code is not available for this profile.
                  </p>
                )}
              </div>
            )}

            {qrModalTab === "poster" && (
              <div
                className="flex flex-col items-center rounded-xl border p-5 text-center"
                style={{ borderColor: theme.border, background: theme.card }}
              >
                <QrCode
                  size={32}
                  className="mb-3"
                  style={{ color: theme.primary }}
                />
                <h3
                  className="mb-2 text-lg font-bold"
                  style={{ color: theme.text }}
                >
                  Profile QR Poster
                </h3>
                <p className="mb-4 text-sm" style={{ color: theme.muted }}>
                  Scan this QR code to open this profile.
                </p>
                {qrValue ? (
                  <>
                    <div className="rounded-xl bg-white p-3">
                      <QRCodeCanvas
                        id="public-qr-poster-canvas"
                        value={qrValue}
                        size={180}
                        level="H"
                        includeMargin
                      />
                    </div>
                    <p
                      className="mt-3 break-all text-xs"
                      style={{ color: theme.muted }}
                    >
                      {businessInfo.businessName}
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        handleDownloadQR(
                          "public-qr-poster-canvas",
                          "bio-profile-qr-poster.png",
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
                      style={{ background: accentGradient, color: "#fff" }}
                    >
                      <Download size={16} /> Download Poster QR
                    </button>
                  </>
                ) : (
                  <p className="py-8 text-sm" style={{ color: theme.muted }}>
                    QR code is not available for this profile.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct &&
        (() => {
          const imgs = Array.isArray(selectedProduct.images)
            ? selectedProduct.images.filter((i) => i?.url)
            : [];
          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              onClick={(e) => {
                if (e.target === e.currentTarget) setSelectedProduct(null);
              }}
            >
              <div
                className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px]"
                style={{
                  background: theme.surface,
                  border: `1px solid ${theme.border}`,
                }}
              >
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close product"
                  className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{ background: theme.card, color: theme.text }}
                >
                  <X size={18} />
                </button>
                {imgs.length > 0 ? (
                  <Swiper
                    modules={[Navigation, Pagination]}
                    navigation={imgs.length > 1}
                    pagination={{ clickable: true }}
                    slidesPerView={1}
                    loop={imgs.length > 1}
                    className="h-60 w-full sm:h-80"
                  >
                    {imgs.map((image, index) => (
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
                  <div className="flex h-60 items-center justify-center text-7xl sm:h-80">
                    📦
                  </div>
                )}
                <div className="p-5 sm:p-7">
                  <h3
                    className="text-2xl font-bold"
                    style={{ color: theme.text }}
                  >
                    {selectedProduct.name}
                  </h3>
                  <p className="mt-2" style={{ color: theme.primary }}>
                    ₹
                    {Number(selectedProduct.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p
                    className="mt-4 text-sm leading-7"
                    style={{ color: theme.text }}
                  >
                    {selectedProduct.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span
                      className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold"
                      style={{
                        border: `1px solid ${theme.primary}33`,
                        background: theme.card,
                        color: theme.primary,
                      }}
                    >
                      <CheckCircle2 size={16} />
                      {selectedProduct.status === "active"
                        ? "Available"
                        : "Unavailable"}
                    </span>
                    {businessInfo.upiId && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(null);
                          handleConfiguredButton({ actionType: "upi" });
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                        style={{
                          border: `1px solid ${theme.primary}`,
                          background: theme.card,
                          color: theme.primary,
                        }}
                      >
                        <IndianRupee size={16} />
                        Pay with UPI
                      </button>
                    )}
                    {(businessInfo.whatsapp || businessInfo.phone) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(null);
                          openWhatsApp();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                        style={{ background: accentGradient, color: "#ffffff" }}
                      >
                        <FaWhatsapp size={16} />
                        Enquire on WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })()}

      {/* GALLERY MODAL */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedGalleryImage(null);
          }}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-[24px]"
            style={{
              background: theme.surface,
              border: `1px solid ${theme.border}`,
            }}
          >
            <button
              type="button"
              onClick={() => setSelectedGalleryImage(null)}
              aria-label="Close gallery"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{ background: theme.card, color: theme.text }}
            >
              <X size={18} />
            </button>
            <img
              src={selectedGalleryImage.url}
              alt={selectedGalleryImage.alt}
              className="max-h-[75vh] w-full object-contain"
            />
            {selectedGalleryImage.caption && (
              <div
                className="px-5 py-4"
                style={{ borderTop: `1px solid ${theme.border}` }}
              >
                <p
                  className="text-sm font-semibold"
                  style={{ color: theme.text }}
                >
                  {selectedGalleryImage.caption}
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  );
}

export default CardPreview;
