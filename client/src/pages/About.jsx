import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Building2,
  Car,
  Check,
  CheckCircle2,
  Compass,
  ContactRound,
  FileText,
  Globe2,
  HeartHandshake,
  Layers,
  MessageCircle,
  Phone,
  QrCode,
  Scissors,
  Share2,
  ShieldCheck,
  Shirt,
  ShoppingBag,
  Sparkles,
  Star,
  Stethoscope,
  Target,
  TrendingUp,
  Users,
  Utensils,
  BriefcaseBusiness,
  Zap,
} from "lucide-react";

const stats = [
  { value: "88%", label: "Paper cards discarded within a week", bad: true },
  {
    value: "1-Tap",
    label: "Direct .VCF phonebook save speed",
    highlight: true,
  },
  { value: "0 Reprints", label: "Instant cloud edits with zero waste" },
  { value: "24/7", label: "Live WhatsApp inquiries & map navigation" },
];

const pillars = [
  {
    icon: Zap,
    title: "Zero App Download Friction",
    description:
      "Clients open your card directly inside Safari or Chrome via QR scan or bio link. No downloads, no passwords, no signup barriers.",
    tag: "Native Web",
  },
  {
    icon: MessageCircle,
    title: "Direct WhatsApp Inquiries",
    description:
      "Every item in your catalog, service booking, or contact prompt routes straight into your WhatsApp inbox with pre-filled buyer details.",
    tag: "Instant Leads",
  },
  {
    icon: QrCode,
    title: "Dynamic Cloud-Synced QR",
    description:
      "Change prices, photos, hours, or phone numbers in seconds. Your printed counter stickers and packaging QR codes always reflect latest info.",
    tag: "Zero Waste",
  },
];

const industries = [
  { name: "Barber Shops & Salons", icon: Scissors, perk: "1-Tap Booking" },
  { name: "Beauty & Spa Wellness", icon: Sparkles, perk: "Visual Menus" },
  { name: "Fashion & Boutiques", icon: ShoppingBag, perk: "Photo Catalog" },
  { name: "Tailoring & Suits", icon: Shirt, perk: "Fabric Gallery" },
  { name: "Doctors & Clinics", icon: Stethoscope, perk: "Direct Call & Map" },
  { name: "Cafes & Restaurants", icon: Utensils, perk: "WhatsApp Orders" },
  { name: "CAs, Lawyers & Tax", icon: BriefcaseBusiness, perk: "Native .VCF" },
  { name: "Automotive Detailing", icon: Car, perk: "Service Packages" },
  {
    name: "Real Estate & Agencies",
    icon: Building2,
    perk: "Project Brochures",
  },
];

const comparisonPoints = [
  {
    feature: "Contact Sharing",
    oldWay: "Paper Cards: Manual typing numbers, lost in pockets",
    newWay: "1-Tap .VCF saves name, photo, & number into contacts",
  },
  {
    feature: "Product Catalog",
    oldWay: "Paper Cards: Static, cannot show new items or discounts",
    newWay: "Live photo catalog with direct WhatsApp enquiry buttons",
  },
  {
    feature: "Location & Directions",
    oldWay: "Paper Cards: Customers type address into Google Maps manually",
    newWay: "1-Tap GPS turn-by-turn navigation directly to your shop",
  },
  {
    feature: "Reprint Costs",
    oldWay: "Paper Cards: Waste thousands on reprints when details change",
    newWay: "Cloud-synced forever. Update anything anytime for free",
  },
];

function About() {
  const [selectedIndustry, setSelectedIndustry] = useState(0);

  return (
    <section
      id="about"
      className="relative isolate overflow-hidden py-5 sm:py-5 lg:py-5"
    >
      {/* Dynamic ambient backdrop */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-[-8%] top-1/4 h-[460px] w-[460px] rounded-full bg-[#10b981]/[0.07] blur-[150px]" />
        <div className="absolute right-[-8%] bottom-1/4 h-[460px] w-[460px] rounded-full bg-[#22d3ee]/[0.07] blur-[150px]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,var(--border-color)_1px,transparent_1px),linear-gradient(to_bottom,var(--border-color)_1px,transparent_1px)] bg-[size:52px_52px] opacity-[0.08]" />
      </div>

      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
        {/* ========================================================
            HEADER / STORYTELLING EYEBROW
        ======================================================== */}
        <div className="mx-auto max-w-[780px] text-center">
          <div className="mb-3.5 inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/[0.08] px-4 py-1.5 text-xs font-semibold text-[#0891b2] shadow-xs backdrop-blur-md dark:text-[#22d3ee]">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
            <Target
              size={14}
              className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
            />
            <span>Why BIO Website Exists</span>
          </div>

          <h2 className="text-[clamp(30px,3.8vw,48px)] font-black leading-[1.12] tracking-[-0.035em] text-[var(--text-primary)]">
            Built to Turn Fleeting Handshakes into{" "}
            <span className="bg-gradient-to-r from-[#10b981] via-[#059669] to-[#22d3ee] bg-clip-text text-transparent">
              Permanent Customers
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-[620px] text-sm leading-relaxed text-[var(--text-secondary)] sm:text-base">
            Every day, retail owners and service specialists connect
            face-to-face. But 88% of paper business cards end up in the trash.
            We built BIO Website so every connection you make stays permanently
            inside your customer&apos;s phone.
          </p>
        </div>

        {/* ========================================================
            STAT METRICS TICKER BAR
        ======================================================== */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
          {stats.map((s, idx) => (
            <div
              key={idx}
              className={`flex flex-col justify-between rounded-2xl border p-4.5 transition-all ${
                s.highlight
                  ? "border-[#10b981]/50 bg-gradient-to-b from-[#10b981]/15 to-[var(--surface)] shadow-sm"
                  : s.bad
                    ? "border-rose-500/25 bg-rose-500/[0.04]"
                    : "border-[var(--border-color)] bg-[var(--surface)]"
              }`}
            >
              <span
                className={`text-2xl font-black tracking-tight sm:text-3xl ${
                  s.highlight
                    ? "text-[#10b981]"
                    : s.bad
                      ? "text-rose-400"
                      : "text-[var(--text-primary)]"
                }`}
              >
                {s.value}
              </span>
              <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>

        {/* ========================================================
            3 VALUE PILLARS CARDS
        ======================================================== */}
        <div className="mt-8 grid grid-cols-1 gap-5 md:grid-cols-3">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={i}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#10b981]/40 hover:shadow-lg hover:shadow-[#10b981]/10"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#10b981]/15 text-[#10b981] ring-1 ring-inset ring-[#10b981]/25 transition-transform duration-300 group-hover:scale-110">
                      <Icon size={20} strokeWidth={2.2} />
                    </div>
                    <span className="rounded-full bg-[var(--surface-raised)] border border-[var(--border-color)] px-2.5 py-0.5 text-[10px] font-semibold text-[var(--text-secondary)]">
                      {pillar.tag}
                    </span>
                  </div>

                  <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--text-primary)] sm:text-lg">
                    {pillar.title}
                  </h3>

                  <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                    {pillar.description}
                  </p>
                </div>

                <div className="mt-5 flex items-center gap-1.5 border-t border-[var(--border-color)]/60 pt-3 text-xs font-semibold text-[#10b981]">
                  <span>Optimized for Local Commerce</span>
                  <Check size={14} strokeWidth={3} />
                </div>
              </div>
            );
          })}
        </div>

        {/* ========================================================
            SPLIT SECTION: THE COMPARISON + LIVE CTA
        ======================================================== */}
        <div className="mt-6 overflow-hidden rounded-[26px] border border-[var(--border-color)] bg-gradient-to-b from-[var(--surface-raised)]/90 via-[var(--surface)] to-[var(--surface)] p-6 shadow-xl sm:p-8 lg:p-10">
          <div className="flex flex-col gap-3 border-b border-[var(--border-color)]/70 pb-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981]/15 text-[#10b981]">
                  <TrendingUp size={18} />
                </span>
                <h3 className="text-xl font-bold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                  Old Habits vs. Smart Digital Cards
                </h3>
              </div>
              <p className="mt-1 text-xs text-[var(--text-secondary)] sm:text-sm">
                Why paper cards fail to bring back customers — and how digital
                cards fix it.
              </p>
            </div>

            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-xl bg-[#10b981] px-5 py-2.5 text-xs font-bold text-white shadow-md shadow-[#10b981]/25 transition-all hover:bg-[#059669] hover:shadow-lg active:scale-95 w-fit"
            >
              <span>Create Your Card</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {/* 4 Crisp Comparison Rows */}
          <div className="mt-6 space-y-3">
            {comparisonPoints.map((pt, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 gap-2.5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface)] p-4 sm:grid-cols-12 sm:items-center sm:gap-4 transition-all hover:border-[var(--text-secondary)]/30"
              >
                <div className="sm:col-span-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                    Factor
                  </span>
                  <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                    {pt.feature}
                  </p>
                </div>

                <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.04] p-3 text-xs sm:col-span-4">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-rose-400 block mb-0.5">
                    Traditional Paper
                  </span>
                  <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
                    {pt.oldWay}
                  </p>
                </div>

                <div className="rounded-xl border border-[#10b981]/30 bg-[#10b981]/10 p-3 text-xs sm:col-span-5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#10b981] block mb-0.5">
                    Smart Bio Website
                  </span>
                  <p className="text-[11px] font-medium text-[var(--text-primary)] leading-relaxed">
                    {pt.newWay}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ========================================================
            VERTICALS GRID (9+ Industries)
        ======================================================== */}
        <div className="mt-6">
          <div className="mb-5 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-6 rounded-full bg-gradient-to-r from-[#10b981] to-[#22d3ee]" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-secondary)]">
                  Tailored For Your Industry
                </h3>
              </div>
              <h4 className="mt-1 text-lg font-bold tracking-tight text-[var(--text-primary)] sm:text-xl">
                Ready-to-Use Templates for High-Trust Local Businesses
              </h4>
            </div>

            <span className="rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3 py-1 text-xs font-semibold text-[#0891b2] dark:text-[#22d3ee] w-fit">
              9+ Verticals Supported
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {industries.map((ind, i) => {
              const Icon = ind.icon;
              return (
                <div
                  key={i}
                  className="flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--surface)] p-3.5 transition-all hover:border-[#10b981]/40 hover:bg-[var(--surface-raised)]"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#10b981]/10 text-[#10b981]">
                      <Icon size={17} />
                    </div>
                    <div className="min-w-0">
                      <p className="truncate text-xs font-bold text-[var(--text-primary)]">
                        {ind.name}
                      </p>
                      <p className="text-[10.5px] text-[var(--text-secondary)] flex items-center gap-1">
                        <span className="h-1 w-1 rounded-full bg-[#10b981]" />
                        {ind.perk}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export default About;
