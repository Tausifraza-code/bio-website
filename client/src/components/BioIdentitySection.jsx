import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  ContactRound,
  Globe,
  MessageCircle,
  Phone,
  Send,
  Share2,
  ShoppingBag,
  X as XIcon,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";

const FacebookIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.98H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.98A10 10 0 0 0 22 12z" />
  </svg>
);

const InstagramIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const YoutubeIcon = ({ size = 15 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
  </svg>
);

const stats = [
  {
    value: 150,
    suffix: "K+",
    label: "Digital Identity",
    icon: ContactRound,
  },
  {
    value: 100,
    suffix: "K+",
    label: "Shareable Link",
    icon: Share2,
  },
];

const socialLinks = [
  { label: "Website", icon: Globe, href: "https://example.com" },
  { label: "Facebook", icon: FacebookIcon, href: "https://facebook.com" },
  { label: "Instagram", icon: InstagramIcon, href: "https://instagram.com" },
  { label: "WhatsApp", icon: MessageCircle, href: "https://whatsapp.com" },
  { label: "LinkedIn", icon: LinkedinIcon, href: "https://linkedin.com" },
  { label: "X", icon: XIcon, href: "https://x.com" },
  { label: "Telegram", icon: Send, href: "https://telegram.org" },
  { label: "YouTube", icon: YoutubeIcon, href: "https://youtube.com" },
];

function MiniWebsitePreview() {
  const actions = [
    { label: "Save", icon: ContactRound },
    { label: "Call", icon: Phone },
    { label: "WhatsApp", icon: MessageCircle },
    { label: "Map", icon: Globe },
  ];

  return (
    <div className="relative mx-auto w-full max-w-[395px] px-2 py-4">
      {/* Ambient glow behind phone */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-4 rounded-full bg-cyan-400/20 blur-3xl dark:bg-cyan-400/10"
      />

      {/* Modern Smartphone Mockup Frame */}
      <div className="relative overflow-hidden rounded-[36px] border-[6px] border-[#0b1b30]/10 bg-white shadow-[0_24px_70px_rgba(11,27,48,0.16)] ring-1 ring-black/5 dark:border-[#1e3a5a] dark:bg-[#132942] dark:shadow-[0_24px_70px_rgba(0,0,0,0.6)]">
        {/* Phone Dynamic Island / Speaker notch */}
        <div className="absolute top-2 left-1/2 z-30 -translate-x-1/2 flex items-center justify-center">
          <div className="h-4 w-24 rounded-full bg-black/80 backdrop-blur flex items-center justify-center gap-1.5 px-2">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="h-1 w-8 rounded-full bg-white/20" />
          </div>
        </div>

        {/* Cover Banner with Wavy Edge */}
        <div className="relative h-[180px] overflow-hidden sm:h-[195px]">
          <img
            src="https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&w=900&q=85"
            alt="Professional banner"
            className="absolute inset-0 h-full w-full object-cover object-center"
            loading="lazy"
          />

          {/* Scrim Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30]/60 via-transparent to-[#0b1b30]/20" />

          {/* Micro status badge on banner */}
          <div className="absolute top-8 left-3.5 right-3.5 z-10 flex items-center justify-between text-[10px] font-semibold text-white/90">
            <span className="rounded-full bg-black/40 px-2 py-0.5 backdrop-blur-md">
              bio.link/rajesh
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/80 px-2 py-0.5 text-[9px] font-bold text-white backdrop-blur-md">
              <span className="h-1.5 w-1.5 rounded-full bg-white animate-pulse" />
              VERIFIED
            </span>
          </div>

          {/* Wavy edge transition */}
          <svg
            className="absolute bottom-[-1px] left-0 z-[2] block h-[55px] w-full"
            viewBox="0 0 390 65"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <path
              d="M0 14 C55 24 100 57 174 47 C250 36 292 1 390 24 L390 65 L0 65 Z"
              className="fill-[#f1f9f9] dark:fill-[#132942]"
            />
          </svg>
        </div>

        {/* Profile Card Body */}
        <div className="relative bg-[#f1f9f9] px-4 pb-4 dark:bg-[#132942]">
          <div className="relative z-10 -mt-[52px] flex items-end gap-3 px-1 pb-3">
            <div className="relative shrink-0">
              <img
                src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=320&h=320&q=85"
                alt="Rajesh Sharma"
                className="relative z-20 h-[92px] w-[92px] rounded-2xl border-[4px] border-white object-cover shadow-md dark:border-[#132942]"
                loading="lazy"
              />
              <span className="absolute -bottom-1 -right-1 z-30 flex h-4 w-4 items-center justify-center rounded-full border-2 border-white bg-emerald-500 dark:border-[#132942]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
            </div>

            <div className="relative z-20 min-w-0 flex-1 pb-1">
              <div className="flex flex-wrap items-center gap-1">
                <h3 className="truncate text-base font-black tracking-tight text-[#0891b2] dark:text-cyan-300 sm:text-lg">
                  Rajesh Sharma
                </h3>
                <BadgeCheck
                  size={16}
                  className="shrink-0 text-[#0891b2] dark:text-cyan-300"
                />
              </div>

              <p className="mt-0.5 text-xs font-semibold text-[#0b1b30] dark:text-white">
                Grooming Specialist
              </p>

              <p className="mt-0.5 flex flex-wrap items-center gap-1.5 text-[11px] text-[#64748b] dark:text-[#a6b7c8]">
                <span className="inline-flex items-center gap-1">
                  <Globe
                    size={11}
                    className="text-[#0891b2] dark:text-cyan-300"
                  />
                  Mumbai, India
                </span>
                <span className="font-bold text-amber-500">★ 4.9</span>
              </p>
            </div>
          </div>

          {/* Social Links Row */}
          <div className="mt-4 grid grid-cols-8 gap-1.5 sm:gap-2">
            {socialLinks.map(({ label, icon: Icon, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                title={label}
                className="flex aspect-square min-w-0 items-center justify-center rounded-xl border border-cyan-400/25 bg-[#20a9cf] text-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:bg-[#087e9b] hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500"
              >
                <Icon size={15} aria-hidden="true" />
              </a>
            ))}
          </div>
        </div>

        {/* Business details & actions */}
        <div className="px-4 pt-1">
          {/* Bio statement */}
          <div className="rounded-2xl border border-[#d7e3eb] bg-[#f1f7fa] px-3.5 py-2.5 dark:border-[#29435f] dark:bg-[#0b1b30]/70">
            <p className="text-xs leading-relaxed text-[#64748b] dark:text-[#a6b7c8]">
              Your style, our craft. Professional haircuts and grooming
              experiences made just for you.
            </p>
          </div>

          {/* Quick Action Tiles */}
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {actions.map(({ label, icon: Icon }, index) => (
              <div
                key={label}
                className={`flex min-h-[64px] flex-col items-center justify-center gap-1.5 rounded-2xl border transition-all duration-200 ${
                  index === 0
                    ? "border-cyan-400 bg-cyan-400 text-[#0b1b30] shadow-sm font-bold"
                    : "border-[#d7e3eb] bg-white text-[#0891b2] hover:border-cyan-400/60 dark:border-[#29435f] dark:bg-[#132942] dark:text-cyan-300"
                }`}
              >
                <Icon size={18} strokeWidth={2} aria-hidden="true" />
                <span className="text-[10px] font-bold">{label}</span>
              </div>
            ))}
          </div>

          {/* Featured Service Card */}
          <div className="mt-3 rounded-2xl border border-cyan-200/80 bg-[#ecfbfd] p-3 shadow-xs dark:border-[#29435f] dark:bg-[#0b1b30]">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-200 bg-cyan-100 text-[#0891b2] dark:border-cyan-400/20 dark:bg-cyan-400/10 dark:text-cyan-300">
                  <ShoppingBag size={20} />
                </div>

                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold uppercase tracking-[0.14em] text-[#0891b2] dark:text-cyan-300">
                    Featured Service
                  </p>
                  <h4 className="mt-0.5 truncate text-xs font-bold leading-5 text-[#0b1b30] dark:text-white">
                    Executive Haircut &amp; Styling
                  </h4>
                  <p className="text-xs font-extrabold text-[#0891b2] dark:text-cyan-300">
                    ₹499
                  </p>
                </div>
              </div>

              <span className="shrink-0 rounded-lg bg-cyan-400 px-2.5 py-1 text-[10px] font-bold text-[#0b1b30]">
                Book
              </span>
            </div>
          </div>

          {/* Customer preview button */}
          <div className="mt-3 flex min-h-[44px] items-center justify-center gap-2 rounded-xl bg-[#0b1b30] px-3 text-white transition hover:bg-[#132942] dark:border dark:border-cyan-300/50 dark:bg-cyan-400 dark:text-[#0b1b30] dark:hover:border-cyan-200 dark:hover:bg-cyan-300">
            <Zap size={15} />
            <span className="text-xs font-bold">
              Preview customer experience
            </span>
            <ArrowRight size={15} className="ml-0.5" />
          </div>

          {/* Bottom caption */}
          <div className="flex items-center justify-center gap-1.5 py-2.5">
            <BadgeCheck
              size={13}
              className="shrink-0 text-[#0891b2] dark:text-cyan-300"
            />
            <p className="text-[10px] font-medium text-[#64748b] dark:text-[#a6b7c8]">
              One place for your business identity
            </p>
          </div>
        </div>
      </div>

      {/* Floating high-end indicator badge */}
      <div className="absolute -bottom-1 -right-2 z-20 hidden items-center gap-2 rounded-2xl border border-[#d7e3eb] bg-white/95 px-3 py-2 shadow-lg backdrop-blur-md dark:border-[#29435f] dark:bg-[#132942]/95 sm:flex">
        <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400">
          <CheckCircle2 size={14} />
        </span>
        <span className="text-[11px] font-bold text-[#0b1b30] dark:text-white">
          1-Tap VCF Contact Ready
        </span>
      </div>
    </div>
  );
}

function StatBlock({ item }) {
  const Icon = item.icon;

  return (
    <div className="flex items-center gap-4 rounded-2xl border border-[#d7e3eb] bg-white p-5 shadow-[0_4px_20px_rgba(11,27,48,0.03)] transition-all duration-200 hover:-translate-y-0.5 hover:border-cyan-400/50 hover:shadow-md dark:border-[#29435f] dark:bg-[#132942]">
      {/* Rounded square icon background */}
      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/10 text-[#0891b2] dark:text-cyan-300">
        <Icon
          size={26}
          strokeWidth={1.8}
          aria-hidden="true"
          className="shrink-0"
        />
      </div>

      {/* Value & Label */}
      <div className="min-w-0">
        <CountUp value={item.value} suffix={item.suffix} label={item.label} />
        <span className="mt-0.5 block text-xs font-semibold text-[#64748b] dark:text-[#a6b7c8] sm:text-sm">
          {item.label}
        </span>
      </div>
    </div>
  );
}

function CountUp({ value, suffix, label }) {
  const [count, setCount] = useState(() => {
    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const supportsIntersectionObserver =
      typeof window !== "undefined" && "IntersectionObserver" in window;

    return prefersReducedMotion || !supportsIntersectionObserver ? value : 0;
  });
  const countRef = useRef(null);

  useEffect(() => {
    const element = countRef.current;
    if (!element) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      return;
    }

    let animationFrame;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;

        observer.disconnect();
        const duration = 1600;
        let startTime;

        const animate = (timestamp) => {
          if (startTime === undefined) startTime = timestamp;

          const progress = Math.min((timestamp - startTime) / duration, 1);
          const easedProgress = 1 - (1 - progress) ** 3;
          setCount(Math.round(value * easedProgress));

          if (progress < 1) {
            animationFrame = requestAnimationFrame(animate);
          }
        };

        animationFrame = requestAnimationFrame(animate);
      },
      { threshold: 0.5 },
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
      if (animationFrame !== undefined) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [value]);

  return (
    <>
      <span className="sr-only">
        {value}
        {suffix} {label}
      </span>
      <span
        ref={countRef}
        aria-hidden="true"
        className="block text-3xl font-extrabold tracking-tight text-[#0b1b30] dark:text-white sm:text-4xl"
      >
        {count}
        {suffix}
      </span>
    </>
  );
}

export default function BioIdentitySection() {
  return (
    <section
      id="bio-identity"
      aria-labelledby="bio-identity-heading"
      className="relative isolate w-full overflow-hidden bg-[#eaf8f4] py-6 text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white sm:py-6 lg:py-6"
    >
      {/* Subtle dotted background pattern */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-35 dark:opacity-15"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(8,145,178,0.22) 1.2px, transparent 1.2px)",
          backgroundSize: "36px 36px",
        }}
      />

      {/* Ambient background glows */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute -right-32 top-10 h-72 w-72 rounded-full bg-cyan-400/10 blur-[100px] dark:bg-cyan-400/[0.06]" />
        <div className="absolute -left-32 bottom-10 h-72 w-72 rounded-full bg-[#0891b2]/10 blur-[100px] dark:bg-cyan-400/[0.04]" />
      </div>

      {/* Main 2-column container */}
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-12 px-4 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-10">
        {/* Left column: Smartphone interactive preview */}
        <MiniWebsitePreview />

        {/* Right column: Heading, Description, Two Stats Blocks & CTA */}
        <div className="min-w-0">
          {/* Eyebrow badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-3.5 py-1 text-[11px] font-bold uppercase tracking-[0.2em] text-[#0891b2] dark:text-cyan-300">
            <span>A Smarter Way to Present Your Business</span>
          </div>

          {/* 1. Large, bold, two-line heading */}
          <h2
            id="bio-identity-heading"
            className="max-w-[620px] text-3xl font-extrabold leading-[1.12] tracking-tight text-[#0b1b30] dark:text-white sm:text-4xl lg:text-[44px]"
          >
            Everything Your Business Needs, <br className="hidden sm:inline" />
            <span className="text-[#0891b2] dark:text-cyan-300">
              In One Place.
            </span>
          </h2>

          {/* 2. Short descriptive paragraph */}
          <p className="mt-4 max-w-[560px] text-base leading-relaxed text-[#64748b] dark:text-[#a6b7c8] sm:mt-5 sm:text-lg">
            Create a professional mini website to showcase your identity,
            connect with customers and share your business details through one
            simple link.
          </p>

          {/* 3. Two horizontally arranged statistics/highlight blocks */}
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
            {stats.map((stat) => (
              <StatBlock key={stat.label} item={stat} />
            ))}
          </div>

          {/* 4. Prominent rounded CTA button */}
          <div className="mt-8 sm:mt-10">
            <Link
              to="/register"
              className="group inline-flex min-h-[52px] max-w-full items-center justify-center gap-2.5 whitespace-nowrap rounded-full bg-cyan-400 px-8 py-3.5 text-base font-bold text-white hover:text-[#0b1b30] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#0b1b30]"
            >
              <span>Create Your Mini Website</span>
              <ArrowRight
                size={18}
                aria-hidden="true"
                className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
