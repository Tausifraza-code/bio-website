import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Share2,
  UserRound,
  CheckCircle2,
  Clock,
  Download,
  Image as ImageIcon,
  ArrowUpRight,
  ScanLine,
  Send,
  Copy,
  CreditCard,
  Bookmark,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaXTwitter,
  FaLink,
} from "react-icons/fa6";

const MinimalLuxury = ({
  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
  productList = [],
  galleryImages = [],
  qrTargetUrl = "",
  qrFetching = false,
  formData = {
    name: "",
    phone: "",
    email: "",
    message: "",
  },
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
  onGalleryClick = () => {},
  onContactClick = () => {},
}) => {
  const {
    name = "",
    role = "",
    location = "",
    about = "",
    phone = "",
    whatsapp = "",
    email = "",
    website = "",
    websiteUrl = "",
    address = "",
    logo = null,
    avatar = null,
    banner = null,
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
    upiId = "",
  } = businessInfo;

  const [copiedUpi, setCopiedUpi] = React.useState(false);

  const socialIconMap = {
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    facebook: FaFacebookF,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    twitter: FaXTwitter,
    x: FaXTwitter,
  };

  const socialColors = {
    instagram: "bg-gradient-to-tr from-[#FEDA75] via-[#FA7E1E] to-[#D62976]",
    facebook: "bg-[#1877F2]",
    whatsapp: "bg-[#25D366]",
    youtube: "bg-[#FF0000]",
    linkedin: "bg-[#0A66C2]",
    twitter: "bg-[#000000]",
    x: "bg-[#000000]",
    telegram: "bg-[#26A5E4]",
    pinterest: "bg-[#E60023]",
    snapchat: "bg-[#FFFC00] text-black",
    github: "bg-[#181717]",
    tiktok: "bg-[#000000]",
    threads: "bg-[#000000]",
    discord: "bg-[#5865F2]",
    reddit: "bg-[#FF4500]",
    website: "bg-[#4285F4]",
  };

  const normalizePlatform = (social = {}) => {
    return String(social.platform || social.platformName || social.icon || "")
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "");
  };

  const getSocialIcon = (social = {}) => {
    const platform = normalizePlatform(social);

    const found = Object.keys(socialIconMap).find((item) =>
      platform.includes(item),
    );

    return found ? socialIconMap[found] : FaLink;
  };

  const normalizeUrl = (url = "") => {
    if (!url) return "";

    const value = String(url).trim();

    if (!value) return "";

    if (/^(https?:\/\/|mailto:|tel:)/i.test(value)) {
      return value;
    }

    return `https://${value}`;
  };

  const swiperAutoplay = {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  const inputClass =
    "w-full rounded-xl border border-[#DFE8F1] bg-[#F8FBFD] px-4 py-3.5 text-sm text-[#10233F] placeholder:text-[#8B9AAF] outline-none transition focus:border-[#12BCEB] focus:ring-4 focus:ring-[#12BCEB]/10 disabled:opacity-50";

  const configuredButtons = Array.isArray(visibleButtons) ? visibleButtons : [];

  const products = Array.isArray(productList) ? productList : [];

  const gallery = Array.isArray(galleryImages)
    ? galleryImages.filter((image) => image?.url)
    : [];

  const socials = Array.isArray(socialLinks)
    ? socialLinks.filter((social) => social?.url)
    : [];

  const firstSocialLinks = socials.slice(0, 7);

  const contactButtons = configuredButtons.filter((button) => {
    const action = String(button?.actionType || "").toLowerCase();

    return !["call", "phone", "whatsapp", "save", "address", "map"].includes(
      action,
    );
  });

  const hasBusinessName = Boolean(businessName || name);

  const hasWebsite = Boolean(website || websiteUrl);

  const handleCopyUpi = async () => {
    if (!upiId) return;

    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);

      window.setTimeout(() => {
        setCopiedUpi(false);
      }, 1800);
    } catch (error) {
      console.error("UPI copy failed:", error);
    }
  };

  const handleMobileAction = (type) => {
    if (type === "save") {
      onOpenQr();
      return;
    }

    onContactClick(type);
  };

  const handleDownloadQr = () => {
    const canvas = document.getElementById("mobile-profile-qr");

    if (!canvas) return;

    try {
      const imageUrl = canvas.toDataURL("image/png");
      const link = document.createElement("a");

      link.href = imageUrl;
      link.download = `${businessName || name || "profile"}-qr.png`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error("QR download failed:", error);
    }
  };

  return (
    <div
      className="min-h-screen w-full overflow-x-hidden bg-[#F5F9FD] text-[#10233F]"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div className="block">
        <main className="mx-auto w-full max-w-[430px] overflow-hidden bg-[#F5F9FD] pb-5 md:max-w-[560px] lg:max-w-[700px] lg:pt-2">
          {/* HERO */}
          <section
            id="premium-home"
            className="relative overflow-hidden rounded-[26px] bg-white shadow-[0_5px_22px_rgba(8,43,92,0.08)]"
          >
            {/* COVER */}
            <div className="relative h-[178px] overflow-hidden bg-[#082B5C]">
              {banner ? (
                <img
                  src={banner}
                  alt={businessName || name || "Cover"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-[#061F43] via-[#082B5C] to-[#12BCEB]" />
              )}

              <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-[#061F43]/35" />

              {/* LOGO AND PROFILE LABEL */}
              <div className="absolute left-4 top-4 z-10 flex items-center gap-2">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full border border-white/50 bg-white p-1 shadow-lg">
                  {logo ? (
                    <img
                      src={logo}
                      alt={businessName || name || "Logo"}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <UserRound size={15} className="text-[#082B5C]" />
                  )}
                </div>

                {hasBusinessName && (
                  <div className="max-w-[210px] truncate rounded-full border border-white/20 bg-black/35 px-3 py-1.5 text-[11px] font-bold text-white backdrop-blur-md md:text-[12px]">
                    {businessName || name}
                  </div>
                )}
              </div>

              {/* VERIFIED */}
              {isVerified && (
                <div className="absolute right-4 top-4 z-10">
                  <div className="flex items-center gap-1 rounded-full bg-[#12BCEB] px-3 py-1.5 text-[8px] font-black text-white shadow-lg">
                    <CheckCircle2 size={10} />
                    VERIFIED
                  </div>
                </div>
              )}

              {/* COVER ACTIONS */}
              <div className="absolute bottom-4 right-4 z-10 flex items-center gap-2">
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Share profile"
                  title="Share Profile"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white shadow-lg backdrop-blur-md transition active:scale-95"
                >
                  <Share2 size={16} />
                </button>

                <button
                  type="button"
                  onClick={onOpenQr}
                  aria-label="Scan profile QR"
                  title="Scan Profile QR"
                  className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-[#12BCEB] text-white shadow-lg transition active:scale-95"
                >
                  <ScanLine size={17} />
                </button>
              </div>
            </div>

            {/* PROFILE */}
            <div className="relative px-4 pb-4">
              <div className="relative -mt-[4px]">
                {/* AVATAR */}
                <div className="relative h-[84px] w-[84px] rounded-[17px] border-[3px] border-white bg-white shadow-[0_8px_20px_rgba(8,43,92,0.18)]">
                  <div className="h-full w-full overflow-hidden rounded-[13px] bg-[#E8F8FD]">
                    {avatar ? (
                      <img
                        src={avatar}
                        alt={name || "Profile"}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center">
                        <UserRound size={38} className="text-[#8AA4BD]" />
                      </div>
                    )}
                  </div>

                  {isVerified && (
                    <span className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#12BCEB] text-white">
                      <CheckCircle2 size={11} />
                    </span>
                  )}
                </div>

                {/* PROFILE INFO */}
                {(name || role || location) && (
                  <div className="absolute left-[96px] right-0 top-[12px]">
                    {name && (
                      <div className="flex items-center gap-1">
                        <h1 className="truncate text-[15px] font-black tracking-[-0.02em] text-[#082B5C]">
                          {name}
                        </h1>

                        {isVerified && (
                          <CheckCircle2
                            size={14}
                            className="shrink-0 fill-[#12BCEB] text-white"
                          />
                        )}
                      </div>
                    )}

                    {role && (
                      <p className="mt-0.5 truncate text-[14px] font-semibold text-[#304D6C]">
                        {role}
                      </p>
                    )}

                    {location && (
                      <div className="mt-1 flex items-center gap-1 text-[14px] font-medium text-[#71839A]">
                        <MapPin size={10} className="shrink-0 text-[#12BCEB]" />
                        <span className="truncate">{location}</span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* SOCIAL ICONS */}
              {firstSocialLinks.length > 0 && (
                <div className="mt-2 flex items-center gap-2 overflow-x-auto pb-1">
                  {firstSocialLinks.map((social, index) => {
                    const Icon = getSocialIcon(social);
                    const platform = normalizePlatform(social);
                    const brandColor = socialColors[platform] || "bg-[#64748B]";

                    return (
                      <a
                        key={social._id || `${platform}-${index}`}
                        href={normalizeUrl(social.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={
                          social.platform ||
                          social.platformName ||
                          "Social link"
                        }
                        className={`flex h-[31px] w-[31px] shrink-0 items-center justify-center rounded-full text-white transition active:scale-95 ${brandColor}`}
                      >
                        <Icon size={13} />
                      </a>
                    );
                  })}
                </div>
              )}

              {/* QUICK ACTIONS */}
              <div className="mt-3 rounded-[15px] border border-[#D8E5EE] bg-white p-2 shadow-[0_3px_12px_rgba(8,43,92,0.04)]">
                <div className="grid grid-cols-4 gap-2">
                  <button
                    type="button"
                    onClick={() => handleMobileAction("save")}
                    className="flex min-h-[58px] flex-col items-center justify-center gap-1.5 rounded-[11px] border border-[#12C5E8] bg-[#12C5E8] text-white shadow-sm transition active:scale-[0.98]"
                  >
                    <Bookmark size={17} />
                    <span className="text-[11px] font-extrabold">Save</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileAction("phone")}
                    disabled={!phone}
                    className="flex min-h-[58px] flex-col items-center justify-center gap-1.5 rounded-[11px] border border-[#D9E5EF] bg-white text-[#087DA1] transition hover:border-[#12C5E8] disabled:opacity-40"
                  >
                    <Phone size={17} />
                    <span className="text-[11px] font-extrabold">Call</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileAction("whatsapp")}
                    disabled={!whatsapp}
                    className="flex min-h-[58px] flex-col items-center justify-center gap-1.5 rounded-[11px] border border-[#D9E5EF] bg-white text-[#087DA1] transition hover:border-[#12C5E8] disabled:opacity-40"
                  >
                    <FaWhatsapp size={17} />
                    <span className="text-[11px] font-extrabold">WhatsApp</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleMobileAction("address")}
                    disabled={!address}
                    className="flex min-h-[58px] flex-col items-center justify-center gap-1.5 rounded-[11px] border border-[#D9E5EF] bg-white text-[#087DA1] transition hover:border-[#12C5E8] disabled:opacity-40"
                  >
                    <Globe size={17} />
                    <span className="text-[11px] font-extrabold">Map</span>
                  </button>
                </div>

                {/* CONFIGURED ACTIONS */}
                {contactButtons.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2 border-t border-[#E8EFF4] pt-2">
                    {contactButtons.map((button, index) => (
                      <button
                        key={button._id || button.id || index}
                        type="button"
                        onClick={() => onConfiguredButton(button)}
                        className="flex min-h-[38px] items-center gap-1.5 rounded-[10px] border border-[#D9E5EF] bg-white px-3 py-2 text-[11px] font-bold text-[#24415F] transition active:scale-[0.98]"
                      >
                        {button.actionType === "whatsapp" && (
                          <FaWhatsapp size={13} />
                        )}

                        {button.actionType === "call" && <Phone size={13} />}

                        {button.label}

                        <ArrowUpRight size={12} />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </section>

          {/* ABOUT */}
          {about && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#D6E4ED] bg-[#F4F8FB] px-3.5 py-3.5">
              <p className="whitespace-pre-line text-[15px] leading-[1.7] text-[#526A82]">
                {about}
              </p>
            </section>
          )}

          {/* BUSINESS DETAILS */}
          {(hasBusinessName ||
            industry ||
            phone ||
            email ||
            hasWebsite ||
            address) && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Business
                  </p>

                  {hasBusinessName && (
                    <h2 className="mt-1 text-[16px] font-black text-[#082B5C]">
                      {businessName || name}
                    </h2>
                  )}
                </div>

                {industry && (
                  <span className="rounded-full bg-[#E8F8FD] px-2.5 py-1 text-[12px] font-bold text-[#087DA1]">
                    {industry}
                  </span>
                )}
              </div>

              <div className="mt-3 grid grid-cols-2 gap-2">
                {phone && (
                  <button
                    type="button"
                    onClick={() => onContactClick("phone")}
                    className="flex min-w-0 items-center gap-2 rounded-[14px] bg-[#F6FAFC] p-2.5 text-left"
                  >
                    <Phone size={13} className="shrink-0 text-[#12BCEB]" />

                    <span className="truncate text-[12px] font-bold text-[#405B75]">
                      {phone}
                    </span>
                  </button>
                )}

                {email && (
                  <button
                    type="button"
                    onClick={() => onContactClick("email")}
                    className="flex min-w-0 items-center gap-2 rounded-[14px] bg-[#F6FAFC] p-2.5 text-left"
                  >
                    <Mail size={13} className="shrink-0 text-[#12BCEB]" />

                    <span className="truncate text-[12px] font-bold text-[#405B75]">
                      {email}
                    </span>
                  </button>
                )}

                {hasWebsite && (
                  <button
                    type="button"
                    onClick={() => onContactClick("website")}
                    className="flex min-w-0 items-center gap-2 rounded-[14px] bg-[#F6FAFC] p-2.5 text-left"
                  >
                    <Globe size={13} className="shrink-0 text-[#12BCEB]" />

                    <span className="truncate text-[12px] font-bold text-[#405B75]">
                      {website || websiteUrl}
                    </span>
                  </button>
                )}

                {address && (
                  <button
                    type="button"
                    onClick={() => onContactClick("address")}
                    className="flex min-w-0 items-center gap-2 rounded-[14px] bg-[#F6FAFC] p-2.5 text-left"
                  >
                    <MapPin size={13} className="shrink-0 text-[#12BCEB]" />

                    <span className="truncate text-[12px] font-bold text-[#405B75]">
                      {address}
                    </span>
                  </button>
                )}
              </div>
            </section>
          )}

          {/* UPI */}
          {upiId && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E8F8FD] text-[#12BCEB]">
                  <CreditCard size={15} />
                </div>

                <h3 className="text-[15px] font-black text-[#082B5C]">
                  UPI Payment
                </h3>
              </div>

              <div className="mt-3">
                <div className="text-xl font-black italic text-[#64748B]">
                  UPI
                </div>

                <p className="mt-1 text-[8px] font-semibold text-[#71839A]">
                  UPI ID
                </p>

                <p className="mt-2 break-all text-[12px] font-semibold text-[#3C5877]">
                  {upiId}
                </p>

                <button
                  type="button"
                  onClick={handleCopyUpi}
                  className="mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#082B5C] py-2.5 text-[11px] font-bold text-white"
                >
                  <Copy size={13} />
                  {copiedUpi ? "Copied!" : "Copy UPI ID"}
                </button>
              </div>
            </section>
          )}

          {/* PRODUCTS */}
          {products.length > 0 && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[12px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Featured Product Collection
                  </p>
                </div>

                <span className="text-[10px] font-bold text-[#7C8EA2]">
                  Swipe →
                </span>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={9}
                slidesPerView={1.2}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 14,
                  },
                }}
                loop={products.length > 3}
                speed={600}
                autoplay={products.length > 1 ? swiperAutoplay : false}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="mobile-product-swiper !pb-7"
              >
                {products.map((product, index) => {
                  const cover = product.images?.find((item) => item?.url)?.url;

                  return (
                    <SwiperSlide key={product._id || index}>
                      <div className="overflow-hidden rounded-[12px] border border-[#E1EAF2] bg-white">
                        {/* Product Click Area */}
                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="w-full text-left"
                        >
                          <div className="relative h-[150px] overflow-hidden bg-[#EEF5F9]">
                            {cover ? (
                              <img
                                src={cover}
                                alt={product.name || "Product"}
                                loading="lazy"
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon
                                  size={25}
                                  className="text-[#9CB1C5]"
                                />
                              </div>
                            )}
                          </div>

                          <div className="p-2.5">
                            {product.name && (
                              <h3 className="truncate text-[14px] font-black text-[#183250]">
                                {product.name}
                              </h3>
                            )}

                            {product.description && (
                              <p className="mt-1 line-clamp-2 text-[14px] leading-4 text-[#7C8EA2]">
                                {product.description}
                              </p>
                            )}

                            <div className="mt-2 flex items-center justify-between">
                              {product.price !== undefined &&
                                product.price !== null &&
                                product.price !== "" && (
                                  <span className="text-[14px] font-black text-[#082B5C]">
                                    ₹
                                    {Number(product.price).toLocaleString(
                                      "en-IN",
                                    )}
                                  </span>
                                )}

                              <span className="text-[12px] font-bold text-[#12BCEB]">
                                View
                              </span>
                            </div>
                          </div>
                        </button>

                        {/* WhatsApp Inquiry */}
                        <div className="px-2.5 pb-2.5">
                          <button
                            type="button"
                            onClick={() => onProductWhatsAppInquiry(product)}
                            className="flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#25D366] py-2.5 text-[11px] font-bold text-white transition hover:bg-[#1DA851] active:scale-[0.98]"
                          >
                            <FaWhatsapp size={15} />
                            WhatsApp Inquiry
                          </button>
                        </div>
                      </div>
                    </SwiperSlide>
                  );
                })}
              </Swiper>
            </section>
          )}

          {/* GALLERY */}
          {gallery.length > 0 && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <div className="mb-3 flex items-end justify-between">
                <div>
                  <p className="text-[11px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                    Gallery
                  </p>

                  <h2 className="mt-1 text-[14px] font-black text-[#082B5C]">
                    Photos
                  </h2>
                </div>

                <span className="text-[8px] font-bold text-[#7C8EA2]">
                  Swipe →
                </span>
              </div>

              <Swiper
                modules={[Autoplay, Pagination]}
                spaceBetween={9}
                slidesPerView={1.35}
                breakpoints={{
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 12,
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 14,
                  },
                }}
                loop={gallery.length > 3}
                speed={600}
                autoplay={gallery.length > 1 ? swiperAutoplay : false}
                pagination={{
                  clickable: true,
                  dynamicBullets: true,
                }}
                className="mobile-gallery-swiper !pb-6"
              >
                {gallery.map((image, index) => (
                  <SwiperSlide key={image._id || `${image.url}-${index}`}>
                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="relative block aspect-[4/3] w-full overflow-hidden rounded-[11px] bg-[#EEF5F9] lg:aspect-[16/10]"
                    >
                      <img
                        src={image.url}
                        alt={image.alt || image.title || "Gallery image"}
                        loading="lazy"
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute bottom-2 left-2 rounded-full bg-[#082B5C]/80 px-2 py-1 text-[7px] font-bold text-white">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                    </button>
                  </SwiperSlide>
                ))}
              </Swiper>
            </section>
          )}

          {/* SOCIAL MEDIA */}
          {socials.length > 0 && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-3.5">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                Stay Connected
              </p>

              <h2 className="mt-1 text-[14px] font-black text-[#082B5C]">
                Social Media
              </h2>

              <div className="mt-3 flex flex-wrap gap-2">
                {socials.map((social, index) => {
                  const Icon = getSocialIcon(social);

                  return (
                    <a
                      key={
                        social._id || `${normalizePlatform(social)}-${index}`
                      }
                      href={normalizeUrl(social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={
                        social.platform || social.platformName || "Social link"
                      }
                      className="flex h-9 w-9 items-center justify-center rounded-full bg-[#E8F8FD] text-[#087DA1]"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            </section>
          )}

          {/* BUSINESS HOURS */}
          {businessHours && (
            <section className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-4">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#E8F8FD] text-[#12BCEB]">
                  <Clock size={15} />
                </div>

                <h3 className="text-[18px] font-black text-[#082B5C]">
                  Business Hours
                </h3>
              </div>

              <div className="mt-3 rounded-[10px] bg-[#E8F8FD] p-3">
                <p className="whitespace-pre-line text-[12px] font-semibold leading-6 text-[#183250]">
                  {businessHours}
                </p>
              </div>
            </section>
          )}

          {/* CONTACT FORM */}
          <section
            id="premium-contact"
            className="mx-0 mt-3 overflow-hidden rounded-[15px] border border-[#E0E9F1] bg-white"
          >
            <div className="bg-[#082B5C] p-4 text-white">
              <p className="text-[8px] font-black uppercase tracking-[0.16em] text-[#12BCEB]">
                Contact
              </p>

              <h2 className="mt-2 text-[17px] font-black leading-tight">
                {businessName ? `Contact ${businessName}` : "Send an Inquiry"}
              </h2>
            </div>

            <div className="p-3.5">
              {formSubmitted ? (
                <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                    <CheckCircle2 size={25} />
                  </div>

                  <h3 className="mt-3 text-sm font-bold text-[#082B5C]">
                    Inquiry Submitted Successfully!
                  </h3>
                </div>
              ) : (
                <form onSubmit={onFormSubmit} className="space-y-2.5">
                  {inquirySubmitError && (
                    <div className="rounded-[10px] border border-red-200 bg-red-50 p-2.5 text-[9px] text-red-600">
                      {inquirySubmitError}
                    </div>
                  )}

                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name || ""}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone || ""}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="email"
                    placeholder="Email Address (Optional)"
                    value={formData.email || ""}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        email: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <textarea
                    rows={4}
                    required
                    placeholder="Message"
                    value={formData.message || ""}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        message: e.target.value,
                      })
                    }
                    className={`${inputClass} resize-none`}
                  />

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="flex w-full items-center justify-center gap-2 rounded-[11px] bg-[#082B5C] py-3 text-[10px] font-bold text-white disabled:opacity-50"
                  >
                    {inquirySubmitting ? (
                      "Submitting..."
                    ) : (
                      <>
                        <Send size={13} />
                        Send Inquiry
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </section>

          {/* QR CODE */}
          <section
            id="premium-qr"
            className="mx-0 mt-3 rounded-[15px] border border-[#E0E9F1] bg-white p-4 text-center"
          >
            <div className="mx-auto flex h-9 w-9 items-center justify-center rounded-[10px] bg-[#E8F8FD] text-[#12BCEB]">
              <ScanLine size={17} />
            </div>

            <h3 className="mt-2 text-[13px] font-black text-[#082B5C]">
              Scan to Connect
            </h3>

            <p className="mt-1 text-[8px] text-[#71839A]">
              Scan the QR code to visit this profile
            </p>

            <div className="mx-auto mt-3 flex w-fit items-center justify-center rounded-[11px] border border-[#E5EDF4] bg-white p-2">
              {qrFetching ? (
                <div className="flex h-[130px] w-[130px] items-center justify-center text-[9px] text-[#71839A]">
                  Loading QR...
                </div>
              ) : qrTargetUrl ? (
                <QRCodeCanvas
                  id="mobile-profile-qr"
                  value={qrTargetUrl}
                  size={130}
                  level="H"
                  includeMargin
                />
              ) : (
                <div className="flex h-[130px] w-[130px] items-center justify-center text-[9px] text-[#71839A]">
                  QR unavailable
                </div>
              )}
            </div>

            {qrTargetUrl && !qrFetching && (
              <button
                type="button"
                onClick={handleDownloadQr}
                className="mx-auto mt-3 flex w-full items-center justify-center gap-2 rounded-[10px] bg-[#E8F8FD] py-2.5 text-[11px] font-bold text-[#087DA1]"
              >
                <Download size={13} />
                Download QR
              </button>
            )}
          </section>
        </main>
      </div>

      {/* SWIPER STYLES */}
      <style>{`
        .mobile-product-swiper,
        .mobile-gallery-swiper {
          width: 100%;
          overflow: hidden;
        }

        .mobile-product-swiper .swiper-slide,
        .mobile-gallery-swiper .swiper-slide {
          height: auto;
        }

        .mobile-product-swiper .swiper-pagination,
        .mobile-gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .mobile-product-swiper .swiper-pagination-bullet,
        .mobile-gallery-swiper .swiper-pagination-bullet {
          background: #082B5C;
          opacity: 0.25;
        }

        .mobile-product-swiper .swiper-pagination-bullet-active,
        .mobile-gallery-swiper .swiper-pagination-bullet-active {
          background: #12BCEB;
          opacity: 1;
        }
      `}</style>
    </div>
  );
};

export default MinimalLuxury;
