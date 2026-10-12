import {
  CreditCard,
  ArrowRight,
  ArrowUpRight,
  Mail,
  MapPin,
  Sparkles,
  Phone,
  ShieldCheck,
  Zap,
  Globe,
  Share2,
} from "lucide-react";

const InstagramIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect width="4" height="12" x="2" y="9" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const TwitterIcon = ({ size = 18, className = "" }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M4 4l11.733 16h4.267l-11.733 -16z" />
    <path d="M4 20l6.768 -6.768m2.46 -2.46l6.772 -6.772" />
  </svg>
);

function Footer() {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Features", href: "#services" },
    { label: "Why Us", href: "#about" },
    { label: "Advisory & Demo", href: "#contact" },
  ];

  const features = [
    { label: "Digital Visiting Card", href: "#services" },
    { label: "1-Tap Contact Save (.VCF)", href: "#services" },
    { label: "Interactive Product Catalog", href: "#services" },
    { label: "Dynamic QR Code Generator", href: "#services" },
    { label: "WhatsApp Lead Capture", href: "#services" },
  ];

  const legalLinks = [
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Terms of Service", href: "/terms" },
    { label: "Refund Policy", href: "/terms" },
  ];

  return (
    <footer className="footer-section relative isolate overflow-hidden border-t border-[var(--border-color)] bg-[var(--page-bg)]">
      {/* Dynamic ambient radial lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/3 -top-24 h-72 w-72 rounded-full bg-[#10b981]/[0.06] blur-[120px]" />
        <div className="absolute right-10 -bottom-24 h-72 w-72 rounded-full bg-[#22d3ee]/[0.06] blur-[120px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.05]" />
      </div>

      <div className="mx-auto w-full max-w-[1300px] px-4 pt-6 pb-6 sm:px-6 sm:pt-6 md:px-6 lg:px-6 lg:pt-6 xl:px-6">
        {/* ========================================================
            TOP CALLOUT: READY TO LAUNCH IN 2 MINUTES BANNER
        ======================================================== */}
        <div className="relative mb-14 overflow-hidden rounded-[26px] border border-[var(--border-color)] bg-gradient-to-r from-[var(--surface-raised)]/95 via-[var(--surface)] to-[var(--surface-raised)]/95 p-6 shadow-xl backdrop-blur-md sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#10b981]/20 blur-3xl" />
          <div className="pointer-events-none absolute -left-16 -bottom-16 h-48 w-48 rounded-full bg-[#22d3ee]/15 blur-3xl" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-2xl space-y-2">
              <div className="inline-flex items-center gap-2 rounded-full border border-[#10b981]/30 bg-[#10b981]/10 px-3 py-1 text-xs font-bold text-[#10b981]">
                <Sparkles size={13} />
                <span>Launch in 2 Minutes</span>
              </div>
              <h3 className="text-xl font-black tracking-tight text-[var(--text-primary)] sm:text-2xl lg:text-3xl">
                Ready to Upgrade Your Business Identity?
              </h3>
              <p className="text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
                Join thousands of service professionals and retailers who turned
                their business cards into interactive 24/7 client magnets.
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 lg:shrink-0">
              <a
                href="/register"
                className="group inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#059669] px-6 py-2.5 text-xs font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:shadow-xl hover:shadow-[#10b981]/35 active:scale-95 sm:text-sm"
              >
                <span>Create Your Card Free</span>
                <ArrowRight
                  size={15}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>
              <a
                href="/preview"
                className="inline-flex min-h-[46px] items-center justify-center gap-2 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-5 py-2.5 text-xs font-semibold text-[var(--text-primary)] transition-all hover:border-[#22d3ee]/50 hover:bg-[var(--surface-raised)] sm:text-sm"
              >
                <span>Test Live Demo</span>
              </a>
            </div>
          </div>
        </div>

        {/* ========================================================
            4-COLUMN FOOTER NAVIGATION
        ======================================================== */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          {/* Column 1: Brand & Story (5 Cols) */}
          <div className="space-y-4 lg:col-span-5">
            <a
              href="#home"
              aria-label="BIO Website Home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#22d3ee] text-white shadow-md shadow-[#10b981]/25">
                <CreditCard size={22} strokeWidth={2} />
              </span>
              <div>
                <span className="block text-lg font-black tracking-tight text-[var(--text-primary)]">
                  BIO Website
                </span>
                <span className="block text-[9.5px] font-bold uppercase tracking-wider text-[#0891b2] dark:text-[#22d3ee]">
                  Smart Visiting Card &amp; Portfolio
                </span>
              </div>
            </a>

            <p className="max-w-sm text-xs leading-relaxed text-[var(--text-secondary)] sm:text-sm">
              The digital business card platform built for local shops, clinics,
              grooming studios, and consultants. Never lose another contact to
              the paper bin.
            </p>

            {/* Social Icons */}
            <div className="flex items-center gap-2 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all hover:border-[#10b981]/50 hover:bg-[#10b981]/10 hover:text-[#10b981]"
              >
                <InstagramIcon size={17} />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all hover:border-[#10b981]/50 hover:bg-[#10b981]/10 hover:text-[#10b981]"
              >
                <LinkedinIcon size={17} />
              </a>
              <a
                href="https://x.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter / X"
                className="flex h-9 w-9 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all hover:border-[#22d3ee]/50 hover:bg-[#22d3ee]/10 hover:text-[#22d3ee]"
              >
                <TwitterIcon size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Navigation Links (2 Cols) */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Navigation
            </h4>
            <ul className="space-y-2.5">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs text-[var(--text-secondary)] transition-colors hover:text-[#10b981]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Platform Features (3 Cols) */}
          <div className="space-y-3 lg:col-span-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Core Capabilities
            </h4>
            <ul className="space-y-2.5">
              {features.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-xs text-[var(--text-secondary)] transition-colors hover:text-[#10b981]"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Contact & Support (2 Cols) */}
          <div className="space-y-3 lg:col-span-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
              Support &amp; Contact
            </h4>
            <div className="space-y-2.5 text-xs text-[var(--text-secondary)]">
              <a
                href="mailto:support@visitingcard.pro"
                className="block truncate transition-colors hover:text-[#10b981]"
              >
                support@visitingcard.pro
              </a>
              <a
                href="tel:+919820188287"
                className="block transition-colors hover:text-[#10b981]"
              >
                +91 98201 88287
              </a>
              <p className="text-[11px] leading-relaxed text-[var(--text-secondary)]/80">
                Platina Tech Park, BKC, Mumbai
              </p>
            </div>
          </div>
        </div>

        {/* ========================================================
            BOTTOM LEGAL BAR & BACK-TO-TOP
        ======================================================== */}
        <div className="mt-5 flex flex-col gap-4 border-t border-[var(--border-color)]/70 pt-6 text-xs text-[var(--text-secondary)] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} BIO Website Platform. All rights
            reserved.
          </p>

          <div className="flex flex-wrap items-center gap-5">
            {legalLinks.map((legal) => (
              <a
                key={legal.label}
                href={legal.href}
                className="transition-colors hover:text-[var(--text-primary)]"
              >
                {legal.label}
              </a>
            ))}
            <a
              href="#home"
              className="font-semibold text-[#10b981] transition-colors hover:underline"
            >
              Back to top ↑
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
