import {
  Target,
  Sparkles,
  Scissors,
  Shirt,
  ShoppingBag,
  Stethoscope,
  Utensils,
  BriefcaseBusiness,
  Car,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ContactRound,
  Zap,
  Check,
} from "lucide-react";

const industries = [
  { name: "Barber Shops & Grooming", icon: Scissors },
  { name: "Beauty Parlours & Salons", icon: Sparkles },
  { name: "Women's Boutiques & Ethnic", icon: ShoppingBag },
  { name: "Men's Clothing & Tailoring", icon: Shirt },
  { name: "Children's Clothing & Kids", icon: ShoppingBag },
  { name: "Doctors, Clinics & Labs", icon: Stethoscope },
  { name: "Restaurants, Cafes & Sweets", icon: Utensils },
  { name: "Consultants, CAs & Legal", icon: BriefcaseBusiness },
  { name: "Automotive & Detailing", icon: Car },
];

const comparisons = [
  {
    title: "Traditional Paper Cards",
    label: "Limited & Static",
    description:
      "Easy to misplace, static contact info, no interactive product showcase, and zero analytics on who actually views your card.",
    highlights: [
      "Easily lost & forgotten",
      "Zero live updates",
      "No product catalog",
    ],
    type: "negative",
  },
  {
    title: "Bulky Corporate Websites",
    label: "Complex & Costly",
    description:
      "Heavy setup, monthly upkeep costs, and slow navigation that overwhelm mobile customers looking for quick answers.",
    highlights: [
      "High maintenance friction",
      "Slow mobile browsing",
      "Complicated to update",
    ],
    type: "warning",
  },
  {
    title: "BIO Website (Smart Mini Card)",
    label: "Modern Interactive Hub",
    badge: "Recommended",
    description:
      "Share contact details, WhatsApp chat, Google Maps, catalog products, and social links — instantly accessible from one sleek link.",
    highlights: [
      "1-Tap VCF Contact Save",
      "Direct WhatsApp Leads",
      "Live Product Showcase",
      "Instant QR Code Access",
    ],
    type: "positive",
  },
];

function About() {
  return (
    <section
      id="about"
      className="relative overflow-hidden py-5 sm:py-5 lg:py-5"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[-5%] top-16 h-80 w-80 rounded-full bg-[#10b981]/[0.09] blur-[120px]" />
        <div className="absolute right-[-5%] bottom-10 h-80 w-80 rounded-full bg-[#22d3ee]/[0.08] blur-[130px]" />
        {/* Subtle dot grid */}
        <div className="absolute inset-0 opacity-[0.035] [background-image:radial-gradient(circle_at_1px_1px,var(--border-color)_1px,transparent_0)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_75%_65%_at_50%_45%,#000_20%,transparent_80%)]" />
      </div>

      <div className="mx-auto grid w-full max-w-[1330px] grid-cols-1 items-center gap-10 px-5 sm:px-8 lg:grid-cols-[minmax(0,1.02fr)_minmax(0,0.98fr)] lg:gap-12 lg:px-10 xl:gap-16 xl:px-12">
        {/* Left: Mission & Industry Ecosystem */}
        <div className="min-w-0">
          {/* Eyebrow badge */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/25 bg-[#22d3ee]/[0.07] px-3.5 py-1.5 text-xs font-semibold text-[#0891b2] shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:text-[#22d3ee]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <Target size={14} className="text-[#0891b2] dark:text-[#22d3ee]" />
            <span>Our Mission &amp; Background</span>
          </div>

          {/* Section heading — matches Hero h1 pattern */}
          <h2 className="max-w-[700px] text-[clamp(28px,3.1vw,42px)] font-extrabold leading-[1.15] tracking-[-0.035em] text-[var(--text-primary)]">
            Bridging Physical Handshakes with{" "}
            <span className="text-[#10b981]">Modern Digital Conversion</span>
          </h2>

          {/* Narrative paragraphs */}
          <div className="mt-4 space-y-3 text-sm leading-relaxed text-[var(--text-secondary)] sm:text-[15px]">
            <p>
              At{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                BIO Website
              </strong>
              , we recognized a major gap in modern commerce. Thousands of local
              retail owners and service specialists connect face-to-face every
              day, yet rely on static paper cards that end up lost in wallets.
            </p>

            <p>
              Paper cards cannot trigger a one-tap WhatsApp chat, showcase new
              inventory, or route customers to your shopfront.
            </p>

            {/* Quick feature benefit pill strip */}
            <div className="grid grid-cols-3 gap-2 py-1">
              <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]/70 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10b981]/15 text-[#10b981]">
                  <Check size={10} strokeWidth={3} />
                </span>
                <span className="truncate">1-Tap WhatsApp</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]/70 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#22d3ee]/15 text-[#0891b2] dark:text-[#22d3ee]">
                  <Check size={10} strokeWidth={3} />
                </span>
                <span className="truncate">Live Directions</span>
              </div>
              <div className="flex items-center gap-1.5 rounded-lg border border-[var(--border-color)] bg-[var(--surface)]/70 px-2.5 py-1.5 text-[11px] font-semibold text-[var(--text-primary)] sm:text-xs">
                <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[#10b981]/15 text-[#10b981]">
                  <Check size={10} strokeWidth={3} />
                </span>
                <span className="truncate">Digital Catalog</span>
              </div>
            </div>

            <p>
              Our{" "}
              <strong className="font-semibold text-[var(--text-primary)]">
                Strategic Mini Website
              </strong>{" "}
              gives boutique owners, salons, consultants, and clinics a
              high-converting online profile that customers save and revisit
              effortlessly.
            </p>
          </div>

          {/* Industry chips */}
          <div className="mt-6">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--text-primary)] sm:text-[13px]">
                <span className="h-1.5 w-5 rounded-full bg-gradient-to-r from-[#10b981] to-[#22d3ee]" />
                Built for Retail &amp; Service Sectors
              </h3>
              <span className="rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[11px] font-semibold text-[#0891b2] dark:text-[#22d3ee]">
                9+ Verticals
              </span>
            </div>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 xl:grid-cols-3">
              {industries.map((industry) => {
                const Icon = industry.icon;

                return (
                  <div
                    key={industry.name}
                    className="group flex min-w-0 items-center gap-2.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)]/80 px-3 py-2 transition-all duration-200 hover:-translate-y-0.5 hover:border-[#10b981]/40 hover:bg-[var(--surface-raised)] hover:shadow-md hover:shadow-emerald-950/10"
                  >
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981] transition-all duration-200 group-hover:scale-110 group-hover:bg-gradient-to-br group-hover:from-[#10b981] group-hover:to-[#22d3ee] group-hover:text-white">
                      <Icon size={13} />
                    </span>

                    <span className="truncate text-xs font-medium text-[var(--text-secondary)] transition-colors duration-200 group-hover:font-semibold group-hover:text-[var(--text-primary)]">
                      {industry.name}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Comparison Panel */}
        <div className="relative min-w-0 overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)]/90 via-[var(--surface)] to-[var(--surface)] p-4 shadow-xl shadow-black/5 backdrop-blur-sm sm:p-6 lg:p-6 xl:p-7">
          {/* Ambient decorative glows */}
          <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#10b981]/15 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#22d3ee]/15 blur-3xl" />

          {/* Panel header */}
          <div className="relative mb-4 flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#22d3ee]/15 text-[#0891b2] ring-1 ring-inset ring-[#22d3ee]/25 dark:text-[#22d3ee]">
                <Sparkles size={16} />
              </span>

              <div>
                <h3 className="text-sm font-extrabold text-[var(--text-primary)] sm:text-base">
                  The Strategic Advantage
                </h3>
                <p className="text-[11px] text-[var(--text-secondary)]">
                  How Smart Mini Cards compare to old alternatives
                </p>
              </div>
            </div>

            <span className="hidden items-center gap-1 rounded-full border border-[#22d3ee]/20 bg-[#22d3ee]/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[#0891b2] dark:text-[#22d3ee] sm:inline-flex">
              Side-by-side
            </span>
          </div>

          {/* Comparisons List */}
          <div className="relative space-y-2.5">
            {comparisons.map((item) => {
              const isPositive = item.type === "positive";
              const isWarning = item.type === "warning";

              const StatusIcon = isPositive
                ? CheckCircle2
                : isWarning
                  ? AlertTriangle
                  : XCircle;

              const statusColor = isPositive
                ? "text-emerald-500 dark:text-emerald-400"
                : isWarning
                  ? "text-amber-500 dark:text-amber-400"
                  : "text-rose-500 dark:text-rose-400";

              const statusBackground = isPositive
                ? "bg-emerald-500/10 ring-emerald-500/25"
                : isWarning
                  ? "bg-amber-500/10 ring-amber-500/25"
                  : "bg-rose-500/10 ring-rose-500/25";

              const cardStyle = isPositive
                ? "border-[#10b981]/50 bg-gradient-to-br from-[#10b981]/[0.12] via-[#22d3ee]/[0.06] to-emerald-500/[0.04] shadow-md shadow-emerald-950/15 ring-1 ring-[#10b981]/30"
                : isWarning
                  ? "border-[var(--border-color)] bg-[var(--surface)]/60 hover:border-amber-500/30"
                  : "border-[var(--border-color)] bg-[var(--surface)]/60 hover:border-rose-500/30";

              return (
                <div
                  key={item.title}
                  className={`group relative overflow-hidden rounded-[16px] border p-3.5 transition-all duration-200 hover:-translate-y-0.5 sm:p-4 ${cardStyle}`}
                >
                  {/* Hairline sheen on hover */}
                  <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/30 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

                  <div className="flex flex-col gap-1.5 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-2">
                      <h4 className="text-xs font-bold text-[var(--text-primary)] sm:text-sm">
                        {item.title}
                      </h4>
                      {item.badge && (
                        <span className="inline-flex items-center gap-1 rounded-md bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-1.5 py-0.5 text-[9px] font-bold text-white shadow-xs">
                          <Zap size={9} fill="currentColor" />
                          {item.badge}
                        </span>
                      )}
                    </div>

                    <span
                      className={`inline-flex w-fit shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold ring-1 ring-inset ${statusBackground} ${statusColor}`}
                    >
                      <StatusIcon size={12} />
                      {item.label}
                    </span>
                  </div>

                  <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {item.description}
                  </p>

                  {/* Highlights pills */}
                  <div className="mt-2.5 flex flex-wrap gap-1.5">
                    {item.highlights.map((highlight) => (
                      <span
                        key={highlight}
                        className={`inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[10px] font-medium ${
                          isPositive
                            ? "border border-[#10b981]/20 bg-[#10b981]/10 text-[#10b981]"
                            : isWarning
                              ? "bg-amber-500/[0.08] text-amber-500/90 dark:text-amber-400/90"
                              : "bg-rose-500/[0.08] text-rose-500/90 dark:text-rose-400/90"
                        }`}
                      >
                        {isPositive ? (
                          <Check
                            size={9}
                            className="text-emerald-500 dark:text-emerald-400"
                            strokeWidth={3}
                          />
                        ) : (
                          <span className="h-1 w-1 rounded-full bg-current opacity-60" />
                        )}
                        {highlight}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom note */}
          <div className="relative mt-3.5 flex items-center gap-3 rounded-[14px] border border-[var(--border-color)] bg-[var(--surface)]/90 p-3 transition-colors duration-200 hover:border-[#10b981]/30">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#10b981]/20 to-[#22d3ee]/20 text-[#10b981] ring-1 ring-inset ring-[#10b981]/20">
              <ContactRound size={16} />
            </div>

            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[var(--text-primary)]">
                One link. A complete business identity.
              </p>
              <p className="truncate text-[11px] text-[var(--text-secondary)]">
                Make it effortless for customers to discover, connect &amp;
                revisit.
              </p>
            </div>

            <span className="hidden shrink-0 items-center gap-1 rounded-full bg-[#10b981]/10 px-2 py-0.5 text-[10px] font-semibold text-[#10b981] sm:inline-flex">
              <Zap size={10} /> Fast Setup
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
