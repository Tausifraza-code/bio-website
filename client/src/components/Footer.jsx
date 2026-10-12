import { CreditCard, ArrowUpRight, Mail, MapPin, Sparkles } from "lucide-react";

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

const YoutubeIcon = ({ size = 18, className = "" }) => (
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
    <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
    <path d="m10 15 5-3-5-3z" />
  </svg>
);

function Footer() {
  const quickLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const services = [
    { label: "Digital Visiting Card", href: "#services" },
    { label: "Contact Sharing", href: "#services" },
    { label: "Product Catalogue", href: "#services" },
    { label: "QR Code Access", href: "#services" },
  ];

  return (
    <footer className="footer-section relative overflow-hidden border-t border-[var(--border-color)] bg-[var(--page-bg)]">
      {/* Background glows */}
      <div className="pointer-events-none absolute -bottom-32 left-1/4 h-64 w-64 rounded-full bg-[#10b981]/[0.08] blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-24 right-1/4 h-56 w-56 rounded-full bg-[#22d3ee]/[0.08] blur-[100px]" />

      <div className="relative mx-auto w-full max-w-[1330px] px-5 pb-5 pt-12 sm:px-8 sm:pt-14 lg:px-10 lg:pt-16 xl:px-12">
        {/* Main footer grid */}
        <div className="grid grid-cols-1 gap-9 sm:grid-cols-2 lg:grid-cols-[1.4fr_0.8fr_1fr_1fr] lg:gap-10">
          {/* Brand */}
          <div className="min-w-0">
            <a
              href="#home"
              aria-label="BIO Website home"
              className="inline-flex items-center gap-3"
            >
              <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-[14px] border border-emerald-400/40 bg-gradient-to-br from-[#10b981] to-[#22d3ee] text-white shadow-lg shadow-[#10b981]/25">
                <CreditCard size={23} strokeWidth={1.8} />
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              </span>

              <span>
                <span className="block text-lg font-extrabold tracking-tight text-[var(--text-primary)]">
                  BIO Website
                </span>
                <span className="mt-0.5 block text-[9px] font-bold uppercase tracking-[0.13em] text-[#0891b2] dark:text-[#22d3ee]">
                  Smart Business Card &amp; Portfolio
                </span>
              </span>
            </a>

            <p className="mt-4 max-w-[320px] text-sm leading-6 text-[var(--text-secondary)]">
              Your business identity, all in one link. Help customers discover
              your services, save your contact and connect with your business.
            </p>

            {/* Social links — emerald hover */}
            <div className="mt-5 flex items-center gap-2.5">
              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[#10b981]/40 hover:bg-[#10b981]/10 hover:text-[#10b981]"
              >
                <InstagramIcon size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[#10b981]/40 hover:bg-[#10b981]/10 hover:text-[#10b981]"
              >
                <LinkedinIcon size={18} />
              </a>

              <a
                href="#"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition hover:border-[#10b981]/40 hover:bg-[#10b981]/10 hover:text-[#10b981]"
              >
                <YoutubeIcon size={18} />
              </a>
            </div>
          </div>

          {/* Quick links */}
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
              Quick Links
            </h3>

            <ul className="mt-4 space-y-3">
              {quickLinks.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition hover:text-[#10b981]"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
              Our Features
            </h3>

            <ul className="mt-4 space-y-3">
              {services.map((service) => (
                <li key={service.label}>
                  <a
                    href={service.href}
                    className="inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] transition hover:text-[#10b981]"
                  >
                    {service.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="min-w-0">
            <h3 className="text-sm font-extrabold text-[var(--text-primary)]">
              Get in Touch
            </h3>

            <div className="mt-4 space-y-4">
              <a
                href="mailto:support@visitingcard.pro"
                className="flex min-w-0 items-start gap-2.5 text-sm text-[var(--text-secondary)] transition hover:text-[#10b981]"
              >
                <Mail size={17} className="mt-0.5 shrink-0 text-[#10b981]" />
                <span className="break-all">support@visitingcard.pro</span>
              </a>

              <div className="flex items-start gap-2.5 text-sm text-[var(--text-secondary)]">
                <MapPin size={17} className="mt-0.5 shrink-0 text-[#10b981]" />
                <span>Mumbai, Maharashtra, India</span>
              </div>
            </div>

            <a
              href="#contact"
              className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-[#10b981] transition hover:gap-3"
            >
              Contact our team
              <ArrowUpRight size={16} />
            </a>
          </div>
        </div>

        {/* Get started banner — emerald + cyan */}
        <div className="mt-10 flex flex-col gap-4 rounded-[20px] border border-[#10b981]/25 bg-gradient-to-r from-[#10b981]/[0.08] to-[#22d3ee]/[0.08] p-5 sm:mt-12 sm:flex-row sm:items-center sm:justify-between sm:p-6">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#22d3ee]/10 text-[#0891b2] ring-1 ring-inset ring-[#22d3ee]/30 dark:text-[#22d3ee]">
              <Sparkles size={20} />
            </div>

            <div>
              <h3 className="text-sm font-extrabold text-[var(--text-primary)] sm:text-base">
                Ready to create your digital identity?
              </h3>
              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)] sm:text-sm">
                Bring your business details and services together in one place.
              </p>
            </div>
          </div>

          <a
            href="/register"
            className="group relative inline-flex min-h-11 shrink-0 items-center justify-center gap-2 overflow-hidden rounded-xl border border-[#10b981] bg-[#10b981] px-5 py-3 text-sm font-bold text-white shadow-lg shadow-[#10b981]/25 transition hover:-translate-y-0.5 hover:bg-[#059669] hover:shadow-xl hover:shadow-[#10b981]/40"
          >
            <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/40 to-transparent" />
            Create Your Card
            <ArrowUpRight
              size={16}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col gap-4 border-t border-[var(--border-color)] py-5 sm:mt-10 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs leading-5 text-[var(--text-secondary)]">
            © {new Date().getFullYear()} BIO Website. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <a
              href="/privacy"
              className="text-xs text-[var(--text-secondary)] transition hover:text-[#10b981]"
            >
              Privacy Policy
            </a>

            <a
              href="/terms"
              className="text-xs text-[var(--text-secondary)] transition hover:text-[#10b981]"
            >
              Terms of Service
            </a>

            <a
              href="#home"
              className="text-xs text-[var(--text-secondary)] transition hover:text-[#10b981]"
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
