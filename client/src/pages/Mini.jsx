import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  MessageCircle,
  Share2,
  UserPlus,
  ShieldCheck,
  ShoppingBag,
  Eye,
  Award,
  Sparkles,
  ArrowUpRight,
  CheckCircle2,
  Zap,
} from "lucide-react";

const Mini = () => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[#03110d] p-4 sm:p-6 lg:p-8">

      {/* ==================== BACKGROUND FX ==================== */}
      {/* Grid pattern */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />
      {/* Emerald blob */}
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-emerald-500/20 blur-[120px]" />
      {/* Cyan blob */}
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-cyan-500/15 blur-[120px]" />
      {/* Amber blob */}
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-amber-500/10 blur-[120px]" />

      {/* ==================== TOP BAR ==================== */}
      <div className="relative mx-auto mb-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-emerald-500/20 bg-white/[0.02] backdrop-blur-2xl">
          {/* Shine line */}
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent" />

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg shadow-emerald-500/30">
                <Eye size={18} className="text-[#03110d]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Public Profile Preview
                </h2>
                <p className="text-[11px] text-emerald-200/50">
                  Live preview of your mini website
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="group relative overflow-hidden rounded-xl border border-amber-400/30 bg-amber-400/5 px-3.5 py-2 text-[11px] font-bold text-amber-300 transition hover:bg-amber-400/10">
                <span className="relative z-10">Share Preview</span>
              </button>
              <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 px-3.5 py-2 text-[11px] font-bold text-[#03110d] shadow-lg shadow-emerald-500/30 transition hover:shadow-emerald-400/50">
                <span className="relative z-10">Copy Link</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MINI WEBSITE CARD ==================== */}
      <div className="relative mx-auto max-w-2xl">
        {/* Glow behind card */}
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-emerald-500/20 via-cyan-500/10 to-transparent blur-2xl" />

        <div className="relative overflow-hidden rounded-[28px] border border-emerald-500/20 bg-[#051612]/90 backdrop-blur-2xl shadow-2xl shadow-black/50">

          {/* ---------- BANNER ---------- */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"
              alt="banner"
              className="h-full w-full object-cover"
            />
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#051612] via-[#051612]/40 to-transparent" />
            {/* Emerald tint */}
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/30 via-transparent to-cyan-500/20 mix-blend-overlay" />

            {/* Featured badge */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl border border-amber-400/40 bg-[#03110d]/80 px-2.5 py-1.5 backdrop-blur-md">
              <Sparkles size={11} className="text-amber-300" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-amber-300">
                Featured Product
              </p>
            </div>

            {/* Slideshow dots */}
            <div className="absolute bottom-3 right-3 flex gap-1.5">
              {[1, 2, 3].map((n) => (
                <span
                  key={n}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    n === 1
                      ? "w-5 bg-gradient-to-r from-emerald-400 to-cyan-400"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ---------- PROFILE HEADER ---------- */}
          <div className="relative px-5 pb-5">
            {/* Avatar */}
            <div className="-mt-14 mb-3">
              <div className="relative inline-block">
                {/* Glow ring */}
                <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-emerald-400 to-cyan-500 opacity-60 blur-md" />
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-[3px] border-[#051612] shadow-2xl">
                  <img
                    src="https://i.pravatar.cc/200?img=12"
                    alt="ankit"
                    className="h-full w-full object-cover"
                  />
                </div>
                {/* Verified badge */}
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#051612] bg-gradient-to-br from-emerald-400 to-cyan-500 shadow-lg">
                  <ShieldCheck size={14} className="text-[#03110d]" />
                </div>
              </div>
            </div>

            {/* Name */}
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-tight text-white">
                ankit
              </h3>
              <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/40 bg-emerald-400/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-emerald-300">
                <CheckCircle2 size={9} />
                Verified
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-emerald-200/60">
              Business Owner · Professional
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-emerald-200/50">
              <MapPin size={11} />
              Mumbai, Maharashtra, India
            </p>

            {/* Status pill */}
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-amber-400/30 bg-gradient-to-r from-amber-400/10 to-amber-400/5 px-3 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-400" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-amber-300">
                Profile Actively Monitored
              </span>
            </div>

            {/* ---------- ACTION BUTTONS ---------- */}
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              {[
                { icon: MessageCircle, label: "WhatsApp", gradient: "from-emerald-400 to-emerald-500" },
                { icon: Phone, label: "Call", gradient: "from-cyan-400 to-cyan-500" },
                { icon: Share2, label: "Share", gradient: "from-violet-400 to-violet-500" },
                { icon: UserPlus, label: "Save", gradient: "from-rose-400 to-rose-500" },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-emerald-500/15 bg-white/[0.02] py-3.5 backdrop-blur transition-all hover:border-emerald-400/40 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-emerald-500/10"
                  >
                    <div className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon size={15} className="text-[#03110d]" />
                    </div>
                    <span className="text-[10px] font-bold text-emerald-100/80">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---------- ABOUT ---------- */}
          <Section icon={Award} title="About">
            <p className="text-xs leading-relaxed text-emerald-100/70">
              Welcome to ankit's Business! Contact me directly for
              appointments, consultations, or business inquiries.
            </p>
          </Section>

          {/* ---------- FEATURED PRODUCTS ---------- */}
          <Section
            icon={ShoppingBag}
            title="Featured Products & Services"
            action={<span className="text-[10px] text-emerald-200/40">1 item</span>}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-emerald-500/15 bg-gradient-to-br from-emerald-500/5 to-cyan-500/5 p-4 transition hover:border-emerald-400/40">
              {/* Hover shine */}
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-emerald-400/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              <div className="relative flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400/20 to-cyan-500/20 text-2xl ring-1 ring-emerald-400/30">
                  📦
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-sm font-bold text-white">
                      Featured Business Product
                    </h5>
                    <button className="shrink-0 rounded-lg border border-orange-400/40 bg-orange-400/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-orange-300 transition hover:bg-orange-400/10">
                      Enquire
                    </button>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-emerald-100/60">
                    Quickly inquire about this high-quality premium business
                    product or service offering.
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-slate-400">
                      📁 Catalog
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-emerald-400/30 bg-emerald-400/5 px-2 py-0.5 text-[9px] font-bold text-emerald-300">
                      <CheckCircle2 size={9} />
                      Available
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Section>

          {/* ---------- CONTACT ---------- */}
          <Section icon={Phone} title="Contact & Business Info">
            <div className="space-y-2">
              {[
                { icon: Phone, label: "Call Business", value: "+91 98765 43210", color: "emerald" },
                { icon: Mail, label: "Email Business", value: "contact@ankitbusiness.com", color: "cyan" },
                { icon: Globe, label: "Business Website", value: "www.ankitbusiness.com", color: "violet" },
                { icon: MapPin, label: "Business Address", value: "Mumbai, Maharashtra, India", color: "amber" },
              ].map((item, i) => {
                const Icon = item.icon;
                const colorMap = {
                  emerald: "from-emerald-400 to-emerald-500 shadow-emerald-500/20",
                  cyan: "from-cyan-400 to-cyan-500 shadow-cyan-500/20",
                  violet: "from-violet-400 to-violet-500 shadow-violet-500/20",
                  amber: "from-amber-400 to-amber-500 shadow-amber-500/20",
                };

                return (
                  <div
                    key={i}
                    className="group flex items-center gap-3 rounded-xl border border-emerald-500/10 bg-white/[0.02] p-3 backdrop-blur transition hover:border-emerald-400/30 hover:bg-white/[0.04]"
                  >
                    <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[item.color]} shadow-lg transition-transform group-hover:scale-110`}>
                      <Icon size={15} className="text-[#03110d]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-300/60">
                        {item.label}
                      </p>
                      <p className="truncate text-xs font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-emerald-300/40 transition group-hover:text-emerald-300"
                    />
                  </div>
                );
              })}
            </div>
          </Section>

          {/* ---------- TESTIMONIAL ---------- */}
          <Section
            icon={Star}
            title="Customer Experience & Trust"
            action={
              <button className="rounded-lg border border-orange-400/40 bg-orange-400/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-orange-300 transition hover:bg-orange-400/10">
                Write Review
              </button>
            }
          >
            <div className="relative overflow-hidden rounded-2xl border border-amber-400/20 bg-gradient-to-br from-amber-400/5 via-transparent to-emerald-500/5 p-6 text-center">
              {/* Glow */}
              <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-amber-400/20 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-xl shadow-amber-500/30">
                  <Star size={24} className="fill-[#03110d] text-[#03110d]" />
                </div>

                <p className="mt-4 text-sm font-bold text-white">
                  Be the First to Share Your Experience
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-[11px] text-emerald-100/60">
                  Your feedback helps others discover and trust this business.
                </p>

                <button className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#03110d] shadow-lg shadow-amber-500/30 transition hover:shadow-amber-400/50">
                  <Zap size={12} className="fill-[#03110d]" />
                  Write a Review
                </button>
              </div>
            </div>
          </Section>

          {/* ---------- CTA FORM ---------- */}
          <Section icon={Mail} title="Share Your Contact / Business Inquiry">
            <div className="space-y-2.5">
              <div className="grid grid-cols-2 gap-2.5">
                <input
                  placeholder="Your Name"
                  className="w-full rounded-xl border border-emerald-500/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-emerald-200/30 outline-none backdrop-blur transition focus:border-emerald-400/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-emerald-500/10"
                />
                <input
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-emerald-500/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-emerald-200/30 outline-none backdrop-blur transition focus:border-emerald-400/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-emerald-500/10"
                />
              </div>
              <input
                placeholder="Email Address"
                className="w-full rounded-xl border border-emerald-500/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-emerald-200/30 outline-none backdrop-blur transition focus:border-emerald-400/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-emerald-500/10"
              />
              <textarea
                rows={3}
                placeholder="Your Message"
                className="w-full resize-none rounded-xl border border-emerald-500/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-emerald-200/30 outline-none backdrop-blur transition focus:border-emerald-400/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-emerald-500/10"
              />
              <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-emerald-400 to-cyan-500 py-3.5 text-xs font-black uppercase tracking-wider text-[#03110d] shadow-xl shadow-emerald-500/30 transition hover:shadow-emerald-400/50">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap size={13} className="fill-[#03110d]" />
                  Submit Inquiry
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </Section>

          {/* ---------- FOOTER ---------- */}
          <div className="border-t border-emerald-500/10 px-5 py-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-emerald-500/15 bg-white/[0.02] px-3 py-1.5 backdrop-blur">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-emerald-400 to-cyan-500">
                <Eye size={10} className="text-[#03110d]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-200/60">
                Powered by biowebsite
              </span>
            </div>
          </div>

          {/* Top shine */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

/* ==================== REUSABLE SECTION ==================== */
const Section = ({ icon: Icon, title, action, children }) => (
  <div className="border-t border-emerald-500/10 px-5 py-5">
    <div className="mb-3 flex items-center justify-between gap-2">
      <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-emerald-300/70">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-emerald-500/10">
          <Icon size={12} className="text-emerald-300" />
        </div>
        {title}
      </h4>
      {action}
    </div>
    {children}
  </div>
);

export default Mini;