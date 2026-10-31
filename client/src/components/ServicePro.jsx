import React from "react";
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
  FaStar,
} from "react-icons/fa6";

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

  const getSocialLabel = (platform = "") =>
    platform
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="min-h-screen bg-[#f5f7f6] text-[#1d302b]">

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-[#e4ebe7] bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-5 py-4">

          <div className="flex min-w-0 items-center gap-3">
            {logo ? (
              <img
                src={logo}
                alt={displayName}
                className="h-11 w-11 rounded-xl object-cover"
              />
            ) : (
              <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#176b52] text-white">
                <FaBriefcase />
              </div>
            )}

            <div className="min-w-0">
              <h2 className="truncate text-sm font-black">
                {displayName}
              </h2>
              <p className="truncate text-xs text-[#81928a]">
                {industry}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onShare}
              aria-label="Share profile"
              className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#e2eae5] transition hover:bg-[#f0f7f3]"
            >
              <FaShareNodes />
            </button>

            <button
              type="button"
              onClick={onOpenQr}
              aria-label="Open QR code"
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#176b52] text-white transition hover:bg-[#125640]"
            >
              <FaQrcode />
            </button>
          </div>
        </div>
      </header>

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#153d31]">
        <div className="absolute -right-32 -top-32 h-96 w-96 rounded-full bg-[#4caa7c]/20 blur-3xl" />
        <div className="absolute -bottom-40 -left-32 h-96 w-96 rounded-full bg-[#b2d7b8]/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-2 md:items-center md:py-20">

          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-2 text-xs font-bold text-[#b9e7ca]">
              <span className="h-2 w-2 rounded-full bg-[#74d69b]" />
              {industry}
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              <h1 className="text-4xl font-black leading-tight text-white sm:text-5xl">
                {displayName}
              </h1>

              {isVerified && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#74d69b] text-xs text-[#153d31]">
                  <FaCheck />
                </span>
              )}
            </div>

            <p className="mt-4 text-lg font-semibold text-[#b9d4c5]">
              {role}
            </p>

            {location && (
              <p className="mt-4 flex items-center gap-2 text-sm text-[#b0c9bb]">
                <FaLocationDot className="text-[#74d69b]" />
                {location}
              </p>
            )}

            {about && (
              <p className="mt-6 max-w-xl text-sm leading-7 text-[#c0d4c9]">
                {about}
              </p>
            )}

            <div className="mt-8 flex flex-wrap gap-3">
              {phone && (
                <button
                  type="button"
                  onClick={() => onContactClick("phone")}
                  className="flex items-center gap-2 rounded-xl bg-[#74d69b] px-5 py-3 text-sm font-black text-[#153d31] transition hover:bg-[#91e4b0]"
                >
                  <FaPhone />
                  Call Now
                </button>
              )}

              {whatsapp && (
                <button
                  type="button"
                  onClick={() => onContactClick("whatsapp")}
                  className="flex items-center gap-2 rounded-xl border border-white/25 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10"
                >
                  <FaWhatsapp />
                  WhatsApp
                </button>
              )}
            </div>
          </div>

          <div className="flex justify-center md:justify-end">
            <div className="w-full max-w-md overflow-hidden rounded-[2rem] border border-white/15 bg-white/10 p-3 shadow-2xl">
              {banner ? (
                <img
                  src={banner}
                  alt={displayName}
                  className="h-72 w-full rounded-[1.5rem] object-cover sm:h-80"
                />
              ) : avatar || logo ? (
                <img
                  src={avatar || logo}
                  alt={displayName}
                  className="h-72 w-full rounded-[1.5rem] object-cover sm:h-80"
                />
              ) : (
                <div className="flex h-72 items-center justify-center rounded-[1.5rem] bg-[#28694f] text-7xl font-black text-white sm:h-80">
                  {displayName.charAt(0).toUpperCase()}
                </div>
              )}
            </div>
          </div>

        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <div className="mb-7">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
            Get In Touch
          </p>
          <h2 className="mt-2 text-3xl font-black">
            Contact Information
          </h2>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">

          {phone && (
            <button
              type="button"
              onClick={() => onContactClick("phone")}
              className="rounded-2xl border border-[#e2eae5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaPhone className="text-xl text-[#27815e]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8a9991]">
                Phone
              </p>
              <p className="mt-1 truncate text-sm font-black">
                {phone}
              </p>
            </button>
          )}

          {email && (
            <button
              type="button"
              onClick={() => onContactClick("email")}
              className="rounded-2xl border border-[#e2eae5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaEnvelope className="text-xl text-[#27815e]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8a9991]">
                Email
              </p>
              <p className="mt-1 truncate text-sm font-black">
                {email}
              </p>
            </button>
          )}

          {website && (
            <button
              type="button"
              onClick={() => onContactClick("website")}
              className="rounded-2xl border border-[#e2eae5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaGlobe className="text-xl text-[#27815e]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8a9991]">
                Website
              </p>
              <p className="mt-1 truncate text-sm font-black">
                {website}
              </p>
            </button>
          )}

          {address && (
            <button
              type="button"
              onClick={() => onContactClick("address")}
              className="rounded-2xl border border-[#e2eae5] bg-white p-5 text-left shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
            >
              <FaLocationDot className="text-xl text-[#27815e]" />
              <p className="mt-4 text-xs font-bold uppercase tracking-wider text-[#8a9991]">
                Address
              </p>
              <p className="mt-1 line-clamp-2 text-sm font-black">
                {address}
              </p>
            </button>
          )}

        </div>
      </section>

      {/* QUICK LINKS */}
      {visibleButtons.length > 0 && (
        <section className="border-y border-[#e4ebe7] bg-white">
          <div className="mx-auto max-w-6xl px-5 py-12">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
              Quick Access
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Explore Our Services
            </h2>

            <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleButtons.map((button, index) => (
                <button
                  key={button._id || button.id || index}
                  type="button"
                  onClick={() => onConfiguredButton(button)}
                  className="group flex items-center justify-between rounded-2xl border border-[#e2eae5] bg-[#f8faf8] p-5 text-left transition hover:border-[#27815e] hover:bg-[#eff8f2]"
                >
                  <div>
                    <p className="font-black">{button.label}</p>
                    {button.actionType && (
                      <p className="mt-1 text-xs text-[#8a9991]">
                        {button.actionType}
                      </p>
                    )}
                  </div>

                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#27815e] shadow-sm transition group-hover:bg-[#176b52] group-hover:text-white">
                    <FaArrowRight />
                  </span>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ABOUT */}
      {about && (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <div className="grid gap-8 md:grid-cols-[0.4fr_0.6fr]">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
                Who We Are
              </p>
              <h2 className="mt-3 text-3xl font-black">
                About Our Business
              </h2>
            </div>

            <p className="text-sm leading-8 text-[#718078]">
              {about}
            </p>
          </div>
        </section>
      )}

      {/* PRODUCTS AND SERVICES */}
      {productList.length > 0 && (
        <section className="bg-[#eaf1ec]">
          <div className="mx-auto max-w-6xl px-5 py-14">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
              What We Do
            </p>
            <h2 className="mt-2 text-3xl font-black">
              Our Products & Services
            </h2>

            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {productList.map((product, index) => (
                <button
                  key={product._id || index}
                  type="button"
                  onClick={() => onProductClick(product)}
                  className="group overflow-hidden rounded-2xl bg-white text-left shadow-sm transition hover:-translate-y-1 hover:shadow-xl"
                >
                  {product?.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name || "Service"}
                      className="h-52 w-full object-cover transition duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-52 items-center justify-center bg-[#dcebe0] text-5xl text-[#27815e]">
                      <FaBriefcase />
                    </div>
                  )}

                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h3 className="text-lg font-black">
                        {product.name || "Service"}
                      </h3>

                      {product.price && (
                        <span className="whitespace-nowrap rounded-lg bg-[#eaf5ed] px-3 py-1 text-xs font-black text-[#176b52]">
                          {product.price}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#829087]">
                        {product.description}
                      </p>
                    )}

                    <span className="mt-4 inline-flex items-center gap-2 text-sm font-black text-[#27815e]">
                      View Details
                      <FaArrowRight />
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* GALLERY */}
      {galleryImages.length > 0 && (
        <section className="mx-auto max-w-6xl px-5 py-14">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
            Our Portfolio
          </p>
          <h2 className="mt-2 text-3xl font-black">
            Recent Work
          </h2>

          <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-3">
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
        </section>
      )}

      {/* BUSINESS HOURS + SOCIAL */}
      <section className="border-y border-[#e4ebe7] bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-12 md:grid-cols-2">

          {businessHours && (
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5ed] text-[#27815e]">
                  <FaClock />
                </span>
                <h2 className="text-xl font-black">
                  Business Hours
                </h2>
              </div>

              <p className="mt-5 whitespace-pre-line text-sm leading-7 text-[#718078]">
                {businessHours}
              </p>
            </div>
          )}

          {socialLinks.length > 0 && (
            <div>
              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#eaf5ed] text-[#27815e]">
                  <FaShareNodes />
                </span>
                <h2 className="text-xl font-black">
                  Connect With Us
                </h2>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                {socialLinks.map((social, index) => (
                  <a
                    key={social._id || social.id || index}
                    href={social.url}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-xl border border-[#e2eae5] px-4 py-3 text-sm font-bold transition hover:border-[#27815e] hover:text-[#176b52]"
                  >
                    {getSocialLabel(social.platform || "Social")}
                  </a>
                ))}
              </div>
            </div>
          )}

        </div>
      </section>

      {/* QR CODE */}
      {qrTargetUrl && (
        <section className="bg-[#153d31]">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-8 px-5 py-14 text-center md:flex-row md:justify-between md:text-left">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-[#9cdbb2]">
                Digital Profile
              </p>
              <h2 className="mt-3 text-3xl font-black text-white">
                Connect With Us Instantly
              </h2>
              <p className="mt-3 max-w-lg text-sm leading-7 text-[#c0d4c9]">
                Scan the QR code to visit our profile and find all contact
                information in one place.
              </p>
            </div>

            <div className="rounded-3xl bg-white p-5 shadow-xl">
              {qrFetching ? (
                <div className="flex h-40 w-40 items-center justify-center text-sm text-[#718078]">
                  Loading QR...
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

      {/* INQUIRY FORM */}
      <section className="mx-auto max-w-4xl px-5 py-14">
        <div className="rounded-[2rem] border border-[#e2eae5] bg-white p-6 shadow-lg sm:p-10">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#27815e]">
              Contact Us
            </p>
            <h2 className="mt-3 text-3xl font-black">
              Request a Service
            </h2>
            <p className="mt-3 text-sm text-[#819087]">
              Tell us what you need. We will get back to you.
            </p>
          </div>

          {formSubmitted ? (
            <div className="mt-8 rounded-2xl bg-[#eaf5ed] p-7 text-center">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#27815e] text-xl text-white">
                <FaCheck />
              </span>
              <h3 className="mt-4 text-xl font-black text-[#176b52]">
                Inquiry Submitted!
              </h3>
              <p className="mt-2 text-sm text-[#718078]">
                Thank you for contacting us.
              </p>
            </div>
          ) : (
            <form onSubmit={onFormSubmit} className="mt-8 space-y-4">
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
                  className="w-full rounded-xl border border-[#e2eae5] bg-[#f8faf8] px-4 py-3 text-sm outline-none focus:border-[#27815e]"
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
                  className="w-full rounded-xl border border-[#e2eae5] bg-[#f8faf8] px-4 py-3 text-sm outline-none focus:border-[#27815e]"
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
                className="w-full rounded-xl border border-[#e2eae5] bg-[#f8faf8] px-4 py-3 text-sm outline-none focus:border-[#27815e]"
              />

              <textarea
                rows="5"
                placeholder="Describe your requirements..."
                value={formData.message}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    message: e.target.value,
                  })
                }
                className="w-full resize-none rounded-xl border border-[#e2eae5] bg-[#f8faf8] px-4 py-3 text-sm outline-none focus:border-[#27815e]"
              />

              {inquirySubmitError && (
                <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                  {inquirySubmitError}
                </p>
              )}

              <button
                type="submit"
                disabled={inquirySubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#176b52] px-5 py-4 text-sm font-black text-white transition hover:bg-[#125640] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {inquirySubmitting ? "Submitting..." : "Submit Inquiry"}
                {!inquirySubmitting && <FaArrowRight />}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#102d24] px-5 py-7 text-center text-sm text-white/60">
        <p>
          © {new Date().getFullYear()} {displayName}. All rights reserved.
        </p>
        <p className="mt-2 text-xs font-semibold text-[#9cdbb2]">
          Professional Digital Business Profile
        </p>
      </footer>
    </div>
  );
};

export default ServicePro;