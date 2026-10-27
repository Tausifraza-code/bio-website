import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";

import {
  Upload,
  Image as ImageIcon,
  Trash2,
  RefreshCw,
  Info,
  Check,
  ChevronDown,
  Link as LinkIcon,
  User,
  Briefcase,
  Phone,
  MessageSquare,
  Mail,
  Loader2,
  Store,
  Navigation,
  MapPin,
  Clock,
  Wallet,
  Zap,
  Rocket,
  Save,
  AtSign,
  Building2,
  Globe,
  Camera,
  Palette,
  Pencil,
  Share2,
  QrCode,
  Download,
  CheckCircle2,
  Circle,
} from "lucide-react";

import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile, saveMyProfile } from "../redux/slice/profileSlice";

/* ==================== SHARED STYLES ==================== */

const inputCls =
  "w-full min-w-0 rounded-xl border border-[#29435f] bg-[#0b1b30] px-3.5 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition duration-200 hover:border-[#38516e] focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10";

const cardCls =
  "rounded-2xl border border-[#29435f] bg-[#132942]/80 p-4 sm:p-5";

const secondaryButtonCls =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-2.5 text-sm font-semibold text-slate-200 transition duration-200 hover:border-cyan-300/50 hover:bg-[#193754] hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonCls =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300 px-5 py-3 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/10 transition duration-200 hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50";

/* ==================== REUSABLE COMPONENTS ==================== */

const Divider = () => (
  <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#38516e] to-transparent sm:my-8" />
);

const Section = ({ icon: Icon, title, subtitle, children, className = "" }) => (
  <section className={`min-w-0 ${className}`}>
    <div className="mb-5 flex items-start gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-blue-400/5 text-cyan-200 shadow-inner shadow-cyan-300/5">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">
          {title}
        </h2>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">
            {subtitle}
          </p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
  icon: Icon,
  className = "",
  hint,
  ...props
}) => (
  <div className={`min-w-0 ${className}`}>
    <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
      {Icon && <Icon size={15} className="shrink-0 text-cyan-300" />}
      <span>{label}</span>
      {required && <span className="text-cyan-200">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputCls}
      {...props}
    />
    {hint && <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p>}
  </div>
);

const ImageUploader = ({
  title,
  recommendation,
  image,
  onUpload,
  onRemove,
}) => {
  const inputId = React.useId();

  return (
    <div className="group min-w-0 rounded-2xl border border-[#29435f] bg-[#132942]/65 p-4 transition duration-300 hover:border-cyan-300/30 hover:bg-[#132942] flex flex-col items-center text-center">
      <div className="mb-3">
        <p className="text-sm font-bold text-white">{title}</p>
        <p className="mt-1 text-[10px] text-slate-400">{recommendation}</p>
      </div>

      <div className="relative shrink-0 overflow-hidden rounded-xl border border-[#38516e] bg-[#0b1b30] h-20 w-20 mb-3">
        {image ? (
          <img
            src={image}
            alt={title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full flex-col items-center justify-center gap-1 text-slate-500">
            <ImageIcon size={20} strokeWidth={1.5} />
          </div>
        )}
        {image && (
          <div className="absolute bottom-1 right-1 flex h-5 w-5 items-center justify-center rounded-md border border-white/10 bg-[#0b1b30]/90 text-cyan-200 backdrop-blur">
            <Check size={10} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
        >
          {image ? <RefreshCw size={12} /> : <Upload size={12} />}
          {image ? "Change" : "Upload"}
        </label>
        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onUpload}
        />
        {image && (
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center justify-center rounded-lg border border-[#38516e] bg-[#0b1b30] p-1.5 text-slate-400 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const {
    profile,
    loading,
    saving: reduxSaving,
  } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("Profile");

  /* IMAGE STATES */
  const [avatar, setAvatar] = useState(null);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  /* PAGE STATES */
  const [activeTheme, setActiveTheme] = useState("sunset");
  const [selectedPlan, setSelectedPlan] = useState("1year");
  const [saved, setSaved] = useState(false);
  const [capturingGPS, setCapturingGPS] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    industry: "",
    subdomain: "",
    jobTitle: "",
    headline: "",
    bio: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    websiteUrl: "",
    shopUnit: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    mapLink: "",
    businessHours: "",
    upiId: "",
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;
    setFormData((prev) => ({ ...prev, ...profile }));
    setAvatar(profile.avatar || null);
    setLogo(profile.logo || null);
    setBanner(profile.banner || null);
    setQrCode(profile.qrCode || null);
    if (profile.activeTheme) setActiveTheme(profile.activeTheme);
    if (profile.selectedPlan) setSelectedPlan(profile.selectedPlan);
  }, [profile]);

  const handleUpload = (type) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) {
      console.error("No image file selected");
      return;
    }
    const allowedFields = ["avatar", "logo", "banner", "qrCode"];
    if (!allowedFields.includes(type)) {
      alert("Invalid image type");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("image", file, file.name);
      formData.append("field", type);
      const { data } = await api.post("/profile/upload-image", formData, {
        headers: { "Content-Type": undefined },
      });
      if (!data.success) throw new Error(data.message || "Image upload failed");
      const imageUrl = data.profile?.[type] || data.imageUrl;
      if (!imageUrl || imageUrl.startsWith("blob:")) {
        throw new Error("Permanent image URL was not returned");
      }
      const setters = {
        avatar: setAvatar,
        logo: setLogo,
        banner: setBanner,
        qrCode: setQrCode,
      };
      setters[type](imageUrl);
      setSaved(false);
      console.log(`${type} uploaded successfully:`, imageUrl);
    } catch (error) {
      console.error("Image upload failed:", error.response?.data || error);
      alert(error.response?.data?.message || error.message || "Image upload failed");
    } finally {
      event.target.value = "";
    }
  };

  useEffect(() => {
    const images = [avatar, logo, banner, qrCode];
    return () => {
      images.forEach((url) => {
        if (typeof url === "string" && url.startsWith("blob:")) {
          URL.revokeObjectURL(url);
        }
      });
    };
  }, [avatar, logo, banner, qrCode]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleAutoCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }
    setCapturingGPS(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        handleChange("mapLink", `https://maps.google.com/?q=${latitude},${longitude}`);
        setCapturingGPS(false);
      },
      () => {
        setCapturingGPS(false);
        alert("Unable to access your location. Please allow location permission and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    setSaved(false);
    const profileDataToSave = {
      ...formData,
      avatar,
      logo,
      banner,
      qrCode,
      activeTheme,
      selectedPlan,
    };
    try {
      await dispatch(saveMyProfile(profileDataToSave)).unwrap();
      setSaved(true);
      navigate("/mini", { replace: true });
    } catch (error) {
      console.error("Profile save failed:", error);
      alert(typeof error === "string" ? error : "Profile save nahi hua. Please try again.");
    }
  };

  /* DATA */
  const themes = [
    { id: "executive", name: "Executive Royal", category: "Corporate & Tech", description: "Prestigious sapphire and royal indigo frosted glass for corporate...", colors: ["#1e3a8a", "#7c3aed"] },
    { id: "emerald", name: "Emerald Luxe", category: "Medical & Property", description: "Deep imperial emerald and luminous jade for health, clinics...", colors: ["#10b981", "#14b8a6"] },
    { id: "rose", name: "Rose Gold & Champagne", category: "Fashion & Salon", description: "Shimmering blush champagne and rose gold for boutiques, fashion...", colors: ["#f43f5e", "#fb923c"] },
    { id: "obsidian", name: "Obsidian Noir & Platinum", category: "Barber & Executive", description: "Smoked glass, titanium graphite and platinum chrome for...", colors: ["#334155", "#94a3b8"] },
    { id: "sunset", name: "Sunset Amber & Coral", category: "Creative & Cafe", description: "Radiant golden tangerine and warm amber coral for creative...", colors: ["#f59e0b", "#f97316"] },
  ];

  const industries = [
    "General Service Provider / Other", "Business Owner / Professional", "Retail & E-commerce", "Healthcare & Wellness", "Education & Training", "Food & Beverage", "Real Estate", "IT & Software", "Creative & Design", "Finance & Legal",
  ];

  const quickHandles = ["@okaxis", "@okhdfcbank", "@oksbi", "@paytm", "@ybl", "@ibl"];
  
  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  // Safe Dynamic Profile Completion (FIXED ERROR)
  const totalFields = Object.keys(formData).length + 4; // formData fields + 4 images
  const filledFields = Object.values(formData).filter((val) => {
    if (val === null || val === undefined) return false;
    if (typeof val === "string") return val.trim() !== "";
    return true; // For numbers, booleans, etc.
  }).length + [avatar, logo, banner, qrCode].filter(Boolean).length;
  
  const completionPercentage = Math.min(100, Math.round((filledFields / totalFields) * 100));

  return (
    <div className="relative min-h-screen overflow-hidden  px-1 py-5 text-white sm:px-5 sm:py-7 lg:px-8 font-sans">
      
      {/* HEADER */}
      <header className="relative mx-auto w-full max-w-[1350px] mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[#29435f] pb-5">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Update your profile information and make your digital identity more attractive.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="rounded-xl border border-[#38516e] bg-[#132942] px-5 py-2.5 text-sm font-semibold text-slate-300 transition hover:bg-[#193754]">
            Cancel
          </button>
          <button
            onClick={handleSave}
            disabled={loading || reduxSaving}
            className={primaryButtonCls}
          >
            {loading || reduxSaving ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
            {reduxSaving ? "Saving..." : saved ? "Saved!" : "Save Changes"}
          </button>
        </div>
      </header>

      <div className="relative mx-auto w-full max-w-[1350px] grid grid-cols-1 gap-6 lg:grid-cols-3">
        
        {/* LEFT COLUMN */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* PROFILE PREVIEW CARD (Dynamic Data) */}
          <div className="overflow-hidden rounded-3xl border border-[#29435f] bg-[#132942]/80 shadow-2xl">
            <div 
              className="h-40 w-full bg-[#0b1b30] bg-cover bg-center relative"
              style={{ backgroundImage: banner ? `url(${banner})` : "none" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-[#132942] to-transparent opacity-80" />
            </div>
            <div className="relative px-6 pb-6 pt-0">
              <div className="absolute -top-12 left-6 h-24 w-24 overflow-hidden rounded-full border-4 border-[#132942] bg-[#0b1b30]">
                {avatar ? (
                  <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-slate-500 bg-[#132942]">
                    <User size={40} />
                  </div>
                )}
              </div>

              <div className="flex flex-col gap-4 pt-14 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-white">
                    {[formData.firstName, formData.lastName].filter(Boolean).join(" ") || "Your Name"}
                  </h2>
                  <p className="text-sm font-medium text-cyan-400 mt-0.5">
                    {formData.jobTitle || "Your Designation"}
                  </p>
                  {(formData.city || formData.state) && (
                    <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                      <MapPin size={12} /> 
                      {[formData.city, formData.state].filter(Boolean).join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                <button className="flex items-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 transition">
                  <Pencil size={14} /> Edit
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 transition">
                  <Share2 size={14} /> Share
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 transition">
                  <QrCode size={14} /> QR Code
                </button>
                <button className="flex items-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-4 py-2 text-xs font-semibold text-slate-300 hover:border-cyan-300/50 hover:text-cyan-200 transition">
                  <Download size={14} /> Save Contact
                </button>
              </div>
            </div>
          </div>

          {/* TABS */}
          <div className="flex overflow-x-auto border-b border-[#29435f] bg-[#132942]/80 rounded-t-2xl px-2 no-scrollbar">
            {["Profile", "Professional", "Contact & Address", "Gallery & QR", "Appearance"].map((tab) => (
              <button 
                key={tab} 
                onClick={() => setActiveTab(tab)}
                className={`whitespace-nowrap px-5 py-4 text-sm font-semibold transition ${activeTab === tab ? "border-b-2 border-cyan-400 text-cyan-400" : "text-slate-400 hover:text-slate-200"}`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="rounded-b-3xl border-x border-b border-[#29435f] bg-[#10233b]/90 p-5 sm:p-7">
            
            {/* TAB 1: PROFILE */}
            {activeTab === "Profile" && (
              <div className="space-y-8 animate-fadeIn">
                <Section title="Profile Images" subtitle="Upload your profile photo, banner, logo and QR code." icon={Camera}>
                  <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <ImageUploader title="Profile Photo" recommendation="400x400 px" image={avatar} onUpload={handleUpload("avatar")} onRemove={() => setAvatar(null)} />
                    <ImageUploader title="Cover Banner" recommendation="1200x500 px" image={banner} onUpload={handleUpload("banner")} onRemove={() => setBanner(null)} />
                    <ImageUploader title="Logo" recommendation="400x400 px" image={logo} onUpload={handleUpload("logo")} onRemove={() => setLogo(null)} />
                    <ImageUploader title="QR Code" recommendation="Square" image={qrCode} onUpload={handleUpload("qrCode")} onRemove={() => setQrCode(null)} />
                  </div>
                </Section>

                <Divider />

                <Section title="Basic Information" subtitle="Enter your personal details and business category." icon={User}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="First Name" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="First name" required />
                    <Field label="Last Name" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last name" required />
                    <Field label="Business Name" value={formData.businessName} onChange={(e) => handleChange("businessName", e.target.value)} placeholder="Business name" required />
                    
                    <div className="min-w-0">
                      <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                        <Building2 size={15} className="text-cyan-300" /> Your Industry / Category <span className="text-cyan-200">*</span>
                      </label>
                      <div className="relative">
                        <select value={formData.industry} onChange={(e) => handleChange("industry", e.target.value)} className={`${inputCls} appearance-none pr-10`}>
                          <option value="" disabled className="bg-[#132942] text-slate-400">Select Industry</option>
                          {industries.map((industry) => <option key={industry} value={industry} className="bg-[#132942] text-white">{industry}</option>)}
                        </select>
                        <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200" />
                      </div>
                    </div>

                    <Field label="Job Title / Role" icon={Briefcase} value={formData.jobTitle} onChange={(e) => handleChange("jobTitle", e.target.value)} placeholder="Business Owner / Professional" />
                    <Field label="Short Headline / Slogan" value={formData.headline} onChange={(e) => handleChange("headline", e.target.value)} placeholder="Your short tagline" />
                    
                    <div className="sm:col-span-2">
                      <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                        <User size={15} className="text-cyan-300" /> About / Business Bio
                      </label>
                      <textarea rows={4} maxLength={500} value={formData.bio} onChange={(e) => handleChange("bio", e.target.value)} placeholder="Tell customers about your business..." className={`${inputCls} resize-y`} />
                      <div className="mt-2 flex justify-between">
                        <p className="text-xs text-slate-400">Keep your introduction clear and customer-friendly.</p>
                        <p className="text-xs font-semibold text-cyan-200">{formData.bio.length} / 500 characters</p>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* TAB 2: PROFESSIONAL */}
            {activeTab === "Professional" && (
              <div className="space-y-8 animate-fadeIn">
                <Section title="Business Details" subtitle="Manage your working hours and main website." icon={Briefcase}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <Field label="Business Hours" icon={Clock} value={formData.businessHours} onChange={(e) => handleChange("businessHours", e.target.value)} placeholder="Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed" />
                    <Field label="Website URL" icon={Globe} type="url" value={formData.websiteUrl} onChange={(e) => handleChange("websiteUrl", e.target.value)} placeholder="https://..." />
                  </div>
                </Section>

                <Divider />

                <Section title="Custom Shop Subdomain" subtitle="Manage the web handle associated with your digital visiting card." icon={Globe}>
                  <div className={cardCls}>
                    <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                      <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 focus-within:border-cyan-300">
                        <span className="shrink-0 text-xs text-slate-400">https://</span>
                        <input
                          type="text"
                          value={formData.subdomain}
                          onChange={(e) => handleChange("subdomain", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                          className="min-w-0 flex-1 bg-transparent px-2 py-3 font-mono text-sm text-cyan-100 outline-none"
                          aria-label="Custom subdomain"
                        />
                      </div>
                      <span className="rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 py-3 text-xs text-slate-400">.yourdomain.com</span>
                    </div>

                    <div className="mt-5 rounded-xl border border-[#29435f] bg-[#0b1b30]/70 p-3.5">
                      <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                        <LinkIcon size={14} className="text-cyan-300" />
                        Current direct link
                      </div>
                      <a href={formData.website} target="_blank" rel="noreferrer" className="block break-all text-sm font-medium leading-6 text-cyan-200 transition hover:text-cyan-100 hover:underline">
                        {formData.website || "No link added yet"}
                      </a>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* TAB 3: CONTACT & ADDRESS */}
            {activeTab === "Contact & Address" && (
              <div className="space-y-8 animate-fadeIn">
                <Section title="Contact Information" subtitle="Help customers reach you through their preferred contact method." icon={Phone}>
                  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                    <Field label="Phone Number" icon={Phone} type="tel" value={formData.phone} onChange={(e) => handleChange("phone", e.target.value)} placeholder="8956235689" required />
                    <Field label="WhatsApp Number" icon={MessageSquare} type="tel" value={formData.whatsapp} onChange={(e) => handleChange("whatsapp", e.target.value)} placeholder="918956235689" />
                    <Field label="Email ID" icon={Mail} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@business.com" required />
                    <Field label="Website / Card Link" icon={LinkIcon} type="url" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://..." />
                  </div>
                </Section>

                <Divider />

                <Section title="Storefront Address" subtitle="Set your business location so customers can identify your shop." icon={Store}>
                  <div className={cardCls}>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                      <Field label="Shop / Unit Number" value={formData.shopUnit} onChange={(e) => handleChange("shopUnit", e.target.value)} placeholder="E.g. Shop 12, Ground Floor" />
                      <Field label="Area / Locality" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} placeholder="E.g. Andheri West" />
                    </div>
                    <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                      <Field label="City" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Enter city" />
                      <Field label="State" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} placeholder="Enter state" />
                      <Field label="Pincode" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} placeholder="E.g. 400070" />
                    </div>
                    <div className="mt-4">
                      <Field label="Landmark (Optional)" value={formData.landmark} onChange={(e) => handleChange("landmark", e.target.value)} placeholder="E.g. Opposite Phoenix Marketcity" />
                    </div>

                    <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#0b1b30]/75 p-4">
                      <div className="mb-3 flex items-center gap-2">
                        <MapPin size={17} className="text-cyan-200" />
                        <label className="text-sm font-bold text-white">Google Maps Shop Directions Link</label>
                      </div>
                      <div className="flex flex-col gap-3 lg:flex-row">
                        <input type="url" value={formData.mapLink} onChange={(e) => handleChange("mapLink", e.target.value)} placeholder="https://maps.app.goo.gl/..." className={`${inputCls} min-w-0 flex-1`} />
                        <button type="button" onClick={handleAutoCaptureGPS} disabled={capturingGPS} className={secondaryButtonCls}>
                          {capturingGPS ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} className="text-cyan-200" />}
                          {capturingGPS ? "Capturing Location..." : "Capture My GPS"}
                        </button>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* TAB 4: GALLERY & QR */}
            {activeTab === "Gallery & QR" && (
              <div className="space-y-8 animate-fadeIn">
                <Section title="Receive Payments & UPI" subtitle="Add your merchant UPI ID and upload your payment QR code for customers." icon={Wallet}>
                  <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                    <div className={cardCls}>
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200"><Wallet size={19} /></div>
                        <div>
                          <h3 className="text-sm font-bold text-white">Merchant UPI ID</h3>
                          <p className="mt-1 text-xs text-slate-400">Your payment address</p>
                        </div>
                      </div>
                      <Field label="UPI ID (Unified Payments Interface)" icon={AtSign} value={formData.upiId} onChange={(e) => handleChange("upiId", e.target.value)} placeholder="yourbusiness@okaxis" />
                      <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">Quick UPI handles</p>
                      <div className="flex flex-wrap gap-2">
                        {quickHandles.map((handle) => (
                          <button
                            key={handle}
                            type="button"
                            onClick={() => {
                              const base = formData.upiId.split("@")[0] || "yourbusiness";
                              handleChange("upiId", `${base}${handle}`);
                            }}
                            className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${formData.upiId.endsWith(handle) ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100" : "border-[#38516e] bg-[#0b1b30] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"}`}
                          >
                            {handle}
                          </button>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-4">
                      <div className="flex flex-col justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-300/[0.08] to-blue-400/[0.04] p-5 text-center">
                        <Zap size={32} className="mx-auto text-cyan-300 mb-3" />
                        <p className="text-sm font-bold text-cyan-100">UPI Payment Setup</p>
                        <p className="mt-2 text-xs leading-5 text-slate-300">Your UPI ID and payment QR are collected here for your card. The public card must implement the payment action.</p>
                      </div>
                    </div>
                  </div>
                </Section>
              </div>
            )}

            {/* TAB 5: APPEARANCE */}
            {activeTab === "Appearance" && (
              <div className="space-y-8 animate-fadeIn">
                <Section title="Mini Website Visual Themes" subtitle="Choose the appearance of your public visiting card." icon={Palette}>
                  <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-sm font-bold text-white">Available designs</p>
                      <p className="mt-1 text-xs text-slate-400">{themes.length} themes available</p>
                    </div>
                    <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-3 py-2.5">
                      <span className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10" style={{ background: `linear-gradient(135deg, ${activeThemeData?.colors[0]}, ${activeThemeData?.colors[1]})` }} />
                      <span className="text-xs text-slate-300">Active theme:</span>
                      <span className="text-xs font-bold text-cyan-200">{activeThemeData?.name}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
                    {themes.map((theme) => {
                      const isActive = activeTheme === theme.id;
                      return (
                        <button
                          key={theme.id}
                          type="button"
                          onClick={() => { setActiveTheme(theme.id); setSaved(false); }}
                          className={`group relative min-w-0 overflow-hidden rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${isActive ? "border-cyan-300/60 bg-cyan-300/[0.07] shadow-lg shadow-cyan-300/5 ring-1 ring-cyan-300/15" : "border-[#29435f] bg-[#132942]/60 hover:border-[#38516e]"}`}
                        >
                          <div className="mb-4 h-16 overflow-hidden rounded-xl border border-white/10 p-1.5" style={{ background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})` }}>
                             <div className="flex h-full flex-col justify-between rounded-lg border border-white/20 bg-black/10 p-1.5">
                                <div className="flex items-center gap-1"><span className="h-4 w-4 rounded-md border border-white/30 bg-white/20" /><span className="h-1 w-10 rounded-full bg-white/70" /></div>
                                <div className="space-y-1"><div className="h-1 w-3/4 rounded-full bg-white/80" /><div className="h-1 w-1/2 rounded-full bg-white/40" /></div>
                             </div>
                          </div>
                          <div className="flex items-start justify-between gap-2">
                            <h3 className="text-xs font-bold leading-5 text-white">{theme.name}</h3>
                            {isActive && <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-cyan-300 text-[#0b1b30]"><Check size={12} strokeWidth={3} /></span>}
                          </div>
                          <p className="mt-1 text-[10px] font-medium text-cyan-200">{theme.category}</p>
                        </button>
                      );
                    })}
                  </div>
                </Section>

                <Divider />

                <Section title="Plan & Publish" subtitle="Select your plan and save the profile form." icon={Rocket}>
                  <div className="flex flex-col gap-4 sm:flex-row">
                    <button type="button" onClick={() => { setSelectedPlan("1year"); setSaved(false); }} className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition ${selectedPlan === "1year" ? "border-cyan-300/60 bg-cyan-300/[0.08]" : "border-[#38516e] bg-[#0b1b30]/70"}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedPlan === "1year" ? "bg-cyan-300 text-[#0b1b30]" : "bg-[#132942] text-slate-300"}`}><Rocket size={19} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">1 Year</p>
                        <p className="text-lg font-extrabold text-cyan-200">₹499</p>
                      </div>
                      {selectedPlan === "1year" && <Check size={18} className="text-cyan-200" />}
                    </button>
                    <button type="button" onClick={() => { setSelectedPlan("3years"); setSaved(false); }} className={`flex flex-1 items-center gap-3 rounded-2xl border p-4 text-left transition ${selectedPlan === "3years" ? "border-cyan-300/60 bg-cyan-300/[0.08]" : "border-[#38516e] bg-[#0b1b30]/70"}`}>
                      <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${selectedPlan === "3years" ? "bg-cyan-300 text-[#0b1b30]" : "bg-[#132942] text-slate-300"}`}><Rocket size={19} /></div>
                      <div className="flex-1">
                        <p className="text-sm font-bold text-white">3 Years</p>
                        <p className="text-lg font-extrabold text-cyan-200">₹799</p>
                      </div>
                      {selectedPlan === "3years" && <Check size={18} className="text-cyan-200" />}
                    </button>
                  </div>
                </Section>
              </div>
            )}

            {/* BOTTOM SAVE BUTTON & STATUS */}
            <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-[#29435f] pt-6">
              {saved && (
                <div className="flex items-center gap-2 text-sm font-bold text-cyan-300 bg-cyan-300/10 px-4 py-2 rounded-xl border border-cyan-300/20">
                  <Check size={16} /> Profile Saved Successfully!
                </div>
              )}
              <div className="w-full sm:w-auto sm:ml-auto">
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={loading || reduxSaving}
                  className={`${primaryButtonCls} w-full sm:w-auto min-w-[200px]`}
                >
                  {loading || reduxSaving ? <Loader2 size={17} className="animate-spin" /> : <Save size={17} />}
                  {reduxSaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN (SIDEBAR) - Dynamic Data */}
        <div className="space-y-6">
          
          {/* DYNAMIC PROFILE COMPLETION */}
          <div className="rounded-3xl border border-[#29435f] bg-[#132942]/80 p-6 shadow-xl">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-white">
              <User size={16} className="text-cyan-400" /> Profile Completion
            </h3>
            <div className="flex items-center gap-4 border-b border-[#29435f] pb-5">
              <div className="relative h-20 w-20 flex-shrink-0">
                <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
                  <path className="text-[#0b1b30]" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-cyan-400" strokeWidth="3" strokeDasharray={`${completionPercentage}, 100`} strokeLinecap="round" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-base font-extrabold text-white">{completionPercentage}%</div>
              </div>
              <div>
                <p className="text-sm font-bold text-white">
                  {completionPercentage === 100 ? "Perfect!" : completionPercentage > 50 ? "Looking Good!" : "Needs Work"}
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-400">Complete your profile to get more visibility and engagement.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3.5">
              {[
                { label: "Basic Information", key: "firstName" },
                { label: "Profile Photo", key: "avatar" },
                { label: "Banner Image", key: "banner" },
                { label: "About Me", key: "bio" },
                { label: "Contact Details", key: "phone" },
                { label: "Business Hours", key: "businessHours" },
                { label: "Payment / UPI", key: "upiId" },
                { label: "QR Code", key: "qrCode" },
              ].map((item, idx) => {
                const isDone = item.key === "avatar" ? !!avatar : item.key === "banner" ? !!banner : item.key === "qrCode" ? !!qrCode : !!formData[item.key];
                return (
                  <div key={idx} className={`flex items-center gap-3 text-xs font-medium ${isDone ? "text-slate-300" : "text-slate-500"}`}>
                    {isDone ? <CheckCircle2 size={16} className="text-cyan-400" /> : <Circle size={16} className="text-slate-600" />}
                    {item.label}
                  </div>
                );
              })}
            </div>
          </div>

          {/* QUICK TIPS */}
          <div className="rounded-3xl border border-[#29435f] bg-[#132942]/80 p-6 shadow-xl">
            <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-white">
              <Zap size={16} className="text-cyan-400" /> Quick Tips
            </h3>
            <ul className="space-y-4 text-xs leading-5 text-slate-300">
              <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> Upload a professional profile photo</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> Add a cover banner image</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> Complete all fields for better visibility</li>
              <li className="flex items-start gap-3"><span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-cyan-400" /> Keep your bio short and engaging</li>
            </ul>
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-[#29435f] bg-gradient-to-br from-[#132942] to-[#0b1b30] p-6 shadow-xl text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
              <Rocket size={24} />
            </div>
            <h3 className="text-sm font-bold text-white">Make Your Profile Stand Out</h3>
            <p className="mt-2 text-xs leading-5 text-slate-400">Get more visitors, more views and more opportunities with a complete profile.</p>
            <button className="mt-5 w-full rounded-xl bg-cyan-400/10 py-3 text-xs font-bold text-cyan-400 border border-cyan-400/20 hover:bg-cyan-400/20 transition">
              View Insights
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default EditProfile;