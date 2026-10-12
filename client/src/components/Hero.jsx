import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  ShieldCheck,
  Sparkles,
  UserRoundPlus,
  Star,
  Zap,
} from "lucide-react";

function Hero() {
  const trustItems = [
    "Direct .VCF Contact Download",
    "1-Tap WhatsApp & Call",
    "QR Code Ready",
  ];

  return (
    <section id="home" className="relative isolate overflow-hidden">
      {/* Background effects — emerald + cyan */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-[5%] top-24 h-80 w-80 rounded-full bg-[#10b981]/10 blur-[110px]" />
        <div className="absolute right-[5%] top-20 h-80 w-80 rounded-full bg-[#22d3ee]/[0.08] blur-[120px]" />

        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(34,211,238,0.025)_1px,transparent_1px),linear-gradient(to_bottom,rgba(34,211,238,0.025)_1px,transparent_1px)] bg-[size:48px_48px]" />
      </div>

      {/* Main centered container */}
      <div className="mx-auto grid w-full max-w-[1330px] grid-cols-1 items-center gap-8 px-4 py-6 sm:px-6 sm:py-8 md:grid-cols-[minmax(0,1.15fr)_minmax(315px,0.85fr)] md:gap-6 md:px-6 lg:grid-cols-[minmax(0,1.3fr)_minmax(340px,0.85fr)] lg:gap-10 lg:px-8 lg:py-10 xl:grid-cols-[minmax(0,1.45fr)_minmax(380px,0.85fr)] xl:gap-14 xl:px-12">
        {/* LEFT: Hero content */}
        <div className="min-w-0">
          {/* Eyebrow badge — emerald border + cyan text */}
          <div className="mb-3.5 inline-flex max-w-full items-center gap-2 rounded-full border border-[#22d3ee]/25 bg-[#22d3ee]/[0.07] px-3.5 py-1.5 text-[11px] font-semibold text-[#0891b2] shadow-[0_1px_2px_rgba(0,0,0,0.05)] backdrop-blur-sm dark:text-[#22d3ee] sm:mb-4 sm:text-xs lg:mb-5">
            <Sparkles
              size={13}
              className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
            />

            <span>BIO Website &amp; Digital Mini Card Platform</span>

            <span className="relative flex h-2 w-2 shrink-0">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#10b981] opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[#10b981]" />
            </span>
          </div>

          {/* Main heading — solid emerald accent (matches Features h2 span) */}
          <h1 className="max-w-[760px] text-[clamp(28px,3.3vw,60px)] font-extrabold leading-[1.1] tracking-[-0.04em] text-[var(--text-primary)]">
            Turn Every Handshake into a{" "}
            <span className="text-[#10b981]">Permanent Client.</span>
          </h1>

          {/* Description */}
          <p className="mt-3.5 max-w-[620px] text-xs leading-relaxed text-[var(--text-secondary)] sm:mt-4 sm:text-sm md:text-[13px] md:leading-[1.7] lg:mt-5 lg:text-[15px] xl:text-[17px]">
            Paper business cards get lost or thrown away in days. Elevate your
            local business with a fast, interactive digital card &amp; mini
            website. Features 1-tap contact saving (.VCF), instant WhatsApp
            ordering, Google Map navigation, and showcase catalogues.
          </p>

          {/* CTA buttons */}
          <div className="mt-4 flex flex-row flex-wrap items-center gap-2.5 sm:mt-5 sm:gap-3 lg:mt-6">
            {/* Primary — solid emerald */}
            <a
              href="/register"
              className="group relative inline-flex min-h-[44px] items-center justify-center gap-2 overflow-hidden whitespace-nowrap rounded-[13px] border border-[#10b981] bg-[#10b981] px-4 py-2 text-xs font-bold text-white shadow-lg shadow-[#10b981]/25 transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#059669] hover:shadow-xl hover:shadow-[#10b981]/35 active:scale-95 sm:min-h-[48px] sm:rounded-[15px] sm:px-6 sm:text-sm md:min-h-[44px] md:px-4 lg:min-h-[50px] lg:px-7"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent" />
              Create Your Mini Website
              <ArrowRight
                size={16}
                className="transition-transform group-hover:translate-x-1"
              />
            </a>

            {/* Secondary — theme surface */}
            <a
              href="/login"
              className="inline-flex min-h-[44px] items-center justify-center gap-2 whitespace-nowrap rounded-[13px] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-2 text-xs font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-[#22d3ee]/50 hover:bg-[var(--surface-raised)] active:scale-95 sm:min-h-[48px] sm:rounded-[15px] sm:px-5 sm:text-sm md:min-h-[44px] md:px-4 lg:min-h-[50px] lg:px-6"
            >
              Sign In to Your Card
            </a>
          </div>

          {/* Trust indicators */}
          <div className="mt-4 flex max-w-[480px] flex-wrap gap-2 sm:mt-5 sm:gap-2.5 lg:mt-6 lg:max-w-none">
            {trustItems.map((item) => (
              <div
                key={item}
                className="group inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[var(--border-color)] bg-[var(--surface)]/80 px-2.5 py-1 text-[11px] font-semibold text-[var(--text-secondary)] backdrop-blur-sm transition-all duration-200 hover:border-[#10b981]/40 hover:text-[var(--text-primary)] sm:gap-2 sm:px-3 sm:py-1.5 sm:text-xs"
              >
                <CheckCircle2
                  size={14}
                  className="shrink-0 text-[#10b981] transition-transform group-hover:scale-110"
                />

                {item}
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT: Digital business card */}
        <div className="relative mx-auto w-full min-w-0 max-w-[340px] sm:max-w-[360px] md:ml-auto md:mr-0 md:max-w-[330px] lg:max-w-[380px] xl:max-w-[420px]">
          {/* Glow behind card */}
          <div className="pointer-events-none absolute inset-6 -z-10 rounded-full bg-[#10b981]/20 blur-[80px]" />

          <div className="w-full rounded-[22px] border border-[var(--border-color)] bg-gradient-to-br from-[var(--surface-raised)]/95 via-[var(--surface)] to-[var(--surface)] p-2.5 shadow-2xl shadow-emerald-950/30 backdrop-blur-md sm:rounded-[26px] sm:p-3 lg:p-3.5">
            {/* Cover image */}
            <div className="relative h-[110px] overflow-hidden rounded-[15px] sm:h-[125px] sm:rounded-[18px] md:h-[110px] lg:h-[130px] xl:h-[145px]">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1000&q=85"
                alt="Modern barber shop interior"
                className="h-full w-full object-cover object-center transition-transform duration-500 hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-black/30" />

              <span className="absolute left-2.5 top-2.5 inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-black/50 px-2 py-0.5 text-[10px] font-bold text-white backdrop-blur-md sm:px-2.5 sm:py-1 sm:text-[11px]">
                <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
                Barber Shop &amp; Salon
              </span>

              <span className="absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-lg border border-white/20 bg-black/50 text-white backdrop-blur-md transition-all hover:bg-black/70 sm:h-8 sm:w-8 sm:rounded-xl">
                <QrCode size={16} />
              </span>
            </div>

            {/* Business profile */}
            <div className="flex min-w-0 flex-col px-1.5 pb-1 pt-0 sm:px-2">
              <div className="flex min-w-0 items-end gap-2 sm:gap-2.5">
                <div className="relative -mt-6 shrink-0 sm:-mt-7 md:-mt-6 lg:-mt-8">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=240&h=240&q=85"
                    alt="Business owner profile"
                    className="h-[50px] w-[50px] rounded-[13px] border-[2.5px] border-[var(--surface)] object-cover shadow-lg sm:h-[60px] sm:w-[60px] sm:rounded-[16px] md:h-[50px] md:w-[50px] lg:h-[64px] lg:w-[64px]"
                  />
                  <span className="absolute bottom-0.5 right-0.5 h-3 w-3 rounded-full border-2 border-[var(--surface)] bg-[#10b981]" />
                </div>

                <div className="min-w-0 flex-1 pb-0.5">
                  <div className="flex min-w-0 items-center gap-1.5">
                    <h2 className="truncate text-[13px] font-extrabold text-[var(--text-primary)] sm:text-[15px] md:text-[13px] lg:text-[15px]">
                      Rajesh Sharma
                    </h2>

                    <BadgeCheck
                      size={14}
                      className="shrink-0 text-[#22d3ee] sm:size-[16px]"
                    />
                  </div>

                  <p className="mt-0.5 text-[10px] font-semibold leading-4 text-[#0891b2] dark:text-[#22d3ee] sm:text-xs md:text-[10px] lg:text-[12px]">
                    Master Grooming Specialist &amp; Founder
                  </p>

                  <div className="mt-0.5 flex items-center gap-1.5">
                    <p className="truncate text-[10px] text-[var(--text-secondary)] sm:text-[11px] md:text-[10px] lg:text-[11px]">
                      Rajesh Royal Men&apos;s Salon
                    </p>
                    <span className="inline-flex items-center gap-0.5 rounded-full bg-[#22d3ee]/10 px-1.5 py-0.2 text-[9px] font-bold text-[#0891b2] dark:text-[#22d3ee] sm:text-[10px]">
                      <Star size={9} fill="currentColor" /> 4.9
                    </span>
                  </div>
                </div>
              </div>

              {/* Business description */}
              <p className="mt-2 rounded-lg border border-[var(--border-color)]/50 bg-[var(--surface-raised)]/50 px-2 py-1 text-[10px] italic leading-[1.5] text-[var(--text-secondary)] sm:mt-2.5 sm:px-2.5 sm:py-1.5 sm:text-[11px]">
                &ldquo;Precision Haircuts, Beard Sculpting, Facials &amp; Royal
                Grooming&rdquo;
              </p>

              {/* Address */}
              <div className="mt-1.5 flex items-start gap-1 text-[10px] leading-[1.4] text-[var(--text-secondary)] sm:mt-2 sm:gap-1.5 sm:text-[11px]">
                <MapPin
                  size={12}
                  className="mt-0.5 shrink-0 text-[#10b981] sm:size-[13px]"
                />

                <span className="min-w-0 truncate">
                  Shop 14, Royal Arcade, LBS Marg, Kurla West, Mumbai
                </span>
              </div>

              {/* Contact actions — emerald primary + cyan secondary */}
              <div className="mt-2.5 grid grid-cols-4 gap-1 sm:mt-3 sm:gap-1.5 lg:gap-2">
                {/* Save — emerald primary */}
                <div className="group/action flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[11px] border border-[#10b981] bg-gradient-to-br from-[#10b981] to-[#059669] py-1.5 text-white shadow-xs transition-all duration-200 hover:scale-[1.03] sm:gap-1 sm:rounded-[14px] sm:py-2">
                  <UserRoundPlus size={15} />
                  <span className="text-[9px] font-bold sm:text-[10px]">
                    Save
                  </span>
                </div>

                {/* Call — cyan */}
                <div className="group/action flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[11px] border border-[var(--border-color)] bg-[var(--surface-raised)] py-1.5 text-[#0891b2] transition-all duration-200 hover:scale-[1.03] hover:border-[#22d3ee]/40 dark:text-[#22d3ee] sm:gap-1 sm:rounded-[14px] sm:py-2">
                  <Phone size={15} />
                  <span className="text-[9px] font-bold text-[var(--text-primary)] sm:text-[10px]">
                    Call
                  </span>
                </div>

                {/* WhatsApp — cyan */}
                <div className="group/action flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[11px] border border-[var(--border-color)] bg-[var(--surface-raised)] py-1.5 text-[#0891b2] transition-all duration-200 hover:scale-[1.03] hover:border-[#22d3ee]/40 dark:text-[#22d3ee] sm:gap-1 sm:rounded-[14px] sm:py-2">
                  <MessageCircle size={15} />
                  <span className="text-[9px] font-bold text-[var(--text-primary)] sm:text-[10px]">
                    WhatsApp
                  </span>
                </div>

                {/* Map — emerald */}
                <div className="group/action flex min-w-0 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-[11px] border border-[var(--border-color)] bg-[var(--surface-raised)] py-1.5 text-[#10b981] transition-all duration-200 hover:scale-[1.03] hover:border-[#10b981]/40 sm:gap-1 sm:rounded-[14px] sm:py-2">
                  <MapPin size={15} />
                  <span className="text-[9px] font-bold text-[var(--text-primary)] sm:text-[10px]">
                    Map
                  </span>
                </div>
              </div>

              {/* Featured service */}
              <div className="group/service mt-2 flex min-w-0 items-center gap-2 rounded-[13px] border border-[var(--border-color)] bg-[var(--surface-raised)] p-1.5 transition-all hover:border-[#10b981]/30 sm:mt-2.5 sm:rounded-[15px] sm:p-2">
                <img
                  src="https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=200&h=200&q=80"
                  alt="Professional barber grooming service"
                  className="h-[38px] w-[38px] shrink-0 rounded-[9px] object-cover sm:h-[44px] sm:w-[44px] sm:rounded-[11px] md:h-[38px] md:w-[38px] lg:h-[46px] lg:w-[46px]"
                />

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="rounded bg-[#22d3ee]/10 px-1.5 py-0.2 text-[8.5px] font-bold uppercase tracking-wider text-[#0891b2] dark:text-[#22d3ee] sm:text-[9px]">
                      Featured
                    </span>
                  </div>

                  <h3 className="truncate text-[10px] font-bold leading-[1.3] text-[var(--text-primary)] sm:text-xs md:text-[10px] lg:text-[12px]">
                    Executive Royal Cut &amp; Beard Sculpt
                  </h3>

                  <p className="text-[10px] font-bold text-[#10b981] sm:text-xs">
                    ₹499
                  </p>
                </div>
              </div>

              {/* Preview button — solid emerald */}
              <a
                href="/preview"
                className="group mx-0.5 mt-2 flex min-h-[36px] items-center justify-center gap-1.5 rounded-[12px] border border-[#10b981] bg-[#10b981] px-2.5 py-1.5 text-center text-[10px] font-bold text-white shadow-sm transition-all hover:-translate-y-0.5 hover:bg-[#059669] sm:mt-2.5 sm:min-h-[40px] sm:gap-2 sm:rounded-[14px] sm:py-2 sm:text-xs md:min-h-[36px] md:text-[11px] lg:min-h-[42px] lg:text-[13px]"
              >
                <Zap size={13} className="text-white" />
                Preview Full Customer Experience
                <ArrowRight
                  size={13}
                  className="shrink-0 transition-transform group-hover:translate-x-1"
                />
              </a>
            </div>
          </div>

          {/* Trust note */}
          <div className="mt-2 flex items-center justify-center gap-1.5 text-center text-[10px] font-medium text-[var(--text-secondary)] sm:mt-2.5 sm:gap-2 sm:text-[11px] lg:mt-3">
            <ShieldCheck size={13} className="shrink-0 text-[#10b981]" />
            A complete digital identity for your business
            <ArrowUpRight size={11} className="text-[#22d3ee]" />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
