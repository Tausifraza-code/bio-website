import React from "react";
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

  const getSocialName = (platform = "") => {
    return platform
      .replace(/_/g, " ")
      .replace(/-/g, " ")
      .replace(/\b\w/g, (char) => char.toUpperCase());
  };

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-[#102033]">
      {/* =========================================================
          TOP BAR
      ========================================================= */}
      <header className="sticky top-0 z-40 border-b border-[#dce5ef] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">
          <div className="flex min-w-0 items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={displayName}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#102033] text-white">
                <FaBriefcase />
              </div>
            )}

            <div className="min-w-0">
              <p className="truncate text-sm font-bold text-[#102033]">
                {displayName}
              </p>
              <p className="truncate text-xs text-[#718096]">{industry}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onShare}
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#dce5ef] bg-white text-[#102033] transition hover:bg-[#102033] hover:text-white"
              aria-label="Share"
            >
              <FaShareNodes />
            </button>

            <button
              type="button"
              onClick={onOpenQr}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#1db6a5] text-white transition hover:bg-[#159888]"
              aria-label="QR Code"
            >
              <FaQrcode />
            </button>
          </div>
        </div>
      </header>

      {/* =========================================================
          HERO
      ========================================================= */}
      <section className="relative overflow-hidden bg-[#102033]">
        <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-[#1db6a5]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#4b7bec]/20 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-[1.2fr_0.8fr] md:items-center md:py-20">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-semibold text-[#b9fff7]">
              <span className="h-2 w-2 rounded-full bg-[#1db6a5]" />
              {industry}
            </div>

            <div className="mb-5 flex items-center gap-2">
              <h1 className="text-4xl font-black tracking-tight text-white sm:text-5xl md:text-6xl">
                {displayName}
              </h1>

              {isVerified && (
                <span className="mt-2 flex h-6 w-6 items-center justify-center rounded-full bg-[#1db6a5] text-xs text-white">
                  <FaCheck />
                </span>
              )}
            </div>

            <p className="max-w-2xl text-lg font-medium text-[#b8c5d4]">
              {role}
            </p>

            {location && (
              <div className="mt-4 flex items-center gap-2 text-sm text-[#9eafc1]">
                <FaLocationDot className="text-[#1db6a5]" />
                {location}
              </div>
            )}

            {about && (
              <p className="mt-6 max-w-2xl text-sm leading-7 text-[#aebdcd]">
                {about}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {phone && (
                <button
                  type="button"
                  onClick={() => onContactClick("phone")}
                  className="inline-flex items-center gap-2 rounded-xl bg-[#1db6a5] px-5 py-3 text-sm font-bold text-white transition hover:bg-[#159888]"
                >
                  <FaPhone />
                  Contact Me
                </button>
              )}

              {whatsapp && (
                <button
                  type="button"
                  onClick={() => onContactClick("whatsapp")}
                  className="inline-flex items-center gap-2 rounded-xl border border-white/20 bg-white/10 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/15"
                >
                  <FaWhatsapp />
                  WhatsApp
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="relative">
              <div className="absolute inset-0 rounded-[2rem] bg-[#1db6a5]/20 blur-2xl" />

              <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl">
                {banner ? (
                  <img
                    src={banner}
                    alt={displayName}
                    className="h-72 w-72 rounded-[1.5rem] object-cover sm:h-80 sm:w-80"
                  />
                ) : avatar ? (
                  <img
                    src={avatar}
                    alt={displayName}
                    className="h-72 w-72 rounded-[1.5rem] object-cover sm:h-80 sm:w-80"
                  />
                ) : (
                  <div className="flex h-72 w-72 items-center justify-center rounded-[1.5rem] bg-[#1db6a5] text-7xl font-black text-white sm:h-80 sm:w-80">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================
          CONTACT INFO
      ========================================================= */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {phone && (
            <button
              type="button"
              onClick={() => onContactClick("phone")}
              className="group rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaPhone className="mb-4 text-[#1db6a5]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8190a0]">
                Phone
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#102033]">
                {phone}
              </p>
            </button>
          )}

          {email && (
            <button
              type="button"
              onClick={() => onContactClick("email")}
              className="group rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaEnvelope className="mb-4 text-[#1db6a5]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8190a0]">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#102033]">
                {email}
              </p>
            </button>
          )}

          {website && (
            <button
              type="button"
              onClick={() => onContactClick("website")}
              className="group rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaGlobe className="mb-4 text-[#1db6a5]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8190a0]">
                Website
              </p>
              <p className="mt-1 truncate text-sm font-bold text-[#102033]">
                {website}
              </p>
            </button>
          )}

          {address && (
            <button
              type="button"
              onClick={() => onContactClick("address")}
              className="group rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaLocationDot className="mb-4 text-[#1db6a5]" />
              <p className="text-xs font-semibold uppercase tracking-wider text-[#8190a0]">
                Location
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-bold text-[#102033]">
                {address}
              </p>
            </button>
          )}
        </div>
      </section>

      {/* =========================================================
          CONFIGURED BUTTONS
      ========================================================= */}
      {visibleButtons.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 pb-12">
          <div className="mb-6">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1db6a5]">
              Quick Access
            </p>
            <h2 className="mt-2 text-2xl font-black text-[#102033]">
              Explore More
            </h2>
          </div>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {visibleButtons.map((button, index) => (
              <button
                key={button._id || button.id || index}
                type="button"
                onClick={() => onConfiguredButton(button)}
                className="group flex items-center justify-between rounded-2xl border border-[#dce5ef] bg-white p-5 text-left shadow-sm transition hover:border-[#1db6a5] hover:shadow-lg"
              >
                <span>
                  <span className="block text-sm font-bold text-[#102033]">
                    {button.label}
                  </span>

                  {button.actionType && (
                    <span className="mt-1 block text-xs text-[#8795a5]">
                      {button.actionType}
                    </span>
                  )}
                </span>

                <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#e8f8f5] text-[#1db6a5] transition group-hover:bg-[#1db6a5] group-hover:text-white">
                  <FaArrowRight />
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* =========================================================
          ABOUT
      ========================================================= */}
      {about && (
        <section className="border-y border-[#dce5ef] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="grid gap-8 md:grid-cols-[0.35fr_0.65fr]">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1db6a5]">
                  About
                </p>

                <h2 className="mt-3 text-3xl font-black text-[#102033]">
                  About {name}
                </h2>
              </div>

              <div>
                <p className="text-base leading-8 text-[#64748b]">
                  {about}
                </p>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          PRODUCTS / SERVICES
      ========================================================= */}
      {productList.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#1db6a5]">
                Services
              </p>
              <h2 className="mt-2 text-3xl font-black text-[#102033]">
                What I Offer
              </h2>
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {productList.map((product, index) => {
              const image = product?.images?.[0]?.url;

              return (
                <button
                  key={product._id || index}
                  type="button"
                  onClick={() => onProductClick(product)}
                  className="group overflow-hidden rounded-2xl border border-[#dce5ef] bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {image ? (
                    <img
                      src={image}
                      alt={product.name || "Service"}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-[#e8f8f5] text-4xl text-[#1db6a5]">
                      <FaBriefcase />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black text-[#102033]">
                        {product.name || "Service"}
                      </h3>

                      {product.price && (
                        <span className="whitespace-nowrap rounded-lg bg-[#e8f8f5] px-3 py-1 text-xs font-black text-[#159888]">
                          {product.price}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#718096]">
                        {product.description}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-[#1db6a5]">
                      View Details
                      <FaArrowRight className="text-xs" />
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      )}

      {/* =========================================================
          GALLERY
      ========================================================= */}
      {galleryImages.length > 0 && (
        <section className="bg-[#102033]">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <div className="mb-8">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5de7d7]">
                Portfolio
              </p>
              <h2 className="mt-2 text-3xl font-black text-white">
                Recent Work
              </h2>
            </div>

            <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image._id || image.id || index}
                  type="button"
                  onClick={() => onGalleryClick(image)}
                  className="group overflow-hidden rounded-2xl"
                >
                  <img
                    src={image.url}
                    alt={image.alt || "Gallery image"}
                    className="aspect-square w-full object-cover transition duration-500 group-hover:scale-110"
                  />
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          SOCIAL + BUSINESS HOURS
      ========================================================= */}
      <section className="mx-auto grid max-w-6xl gap-5 px-5 py-14 md:grid-cols-2">
        {businessHours && (
          <div className="rounded-3xl border border-[#dce5ef] bg-white p-7 shadow-sm">
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#e8f8f5] text-[#1db6a5]">
                <FaClock />
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-wider text-[#8190a0]">
                  Availability
                </p>
                <h3 className="text-xl font-black text-[#102033]">
                  Business Hours
                </h3>
              </div>
            </div>

            <p className="whitespace-pre-line text-sm leading-7 text-[#64748b]">
              {businessHours}
            </p>
          </div>
        )}

        {socialLinks.length > 0 && (
          <div className="rounded-3xl border border-[#dce5ef] bg-white p-7 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wider text-[#1db6a5]">
              Connect
            </p>

            <h3 className="mt-2 text-xl font-black text-[#102033]">
              Find Me Online
            </h3>

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social._id || social.id || index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#dce5ef] bg-[#f8fafc] px-4 py-3 text-sm font-bold text-[#102033] transition hover:border-[#1db6a5] hover:text-[#1db6a5]"
                >
                  {getSocialName(social.platform || "Social")}
                </a>
              ))}
            </div>
          </div>
        )}
      </section>

      {/* =========================================================
          QR SECTION
      ========================================================= */}
      {qrTargetUrl && (
        <section className="bg-[#e8f8f5]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-7 px-5 py-14 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#159888]">
                Digital Profile
              </p>

              <h2 className="mt-2 text-3xl font-black text-[#102033]">
                Scan & Save My Profile
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-6 text-[#64748b]">
                Scan this QR code to open this digital profile and connect
                directly.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-xl">
              {qrFetching ? (
                <div className="flex h-40 w-40 items-center justify-center text-sm font-semibold text-[#718096]">
                  Loading...
                </div>
              ) : (
                <QRCodeCanvas
                  value={qrTargetUrl}
                  size={160}
                  includeMargin
                  level="H"
                />
              )}
            </div>
          </div>
        </section>
      )}

      {/* =========================================================
          INQUIRY FORM
      ========================================================= */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="rounded-[2rem] bg-[#102033] p-6 shadow-2xl sm:p-10">
          <div className="mb-8">
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#5de7d7]">
              Get In Touch
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Let's Work Together
            </h2>

            <p className="mt-3 text-sm leading-6 text-[#aebdcd]">
              Send your details and message. We will get back to you soon.
            </p>
          </div>

          {formSubmitted ? (
            <div className="rounded-2xl border border-[#1db6a5]/30 bg-[#1db6a5]/10 p-6 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#1db6a5] text-xl text-white">
                <FaCheck />
              </div>

              <h3 className="mt-4 text-xl font-black text-white">
                Message Sent Successfully
              </h3>

              <p className="mt-2 text-sm text-[#b8c5d4]">
                Thank you for reaching out.
              </p>
            </div>
          ) : (
            <form onSubmit={onFormSubmit} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      name: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#8190a0] focus:border-[#1db6a5]"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      phone: e.target.value,
                    })
                  }
                  className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#8190a0] focus:border-[#1db6a5]"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    email: e.target.value,
                  })
                }
                className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#8190a0] focus:border-[#1db6a5]"
              />

              <textarea
                rows="5"
                placeholder="Write your message..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                className="w-full resize-none rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white outline-none placeholder:text-[#8190a0] focus:border-[#1db6a5]"
              />

              {inquirySubmitError && (
                <p className="rounded-xl border border-red-400/20 bg-red-400/10 px-4 py-3 text-sm text-red-300">
                  {inquirySubmitError}
                </p>
              )}

              <button
                type="submit"
                disabled={inquirySubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#1db6a5] px-5 py-3.5 text-sm font-black text-white transition hover:bg-[#159888] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inquirySubmitting ? "Sending..." : "Send Inquiry"}
                {!inquirySubmitting && <FaArrowRight />}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* =========================================================
          FOOTER
      ========================================================= */}
      <footer className="border-t border-[#dce5ef] bg-white">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-5 py-7 text-center text-sm text-[#718096] sm:flex-row sm:items-center sm:justify-between sm:text-left">
          <p>
            © {new Date().getFullYear()} {displayName}. All rights reserved.
          </p>

          <div className="flex items-center justify-center gap-2">
            <FaStar className="text-[#1db6a5]" />
            <span>Digital Business Profile</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AgencyPro;