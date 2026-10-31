
import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, A11y, Autoplay } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Share2,
  UserRound,
  CheckCircle2,
  Clock,
  Download,
  Image as ImageIcon,
  ArrowUpRight,
  ScanLine,
  Send,
  Zap,
  ArrowRight,
  BriefcaseBusiness,
  Sparkles,
  ShieldCheck,
  Layers,
  Palette,
  Code2,
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

/*
  CreativePortfolio
  - No top navbar
  - Share and Scan QR buttons on banner
  - Full available parent width
  - Premium About section
  - Single-row Swiper gallery
  - Redesigned QR scanner section
  - Responsive mobile and desktop layouts
  - Original props and callbacks preserved
*/

const CreativePortfolio = ({
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
    address = "",
    logo = null,
    avatar = null,
    banner = null,
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
  } = businessInfo;

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

  const contactItems = [
    {
      Icon: Phone,
      label: "Phone Number",
      value: phone,
      type: "phone",
      sub: "Call anytime",
    },
    {
      Icon: MessageCircle,
      label: "WhatsApp",
      value: whatsapp,
      type: "whatsapp",
      sub: "Chat with me",
    },
    {
      Icon: Mail,
      label: "Email Address",
      value: email,
      type: "email",
      sub: "Drop me a mail",
    },
    {
      Icon: Globe,
      label: "Website",
      value: website,
      type: "website",
      sub: "Visit my website",
    },
    {
      Icon: MapPin,
      label: "Location",
      value: address || location,
      type: "address",
      sub: "Find my location",
    },
    {
      Icon: Clock,
      label: "Business Hours",
      value: businessHours,
      type: "hours",
      sub: "Working hours",
    },
  ].filter((item) => item.value);

  const sectionLabel =
    "text-[10px] font-extrabold uppercase tracking-[2.5px] text-cyan-600";

  const sectionHeading =
    "mt-2 text-2xl font-extrabold tracking-tight text-slate-900 sm:text-3xl lg:text-4xl";

  const cardClass =
    "rounded-2xl border border-slate-200/80 bg-white shadow-[0_8px_30px_rgba(15,45,75,0.06)]";

  const inputClass =
    "w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-800 placeholder:text-slate-400 outline-none transition focus:border-cyan-500 focus:ring-4 focus:ring-cyan-500/10 disabled:opacity-50";

  const primaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full bg-[#087FA5] px-5 py-3 text-xs font-bold text-white shadow-md shadow-cyan-900/10 transition hover:-translate-y-0.5 hover:bg-[#066789]";

  const secondaryButton =
    "inline-flex items-center justify-center gap-2 rounded-full border border-cyan-200 bg-white px-5 py-3 text-xs font-bold text-[#087FA5] transition hover:border-cyan-500 hover:bg-cyan-50";

  return (
    <div className="creative-portfolio relative w-full min-w-0 overflow-hidden bg-white pb-24 font-sans text-slate-800">

      {/* PROFILE / HERO */}
      <section
        id="creative-home"
        className="w-full px-3 pb-7 pt-3 sm:px-6 sm:pb-12 sm:pt-5 lg:px-8 xl:px-10"
      >
        <div className="relative w-full overflow-hidden rounded-[22px] border border-cyan-100 bg-[#F4FBFD] shadow-sm sm:rounded-[28px]">

          {/* COVER BANNER */}
          <div className="relative h-36 overflow-hidden bg-gradient-to-r from-[#087FA5] via-[#0B9CC1] to-[#6AD6E7] sm:h-52 md:h-60">
            {banner && (
              <img
                src={banner}
                alt="Profile banner"
                className="absolute inset-0 h-full w-full object-cover"
              />
            )}

            <div className="absolute inset-0 bg-gradient-to-r from-[#063B59]/55 via-[#087FA5]/20 to-cyan-500/20" />

            {/* SHARE AND SCAN */}
            <div className="absolute right-3 top-3 z-10 flex items-center gap-2 sm:right-5 sm:top-5">
              <button
                type="button"
                onClick={onShare}
                aria-label="Share profile"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-white/40 bg-white/20 text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-cyan-700 sm:h-11 sm:w-11"
              >
                <Share2 size={17} />
              </button>

              <button
                type="button"
                onClick={onOpenQr}
                aria-label="Scan QR code"
                className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-white/40 bg-white/20 px-3 text-[11px] font-bold text-white shadow-lg backdrop-blur-md transition hover:scale-105 hover:bg-white hover:text-cyan-700 sm:h-11 sm:px-5 sm:text-xs"
              >
                <ScanLine size={16} />
                <span>Scan QR</span>
              </button>
            </div>

            <div className="absolute bottom-4 left-4 sm:bottom-6 sm:left-8">
              <span className="rounded-full border border-white/30 bg-white/15 px-3 py-1.5 text-[9px] font-bold uppercase tracking-[2px] text-white backdrop-blur-md">
                Digital Profile
              </span>
            </div>
          </div>

          {/* PROFILE DETAILS */}
          <div className="relative px-4 pb-5 sm:px-6 sm:pb-8 lg:px-9">
            <div className="-mt-12 flex flex-col gap-3 sm:-mt-[72px] sm:flex-row sm:items-end sm:gap-6">

              {/* AVATAR */}
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-[25px] border-4 border-white bg-white shadow-lg sm:h-36 sm:w-36 sm:rounded-[30px]">
  {avatar ? (
    <img
      src={avatar}
      alt={name || "Profile"}
      className="h-full w-full object-cover"
    />
  ) : logo ? (
    <img
      src={logo}
      alt="Business logo"
      className="h-full w-full object-contain p-4"
    />
  ) : (
    <div className="flex h-full items-center justify-center bg-cyan-50">
      <UserRound size={54} className="text-cyan-500" />
    </div>
  )}

  {avatar && logo && (
    <div className="absolute bottom-1 right-1 h-12 w-12 overflow-hidden rounded-full border-2 border-white bg-white shadow-md sm:h-14 sm:w-14">
      <img
        src={logo}
        alt="Business logo"
        className="h-full w-full object-contain "
      />
    </div>
  )}
</div>

              {/* NAME */}
              <div className="min-w-0 flex-1 pb-1">
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-4xl">
                    {name || businessName || "Your Name"}
                  </h1>

                  {isVerified && (
                    <CheckCircle2
                      size={21}
                      className="fill-cyan-600 text-white"
                      title="Verified Profile"
                    />
                  )}

                  {isVerified && (
                    <span className="rounded-full bg-cyan-100 px-2.5 py-1 text-[9px] font-extrabold uppercase tracking-wider text-cyan-800">
                      Verified
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-bold text-cyan-700 sm:text-base">
                  {role || industry || "Professional"}
                </p>

                {(location || industry) && (
                  <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-500">
                    {location && (
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={13} className="text-cyan-600" />
                        {location}
                      </span>
                    )}

                    {industry && (
                      <span className="inline-flex items-center gap-1">
                        <BriefcaseBusiness size={13} className="text-cyan-600" />
                        {industry}
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>

            <p className="mt-5 max-w-5xl text-sm leading-7 text-slate-600">
              {about ||
                "I transform creative ideas into meaningful digital experiences. Passionate about design, technology and building things that make an impact."}
            </p>

            {/* PROFILE ACTIONS */}
            <div className="mt-5 flex flex-wrap gap-2.5">
              {visibleButtons.length > 0 ? (
                visibleButtons.map((button, index) => (
                  <button
                    key={button._id || button.id || index}
                    type="button"
                    onClick={() => onConfiguredButton(button)}
                    className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-xs font-bold transition hover:-translate-y-0.5 ${
                      button.actionType === "whatsapp"
                        ? "bg-emerald-500 text-white hover:bg-emerald-600"
                        : button.actionType === "call"
                        ? "bg-cyan-700 text-white hover:bg-cyan-800"
                        : "border border-cyan-200 bg-white text-cyan-800 hover:bg-cyan-50"
                    }`}
                  >
                    {button.label}
                    <ArrowUpRight size={14} />
                  </button>
                ))
              ) : (
                <>
                  <button
                    type="button"
                    onClick={() => onContactClick("phone")}
                    className={primaryButton}
                  >
                    <Phone size={15} />
                    Call Now
                  </button>

                  <button
                    type="button"
                    onClick={() => onContactClick("whatsapp")}
                    className={secondaryButton}
                  >
                    <MessageCircle size={15} />
                    WhatsApp
                  </button>

                  <button
                    type="button"
                    onClick={onShare}
                    className={secondaryButton}
                  >
                    <Share2 size={15} />
                    Share Profile
                  </button>
                </>
              )}
            </div>

            {/* SOCIAL LINKS */}
            {socialLinks.length > 0 && (
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-cyan-100 pt-4">
                <span className="mr-1 text-[10px] font-extrabold uppercase tracking-[1.8px] text-slate-400">
                  Connect
                </span>

                {socialLinks.map((social, index) => {
                  const Icon = getSocialIcon(social.platform);

                  return (
                    <a
                      key={social._id || `${social.platform}-${index}`}
                      href={normalizeUrl(social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={social.platform}
                      className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600 transition hover:border-cyan-500 hover:bg-cyan-600 hover:text-white"
                    >
                      <Icon size={15} />
                    </a>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PREMIUM ABOUT SECTION */}
      <section
        id="creative-about"
        className="w-full px-4 py-10 sm:px-7 sm:py-14 lg:px-10"
      >
        <div className="relative overflow-hidden rounded-[28px] border border-cyan-100 bg-gradient-to-br from-[#F2FBFD] via-white to-[#EAF8FC] p-5 sm:p-8 lg:p-10">

          {/* Decorative background */}
          <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-100/50 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-64 w-64 rounded-full bg-sky-100/70 blur-3xl" />

          <div className="relative grid items-center gap-8 lg:grid-cols-12 lg:gap-12">

            {/* LEFT CONTENT */}
            <div className="lg:col-span-7">
              <div className="inline-flex items-center gap-2 rounded-full border border-cyan-200 bg-white px-4 py-2 shadow-sm">
                <span className="h-2 w-2 rounded-full bg-cyan-500" />
                <p className={sectionLabel}>About Us</p>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight text-slate-900 sm:text-4xl lg:text-5xl">
                A Little About
                <span className="block text-[#087FA5]">
                  {businessName || name || "Our Business"}
                </span>
              </h2>

              <p className="mt-5 max-w-2xl text-sm leading-8 text-slate-600 sm:text-base">
                {about ||
                  "I am passionate about creating meaningful digital experiences. I combine creativity, technology and smart strategies to build solutions that make a difference."}
              </p>

              {industry && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-cyan-200 bg-white px-4 py-3 text-xs font-bold text-cyan-800 shadow-sm">
                  <BriefcaseBusiness size={16} />
                  {industry}
                </div>
              )}

              <div className="mt-8 flex flex-wrap items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#087FA5] text-white shadow-lg shadow-cyan-900/15">
                  <Sparkles size={22} />
                </div>

                <div>
                  <p className="text-base font-extrabold text-slate-900">
                    {name || businessName || "Our Team"}
                  </p>
                  <p className="mt-1 text-xs font-medium text-slate-500">
                    {role || industry || "Professional"}
                  </p>
                </div>
              </div>
            </div>

            {/* RIGHT HIGHLIGHT CARD */}
            <div className="relative lg:col-span-5">
              <div className="rounded-[25px] border border-white bg-white/90 p-5 shadow-[0_15px_45px_rgba(8,127,165,0.10)] backdrop-blur sm:p-7">

                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-extrabold uppercase tracking-[2px] text-cyan-600">
                      Our Identity
                    </p>
                    <h3 className="mt-2 text-xl font-black text-slate-900">
                      Who We Are
                    </h3>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <ShieldCheck size={25} />
                  </div>
                </div>

                <div className="mt-6 space-y-3">
                  <div className="flex items-start gap-3 rounded-xl bg-[#F4FBFD] p-4">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm">
                      <BriefcaseBusiness size={18} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Business
                      </p>
                      <p className="mt-1 break-words text-sm font-extrabold text-slate-800">
                        {businessName || name || "Our Business"}
                      </p>
                    </div>
                  </div>

                  {industry && (
                    <div className="flex items-start gap-3 rounded-xl bg-[#F4FBFD] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm">
                        <Layers size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Industry
                        </p>
                        <p className="mt-1 break-words text-sm font-extrabold text-slate-800">
                          {industry}
                        </p>
                      </div>
                    </div>
                  )}

                  {(location || address) && (
                    <div className="flex items-start gap-3 rounded-xl bg-[#F4FBFD] p-4">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white text-cyan-700 shadow-sm">
                        <MapPin size={18} />
                      </div>
                      <div className="min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                          Location
                        </p>
                        <p className="mt-1 break-words text-sm font-extrabold text-slate-800">
                          {address || location}
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {isVerified && (
                  <div className="mt-5 flex items-center gap-2 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-xs font-bold text-emerald-700">
                    <CheckCircle2 size={17} />
                    Verified Profile
                  </div>
                )}
              </div>

              <div className="absolute -right-3 -top-3 -z-10 h-full w-full rounded-[25px] border-2 border-cyan-200/60" />
            </div>
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      {productList.length > 0 && (
        <section
          id="creative-work"
          className="w-full px-4 py-9 sm:px-7 sm:py-12 lg:px-10"
        >
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className={sectionLabel}>Featured Products</p>
              <h2 className={sectionHeading}>Our Products</h2>
              <p className="mt-2 text-xs text-slate-500">
                Quality products built for your success. Explore our latest collection.
              </p>
            </div>

            <span className="inline-flex items-center gap-2 text-xs font-bold text-cyan-700">
              Explore Collection
              <ArrowRight size={15} />
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {productList.map((product, index) => {
              const cover = product.images?.find((item) => item?.url)?.url;

              return (
                <button
                  key={product._id || index}
                  type="button"
                  onClick={() => onProductClick(product)}
                  className="group min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="relative m-2 h-44 overflow-hidden rounded-xl bg-slate-100">
                    {cover ? (
                      <img
                        src={cover}
                        alt={product.name}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        <ImageIcon size={38} className="text-slate-300" />
                      </div>
                    )}

                    <span className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white text-cyan-700 shadow">
                      <ArrowUpRight size={16} />
                    </span>
                  </div>

                  <div className="p-4 pt-2">
                    <h3 className="truncate text-sm font-extrabold text-slate-900">
                      {product.name}
                    </h3>

                    <p className="mt-1 line-clamp-2 min-h-8 text-xs leading-5 text-slate-500">
                      {product.description}
                    </p>

                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-base font-black text-slate-900">
                        ₹{Number(product.price || 0).toLocaleString("en-IN")}
                      </p>

                      <span className="flex h-8 w-8 items-center justify-center rounded-full border border-cyan-200 text-cyan-700 transition group-hover:bg-cyan-600 group-hover:text-white">
                        <ArrowRight size={14} />
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* GALLERY - SWIPER CAROUSEL */}
      <section
        id="creative-gallery"
        className="w-full overflow-hidden bg-[#F5FBFD] px-4 py-10 sm:px-7 sm:py-14 lg:px-10"
      >
        <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-100 bg-white px-3 py-1.5">
              <span className="h-1.5 w-1.5 rounded-full bg-cyan-500" />
              <p className={sectionLabel}>Visual Stories</p>
            </div>

            <h2 className={sectionHeading}>Gallery & Our Work</h2>

            <p className="mt-2 text-xs leading-6 text-slate-500 sm:text-sm">
              Explore some moments, projects and creative work.
            </p>
          </div>

          {galleryImages.length > 0 && (
            <div className="flex items-center gap-2 text-xs font-bold text-cyan-700">
              <span>Swipe to explore</span>
              <ArrowRight size={16} />
            </div>
          )}
        </div>

        {galleryImages.length > 0 ? (
          <div className="gallery-swiper-wrap relative">
            <Swiper
              modules={[Pagination, A11y, Autoplay]}
              spaceBetween={14}
              slidesPerView="auto"
              loop={galleryImages.length > 3}
              grabCursor={true}
              watchOverflow={true}
              pagination={{
                clickable: true,
                dynamicBullets: true,
              }}
              autoplay={
                galleryImages.length > 2
                  ? {
                      delay: 3500,
                      disableOnInteraction: false,
                      pauseOnMouseEnter: true,
                    }
                  : false
              }
              breakpoints={{
                640: {
                  spaceBetween: 18,
                },
                1024: {
                  spaceBetween: 22,
                },
              }}
              className="!overflow-visible !pb-12"
            >
              {galleryImages.map((image, index) => (
                <SwiperSlide
                  key={`${image.url}-${index}`}
                  className="!h-auto !w-[76%] sm:!w-[42%] lg:!w-[29%] xl:!w-[23%]"
                >
                  <button
                    type="button"
                    onClick={() => onGalleryClick(image)}
                    className="group relative block aspect-[4/3] w-full overflow-hidden rounded-[22px] bg-slate-200 text-left shadow-sm transition duration-300 hover:-translate-y-1 hover:shadow-xl"
                  >
                    <img
                      src={image.url}
                      alt={image.alt || `Gallery ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/65 via-transparent to-transparent opacity-80 transition group-hover:opacity-100" />

                    <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between p-4">
                      <div className="min-w-0">
                        <span className="text-[9px] font-bold uppercase tracking-[2px] text-cyan-200">
                          Our Work
                        </span>
                        <p className="mt-1 truncate text-sm font-extrabold text-white">
                          {image.alt || `Gallery ${index + 1}`}
                        </p>
                      </div>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white text-cyan-700 shadow-lg transition group-hover:bg-cyan-600 group-hover:text-white">
                        <ArrowUpRight size={17} />
                      </span>
                    </div>
                  </button>
                </SwiperSlide>
              ))}
            </Swiper>

            <style>{`
              .gallery-swiper-wrap .swiper-pagination {
                bottom: 0 !important;
              }
              .gallery-swiper-wrap .swiper-pagination-bullet {
                width: 7px;
                height: 7px;
                background: #0891b2;
                opacity: 0.25;
              }
              .gallery-swiper-wrap .swiper-pagination-bullet-active {
                width: 22px;
                border-radius: 20px;
                opacity: 1;
              }
            `}</style>
          </div>
        ) : (
          <div className="flex min-h-[210px] flex-col items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-white text-center">
            <ImageIcon size={40} className="text-cyan-200" />
            <p className="mt-3 text-sm font-semibold text-slate-500">
              No gallery images added yet.
            </p>
          </div>
        )}
      </section>

      {/* CONTACT + INQUIRY */}
      <section
        id="creative-contact"
        className="w-full bg-[#F5FBFD] px-4 py-9 sm:px-7 sm:py-12 lg:px-10"
      >
        <div className="mb-6">
          <p className={sectionLabel}>Get In Touch</p>
          <h2 className={sectionHeading}>Let's Talk Together</h2>
        </div>

        <div className="grid min-w-0 gap-4 lg:grid-cols-12">

          {/* CONTACT BANNER */}
          <div className="relative flex min-h-[260px] min-w-0 flex-col justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-[#07516E] to-[#0799B8] p-6 text-white lg:col-span-4">
            {banner && (
              <img
                src={banner}
                alt="Contact background"
                className="absolute inset-0 h-full w-full object-cover opacity-20"
              />
            )}

            <div className="relative">
              <p className="text-[10px] font-extrabold uppercase tracking-[2.5px] text-cyan-100">
                Get In Touch
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight">
                Let's Create Something Great Together
              </h2>

              <p className="mt-4 text-xs leading-6 text-cyan-50/90">
                Have a project in mind? Share your ideas and let's make something meaningful together.
              </p>

              <button
                type="button"
                onClick={() => onContactClick("email")}
                className="mt-6 inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-xs font-bold text-cyan-800 transition hover:bg-cyan-50"
              >
                <Send size={14} />
                Send a Message
              </button>
            </div>
          </div>

          {/* INQUIRY FORM */}
          <div className={`${cardClass} min-w-0 p-5 sm:p-7 lg:col-span-5`}>
            {formSubmitted ? (
              <div className="flex min-h-[320px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-500">
                  <CheckCircle2 size={35} />
                </div>

                <h3 className="mt-5 text-xl font-black text-slate-900">
                  Inquiry Submitted!
                </h3>

                <p className="mt-2 max-w-xs text-sm leading-6 text-slate-500">
                  Thank you for contacting me. I'll get back to you soon.
                </p>
              </div>
            ) : (
              <form onSubmit={onFormSubmit} className="space-y-4">
                <div className="mb-5">
                  <h3 className="text-lg font-black text-slate-900">
                    Send an Inquiry
                  </h3>
                  <p className="mt-1 text-xs text-slate-400">
                    Fill in the details and I'll contact you shortly.
                  </p>
                </div>

                {inquirySubmitError && (
                  <div className="rounded-xl border border-red-100 bg-red-50 p-3 text-sm text-red-600">
                    {inquirySubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <input
                    type="text"
                    required
                    placeholder="Your Name *"
                    value={formData.name}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number *"
                    value={formData.phone}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
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
                    setFormData({ ...formData, email: e.target.value })
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
                    setFormData({ ...formData, message: e.target.value })
                  }
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-700 py-3.5 text-sm font-bold text-white transition hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50"
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

          {/* CONTACT INFORMATION */}
          <div className="flex min-w-0 flex-col gap-3 lg:col-span-3">
            <div className={`${cardClass} min-w-0 p-5`}>
              <h3 className="mb-5 text-sm font-black text-slate-900">
                Contact Information
              </h3>

              <div className="space-y-4">
                {contactItems.map((item) => (
                  <button
                    key={item.type}
                    type="button"
                    disabled={item.type === "hours"}
                    onClick={() =>
                      item.type !== "hours" && onContactClick(item.type)
                    }
                    className="flex w-full min-w-0 items-center gap-3 text-left disabled:cursor-default"
                  >
                    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cyan-100 text-cyan-700">
                      <item.Icon size={15} />
                    </span>

                    <span className="min-w-0">
                      <span className="block break-words text-[11px] font-extrabold text-slate-800">
                        {item.value}
                      </span>
                      <span className="mt-0.5 block text-[9px] text-slate-400">
                        {item.sub}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* SOCIAL MEDIA */}
            {socialLinks.length > 0 && (
              <div className={`${cardClass} min-w-0 p-5`}>
                <h3 className="text-sm font-black text-slate-900">
                  Follow Me
                </h3>

                <p className="mt-1 text-[10px] text-slate-400">
                  Stay connected on social media
                </p>

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
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-slate-50 text-cyan-800 transition hover:bg-cyan-600 hover:text-white"
                      >
                        <Icon size={16} />
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* PREMIUM SCANNER SECTION - BOTTOM */}
      {qrTargetUrl && (
        <section className="relative w-full overflow-hidden px-4 py-10 sm:px-7 sm:py-16 lg:px-10">

          <div className="relative overflow-hidden rounded-[28px] bg-gradient-to-br from-[#063B59] via-[#075E7D] to-[#0799B8] p-5 text-white shadow-[0_20px_60px_rgba(7,81,110,0.20)] sm:p-9 lg:p-12">

            {/* Decorative background */}
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full border-[35px] border-white/5" />
            <div className="pointer-events-none absolute -bottom-28 -left-20 h-72 w-72 rounded-full border-[35px] border-white/5" />

            <div className="relative grid items-center gap-9 lg:grid-cols-12 lg:gap-12">

              {/* SCANNER CONTENT */}
              <div className="lg:col-span-7">
                <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 backdrop-blur">
                  <ScanLine size={14} className="text-cyan-200" />
                  <span className="text-[10px] font-extrabold uppercase tracking-[2px] text-cyan-100">
                    Digital Connection
                  </span>
                </div>

                <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                  Scan.
                  <span className="text-cyan-200"> Connect.</span>
                  <br />
                  Grow Together.
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-cyan-50/80 sm:text-base">
                  Connect with us instantly. Scan this QR code to access our digital profile, contact information and business details in seconds.
                </p>

                <div className="mt-7 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={onOpenQr}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-xs font-extrabold text-[#07516E] shadow-lg transition hover:-translate-y-1 hover:bg-cyan-50"
                  >
                    <ScanLine size={16} />
                    Open QR Scanner
                    <ArrowUpRight size={15} />
                  </button>

                  {!qrFetching && (
                    <a
                      href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(
                        qrTargetUrl
                      )}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 rounded-full border border-white/30 bg-white/10 px-6 py-3.5 text-xs font-bold text-white backdrop-blur transition hover:bg-white/20"
                    >
                      <Download size={16} />
                      Download QR
                    </a>
                  )}
                </div>

                <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-white/15 pt-6">
                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
                    <CheckCircle2 size={16} />
                    Instant Access
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
                    <ShieldCheck size={16} />
                    Easy Connection
                  </div>

                  <div className="flex items-center gap-2 text-xs font-semibold text-cyan-100">
                    <Zap size={16} />
                    Quick & Simple
                  </div>
                </div>
              </div>

              {/* QR CODE CARD */}
              <div className="flex justify-center lg:col-span-5 lg:justify-end">
                <div className="w-full max-w-[310px] rounded-[25px] border border-white/50 bg-white p-5 text-center shadow-2xl sm:p-7">

                  <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-50 text-cyan-700">
                    <ScanLine size={25} />
                  </div>

                  <h3 className="mt-4 text-lg font-black text-slate-900">
                    Scan to Connect
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Point your camera at the QR code
                  </p>

                  <div className="mx-auto mt-5 flex min-h-[220px] w-full items-center justify-center rounded-2xl border border-dashed border-cyan-200 bg-[#F5FBFD] p-3">
                    {qrFetching ? (
                      <div className="flex h-[190px] w-[190px] items-center justify-center text-sm font-semibold text-slate-400">
                        Loading QR...
                      </div>
                    ) : (
                      <div className="rounded-xl bg-white p-2">
                        <QRCodeCanvas
                          value={qrTargetUrl}
                          size={190}
                          level="H"
                          includeMargin
                        />
                      </div>
                    )}
                  </div>

                  <div className="mt-5 flex items-center justify-center gap-2 text-[10px] font-bold uppercase tracking-[1.5px] text-cyan-700">
                    <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                    Ready to Scan
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    Share your profile with one simple scan.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FIXED MOBILE ACTION BAR */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-slate-200 bg-white/95 px-3 py-2 shadow-[0_-8px_30px_rgba(15,45,75,0.10)] backdrop-blur-xl sm:hidden">
        <div className="grid w-full grid-cols-4 gap-2">
          <button
            type="button"
            onClick={() => onContactClick("phone")}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-cyan-800"
          >
            <Phone size={18} />
            <span className="text-[9px] font-bold">Call</span>
          </button>

          <button
            type="button"
            onClick={() => onContactClick("whatsapp")}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-emerald-600"
          >
            <FaWhatsapp size={18} />
            <span className="text-[9px] font-bold">WhatsApp</span>
          </button>

          <button
            type="button"
            onClick={onShare}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-cyan-800"
          >
            <Share2 size={18} />
            <span className="text-[9px] font-bold">Share</span>
          </button>

          <button
            type="button"
            onClick={onOpenQr}
            className="flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 text-cyan-800"
          >
            <ScanLine size={18} />
            <span className="text-[9px] font-bold">My QR</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreativePortfolio;
