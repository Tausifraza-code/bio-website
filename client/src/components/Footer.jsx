import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  CreditCard,
  Mail,
  MapPin,
  Phone,
  ArrowUpRight,
  X,
  ShieldCheck,
  FileText,
  RefreshCw,
  Sparkles,
  ContactRound,
} from "lucide-react";
import { fetchPublicBranding } from "../redux/slice/adminSlice";

const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Platform Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Industries & Trades", href: "#industries" },
      { label: "Customer Reviews", href: "#testimonials" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Digital Visiting Card", href: "#services" },
      { label: "Interactive Catalog", href: "#services" },
      { label: "1-Tap Contact Save", href: "#services" },
      { label: "Smart QR & Standee", href: "#bio-sharing" },
      { label: "Signature Card Suite", href: "#showcase" },
    ],
  },
  {
    title: "Support & Access",
    links: [
      { label: "Live Card Demo", href: "/card-preview/doctor", isRoute: true },
      { label: "Create Your BIO SITES", href: "/register", isRoute: true },
      { label: "Member Login", href: "/login", isRoute: true },
      { label: "Contact Advisory", href: "/contact", isRoute: true },
      { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy-policy", isRoute: true },
  { label: "Terms of Service", modal: "terms" },
];

const socials = [
  {
    label: "Instagram",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        className="h-[17px] w-[17px]"
      >
        <rect x="3" y="3" width="18" height="18" rx="5" />
        <circle cx="12" cy="12" r="4" />
        <circle cx="17.5" cy="6.5" r="0.8" fill="currentColor" />
      </svg>
    ),
  },
  {
    label: "LinkedIn",
    href: "#",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        className="h-[17px] w-[17px]"
      >
        <path d="M5.2 3.5a2.2 2.2 0 1 0 0 4.4 2.2 2.2 0 0 0 0-4.4ZM3.3 9.5h3.8V21H3.3V9.5Zm6.2 0h3.6v1.6h.1a4 4 0 0 1 3.6-2c3.8 0 4.5 2.5 4.5 5.7V21h-3.8v-5.5c0-1.3 0-3-1.9-3s-2.2 1.4-2.2 2.9V21H9.5V9.5Z" />
      </svg>
    ),
  },
];

const policyContent = {
  privacy: {
    title: "Privacy Policy",
    subtitle: "How we collect, protect and handle your business data",
    icon: ShieldCheck,
    sections: [
      {
        heading: "1. Information We Collect",
        body: "When you create a digital visiting card on BIO SITES, we collect the details you provide, including your name, business name, phone number, email, address, website link, social profiles, and uploaded images (profile avatar, logo, banner, product photos).",
      },
      {
        heading: "2. How We Use Your Information",
        body: "Your information is used solely to generate and host your digital profile, provide interactive QR codes, enable 1-Tap contact saving (vCard .vcf), display your catalog, and allow potential customers to submit inquiries.",
      },
      {
        heading: "3. Contact Saving & Public Visibility",
        body: "The information you mark as enabled on your card is publicly visible to anyone who scans your QR or visits your custom subdomain. We never sell your personal contact information to third-party advertisers.",
      },
      {
        heading: "4. Data Security",
        body: "We implement industry-standard encryption protocols and secure cloud storage to protect your account and data. You maintain complete control to edit or delete your profile details at any time from your dashboard.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    subtitle: "Guidelines and rules for using the BIO SITES platform",
    icon: FileText,
    sections: [
      {
        heading: "1. Acceptance of Terms",
        body: "By creating an account or accessing BIO SITES, you agree to comply with and be bound by these Terms of Service. If you do not agree with any part of these terms, please discontinue using the service.",
      },
      {
        heading: "2. Account Responsibility",
        body: "You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your digital card and subdomain. You agree to provide true and accurate information.",
      },
      {
        heading: "3. Acceptable Use Policy",
        body: "You agree not to post any misleading, defamatory, offensive, or copyright-infringing content on your digital visiting card. BIO SITES reserves the right to suspend any card violating safety or legal standards.",
      },
      {
        heading: "4. Service Availability & Modifications",
        body: "We continuously enhance our service, adding new themes and layout features. While we aim for 99.9% uptime, we are not liable for transient network disruptions beyond our reasonable control.",
      },
    ],
  },
  refund: {
    title: "Refund Policy",
    subtitle: "Our commitment to customer satisfaction and fair billing",
    icon: RefreshCw,
    sections: [
      {
        heading: "1. Subscription & Plan Activations",
        body: "BIO SITES plans provide full digital features including custom layouts, QR code generation, interactive product catalogs, and standee export tools upon plan activation.",
      },
      {
        heading: "2. Refund Eligibility",
        body: "If you experience any technical defect that prevents your digital profile or QR code from functioning and our support team is unable to resolve it within 7 business days, you are eligible for a full refund.",
      },
      {
        heading: "3. Requesting a Refund",
        body: "To request a refund, please send an email to Biosites.in@gmail.com with your registered email, payment reference ID, and description of the issue. We review all requests within 48 hours.",
      },
      {
        heading: "4. Processing Timeline",
        body: "Approved refunds are credited back to the original payment method (Bank Account, UPI, or Card) within 5 to 7 business days depending on your banking provider.",
      },
    ],
  },
};

function Footer() {
  const dispatch = useDispatch();
  const branding = useSelector((state) => state.admin.branding);
  const [activeModal, setActiveModal] = useState(null);

  useEffect(() => {
    if (!branding) {
      dispatch(fetchPublicBranding());
    }
  }, [dispatch, branding]);

  const handleSmoothScroll = (event, href) => {
    if (!href || !href.startsWith("#")) return;

    event.preventDefault();
    const targetId = href.replace(/^#/, "");
    const targetElement = document.getElementById(targetId);

    if (targetElement) {
      targetElement.scrollIntoView({ behavior: "smooth", block: "start" });

      if (window.history && window.history.pushState) {
        window.history.pushState(null, "", href);
      }
    }
  };

  const openModal = (modalKey) => {
    setActiveModal(modalKey);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setActiveModal(null);
    document.body.style.overflow = "unset";
  };

  const activePolicy = activeModal ? policyContent[activeModal] : null;

  return (
    <>
      <footer
        id="contact"
        className="border-t border-[#d7e3eb] bg-[#f1f6f9] text-[#0b1b30] dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white"
      >
        <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
          {/* Main footer */}
          <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12 lg:py-12">
            {/* Brand and contact details */}
            <div>
              <Link
                to="/"
                onClick={(e) => {
                  if (window.location.pathname === "/") {
                    handleSmoothScroll(e, "#home");
                  }
                }}
                aria-label="BIO SITES Home"
                className="group inline-flex items-center gap-2.5 transition-transform hover:scale-[1.02]"
              >
                {branding?.websiteLogo ? (
                  <img
                    src={branding.websiteLogo}
                    alt="BIO SITES"
                    className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1 shadow-sm"
                  />
                ) : (
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-cyan-200 bg-cyan-50 text-cyan-700 shadow-sm dark:border-cyan-300/20 dark:bg-cyan-300/10 dark:text-cyan-200">
                    <ContactRound size={22} strokeWidth={2.2} />
                  </span>
                )}

                <span className="text-[19px] font-extrabold tracking-tight text-[#0b1b30] dark:text-white min-[380px]:text-[21px]">
                  BIO SITES
                </span>
              </Link>

              <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b] dark:text-[#94a3b8]">
                Your digital identity, simplified. Share your business, showcase
                your work, and connect with customers effortlessly in one tap.
              </p>

              <div className="mt-5 space-y-3">
                <a
                  href="mailto:Biosites.in@gmail.com"
                  className="group flex items-center gap-3 text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                >
                  <Mail
                    size={16}
                    className="shrink-0 text-cyan-600 transition-transform group-hover:scale-110 dark:text-cyan-300"
                  />
                  <span className="break-all font-medium">
                    Biosites.in@gmail.com
                  </span>
                </a>

                <a
                  href="tel:+919820188287"
                  className="group flex items-center gap-3 text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                >
                  <Phone
                    size={16}
                    className="shrink-0 text-cyan-600 transition-transform group-hover:scale-110 dark:text-cyan-300"
                  />
                  <span className="font-medium">+91 92103 39252</span>
                </a>

                <div className="flex items-start gap-3 text-sm leading-5 text-[#64748b] dark:text-[#94a3b8]">
                  <MapPin
                    size={16}
                    className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-300"
                  />
                  <span>
                    Property No. V-6, Old No. 5/6, Khasra No. 28, Near 100 Foota
                    Road, Vijay Park, Maujpur, East Delhi, Delhi – 110053,
                    India.
                  </span>
                </div>
              </div>

              {/* Social links */}
              <div className="mt-5">
                <p className="mb-3 text-sm font-semibold">Follow us</p>

                <div className="flex gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href={social.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={social.label}
                      className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7e3eb] bg-white text-[#64748b] transition hover:border-cyan-400 hover:bg-cyan-400 hover:text-[#0b1b30] hover:shadow-md dark:border-[#29435f] dark:bg-[#132942] dark:text-[#94a3b8] dark:hover:border-cyan-300 dark:hover:bg-cyan-300 dark:hover:text-[#0b1b30]"
                    >
                      {social.icon}
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Link columns */}
            {footerColumns.map((column) => (
              <div key={column.title}>
                <h3 className="text-sm font-bold tracking-tight text-[#0b1b30] dark:text-white">
                  {column.title}
                </h3>

                <ul className="mt-5 space-y-3">
                  {column.links.map((link) => {
                    // Modal trigger
                    if (link.modal) {
                      return (
                        <li key={link.label}>
                          <button
                            type="button"
                            onClick={() => openModal(link.modal)}
                            className="text-left text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                          >
                            {link.label}
                          </button>
                        </li>
                      );
                    }

                    // Route link (React Router)
                    if (link.isRoute) {
                      return (
                        <li key={link.label}>
                          <Link
                            to={link.href}
                            className="inline-flex items-center gap-1 text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                          >
                            {link.label}
                            <ArrowUpRight size={12} className="opacity-70" />
                          </Link>
                        </li>
                      );
                    }

                    // Anchor link (In-page smooth scroll)
                    return (
                      <li key={link.label}>
                        <a
                          href={link.href}
                          onClick={(e) => handleSmoothScroll(e, link.href)}
                          className="text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                        >
                          {link.label}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>

          {/* Bottom bar */}
          <div className="flex flex-col gap-4 border-t border-[#d7e3eb] py-5 text-xs text-[#64748b] dark:border-[#29435f] dark:text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
            <p className="leading-5">
              © {new Date().getFullYear()} BIO SITES. All rights reserved. Built
              for professionals & modern businesses.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
              {legalLinks.map((link) =>
                link.isRoute ? (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
                  >
                    {link.label}
                  </Link>
                ) : (
                  <button
                    key={link.label}
                    type="button"
                    onClick={() => openModal(link.modal)}
                    className="transition-colors hover:text-cyan-700 dark:hover:text-cyan-300 cursor-pointer"
                  >
                    {link.label}
                  </button>
                ),
              )}

              <a
                href="#home"
                onClick={(e) => handleSmoothScroll(e, "#home")}
                className="inline-flex items-center gap-1 font-semibold text-[#0b1b30] transition-colors hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300"
              >
                Back to top
                <ArrowUpRight size={13} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      {/* Policy Modal (Opens inline without navigating to any dead page) */}
      {activePolicy && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/60 p-4 backdrop-blur-sm sm:p-6"
          onClick={closeModal}
        >
          <div
            className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#d7e3eb] bg-white p-6 shadow-2xl transition-all duration-300 dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white sm:p-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top gradient highlight */}
            <div className="absolute inset-x-0 top-0 h-[3px] bg-gradient-to-r from-cyan-500 via-teal-400 to-cyan-500" />

            {/* Header */}
            <div className="flex items-start justify-between gap-4 border-b border-[#e2e8f0] pb-5 dark:border-[#29435f]">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-600 dark:bg-cyan-400/20 dark:text-cyan-300">
                  <activePolicy.icon size={22} />
                </div>
                <div>
                  <h3 className="text-xl font-bold tracking-tight text-[#0b1b30] dark:text-white">
                    {activePolicy.title}
                  </h3>
                  <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                    {activePolicy.subtitle}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 hover:text-slate-800 dark:border-[#29435f] dark:text-slate-400 dark:hover:bg-[#132942] dark:hover:text-white"
                aria-label="Close modal"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content list */}
            <div className="mt-6 max-h-[58vh] space-y-5 overflow-y-auto pr-2 text-sm text-[#475569] dark:text-slate-300">
              {activePolicy.sections.map((section) => (
                <div
                  key={section.heading}
                  className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4 dark:border-[#1e344d] dark:bg-[#132942]/60"
                >
                  <h4 className="font-bold text-[#0b1b30] dark:text-white">
                    {section.heading}
                  </h4>
                  <p className="mt-2 text-xs leading-relaxed sm:text-sm">
                    {section.body}
                  </p>
                </div>
              ))}

              <div className="rounded-2xl border border-cyan-500/20 bg-cyan-50/50 p-4 dark:border-cyan-500/20 dark:bg-cyan-950/20">
                <div className="flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
                  <Sparkles size={14} />
                  <span>Have questions regarding our policies?</span>
                </div>
                <p className="mt-1 text-xs text-slate-600 dark:text-slate-300">
                  Feel free to contact our team anytime at{" "}
                  <a
                    href="mailto:Biosites.in@gmail.com"
                    className="font-semibold text-cyan-600 underline hover:text-cyan-700 dark:text-cyan-300"
                  >
                    Biosites.in@gmail.com
                  </a>
                  .
                </p>
              </div>
            </div>

            {/* Footer action */}
            <div className="mt-6 flex justify-end border-t border-[#e2e8f0] pt-4 dark:border-[#29435f]">
              <button
                type="button"
                onClick={closeModal}
                className="rounded-xl bg-cyan-400 px-6 py-2.5 text-xs font-bold text-[#0b1b30] shadow-md shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-95"
              >
                I Understand
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Footer;
