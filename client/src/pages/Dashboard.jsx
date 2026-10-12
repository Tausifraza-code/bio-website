import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  Sparkles,
  User,
  Upload,
  CheckCircle2,
  Palette,
  Layout,
  Download,
  QrCode,
  Save,
  Plus,
  Trash2,
  ChevronDown,
  Clock,
  Phone,
  Mail,
  MapPin,
  Globe,
  // Instagram,
  // Facebook,
  // Linkedin,
  MessageCircle,
  Copy,
  ExternalLink,
  Star,
  Send,
  ShoppingBag,
  Building2,
  Eye,
  Image as ImageIcon,
  Link,
} from "lucide-react";

import { useOutletContext } from "react-router-dom";

import PaymentModal from "../components/PaymentModal";
import ContactItem from "../components/ContactItem";

const themes = [
  {
    id: "violet",
    name: "Violet",
    color: "#7c3aed",
  },
  {
    id: "blue",
    name: "Ocean",
    color: "#2563eb",
  },
  {
    id: "green",
    name: "Emerald",
    color: "#059669",
  },
  {
    id: "orange",
    name: "Sunset",
    color: "#ea580c",
  },
];

const themeConfigs = {
  violet: {
    primary: "#7c3aed",
    secondary: "#a78bfa",
    light: "#ede9fe",
  },
  blue: {
    primary: "#2563eb",
    secondary: "#60a5fa",
    light: "#dbeafe",
  },
  green: {
    primary: "#059669",
    secondary: "#34d399",
    light: "#d1fae5",
  },
  orange: {
    primary: "#ea580c",
    secondary: "#fb923c",
    light: "#ffedd5",
  },
};

const Dashboard = () => {
  const {
    showToast,
    showCardActionNotice,
  } = useOutletContext();

  const [selectedPlan, setSelectedPlan] = useState("pro");

  const [activeTheme, setActiveTheme] = useState(() => {
    return localStorage.getItem("bio-active-theme") || "violet";
  });

  const [previewMode, setPreviewMode] = useState(false);
  const [standeeCode, setStandeeCode] = useState("");

  const [notice, setNotice] = useState("");

  const [isActivated, setIsActivated] = useState(false);

  const [contactInfo, setContactInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("bio-contact-info");

      if (saved) {
        return JSON.parse(saved);
      }

      const registered = localStorage.getItem(
        "bio-registered-user"
      );

      if (registered) {
        const user = JSON.parse(registered);

        return {
          name: user?.name || user?.fullName || "",
          phone: user?.phone || user?.mobile || "",
          email: user?.email || "",
          address: user?.address || "",
          website: user?.website || "",
          instagram: user?.instagram || "",
          facebook: user?.facebook || "",
          linkedin: user?.linkedin || "",
        };
      }
    } catch (error) {
      console.error(
        "Unable to load contact information:",
        error
      );
    }

    return {
      name: "",
      phone: "",
      email: "",
      address: "",
      website: "",
      instagram: "",
      facebook: "",
      linkedin: "",
    };
  });

  const [reviewName, setReviewName] = useState("");
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewMessage, setReviewMessage] = useState("");

  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem(
        "bio-customer-reviews"
      );

      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const fileInputRef = useRef(null);

  const registeredUser = useMemo(() => {
    try {
      const saved = localStorage.getItem(
        "bio-registered-user"
      );

      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  }, []);

  const ownerName =
    contactInfo.name ||
    registeredUser?.name ||
    registeredUser?.fullName ||
    "Your Business";

  const averageRating = useMemo(() => {
    if (!reviewsList.length) {
      return 0;
    }

    const total = reviewsList.reduce(
      (sum, review) => sum + Number(review.rating || 0),
      0
    );

    return (total / reviewsList.length).toFixed(1);
  }, [reviewsList]);

  const amount = selectedPlan === "pro" ? 999 : 499;

  const currentThemeConfig =
    themeConfigs[activeTheme] || themeConfigs.violet;

  useEffect(() => {
    localStorage.setItem(
      "bio-active-theme",
      activeTheme
    );
  }, [activeTheme]);

  useEffect(() => {
    localStorage.setItem(
      "bio-contact-info",
      JSON.stringify(contactInfo)
    );
  }, [contactInfo]);

  useEffect(() => {
    localStorage.setItem(
      "bio-customer-reviews",
      JSON.stringify(reviewsList)
    );
  }, [reviewsList]);

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    if (!reviewName.trim() || !reviewMessage.trim()) {
      showToast?.("Please fill all review fields.");
      return;
    }

    const newReview = {
      id: Date.now(),
      name: reviewName.trim(),
      rating: Number(reviewRating),
      message: reviewMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    setReviewsList((previous) => [
      newReview,
      ...previous,
    ]);

    setReviewName("");
    setReviewRating(5);
    setReviewMessage("");

    showToast?.("Review added successfully.");
  };

  const handleDeleteReview = (id) => {
    setReviewsList((previous) =>
      previous.filter((review) => review.id !== id)
    );

    showToast?.("Review deleted.");
  };

  const handleInquirySubmit = (event) => {
    event.preventDefault();

    if (
      !inquiryName.trim() ||
      !inquiryPhone.trim() ||
      !inquiryMessage.trim()
    ) {
      showToast?.("Please complete the inquiry form.");
      return;
    }

    const text = [
      `Hello ${ownerName},`,
      "",
      `Name: ${inquiryName}`,
      `Email: ${inquiryEmail || "Not provided"}`,
      `Phone: ${inquiryPhone}`,
      "",
      `Message: ${inquiryMessage}`,
    ].join("\n");

    const url = `https://web.whatsapp.com/send?text=${encodeURIComponent(
      text
    )}`;

    window.open(url, "_blank");

    setInquiryName("");
    setInquiryEmail("");
    setInquiryPhone("");
    setInquiryMessage("");

    showToast?.("Opening WhatsApp...");
  };

  const handleThemeSelect = (themeId) => {
    setActiveTheme(themeId);

    showToast?.("Theme updated successfully.");
  };

  const updateContactField = (field, value) => {
    setContactInfo((previous) => ({
      ...previous,
      [field]: value,
    }));
  };

  const copyLink = async () => {
    const link = `${window.location.origin}/preview`;

    try {
      await navigator.clipboard.writeText(link);
      showToast?.("Preview link copied.");
    } catch {
      showToast?.("Unable to copy the link.");
    }
  };

  const handleStandee = () => {
    if (!standeeCode.trim()) {
      showToast?.("Please enter your standee code.");
      return;
    }

    showToast?.("Standee connected successfully.");
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      try {
        localStorage.setItem(
          "bio-profile-image",
          reader.result
        );

        showToast?.("Profile photo updated.");
      } catch {
        showToast?.("Unable to save profile photo.");
      }
    };

    reader.readAsDataURL(file);
  };

  return (
    <div className="w-full space-y-5">
      {/* =====================================================
          MOBILE QUICK NAV
      ===================================================== */}
      <div className="flex gap-2 overflow-x-auto pb-1 lg:hidden">
        {[
          "Overview",
          "Profile",
          "Themes",
          "Preview",
          "QR Code",
        ].map((item) => (
          <button
            key={item}
            type="button"
            className="shrink-0 rounded-xl bg-[#5448ea] px-4 py-2.5 text-xs font-semibold text-white"
          >
            {item}
          </button>
        ))}
      </div>

      {/* =====================================================
          TOP ACTIVATION / PRICING BANNER
      ===================================================== */}
      <section
        id="dashboard-overview"
        className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2">
              <Sparkles
                size={17}
                className="text-[#8b82ff]"
              />

              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-[#8b82ff]">
                Digital Business Card
              </span>
            </div>

            <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl">
              Build your digital identity
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
              Manage your profile, theme, contact details,
              reviews and QR code from one dashboard.
            </p>
          </div>

          <div className="shrink-0 rounded-2xl border border-[#5448ea]/20 bg-[#5448ea]/10 p-4">
            <div className="flex items-center gap-3">
              {/* <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#5448ea]">
                {isActivated ? (
                  <CheckCircle2 size={20} />
                ) : (
                  <CreditCardIcon />
                )}
              </div> */}

              <div>
                <p className="text-xs font-medium text-slate-400">
                  Current plan
                </p>

                <p className="mt-0.5 text-sm font-bold text-white">
                  {isActivated
                    ? "Activated"
                    : selectedPlan === "pro"
                    ? "Pro Plan"
                    : "Basic Plan"}
                </p>
              </div>
            </div>
          </div>
        </div>

        {!isActivated && (
          <div className="mt-5 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-white">
                Activate your digital card
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Choose a plan and make your profile public.
              </p>
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setSelectedPlan("basic")}
                className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  selectedPlan === "basic"
                    ? "border-[#5448ea] bg-[#5448ea]/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                Basic ₹499
              </button>

              <button
                type="button"
                onClick={() => setSelectedPlan("pro")}
                className={`rounded-xl border px-4 py-2.5 text-xs font-semibold transition ${
                  selectedPlan === "pro"
                    ? "border-[#5448ea] bg-[#5448ea]/15 text-white"
                    : "border-white/10 bg-white/5 text-slate-400"
                }`}
              >
                Pro ₹999
              </button>

              <button
                type="button"
                onClick={() => {
                  setIsActivated(true);
                  showToast?.(
                    `Plan selected for ₹${amount}.`
                  );
                }}
                className="rounded-xl bg-[#5448ea] px-4 py-2.5 text-xs font-bold text-white transition hover:bg-[#6257ef]"
              >
                Activate
              </button>
            </div>
          </div>
        )}
      </section>

      {notice && (
        <div className="rounded-2xl border border-emerald-400/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
          {notice}
        </div>
      )}

      {/* =====================================================
          STANDEE
      ===================================================== */}
      <section className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
        <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <QrCode
                size={18}
                className="text-[#8b82ff]"
              />

              <h2 className="text-base font-bold text-white">
                Connect Standee
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Connect your physical standee with this profile.
            </p>
          </div>

          <div className="flex w-full max-w-md gap-2">
            <input
              type="text"
              value={standeeCode}
              onChange={(event) =>
                setStandeeCode(event.target.value)
              }
              placeholder="Enter standee code"
              className="min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#5448ea]/50"
            />

            <button
              type="button"
              onClick={handleStandee}
              className="rounded-xl bg-[#5448ea] px-4 py-3 text-xs font-bold text-white transition hover:bg-[#6257ef]"
            >
              Connect
            </button>
          </div>
        </div>
      </section>

      {/* =====================================================
          PROFILE SECTION
      ===================================================== */}
      <section
        id="dashboard-profile"
        className="scroll-mt-28 rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b82ff]">
              Profile
            </p>

            <h2 className="mt-1 text-xl font-black text-white">
              Your business information
            </h2>
          </div>

          <button
            type="button"
            onClick={() => showToast?.("Profile saved.")}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#5448ea] px-4 py-2.5 text-xs font-bold text-white"
          >
            <Save size={15} />
            Save Changes
          </button>
        </div>

        <div className="grid gap-5 xl:grid-cols-[280px_minmax(0,1fr)]">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
            <div className="flex flex-col items-center text-center">
              <div className="relative">
                <img
                  src={
                    localStorage.getItem(
                      "bio-profile-image"
                    ) ||
                    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                  }
                  alt="Profile"
                  className="h-28 w-28 rounded-full border-4 border-[#5448ea]/30 object-cover"
                />

                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                  className="absolute bottom-0 right-0 flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#5448ea] text-white shadow-lg"
                >
                  <Upload size={15} />
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              <p className="mt-4 text-sm font-bold text-white">
                Profile Photo
              </p>

              <p className="mt-1 text-[11px] leading-5 text-slate-500">
                JPG, PNG or WEBP
              </p>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              {
                label: "Business Name",
                field: "name",
                placeholder: "Your business name",
              },
              {
                label: "Phone",
                field: "phone",
                placeholder: "Your phone number",
              },
              {
                label: "Email",
                field: "email",
                placeholder: "Your email",
              },
              {
                label: "Website",
                field: "website",
                placeholder: "https://example.com",
              },
              {
                label: "Instagram",
                field: "instagram",
                placeholder: "Instagram username",
              },
              {
                label: "Facebook",
                field: "facebook",
                placeholder: "Facebook profile",
              },
              {
                label: "LinkedIn",
                field: "linkedin",
                placeholder: "LinkedIn profile",
              },
              {
                label: "Address",
                field: "address",
                placeholder: "Business address",
              },
            ].map((item) => (
              <label
                key={item.field}
                className="block"
              >
                <span className="mb-2 block text-xs font-semibold text-slate-400">
                  {item.label}
                </span>

                <input
                  type="text"
                  value={contactInfo[item.field] || ""}
                  onChange={(event) =>
                    updateContactField(
                      item.field,
                      event.target.value
                    )
                  }
                  placeholder={item.placeholder}
                  className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[#5448ea]/50"
                />
              </label>
            ))}
          </div>
        </div>
      </section>

      {/* =====================================================
          THEME SECTION
      ===================================================== */}
      <section
        id="dashboard-themes"
        className="scroll-mt-28 rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <Palette
              size={18}
              className="text-[#8b82ff]"
            />

            <h2 className="text-lg font-black text-white">
              Choose your theme
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Your selected theme will be applied to the digital
            visiting card.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {themes.map((theme) => {
            const selected =
              activeTheme === theme.id;

            return (
              <button
                key={theme.id}
                type="button"
                onClick={() =>
                  handleThemeSelect(theme.id)
                }
                className={`rounded-2xl border p-3 text-left transition ${
                  selected
                    ? "border-[#5448ea] bg-[#5448ea]/10"
                    : "border-white/10 bg-white/[0.03] hover:bg-white/[0.06]"
                }`}
              >
                <div
                  className="h-20 rounded-xl"
                  style={{
                    background: `linear-gradient(135deg, ${theme.color}, ${theme.color}99)`,
                  }}
                />

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-xs font-bold text-white">
                    {theme.name}
                  </span>

                  {selected && (
                    <CheckCircle2
                      size={16}
                      className="text-[#8b82ff]"
                    />
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================
          PREVIEW HEADING
      ===================================================== */}
      <section className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#8b82ff]">
            Live Preview
          </p>

          <h2 className="mt-1 text-2xl font-black text-white">
            Your digital visiting card
          </h2>
        </div>

        <div className="flex gap-2">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 transition hover:bg-white/10"
          >
            <Copy size={15} />
            Copy Link
          </button>

          <button
            type="button"
            onClick={() =>
              (window.location.href = "/preview")
            }
            className="inline-flex items-center gap-2 rounded-xl bg-[#5448ea] px-3 py-2.5 text-xs font-bold text-white"
          >
            <Eye size={15} />
            Open Preview
          </button>
        </div>
      </section>

      {/* =====================================================
          DIGITAL CARD
      ===================================================== */}
      <section
        className="overflow-hidden rounded-[30px] border border-white/10 bg-[#0d1426] shadow-2xl"
        style={{
          boxShadow: `0 20px 70px ${currentThemeConfig.primary}15`,
        }}
      >
        <div className="relative h-48 overflow-hidden sm:h-64">
          <img
            src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
            alt="Business cover"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-[#0d1426] via-[#0d1426]/30 to-transparent" />

          <div className="absolute right-4 top-4">
            <span
              className="rounded-full px-3 py-1.5 text-[10px] font-bold text-white"
              style={{
                backgroundColor:
                  currentThemeConfig.primary,
              }}
            >
              {isActivated
                ? "ACTIVE"
                : "PREVIEW"}
            </span>
          </div>
        </div>

        <div className="relative px-5 pb-6 sm:px-8">
          <div className="-mt-16 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div className="flex items-end gap-4">
              <img
                src={
                  localStorage.getItem(
                    "bio-profile-image"
                  ) ||
                  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                }
                alt={ownerName}
                className="h-28 w-28 rounded-3xl border-4 border-[#0d1426] object-cover shadow-xl"
              />

              <div className="pb-1">
                <h3 className="text-xl font-black text-white">
                  {ownerName}
                </h3>

                <p className="mt-1 text-xs text-slate-500">
                  Digital Business Profile
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  showCardActionNotice?.(
                    "Profile shared successfully."
                  )
                }
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              >
                <ExternalLink size={16} />
              </button>

              <button
                type="button"
                onClick={copyLink}
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
              >
                <Copy size={16} />
              </button>
            </div>
          </div>

          <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <ContactItem
              icon={Phone}
              label="Phone"
              value={contactInfo.phone}
              onClick={() => {
                if (contactInfo.phone) {
                  window.location.href = `tel:${contactInfo.phone}`;
                }
              }}
            />

            <ContactItem
              icon={Mail}
              label="Email"
              value={contactInfo.email}
              onClick={() => {
                if (contactInfo.email) {
                  window.location.href = `mailto:${contactInfo.email}`;
                }
              }}
            />

            <ContactItem
              icon={MapPin}
              label="Address"
              value={contactInfo.address}
              onClick={() => {
                if (contactInfo.address) {
                  window.open(
                    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                      contactInfo.address
                    )}`,
                    "_blank"
                  );
                }
              }}
            />

            <ContactItem
              icon={Globe}
              label="Website"
              value={contactInfo.website}
              onClick={() => {
                if (contactInfo.website) {
                  const url =
                    contactInfo.website.startsWith(
                      "http"
                    )
                      ? contactInfo.website
                      : `https://${contactInfo.website}`;

                  window.open(url, "_blank");
                }
              }}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          ABOUT BUSINESS
      ===================================================== */}
      <section
        id="dashboard-about"
        className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <Building2
            size={18}
            className="text-[#8b82ff]"
          />

          <h2 className="text-lg font-black text-white">
            About business
          </h2>
        </div>

        <p className="mt-4 max-w-4xl text-sm leading-7 text-slate-400">
          Welcome to our digital business profile. Add your
          business information, services, products and contact
          details so your customers can easily connect with you.
        </p>
      </section>

      {/* =====================================================
          PRODUCTS
      ===================================================== */}
      <section className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
        <div className="mb-5 flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <ShoppingBag
                size={18}
                className="text-[#8b82ff]"
              />

              <h2 className="text-lg font-black text-white">
                Products
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              Showcase your products and services.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              showToast?.("Product editor opened.")
            }
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 transition hover:bg-white/10"
          >
            <Plus size={17} />
          </button>
        </div>

        <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.02] p-8 text-center">
          <ShoppingBag
            size={28}
            className="mx-auto text-slate-600"
          />

          <p className="mt-3 text-sm font-semibold text-slate-300">
            No products added yet
          </p>

          <p className="mt-1 text-xs text-slate-600">
            Add your first product to display it on your card.
          </p>
        </div>
      </section>

      {/* =====================================================
          CONTACT DETAILS
      ===================================================== */}
      <section className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
        <div className="mb-5">
          <h2 className="text-lg font-black text-white">
            Contact details
          </h2>

          <p className="mt-1 text-xs text-slate-500">
            These details are shown on your public profile.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2">
          <ContactItem
            icon={Phone}
            label="Phone"
            value={contactInfo.phone}
          />

          <ContactItem
            icon={Mail}
            label="Email"
            value={contactInfo.email}
          />

          {/* <ContactItem
            icon={Instagram}
            label="Instagram"
            value={contactInfo.instagram}
          /> */}

          {/* <ContactItem
            icon={Facebook}
            label="Facebook"
            value={contactInfo.facebook}
          /> */}

          {/* <ContactItem
            icon={Linkedin}
            label="LinkedIn"
            value={contactInfo.linkedin}
          /> */}

          <ContactItem
            icon={MapPin}
            label="Address"
            value={contactInfo.address}
          />
        </div>
      </section>

      {/* =====================================================
          REVIEWS
      ===================================================== */}
      <section className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
        <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Star
                size={18}
                className="text-yellow-400"
              />

              <h2 className="text-lg font-black text-white">
                Customer Reviews
              </h2>
            </div>

            <p className="mt-1 text-xs text-slate-500">
              {reviewsList.length
                ? `${averageRating}/5 average rating`
                : "No reviews yet"}
            </p>
          </div>

          <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={16}
                className={
                  star <= Number(averageRating)
                    ? "fill-yellow-400 text-yellow-400"
                    : "text-slate-700"
                }
              />
            ))}
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <div className="space-y-3">
            {reviewsList.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-white/10 p-7 text-center">
                <Star
                  size={28}
                  className="mx-auto text-slate-700"
                />

                <p className="mt-3 text-sm font-semibold text-slate-400">
                  No customer reviews yet
                </p>
              </div>
            ) : (
              reviewsList.map((review) => (
                <div
                  key={review.id}
                  className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-white">
                        {review.name}
                      </p>

                      <div className="mt-1 flex gap-0.5">
                        {[1, 2, 3, 4, 5].map(
                          (star) => (
                            <Star
                              key={star}
                              size={13}
                              className={
                                star <=
                                Number(review.rating)
                                  ? "fill-yellow-400 text-yellow-400"
                                  : "text-slate-700"
                              }
                            />
                          )
                        )}
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() =>
                        handleDeleteReview(review.id)
                      }
                      className="text-slate-600 transition hover:text-red-400"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>

                  <p className="mt-3 text-sm leading-6 text-slate-400">
                    {review.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <form
            onSubmit={handleReviewSubmit}
            className="rounded-2xl border border-white/10 bg-white/[0.03] p-4"
          >
            <p className="text-sm font-bold text-white">
              Add Review
            </p>

            <div className="mt-4">
              <input
                type="text"
                value={reviewName}
                onChange={(event) =>
                  setReviewName(event.target.value)
                }
                placeholder="Customer name"
                className="w-full rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
              />
            </div>

            <div className="mt-3 flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setReviewRating(star)}
                >
                  <Star
                    size={18}
                    className={
                      star <= reviewRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-slate-700"
                    }
                  />
                </button>
              ))}
            </div>

            <textarea
              value={reviewMessage}
              onChange={(event) =>
                setReviewMessage(event.target.value)
              }
              rows={4}
              placeholder="Write customer review..."
              className="mt-3 w-full resize-none rounded-xl border border-white/10 bg-white/[0.03] px-3 py-3 text-sm text-white outline-none placeholder:text-slate-600"
            />

            <button
              type="submit"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-[#5448ea] px-4 py-3 text-xs font-bold text-white"
            >
              <Send size={14} />
              Add Review
            </button>
          </form>
        </div>
      </section>

      {/* =====================================================
          INQUIRY
      ===================================================== */}
      <section className="rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
        <div className="mb-5">
          <div className="flex items-center gap-2">
            <MessageCircle
              size={18}
              className="text-[#8b82ff]"
            />

            <h2 className="text-lg font-black text-white">
              Customer Inquiry
            </h2>
          </div>

          <p className="mt-1 text-xs text-slate-500">
            Send an inquiry directly through WhatsApp.
          </p>
        </div>

        <form
          onSubmit={handleInquirySubmit}
          className="grid gap-4 sm:grid-cols-2"
        >
          <input
            type="text"
            value={inquiryName}
            onChange={(event) =>
              setInquiryName(event.target.value)
            }
            placeholder="Your name"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <input
            type="email"
            value={inquiryEmail}
            onChange={(event) =>
              setInquiryEmail(event.target.value)
            }
            placeholder="Your email"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <input
            type="tel"
            value={inquiryPhone}
            onChange={(event) =>
              setInquiryPhone(event.target.value)
            }
            placeholder="Your phone"
            className="rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600"
          />

          <textarea
            value={inquiryMessage}
            onChange={(event) =>
              setInquiryMessage(event.target.value)
            }
            rows={3}
            placeholder="Your message"
            className="resize-none rounded-xl border border-white/10 bg-white/[0.03] px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 sm:col-span-2"
          />

          <button
            type="submit"
            className="flex items-center justify-center gap-2 rounded-xl bg-[#25D366] px-5 py-3 text-sm font-bold text-white sm:col-span-2"
          >
            <MessageCircle size={17} />
            Send Inquiry on WhatsApp
          </button>
        </form>
      </section>

      {/* =====================================================
          QR CODE
      ===================================================== */}
      <section
        id="dashboard-qr"
        className="scroll-mt-28 rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <QrCode
                size={18}
                className="text-[#8b82ff]"
              />

              <h2 className="text-lg font-black text-white">
                Your QR Code
              </h2>
            </div>

            <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500">
              Scan this QR code to open your digital business
              card.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyLink}
                className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-4 py-2.5 text-xs font-semibold text-slate-300"
              >
                <Copy size={14} />
                Copy Link
              </button>

              <button
                type="button"
                onClick={() => {
                  showToast?.(
                    "QR download started."
                  );
                }}
                className="inline-flex items-center gap-2 rounded-xl bg-[#5448ea] px-4 py-2.5 text-xs font-bold text-white"
              >
                <Download size={14} />
                Download QR
              </button>
            </div>
          </div>

          <div className="flex justify-center rounded-3xl bg-white p-5">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(
                `${window.location.origin}/preview`
              )}`}
              alt="QR Code"
              className="h-[180px] w-[180px]"
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          SETTINGS
      ===================================================== */}
      <section
        id="dashboard-settings"
        className="scroll-mt-28 rounded-[26px] border border-white/10 bg-[#0d1426] p-5 sm:p-6"
      >
        <div className="flex items-center gap-2">
          <SettingsIcon />
          <h2 className="text-lg font-black text-white">
            Settings
          </h2>
        </div>

        <div className="mt-5 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Public Profile
              </p>

              <p className="mt-1 text-xs text-slate-500">
                Allow customers to view your digital card.
              </p>
            </div>

            <div className="rounded-full bg-emerald-500/10 px-3 py-1 text-[10px] font-bold text-emerald-400">
              ENABLED
            </div>
          </div>

          <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/[0.03] p-4">
            <div>
              <p className="text-sm font-semibold text-white">
                Current Theme
              </p>

              <p className="mt-1 text-xs text-slate-500">
                {themes.find(
                  (theme) => theme.id === activeTheme
                )?.name || "Violet"}
              </p>
            </div>

            <div
              className="h-8 w-8 rounded-full"
              style={{
                backgroundColor:
                  currentThemeConfig.primary,
              }}
            />
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="pb-6 pt-2 text-center">
        <p className="text-[11px] text-slate-600">
          Your digital identity, all in one place.
        </p>
      </footer>
    </div>
  );
};

/*
|--------------------------------------------------------------------------
| Small icon wrappers
|--------------------------------------------------------------------------
| These wrappers keep the JSX clean and avoid importing additional
| icon names only for a couple of locations.
|--------------------------------------------------------------------------
*/

// const CreditCardIcon = () => {
//   return (
//     <div className="text-white">
//       <CreditCard size={20} />
//     </div>
//   );
// };

const SettingsIcon = () => {
  return (
    <div className="text-[#8b82ff]">
      <Layout size={18} />
    </div>
  );
};

export default Dashboard;