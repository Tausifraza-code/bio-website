import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

import api from "../redux/api";

import { downloadStandeePNG } from "../utils/downloadStandeePNG";
import {
  getLayoutComponent,
  normalizeLayoutId,
  DEFAULT_LAYOUT,
} from "../utils/profileLayoutRegistry";
import { getProfileTheme, getThemeVariables } from "../utils/profileThemes";

import { fetchMyProfile } from "../redux/slice/profileSlice";
import {
  fetchContactButtons,
  resetContactButtons,
} from "../redux/slice/contactButtonsSlice";
import { getMyProducts } from "../redux/slice/productSlice";
import { getMyGallery } from "../redux/slice/gallerySlice";
import { createInquiry } from "../redux/slice/inquirySlice";

import Payment from "./Payment";
import PlanPaymentModal from "../components/PlanPaymentModel";

import {
  Star,
  ShieldCheck,
  CheckCircle2,
  Send,
  X,
  IndianRupee,
  Download,
  Copy,
  FileImage,
  Share2,
} from "lucide-react";

/* ==========================================
   HELPERS
========================================== */

const hasValidProfile = (profile) => {
  if (!profile || typeof profile !== "object") return false;

  const firstName = profile.firstName?.trim() || "";
  const lastName = profile.lastName?.trim() || "";
  const businessName = profile.businessName?.trim() || "";

  const isDemo =
    /^(ankit's business|my business|your name)$/i.test(businessName) ||
    /^your name$/i.test(firstName);

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

/* ==========================================
   OVERLAY
========================================== */

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

/* ==========================================
   QR DISPLAY
========================================== */

const QrDisplay = ({
  id,
  size,
  value,
  imageSrc,
  fetching,
  emptyText = "QR code not available",
  emptyClass = "mb-3 flex h-40 w-40 items-center justify-center rounded-xl border border-[#29435f] bg-[#0b1b30] text-sm text-slate-400",
  wrapperClass = "mb-3 rounded-xl bg-white p-3",
}) => {
  if (fetching) {
    return <div className={emptyClass}>Loading QR...</div>;
  }

  if (!value) {
    return <div className={emptyClass}>{emptyText}</div>;
  }

  return (
    <div className={wrapperClass}>
      {imageSrc ? (
        <>
          <img
            src={imageSrc}
            alt="Saved Digital QR code"
            className="block h-auto max-w-full"
            style={{ width: size, height: size }}
          />

          <div className="hidden">
            <QRCodeCanvas
              id={id}
              value={value}
              size={size}
              level="H"
              includeMargin
            />
          </div>
        </>
      ) : (
        <QRCodeCanvas
          id={id}
          value={value}
          size={size}
          level="H"
          includeMargin
        />
      )}
    </div>
  );
};

/* ==========================================
   RAZORPAY SCRIPT
========================================== */

const loadRazorpayScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const existingScript = document.querySelector(
      'script[src="https://checkout.razorpay.com/v1/checkout.js"]',
    );

    if (existingScript) {
      existingScript.addEventListener("load", () => resolve(true), {
        once: true,
      });

      existingScript.addEventListener(
        "error",
        () => reject(new Error("Razorpay Checkout load nahi ho paaya.")),
        { once: true },
      );

      return;
    }

    const script = document.createElement("script");

    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);

    script.onerror = () =>
      reject(new Error("Razorpay Checkout load nahi ho paaya."));

    document.body.appendChild(script);
  });

/* ==========================================
   MAIN COMPONENT
========================================== */

const Mini = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  /* -------- REDUX -------- */

  const {
    profile,
    isVerified,
    loading: profileLoading,
  } = useSelector((state) => state.profile || {});

  const { products = [] } = useSelector((state) => state.product || {});

  const { buttons: contactButtons = [] } = useSelector(
    (state) => state.contactButtons || {},
  );

  const { gallery = [] } = useSelector((state) => state.gallery || {});

  const {
    submitting: inquirySubmitting = false,
    submitError: inquirySubmitError = null,
    submitSuccess: inquirySubmitSuccess = false,
  } = useSelector((state) => state.inquiry || {});

  /* -------- LOCAL STATES -------- */

  const [profileChecked, setProfileChecked] = useState(false);

  const [showPayment, setShowPayment] = useState(false);
  const [showPlanPayment, setShowPlanPayment] = useState(false);

  const [selectedProduct, setSelectedProduct] = useState(null);
  const [productPayment, setProductPayment] = useState(null);

  const [selectedGalleryImage, setSelectedGalleryImage] = useState(null);

  const [standeeCode, setStandeeCode] = useState("");
  const [standeeActivated, setStandeeActivated] = useState(false);

  const [isPreviewMode, setIsPreviewMode] = useState(true);

  const [copied, setCopied] = useState(false);
  const [saved, setSaved] = useState(false);

  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewSubmitted, setReviewSubmitted] = useState(false);
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

  const [showQrModal, setShowQrModal] = useState(false);
  const [qrModalTab, setQrModalTab] = useState("share");

  /* ==========================================
     FETCH PROFILE
  ========================================== */

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

  /* ==========================================
     FETCH OTHER DATA
  ========================================== */

  useEffect(() => {
    dispatch(getMyProducts());
    dispatch(getMyGallery());

    dispatch(resetContactButtons());
    dispatch(fetchContactButtons());
  }, [dispatch]);

  /* ==========================================
     PROFILE DATA
  ========================================== */

  const profileData = profile || {};

  const qrTargetUrl = profileData.qrUrl || "";
  const qrImage = profileData.qrCode || "";

  const productList = Array.isArray(products) ? products : [];

  /* ==========================================
     VISIBLE CONTACT BUTTONS
  ========================================== */

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

  /* ==========================================
     BUSINESS INFORMATION
  ========================================== */

  const businessInfo = useMemo(() => {
    const fullName = [profileData.firstName, profileData.lastName]
      .filter(Boolean)
      .join(" ");

    const location = [profileData.area, profileData.city, profileData.state]
      .filter(Boolean)
      .join(", ");

    const address = [
      profileData.shopUnit,
      profileData.area,
      profileData.landmark,
      profileData.city,
      profileData.state,
      profileData.pincode,
    ]
      .filter(Boolean)
      .join(", ");

    return {
      name: fullName,
      role: profileData.jobTitle || "",

      location: location || "Location not added",

      about: profileData.bio || profileData.headline || "",

      phone: profileData.phone || "",
      whatsapp: profileData.whatsapp || "",
      email: profileData.email || "",

      website: profileData.website || profileData.websiteUrl || "",

      address: address || "Address not added",

      logo: profileData.logo || null,
      avatar: profileData.avatar || null,
      banner: profileData.banner || null,

      industry: profileData.industry || "",
      businessName: profileData.businessName || "",

      businessHours: profileData.businessHours || "",
      upiId: profileData.upiId || "",

      isVerified: profileData.isVerified === true || isVerified === true,
    };
  }, [profileData, isVerified]);

  /* ==========================================
     GALLERY IMAGES
  ========================================== */

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

  /* ==========================================
     ACTIVE LAYOUT & THEME
  ========================================== */

  const activeLayout = normalizeLayoutId(
    profileData.activeLayout || DEFAULT_LAYOUT,
  );

  const ActiveLayoutComponent = getLayoutComponent(activeLayout);

  const activeTheme = profileData.activeTheme || "sunset";

  const theme = getProfileTheme(activeTheme);

  /* ==========================================
     SOCIAL LINKS
  ========================================== */

  const socialLinks = useMemo(() => {
    if (!Array.isArray(profileData.socialCards)) return [];

    return profileData.socialCards
      .filter((social) => social?.url)
      .map((social) => {
        const platform =
          social.platform || social.platformName || social.icon || "";

        return {
          ...social,
          platform,
          platformName: social.platformName || platform,
          icon: social.icon || platform,
        };
      });
  }, [profileData.socialCards]);

  /* ==========================================
     STANDEE
  ========================================== */

  const handleActivateStandee = () => {
    if (standeeCode.trim()) {
      setStandeeActivated(true);
    }
  };

  /* ==========================================
     PLAN PAYMENT
  ========================================== */

  const handlePlanProceed = async (selectedPlan, subdomain) => {
    const profileSubdomain = String(
      subdomain || profileData.subdomain || "",
    ).trim();

    if (!profileSubdomain) {
      throw new Error("Profile subdomain configure nahi hai.");
    }

    if (!selectedPlan?._id) {
      throw new Error("Please ek valid plan select karein.");
    }

    await loadRazorpayScript();

    const orderResponse = await api.post("/plan-purchases/create-order", {
      planId: selectedPlan._id,
      subdomain: profileSubdomain,
    });

    const orderData = orderResponse.data?.data;

    if (!orderResponse.data?.success || !orderData?.orderId) {
      throw new Error(
        orderResponse.data?.message || "Payment order create nahi ho paaya.",
      );
    }

    if (!orderData.razorpayKeyId) {
      throw new Error("Razorpay key server response mein nahi mili.");
    }

    return new Promise((resolve, reject) => {
      let settled = false;

      const finish = (callback, value) => {
        if (settled) return;

        settled = true;
        callback(value);
      };

      const checkout = new window.Razorpay({
        key: orderData.razorpayKeyId,

        amount: orderData.orderAmount,

        currency: orderData.orderCurrency || "INR",

        name: "BioWebsite",

        description: `${orderData.planName || selectedPlan.name} Plan`,

        order_id: orderData.orderId,

        theme: {
          color: "#22d3ee",
        },

        handler: async (razorpayResponse) => {
          try {
            const verifyResponse = await api.post(
              "/plan-purchases/verify-payment",
              {
                razorpay_order_id: razorpayResponse.razorpay_order_id,

                razorpay_payment_id: razorpayResponse.razorpay_payment_id,

                razorpay_signature: razorpayResponse.razorpay_signature,

                subdomain: profileSubdomain,
              },
            );

            if (!verifyResponse.data?.success) {
              throw new Error(
                verifyResponse.data?.message ||
                  "Payment verification fail ho gayi.",
              );
            }

            finish(resolve, true);

            setShowPlanPayment(false);

            navigate(`/card-preview/${encodeURIComponent(profileSubdomain)}`);
          } catch (error) {
            finish(
              reject,
              new Error(
                error?.response?.data?.message ||
                  error?.message ||
                  "Payment verify nahi ho paayi. Please payment status check karein.",
              ),
            );
          }
        },

        modal: {
          ondismiss: () => {
            finish(reject, new Error("Payment window close kar di gayi."));
          },
        },
      });

      checkout.on("payment.failed", (event) => {
        finish(
          reject,
          new Error(
            event?.error?.description ||
              "Payment fail ho gayi. Please dobara try karein.",
          ),
        );
      });

      checkout.open();
    });
  };

  const handleWhatsApp = () => {
    const number = (businessInfo?.whatsapp || "").replace(/\D/g, "");

    if (!number) {
      return alert("WhatsApp number is not available in this profile.");
    }

    const businessName =
      businessInfo?.businessName || businessInfo?.name || "your business";

    const message = `Hi, I viewed your ${businessName} profile and would like to know more about your products and services. Please share more details.`;

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer",
    );
  };
  /* ==========================================
     WHATSAPP
  ========================================== */

  const handleProductWhatsAppInquiry = (product) => {
    const number = (businessInfo?.whatsapp || "").replace(/\D/g, "");

    if (!number) {
      return alert("WhatsApp number is not available in this profile.");
    }

    if (!product) {
      return alert("Product details are not available.");
    }

    const message = [
      "Hi, I'm interested in the following product/service:",
      "",
      `Name: ${product.name || "N/A"}`,
      `Price: ₹${Number(product.price || 0).toLocaleString("en-IN")}`,
      `Category: ${product.category || "General"}`,
      `Type: ${product.type || "product"}`,
      "",
      "Please share more details.",
    ].join("\n");

    const whatsappUrl = `https://wa.me/${number}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  /* ==========================================
     CALL
  ========================================== */

  const handleCall = () => {
    if (!businessInfo.phone) {
      return alert("Phone number is not available.");
    }

    window.location.href = `tel:${businessInfo.phone.replace(/\s/g, "")}`;
  };

  /* ==========================================
     SHARE
  ========================================== */

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
        // User cancelled sharing.
      }
    } else {
      handleCopyLink();
    }
  };

  /* ==========================================
     COPY PROFILE LINK
  ========================================== */

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy the link. Please copy it from the address bar.");
    }
  };

  /* ==========================================
     DOWNLOAD QR
  ========================================== */

  const handleDownloadQR = (canvasId = "bound-qr-canvas") => {
    if (!qrTargetUrl) {
      return alert("Bound QR code is not available.");
    }

    const canvas = document.getElementById(canvasId);

    if (!canvas) {
      return alert("QR code is not ready yet.");
    }

    const link = document.createElement("a");

    link.href = canvas.toDataURL("image/png");
    link.download = "bio-website-qr.png";

    document.body.appendChild(link);

    link.click();
    link.remove();
  };

  /* ==========================================
     DOWNLOAD STANDEE
  ========================================== */

  const handleDownloadStandee = async () => {
    if (!qrTargetUrl) {
      return alert("Bound QR code is not available.");
    }

    try {
      await downloadStandeePNG({
        qrValue: qrTargetUrl,

        shopName:
          profileData.businessName?.trim() ||
          businessInfo.name?.trim() ||
          "My Business",

        socialLinks,
      });
    } catch (error) {
      console.error("Standee download failed:", error);

      alert("Standee download nahi ho paaya. Please try again.");
    }
  };

  /* ==========================================
     SAVE CONTACT
  ========================================== */

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

    if (displayName) {
      lines.push(`FN:${esc(displayName)}`);
    }

    if (profileData.businessName?.trim()) {
      lines.push(`ORG:${esc(profileData.businessName)}`);
    }

    if (profileData.jobTitle?.trim()) {
      lines.push(`TITLE:${esc(profileData.jobTitle)}`);
    }

    if (profileData.phone?.trim()) {
      lines.push(`TEL;TYPE=CELL:${esc(profileData.phone)}`);
    }

    if (profileData.email?.trim()) {
      lines.push(`EMAIL:${esc(profileData.email)}`);
    }

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

    if (address) {
      lines.push(`ADR;TYPE=WORK:;;${esc(address)};;;;`);
    }

    const note = profileData.bio?.trim() || profileData.headline?.trim();

    if (note) {
      lines.push(`NOTE:${esc(note)}`);
    }

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

  /* ==========================================
     CONTACT BUTTON HANDLER
  ========================================== */

  const handleContactClick = (type) => {
    if (type === "phone") {
      return handleCall();
    }

    if (type === "whatsapp") {
      return handleWhatsApp();
    }

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
      if (!profileData.upiId?.trim()) {
        return alert("UPI ID is not available.");
      }

      setShowPayment(true);
    }
  };

  /* ==========================================
     CONFIGURED BUTTON HANDLER
  ========================================== */

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
        if (!button.customUrl) {
          return alert("This button has no link configured.");
        }

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

  /* ==========================================
     INQUIRY FORM
  ========================================== */

  const handleFormSubmit = async (event) => {
    event.preventDefault();

    const subdomain = profileData.subdomain?.trim() || "";

    if (!subdomain) {
      return alert("This profile does not have a subdomain configured.");
    }

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

      setFormData({
        name: "",
        phone: "",
        email: "",
        message: "",
      });

      window.setTimeout(() => setFormSubmitted(false), 3000);
    } catch (error) {
      console.error("Inquiry submission failed:", error);
    }
  };

  /* ==========================================
     REVIEW SUBMIT
  ========================================== */

  const handleReviewSubmit = (event) => {
    event.preventDefault();

    setReviewSubmitted(true);

    window.setTimeout(() => {
      setShowReviewModal(false);
      setReviewSubmitted(false);

      setReviewData({
        name: "",
        review: "",
      });

      setReviewRating(5);
    }, 2000);
  };

  /* ==========================================
     LOADING
  ========================================== */

  if (profileLoading || !profileChecked || !profile) {
    return null;
  }

  /* ==========================================
     JSX
  ========================================== */

  return (
    <div className="relative min-h-screen bg-transparent font-sans text-slate-800">
      <main className="relative mx-auto w-full max-w-[1300px] px-2 py-3 sm:px-4 sm:py-5 lg:px-6">
        {/* PAY & PUBLISH */}

        <div className="mb-6 overflow-hidden rounded-2xl border border-cyan-400/30 bg-gradient-to-r from-[#0b1b30] via-[#102b49] to-[#0b1b30] p-5 shadow-lg sm:p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-cyan-300">
                <ShieldCheck size={24} />
              </div>

              <div>
                <h2 className="text-lg font-bold text-white">
                  Publish Your Digital Profile
                </h2>

                <p className="mt-1 max-w-xl text-sm leading-6 text-slate-400">
                  Apna plan select karein, secure payment complete karein aur
                  payment verification ke baad profile preview par jaayein.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowPlanPayment(true)}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-extrabold text-[#0b1b30] transition hover:bg-cyan-300 hover:shadow-lg hover:shadow-cyan-400/20"
            >
              Pay & Publish
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>

        {/* PROFILE PREVIEW */}

        {isPreviewMode && (
          <section className="pb-10">
            <div
              className="w-full overflow-hidden rounded-[24px] border border-cyan-400/20 shadow-2xl sm:rounded-[28px]"
              data-profile-theme={activeTheme}
              style={{
                ...getThemeVariables(theme),
                background: theme.background,
                color: theme.text,
              }}
            >
              <ActiveLayoutComponent
                businessInfo={businessInfo}
                visibleButtons={visibleButtons}
                socialLinks={socialLinks}
                productList={productList}
                galleryImages={galleryImages}
                qrTargetUrl={qrTargetUrl || ""}
                qrFetching={Boolean(profileLoading)}
                formData={formData}
                setFormData={setFormData}
                onFormSubmit={handleFormSubmit}
                inquirySubmitting={inquirySubmitting}
                inquirySubmitError={inquirySubmitError}
                formSubmitted={formSubmitted || inquirySubmitSuccess}
                onConfiguredButton={handleConfiguredButton}
                onShare={handleShare}
                onOpenQr={() => {
                  setQrModalTab("myqr");
                  setShowQrModal(true);
                }}
                onProductClick={(product) => setSelectedProduct(product)}
                onProductWhatsAppInquiry={handleProductWhatsAppInquiry}
                onGalleryClick={(image) => setSelectedGalleryImage(image)}
                onContactClick={handleContactClick}
                theme={theme}
              />
            </div>

            {/* REVIEWS */}

            <div className="mx-auto mt-5 flex max-w-6xl flex-col gap-3 rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-400">
                  Customer feedback
                </p>

                <h3 className="mt-1 text-lg font-bold text-white">Reviews</h3>

                <p className="mt-1 text-sm text-slate-400">
                  Be the first to share your experience with this business.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(true)}
                className="inline-flex shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 px-5 py-3 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400/20"
              >
                Write Review
              </button>
            </div>
          </section>
        )}
      </main>

      {/* ==========================================
          QR MODAL
      ========================================== */}

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

            {/* SHARE TAB */}

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

            {/* MY QR TAB */}

            {qrModalTab === "myqr" && (
              <div className="flex flex-col items-center">
                <QrDisplay
                  id="bound-qr-modal-canvas"
                  size={220}
                  value={qrTargetUrl}
                  imageSrc={qrImage}
                  fetching={Boolean(profileLoading)}
                  emptyText="Your Digital QR is not available yet."
                  emptyClass="mb-5 py-10 text-sm text-slate-400"
                  wrapperClass="mb-5 rounded-xl bg-white p-4"
                />

                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-modal-canvas")}
                  disabled={!qrTargetUrl || profileLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-3 text-sm font-bold text-cyan-400 disabled:opacity-50"
                >
                  <Download size={16} />
                  Download QR Code
                </button>

                <button
                  type="button"
                  onClick={handleDownloadStandee}
                  disabled={!qrTargetUrl || profileLoading}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3 text-sm font-bold text-[#0b1b30] disabled:opacity-50"
                >
                  <FileImage size={16} />
                  Download QR Standee (PNG)
                </button>
              </div>
            )}

            {/* POSTER TAB */}

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
                  imageSrc={qrImage}
                  fetching={Boolean(profileLoading)}
                  emptyText="Your Digital QR is not available yet."
                  emptyClass="text-sm text-slate-400"
                  wrapperClass="rounded-xl bg-white p-3"
                />

                <button
                  type="button"
                  onClick={() => handleDownloadQR("bound-qr-poster-canvas")}
                  disabled={!qrTargetUrl || profileLoading}
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

      {/* ==========================================
          PRODUCT MODAL
      ========================================== */}

      {selectedProduct && (
        <Overlay onClose={() => setSelectedProduct(null)}>
          <div className="relative w-full max-w-sm rounded-[26px] border border-cyan-400/30 bg-[#0b1b30] p-6 text-center shadow-2xl">
            <button
              type="button"
              onClick={() => setSelectedProduct(null)}
              aria-label="Close product popup"
              className="absolute right-4 top-4 flex h-9 w-9 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-300"
            >
              <X size={18} />
            </button>

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-300">
              <IndianRupee size={27} />
            </div>

            <p className="mt-5 text-sm font-medium text-slate-400">
              Product Amount
            </p>

            <h3 className="mt-2 text-4xl font-extrabold text-white">
              ₹{Number(selectedProduct.price || 0).toLocaleString("en-IN")}
            </h3>

            <button
              type="button"
              disabled={
                !businessInfo.upiId || Number(selectedProduct.price || 0) <= 0
              }
              onClick={() => {
                setProductPayment({
                  amount: Number(selectedProduct.price),
                  name: selectedProduct.name || "Product",
                });

                setSelectedProduct(null);
              }}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3.5 text-sm font-extrabold text-[#0b1b30] transition hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <IndianRupee size={17} />
              Pay with App
            </button>

            {!businessInfo.upiId && (
              <p className="mt-3 text-xs text-red-300">
                UPI ID is not available.
              </p>
            )}
          </div>
        </Overlay>
      )}

      {/* ==========================================
          GALLERY MODAL
      ========================================== */}

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

      {/* ==========================================
          REVIEW MODAL
      ========================================== */}

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
                  onChange={(event) =>
                    setReviewData({
                      ...reviewData,
                      name: event.target.value,
                    })
                  }
                  placeholder="Enter your name"
                  className="w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-white outline-none focus:border-cyan-400"
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
                    >
                      <Star
                        size={28}
                        className={
                          number <= reviewRating
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
                  onChange={(event) =>
                    setReviewData({
                      ...reviewData,
                      review: event.target.value,
                    })
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

      {/* ==========================================
          PLAN PAYMENT MODAL
      ========================================== */}

      <PlanPaymentModal
        isOpen={showPlanPayment}
        onClose={() => setShowPlanPayment(false)}
        subdomain={profileData.subdomain || ""}
        onProceed={handlePlanProceed}
      />

      {/* ==========================================
          UPI PAYMENT
      ========================================== */}

      <Payment
        isOpen={showPayment || Boolean(productPayment)}
        onClose={() => {
          setShowPayment(false);
          setProductPayment(null);
        }}
        upiId={profileData.upiId || ""}
        businessName={profileData.businessName || "My Business"}
        businessImage={profileData.logo || profileData.avatar || ""}
        fixedAmount={productPayment?.amount ?? null}
        productName={productPayment?.name || ""}
      />
    </div>
  );
};

export default Mini;
