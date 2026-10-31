
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";

import {
  FaArrowRight,
  FaArrowUpRightFromSquare,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLinkedinIn,
  FaLocationDot,
  FaPhone,
  FaQrcode,
  FaShareNodes,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

const FreelancerPro = ({
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
    role = "Creative Professional",
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

  const displayName = name || businessName || "Your Name";
  const displayRole = role || industry || "Creative Professional";

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || image.imageUrl || image.src || "";
  };

  const getProductImage = (product) => {
    if (!product) return "";

    if (product.images?.length) {
      return getImageUrl(product.images[0]);
    }

    return getImageUrl(product.image);
  };

  const getSocialIcon = (platform) => {
    const value = String(platform || "").toLowerCase();

    if (value.includes("instagram")) return <FaInstagram />;
    if (value.includes("facebook")) return <FaFacebookF />;
    if (value.includes("linkedin")) return <FaLinkedinIn />;
    if (value.includes("youtube")) return <FaYoutube />;
    if (value.includes("twitter") || value.includes("x.com")) {
      return <FaXTwitter />;
    }

    return <FaGlobe />;
  };

  const profileImage = getImageUrl(avatar || logo);
  const heroImage = getImageUrl(banner);

  const handleContact = (type) => {
    onContactClick(type);
  };

  const cardClass =
    "rounded-2xl border border-[#dcecf6] bg-[#fafdff] shadow-[0_8px_30px_rgba(39,112,155,0.05)]";

  const sectionEyebrow =
    "text-xs font-extrabold uppercase tracking-[0.2em] text-[#1687bd]";

  const arrowClass =
    "flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e2f3fc] text-[#1687bd] transition group-hover:bg-[#1687bd] group-hover:text-white";

  const inputClass =
    "w-full rounded-xl border border-[#d6e8f3] bg-[#fafdff] px-4 py-3.5 text-sm text-[#172b3a] outline-none transition placeholder:text-[#91a8b8] focus:border-[#1687bd] focus:bg-white focus:ring-4 focus:ring-[#1687bd]/10";

  const swiperAutoplay = {
    delay: 2500,
    disableOnInteraction: false,
    pauseOnMouseEnter: true,
  };

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f1f8fc] text-[#172b3a]">

      {/* HERO */}
      <section className="relative w-full overflow-hidden bg-gradient-to-br from-[#e5f4fc] via-[#f4faff] to-[#eaf6fd]">
        <div className="pointer-events-none absolute -left-28 -top-28 h-80 w-80 rounded-full bg-[#b9e4f8]/50 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 right-0 h-96 w-96 rounded-full bg-[#c8eafa]/60 blur-3xl" />

        <div className="relative mx-auto w-full max-w-[1500px] px-5 py-14 sm:px-8 sm:py-20 lg:px-12 lg:py-24">

          {/* SHARE AND QR ACTIONS */}
          <div className="absolute right-5 top-5 z-20 flex items-center gap-2 sm:right-8 sm:top-8 lg:right-12">
            <button
              type="button"
              onClick={onShare}
              aria-label="Share profile"
              title="Share Profile"
              className="flex h-11 items-center gap-2 rounded-full border border-[#c9e3f2] bg-white/90 px-4 text-sm font-bold text-[#187eae] shadow-lg shadow-[#3d8eb5]/10 backdrop-blur-xl transition hover:-translate-y-0.5 hover:bg-[#1687bd] hover:text-white"
            >
              <FaShareNodes />
              <span>Share</span>
            </button>

            <button
              type="button"
              onClick={onOpenQr}
              aria-label="Open QR scanner"
              title="QR Scanner"
              className="flex h-11 items-center gap-2 rounded-full bg-[#1687bd] px-4 text-sm font-bold text-white shadow-lg shadow-[#1687bd]/20 transition hover:-translate-y-0.5 hover:bg-[#116d9b]"
            >
              <FaQrcode />
              <span>Scan</span>
            </button>
          </div>

          <div className="grid items-center gap-12 pt-12 lg:grid-cols-[1.1fr_0.9fr] lg:gap-16 lg:pt-0">

            {/* LEFT CONTENT */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#cce8f7] bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.15em] text-[#1687bd] shadow-sm">
                <span className="h-2 w-2 rounded-full bg-[#1687bd]" />
                Available for Work
              </div>

              <div className="mt-7 flex items-center gap-2">
                {isVerified && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1687bd] text-xs text-white">
                    <FaCheck />
                  </span>
                )}

                {industry && (
                  <span className="text-xs font-bold uppercase tracking-wider text-[#6b91a8]">
                    {industry}
                  </span>
                )}
              </div>

              <h1 className="mt-3 max-w-3xl text-5xl font-black leading-[1.05] tracking-tight text-[#17364a] sm:text-6xl lg:text-7xl">
                Hi, I'm{" "}
                <span className="text-[#1687bd]">{displayName}</span>
              </h1>

              <p className="mt-5 text-xl font-bold text-[#54758a] sm:text-2xl">
                {displayRole}
              </p>

              {about && (
                <p className="mt-6 max-w-2xl text-sm leading-8 text-[#648195] sm:text-base">
                  {about}
                </p>
              )}

              {location && (
                <div className="mt-5 flex items-center gap-2 text-sm font-semibold text-[#648195]">
                  <FaLocationDot className="text-[#1687bd]" />
                  {location}
                </div>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {phone && (
                  <button
                    type="button"
                    onClick={() => handleContact("phone")}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#1687bd] px-6 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1687bd]/20 transition hover:-translate-y-1 hover:bg-[#116d9b]"
                  >
                    <FaPhone />
                    Let's Talk
                    <FaArrowRight className="ml-1 text-xs" />
                  </button>
                )}

                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleContact("whatsapp")}
                    className="inline-flex items-center gap-2 rounded-xl border border-[#c9e3f2] bg-white px-6 py-3.5 text-sm font-bold text-[#247da6] shadow-sm transition hover:-translate-y-1 hover:border-[#1687bd] hover:bg-[#e8f6fd]"
                  >
                    <FaWhatsapp className="text-[#1687bd]" />
                    WhatsApp
                  </button>
                )}
              </div>

              <div className="mt-10 flex flex-wrap items-center gap-x-7 gap-y-3 border-t border-[#d7eaf5] pt-6">
                {email && (
                  <button
                    type="button"
                    onClick={() => handleContact("email")}
                    className="flex items-center gap-2 text-sm font-semibold text-[#648195] transition hover:text-[#1687bd]"
                  >
                    <FaEnvelope className="text-[#1687bd]" />
                    Email Me
                  </button>
                )}

                {website && (
                  <button
                    type="button"
                    onClick={() => handleContact("website")}
                    className="flex items-center gap-2 text-sm font-semibold text-[#648195] transition hover:text-[#1687bd]"
                  >
                    <FaGlobe className="text-[#1687bd]" />
                    Visit Website
                  </button>
                )}
              </div>
            </div>

            {/* RIGHT IMAGE */}
            <div className="relative mx-auto w-full max-w-[560px]">
              <div className="absolute -inset-5 rounded-[2.5rem] bg-gradient-to-br from-[#b9e4f8]/70 to-[#d9effb]/70 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/90 bg-white p-3 shadow-[0_25px_70px_rgba(37,105,145,0.16)]">
                {heroImage ? (
                  <img
                    src={heroImage}
                    alt={displayName}
                    className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[430px]"
                  />
                ) : profileImage ? (
                  <img
                    src={profileImage}
                    alt={displayName}
                    className="h-[360px] w-full rounded-[1.5rem] object-cover sm:h-[430px]"
                  />
                ) : (
                  <div className="flex h-[360px] items-center justify-center rounded-[1.5rem] bg-gradient-to-br from-[#d9f0fc] to-[#b9e2f5] sm:h-[430px]">
                    <span className="text-[180px] font-black text-[#1687bd]/15">
                      {displayName.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}

                <div className="absolute bottom-8 left-8 right-8 rounded-2xl border border-white/40 bg-[#123c55]/75 p-5 text-white shadow-xl backdrop-blur-xl">
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/65">
                    Professional
                  </p>
                  <p className="mt-1 text-lg font-bold">{displayRole}</p>
                  {location && (
                    <p className="mt-1 flex items-center gap-2 text-xs text-white/75">
                      <FaLocationDot />
                      {location}
                    </p>
                  )}
                </div>
              </div>

              <div className="absolute -bottom-5 -right-3 hidden h-20 w-20 items-center justify-center rounded-2xl border border-white bg-white text-3xl text-[#1687bd] shadow-xl sm:flex">
                <FaCheck />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT CARDS */}
      <section className="mx-auto w-full max-w-[1500px] px-5 py-10 sm:px-8 lg:px-12">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phone && (
            <button
              type="button"
              onClick={() => handleContact("phone")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#a9d8ef] hover:shadow-xl`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f3fc] text-[#1687bd] transition group-hover:bg-[#1687bd] group-hover:text-white">
                <FaPhone />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8ba5b5]">
                Phone
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#23465c]">
                {phone}
              </p>
              <div className="mt-4 flex justify-end">
                <span className={arrowClass}><FaArrowRight /></span>
              </div>
            </button>
          )}

          {email && (
            <button
              type="button"
              onClick={() => handleContact("email")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#a9d8ef] hover:shadow-xl`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f3fc] text-[#1687bd] transition group-hover:bg-[#1687bd] group-hover:text-white">
                <FaEnvelope />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8ba5b5]">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#23465c]">
                {email}
              </p>
              <div className="mt-4 flex justify-end">
                <span className={arrowClass}><FaArrowRight /></span>
              </div>
            </button>
          )}

          {website && (
            <button
              type="button"
              onClick={() => handleContact("website")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#a9d8ef] hover:shadow-xl`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f3fc] text-[#1687bd] transition group-hover:bg-[#1687bd] group-hover:text-white">
                <FaGlobe />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8ba5b5]">
                Website
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#23465c]">
                {website}
              </p>
              <div className="mt-4 flex justify-end">
                <span className={arrowClass}><FaArrowRight /></span>
              </div>
            </button>
          )}

          {(address || location) && (
            <button
              type="button"
              onClick={() => handleContact("address")}
              className={`${cardClass} group p-5 text-left transition duration-300 hover:-translate-y-1 hover:border-[#a9d8ef] hover:shadow-xl`}
            >
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e3f3fc] text-[#1687bd] transition group-hover:bg-[#1687bd] group-hover:text-white">
                <FaLocationDot />
              </div>
              <p className="mt-4 text-[10px] font-extrabold uppercase tracking-[0.15em] text-[#8ba5b5]">
                Location
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-[#23465c]">
                {address || location}
              </p>
              <div className="mt-4 flex justify-end">
                <span className={arrowClass}><FaArrowRight /></span>
              </div>
            </button>
          )}
        </div>
      </section>

      {/* QUICK LINKS */}
      {visibleButtons.length > 0 && (
        <section className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 lg:px-12">
          <div className="mb-7">
            <p className={sectionEyebrow}>Services & Links</p>
            <h2 className="mt-2 text-3xl font-black text-[#17364a] sm:text-4xl">
              What I Can Help With
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleButtons.map((button, index) => (
              <button
                key={button._id || button.id || index}
                type="button"
                onClick={() => onConfiguredButton(button)}
                className={`${cardClass} group flex items-center justify-between px-5 py-5 text-left transition hover:-translate-y-1 hover:border-[#a9d8ef] hover:shadow-lg`}
              >
                <span className="font-bold text-[#23465c]">
                  {button.label || "Service"}
                </span>
                <span className={arrowClass}>
                  <FaArrowRight />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {about && (
        <section className="w-full border-y border-[#dcecf6] bg-gradient-to-br from-[#e5f4fc] to-[#f5fbff]">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
            <div className="grid items-start gap-10 lg:grid-cols-[0.75fr_1.25fr] lg:gap-16">
              <div>
                <div className="inline-flex items-center gap-2 rounded-full border border-[#cce8f7] bg-white/80 px-4 py-2">
                  <span className="h-2 w-2 rounded-full bg-[#1687bd]" />
                  <p className={sectionEyebrow}>About Me</p>
                </div>

                <h2 className="mt-5 text-4xl font-black leading-tight text-[#17364a] sm:text-5xl">
                  Building meaningful work.
                </h2>

                <p className="mt-4 max-w-sm text-sm leading-7 text-[#668397]">
                  A little more about my background, passion and the work I do.
                </p>

                {industry && (
                  <div className="mt-7 inline-flex items-center gap-2 rounded-xl border border-[#cce8f7] bg-white px-4 py-3 text-sm font-bold text-[#1687bd] shadow-sm">
                    <FaCheck />
                    {industry}
                  </div>
                )}
              </div>

              <div className="relative">
                <div className="absolute -inset-3 rounded-[2rem] bg-[#c6e8f8]/60 blur-xl" />
                <div className="relative rounded-[2rem] border border-white bg-white/90 p-7 shadow-[0_15px_45px_rgba(39,112,155,0.08)] sm:p-10">
                  <span className="text-5xl font-black leading-none text-[#b9e1f4]">
                    “
                  </span>
                  <p className="mt-2 text-base leading-8 text-[#557488] sm:text-lg sm:leading-9">
                    {about}
                  </p>
                  <div className="mt-8 flex items-center gap-3 border-t border-[#e1eff7] pt-6">
                    {profileImage ? (
                      <img
                        src={profileImage}
                        alt={displayName}
                        className="h-12 w-12 rounded-full border-2 border-[#d9effa] object-cover"
                      />
                    ) : (
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#e3f3fc] font-black text-[#1687bd]">
                        {displayName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div>
                      <p className="font-extrabold text-[#23465c]">
                        {displayName}
                      </p>
                      <p className="mt-1 text-xs font-medium text-[#829eaf]">
                        {displayRole}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =====================================================
          PRODUCTS - SINGLE LINE AUTO SLIDER
      ===================================================== */}
      {productList.length > 0 && (
        <section className="mx-auto w-full max-w-[1500px] overflow-hidden px-5 py-16 sm:px-8 lg:px-12">
          <div className="mb-8 flex items-end justify-between gap-5">
            <div>
              <p className={sectionEyebrow}>My Work</p>
              <h2 className="mt-2 text-3xl font-black text-[#17364a] sm:text-4xl">
                Featured Work
              </h2>
            </div>
            <p className="hidden text-sm font-semibold text-[#8ba5b5] sm:block">
              {productList.length} Items
            </p>
          </div>

          <Swiper
            modules={[Autoplay, Navigation]}
            navigation
            loop={productList.length > 3}
            autoplay={productList.length > 1 ? swiperAutoplay : false}
            spaceBetween={20}
            slidesPerView={1.15}
            breakpoints={{
              480: { slidesPerView: 1.5 },
              640: { slidesPerView: 2 },
              1024: { slidesPerView: 3 },
            }}
            className="freelancer-swiper !pb-12"
          >
            {productList.map((product, index) => {
              const image = getProductImage(product);

              return (
                <SwiperSlide key={product._id || product.id || index}>
                  <button
                    type="button"
                    onClick={() => onProductClick(product)}
                    className="group h-full w-full overflow-hidden rounded-3xl border border-[#dcecf6] bg-[#fafdff] text-left shadow-[0_8px_30px_rgba(39,112,155,0.05)] transition duration-300 hover:-translate-y-2 hover:border-[#a9d8ef] hover:shadow-xl"
                  >
                    <div className="relative h-64 overflow-hidden bg-[#e4f2f9]">
                      {image ? (
                        <img
                          src={image}
                          alt={product.name || "Work"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm font-medium text-[#8ba5b5]">
                          No Image
                        </div>
                      )}

                      <div className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1687bd] shadow-lg transition group-hover:bg-[#1687bd] group-hover:text-white">
                        <FaArrowUpRightFromSquare />
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-lg font-black text-[#23465c]">
                          {product.name || "Project"}
                        </h3>

                        {product.price !== undefined &&
                          product.price !== null &&
                          product.price !== "" && (
                            <span className="whitespace-nowrap font-black text-[#1687bd]">
                              ₹{product.price}
                            </span>
                          )}
                      </div>

                      {product.description && (
                        <p className="mt-3 line-clamp-2 text-sm leading-6 text-[#718da0]">
                          {product.description}
                        </p>
                      )}

                      <div className="mt-5 flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#1687bd]">
                        Explore Project
                        <FaArrowRight className="transition group-hover:translate-x-1" />
                      </div>
                    </div>
                  </button>
                </SwiperSlide>
              );
            })}
          </Swiper>
        </section>
      )}

      {/* =====================================================
          GALLERY - SINGLE LINE AUTO SLIDER
      ===================================================== */}
      {galleryImages.length > 0 && (
        <section className="w-full overflow-hidden border-y border-[#dcecf6] bg-[#eaf5fb]">
          <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
            <div className="mb-8">
              <p className={sectionEyebrow}>Portfolio</p>
              <h2 className="mt-2 text-3xl font-black text-[#17364a] sm:text-4xl">
                Selected Moments
              </h2>
            </div>

            <Swiper
              modules={[Autoplay, Navigation]}
              navigation
              loop={galleryImages.length > 4}
              autoplay={galleryImages.length > 1 ? {
                ...swiperAutoplay,
                delay: 2200,
              } : false}
              spaceBetween={16}
              slidesPerView={1.3}
              breakpoints={{
                480: { slidesPerView: 2 },
                640: { slidesPerView: 3 },
                1024: { slidesPerView: 4 },
              }}
              className="freelancer-swiper !pb-12"
            >
              {galleryImages.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <SwiperSlide key={image._id || image.id || index}>
                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="group relative block aspect-square w-full overflow-hidden rounded-2xl border border-white bg-[#dceef8] shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={image.alt || "Portfolio"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#7898ad]">
                          No Image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-[#1687bd]/0 transition group-hover:bg-[#1687bd]/20" />

                      <span className="absolute bottom-3 right-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#1687bd] opacity-0 shadow-lg transition group-hover:opacity-100">
                        <FaArrowUpRightFromSquare />
                      </span>
                    </button>
                  </SwiperSlide>
                );
              })}
            </Swiper>
          </div>
        </section>
      )}

      {/* SOCIAL LINKS */}
      {socialLinks.length > 0 && (
        <section className="mx-auto w-full max-w-[1500px] px-5 py-14 sm:px-8 lg:px-12">
          <div className="rounded-3xl border border-[#dcecf6] bg-[#fafdff] p-8 text-center shadow-[0_8px_30px_rgba(39,112,155,0.05)] sm:p-10">
            <p className={sectionEyebrow}>Social Presence</p>
            <h2 className="mt-2 text-3xl font-black text-[#17364a]">
              Find Me Online
            </h2>

            <p className="mt-3 text-sm text-[#7894a7]">
              Connect with me on social media.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social._id || social.id || index}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#d6e8f3] bg-[#edf7fc] text-[#1687bd] transition hover:-translate-y-1 hover:border-[#1687bd] hover:bg-[#1687bd] hover:text-white"
                  title={social.platform || "Social"}
                >
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BUSINESS HOURS */}
      {businessHours && (
        <section className="mx-auto w-full max-w-[1500px] px-5 pb-14 sm:px-8 lg:px-12">
          <div className="flex items-start gap-4 rounded-3xl border border-[#d6eaf6] bg-gradient-to-r from-[#e3f3fc] to-[#f5fbff] p-7">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white text-[#1687bd] shadow-sm">
              <FaClock />
            </div>

            <div>
              <p className={sectionEyebrow}>Working Hours</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-7 text-[#648195]">
                {businessHours}
              </p>
            </div>
          </div>
        </section>
      )}

      {/* QR */}
      <section className="mx-auto w-full max-w-[1500px] px-5 pb-16 sm:px-8 lg:px-12">
        <div className="relative grid items-center gap-8 overflow-hidden rounded-[2rem] border border-[#cce8f7] bg-gradient-to-br from-[#dff2fc] via-[#eaf7fd] to-[#d5edfa] p-8 shadow-[0_15px_50px_rgba(39,112,155,0.08)] sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">
          <div className="pointer-events-none absolute -right-20 -top-28 h-72 w-72 rounded-full bg-white/60 blur-3xl" />

          <div className="relative z-10">
            <p className={sectionEyebrow}>Digital Profile</p>

            <h2 className="mt-3 text-3xl font-black text-[#17364a] sm:text-4xl">
              Let's Connect
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#648195]">
              Scan the QR code or share this profile with someone who needs
              your services.
            </p>

            <button
              type="button"
              onClick={onOpenQr}
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-[#1687bd] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#1687bd]/20 transition hover:-translate-y-1 hover:bg-[#116d9b]"
            >
              <FaQrcode />
              Open QR
              <FaArrowRight className="ml-1 text-xs" />
            </button>
          </div>

          <div className="relative z-10 flex justify-center">
            <div className="rounded-3xl border border-white bg-white p-5 shadow-[0_15px_40px_rgba(37,105,145,0.14)]">
              {qrFetching ? (
                <div className="flex h-40 w-40 items-center justify-center text-xs font-semibold text-[#7898ad]">
                  Loading...
                </div>
              ) : qrTargetUrl ? (
                <QRCodeCanvas
                  value={qrTargetUrl}
                  size={160}
                  includeMargin
                />
              ) : (
                <div className="flex h-40 w-40 items-center justify-center text-center text-xs text-[#7898ad]">
                  QR unavailable
                </div>
              )}
              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-wider text-[#7898ad]">
                Scan to visit profile
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="w-full border-t border-[#dcecf6] bg-[#eaf5fb]">
        <div className="mx-auto w-full max-w-[1500px] px-5 py-16 sm:px-8 lg:px-12">
          <div className="grid gap-10 lg:grid-cols-[0.7fr_1.3fr]">
            <div>
              <p className={sectionEyebrow}>Contact Me</p>

              <h2 className="mt-3 text-4xl font-black leading-tight text-[#17364a]">
                Have a project in mind?
              </h2>

              <p className="mt-5 text-sm leading-8 text-[#718da0]">
                Tell me a little about what you need and I will get back to
                you as soon as possible.
              </p>

              <div className="mt-8 space-y-4">
                {phone && (
                  <button
                    type="button"
                    onClick={() => handleContact("phone")}
                    className="flex items-center gap-3 text-sm font-semibold text-[#54758a] transition hover:text-[#1687bd]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1687bd] shadow-sm">
                      <FaPhone />
                    </span>
                    {phone}
                  </button>
                )}

                {email && (
                  <button
                    type="button"
                    onClick={() => handleContact("email")}
                    className="flex items-center gap-3 text-sm font-semibold text-[#54758a] transition hover:text-[#1687bd]"
                  >
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#1687bd] shadow-sm">
                      <FaEnvelope />
                    </span>
                    {email}
                  </button>
                )}
              </div>
            </div>

            <form
              onSubmit={onFormSubmit}
              className="rounded-3xl border border-[#d6e8f3] bg-[#fafdff] p-6 shadow-[0_12px_40px_rgba(39,112,155,0.06)] sm:p-8"
            >
              {formSubmitted ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#e1f3fc] text-xl text-[#1687bd]">
                    <FaCheck />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#23465c]">
                    Thanks for reaching out!
                  </h3>

                  <p className="mt-2 text-sm text-[#7894a7]">
                    Your inquiry has been submitted successfully.
                  </p>
                </div>
              ) : (
                <>
                  {inquirySubmitError && (
                    <div className="mb-5 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
                      {inquirySubmitError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#668397]">
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
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#668397]">
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
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#668397]">
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
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wider text-[#668397]">
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
                        placeholder="Tell me about your project..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-[#1687bd] px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-[#1687bd]/15 transition hover:bg-[#116d9b] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {inquirySubmitting ? "Sending..." : "Send Message"}
                    {!inquirySubmitting && <FaArrowRight />}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* SWIPER ARROW STYLES */}
      <style>{`
        .freelancer-swiper {
          overflow: visible;
        }

        .freelancer-swiper .swiper-button-next,
        .freelancer-swiper .swiper-button-prev {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #1687bd;
          color: #ffffff;
          box-shadow: 0 5px 18px rgba(22, 135, 189, 0.2);
        }

        .freelancer-swiper .swiper-button-next::after,
        .freelancer-swiper .swiper-button-prev::after {
          font-size: 14px;
          font-weight: 900;
        }

        .freelancer-swiper .swiper-button-next:hover,
        .freelancer-swiper .swiper-button-prev:hover {
          background: #116d9b;
        }

        .freelancer-swiper .swiper-button-disabled {
          opacity: 0.35;
        }

        @media (max-width: 640px) {
          .freelancer-swiper .swiper-button-next,
          .freelancer-swiper .swiper-button-prev {
            width: 32px;
            height: 32px;
          }

          .freelancer-swiper .swiper-button-next::after,
          .freelancer-swiper .swiper-button-prev::after {
            font-size: 11px;
          }
        }
      `}</style>
    </div>
  );
};

export default FreelancerPro;
