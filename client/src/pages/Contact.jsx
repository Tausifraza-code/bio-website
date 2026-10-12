import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock3,
  MessageCircle,
  CheckCircle2,
  CircleHelp,
  Send,
  Search,
  ShieldCheck,
  Zap,
} from "lucide-react";

const industries = [
  "Barber Shop & Men's Grooming",
  "Beauty Parlour & Salon",
  "Women's Boutique & Ethnic Wear",
  "Men's Clothing & Tailoring",
  "Children's Clothing & Kidswear",
  "Doctors, Clinics & Labs",
  "Restaurants, Cafes & Sweets",
  "Consultants, CAs & Legal",
  "Automotive & Detailing",
  "Retail & Shopping",
  "Education & Coaching",
  "Other Services",
];

function Contact() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    industry: industries[0],
    message: "",
  });

  const [submitted, setSubmitted] = useState(false);
  const [searchIndustry, setSearchIndustry] = useState("");

  const filteredIndustries = industries.filter((industry) =>
    industry.toLowerCase().includes(searchIndustry.toLowerCase()),
  );

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Frontend-only submission: no backend or database yet.
    setSubmitted(true);
  };

  const resetForm = () => {
    setFormData({
      fullName: "",
      email: "",
      phone: "",
      industry: industries[0],
      message: "",
    });
    setSearchIndustry("");
    setSubmitted(false);
  };

  const inputClasses =
    "w-full min-w-0 rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] px-4 py-3 text-sm text-[var(--text-primary)] outline-none transition placeholder:text-[var(--text-secondary)]/60 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/20";

  return (
    <section
      id="contact"
      className="relative overflow-hidden py-10 sm:py-12 lg:py-14"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-5%] top-20 h-80 w-80 rounded-full bg-violet-600/[0.08] blur-[120px]" />
        <div className="absolute right-[-5%] bottom-10 h-80 w-80 rounded-full bg-fuchsia-600/[0.07] blur-[120px]" />
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,var(--border-color)_1px,transparent_0)] [background-size:24px_24px]" />
      </div>

      <div className="mx-auto w-full max-w-[1330px] px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* Section heading */}
        <div className="mx-auto mb-8 max-w-[790px] text-center sm:mb-10">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.07] px-3.5 py-1.5 text-xs font-semibold text-[var(--accent)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
            </span>
            <MessageCircle size={14} className="text-[var(--accent)]" />
            <span>Direct Advisory &amp; Enterprise Support</span>
          </div>

          <h2 className="text-[clamp(28px,3.3vw,44px)] font-extrabold leading-[1.15] tracking-[-0.04em] text-[var(--text-primary)]">
            Ready to Upgrade Your In-Person &amp; Phone{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent">
              Sales?
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-[700px] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Have questions about custom domain setups, multi-branch franchises, or onboarding your team? Reach out and get a customized demo.
          </p>
        </div>

        {/* Main contact layout */}
        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-8">
          {/* Left column: Contact Info & Support */}
          <div className="flex min-w-0 flex-col gap-5">
            <div className="relative overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)]/90 via-[var(--surface)] to-[var(--surface)] p-5 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-6 lg:p-7">
              {/* Subtle top hairline */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
                    Platform Headquarters &amp; Support
                  </h3>
                  <p className="text-xs text-[var(--text-secondary)]">
                    Dedicated support for onboarding &amp; custom cards
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-0.5 text-[10px] font-bold text-emerald-400">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Active Support
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {/* Address */}
                <div className="group flex items-start gap-3.5 rounded-xl border border-transparent p-2 transition-all hover:border-[var(--border-color)] hover:bg-[var(--surface-raised)]/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-violet-500/25 bg-violet-500/10 text-violet-400 transition-transform group-hover:scale-105">
                    <MapPin size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Office Address
                    </h4>
                    <p className="mt-0.5 text-xs sm:text-[13px] leading-relaxed text-[var(--text-primary)]">
                      Level 5, Platina Tech Park, Bandra Kurla Complex (BKC),
                      Mumbai, Maharashtra 400051, India
                    </p>
                  </div>
                </div>

                {/* Phone */}
                <div className="group flex items-start gap-3.5 rounded-xl border border-transparent p-2 transition-all hover:border-[var(--border-color)] hover:bg-[var(--surface-raised)]/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-emerald-500/25 bg-emerald-500/10 text-emerald-400 transition-transform group-hover:scale-105">
                    <Phone size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Customer Inquiries Hotline
                    </h4>
                    <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-1">
                      <a
                        href="tel:+919820188287"
                        className="text-xs sm:text-[13px] font-bold text-[var(--accent)] hover:underline"
                      >
                        +91 98201 88287
                      </a>
                      <span className="text-[var(--text-secondary)]">•</span>
                      <a
                        href="tel:+9102267894321"
                        className="text-xs sm:text-[13px] font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                      >
                        +91 (022) 6789 4321
                      </a>
                    </div>
                  </div>
                </div>

                {/* Email */}
                <div className="group flex items-start gap-3.5 rounded-xl border border-transparent p-2 transition-all hover:border-[var(--border-color)] hover:bg-[var(--surface-raised)]/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-sky-500/25 bg-sky-500/10 text-sky-400 transition-transform group-hover:scale-105">
                    <Mail size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                        Direct Email
                      </h4>
                      <span className="text-[10px] font-medium text-sky-400 bg-sky-500/10 px-1.5 py-0.2 rounded">
                        ⚡ ~45 min reply
                      </span>
                    </div>
                    <a
                      href="mailto:support@visitingcard.pro"
                      className="mt-0.5 block break-all text-xs sm:text-[13px] font-bold text-[var(--accent)] hover:underline"
                    >
                      support@visitingcard.pro
                    </a>
                  </div>
                </div>

                {/* Support hours */}
                <div className="group flex items-start gap-3.5 rounded-xl border border-transparent p-2 transition-all hover:border-[var(--border-color)] hover:bg-[var(--surface-raised)]/60">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-amber-500/25 bg-amber-500/10 text-amber-400 transition-transform group-hover:scale-105">
                    <Clock3 size={18} />
                  </div>

                  <div className="min-w-0 flex-1">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                      Operating Hours
                    </h4>
                    <p className="mt-0.5 text-xs sm:text-[13px] text-[var(--text-primary)]">
                      Monday to Saturday: 9:30 AM – 7:30 PM IST
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ card */}
            <div className="rounded-[20px] border border-[var(--border-color)] bg-[var(--surface)]/80 p-4 sm:p-5 backdrop-blur-sm transition-colors hover:border-violet-500/30">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-violet-500/15 text-[var(--accent)] ring-1 ring-inset ring-violet-500/20">
                  <CircleHelp size={16} />
                </span>

                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                    Do prospective clients need to download an app?
                  </h4>

                  <p className="mt-1 text-xs leading-relaxed text-[var(--text-secondary)]">
                    No! The mini website opens instantly inside mobile browsers (Safari, Chrome) via QR code or direct link. Contact details download to native phone address books in 1 tap.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right column: Interactive Inquiry Form */}
          <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)]/95 via-[var(--surface)] to-[var(--surface)] p-5 shadow-xl shadow-black/5 backdrop-blur-md sm:p-7 lg:p-8">
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-violet-400/30 to-transparent" />

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
                  Send Us a Message
                </h3>
                <p className="mt-0.5 text-xs text-[var(--text-secondary)]">
                  Fill in your details below and our team will get in touch.
                </p>
              </div>

              <span className="hidden sm:inline-flex items-center gap-1 rounded-full border border-violet-500/20 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-[var(--accent)]">
                <Zap size={11} /> Fast Turnaround
              </span>
            </div>

            {submitted ? (
              /* Success state */
              <div
                role="status"
                aria-live="polite"
                className="contact-success-card mt-6 flex min-h-[140px] items-start gap-4 rounded-[20px] border border-emerald-500/30 bg-emerald-500/10 p-5 sm:p-6"
              >
                <div className="contact-success-icon flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-500/20 text-emerald-400">
                  <CheckCircle2 size={24} />
                </div>

                <div className="min-w-0">
                  <h4 className="contact-success-title text-base font-extrabold text-emerald-800 dark:text-emerald-300">
                    Thank You! Your Inquiry Has Been Received.
                  </h4>

                  <p className="contact-success-desc mt-1 text-xs sm:text-sm leading-relaxed text-emerald-700/90 dark:text-emerald-200/90">
                    A product specialist will contact you shortly to help configure your digital visiting card profile.
                  </p>

                  <button
                    type="button"
                    onClick={resetForm}
                    className="contact-success-btn mt-3.5 inline-flex items-center gap-1.5 rounded-lg border border-emerald-600/30 bg-emerald-600/10 px-3.5 py-1.5 text-xs font-bold text-emerald-700 transition hover:bg-emerald-600 hover:text-white dark:border-emerald-500/30 dark:bg-emerald-500/20 dark:text-emerald-200 dark:hover:bg-emerald-500/30 dark:hover:text-white active:scale-95"
                  >
                    Submit another inquiry
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {/* Name and email */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label
                      htmlFor="contact-fullName"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Your Full Name <span className="text-rose-400">*</span>
                    </label>

                    <input
                      id="contact-fullName"
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="e.g. Rahul Sharma"
                      autoComplete="name"
                      maxLength={100}
                      required
                      className={inputClasses}
                    />
                  </div>

                  <div className="min-w-0">
                    <label
                      htmlFor="contact-email"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Email Address <span className="text-rose-400">*</span>
                    </label>

                    <input
                      id="contact-email"
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="rahul@example.com"
                      autoComplete="email"
                      maxLength={254}
                      required
                      className={inputClasses}
                    />
                  </div>
                </div>

                {/* Phone and industry */}
                <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                  <div className="min-w-0">
                    <label
                      htmlFor="contact-phone"
                      className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      Phone Number
                    </label>

                    <input
                      id="contact-phone"
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      placeholder="+91 98765 43210"
                      autoComplete="tel"
                      maxLength={20}
                      className={inputClasses}
                    />
                  </div>

                  <div className="min-w-0">
                    <div className="mb-1.5 flex items-center justify-between">
                      <label
                        htmlFor="contact-industry"
                        className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                      >
                        Your Industry
                      </label>

                      <span className="text-[10px] font-semibold text-[var(--accent)]">
                        12 Categories
                      </span>
                    </div>

                    <select
                      id="contact-industry"
                      name="industry"
                      value={formData.industry}
                      onChange={handleChange}
                      className={inputClasses}
                    >
                      {industries.map((industry) => (
                        <option
                          key={industry}
                          value={industry}
                          className="bg-[var(--surface)] text-[var(--text-primary)]"
                        >
                          {industry}
                        </option>
                      ))}
                    </select>

                    <div className="mt-1.5 flex items-center gap-1.5 rounded-lg border border-[var(--border-color)]/60 bg-[var(--surface)] px-2.5 py-1 text-xs text-[var(--accent)]">
                      <Search size={12} className="shrink-0 opacity-70" />
                      <input
                        id="industry-search"
                        type="text"
                        value={searchIndustry}
                        onChange={(event) =>
                          setSearchIndustry(event.target.value)
                        }
                        placeholder="Filter industries..."
                        className="min-w-0 flex-1 bg-transparent text-xs text-[var(--text-primary)] outline-none placeholder:text-[var(--text-secondary)]/60"
                      />
                    </div>

                    {searchIndustry && (
                      <div className="mt-1.5 max-h-32 overflow-y-auto rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)] p-1 shadow-lg">
                        {filteredIndustries.length > 0 ? (
                          filteredIndustries.map((industry) => (
                            <button
                              key={industry}
                              type="button"
                              onClick={() => {
                                setFormData((previous) => ({
                                  ...previous,
                                  industry,
                                }));
                                setSearchIndustry("");
                              }}
                              className="block w-full rounded-lg px-2.5 py-1.5 text-left text-xs text-[var(--text-primary)] transition hover:bg-violet-500/15"
                            >
                              {industry}
                            </button>
                          ))
                        ) : (
                          <p className="px-2.5 py-1.5 text-xs text-[var(--text-secondary)]">
                            No matching industry found.
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </div>

                {/* Message */}
                <div>
                  <div className="mb-1.5 flex items-center justify-between">
                    <label
                      htmlFor="contact-message"
                      className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]"
                    >
                      How Can We Help You?
                    </label>
                    <span className="text-[11px] text-[var(--text-secondary)]">
                      {formData.message.length}/2000
                    </span>
                  </div>

                  <textarea
                    id="contact-message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    placeholder="Tell us about your business, requirements, or features you'd like..."
                    rows={3}
                    maxLength={2000}
                    className={`${inputClasses} min-h-[90px] resize-y leading-relaxed`}
                  />
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  className="group relative flex min-h-[48px] w-full items-center justify-center gap-2 overflow-hidden rounded-xl border border-violet-400/50 bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 px-5 py-3 text-sm font-bold text-white shadow-lg shadow-violet-600/20 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-violet-600/30 active:scale-95"
                >
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
                  <Send
                    size={15}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                  <span>Submit Inquiry</span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-center text-[11px] text-[var(--text-secondary)]">
                  <ShieldCheck size={13} className="text-emerald-400 shrink-0" />
                  <span>Your information is strictly protected. Zero spam guarantee.</span>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default Contact;
