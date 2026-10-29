import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import api from "../redux/api";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import { getPublicQRUrl } from "../utils/qrUrl";
import { fetchMyProfile } from "../redux/slice/profileSlice";
import {
  fetchContactButtons,
  resetContactButtons,
} from "../redux/slice/contactButtonsSlice";
import { getMyProducts } from "../redux/slice/productSlice";
import { getMyGallery } from "../redux/slice/gallerySlice";
import { fetchMyBoundQR } from "../redux/slice/qrSlice";
import { createInquiry } from "../redux/slice/inquirySlice";
import Payment from "./Payment";

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
  CheckCircle2,
  Check,
  Send,
  X,
  Palette,
  Maximize2,
  ScanLine,
  MonitorSmartphone,
  IndianRupee,
  Image as ImageIcon,
  Clock,
  Download,
  Copy,
  FileImage,
  Navigation as NavigationIcon,
} from "lucide-react";

/* ============ THEMES ============ */
const themes = [
  { id: "executive", name: "Executive Royal", colors: ["#1e3a8a", "#7c3aed"] },
  { id: "emerald", name: "Emerald Luxe", colors: ["#10b981", "#14b8a6"] },
  { id: "rose", name: "Rose Gold & Champagne", colors: ["#f43f5e", "#fb923c"] },
  {
    id: "obsidian",
    name: "Obsidian Noir & Platinum",
    colors: ["#334155", "#94a3b8"],
  },
  {
    id: "sunset",
    name: "Sunset Amber & Coral",
    colors: ["#f59e0b", "#f97316"],
  },
];

/* ============ LAYOUTS ============ */
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

const bannerImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200",
];

/* ============ HELPERS ============ */
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
      ].find((value) => typeof value === "string" && value.trim());

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

/* ============ BUTTON MAPS ============ */
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

const SECONDARY_BTN = {
  bg: "border border-[#29435f] bg-[#132942] hover:bg-[#1a3658]",
  text: "text-white",
};

const BUTTON_STYLE_MAP = {
  call: { bg: "bg-cyan-400 hover:bg-cyan-300", text: "text-[#0b1b30]" },
  whatsapp: { bg: "bg-emerald-500 hover:bg-emerald-400", text: "text-white" },
  email: { bg: "bg-blue-500 hover:bg-blue-400", text: "text-white" },
  upi: {
    bg: "border border-cyan-400/40 bg-cyan-400/10 hover:bg-cyan-400/20",
    text: "text-cyan-300",
  },
  saveContact: SECONDARY_BTN,
  share: SECONDARY_BTN,
  website: SECONDARY_BTN,
  directions: SECONDARY_BTN,
  customLink: SECONDARY_BTN,
};

/* ============ SOCIAL MAPS ============ */
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
  const value = platform.toLowerCase();
  if (value.includes("twitter") || value === "x") return FaXTwitter;
  const found = SOCIAL_ICON_MAP.find(([key]) => value.includes(key));
  return found ? found[1] : FaLink;
};

const getSocialBrand = (platform = "") => {
  const value = (platform || "").toLowerCase();
  if (value.includes("twitter") || value === "x")
    return SOCIAL_BRAND_MAP.twitter;
  if (value.includes("web")) return { color: "#22d3ee", label: "Website" };
  const key = Object.keys(SOCIAL_BRAND_MAP).find((item) =>
    value.includes(item),
  );
  return key
    ? SOCIAL_BRAND_MAP[key]
    : { color: "#22d3ee", label: platform || "Link" };
};

/* ============ OVERLAY ============ */
const Overlay = ({ onClose, children, higher, darker }) => (
  <div
    className={`fixed inset-0 ${
      higher ? "z-[110]" : "z-[100]"
    } flex items-center justify-center ${
      darker ? "bg-[#020817]/85" : "bg-[#020817]/80"
    } p-4 backdrop-blur-md`}
    onClick={(event) => {
      if (event.target === event.currentTarget) onClose();
    }}
  >
    {children}
  </div>
);

/* ============ QR DISPLAY ============ */
const QrDisplay = ({
  id,
  size,
  value,
  fetching,
  emptyText = "QR code not available",
  emptyClass = "mb-3 flex h-40 w-40 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-sm text-slate-400",
  wrapperClass = "mb-3 rounded-xl bg-white p-3",
}) => {
  if (fetching) return <div className={emptyClass}>Loading QR...</div>;
  if (!value) return <div className={emptyClass}>{emptyText}</div>;
  return (
    <div className={wrapperClass}>
      <QRCodeCanvas id={id} value={value} size={size} level="H" includeMargin />
    </div>
  );
};

/* ============ MAIN COMPONENT ============ */
const Mini = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, isVerified, loading } = useSelector((s) => s.profile || {});
  const { products = [] } = useSelector((s) => s.product || {});
  const { buttons: contactButtons = [] } = useSelector(
    (s) => s.contactButtons || {},
  );
  const { gallery = [] } = useSelector((s) => s.gallery || {});
  const { boundQR, fetching: qrFetching } = useSelector((s) => s.qr || {});
  const {
    submitting: inquirySubmitting = false,
    submitError: inquirySubmitError = null,
    submitSuccess: inquirySubmitSuccess = false,
  } = useSelector((s) => s.inquiry || {});

  const [profileChecked, setProfileChecked] = useState(false);
  const [activeTheme, setActiveTheme] = useState("sunset");
  const [activeLayout, setActiveLayout] = useState("modern-business");
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);
  const [standeeCode, setStandeeCode] = useState("");
  const [standeeActivated, setStandeeActivated] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(true);
  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewData, setReviewData] = useState({ name: "", review: "" });
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("share");

  /* -------- FETCH PROFILE -------- */
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

        const savedLayout = PROFILE_LAYOUTS.some(
          (layout) => layout.id === savedProfile.activeLayout,
        )
          ? savedProfile.activeLayout
          : "modern-business";

        setActiveLayout(savedLayout);
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

  /* -------- FETCH OTHER DATA -------- */
  useEffect(() => {
    dispatch(fetchMyBoundQR());
    dispatch(getMyProducts());
    dispatch(getMyGallery());
    dispatch(resetContactButtons());
    dispatch(fetchContactButtons());
  }, [dispatch]);

  /* -------- QR TARGET URL -------- */
  const qrTargetUrl = useMemo(() => {
    return getPublicQRUrl(boundQR?.qrPath);
  }, [boundQR?.qrPath]);

  const profileData = profile || {};
  const productList = Array.isArray(products) ? products : [];

  /* -------- VISIBLE BUTTONS -------- */
  const visibleButtons = useMemo(() => {
    const slice = Array.isArray(contactButtons) ? contactButtons : [];
    const fromProfile = Array.isArray(profileData.contactButtons)
      ? profileData.contactButtons
      : [];

    return [...(slice.length > 0 ? slice : fromProfile)]
      .filter(
        (button) =>
          button && button.enabled !== false && button.enabled !== "false",
      )
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
  }, [contactButtons, profileData.contactButtons]);

  /* -------- BUSINESS INFO -------- */
  const businessInfo = {
    name: [profileData.firstName, profileData.lastName]
      .filter(Boolean)
      .join(" "),
    role: profileData.jobTitle || "",
    location:
      [profileData.city, profileData.state, profileData.pincode]
        .filter(Boolean)
        .join(", ") || "Location not added",
    about:
      profileData.bio ||
      profileData.headline ||
      "Welcome to my business! Contact me for business inquiries.",
    phone: profileData.phone || "",
    whatsapp: profileData.whatsapp || "",
    email: profileData.email || "",
    website: profileData.website || profileData.websiteUrl || "",
    address:
      [
        profileData.shopUnit,
        profileData.area,
        profileData.city,
        profileData.state,
        profileData.pincode,
      ]
        .filter(Boolean)
        .join(", ") || "Address not added",
    logo: profileData.logo || null,
    avatar: profileData.avatar || null,
    banner: profileData.banner || null,
    industry: profileData.industry || "",
    businessName: profileData.businessName || "My Business",
    businessHours: profileData.businessHours || "",
    upiId: profileData.upiId || "",
    isVerified: isVerified === true,
  };

  /* -------- GALLERY -------- */
  const galleryImages = useMemo(() => {
    const fromApi = normalizeGalleryImages(gallery);
    if (fromApi.length) return fromApi;

    return normalizeGalleryImages(
      profileData.gallery ||
        profileData.galleryImages ||
        profileData.businessGallery ||
        profileData.images,
    );
  }, [
    gallery,
    profileData.gallery,
    profileData.galleryImages,
    profileData.businessGallery,
    profileData.images,
  ]);

  const activeThemeData = themes.find((theme) => theme.id === activeTheme);
  const activeLayoutData = PROFILE_LAYOUTS.find((l) => l.id === activeLayout);
  const isFlatLayout = FLAT_LAYOUTS.includes(activeLayout);
  const layoutFamily = LAYOUT_FAMILY[activeLayout] || "business";

  const socialLinks = (profileData.socialCards || []).filter(
    (social) => social?.url,
  );

  /* -------- HANDLERS -------- */
  const handleActivateStandee = () => {
    if (standeeCode.trim()) setStandeeActivated(true);
  };

  const handleWhatsApp = () => {
    const number = businessInfo.whatsapp || businessInfo.phone;
    if (!number) return alert("WhatsApp number is not available.");
    window.open(
      `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi, I'm interested in your business.",
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCall = () => {
    if (!businessInfo.phone) return alert("Phone number is not available.");
    window.location.href = `tel:${businessInfo.phone.replace(/\s/g, "")}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: businessInfo.name || businessInfo.businessName,
      text: `Check out ${
        businessInfo.name || businessInfo.businessName
      }'s business`,
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // user cancelled
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy the link. Please copy it from the address bar.");
    }
  };

  const handleDownloadQR = (canvasId = "bound-qr-canvas") => {
    if (!qrTargetUrl) return alert("Bound QR code is not available.");
    const canvas = document.getElementById(canvasId);
    if (!canvas) return alert("QR code is not ready yet.");

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "bio-website-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSaveContact = () => {
    const esc = (value = "") =>
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

    if (displayName) lines.push(`FN:${esc(displayName)}`);
    if (profileData.businessName?.trim())
      lines.push(`ORG:${esc(profileData.businessName)}`);
    if (profileData.jobTitle?.trim())
      lines.push(`TITLE:${esc(profileData.jobTitle)}`);
    if (profileData.phone?.trim())
      lines.push(`TEL;TYPE=CELL:${esc(profileData.phone)}`);
    if (profileData.email?.trim())
      lines.push(`EMAIL:${esc(profileData.email)}`);

    const website =
      profileData.website?.trim() || profileData.websiteUrl?.trim();
    if (website) {
      lines.push(
        `URL:${esc(
          /^https?:\/\//i.test(website) ? website : `https://${website}`,
        )}`,
      );
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

    if (address) lines.push(`ADR;TYPE=WORK:;;${esc(address)};;;;`);

    const note = profileData.bio?.trim() || profileData.headline?.trim();
    if (note) lines.push(`NOTE:${esc(note)}`);

    if (
      !displayName &&
      !profileData.phone?.trim() &&
      !profileData.email?.trim()
    ) {
      return alert(
        "Contact download karne ke liye pehle profile details add karein.",
      );
    }

    lines.push("END:VCARD");

    const blob = new Blob([`${lines.join("\r\n")}\r\n`], {
      type: "text/vcard;charset=utf-8",
    });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download =
      (displayName || "contact")
        .replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-")
        .trim() || "contact";
    anchor.download += ".vcf";

    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleContactClick = (type) => {
    if (type === "phone") return handleCall();

    if (type === "email") {
      if (businessInfo.email) {
        window.location.href = `mailto:${businessInfo.email}`;
      } else {
        alert("Email address is not available.");
      }
      return;
    }

    if (type === "website") {
      if (!businessInfo.website) return;
      window.open(
        /^https?:\/\//i.test(businessInfo.website)
          ? businessInfo.website
          : `https://${businessInfo.website}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (type === "address") {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(
          businessInfo.address,
        )}`,
        "_blank",
        "noopener,noreferrer",
      );
      return;
    }

    if (type === "upi") {
      if (!profileData.upiId?.trim()) return alert("UPI ID is not available.");
      setShowPayment(true);
    }
  };

  const handleConfiguredButton = (button) => {
    if (!button) return;

    switch (button.actionType) {
      case "call":
        return handleCall();
      case "whatsapp":
        return handleWhatsApp();
      case "email":
        if (businessInfo.email) {
          window.location.href = `mailto:${businessInfo.email}`;
        } else {
          alert("Email address is not available.");
        }
        return;
      case "directions":
        return window.open(
          profileData.mapLink ||
            `https://maps.google.com/?q=${encodeURIComponent(
              businessInfo.address,
            )}`,
          "_blank",
          "noopener,noreferrer",
        );
      case "share":
        return handleShare();
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
        return handleContactClick("upi");
      default:
        return;
    }
  };

  const handleFormSubmit = async (event) => {
    event.preventDefault();
    const subdomain = profileData.subdomain?.trim() || "";
    if (!subdomain)
      return alert("This profile does not have a subdomain configured.");

    const payload = {
      name: formData.name.trim(),
      phone: formData.phone.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
      subdomain,
    };

    try {
      await dispatch(createInquiry(payload)).unwrap();
      setFormSubmitted(true);
      setFormData({ name: "", phone: "", email: "", message: "" });
      window.setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
    }
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault();
    setReviewSubmitted(true);

    window.setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);
      setReviewData({ name: "", review: "" });
      setReviewRating(5);
    }, 2000);
  };

  if (loading || !profileChecked || !profile) return null;

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-slate-800">
      <style>{`
        .mini-profile-preview {
          --layout-radius: 22px;
          --layout-gap: 24px;
          --layout-padding: 24px;
          border-radius: var(--layout-radius);
          transition: border-radius 200ms ease, background 200ms ease;
        }
        .mini-profile-preview .mini-profile-hero { height: 280px; transition: height 200ms ease; }
        .mini-profile-preview .mini-profile-header { position: relative; transition: background 200ms ease; }
        .mini-profile-preview .mini-profile-main {
          display: grid;
          grid-template-columns: minmax(0, 1fr);
          gap: var(--layout-gap);
          padding: 0 var(--layout-padding) 40px;
          transition: gap 200ms ease, padding 200ms ease;
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
          border-radius: 18px;
          transition: border-radius 200ms ease, border-color 200ms ease, background 200ms ease;
        }
        .mini-profile-preview[data-flat-layout="true"] .mini-profile-left,
        .mini-profile-preview[data-flat-layout="true"] .mini-profile-right {
          display: contents;
        }

        /* CARD family */
        .mini-profile-preview[data-layout-family="card"] .mini-profile-hero { height: 90px; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-header {
          text-align: center;
          background: linear-gradient(180deg, #0e2338, #0b1b30);
          padding-top: 8px;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-identity-row {
          margin-top: -50px !important;
          flex-direction: column !important;
          align-items: center !important;
          text-align: center;
          gap: 12px !important;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-identity-row > div:last-child {
          text-align: center;
          padding-bottom: 4px;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-identity { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-actions {
          flex-direction: column;
          align-items: stretch;
          padding-inline: 8px;
          gap: 8px !important;
        }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-actions > button { width: 100%; justify-content: center; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-socials { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="card"] .mini-profile-main { padding: 0 16px 40px; }

        /* SHOWCASE family */
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-hero { height: 400px; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-header {
          text-align: center;
          background: linear-gradient(180deg, rgba(11,27,48,0) 0%, #0b1b30 70%);
        }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-identity-row {
          flex-direction: column !important;
          align-items: center !important;
          margin-top: -80px !important;
          gap: 16px !important;
        }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-identity-row > div:last-child {
          text-align: center;
          padding-bottom: 4px;
        }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-identity { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-actions {
          justify-content: center !important;
          padding-inline: 8px;
        }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-socials { justify-content: center !important; }
        .mini-profile-preview[data-layout-family="showcase"] .mini-profile-panel {
          border-radius: 24px;
          border-color: rgba(34, 211, 238, 0.25);
        }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] .mini-profile-panel[data-panel="gallery"] { order: -20; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] .mini-profile-panel[data-panel="about"] { order: -10; }
        .mini-profile-preview[data-profile-layout="agency-pro"] .mini-profile-panel[data-panel="about"] { order: -20; }
        .mini-profile-preview[data-profile-layout="agency-pro"] .mini-profile-panel[data-panel="social"] { order: -10; }

        /* UTILITY family */
        .mini-profile-preview[data-layout-family="utility"] .mini-profile-hero { height: 180px; }
        .mini-profile-preview[data-profile-layout="storefront"] .mini-profile-hero { height: 220px; }
        .mini-profile-preview[data-profile-layout="storefront"] .mini-profile-panel[data-panel="products"] { order: -30; }
        .mini-profile-preview[data-profile-layout="storefront"] .mini-profile-panel {
          border-color: rgba(34, 211, 238, 0.35);
        }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-hero { height: 140px; }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-panel[data-panel="about"] { order: -20; }
        .mini-profile-preview[data-profile-layout="freelancer-pro"] .mini-profile-panel[data-panel="inquiry"] { order: -10; }
        .mini-profile-preview[data-profile-layout="service-pro"] .mini-profile-hero { height: 180px; }
        .mini-profile-preview[data-profile-layout="service-pro"] .mini-profile-panel[data-panel="inquiry"] { order: -30; }
        .mini-profile-preview[data-profile-layout="service-pro"] .mini-profile-panel[data-panel="contact"] { order: -20; }

        /* BUSINESS family */
        .mini-profile-preview[data-profile-layout="corporate-executive"] {
          --layout-radius: 8px;
          --layout-gap: 16px;
        }
        .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-hero { height: 200px; }
        .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-header {
          background: linear-gradient(180deg, #102b49, #0b1b30);
        }
        .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-panel { border-radius: 8px; }

        /* Per-layout overrides */
        .mini-profile-preview[data-profile-layout="minimal-card"] {
          --layout-radius: 14px;
          --layout-gap: 14px;
          --layout-padding: 16px;
        }
        .mini-profile-preview[data-profile-layout="minimal-card"] .mini-profile-panel { border-radius: 12px; }
        .mini-profile-preview[data-profile-layout="creator-portfolio"] {
          --layout-radius: 26px;
          --layout-gap: 22px;
        }
        .mini-profile-preview[data-profile-layout="elegant-profile"] {
          --layout-radius: 28px;
          background: linear-gradient(160deg, #132942, #0b1b30 55%);
        }
        .mini-profile-preview[data-profile-layout="elegant-profile"] .mini-profile-hero { height: 100px; }
        .mini-profile-preview[data-profile-layout="agency-pro"] {
          --layout-radius: 12px;
          --layout-gap: 24px;
        }
        .mini-profile-preview[data-profile-layout="digital-card"] {
          --layout-radius: 30px;
          --layout-gap: 12px;
          --layout-padding: 12px;
        }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-hero { height: 90px; }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-panel[data-panel="qr"] { order: -30; }
        .mini-profile-preview[data-profile-layout="digital-card"] .mini-profile-panel[data-panel="contact"] { order: -20; }

        @media (min-width: 1024px) {
          .mini-profile-preview .mini-profile-main { grid-template-columns: minmax(0, 4fr) minmax(0, 8fr); }
          .mini-profile-preview[data-profile-layout="corporate-executive"] .mini-profile-main {
            grid-template-columns: minmax(0, 5fr) minmax(0, 7fr);
          }
          .mini-profile-preview[data-flat-layout="true"] .mini-profile-main {
            grid-template-columns: minmax(0, 1fr);
          }
        }
        @media (max-width: 640px) {
          .mini-profile-preview .mini-profile-hero { height: 200px; }
          .mini-profile-preview[data-layout-family="card"] .mini-profile-hero { height: 80px; }
          .mini-profile-preview[data-layout-family="showcase"] .mini-profile-hero { height: 260px; }
          .mini-profile-preview .mini-profile-main { padding-inline: 12px; }
        }
      `}</style>

      <main className="relative mx-auto w-full max-w-[1300px] px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        {/* DASHBOARD CONTROLS */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <ScanLine className="text-cyan-400" size={22} />
              <div>
                <h2 className="text-sm font-bold text-white">
                  Activate Standee
                </h2>
                <p className="text-xs text-slate-400">
                  Connect your physical card
                </p>
              </div>
              {standeeActivated ? (
                <span className="ml-auto text-xs text-emerald-400">Active</span>
              ) : (
                <ShieldCheck className="ml-auto text-amber-400" size={18} />
              )}
            </div>
            <div className="flex gap-2">
              <input
                value={standeeCode}
                onChange={(e) => setStandeeCode(e.target.value.toUpperCase())}
                disabled={standeeActivated}
                placeholder="Enter activation code"
                className="min-w-0 flex-1 rounded-lg border border-[#29435f] bg-[#071326] px-3 py-2 text-sm text-white outline-none focus:border-cyan-400"
              />
              <button
                type="button"
                onClick={handleActivateStandee}
                disabled={standeeActivated || !standeeCode.trim()}
                className="rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-[#0b1b30] disabled:opacity-50"
              >
                {standeeActivated ? "Done" : "Activate"}
              </button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <Palette className="text-cyan-400" size={22} />
              <div>
                <h2 className="text-sm font-bold text-white">
                  Appearance Theme
                </h2>
                <p className="text-xs text-slate-400">
                  Choose your profile vibe
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  title={theme.name}
                  aria-label={theme.name}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`h-8 w-8 rounded-full ${
                    activeTheme === theme.id
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0b1b30]"
                      : ""
                  }`}
                  style={{
                    background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => setIsPreviewMode((v) => !v)}
                className="ml-auto flex items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-xs font-bold text-cyan-300"
              >
                <MonitorSmartphone size={15} />
                {isPreviewMode ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Selected theme: {activeThemeData?.name || "Custom theme"}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="text-xs text-slate-400">Profile layout:</span>
              <span className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                {activeLayoutData?.name || "Modern Business"}
              </span>
              <button
                type="button"
                onClick={() => navigate("/profile-layouts")}
                className="ml-auto rounded-lg border border-[#29435f] bg-[#132942] px-3 py-1.5 text-xs font-bold text-white transition hover:border-cyan-400/50 hover:text-cyan-300"
              >
                Change Layout
              </button>
            </div>
          </div>
        </div>

        {/* PROFILE PREVIEW */}
        {isPreviewMode && (
          <section className="pb-10">
            <div className="w-full overflow-hidden rounded-[24px] border border-[#45414a] bg-[#17171c] p-1.5 shadow-2xl sm:rounded-[28px] sm:p-3">
              <div
                data-profile-layout={activeLayout}
                data-layout-family={layoutFamily}
                data-flat-layout={isFlatLayout ? "true" : undefined}
                className="mini-profile-preview overflow-hidden border border-[#34343c] bg-[#0b1b30]"
              >
                {/* HERO */}
                <div className="mini-profile-hero relative w-full">
                  <img
                    src={businessInfo.banner || bannerImages[0]}
                    alt="Profile banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30] via-[#0b1b30]/40 to-transparent" />
                  <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
                    <button
                      type="button"
                      onClick={() => {
                        setQrModalTab("share");
                        setShowQrModal(true);
                      }}
                      title="Share profile"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#071326]/80 text-white backdrop-blur-sm"
                    >
                      <Share2 size={19} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setQrModalTab("myqr");
                        setShowQrModal(true);
                      }}
                      title="View bound QR code"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-[#071326]"
                    >
                      <ScanLine size={20} />
                    </button>
                  </div>
                </div>

                {/* PROFILE HEADER */}
                <div className="mini-profile-header px-4 sm:px-8 md:px-10">
                  <div className="mini-profile-identity-row -mt-16 flex flex-col items-center gap-4 sm:-mt-20 sm:gap-5 md:flex-row md:items-end">
                    <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
                      <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#0b1b30] bg-[#132942] shadow-2xl">
                        {businessInfo.avatar ? (
                          <img
                            src={businessInfo.avatar}
                            alt={businessInfo.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-slate-500">
                            <UserPlus size={40} />
                          </div>
                        )}
                      </div>
                      {businessInfo.logo && (
                        <div
                          title={businessInfo.businessName || "Business Logo"}
                          className="absolute -bottom-1 -right-1 z-10 flex h-10 w-10 items-center justify-center overflow-hidden rounded-full border-4 border-[#0b1b30] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:h-11 sm:w-11"
                        >
                          <img
                            src={businessInfo.logo}
                            alt={businessInfo.businessName || "Business logo"}
                            className="h-full w-full object-contain"
                            onError={(e) => {
                              e.currentTarget.parentElement.style.display =
                                "none";
                            }}
                          />
                        </div>
                      )}
                    </div>
                    <div className="pb-2 text-center md:text-left">
                      <div className="mini-profile-identity flex flex-wrap items-center justify-center gap-2 md:justify-start">
                        <h1 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                          {businessInfo.name || "Your Name"}
                        </h1>
                        {businessInfo.isVerified && (
                          <CheckCircle2 size={22} className="text-cyan-400" />
                        )}
                      </div>
                      <p className="mt-1 font-semibold text-cyan-400">
                        {businessInfo.role || "Business Professional"}
                      </p>
                      <p className="text-sm text-slate-300">
                        {businessInfo.businessName}
                      </p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400 md:justify-start">
                        <MapPin size={12} />
                        {businessInfo.location}
                      </p>
                    </div>
                  </div>

                  {/* DYNAMIC BUTTONS */}
                  {visibleButtons.length > 0 ? (
                    <div className="mini-profile-actions flex flex-wrap justify-center gap-2 py-5 md:justify-start">
                      {visibleButtons.map((button, index) => {
                        const Icon =
                          BUTTON_ICON_MAP[button.actionType] || FaLink;
                        const style =
                          BUTTON_STYLE_MAP[button.actionType] ||
                          BUTTON_STYLE_MAP.customLink;
                        const isSave = button.actionType === "saveContact";
                        const FinalIcon = isSave && saved ? Check : Icon;
                        const label =
                          isSave && saved ? "Contact Saved" : button.label;
                        return (
                          <button
                            key={
                              button.id ||
                              button.buttonId ||
                              button._id ||
                              index
                            }
                            type="button"
                            onClick={() => handleConfiguredButton(button)}
                            className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${style.bg} ${style.text}`}
                          >
                            <FinalIcon size={16} />
                            {label}
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <div className="py-5 text-center text-xs italic text-slate-500 md:text-left">
                      No action buttons enabled. Toggle them in{" "}
                      <span className="font-semibold text-cyan-400">
                        Contact Buttons
                      </span>{" "}
                      settings.
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
                            className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 hover:text-cyan-300"
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
                    <div
                      data-panel="contact"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-5"
                    >
                      <h3 className="mb-4 font-bold text-white">
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
                            text:
                              businessInfo.whatsapp || "WhatsApp not provided",
                          },
                          {
                            Icon: Mail,
                            text: businessInfo.email || "Email not provided",
                            br: true,
                          },
                          {
                            Icon: Globe,
                            text:
                              businessInfo.website || "Website not provided",
                            br: true,
                          },
                          { Icon: MapPin, text: businessInfo.address },
                          {
                            Icon: Clock,
                            text:
                              businessInfo.businessHours ||
                              "Hours not provided",
                          },
                        ].map(({ Icon, text, br }, i) => (
                          <p
                            key={i}
                            className={`flex gap-3 text-white ${br ? "break-all" : ""}`}
                          >
                            <Icon
                              size={16}
                              className="shrink-0 text-cyan-400"
                            />
                            {text}
                          </p>
                        ))}
                      </div>
                    </div>

                    <div
                      data-panel="qr"
                      className="mini-profile-panel flex flex-col items-center rounded-2xl border border-[#29435f] bg-[#132942] p-5 text-center"
                    >
                      <h3 className="mb-3 text-base font-bold text-white">
                        Scan QR Code
                      </h3>
                      <QrDisplay
                        id="bound-qr-canvas"
                        size={160}
                        value={qrTargetUrl}
                        fetching={qrFetching}
                      />
                      <p className="mb-3 text-xs text-slate-400">
                        Scan to visit your profile
                      </p>
                      <button
                        type="button"
                        onClick={() => handleDownloadQR("bound-qr-canvas")}
                        disabled={!qrTargetUrl || qrFetching}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-2 text-sm font-bold text-cyan-400 disabled:opacity-50"
                      >
                        <Download size={16} />
                        Download QR
                      </button>
                    </div>

                    <div
                      data-panel="social"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-4"
                    >
                      <div className="mb-3 flex items-center justify-between">
                        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                          <span className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-400/10 text-cyan-400">
                            <FaLink size={11} />
                          </span>
                          Social Links
                        </h3>
                        {socialLinks.length > 0 && (
                          <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2 py-0.5 text-[10px] font-bold text-cyan-300">
                            {socialLinks.length} linked
                          </span>
                        )}
                      </div>
                      {socialLinks.length > 0 ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          {socialLinks.map((social, index) => {
                            const SocialIcon = getSocialIcon(social.platform);
                            const brand = getSocialBrand(social.platform);
                            return (
                              <a
                                key={
                                  social._id || `${social.platform}-${index}`
                                }
                                href={social.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                title={`Open ${brand.label}`}
                                className="group relative flex items-center gap-2.5 overflow-hidden rounded-lg border border-[#29435f] bg-[#0b1b30] px-2.5 py-2 transition-all duration-300 hover:-translate-y-0.5"
                                onMouseEnter={(e) => {
                                  e.currentTarget.style.borderColor = `${brand.color}66`;
                                  e.currentTarget.style.boxShadow = `0 6px 18px -6px ${brand.color}55`;
                                }}
                                onMouseLeave={(e) => {
                                  e.currentTarget.style.borderColor = "";
                                  e.currentTarget.style.boxShadow = "";
                                }}
                              >
                                <div
                                  className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
                                  style={{ background: brand.color }}
                                />
                                <div
                                  className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white shadow-md transition-transform duration-300 group-hover:scale-110"
                                  style={{
                                    background: `linear-gradient(135deg, ${brand.color}, ${brand.color}bb)`,
                                  }}
                                >
                                  <SocialIcon size={14} />
                                </div>
                                <span className="relative flex-1 truncate text-[11.5px] font-semibold text-slate-200 transition-colors duration-300 group-hover:text-white">
                                  {brand.label}
                                </span>
                              </a>
                            );
                          })}
                        </div>
                      ) : (
                        <div className="rounded-lg border border-dashed border-[#29435f] bg-[#0b1b30]/40 py-5 text-center">
                          <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/[0.04] text-slate-500">
                            <FaLink size={14} />
                          </div>
                          <p className="text-[11px] font-medium text-slate-400">
                            No social links added.
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      data-panel="reviews"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-5"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">
                          Reviews
                        </h3>
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-400"
                        >
                          Write Review
                        </button>
                      </div>
                      <p className="text-sm text-slate-400">
                        Be the first to share your experience with this
                        business.
                      </p>
                    </div>
                  </div>

                  {/* RIGHT */}
                  <div className="mini-profile-right">
                    <div
                      data-panel="about"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6"
                    >
                      <h3 className="mb-3 text-lg font-bold text-white">
                        About Me
                      </h3>
                      <p className="text-sm leading-7 text-slate-300">
                        {businessInfo.about}
                      </p>
                      <div className="mt-4 flex flex-wrap gap-2">
                        {businessInfo.industry && (
                          <span className="rounded-md border border-[#29435f] bg-[#0b1b30] px-3 py-1 text-xs text-cyan-300">
                            {businessInfo.industry}
                          </span>
                        )}
                        <span className="rounded-md border border-[#29435f] bg-[#0b1b30] px-3 py-1 text-xs text-cyan-300">
                          {businessInfo.businessName}
                        </span>
                      </div>
                    </div>

                    {productList.length > 0 && (
                      <div
                        data-panel="products"
                        className="mini-profile-panel overflow-hidden rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6"
                      >
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <ShoppingBag size={18} className="text-cyan-400" />
                            Featured Products
                          </h3>
                          <span className="text-xs text-slate-400">
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
                              (i) => i?.url,
                            )?.url;
                            return (
                              <SwiperSlide key={product._id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedProduct(product)}
                                  className="group w-full overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30] text-left"
                                >
                                  <div className="h-36 bg-[#132942]">
                                    {cover ? (
                                      <img
                                        src={cover}
                                        alt={product.name}
                                        className="h-full w-full object-cover"
                                      />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-slate-500">
                                        <ImageIcon size={30} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <h4 className="truncate text-sm font-bold text-white">
                                      {product.name}
                                    </h4>
                                    <p className="mt-1 truncate text-xs text-slate-400">
                                      {product.description}
                                    </p>
                                    <p className="mt-3 font-extrabold text-cyan-400">
                                      ₹
                                      {Number(
                                        product.price || 0,
                                      ).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </button>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      </div>
                    )}

                    <div
                      data-panel="gallery"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">
                          Gallery
                        </h3>
                        <span className="text-sm text-cyan-400">
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
                        <div className="rounded-xl border border-dashed border-[#29435f] py-8 text-center">
                          <ImageIcon
                            size={32}
                            className="mx-auto mb-2 text-slate-500"
                          />
                          <p className="text-sm text-slate-400">
                            No gallery images added yet.
                          </p>
                        </div>
                      )}
                    </div>

                    <div
                      data-panel="inquiry"
                      className="mini-profile-panel rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6"
                    >
                      <h3 className="mb-4 text-lg font-bold text-white">
                        Send an Inquiry
                      </h3>
                      {formSubmitted || inquirySubmitSuccess ? (
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-300">
                          Thank you! Your inquiry has been submitted
                          successfully.
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-3">
                          {inquirySubmitError && (
                            <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm font-medium text-red-300">
                              {inquirySubmitError}
                            </div>
                          )}
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
                              value={formData[key]}
                              onChange={(e) =>
                                setFormData({
                                  ...formData,
                                  [key]: e.target.value,
                                })
                              }
                              placeholder={placeholder}
                              disabled={inquirySubmitting}
                              className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                            />
                          ))}
                          <textarea
                            rows={3}
                            required
                            value={formData.message}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                message: e.target.value,
                              })
                            }
                            placeholder="Message"
                            disabled={inquirySubmitting}
                            className="w-full resize-none rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
                          />
                          <button
                            type="submit"
                            disabled={inquirySubmitting}
                            className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-60"
                          >
                            {inquirySubmitting ? (
                              <>
                                <span className="h-4 w-4 animate-spin rounded-full border-2 border-[#0b1b30]/30 border-t-[#0b1b30]" />
                                Submitting...
                              </>
                            ) : (
                              <>
                                <Send size={16} />
                                Submit Inquiry
                              </>
                            )}
                          </button>
                        </form>
                      )}
                    </div>
                  </div>
                </div>

                {/* FOOTER */}
                <footer className="border-t border-[#29435f] bg-[#0b1b30] py-6 text-center">
                  <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} {businessInfo.name}. All rights
                    reserved.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Powered by{" "}
                    <span className="font-bold text-cyan-400">BioWebsite</span>
                  </p>
                </footer>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* QR MODAL */}
      {showQrModal && (
        <Overlay higher darker onClose={() => setShowQrModal(false)}>
          <div className="relative w-full max-w-md rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#29435f] bg-[#132942] text-slate-300"
            >
              <X size={18} />
            </button>
            <h2 className="mb-5 pr-10 text-xl font-bold text-white">
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
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${
                    qrModalTab === tab.id
                      ? "border-cyan-400 bg-cyan-400/10 text-cyan-300"
                      : "border-[#29435f] bg-[#132942] text-slate-400"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
            {qrModalTab === "share" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={handleShare}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 font-bold text-[#0b1b30]"
                >
                  <Share2 size={17} />
                  Share Profile
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#29435f] bg-[#132942] py-3 font-semibold text-white"
                >
                  <Copy size={17} />
                  {copied ? "Link Copied!" : "Copy Profile Link"}
                </button>
              </div>
            )}
            {qrModalTab === "myqr" && (
              <div className="flex flex-col items-center">
                <QrDisplay
                  id="bound-qr-modal-canvas"
                  size={220}
                  value={qrTargetUrl}
                  fetching={qrFetching}
                  emptyText="Bound QR code is not available."
                  emptyClass="mb-5 py-10 text-sm text-slate-400"
                  wrapperClass="mb-5 rounded-xl bg-white p-4"
                />
                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-modal-canvas")}
                  disabled={!qrTargetUrl || qrFetching}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-3 text-sm font-bold text-cyan-400 disabled:opacity-50"
                >
                  <Download size={16} />
                  Download QR Code
                </button>
              </div>
            )}
            {qrModalTab === "poster" && (
              <div className="flex flex-col items-center rounded-xl border border-[#29435f] bg-[#132942] p-5 text-center">
                <FileImage size={32} className="mb-3 text-cyan-400" />
                <h3 className="mb-2 text-lg font-bold text-white">
                  Profile QR Poster
                </h3>
                <p className="mb-4 text-sm text-slate-400">
                  Scan this QR code to open your profile.
                </p>
                <QrDisplay
                  id="bound-qr-poster-canvas"
                  size={180}
                  value={qrTargetUrl}
                  fetching={qrFetching}
                  emptyText="Bound QR code is not available."
                  emptyClass="text-sm text-slate-400"
                  wrapperClass="rounded-xl bg-white p-3"
                />
                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-poster-canvas")}
                  disabled={!qrTargetUrl || qrFetching}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0b1b30] disabled:opacity-50"
                >
                  <Download size={16} />
                  Download Poster QR
                </button>
              </div>
            )}
          </div>
        </Overlay>
      )}

      {/* PRODUCT MODAL */}
      {selectedProduct &&
        (() => {
          const imgs = Array.isArray(selectedProduct.images)
            ? selectedProduct.images.filter((i) => i?.url)
            : [];
          return (
            <Overlay onClose={() => setSelectedProduct(null)}>
              <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-[#45414a] bg-[#17171c]">
                <button
                  type="button"
                  onClick={() => setSelectedProduct(null)}
                  aria-label="Close product details"
                  className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-[#22222a]/90 text-white"
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
                  <h3 className="text-2xl font-bold text-white">
                    {selectedProduct.name}
                  </h3>
                  <p className="mt-2 text-cyan-400">
                    ₹
                    {Number(selectedProduct.price || 0).toLocaleString("en-IN")}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-slate-300">
                    {selectedProduct.description}
                  </p>
                  <div className="mt-5 flex flex-wrap gap-3">
                    <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-sm font-bold text-emerald-300">
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
                          handleContactClick("upi");
                        }}
                        className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-300"
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
                          handleWhatsApp();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#062c25]"
                      >
                        <FaWhatsapp size={16} />
                        Enquire on WhatsApp
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </Overlay>
          );
        })()}

      {/* GALLERY MODAL */}
      {selectedGalleryImage && (
        <Overlay darker onClose={() => setSelectedGalleryImage(null)}>
          <div className="relative w-full max-w-3xl overflow-hidden rounded-[24px] border border-[#45414a] bg-[#17171c]">
            <button
              type="button"
              onClick={() => setSelectedGalleryImage(null)}
              aria-label="Close gallery image"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl bg-[#22222a]/90 text-white"
            >
              <X size={18} />
            </button>
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
        </Overlay>
      )}

      {/* REVIEW MODAL */}
      {showReviewModal && (
        <Overlay onClose={() => setShowReviewModal(false)}>
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[26px] border border-cyan-400/20 bg-[#0b1b30] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setShowReviewModal(false)}
              aria-label="Close review modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300"
            >
              <X size={18} />
            </button>
            {reviewSubmitted ? (
              <div className="py-10 text-center">
                <CheckCircle2 size={50} className="mx-auto text-cyan-400" />
                <h3 className="mt-5 text-xl font-bold text-white">
                  Thank You!
                </h3>
                <p className="mt-2 text-slate-300">
                  Thank you for your review!
                </p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-5 flex items-center gap-3">
                  <Star size={24} className="text-cyan-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">
                      Write a Review
                    </h3>
                    <p className="text-sm text-slate-400">
                      Share your experience with this business.
                    </p>
                  </div>
                </div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Your Name
                </label>
                <input
                  required
                  value={reviewData.name}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, name: e.target.value })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
                <p className="mb-3 mt-5 text-sm font-semibold text-slate-200">
                  Your Rating
                </p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <button
                      key={n}
                      type="button"
                      onClick={() => setReviewRating(n)}
                      aria-label={`Rate ${n} out of 5`}
                    >
                      <Star
                        size={28}
                        className={
                          n <= reviewRating
                            ? "fill-cyan-400 text-cyan-400"
                            : "text-slate-600"
                        }
                      />
                    </button>
                  ))}
                </div>
                <label className="mb-2 mt-5 block text-sm font-semibold text-slate-200">
                  Your Review
                </label>
                <textarea
                  required
                  rows={4}
                  value={reviewData.review}
                  onChange={(e) =>
                    setReviewData({ ...reviewData, review: e.target.value })
                  }
                  placeholder="Tell us about your experience..."
                  className="w-full resize-y rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3.5 font-bold text-[#0b1b30]"
                >
                  <Send size={17} />
                  Submit Review
                </button>
              </form>
            )}
          </div>
        </Overlay>
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

export default Mini;
