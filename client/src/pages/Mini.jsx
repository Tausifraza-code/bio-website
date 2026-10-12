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
    <div className="relative min-h-screen overflow-hidden bg-[#061418] p-4 sm:p-6 lg:p-8">
      {/* ==================== BACKGROUND FX ==================== */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(#22d3ee 1px, transparent 1px), linear-gradient(90deg, #22d3ee 1px, transparent 1px)`,
          backgroundSize: "44px 44px",
        }}
      />
      <div className="pointer-events-none absolute -left-40 top-0 h-[500px] w-[500px] rounded-full bg-[#10b981]/20 blur-[120px]" />
      <div className="pointer-events-none absolute -right-40 top-1/3 h-[500px] w-[500px] rounded-full bg-[#22d3ee]/15 blur-[120px]" />
      <div className="pointer-events-none absolute bottom-0 left-1/3 h-[400px] w-[400px] rounded-full bg-[#10b981]/10 blur-[120px]" />

      {/* ==================== TOP BAR ==================== */}
      <div className="relative mx-auto mb-6 max-w-4xl">
        <div className="relative overflow-hidden rounded-2xl border border-[#22d3ee]/20 bg-white/[0.02] backdrop-blur-2xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/60 to-transparent" />

          <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981] to-[#22d3ee] shadow-lg shadow-[#10b981]/30">
                <Eye size={18} className="text-[#061418]" />
              </div>
              <div>
                <h2 className="text-sm font-bold text-white">
                  Public Profile Preview
                </h2>
                <p className="text-[11px] text-[#8fb3ba]">
                  Live preview of your mini website
                </p>
              </div>
            </div>

            <div className="flex gap-2">
              <button className="group relative overflow-hidden rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/5 px-3.5 py-2 text-[11px] font-bold text-[#22d3ee] transition hover:bg-[#22d3ee]/10">
                <span className="relative z-10">Share Preview</span>
              </button>
              <button className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-3.5 py-2 text-[11px] font-bold text-[#061418] shadow-lg shadow-[#10b981]/30 transition hover:shadow-[#10b981]/50">
                <span className="relative z-10">Copy Link</span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ==================== MINI WEBSITE CARD ==================== */}
      <div className="relative mx-auto max-w-2xl">
        <div className="absolute -inset-1 rounded-[32px] bg-gradient-to-br from-[#10b981]/20 via-[#22d3ee]/10 to-transparent blur-2xl" />

        <div className="relative overflow-hidden rounded-[28px] border border-[#22d3ee]/20 bg-[#0c1f24]/90 backdrop-blur-2xl shadow-2xl shadow-black/50">
          {/* ---------- BANNER ---------- */}
          <div className="relative h-48 w-full overflow-hidden">
            <img
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200"
              alt="banner"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0c1f24] via-[#0c1f24]/40 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-br from-[#10b981]/30 via-transparent to-[#22d3ee]/20 mix-blend-overlay" />

            {/* Featured badge — emerald -->
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-xl border border-[#10b981]/40 bg-[#061418]/80 px-2.5 py-1.5 backdrop-blur-md">
              <Sparkles size={11} className="text-[#10b981]" />
              <p className="text-[9px] font-bold uppercase tracking-wider text-[#10b981]">
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
                      ? "w-5 bg-gradient-to-r from-[#10b981] to-[#22d3ee]"
                      : "w-1.5 bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>

          {/* ---------- PROFILE HEADER ---------- */}
          <div className="relative px-5 pb-5">
            <div className="-mt-14 mb-3">
              <div className="relative inline-block">
                <div className="absolute -inset-1 rounded-[22px] bg-gradient-to-br from-[#10b981] to-[#22d3ee] opacity-60 blur-md" />
                <div className="relative h-28 w-28 overflow-hidden rounded-2xl border-[3px] border-[#0c1f24] shadow-2xl">
                  <img
                    src="https://i.pravatar.cc/200?img=12"
                    alt="ankit"
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-full border-2 border-[#0c1f24] bg-gradient-to-br from-[#10b981] to-[#22d3ee] shadow-lg">
                  <ShieldCheck size={14} className="text-[#061418]" />
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-xl font-black tracking-tight text-white">
                ankit
              </h3>
              <span className="inline-flex items-center gap-1 rounded-md border border-[#10b981]/40 bg-[#10b981]/10 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-[#10b981]">
                <CheckCircle2 size={9} />
                Verified
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-[#8fb3ba]">
              Business Owner · Professional
            </p>

            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[#8fb3ba]">
              <MapPin size={11} />
              Mumbai, Maharashtra, India
            </p>

            {/* Status pill — cyan -->
            <div className="mt-3 inline-flex items-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-gradient-to-r from-[#22d3ee]/10 to-[#22d3ee]/5 px-3 py-1.5 backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#22d3ee] opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[#22d3ee]" />
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee]">
                Profile Actively Monitored
              </span>
            </div>

            {/* ---------- ACTION BUTTONS ---------- */}
            <div className="mt-5 grid grid-cols-4 gap-2.5">
              {[
                {
                  icon: MessageCircle,
                  label: "WhatsApp",
                  gradient: "from-[#10b981] to-[#059669]",
                },
                {
                  icon: Phone,
                  label: "Call",
                  gradient: "from-[#22d3ee] to-[#0891b2]",
                },
                {
                  icon: Share2,
                  label: "Share",
                  gradient: "from-[#22d3ee] to-[#10b981]",
                },
                {
                  icon: UserPlus,
                  label: "Save",
                  gradient: "from-[#10b981] to-[#22d3ee]",
                },
              ].map((action, i) => {
                const Icon = action.icon;
                return (
                  <button
                    key={i}
                    className="group relative flex flex-col items-center gap-2 overflow-hidden rounded-2xl border border-[#22d3ee]/15 bg-white/[0.02] py-3.5 backdrop-blur transition-all hover:border-[#22d3ee]/40 hover:bg-white/[0.05] hover:shadow-lg hover:shadow-[#10b981]/10"
                  >
                    <div
                      className={`flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br ${action.gradient} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <Icon size={15} className="text-[#061418]" />
                    </div>
                    <span className="text-[10px] font-bold text-[#ecfeff]/80">
                      {action.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* ---------- ABOUT ---------- */}
          <Section icon={Award} title="About">
            <p className="text-xs leading-relaxed text-[#ecfeff]/70">
              Welcome to ankit's Business! Contact me directly for appointments,
              consultations, or business inquiries.
            </p>
          </Section>

          {/* ---------- FEATURED PRODUCTS ---------- */}
          <Section
            icon={ShoppingBag}
            title="Featured Products & Services"
            action={<span className="text-[10px] text-[#8fb3ba]">1 item</span>}
          >
            <div className="group relative overflow-hidden rounded-2xl border border-[#22d3ee]/15 bg-gradient-to-br from-[#10b981]/5 to-[#22d3ee]/5 p-4 transition hover:border-[#10b981]/40">
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-[#10b981]/5 to-transparent transition-transform duration-1000 group-hover:translate-x-full" />

              <div className="relative flex items-start gap-3">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#10b981]/20 to-[#22d3ee]/20 text-2xl ring-1 ring-[#10b981]/30">
                  📦
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <h5 className="text-sm font-bold text-white">
                      Featured Business Product
                    </h5>
                    <button className="shrink-0 rounded-lg border border-[#22d3ee]/40 bg-[#22d3ee]/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#22d3ee] transition hover:bg-[#22d3ee]/10">
                      Enquire
                    </button>
                  </div>

                  <p className="mt-1.5 text-[11px] leading-relaxed text-[#ecfeff]/60">
                    Quickly inquire about this high-quality premium business
                    product or service offering.
                  </p>

                  <div className="mt-2.5 flex flex-wrap items-center gap-2">
                    <span className="rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[9px] text-[#8fb3ba]">
                      📁 Catalog
                    </span>
                    <span className="inline-flex items-center gap-1 rounded-md border border-[#10b981]/30 bg-[#10b981]/5 px-2 py-0.5 text-[9px] font-bold text-[#10b981]">
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
                {
                  icon: Phone,
                  label: "Call Business",
                  value: "+91 98765 43210",
                  color: "emerald",
                },
                {
                  icon: Mail,
                  label: "Email Business",
                  value: "contact@ankitbusiness.com",
                  color: "cyan",
                },
                {
                  icon: Globe,
                  label: "Business Website",
                  value: "www.ankitbusiness.com",
                  color: "cyan",
                },
                {
                  icon: MapPin,
                  label: "Business Address",
                  value: "Mumbai, Maharashtra, India",
                  color: "emerald",
                },
              ].map((item, i) => {
                const Icon = item.icon;
                const colorMap = {
                  emerald: "from-[#10b981] to-[#059669] shadow-[#10b981]/20",
                  cyan: "from-[#22d3ee] to-[#0891b2] shadow-[#22d3ee]/20",
                };

                return (
                  <div
                    key={i}
                    className="group flex items-center gap-3 rounded-xl border border-[#22d3ee]/10 bg-white/[0.02] p-3 backdrop-blur transition hover:border-[#22d3ee]/30 hover:bg-white/[0.04]"
                  >
                    <div
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br ${colorMap[item.color]} shadow-lg transition-transform group-hover:scale-110`}
                    >
                      <Icon size={15} className="text-[#061418]" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#22d3ee]/60">
                        {item.label}
                      </p>
                      <p className="truncate text-xs font-semibold text-white">
                        {item.value}
                      </p>
                    </div>
                    <ArrowUpRight
                      size={14}
                      className="shrink-0 text-[#22d3ee]/40 transition group-hover:text-[#22d3ee]"
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
              <button className="rounded-lg border border-[#22d3ee]/40 bg-[#22d3ee]/5 px-2.5 py-1 text-[9px] font-black uppercase tracking-wider text-[#22d3ee] transition hover:bg-[#22d3ee]/10">
                Write Review
              </button>
            }
          >
            <div className="relative overflow-hidden rounded-2xl border border-[#10b981]/20 bg-gradient-to-br from-[#10b981]/5 via-transparent to-[#22d3ee]/5 p-6 text-center">
              <div className="pointer-events-none absolute -top-20 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-[#22d3ee]/20 blur-3xl" />

              <div className="relative">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#10b981] to-[#22d3ee] shadow-xl shadow-[#10b981]/30">
                  <Star size={24} className="fill-[#061418] text-[#061418]" />
                </div>

                <p className="mt-4 text-sm font-bold text-white">
                  Be the First to Share Your Experience
                </p>
                <p className="mx-auto mt-1.5 max-w-xs text-[11px] text-[#ecfeff]/60">
                  Your feedback helps others discover and trust this business.
                </p>

                <button className="group mt-4 inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-4 py-2.5 text-[11px] font-black uppercase tracking-wider text-[#061418] shadow-lg shadow-[#10b981]/30 transition hover:shadow-[#10b981]/50">
                  <Zap size={12} className="fill-[#061418]" />
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
                  className="w-full rounded-xl border border-[#22d3ee]/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-[#8fb3ba]/40 outline-none backdrop-blur transition focus:border-[#10b981]/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-[#10b981]/10"
                />
                <input
                  placeholder="Phone Number"
                  className="w-full rounded-xl border border-[#22d3ee]/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-[#8fb3ba]/40 outline-none backdrop-blur transition focus:border-[#10b981]/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-[#10b981]/10"
                />
              </div>
              <input
                placeholder="Email Address"
                className="w-full rounded-xl border border-[#22d3ee]/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-[#8fb3ba]/40 outline-none backdrop-blur transition focus:border-[#10b981]/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-[#10b981]/10"
              />
              <textarea
                rows={3}
                placeholder="Your Message"
                className="w-full resize-none rounded-xl border border-[#22d3ee]/15 bg-white/[0.02] px-4 py-3 text-xs text-white placeholder:text-[#8fb3ba]/40 outline-none backdrop-blur transition focus:border-[#10b981]/60 focus:bg-white/[0.04] focus:shadow-lg focus:shadow-[#10b981]/10"
              />
              <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-[#10b981] to-[#22d3ee] py-3.5 text-xs font-black uppercase tracking-wider text-[#061418] shadow-xl shadow-[#10b981]/30 transition hover:shadow-[#10b981]/50">
                <span className="relative z-10 flex items-center justify-center gap-2">
                  <Zap size={13} className="fill-[#061418]" />
                  Submit Inquiry
                </span>
                <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/50 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
              </button>
            </div>
          </Section>

          {/* ---------- FOOTER ---------- */}
          <div className="border-t border-[#22d3ee]/10 px-5 py-4 text-center">
            <div className="inline-flex items-center gap-2 rounded-full border border-[#22d3ee]/15 bg-white/[0.02] px-3 py-1.5 backdrop-blur">
              <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gradient-to-br from-[#10b981] to-[#22d3ee]">
                <Eye size={10} className="text-[#061418]" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8fb3ba]">
                Powered by biowebsite
              </span>
            </div>
          </div>

          <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#22d3ee]/50 to-transparent" />
        </div>
      </div>
    </div>
  );
};

/* ==================== REUSABLE SECTION ==================== */
const Section = ({ icon: Icon, title, action, children }) => (
  <div className="border-t border-[#22d3ee]/10 px-5 py-5">
    <div className="mb-3 flex items-center justify-between gap-2">
      <h4 className="flex items-center gap-2 text-[11px] font-black uppercase tracking-wider text-[#22d3ee]/70">
        <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#10b981]/10">
          <Icon size={12} className="text-[#22d3ee]" />
        </div>
        {title}
      </h4>
      {action}
    </div>
    {children}
  </div>
);

export default Mini;
