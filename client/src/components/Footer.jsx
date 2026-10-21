import { CreditCard, Mail, MapPin, Phone, ArrowUpRight } from "lucide-react";

const footerColumns = [
  {
    title: "Quick Links",
    links: [
      { label: "Home", href: "#home" },
      { label: "Features", href: "#services" },
      { label: "Why Us", href: "#about" },
      { label: "Advisory & Demo", href: "#contact" },
    ],
  },
  {
    title: "Our Services",
    links: [
      { label: "Digital Visiting Card", href: "#services" },
      { label: "1-Tap Contact Save", href: "#services" },
      { label: "Interactive Catalog", href: "#services" },
      { label: "QR Code Generator", href: "#services" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Contact Us", href: "mailto:support@visitingcard.pro" },
      { label: "Live Demo", href: "/preview" },
      { label: "Create Your Card", href: "/register" },
      { label: "Privacy Policy", href: "/privacy" },
    ],
  },
];

const legalLinks = [
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Service", href: "/terms" },
  { label: "Refund Policy", href: "/terms" },
];

const socials = [
  {
    label: "Instagram",
    href: "https://instagram.com",
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
    href: "https://linkedin.com",
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

function Footer() {
  return (
    <footer
      id="contact"
      className="border-t border-[#d7e3eb] bg-[#f1f6f9] text-[#0b1b30] dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white"
    >
      <div className="mx-auto max-w-[1280px] px-5 sm:px-8 lg:px-10">
        {/* Main footer */}
        <div className="grid gap-10 py-10 sm:grid-cols-2 lg:grid-cols-[1.7fr_1fr_1fr_1fr] lg:gap-12 lg:py-12">
          {/* Brand and contact details */}
          <div>
            <a
              href="#home"
              aria-label="BIO Website Home"
              className="inline-flex items-center gap-3"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400 text-[#0b1b30]">
                <CreditCard size={21} />
              </span>

              <span className="text-xl font-extrabold tracking-tight">
                BIO<span className="text-cyan-600 dark:text-cyan-300">.</span>
              </span>
            </a>

            <p className="mt-4 max-w-sm text-sm leading-6 text-[#64748b] dark:text-[#94a3b8]">
              Your digital identity, simplified. Share your business, showcase
              your work, and connect with people effortlessly.
            </p>

            <div className="mt-5 space-y-3">
              <a
                href="mailto:support@visitingcard.pro"
                className="flex items-center gap-3 text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
              >
                <Mail
                  size={16}
                  className="shrink-0 text-cyan-600 dark:text-cyan-300"
                />
                <span className="break-all">support@visitingcard.pro</span>
              </a>

              <a
                href="tel:+919820188287"
                className="flex items-center gap-3 text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
              >
                <Phone
                  size={16}
                  className="shrink-0 text-cyan-600 dark:text-cyan-300"
                />
                <span>+91 98201 88287</span>
              </a>

              <div className="flex items-start gap-3 text-sm leading-5 text-[#64748b] dark:text-[#94a3b8]">
                <MapPin
                  size={16}
                  className="mt-0.5 shrink-0 text-cyan-600 dark:text-cyan-300"
                />
                <span>Platina Tech Park, BKC, Mumbai</span>
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
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-[#d7e3eb] bg-white text-[#64748b] transition-colors hover:border-cyan-400 hover:bg-cyan-400 hover:text-[#0b1b30] dark:border-[#29435f] dark:bg-[#132942] dark:text-[#94a3b8] dark:hover:border-cyan-300 dark:hover:bg-cyan-300 dark:hover:text-[#0b1b30]"
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
              <h3 className="text-sm font-bold text-[#0b1b30] dark:text-white">
                {column.title}
              </h3>

              <ul className="mt-5 space-y-3.5">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      className="text-sm text-[#64748b] transition-colors hover:text-cyan-700 dark:text-[#94a3b8] dark:hover:text-cyan-300"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="flex flex-col gap-4 border-t border-[#d7e3eb] py-5 text-xs text-[#64748b] dark:border-[#29435f] dark:text-[#94a3b8] sm:flex-row sm:items-center sm:justify-between">
          <p className="leading-5">
            © {new Date().getFullYear()} BIO Website. All rights reserved.
          </p>

          <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
            {legalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-cyan-700 dark:hover:text-cyan-300"
              >
                {link.label}
              </a>
            ))}

            <a
              href="#home"
              className="inline-flex items-center gap-1 font-semibold text-[#0b1b30] transition-colors hover:text-cyan-700 dark:text-white dark:hover:text-cyan-300"
            >
              Back to top
              <ArrowUpRight size={13} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
