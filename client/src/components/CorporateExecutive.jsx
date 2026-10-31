import React from "react";
import { QRCodeCanvas } from "qrcode.react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";

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
} from "react-icons/fa6";

const CorporateExecutive = ({
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
  } = businessInfo;

  const GOLD = "#FFB703";
  const DARK = "#172B3A";

  const displayName = name || businessName || "Your Name";
  const displayRole = role || industry || "Business Professional";

  const getSocialIcon = (platform) => {
    const value = String(platform || "").toLowerCase();

    if (value.includes("facebook")) return <FaFacebookF />;
    if (value.includes("instagram")) return <FaInstagram />;
    if (value.includes("linkedin")) return <FaLinkedinIn />;
    if (value.includes("twitter") || value.includes("x.com"))
      return <FaXTwitter />;
    if (value.includes("youtube")) return <FaYoutube />;

    return <FaGlobe />;
  };

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || image.imageUrl || image.src || "";
  };

  const heroImage = getImageUrl(banner);
  const profileImage = getImageUrl(avatar || logo);

  const handleContact = (type) => onContactClick(type);

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
    <main className="min-h-screen w-full overflow-hidden bg-[#F7F8FA] text-[#172B3A]">
      {/* =====================================================
          HERO / COVER
      ===================================================== */}
      <section className="relative w-full">
        <div className="relative min-h-[430px] overflow-hidden bg-[#172B3A] sm:min-h-[500px] lg:min-h-[570px]">
          {heroImage ? (
            <>
              <img
                src={heroImage}
                alt=""
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#101F2B]/95 via-[#172B3A]/80 to-[#172B3A]/45" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#172B3A]/80 via-transparent to-[#172B3A]/20" />
            </>
          ) : (
            <>
              <div className="absolute inset-0 bg-gradient-to-br from-[#172B3A] via-[#203C4D] to-[#101F2B]" />
              <div className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-[#FFB703]/15 blur-3xl" />
              <div className="absolute -bottom-40 left-1/3 h-96 w-96 rounded-full bg-[#FFB703]/10 blur-3xl" />
            </>
          )}

          {/* Share and QR buttons */}
          <div className="absolute right-4 top-4 z-20 flex gap-2 sm:right-8 sm:top-7">
            <button
              type="button"
              onClick={onShare}
              title="Share Profile"
              aria-label="Share Profile"
              className="flex h-10 items-center gap-2 rounded-full border border-white/30 bg-white/15 px-4 text-xs font-bold text-white shadow-lg backdrop-blur-lg transition hover:border-[#FFB703] hover:bg-[#FFB703] hover:text-[#172B3A] sm:h-11 sm:px-5"
            >
              <FaShareNodes />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onOpenQr}
              title="QR Code"
              aria-label="Open QR Code"
              className="flex h-10 items-center gap-2 rounded-full bg-[#FFB703] px-4 text-xs font-extrabold text-[#172B3A] shadow-lg transition hover:-translate-y-0.5 hover:bg-[#EFA900] sm:h-11 sm:px-5"
            >
              <FaQrcode />
              <span>Scan</span>
            </button>
          </div>

          {/* Hero content */}
          <div className="relative z-10 mx-auto flex min-h-[430px] w-full max-w-[1500px] flex-col justify-center px-5 pb-16 pt-24 sm:min-h-[500px] sm:px-10 sm:pb-20 lg:min-h-[570px] lg:px-16">
            <div className="max-w-3xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#FFB703]/40 bg-[#FFB703]/10 px-4 py-2 text-[10px] font-extrabold uppercase tracking-[0.2em] text-[#FFD36B] sm:text-xs">
                <span className="h-2 w-2 rounded-full bg-[#FFB703] shadow-[0_0_10px_#FFB703]" />
                Professional Profile
              </div>

              <h1 className="max-w-3xl break-words text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
                {displayName}
              </h1>

              <p className="mt-4 text-base font-bold text-[#FFB703] sm:text-xl">
                {displayRole}
              </p>

              {location && (
                <div className="mt-4 flex items-center gap-2 text-sm text-white/75">
                  <FaLocationDot className="text-[#FFB703]" />
                  <span>{location}</span>
                </div>
              )}

              {about && (
                <p className="mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base sm:leading-8">
                  {about}
                </p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {phone && (
                  <button
                    type="button"
                    onClick={() => handleContact("phone")}
                    className={primaryButton}
                  >
                    <FaPhone />
                    Call Now
                  </button>
                )}

                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleContact("whatsapp")}
                    className={secondaryButton}
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Profile identity card */}
        <div className="relative z-20 mx-auto -mt-14 w-[calc(100%-32px)] max-w-[1100px] sm:-mt-16 sm:w-[calc(100%-64px)]">
          <div className="flex flex-col items-center gap-4 rounded-3xl border border-slate-100 bg-white p-5 text-center shadow-[0_15px_45px_rgba(23,43,58,0.12)] sm:flex-row sm:gap-6 sm:p-7 sm:text-left">
            <div className="relative shrink-0">
              <div className="h-24 w-24 overflow-hidden rounded-2xl border-4 border-white bg-[#FFF4D6] shadow-lg sm:h-28 sm:w-28">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-4xl font-black text-[#172B3A]">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {isVerified && (
                <span className="absolute -bottom-2 -right-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#FFB703] text-xs text-[#172B3A]">
                  <FaCheck />
                </span>
              )}
            </div>

            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <h2 className="text-xl font-black text-[#172B3A] sm:text-2xl">
                  {displayName}
                </h2>
                {isVerified && (
                  <span className="rounded-full bg-[#FFF3D1] px-3 py-1 text-[10px] font-extrabold text-[#A66B00]">
                    VERIFIED
                  </span>
                )}
              </div>

              <p className="mt-1 text-sm font-semibold text-slate-500">
                {displayRole}
              </p>

              {(businessName || industry) && (
                <p className="mt-2 text-xs font-medium text-slate-400">
                  {[businessName, industry].filter(Boolean).join(" · ")}
                </p>
              )}
            </div>

            {website && (
              <button
                type="button"
                onClick={() => handleContact("website")}
                className={`${primaryButton} shrink-0`}
              >
                Visit Website
                <FaArrowUpRightFromSquare className="text-xs" />
              </button>
            )}
          </div>
        </div>
      </section>

      {/* =====================================================
          QUICK CONTACT
      ===================================================== */}
      <section className="mx-auto w-full max-w-[1500px] px-4 py-12 sm:px-8 lg:px-16 lg:py-16">
        <div className="mb-7 text-center">
          <p className={sectionLabel}>Stay Connected</p>
          <h2 className={sectionHeading}>Quick Contact</h2>
          <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#FFB703]" />
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {phone && (
            <button
              type="button"
              onClick={() => handleContact("phone")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:shadow-lg`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D1] text-lg text-[#B77A00] transition group-hover:bg-[#FFB703] group-hover:text-[#172B3A]">
                <FaPhone />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Phone
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#172B3A]">
                {phone}
              </p>
            </button>
          )}

          {email && (
            <button
              type="button"
              onClick={() => handleContact("email")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:shadow-lg`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D1] text-lg text-[#B77A00] transition group-hover:bg-[#FFB703] group-hover:text-[#172B3A]">
                <FaEnvelope />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#172B3A]">
                {email}
              </p>
            </button>
          )}

          {website && (
            <button
              type="button"
              onClick={() => handleContact("website")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:shadow-lg`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D1] text-lg text-[#B77A00] transition group-hover:bg-[#FFB703] group-hover:text-[#172B3A]">
                <FaGlobe />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Website
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#172B3A]">
                {website}
              </p>
            </button>
          )}

          {(address || location) && (
            <button
              type="button"
              onClick={() => handleContact("address")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:shadow-lg`}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFF3D1] text-lg text-[#B77A00] transition group-hover:bg-[#FFB703] group-hover:text-[#172B3A]">
                <FaLocationDot />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.18em] text-slate-400">
                Location
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-[#172B3A]">
                {address || location}
              </p>
            </button>
          )}
        </div>
      </section>

      {/* =====================================================
          CONFIGURED CONTACT BUTTONS
      ===================================================== */}
      {visibleButtons.length > 0 && (
        <section className="w-full px-4 pb-12 sm:px-8 lg:px-16">
          <div className="mx-auto w-full max-w-[1350px] rounded-3xl bg-white p-5 shadow-[0_8px_30px_rgba(23,43,58,0.06)] sm:p-8">
            <div className="mb-6 text-center sm:text-left">
              <p className={sectionLabel}>Quick Actions</p>
              <h2 className="mt-2 text-2xl font-black text-[#172B3A] sm:text-3xl">
                Connect With Me
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleButtons.map((button, index) => (
                <button
                  key={button._id || button.id || index}
                  type="button"
                  onClick={() => onConfiguredButton(button)}
                  className="group flex min-h-14 items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-5 py-4 text-left transition hover:border-[#FFB703] hover:bg-[#FFFBF0]"
                >
                  <span className="text-sm font-bold text-[#172B3A]">
                    {button.label || "Contact"}
                  </span>
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFF3D1] text-xs text-[#A66B00] transition group-hover:bg-[#FFB703] group-hover:text-[#172B3A]">
                    <FaArrowUpRightFromSquare />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          ABOUT
      ===================================================== */}
      {about && (
        <section className="w-full bg-white py-14 sm:py-20">
          <div className="mx-auto grid w-full max-w-[1400px] items-center gap-9 px-4 sm:px-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16 lg:px-16">
            <div>
              <p className={sectionLabel}>Who We Are</p>
              <h2 className={sectionHeading}>
                About
                <span className="text-[#D99500]">
                  {" "}
                  {businessName || "Us"}
                </span>
              </h2>
              <div className="mt-5 h-1 w-16 rounded-full bg-[#FFB703]" />

              <p className="mt-6 text-sm leading-8 text-slate-500">
                {about}
              </p>

              {industry && (
                <div className="mt-6 inline-flex items-center gap-2 rounded-full bg-[#FFF3D1] px-4 py-2 text-xs font-bold text-[#9B6800]">
                  <span className="h-2 w-2 rounded-full bg-[#FFB703]" />
                  {industry}
                </div>
              )}
            </div>

            <div className="relative">
              <div className="absolute -left-3 -top-3 h-24 w-24 rounded-3xl border-2 border-[#FFB703]/60 sm:-left-5 sm:-top-5" />
              <div className="relative grid grid-cols-2 gap-3 sm:gap-4">
                <div className="flex min-h-40 items-center justify-center rounded-3xl bg-gradient-to-br from-[#FFF3D1] to-[#FFE4A0] p-5 sm:min-h-56">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#FFB703] text-2xl text-[#172B3A]">
                      <FaCheck />
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-[#172B3A]">
                      Professional
                    </p>
                    <p className="mt-1 text-xs text-slate-600">
                      Quality & Trust
                    </p>
                  </div>
                </div>

                <div className="flex min-h-40 items-center justify-center rounded-3xl bg-[#172B3A] p-5 sm:min-h-56">
                  <div className="text-center">
                    <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-2xl text-[#FFB703]">
                      <FaGlobe />
                    </div>
                    <p className="mt-4 text-sm font-extrabold text-white">
                      Our Business
                    </p>
                    <p className="mt-1 text-xs text-white/60">
                      {industry || displayRole}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          BUSINESS HOURS
      ===================================================== */}
      {businessHours && (
        <section className="w-full px-4 py-12 sm:px-8 lg:px-16">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 rounded-3xl bg-[#172B3A] p-6 text-white shadow-xl sm:flex-row sm:items-center sm:p-9">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#FFB703] text-xl text-[#172B3A]">
              <FaClock />
            </div>
            <div className="min-w-0">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-[#FFB703]">
                Business Hours
              </p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-white/80">
                {businessHours}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          SOCIAL LINKS
      ===================================================== */}
      {socialLinks.length > 0 && (
        <section className="w-full bg-white px-4 py-14 sm:px-8 lg:px-16 lg:py-16">
          <div className="mx-auto w-full max-w-[1200px] text-center">
            <p className={sectionLabel}>Stay In Touch</p>
            <h2 className={sectionHeading}>Follow & Connect</h2>
            <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#FFB703]" />

            <div className="mt-8 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social._id || social.id || index}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-white text-lg text-[#172B3A] shadow-sm transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:bg-[#FFB703]"
                  title={social.platform || "Social"}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRODUCTS - AUTO SLIDE SINGLE ROW
      ===================================================== */}
      {productList.length > 0 && (
        <section className="w-full overflow-hidden px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
          <div className="mx-auto w-full max-w-[1500px]">
            <div className="mb-8 text-center sm:text-left">
              <p className={sectionLabel}>What We Offer</p>
              <h2 className={sectionHeading}>Featured Products</h2>
              <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#FFB703] sm:mx-0" />
            </div>

            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={20}
              loop={productList.length > 1}
              speed={800}
              autoplay={{
                delay: 2500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="!overflow-visible"
            >
              {productList.map((product, index) => {
                const image = getImageUrl(
                  product?.images?.[0] || product?.image
                );

                return (
                  <SwiperSlide
                    key={product._id || product.id || index}
                    className="!h-auto !w-[82%] sm:!w-[46%] lg:!w-[31%] xl:!w-[24%]"
                  >
                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="group h-full w-full overflow-hidden rounded-3xl border border-slate-200 bg-white text-left shadow-[0_8px_25px_rgba(23,43,58,0.05)] transition duration-300 hover:-translate-y-1 hover:border-[#FFB703] hover:shadow-xl"
                    >
                      <div className="relative h-56 overflow-hidden bg-[#F1F3F5] sm:h-64">
                        {image ? (
                          <img
                            src={image}
                            alt={product.name || "Product"}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm font-semibold text-slate-400">
                            No Image
                          </div>
                        )}

                        <span className="absolute bottom-3 right-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB703] text-sm text-[#172B3A] shadow-lg">
                          <FaArrowUpRightFromSquare />
                        </span>
                      </div>

                      <div className="p-5">
                        <div className="flex items-start justify-between gap-3">
                          <h3 className="font-extrabold text-[#172B3A]">
                            {product.name || "Product"}
                          </h3>

                          {product.price !== undefined &&
                            product.price !== null &&
                            product.price !== "" && (
                              <span className="whitespace-nowrap text-sm font-black text-[#B77A00]">
                                ₹{product.price}
                              </span>
                            )}
                        </div>

                        {product.description && (
                          <p className="mt-2 line-clamp-2 text-sm leading-6 text-slate-500">
                            {product.description}
                          </p>
                        )}
                      </div>
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* =====================================================
          GALLERY - AUTO SLIDE SINGLE ROW
      ===================================================== */}
      {galleryImages.length > 0 && (
        <section className="w-full overflow-hidden bg-white py-14 sm:py-20">
          <div className="mx-auto w-full max-w-[1500px] px-4 sm:px-8 lg:px-16">
            <div className="mb-8 text-center sm:text-left">
              <p className={sectionLabel}>Our Portfolio</p>
              <h2 className={sectionHeading}>Our Work Gallery</h2>
              <div className="mx-auto mt-4 h-1 w-14 rounded-full bg-[#FFB703] sm:mx-0" />
            </div>

            <Swiper
              modules={[Autoplay]}
              slidesPerView="auto"
              spaceBetween={16}
              loop={galleryImages.length > 1}
              speed={800}
              autoplay={{
                delay: 2200,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="!overflow-visible"
            >
              {galleryImages.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <SwiperSlide
                    key={image._id || image.id || index}
                    className="!w-[78%] sm:!w-[42%] lg:!w-[30%] xl:!w-[23%]"
                  >
                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="group relative block h-56 w-full overflow-hidden rounded-2xl bg-slate-100 shadow-md sm:h-64 lg:h-72"
                    >
                      {imageUrl && (
                        <img
                          src={imageUrl}
                          alt={image.alt || "Gallery"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-[#172B3A]/45 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />

                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#FFB703] text-sm text-[#172B3A] opacity-0 shadow-lg transition group-hover:opacity-100">
                        <FaArrowUpRightFromSquare />
                      </span>
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            <p className="mt-4 text-center text-xs font-medium text-slate-400 sm:text-left">
              Swipe or scroll to explore more
            </p>
          </div>
        </section>
      )}

      {/* =====================================================
          INQUIRY FORM
      ===================================================== */}
      <section className="w-full px-4 py-14 sm:px-8 lg:px-16 lg:py-20">
        <div className="mx-auto grid w-full max-w-[1400px] items-start gap-8 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div className="lg:sticky lg:top-10">
            <p className={sectionLabel}>Get In Touch</p>
            <h2 className={sectionHeading}>Send an Inquiry</h2>
            <div className="mt-4 h-1 w-14 rounded-full bg-[#FFB703]" />

            <p className="mt-5 text-sm leading-8 text-slate-500">
              Have a question or want to discuss a business opportunity? Send
              a message and get in touch.
            </p>

            <div className="mt-8 rounded-3xl bg-[#172B3A] p-6 text-white">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FFB703] text-lg text-[#172B3A]">
                <FaEnvelope />
              </div>
              <h3 className="mt-4 text-lg font-extrabold">
                Let's Talk Business
              </h3>
              <p className="mt-2 text-sm leading-6 text-white/65">
                Send your details and message. We'll be happy to connect with
                you.
              </p>
            </div>
          </div>

          <form
            onSubmit={onFormSubmit}
            className={`${cardClass} p-5 sm:p-8 lg:p-10`}
          >
            {formSubmitted ? (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFF3D1] text-2xl text-[#A66B00]">
                  <FaCheck />
                </div>

                <h3 className="mt-5 text-xl font-black text-[#172B3A]">
                  Message Sent
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Thank you. Your inquiry has been submitted successfully.
                </p>
              </div>
            ) : (
              <>
                {inquirySubmitError && (
                  <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                    {inquirySubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Name
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          name: e.target.value,
                        }))
                      }
                      placeholder="Your name"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          phone: e.target.value,
                        }))
                      }
                      placeholder="Phone number"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Email
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
                      placeholder="Email address"
                      className={inputClass}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-2 block text-[11px] font-extrabold uppercase tracking-wider text-slate-500">
                      Message
                    </label>
                    <textarea
                      rows={5}
                      value={formData.message}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          message: e.target.value,
                        }))
                      }
                      placeholder="Write your message..."
                      className={`${inputClass} resize-none`}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className={`${primaryButton} mt-6 w-full disabled:cursor-not-allowed disabled:opacity-60`}
                >
                  {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                  {!inquirySubmitting && <FaArrowUpRightFromSquare />}
                </button>
              </>
            )}
          </form>
        </div>
      </section>

      {/* =====================================================
          QR CODE SECTION - BOTTOM
      ===================================================== */}
      <section className="w-full px-4 pb-14 sm:px-8 lg:px-16">
        <div className="relative mx-auto w-full max-w-[1400px] overflow-hidden rounded-[28px] bg-[#172B3A] shadow-xl">
          <div className="absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#FFB703]/15 blur-3xl" />
          <div className="absolute -bottom-28 left-1/4 h-64 w-64 rounded-full bg-[#FFB703]/10 blur-3xl" />

          <div className="relative grid items-center gap-8 p-6 sm:p-10 lg:grid-cols-[1fr_auto] lg:p-14">
            <div className="text-center lg:text-left">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.22em] text-[#FFB703]">
                Digital Business Card
              </p>

              <h2 className="mt-3 text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                Share My Profile
              </h2>

              <p className="mx-auto mt-4 max-w-xl text-sm leading-7 text-white/65 lg:mx-0 sm:text-base">
                Scan the QR code to instantly open this digital profile and
                connect with the business.
              </p>

              <button
                type="button"
                onClick={onOpenQr}
                className={`${primaryButton} mt-7`}
              >
                <FaQrcode />
                Open QR Code
              </button>
            </div>

            <div className="flex justify-center">
              <div className="rounded-3xl bg-white p-4 shadow-[0_15px_45px_rgba(0,0,0,0.25)] sm:p-5">
                {qrFetching ? (
                  <div className="flex h-40 w-40 items-center justify-center text-xs font-semibold text-slate-400 sm:h-48 sm:w-48">
                    Loading...
                  </div>
                ) : qrTargetUrl ? (
                  <QRCodeCanvas
                    value={qrTargetUrl}
                    size={192}
                    includeMargin
                    level="H"
                  />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center text-center text-xs font-semibold text-slate-400 sm:h-48 sm:w-48">
                    QR unavailable
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ===================================================== */}
      <footer className="w-full border-t border-slate-200 bg-white">
        <div className="mx-auto flex w-full max-w-[1500px] flex-col items-center justify-between gap-3 px-5 py-7 text-center sm:flex-row sm:px-8 sm:text-left lg:px-16">
          <div>
            <p className="font-extrabold text-[#172B3A]">{displayName}</p>
            <p className="mt-1 text-xs text-slate-400">
              {businessName || industry || "Digital Business Profile"}
            </p>
          </div>

          <p className="text-xs text-slate-400">
            Powered by Digital Business Card
          </p>
        </div>
      </footer>
    </main>
  );
};

export default CorporateExecutive;