import React, { useEffect, useRef, useState, useCallback } from "react";
import { QRCodeCanvas } from "qrcode.react";
import {
  FaArrowRight,
  FaCheck,
  FaClock,
  FaEnvelope,
  FaGlobe,
  FaLocationDot,
  FaPhone,
  FaWhatsapp,
  FaShareNodes,
  FaQrcode,
  FaBriefcase,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa6";

/* ============================================================
   Hook: responsive visible count
   ============================================================ */
function useVisibleCount(desktop = 3) {
  const getCount = () => {
    if (typeof window === "undefined") return desktop;
    const w = window.innerWidth;
    if (w < 640) return 1;      // mobile → 1 card
    if (w < 1024) return 2;     // tablet → 2 cards
    return desktop;             // desktop → 3 or 4
  };
  const [count, setCount] = useState(getCount);

  useEffect(() => {
    const onResize = () => setCount(getCount());
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return count;
}

/* ============================================================
   Infinite Auto-Slide Carousel (responsive)
   ============================================================ */
function AutoRow({ items, renderItem, desktopVisible = 3, interval = 3000 }) {
  const visible = useVisibleCount(desktopVisible);
  const total = items.length;
  const step = 100 / visible;

  const loopItems = total > 1 ? [...items, ...items, ...items] : items;
  const startIndex = total > 1 ? total : 0;

  const [index, setIndex] = useState(startIndex);
  const [animate, setAnimate] = useState(true);
  const paused = useRef(false);

  // Reset position when visible count changes (breakpoint switch)
  useEffect(() => {
    if (total <= 1) return;
    setAnimate(false);
    setIndex(total);
    const raf = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(raf);
  }, [visible, total]);

  // Auto-advance
  useEffect(() => {
    if (total <= 1) return;
    const id = setInterval(() => {
      if (!paused.current) setIndex((i) => i + 1);
    }, interval);
    return () => clearInterval(id);
  }, [total, interval]);

  // Snap back when entering clone zone
  useEffect(() => {
    if (total <= 1) return;
    const id = setTimeout(() => {
      if (index >= total * 2) {
        setAnimate(false);
        setIndex(index - total);
      } else if (index < total) {
        setAnimate(false);
        setIndex(index + total);
      }
    }, 720);
    return () => clearTimeout(id);
  }, [index, total]);

  // Re-enable animation after snap
  useEffect(() => {
    if (!animate) {
      const raf = requestAnimationFrame(() => setAnimate(true));
      return () => cancelAnimationFrame(raf);
    }
  }, [animate]);

  const next = useCallback(() => {
    if (total <= 1) return;
    paused.current = true;
    setIndex((i) => i + 1);
    setTimeout(() => (paused.current = false), 400);
  }, [total]);

  const prev = useCallback(() => {
    if (total <= 1) return;
    paused.current = true;
    setIndex((i) => i - 1);
    setTimeout(() => (paused.current = false), 400);
  }, [total]);

  return (
    <div
      className="relative"
      onMouseEnter={() => (paused.current = true)}
      onMouseLeave={() => (paused.current = false)}
    >
      <div className="overflow-hidden">
        <div
          className="flex gap-4 sm:gap-5"
          style={{
            transform: `translateX(-${index * step}%)`,
            transition: animate
              ? "transform 700ms cubic-bezier(0.4,0,0.2,1)"
              : "none",
          }}
        >
          {loopItems.map((item, i) => (
            <div
              key={`${item._id || item.id || i}-${i}`}
              className="shrink-0"
              style={{
                width: `calc(${step}% - ${visible === 1 ? "0rem" : "1rem"})`,
              }}
            >
              {renderItem(item, i)}
            </div>
          ))}
        </div>
      </div>

      {total > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute -left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-lime-300 shadow-lg transition hover:bg-slate-800 sm:-left-3 sm:h-10 sm:w-10"
            aria-label="Previous"
          >
            <FaChevronLeft />
          </button>
          <button
            onClick={next}
            className="absolute -right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-slate-900/90 text-lime-300 shadow-lg transition hover:bg-slate-800 sm:-right-3 sm:h-10 sm:w-10"
            aria-label="Next"
          >
            <FaChevronRight />
          </button>
        </>
      )}
    </div>
  );
}

/* ---------------- Main Component ---------------- */
const ServicePro = ({
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
    role = "Professional Service Provider",
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
  const heroImg = banner || avatar || logo;

  const getSocialLabel = (platform = "") =>
    platform.replace(/[-_]/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 selection:bg-lime-400 selection:text-slate-900">
      {/* ============ HERO ============ */}
      <section className="relative overflow-hidden px-5 pt-8 pb-16 sm:px-8">
        <div className="pointer-events-none absolute -top-40 -right-40 h-96 w-96 rounded-full bg-lime-400/20 blur-[120px]" />
        <div className="pointer-events-none absolute -bottom-40 -left-40 h-96 w-96 rounded-full bg-emerald-500/10 blur-[120px]" />

        <div className="relative mx-auto max-w-6xl">
          <div className="grid items-stretch gap-5 lg:grid-cols-3">
            <div className="flex flex-col justify-center rounded-[2rem] border border-white/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 p-8 sm:p-10 lg:col-span-2">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-lime-400/30 bg-lime-400/10 px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-lime-300">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-lime-400" />
                {industry}
              </span>

              <div className="mt-6 flex flex-wrap items-center gap-3">
                <h1 className="text-4xl font-black leading-[1.05] tracking-tight text-white sm:text-6xl">
                  {displayName}
                </h1>
                {isVerified && (
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-lime-400 text-slate-900">
                    <FaCheck className="text-sm" />
                  </span>
                )}
              </div>

              <p className="mt-3 text-lg font-semibold text-lime-300/90">{role}</p>

              {location && (
                <p className="mt-4 flex items-center gap-2 text-sm text-slate-400">
                  <FaLocationDot className="text-lime-400" /> {location}
                </p>
              )}

              {about && (
                <p className="mt-6 max-w-xl text-sm leading-7 text-slate-400">{about}</p>
              )}

              <div className="mt-8 flex flex-wrap gap-3">
                {phone && (
                  <button
                    onClick={() => onContactClick("phone")}
                    className="group flex items-center gap-2 rounded-full bg-lime-400 px-6 py-3 text-sm font-black text-slate-900 transition hover:bg-lime-300"
                  >
                    <FaPhone />
                    Call Now
                    <FaArrowRight className="transition group-hover:translate-x-1" />
                  </button>
                )}
                {whatsapp && (
                  <button
                    onClick={() => onContactClick("whatsapp")}
                    className="flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3 text-sm font-bold text-white backdrop-blur transition hover:border-lime-400/50 hover:bg-white/10"
                  >
                    <FaWhatsapp /> WhatsApp
                  </button>
                )}
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[2rem] border border-white/10 lg:h-full">
              {heroImg ? (
                <img
                  src={heroImg}
                  alt={displayName}
                  className="h-64 w-full object-cover sm:h-80 lg:absolute lg:inset-0 lg:h-full"
                />
              ) : (
                <div className="flex h-64 w-full items-center justify-center bg-gradient-to-br from-emerald-700 to-slate-900 text-7xl font-black text-lime-300 sm:h-80 lg:h-full">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="absolute right-3 top-3 z-10 flex gap-2">
                <button
                  onClick={onShare}
                  aria-label="Share"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-950/70 text-lime-300 backdrop-blur transition hover:bg-slate-950"
                >
                  <FaShareNodes />
                </button>
                <button
                  onClick={onOpenQr}
                  aria-label="QR"
                  className="flex h-11 w-11 items-center justify-center rounded-full bg-lime-400 text-slate-900 transition hover:bg-lime-300"
                >
                  <FaQrcode />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ CONTACT STRIP ============ */}
      <section className="px-5 sm:px-8">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { key: "phone", icon: <FaPhone />, label: "Phone", value: phone },
              { key: "email", icon: <FaEnvelope />, label: "Email", value: email },
              { key: "website", icon: <FaGlobe />, label: "Website", value: website },
              { key: "address", icon: <FaLocationDot />, label: "Address", value: address },
            ]
              .filter((c) => c.value)
              .map((c) => (
                <button
                  key={c.key}
                  onClick={() => onContactClick(c.key)}
                  className="group flex items-start gap-3 rounded-2xl border border-white/10 bg-slate-900/60 p-4 text-left transition hover:border-lime-400/40 hover:bg-slate-900"
                >
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-lime-400/10 text-lime-300 transition group-hover:bg-lime-400 group-hover:text-slate-900">
                    {c.icon}
                  </span>
                  <div className="min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-wider text-slate-500">
                      {c.label}
                    </p>
                    <p className="mt-0.5 truncate text-sm font-bold text-white">{c.value}</p>
                  </div>
                </button>
              ))}
          </div>
        </div>
      </section>

      {/* ============ QUICK LINKS ============ */}
      {visibleButtons.length > 0 && (
        <section className="px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6 flex items-end justify-between gap-4">
              <div>
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                  Quick Access
                </p>
                <h2 className="mt-2 text-3xl font-black text-white">Explore Services</h2>
              </div>
            </div>

            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {visibleButtons.map((button, index) => (
                <button
                  key={button._id || button.id || index}
                  onClick={() => onConfiguredButton(button)}
                  className="group flex items-center justify-between rounded-2xl border border-white/10 bg-slate-900/50 p-5 text-left transition hover:-translate-y-1 hover:border-lime-400/50 hover:bg-slate-900"
                >
                  <div>
                    <p className="font-black text-white">{button.label}</p>
                    {button.actionType && (
                      <p className="mt-1 text-xs text-slate-500">{button.actionType}</p>
                    )}
                  </div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-lime-400/10 text-lime-300 transition group-hover:bg-lime-400 group-hover:text-slate-900">
                    <FaArrowRight />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ============ PRODUCTS (responsive 1/2/3) ============ */}
      {productList.length > 0 && (
        <section className="px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                What We Do
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">Products & Services</h2>
            </div>

            <AutoRow
              items={productList}
              desktopVisible={3}
              renderItem={(product) => (
                <button
                  onClick={() => onProductClick(product)}
                  className="group block w-full overflow-hidden rounded-3xl border border-white/10 bg-slate-900/60 text-left transition hover:border-lime-400/40 hover:bg-slate-900"
                >
                  <div className="h-48 overflow-hidden sm:h-40">
                    {product?.images?.[0]?.url ? (
                      <img
                        src={product.images[0].url}
                        alt={product.name || "Service"}
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center bg-emerald-900/40 text-4xl text-lime-300">
                        <FaBriefcase />
                      </div>
                    )}
                  </div>
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black text-white">{product.name || "Service"}</h3>
                      {product.price && (
                        <span className="whitespace-nowrap rounded-md bg-lime-400 px-2 py-0.5 text-[10px] font-black text-slate-900">
                          {product.price}
                        </span>
                      )}
                    </div>
                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-slate-500">
                        {product.description}
                      </p>
                    )}
                  </div>
                </button>
              )}
            />
          </div>
        </section>
      )}

      {/* ============ GALLERY (responsive 1/2/4) ============ */}
      {galleryImages.length > 0 && (
        <section className="px-5 py-14 sm:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="mb-6">
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">Recent Work</h2>
            </div>

            <AutoRow
              items={galleryImages}
              desktopVisible={4}
              renderItem={(image) => (
                <button
                  onClick={() => onGalleryClick(image)}
                  className="group block w-full overflow-hidden rounded-2xl border border-white/10"
                >
                  <img
                    src={image.url}
                    alt={image.alt || "Gallery"}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </button>
              )}
            />
          </div>
        </section>
      )}

      {/* ============ ABOUT + HOURS + SOCIAL ============ */}
      {(about || businessHours || socialLinks.length > 0) && (
        <section className="px-5 py-14 sm:px-8">
          <div className="mx-auto grid max-w-6xl gap-5 lg:grid-cols-3">
            {about && (
              <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7 lg:col-span-2">
                <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                  Who We Are
                </p>
                <h2 className="mt-2 text-2xl font-black text-white">About Our Business</h2>
                <p className="mt-4 text-sm leading-7 text-slate-400">{about}</p>
              </div>
            )}

            <div className="flex flex-col gap-5">
              {businessHours && (
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-300">
                      <FaClock />
                    </span>
                    <h3 className="font-black text-white">Hours</h3>
                  </div>
                  <p className="mt-4 whitespace-pre-line text-sm leading-6 text-slate-400">
                    {businessHours}
                  </p>
                </div>
              )}

              {socialLinks.length > 0 && (
                <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-7">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-lime-400/10 text-lime-300">
                      <FaShareNodes />
                    </span>
                    <h3 className="font-black text-white">Connect</h3>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {socialLinks.map((s, i) => (
                      <a
                        key={s._id || s.id || i}
                        href={s.url}
                        target="_blank"
                        rel="noreferrer"
                        className="rounded-full border border-white/10 px-3 py-1.5 text-xs font-bold text-slate-300 transition hover:border-lime-400/50 hover:text-lime-300"
                      >
                        {getSocialLabel(s.platform || "Social")}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ QR STRIP ============ */}
      {qrTargetUrl && (
        <section className="px-5 py-10 sm:px-8">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-6 rounded-[2rem] border border-lime-400/20 bg-gradient-to-r from-lime-400/10 via-transparent to-emerald-500/10 p-8 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
                Digital Profile
              </p>
              <h2 className="mt-2 text-2xl font-black text-white">Scan. Connect. Instantly.</h2>
              <p className="mt-2 max-w-md text-sm text-slate-400">
                Scan the QR to open our profile with all contact details.
              </p>
            </div>
            <div className="rounded-2xl bg-white p-3 shadow-2xl">
              {qrFetching ? (
                <div className="flex h-32 w-32 items-center justify-center text-xs text-slate-500">
                  Loading...
                </div>
              ) : (
                <QRCodeCanvas value={qrTargetUrl} size={128} includeMargin level="H" />
              )}
            </div>
          </div>
        </section>
      )}

      {/* ============ INQUIRY FORM ============ */}
      <section className="px-5 py-14 sm:px-8">
        <div className="mx-auto max-w-3xl rounded-[2rem] border border-white/10 bg-slate-900/60 p-6 sm:p-10">
          <p className="text-[11px] font-black uppercase tracking-[0.25em] text-lime-400">
            Contact
          </p>
          <h2 className="mt-2 text-3xl font-black text-white">Request a Service</h2>
          <p className="mt-2 text-sm text-slate-500">
            Tell us what you need. We will get back to you.
          </p>

          {formSubmitted ? (
            <div className="mt-8 rounded-2xl border border-lime-400/30 bg-lime-400/10 p-7 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-lime-400 text-xl text-slate-900">
                <FaCheck />
              </span>
              <h3 className="mt-4 text-xl font-black text-lime-300">Inquiry Submitted!</h3>
              <p className="mt-2 text-sm text-slate-400">Thank you for contacting us.</p>
            </div>
          ) : (
            <form onSubmit={onFormSubmit} className="mt-8 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lime-400"
                />
                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lime-400"
                />
              </div>
              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lime-400"
              />
              <textarea
                rows="5"
                placeholder="Describe your requirements..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/70 px-4 py-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-lime-400"
              />
              {inquirySubmitError && (
                <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm text-red-400">
                  {inquirySubmitError}
                </p>
              )}
              <button
                type="submit"
                disabled={inquirySubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-lime-400 px-5 py-4 text-sm font-black text-slate-900 transition hover:bg-lime-300 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inquirySubmitting ? "Submitting..." : "Submit Inquiry"}
                {!inquirySubmitting && <FaArrowRight />}
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};

export default ServicePro;