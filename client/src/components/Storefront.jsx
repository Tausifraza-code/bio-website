import React from "react";
import { QRCodeCanvas } from "qrcode.react";

import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaLocationDot,
  FaShareNodes,
  FaQrcode,
  FaInstagram,
  FaFacebookF,
  FaLinkedinIn,
  FaYoutube,
  FaXTwitter,
  FaArrowRight,
  FaCartShopping,
  FaClock,
  FaCheck,
} from "react-icons/fa6";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, FreeMode } from "swiper/modules";

import "swiper/css";

const Storefront = ({
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
    name = "Your Business",
    role = "",
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

  const displayName = businessName || name || "Your Business";
  const displayRole = role || industry || "Quality Products & Services";

  const getImageUrl = (image) => {
    if (!image) return "";

    if (typeof image === "string") return image;

    return image.url || image.imageUrl || image.src || "";
  };

  const getProductImage = (product) => {
    if (!product) return "";

    if (product.images?.length > 0) {
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

  const profileImage = getImageUrl(logo || avatar);
  const heroImage = getImageUrl(banner);

  const handleContact = (type) => {
    onContactClick(type);
  };

  const sectionHeading =
    "mt-2 text-3xl font-black tracking-tight text-[#f4f0e7] sm:text-4xl";

  const sectionLabel =
    "text-[11px] font-bold uppercase tracking-[0.22em] text-[#d6a84f]";

  const cardClass =
    "rounded-2xl border border-[#45443f] bg-[#292925]";

  const inputClass =
    "w-full rounded-xl border border-[#45443f] bg-[#252521] px-4 py-3.5 text-sm text-[#f4f0e7] outline-none placeholder:text-[#858278] transition focus:border-[#d6a84f] focus:ring-2 focus:ring-[#d6a84f]/10";

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#242420] text-[#f4f0e7]">

      {/* =====================================================
          HERO / STORE COVER
      ===================================================== */}

      <section className="w-full px-3 pt-3 sm:px-5 sm:pt-5">
        <div className="relative isolate min-h-[430px] overflow-hidden rounded-[24px] bg-[#171714] sm:min-h-[480px] sm:rounded-[30px] lg:min-h-[540px]">

          {heroImage && (
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 -z-20 h-full w-full object-cover"
            />
          )}

          <div className="absolute inset-0 -z-10 bg-gradient-to-r from-[#171714]/95 via-[#171714]/85 to-[#171714]/35" />

          <div className="absolute inset-0 -z-10 bg-gradient-to-t from-[#171714]/70 via-transparent to-[#171714]/30" />

          {/* COVER ACTION BUTTONS */}

          <div className="absolute right-4 top-4 z-20 flex items-center gap-2 sm:right-6 sm:top-6">

            <button
              type="button"
              onClick={onShare}
              title="Share"
              aria-label="Share business profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-black/30 text-white shadow-lg backdrop-blur-md transition hover:border-[#d6a84f] hover:bg-[#d6a84f] hover:text-[#1d1d1b] sm:h-11 sm:w-11"
            >
              <FaShareNodes />
            </button>

            <button
              type="button"
              onClick={onOpenQr}
              title="QR Scanner"
              aria-label="Open QR scanner"
              className="flex h-10 items-center justify-center gap-2 rounded-xl border border-[#d6a84f]/60 bg-[#d6a84f] px-3 text-[#1d1d1b] shadow-lg transition hover:bg-[#f0c96e] sm:h-11 sm:px-4"
            >
              <FaQrcode />
              <span className="text-xs font-bold">Scan QR</span>
            </button>

          </div>

          <div className="relative flex min-h-[430px] items-end sm:min-h-[480px] lg:min-h-[540px]">

            <div className="w-full px-6 pb-9 pt-24 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">

              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-[#d6a84f]/30 bg-black/30 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#e8c477] backdrop-blur-md">
                <FaCartShopping />
                Official Store
              </div>

              <div className="flex flex-wrap items-center gap-2">

                <h1 className="max-w-3xl text-4xl font-black leading-[1.08] tracking-tight text-white sm:text-5xl lg:text-7xl">
                  {displayName}
                </h1>

                {isVerified && (
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#d6a84f] text-[11px] text-[#1d1d1b]">
                    <FaCheck />
                  </span>
                )}

              </div>

              <p className="mt-4 text-sm font-semibold tracking-wide text-[#d6a84f] sm:text-base">
                {industry || displayRole}
              </p>

              {location && (
                <div className="mt-3 flex items-center gap-2 text-xs text-white/65 sm:text-sm">
                  <FaLocationDot className="text-[#d6a84f]" />
                  {location}
                </div>
              )}

              <p className="mt-5 max-w-2xl text-sm leading-7 text-white/70 sm:text-base sm:leading-8">
                {about ||
                  "Discover our products, services and everything you need in one place."}
              </p>

              <div className="mt-7 flex flex-wrap gap-3">

                {phone && (
                  <button
                    type="button"
                    onClick={() => handleContact("phone")}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#d6a84f] px-5 py-3 text-xs font-bold text-[#1d1d1b] shadow-lg transition hover:bg-white sm:text-sm"
                  >
                    <FaPhone />
                    Call Store
                  </button>
                )}

                {whatsapp && (
                  <button
                    type="button"
                    onClick={() => handleContact("whatsapp")}
                    className="inline-flex items-center gap-2 rounded-xl border border-white/25 bg-white/10 px-5 py-3 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-[#1d1d1b] sm:text-sm"
                  >
                    <FaWhatsapp />
                    WhatsApp
                  </button>
                )}

              </div>

            </div>

            {profileImage && (
              <div className="absolute bottom-5 right-5 hidden h-24 w-24 overflow-hidden rounded-2xl border-2 border-white/30 bg-black/20 shadow-2xl backdrop-blur-sm xl:block">
                <img
                  src={profileImage}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* =====================================================
          CONTACT INFORMATION
      ===================================================== */}

      {(phone || email || website || address || location) && (
        <section className="w-full px-3 py-5 sm:px-5 sm:py-7">

          <div className="grid overflow-hidden rounded-2xl border border-[#45443f] bg-[#2b2b26] sm:grid-cols-2 lg:grid-cols-4">

            {phone && (
              <button
                type="button"
                onClick={() => handleContact("phone")}
                className="group border-b border-[#45443f] p-4 text-left transition hover:bg-[#34342e] sm:border-r lg:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-[#d6a84f] transition group-hover:bg-[#d6a84f] group-hover:text-[#1d1d1b]">
                    <FaPhone />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6a194]">
                      Call Us
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#f4f0e7]">
                      {phone}
                    </p>
                  </div>

                </div>
              </button>
            )}

            {email && (
              <button
                type="button"
                onClick={() => handleContact("email")}
                className="group border-b border-[#45443f] p-4 text-left transition hover:bg-[#34342e] lg:border-b-0 lg:border-r"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-[#d6a84f] transition group-hover:bg-[#d6a84f] group-hover:text-[#1d1d1b]">
                    <FaEnvelope />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6a194]">
                      Email Us
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#f4f0e7]">
                      {email}
                    </p>
                  </div>

                </div>
              </button>
            )}

            {website && (
              <button
                type="button"
                onClick={() => handleContact("website")}
                className="group border-b border-[#45443f] p-4 text-left transition hover:bg-[#34342e] sm:border-r lg:border-b-0"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-[#d6a84f] transition group-hover:bg-[#d6a84f] group-hover:text-[#1d1d1b]">
                    <FaGlobe />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6a194]">
                      Website
                    </p>
                    <p className="mt-1 truncate text-sm font-bold text-[#f4f0e7]">
                      {website}
                    </p>
                  </div>

                </div>
              </button>
            )}

            {(address || location) && (
              <button
                type="button"
                onClick={() => handleContact("address")}
                className="group p-4 text-left transition hover:bg-[#34342e]"
              >
                <div className="flex min-w-0 items-center gap-3">

                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-[#d6a84f] transition group-hover:bg-[#d6a84f] group-hover:text-[#1d1d1b]">
                    <FaLocationDot />
                  </span>

                  <div className="min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#a6a194]">
                      Location
                    </p>
                    <p className="mt-1 line-clamp-1 text-sm font-bold text-[#f4f0e7]">
                      {address || location}
                    </p>
                  </div>

                </div>
              </button>
            )}

          </div>
        </section>
      )}

      {/* =====================================================
          CONFIGURED BUTTONS
      ===================================================== */}

      {visibleButtons.length > 0 && (
        <section className="w-full px-3 pb-8 pt-5 sm:px-5 sm:pb-12">

          <div className="mb-5 flex items-end justify-between gap-4">

            <div>
              <p className={sectionLabel}>Quick Access</p>
              <h2 className={sectionHeading}>Explore Our Store</h2>
            </div>

            <span className="text-xs text-[#a6a194]">
              {visibleButtons.length} Links
            </span>

          </div>

          <div className="flex flex-wrap gap-3">

            {visibleButtons.map((button, index) => (
              <button
                key={button._id || button.id || index}
                type="button"
                onClick={() => onConfiguredButton(button)}
                className="group inline-flex items-center gap-3 rounded-xl border border-[#45443f] bg-[#2b2b26] px-5 py-3.5 text-left text-sm font-bold text-[#f4f0e7] transition hover:border-[#d6a84f] hover:bg-[#d6a84f] hover:text-[#1d1d1b]"
              >
                <span>{button.label || "Open"}</span>
                <FaArrowRight className="text-xs text-[#d6a84f] transition group-hover:translate-x-1 group-hover:text-[#1d1d1b]" />
              </button>
            ))}

          </div>
        </section>
      )}

      {/* =====================================================
          PRODUCTS - SINGLE ROW AUTO SLIDER
      ===================================================== */}

      {productList.length > 0 && (
        <section className="w-full overflow-hidden border-y border-[#45443f] bg-[#2b2b26]">

          <div className="w-full px-3 py-10 sm:px-5 sm:py-14">

            <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">

              <div>
                <p className={sectionLabel}>Our Collection</p>
                <h2 className={sectionHeading}>Featured Products</h2>
                <p className="mt-2 text-xs text-[#a6a194] sm:text-sm">
                  Explore our latest products and collections.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-[#45443f] bg-[#242420] px-3 py-2 text-[10px] font-bold text-[#d6a84f] sm:text-xs">
                {productList.length} Products
              </span>

            </div>

            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={14}
              loop={productList.length > 3}
              speed={4500}
              freeMode={{
                enabled: true,
                momentum: false,
              }}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              grabCursor
              className="!overflow-visible"
              breakpoints={{
                640: {
                  spaceBetween: 18,
                },
                1024: {
                  spaceBetween: 22,
                },
              }}
            >

              {productList.map((product, index) => {
                const image = getProductImage(product);

                return (
                  <SwiperSlide
                    key={product._id || product.id || index}
                    className="!h-auto !w-[78%] !max-w-[290px] sm:!w-[42%] sm:!max-w-[330px] lg:!w-[30%] lg:!max-w-[370px]"
                  >

                    <button
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="group flex h-full w-full flex-col overflow-hidden rounded-2xl border border-[#45443f] bg-[#242420] text-left transition duration-300 hover:-translate-y-1 hover:border-[#d6a84f]/60 hover:shadow-xl hover:shadow-black/20"
                    >

                      <div className="relative h-52 w-full shrink-0 overflow-hidden bg-[#34342e] sm:h-60">

                        {image ? (
                          <img
                            src={image}
                            alt={product.name || "Product"}
                            className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-sm text-[#a6a194]">
                            No Image
                          </div>
                        )}

                        <span className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-[#d6a84f] text-[#1d1d1b] shadow-lg">
                          <FaArrowRight className="-rotate-45 text-xs" />
                        </span>

                      </div>

                      <div className="flex flex-1 flex-col p-4 sm:p-5">

                        <div className="flex items-start justify-between gap-3">

                          <h3 className="line-clamp-1 text-base font-black text-[#f4f0e7] sm:text-lg">
                            {product.name || "Product"}
                          </h3>

                          {product.price !== undefined &&
                            product.price !== null &&
                            product.price !== "" && (
                              <span className="shrink-0 text-sm font-black text-[#d6a84f]">
                                ₹{product.price}
                              </span>
                            )}

                        </div>

                        {product.description && (
                          <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#a6a194] sm:text-sm">
                            {product.description}
                          </p>
                        )}

                        <div className="mt-auto flex items-center gap-2 pt-5 text-[10px] font-bold uppercase tracking-[0.15em] text-[#d6a84f]">
                          View Product
                          <FaArrowRight />
                        </div>

                      </div>

                    </button>

                  </SwiperSlide>
                );
              })}

            </Swiper>

            <p className="mt-5 text-center text-[10px] text-[#858278] sm:text-xs">
              Drag or swipe to explore products
            </p>

          </div>
        </section>
      )}

      {/* =====================================================
          ABOUT US
      ===================================================== */}

      {about && (
        <section className="w-full px-3 py-10 sm:px-5 sm:py-14">

          <div className="grid gap-5 lg:grid-cols-[0.8fr_1.2fr]">

            <div className="relative overflow-hidden rounded-2xl border border-[#45443f] bg-[#2b2b26] p-6 sm:p-9">

              <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border-[25px] border-[#d6a84f]/5" />

              <p className={sectionLabel}>Who We Are</p>

              <h2 className="relative mt-3 text-3xl font-black leading-tight text-[#f4f0e7] sm:text-4xl">
                About
                <span className="block text-[#d6a84f]">
                  Our Business
                </span>
              </h2>

              <div className="mt-6 h-1 w-16 rounded-full bg-[#d6a84f]" />

              <div className="mt-7 space-y-4">

                {businessName && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d6a84f]/10 text-[#d6a84f]">
                      <FaCartShopping />
                    </span>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#858278]">
                        Business
                      </p>
                      <p className="text-sm font-bold text-[#f4f0e7]">
                        {businessName}
                      </p>
                    </div>
                  </div>
                )}

                {industry && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d6a84f]/10 text-[#d6a84f]">
                      <FaGlobe />
                    </span>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#858278]">
                        Industry
                      </p>
                      <p className="text-sm font-bold text-[#f4f0e7]">
                        {industry}
                      </p>
                    </div>
                  </div>
                )}

                {location && (
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#d6a84f]/10 text-[#d6a84f]">
                      <FaLocationDot />
                    </span>

                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#858278]">
                        Location
                      </p>
                      <p className="text-sm font-bold text-[#f4f0e7]">
                        {location}
                      </p>
                    </div>
                  </div>
                )}

              </div>

            </div>

            <div className="relative overflow-hidden rounded-2xl border border-[#45443f] bg-[#2b2b26] p-6 sm:p-9">

              <div className="absolute bottom-0 right-0 h-48 w-48 rounded-full bg-[#d6a84f]/5 blur-3xl" />

              <div className="relative">

                <span className="text-4xl font-serif leading-none text-[#d6a84f]">
                  “
                </span>

                <h3 className="mb-5 text-xl font-black text-[#f4f0e7] sm:text-2xl">
                  Our Story
                </h3>

                <p className="whitespace-pre-line text-sm leading-8 text-[#c0bbae] sm:text-base sm:leading-9">
                  {about}
                </p>

                <div className="mt-8 flex items-center gap-3 border-t border-[#45443f] pt-6">

                  {profileImage ? (
                    <img
                      src={profileImage}
                      alt={displayName}
                      className="h-11 w-11 rounded-full border border-[#d6a84f]/40 object-cover"
                    />
                  ) : (
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#d6a84f] font-black text-[#1d1d1b]">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                  )}

                  <div>
                    <p className="text-sm font-bold text-[#f4f0e7]">
                      {displayName}
                    </p>
                    <p className="mt-1 text-xs text-[#a6a194]">
                      {displayRole}
                    </p>
                  </div>

                </div>

              </div>
            </div>

          </div>
        </section>
      )}

      {/* =====================================================
          GALLERY - SINGLE ROW AUTO SLIDER
      ===================================================== */}

      {galleryImages.length > 0 && (
        <section className="w-full overflow-hidden border-y border-[#45443f] bg-[#1d1d1a]">

          <div className="w-full px-3 py-10 sm:px-5 sm:py-14">

            <div className="mb-7 flex items-end justify-between gap-4 sm:mb-9">

              <div>
                <p className={sectionLabel}>Visual Stories</p>

                <h2 className={sectionHeading}>
                  Our Gallery
                </h2>

                <p className="mt-2 text-xs text-[#858278] sm:text-sm">
                  A glimpse of our work and experiences.
                </p>
              </div>

              <span className="shrink-0 rounded-full border border-[#45443f] bg-[#292925] px-3 py-2 text-[10px] font-bold text-[#d6a84f] sm:text-xs">
                {galleryImages.length} Photos
              </span>

            </div>

            <Swiper
              modules={[Autoplay, FreeMode]}
              slidesPerView="auto"
              spaceBetween={12}
              loop={galleryImages.length > 3}
              speed={5000}
              freeMode={{
                enabled: true,
                momentum: false,
              }}
              autoplay={{
                delay: 0,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              grabCursor
              className="!overflow-visible"
              breakpoints={{
                640: {
                  spaceBetween: 16,
                },
                1024: {
                  spaceBetween: 20,
                },
              }}
            >

              {galleryImages.map((image, index) => {
                const imageUrl = getImageUrl(image);

                return (
                  <SwiperSlide
                    key={image._id || image.id || index}
                    className="!w-[75%] !max-w-[290px] sm:!w-[42%] sm:!max-w-[340px] lg:!w-[30%] lg:!max-w-[390px]"
                  >

                    <button
                      type="button"
                      onClick={() => onGalleryClick(image)}
                      className="group relative block aspect-[4/3] w-full overflow-hidden rounded-2xl border border-[#45443f] bg-[#292925]"
                    >

                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt={image.alt || "Gallery"}
                          className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                        />
                      ) : (
                        <div className="flex h-full items-center justify-center text-sm text-[#858278]">
                          No Image
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70 transition group-hover:opacity-100" />

                      <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#d6a84f] text-[#1d1d1b] shadow-lg transition group-hover:scale-110">
                        <FaArrowRight className="-rotate-45 text-xs" />
                      </span>

                    </button>

                  </SwiperSlide>
                );
              })}

            </Swiper>

            <p className="mt-5 text-center text-[10px] text-[#858278] sm:text-xs">
              Swipe or drag to explore more
            </p>

          </div>
        </section>
      )}

      {/* =====================================================
          BUSINESS HOURS
      ===================================================== */}

      {businessHours && (
        <section className="w-full px-3 py-9 sm:px-5 sm:py-12">

          <div className={`${cardClass} flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:p-7`}>

            <div className="flex items-center gap-4">

              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#d6a84f]/10 text-lg text-[#d6a84f]">
                <FaClock />
              </div>

              <div>
                <p className={sectionLabel}>Business Schedule</p>
                <h2 className="mt-1 text-xl font-black text-[#f4f0e7]">
                  Opening Hours
                </h2>
              </div>

            </div>

            <div className="h-px w-full bg-[#45443f] sm:h-12 sm:w-px" />

            <p className="whitespace-pre-line text-sm leading-7 text-[#c0bbae] sm:flex-1">
              {businessHours}
            </p>

          </div>
        </section>
      )}

      {/* =====================================================
          SOCIAL LINKS
      ===================================================== */}

      {socialLinks.length > 0 && (
        <section className="w-full border-y border-[#45443f] bg-[#2b2b26]">

          <div className="w-full px-3 py-10 text-center sm:px-5 sm:py-12">

            <p className={sectionLabel}>Stay Connected</p>

            <h2 className={sectionHeading}>
              Follow Our Store
            </h2>

            <p className="mt-2 text-xs text-[#a6a194] sm:text-sm">
              Connect with us on social media.
            </p>

            <div className="mt-7 flex flex-wrap justify-center gap-3">

              {socialLinks.map((social, index) => (
                <a
                  key={social._id || social.id || index}
                  href={social.url || "#"}
                  target="_blank"
                  rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-xl border border-[#45443f] bg-[#242420] text-lg text-[#d6a84f] transition hover:-translate-y-1 hover:border-[#d6a84f] hover:bg-[#d6a84f] hover:text-[#1d1d1b]"
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
          QR CODE SECTION
      ===================================================== */}

      <section className="w-full px-3 py-10 sm:px-5 sm:py-14">

        <div className="relative grid items-center gap-8 overflow-hidden rounded-[24px] border border-[#45443f] bg-[#2b2b26] p-6 sm:rounded-[30px] sm:p-10 lg:grid-cols-[1fr_auto] lg:p-12">

          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full border-[35px] border-[#d6a84f]/5" />

          <div className="relative">

            <div className="inline-flex items-center gap-2 rounded-full border border-[#d6a84f]/20 bg-[#d6a84f]/10 px-4 py-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#d6a84f]">
              <FaQrcode />
              Digital Business Card
            </div>

            <h2 className="mt-5 text-3xl font-black leading-tight text-[#f4f0e7] sm:text-4xl lg:text-5xl">
              Scan & Visit
              <span className="block text-[#d6a84f]">
                Our Digital Store
              </span>
            </h2>

            <p className="mt-4 max-w-xl text-sm leading-7 text-[#aaa598]">
              Share this QR code with your customers so they can quickly
              access your digital business profile.
            </p>

            <button
              type="button"
              onClick={onOpenQr}
              className="mt-7 inline-flex items-center gap-3 rounded-xl bg-[#d6a84f] px-6 py-3.5 text-sm font-bold text-[#1d1d1b] shadow-lg transition hover:bg-white"
            >
              <FaQrcode />
              Open QR Scanner
              <FaArrowRight className="text-xs" />
            </button>

          </div>

          <div className="relative flex justify-center lg:pr-5">

            <div className="rounded-[25px] border border-[#d6a84f]/30 bg-[#f4f0e7] p-4 shadow-2xl shadow-black/30 sm:p-5">

              <div className="rounded-2xl bg-white p-3 sm:p-4">

                {qrFetching ? (
                  <div className="flex h-36 w-36 items-center justify-center text-xs text-[#77736b] sm:h-44 sm:w-44">
                    Loading QR...
                  </div>
                ) : qrTargetUrl ? (
                  <QRCodeCanvas
                    value={qrTargetUrl}
                    size={176}
                    includeMargin
                    level="H"
                  />
                ) : (
                  <div className="flex h-36 w-36 items-center justify-center text-center text-xs text-[#77736b] sm:h-44 sm:w-44">
                    QR unavailable
                  </div>
                )}

              </div>

              <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.15em] text-[#292925]">
                Scan To Connect
              </p>

            </div>

          </div>

        </div>
      </section>

      {/* =====================================================
          INQUIRY FORM
      ===================================================== */}

      <section className="w-full border-t border-[#45443f] bg-[#2b2b26]">

        <div className="w-full px-3 py-10 sm:px-5 sm:py-14">

          <div className="grid gap-8 lg:grid-cols-[0.7fr_1.3fr]">

            <div className="lg:pt-5">

              <p className={sectionLabel}>Get In Touch</p>

              <h2 className={sectionHeading}>
                Have a
                <span className="block text-[#d6a84f]">
                  Question?
                </span>
              </h2>

              <p className="mt-4 max-w-sm text-sm leading-7 text-[#aaa598]">
                Send us your inquiry and our team will get back to you.
              </p>

              {phone && (
                <button
                  type="button"
                  onClick={() => handleContact("phone")}
                  className="mt-7 inline-flex items-center gap-3 text-sm font-bold text-[#d6a84f] transition hover:text-white"
                >
                  <FaPhone />
                  Contact Our Team
                  <FaArrowRight />
                </button>
              )}

            </div>

            <form
              onSubmit={onFormSubmit}
              className="rounded-2xl border border-[#45443f] bg-[#242420] p-5 sm:p-8"
            >

              {formSubmitted ? (

                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">

                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#d6a84f]/15 text-2xl text-[#d6a84f]">
                    <FaCheck />
                  </div>

                  <h3 className="mt-5 text-xl font-black text-[#f4f0e7]">
                    Inquiry Submitted
                  </h3>

                  <p className="mt-2 text-sm text-[#a6a194]">
                    Thank you. We will get back to you soon.
                  </p>

                </div>

              ) : (

                <>

                  {inquirySubmitError && (
                    <div className="mb-5 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                      {inquirySubmitError}
                    </div>
                  )}

                  <div className="grid gap-5 sm:grid-cols-2">

                    <div>
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#aaa598]">
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
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#aaa598]">
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
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#aaa598]">
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
                      <label className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-[#aaa598]">
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
                        placeholder="Write your inquiry..."
                        className={`${inputClass} resize-none`}
                      />
                    </div>

                  </div>

                  <button
                    type="submit"
                    disabled={inquirySubmitting}
                    className="mt-6 inline-flex w-full items-center justify-center gap-3 rounded-xl bg-[#d6a84f] px-5 py-4 text-sm font-black text-[#1d1d1b] transition hover:bg-white disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                    {!inquirySubmitting && <FaArrowRight />}
                  </button>

                </>
              )}

            </form>

          </div>
        </div>
      </section>

    </div>
  );
};

export default Storefront;