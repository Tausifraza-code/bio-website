import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/slice/profileSlice";
import { fetchContactButtons } from "../redux/slice/contactButtonsSlice";
import Payment from "./Payment";
import { getMyProducts } from "../redux/slice/productSlice";
import { getMyGallery } from "../redux/slice/gallerySlice";

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
  QrCode,
  Download,
  Copy,
  FileImage,
} from "lucide-react";

/* =========================================================
   THEME DATA
========================================================= */

const themes = [
  { id: "executive", name: "Executive Royal", colors: ["#1e3a8a", "#7c3aed"], icon: Crown },
  { id: "emerald", name: "Emerald Luxe", colors: ["#10b981", "#14b8a6"], icon: Leaf },
  { id: "rose", name: "Rose Gold & Champagne", colors: ["#f43f5e", "#fb923c"], icon: Gem },
  { id: "obsidian", name: "Obsidian Noir & Platinum", colors: ["#334155", "#94a3b8"], icon: Moon },
  { id: "sunset", name: "Sunset Amber & Coral", colors: ["#f59e0b", "#f97316"], icon: Sun },
];

const hasValidProfile = (profile) => {
  if (!profile || typeof profile !== "object") return false;
  const firstName = profile.firstName?.trim() || "";
  const lastName = profile.lastName?.trim() || "";
  const businessName = profile.businessName?.trim() || "";
  const isDemo = /^(ankit'?s business|my business|your name)$/i.test(businessName) || /^(ankit|your name)$/i.test(firstName);
  if (isDemo) return false;
  return Boolean(firstName || lastName || businessName || profile.phone?.trim() || profile.email?.trim());
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
  return raw.map((item, index) => {
      if (typeof item === "string") {
        const url = item.trim();
        return url ? { url, alt: `Gallery image ${index + 1}`, caption: "" } : null;
      }
      if (!item || typeof item !== "object") return null;
      const url = [item.url, item.src, item.image, item.imageUrl, item.path].find((value) => typeof value === "string" && value.trim());
      if (!url) return null;
      const caption = typeof item.caption === "string" && item.caption.trim() ? item.caption.trim() : typeof item.title === "string" && item.title.trim() ? item.title.trim() : "";
      return { url: url.trim(), alt: (typeof item.alt === "string" && item.alt.trim()) || caption || `Gallery image ${index + 1}`, caption };
    }).filter(Boolean);
};

/* =========================================================
   MAIN COMPONENT
========================================================= */

const Mini = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { profile, isVerified, loading } = useSelector((state) => state.profile);
const { products = [] } = useSelector((state) => state.product || {});

const { buttons: contactButtons = [], loaded: contactButtonsLoaded } =
  useSelector((state) => state.contactButtons || {});

const { gallery = [] } = useSelector(
  (state) => state.gallery || {}
);

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

  // QR Modal States
  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("share"); // 'share', 'myqr', 'poster'

  useEffect(() => {
    let mounted = true;
    dispatch(fetchMyProfile()).unwrap().then((savedProfile) => {
        if (!mounted) return;
        if (!hasValidProfile(savedProfile)) {
          navigate("/editprofile", { replace: true });
          return;
        }
        setActiveTheme(savedProfile.activeTheme || "sunset");
        setProfileChecked(true);
      }).catch((error) => {
        if (!mounted) return;
        console.error("Profile load failed:", error);
        navigate("/editprofile", { replace: true });
      });
    return () => { mounted = false; };
  }, [dispatch, navigate]);

useEffect(() => {
  dispatch(getMyProducts());
}, [dispatch]);

useEffect(() => {
  dispatch(getMyGallery());
}, [dispatch]);

useEffect(() => {
  if (!contactButtonsLoaded) dispatch(fetchContactButtons());
}, [dispatch, contactButtonsLoaded]);

  const profileData = profile || {};
  const productList = Array.isArray(products) ? products : [];

  const buttonSource = Array.isArray(profileData.contactButtons) ? profileData.contactButtons : contactButtons;
  const visibleButtons = [...buttonSource].filter((button) => button.enabled).sort((a, b) => a.order - b.order);

  /* =========================================================
     BUSINESS INFORMATION
  ========================================================= */

  const businessInfo = {
    name: [profileData.firstName, profileData.lastName].filter(Boolean).join(" "),
    role: profileData.jobTitle || "",
    location: [profileData.city, profileData.state, profileData.pincode].filter(Boolean).join(", ") || "Location not added",
    about: profileData.bio || profileData.headline || "Welcome to my business! Contact me for business inquiries.",
    phone: profileData.phone || "",
    whatsapp: profileData.whatsapp || "",
    email: profileData.email || "",
    website: profileData.website || profileData.websiteUrl || "",
    address: [profileData.shopUnit, profileData.area, profileData.city, profileData.state, profileData.pincode].filter(Boolean).join(", ") || "Address not added",
    logo: profileData.logo || null,
    avatar: profileData.avatar || null,
    banner: profileData.banner || null,
    qrCode: profileData.qrCode || null,
    industry: profileData.industry || "",
    businessName: profileData.businessName || "My Business",
    headline: profileData.headline || "",
    businessHours: profileData.businessHours || "",
    mapLink: profileData.mapLink || "",
    upiId: profileData.upiId || "",
    isVerified: isVerified === true,
  };

const galleryImages = useMemo(() => {
  // Backend GET /gallery/my-gallery data
  const fromGalleryApi = normalizeGalleryImages(gallery);

  if (fromGalleryApi.length > 0) {
    return fromGalleryApi;
  }

  // Existing profile gallery fallback
  const fromProfile = normalizeGalleryImages(
    profileData.gallery ||
      profileData.galleryImages ||
      profileData.businessGallery ||
      profileData.images
  );

  if (fromProfile.length > 0) {
    return fromProfile;
  }

  // Existing products images fallback
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

  const currentTheme = { primary: "#22d3ee", secondary: "#3b82f6", background: "#0b1b30", surface: "#132942", text: "#f8fafc" };
  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  /* =========================================================
     ACTION HANDLERS
  ========================================================= */

  const handleActivateStandee = () => { if (!standeeCode.trim()) return; setStandeeActivated(true); };

  const handleWhatsApp = () => {
    const number = businessInfo.whatsapp || businessInfo.phone;
    if (!number) return alert("WhatsApp number is not available.");
    window.open(`https://wa.me/${number.replace(/\D/g, "")}?text=${encodeURIComponent("Hi, I'm interested in your business.")}`, "_blank", "noopener,noreferrer");
  };

  const handleCall = () => {
    if (!businessInfo.phone) return alert("Phone number is not available.");
    window.location.href = `tel:${businessInfo.phone.replace(/\s/g, "")}`;
  };

  const handleShare = async () => {
    const shareData = { title: businessInfo.name || businessInfo.businessName, text: `Check out ${businessInfo.name || businessInfo.businessName}'s business`, url: window.location.href };
    if (navigator.share) {
      try { await navigator.share(shareData); } catch (error) {}
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      alert("Unable to copy the link. Please copy it from the address bar.");
    }
  };

  const handleSaveContact = () => {
    const escapeVCard = (value = "") => String(value).trim().replace(/\\/g, "\\\\").replace(/\n/g, "\\n").replace(/,/g, "\\,").replace(/;/g, "\\;");
    const lines = ["BEGIN:VCARD", "VERSION:3.0"];
    const fullName = [profileData.firstName, profileData.lastName].filter((value) => value?.trim()).join(" ").trim();
    const displayName = fullName || profileData.businessName?.trim() || "";

    if (displayName) lines.push(`FN:${escapeVCard(displayName)}`);
    if (profileData.businessName?.trim()) lines.push(`ORG:${escapeVCard(profileData.businessName)}`);
    if (profileData.jobTitle?.trim()) lines.push(`TITLE:${escapeVCard(profileData.jobTitle)}`);
    if (profileData.phone?.trim()) lines.push(`TEL;TYPE=CELL:${escapeVCard(profileData.phone)}`);
    if (profileData.whatsapp?.trim()) lines.push(`item1.URL:${escapeVCard(`https://wa.me/${profileData.whatsapp.replace(/\D/g, "")}`)}`, "item1.X-ABLabel:WhatsApp");
    if (profileData.email?.trim()) lines.push(`EMAIL:${escapeVCard(profileData.email)}`);

    const website = profileData.website?.trim() || profileData.websiteUrl?.trim();
    if (website) lines.push(`URL:${escapeVCard(/^https?:\/\//i.test(website) ? website : `https://${website}`)}`);

    const address = [profileData.shopUnit, profileData.area, profileData.landmark, profileData.city, profileData.state, profileData.pincode].filter((value) => value?.trim()).join(", ");
    if (address) lines.push(`ADR;TYPE=WORK:;;${escapeVCard(address)};;;;`);
    if (profileData.bio?.trim()) lines.push(`NOTE:${escapeVCard(profileData.bio)}`);
    else if (profileData.headline?.trim()) lines.push(`NOTE:${escapeVCard(profileData.headline)}`);

    if (!displayName && !profileData.phone?.trim() && !profileData.email?.trim()) return alert("Contact download karne ke liye pehle profile details add karein.");
    lines.push("END:VCARD");

    const blob = new Blob([`${lines.join("\r\n")}\r\n`], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${(displayName || "contact").replace(/[<>:"/\\|?*\u0000-\u001F]/g, "-").trim() || "contact"}.vcf`;

    document.body.appendChild(anchor); anchor.click(); anchor.remove();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
    setSaved(true); window.setTimeout(() => setSaved(false), 2000);
  };

  const handleDownloadQR = async () => {
    if (!businessInfo.qrCode) return alert("QR code is not available.");
    try {
      const response = await fetch(businessInfo.qrCode);
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "profile-qr-code.png";
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } catch (error) {
      window.open(businessInfo.qrCode, "_blank", "noopener,noreferrer");
    }
  };

  const handleDownloadPoster = () => {
    // Note: To generate a real image, you would use html2canvas. 
    // This is a simulation of downloading.
    alert("Downloading Poster... (In production, this would generate a high-res image using html2canvas)");
  };

  const handleContactClick = (type) => {
    if (type === "phone") handleCall();
    else if (type === "email") { if (businessInfo.email) window.location.href = `mailto:${businessInfo.email}`; else alert("Email address is not available."); }
    else if (type === "website") { if (!businessInfo.website) return; window.open(/^https?:\/\//i.test(businessInfo.website) ? businessInfo.website : `https://${businessInfo.website}`, "_blank", "noopener,noreferrer"); }
    else if (type === "address") window.open(`https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`, "_blank", "noopener,noreferrer");
    else if (type === "upi") { if (!profileData.upiId?.trim()) return alert("UPI ID is not available."); setShowPayment(true); }
  };

  const handleConfiguredButton = (button) => {
    switch (button.actionType) {
      case "call": handleCall(); break;
      case "whatsapp": handleWhatsApp(); break;
      case "email": if (businessInfo.email) window.location.href = `mailto:${businessInfo.email}`; break;
      case "directions": window.open(profileData.mapLink || `https://maps.google.com/?q=${encodeURIComponent(businessInfo.address)}`, "_blank", "noopener,noreferrer"); break;
      case "share": handleShare(); break;
      case "website": case "customLink": if (button.customUrl) window.open(button.customUrl, "_blank", "noopener,noreferrer"); break;
      case "saveContact": handleSaveContact(); break;
      case "upi": handleContactClick("upi"); break;
      default: break;
    }
  };

  const handleFormSubmit = (event) => {
    event.preventDefault(); setFormSubmitted(true);
    window.setTimeout(() => { setFormSubmitted(false); setFormData({ name: "", phone: "", email: "", message: "" }); }, 3000);
  };

  const handleReviewSubmit = (event) => {
    event.preventDefault(); setReviewSubmitted(true);
    window.setTimeout(() => { setShowReviewModal(false); setReviewSubmitted(false); setReviewData({ name: "", review: "" }); setReviewRating(5); }, 2000);
  };

  if (loading || !profileChecked || !profile) return null;

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

  return (
    // Background wrapper completely transparent as requested
    <div className="relative min-h-screen font-sans text-slate-800 bg-transparent">
      <main className="relative mx-auto max-w-[1600px] px-1 py-1 sm:px-6 sm:py-6 xl:px-8">
        {/* DASHBOARD CONTROLS */}
        <div className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          {/* STANDEE CARD */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 shadow-lg transition-all duration-300 hover:border-cyan-400/30 sm:p-5">
            <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-500/10 blur-2xl transition-all duration-500 group-hover:bg-cyan-500/20" />
            <div className="relative z-10 mb-3 flex items-center justify-between gap-4">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400"><ScanLine size={16} /></div>
                <div>
                  <h2 className="flex items-center gap-2 text-sm font-bold text-white">Activate Standee <span className="rounded border border-cyan-400/20 bg-cyan-400/10 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-cyan-300">Setup</span></h2>
                  <p className="mt-0.5 text-[11px] text-slate-400">Connect your physical card</p>
                </div>
              </div>
              {standeeActivated ? (
                <span className="flex items-center gap-1 rounded-md border border-emerald-400/20 bg-emerald-400/10 px-2 py-1 text-[10px] font-bold text-emerald-400"><CheckCircle2 size={12} /> Active</span>
              ) : (
                <span className="flex items-center gap-1 rounded-md border border-amber-400/20 bg-amber-400/10 px-2 py-1 text-[10px] font-bold text-amber-400"><ShieldCheck size={12} /> Required</span>
              )}
            </div>
            <div className="relative z-10 flex items-center gap-2">
              <div className="flex flex-1 items-center rounded-xl border border-[#29435f] bg-[#071326] p-1 transition-all focus-within:border-cyan-400 focus-within:ring-2 focus-within:ring-cyan-400/20">
                <input type="text" value={standeeCode} onChange={(e) => setStandeeCode(e.target.value.toUpperCase())} disabled={standeeActivated} placeholder="Enter Code (e.g. XR-1001)" className="w-full bg-transparent px-3 py-1.5 text-xs font-semibold tracking-wide text-white outline-none placeholder:text-slate-500 disabled:opacity-50" />
                <button onClick={handleActivateStandee} disabled={standeeActivated || !standeeCode.trim()} className="flex shrink-0 items-center justify-center rounded-lg bg-cyan-400 px-3 py-1.5 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50">{standeeActivated ? "Done" : "Activate"}</button>
              </div>
            </div>
          </div>

          {/* THEME CARD */}
          <div className="relative flex flex-col justify-between rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 shadow-lg transition-all duration-300 hover:border-cyan-400/30 sm:p-5">
            <div className="mb-3 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400"><Palette size={16} /></div>
                <div>
                  <h2 className="text-sm font-bold text-white">Appearance Theme</h2>
                  <p className="mt-0.5 text-[11px] text-slate-400">Choose your profile vibe</p>
                </div>
              </div>
              <span className="hidden rounded-md border border-cyan-400/10 bg-cyan-400/5 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-300 sm:block">{activeThemeData?.name}</span>
            </div>
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2">
                {themes.map((theme) => {
                  const isActive = activeTheme === theme.id;
                  return (
                    <button key={theme.id} onClick={() => setActiveTheme(theme.id)} title={theme.name} aria-label={`Select ${theme.name}`} className={`relative flex h-8 w-8 items-center justify-center rounded-full transition-all duration-300 ${isActive ? "scale-110 ring-2 ring-cyan-400 ring-offset-2 ring-offset-[#0b1b30]" : "opacity-70 hover:scale-110 hover:opacity-100"}`}>
                      <span className="h-full w-full rounded-full border border-white/20" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }} />
                      {isActive && <span className="absolute inset-0 flex items-center justify-center text-white"><Check size={12} strokeWidth={4} /></span>}
                    </button>
                  );
                })}
              </div>
              <button onClick={() => setIsPreviewMode(!isPreviewMode)} className={`flex shrink-0 items-center justify-center gap-1.5 rounded-lg border px-3 py-2 text-xs font-bold transition-all ${isPreviewMode ? "border-cyan-400/30 bg-cyan-400/10 text-cyan-300 hover:bg-cyan-400/20" : "border-[#29435f] bg-[#132942] text-slate-300 hover:text-white"}`}>
                <MonitorSmartphone size={14} />{isPreviewMode ? "Hide" : "Preview"}
              </button>
            </div>
          </div>
        </div>

        {/* LIVE PROFILE PREVIEW */}
        {isPreviewMode && (
          <section className="animate-in fade-in slide-in-from-bottom-4 pb-12 duration-500">
            <div className="mx-auto w-full max-w-[1200px]">
              <div className="overflow-hidden rounded-[28px] border border-[#45414a] bg-[#17171c] p-2 shadow-[0_30px_100px_rgba(0,0,0,0.6)] sm:rounded-[32px] sm:p-3">
                <div className="overflow-hidden rounded-[22px] border border-[#34343c] bg-[#0b1b30]">
                  {/* HERO BANNER */}
                  <div className="relative h-64 w-full sm:h-80">
                    <img src={businessInfo.banner || bannerImages[0]} alt="Banner" className="h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30] via-[#0b1b30]/40 to-transparent" />

                    {/* SHARE AND QR BUTTONS */}
                    <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">
                      <button type="button" onClick={() => { setQrModalTab("share"); setShowQrModal(true); }} title="Share profile" aria-label="Share profile" className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/20 bg-[#071326]/80 text-white shadow-lg backdrop-blur-md transition hover:border-cyan-300/60 hover:bg-cyan-400 hover:text-[#071326]"><Share2 size={19} /></button>
                      <button type="button" onClick={() => { setQrModalTab("myqr"); setShowQrModal(true); }} title="View QR code" aria-label="Open QR modal" className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/40 bg-cyan-400 text-[#071326] shadow-lg shadow-cyan-950/30 transition hover:scale-105 hover:bg-cyan-300"><ScanLine size={20} /></button>
                    </div>

                    <div className="absolute bottom-4 right-4 z-10 flex gap-2 sm:right-6">
                      {copied && <span className="rounded-lg border border-cyan-300/20 bg-[#071326]/90 px-3 py-1.5 text-xs font-semibold text-cyan-200 backdrop-blur">Link copied!</span>}
                    </div>
                  </div>

                  {/* PROFILE HEADER */}
                  <div className="relative px-6 sm:px-10">
                    <div className="-mt-16 flex flex-col items-center justify-between gap-6 sm:-mt-20 md:flex-row md:items-end">
                      <div className="flex flex-col items-center gap-2 sm:flex-row sm:items-end">
                        {/* AVATAR WITH LOGO BADGE OVERLAY */}
                        <div className="relative h-32 w-32 shrink-0 sm:h-36 sm:w-36">
                          <div className="h-full w-full overflow-hidden rounded-full border-4 border-[#0b1b30] bg-[#132942] shadow-2xl">
                            {businessInfo.avatar ? (
                              <img src={businessInfo.avatar} alt={businessInfo.name} className="h-full w-full object-cover" />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center text-slate-500"><UserPlus size={40} /></div>
                            )}
                          </div>
                          {businessInfo.logo && (
                            <div
                              title={businessInfo.businessName || "Business Logo"}
                              className="absolute -right-1 top-24 z-10 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-4 border-[#0b1b30] bg-white shadow-[0_4px_16px_rgba(0,0,0,0.5)] sm:h-10 sm:w-10"
                            >
                              <img
                                src={businessInfo.logo}
                                alt={businessInfo.businessName || "Business logo"}
                                className="h-full w-full object-contain p-1"
                                onError={(e) => {
                                  e.currentTarget.parentElement.style.display = "none";
                                }}
                              />
                            </div>
                          )}
                        </div>
                        <div className="pb-2 text-center sm:text-left">
                          <div className="flex items-center justify-center gap-2 sm:justify-start">
                            <h1 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">{businessInfo.name || "Your Name"}</h1>
                            {businessInfo.isVerified && <CheckCircle2 size={24} className="fill-cyan-400/20 text-cyan-400" />}
                          </div>
                          <p className="mt-1 text-base font-semibold text-cyan-400">{businessInfo.role || "Business Professional"}</p>
                          <p className="mt-0.5 text-sm text-slate-300">{businessInfo.businessName}</p>
                          <p className="mt-1 flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start"><MapPin size={12} />{businessInfo.location}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-4 pb-4">
                      <button onClick={handleCall} className="flex items-center gap-2 rounded-lg bg-cyan-400 px-4 py-2 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-300"><Phone size={16} />Call</button>
                      <button onClick={handleWhatsApp} className="flex items-center gap-2 rounded-lg bg-emerald-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-emerald-400"><MessageCircle size={16} />WhatsApp</button>
                      <button onClick={() => handleContactClick("email")} className="flex items-center gap-2 rounded-lg bg-blue-500 px-4 py-2 text-sm font-bold text-white transition hover:bg-blue-400"><Mail size={16} />Email</button>
                      <button onClick={handleSaveContact} className="flex items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-4 py-2 text-sm font-bold text-white transition hover:bg-[#1a3658]">{saved ? <Check size={16} /> : <Download size={16} />}{saved ? "Contact Saved" : "Save Contact"}</button>
                    </div>

                    {socialLinks.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 pb-8">
                        {socialLinks.map((social, index) => {
                          const SocialIcon = getSocialIcon(social.platform);
                          return (
                            <a key={social._id || `${social.platform}-${index}`} href={social.url} target="_blank" rel="noopener noreferrer" title={social.platform || "Social link"} aria-label={social.platform || "Social link"} className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 transition hover:-translate-y-0.5 hover:border-cyan-400/60 hover:bg-cyan-400/10 hover:text-cyan-300"><SocialIcon size={18} /></a>
                          );
                        })}
                      </div>
                    )}
                    {socialLinks.length === 0 && <div className="pb-8" />}
                  </div>

                  {/* MAIN CONTENT GRID */}
                  <div className="grid grid-cols-1 gap-6 px-2 pb-12 sm:px-10 lg:grid-cols-12">
                    {/* LEFT COLUMN */}
                    <div className="space-y-6 lg:col-span-4">
                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-5">
                        <h3 className="mb-4 text-base font-bold text-white">Contact Details</h3>
                        <div className="space-y-4">
                          <div className="flex items-start gap-3"><Phone className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">Phone</p><p className="text-sm font-medium text-white">{businessInfo.phone || "Not provided"}</p></div></div>
                          <div className="flex items-start gap-3"><MessageCircle className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">WhatsApp</p><p className="text-sm font-medium text-white">{businessInfo.whatsapp || "Not provided"}</p></div></div>
                          <div className="flex items-start gap-3"><Mail className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">Email</p><p className="break-all text-sm font-medium text-white">{businessInfo.email || "Not provided"}</p></div></div>
                          <div className="flex items-start gap-3"><Globe className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">Website</p>{businessInfo.website ? <a href={/^https?:\/\//i.test(businessInfo.website) ? businessInfo.website : `https://${businessInfo.website}`} target="_blank" rel="noreferrer" className="break-all text-sm font-medium text-cyan-400 hover:underline">{businessInfo.website}</a> : <p className="text-sm font-medium text-white">Not provided</p>}</div></div>
                          <div className="flex items-start gap-3"><MapPin className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">Address</p><p className="text-sm font-medium text-white">{businessInfo.address}</p></div></div>
                          <div className="flex items-start gap-3"><Clock className="mt-0.5 shrink-0 text-cyan-400" size={16} /><div><p className="text-xs text-slate-400">Hours</p><p className="text-sm font-medium text-white">{businessInfo.businessHours || "Not provided"}</p></div></div>
                        </div>
                      </div>

                      <div className="flex flex-col items-center rounded-2xl border border-[#29435f] bg-[#132942] p-5 text-center">
                        <h3 className="mb-3 text-base font-bold text-white">Scan QR Code</h3>
                        {businessInfo.qrCode ? (
                          <div className="mb-3 rounded-xl bg-white p-2"><img src={businessInfo.qrCode} alt="QR Code" className="h-32 w-32 object-contain" /></div>
                        ) : (
                          <div className="mb-3 flex h-32 w-32 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-slate-500"><QrCode size={40} /></div>
                        )}
                        <p className="mb-3 text-xs text-slate-400">Scan to visit my profile</p>
                        <button type="button" onClick={handleDownloadQR} className="flex w-full items-center justify-center gap-2 rounded-lg border border-cyan-400/30 bg-cyan-400/10 py-2 text-sm font-bold text-cyan-400 transition hover:bg-cyan-400/20"><Download size={16} />Download QR</button>
                      </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="space-y-6 lg:col-span-8">
                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                        <h3 className="mb-3 text-lg font-bold text-white">About Me</h3>
                        <p className="text-sm leading-7 text-slate-300">{businessInfo.about}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {businessInfo.industry && <span className="rounded-md border border-[#29435f] bg-[#0b1b30] px-3 py-1 text-xs font-semibold text-cyan-300">{businessInfo.industry}</span>}
                          <span className="rounded-md border border-[#29435f] bg-[#0b1b30] px-3 py-1 text-xs font-semibold text-cyan-300">{businessInfo.businessName}</span>
                        </div>
                      </div>

                      {productList.length > 0 && (
                        <div className="overflow-hidden rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                          <div className="mb-4 flex items-center justify-between">
                            <h3 className="flex items-center gap-2 text-lg font-bold text-white"><ShoppingBag size={18} className="text-cyan-400" />Featured Products</h3>
                            <span className="rounded-md border border-[#29435f] bg-[#0b1b30] px-2 py-1 text-xs font-semibold text-slate-400">{productList.length} items</span>
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
                            breakpoints={{
                              640: { slidesPerView: 2 },
                              1024: { slidesPerView: 2 },
                            }}
                            className="pb-10"
                          >
                            {productList.map((product) => {
                              const cover = product.images?.find((image) => image?.url)?.url;
                              return (
                                <SwiperSlide key={product._id}>
                                  <div onClick={() => setSelectedProduct(product)} className="group cursor-pointer overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30] transition hover:border-cyan-400/50">
                                    <div className="relative h-36 w-full bg-[#132942]">
                                      {cover ? <img src={cover} alt={product.name} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-full w-full items-center justify-center text-slate-500"><ImageIcon size={30} /></div>}
                                    </div>
                                    <div className="p-3">
                                      <h4 className="truncate text-sm font-bold text-white">{product.name}</h4>
                                      <p className="mt-1 truncate text-xs text-slate-400">{product.description}</p>
                                      <div className="mt-3 flex items-center justify-between">
                                        <span className="text-sm font-extrabold text-cyan-400">₹{Number(product.price || 0).toLocaleString("en-IN")}</span>
                                        <span className="rounded-md bg-cyan-400/10 px-2 py-1 text-[10px] font-bold text-cyan-200">View</span>
                                      </div>
                                    </div>
                                  </div>
                                </SwiperSlide>
                              );
                            })}
                          </Swiper>
                        </div>
                      )}

                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">Gallery</h3>
                          {galleryImages.length > 0 && <span className="text-sm font-semibold text-cyan-400">{galleryImages.length} photos</span>}
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
                              <SwiperSlide key={index}>
                                <div onClick={() => setSelectedGalleryImage(image)} className="group relative aspect-video cursor-pointer overflow-hidden rounded-xl">
                                  <img src={image.url} alt={image.alt} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
                                  <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition group-hover:opacity-100"><Maximize2 size={20} className="text-white" /></div>
                                </div>
                              </SwiperSlide>
                            ))}
                          </Swiper>
                        ) : (
                          <div className="rounded-xl border border-dashed border-[#29435f] py-8 text-center"><ImageIcon size={32} className="mx-auto mb-2 text-slate-500" /><p className="text-sm text-slate-400">No gallery images added yet.</p></div>
                        )}
                      </div>

                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                        <h3 className="mb-4 text-lg font-bold text-white">Social Links</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                          {socialLinks.map((social, index) => {
                            const SocialIcon = getSocialIcon(social.platform);
                            return (
                              <a key={social._id || `${social.platform}-${index}`} href={social.url} target="_blank" rel="noreferrer" className="flex flex-col items-center justify-center gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:-translate-y-0.5 hover:border-cyan-400/50">
                                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400"><SocialIcon size={20} /></div>
                                <span className="text-xs font-semibold capitalize text-white">{social.platform || "Social"}</span>
                              </a>
                            );
                          })}
                          {socialLinks.length === 0 && <div className="col-span-full py-4 text-center text-sm text-slate-400">No social links added.</div>}
                        </div>
                      </div>

                      {/* REVIEWS SECTION (Cyan Theme) */}
                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                        <div className="mb-4 flex items-center justify-between">
                          <h3 className="text-lg font-bold text-white">Reviews</h3>
                          <button onClick={() => setShowReviewModal(true)} className="rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-1.5 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/20">Write Review</button>
                        </div>
                        <p className="text-sm text-slate-400">Be the first to share your experience with this business.</p>
                      </div>

                      <div className="rounded-2xl border border-[#29435f] bg-[#132942] p-6">
                        <h3 className="mb-4 text-lg font-bold text-white">Send an Inquiry</h3>
                        {formSubmitted ? (
                          <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-4 text-sm font-semibold text-emerald-300">Thank you! Your inquiry has been submitted.</div>
                        ) : (
                          <form onSubmit={handleFormSubmit} className="space-y-3">
                            <input type="text" required value={formData.name} onChange={(event) => setFormData({ ...formData, name: event.target.value })} placeholder="Your Name" className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400" />
                            <input type="tel" required value={formData.phone} onChange={(event) => setFormData({ ...formData, phone: event.target.value })} placeholder="Phone" className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400" />
                            <input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="Email (optional)" className="w-full rounded-lg border border-[#29435f] bg-[#0b1b30] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400" />
                            <textarea rows={3} value={formData.message} onChange={(event) => setFormData({ ...formData, message: event.target.value })} placeholder="Message" className="w-full resize-none rounded-lg border border-[#29435f] bg-[#0b1b30] px-4 py-2.5 text-sm text-white outline-none focus:border-cyan-400" />
                            <button type="submit" className="w-full rounded-lg bg-cyan-400 py-2.5 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-300">Submit Inquiry</button>
                          </form>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* FOOTER */}
                  <footer className="border-t border-[#29435f] bg-[#0b1b30] py-6 text-center">
                    <p className="text-xs text-slate-400">© {new Date().getFullYear()} {businessInfo.name}. All rights reserved.</p>
                    <p className="mt-1 text-xs text-slate-500">Powered by <span className="font-bold text-cyan-400">BioWebsite</span></p>
                  </footer>
                </div>
              </div>
            </div>
          </section>
        )}
      </main>

      {/* =====================================================
          EXPANDED QR MODAL (3 TABS)
      ===================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center bg-[#020817]/90 p-4 backdrop-blur-md" onClick={(event) => { if (event.target === event.currentTarget) setShowQrModal(false); }}>
          <div className="relative max-h-[92vh] w-full max-w-md overflow-y-auto rounded-[26px] border border-cyan-400/20 bg-[#0b1b30] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.65)] sm:p-7">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <button type="button" onClick={() => setShowQrModal(false)} aria-label="Close modal" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"><X size={18} /></button>

            <div className="mb-5 flex items-center gap-3 pr-10">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
                {qrModalTab === "share" ? <Share2 size={24} /> : qrModalTab === "myqr" ? <QrCode size={24} /> : <FileImage size={24} />}
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">
                  {qrModalTab === "share" ? "Share Profile" : qrModalTab === "myqr" ? "My QR Code" : "Profile Poster"}
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {qrModalTab === "share" ? "Copy or share your link" : qrModalTab === "myqr" ? "Scan to view my profile" : "Download your business card"}
                </p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-5 flex gap-1 rounded-xl border border-[#29435f] bg-[#132942] p-1">
              <button onClick={() => setQrModalTab("share")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${qrModalTab === "share" ? "bg-cyan-400 text-[#0b1b30]" : "text-slate-300 hover:text-white"}`}>Share</button>
              <button onClick={() => setQrModalTab("myqr")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${qrModalTab === "myqr" ? "bg-cyan-400 text-[#0b1b30]" : "text-slate-300 hover:text-white"}`}>My QR</button>
              <button onClick={() => setQrModalTab("poster")} className={`flex-1 rounded-lg py-2 text-xs font-bold transition ${qrModalTab === "poster" ? "bg-cyan-400 text-[#0b1b30]" : "text-slate-300 hover:text-white"}`}>Poster</button>
            </div>

            {/* Tab 1: Share */}
            {qrModalTab === "share" && (
              <div className="flex flex-col gap-3">
                <p className="text-xs font-semibold text-slate-300">Profile Link</p>
                <div className="flex items-center gap-2 rounded-xl border border-[#29435f] bg-[#132942] p-1">
                  <input type="text" value={window.location.href} readOnly className="w-full bg-transparent px-3 py-2 text-sm text-cyan-100 outline-none" />
                  <button onClick={handleCopyLink} className="shrink-0 rounded-lg bg-cyan-400 p-2 text-[#0b1b30] hover:bg-cyan-300 transition">
                    {copied ? <Check size={18} /> : <Copy size={18} />}
                  </button>
                </div>
                <button onClick={handleShare} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 py-3 text-sm font-bold text-[#0b1b30] transition hover:brightness-110">
                  <Share2 size={16} /> Share Link
                </button>
              </div>
            )}

            {/* Tab 2: My QR */}
            {qrModalTab === "myqr" && (
              <div className="flex flex-col items-center">
                {businessInfo.qrCode ? (
                  <div className="mb-5 rounded-xl bg-white p-4">
                    <img src={businessInfo.qrCode} alt="My QR Code" className="h-48 w-48 object-contain" />
                  </div>
                ) : (
                  <div className="mb-5 flex h-48 w-48 items-center justify-center rounded-xl border border-dashed border-[#29435f] bg-[#071326] text-slate-500">
                    <QrCode size={40} />
                  </div>
                )}
                <button type="button" onClick={handleDownloadQR} className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-3 text-sm font-bold text-cyan-400 transition hover:bg-cyan-400/20">
                  <Download size={16} /> Download QR Code
                </button>
              </div>
            )}

            {/* Tab 3: Poster */}
            {qrModalTab === "poster" && (
              <div className="flex flex-col items-center">
                {/* Mock Poster UI */}
                <div className="mb-5 w-full overflow-hidden rounded-xl border border-[#29435f] bg-[#132942] shadow-lg">
                  <div className="h-24 w-full bg-[#0b1b30] relative flex items-center justify-center">
                     {businessInfo.banner ? <img src={businessInfo.banner} className="h-full w-full object-cover opacity-50" alt="banner"/> : null}
                     <div className="absolute flex flex-col items-center">
                        <div className="h-16 w-16 overflow-hidden rounded-full border-2 border-cyan-400 bg-[#132942]">
                           {businessInfo.avatar ? <img src={businessInfo.avatar} className="h-full w-full object-cover" alt="avatar"/> : <UserPlus className="h-full w-full p-4 text-slate-500"/>}
                        </div>
                     </div>
                  </div>
                  <div className="p-4 text-center">
                     <h4 className="text-sm font-bold text-white">{businessInfo.name}</h4>
                     <p className="text-xs text-cyan-400">{businessInfo.role}</p>
                     <p className="text-[10px] text-slate-400 mt-1">{businessInfo.phone}</p>
                     <div className="mt-3 flex justify-center">
                        {businessInfo.qrCode ? <img src={businessInfo.qrCode} className="h-16 w-16 object-contain bg-white p-1 rounded-md" alt="QR"/> : <QrCode className="h-16 w-16 text-slate-500"/>}
                     </div>
                  </div>
                </div>
                <button type="button" onClick={handleDownloadPoster} className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-300">
                  <Download size={16} /> Download Poster
                </button>
              </div>
            )}
            
            <button type="button" onClick={() => setShowQrModal(false)} className="mt-5 w-full rounded-xl border border-[#29435f] bg-[#132942] py-3 text-sm font-bold text-white transition hover:border-cyan-400/50 hover:bg-[#193653]">
              Close
            </button>
          </div>
        </div>
      )}

      {/* PRODUCT DETAILS MODAL */}
      {selectedProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md" onClick={(event) => { if (event.target === event.currentTarget) setSelectedProduct(null); }}>
          <div className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-[26px] border border-[#45414a] bg-[#17171c] shadow-[0_30px_100px_rgba(0,0,0,0.55)]">
            <button type="button" onClick={() => setSelectedProduct(null)} aria-label="Close product details" className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl border border-[#45414a] bg-[#22222a]/90 text-slate-300 backdrop-blur transition hover:border-rose-300/30 hover:text-rose-200"><X size={18} /></button>
            {Array.isArray(selectedProduct.images) && selectedProduct.images.filter((image) => image?.url).length > 0 ? (
              <Swiper modules={[Navigation, Pagination]} navigation={selectedProduct.images.filter((image) => image?.url).length > 1} pagination={{ clickable: true }} spaceBetween={0} slidesPerView={1} loop={selectedProduct.images.filter((image) => image?.url).length > 1} className="h-60 w-full sm:h-80">
                {selectedProduct.images.filter((image) => image?.url).map((image, index) => (
                  <SwiperSlide key={image._id || index}><img src={image.url} alt={image.alt || selectedProduct.name} className="h-full w-full object-cover" /></SwiperSlide>
                ))}
              </Swiper>
            ) : (
              <div className="flex h-60 items-center justify-center text-7xl sm:h-80" style={{ background: `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.secondary}15)` }}>📦</div>
            )}
            <div className="p-5 sm:p-7">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0"><h3 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">{selectedProduct.name}</h3><span className="mt-2 inline-flex rounded-lg border border-white/15 bg-white/[0.06] px-3 py-1.5 text-xs font-semibold text-slate-200">{selectedProduct.category || "General"}</span></div>
                <span className="text-2xl font-extrabold text-amber-300 sm:text-3xl">₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}</span>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-300 sm:text-base sm:leading-8">{selectedProduct.description}</p>
              <div className="mt-5 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-2 text-sm font-bold text-emerald-300"><CheckCircle2 size={16} />{selectedProduct.status === "active" ? "Available" : "Unavailable"}</span>
                {businessInfo.upiId && <button type="button" onClick={() => { setSelectedProduct(null); handleContactClick("upi"); }} className="inline-flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-bold transition hover:brightness-110 active:scale-[0.98]" style={{ borderColor: `${currentTheme.primary}55`, backgroundColor: `${currentTheme.primary}18`, color: currentTheme.text }}><IndianRupee size={16} />Pay with UPI</button>}
                {(businessInfo.whatsapp || businessInfo.phone) && <button type="button" onClick={() => { setSelectedProduct(null); handleWhatsApp(); }} className="ml-auto inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 px-4 py-2.5 text-sm font-bold text-[#062c25] transition hover:brightness-110 active:scale-[0.98]"><FaWhatsapp size={16} />Enquire on WhatsApp</button>}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* GALLERY IMAGE MODAL */}
      {selectedGalleryImage && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/85 p-4 backdrop-blur-md" onClick={(event) => { if (event.target === event.currentTarget) setSelectedGalleryImage(null); }}>
          <div className="relative w-full max-w-3xl">
            <button type="button" onClick={() => setSelectedGalleryImage(null)} aria-label="Close gallery image" className="absolute -top-3 right-0 z-20 flex h-10 w-10 items-center justify-center rounded-xl border border-[#45414a] bg-[#22222a]/90 text-slate-300 backdrop-blur transition hover:border-rose-300/30 hover:text-rose-200 sm:-right-3"><X size={18} /></button>
            <div className="overflow-hidden rounded-[24px] border border-[#45414a] bg-[#17171c]">
              <img src={selectedGalleryImage.url} alt={selectedGalleryImage.alt} className="max-h-[75vh] w-full object-contain" />
              {selectedGalleryImage.caption && <div className="border-t border-white/10 px-5 py-4"><p className="text-sm font-semibold text-white">{selectedGalleryImage.caption}</p></div>}
            </div>
          </div>
        </div>
      )}

      {/* REVIEW MODAL (Cyan Theme) */}
      {showReviewModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md" onClick={(event) => { if (event.target === event.currentTarget) setShowReviewModal(false); }}>
          <div className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-[26px] border border-cyan-400/20 bg-[#0b1b30] p-5 shadow-[0_30px_100px_rgba(0,0,0,0.55)] sm:p-7">
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />
            <button type="button" onClick={() => setShowReviewModal(false)} aria-label="Close review modal" className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300 transition hover:border-cyan-400/50 hover:text-cyan-300"><X size={18} /></button>
            
            {reviewSubmitted ? (
              <div className="py-10 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 to-blue-500 shadow-lg shadow-cyan-400/10">
                  <Check size={29} className="text-[#0b1b30]" strokeWidth={3} />
                </div>
                <h3 className="mt-5 text-xl font-bold text-white">Thank You!</h3>
                <p className="mt-2 text-base text-slate-300">Thank you for your review!</p>
              </div>
            ) : (
              <form onSubmit={handleReviewSubmit}>
                <div className="mb-5 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                    <Star size={22} className="text-cyan-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-white">Write a Review</h3>
                    <p className="mt-1 text-sm text-slate-400">Share your experience with this business.</p>
                  </div>
                </div>
                
                <label htmlFor="review-name" className="mb-2 block text-sm font-semibold text-slate-200">Your Name</label>
                <input id="review-name" required value={reviewData.name} onChange={(event) => setReviewData({ ...reviewData, name: event.target.value })} placeholder="Enter your name" className="w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3.5 text-base text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.06]" />
                
                <p className="mb-3 mt-5 text-sm font-semibold text-slate-200">Your Rating</p>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((number) => (
                    <button key={number} type="button" onClick={() => setReviewRating(number)} aria-label={`Rate ${number} out of 5`} className="transition hover:scale-110">
                      <Star size={28} className={number <= reviewRating ? "fill-cyan-400 text-cyan-400" : "text-slate-600"} />
                    </button>
                  ))}
                </div>
                
                <label htmlFor="review-message" className="mb-2 mt-5 block text-sm font-semibold text-slate-200">Your Review</label>
                <textarea id="review-message" required rows={4} value={reviewData.review} onChange={(event) => setReviewData({ ...reviewData, review: event.target.value })} placeholder="Tell us about your experience..." className="w-full resize-y rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3.5 text-base leading-7 text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.06]" />
                
                <button type="submit" className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-blue-500 px-4 py-3.5 text-base font-bold text-[#0b1b30] transition hover:brightness-110 active:scale-[0.99]">
                  <Send size={17} /> Submit Review
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      <Payment isOpen={showPayment} onClose={() => setShowPayment(false)} upiId={profileData.upiId || ""} businessName={profileData.businessName || "My Business"} businessImage={profileData.logo || profileData.avatar || ""} />
    </div>
  );
};

export default Mini;