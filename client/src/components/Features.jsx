import { useState } from "react";
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
  Zap,
  Phone,
  MessageCircle,
  Download,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
  Star,
  Layers,
} from "lucide-react";

const features = [
  {
    number: "01",
    tag: "Core Identity",
    title: "Digital Visiting Card",
    description:
      "Create a professional digital identity with your business details, profile, contact information and brand story.",
    icon: ContactRound,
    color: "emerald",
    label: "Your identity, online",
    perks: ["Brand Identity", "Shareable Link", "Custom Color Theme"],
    previewType: "card",
  },
  {
    number: "02",
    tag: "Native Contacts",
    title: "1-Tap Save Contact",
    description:
      "Let customers save your contact details directly to their phones using a convenient VCF contact file.",
    icon: UserRoundPlus,
    color: "cyan",
    label: "Instant contact sharing",
    perks: ["Native .VCF File", "Zero Typing", "iOS & Android Sync"],
    previewType: "vcf",
  },
  {
    number: "03",
    tag: "Catalog & E-commerce",
    title: "Products & Services",
    description:
      "Showcase your products, services, pricing and featured offers in one easy-to-browse mini website.",
    icon: ShoppingBag,
    color: "emerald",
    label: "Your digital catalogue",
    perks: ["Price Showcase", "Visual Catalog", "Direct Enquiries"],
    previewType: "catalog",
  },
  {
    number: "04",
    tag: "Phygital Access",
    title: "Instant QR Code",
    description:
      "Make your business profile easy to access from printed materials, storefronts, packaging and promotions.",
    icon: QrCode,
    color: "cyan",
    label: "Scan and connect",
    perks: ["Scan to Open", "Storefront Ready", "Vector SVG Download"],
    previewType: "qr",
  },
  {
    number: "05",
    tag: "Sales Pipeline",
    title: "Lead Capture System",
    description:
      "Give potential customers a simple way to contact you, request information and send business enquiries.",
    icon: MessagesSquare,
    color: "emerald",
    label: "Turn visits into enquiries",
    perks: ["Direct WhatsApp", "Quick Inquiries", "Pre-filled Prompts"],
    previewType: "lead",
  },
  {
    number: "06",
    tag: "Reputation & Social",
    title: "Social & Trust Hub",
    description:
      "Bring your social profiles, business information and trust-building details together in one place.",
    icon: BadgeCheck,
    color: "cyan",
    label: "Build customer confidence",
    perks: ["Google Reviews", "Social Profiles", "Verified GST Badge"],
    previewType: "trust",
  },
];

/* Micro-visual interactive previews inside cards */
function CardPreviewBadge({ type, isEmerald }) {
  if (type === "card") {
    return (
      <div className="relative mt-3.5 overflow-hidden rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2.5 transition-all duration-300 group-hover:border-[#10b981]/40">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-[#10b981] to-[#047857] text-xs font-bold text-white shadow-sm">
            RS
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1">
              <span className="truncate text-[11px] font-bold text-[var(--text-primary)]">
                Rajesh Sharma
              </span>
              <BadgeCheck size={12} className="shrink-0 text-[#10b981]" />
            </div>
            <p className="truncate text-[9.5px] text-[var(--text-secondary)]">
              Creative Director · Mumbai
            </p>
          </div>
          <span className="rounded-full bg-[#10b981]/15 px-2 py-0.5 text-[9px] font-bold text-[#10b981]">
            Live
          </span>
        </div>
        <div className="mt-2 grid grid-cols-3 gap-1">
          <div className="flex items-center justify-center gap-1 rounded-md bg-[#10b981] py-1 text-[9px] font-bold text-white shadow-xs">
            <Phone size={9} /> Call
          </div>
          <div className="flex items-center justify-center gap-1 rounded-md bg-[#10b981]/15 py-1 text-[9px] font-bold text-[#10b981]">
            <MessageCircle size={9} /> Chat
          </div>
          <div className="flex items-center justify-center gap-1 rounded-md border border-[var(--border-color)] bg-[var(--surface-raised)] py-1 text-[9px] font-bold text-[var(--text-primary)]">
            <Download size={9} /> VCF
          </div>
        </div>
      </div>
    );
  }

  if (type === "vcf") {
    return (
      <div className="relative mt-3.5 flex items-center gap-2.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2.5 transition-all duration-300 group-hover:border-[#22d3ee]/40">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#22d3ee]/15 text-[#0891b2] dark:text-[#22d3ee]">
          <Download size={16} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-[var(--text-primary)]">
              Contact.vcf Ready
            </span>
            <span className="rounded bg-[#22d3ee]/20 px-1.5 py-0.5 text-[8.5px] font-extrabold text-[#0891b2] dark:text-[#22d3ee]">
              1-TAP
            </span>
          </div>
          <p className="truncate text-[9.5px] text-[var(--text-secondary)]">
            Saves to iPhone & Android Contacts
          </p>
        </div>
      </div>
    );
  }

  if (type === "catalog") {
    return (
      <div className="relative mt-3.5 space-y-1.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2 transition-all duration-300 group-hover:border-[#10b981]/40">
        <div className="flex items-center justify-between rounded-lg bg-[var(--surface-raised)]/70 px-2 py-1 text-[10px]">
          <span className="font-semibold text-[var(--text-primary)] truncate">
            💼 Brand Identity Kit
          </span>
          <span className="font-bold text-[#10b981] shrink-0">₹4,999</span>
        </div>
        <div className="flex items-center justify-between rounded-lg bg-[var(--surface-raised)]/70 px-2 py-1 text-[10px]">
          <span className="font-semibold text-[var(--text-primary)] truncate">
            🚀 Mini Website Setup
          </span>
          <span className="font-bold text-[#10b981] shrink-0">₹1,499</span>
        </div>
      </div>
    );
  }

  if (type === "qr") {
    return (
      <div className="relative mt-3.5 flex items-center gap-2.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2 transition-all duration-300 group-hover:border-[#22d3ee]/40">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-white p-1 text-slate-900 shadow-xs">
          <QrCode size={28} />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-bold text-[var(--text-primary)]">
            Scan to Open Bio
          </p>
          <p className="text-[9.5px] leading-tight text-[var(--text-secondary)]">
            Ready for counter stands & packaging
          </p>
        </div>
      </div>
    );
  }

  if (type === "lead") {
    return (
      <div className="relative mt-3.5 rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2.5 transition-all duration-300 group-hover:border-[#10b981]/40">
        <div className="flex items-center gap-2 text-[10px]">
          <MessageCircle size={14} className="text-[#10b981] shrink-0" />
          <span className="truncate font-semibold text-[var(--text-primary)]">
            &quot;Hi, I found your Bio card and want details...&quot;
          </span>
        </div>
        <div className="mt-1.5 flex items-center justify-between text-[9px] text-[var(--text-secondary)]">
          <span>WhatsApp Trigger</span>
          <span className="font-bold text-[#10b981]">Instant Inbound</span>
        </div>
      </div>
    );
  }

  // trust
  return (
    <div className="relative mt-3.5 flex items-center justify-between rounded-xl border border-[var(--border-color)]/70 bg-[var(--surface)]/90 p-2.5 transition-all duration-300 group-hover:border-[#22d3ee]/40">
      <div className="flex items-center gap-1.5">
        <span className="text-xs text-amber-400">★★★★★</span>
        <span className="text-[10px] font-bold text-[var(--text-primary)]">
          4.9 / 5.0
        </span>
      </div>
      <span className="flex items-center gap-1 rounded bg-[#22d3ee]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#0891b2] dark:text-[#22d3ee]">
        <ShieldCheck size={11} /> Verified
      </span>
    </div>
  );
}

function Features() {
  const [filter, setFilter] = useState("all");

  const filteredFeatures =
    filter === "all"
      ? features
      : features.filter((item) =>
          filter === "emerald"
            ? item.color === "emerald"
            : item.color === "cyan",
        );

  return (
    <section
      id="services"
      className="features-section relative isolate overflow-hidden py-5 sm:py-5 lg:py-5"
    >
      {/* Background ambient lighting */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_20%,transparent_80%)] [-webkit-mask-image:radial-gradient(ellipse_70%_55%_at_50%_0%,#000_20%,transparent_80%)]" />

        <div className="absolute left-1/2 top-0 h-px w-[85%] -translate-x-1/2 bg-gradient-to-r from-transparent via-[var(--border-color)] to-transparent" />

        <div className="absolute left-1/2 top-16 h-80 w-80 -translate-x-1/2 rounded-full bg-[#10b981]/[0.09] blur-[130px]" />
        <div className="absolute right-[8%] top-48 h-64 w-64 rounded-full bg-[#22d3ee]/[0.08] blur-[120px]" />
        <div className="absolute left-[6%] top-60 h-60 w-60 rounded-full bg-[#10b981]/[0.06] blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-[1330px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* ================= HEADER ================= */}
        <div className="mx-auto max-w-[780px] text-center">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-[#0891b2] shadow-xs backdrop-blur-md dark:text-[#22d3ee] sm:text-xs">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <Sparkles
              size={13}
              className="text-[#0891b2] dark:text-[#22d3ee]"
            />
            <span>High-Impact Features</span>
          </div>

          <h2 className="text-[clamp(28px,3.4vw,48px)] font-black leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)]">
            Everything You Need in a{" "}
            <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#22d3ee] bg-clip-text text-transparent">
              Strategic Mini Website
            </span>
          </h2>

          <p className="mx-auto mt-3.5 max-w-[620px] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Six conversion-focused tools that transform fleeting first
            encounters into permanent, high-value customer relationships.
          </p>

          {/* Filter Pills */}
          <div className="mt-6 inline-flex items-center gap-1 rounded-full border border-[var(--border-color)] bg-[var(--surface-raised)]/80 p-1 backdrop-blur-sm">
            <button
              onClick={() => setFilter("all")}
              className={`rounded-full px-4 py-1.5 text-xs font-semibold transition-all ${
                filter === "all"
                  ? "bg-[var(--surface)] text-[var(--text-primary)] shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              All Features (6)
            </button>
            <button
              onClick={() => setFilter("emerald")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === "emerald"
                  ? "bg-[#10b981] text-white shadow-sm shadow-[#10b981]/25"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              Conversion & Sales
            </button>
            <button
              onClick={() => setFilter("cyan")}
              className={`flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-all ${
                filter === "cyan"
                  ? "bg-[#22d3ee] text-[#061418] shadow-sm shadow-[#22d3ee]/25 font-bold"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
              Sharing & Trust
            </button>
          </div>
        </div>

        {/* ================= CARDS GRID ================= */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:mt-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-5">
          {filteredFeatures.map((feature, idx) => {
            const Icon = feature.icon;
            const isEmerald = feature.color === "emerald";

            return (
              <article
                key={feature.number}
                className={`group relative flex min-w-0 flex-col justify-between overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-gradient-to-b from-[var(--surface-raised)]/95 via-[var(--surface)] to-[var(--surface)] p-5 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl ${
                  isEmerald
                    ? "hover:border-[#10b981]/45 hover:shadow-[0_20px_50px_-20px_rgba(16,185,129,0.25)]"
                    : "hover:border-[#22d3ee]/45 hover:shadow-[0_20px_50px_-20px_rgba(34,211,238,0.25)]"
                }`}
              >
                {/* Ambient glow in corner */}
                <span
                  className={`pointer-events-none absolute -right-12 -top-12 h-36 w-36 rounded-full opacity-0 blur-3xl transition-opacity duration-500 group-hover:opacity-100 ${
                    isEmerald ? "bg-[#10b981]/25" : "bg-[#22d3ee]/25"
                  }`}
                />

                {/* Top highlight hairline */}
                <span
                  className={`pointer-events-none absolute inset-x-0 top-0 h-[2px] opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                    isEmerald
                      ? "bg-gradient-to-r from-transparent via-[#10b981]/80 to-transparent"
                      : "bg-gradient-to-r from-transparent via-[#22d3ee]/80 to-transparent"
                  }`}
                />

                <div>
                  {/* Top Bar: Icon, Tag & Number */}
                  <div className="relative flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className={`flex h-11 w-11 items-center justify-center rounded-xl transition-all duration-300 group-hover:scale-110 sm:h-12 sm:w-12 ${
                          isEmerald
                            ? "bg-[#10b981]/15 text-[#10b981] ring-1 ring-inset ring-[#10b981]/25 group-hover:bg-[#10b981] group-hover:text-white group-hover:ring-[#10b981]"
                            : "bg-[#22d3ee]/15 text-[#0891b2] dark:text-[#22d3ee] ring-1 ring-inset ring-[#22d3ee]/25 group-hover:bg-[#22d3ee] group-hover:text-[#061418] group-hover:ring-[#22d3ee]"
                        }`}
                      >
                        <Icon size={22} strokeWidth={2} />
                      </div>
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                          {feature.tag}
                        </span>
                        <p
                          className={`text-[11px] font-bold ${
                            isEmerald
                              ? "text-[#10b981]"
                              : "text-[#0891b2] dark:text-[#22d3ee]"
                          }`}
                        >
                          Step {feature.number}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`font-mono text-xs font-bold tracking-wider rounded-full border px-2.5 py-0.5 ${
                        isEmerald
                          ? "border-[#10b981]/30 bg-[#10b981]/10 text-[#10b981]"
                          : "border-[#22d3ee]/30 bg-[#22d3ee]/10 text-[#0891b2] dark:text-[#22d3ee]"
                      }`}
                    >
                      {feature.number}
                    </span>
                  </div>

                  {/* Title & Description */}
                  <div className="relative mt-4">
                    <h3 className="text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg">
                      {feature.title}
                    </h3>
                    <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)] sm:text-[13px]">
                      {feature.description}
                    </p>
                  </div>

                  {/* Embedded interactive micro-preview */}
                  <CardPreviewBadge
                    type={feature.previewType}
                    isEmerald={isEmerald}
                  />

                  {/* Perks chips */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {feature.perks.map((perk) => (
                      <span
                        key={perk}
                        className="inline-flex items-center gap-1 rounded-md border border-[var(--border-color)] bg-[var(--surface)]/90 px-2 py-0.5 text-[10px] font-medium text-[var(--text-secondary)] transition-colors group-hover:border-[var(--text-secondary)]/40 group-hover:text-[var(--text-primary)]"
                      >
                        <Check
                          size={9}
                          className={
                            isEmerald
                              ? "text-[#10b981]"
                              : "text-[#0891b2] dark:text-[#22d3ee]"
                          }
                          strokeWidth={3}
                        />
                        {perk}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Bar */}
                <div className="relative mt-4.5 flex items-center justify-between gap-3 border-t border-[var(--border-color)]/60 pt-3">
                  <span className="text-[11px] font-medium text-[var(--text-secondary)] transition-colors group-hover:text-[var(--text-primary)]">
                    {feature.label}
                  </span>

                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-[var(--border-color)] text-[var(--text-secondary)] transition-all duration-300 ${
                      isEmerald
                        ? "group-hover:border-[#10b981] group-hover:bg-[#10b981] group-hover:text-white"
                        : "group-hover:border-[#22d3ee] group-hover:bg-[#22d3ee] group-hover:text-[#061418]"
                    }`}
                  >
                    <ArrowUpRight
                      size={13}
                      className="transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </article>
            );
          })}
        </div>

        {/* ================= SLEEK BENTO COMPARISON BANNER ================= */}
        <div className="relative mt-12 overflow-hidden rounded-[24px] border border-[var(--border-color)] bg-[var(--surface-raised)]/60 p-6 backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="pointer-events-none absolute -left-12 -top-12 h-44 w-44 rounded-full bg-[#10b981]/15 blur-3xl" />
          <div className="pointer-events-none absolute -right-12 -bottom-12 h-44 w-44 rounded-full bg-[#22d3ee]/15 blur-3xl" />

          {/* Top header row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-color)]/70 pb-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#22d3ee]/10 text-[#10b981] ring-1 ring-inset ring-[#10b981]/25">
                <TrendingUp size={22} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="text-lg font-black tracking-tight text-[var(--text-primary)] sm:text-xl">
                  The Retention Reality
                </h3>
                <p className="text-xs text-[var(--text-secondary)]">
                  Why modern businesses are ditching paper business cards
                </p>
              </div>
            </div>

            <a
              href="/register"
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#10b981]/25 transition-all hover:bg-[#059669] hover:shadow-lg active:scale-95 w-fit"
            >
              <span>Get Your Bio Website</span>
              <ArrowUpRight size={14} />
            </a>
          </div>

          {/* 3 Minimal Bento Comparison Blocks */}
          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
            
            {/* Block 1: The Problem (Paper Cards) */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:border-rose-500/30">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-rose-400">
                  Old Method
                </span>
                <span className="rounded-md bg-rose-500/10 px-2 py-0.5 text-[10px] font-bold text-rose-400">
                  88% Tossed
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-[var(--text-primary)]">Paper Business Cards</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                Thrown in wallets and lost within a week. No links, no WhatsApp ordering, and zero catalog updates.
              </p>
            </div>

            {/* Block 2: The Solution (Smart Digital Card) */}
            <div className="rounded-2xl border border-[#10b981]/40 bg-gradient-to-b from-[#10b981]/[0.08] to-[var(--surface)] p-5 shadow-sm transition-all hover:border-[#10b981]/60">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#10b981]">
                  Smart Solution
                </span>
                <span className="rounded-md bg-[#10b981]/20 px-2 py-0.5 text-[10px] font-bold text-[#10b981]">
                  1-Tap Save
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-[var(--text-primary)]">Native .VCF Download</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                Customers tap once to save your profile directly into their iPhone or Android contacts with zero manual typing.
              </p>
            </div>

            {/* Block 3: The Result (Permanent Conversion) */}
            <div className="rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-5 transition-all hover:border-[#22d3ee]/40">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0891b2] dark:text-[#22d3ee]">
                  High Growth
                </span>
                <span className="rounded-md bg-[#22d3ee]/10 px-2 py-0.5 text-[10px] font-bold text-[#0891b2] dark:text-[#22d3ee]">
                  24/7 Live
                </span>
              </div>
              <h4 className="mt-3 text-base font-bold text-[var(--text-primary)]">Instant WhatsApp Leads</h4>
              <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                Your menu, prices, and QR code stay updated live. Re-engage clients whenever they need your service.
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}

export default Features;
