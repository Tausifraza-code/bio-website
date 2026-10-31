
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

import {
  MapPin, Phone, Mail, Globe, MessageCircle, Share2, UserRound,
  CheckCircle2, Clock, Download, Image as ImageIcon, ArrowUpRight,
  BriefcaseBusiness, Code2, Palette, Headset, ScanLine, Send,
  ShoppingBag, Copy, Menu, X, ExternalLink, Rocket, CreditCard,
} from "lucide-react";

import {
  FaInstagram, FaLinkedinIn, FaFacebookF, FaYoutube,
  FaWhatsapp, FaTelegram, FaXTwitter, FaLink,
} from "react-icons/fa6";

const MinimalLuxury = ({
  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
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

  const [mobileMenu, setMobileMenu] = React.useState(false);
  const [copiedUpi, setCopiedUpi] = React.useState(false);

  const COLORS = {
    navy: "#082B5C",
    navyDark: "#061F43",
    cyan: "#12BCEB",
    cyanLight: "#E8F8FD",
    bg: "#F5F9FD",
    white: "#FFFFFF",
    text: "#10233F",
    muted: "#61738C",
    border: "#E1EAF3",
    soft: "#F1F6FA",
  };

  const socialIconMap = {
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    facebook: FaFacebookF,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    twitter: FaXTwitter,
  };

  const getSocialIcon = (platform = "") => {
    const key = platform.toLowerCase();
    const found = Object.keys(socialIconMap).find((item) =>
      key.includes(item)
    );
    return found ? socialIconMap[found] : FaLink;
  };

  const normalizeUrl = (url = "") => {
    if (!url) return "#";
    return /^https?:\/\//i.test(url) ? url : `https://${url}`;
  };

  const defaultHours = [
    ["Monday", "09:00 AM - 06:00 PM"],
    ["Tuesday", "09:00 AM - 06:00 PM"],
    ["Wednesday", "09:00 AM - 06:00 PM"],
    ["Thursday", "09:00 AM - 06:00 PM"],
    ["Friday", "09:00 AM - 06:00 PM"],
    ["Saturday", "10:00 AM - 04:00 PM"],
    ["Sunday", "Closed"],
  ];

  const handleCopyUpi = async () => {
    if (!upiId) return;

    try {
      await navigator.clipboard.writeText(upiId);
      setCopiedUpi(true);
      setTimeout(() => setCopiedUpi(false), 1800);
    } catch (error) {
      console.error("UPI copy failed:", error);
    }
  };

  const swiperAutoplay = {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  const swiperBreakpoints = {
    0: { slidesPerView: 1.15, spaceBetween: 12 },
    480: { slidesPerView: 2, spaceBetween: 14 },
    768: { slidesPerView: 2.5, spaceBetween: 16 },
    1024: { slidesPerView: 3, spaceBetween: 16 },
    1280: { slidesPerView: 4, spaceBetween: 18 },
  };

  const navItems = [
    { label: "Home", href: "#premium-home", icon: UserRound },
    { label: "Products", href: "#premium-products", icon: ShoppingBag },
    { label: "Gallery", href: "#premium-gallery", icon: ImageIcon },
    { label: "Contact", href: "#premium-contact", icon: Phone },
    { label: "QR Code", href: "#premium-qr", icon: ScanLine },
  ];

  const cardClass =
    "rounded-[18px] border border-[#E1EAF3] bg-white shadow-[0_8px_30px_rgba(8,43,92,0.05)]";

  const sectionTitle =
    "text-[18px] font-extrabold tracking-[-0.02em] text-[#10233F] sm:text-[21px]";

  const sectionLabel =
    "text-[10px] font-bold uppercase tracking-[0.18em] text-[#12BCEB]";

  const inputClass =
    "w-full rounded-xl border border-[#DFE8F1] bg-[#F8FBFD] px-4 py-3.5 text-sm text-[#10233F] placeholder:text-[#8B9AAF] outline-none transition focus:border-[#12BCEB] focus:ring-4 focus:ring-[#12BCEB]/10 disabled:opacity-50";

  return (
    <div
      className="min-h-screen w-full overflow-hidden bg-[#F5F9FD] text-[#10233F]"
      style={{
        fontFamily:
          "Inter, ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <main className="px-4 pb-8 pt-4 lg:ml-[98px] lg:px-5 lg:pb-10 lg:pt-5 xl:ml-[108px]">
        <div className="mx-auto grid max-w-[1450px] grid-cols-1 gap-5 xl:grid-cols-[minmax(0,1fr)_285px]">

          <div className="min-w-0 space-y-5">

            {/* HERO */}
            <section
              id="premium-home"
              className={`${cardClass} overflow-hidden`}
            >
              {/* PREMIUM COVER IMAGE */}
              <div className="group relative h-[220px] overflow-hidden sm:h-[290px] lg:h-[330px]">
                {banner ? (
                  <img
                    src={banner}
                    alt="Business Cover"
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]"
                  />
                ) : (
                  <div className="h-full w-full bg-gradient-to-br from-[#061F43] via-[#082B5C] to-[#12BCEB]" />
                )}

                {/* Cover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-[#061F43]/90 via-[#082B5C]/45 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-t from-[#061F43]/65 via-transparent to-[#061F43]/10" />

                {/* Decorative Elements */}
                <div className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10" />
                <div className="absolute -right-8 -top-16 h-52 w-52 rounded-full border border-white/10" />

                {/* BUSINESS BRAND */}
                <div className="absolute left-5 top-5 z-10 flex max-w-[75%] items-center gap-3 sm:left-7 sm:top-7">
                  <div className="flex h-[52px] w-[52px] shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-white/40 bg-white p-1.5 shadow-xl sm:h-[66px] sm:w-[66px] sm:rounded-[20px]">
                    {logo ? (
                      <img
                        src={logo}
                        alt="Business Logo"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center rounded-xl bg-[#E8F8FD] text-[#082B5C]">
                        <UserRound size={27} />
                      </div>
                    )}
                  </div>

                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-black tracking-wide text-white sm:text-base">
                      {businessName || name || "Your Business"}
                    </p>

                    {industry && (
                      <p className="mt-1 truncate text-[9px] font-bold uppercase tracking-[0.18em] text-[#8CE7FF] sm:text-[10px]">
                        {industry}
                      </p>
                    )}

                    {isVerified && (
                      <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-[#12BCEB]/40 bg-[#12BCEB]/20 px-2 py-0.5 text-[8px] font-bold text-white">
                        <CheckCircle2 size={10} />
                        VERIFIED BUSINESS
                      </span>
                    )}
                  </div>
                </div>

                {/* HERO ACTIONS */}
                <div className="absolute right-4 top-4 z-10 flex gap-2 sm:right-6 sm:top-6">
                  <button
                    type="button"
                    onClick={onShare}
                    aria-label="Share profile"
                    title="Share Profile"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white shadow-lg backdrop-blur-xl transition hover:scale-110 hover:bg-white hover:text-[#082B5C]"
                  >
                    <Share2 size={17} />
                  </button>

                  <button
                    type="button"
                    onClick={onOpenQr}
                    aria-label="Scan profile QR"
                    title="Scan Profile QR"
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-[#12BCEB] text-white shadow-lg transition hover:scale-110 hover:bg-white hover:text-[#082B5C]"
                  >
                    <ScanLine size={17} />
                  </button>
                </div>

                {/* COVER BOTTOM LABEL */}
                <div className="absolute bottom-5 left-5 z-10 sm:bottom-7 sm:left-7">
                  <span className="rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur-md">
                    {industry || "Professional Profile"}
                  </span>
                </div>
              </div>

              {/* PROFILE INFORMATION */}
              <div className="relative px-5 pb-6 sm:px-7 sm:pb-8">
                <div className="-mt-[58px] flex flex-col gap-4 sm:-mt-[72px] sm:flex-row sm:items-end sm:gap-5">

                  {/* PROFILE IMAGE */}
                  <div className="relative z-20 shrink-0">
                    <div className="rounded-full bg-white p-[5px] shadow-[0_12px_35px_rgba(8,43,92,0.20)] sm:p-[7px]">
                      <div className="h-[112px] w-[112px] overflow-hidden rounded-full border-[3px] border-[#12BCEB] bg-[#E8F8FD] sm:h-[142px] sm:w-[142px]">
                        {avatar ? (
                          <img
                            src={avatar}
                            alt={name || "Profile"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center">
                            <UserRound size={55} className="text-[#8AA4BD]" />
                          </div>
                        )}
                      </div>
                    </div>

                    {isVerified && (
                      <div className="absolute bottom-3 right-1 flex h-8 w-8 items-center justify-center rounded-full border-[3px] border-white bg-[#12BCEB] text-white shadow-lg">
                        <CheckCircle2 size={16} />
                      </div>
                    )}
                  </div>

                  {/* PROFILE DETAILS */}
                  <div className="min-w-0 flex-1 pb-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h1 className="text-[25px] font-black tracking-[-0.04em] text-[#082B5C] sm:text-[32px]">
                        {name || "Your Name"}
                      </h1>

                      {isVerified && (
                        <CheckCircle2
                          size={19}
                          className="fill-[#12BCEB] text-white"
                        />
                      )}
                    </div>

                    <p className="mt-1 text-sm font-bold text-[#425D7C]">
                      {role || "Founder • Business Consultant"}
                    </p>

                    {location && (
                      <p className="mt-2 flex items-center gap-1.5 text-[11px] font-medium text-[#71839A]">
                        <MapPin size={14} className="text-[#12BCEB]" />
                        {location}
                      </p>
                    )}
                  </div>
                </div>

                {/* ABOUT DESCRIPTION */}
                <p className="mt-5 max-w-[750px] text-sm leading-7 text-[#63758C]">
                  {about ||
                    "Helping businesses grow digitally with modern solutions and creative ideas."}
                </p>

                {/* QUICK ACTION BUTTONS */}
                <div className="mt-5 flex flex-wrap gap-2.5">
                  {visibleButtons.length > 0 ? (
                    visibleButtons.map((button, index) => (
                      <button
                        key={button._id || button.id || index}
                        type="button"
                        onClick={() => onConfiguredButton(button)}
                        className={`flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition ${
                          button.actionType === "whatsapp"
                            ? "border border-[#B8EBD2] bg-white text-[#14935D] hover:bg-[#EAFBF3]"
                            : button.actionType === "call"
                            ? "bg-[#082B5C] text-white shadow-lg hover:bg-[#12BCEB]"
                            : "border border-[#C9D8E6] bg-white text-[#24415F] hover:border-[#12BCEB] hover:text-[#12BCEB]"
                        }`}
                      >
                        {button.actionType === "whatsapp" && <FaWhatsapp size={15} />}
                        {button.actionType === "call" && <Phone size={15} />}
                        {button.label}
                        <ArrowUpRight size={13} />
                      </button>
                    ))
                  ) : (
                    <>
                      {phone && (
                        <button
                          type="button"
                          onClick={() => onContactClick("phone")}
                          className="flex items-center gap-2 rounded-full bg-[#082B5C] px-5 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-[#12BCEB]"
                        >
                          <Phone size={15} />
                          Call
                        </button>
                      )}

                      {whatsapp && (
                        <button
                          type="button"
                          onClick={() => onContactClick("whatsapp")}
                          className="flex items-center gap-2 rounded-full border border-[#B8EBD2] bg-white px-5 py-3 text-xs font-bold text-[#14935D] transition hover:bg-[#EAFBF3]"
                        >
                          <FaWhatsapp size={15} />
                          WhatsApp
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={onShare}
                        className="flex items-center gap-2 rounded-full border border-[#C9D8E6] bg-white px-5 py-3 text-xs font-bold text-[#24415F] transition hover:border-[#12BCEB] hover:text-[#12BCEB]"
                      >
                        <Share2 size={15} />
                        Share
                      </button>

                      <button
                        type="button"
                        onClick={onOpenQr}
                        className="flex items-center gap-2 rounded-full bg-[#12BCEB] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#082B5C]"
                      >
                        <ScanLine size={15} />
                        Save Contact
                      </button>
                    </>
                  )}
                </div>
              </div>
            </section>

            {/* ABOUT */}
            <section className={`${cardClass} p-5 sm:p-7`}>
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                  <UserRound size={18} />
                </div>
                <div>
                  <p className={sectionLabel}>About</p>
                  <h2 className={sectionTitle}>About Me</h2>
                </div>
              </div>

              <p className="mt-5 max-w-4xl text-sm leading-7 text-[#61738C]">
                {about ||
                  "I am a passionate entrepreneur and digital solutions expert, helping businesses grow through technology, creativity and smart strategies. With a focus on innovation and customer satisfaction, I work towards building strong brands and creating meaningful digital experiences."}
              </p>

              <div className="mt-5 flex flex-wrap gap-2">
                {[
                  ["Business Growth", BriefcaseBusiness],
                  ["Digital Solutions", Code2],
                  ["Creative Design", Palette],
                  ["Reliable Support", Headset],
                ].map(([label, Icon]) => (
                  <span
                    key={label}
                    className="flex items-center gap-2 rounded-full bg-[#EFF8FC] px-3.5 py-2 text-[10px] font-semibold text-[#46637F]"
                  >
                    <Icon size={14} className="text-[#12BCEB]" />
                    {label}
                  </span>
                ))}
              </div>

              {/* ADDED: INDUSTRY AND BUSINESS NAME */}
              <div className="mt-3 flex flex-wrap gap-2">
                {industry && (
                  <span className="rounded-full border border-[#BCEAF5] bg-[#E8F8FD] px-3.5 py-2 text-[10px] font-semibold text-[#087DA1]">
                    {industry}
                  </span>
                )}
                {businessName && (
                  <span className="rounded-full border border-[#E1EAF3] bg-[#F5F9FD] px-3.5 py-2 text-[10px] font-semibold text-[#46637F]">
                    {businessName}
                  </span>
                )}
              </div>
            </section>

            {/* PRODUCTS */}
            {productList.length > 0 && (
              <section
                id="premium-products"
                className={`${cardClass} overflow-hidden p-5 sm:p-7`}
              >
                <div className="mb-5 flex items-end justify-between">
                  <div>
                    <p className={sectionLabel}>Featured collection</p>
                    <h2 className={sectionTitle}>Featured Products</h2>
                  </div>
                  <span className="text-[10px] font-bold text-[#71839A]">
                    Swipe to Explore →
                  </span>
                </div>

                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={12}
                  slidesPerView={1.15}
                  loop={productList.length > 4}
                  speed={700}
                  autoplay={productList.length > 1 ? swiperAutoplay : false}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  breakpoints={swiperBreakpoints}
                  className="premium-product-swiper !pb-10"
                >
                  {productList.map((product, index) => {
                    const cover = product.images?.find((item) => item?.url)?.url;

                    return (
                      <SwiperSlide
                        key={product._id || index}
                        className="h-auto"
                      >
                        <button
                          type="button"
                          onClick={() => onProductClick(product)}
                          className="group h-full w-full overflow-hidden rounded-xl border border-[#E2EAF2] bg-white text-left transition duration-300 hover:-translate-y-1 hover:shadow-[0_12px_30px_rgba(8,43,92,0.09)]"
                        >
                          <div className="relative h-40 overflow-hidden bg-[#EEF5F9]">
                            {cover ? (
                              <img
                                src={cover}
                                alt={product.name}
                                loading="lazy"
                                className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                              />
                            ) : (
                              <div className="flex h-full items-center justify-center">
                                <ImageIcon size={34} className="text-[#9CB1C5]" />
                              </div>
                            )}

                            <div className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#082B5C] shadow-sm">
                              <ArrowUpRight size={15} />
                            </div>
                          </div>

                          <div className="p-4">
                            <h3 className="truncate text-xs font-bold text-[#183250] sm:text-sm">
                              {product.name}
                            </h3>

                            <p className="mt-1.5 line-clamp-2 text-[10px] leading-5 text-[#7C8EA2]">
                              {product.description}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <p className="text-sm font-black text-[#082B5C]">
                                ₹{Number(product.price || 0).toLocaleString("en-IN")}+
                              </p>
                              <span className="text-[9px] font-bold text-[#12BCEB]">
                                View Details
                              </span>
                            </div>
                          </div>
                        </button>
                      </SwiperSlide>
                    );
                  })}
                </Swiper>
              </section>
            )}

            {/* GALLERY */}
            <section
              id="premium-gallery"
              className={`${cardClass} overflow-hidden p-5 sm:p-7`}
            >
              <div className="mb-5 flex items-end justify-between">
                <div>
                  <p className={sectionLabel}>A glimpse of my work</p>
                  <h2 className={sectionTitle}>Gallery</h2>
                </div>
                <span className="text-[10px] font-bold text-[#71839A]">
                  Swipe to Explore →
                </span>
              </div>

              {galleryImages.length > 0 ? (
                <Swiper
                  modules={[Autoplay, Navigation, Pagination]}
                  spaceBetween={12}
                  slidesPerView={1.15}
                  loop={galleryImages.length > 4}
                  speed={700}
                  autoplay={galleryImages.length > 1 ? swiperAutoplay : false}
                  navigation
                  pagination={{ clickable: true, dynamicBullets: true }}
                  breakpoints={swiperBreakpoints}
                  className="premium-gallery-swiper !pb-10"
                >
                  {galleryImages.map((image, index) => (
                    <SwiperSlide key={`${image.url}-${index}`}>
                      <button
                        type="button"
                        onClick={() => onGalleryClick(image)}
                        className="group relative block aspect-[4/3] w-full overflow-hidden rounded-xl bg-[#EEF5F9]"
                      >
                        <img
                          src={image.url}
                          alt={image.alt || `Gallery ${index + 1}`}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                        />

                        <span className="absolute bottom-2 left-2 rounded-full bg-[#082B5C]/80 px-2 py-1 text-[8px] font-bold text-white backdrop-blur">
                          {String(index + 1).padStart(2, "0")}
                        </span>

                        <div className="absolute inset-0 flex items-center justify-center bg-[#082B5C]/35 opacity-0 transition group-hover:opacity-100">
                          <ArrowUpRight size={22} className="text-white" />
                        </div>
                      </button>
                    </SwiperSlide>
                  ))}
                </Swiper>
              ) : (
                <div className="rounded-xl border border-dashed border-[#D6E2EC] py-12 text-center">
                  <ImageIcon size={35} className="mx-auto text-[#9CB1C5]" />
                  <p className="mt-3 text-xs text-[#7B8DA0]">
                    No gallery images added yet.
                  </p>
                </div>
              )}
            </section>

            {/* SOCIAL */}
            {socialLinks.length > 0 && (
              <section
                id="premium-social"
                className={`${cardClass} p-5 sm:p-7`}
              >
                <div className="mb-5">
                  <p className={sectionLabel}>Stay connected</p>
                  <h2 className={sectionTitle}>
                    Social Media & Contact Buttons
                  </h2>
                  <p className="mt-1 text-xs text-[#71839A]">
                    Connect with me on social media & get in touch
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-5">
                  {socialLinks.map((social, index) => {
                    const Icon = getSocialIcon(social.platform);

                    return (
                      <a
                        key={social._id || `${social.platform}-${index}`}
                        href={normalizeUrl(social.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-3 rounded-xl border border-[#E0E9F2] bg-white px-3 py-3 transition hover:-translate-y-0.5 hover:border-[#12BCEB] hover:shadow-sm"
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#E8F8FD] text-[#12BCEB]">
                          <Icon size={17} />
                        </span>

                        <div className="min-w-0">
                          <p className="truncate text-[10px] font-bold text-[#183250]">
                            {social.platform}
                          </p>
                          <p className="text-[9px] text-[#8191A3]">Connect</p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </section>
            )}

            {/* CONTACT FORM */}
            <section
              id="premium-contact"
              className={`${cardClass} overflow-hidden`}
            >
              <div className="grid lg:grid-cols-[0.8fr_1.2fr]">
                <div className="bg-[#082B5C] p-6 text-white sm:p-8">
                  <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#12BCEB]">
                    Let's connect
                  </p>

                  <h2 className="mt-3 text-2xl font-black leading-tight sm:text-3xl">
                    Let's Create Something Great Together
                  </h2>

                  <p className="mt-4 text-sm leading-6 text-white/65">
                    Have a project in mind? Share your ideas and let's make
                    something meaningful together.
                  </p>

                  {email && (
                    <div className="mt-6 flex items-center gap-3">
                      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-[#12BCEB]">
                        <Mail size={17} />
                      </div>

                      <div>
                        <p className="text-[9px] font-bold uppercase tracking-wider text-white/45">
                          Email
                        </p>
                        <p className="mt-1 break-all text-xs font-semibold">
                          {email}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-5 sm:p-8">
                  {formSubmitted ? (
                    <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                        <CheckCircle2 size={30} />
                      </div>

                      <h3 className="mt-4 text-lg font-bold text-[#082B5C]">
                        Inquiry Submitted Successfully!
                      </h3>

                      <p className="mt-2 max-w-sm text-xs leading-5 text-[#71839A]">
                        Thank you for reaching out. I'll get back to you soon.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={onFormSubmit} className="space-y-4">
                      {inquirySubmitError && (
                        <div className="rounded-xl border border-red-200 bg-red-50 p-3 text-xs text-red-600">
                          {inquirySubmitError}
                        </div>
                      )}

                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                        <input
                          type="text"
                          required
                          placeholder="Your Name"
                          value={formData.name}
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
                          value={formData.phone}
                          disabled={inquirySubmitting}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              phone: e.target.value,
                            })
                          }
                          className={inputClass}
                        />
                      </div>

                      <input
                        type="email"
                        placeholder="Email Address (Optional)"
                        value={formData.email}
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
                        placeholder="Tell me about your project..."
                        value={formData.message}
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
                        className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#082B5C] py-3.5 text-sm font-bold text-white transition hover:bg-[#12BCEB] disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        {inquirySubmitting ? (
                          "Submitting..."
                        ) : (
                          <>
                            <Send size={16} />
                            Send Inquiry
                          </>
                        )}
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </section>

            {/* BOTTOM CTA */}
            <section className="relative overflow-hidden rounded-[18px] bg-[#082B5C] px-6 py-7 text-white shadow-[0_12px_35px_rgba(8,43,92,0.16)] sm:px-8">
              <div className="absolute -right-16 -top-16 h-40 w-40 rounded-full bg-[#12BCEB]/25 blur-2xl" />

              <div className="relative flex flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Rocket size={20} className="text-[#12BCEB]" />
                    <h3 className="text-lg font-black">
                      Scan • Connect • Grow
                    </h3>
                  </div>

                  <p className="mt-1 text-xs text-white/60">
                    Your success is just a scan away!
                  </p>
                </div>

                <button
                  type="button"
                  onClick={onOpenQr}
                  className="flex items-center gap-2 rounded-full bg-[#12BCEB] px-5 py-3 text-xs font-bold text-white transition hover:bg-white hover:text-[#082B5C]"
                >
                  <ScanLine size={15} />
                  Scan Profile
                </button>
              </div>
            </section>
          </div>

          {/* RIGHT SIDEBAR */}
          <aside className="order-last space-y-5 xl:sticky xl:top-5 xl:order-none xl:self-start">

            {/* QR CARD */}
            <section
              id="premium-qr"
              className={`${cardClass} p-5 text-center`}
            >
              <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                <ScanLine size={19} />
              </div>

              <h3 className="mt-3 text-sm font-extrabold text-[#082B5C]">
                Scan to Connect
              </h3>

              <p className="mt-1 text-[10px] leading-5 text-[#71839A]">
                Save my contact or visit my profile
              </p>

              <div className="mx-auto mt-4 flex w-fit items-center justify-center rounded-xl border border-[#E5EDF4] bg-white p-3">
                {qrFetching ? (
                  <div className="flex h-[150px] w-[150px] items-center justify-center text-[10px] text-[#71839A]">
                    Loading QR...
                  </div>
                ) : qrTargetUrl ? (
                  <QRCodeCanvas
                    id="premium-profile-qr"
                    value={qrTargetUrl}
                    size={150}
                    level="H"
                    includeMargin
                  />
                ) : (
                  <div className="flex h-[150px] w-[150px] items-center justify-center text-[10px] text-[#71839A]">
                    QR unavailable
                  </div>
                )}
              </div>

              {qrTargetUrl && !qrFetching && (
                <a
                  href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrTargetUrl)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 flex items-center justify-center gap-2 rounded-full bg-[#E8F8FD] py-2.5 text-[10px] font-bold text-[#087DA1] transition hover:bg-[#12BCEB] hover:text-white"
                >
                  <Download size={13} />
                  Download QR
                </a>
              )}
            </section>

            {/* CONTACT INFORMATION */}
            <section className={`${cardClass} p-5`}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                  <Phone size={17} />
                </div>
                <h3 className="text-sm font-extrabold text-[#082B5C]">
                  Contact Information
                </h3>
              </div>

              <div className="mt-5 space-y-4">
                {phone && (
                  <button
                    type="button"
                    onClick={() => onContactClick("phone")}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                      <Phone size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#183250]">
                        {phone}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                        Call Anytime
                      </p>
                    </div>
                  </button>
                )}

                {email && (
                  <button
                    type="button"
                    onClick={() => onContactClick("email")}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                      <Mail size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="break-all text-[11px] font-bold text-[#183250]">
                        {email}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                        Drop me a mail
                      </p>
                    </div>
                  </button>
                )}

                {/* ADDED: WHATSAPP CONTACT */}
                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => onContactClick("whatsapp")}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                      <FaWhatsapp size={15} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] font-bold text-[#183250]">
                        {whatsapp}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                        Chat on WhatsApp
                      </p>
                    </div>
                  </button>
                )}

                {(website || websiteUrl) && (
                  <button
                    type="button"
                    onClick={() => onContactClick("website")}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                      <Globe size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="truncate text-[11px] font-bold text-[#183250]">
                        {website || websiteUrl}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                        Visit my website
                      </p>
                    </div>
                  </button>
                )}

                {address && (
                  <button
                    type="button"
                    onClick={() => onContactClick("address")}
                    className="flex w-full items-center gap-3 text-left"
                  >
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#E8F8FD] text-[#12BCEB]">
                      <MapPin size={15} />
                    </div>

                    <div className="min-w-0">
                      <p className="text-[11px] font-bold leading-5 text-[#183250]">
                        {address}
                      </p>
                      <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                        Available for business
                      </p>
                    </div>
                  </button>
                )}
              </div>
            </section>

            {/* BUSINESS HOURS */}
            <section className={`${cardClass} p-5`}>
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                  <Clock size={17} />
                </div>

                <h3 className="text-sm font-extrabold text-[#082B5C]">
                  Business Hours
                </h3>
              </div>

              {/* ADDED: DYNAMIC BUSINESS TIMING */}
              {businessHours && (
                <div className="mb-4 mt-5 rounded-xl bg-[#E8F8FD] p-3">
                  <p className="text-[9px] font-bold uppercase tracking-wider text-[#087DA1]">
                    Business Timing
                  </p>
                  <p className="mt-1 text-xs font-semibold text-[#183250]">
                    {businessHours}
                  </p>
                </div>
              )}

              <div className="mt-5 space-y-2.5">
                {defaultHours.map(([day, hours]) => (
                  <div
                    key={day}
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="text-[10px] font-bold text-[#183250]">
                      {day}
                    </span>

                    <span
                      className={`text-right text-[9px] ${
                        hours === "Closed"
                          ? "font-bold text-[#D14D4D]"
                          : "text-[#657991]"
                      }`}
                    >
                      {hours}
                    </span>
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center gap-2 text-[9px] font-bold text-[#16A765]">
                <span className="h-2 w-2 rounded-full bg-[#16A765]" />
                Open Now
              </div>
            </section>

            {/* UPI */}
            {upiId && (
              <section className={`${cardClass} p-5`}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                    <CreditCard size={17} />
                  </div>

                  <h3 className="text-sm font-extrabold text-[#082B5C]">
                    UPI Payment
                  </h3>
                </div>

                <div className="mt-5">
                  <div className="text-2xl font-black italic text-[#64748B]">
                    UPI
                  </div>

                  <p className="mt-1 text-[10px] font-semibold text-[#71839A]">
                    Scan & Pay
                  </p>

                  <p className="mt-3 break-all text-[10px] font-semibold text-[#3C5877]">
                    {upiId}
                  </p>

                  <button
                    type="button"
                    onClick={handleCopyUpi}
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-[#082B5C] py-3 text-[10px] font-bold text-white transition hover:bg-[#12BCEB]"
                  >
                    <Copy size={13} />
                    {copiedUpi ? "Copied!" : "Copy UPI ID"}
                  </button>
                </div>
              </section>
            )}

            {/* FOLLOW ME */}
            {socialLinks.length > 0 && (
              <section className={`${cardClass} p-5`}>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#E8F8FD] text-[#12BCEB]">
                    <Share2 size={17} />
                  </div>

                  <div>
                    <h3 className="text-sm font-extrabold text-[#082B5C]">
                      Follow Me
                    </h3>
                    <p className="mt-0.5 text-[9px] text-[#7D8EA1]">
                      Stay connected on social media
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {socialLinks.map((social, index) => {
                    const Icon = getSocialIcon(social.platform);

                    return (
                      <a
                        key={social._id || `${social.platform}-${index}`}
                        href={normalizeUrl(social.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        title={social.platform}
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-[#E1EAF3] bg-[#F8FBFD] text-[#082B5C] transition hover:-translate-y-0.5 hover:border-[#12BCEB] hover:bg-[#12BCEB] hover:text-white"
                      >
                        <Icon size={15} />
                      </a>
                    );
                  })}
                </div>
              </section>
            )}
          </aside>
        </div>
      </main>

      {/* ADDED: FOOTER */}
      <footer className="border-t border-[#E1EAF3] bg-white px-5 py-7 text-center sm:px-8">
        <div className="mx-auto flex max-w-[1450px] flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-[#082B5C]">
              Bio<span className="text-[#12BCEB]">.</span>
            </span>
            <span className="text-xs text-[#71839A]">
              Professional Digital Identity
            </span>
          </div>
          <p className="text-xs text-[#71839A]">
            © {new Date().getFullYear()} {name || businessName}. All rights reserved.
          </p>
        </div>
        <p className="mt-5 text-[11px] text-[#8191A3]">
          Powered by{" "}
          <span className="font-bold text-[#12BCEB]">BioWebsite</span>
        </p>
      </footer>

      {/* SWIPER CUSTOM STYLING */}
      <style>{`
        .premium-product-swiper,
        .premium-gallery-swiper {
          width: 100%;
          overflow: hidden;
        }

        .premium-product-swiper .swiper-slide,
        .premium-gallery-swiper .swiper-slide {
          height: auto;
        }

        .premium-product-swiper .swiper-button-next,
        .premium-product-swiper .swiper-button-prev,
        .premium-gallery-swiper .swiper-button-next,
        .premium-gallery-swiper .swiper-button-prev {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: #ffffff;
          color: #082B5C;
          box-shadow: 0 3px 12px rgba(8, 43, 92, 0.12);
        }

        .premium-product-swiper .swiper-button-next::after,
        .premium-product-swiper .swiper-button-prev::after,
        .premium-gallery-swiper .swiper-button-next::after,
        .premium-gallery-swiper .swiper-button-prev::after {
          font-size: 12px;
          font-weight: 900;
        }

        .premium-product-swiper .swiper-pagination,
        .premium-gallery-swiper .swiper-pagination {
          bottom: 0 !important;
        }

        .premium-product-swiper .swiper-pagination-bullet,
        .premium-gallery-swiper .swiper-pagination-bullet {
          background: #082B5C;
          opacity: 0.25;
        }

        .premium-product-swiper .swiper-pagination-bullet-active,
        .premium-gallery-swiper .swiper-pagination-bullet-active {
          background: #12BCEB;
          opacity: 1;
        }

        @media (max-width: 640px) {
          .premium-product-swiper .swiper-button-next,
          .premium-product-swiper .swiper-button-prev,
          .premium-gallery-swiper .swiper-button-next,
          .premium-gallery-swiper .swiper-button-prev {
            display: none;
          }
        }
      `}</style>
    </div>
  );
};

export default MinimalLuxury;
