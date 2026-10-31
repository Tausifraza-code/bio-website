import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import api from "../redux/api";
import { createInquiry } from "../redux/slice/inquirySlice";
import { getPublicQRUrl } from "../utils/qrUrl";
import { useDispatch } from "react-redux";

import ExecutivePro from "../components/ExecutivePro";
import MinimalLuxury from "../components/MinimalLuxury";
import CreativePortfolio from "../components/CreativePortfolio";
import CorporateExecutive from "../components/CorporateExecutive";
import Storefront from "../components/Storefront";
import FreelancerPro from "../components/FreelancerPro";
import ElegantProfile from "../components/ElegantProfile";
import AgencyPro from "../components/AgencyPro";
import DigitalCard from "../components/DigitalCard";
import ServicePro from "../components/ServicePro";

import {
  FaWhatsapp,
} from "react-icons/fa6";

import {
  CheckCircle2,
  Copy,
  Download,
  IndianRupee,
  Image as ImageIcon,
  Maximize2,
  QrCode,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  X,
} from "lucide-react";

/* ============================================================
   THEMES
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

/* ============================================================
   LAYOUT COMPONENTS — SAME AS Mini.jsx
   ============================================================ */

const LAYOUT_COMPONENTS = {
  "modern-business": ExecutivePro,
  "minimal-card": MinimalLuxury,
  "creator-portfolio": CreativePortfolio,
  "corporate-executive": CorporateExecutive,
  storefront: Storefront,
  "freelancer-pro": FreelancerPro,
  "elegant-profile": ElegantProfile,
  "agency-pro": AgencyPro,
  "digital-card": DigitalCard,
  "service-pro": ServicePro,
};

const LAYOUT_ID_ALIASES = {
  executivePro: "modern-business",
  minimalLuxury: "minimal-card",
  creativePortfolio: "creator-portfolio",
  corporateExecutive: "corporate-executive",
  freelancerPro: "freelancer-pro",
  elegantProfile: "elegant-profile",
  agencyPro: "agency-pro",
  digitalCard: "digital-card",
  servicePro: "service-pro",
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
          ? {
              url,
              alt: `Gallery image ${index + 1}`,
              caption: "",
            }
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

/* ============================================================
   MAIN COMPONENT
   ============================================================ */

function CardPreview() {
  const { subdomain } = useParams();
  const dispatch = useDispatch();

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
  const [showToast, setShowToast] = useState(false);

  /* ============================================================
     FETCH PUBLIC PROFILE
     ============================================================ */

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
        if (!subdomain) {
          throw new Error("Business profile URL is missing.");
        }

        const response = await api.get(
          `/profile/public/${encodeURIComponent(subdomain)}`
        );

        const data = response.data;
        const pubProfile = data?.profile;

        if (!data?.success || !pubProfile) {
          throw new Error("Business profile was not found.");
        }

        if (cancelled) return;

        setProfile(pubProfile);

        setQrPath(
          typeof data.qrPath === "string" ? data.qrPath : ""
        );

        const prods = data.products || pubProfile.products || [];

        setProducts(Array.isArray(prods) ? prods : []);

        const galleryData =
          data.gallery ||
          pubProfile.gallery ||
          pubProfile.galleryImages ||
          pubProfile.businessGallery ||
          pubProfile.images ||
          [];

        setGalleryRaw(
          Array.isArray(galleryData) ? galleryData : []
        );

        const btns =
          data.contactButtons ||
          pubProfile.contactButtons ||
          [];

        setContactButtons(
          (Array.isArray(btns) ? btns : [])
            .filter(
              (button) =>
                button &&
                button.enabled !== false &&
                button.enabled !== "false"
            )
            .sort(
              (a, b) => (a.order ?? 0) - (b.order ?? 0)
            )
        );
      } catch (error) {
        if (!cancelled) {
          setProfileError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load this business profile."
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPublicProfile();

    return () => {
      cancelled = true;
    };
  }, [subdomain]);

  /* ============================================================
     THEME + ACTIVE LAYOUT
     ============================================================ */

  const theme = themes[profile?.activeTheme] || themes.sunset;

  const activeLayout = useMemo(() => {
    const savedLayout = profile?.activeLayout;

    if (!savedLayout) return "modern-business";

    const normalizedLayout =
      LAYOUT_ID_ALIASES[savedLayout] || savedLayout;

    return LAYOUT_COMPONENTS[normalizedLayout]
      ? normalizedLayout
      : "modern-business";
  }, [profile?.activeLayout]);

  const ActiveLayoutComponent =
    LAYOUT_COMPONENTS[activeLayout] || ExecutivePro;

  const activeLayoutData = PROFILE_LAYOUTS.find(
    (layout) => layout.id === activeLayout
  );

  /* ============================================================
     DERIVED DATA
     ============================================================ */

  const businessInfo = useMemo(() => {
    if (!profile) return null;

    const address = [
      profile.shopUnit,
      profile.area,
      profile.city,
      profile.state,
      profile.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      name:
        [profile.firstName, profile.lastName]
          .filter(Boolean)
          .join(" ") || "Your Name",

      role:
        profile.jobTitle ||
        profile.role ||
        "Business Owner / Professional",

      location: address || "India",

      about:
        profile.bio ||
        profile.headline ||
        `Welcome to ${
          profile.businessName || "our business"
        }! Contact us for business inquiries.`,

      phone: profile.phone || "",

      whatsapp:
        profile.whatsapp || profile.phone || "",

      email: profile.email || "",

      website:
        profile.website || profile.websiteUrl || "",

      address: address || "India",

      logo: profile.logo || "",

      avatar: profile.avatar || "",

      banner: profile.banner || defaultBanner,

      industry: profile.industry || "",

      businessName:
        profile.businessName || "My Business",

      businessHours:
        profile.businessHours || "",

      upiId: profile.upiId || "",

      isVerified: profile.isVerified !== false,

      mapLink: profile.mapLink || "",
    };
  }, [profile]);

  const galleryImages = useMemo(
    () => normalizeGalleryImages(galleryRaw),
    [galleryRaw]
  );

  const socialLinks = useMemo(
    () =>
      (profile?.socialCards || []).filter(
        (social) => social?.url
      ),
    [profile?.socialCards]
  );

  const productList = Array.isArray(products)
    ? products
    : [];

  const qrValue = useMemo(
    () => getPublicQRUrl(qrPath),
    [qrPath]
  );

  /* ============================================================
     CONTACT HANDLERS
     ============================================================ */

  const openWhatsApp = () => {
    const number = (
      businessInfo?.whatsapp || ""
    ).replace(/\D/g, "");

    if (!number) {
      return alert(
        "WhatsApp number has not been added to this profile."
      );
    }

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(
        `Hi, I'm interested in ${businessInfo.businessName}.`
      )}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const handleCall = () => {
    const phone = (
      businessInfo?.phone || ""
    ).replace(/\s/g, "");

    if (!phone) {
      return alert("Phone number is not available.");
    }

    window.location.href = `tel:${phone}`;
  };

  const handleEmail = () => {
    if (!businessInfo?.email) {
      return alert("Email is not available.");
    }

    window.location.href = `mailto:${businessInfo.email}`;
  };

  /* ============================================================
     SHARE + QR HANDLERS
     ============================================================ */

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(qrValue);

      setCopied(true);

      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt(
        "Copy your business card link:",
        qrValue
      );
    }
  };

  const openQrModal = (tab = "share") => {
    setQrModalTab(tab);
    setShowQrModal(true);
  };

  const handleDownloadQR = (
    canvasId = "public-qr-modal-canvas",
    filename = "bio-website-qr.png"
  ) => {
    if (!qrValue) {
      return alert("Profile QR code is not available.");
    }

    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      return alert("QR code is not ready yet.");
    }

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
          title:
            businessInfo?.businessName ||
            "Business Profile",

          text: `Check out ${
            businessInfo?.businessName || "this business"
          }`,

          url: window.location.href,
        });
      } catch {
        // Share cancelled
      }
    } else {
      copyLink();
    }
  };

  /* ============================================================
     SAVE CONTACT
     ============================================================ */

  const handleSaveContact = () => {
    if (!profile) return;

    const esc = (value = "") =>
      String(value)
        .trim()
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");

    const lines = [
      "BEGIN:VCARD",
      "VERSION:3.0",
    ];

    const fullName = [
      profile.firstName,
      profile.lastName,
    ]
      .filter((value) => value?.trim())
      .join(" ")
      .trim();

    const displayName =
      fullName ||
      profile.businessName?.trim() ||
      "";

    if (displayName) {
      lines.push(`FN:${esc(displayName)}`);
    }

    if (profile.businessName?.trim()) {
      lines.push(
        `ORG:${esc(profile.businessName)}`
      );
    }

    if (profile.jobTitle?.trim()) {
      lines.push(
        `TITLE:${esc(profile.jobTitle)}`
      );
    }

    if (profile.phone?.trim()) {
      lines.push(
        `TEL;TYPE=CELL:${esc(profile.phone)}`
      );
    }

    if (profile.email?.trim()) {
      lines.push(
        `EMAIL:${esc(profile.email)}`
      );
    }

    const website =
      profile.website?.trim() ||
      profile.websiteUrl?.trim();

    if (website) {
      lines.push(
        `URL:${esc(
          /^https?:\/\//i.test(website)
            ? website
            : `https://${website}`
        )}`
      );
    }

    const address = [
      profile.shopUnit,
      profile.area,
      profile.city,
      profile.state,
      profile.pincode,
    ]
      .filter((value) => value?.trim())
      .join(", ");

    if (address) {
      lines.push(
        `ADR;TYPE=WORK:;;${esc(address)};;;;`
      );
    }

    const note =
      profile.bio?.trim() ||
      profile.headline?.trim();

    if (note) {
      lines.push(`NOTE:${esc(note)}`);
    }

    lines.push("END:VCARD");

    const blob = new Blob(
      [`${lines.join("\r\n")}\r\n`],
      {
        type: "text/vcard;charset=utf-8",
      }
    );

    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");

    a.href = url;

    a.download = `${
      (
        displayName || "contact"
      )
        .replace(
          /[<>:"/\\|?*\u0000-\u001F]/g,
          "-"
        )
        .trim() || "contact"
    }.vcf`;

    document.body.appendChild(a);

    a.click();
    a.remove();

    setTimeout(
      () => URL.revokeObjectURL(url),
      1000
    );

    setSaved(true);

    setTimeout(() => setSaved(false), 2000);
  };

  /* ============================================================
     CONFIGURED BUTTON HANDLER
     ============================================================ */

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
            `https://maps.google.com/?q=${encodeURIComponent(
              businessInfo?.address || ""
            )}`,
          "_blank",
          "noopener,noreferrer"
        );

      case "share":
        return shareProfile();

      case "website":
      case "customLink":
        if (!button.customUrl) {
          return alert(
            "This button has no link configured."
          );
        }

        return window.open(
          /^https?:\/\//i.test(button.customUrl)
            ? button.customUrl
            : `https://${button.customUrl}`,
          "_blank",
          "noopener,noreferrer"
        );

      case "saveContact":
        return handleSaveContact();

      case "upi":
        if (!businessInfo?.upiId) {
          return alert("UPI ID is not available.");
        }

        return (window.location.href =
          `upi://pay?pa=${encodeURIComponent(
            businessInfo.upiId
          )}&pn=${encodeURIComponent(
            businessInfo.businessName
          )}`);

      default:
        return;
    }
  };

  /* ============================================================
     INQUIRY SUBMIT
     ============================================================ */

  const submitInquiry = async (event) => {
    event.preventDefault();

    try {
      await dispatch(
        createInquiry({
          name: form.name.trim(),
          phone: form.phone.trim(),
          email: form.email.trim(),
          message: form.message.trim(),
          subdomain,
        })
      ).unwrap();

      setFormSubmitted(true);

      setForm({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      setShowToast(true);

      setTimeout(
        () => setShowToast(false),
        3000
      );

      setTimeout(
        () => setFormSubmitted(false),
        4000
      );
    } catch (error) {
      const message =
        typeof error === "string"
          ? error
          : error?.message ||
            "Failed to submit inquiry.";

      alert(message);
    }
  };

  /* ============================================================
     LOADING
     ============================================================ */

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        Loading business profile...
      </main>
    );
  }

  /* ============================================================
     ERROR
     ============================================================ */

  if (profileError || !profile || !businessInfo) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
        <h1 className="text-2xl font-bold">
          Profile unavailable
        </h1>

        <p>
          {profileError ||
            "This business profile could not be found."}
        </p>

        <Link to="/" className="underline">
          Go to Home
        </Link>
      </main>
    );
  }

  /* ============================================================
     ACCENT STYLE
     ============================================================ */

  const accentGradient =
    `linear-gradient(100deg, ${theme.primary}, ${theme.accent})`;

  /* ============================================================
     RENDER
     ============================================================ */

  return (
    <main
      className="min-h-screen px-3 py-4 sm:px-5 sm:py-6"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      {/* SUCCESS TOAST */}

      {showToast && (
        <div
          className="fixed left-1/2 top-5 z-[200] flex -translate-x-1/2 items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
          style={{
            background: theme.surface,
            border: `1px solid ${theme.primary}`,
            color: theme.text,
            animation: "toastSlideIn 0.3s ease",
          }}
        >
          <CheckCircle2
            size={18}
            style={{ color: theme.primary }}
          />

          Inquiry submitted successfully!
        </div>
      )}

      <style>{`
        @keyframes toastSlideIn {
          from {
            opacity: 0;
            transform: translate(-50%, -10px);
          }

          to {
            opacity: 1;
            transform: translate(-50%, 0);
          }
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
            <ShieldCheck
              size={20}
              style={{ color: theme.primary }}
            />

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
            style={{
              background: accentGradient,
              color: "#ffffff",
            }}
          >
            <Copy size={16} />

            {copied ? "Copied!" : "Copy Card Link"}
          </button>
        </div>

        {/* ====================================================
            ACTUAL MINI.JSX LAYOUT COMPONENT
            ==================================================== */}

        <article
          className="overflow-hidden rounded-2xl border shadow-2xl"
          style={{
            borderColor: theme.border,
          }}
        >
          <ActiveLayoutComponent
            businessInfo={businessInfo}
            visibleButtons={contactButtons}
            socialLinks={socialLinks}
            productList={productList}
            galleryImages={galleryImages}
            qrTargetUrl={qrValue || ""}
            qrFetching={false}
            formData={form}
            setFormData={setForm}
            onFormSubmit={submitInquiry}
            inquirySubmitting={false}
            inquirySubmitError=""
            formSubmitted={formSubmitted}
            onConfiguredButton={handleConfiguredButton}
            onShare={shareProfile}
            onOpenQr={() => {
              setQrModalTab("myqr");
              setShowQrModal(true);
            }}
            onProductClick={(product) =>
              setSelectedProduct(product)
            }
            onGalleryClick={(image) =>
              setSelectedGalleryImage(image)
            }
            onContactClick={handleConfiguredButton}
          />
        </article>
      </div>

      {/* ====================================================
          SHARE / MY QR / POSTER MODAL
          ==================================================== */}

      {showQrModal && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(event) => {
            if (event.target === event.currentTarget) {
              setShowQrModal(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-label="Share profile and QR code"
            className="relative max-h-[90vh] w-full max-w-md overflow-y-auto rounded-2xl border p-5 shadow-2xl sm:p-7"
            style={{
              background: theme.surface,
              borderColor: theme.border,
            }}
          >
            <button
              type="button"
              onClick={() => setShowQrModal(false)}
              aria-label="Close QR modal"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-lg"
              style={{
                background: theme.card,
                color: theme.text,
              }}
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

            {/* SHARE TAB */}

            {qrModalTab === "share" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={shareProfile}
                  className="flex w-full items-center justify-center gap-2 rounded-xl py-3 font-bold"
                  style={{
                    background: accentGradient,
                    color: "#fff",
                  }}
                >
                  <Share2 size={17} />
                  Share Profile
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
                  <Copy size={17} />

                  {copied
                    ? "Link Copied!"
                    : "Copy Profile Link"}
                </button>
              </div>
            )}

            {/* MY QR TAB */}

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
                          "bio-website-qr.png"
                        )
                      }
                      className="flex w-full items-center justify-center gap-2 rounded-xl border py-3 text-sm font-bold"
                      style={{
                        borderColor: theme.primary,
                        background: `${theme.primary}18`,
                        color: theme.primary,
                      }}
                    >
                      <Download size={16} />
                      Download QR Code
                    </button>
                  </>
                ) : (
                  <p
                    className="py-8 text-sm"
                    style={{ color: theme.muted }}
                  >
                    QR code is not available for this profile.
                  </p>
                )}
              </div>
            )}

            {/* POSTER TAB */}

            {qrModalTab === "poster" && (
              <div
                className="flex flex-col items-center rounded-xl border p-5 text-center"
                style={{
                  borderColor: theme.border,
                  background: theme.card,
                }}
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

                <p
                  className="mb-4 text-sm"
                  style={{ color: theme.muted }}
                >
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
                          "bio-profile-qr-poster.png"
                        )
                      }
                      className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold"
                      style={{
                        background: accentGradient,
                        color: "#fff",
                      }}
                    >
                      <Download size={16} />
                      Download Poster QR
                    </button>
                  </>
                ) : (
                  <p
                    className="py-8 text-sm"
                    style={{ color: theme.muted }}
                  >
                    QR code is not available for this profile.
                  </p>
                )}
              </div>
            )}
          </section>
        </div>
      )}

      {/* ====================================================
          PRODUCT MODAL
          ==================================================== */}

      {selectedProduct &&
        (() => {
          const imgs = Array.isArray(
            selectedProduct.images
          )
            ? selectedProduct.images.filter(
                (image) => image?.url
              )
            : [];

          return (
            <div
              className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-md"
              onClick={(event) => {
                if (
                  event.target === event.currentTarget
                ) {
                  setSelectedProduct(null);
                }
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
                  onClick={() =>
                    setSelectedProduct(null)
                  }
                  aria-label="Close product"
                  className="absolute right-4 top-4 z-20 flex h-9 w-9 items-center justify-center rounded-xl"
                  style={{
                    background: theme.card,
                    color: theme.text,
                  }}
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
                      <SwiperSlide
                        key={image._id || index}
                      >
                        <img
                          src={image.url}
                          alt={
                            image.alt ||
                            selectedProduct.name
                          }
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

                  <p
                    className="mt-2"
                    style={{ color: theme.primary }}
                  >
                    ₹
                    {Number(
                      selectedProduct.price || 0
                    ).toLocaleString("en-IN")}
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

                          handleConfiguredButton({
                            actionType: "upi",
                          });
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

                    {(businessInfo.whatsapp ||
                      businessInfo.phone) && (
                      <button
                        type="button"
                        onClick={() => {
                          setSelectedProduct(null);
                          openWhatsApp();
                        }}
                        className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
                        style={{
                          background: accentGradient,
                          color: "#ffffff",
                        }}
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

      {/* ====================================================
          GALLERY MODAL
          ==================================================== */}

      {selectedGalleryImage && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-md"
          onClick={(event) => {
            if (
              event.target === event.currentTarget
            ) {
              setSelectedGalleryImage(null);
            }
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
              onClick={() =>
                setSelectedGalleryImage(null)
              }
              aria-label="Close gallery"
              className="absolute right-3 top-3 z-20 flex h-10 w-10 items-center justify-center rounded-xl"
              style={{
                background: theme.card,
                color: theme.text,
              }}
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
                style={{
                  borderTop: `1px solid ${theme.border}`,
                }}
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