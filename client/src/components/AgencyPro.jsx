import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaArrowRight,
  FaBriefcase,
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaLocationDot,
  FaPhone,
  FaShareNodes,
  FaWhatsapp,
  FaQrcode,
  FaCheck,
  FaStar,
} from "react-icons/fa6";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.imageUrl || image.src || "";
};

const ProductImageSlider = ({ images = [], productName = "Product" }) => {
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    if (images.length < 2) return undefined;
    const interval = setInterval(() => {
      setActiveImage((current) => (current + 1) % images.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [images.length]);

  if (!images.length) {
    return (
      <div className="flex h-full w-full items-center justify-center bg-[#dce7ed] text-sm text-[#70818d]">
        No Image Available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#dce7ed]">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt={`${productName} image ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
            index === activeImage ? "scale-100 opacity-100" : "scale-105 opacity-0"
          }`}
        />
      ))}
      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-[#102033]/45 px-3 py-2 backdrop-blur-sm">
          {images.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show ${productName} image ${index + 1}`}
              onClick={() => setActiveImage(index)}
              className={`h-1.5 rounded-full transition-all ${
                index === activeImage ? "w-5 bg-white" : "w-1.5 bg-white/55"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AutoSlider = ({
  items,
  renderItem,
  itemKey,
  className = "",
  interval = 3500,
  visibleCount = 1,
}) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldAutoSlide = items.length > visibleCount;

  useEffect(() => {
    if (!shouldAutoSlide) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) =>
        current >= items.length - 1 ? 0 : current + 1
      );
    }, interval);
    return () => clearInterval(timer);
  }, [shouldAutoSlide, items.length, interval]);

  useEffect(() => {
    const slider = sliderRef.current;
    if (!slider || !shouldAutoSlide) return;
    const card = slider.children[activeIndex];
    if (!card) return;
    slider.scrollTo({
      left: card.offsetLeft - slider.offsetLeft,
      behavior: "smooth",
    });
  }, [activeIndex, shouldAutoSlide]);

  return (
    <div className={`w-full ${className}`}>
      <div
        ref={sliderRef}
        className={`flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-4 ${
          shouldAutoSlide ? "scroll-smooth" : "overflow-x-hidden"
        }`}
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div key={itemKey(item, index)} className="w-[85%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] xl:w-[calc(25%-12px)]">
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {shouldAutoSlide && (
        <div className="mt-3 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show item ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index ? "w-6 bg-[#1a9f91]" : "w-2 bg-[#a9bbc5]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const AgencyPro = ({
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
    industry = "Professional Services",
    businessName = "",
    businessHours = "",
    isVerified = false,
  } = businessInfo;

  const displayName = businessName || name;
  const logoImage = getImageUrl(logo);
  const profileImage = getImageUrl(avatar);
  const coverImage = getImageUrl(banner);

  const getSocialName = (platform = "") =>
    platform
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());

  const getProductImages = (product) =>
    Array.isArray(product?.images)
      ? product.images.map(getImageUrl).filter(Boolean)
      : [];

  return (
    <div className="min-h-screen overflow-hidden bg-[#edf3f5] text-[#102033]">
      {/* HERO: cover image, logo, profile photo and action buttons */}
  

<section className="relative isolate min-h-[680px] overflow-hidden bg-[#071c30] shadow-2xl sm:min-h-[740px]">

  {/* COVER IMAGE */}
  <div className="absolute inset-0">
    {coverImage ? (
      <img
        src={coverImage}
        alt={`${displayName} cover`}
        className="h-full w-full object-cover"
      />
    ) : (
      <div className="h-full w-full bg-gradient-to-br from-[#18364b] via-[#244b5b] to-[#397d7c]" />
    )}
    <div className="absolute inset-0 bg-gradient-to-r from-[#061a2c]/95 via-[#061a2c]/80 to-[#061a2c]/30" />
    <div className="absolute inset-0 bg-gradient-to-t from-[#061a2c]/90 via-transparent to-[#061a2c]/15" />
  </div>

  {/* TOP ACTIONS */}
  <div className="relative z-20 mx-auto flex max-w-7xl justify-end gap-3 px-5 pt-6 sm:px-8 sm:pt-8">
    <button
      type="button"
      onClick={onShare}
      className="flex h-12 items-center gap-2 rounded-full border border-white/20 bg-[#102b43]/80 px-5 text-sm font-bold text-white shadow-lg transition hover:bg-white hover:text-[#102033]"
    >
      <FaShareNodes />
      Share
    </button>

    <button
      type="button"
      onClick={onOpenQr}
      className="flex h-12 items-center gap-2 rounded-full border border-white/20 bg-[#102b43]/80 px-5 text-sm font-bold text-white shadow-lg transition hover:bg-[#1db6a5]"
    >
      <FaQrcode />
      Scan QR
    </button>
  </div>

  {/* MAIN CONTENT */}
  <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-5 pb-44 pt-12 sm:px-8 sm:pb-48 sm:pt-16 lg:grid-cols-[1.15fr_0.85fr] lg:gap-8 lg:px-10 lg:pt-12">

    {/* LEFT PROFILE DETAILS */}
    <div className="order-2 max-w-3xl lg:order-1">

      {/* LOGO + NAME */}
      <div className="flex items-center gap-5">
        <div className="flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-[1.7rem] border-4 border-white bg-white p-2 shadow-2xl sm:h-32 sm:w-32">
          {logoImage ? (
            <img
              src={logoImage}
              alt={`${displayName} logo`}
              className="h-full w-full rounded-2xl object-contain"
            />
          ) : (
            <FaBriefcase className="text-4xl text-[#102033]" />
          )}
        </div>

        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-black leading-tight tracking-tight text-white sm:text-5xl lg:text-6xl">
              {displayName}
            </h1>

            {isVerified && (
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#2188f5] text-white shadow-lg">
                <FaCheck />
              </span>
            )}
          </div>

          <p className="mt-2 text-lg font-bold text-white sm:text-2xl">
            {role}
          </p>
        </div>
      </div>

      {/* LOCATION */}
      {location && (
        <div className="mt-6 flex items-center gap-3 text-base text-white/90">
          <FaLocationDot className="text-xl text-[#1db6a5]" />
          <span>{location}</span>
        </div>
      )}

      {/* ABOUT */}
      {about && (
        <p className="mt-7 max-w-2xl text-base leading-8 text-white/90 sm:text-lg">
          {about}
        </p>
      )}

      {/* INDUSTRY TAG */}
      <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[#1db6a5]/50 bg-[#102b43]/70 px-5 py-2.5 text-sm font-semibold text-[#9df4e8]">
        <span className="h-2 w-2 rounded-full bg-[#1db6a5]" />
        {industry}
      </div>

      {/* CONTACT BUTTONS */}
      <div className="mt-9 flex flex-wrap gap-4">
        {phone && (
          <button
            type="button"
            onClick={() => onContactClick("phone")}
            className="flex items-center gap-3 rounded-full bg-gradient-to-r from-[#08bd9e] to-[#1db6a5] px-7 py-4 text-base font-extrabold text-white shadow-[0_12px_35px_rgba(29,182,165,0.3)] transition hover:-translate-y-1 hover:shadow-xl"
          >
            <FaPhone className="text-lg" />
            Contact Me
            <FaArrowRight />
          </button>
        )}

        {whatsapp && (
          <button
            type="button"
            onClick={() => onContactClick("whatsapp")}
            className="flex items-center gap-3 rounded-full border-2 border-[#1db6a5] bg-[#102033]/60 px-7 py-4 text-base font-bold text-white transition hover:-translate-y-1 hover:bg-[#1db6a5]"
          >
            <FaWhatsapp className="text-xl" />
            WhatsApp
          </button>
        )}
      </div>
    </div>

    {/* RIGHT CIRCULAR PROFILE IMAGE */}
    <div className="order-1 flex justify-center lg:order-2 lg:justify-end lg:pr-5">
      <div className="relative flex h-[270px] w-[270px] items-center justify-center sm:h-[390px] sm:w-[390px] lg:h-[440px] lg:w-[440px]">

        {/* OUTER TEAL RING */}
        <div className="absolute inset-0 rounded-full border-[5px] border-[#08c9ad] shadow-[0_0_35px_rgba(8,201,173,0.3)]" />

        {/* WHITE BORDER */}
        <div className="absolute inset-[10px] rounded-full border-[8px] border-white shadow-2xl" />

        {/* PROFILE IMAGE */}
        <div className="absolute inset-[20px] overflow-hidden rounded-full bg-gradient-to-br from-[#d9f2ee] to-[#b9d3d8]">
          {profileImage ? (
            <img
              src={profileImage}
              alt={`${displayName} profile`}
              className="h-full w-full object-cover object-center"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1db6a5] to-[#137c78] text-8xl font-black text-white">
              {displayName.charAt(0).toUpperCase()}
            </div>
          )}
        </div>

        {/* VERIFIED BADGE */}
        {isVerified && (
          <div className="absolute right-4 top-8 flex h-12 w-12 items-center justify-center rounded-full border-4 border-[#071c30] bg-[#2188f5] text-xl text-white shadow-xl sm:right-7 sm:top-12 sm:h-16 sm:w-16">
            <FaCheck />
          </div>
        )}
      </div>
    </div>
  </div>

  {/* CURVED BOTTOM DECORATION */}
  <div className="pointer-events-none absolute bottom-0 left-0 h-28 w-full overflow-hidden sm:h-36">
    <div className="absolute -bottom-20 left-[15%] h-40 w-[100%] -rotate-6 rounded-[50%] bg-gradient-to-r from-[#08c9ad] to-[#087c91] sm:-bottom-28 sm:h-56" />
    <div className="absolute -bottom-24 left-[-5%] h-40 w-[110%] rotate-2 rounded-[50%] bg-[#071c30] sm:-bottom-32 sm:h-52" />
  </div>

  {/* BOTTOM WHITE INFORMATION STRIP */}
  <div className="absolute bottom-0 left-0 z-20 w-full">
    <div className="relative w-[85%] rounded-tr-[4rem] bg-white px-5 py-5 shadow-[10px_-10px_40px_rgba(0,0,0,0.12)] sm:w-[75%] sm:rounded-tr-[6rem] sm:px-10 sm:py-7 lg:w-[70%] lg:px-14">

      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-4 text-[#102033] sm:justify-start sm:gap-x-10">

        {isVerified && (
          <div className="flex items-center gap-2 text-sm font-bold sm:text-base">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#d9f8ef] text-lg text-[#08b995]">
              <FaCheck />
            </span>
            Verified Profile
          </div>
        )}

        {phone && (
          <div className="flex items-center gap-3 text-sm font-bold sm:border-l-2 sm:border-[#d4e0e7] sm:pl-7 sm:text-base">
            <FaPhone className="text-xl text-[#087c91]" />
            <span>{phone}</span>
          </div>
        )}

        {location && (
          <div className="flex items-center gap-3 text-sm font-bold sm:border-l-2 sm:border-[#d4e0e7] sm:pl-7 sm:text-base">
            <FaLocationDot className="text-xl text-[#087c91]" />
            <span>{location}</span>
          </div>
        )}

      </div>
    </div>
  </div>
</section>



      {/* CONTACT INFO */}
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-24 sm:px-8">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phone && <button type="button" onClick={() => onContactClick("phone")} className="rounded-[1.4rem] border border-white/80 bg-gradient-to-br from-white/95 to-[#eaf2f5] p-6 text-left shadow-[0_14px_40px_-22px_rgba(16,32,51,0.32)] transition duration-300 hover:-translate-y-1.5 hover:border-[#9edbd3] hover:shadow-[0_22px_48px_-22px_rgba(16,32,51,0.38)]"><FaPhone className="mb-4 text-[#159f92]" /><p className="text-xs font-semibold uppercase tracking-wider text-[#718591]">Phone</p><p className="mt-1 truncate text-sm font-bold text-[#102033]">{phone}</p></button>}
          {email && <button type="button" onClick={() => onContactClick("email")} className="rounded-[1.4rem] border border-white/80 bg-gradient-to-br from-white/95 to-[#eaf2f5] p-6 text-left shadow-[0_14px_40px_-22px_rgba(16,32,51,0.32)] transition duration-300 hover:-translate-y-1.5 hover:border-[#9edbd3] hover:shadow-[0_22px_48px_-22px_rgba(16,32,51,0.38)]"><FaEnvelope className="mb-4 text-[#159f92]" /><p className="text-xs font-semibold uppercase tracking-wider text-[#718591]">Email</p><p className="mt-1 truncate text-sm font-bold text-[#102033]">{email}</p></button>}
          {website && <button type="button" onClick={() => onContactClick("website")} className="rounded-[1.4rem] border border-white/80 bg-gradient-to-br from-white/95 to-[#eaf2f5] p-6 text-left shadow-[0_14px_40px_-22px_rgba(16,32,51,0.32)] transition duration-300 hover:-translate-y-1.5 hover:border-[#9edbd3] hover:shadow-[0_22px_48px_-22px_rgba(16,32,51,0.38)]"><FaGlobe className="mb-4 text-[#159f92]" /><p className="text-xs font-semibold uppercase tracking-wider text-[#718591]">Website</p><p className="mt-1 truncate text-sm font-bold text-[#102033]">{website}</p></button>}
          {(address || location) && <button type="button" onClick={() => onContactClick("address")} className="rounded-[1.4rem] border border-white/80 bg-gradient-to-br from-white/95 to-[#eaf2f5] p-6 text-left shadow-[0_14px_40px_-22px_rgba(16,32,51,0.32)] transition duration-300 hover:-translate-y-1.5 hover:border-[#9edbd3] hover:shadow-[0_22px_48px_-22px_rgba(16,32,51,0.38)]"><FaLocationDot className="mb-4 text-[#159f92]" /><p className="text-xs font-semibold uppercase tracking-wider text-[#718591]">Location</p><p className="mt-1 line-clamp-2 text-sm font-bold text-[#102033]">{address || location}</p></button>}
        </div>
      </section>

      {/* CONFIGURED BUTTONS */}
      {visibleButtons.length > 0 && (
        <section className="mx-auto max-w-7xl px-5 pb-12 sm:px-8">
          <div className="mb-6"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159f92]">Quick Access</p><h2 className="mt-2 text-2xl font-black text-[#102033]">Explore More</h2></div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleButtons.map((button, index) => (
              <button key={button._id || button.id || index} type="button" onClick={() => onConfiguredButton(button)} className="group flex items-center justify-between rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white to-[#edf4f6] shadow-[0_16px_45px_-28px_rgba(16,32,51,0.35)] p-5 text-left shadow-sm transition hover:border-[#1db6a5] hover:shadow-lg">
                <span><span className="block text-sm font-bold text-[#102033]">{button.label}</span>{button.actionType && <span className="mt-1 block text-xs text-[#718591]">{button.actionType}</span>}</span>
                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#d9f2ee] text-[#159f92] transition group-hover:bg-[#1db6a5] group-hover:text-white"><FaArrowRight /></span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* ABOUT */}
      {about && (
        <section className="border-y border-[#d3e0e6] bg-[#e2edf1]">
          <div className="mx-auto max-w-7xl px-5 py-16 sm:px-8">
            <div className="grid gap-8 md:grid-cols-[0.35fr_0.65fr]">
              <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159f92]">About</p><h2 className="mt-3 text-3xl font-black tracking-tight text-[#102033]">About {name}</h2></div>
              <div><p className="text-base leading-8 text-[#526775]">{about}</p></div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS - SINGLE ROW AUTO SLIDER */}
      {productList.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159f92]">Services</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#102033]">What I Offer</h2></div>
            <AutoSlider
              items={productList}
              itemKey={(product, index) => product._id || product.id || index}
              visibleCount={1}
              renderItem={(product) => (
                <button type="button" onClick={() => onProductClick(product)} className="group h-full w-full overflow-hidden rounded-[1.5rem] border border-white/80 bg-gradient-to-br from-white to-[#edf4f6] shadow-[0_16px_45px_-28px_rgba(16,32,51,0.35)] text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                  <div className="h-52 overflow-hidden bg-[#dce7ed] sm:h-56"><ProductImageSlider images={getProductImages(product)} productName={product.name || "Product"} /></div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3"><h3 className="text-lg font-black text-[#102033]">{product.name || "Service"}</h3>{product.price !== undefined && product.price !== null && product.price !== "" && <span className="whitespace-nowrap rounded-lg bg-[#d9f2ee] px-3 py-1 text-xs font-black text-[#159888]">{String(product.price).startsWith("₹") ? product.price : `₹${product.price}`}</span>}</div>
                    {product.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#647985]">{product.description}</p>}
                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#159f92]">View Details <FaArrowRight className="text-xs" /></span>
                  </div>
                </button>
              )}
            />
          </div>
        </section>
      )}

      {/* GALLERY - SINGLE ROW AUTO SLIDER */}
      {galleryImages.length > 0 && (
        <section className="bg-[#e2edf1] py-16">
          <div className="mx-auto max-w-7xl px-5 sm:px-8">
            <div className="mb-8 text-center"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159f92]">Portfolio</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#102033]">Recent Work</h2></div>
            <AutoSlider
              items={galleryImages}
              itemKey={(image, index) => image._id || image.id || index}
              visibleCount={1}
              renderItem={(image) => (
                <button type="button" onClick={() => onGalleryClick(image)} className="group h-full w-full overflow-hidden rounded-[1.5rem] border border-white/70 bg-[#dce7ed] shadow-[0_18px_45px_-25px_rgba(16,32,51,0.4)]">
                  <img src={getImageUrl(image)} alt={image.alt || "Gallery image"} className="h-56 w-full object-cover transition duration-500 group-hover:scale-105 sm:h-64" />
                </button>
              )}
            />
          </div>
        </section>
      )}

      {/* BUSINESS HOURS + SOCIAL */}
      <section className="mx-auto grid max-w-7xl gap-5 px-5 py-16 sm:px-8 md:grid-cols-2">
        {businessHours && (
          <div className="rounded-[1.8rem] border border-white/80 bg-gradient-to-br from-white to-[#eaf2f5] p-8 shadow-[0_18px_50px_-28px_rgba(16,32,51,0.35)]">
            <div className="mb-5 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#d9f2ee] text-[#159f92]"><FaClock /></div><div><p className="text-xs font-bold uppercase tracking-wider text-[#718591]">Availability</p><h3 className="text-xl font-black text-[#102033]">Business Hours</h3></div></div>
            <p className="whitespace-pre-line text-sm leading-7 text-[#526775]">{businessHours}</p>
          </div>
        )}
        {socialLinks.length > 0 && (
          <div className="rounded-[1.8rem] border border-white/80 bg-gradient-to-br from-white to-[#eaf2f5] p-8 shadow-[0_18px_50px_-28px_rgba(16,32,51,0.35)]">
            <p className="text-xs font-bold uppercase tracking-wider text-[#159f92]">Connect</p><h3 className="mt-2 text-xl font-black text-[#102033]">Find Me Online</h3>
            <div className="mt-5 flex flex-wrap gap-3">{socialLinks.map((social, index) => <a key={social._id || social.id || index} href={social.url || "#"} target="_blank" rel="noreferrer" className="rounded-xl border border-[#d3e0e6] bg-[#e7f0f3] px-4 py-3 text-sm font-bold text-[#102033] transition hover:border-[#1db6a5] hover:text-[#159f92]">{getSocialName(social.platform || "Social")}</a>)}</div>
          </div>
        )}
      </section>

      {/* QR SECTION */}
      {qrTargetUrl && (
        <section className="bg-[#dcebef]">
          <div className="mx-auto flex max-w-7xl flex-col items-center gap-7 px-5 py-16 text-center sm:px-8 md:flex-row md:justify-between md:text-left">
            <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159888]">Digital Profile</p><h2 className="mt-2 text-3xl font-black tracking-tight text-[#102033]">Scan & Save My Profile</h2><p className="mt-3 max-w-xl text-sm leading-6 text-[#526775]">Scan this QR code to open this digital profile and connect directly.</p></div>
            <div className="rounded-3xl border border-[#d3e0e6] bg-[#f1f6f8] p-5 shadow-lg">{qrFetching ? <div className="flex h-40 w-40 items-center justify-center text-sm font-semibold text-[#718591]">Loading...</div> : <QRCodeCanvas value={qrTargetUrl} size={160} includeMargin level="H" />}</div>
          </div>
        </section>
      )}

      {/* INQUIRY FORM */}
      <section className="mx-auto max-w-4xl px-5 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-[#173448] via-[#142f42] to-[#102638] p-6 shadow-[0_28px_80px_-30px_rgba(16,32,51,0.65)] sm:p-10"><div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-[#1db6a5]/15 blur-3xl" /><div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-[#65e1d2]/10 blur-3xl" />
          <div className="mb-8"><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#65e1d2]">Get In Touch</p><h2 className="mt-2 text-3xl font-black text-white">Let's Work Together</h2><p className="mt-3 text-sm leading-6 text-[#c0d0d8]">Send your details and message. We will get back to you soon.</p></div>
          {formSubmitted ? (
            <div className="rounded-2xl border border-[#1db6a5]/30 bg-[#1db6a5]/10 p-6 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1db6a5] text-xl text-white"><FaCheck /></div><h3 className="mt-4 text-xl font-black text-white">Message Sent Successfully</h3><p className="mt-2 text-sm text-[#c0d0d8]">Thank you for reaching out.</p></div>
          ) : (
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-[#b0c0c9] focus:border-[#65e1d2]" />
                <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-[#b0c0c9] focus:border-[#65e1d2]" />
              </div>
              <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-[#b0c0c9] focus:border-[#65e1d2]" />
              <textarea rows="5" placeholder="Write your message..." value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full resize-none rounded-xl border border-white/15 bg-white/10 px-4 py-3 text-sm text-white outline-none placeholder:text-[#b0c0c9] focus:border-[#65e1d2]" />
              {inquirySubmitError && <p className="rounded-xl border border-red-300/30 bg-red-400/10 px-4 py-3 text-sm text-red-200">{inquirySubmitError}</p>}
              <button type="submit" disabled={inquirySubmitting} className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1db6a5] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#159888] disabled:cursor-not-allowed disabled:opacity-60">{inquirySubmitting ? "Sending..." : "Send Inquiry"}{!inquirySubmitting && <FaArrowRight />}</button>
            </form>
          )}
        </div>
      </section>

      {/* Footer intentionally removed */}
    </div>
  );
};

export default AgencyPro;
