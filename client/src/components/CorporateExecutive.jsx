import React, { useEffect, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import {
  UserRoundPlus,
  Phone,
  MessageCircle,
  Globe,
  Mail,
  MapPin,
  Share2,
  QrCode,
  CreditCard,
  IndianRupee,
} from "lucide-react";
import GoogleBusinessIcon from "./icons/GoogleBusinessIcon";

import "swiper/css";

import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaXTwitter,
  FaYoutube,
  FaGlobe,
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaLocationDot,
  FaShareNodes,
  FaQrcode,
  FaArrowUpRightFromSquare,
  FaClock,
  FaCheck,
  FaStar,
  FaXmark,
  FaPen,
  FaSpinner,
  FaTelegram,
  FaThreads,
  FaSnapchat,
  FaTiktok,
  FaPinterest,
  FaGithub,
  FaDiscord,
  FaReddit,
  FaTwitch,
  FaSpotify,
  FaMedium,
} from "react-icons/fa6";
import SnapchatIcon from "./icons/SnapchatIcon";

const CorporateExecutive = ({
  // Accept subdomain directly from CardPreview
  subdomain: receivedSubdomain = "",

  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
  reviews: reviewList = [],
  totalReviews = 0,
  averageRating = 0,
  productList = [],
  galleryImages = [],
  qrTargetUrl = "",
  qrFetching = false,
  formData = { name: "", phone: "", email: "", message: "" },
  setFormData = () => {},
  onFormSubmit = () => {},
  inquirySubmitting = false,
  inquirySubmitError = null,
  formSubmitted = false,
  onConfiguredButton = () => {},
  onShare = () => {},
  onOpenQr = () => {},
  onProductClick = () => {},
  onProductWhatsAppInquiry = () => {},
  onGalleryWhatsAppInquiry = () => {},
  onGalleryClick = () => {},
  onContactClick = () => {},
  onReviewSubmit = null,
  reviewSubmitting = false,
  reviewSubmitError = null,
}) => {
  const [showAllSocialLinks, setShowAllSocialLinks] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const [reviewForm, setReviewForm] = useState({
    reviewerName: "",
    reviewerEmail: "",
    rating: 5,
    comment: "",
  });

  const [reviewToast, setReviewToast] = useState(null);

  useEffect(() => {
    if (!reviewToast) return;

    const timer = setTimeout(() => {
      setReviewToast(null);
    }, 3500);

    return () => clearTimeout(timer);
  }, [reviewToast]);

  const {
    name = "Your Name",
    role = "Business Professional",
    location = "",
    about = "",
    phone = "",
    whatsapp = "",
    email = "",
    website = "",
    address = "",
    logo = "",
    avatar = "",
    banner = "",
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
    mapLink = "",
  } = businessInfo;

  // FIX: Resolve subdomain from all supported sources.
  // Top-level prop gets priority, followed by businessInfo fields.
  const subdomain = String(
    receivedSubdomain ||
      businessInfo?.subdomain ||
      businessInfo?.subDomain ||
      businessInfo?.slug ||
      businessInfo?.username ||
      "",
  )
    .trim()
    .toLowerCase();

  const GOLD = "#FFB703";
  const DARK = "#172B3A";

  const displayName = name || businessName || "Your Name";
  const displayRole = role || industry || "Business Professional";

  // REVIEWS
  const reviews =
    Array.isArray(reviewList) && reviewList.length
      ? reviewList
      : Array.isArray(businessInfo.reviews)
        ? businessInfo.reviews
        : [];

  const reviewAverage = Number(
    averageRating ||
      businessInfo.rating ||
      businessInfo.averageRating ||
      (reviews.length
        ? reviews.reduce((total, item) => total + Number(item.rating || 0), 0) /
          reviews.length
        : 0),
  );

  const reviewTotal =
    totalReviews ||
    businessInfo.reviewCount ||
    businessInfo.reviewsCount ||
    reviews.length;

  // DYNAMIC BACKEND BUTTONS
  const configuredButtons = Array.isArray(visibleButtons)
    ? visibleButtons
    : Array.isArray(visibleButtons?.buttons)
      ? visibleButtons.buttons
      : [];

  const activeButtons = configuredButtons
    .filter((button) => button && button.enabled === true && button.actionType)
    .sort((a, b) => Number(a.order ?? 0) - Number(b.order ?? 0));

  const isSaveButton = (button) => {
    const actionType = String(button?.actionType || "").toLowerCase();
    const icon = String(button?.icon || "").toLowerCase();
    const label = String(button?.label || "").toLowerCase();
    const buttonId = String(button?.buttonId || "").toLowerCase();
    return (
      actionType === "savecontact" ||
      actionType === "save" ||
      buttonId === "save-contact" ||
      icon === "save-contact" ||
      icon === "user-round-plus" ||
      label.includes("save")
    );
  };

  // DYNAMIC BUTTON ICONS
  const getButtonIcon = (icon, actionType, isSave = false) => {
    const iconKey = String(icon || "").toLowerCase();
    const actionKey = String(actionType || "").toLowerCase();

    if (
      actionKey === "googlebusiness" ||
      iconKey === "google" ||
      iconKey === "googlebusiness"
    ) {
      return <GoogleBusinessIcon size={21} className="shrink-0" />;
    }

    if (
      actionKey === "whatsapp" ||
      iconKey === "whatsapp" ||
      actionKey === "message-circle" ||
      iconKey === "message-circle"
    ) {
      return <FaWhatsapp size={22} className="shrink-0 text-[#22c55e]" />;
    }

    const iconMap = {
      "user-round-plus": UserRoundPlus,
      contact: UserRoundPlus,
      "save-contact": UserRoundPlus,
      savecontact: UserRoundPlus,
      save: UserRoundPlus,
      phone: Phone,
      call: Phone,
      "message-circle": FaWhatsapp,
      whatsapp: FaWhatsapp,
      website: Globe,
      globe: Globe,
      email: Mail,
      mail: Mail,
      location: MapPin,
      map: MapPin,
      directions: MapPin,
      share: Share2,
      "share-2": Share2,
      qrcode: QrCode,
      "qr-code": QrCode,
      upi: IndianRupee,
      payment: IndianRupee,
      pay: IndianRupee,
      rupee: IndianRupee,
      wallet: IndianRupee,
      card: IndianRupee,
      "credit-card": IndianRupee,
    };

    const getIconColorClass = () => {
      if (
        isSave ||
        actionKey === "savecontact" ||
        actionKey === "save" ||
        iconKey === "user-round-plus" ||
        iconKey === "save-contact"
      ) {
        return "text-indigo-200";
      }
      if (
        actionKey === "call" ||
        actionKey === "phone" ||
        iconKey === "phone" ||
        iconKey === "call"
      ) {
        return "text-[#10b981]";
      }
      if (
        actionKey === "whatsapp" ||
        iconKey === "whatsapp" ||
        iconKey === "message-circle"
      ) {
        return "text-[#22c55e]";
      }
      if (
        actionKey === "email" ||
        actionKey === "mail" ||
        iconKey === "email" ||
        iconKey === "mail"
      ) {
        return "text-[#3b82f6]";
      }
      if (
        actionKey === "directions" ||
        actionKey === "address" ||
        actionKey === "location" ||
        actionKey === "map" ||
        iconKey === "location" ||
        iconKey === "map" ||
        iconKey === "directions"
      ) {
        return "text-[#f43f5e]";
      }
      if (
        actionKey === "share" ||
        iconKey === "share" ||
        iconKey === "share-2"
      ) {
        return "text-[#f97316]";
      }
      if (
        actionKey === "website" ||
        actionKey === "customlink" ||
        iconKey === "website" ||
        iconKey === "globe"
      ) {
        return "text-[#06b6d4]";
      }
      if (
        actionKey === "upi" ||
        actionKey === "payment" ||
        actionKey === "pay" ||
        iconKey === "upi" ||
        iconKey === "payment" ||
        iconKey === "wallet" ||
        iconKey === "rupee" ||
        iconKey === "card" ||
        iconKey === "credit-card"
      ) {
        return "text-[#a855f7]";
      }
      return "text-indigo-300";
    };

    const IconComponent =
      (isSave ? UserRoundPlus : null) ||
      iconMap[actionKey] ||
      iconMap[iconKey] ||
      Globe;

    return (
      <IconComponent
        size={21}
        strokeWidth={2.2}
        className={`shrink-0 ${getIconColorClass()}`}
      />
    );
  };

  // CONTACT HANDLER
  const handleContact = (type) => onContactClick(type);

  // DYNAMIC BUTTON ACTIONS
  const handleDynamicButton = (button) => {
    if (!button) return;

    const actionType = String(button.actionType || "").toLowerCase();
    const customUrl = String(button.customUrl || "").trim();

    const actions = {
      savecontact: () => {
        if (typeof onConfiguredButton === "function") {
          onConfiguredButton(button);
        } else {
          handleContact("saveContact");
        }
      },
      save: () => {
        if (typeof onConfiguredButton === "function") {
          onConfiguredButton(button);
        } else {
          handleContact("saveContact");
        }
      },
      call: () => handleContact("phone"),
      whatsapp: () => handleContact("whatsapp"),
      upi: () => handleContact("upi"),
      email: () => handleContact("email"),
      directions: () => handleContact("directions"),

      website: () => {
        const url = customUrl || website;

        if (url) {
          const finalUrl = /^https?:\/\//i.test(url) ? url : `https://${url}`;

          window.open(finalUrl, "_blank", "noopener,noreferrer");
        } else {
          handleContact("website");
        }
      },

      googlebusiness: () => {
        if (customUrl) {
          const finalUrl = /^https?:\/\//i.test(customUrl)
            ? customUrl
            : `https://${customUrl}`;

          window.open(finalUrl, "_blank", "noopener,noreferrer");
        } else {
          onConfiguredButton(button);
        }
      },

      share: () => onShare(),
    };

    if (actions[actionType]) {
      actions[actionType]();
    } else {
      onConfiguredButton(button);
    }
  };

  // SOCIAL LINKS
  const visibleSocialLinks = showAllSocialLinks
    ? socialLinks
    : socialLinks.slice(0, 4);

  const getSocialIcon = (platform, url = "") => {
    let combined = "";
    if (typeof platform === "object" && platform !== null) {
      combined =
        `${platform.platform || ""} ${platform.platformName || ""} ${platform.name || ""} ${platform.url || ""}`.toLowerCase();
    } else {
      combined = `${platform || ""} ${url || ""}`.toLowerCase();
    }

    if (combined.includes("whatsapp") || combined.includes("wa.me"))
      return <FaWhatsapp />;
    if (combined.includes("instagram") || combined.includes("insta"))
      return <FaInstagram />;
    if (combined.includes("facebook") || combined.includes("fb.com"))
      return <FaFacebookF />;
    if (combined.includes("youtube") || combined.includes("youtu.be"))
      return <FaYoutube />;
    if (combined.includes("linkedin")) return <FaLinkedinIn />;
    if (combined.includes("twitter") || combined.includes("x.com"))
      return <FaXTwitter />;
    if (combined.includes("telegram") || combined.includes("t.me"))
      return <FaTelegram />;
    if (combined.includes("threads")) return <FaThreads />;
    if (combined.includes("snapchat"))
      return <SnapchatIcon size={14} className="shrink-0" />;
    if (combined.includes("tiktok")) return <FaTiktok />;
    if (combined.includes("pinterest") || combined.includes("pin.it"))
      return <FaPinterest />;
    if (combined.includes("github")) return <FaGithub />;
    if (combined.includes("discord")) return <FaDiscord />;
    if (combined.includes("reddit")) return <FaReddit />;
    if (combined.includes("twitch")) return <FaTwitch />;
    if (combined.includes("spotify")) return <FaSpotify />;
    if (combined.includes("medium")) return <FaMedium />;

    return <FaGlobe />;
  };

  const getSocialBadgeColors = (platform = "") => {
    const p = String(platform || "").toLowerCase();
    if (p.includes("instagram") || p.includes("insta"))
      return { bg: "#E4405F", color: "#ffffff" };
    if (p.includes("youtube") || p.includes("youtu"))
      return { bg: "#FF0000", color: "#ffffff" };
    if (p.includes("facebook") || p.includes("fb"))
      return { bg: "#1877F2", color: "#ffffff" };
    if (p.includes("whatsapp") || p.includes("wa.me"))
      return { bg: "#25D366", color: "#ffffff" };
    if (p.includes("linkedin")) return { bg: "#0A66C2", color: "#ffffff" };
    if (p.includes("telegram") || p.includes("t.me"))
      return { bg: "#26A5E4", color: "#ffffff" };
    if (p.includes("twitter") || p.includes("x.com"))
      return { bg: "#000000", color: "#ffffff" };
    if (p.includes("threads")) return { bg: "#000000", color: "#ffffff" };
    if (p.includes("snapchat")) return { bg: "#FFFC00", color: "#000000" };
    if (p.includes("tiktok")) return { bg: "#000000", color: "#ffffff" };
    if (p.includes("pinterest") || p.includes("pin.it"))
      return { bg: "#E60023", color: "#ffffff" };
    if (p.includes("github")) return { bg: "#24292e", color: "#ffffff" };
    if (p.includes("discord")) return { bg: "#5865F2", color: "#ffffff" };
    if (p.includes("reddit")) return { bg: "#FF4500", color: "#ffffff" };
    if (p.includes("twitch")) return { bg: "#9146FF", color: "#ffffff" };
    if (p.includes("spotify")) return { bg: "#1DB954", color: "#ffffff" };
    return { bg: "#6366f1", color: "#ffffff" };
  };

  // IMAGE URL
  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;

    return image.url || image.imageUrl || image.src || "";
  };

  const heroImage = getImageUrl(banner);
  const profileImage = getImageUrl(avatar);
  const businessLogo = getImageUrl(logo);

  // SCROLL TO INQUIRY
  const handleBookChair = () => {
    document.getElementById("send-inquiry-section")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  // OPEN REVIEW MODAL
  const openReviewModal = () => {
    setReviewForm({
      reviewerName: "",
      reviewerEmail: "",
      rating: 5,
      comment: "",
    });

    setShowReviewModal(true);
  };

  // REVIEW SUBMISSION
  const handleReviewSubmit = async (event) => {
    event.preventDefault();

    if (!onReviewSubmit) {
      setReviewToast({
        type: "error",
        message: "Review submission is not connected yet.",
      });
      return;
    }

    // FIX: Check resolved subdomain
    if (!subdomain) {
      console.error("CorporateExecutive: Business subdomain missing.", {
        receivedSubdomain,
        businessInfoSubdomain: businessInfo?.subdomain,
        businessInfo,
      });

      setReviewToast({
        type: "error",
        message: "Business subdomain is missing. Please try again.",
      });
      return;
    }

    if (!reviewForm.reviewerName.trim()) {
      setReviewToast({
        type: "error",
        message: "Please enter your name.",
      });
      return;
    }

    if (!reviewForm.comment.trim()) {
      setReviewToast({
        type: "error",
        message: "Please write your review.",
      });
      return;
    }

    if (
      !Number.isInteger(Number(reviewForm.rating)) ||
      Number(reviewForm.rating) < 1 ||
      Number(reviewForm.rating) > 5
    ) {
      setReviewToast({
        type: "error",
        message: "Please select a valid rating.",
      });
      return;
    }

    try {
      await onReviewSubmit({
        subdomain,
        reviewerName: reviewForm.reviewerName.trim(),
        reviewerEmail: reviewForm.reviewerEmail.trim(),
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment.trim(),
      });

      setShowReviewModal(false);

      setReviewForm({
        reviewerName: "",
        reviewerEmail: "",
        rating: 5,
        comment: "",
      });

      setReviewToast({
        type: "success",
        message: "Your review has been submitted successfully!",
      });
    } catch (error) {
      setReviewToast({
        type: "error",
        message:
          error?.message ||
          reviewSubmitError ||
          "Unable to submit your review. Please try again.",
      });
    }
  };

  // COPY QR LINK
  const handleCopyQrLink = async () => {
    if (!qrTargetUrl) return;

    try {
      await navigator.clipboard.writeText(qrTargetUrl);
    } catch (error) {
      const field = document.createElement("textarea");
      field.value = qrTargetUrl;
      document.body.appendChild(field);
      field.select();
      document.execCommand("copy");
      field.remove();
    }
  };

  // DOWNLOAD QR
  const handleDownloadQr = () => {
    const canvas = document.querySelector(".corporate-profile-qr canvas");

    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `${(businessName || name || "business").replace(
      /[^a-z0-9-_]/gi,
      "-",
    )}-qr.png`;

    link.click();
  };

  const sectionHeading =
    "mt-2 text-2xl font-extrabold tracking-tight text-[#172B3A] sm:text-3xl lg:text-4xl";

  const sectionLabel =
    "text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#D99500]";

  const cardClass =
    "rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(23,43,58,0.06)]";

  const inputClass =
    "w-full rounded-xl border border-slate-200 bg-[#F8FAFC] px-4 py-3.5 text-sm text-[#172B3A] outline-none transition placeholder:text-slate-400 focus:border-[#FFB703] focus:bg-white focus:ring-4 focus:ring-[#FFB703]/15";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#FFB703] px-6 py-3 text-sm font-extrabold text-[#172B3A] shadow-[0_5px_15px_rgba(255,183,3,0.25)] transition duration-300 hover:-translate-y-0.5 hover:bg-[#EFA900] hover:shadow-[0_8px_22px_rgba(255,183,3,0.35)] active:translate-y-0";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full border border-white/35 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-md transition duration-300 hover:border-[#FFB703] hover:bg-[#FFB703] hover:text-[#172B3A]";

  return (
    <main className="min-h-screen w-full overflow-hidden bg-[#0b1224] text-slate-100">
      {/* REVIEW TOAST */}
      {reviewToast && (
        <div
          role="status"
          className={`fixed right-4 top-4 z-[10000] flex max-w-[calc(100%-32px)] items-center gap-3 rounded-xl border px-4 py-3 shadow-2xl ${
            reviewToast.type === "success"
              ? "border-emerald-500/40 bg-[#102c25] text-emerald-300"
              : "border-rose-500/40 bg-[#321b25] text-rose-300"
          }`}
        >
          <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white/10">
            {reviewToast.type === "success" ? <FaCheck /> : <FaXmark />}
          </span>

          <span className="text-xs font-bold">{reviewToast.message}</span>

          <button
            type="button"
            onClick={() => setReviewToast(null)}
            className="ml-2 text-sm opacity-70 hover:opacity-100"
            aria-label="Close notification"
          >
            <FaXmark />
          </button>
        </div>
      )}

      {/* WRITE REVIEW MODAL */}
      {showReviewModal && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-black/75 px-3 py-6 backdrop-blur-sm"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setShowReviewModal(false);
            }
          }}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="review-modal-title"
            className="relative my-auto w-full max-w-[430px] overflow-hidden rounded-[22px] border border-slate-700 bg-[#101a2d] shadow-[0_25px_80px_rgba(0,0,0,0.55)]"
          >
            <div className="flex items-center justify-between border-b border-slate-700 px-5 py-4">
              <div>
                <p className="text-[9px] font-extrabold uppercase tracking-[0.2em] text-amber-400">
                  Customer Feedback
                </p>

                <h2
                  id="review-modal-title"
                  className="mt-1 text-lg font-black text-white"
                >
                  Write a Review
                </h2>

                <p className="mt-1 text-[10px] text-slate-400">
                  Share your experience with {businessName || displayName}.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setShowReviewModal(false)}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-700 bg-[#192538] text-slate-300 transition hover:border-rose-400 hover:text-rose-400"
                aria-label="Close review form"
              >
                <FaXmark />
              </button>
            </div>

            <form onSubmit={handleReviewSubmit} className="space-y-4 p-5">
              {reviewSubmitError && (
                <div className="rounded-xl border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-300">
                  {reviewSubmitError}
                </div>
              )}

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-300">
                  Your Name *
                </label>

                <input
                  type="text"
                  required
                  maxLength={80}
                  value={reviewForm.reviewerName}
                  onChange={(event) =>
                    setReviewForm((previous) => ({
                      ...previous,
                      reviewerName: event.target.value,
                    }))
                  }
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-700 bg-[#192538] px-3.5 py-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-300">
                  Email Address (Optional)
                </label>

                <input
                  type="email"
                  maxLength={120}
                  value={reviewForm.reviewerEmail}
                  onChange={(event) =>
                    setReviewForm((previous) => ({
                      ...previous,
                      reviewerEmail: event.target.value,
                    }))
                  }
                  placeholder="name@example.com"
                  className="w-full rounded-xl border border-slate-700 bg-[#192538] px-3.5 py-3 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
                />
              </div>

              <div>
                <label className="mb-2 block text-[10px] font-bold text-slate-300">
                  Your Rating *
                </label>

                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() =>
                        setReviewForm((previous) => ({
                          ...previous,
                          rating: star,
                        }))
                      }
                      aria-label={`Rate ${star} out of 5`}
                      className={`text-[28px] transition hover:scale-110 ${
                        star <= reviewForm.rating
                          ? "text-amber-400"
                          : "text-slate-600"
                      }`}
                    >
                      <FaStar />
                    </button>
                  ))}

                  <span className="ml-1 text-[11px] font-bold text-amber-300">
                    {reviewForm.rating}/5
                  </span>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-[10px] font-bold text-slate-300">
                  Write Your Review *
                </label>

                <textarea
                  required
                  rows={4}
                  maxLength={1000}
                  value={reviewForm.comment}
                  onChange={(event) =>
                    setReviewForm((previous) => ({
                      ...previous,
                      comment: event.target.value,
                    }))
                  }
                  placeholder="Tell others about your experience..."
                  className="w-full resize-y rounded-xl border border-slate-700 bg-[#192538] px-3.5 py-3 text-xs leading-relaxed text-white outline-none transition placeholder:text-slate-500 focus:border-amber-400 focus:ring-2 focus:ring-amber-400/15"
                />

                <p className="mt-1 text-right text-[9px] text-slate-500">
                  {reviewForm.comment.length}/1000
                </p>
              </div>

              <button
                type="submit"
                disabled={reviewSubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-3.5 text-xs font-black text-[#172B3A] shadow-lg shadow-amber-950/20 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {reviewSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Submitting Review...
                  </>
                ) : (
                  <>
                    <FaPen />
                    Submit Review
                  </>
                )}
              </button>

              <p className="text-center text-[9px] leading-relaxed text-slate-500">
                Your feedback helps other customers make better decisions.
              </p>
            </form>
          </div>
        </div>
      )}

      {/* HERO / COVER */}
      <section className="w-full bg-[#0b1224] px-3 pb-0 pt-4 text-slate-100 sm:px-4">
        <div className="mx-auto w-full max-w-[520px] overflow-hidden rounded-t-[20px] border border-slate-700/80 bg-[#10182b] shadow-[0_18px_50px_rgba(0,0,0,0.35)]">
          <div className="relative h-[158px] overflow-hidden sm:h-[190px]">
            {heroImage ? (
              <img
                src={heroImage}
                alt="Business cover"
                className="absolute inset-0 h-full w-full object-cover"
              />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#24364d] via-[#172235] to-[#080f1e]" />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-[#10182b]/80 via-transparent to-black/20" />

            <div className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-[#111827]/85 px-3 py-1 text-[10px] font-bold text-white backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-violet-500" />
              {industry || "Business Profile"}
            </div>

            <div className="absolute right-3 top-3 flex gap-2">
              <button
                type="button"
                onClick={onOpenQr}
                aria-label="Open QR code"
                title="QR Code"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-violet-600"
              >
                <FaQrcode className="text-xs" />
              </button>

              <button
                type="button"
                onClick={onShare}
                aria-label="Share profile"
                title="Share Profile"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-white/20 bg-black/35 text-white backdrop-blur transition hover:bg-violet-600"
              >
                <FaShareNodes className="text-xs" />
              </button>
            </div>
          </div>

          <div className="relative px-4 pb-4 sm:px-5">
            <div className="relative -mt-[62px] mb-3 flex items-end justify-between">
              {/* Profile Image with verification tick */}
              <div className="relative flex h-[92px] w-[92px] items-end">
                <div className="h-[92px] w-[92px] overflow-hidden rounded-[15px] border-[3px] border-[#10182b] bg-slate-700 shadow-xl">
                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-3xl font-black text-white">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>

                {isVerified && (
                  <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#10182b] bg-emerald-500 text-[10px] text-white">
                    <FaCheck />
                  </span>
                )}
              </div>

              {/* BUSINESS LOGO — bottom aligned with profile image bottom */}
              {businessLogo && (
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-2 border-[#10182b] bg-white shadow-xl ring-1 ring-white/20 sm:h-16 sm:w-16">
                  <img
                    src={businessLogo}
                    alt="Business logo"
                    className="h-full w-full object-contain"
                  />
                </div>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-[22px] font-black leading-tight tracking-tight text-white sm:text-[25px]">
                {displayName}
              </h1>

              {isVerified && (
                <span className="inline-flex items-center gap-1 rounded-full border border-indigo-400/70 bg-indigo-500/10 px-2.5 py-1 text-[9px] font-bold text-indigo-200">
                  <FaCheck className="text-amber-400" /> Verified Business
                  {businessInfo.subscriptionLabel
                    ? ` · ${businessInfo.subscriptionLabel}`
                    : ""}
                </span>
              )}
            </div>

            <p className="mt-1 text-[12px] font-medium leading-[1.55] text-indigo-300 sm:text-[13px]">
              {displayRole}
              {businessName ? (
                <>
                  {" "}
                  at{" "}
                  <span className="font-semibold text-indigo-400">
                    {businessName}
                  </span>
                </>
              ) : (
                ""
              )}
            </p>

            {(reviewAverage || reviewTotal) > 0 && (
              <div className="mt-2 flex items-center gap-1.5 text-[10px]">
                <span className="tracking-[1px] text-amber-400">★★★★★</span>
                <strong className="text-white">
                  {reviewAverage.toFixed(1)}
                </strong>
                <span className="text-slate-400">({reviewTotal} reviews)</span>
              </div>
            )}

            {about && (
              <p className="mt-2 line-clamp-2 text-[10px] leading-[1.55] text-slate-300">
                “{about}”
              </p>
            )}

            {(address || location) && (
              <a
                href={
                  mapLink ||
                  `https://maps.google.com/?q=${encodeURIComponent(
                    address || location || "",
                  )}`
                }
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => onContactClick && onContactClick("directions")}
                title="Open in Google Maps"
                className="mt-2 group inline-flex items-start gap-1.5 text-[9px] leading-[1.5] text-slate-300 transition hover:text-indigo-300 cursor-pointer"
              >
                <FaLocationDot className="mt-0.5 shrink-0 text-rose-500 transition-transform group-hover:scale-110" />
                <span className="line-clamp-2 group-hover:underline">{address || location}</span>
                <span className="text-slate-500">·</span>
              </a>
            )}

            <p className="mt-2 text-[9px] font-bold text-emerald-400">
              ● Open for Inquiries
            </p>

            {/* DYNAMIC BACKEND CONTACT BUTTONS */}
            {activeButtons.length > 0 && (
              <div
                className={`mt-4 grid gap-1.5 sm:gap-2 ${
                  activeButtons.length === 1
                    ? "grid-cols-1"
                    : activeButtons.length === 2
                      ? "grid-cols-2"
                      : activeButtons.length === 3
                        ? "grid-cols-3"
                        : activeButtons.length === 4
                          ? "grid-cols-2 sm:grid-cols-4"
                          : activeButtons.length === 5
                            ? "grid-cols-3 sm:grid-cols-5"
                            : activeButtons.length === 6
                              ? "grid-cols-3 sm:grid-cols-6"
                              : "grid-cols-3 sm:grid-cols-4 md:grid-cols-8"
                }`}
              >
                {activeButtons.map((button) => {
                  const isSave = isSaveButton(button);
                  return (
                    <button
                      key={button.buttonId || button._id}
                      type="button"
                      onClick={() => handleDynamicButton(button)}
                      className={`flex min-h-[58px] sm:min-h-[64px] min-w-0 flex-col items-center justify-center gap-1.5 rounded-2xl px-1 py-2 sm:px-1.5 sm:py-2.5 text-[8.5px] sm:text-[9.5px] font-bold transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 ${
                        isSave
                          ? "border border-indigo-400/40 bg-gradient-to-b from-[#2e3760] to-[#1c2342] text-white shadow-md shadow-indigo-950/50 hover:brightness-110"
                          : "border border-[#22314d] bg-[#131d30] text-white shadow-sm hover:border-slate-500/80 hover:bg-[#18243c]"
                      }`}
                      title={button.label}
                    >
                      {getButtonIcon(button.icon, button.actionType, isSave)}
                      <span className="w-full px-0.5 text-center leading-tight break-words">
                        {button.label || "Button"}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}

            {socialLinks.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {socialLinks.map((social, index) => (
                  <a
                    key={social._id || social.id || index}
                    href={social.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    title={social.platform || "Social"}
                    className="inline-flex items-center gap-1.5 rounded-full border border-slate-700 bg-[#1a2639] px-2.5 py-1.5 text-[8px] font-semibold text-slate-200 transition hover:border-indigo-400 hover:text-white"
                  >
                    {getSocialIcon(social.platform, social.url)}
                    <span>{social.platform || "Social"}</span>
                  </a>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ABOUT OUR BUSINESS */}
      {about && (
        <section className="mx-auto w-full max-w-[520px] border-x border-slate-700/70 bg-[#0e1729] px-5 py-4">
          <div className="flex items-center gap-2">
            <FaLocationDot className="text-[12px] text-indigo-400" />
            <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
              About Our Business
            </h2>
          </div>

          <p className="mt-3 text-[11px] leading-[1.65] text-slate-300">
            {about}
          </p>
        </section>
      )}

      {/* FEATURED PRODUCTS & SERVICES */}
      {productList.length > 0 && (
        <section className="mx-auto w-full max-w-[520px] border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <FaShareNodes className="shrink-0 text-[12px] text-indigo-400" />
              <h2 className="truncate text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
                Featured Products & Services
              </h2>
            </div>

            <span className="shrink-0 text-[9px] font-semibold text-slate-400">
              {productList.length} items
            </span>
          </div>

          <div className="space-y-2.5">
            {productList.map((product, index) => {
              const image = getImageUrl(product?.images?.[0] || product?.image);

              const productType =
                product.category || product.type || product.label || "PRODUCTS";

              return (
                <article
                  key={product._id || product.id || index}
                  className="rounded-[14px] border border-slate-700/90 bg-[#192538] p-2.5 shadow-[0_5px_15px_rgba(0,0,0,0.16)]"
                >
                  <div className="flex gap-2.5">
                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      aria-label={`View ${product.name || "product"} photo`}
                      className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-[10px] bg-slate-700"
                    >
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || "Product"}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[9px] text-slate-400">
                          No Image
                        </span>
                      )}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-start justify-between gap-2">
                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="min-w-0 text-left text-[10px] font-extrabold leading-[1.4] text-slate-100"
                        >
                          {product.name || "Product"}
                        </button>

                        {product.price !== undefined &&
                          product.price !== null &&
                          product.price !== "" && (
                            <span className="shrink-0 rounded-full border border-indigo-400/70 bg-indigo-500/10 px-2 py-0.5 text-[9px] font-bold text-indigo-200">
                              ₹{product.price}
                            </span>
                          )}
                      </div>

                      {product.description && (
                        <p className="mt-1.5 line-clamp-2 text-[9px] leading-[1.5] text-slate-300">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-2 flex items-center gap-2 border-t border-slate-600/60 pt-1.5">
                        <span className="text-[8px] font-bold uppercase tracking-wide text-slate-400">
                          {productType}
                        </span>

                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="text-[8px] font-semibold text-indigo-300"
                        >
                          <FaQrcode className="mr-1 inline text-[7px]" />
                          View Photo
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="mt-2 flex flex-wrap items-center justify-end gap-1.5">
                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="rounded-full bg-emerald-600 px-2.5 py-1 text-[10px] font-extrabold text-white transition hover:bg-emerald-500"
                    >
                      Pay with UPI
                    </button>

                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onProductWhatsAppInquiry(product);
                      }}
                      className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2.5 py-1 text-[10px] font-bold text-emerald-300 transition hover:bg-emerald-500/20"
                    >
                      <FaWhatsapp className="mr-1 inline" />
                      WhatsApp
                    </button>
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      )}

      {/* WORK GALLERY */}
      {galleryImages.length > 0 && (
        <section className="mx-auto box-border w-full max-w-[520px] min-w-0 overflow-hidden border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4">
          <div className="mb-3 flex min-w-0 items-center justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[9px] font-bold uppercase tracking-[0.16em] text-indigo-300">
                Portfolio
              </p>

              <h2 className="mt-1 text-[12px] font-extrabold uppercase tracking-wide text-slate-100">
                Our Work Gallery
              </h2>
            </div>

            <span className="shrink-0 text-[9px] font-semibold text-slate-400">
              {galleryImages.length} photos
            </span>
          </div>

          <div className="relative w-full min-w-0 overflow-hidden">
            <Swiper
              modules={[Autoplay]}
              slidesPerView={1.15}
              spaceBetween={10}
              loop={galleryImages.length > 1}
              loopAdditionalSlides={2}
              watchSlidesProgress
              speed={650}
              autoplay={
                galleryImages.length > 1
                  ? {
                      delay: 2400,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              breakpoints={{
                360: { slidesPerView: 1.25, spaceBetween: 10 },
                480: { slidesPerView: 1.6, spaceBetween: 10 },
              }}
              className="!w-full !max-w-full !overflow-hidden"
            >
              {galleryImages.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <SwiperSlide
                    key={image._id || image.id || imageUrl || index}
                    className="!h-auto !min-w-0"
                  >
                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="group relative block h-[142px] w-full min-w-0 overflow-hidden rounded-xl border border-slate-700 bg-[#192538] text-left"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={image.alt || image.title || "Gallery"}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <span className="flex h-full items-center justify-center text-[10px] text-slate-400">
                          Image unavailable
                        </span>
                      )}

                      <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 to-transparent px-3 pb-2 pt-7 text-[9px] font-bold text-white">
                        {image.title || image.caption || `Work ${index + 1}`}
                      </span>

                      <span className="absolute right-2 top-2 flex h-7 w-7 items-center justify-center rounded-full border border-white/20 bg-slate-950/60 text-[10px] text-white">
                        <FaArrowUpRightFromSquare />
                      </span>
                    </button>

                    <div className="p-2.5 pb-0">
                      <button
                        type="button"
                        onClick={() => onGalleryWhatsAppInquiry(image)}
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-emerald-500 py-2.5 text-[10px] font-bold text-white shadow-sm shadow-emerald-500/20 transition hover:brightness-105 active:scale-[0.98]"
                      >
                        <FaWhatsapp size={14} className="shrink-0" />
                        <span>WhatsApp Inquiry</span>
                      </button>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>

          <p className="mt-2 text-center text-[9px] text-slate-500">
            Swipe to explore more photos
          </p>
        </section>
      )}

      {/* CONTACT & BUSINESS HOURS */}
      <section className="mx-auto w-full max-w-[520px] border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4">
        <div className="mb-3 flex items-center gap-2">
          <FaPhone className="text-[12px] text-indigo-400" />
          <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
            Contact & Business Hours
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {phone && (
            <button
              type="button"
              onClick={() => handleContact("phone")}
              className="flex min-h-[56px] min-w-0 items-center gap-2 rounded-[14px] border border-slate-700 bg-[#192538] px-2.5 py-2 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-emerald-500/30 bg-emerald-500/10 text-emerald-400">
                <FaPhone className="text-[11px]" />
              </span>

              <span className="min-w-0">
                <span className="block text-[9px] text-slate-400">
                  Phone Number
                </span>
                <span className="block truncate text-[10px] font-bold text-slate-100">
                  {phone}
                </span>
              </span>
            </button>
          )}

          {email && (
            <button
              type="button"
              onClick={() => handleContact("email")}
              className="flex min-h-[56px] min-w-0 items-center gap-2 rounded-[14px] border border-slate-700 bg-[#192538] px-2.5 py-2 text-left"
            >
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-blue-500/30 bg-blue-500/10 text-blue-400">
                <FaEnvelope className="text-[11px]" />
              </span>

              <span className="min-w-0">
                <span className="block text-[9px] text-slate-400">
                  Email Address
                </span>
                <span className="block truncate text-[10px] font-bold text-slate-100">
                  {email}
                </span>
              </span>
            </button>
          )}
        </div>

        {(address || location) && (
          <button
            type="button"
            onClick={() => handleContact("address")}
            className="mt-2 flex w-full items-start gap-2 rounded-[14px] border border-slate-700 bg-[#192538] px-2.5 py-2.5 text-left"
          >
            <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-rose-500/30 bg-rose-500/10 text-rose-400">
              <FaLocationDot className="text-[12px]" />
            </span>

            <span className="min-w-0">
              <span className="block text-[9px] text-slate-400">
                Physical Address
              </span>
              <span className="block text-[10px] font-bold leading-[1.45] text-slate-100">
                {address || location}
              </span>

              {location && address && location !== address && (
                <span className="mt-0.5 block text-[9px] leading-[1.4] text-slate-400">
                  {location}
                </span>
              )}
            </span>
          </button>
        )}

        {businessHours && (
          <div className="mt-2 flex items-center gap-2 rounded-[14px] border border-slate-700 bg-[#192538] px-2.5 py-2.5">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-amber-500/30 bg-amber-500/10 text-amber-400">
              <FaClock className="text-[12px]" />
            </span>

            <span className="min-w-0">
              <span className="block text-[9px] text-slate-400">
                Operating Hours
              </span>
              <span className="block whitespace-pre-line text-[10px] font-bold leading-[1.45] text-slate-100">
                {businessHours}
              </span>
            </span>
          </div>
        )}

        {website && (
          <button
            type="button"
            onClick={() => handleContact("website")}
            className="mt-2 flex w-full items-center gap-2 rounded-[14px] border border-slate-700 bg-[#192538] px-2.5 py-2.5 text-left"
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[10px] border border-indigo-500/30 bg-indigo-500/10 text-indigo-400">
              <FaGlobe className="text-[12px]" />
            </span>

            <span className="min-w-0 flex-1">
              <span className="block text-[9px] text-slate-400">
                Official Website
              </span>
              <span className="block truncate text-[10px] font-bold text-slate-100">
                {website}
              </span>
            </span>

            <FaArrowUpRightFromSquare className="shrink-0 text-[10px] text-slate-400" />
          </button>
        )}
      </section>

      {/* SOCIAL MEDIA & PROFILES */}
      {socialLinks.length > 0 && (
        <section className="mx-auto w-full max-w-[520px] border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4">
          <div className="mb-3 flex items-center justify-between gap-2">
            <div className="flex min-w-0 items-center gap-2">
              <FaShareNodes className="shrink-0 text-[12px] text-indigo-400" />
              <h2 className="truncate text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
                Social Media & Profiles
              </h2>
            </div>

            <span className="shrink-0 text-[9px] font-semibold text-slate-400">
              {socialLinks.length} accounts
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {visibleSocialLinks.map((social, index) => {
              const platform = String(
                social.platform || social.name || "Social",
              ).toLowerCase();

              const image = getImageUrl(
                social.profileImage ||
                  social.image ||
                  social.avatar ||
                  social.logo ||
                  social.thumbnail,
              );

              const username =
                social.username ||
                social.handle ||
                social.userName ||
                social.accountName ||
                "";

              const followers =
                social.followers ||
                social.subscribers ||
                social.members ||
                social.likes ||
                "";

              const description =
                social.description || social.bio || social.caption || "";

              const platformColor = platform.includes("instagram")
                ? "from-fuchsia-500 to-pink-600"
                : platform.includes("youtube")
                  ? "from-red-600 to-rose-700"
                  : platform.includes("facebook")
                    ? "from-blue-600 to-indigo-700"
                    : platform.includes("whatsapp")
                      ? "from-emerald-500 to-teal-600"
                      : "from-indigo-500 to-violet-600";

              const buttonText =
                social.buttonText ||
                social.ctaText ||
                (platform.includes("youtube")
                  ? "Subscribe"
                  : platform.includes("facebook")
                    ? "Like Page"
                    : platform.includes("whatsapp")
                      ? "Join Channel"
                      : "Follow");

              const badgeColors = getSocialBadgeColors(
                social.platform || platform,
              );

              return (
                <article
                  key={social._id || social.id || index}
                  className="relative min-w-0 overflow-hidden rounded-[14px] border border-slate-700 bg-[#192538] p-2.5"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r ${platformColor}`}
                  />

                  <div className="flex min-w-0 items-center gap-2">
                    <div className="relative h-10 w-10 shrink-0">
                      {image ? (
                        <img
                          src={image}
                          alt={social.platform || "Social profile"}
                          className="h-10 w-10 shrink-0 rounded-[9px] object-cover ring-1 ring-slate-700"
                        />
                      ) : (
                        <span
                          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[9px] bg-gradient-to-br ${platformColor} text-white`}
                        >
                          {getSocialIcon(social.platform, social.url)}
                        </span>
                      )}

                      {/* Social Platform Logo Badge on Profile Photo */}
                      {image && (
                        <div
                          className="absolute -bottom-1 -right-1 flex h-[18px] w-[18px] items-center justify-center rounded-full border-2 border-[#192538] text-[9px] shadow-md [&>svg]:h-2.5 [&>svg]:w-2.5"
                          style={{
                            background: badgeColors.bg,
                            color: badgeColors.color,
                          }}
                        >
                          {getSocialIcon(social.platform, social.url)}
                        </div>
                      )}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1">
                        <h3 className="truncate text-[10px] font-extrabold capitalize text-slate-100">
                          {social.platform || social.name || "Social Profile"}
                        </h3>
                        <FaCheck className="shrink-0 text-[9px] text-sky-400" />
                      </div>

                      <p className="truncate text-[9px] font-semibold text-slate-300">
                        {username || social.url || ""}
                      </p>

                      {followers && (
                        <span className="mt-1 inline-flex max-w-full items-center gap-1 truncate rounded-full border border-slate-600 bg-slate-800/70 px-1.5 py-0.5 text-[8px] font-semibold text-slate-300">
                          <FaShareNodes className="text-amber-400" />
                          {followers}
                        </span>
                      )}
                    </div>
                  </div>

                  {description && (
                    <p className="mt-2 min-h-[30px] line-clamp-2 text-[9px] leading-[1.5] text-slate-300">
                      {description}
                    </p>
                  )}

                  <a
                    href={social.url || "#"}
                    target="_blank"
                    rel="noreferrer"
                    className={`mt-2 flex h-7 w-full items-center justify-center gap-1 rounded-full bg-gradient-to-r ${platformColor} px-2 text-[9px] font-extrabold text-white`}
                  >
                    {getSocialIcon(social.platform, social.url)}
                    <span className="truncate">{buttonText}</span>
                    <FaArrowUpRightFromSquare className="shrink-0 text-[8px]" />
                  </a>
                </article>
              );
            })}
          </div>

          {socialLinks.length > 4 && (
            <button
              type="button"
              onClick={() => setShowAllSocialLinks((previous) => !previous)}
              className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-500/10 px-4 py-3 text-[10px] font-extrabold text-indigo-300 transition hover:border-indigo-400 hover:bg-indigo-500/20"
            >
              {showAllSocialLinks
                ? "Show Less"
                : `Load More (${socialLinks.length - 4} More)`}
              <FaArrowUpRightFromSquare className="text-[9px]" />
            </button>
          )}
        </section>
      )}

      {/* CUSTOMER REVIEWS & TRUST */}
      <section className="mx-auto w-full max-w-[520px] border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4">
        <div className="mb-3 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[13px] text-amber-400">★</span>
            <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
              Customer Reviews & Trust
            </h2>
          </div>

          <span className="shrink-0 text-[9px] font-semibold text-slate-400">
            {reviewTotal} reviews
          </span>
        </div>

        <div className="mb-3 flex items-center justify-between gap-3 rounded-[14px] border border-amber-500/30 bg-[#192538] px-3 py-2.5">
          <div className="flex items-center gap-2">
            <strong className="text-[19px] font-black text-white">
              {reviewAverage ? reviewAverage.toFixed(1) : "—"}
            </strong>

            <div>
              <div className="text-[13px] leading-none tracking-[1px] text-amber-400">
                ★★★★★
              </div>
              <p className="mt-1 text-[8px] text-slate-400">
                Based on {reviewTotal} customer{" "}
                {reviewTotal === 1 ? "review" : "reviews"}
              </p>
            </div>
          </div>

          <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-[8px] font-bold text-emerald-400">
            <FaCheck className="mr-1 inline" />
            {businessInfo.isVerified ? "100% Verified" : "Verified Reviews"}
          </span>
        </div>

        <button
          type="button"
          onClick={openReviewModal}
          className="mb-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 px-4 py-3 text-[11px] font-black text-[#172B3A] shadow-lg shadow-amber-950/20 transition hover:-translate-y-0.5 hover:brightness-110"
        >
          <FaPen />
          Write a Review
        </button>

        {reviews.length > 0 ? (
          <>
            <div className="relative min-w-0 overflow-hidden">
              <Swiper
                modules={[Autoplay]}
                slidesPerView={1}
                spaceBetween={10}
                loop={reviews.length > 1}
                loopAdditionalSlides={Math.min(reviews.length, 5)}
                speed={700}
                watchSlidesProgress
                autoplay={
                  reviews.length > 1
                    ? {
                        delay: 3000,
                        disableOnInteraction: false,
                        pauseOnMouseEnter: true,
                      }
                    : false
                }
                breakpoints={{
                  480: {
                    slidesPerView: 2,
                    spaceBetween: 10,
                  },
                  768: {
                    slidesPerView: 3,
                    spaceBetween: 12,
                  },
                }}
                className="!w-full !overflow-hidden"
              >
                {reviews.map((review, index) => {
                  const customerName =
                    review.reviewerName ||
                    review.name ||
                    review.customerName ||
                    review.author ||
                    "Customer";

                  const customerRole =
                    review.reviewerEmail ||
                    review.role ||
                    review.designation ||
                    review.company ||
                    "Verified Customer";

                  const reviewText =
                    review.comment ||
                    review.message ||
                    review.text ||
                    review.review ||
                    "";

                  const customerPhoto = getImageUrl(
                    review.avatar || review.photo || review.image,
                  );

                  const reviewDate = review.createdAt
                    ? new Date(review.createdAt).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  const rating = Math.max(
                    0,
                    Math.min(5, Math.round(Number(review.rating || 5))),
                  );

                  return (
                    <SwiperSlide
                      key={review._id || review.id || index}
                      className="!h-auto"
                    >
                      <article className="flex h-full min-h-[165px] flex-col rounded-[14px] border border-slate-700 bg-[#192538] p-3">
                        <div className="mb-2 flex items-center justify-between gap-2">
                          <span className="text-[13px] leading-none tracking-[1px] text-amber-400">
                            {"★".repeat(rating)}
                            <span className="text-slate-600">
                              {"★".repeat(5 - rating)}
                            </span>
                          </span>

                          {review.verified !== false && (
                            <span className="shrink-0 rounded-full bg-emerald-500/10 px-2 py-1 text-[8px] font-bold text-emerald-400">
                              Verified
                            </span>
                          )}
                        </div>

                        <p className="min-h-[55px] flex-1 text-[10px] italic leading-[1.6] text-slate-200">
                          {reviewText ? `“${reviewText}”` : "Customer review"}
                        </p>

                        <div className="mt-3 flex items-center gap-2 border-t border-slate-700 pt-2.5">
                          {customerPhoto ? (
                            <img
                              src={customerPhoto}
                              alt={customerName}
                              className="h-8 w-8 shrink-0 rounded-full border border-slate-600 object-cover"
                            />
                          ) : (
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-700 text-[10px] font-bold text-white">
                              {customerName.charAt(0).toUpperCase()}
                            </span>
                          )}

                          <div className="min-w-0 flex-1">
                            <p className="truncate text-[9px] font-extrabold text-slate-100">
                              {customerName}
                            </p>
                            <p className="truncate text-[8px] text-slate-400">
                              {customerRole}
                            </p>
                          </div>

                          {reviewDate && (
                            <span className="shrink-0 text-[8px] text-slate-500">
                              {reviewDate}
                            </span>
                          )}
                        </div>
                      </article>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </div>

            {reviews.length > 1 && (
              <p className="mt-3 text-center text-[9px] text-slate-500">
                Reviews automatically slide · Swipe to explore
              </p>
            )}
          </>
        ) : (
          <div className="rounded-[14px] border border-dashed border-slate-700 bg-[#192538] px-4 py-7 text-center">
            <span className="text-2xl text-amber-400">★</span>
            <p className="mt-2 text-[11px] font-bold text-slate-200">
              No customer reviews yet
            </p>
            <p className="mt-1 text-[9px] text-slate-400">
              Be the first customer to share your experience.
            </p>
          </div>
        )}
      </section>

      {/* SHARE YOUR CONTACT / SEND INQUIRY */}
      <section
        id="send-inquiry-section"
        className="mx-auto w-full max-w-[520px] scroll-mt-6 border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-4"
      >
        <div className="mb-1 flex items-center gap-2">
          <FaShareNodes className="text-[12px] text-indigo-400" />
          <h2 className="text-[12px] font-extrabold uppercase tracking-wide text-slate-200">
            Share Your Contact / Send Inquiry
          </h2>
        </div>

        <p className="mb-3 text-[9px] leading-[1.5] text-slate-400">
          Share your contact number or leave a message for {displayName} to
          receive a fast response.
        </p>

        <form onSubmit={onFormSubmit} className="space-y-2.5">
          {formSubmitted ? (
            <div className="flex min-h-[170px] flex-col items-center justify-center rounded-[14px] border border-emerald-500/30 bg-[#192538] px-4 text-center">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-500/15 text-emerald-400">
                <FaCheck />
              </span>

              <h3 className="mt-3 text-sm font-extrabold text-white">
                Message Sent
              </h3>

              <p className="mt-1 text-[10px] text-slate-400">
                Thank you. Your inquiry has been submitted successfully.
              </p>
            </div>
          ) : (
            <>
              {inquirySubmitError && (
                <div className="rounded-lg border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-[10px] text-rose-300">
                  {inquirySubmitError}
                </div>
              )}

              <div>
                <label className="mb-1 block text-[9px] font-bold text-slate-300">
                  Your Name *
                </label>

                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      name: e.target.value,
                    }))
                  }
                  placeholder="e.g. Rahul Sharma"
                  className="w-full rounded-[12px] border border-slate-700 bg-[#101a2d] px-3 py-3 text-[10px] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="mb-1 block text-[9px] font-bold text-slate-300">
                    Email Address
                  </label>

                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        email: e.target.value,
                      }))
                    }
                    placeholder="name@example.com"
                    className="w-full min-w-0 rounded-[12px] border border-slate-700 bg-[#101a2d] px-3 py-3 text-[10px] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-[9px] font-bold text-slate-300">
                    Phone Number *
                  </label>

                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData((prev) => ({
                        ...prev,
                        phone: e.target.value,
                      }))
                    }
                    placeholder="+91 98765 43210"
                    className="w-full min-w-0 rounded-[12px] border border-slate-700 bg-[#101a2d] px-3 py-3 text-[10px] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-[9px] font-bold text-slate-300">
                  Your Requirements / Message
                </label>

                <textarea
                  rows={4}
                  value={formData.message}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      message: e.target.value,
                    }))
                  }
                  placeholder="Describe what you are looking for or preferred times to meet/talk..."
                  className="w-full resize-y rounded-[12px] border border-slate-700 bg-[#101a2d] px-3 py-3 text-[10px] leading-[1.5] text-slate-100 outline-none transition placeholder:text-slate-500 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15"
                />
              </div>

              <button
                type="submit"
                disabled={inquirySubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-[12px] bg-gradient-to-r from-violet-600 to-blue-600 px-4 py-3 text-[10px] font-extrabold text-white shadow-lg shadow-indigo-950/30 transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
              >
                <FaShareNodes />
                {inquirySubmitting
                  ? "Submitting..."
                  : "Submit Inquiry Instantly"}
              </button>
            </>
          )}
        </form>
      </section>

      {/* QR CODE TO SHARE OR SAVE */}
      <section className="mx-auto w-full max-w-[520px] border-x border-t border-slate-700/70 bg-[#0e1729] px-4 py-5">
        <div className="rounded-[20px] border border-slate-700 bg-[#101a2e] px-4 py-5 text-center sm:px-6">
          <div className="flex items-center justify-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg border border-indigo-500/30 bg-indigo-500/10 text-indigo-300">
              <FaQrcode className="text-sm" />
            </span>

            <h2 className="text-[13px] font-extrabold text-slate-100">
              Scan QR Code to Share or Save
            </h2>
          </div>

          <p className="mx-auto mt-2 max-w-[270px] text-[10px] leading-[1.55] text-slate-400">
            Point smartphone camera to save contact or share with prospective
            clients instantly.
          </p>

          <div className="corporate-profile-qr mx-auto mt-4 inline-flex min-h-[160px] min-w-[160px] items-center justify-center rounded-xl bg-white p-3 shadow-lg">
            {qrFetching ? (
              <div className="flex h-[136px] w-[136px] items-center justify-center text-[10px] font-semibold text-slate-500">
                Loading QR...
              </div>
            ) : qrTargetUrl ? (
              <QRCodeCanvas
                value={qrTargetUrl}
                size={136}
                includeMargin
                level="H"
              />
            ) : (
              <div className="flex h-[136px] w-[136px] items-center justify-center text-center text-[10px] font-semibold text-slate-500">
                QR unavailable
              </div>
            )}
          </div>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              onClick={handleCopyQrLink}
              disabled={!qrTargetUrl}
              className="inline-flex items-center gap-1.5 rounded-lg border border-slate-600 bg-[#172538] px-3 py-2 text-[9px] font-bold text-slate-200 transition hover:border-indigo-400 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaShareNodes />
              Copy Link
            </button>

            <button
              type="button"
              onClick={handleDownloadQr}
              disabled={!qrTargetUrl || qrFetching}
              className="inline-flex items-center gap-1.5 rounded-lg bg-gradient-to-r from-indigo-600 to-violet-600 px-3 py-2 text-[9px] font-extrabold text-white shadow-md transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <FaArrowUpRightFromSquare />
              Download QR PNG
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="mx-auto flex w-full max-w-[520px] flex-wrap items-center justify-between gap-2 border-x border-t border-slate-700/80 bg-[#0b1426] px-3 py-3 text-[8px]">
        <div className="flex flex-wrap items-center gap-2 text-slate-400">
          <span>
            Powered by <strong className="text-slate-300">BIO SITES</strong>
          </span>

          <span className="rounded-full border border-emerald-500/40 bg-emerald-500/10 px-2 py-1 font-bold text-emerald-400">
            <FaCheck className="mr-1 inline" />
            Active Member (1 Year Plan)
          </span>
        </div>

        <a href="/" className="font-semibold text-indigo-300">
          Create Your Own Bio Sites →
        </a>
      </footer>
    </main>
  );
};

export default CorporateExecutive;
