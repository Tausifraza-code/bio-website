import {
  ArrowUpRight,
  ContactRound,
  UserRoundPlus,
  ShoppingBag,
  QrCode,
  MessagesSquare,
  BadgeCheck,
  TrendingUp,
  Share2,
  Clock3,
  Check,
  Sparkles,
} from "lucide-react";

const features = [
  {
    number: "01",
    title: "Digital Visiting Card",
    description:
      "Create a professional digital identity with your business details, profile, contact information and brand story.",
    icon: ContactRound,
    color: "violet",
    label: "Your identity, online",
    perks: ["Brand Identity", "Shareable Link"],
  },
  {
    number: "02",
    title: "1-Tap Save Contact",
    description:
      "Let customers save your contact details directly to their phones using a convenient VCF contact file.",
    icon: UserRoundPlus,
    color: "emerald",
    label: "Instant contact sharing",
    perks: ["Native .VCF File", "Zero Typing"],
  },
  {
    number: "03",
    title: "Products & Services",
    description:
      "Showcase your products, services, pricing and featured offers in one easy-to-browse mini website.",
    icon: ShoppingBag,
    color: "pink",
    label: "Your digital catalogue",
    perks: ["Price Showcase", "Visual Catalog"],
  },
  {
    number: "04",
    title: "Instant QR Code",
    description:
      "Make your business profile easy to access from printed materials, storefronts, packaging and promotions.",
    icon: QrCode,
    color: "blue",
    label: "Scan and connect",
    perks: ["Scan to Open", "Storefront Ready"],
  },
  {
    number: "05",
    title: "Lead Capture System",
    description:
      "Give potential customers a simple way to contact you, request information and send business enquiries.",
    icon: MessagesSquare,
    color: "amber",
    label: "Turn visits into enquiries",
    perks: ["Direct WhatsApp", "Quick Inquiries"],
  },
  {
    number: "06",
    title: "Social & Trust Hub",
    description:
      "Bring your social profiles, business information and trust-building details together in one place.",
    icon: BadgeCheck,
    color: "teal",
    label: "Build customer confidence",
    perks: ["Google Reviews", "Social Profiles"],
  },
];

const colorStyles = {
  violet: {
    icon: "bg-violet-500/15 text-violet-400 ring-1 ring-inset ring-violet-500/25 group-hover:bg-violet-500 group-hover:text-white group-hover:ring-violet-400/60",
    border: "hover:border-violet-500/40",
    glow: "bg-violet-500/20",
    badge: "border-violet-500/30 bg-violet-500/10 text-violet-400",
    accentText: "text-violet-400",
    arrow:
      "group-hover:border-violet-400/50 group-hover:bg-violet-500 group-hover:text-white",
  },
  emerald: {
    icon: "bg-emerald-500/15 text-emerald-400 ring-1 ring-inset ring-emerald-500/25 group-hover:bg-emerald-500 group-hover:text-white group-hover:ring-emerald-400/60",
    border: "hover:border-emerald-500/40",
    glow: "bg-emerald-500/20",
    badge: "border-emerald-500/30 bg-emerald-500/10 text-emerald-400",
    accentText: "text-emerald-400",
    arrow:
      "group-hover:border-emerald-400/50 group-hover:bg-emerald-500 group-hover:text-white",
  },
  pink: {
    icon: "bg-pink-500/15 text-pink-400 ring-1 ring-inset ring-pink-500/25 group-hover:bg-pink-500 group-hover:text-white group-hover:ring-pink-400/60",
    border: "hover:border-pink-500/40",
    glow: "bg-pink-500/20",
    badge: "border-pink-500/30 bg-pink-500/10 text-pink-400",
    accentText: "text-pink-400",
    arrow:
      "group-hover:border-pink-400/50 group-hover:bg-pink-500 group-hover:text-white",
  },
  blue: {
    icon: "bg-sky-500/15 text-sky-400 ring-1 ring-inset ring-sky-500/25 group-hover:bg-sky-500 group-hover:text-white group-hover:ring-sky-400/60",
    border: "hover:border-sky-500/40",
    glow: "bg-sky-500/20",
    badge: "border-sky-500/30 bg-sky-500/10 text-sky-400",
    accentText: "text-sky-400",
    arrow:
      "group-hover:border-sky-400/50 group-hover:bg-sky-500 group-hover:text-white",
  },
  amber: {
    icon: "bg-amber-500/15 text-amber-400 ring-1 ring-inset ring-amber-500/25 group-hover:bg-amber-500 group-hover:text-white group-hover:ring-amber-400/60",
    border: "hover:border-amber-500/40",
    glow: "bg-amber-500/20",
    badge: "border-amber-500/30 bg-amber-500/10 text-amber-400",
    accentText: "text-amber-400",
    arrow:
      "group-hover:border-amber-400/50 group-hover:bg-amber-500 group-hover:text-white",
  },
  teal: {
    icon: "bg-teal-500/15 text-teal-400 ring-1 ring-inset ring-teal-500/25 group-hover:bg-teal-500 group-hover:text-white group-hover:ring-teal-400/60",
    border: "hover:border-teal-500/40",
    glow: "bg-teal-500/20",
    badge: "border-teal-500/30 bg-teal-500/10 text-teal-400",
    accentText: "text-teal-400",
    arrow:
      "group-hover:border-teal-400/50 group-hover:bg-teal-500 group-hover:text-white",
  },
};

function Features() {
  return (
    <section
      id="services"
      className="relative overflow-hidden py-5 sm:py-5 lg:py-5"
    >
      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        {/* grid pattern */}
        <div className="absolute inset-0 opacity-[0.16] [background-image:linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] [background-size:52px_52px] [mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_15%,transparent_75%)] [-webkit-mask-image:radial-gradient(ellipse_65%_55%_at_50%_0%,#000_15%,transparent_75%)]" />

        <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

        <div className="absolute left-1/2 top-24 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-600/[0.08] blur-[120px]" />
        <div className="absolute right-[10%] top-64 h-56 w-56 rounded-full bg-sky-500/[0.06] blur-[110px]" />
        <div className="absolute left-[8%] top-72 h-52 w-52 rounded-full bg-pink-500/[0.05] blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-[1330px] px-5 sm:px-8 lg:px-10 xl:px-12">
        {/* Section heading */}
        <div className="mx-auto max-w-[760px] text-center">
          <div className="mb-2.5 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/[0.07] px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.13em] text-[var(--accent)] shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400" />
            </span>
            <Sparkles size={13} className="text-[var(--accent)]" />
            <span>Powerful Features</span>
          </div>

          <h2 className="text-[clamp(28px,3.2vw,44px)] font-extrabold leading-[1.15] tracking-[-0.04em] text-[var(--text-primary)]">
            Everything You Need in a{" "}
            <span className="bg-gradient-to-r from-violet-500 via-fuchsia-500 to-sky-400 bg-clip-text text-transparent">
              Strategic Mini Website.
            </span>
          </h2>

          <p className="mx-auto mt-3 max-w-[650px] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            More than a digital business card. Get the essential tools to
            showcase your business, connect with customers, and drive direct sales.
          </p>
        </div>

        {/* Feature cards */}
        <div className="mt-4 grid grid-cols-1 gap-4 sm:mt-6 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {features.map((feature) => {
            const Icon = feature.icon;
            const styles = colorStyles[feature.color];

            return (
              <article
                key={feature.number}
                className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[20px] border border-[var(--border-color)] bg-gradient-to-b from-[var(--surface-raised)]/90 to-[var(--surface)] p-4.5 sm:p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:shadow-black/25 ${styles.border}`}
              >
                {/* corner glow */}
                <span
                  className={`pointer-events-none absolute -right-10 -top-12 h-28 w-28 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${styles.glow}`}
                />

                {/* top hairline shine */}
                <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/25 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                <div>
                  <div className="relative flex items-center justify-between">
                    <div
                      className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-105 group-hover:shadow-md sm:h-12 sm:w-12 ${styles.icon}`}
                    >
                      <Icon size={22} strokeWidth={2} />
                    </div>

                    <span
                      className={`font-mono text-xs font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${styles.badge}`}
                    >
                      {feature.number}
                    </span>
                  </div>

                  <div className="relative mt-4">
                    <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg transition-colors group-hover:text-white">
                      {feature.title}
                    </h3>

                    <p className="mt-1.5 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
                      {feature.description}
                    </p>

                    {/* Feature perks mini pills */}
                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {feature.perks.map((perk) => (
                        <span
                          key={perk}
                          className="inline-flex items-center gap-1 rounded-md border border-[var(--border-color)] bg-[var(--surface)]/90 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] transition-colors group-hover:border-white/10 group-hover:text-[var(--text-primary)]"
                        >
                          <Check size={9} className={styles.accentText} strokeWidth={3} />
                          {perk}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="relative mt-4 flex items-center justify-between gap-3 border-t border-[var(--border-color)]/60 pt-3">
                  <span className="text-[11px] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                    {feature.label}
                  </span>

                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-all duration-300 ${styles.arrow}`}
                  >
                    <ArrowUpRight
                      size={14}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* Why digital cards convert banner */}
        <div className="group relative mt-4 overflow-hidden rounded-[20px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)]/90 via-[var(--surface)] to-emerald-500/[0.04] p-4 transition-all duration-300 hover:border-emerald-500/35 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.18)] sm:mt-5 sm:p-5 lg:px-6 lg:py-4 backdrop-blur-sm">
          {/* Subtle dot pattern */}
          <div className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:radial-gradient(circle_at_1px_1px,var(--border-color)_1px,transparent_0)] [background-size:24px_24px]" />

          {/* Ambient glows */}
          <div className="pointer-events-none absolute -left-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-emerald-500/10 blur-[80px]" />
          <div className="pointer-events-none absolute -right-20 top-1/2 h-48 w-48 -translate-y-1/2 rounded-full bg-violet-500/10 blur-[80px]" />

          <div className="relative flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            {/* Left content */}
            <div className="flex min-w-0 items-start gap-3 sm:items-center">
              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-emerald-500/30 bg-gradient-to-br from-emerald-500/20 to-teal-500/10 text-emerald-400 shadow-md shadow-emerald-500/10 sm:h-12 sm:w-12">
                <TrendingUp
                  size={22}
                  strokeWidth={2.2}
                />
                <div className="absolute inset-0 rounded-xl ring-1 ring-inset ring-white/10" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-bold tracking-tight text-[var(--text-primary)] sm:text-base">
                  Why Paper Cards Fail &amp;{" "}
                  <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
                    Smart Mini Websites Convert
                  </span>
                </h3>
                <p className="mt-1 max-w-[700px] text-[11px] leading-4 text-[var(--text-secondary)] sm:text-xs sm:leading-5">
                  88% of paper business cards are tossed within a week. A digital mini website stays
                  bookmarked in your customer&apos;s phone, ready to re-engage whenever they need you.
                </p>
              </div>
            </div>

            {/* Right feature badges */}
            <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
              <div className="group/badge inline-flex items-center gap-2 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-violet-400/60 hover:bg-violet-500/20 hover:shadow-md hover:shadow-violet-500/20 sm:text-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-violet-500/20 text-violet-400">
                  <Share2 size={12} />
                </span>
                1-Tap WhatsApp Share
              </div>

              <div className="group/badge inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] transition-all duration-300 hover:border-emerald-400/60 hover:bg-emerald-500/20 hover:shadow-md hover:shadow-emerald-500/20 sm:text-xs">
                <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                  <Clock3 size={12} />
                </span>
                Live in 2 Mins
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
