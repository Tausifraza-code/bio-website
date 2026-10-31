
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

import {
  MapPin,
  Phone,
  Mail,
  Globe,
  MessageCircle,
  Share2,
  UserRound,
  ShieldCheck,
  ShoppingBag,
  CheckCircle2,
  Clock,
  Download,
  Image as ImageIcon,
  ArrowUpRight,
  BriefcaseBusiness,
  Code2,
  Palette,
  Headset,
  ExternalLink,
  ScanLine,
  Send,
} from "lucide-react";

import {
  FaInstagram,
  FaLinkedinIn,
  FaFacebookF,
  FaYoutube,
  FaWhatsapp,
  FaTelegram,
  FaXTwitter,
  FaLink,
} from "react-icons/fa6";

// ============================================
// EXECUTIVE PRO LAYOUT
// Premium Dark Navy + Electric Cyan
// Responsive: Mobile, Tablet and Desktop
// ============================================

const ExecutivePro = ({
  businessInfo = {},
  visibleButtons = [],
  socialLinks = [],
  productList = [],
  galleryImages = [],

  qrTargetUrl = "",
  qrFetching = false,

  formData = {
    name: "",
    phone: "",
    email: "",
    message: "",
  },

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
    name = "",
    role = "",
    location = "",
    about = "",
    phone = "",
    whatsapp = "",
    email = "",
    website = "",
    address = "",
    logo = null,
    avatar = null,
    banner = null,
    industry = "",
    businessName = "",
    businessHours = "",
    isVerified = false,
  } = businessInfo;

  const primaryColor = "#22D3EE";

  const socialIconMap = {
    instagram: FaInstagram,
    linkedin: FaLinkedinIn,
    facebook: FaFacebookF,
    youtube: FaYoutube,
    whatsapp: FaWhatsapp,
    telegram: FaTelegram,
    twitter: FaXTwitter,
  };

  const getSocialIcon = (platform = "") => {
    const key = platform.toLowerCase();

    const found = Object.keys(socialIconMap).find((item) =>
      key.includes(item)
    );

    return found ? socialIconMap[found] : FaLink;
  };

  const normalizeUrl = (url = "") => {
    if (!url) return "#";

    return /^https?:\/\//i.test(url)
      ? url
      : `https://${url}`;
  };


  const panelClass =
    "rounded-2xl border border-[#29435F] bg-[#132942] p-5 sm:p-6 transition-all duration-300 hover:border-cyan-400/40";

  const headingClass =
    "text-lg font-bold tracking-tight text-white sm:text-xl";

  const inputClass =
    "w-full rounded-xl border border-[#29435F] bg-[#0B1B30] px-4 py-3 text-sm text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/10 disabled:opacity-50";

  return (
    <div className="executive-pro w-full overflow-hidden rounded-[20px] border border-[#29435F] bg-[#0B1B30] text-white shadow-2xl shadow-black/30 sm:rounded-[28px]">

      {/* ================================== */}
      {/* HERO BANNER */}
      {/* ================================== */}

      <section className="relative h-[260px] overflow-hidden sm:h-[340px] lg:h-[390px]">

        <img
          src={
            banner ||
            "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600"
          }
          alt="Business banner"
          className="h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-[#071326]/30 via-[#071326]/45 to-[#0B1B30]" />

        <div className="absolute left-5 top-5 z-10 sm:left-8 sm:top-7">
          <div className="flex items-center gap-2">
            {logo ? (
              <img
                src={logo}
                alt="Business logo"
                className="h-10 w-10 rounded-xl border border-white/20 bg-white object-contain p-1"
              />
            ) : (
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10">
                <span className="text-lg font-black text-cyan-300">
                  B
                </span>
              </div>
            )}

            <span className="text-lg font-black tracking-wide text-white">
              Bio<span className="text-cyan-400">.</span>
            </span>
          </div>
        </div>

        {/* HERO ACTIONS */}

        <div className="absolute right-5 top-5 z-10 flex gap-2 sm:right-8 sm:top-7">

          <button
            type="button"
            onClick={onShare}
            aria-label="Share profile"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/20 bg-[#071326]/70 text-white backdrop-blur-md transition hover:border-cyan-400 hover:text-cyan-300"
          >
            <Share2 size={18} />
          </button>

          <button
            type="button"
            onClick={onOpenQr}
            aria-label="Open QR code"
            className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-[#0B1B30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300"
          >
            <ScanLine size={19} />
          </button>

        </div>

        {/* HERO BOTTOM LABEL */}

        <div className="absolute bottom-5 left-5 right-5 sm:bottom-8 sm:left-8">
          <p className="text-xs font-bold uppercase tracking-[3px] text-cyan-300">
            Professional Digital Identity
          </p>

          <p className="mt-2 text-sm text-slate-200">
            Welcome to my digital space
          </p>
        </div>

      </section>

      {/* ================================== */}
      {/* PROFILE HEADER */}
      {/* ================================== */}

      <section className="relative px-5 pb-5 sm:px-8 lg:px-10">

        <div className="flex flex-col items-center gap-5 sm:items-start md:flex-row md:items-end">

          {/* PROFILE IMAGE */}

          <div className="-mt-16 relative h-32 w-32 shrink-0 sm:-mt-20 sm:h-40 sm:w-40">

            <div className="h-full w-full overflow-hidden rounded-full border-[5px] border-[#0B1B30] bg-[#132942] shadow-[0_0_30px_rgba(34,211,238,0.18)]">

              {avatar ? (
                <img
                  src={avatar}
                  alt={name || "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <UserRound size={48} className="text-slate-500" />
                </div>
              )}

            </div>

            {logo && (
              <div className="absolute bottom-1 right-0 flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border-4 border-[#0B1B30] bg-white shadow-lg">
                <img
                  src={logo}
                  alt="Business logo"
                  className="h-full w-full object-contain"
                />
              </div>
            )}

          </div>

          {/* PROFILE DETAILS */}

          <div className="min-w-0 flex-1 pb-2 text-center sm:text-left">

            <div className="flex flex-wrap items-center justify-center gap-2 sm:justify-start">

              <h1 className="text-2xl font-black tracking-tight text-white sm:text-3xl lg:text-4xl">
                {name || "Your Name"}
              </h1>

              {isVerified && (
                <span title="Verified Profile">
                  <CheckCircle2
                    size={23}
                    className="fill-cyan-400 text-[#0B1B30]"
                  />
                </span>
              )}

            </div>

            <p className="mt-2 text-sm font-bold text-cyan-400 sm:text-base">
              {role || "Business Professional"}
            </p>

            <p className="mt-1 text-sm text-slate-400">
              {businessName || "My Business"}
            </p>

            <p className="mt-2 flex items-center justify-center gap-1.5 text-xs text-slate-400 sm:justify-start">
              <MapPin size={14} className="text-cyan-400" />
              {location || "Location not added"}
            </p>

          </div>

        </div>

        {/* CONTACT BUTTONS */}

        <div className="mt-6 flex flex-wrap justify-center gap-2 sm:justify-start">

          {visibleButtons.map((button, index) => (
            <button
              key={button._id || button.id || index}
              type="button"
              onClick={() => onConfiguredButton(button)}
              className={`flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold transition duration-300 sm:text-sm ${
                button.actionType === "call"
                  ? "bg-cyan-400 text-[#0B1B30] hover:bg-cyan-300"
                  : button.actionType === "whatsapp"
                    ? "bg-emerald-500 text-white hover:bg-emerald-400"
                    : "border border-[#34516E] bg-[#132942] text-white hover:border-cyan-400 hover:text-cyan-300"
              }`}
            >
              {button.label}
              <ArrowUpRight size={14} />
            </button>
          ))}

        </div>

        {/* SOCIAL ICONS */}

        {socialLinks.length > 0 && (
          <div className="mt-5 flex flex-wrap justify-center gap-2 sm:justify-start">

            {socialLinks.map((social, index) => {
              const Icon = getSocialIcon(social.platform);

              return (
                <a
                  key={social._id || `${social.platform}-${index}`}
                  href={normalizeUrl(social.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  title={social.platform}
                  className="flex h-10 w-10 items-center justify-center rounded-xl border border-[#29435F] bg-[#132942] text-slate-300 transition hover:-translate-y-1 hover:border-cyan-400 hover:text-cyan-300"
                >
                  <Icon size={17} />
                </a>
              );
            })}

          </div>
        )}

      </section>


      {/* ================================== */}
      {/* MAIN CONTENT GRID */}
      {/* ================================== */}

      <main className="grid grid-cols-1 gap-5 px-5 pb-8 sm:px-8 lg:grid-cols-12 lg:gap-6 lg:px-10">

        {/* LEFT COLUMN */}

        <aside className="flex flex-col gap-5 lg:col-span-4">

          {/* CONTACT INFORMATION */}

          <section className={panelClass}>

            <h2 className={headingClass}>
              Contact Information
            </h2>

            <div className="mt-5 space-y-4">

              {[
                {
                  Icon: Phone,
                  label: "Phone",
                  value: phone,
                  type: "phone",
                },
                {
                  Icon: MessageCircle,
                  label: "WhatsApp",
                  value: whatsapp,
                  type: "whatsapp",
                },
                {
                  Icon: Mail,
                  label: "Email",
                  value: email,
                  type: "email",
                },
                {
                  Icon: Globe,
                  label: "Website",
                  value: website,
                  type: "website",
                },
                {
                  Icon: MapPin,
                  label: "Address",
                  value: address,
                  type: "address",
                },
                {
                  Icon: Clock,
                  label: "Business Hours",
                  value: businessHours,
                  type: "hours",
                },
              ].filter((item) => item.value).map((item) => (
                <button
                  key={item.type}
                  type="button"
                  onClick={() => {
                    if (item.type !== "hours") {
                      onContactClick(item.type);
                    }
                  }}
                  className="group flex w-full min-w-0 items-start gap-3 text-left"
                >

                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-400 transition group-hover:bg-cyan-400 group-hover:text-[#0B1B30]">
                    <item.Icon size={17} />
                  </div>

                  <div className="min-w-0 flex-1 pt-0.5">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                      {item.label}
                    </p>

                    <p className="mt-1 break-words text-xs font-medium leading-5 text-slate-200 group-hover:text-cyan-300 sm:text-sm">
                      {item.value}
                    </p>
                  </div>

                </button>
              ))}

            </div>

          </section>

          {/* QR CODE */}

          <section className={`${panelClass} flex flex-col items-center text-center`}>

            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
              <ScanLine size={22} />
            </div>

            <h2 className={headingClass}>
              Scan My QR
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Scan to visit my digital profile
            </p>

            <div className="mt-5 flex min-h-[190px] w-full items-center justify-center rounded-2xl border border-[#29435F] bg-[#0B1B30] p-4">

              {qrFetching ? (
                <p className="text-sm text-slate-400">
                  Loading QR...
                </p>
              ) : qrTargetUrl ? (
                <div className="rounded-xl bg-white p-3">
                  <QRCodeCanvas
                    id="executive-pro-qr"
                    value={qrTargetUrl}
                    size={155}
                    level="H"
                    includeMargin
                  />
                </div>
              ) : (
                <p className="text-xs text-slate-500">
                  QR code not available
                </p>
              )}

            </div>

            {qrTargetUrl && (
              <a
                href={`https://api.qrserver.com/v1/create-qr-code/?size=500x500&data=${encodeURIComponent(qrTargetUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-cyan-400/30 bg-cyan-400/10 py-2.5 text-sm font-bold text-cyan-300 transition hover:bg-cyan-400 hover:text-[#0B1B30]"
              >
                <Download size={16} />
                Download QR
              </a>
            )}

          </section>

          {/* SOCIAL LINKS */}

          {socialLinks.length > 0 && (
            <section className={panelClass}>

              <h2 className={headingClass}>
                Connect With Me
              </h2>

              <div className="mt-4 grid grid-cols-2 gap-2">

                {socialLinks.map((social, index) => {
                  const Icon = getSocialIcon(social.platform);

                  return (
                    <a
                      key={social._id || index}
                      href={normalizeUrl(social.url)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex min-w-0 items-center gap-2 rounded-xl border border-[#29435F] bg-[#0B1B30] p-3 transition hover:border-cyan-400/50"
                    >
                      <Icon className="shrink-0 text-cyan-400" size={17} />

                      <span className="truncate text-xs font-semibold text-slate-200">
                        {social.platform}
                      </span>
                    </a>
                  );
                })}

              </div>

            </section>
          )}

        </aside>

        {/* RIGHT COLUMN */}

        <div className="flex min-w-0 flex-col gap-5 lg:col-span-8">

          {/* ABOUT ME */}

          <section className={panelClass}>

            <div className="flex items-center justify-between gap-3">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                  Get to know me
                </p>

                <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                  About Me
                </h2>
              </div>

              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-400">
                <UserRound size={22} />
              </div>

            </div>

            <p className="mt-5 text-sm leading-7 text-slate-300">
              {about || "Welcome to my business! Contact me for business inquiries."}
            </p>

            <div className="mt-5 flex flex-wrap gap-2">

              {industry && (
                <span className="rounded-lg border border-cyan-400/20 bg-cyan-400/10 px-3 py-1.5 text-xs font-semibold text-cyan-300">
                  {industry}
                </span>
              )}

              {businessName && (
                <span className="rounded-lg border border-[#29435F] bg-[#0B1B30] px-3 py-1.5 text-xs font-semibold text-slate-300">
                  {businessName}
                </span>
              )}

            </div>

          </section>


          {/* PRODUCTS */}

          {productList.length > 0 && (
            <section className={panelClass}>

              <div className="mb-5 flex items-center justify-between gap-3">

                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                    Explore collection
                  </p>

                  <h2 className="mt-1 text-xl font-black text-white">
                    Featured Products
                  </h2>
                </div>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-3 py-1 text-xs font-bold text-cyan-300">
                  {productList.length} Items
                </span>

              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

                {productList.map((product) => {
                  const cover = product.images?.find((item) => item?.url)?.url;

                  return (
                    <button
                      key={product._id}
                      type="button"
                      onClick={() => onProductClick(product)}
                      className="group overflow-hidden rounded-xl border border-[#29435F] bg-[#0B1B30] text-left transition duration-300 hover:-translate-y-1 hover:border-cyan-400/50"
                    >

                      <div className="relative h-44 overflow-hidden bg-[#132942]">

                        {cover ? (
                          <img
                            src={cover}
                            alt={product.name}
                            loading="lazy"
                            className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center">
                            <ImageIcon size={35} className="text-slate-500" />
                          </div>
                        )}

                        <span className="absolute right-3 top-3 rounded-lg bg-[#071326]/80 p-2 text-cyan-300 backdrop-blur">
                          <ArrowUpRight size={16} />
                        </span>

                      </div>

                      <div className="p-4">

                        <h3 className="truncate text-sm font-bold text-white">
                          {product.name}
                        </h3>

                        <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-400">
                          {product.description}
                        </p>

                        <p className="mt-3 text-lg font-black text-cyan-400">
                          ₹{Number(product.price || 0).toLocaleString("en-IN")}
                        </p>

                      </div>

                    </button>
                  );
                })}

              </div>

            </section>
          )}

          {/* GALLERY */}

          <section className={panelClass}>

            <div className="mb-5 flex items-center justify-between gap-3">

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                  Our work
                </p>

                <h2 className="mt-1 text-xl font-black text-white">
                  Gallery
                </h2>
              </div>

              <span className="text-xs font-semibold text-slate-400">
                {galleryImages.length} Photos
              </span>

            </div>

            {galleryImages.length > 0 ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">

                {galleryImages.map((image, index) => (
                  <button
                    key={`${image.url}-${index}`}
                    type="button"
                    onClick={() => onGalleryClick(image)}
                    className="group relative aspect-[4/3] overflow-hidden rounded-xl border border-[#29435F]"
                  >

                    <img
                      src={image.url}
                      alt={image.alt || `Gallery ${index + 1}`}
                      loading="lazy"
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-110"
                    />

                    <div className="absolute inset-0 flex items-center justify-center bg-[#071326]/50 opacity-0 transition group-hover:opacity-100">
                      <ArrowUpRight size={25} className="text-cyan-300" />
                    </div>

                  </button>
                ))}

              </div>
            ) : (
              <div className="rounded-xl border border-dashed border-[#34516E] py-10 text-center">
                <ImageIcon size={35} className="mx-auto text-slate-500" />

                <p className="mt-3 text-sm text-slate-400">
                  No gallery images added yet.
                </p>
              </div>
            )}

          </section>

          {/* INQUIRY FORM */}

          <section className="overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-br from-[#132942] to-[#0B1B30] p-5 sm:p-7">

            <div className="mb-5">
              <p className="text-[10px] font-bold uppercase tracking-[2px] text-cyan-400">
                Let's work together
              </p>

              <h2 className="mt-1 text-xl font-black text-white sm:text-2xl">
                Let's Build Something Great
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-400">
                Have a project in mind? Send me a message and let's discuss it.
              </p>
            </div>

            {formSubmitted ? (
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-5 text-center">
                <CheckCircle2 size={35} className="mx-auto text-emerald-400" />

                <p className="mt-3 font-bold text-emerald-300">
                  Inquiry submitted successfully!
                </p>
              </div>
            ) : (
              <form onSubmit={onFormSubmit} className="space-y-3">

                {inquirySubmitError && (
                  <div className="rounded-xl border border-red-400/20 bg-red-400/10 p-3 text-sm text-red-300">
                    {inquirySubmitError}
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">

                  <input
                    type="text"
                    required
                    placeholder="Your Name"
                    value={formData.name}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        name: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                  <input
                    type="tel"
                    required
                    placeholder="Phone Number"
                    value={formData.phone}
                    disabled={inquirySubmitting}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        phone: e.target.value,
                      })
                    }
                    className={inputClass}
                  />

                </div>

                <input
                  type="email"
                  placeholder="Email Address (Optional)"
                  value={formData.email}
                  disabled={inquirySubmitting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      email: e.target.value,
                    })
                  }
                  className={inputClass}
                />

                <textarea
                  rows={4}
                  required
                  placeholder="Tell me about your project..."
                  value={formData.message}
                  disabled={inquirySubmitting}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      message: e.target.value,
                    })
                  }
                  className={`${inputClass} resize-none`}
                />

                <button
                  type="submit"
                  disabled={inquirySubmitting}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 py-3.5 text-sm font-black text-[#0B1B30] transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {inquirySubmitting ? (
                    "Submitting..."
                  ) : (
                    <>
                      <Send size={17} />
                      Send Inquiry
                    </>
                  )}
                </button>

              </form>
            )}

          </section>

        </div>

      </main>

      {/* ================================== */}
      {/* FOOTER */}
      {/* ================================== */}

      <footer className="border-t border-[#29435F] bg-[#071326] px-5 py-7 text-center sm:px-8">

        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">

          <div className="flex items-center gap-2">
            <span className="text-xl font-black text-white">
              Bio<span className="text-cyan-400">.</span>
            </span>

            <span className="text-xs text-slate-500">
              Professional Digital Identity
            </span>
          </div>

          <p className="text-xs text-slate-500">
            © {new Date().getFullYear()} {name || businessName}. All rights reserved.
          </p>

        </div>

        <p className="mt-5 text-[11px] text-slate-600">
          Powered by{" "}
          <span className="font-bold text-cyan-400">
            BioWebsite
          </span>
        </p>

      </footer>

    </div>
  );
};

export default ExecutivePro;
