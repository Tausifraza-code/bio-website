import React, { useEffect, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaPhone,
  FaWhatsapp,
  FaEnvelope,
  FaGlobe,
  FaLocationDot,
  FaShareNodes,
  FaQrcode,
  FaArrowRight,
  FaCheck,
  FaClock,
  FaBriefcase,
  FaPlay,
  FaMoon,
  FaSun,
} from "react-icons/fa6";

const getImageUrl = (image) => {
  if (!image) return "";
  if (typeof image === "string") return image;
  return image.url || image.imageUrl || image.src || "";
};

const AutoSlider = ({ items = [], renderItem, itemKey, interval = 3500 }) => {
  const sliderRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const shouldAutoSlide = items.length > 1;

  useEffect(() => {
    if (!shouldAutoSlide) return undefined;
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % items.length);
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
    <div className="w-full">
      <div
        ref={sliderRef}
        className="flex w-full snap-x snap-mandatory gap-4 overflow-x-auto scroll-smooth pb-3"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {items.map((item, index) => (
          <div
            key={itemKey(item, index)}
            className="w-[84%] shrink-0 snap-start sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)]"
          >
            {renderItem(item, index)}
          </div>
        ))}
      </div>
      {shouldAutoSlide && (
        <div className="mt-4 flex justify-center gap-2">
          {items.map((_, index) => (
            <button
              key={index}
              type="button"
              aria-label={`Show item ${index + 1}`}
              onClick={() => setActiveIndex(index)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                activeIndex === index ? "w-8 bg-[#00cbbb]" : "w-2 bg-[#7894a8]"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

const SectionHeading = ({ eyebrow, title, dark = false, note }) => (
  <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
    <div>
      {eyebrow && (
        <p className={`text-[10px] font-black uppercase tracking-[0.24em] ${dark ? "text-[#62d8c8]" : "text-[#168f84]"}`}>
          {eyebrow}
        </p>
      )}
      <h2 className={`mt-2 text-2xl font-black tracking-[-0.04em] sm:text-3xl ${dark ? "text-white" : "text-[#142c3b]"}`}>
        {title}
      </h2>
    </div>
    {note && <p className={`max-w-xs text-xs leading-5 ${dark ? "text-white/55" : "text-[#71838b]"}`}>{note}</p>}
  </div>
);

const DigitalCard = ({
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
  const [theme, setTheme] = useState("light");
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
    industry = "Business Professional",
    businessName = "",
    businessHours = "",
    isVerified = false,
  } = businessInfo;

  const displayName = businessName || name;
  const logoImage = getImageUrl(logo);
  const profileImage = getImageUrl(avatar);
  const coverImage = getImageUrl(banner);

  const socialLabel = (platform = "") =>
    platform.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div
      data-dc-theme={theme}
      className="dc-shell min-h-screen bg-[#e9eff0] px-3 py-5 text-[#142c3b] transition-colors duration-500 sm:px-6 sm:py-10"
    >
      <style>{`
        .dc-shell {
          --dc-page:#e9eff0;
          --dc-paper:#fbfcfa;
          --dc-soft:#f4f7f3;
          --dc-muted:#eaf1ef;
          --dc-ink:#142c3b;
          --dc-copy:#647780;
          --dc-line:#dce7e2;
          --dc-accent:#00cbbb;
          --dc-accent-strong:#00b9ad;
        }
        /* Dark theme: deep navy surfaces + electric teal accents */
        .dc-shell[data-dc-theme="dark"] {
          --dc-page:#061326;
          --dc-paper:#081a2d;
          --dc-soft:#0b2035;
          --dc-muted:#0a1c30;
          --dc-ink:#f3f8ff;
          --dc-copy:#a9bdce;
          --dc-line:#173c52;
          --dc-accent:#00dfd0;
          --dc-accent-strong:#00c9c0;
          background:var(--dc-page)!important;
          color:var(--dc-ink)!important;
        }
        .dc-shell[data-dc-theme="dark"] main {
          background:var(--dc-paper)!important;
          border-color:#15374d!important;
          box-shadow:0 35px 110px rgba(0,0,0,.58)!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section {
          background:var(--dc-paper)!important;
          color:var(--dc-ink)!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section:nth-of-type(even) {
          background:var(--dc-muted)!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section h2,
        .dc-shell[data-dc-theme="dark"] main > section h3,
        .dc-shell[data-dc-theme="dark"] main > section p,
        .dc-shell[data-dc-theme="dark"] main > section span:not([class*="text-white"]) {
          color:var(--dc-ink);
        }
        .dc-shell[data-dc-theme="dark"] main > section p[class*="text-[#647780"],
        .dc-shell[data-dc-theme="dark"] main > section p[class*="text-[#71838b"],
        .dc-shell[data-dc-theme="dark"] main > section span[class*="text-[#647780"],
        .dc-shell[data-dc-theme="dark"] main > section span[class*="text-[#71838b"],
        .dc-shell[data-dc-theme="dark"] main > section span[class*="text-[#38515b"] {
          color:var(--dc-copy)!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section button:not([class*="bg-[#20b7a5"]):not([class*="bg-[#142f3d"]) {
          background:#0d2940!important;
          border-color:#19465d!important;
          color:#effaff!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section button span[class*="bg-[#e"] {
          background:#073c49!important;
          color:#00e0d0!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section a {
          background:#0d2940!important;
          border-color:#19465d!important;
          color:#eafaff!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section div.bg-white {
          background:#0d2940!important;
          border-color:#19465d!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section input,
        .dc-shell[data-dc-theme="dark"] main > section textarea {
          background:#061629!important;
          border-color:#1b465d!important;
          color:#f3f8ff!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section input::placeholder,
        .dc-shell[data-dc-theme="dark"] main > section textarea::placeholder {
          color:#7894a8!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section div[class*="border-[#"] {
          border-color:#19465d!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section button[class*="bg-[#20b7a5"],
        .dc-shell[data-dc-theme="dark"] main > section button[class*="bg-[#142f3d"] {
          background:#00d7c8!important;
          color:#032033!important;
          border-color:#00e3d5!important;
        }
        .dc-shell[data-dc-theme="dark"] main > section button[class*="bg-[#20b7a5"]:hover,
        .dc-shell[data-dc-theme="dark"] main > section button[class*="bg-[#142f3d"]:hover {
          background:#57f3e5!important;
        }
        .dc-shell[data-dc-theme="dark"] main > footer {
          background:#041020!important;
          color:#91a9bb!important;
        }
      `}</style>
      <main className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] border border-white/80 bg-[#fbfcfa] shadow-[0_28px_90px_rgba(16,42,58,0.16)]">

        {/* EDITORIAL HERO */}
        <header className="relative overflow-hidden bg-[#102b3a] text-white">
          <div className="absolute inset-0">
            {coverImage ? (
              <img src={coverImage} alt={`${displayName} cover`} className="h-full w-full object-cover object-center opacity-45" />
            ) : (
              <div className="h-full w-full bg-[radial-gradient(circle_at_80%_20%,#286b69_0%,transparent_36%),linear-gradient(125deg,#102b3a,#183d4b_58%,#1b665f)]" />
            )}
            <div className="absolute inset-0 bg-gradient-to-br from-[#0b202d]/95 via-[#102b3a]/85 to-[#102b3a]/55" />
            <div className="absolute -right-24 -top-28 h-96 w-96 rounded-full border border-[#75dfd0]/15" />
            <div className="absolute -right-10 -top-14 h-72 w-72 rounded-full border border-[#75dfd0]/20" />
            <div className="absolute bottom-0 left-0 h-1 w-2/3 bg-gradient-to-r from-[#21c3ad] via-[#21c3ad]/50 to-transparent" />
          </div>

          <div className="relative z-10 px-5 pb-9 pt-5 sm:px-9 sm:pb-12 sm:pt-7">
            {/* Brand and actions */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-[#f7fbf8] p-1.5 shadow-lg sm:h-14 sm:w-14">
                  {logoImage ? (
                    <img src={logoImage} alt={`${displayName} logo`} className="h-full w-full rounded-xl object-contain" />
                  ) : (
                    <FaBriefcase className="text-xl text-[#147e78]" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-extrabold tracking-wide text-white sm:text-base">{displayName}</p>
                  <p className="mt-0.5 truncate text-[10px] font-semibold uppercase tracking-[0.18em] text-white/55">{industry}</p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2">
                <button
                  type="button"
                  onClick={() => setTheme((current) => current === "light" ? "dark" : "light")}
                  aria-label={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                  title={`Switch to ${theme === "light" ? "dark" : "light"} theme`}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-[#102b3a] sm:h-11"
                >
                  {theme === "light" ? <FaMoon /> : <FaSun />}
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  aria-label="Share profile"
                  title="Share profile"
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-white transition hover:bg-white hover:text-[#102b3a] sm:h-11 sm:w-auto sm:gap-2 sm:px-4"
                >
                  <FaShareNodes />
                  <span className="hidden text-xs font-bold sm:inline">Share</span>
                </button>
                <button
                  type="button"
                  onClick={onOpenQr}
                  aria-label="Open QR code"
                  title="Scan QR"
                  className="flex h-10 items-center gap-2 rounded-xl bg-[#20b7a5] px-3 text-xs font-extrabold text-[#062b30] shadow-[0_8px_24px_rgba(32,183,165,0.25)] transition hover:-translate-y-0.5 hover:bg-[#52d8c7] sm:h-11 sm:px-4"
                >
                  <FaQrcode />
                  <span>Scan QR</span>
                </button>
              </div>
            </div>

            {/* Split profile layout */}
            <div className="mt-12 grid items-center gap-8 sm:mt-16 lg:grid-cols-[1fr_270px] lg:gap-10">
              <div className="order-2 min-w-0 lg:order-1">
                <div className="mb-5 inline-flex items-center gap-2 border-l-2 border-[#35cbb8] pl-3 text-[10px] font-black uppercase tracking-[0.22em] text-[#8ceadd]">
                  {industry}
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <h1 className="break-words text-4xl font-black leading-[1.04] tracking-[-0.055em] text-white sm:text-5xl lg:text-[3.6rem]">
                    {displayName}
                  </h1>
                  {isVerified && (
                    <span className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#2188f5] text-[10px] text-white ring-4 ring-[#2188f5]/20">
                      <FaCheck />
                    </span>
                  )}
                </div>
                <p className="mt-4 text-base font-semibold text-[#6edccc] sm:text-lg">{role}</p>
                {location && (
                  <p className="mt-4 flex items-center gap-2 text-xs font-medium text-white/65 sm:text-sm">
                    <FaLocationDot className="text-[#61d8c8]" /> {location}
                  </p>
                )}
                {about && (
                  <p className="mt-5 max-w-xl whitespace-pre-line text-sm leading-7 text-white/70">{about}</p>
                )}
                <div className="mt-7 flex flex-wrap gap-3">
                  {phone && (
                    <button type="button" onClick={() => onContactClick("phone")} className="inline-flex items-center gap-2 rounded-lg bg-[#20b7a5] px-5 py-3 text-xs font-black text-[#082c32] transition hover:bg-[#66e0d1]">
                      <FaPhone /> Contact <FaArrowRight className="ml-1 text-[10px]" />
                    </button>
                  )}
                  {whatsapp && (
                    <button type="button" onClick={() => onContactClick("whatsapp")} className="inline-flex items-center gap-2 rounded-lg border border-white/25 px-5 py-3 text-xs font-bold text-white transition hover:border-white hover:bg-white hover:text-[#102b3a]">
                      <FaWhatsapp /> WhatsApp
                    </button>
                  )}
                </div>
              </div>

              <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
                <div className="relative w-full max-w-[230px] sm:max-w-[270px]">
                  <div className="absolute -inset-3 rotate-[-5deg] rounded-[2rem] border border-[#5ed8c8]/45" />
                  <div className="relative overflow-hidden rounded-[1.7rem] border border-white/20 bg-[#d8e8e5] p-2 shadow-[0_25px_60px_rgba(0,0,0,0.3)]">
                    <div className="aspect-[4/4.6] overflow-hidden rounded-[1.25rem] bg-gradient-to-br from-[#d9f2ee] to-[#a9c9c7]">
                      {profileImage ? (
                        <img src={profileImage} alt={`${displayName} profile`} className="h-full w-full object-cover object-center" />
                      ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#20b7a5] to-[#137c78] text-7xl font-black text-white">
                          {displayName.charAt(0).toUpperCase()}
                        </div>
                      )}
                    </div>
                  </div>
                  {isVerified && (
                    <div className="absolute -bottom-4 -left-4 flex h-11 w-11 items-center justify-center rounded-xl border-4 border-[#102b3a] bg-[#2188f5] text-sm text-white shadow-xl">
                      <FaCheck />
                    </div>
                  )}
                  <div className="absolute -right-3 top-5 rounded-lg bg-[#f5f8f3] px-3 py-2 text-[9px] font-black uppercase tracking-[0.16em] text-[#173a43] shadow-lg">
                    Digital Profile
                  </div>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* CONTACT STRIP */}
        {(phone || whatsapp || email || website) && (
          <section className="bg-[#f4f7f3] px-5 py-6 sm:px-9">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {phone && <button type="button" onClick={() => onContactClick("phone")} className="flex items-center gap-3 rounded-xl border border-[#dce7e2] bg-white px-3 py-4 text-left transition hover:border-[#1aa391] hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e2f5f0] text-[#168f84]"><FaPhone /></span><span className="text-xs font-bold text-[#28414b]">Call</span></button>}
              {whatsapp && <button type="button" onClick={() => onContactClick("whatsapp")} className="flex items-center gap-3 rounded-xl border border-[#dce7e2] bg-white px-3 py-4 text-left transition hover:border-[#1aa391] hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e2f5f0] text-[#168f84]"><FaWhatsapp /></span><span className="text-xs font-bold text-[#28414b]">WhatsApp</span></button>}
              {email && <button type="button" onClick={() => onContactClick("email")} className="flex items-center gap-3 rounded-xl border border-[#dce7e2] bg-white px-3 py-4 text-left transition hover:border-[#1aa391] hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e2f5f0] text-[#168f84]"><FaEnvelope /></span><span className="text-xs font-bold text-[#28414b]">Email</span></button>}
              {website && <button type="button" onClick={() => onContactClick("website")} className="flex items-center gap-3 rounded-xl border border-[#dce7e2] bg-white px-3 py-4 text-left transition hover:border-[#1aa391] hover:shadow-md"><span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#e2f5f0] text-[#168f84]"><FaGlobe /></span><span className="text-xs font-bold text-[#28414b]">Website</span></button>}
            </div>
          </section>
        )}

        {/* ABOUT */}
        {about && (
          <section className="bg-[#fbfcfa] px-5 py-9 sm:px-9">
            <SectionHeading eyebrow="A little introduction" title="About" note="A closer look at the person and the work behind the business." />
            <p className="max-w-3xl whitespace-pre-line border-l-2 border-[#20b7a5] pl-5 text-sm leading-8 text-[#647780]">{about}</p>
          </section>
        )}

        {/* QUICK LINKS */}
        {visibleButtons.length > 0 && (
          <section className="bg-[#eaf1ef] px-5 py-9 sm:px-9">
            <SectionHeading eyebrow="Explore more" title="Useful Links" note="Choose a link to continue." />
            <div className="grid gap-3 sm:grid-cols-2">
              {visibleButtons.map((button, index) => (
                <button key={button._id || button.id || index} type="button" onClick={() => onConfiguredButton(button)} className="group flex items-center justify-between rounded-xl border border-[#d5e2dd] bg-[#fbfcfa] px-4 py-4 text-left transition hover:-translate-y-0.5 hover:border-[#20a997] hover:shadow-lg">
                  <span><span className="block text-sm font-extrabold text-[#183441]">{button.label}</span>{button.actionType && <span className="mt-1 block text-[10px] font-medium uppercase tracking-wider text-[#829399]">{button.actionType}</span>}</span>
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e0f3ee] text-[#168f84] transition group-hover:bg-[#168f84] group-hover:text-white"><FaArrowRight className="text-xs" /></span>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        {productList.length > 0 && (
          <section className="bg-[#142f3d] px-5 py-10 sm:px-9">
            <SectionHeading eyebrow="Selected offerings" title="Products & Services" dark note="Swipe or let the collection move automatically." />
            <AutoSlider
              items={productList}
              itemKey={(product, index) => product._id || product.id || index}
              renderItem={(product) => {
                const productImages = Array.isArray(product?.images) ? product.images.map(getImageUrl).filter(Boolean) : [];
                const firstImage = productImages[0];
                return (
                  <button type="button" onClick={() => onProductClick(product)} className="group h-full w-full overflow-hidden rounded-2xl border border-white/10 bg-[#f8faf6] text-left shadow-lg transition hover:-translate-y-1 hover:shadow-2xl">
                    {firstImage ? <img src={firstImage} alt={product.name || "Product"} className="h-44 w-full object-cover transition duration-500 group-hover:scale-105" /> : <div className="flex h-44 items-center justify-center bg-[#dff1eb] text-4xl text-[#168f84]"><FaBriefcase /></div>}
                    <div className="p-4">
                      <div className="flex items-start justify-between gap-2"><h3 className="font-black text-[#183441]">{product.name || "Product"}</h3>{product.price !== undefined && product.price !== null && product.price !== "" && <span className="whitespace-nowrap rounded-full bg-[#def3ed] px-2.5 py-1 text-[10px] font-black text-[#137d74]">{String(product.price).startsWith("₹") ? product.price : `₹${product.price}`}</span>}</div>
                      {product.description && <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#71838b]">{product.description}</p>}
                      <span className="mt-4 inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-wider text-[#168f84]">Explore <FaArrowRight /></span>
                    </div>
                  </button>
                );
              }}
            />
          </section>
        )}

        {/* GALLERY */}
        {galleryImages.length > 0 && (
          <section className="bg-[#fbfcfa] px-5 py-10 sm:px-9">
            <SectionHeading eyebrow="Visual stories" title="Gallery" note="A few moments, projects and highlights." />
            <AutoSlider
              items={galleryImages}
              itemKey={(image, index) => image._id || image.id || index}
              renderItem={(image) => (
                <button type="button" onClick={() => onGalleryClick(image)} className="group block w-full overflow-hidden rounded-2xl border border-[#dbe5e0] bg-[#e6eeea] shadow-md">
                  <img src={getImageUrl(image)} alt={image.alt || "Gallery"} className="h-52 w-full object-cover transition duration-700 group-hover:scale-105 sm:h-56" />
                </button>
              )}
            />
          </section>
        )}

        {/* BUSINESS INFORMATION */}
        {(address || businessHours) && (
          <section className="bg-[#eaf1ef] px-5 py-9 sm:px-9">
            <SectionHeading eyebrow="Find and visit" title="Business Information" />
            <div className="grid gap-3 sm:grid-cols-2">
              {address && <button type="button" onClick={() => onContactClick("address")} className="flex items-start gap-3 rounded-xl border border-[#d5e2dd] bg-white p-5 text-left transition hover:border-[#20a997]"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0f3ee] text-[#168f84]"><FaLocationDot /></span><span className="text-xs leading-6 text-[#647780]">{address}</span></button>}
              {businessHours && <div className="flex items-start gap-3 rounded-xl border border-[#d5e2dd] bg-white p-5"><span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#e0f3ee] text-[#168f84]"><FaClock /></span><p className="whitespace-pre-line text-xs leading-6 text-[#647780]">{businessHours}</p></div>}
            </div>
          </section>
        )}

        {/* SOCIAL LINKS */}
        {socialLinks.length > 0 && (
          <section className="bg-[#fbfcfa] px-5 py-9 sm:px-9">
            <SectionHeading eyebrow="Stay connected" title="Follow Along" />
            <div className="flex flex-wrap gap-2">
              {socialLinks.map((social, index) => (
                <a key={social._id || social.id || index} href={social.url || "#"} target="_blank" rel="noreferrer" className="rounded-lg border border-[#dce6e1] bg-white px-4 py-3 text-xs font-bold text-[#38515b] transition hover:border-[#20a997] hover:bg-[#e8f6f1] hover:text-[#137d74]">
                  {socialLabel(social.platform || "Social")}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* QR CODE */}
        {qrTargetUrl && (
          <section className="bg-[#dff0eb] px-5 py-10 text-center sm:px-9">
            <div className="mx-auto max-w-md rounded-[1.6rem] border border-white/80 bg-[#fbfcfa] px-6 py-8 shadow-[0_18px_50px_rgba(20,58,61,0.1)]">
              <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#168f84]">Keep in touch</p>
              <h2 className="mt-2 text-2xl font-black tracking-tight text-[#142f3d]">Save this digital card</h2>
              <p className="mt-2 text-xs text-[#71838b]">Scan the code to open this profile anytime.</p>
              <div className="mx-auto mt-5 inline-flex rounded-2xl border border-[#e2ebe6] bg-white p-4 shadow-sm">
                {qrFetching ? <div className="flex h-40 w-40 items-center justify-center text-xs text-[#71838b]">Loading QR...</div> : <QRCodeCanvas value={qrTargetUrl} size={160} includeMargin level="H" />}
              </div>
              <div><button type="button" onClick={onOpenQr} className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[#142f3d] px-5 py-3 text-xs font-black text-white transition hover:bg-[#168f84]"><FaQrcode /> Open QR Code</button></div>
            </div>
          </section>
        )}

        {/* INQUIRY */}
        <section className="bg-[#fbfcfa] px-5 py-10 sm:px-9">
          <div className="grid overflow-hidden rounded-[1.7rem] bg-[#102b3a] lg:grid-cols-[0.8fr_1.2fr]">
            <div className="relative flex flex-col justify-between overflow-hidden p-6 sm:p-8">
              <div className="absolute -bottom-16 -left-12 h-52 w-52 rounded-full border border-[#5ed8c8]/20" />
              <div className="relative">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-[#62d8c8]">Let's talk</p>
                <h2 className="mt-3 text-3xl font-black leading-tight text-white">Have a project in mind?</h2>
                <p className="mt-3 text-xs leading-6 text-white/55">Send a message and start a conversation.</p>
              </div>
              <div className="relative mt-8 flex items-center gap-2 text-xs font-bold text-[#7de1d3]"><FaPlay className="text-[9px]" /> {displayName}</div>
            </div>
            <div className="bg-[#173746] p-5 sm:p-8">
              {formSubmitted ? (
                <div className="flex min-h-52 flex-col items-center justify-center rounded-xl border border-[#5ed8c8]/20 bg-white/5 p-6 text-center">
                  <FaCheck className="text-3xl text-[#62d8c8]" />
                  <p className="mt-3 font-black text-white">Message sent successfully!</p>
                </div>
              ) : (
                <form onSubmit={onFormSubmit} className="space-y-3">
                  <div className="grid gap-3 sm:grid-cols-2">
                    <input type="text" placeholder="Your Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#62d8c8]" />
                    <input type="text" placeholder="Phone Number" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#62d8c8]" />
                  </div>
                  <input type="email" placeholder="Email Address" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#62d8c8]" />
                  <textarea rows="4" placeholder="Your Message" value={formData.message} onChange={(e) => setFormData({ ...formData, message: e.target.value })} className="w-full resize-none rounded-lg border border-white/10 bg-white/[0.07] px-4 py-3 text-xs text-white outline-none placeholder:text-white/40 focus:border-[#62d8c8]" />
                  {inquirySubmitError && <p className="rounded-lg border border-red-300/20 bg-red-400/10 px-3 py-2 text-xs text-red-200">{inquirySubmitError}</p>}
                  <button type="submit" disabled={inquirySubmitting} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#20b7a5] px-5 py-3.5 text-xs font-black text-[#082c32] transition hover:bg-[#62d8c8] disabled:cursor-not-allowed disabled:opacity-60">
                    {inquirySubmitting ? "Sending..." : "Send Inquiry"} {!inquirySubmitting && <FaArrowRight />}
                  </button>
                </form>
              )}
            </div>
          </div>
        </section>

        <footer className="flex flex-col items-center justify-between gap-2 bg-[#0c2431] px-5 py-6 text-center text-[10px] text-white/45 sm:flex-row sm:px-9 sm:text-left">
          <span>© {new Date().getFullYear()} {displayName}. All rights reserved.</span>
          <span className="font-bold uppercase tracking-[0.18em] text-[#68d8c9]">Digital Business Card</span>
        </footer>
      </main>
    </div>
  );
};

export default DigitalCard;
