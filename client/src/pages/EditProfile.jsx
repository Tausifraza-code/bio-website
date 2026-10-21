import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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
} from "lucide-react";

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
  kind = "square",
}) => {
  const inputId = React.useId();

  return (
    <div className="group min-w-0 rounded-2xl border border-[#29435f] bg-[#132942]/65 p-4 transition duration-300 hover:border-cyan-300/30 hover:bg-[#132942]">
      <div className="mb-4 flex flex-wrap items-start justify-between gap-2">
        <div>
          <p className="text-sm font-bold text-white">{title}</p>
          <p className="mt-1 text-xs text-slate-400">{recommendation}</p>
        </div>

        <div className="flex h-8 w-8 items-center justify-center rounded-xl border border-[#38516e] bg-[#0b1b30] text-cyan-200">
          <ImageIcon size={16} />
        </div>
      </div>

      <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-center">
        <div
          className={`relative shrink-0 overflow-hidden rounded-2xl border border-[#38516e] bg-[#0b1b30] ${
            kind === "banner" ? "h-24 w-full sm:w-36" : "h-24 w-24"
          }`}
        >
          {image ? (
            <img
              src={image}
              alt={title}
              className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full flex-col items-center justify-center gap-2 text-slate-500">
              <ImageIcon size={25} strokeWidth={1.5} />
              <span className="text-[10px]">No image</span>
            </div>
          )}

          {image && (
            <div className="absolute bottom-2 right-2 flex h-6 w-6 items-center justify-center rounded-lg border border-white/10 bg-[#0b1b30]/90 text-cyan-200 backdrop-blur">
              <Check size={13} />
            </div>
          )}
        </div>

        <div className="min-w-0 flex-1 space-y-2.5">
          <label
            htmlFor={inputId}
            className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-cyan-300/25 bg-cyan-300/10 px-3 py-3 text-sm font-semibold text-cyan-100 transition hover:border-cyan-200/50 hover:bg-cyan-300/15"
          >
            {image ? <RefreshCw size={16} /> : <Upload size={16} />}
            {image ? "Change Image" : "Upload Image"}
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
              className="flex w-full items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-3 py-2.5 text-sm font-medium text-slate-300 transition hover:border-red-400/30 hover:bg-red-400/5 hover:text-red-300"
            >
              <Trash2 size={14} />
              Remove Image
            </button>
          )}
        </div>
      </div>

      <p className="mt-4 flex items-start gap-2 border-t border-[#29435f] pt-3 text-xs leading-5 text-slate-400">
        <Info size={14} className="mt-0.5 shrink-0 text-cyan-300" />
        JPG, PNG, WebP or GIF. Maximum file size: 5 MB.
      </p>
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */

const EditProfile = () => {
  /* IMAGE STATES */

  const [avatar, setAvatar] = useState("https://i.pravatar.cc/200?img=12");

  const [logo, setLogo] = useState(null);

  const [banner, setBanner] = useState(
    "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200",
  );

  const [qrCode, setQrCode] = useState(null);

  /* PAGE STATES */

  const [activeTheme, setActiveTheme] = useState("sunset");
  const [selectedPlan, setSelectedPlan] = useState("1year");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [capturingGPS, setCapturingGPS] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "ankit",
    lastName: "",
    businessName: "ankit's Business",
    industry: "General Service Provider / Other",
    subdomain: "ankits-business",
    jobTitle: "Business Owner / Professional",
    headline: "Welcome to my official digital visiting card & mini website",
    bio: "Welcome to ankit's Business! Contact me directly for appointments, consultations, orders, or service inquiries.",
    phone: "8956235689",
    whatsapp: "918956235689",
    email: "ankit123@gmail.com",
    website: "https://digital-eight-liart.vercel.app/card-ankits-business",
    shopUnit: "",
    area: "",
    city: "India",
    state: "",
    pincode: "",
    landmark: "",
    mapLink: "",
    businessHours: "Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed",
    websiteUrl: "https://digital-eight-liart.vercel.app/?card",
    upiId: "",
  });

  // LOAD SAVED PROFILE DATA
  useEffect(() => {
    try {
      const savedData = localStorage.getItem("bioProfileData");

      if (!savedData) return;

      const profile = JSON.parse(savedData);

      // Load saved text fields without removing default fields
      setFormData((prev) => ({
        ...prev,
        ...profile,
      }));

      // Restore images only when their URLs can be reused.
      // Blob URLs are temporary and cannot survive a page refresh.
      const isReusableImage = (url) =>
        typeof url === "string" && url.length > 0 && !url.startsWith("blob:");

      if (isReusableImage(profile.avatar)) {
        setAvatar(profile.avatar);
      } else if (profile.avatar === null) {
        setAvatar(null);
      }

      if (isReusableImage(profile.logo)) {
        setLogo(profile.logo);
      } else if (profile.logo === null) {
        setLogo(null);
      }

      if (isReusableImage(profile.banner)) {
        setBanner(profile.banner);
      } else if (profile.banner === null) {
        setBanner(null);
      }

      if (isReusableImage(profile.qrCode)) {
        setQrCode(profile.qrCode);
      } else if (profile.qrCode === null) {
        setQrCode(null);
      }

      if (profile.activeTheme) {
        setActiveTheme(profile.activeTheme);
      }

      if (profile.selectedPlan) {
        setSelectedPlan(profile.selectedPlan);
      }
    } catch (error) {
      console.error("Error loading saved profile:", error);
    }
  }, []);

  /* IMAGE UPLOAD */

  const handleUpload = (type) => (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    const maxSize = 5 * 1024 * 1024;

    if (file.size > maxSize) {
      alert("Image size should be less than 5 MB.");
      event.target.value = "";
      return;
    }

    // QR code ko permanent data URL mein convert karo
    if (type === "qr") {
      const reader = new FileReader();

      reader.onload = () => {
        setQrCode(reader.result);
        setSaved(false);
      };

      reader.onerror = () => {
        alert("QR code read nahi ho paya. Please try again.");
      };

      reader.readAsDataURL(file);
    } else {
      // Baaki images ka existing behavior preserve karo
      const url = URL.createObjectURL(file);

      const setters = {
        avatar: setAvatar,
        logo: setLogo,
        banner: setBanner,
      };

      setters[type]?.(url);
      setSaved(false);
    }

    event.target.value = "";
  };

  /* CLEAN UP TEMPORARY IMAGE URLS */

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

  /* FORM HANDLERS */

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

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

        handleChange(
          "mapLink",
          `https://maps.google.com/?q=${latitude},${longitude}`,
        );

        setCapturingGPS(false);
      },
      () => {
        setCapturingGPS(false);

        alert(
          "Unable to access your location. Please allow location permission and try again.",
        );
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
      },
    );
  };

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    try {
      const profileDataToSave = {
        ...formData,
        avatar,
        logo,
        banner,
        qrCode,
        activeTheme,
        selectedPlan,
      };

      localStorage.setItem("bioProfileData", JSON.stringify(profileDataToSave));

      window.dispatchEvent(new Event("bioProfileUpdated"));
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
      }, 2500);
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("Profile save nahi hua. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  /* DATA */

  const themes = [
    {
      id: "executive",
      name: "Executive Royal",
      category: "Corporate & Tech",
      description:
        "Prestigious sapphire and royal indigo frosted glass for corporate...",
      colors: ["#1e3a8a", "#7c3aed"],
    },
    {
      id: "emerald",
      name: "Emerald Luxe",
      category: "Medical & Property",
      description:
        "Deep imperial emerald and luminous jade for health, clinics...",
      colors: ["#10b981", "#14b8a6"],
    },
    {
      id: "rose",
      name: "Rose Gold & Champagne",
      category: "Fashion & Salon",
      description:
        "Shimmering blush champagne and rose gold for boutiques, fashion...",
      colors: ["#f43f5e", "#fb923c"],
    },
    {
      id: "obsidian",
      name: "Obsidian Noir & Platinum",
      category: "Barber & Executive",
      description: "Smoked glass, titanium graphite and platinum chrome for...",
      colors: ["#334155", "#94a3b8"],
    },
    {
      id: "sunset",
      name: "Sunset Amber & Coral",
      category: "Creative & Cafe",
      description:
        "Radiant golden tangerine and warm amber coral for creative...",
      colors: ["#f59e0b", "#f97316"],
    },
  ];

  const industries = [
    "General Service Provider / Other",
    "Business Owner / Professional",
    "Retail & E-commerce",
    "Healthcare & Wellness",
    "Education & Training",
    "Food & Beverage",
    "Real Estate",
    "IT & Software",
    "Creative & Design",
    "Finance & Legal",
  ];

  const quickHandles = [
    "@okaxis",
    "@okhdfcbank",
    "@oksbi",
    "@paytm",
    "@ybl",
    "@ibl",
  ];

  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0b1b30] px-3 py-5 text-white sm:px-5 sm:py-7 lg:px-8">
      {/* BACKGROUND DECORATION */}

      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-cyan-400/[0.06] blur-3xl" />
        <div className="absolute -left-40 top-[38%] h-96 w-96 rounded-full bg-blue-400/[0.05] blur-3xl" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(#94a3b8 1px, transparent 1px), linear-gradient(90deg, #94a3b8 1px, transparent 1px)",
            backgroundSize: "36px 36px",
          }}
        />
      </div>

      <div className="relative mx-auto w-full max-w-[1350px]">
        {/* PAGE HEADER */}

        <header className="mb-6 overflow-hidden rounded-3xl border border-[#29435f] bg-gradient-to-br from-[#132942] via-[#10233b] to-[#0d2037] shadow-2xl shadow-black/10">
          <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500" />

          <div className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="min-w-0">
              <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.15em] text-cyan-200">
                <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-300" />
                Profile Workspace
              </div>

              <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl lg:text-4xl">
                Edit Your Profile
              </h1>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400 sm:text-base">
                Manage your business identity, branding, contact information and
                digital visiting card from one place.
              </p>

              <div className="mt-4 flex flex-wrap items-center gap-2 text-xs font-medium text-slate-300">
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#38516e] bg-[#0b1b30]/70 px-3 py-2">
                  <User size={14} className="text-cyan-300" />
                  Personal details
                </span>

                <span className="inline-flex items-center gap-1.5 rounded-lg border border-[#38516e] bg-[#0b1b30]/70 px-3 py-2">
                  <Palette size={14} className="text-cyan-300" />
                  Brand customization
                </span>
              </div>
            </div>

            <div className="flex min-w-0 items-center gap-3 rounded-2xl border border-[#38516e] bg-[#0b1b30]/70 p-3.5 sm:min-w-[245px]">
              <div className="h-14 w-14 shrink-0 overflow-hidden rounded-2xl border border-cyan-300/30 bg-[#132942] p-0.5">
                {avatar ? (
                  <img
                    src={avatar}
                    alt="Profile"
                    className="h-full w-full rounded-[13px] object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-cyan-200">
                    <User size={23} />
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Current profile
                </p>

                <p className="mt-1 truncate text-base font-bold text-white">
                  {[formData.firstName, formData.lastName]
                    .filter(Boolean)
                    .join(" ") || "Your Name"}
                </p>

                <p className="mt-1 truncate text-xs text-cyan-200">
                  {formData.businessName || "Your Business"}
                </p>
              </div>

              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                <Check size={16} />
              </div>
            </div>
          </div>
        </header>

        {/* MAIN FORM PANEL */}

        <div className="overflow-hidden rounded-3xl border border-[#29435f] bg-[#10233b]/90 shadow-2xl shadow-black/20 backdrop-blur-sm">
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-300/60 to-transparent" />

          <div className="p-4 sm:p-6 lg:p-8">
            {/* SECTION 1: IMAGES */}

            <Section
              icon={Camera}
              title="Profile Photo, Logo & Header Banner"
              subtitle="Give your digital visiting card a professional identity with your profile photo, brand logo and cover banner."
            >
              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <ImageUploader
                  title="Profile Photo / Avatar"
                  recommendation="Recommended: 400 × 400 px"
                  image={avatar}
                  onUpload={handleUpload("avatar")}
                  onRemove={() => setAvatar(null)}
                />

                <ImageUploader
                  title="Brand Logo"
                  recommendation="Recommended: 400 × 400 px"
                  image={logo}
                  onUpload={handleUpload("logo")}
                  onRemove={() => setLogo(null)}
                />

                <div className="lg:col-span-2">
                  <ImageUploader
                    title="Header Banner"
                    recommendation="Recommended: 1200 × 500 px"
                    image={banner}
                    onUpload={handleUpload("banner")}
                    onRemove={() => setBanner(null)}
                    kind="banner"
                  />
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 2: THEMES */}

            <Section
              icon={Palette}
              title="Mini Website Visual Themes"
              subtitle="Choose the appearance of your public visiting card. Your selected theme is highlighted below."
            >
              <div className="mb-4 flex flex-col gap-3 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center">
                  <div>
                    <p className="text-sm font-bold text-white">
                      Available designs
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      5 themes available
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/5 px-3 py-2.5">
                  <span
                    className="h-4 w-4 shrink-0 rounded-full ring-2 ring-white/10"
                    style={{
                      background: `linear-gradient(135deg, ${activeThemeData?.colors[0]}, ${activeThemeData?.colors[1]})`,
                    }}
                  />

                  <span className="text-xs text-slate-300">Active theme:</span>

                  <span className="text-xs font-bold text-cyan-200">
                    {activeThemeData?.name}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-5">
                {themes.map((theme) => {
                  const isActive = activeTheme === theme.id;

                  return (
                    <button
                      key={theme.id}
                      type="button"
                      onClick={() => {
                        setActiveTheme(theme.id);
                        setSaved(false);
                      }}
                      aria-pressed={isActive}
                      className={`group relative min-w-0 overflow-hidden rounded-2xl border p-4 text-left transition duration-300 hover:-translate-y-0.5 ${
                        isActive
                          ? "border-cyan-300/60 bg-cyan-300/[0.07] shadow-lg shadow-cyan-300/5 ring-1 ring-cyan-300/15"
                          : "border-[#29435f] bg-[#132942]/60 hover:border-[#38516e] hover:bg-[#132942]"
                      }`}
                    >
                      <div
                        className="mb-4 h-20 overflow-hidden rounded-xl border border-white/10 p-2"
                        style={{
                          background: `linear-gradient(135deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                        }}
                      >
                        <div className="flex h-full flex-col justify-between rounded-lg border border-white/20 bg-black/10 p-2">
                          <div className="flex items-center gap-1.5">
                            <span className="h-5 w-5 rounded-md border border-white/30 bg-white/20" />
                            <span className="h-1.5 w-12 rounded-full bg-white/70" />
                          </div>

                          <div className="space-y-1.5">
                            <div className="h-1.5 w-3/4 rounded-full bg-white/80" />
                            <div className="h-1 w-1/2 rounded-full bg-white/40" />
                          </div>

                          <div className="flex gap-1">
                            <span className="h-3 w-8 rounded-full border border-white/30 bg-white/20" />
                            <span className="h-3 w-5 rounded-full bg-white/40" />
                          </div>
                        </div>
                      </div>

                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-sm font-bold leading-5 text-white">
                          {theme.name}
                        </h3>

                        {isActive && (
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-cyan-300 text-[#0b1b30]">
                            <Check size={14} strokeWidth={3} />
                          </span>
                        )}
                      </div>

                      <p className="mt-1.5 text-xs font-medium text-cyan-200">
                        {theme.category}
                      </p>

                      <p className="mt-2 text-xs leading-5 text-slate-400">
                        {theme.description}
                      </p>

                      <div className="mt-4 flex items-center justify-between border-t border-[#29435f] pt-3">
                        <span className="text-xs font-semibold text-slate-300">
                          {isActive ? "Currently selected" : "Choose theme"}
                        </span>

                        <div className="flex gap-1">
                          {theme.colors.map((color) => (
                            <span
                              key={color}
                              className="h-3 w-3 rounded-full border border-white/20"
                              style={{ backgroundColor: color }}
                            />
                          ))}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </Section>

            <Divider />

            {/* SECTION 3: BASIC INFORMATION */}

            <Section
              icon={User}
              title="Basic Information"
              subtitle="Enter your personal details and business category."
            >
              <div className={cardCls}>
                <div className="mb-5 flex items-center gap-2 border-b border-[#29435f] pb-4">
                  <User size={17} className="text-cyan-200" />
                  <h3 className="text-sm font-bold text-white">
                    Personal & Business Details
                  </h3>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="First Name"
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    placeholder="First name"
                    required
                  />

                  <Field
                    label="Last Name"
                    value={formData.lastName}
                    onChange={(e) => handleChange("lastName", e.target.value)}
                    placeholder="Last name"
                    required
                  />

                  <Field
                    label="Business Name"
                    value={formData.businessName}
                    onChange={(e) =>
                      handleChange("businessName", e.target.value)
                    }
                    placeholder="Business name"
                    required
                  />

                  <div className="min-w-0">
                    <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                      <Building2 size={15} className="text-cyan-300" />
                      Your Industry / Category
                      <span className="text-cyan-200">*</span>
                    </label>

                    <div className="relative">
                      <select
                        value={formData.industry}
                        onChange={(e) =>
                          handleChange("industry", e.target.value)
                        }
                        className={`${inputCls} appearance-none pr-10`}
                      >
                        {industries.map((industry) => (
                          <option
                            key={industry}
                            value={industry}
                            className="bg-[#132942] text-white"
                          >
                            {industry}
                          </option>
                        ))}
                      </select>

                      <ChevronDown
                        size={16}
                        className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200"
                      />
                    </div>

                    <p className="mt-2 text-xs leading-5 text-slate-400">
                      Choose the category that best describes your business.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 4: SUBDOMAIN */}

            <Section
              icon={Globe}
              title="Custom Shop Subdomain & URL Handle"
              subtitle="Manage the web handle associated with your digital visiting card."
            >
              <div className={cardCls}>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Custom Subdomain
                </label>

                <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                  <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 focus-within:border-cyan-300">
                    <span className="shrink-0 text-xs text-slate-400">
                      https://
                    </span>

                    <input
                      type="text"
                      value={formData.subdomain}
                      onChange={(e) =>
                        handleChange(
                          "subdomain",
                          e.target.value.toLowerCase().replace(/\s+/g, "-"),
                        )
                      }
                      className="min-w-0 flex-1 bg-transparent px-2 py-3 font-mono text-sm text-cyan-100 outline-none"
                      aria-label="Custom subdomain"
                    />
                  </div>

                  <span className="rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 py-3 text-xs text-slate-400">
                    .yourdomain.com
                  </span>
                </div>

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  This field edits the handle in this form. Actual subdomain
                  routing must be configured on your hosting/backend.
                </p>

                <div className="mt-5 rounded-xl border border-[#29435f] bg-[#0b1b30]/70 p-3.5">
                  <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                    <LinkIcon size={14} className="text-cyan-300" />
                    Current direct link
                  </div>

                  <a
                    href={formData.website}
                    target="_blank"
                    rel="noreferrer"
                    className="block break-all text-sm font-medium leading-6 text-cyan-200 transition hover:text-cyan-100 hover:underline"
                  >
                    {formData.website}
                  </a>
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 5: PROFESSIONAL DETAILS */}

            <Section
              icon={Briefcase}
              title="Professional Details"
              subtitle="Add your professional role and the headline customers will see."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Job Title / Role"
                  icon={Briefcase}
                  value={formData.jobTitle}
                  onChange={(e) => handleChange("jobTitle", e.target.value)}
                  placeholder="Business Owner / Professional"
                />

                <Field
                  label="Short Headline / Slogan"
                  value={formData.headline}
                  onChange={(e) => handleChange("headline", e.target.value)}
                  placeholder="Your short tagline"
                />
              </div>
            </Section>

            <Divider />

            {/* SECTION 6: BIO */}

            <Section
              icon={User}
              title="About / Business Bio"
              subtitle="Introduce your business, products and services to potential customers."
            >
              <div className={cardCls}>
                <label className="mb-2 block text-sm font-semibold text-slate-200">
                  Business Description
                </label>

                <textarea
                  rows={5}
                  maxLength={500}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell customers about your business..."
                  className={`${inputCls} resize-y leading-6`}
                />

                <div className="mt-2 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs text-slate-400">
                    Keep your introduction clear and customer-friendly.
                  </p>

                  <p className="text-xs font-semibold text-cyan-200">
                    {formData.bio.length} / 500 characters
                  </p>
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 7: CONTACT DETAILS */}

            <Section
              icon={Phone}
              title="Contact Information"
              subtitle="Help customers reach you through their preferred contact method."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
                <Field
                  label="Phone Number"
                  icon={Phone}
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleChange("phone", e.target.value)}
                  placeholder="8956235689"
                  required
                />

                <Field
                  label="WhatsApp Number"
                  icon={MessageSquare}
                  type="tel"
                  value={formData.whatsapp}
                  onChange={(e) => handleChange("whatsapp", e.target.value)}
                  placeholder="918956235689"
                />

                <Field
                  label="Email ID"
                  icon={Mail}
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  placeholder="you@business.com"
                  required
                />

                <Field
                  label="Website / Card Link"
                  icon={LinkIcon}
                  type="url"
                  value={formData.website}
                  onChange={(e) => handleChange("website", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </Section>

            <Divider />

            {/* SECTION 8: ADDRESS */}

            <Section
              icon={Store}
              title="Storefront Address"
              subtitle="Set your business location so customers can identify your shop and get directions."
            >
              <div className={cardCls}>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <Field
                    label="Shop / Unit Number"
                    value={formData.shopUnit}
                    onChange={(e) => handleChange("shopUnit", e.target.value)}
                    placeholder="E.g. Shop 12, Ground Floor"
                  />

                  <Field
                    label="Area / Locality"
                    value={formData.area}
                    onChange={(e) => handleChange("area", e.target.value)}
                    placeholder="E.g. Andheri West"
                  />
                </div>

                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <Field
                    label="City"
                    value={formData.city}
                    onChange={(e) => handleChange("city", e.target.value)}
                    placeholder="Enter city"
                  />

                  <Field
                    label="State"
                    value={formData.state}
                    onChange={(e) => handleChange("state", e.target.value)}
                    placeholder="Enter state"
                  />

                  <Field
                    label="Pincode"
                    value={formData.pincode}
                    onChange={(e) => handleChange("pincode", e.target.value)}
                    placeholder="E.g. 400070"
                  />
                </div>

                <div className="mt-4">
                  <Field
                    label="Landmark (Optional)"
                    value={formData.landmark}
                    onChange={(e) => handleChange("landmark", e.target.value)}
                    placeholder="E.g. Opposite Phoenix Marketcity, Gate 2"
                  />
                </div>

                <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#0b1b30]/75 p-4">
                  <div className="mb-3 flex items-center gap-2">
                    <MapPin size={17} className="text-cyan-200" />

                    <label className="text-sm font-bold text-white">
                      Google Maps Shop Directions Link
                    </label>
                  </div>

                  <div className="flex flex-col gap-3 lg:flex-row">
                    <input
                      type="url"
                      value={formData.mapLink}
                      onChange={(e) => handleChange("mapLink", e.target.value)}
                      placeholder="https://maps.app.goo.gl/..."
                      className={`${inputCls} min-w-0 flex-1`}
                    />

                    <button
                      type="button"
                      onClick={handleAutoCaptureGPS}
                      disabled={capturingGPS}
                      className={secondaryButtonCls}
                    >
                      {capturingGPS ? (
                        <Loader2 size={16} className="animate-spin" />
                      ) : (
                        <Navigation size={16} className="text-cyan-200" />
                      )}

                      {capturingGPS
                        ? "Capturing Location..."
                        : "Capture My GPS"}
                    </button>
                  </div>

                  <div className="mt-4 flex items-start gap-3 rounded-xl border border-cyan-300/10 bg-cyan-300/[0.05] p-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                      <MapPin size={17} />
                    </div>

                    <p className="text-xs leading-6 text-slate-300">
                      This link is intended to power the{" "}
                      <span className="font-semibold text-cyan-200">
                        Directions
                      </span>{" "}
                      button on your public mini website. GPS capture requires
                      browser location permission and a supported secure
                      context.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 9: BUSINESS HOURS */}

            <Section
              icon={Clock}
              title="Business Hours & Website"
              subtitle="Set your working hours and the main website address."
            >
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field
                  label="Business Hours"
                  icon={Clock}
                  value={formData.businessHours}
                  onChange={(e) =>
                    handleChange("businessHours", e.target.value)
                  }
                  placeholder="Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed"
                />

                <Field
                  label="Website URL"
                  icon={Globe}
                  type="url"
                  value={formData.websiteUrl}
                  onChange={(e) => handleChange("websiteUrl", e.target.value)}
                  placeholder="https://..."
                />
              </div>
            </Section>

            <Divider />

            {/* SECTION 10: PAYMENTS & UPI */}

            <Section
              icon={Wallet}
              title="Receive Payments & UPI"
              subtitle="Add your merchant UPI ID and upload your payment QR code for customers."
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ImageUploader
                  title="Payment QR Code Image"
                  recommendation="Square image recommended"
                  image={qrCode}
                  onUpload={handleUpload("qr")}
                  onRemove={() => setQrCode(null)}
                />

                <div className={cardCls}>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                      <Wallet size={19} />
                    </div>

                    <div>
                      <h3 className="text-sm font-bold text-white">
                        Merchant UPI ID
                      </h3>
                      <p className="mt-1 text-xs text-slate-400">
                        Your payment address
                      </p>
                    </div>
                  </div>

                  <Field
                    label="UPI ID (Unified Payments Interface)"
                    icon={AtSign}
                    value={formData.upiId}
                    onChange={(e) => handleChange("upiId", e.target.value)}
                    placeholder="yourbusiness@okaxis"
                  />

                  <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                    Quick UPI handles
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {quickHandles.map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => {
                          const base =
                            formData.upiId.split("@")[0] || "yourbusiness";

                          handleChange("upiId", `${base}${handle}`);
                        }}
                        className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                          formData.upiId.endsWith(handle)
                            ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                            : "border-[#38516e] bg-[#0b1b30] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                        }`}
                      >
                        {handle}
                      </button>
                    ))}
                  </div>

                  <p className="mt-4 text-xs leading-5 text-slate-400">
                    Select a handle to update the suffix of your UPI ID. Confirm
                    the final ID with your payment provider before publishing
                    it.
                  </p>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-300/[0.08] to-blue-400/[0.04] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <Zap size={19} />
                  </div>

                  <div className="min-w-0">
                    <p className="flex flex-wrap items-center text-sm font-bold text-cyan-100">
                      UPI Payment Setup
                    </p>

                    <p className="mt-2 text-sm leading-6 text-slate-300">
                      Your UPI ID and payment QR are collected here for your
                      card. The public card must implement the payment action
                      for customers to use compatible payment apps such as
                      Google Pay, PhonePe, Paytm or BHIM.
                    </p>
                  </div>
                </div>
              </div>
            </Section>

            <Divider />

            {/* SECTION 11: PLAN & ACTIONS */}

            <section className="overflow-hidden rounded-2xl border border-[#38516e] bg-gradient-to-br from-[#132942] to-[#0b1b30]">
              <div className="h-1 bg-gradient-to-r from-blue-400 via-cyan-300 to-blue-500" />

              <div className="p-4 sm:p-6">
                <div className="mb-5 flex items-start gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-200">
                    <Rocket size={20} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-white">
                      Plan & Publish
                    </h2>

                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      Select your plan and save the profile form.
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
                  <div className="min-w-0">
                    <p className="mb-3 text-sm font-bold text-slate-200">
                      Choose Your Plan
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("1year");
                          setSaved(false);
                        }}
                        aria-pressed={selectedPlan === "1year"}
                        className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 text-left transition ${
                          selectedPlan === "1year"
                            ? "border-cyan-300/60 bg-cyan-300/[0.08] ring-1 ring-cyan-300/15"
                            : "border-[#38516e] bg-[#0b1b30]/70 hover:border-cyan-300/30"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selectedPlan === "1year"
                              ? "bg-cyan-300 text-[#0b1b30]"
                              : "bg-[#132942] text-slate-300"
                          }`}
                        >
                          {/* <CreditCard size={19} /> */}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">1 Year</p>
                          <p className="mt-1 text-lg font-extrabold text-cyan-200">
                            ₹499
                          </p>
                        </div>

                        {selectedPlan === "1year" && (
                          <Check size={18} className="shrink-0 text-cyan-200" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setSelectedPlan("3years");
                          setSaved(false);
                        }}
                        aria-pressed={selectedPlan === "3years"}
                        className={`flex min-w-0 items-center gap-3 rounded-2xl border p-4 text-left transition ${
                          selectedPlan === "3years"
                            ? "border-cyan-300/60 bg-cyan-300/[0.08] ring-1 ring-cyan-300/15"
                            : "border-[#38516e] bg-[#0b1b30]/70 hover:border-cyan-300/30"
                        }`}
                      >
                        <div
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${
                            selectedPlan === "3years"
                              ? "bg-cyan-300 text-[#0b1b30]"
                              : "bg-[#132942] text-slate-300"
                          }`}
                        >
                          {/* <CreditCard size={19} /> */}
                        </div>

                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-bold text-white">
                            3 Years
                          </p>
                          <p className="mt-1 text-lg font-extrabold text-cyan-200">
                            ₹799
                          </p>
                        </div>

                        {selectedPlan === "3years" && (
                          <Check size={18} className="shrink-0 text-cyan-200" />
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="flex min-w-0 flex-col gap-3 sm:flex-row xl:max-w-[490px]">
                    <button
                      type="button"
                      onClick={() => {
                        alert(
                          "Connect your payment and launch flow to enable this action.",
                        );
                      }}
                      className={`${secondaryButtonCls} flex-1`}
                    >
                      <Rocket size={17} className="text-cyan-200" />
                      Launch Card · ₹{selectedPlan === "1year" ? "499" : "799"}
                    </button>

                    <button
                      type="button"
                      onClick={handleSave}
                      disabled={saving}
                      className={`${primaryButtonCls} flex-1`}
                    >
                      {saving ? (
                        <>
                          <Loader2 size={17} className="animate-spin" />
                          Saving...
                        </>
                      ) : saved ? (
                        <>
                          <Check size={17} strokeWidth={3} />
                          Saved!
                        </>
                      ) : (
                        <>
                          <Save size={17} />
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                </div>

                {saved && (
                  <div
                    role="status"
                    className="mt-5 flex items-start gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] p-3.5"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-200">
                      <Check size={17} />
                    </div>

                    <div>
                      <p className="text-sm font-bold text-cyan-100">
                        Form save simulation completed
                      </p>

                      <p className="mt-1 text-xs leading-5 text-slate-300">
                        This demo currently updates the interface only. Connect
                        your backend/API to save profile changes permanently.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </section>
          </div>
        </div>

        {/* FOOTER */}

        <footer className="mt-6 flex flex-col items-center justify-between gap-2 border-t border-[#29435f] py-5 text-center sm:flex-row sm:text-left">
          <div className="flex items-center text-sm font-bold text-slate-300">
            BioWebsite
          </div>

          <p className="text-xs text-slate-400">
            Manage your business identity in one place.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default EditProfile;
