import { useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Clock,
  Copy,
  ExternalLink,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Send,
  ShieldCheck,
  Sparkles,
  Zap,
} from "lucide-react";

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    need: "Digital Visiting Card",
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const needsList = [
    "Digital Visiting Card",
    "Product / Service Catalog",
    "Custom Domain Setup",
    "Multi-Staff Franchise",
    "General Question",
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  const handleCopyEmail = () => {
    navigator.clipboard?.writeText("support@visitingcard.pro");
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2000);
  };

  return (
    <section
      id="contact"
      className="relative isolate overflow-hidden py-5 sm:py-5 lg:py-5"
    >
      {/* Dynamic ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-5%] top-1/3 h-[420px] w-[420px] rounded-full bg-[#10b981]/[0.07] blur-[140px]" />
        <div className="absolute right-[-5%] bottom-1/4 h-[420px] w-[420px] rounded-full bg-[#22d3ee]/[0.07] blur-[140px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.08]" />
      </div>

      <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/[0.08] px-4 py-1.5 text-xs font-semibold text-[#0891b2] shadow-xs backdrop-blur-md dark:text-[#22d3ee]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <MessageCircle
              size={14}
              className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
            />
            <span>Direct Client Advisory &amp; Support</span>
          </div>

          <h2 className="text-[clamp(30px,3.8vw,48px)] font-black leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)]">
            Let&apos;s Build Your High-Converting{" "}
            <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#22d3ee] bg-clip-text text-transparent">
              Digital Presence
            </span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[580px] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Have questions about catalog features, QR generation, or onboarding
            your brand? Reach out anytime — we reply fast.
          </p>
        </div>

        {/* ================= 3 TOP DIRECT CHANNEL CARDS ================= */}
        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {/* Card 1: WhatsApp */}
          <a
            href="https://wa.me/919820188287?text=Hi%2C%20I%20want%20to%20know%20more%20about%20BIO%20Website"
            target="_blank"
            rel="noreferrer"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/50 hover:shadow-lg hover:shadow-[#10b981]/10"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10b981]/15 text-[#10b981] ring-1 ring-inset ring-[#10b981]/25 transition-transform duration-300 group-hover:scale-110">
                  <MessageCircle size={22} />
                </div>
                <span className="rounded-full bg-[#10b981]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#10b981]">
                  Instant Chat
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
                WhatsApp Support
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Connect directly with our onboarding specialists on WhatsApp.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border-color)]/60 text-xs font-semibold text-[#10b981]">
              <span>+91 98201 88287</span>
              <ExternalLink
                size={14}
                className="transition-transform group-hover:translate-x-0.5"
              />
            </div>
          </a>

          {/* Card 2: Phone */}
          <a
            href="tel:+919820188287"
            className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#22d3ee]/50 hover:shadow-lg hover:shadow-[#22d3ee]/10"
          >
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#22d3ee]/15 text-[#0891b2] dark:text-[#22d3ee] ring-1 ring-inset ring-[#22d3ee]/25 transition-transform duration-300 group-hover:scale-110">
                  <Phone size={22} />
                </div>
                <span className="rounded-full bg-[#22d3ee]/10 px-2.5 py-0.5 text-[10px] font-bold text-[#0891b2] dark:text-[#22d3ee]">
                  9:30 AM – 7:30 PM
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
                Direct Call Hotline
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Speak directly with an enterprise advisor for tailored setup.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border-color)]/60 text-xs font-semibold text-[#0891b2] dark:text-[#22d3ee]">
              <span>+91 98201 88287</span>
              <Phone
                size={14}
                className="transition-transform group-hover:scale-110"
              />
            </div>
          </a>

          {/* Card 3: Email */}
          <div className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all duration-300 hover:border-[#10b981]/40">
            <div>
              <div className="flex items-center justify-between">
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10b981]/15 text-[#10b981] ring-1 ring-inset ring-[#10b981]/25">
                  <Mail size={22} />
                </div>
                <span className="rounded-full bg-[var(--surface-raised)] px-2.5 py-0.5 text-[10px] font-medium text-[var(--text-secondary)]">
                  ~45 min reply
                </span>
              </div>
              <h3 className="mt-4 text-sm font-bold text-[var(--text-primary)]">
                Email Inquiries
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)] leading-relaxed">
                Send feature inquiries, team invites, or partnership decks.
              </p>
            </div>
            <div className="mt-4 flex items-center justify-between pt-3 border-t border-[var(--border-color)]/60 text-xs font-semibold text-[var(--text-primary)]">
              <span className="truncate pr-2">support@visitingcard.pro</span>
              <button
                type="button"
                onClick={handleCopyEmail}
                className="flex items-center gap-1 rounded-md bg-[var(--surface-raised)] px-2 py-1 text-[11px] font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] active:scale-95"
              >
                <Copy size={12} />
                <span>{copiedEmail ? "Copied" : "Copy"}</span>
              </button>
            </div>
          </div>
        </div>

        {/* ================= MAIN SPLIT: FORM & HEADQUARTERS ================= */}
        <div className="mt-6 grid grid-cols-1 items-start gap-8 lg:grid-cols-12 lg:gap-10">
          {/* LEFT: FORM (7 Cols) */}
          <div className="relative overflow-hidden rounded-[26px] border border-[var(--border-color)] bg-gradient-to-b from-[var(--surface-raised)]/90 via-[var(--surface)] to-[var(--surface)] p-6 shadow-xl backdrop-blur-md sm:p-8 lg:col-span-7">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />

            <div className="border-b border-[var(--border-color)]/60 pb-4">
              <h3 className="text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
                Send a Message
              </h3>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Fill in your details and an advisor will prepare a preview card
                for you.
              </p>
            </div>

            {submitted ? (
              <div
                role="status"
                aria-live="polite"
                className="mt-8 flex flex-col items-center justify-center rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-8 text-center"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-500/20 text-[#10b981] shadow-lg">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="mt-4 text-lg font-black text-[var(--text-primary)]">
                  Inquiry Received!
                </h4>
                <p className="mt-1.5 max-w-sm text-xs sm:text-sm text-[var(--text-secondary)] leading-relaxed">
                  Thanks for reaching out. We will get in touch on
                  WhatsApp/Email within 45 minutes.
                </p>
                <button
                  type="button"
                  onClick={() => setSubmitted(false)}
                  className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 text-xs font-bold text-white shadow-md transition hover:bg-[#059669] active:scale-95"
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                {/* Name & Phone */}
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label
                      htmlFor="fullName"
                      className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]"
                    >
                      Your Name <span className="text-[#10b981]">*</span>
                    </label>
                    <input
                      id="fullName"
                      name="fullName"
                      type="text"
                      required
                      autoComplete="name"
                      placeholder="e.g. Rajesh Sharma"
                      value={formData.fullName}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/50 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]"
                    >
                      WhatsApp / Mobile{" "}
                      <span className="text-[#10b981]">*</span>
                    </label>
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      autoComplete="tel"
                      placeholder="+91 98201 XXXXX"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/50 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    Email Address <span className="text-[#10b981]">*</span>
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    autoComplete="email"
                    placeholder="rajesh@brandstudio.in"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/50 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                {/* Select Interest Pills */}
                <div>
                  <label className="mb-2 block text-xs font-semibold text-[var(--text-secondary)]">
                    What are you looking for?
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {needsList.map((item) => (
                      <button
                        key={item}
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, need: item }))
                        }
                        className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                          formData.need === item
                            ? "bg-[#10b981] text-white shadow-xs"
                            : "border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                        }`}
                      >
                        {item}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-xs font-semibold text-[var(--text-secondary)]"
                  >
                    Message / Business Details (Optional)
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={3}
                    placeholder="Tell us about your business, branches, or any special requests..."
                    value={formData.message}
                    onChange={handleChange}
                    className="w-full resize-y rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2.5 text-xs sm:text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/50 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/20"
                  />
                </div>

                {/* Submit CTA */}
                <button
                  type="submit"
                  className="group relative flex min-h-[46px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] px-6 py-2.5 text-sm font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all duration-300 hover:shadow-xl hover:shadow-[#10b981]/35 active:scale-95"
                >
                  <Send
                    size={15}
                    className="transition-transform group-hover:translate-x-0.5"
                  />
                  <span>Submit Inquiry</span>
                </button>

                <p className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--text-secondary)] pt-1">
                  <ShieldCheck size={13} className="text-[#10b981]" />
                  <span>
                    No spam. Your phone number is strictly used for the
                    requested demo.
                  </span>
                </p>
              </form>
            )}
          </div>

          {/* RIGHT: HEADQUARTERS & QUICK GUARANTEES (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            {/* Location Card */}
            <div className="rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-6 shadow-md">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--surface-raised)] text-[var(--text-primary)] border border-[var(--border-color)]">
                  <MapPin size={18} className="text-[#10b981]" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-[var(--text-primary)]">
                    Registered Headquarters
                  </h4>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Mumbai Tech Hub
                  </p>
                </div>
              </div>

              <p className="mt-4 text-xs text-[var(--text-secondary)] leading-relaxed">
                Level 5, Platina Tech Park, Bandra Kurla Complex (BKC), Mumbai,
                Maharashtra 400051, India.
              </p>

              <div className="mt-4 flex items-center justify-between border-t border-[var(--border-color)]/60 pt-3 text-xs text-[var(--text-secondary)]">
                <span className="flex items-center gap-1.5">
                  <Clock size={13} className="text-[#22d3ee]" />
                  <span>Mon – Sat: 9:30 AM – 7:30 PM</span>
                </span>
                <span className="font-semibold text-[#10b981]">IST</span>
              </div>
            </div>

            {/* Platform Guarantees Banner */}
            <div className="rounded-[24px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)] to-[var(--surface)] p-6">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                <Sparkles size={14} className="text-[#10b981]" />
                <span>Why Partner With Us</span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                  <BadgeCheck
                    size={16}
                    className="text-[#10b981] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[var(--text-primary)] font-semibold">
                      Live in 2 Minutes:
                    </strong>{" "}
                    Generate your card, upload catalog photos, and print QR
                    codes immediately.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                  <BadgeCheck
                    size={16}
                    className="text-[#10b981] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[var(--text-primary)] font-semibold">
                      Native Address Book Sync:
                    </strong>{" "}
                    Save contacts directly as native `.VCF` cards on Apple &amp;
                    Android.
                  </div>
                </div>

                <div className="flex items-start gap-2.5 text-xs text-[var(--text-secondary)]">
                  <BadgeCheck
                    size={16}
                    className="text-[#10b981] shrink-0 mt-0.5"
                  />
                  <div>
                    <strong className="text-[var(--text-primary)] font-semibold">
                      Direct WhatsApp Orders:
                    </strong>{" "}
                    Every customer enquiry routes right into your phone chat.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
