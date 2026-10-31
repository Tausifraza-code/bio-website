import React, { useEffect, useState, useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaArrowRight,
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
  FaLayerGroup,
} from "react-icons/fa6";

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
      <div className="flex h-full w-full items-center justify-center bg-[#eee9e1] text-sm text-[#989087]">
        No Image Available
      </div>
    );
  }

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#eee9e1]">
      {images.map((image, index) => (
        <img
          key={`${image}-${index}`}
          src={image}
          alt={`${productName} image ${index + 1}`}
          className={`absolute inset-0 h-full w-full object-cover transition-all duration-700 ease-in-out ${
            index === activeImage
              ? "scale-100 opacity-100"
              : "scale-105 opacity-0"
          }`}
        />
      ))}

      {images.length > 1 && (
        <>
          <div className="absolute bottom-4 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-black/35 px-3 py-2 backdrop-blur-sm">
            {images.map((_, index) => (
              <button
                key={index}
                type="button"
                aria-label={`Show product image ${index + 1}`}
                onClick={() => setActiveImage(index)}
                className={`h-1.5 rounded-full transition-all ${
                  index === activeImage ? "w-5 bg-white" : "w-1.5 bg-white/55"
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};


const ProductAutoSlider = ({
  productList,
  getProductImages,
  onProductClick,
}) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldAutoSlide = productList.length > 1;

  useEffect(() => {
    if (!shouldAutoSlide) return undefined;

    const interval = setInterval(() => {
      setActiveIndex((current) =>
        current >= productList.length - 1 ? 0 : current + 1
      );
    }, 3500);

    return () => clearInterval(interval);
  }, [shouldAutoSlide, productList.length]);

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
    <div className="mx-auto mt-10 w-full max-w-6xl">
      <div
        ref={sliderRef}
        className={`flex w-full gap-4 overflow-x-auto snap-x snap-mandatory pb-4 ${
          shouldAutoSlide ? "scroll-smooth" : "overflow-x-hidden"
        }`}
        style={{ scrollbarWidth: "none" }}
      >
        {productList.map((product, index) => {
          const productImages = getProductImages(product);

          return (
            <div
              key={product._id || product.id || index}
              className="w-[85%] shrink-0 snap-start overflow-hidden rounded-2xl border border-[#e0d7ca] bg-white shadow-[0_8px_24px_rgba(65,49,29,0.06)] sm:w-[calc(50%-8px)] lg:w-[calc(25%-12px)] xl:w-[calc(20%-13px)]"
            >
              <button
                type="button"
                onClick={() => onProductClick(product)}
                className="block h-full w-full text-left"
              >
                <div className="relative h-52 overflow-hidden bg-[#eee9e1] sm:h-56">
                  <ProductImageSlider
                    images={productImages}
                    productName={product.name || "Product"}
                  />
                  <span className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-white/90 px-3 py-1.5 text-[11px] font-semibold text-[#4c453c] shadow-sm">
                    View Details
                  </span>
                </div>

                <div className="p-4">
                  <div className="flex items-start justify-between gap-2">
                    <h3 className="line-clamp-2 font-serif text-lg font-semibold text-[#332d25]">
                      {product.name || "Product"}
                    </h3>

                    {product.price !== undefined &&
                      product.price !== null &&
                      product.price !== "" && (
                        <span className="shrink-0 whitespace-nowrap text-sm font-semibold text-[#a27c45]">
                          ₹{product.price}
                        </span>
                      )}
                  </div>

                  {product.description && (
                    <p className="mt-2 line-clamp-2 text-xs leading-5 text-[#7c746a]">
                      {product.description}
                    </p>
                  )}
                </div>
              </button>
            </div>
          );
        })}
      </div>

      {shouldAutoSlide && (
        <div className="mt-4 flex justify-center gap-2">
          {productList.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show product ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-2 rounded-full transition-all ${
                activeIndex === index
                  ? "w-6 bg-[#a27c45]"
                  : "w-2 bg-[#cfc4b4]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const ElegantProfile = ({
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
    role = "Professional",
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
  const displayRole = role || industry || "Professional";

  const getImageUrl = (image) => {
    if (!image) return "";
    if (typeof image === "string") return image;
    return image.url || image.imageUrl || image.src || "";
  };

  const getProductImages = (product) => {
    if (!product || !Array.isArray(product.images)) return [];
    return product.images.map(getImageUrl).filter(Boolean);
  };

  const getSocialIcon = (platform) => {
    const value = String(platform || "").toLowerCase();
    if (value.includes("instagram")) return <FaInstagram />;
    if (value.includes("facebook")) return <FaFacebookF />;
    if (value.includes("linkedin")) return <FaLinkedinIn />;
    if (value.includes("youtube")) return <FaYoutube />;
    if (value.includes("twitter") || value.includes("x.com")) return <FaXTwitter />;
    return <FaGlobe />;
  };

  const profileImage = getImageUrl(avatar || logo);
  const logoImage = getImageUrl(logo);
  const heroImage = getImageUrl(banner);

  const handleContact = (type) => onContactClick(type);

  const gallerySlides = galleryImages.length > 1
    ? [...galleryImages, ...galleryImages]
    : galleryImages;

  return (
    <div className="min-h-screen w-full overflow-hidden bg-[#f8f5ef] text-[#29251f]">
      <style>{`
        @keyframes elegant-product-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        @keyframes elegant-gallery-marquee {
          from { transform: translateX(0); }
          to { transform: translateX(-50%); }
        }
        .elegant-product-track {
          width: max-content;
          animation: elegant-product-marquee 42s linear infinite;
        }
        .elegant-gallery-track {
          width: max-content;
          animation: elegant-gallery-marquee 34s linear infinite;
        }
        .elegant-marquee:hover .elegant-product-track,
        .elegant-marquee:hover .elegant-gallery-track {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .elegant-product-track, .elegant-gallery-track {
            animation: none !important;
            transform: none !important;
          }
        }
      `}</style>

      {/* HERO SECTION */}
      <section className="relative w-full overflow-hidden">
        <div className="relative h-[300px] w-full bg-[#e8dfd2] sm:h-[390px] lg:h-[460px]">
          {heroImage ? (
            <img src={heroImage} alt={`${displayName} cover`} className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-[#e9dfd0] via-[#d9c9b3] to-[#b9a58c]" />
          )}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-black/10 to-black/50" />

          <div className="absolute right-5 top-5 z-20 flex items-center gap-2 sm:right-10 sm:top-8">
            <button type="button" onClick={onShare} aria-label="Share profile" title="Share Profile"
              className="flex h-11 items-center gap-2 rounded-full border border-white/40 bg-white/90 px-4 text-sm font-semibold text-[#29251f] shadow-lg backdrop-blur-md transition hover:-translate-y-0.5 hover:bg-[#29251f] hover:text-white">
              <FaShareNodes /><span>Share</span>
            </button>
            <button type="button" onClick={onOpenQr} aria-label="Open QR code" title="Scan QR"
              className="flex h-11 items-center gap-2 rounded-full border border-white/30 bg-[#29251f] px-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#a27c45]">
              <FaQrcode /><span>Scan</span>
            </button>
          </div>

          <div className="absolute bottom-8 left-5 z-10 sm:bottom-12 sm:left-10">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              {industry || "Professional Profile"}
            </p>
          </div>
        </div>

        <div className="relative mx-auto max-w-6xl px-5 pb-14 sm:px-8">
          <div className="relative z-10 -mt-[76px] flex flex-col items-center sm:-mt-[90px] lg:flex-row lg:items-end lg:gap-8">
            <div className="relative shrink-0">
              <div className="flex h-36 w-36 items-center justify-center rounded-full border-[7px] border-[#f8f5ef] bg-white shadow-[0_12px_35px_rgba(41,37,31,0.18)] sm:h-44 sm:w-44">
                {logoImage ? (
                  <img src={logoImage} alt={`${displayName} logo`} className="h-full w-full rounded-full object-contain p-3" />
                ) : profileImage ? (
                  <img src={profileImage} alt={displayName} className="h-full w-full rounded-full object-cover" />
                ) : (
                  <div className="flex h-full w-full items-center justify-center rounded-full bg-[#29251f] font-serif text-5xl text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
              {isVerified && (
                <span className="absolute bottom-2 right-2 flex h-9 w-9 items-center justify-center rounded-full border-4 border-[#f8f5ef] bg-[#a27c45] text-xs text-white">
                  <FaCheck />
                </span>
              )}
            </div>

            <div className="mt-5 min-w-0 text-center lg:mb-3 lg:mt-0 lg:text-left">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:justify-start">
                <h1 className="font-serif text-4xl font-semibold text-[#29251f] sm:text-5xl">{displayName}</h1>
                {isVerified && <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#a27c45] text-[10px] text-white"><FaCheck /></span>}
              </div>
              <p className="mt-2 font-serif text-lg italic text-[#766d62] sm:text-xl">{displayRole}</p>
              {location && (
                <div className="mt-3 flex items-center justify-center gap-2 text-sm text-[#81786e] lg:justify-start">
                  <FaLocationDot className="text-[#a27c45]" />{location}
                </div>
              )}
            </div>
          </div>

          <div className="mt-9 grid items-start gap-8 lg:grid-cols-[1fr_auto]">
            {about && (
              <div className="max-w-3xl">
                <div className="mb-5 h-px w-16 bg-[#a27c45]" />
                <p className="text-sm leading-8 text-[#746c62] sm:text-base">{about}</p>
              </div>
            )}
            <div className="flex flex-wrap justify-center gap-3 lg:justify-end">
              {phone && (
                <button type="button" onClick={() => handleContact("phone")}
                  className="inline-flex items-center gap-2 rounded-full bg-[#29251f] px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a27c45]">
                  <FaPhone />Contact Me
                </button>
              )}
              {whatsapp && (
                <button type="button" onClick={() => handleContact("whatsapp")}
                  className="inline-flex items-center gap-2 rounded-full border border-[#d7cbbb] bg-white px-6 py-3.5 text-sm font-semibold text-[#4f483f] transition hover:border-[#a27c45] hover:text-[#a27c45]">
                  <FaWhatsapp />WhatsApp
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="border-y border-[#e7dfd2] bg-white/60">
        <div className="mx-auto grid max-w-6xl sm:grid-cols-2 lg:grid-cols-4">
          {phone && (
            <button type="button" onClick={() => handleContact("phone")} className="group border-b border-[#e7dfd2] p-6 text-center transition hover:bg-[#f8f5ef] sm:border-r lg:border-b-0">
              <FaPhone className="mx-auto text-[#a27c45]" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b9287]">Phone</p>
              <p className="mt-1 truncate text-sm font-medium">{phone}</p>
            </button>
          )}
          {email && (
            <button type="button" onClick={() => handleContact("email")} className="group border-b border-[#e7dfd2] p-6 text-center transition hover:bg-[#f8f5ef] lg:border-b-0 lg:border-r">
              <FaEnvelope className="mx-auto text-[#a27c45]" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b9287]">Email</p>
              <p className="mt-1 truncate text-sm font-medium">{email}</p>
            </button>
          )}
          {website && (
            <button type="button" onClick={() => handleContact("website")} className="group border-b border-[#e7dfd2] p-6 text-center transition hover:bg-[#f8f5ef] sm:border-r sm:border-b-0">
              <FaGlobe className="mx-auto text-[#a27c45]" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b9287]">Website</p>
              <p className="mt-1 truncate text-sm font-medium">{website}</p>
            </button>
          )}
          {(address || location) && (
            <button type="button" onClick={() => handleContact("address")} className="group p-6 text-center transition hover:bg-[#f8f5ef]">
              <FaLocationDot className="mx-auto text-[#a27c45]" />
              <p className="mt-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#9b9287]">Location</p>
              <p className="mt-1 line-clamp-2 text-sm font-medium">{address || location}</p>
            </button>
          )}
        </div>
      </section>

      {/* SERVICES & LINKS */}
      {visibleButtons.length > 0 && (
        <section className="relative overflow-hidden bg-gradient-to-b from-[#f8f5ef] to-[#f1eade] px-5 py-20 sm:px-8">
          <div className="pointer-events-none absolute -left-24 top-16 h-64 w-64 rounded-full border border-[#b99a6a]/15" />
          <div className="pointer-events-none absolute -right-20 bottom-0 h-72 w-72 rounded-full border border-[#b99a6a]/15" />
          <div className="relative mx-auto max-w-6xl">
            <div className="mx-auto max-w-2xl text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-[#d8c7ad] bg-white text-[#a27c45] shadow-sm">
                <FaLayerGroup />
              </span>
              <p className="mt-5 text-[11px] font-bold uppercase tracking-[0.34em] text-[#a27c45]">Discover what I offer</p>
              <h2 className="mt-3 font-serif text-4xl font-semibold tracking-tight text-[#29251f] sm:text-5xl">Services & Links</h2>
              <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#82786b]">
                Explore services, useful resources and everything you need to connect.
              </p>
              <div className="mx-auto mt-6 h-px w-20 bg-gradient-to-r from-transparent via-[#a27c45] to-transparent" />
            </div>

            <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleButtons.map((button, index) => (
                <button
                  key={button._id || button.id || index}
                  type="button"
                  onClick={() => onConfiguredButton(button)}
                  className="group relative flex min-h-[118px] items-center gap-4 overflow-hidden rounded-2xl border border-[#e4d9c8] bg-white/85 p-5 text-left shadow-[0_8px_24px_rgba(65,49,29,0.05)] backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-[#b99a6a] hover:bg-white hover:shadow-[0_18px_38px_rgba(65,49,29,0.12)] sm:p-6"
                >
                  <span className="absolute -right-5 -top-8 h-24 w-24 rounded-full bg-[#f4eee4] transition duration-300 group-hover:scale-150 group-hover:bg-[#efe3d1]" />
                  <span className="relative flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5efe5] font-serif text-lg font-semibold text-[#a27c45] transition duration-300 group-hover:bg-[#29251f] group-hover:text-white">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span className="relative min-w-0 flex-1">
                    <span className="block font-serif text-lg font-semibold text-[#332d25] transition group-hover:text-[#9a713c]">
                      {button.label || "Service"}
                    </span>
                    <span className="mt-1 block text-[10px] font-semibold uppercase tracking-[0.18em] text-[#a69a89]">
                      Explore more
                    </span>
                  </span>
                  <span className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-[#e6ddcf] text-[#a27c45] transition duration-300 group-hover:border-[#29251f] group-hover:bg-[#29251f] group-hover:text-white">
                    <FaArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {about && (
        <section className="bg-[#29251f] text-white">
          <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
            <div className="grid gap-10 lg:grid-cols-[0.65fr_1.35fr]">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#c9a66c]">About</p>
                <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">A little more about me.</h2>
              </div>
              <div className="border-l border-white/10 pl-6 lg:pl-10">
                <p className="text-sm leading-8 text-white/65 sm:text-base">{about}</p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* PRODUCTS - SINGLE ROW AUTO SLIDER */}
      {productList.length > 0 && (
        <section className="overflow-hidden py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a27c45]">
                Collection
              </p>
              <h2 className="mt-3 font-serif text-4xl">Featured Work</h2>
              <div className="mx-auto mt-5 h-px w-16 bg-[#a27c45]" />
            </div>

            <ProductAutoSlider
              productList={productList}
              getProductImages={getProductImages}
              onProductClick={onProductClick}
            />
          </div>
        </section>
      )}

      {/* GALLERY - SINGLE ROW AUTO SLIDER */}
      {galleryImages.length > 0 && (
        <section className="overflow-hidden bg-white py-16">
          <div className="mx-auto max-w-6xl px-5 sm:px-8">
            <div className="text-center">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a27c45]">Gallery</p>
              <h2 className="mt-3 font-serif text-4xl">Moments & Memories</h2>
              <div className="mx-auto mt-5 h-px w-16 bg-[#a27c45]" />
            </div>
          </div>

          <div className="elegant-marquee mt-10 overflow-hidden">
            <div className="elegant-gallery-track flex w-max gap-4 px-2 pb-3">
              {gallerySlides.map((image, index) => {
                const imageUrl = getImageUrl(image);
                const isClone = index >= galleryImages.length;
                return (
                  <button
                    key={`${image._id || image.id || index}-${isClone ? "copy" : "original"}`}
                    type="button"
                    onClick={() => onGalleryClick(image)}
                    aria-hidden={isClone ? "true" : undefined}
                    tabIndex={isClone ? -1 : 0}
                    className="group relative h-[190px] w-[220px] shrink-0 overflow-hidden rounded-xl bg-[#eee9e1] sm:h-[230px] sm:w-[280px]"
                  >
                    {imageUrl && (
                      <img src={imageUrl} alt={image.alt || "Gallery"} className="h-full w-full object-cover grayscale-[15%] transition duration-700 group-hover:scale-110 group-hover:grayscale-0" />
                    )}
                    <div className="absolute inset-0 bg-[#29251f]/0 transition group-hover:bg-[#29251f]/20" />
                  </button>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* BUSINESS HOURS */}
      {businessHours && (
        <section className="mx-auto max-w-6xl px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <FaClock className="mx-auto text-[#a27c45]" />
            <p className="mt-4 text-xs font-semibold uppercase tracking-[0.3em] text-[#a27c45]">Availability</p>
            <h2 className="mt-3 font-serif text-3xl">Working Hours</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#766e64]">{businessHours}</p>
          </div>
        </section>
      )}

      {/* SOCIAL */}
      {socialLinks.length > 0 && (
        <section className="border-y border-[#e7dfd2] bg-[#f1ece4]">
          <div className="mx-auto max-w-6xl px-5 py-14 text-center sm:px-8">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a27c45]">Social</p>
            <h2 className="mt-3 font-serif text-3xl">Connect With Me</h2>
            <div className="mt-7 flex flex-wrap justify-center gap-3">
              {socialLinks.map((social, index) => (
                <a key={social._id || social.id || index} href={social.url || "#"} target="_blank" rel="noreferrer"
                  className="flex h-12 w-12 items-center justify-center rounded-full border border-[#d8cdbd] bg-white text-[#514a41] transition hover:bg-[#29251f] hover:text-white"
                  title={social.platform || "Social"}>
                  {getSocialIcon(social.platform)}
                </a>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* QR */}
      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
        <div className="relative overflow-hidden rounded-[2rem] bg-[#29251f] px-7 py-10 text-white sm:px-10">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full border border-white/5" />
          <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full border border-white/5" />
          <div className="relative grid items-center gap-8 lg:grid-cols-[1fr_auto]">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-[#c9a66c]">Digital Card</p>
              <h2 className="mt-3 font-serif text-4xl">Share My Profile</h2>
              <p className="mt-4 max-w-xl text-sm leading-7 text-white/60">
                Scan the QR code to open this profile instantly or share it with your network.
              </p>
              <button type="button" onClick={onOpenQr}
                className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-6 py-3 text-sm font-semibold transition hover:bg-white hover:text-[#29251f]">
                <FaQrcode />Open QR
              </button>
            </div>
            <div className="flex justify-center">
              <div className="rounded-3xl bg-white p-4">
                {qrFetching ? (
                  <div className="flex h-40 w-40 items-center justify-center text-xs text-slate-400">Loading...</div>
                ) : qrTargetUrl ? (
                  <QRCodeCanvas value={qrTargetUrl} size={160} includeMargin />
                ) : (
                  <div className="flex h-40 w-40 items-center justify-center text-center text-xs text-slate-400">QR unavailable</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTACT FORM */}
      <section className="border-t border-[#e7dfd2] bg-white">
        <div className="mx-auto max-w-6xl px-5 py-16 sm:px-8">
          <div className="grid gap-10 lg:grid-cols-[0.75fr_1.25fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#a27c45]">Get In Touch</p>
              <h2 className="mt-4 font-serif text-4xl leading-tight sm:text-5xl">Let's start a conversation.</h2>
              <p className="mt-5 text-sm leading-8 text-[#766e64]">
                Have a question, project or business opportunity? Send a message and let's connect.
              </p>
            </div>
            <form onSubmit={onFormSubmit} className="border border-[#dfd6c9] bg-[#f8f5ef] p-6 sm:p-8">
              {formSubmitted ? (
                <div className="flex min-h-[300px] flex-col items-center justify-center text-center">
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#a27c45] text-white"><FaCheck /></div>
                  <h3 className="mt-5 font-serif text-2xl">Thank You</h3>
                  <p className="mt-2 text-sm text-[#766e64]">Your inquiry has been submitted successfully.</p>
                </div>
              ) : (
                <>
                  {inquirySubmitError && <div className="mb-5 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{inquirySubmitError}</div>}
                  <div className="grid gap-5 sm:grid-cols-2">
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#81786d]">Name</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Your name" className="w-full border border-[#dcd2c4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a27c45]" />
                    </div>
                    <div>
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#81786d]">Phone</label>
                      <input type="tel" value={formData.phone} onChange={(e) => setFormData((prev) => ({ ...prev, phone: e.target.value }))}
                        placeholder="Phone number" className="w-full border border-[#dcd2c4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a27c45]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#81786d]">Email</label>
                      <input type="email" value={formData.email} onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                        placeholder="Email address" className="w-full border border-[#dcd2c4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a27c45]" />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="mb-2 block text-xs font-semibold uppercase tracking-wider text-[#81786d]">Message</label>
                      <textarea rows={5} value={formData.message} onChange={(e) => setFormData((prev) => ({ ...prev, message: e.target.value }))}
                        placeholder="Write your message..." className="w-full resize-none border border-[#dcd2c4] bg-white px-4 py-3 text-sm outline-none transition focus:border-[#a27c45]" />
                    </div>
                  </div>
                  <button type="submit" disabled={inquirySubmitting}
                    className="mt-6 w-full rounded-full bg-[#29251f] px-5 py-3.5 text-sm font-semibold text-white transition hover:bg-[#a27c45] disabled:cursor-not-allowed disabled:opacity-60">
                    {inquirySubmitting ? "Sending..." : "Send Message"}
                  </button>
                </>
              )}
            </form>
          </div>
        </div>
      </section>

      {/* Footer removed */}
    </div>
  );
};

export default ElegantProfile;
