import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import api from "../redux/api";
import { fetchMyProfile } from "../redux/slice/profileSlice";
import { fetchContactButtons } from "../redux/slice/contactButtonsSlice";
import { getMyProducts } from "../redux/slice/productSlice";
import { getMyGallery } from "../redux/slice/gallerySlice";
import { fetchMyBoundQR } from "../redux/slice/qrSlice";

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
  Sun,
  Moon,
  Gem,
  Crown,
  Leaf,
  MonitorSmartphone,
  IndianRupee,
  Image as ImageIcon,
  Clock,
  Download,
  Copy,
  FileImage,
} from "lucide-react";

const themes = [
  { id: "executive", name: "Executive Royal", colors: ["#1e3a8a", "#7c3aed"], icon: Crown },
  { id: "emerald", name: "Emerald Luxe", colors: ["#10b981", "#14b8a6"], icon: Leaf },
  { id: "rose", name: "Rose Gold & Champagne", colors: ["#f43f5e", "#fb923c"], icon: Gem },
  { id: "obsidian", name: "Obsidian Noir & Platinum", colors: ["#334155", "#94a3b8"], icon: Moon },
  { id: "sunset", name: "Sunset Amber & Coral", colors: ["#f59e0b", "#f97316"], icon: Sun },
];

const bannerImages = [
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  "https://images.unsplash.com/photo-1497366811353-6870744d04b2?w=1200",
  "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=1200",
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
    firstName || lastName || businessName || profile.phone?.trim() || profile.email?.trim(),
  );
};

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
      const caption = item.caption?.trim() || item.title?.trim() || "";
      return {
        url: url.trim(),
        alt: item.alt?.trim() || caption || `Gallery image ${index + 1}`,
        caption,
      };
    })
    .filter(Boolean);
};

const Mini = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, isVerified, loading } = useSelector((state) => state.profile || {});
  const { products = [] } = useSelector((state) => state.product || {});
  const { buttons: contactButtons = [], loaded: contactButtonsLoaded } = useSelector(
    (state) => state.contactButtons || {},
  );
  const { gallery = [] } = useSelector((state) => state.gallery || {});
  const { boundQR, fetching: qrFetching } = useSelector((state) => state.qr || {});

  const [profileChecked, setProfileChecked] = useState(false);
  const [activeTheme, setActiveTheme] = useState("sunset");
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

  const [formData, setFormData] = useState({ name: "", phone: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("share");

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
    return () => { mounted = false; };
  }, [dispatch, navigate]);

  useEffect(() => { dispatch(fetchMyBoundQR()); }, [dispatch]);
  useEffect(() => { dispatch(getMyProducts()); }, [dispatch]);
  useEffect(() => { dispatch(getMyGallery()); }, [dispatch]);
  useEffect(() => {
    if (!contactButtonsLoaded) dispatch(fetchContactButtons());
  }, [dispatch, contactButtonsLoaded]);

  const qrTargetUrl = useMemo(() => {
    if (!boundQR?.qrPath) return "";
    const baseURL = (api.defaults.baseURL || window.location.origin)
      .replace(/\/api\/?$/, "")
      .replace(/\/$/, "");
    const qrPath = boundQR.qrPath.startsWith("/") ? boundQR.qrPath : `/${boundQR.qrPath}`;
    return `${baseURL}${qrPath}`;
  }, [boundQR?.qrPath]);

  const profileData = profile || {};
  const productList = Array.isArray(products) ? products : [];
  const buttonSource = Array.isArray(profileData.contactButtons)
    ? profileData.contactButtons
    : contactButtons;
  const visibleButtons = [...buttonSource]
    .filter((button) => button.enabled)
    .sort((a, b) => a.order - b.order);

  const businessInfo = {
    name: [profileData.firstName, profileData.lastName].filter(Boolean).join(" "),
    role: profileData.jobTitle || "",
    location:
      [profileData.city, profileData.state, profileData.pincode].filter(Boolean).join(", ") ||
      "Location not added",
    about:
      profileData.bio ||
      profileData.headline ||
      "Welcome to my business! Contact me for business inquiries.",
    phone: profileData.phone || "",
    whatsapp: profileData.whatsapp || "",
    email: profileData.email || "",
    website: profileData.website || profileData.websiteUrl || "",
    address:
      [profileData.shopUnit, profileData.area, profileData.city, profileData.state, profileData.pincode]
        .filter(Boolean)
        .join(", ") || "Address not added",
    logo: profileData.logo || null,
    avatar: profileData.avatar || null,
    banner: profileData.banner || null,
    industry: profileData.industry || "",
    businessName: profileData.businessName || "My Business",
    headline: profileData.headline || "",
    businessHours: profileData.businessHours || "",
    mapLink: profileData.mapLink || "",
    upiId: profileData.upiId || "",
    isVerified: isVerified === true,
  };

  const galleryImages = useMemo(() => {
    const fromGalleryApi = normalizeGalleryImages(gallery);
    if (fromGalleryApi.length) return fromGalleryApi;
    const fromProfile = normalizeGalleryImages(
      profileData.gallery ||
      profileData.galleryImages ||
      profileData.businessGallery ||
      profileData.images,
    );
    if (fromProfile.length) return fromProfile;
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
    gallery,
    profileData.gallery,
    profileData.galleryImages,
    profileData.businessGallery,
    profileData.images,
    productList,
  ]);

  const currentTheme = {
    primary: "#22d3ee",
    secondary: "#3b82f6",
    background: "#0b1b30",
    surface: "#132942",
    text: "#f8fafc",
  };

  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  const handleActivateStandee = () => {
    if (!standeeCode.trim()) return;
    setStandeeActivated(true);
  };

  const handleWhatsApp = () => {
    const number = businessInfo.whatsapp || businessInfo.phone;
    if (!number) { alert("WhatsApp number is not available."); return; }
    window.open(
      `https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent(
        "Hi, I'm interested in your business.",
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const handleCall = () => {
    if (!businessInfo.phone) { alert("Phone number is not available."); return; }
    window.location.href = `tel:${businessInfo.phone.replace(/\s/g, "")}`;
  };

  const handleShare = async () => {
    const shareData = {
      title: businessInfo.name || businessInfo.businessName,
      text: `Check out ${businessInfo.name || businessInfo.businessName}'s business`,
      url: window.location.href,
    };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch { /* cancelled */ }
    } else { handleCopyLink(); }
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
    if (!qrTargetUrl) { alert("Bound QR code is not available."); return; }
    const canvas = document.getElementById(canvasId);
    if (!canvas) { alert("QR code is not ready yet."); return; }
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "bio-website-qr.png";
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  const handleSaveContact = () => {
    const escapeVCard = (value = "") =>
      String(value).trim().replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    const fullName = [profileData.firstName, profileData.lastName]
      .filter((value) => value?.trim())
      .join(" ")
      .trim();
    const displayName = fullName || profileData.businessName?.trim() || "";
    if (displayName) lines.push(`FN:${escapeVCard(displayName)}`);
    if (profileData.businessName?.trim()) lines.push(`ORG:${escapeVCard(profileData.businessName)}`);
    if (profileData.jobTitle?.trim()) lines.push(`TITLE:${escapeVCard(profileData.jobTitle)}`);
    if (profileData.phone?.trim()) lines.push(`TEL;TYPE=CELL:${escapeVCard(profileData.phone)}`);
    if (profileData.email?.trim()) lines.push(`EMAIL:${escapeVCard(profileData.email)}`);
    const website = profileData.website?.trim() || profileData.websiteUrl?.trim();
    if (website) {
      lines.push(
        `URL:${escapeVCard(/^https?:\/\//i.test(website) ? website : `https://${website}`)}`,
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
    if (address) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(address)};;;;`);
    if (profileData.bio?.trim()) lines.push(`NOTE:${escapeVCard(profileData.bio)}`);
    else if (profileData.headline?.trim()) lines.push(`NOTE:${escapeVCard(profileData.headline)}`);
    if (!displayName && !profileData.phone?.trim() && !profileData.email?.trim()) {
      alert("Contact download karne ke liye pehle profile details add karein.");
      return;
    }
    lines.push("END:VCARD");
    const blob = new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(displayName || "contact").replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").trim() || "contact"
      }.vcf`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2000);
  };

  const handleContactClick = (type) => {
    if (type === "phone") { handleCall(); }
    else if (type === "email") {
      if (businessInfo.email) window.location.href = `mailto:${businessInfo.email}`;
      else alert("Email address is not available.");
    } else if (type === "website") {
      if (!businessInfo.website) return;
      window.open(
        /^https?:\/\//i.test(businessInfo.website) ? businessInfo.website : `https://${businessInfo.website}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (type === "address") {
      window.open(
        `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`,
        "_blank",
        "noopener,noreferrer",
      );
    } else if (type === "upi") {
      if (!profileData.upiId?.trim()) { alert("UPI ID is not available."); return; }
      setShowPayment(true);
    }
  };

  const handleConfiguredButton = (button) => {
    switch (button.actionType) {
      case "call": handleCall(); break;
      case "whatsapp": handleWhatsApp(); break;
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
      case "share": handleShare(); break;
      case "website":
      case "customLink":
        if (button.customUrl) window.open(button.customUrl, "_blank", "noopener,noreferrer");
        break;
      case "saveContact": handleSaveContact(); break;
      case "upi": handleContactClick("upi"); break;
      default: break;
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault();
    setFormSubmitted(true);
    window.setTimeout(() => {
      setFormSubmitted(false);
      setFormData({ name: "", phone: "", email: "", message: "" });
    }, 3000);
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

  const socialLinks = (profileData.socialCards || []).filter((social) => social?.url);

   const getSocialIcon = (platform = "") => {
    const value = platform.toLowerCase();
    if (value.includes("instagram")) return FaInstagram;
    if (value.includes("linkedin")) return FaLinkedinIn;
    if (value.includes("facebook")) return FaFacebookF;
    if (value.includes("youtube")) return FaYoutube;
    if (value.includes("whatsapp")) return FaWhatsapp;
    if (value.includes("telegram")) return FaTelegram;
    if (value.includes("twitter") || value === "x") return FaXTwitter;
    if (value.includes("website")) return FaGlobe;
    return FaLink;
  };

  // ⬇️⬇️⬇️ YEH NAYA FUNCTION HAI — YAHI MISSING THA ⬇️⬇️⬇️
  const getSocialBrand = (platform = "") => {
    const value = platform.toLowerCase();
    if (value.includes("instagram")) return { color: "#E4405F", label: "Instagram" };
    if (value.includes("facebook")) return { color: "#1877F2", label: "Facebook" };
    if (value.includes("linkedin")) return { color: "#0A66C2", label: "LinkedIn" };
    if (value.includes("youtube")) return { color: "#FF0000", label: "YouTube" };
    if (value.includes("whatsapp")) return { color: "#25D366", label: "WhatsApp" };
    if (value.includes("telegram")) return { color: "#26A5E4", label: "Telegram" };
    if (value.includes("twitter") || value === "x") return { color: "#1DA1F2", label: "X (Twitter)" };
    if (value.includes("website") || value.includes("web")) return { color: "#22d3ee", label: "Website" };
    return { color: "#22d3ee", label: platform || "Link" };
  };
  // ⬆️⬆️⬆️ YAHAN TAK ⬆️⬆️⬆️

  if (loading || !profileChecked || !profile) return null;

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-slate-800">
      <main className="relative mx-auto w-full max-w-[1300px] px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        {/* ============ DASHBOARD CONTROLS ============ */}
        <div className="mb-5 grid grid-cols-1 gap-3 sm:mb-6 sm:gap-4 lg:grid-cols-2">
          <div className="flex flex-col justify-between rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 shadow-lg sm:p-5">
            <div className="mb-4 flex items-center gap-3">
              <ScanLine className="text-cyan-400" size={22} />
              <div>
                <h2 className="text-sm font-bold text-white">Activate Standee</h2>
                <p className="text-xs text-slate-400">Connect your physical card</p>
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
                onChange={(event) => setStandeeCode(event.target.value.toUpperCase())}
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
                <h2 className="text-sm font-bold text-white">Appearance Theme</h2>
                <p className="text-xs text-slate-400">Choose your profile vibe</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              {themes.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  title={theme.name}
                  onClick={() => setActiveTheme(theme.id)}
                  className={`h-8 w-8 rounded-full ${activeTheme === theme.id
                      ? "ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0b1b30]"
                      : ""
                    }`}
                  style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}
                />
              ))}
              <button
                type="button"
                onClick={() => setIsPreviewMode((value) => !value)}
                className="ml-auto flex items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-xs font-bold text-cyan-300"
              >
                <MonitorSmartphone size={15} />
                {isPreviewMode ? "Hide Preview" : "Show Preview"}
              </button>
            </div>
            <p className="mt-3 text-xs text-slate-400">
              Selected: {activeThemeData?.name || "Custom theme"}
            </p>
          </div>
        </div>

        {isPreviewMode && (
          <section className="pb-10">
            <div className="w-full overflow-hidden rounded-[24px] border border-[#45414a] bg-[#17171c] p-1.5 shadow-2xl sm:rounded-[28px] sm:p-3">
              <div className="overflow-hidden rounded-[20px] border border-[#34343c] bg-[#0b1b30] sm:rounded-[22px]">
                {/* ============ HERO BANNER ============ */}
                <div className="relative h-56 w-full sm:h-72 md:h-80">
                  <img
                    src={businessInfo.banner || bannerImages[0]}
                    alt="Profile banner"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30] via-[#0b1b30]/40 to-transparent" />
                  <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-6 sm:top-6">
                    <button
                      type="button"
                      onClick={() => { setQrModalTab("share"); setShowQrModal(true); }}
                      title="Share profile"
                      className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#071326]/80 text-white backdrop-blur-sm"
                    >
                      <Share2 size={19} />
                    </button>
                    <button
                      type="button"
                      onClick={() => { setQrModalTab("myqr"); setShowQrModal(true); }}
                      title="View bound QR code"
                      className="flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400 text-[#071326]"
                    >
                      <ScanLine size={20} />
                    </button>
                  </div>
                </div>

                {/* ============ PROFILE HEADER ============ */}
                <div className="relative px-4 sm:px-8 md:px-10">
                  <div className="-mt-16 flex flex-col items-center gap-4 sm:-mt-20 sm:gap-5 md:flex-row md:items-end">
                    <div className="h-32 w-32 shrink-0 overflow-hidden rounded-full border-4 border-[#0b1b30] bg-[#132942] shadow-2xl sm:h-36 sm:w-36">
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

                    <div className="pb-2 text-center md:text-left">
                      <div className="flex flex-wrap items-center justify-center gap-2 md:justify-start">
                        <h1 className="text-2xl font-extrabold text-white sm:text-3xl md:text-4xl">
                          {businessInfo.name || "Your Name"}
                        </h1>
                        {businessInfo.isVerified && <CheckCircle2 size={22} className="text-cyan-400" />}
                      </div>
                      <p className="mt-1 font-semibold text-cyan-400">
                        {businessInfo.role || "Business Professional"}
                      </p>
                      <p className="text-sm text-slate-300">{businessInfo.businessName}</p>
                      <p className="mt-1 flex items-center justify-center gap-1 text-xs text-slate-400 md:justify-start">
                        <MapPin size={12} />
                        {businessInfo.location}
                      </p>
                    </div>
                  </div>

                  {/* ACTION BUTTONS */}
                  <div className="flex flex-wrap justify-center gap-2 py-5 md:justify-start">
                    <button
                      type="button"
                      onClick={handleCall}
                      className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-[#0b1b30]"
                    >
                      <Phone size={16} /> Call
                    </button>
                    <button
                      type="button"
                      onClick={handleWhatsApp}
                      className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      <MessageCircle size={16} /> WhatsApp
                    </button>
                    <button
                      type="button"
                      onClick={() => handleContactClick("email")}
                      className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white"
                    >
                      <Mail size={16} /> Email
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveContact}
                      className="flex items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-4 py-2 text-sm font-bold text-white"
                    >
                      {saved ? <Check size={16} /> : <Download size={16} />}
                      {saved ? "Contact Saved" : "Save Contact"}
                    </button>
                  </div>

                  {socialLinks.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 pb-6 md:justify-start">
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

                {/* ============ MAIN GRID ============ */}
                <div className="grid grid-cols-1 gap-5 px-2 pb-10 sm:gap-6 sm:px-6 lg:grid-cols-12 lg:px-8">
                  {/* -------- LEFT COLUMN: Contact → QR → Social → Reviews → Inquiry -------- */}
                  <div className="space-y-5 sm:space-y-6 lg:col-span-4">
                    {/* 1. Contact Details */}
                    <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5">
                      <h3 className="mb-4 font-bold text-white">Contact Details</h3>
                      <div className="space-y-4 text-sm">
                        <p className="flex gap-3 text-white">
                          <Phone size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.phone || "Phone not provided"}
                        </p>
                        <p className="flex gap-3 text-white">
                          <MessageCircle size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.whatsapp || "WhatsApp not provided"}
                        </p>
                        <p className="flex gap-3 break-all text-white">
                          <Mail size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.email || "Email not provided"}
                        </p>
                        <p className="flex gap-3 break-all text-white">
                          <Globe size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.website || "Website not provided"}
                        </p>
                        <p className="flex gap-3 text-white">
                          <MapPin size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.address}
                        </p>
                        <p className="flex gap-3 text-white">
                          <Clock size={16} className="shrink-0 text-cyan-400" />
                          {businessInfo.businessHours || "Hours not provided"}
                        </p>
                      </div>
                    </div>

                    {/* 2. Bound QR Code */}
                    <div className="flex flex-col items-center rounded-2xl border border-[#29435f] bg-[#132942] p-5 text-center">
                      <h3 className="mb-3 text-base font-bold text-white">Scan QR Code</h3>
                      {qrFetching ? (
                        <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-sm text-slate-400">
                          Loading QR...
                        </div>
                      ) : qrTargetUrl ? (
                        <div className="mb-3 rounded-xl bg-white p-3">
                          <QRCodeCanvas id="bound-qr-canvas" value={qrTargetUrl} size={160} level="H" includeMargin />
                        </div>
                      ) : (
                        <div className="mb-3 flex h-40 w-40 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-sm text-slate-400">
                          QR code not available
                        </div>
                      )}
                      <p className="mb-3 text-xs text-slate-400">Scan to visit your profile</p>
                      <button
                        type="button"
                        onClick={() => handleDownloadQR("bound-qr-canvas")}
                        disabled={!qrTargetUrl || qrFetching}
                        className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-2 text-sm font-bold text-cyan-400 disabled:opacity-50"
                      >
                        <Download size={16} /> Download QR
                      </button>
                    </div>

                    {/* 3. Social Links */}
                  {/* 3. Social Links — Compact Premium */}
<div className="rounded-2xl border border-[#29435f] bg-[#132942] p-4">
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
            key={social._id || `${social.platform}-${index}`}
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
            {/* Brand glow blob */}
            <div
              className="pointer-events-none absolute -left-4 -top-4 h-12 w-12 rounded-full opacity-0 blur-2xl transition-opacity duration-300 group-hover:opacity-60"
              style={{ background: brand.color }}
            />

            {/* Icon pill */}
            <div
              className="relative flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-white shadow-md transition-transform duration-300 group-hover:scale-110"
              style={{
                background: `linear-gradient(135deg, ${brand.color}, ${brand.color}bb)`,
              }}
            >
              <SocialIcon size={14} />
            </div>

            {/* Label */}
            <span className="relative flex-1 truncate text-[11.5px] font-semibold text-slate-200 transition-colors duration-300 group-hover:text-white">
              {brand.label}
            </span>

            {/* Tiny arrow appears on hover */}
            <svg
              className="relative h-3 w-3 shrink-0 -translate-x-1 text-slate-500 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:text-white group-hover:opacity-100"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        );
      })}
    </div>
  ) : (
    <div className="rounded-lg border border-dashed border-[#29435f] bg-[#0b1b30]/40 py-5 text-center">
      <div className="mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/[0.04] text-slate-500">
        <FaLink size={14} />
      </div>
      <p className="text-[11px] font-medium text-slate-400">No social links added.</p>
    </div>
  )}
</div>

                    {/* 4. Reviews */}
                    <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-base font-bold text-white">Reviews</h3>
                        <button
                          type="button"
                          onClick={() => setShowReviewModal(true)}
                          className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-400"
                        >
                          Write Review
                        </button>
                      </div>
                      <p className="text-sm text-slate-400">
                        Be the first to share your experience with this business.
                      </p>
                    </div>
                  </div>

                  {/* -------- RIGHT COLUMN: About → Products → Gallery -------- */}
                  <div className="space-y-5 sm:space-y-6 lg:col-span-8">
                    {/* 1. About Me */}
                    <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6">
                      <h3 className="mb-3 text-lg font-bold text-white">About Me</h3>
                      <p className="text-sm leading-7 text-slate-300">{businessInfo.about}</p>
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

                    {/* 2. Featured Products */}
                    {productList.length > 0 && (
                      <div className="overflow-hidden rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="flex items-center gap-2 text-lg font-bold text-white">
                            <ShoppingBag size={18} className="text-cyan-400" />
                            Featured Products
                          </h3>
                          <span className="text-xs text-slate-400">{productList.length} items</span>
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
                              ? { delay: 3000, disableOnInteraction: false, pauseOnMouseEnter: true }
                              : false
                          }
                          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 2 } }}
                          className="pb-10"
                        >
                          {productList.map((product) => {
                            const cover = product.images?.find((image) => image?.url)?.url;
                            return (
                              <SwiperSlide key={product._id}>
                                <button
                                  type="button"
                                  onClick={() => setSelectedProduct(product)}
                                  className="group w-full overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30] text-left"
                                >
                                  <div className="h-36 bg-[#132942]">
                                    {cover ? (
                                      <img src={cover} alt={product.name} className="h-full w-full object-cover" />
                                    ) : (
                                      <div className="flex h-full items-center justify-center text-slate-500">
                                        <ImageIcon size={30} />
                                      </div>
                                    )}
                                  </div>
                                  <div className="p-3">
                                    <h4 className="truncate text-sm font-bold text-white">{product.name}</h4>
                                    <p className="mt-1 truncate text-xs text-slate-400">{product.description}</p>
                                    <p className="mt-3 font-extrabold text-cyan-400">
                                      ₹{Number(product.price || 0).toLocaleString("en-IN")}
                                    </p>
                                  </div>
                                </button>
                              </SwiperSlide>
                            );
                          })}
                        </Swiper>
                      </div>
                    )}

                    {/* 3. Gallery */}
                    <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6">
                      <div className="mb-4 flex items-center justify-between">
                        <h3 className="text-lg font-bold text-white">Gallery</h3>
                        <span className="text-sm text-cyan-400">{galleryImages.length} photos</span>
                      </div>
                      {galleryImages.length > 0 ? (
                        <Swiper
                          modules={[Autoplay, Navigation, Pagination]}
                          spaceBetween={12}
                          slidesPerView={2}
                          navigation={galleryImages.length > 3}
                          pagination={{ clickable: true }}
                          loop={galleryImages.length > 3}
                          autoplay={{ delay: 2500, disableOnInteraction: false, pauseOnMouseEnter: true }}
                          breakpoints={{ 640: { slidesPerView: 2 }, 1024: { slidesPerView: 3 } }}
                          className="pb-10"
                        >
                          {galleryImages.map((image, index) => (
                            <SwiperSlide key={`${image.url}-${index}`}>
                              <button
                                type="button"
                                onClick={() => setSelectedGalleryImage(image)}
                                className="group relative aspect-video w-full overflow-hidden rounded-xl"
                              >
                                <img src={image.url} alt={image.alt} className="h-full w-full object-cover" />
                                <span className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100">
                                  <Maximize2 size={20} className="text-white" />
                                </span>
                              </button>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="rounded-xl border border-dashed border-[#29435f] py-8 text-center">
                          <ImageIcon size={32} className="mx-auto mb-2 text-slate-500" />
                          <p className="text-sm text-slate-400">No gallery images added yet.</p>
                        </div>
                      )}
                    </div>
                    {/* 4. Send Inquiry (moved to right) */}
                    <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5 sm:p-6">
                      <h3 className="mb-4 text-lg font-bold text-white">Send an Inquiry</h3>
                      {formSubmitted ? (
                        <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-300">
                          Thank you! Your inquiry has been submitted.
                        </div>
                      ) : (
                        <form onSubmit={handleFormSubmit} className="space-y-3">
                          <input
                            type="text"
                            required
                            value={formData.name}
                            onChange={(event) => setFormData({ ...formData, name: event.target.value })}
                            placeholder="Your Name"
                            className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                          />
                          <input
                            type="tel"
                            required
                            value={formData.phone}
                            onChange={(event) => setFormData({ ...formData, phone: event.target.value })}
                            placeholder="Phone"
                            className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                          />
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(event) => setFormData({ ...formData, email: event.target.value })}
                            placeholder="Email (optional)"
                            className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                          />
                          <textarea
                            rows={3}
                            value={formData.message}
                            onChange={(event) => setFormData({ ...formData, message: event.target.value })}
                            placeholder="Message"
                            className="w-full resize-none rounded-lg border border-[#29435f] bg-[#0b1b30] px-3.5 py-2.5 text-sm text-white outline-none focus:border-cyan-400"
                          />
                          <button
                            type="submit"
                            className="w-full rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-[#0b1b30]"
                          >
                            Submit Inquiry
                          </button>
                        </form>
                      )}
                    </div>
                  </div>

                </div>

                {/* ============ FOOTER ============ */}
                <footer className="border-t border-[#29435f] bg-[#0b1b30] py-6 text-center">
                  <p className="text-xs text-slate-400">
                    © {new Date().getFullYear()} {businessInfo.name}. All rights reserved.
                  </p>
                  <p className="mt-1 text-xs text-slate-500">
                    Powered by <span className="font-bold text-cyan-400">BioWebsite</span>
                  </p>
                </footer>
              </div>
            </div>
          </section>
        )}

      </main>

      {/* ============ QR MODAL ============ */}
      {showQrModal && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center bg-[#020817]/85 p-4 backdrop-blur-md"
          onClick={(event) => { if (event.target === event.currentTarget) setShowQrModal(false); }}
        >
          <div className="relative w-full max-w-md rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 shadow-2xl sm:p-7">
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg border border-[#29435f] bg-[#132942] text-slate-300"
            >
              <X size={18} />
            </button>

            <h2 className="mb-5 pr-10 text-xl font-bold text-white">Share Your Profile</h2>

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
                  className={`rounded-lg border px-3 py-2 text-sm font-semibold ${qrModalTab === tab.id
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
                  <Share2 size={17} /> Share Profile
                </button>
                <button
                  type="button"
                  onClick={handleCopyLink}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#29435f] bg-[#132942] py-3 font-semibold text-white"
                >
                  <Copy size={17} /> {copied ? "Link Copied!" : "Copy Profile Link"}
                </button>
              </div>
            )}

            {qrModalTab === "myqr" && (
              <div className="flex flex-col items-center">
                {qrFetching ? (
                  <p className="mb-5 py-10 text-sm text-slate-400">Loading QR...</p>
                ) : qrTargetUrl ? (
                  <div className="mb-5 rounded-xl bg-white p-4">
                    <QRCodeCanvas id="bound-qr-modal-canvas" value={qrTargetUrl} size={220} level="H" includeMargin />
                  </div>
                ) : (
                  <p className="mb-5 py-8 text-sm text-slate-400">Bound QR code is not available.</p>
                )}
                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-modal-canvas")}
                  disabled={!qrTargetUrl || qrFetching}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-3 text-sm font-bold text-cyan-400 disabled:opacity-50"
                >
                  <Download size={16} /> Download QR Code
                </button>
              </div>
            )}

            {qrModalTab === "poster" && (
              <div className="flex flex-col items-center rounded-xl border border-[#29435f] bg-[#132942] p-5 text-center">
                <FileImage size={32} className="mb-3 text-cyan-400" />
                <h3 className="mb-2 text-lg font-bold text-white">Profile QR Poster</h3>
                <p className="mb-4 text-sm text-slate-400">Scan this QR code to open your profile.</p>
                {qrFetching ? (
                  <p className="text-sm text-slate-400">Loading QR...</p>
                ) : qrTargetUrl ? (
                  <div className="rounded-xl bg-white p-3">
                    <QRCodeCanvas id="bound-qr-poster-canvas" value={qrTargetUrl} size={180} level="H" includeMargin />
                  </div>
                ) : (
                  <p className="text-sm text-slate-400">Bound QR code is not available.</p>
                )}
                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-poster-canvas")}
                  disabled={!qrTargetUrl || qrFetching}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0b1b30] disabled:opacity-50"
                >
                  <Download size={16} /> Download Poster QR
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ PRODUCT MODAL ============ */}
      {selectedProduct && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}
        >
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-[#45414a] bg-[#17171c]">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product details"
              className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl bg-[#22222a]/90 text-white"
            >
              <X size={18} />
            </button>
            {Array.isArray(selectedProduct.images) &&
              selectedProduct.images.filter((image) => image?.url).length > 0 ? (
              <Swiper
                modules={[Navigation, Pagination]}
                navigation={selectedProduct.images.filter((image) => image?.url).length > 1}
                pagination={{ clickable: true }}
                slidesPerView={1}
                loop={selectedProduct.images.filter((image) => image?.url).length > 1}
                className="h-60 w-full sm:h-80"
              >
                {selectedProduct.images
                  .filter((image) => image?.url)
                  .map((image, index) => (
                    <SwiperSlide key={image._id || index}>
                      <img src={image.url} alt={image.alt || selectedProduct.name} className="h-full w-full object-cover" />
                    </SwiperSlide>
                  ))}
              </Swiper>
            ) : (
              <div className="flex h-60 items-center justify-center text-7xl sm:h-80">📦</div>
            )}
            <div className="p-5 sm:p-7">
              <h3 className="text-2xl font-bold text-white">{selectedProduct.name}</h3>
              <p className="mt-2 text-cyan-400">
                ₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}
              </p>
              <p className="mt-4 text-sm leading-7 text-slate-300">{selectedProduct.description}</p>
              <div className="mt-5 flex flex-wrap gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-sm font-bold text-emerald-300">
                  <CheckCircle2 size={16} />
                  {selectedProduct.status === "active" ? "Available" : "Unavailable"}
                </span>
                {businessInfo.upiId && (
                  <button
                    type="button"
                    onClick={() => { setSelectedProduct(null); handleContactClick("upi"); }}
                    className="inline-flex items-center gap-2 rounded-xl border border-cyan-400/40 bg-cyan-400/10 px-4 py-2.5 text-sm font-bold text-cyan-300"
                  >
                    <IndianRupee size={16} /> Pay with UPI
                  </button>
                )}
                {(businessInfo.whatsapp || businessInfo.phone) && (
                  <button
                    type="button"
                    onClick={() => { setSelectedProduct(null); handleWhatsApp(); }}
                    className="inline-flex items-center gap-2 rounded-xl bg-emerald-400 px-4 py-2.5 text-sm font-bold text-[#062c25]"
                  >
                    <FaWhatsapp size={16} /> Enquire on WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ============ GALLERY IMAGE MODAL ============ */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/85 p-4 backdrop-blur-md"
          onClick={(event) => { if (event.target === event.currentTarget) setSelectedGalleryImage(null); }}
        >
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
                <p className="text-sm font-semibold text-white">{selectedGalleryImage.caption}</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ============ REVIEW MODAL ============ */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md"
          onClick={(event) => { if (event.target === event.currentTarget) setShowReviewModal(false); }}
        >
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
                <h3 className="mt-5 text-xl font-bold text-white">Thank You!</h3>
                <p className="mt-2 text-slate-300">Thank you for your review!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-5 flex items-center gap-3">
                  <Star size={24} className="text-cyan-400" />
                  <div>
                    <h3 className="text-xl font-bold text-white">Write a Review</h3>
                    <p className="text-sm text-slate-400">Share your experience with this business.</p>
                  </div>
                </div>
                <label className="mb-2 block text-sm font-semibold text-slate-200">Your Name</label>
                <input
                  required
                  value={reviewData.name}
                  onChange={(event) => setReviewData({ ...reviewData, name: event.target.value })}
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
                <p className="mb-3 mt-5 text-sm font-semibold text-slate-200">Your Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button
                      key={number}
                      type="button"
                      onClick={() => setReviewRating(number)}
                      aria-label={`Rate ${number} out of 5`}
                    >
                      <Star
                        size={28}
                        className={number <= reviewRating ? "fill-cyan-400 text-cyan-400" : "text-slate-600"}
                      />
                    </button>
                  ))}
                </div>
                <label className="mb-2 mt-5 block text-sm font-semibold text-slate-200">Your Review</label>
                <textarea
                  required
                  rows={4}
                  value={reviewData.review}
                  onChange={(event) => setReviewData({ ...reviewData, review: event.target.value })}
                  placeholder="Tell us about your experience..."
                  className="w-full resize-y rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-white outline-none focus:border-cyan-400"
                />
                <button
                  type="submit"
                  className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-4 py-3.5 font-bold text-[#0b1b30]"
                >
                  <Send size={17} /> Submit Review
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

export default Mini;