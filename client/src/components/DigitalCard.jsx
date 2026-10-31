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
  FaArrowRight,
  FaCheck,
  FaClock,
  FaBriefcase,
} from "react-icons/fa6";

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

  const socialLabel = (platform = "") =>
    platform
      .replace(/[-_]/g, " ")
      .replace(/\b\w/g, (letter) => letter.toUpperCase());

  return (
    <div className="min-h-screen bg-[#edf1f5] px-3 py-8 text-[#172b3a] sm:px-5">
      <main className="mx-auto max-w-3xl overflow-hidden rounded-[2rem] bg-white shadow-[0_20px_70px_rgba(22,42,59,0.12)]">

        {/* CARD HEADER */}
        <header className="relative">
          <div className="h-48 overflow-hidden bg-[#102b3f] sm:h-60">
            {banner && (
              <img
                src={banner}
                alt="Profile banner"
                className="h-full w-full object-cover"
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#102b3f]/90 via-[#102b3f]/20 to-transparent" />
          </div>

          <div className="relative -mt-16 px-6 pb-6 sm:px-10">
            <div className="flex flex-col items-center text-center sm:flex-row sm:items-end sm:text-left">
              <div className="h-32 w-32 shrink-0 overflow-hidden rounded-3xl border-4 border-white bg-[#dce8ed] shadow-xl">
                {avatar || logo ? (
                  <img
                    src={avatar || logo}
                    alt={displayName}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-[#1c9c91] text-4xl font-black text-white">
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <div className="mt-4 min-w-0 flex-1 sm:ml-5 sm:mt-0 sm:pb-2">
                <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                  <h1 className="text-2xl font-black text-[#172b3a] sm:text-3xl">
                    {displayName}
                  </h1>

                  {isVerified && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1c9c91] text-[10px] text-white">
                      <FaCheck />
                    </span>
                  )}
                </div>

                <p className="mt-1 text-sm font-semibold text-[#1c9c91]">
                  {role}
                </p>

                {location && (
                  <p className="mt-2 flex items-center justify-center gap-2 text-xs text-[#82909b] sm:justify-start">
                    <FaLocationDot />
                    {location}
                  </p>
                )}
              </div>

              <button
                type="button"
                onClick={onShare}
                className="mt-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-[#e1e8ec] text-[#172b3a] transition hover:bg-[#172b3a] hover:text-white sm:mb-2 sm:mt-0"
                aria-label="Share profile"
              >
                <FaShareNodes />
              </button>
            </div>

            {industry && (
              <div className="mt-5 flex justify-center sm:justify-start">
                <span className="rounded-full bg-[#eaf6f4] px-4 py-2 text-xs font-bold text-[#16877e]">
                  {industry}
                </span>
              </div>
            )}
          </div>
        </header>

        {/* PRIMARY CONTACT ACTIONS */}
        <section className="border-y border-[#edf1f3] px-6 py-6 sm:px-10">
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {phone && (
              <button
                type="button"
                onClick={() => onContactClick("phone")}
                className="flex flex-col items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-[#16877e] transition hover:bg-[#16877e] hover:text-white"
              >
                <FaPhone className="text-xl" />
                <span className="text-xs font-bold">Call</span>
              </button>
            )}

            {whatsapp && (
              <button
                type="button"
                onClick={() => onContactClick("whatsapp")}
                className="flex flex-col items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-[#16877e] transition hover:bg-[#16877e] hover:text-white"
              >
                <FaWhatsapp className="text-xl" />
                <span className="text-xs font-bold">WhatsApp</span>
              </button>
            )}

            {email && (
              <button
                type="button"
                onClick={() => onContactClick("email")}
                className="flex flex-col items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-[#16877e] transition hover:bg-[#16877e] hover:text-white"
              >
                <FaEnvelope className="text-xl" />
                <span className="text-xs font-bold">Email</span>
              </button>
            )}

            {website && (
              <button
                type="button"
                onClick={() => onContactClick("website")}
                className="flex flex-col items-center gap-2 rounded-2xl bg-[#edf7f6] p-4 text-[#16877e] transition hover:bg-[#16877e] hover:text-white"
              >
                <FaGlobe className="text-xl" />
                <span className="text-xs font-bold">Website</span>
              </button>
            )}
          </div>
        </section>

        {/* ABOUT */}
        {about && (
          <section className="px-6 py-8 sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1c9c91]">
              Introduction
            </p>
            <h2 className="mt-2 text-2xl font-black">About Me</h2>
            <p className="mt-4 whitespace-pre-line text-sm leading-7 text-[#71808d]">
              {about}
            </p>
          </section>
        )}

        {/* QUICK BUTTONS */}
        {visibleButtons.length > 0 && (
          <section className="border-t border-[#edf1f3] px-6 py-8 sm:px-10">
            <h2 className="text-xl font-black">Quick Links</h2>

            <div className="mt-5 space-y-3">
              {visibleButtons.map((button, index) => (
                <button
                  key={button._id || button.id || index}
                  type="button"
                  onClick={() => onConfiguredButton(button)}
                  className="flex w-full items-center justify-between rounded-xl border border-[#e7edf0] px-4 py-4 text-left transition hover:border-[#1c9c91] hover:bg-[#f5fbfa]"
                >
                  <div>
                    <p className="text-sm font-bold">{button.label}</p>
                    {button.actionType && (
                      <p className="mt-1 text-xs text-[#87939c]">
                        {button.actionType}
                      </p>
                    )}
                  </div>
                  <FaArrowRight className="text-sm text-[#1c9c91]" />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* PRODUCTS */}
        {productList.length > 0 && (
          <section className="border-t border-[#edf1f3] bg-[#f8fafb] px-6 py-8 sm:px-10">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1c9c91]">
              Our Work
            </p>
            <h2 className="mt-2 text-2xl font-black">Products & Services</h2>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {productList.map((product, index) => (
                <button
                  key={product._id || index}
                  type="button"
                  onClick={() => onProductClick(product)}
                  className="overflow-hidden rounded-2xl border border-[#e6ecef] bg-white text-left transition hover:-translate-y-1 hover:shadow-lg"
                >
                  {product?.images?.[0]?.url ? (
                    <img
                      src={product.images[0].url}
                      alt={product.name || "Product"}
                      className="h-44 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-44 items-center justify-center bg-[#eaf6f4] text-4xl text-[#1c9c91]">
                      <FaBriefcase />
                    </div>
                  )}

                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-black">
                        {product.name || "Product"}
                      </h3>
                      {product.price && (
                        <span className="text-sm font-black text-[#16877e]">
                          {product.price}
                        </span>
                      )}
                    </div>

                    {product.description && (
                      <p className="mt-2 line-clamp-2 text-xs leading-6 text-[#82909b]">
                        {product.description}
                      </p>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* GALLERY */}
        {galleryImages.length > 0 && (
          <section className="border-t border-[#edf1f3] px-6 py-8 sm:px-10">
            <h2 className="text-2xl font-black">Gallery</h2>

            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {galleryImages.map((image, index) => (
                <button
                  key={image._id || image.id || index}
                  type="button"
                  onClick={() => onGalleryClick(image)}
                  className="overflow-hidden rounded-xl"
                >
                  <img
                    src={image.url}
                    alt={image.alt || "Gallery"}
                    className="aspect-square w-full object-cover transition duration-300 hover:scale-105"
                  />
                </button>
              ))}
            </div>
          </section>
        )}

        {/* BUSINESS DETAILS */}
        <section className="border-t border-[#edf1f3] bg-[#f8fafb] px-6 py-8 sm:px-10">
          <h2 className="text-xl font-black">Business Information</h2>

          <div className="mt-5 space-y-4">
            {address && (
              <button
                type="button"
                onClick={() => onContactClick("address")}
                className="flex w-full items-start gap-3 text-left"
              >
                <FaLocationDot className="mt-1 text-[#1c9c91]" />
                <span className="text-sm leading-6 text-[#71808d]">
                  {address}
                </span>
              </button>
            )}

            {businessHours && (
              <div className="flex items-start gap-3">
                <FaClock className="mt-1 text-[#1c9c91]" />
                <p className="whitespace-pre-line text-sm leading-6 text-[#71808d]">
                  {businessHours}
                </p>
              </div>
            )}
          </div>
        </section>

        {/* SOCIAL LINKS */}
        {socialLinks.length > 0 && (
          <section className="border-t border-[#edf1f3] px-6 py-8 sm:px-10">
            <h2 className="text-xl font-black">Follow Me</h2>

            <div className="mt-5 flex flex-wrap gap-3">
              {socialLinks.map((social, index) => (
                <a
                  key={social._id || social.id || index}
                  href={social.url}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-xl border border-[#e2e9ec] px-4 py-3 text-xs font-bold text-[#344b5b] transition hover:border-[#1c9c91] hover:text-[#16877e]"
                >
                  {socialLabel(social.platform || "Social")}
                </a>
              ))}
            </div>
          </section>
        )}

        {/* QR CODE */}
        {qrTargetUrl && (
          <section className="border-t border-[#edf1f3] bg-[#edf7f6] px-6 py-8 text-center sm:px-10">
            <h2 className="text-xl font-black">Save My Digital Card</h2>
            <p className="mt-2 text-sm text-[#71808d]">
              Scan this QR code to open my profile.
            </p>

            <div className="mx-auto mt-5 inline-block rounded-2xl bg-white p-4 shadow-sm">
              {qrFetching ? (
                <div className="flex h-40 w-40 items-center justify-center text-xs text-[#71808d]">
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

            <div>
              <button
                type="button"
                onClick={onOpenQr}
                className="mt-4 rounded-xl bg-[#172b3a] px-5 py-3 text-xs font-bold text-white transition hover:bg-[#1c9c91]"
              >
                Open QR Code
              </button>
            </div>
          </section>
        )}

        {/* INQUIRY FORM */}
        <section className="border-t border-[#edf1f3] px-6 py-9 sm:px-10">
          <p className="text-xs font-black uppercase tracking-[0.2em] text-[#1c9c91]">
            Contact
          </p>
          <h2 className="mt-2 text-2xl font-black">Send an Inquiry</h2>

          {formSubmitted ? (
            <div className="mt-6 rounded-2xl bg-[#edf7f6] p-6 text-center">
              <FaCheck className="mx-auto text-3xl text-[#16877e]" />
              <p className="mt-3 font-black text-[#172b3a]">
                Message sent successfully!
              </p>
            </div>
          ) : (
            <form onSubmit={onFormSubmit} className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <input
                  type="text"
                  placeholder="Your Name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#e2e9ec] bg-[#f8fafb] px-4 py-3 text-sm outline-none focus:border-[#1c9c91]"
                />

                <input
                  type="text"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={(e) =>
                    setFormData({ ...formData, phone: e.target.value })
                  }
                  className="w-full rounded-xl border border-[#e2e9ec] bg-[#f8fafb] px-4 py-3 text-sm outline-none focus:border-[#1c9c91]"
                />
              </div>

              <input
                type="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full rounded-xl border border-[#e2e9ec] bg-[#f8fafb] px-4 py-3 text-sm outline-none focus:border-[#1c9c91]"
              />

              <textarea
                rows="4"
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                className="w-full resize-none rounded-xl border border-[#e2e9ec] bg-[#f8fafb] px-4 py-3 text-sm outline-none focus:border-[#1c9c91]"
              />

              {inquirySubmitError && (
                <p className="text-sm text-red-600">{inquirySubmitError}</p>
              )}

              <button
                type="submit"
                disabled={inquirySubmitting}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#172b3a] px-5 py-4 text-sm font-black text-white transition hover:bg-[#1c9c91] disabled:opacity-60"
              >
                {inquirySubmitting ? "Sending..." : "Submit Inquiry"}
                {!inquirySubmitting && <FaArrowRight />}
              </button>
            </form>
          )}
        </section>

        {/* FOOTER */}
        <footer className="bg-[#102b3f] px-6 py-6 text-center text-xs text-white/60">
          © {new Date().getFullYear()} {displayName}. All rights reserved.
          <p className="mt-2 font-semibold text-[#8de2d8]">
            Digital Business Card
          </p>
        </footer>
      </main>
    </div>
  );
};

export default DigitalCard;