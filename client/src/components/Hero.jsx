
import {
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  CheckCircle2,
  ContactRound,
  Globe2,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  ShieldCheck,
  ShoppingBag,
  Star,
  UserRoundPlus,
  Zap,
} from "lucide-react";

const benefits = [
  "Save contacts in one tap",
  "WhatsApp & direct calls",
  "Instant QR access",
];

function Hero() {
  return (
    <section
      id="home"
      className="relative w-full bg-[#eaf8f4] pt-[76px] dark:bg-[#0b1b30]"
    >
      {/* HERO PANEL */}
      <div className="relative isolate overflow-hidden rounded-b-none border-b border-[#d7e3eb] bg-[#eaf8f4] dark:border-[#29435f] dark:bg-[#0b1b30]">
        {/* Background decoration */}
        <div className="pointer-events-none absolute inset-0 -z-0 overflow-hidden">
          <div className="absolute -right-20 top-0 h-72 w-72 rounded-full bg-cyan-400/[0.08] blur-[100px] dark:bg-cyan-400/[0.07]" />
          <div className="absolute -left-20 bottom-0 h-64 w-64 rounded-full bg-[#132942]/[0.10] blur-[100px] dark:bg-cyan-400/[0.05]" />
        </div>

        {/* Content-driven layout */}
        <div className="relative z-10 mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-8 px-4 pb-0  sm:px-6 sm:pb-0 sm:pt-10 md:gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-5 lg:px-2 lg:py-0 lg:pt-14 xl:gap-8 xl:px-4">

          {/* LEFT CONTENT */}
          {/* Mobile: text first | Desktop: left */}
          <div className="order-1 mx-auto w-full max-w-[650px] text-center lg:order-1 lg:mx-0 lg:text-left">
            <div className="mb-2 inline-flex max-w-full flex-wrap items-center justify-center gap-2 rounded-full border border-[#d7e3eb] bg-white px-3 py-2 text-[10px] font-bold text-cyan-700 shadow-sm dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee] sm:mb-5 sm:px-3.5 sm:text-xs lg:justify-start">
              <span>BIO WEBSITE</span>
              <span className="h-1 w-1 rounded-full bg-[#0891b2] dark:bg-[#22d3ee]" />
              <span>YOUR DIGITAL BUSINESS IDENTITY</span>
            </div>

            <h1 className="text-[clamp(2.6rem,5.1vw,5rem)] font-extrabold leading-[1.02] tracking-[-0.045em] text-[#0b1b30] dark:text-white">
              Your business.
              <br />
              <span className="hero-highlight relative inline-block text-[#0891b2] dark:text-[#22d3ee]">
                One smart link.
                <svg
                  className="hero-draw-line pointer-events-none absolute -bottom-[10px] left-0 h-[13px] w-full overflow-visible sm:-bottom-[12px] sm:h-[16px]"
                  viewBox="0 0 340 16"
                  preserveAspectRatio="none"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    className="hero-draw-stroke"
                    d="M3 8 C75 13, 145 3, 220 7 S305 11, 337 5"
                    stroke="currentColor"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <path
                    className="hero-draw-stroke hero-draw-stroke-second"
                    d="M35 14 C105 10, 190 14, 260 11"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </span>
            </h1>

            <p className="mx-auto mt-4 max-w-[570px] text-[15px] leading-[1.8] text-[#64748b] dark:text-[#a5b4c7] sm:mt-8 sm:text-[17px] sm:leading-[1.85] lg:mx-0">
              Your digital visiting card, products, services and contact details
              — beautifully organised in one place. Make it easier for customers
              to discover you, remember you and connect with you.
            </p>

            {/* CTA BUTTONS */}
            <div className="mt-4 flex flex-col items-stretch justify-center gap-3 min-[430px]:flex-row min-[430px]:items-center lg:mt-8 lg:justify-start">
              <a
                href="/register"
                className="group inline-flex items-center justify-center gap-3 rounded-full bg-cyan-400 px-7 py-4 text-[15px] font-bold text-[#f1f6f9] shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:text-[#0b1b30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 sm:px-8"
              >
                Create Your Mini Website
                <ArrowRight
                  size={17}
                  className="transition-transform group-hover:translate-x-1"
                />
              </a>

              <a
                href="/login"
                className="inline-flex min-h-[52px] items-center justify-center gap-2 rounded-full border border-[#d7e3eb] bg-transparent px-5 py-3 text-[15px] font-semibold text-[#0b1b30] transition hover:border-cyan-500 hover:text-cyan-700 dark:border-[#29435f] dark:text-white dark:hover:border-[#22d3ee] dark:hover:text-[#22d3ee]"
              >
                Sign In
                <ArrowUpRight size={17} />
              </a>
            </div>

            {/* BENEFITS */}
            <div className="mt-5 flex flex-wrap justify-center gap-x-4 gap-y-2.5 lg:justify-start">
              {benefits.map((benefit) => (
                <span
                  key={benefit}
                  className="inline-flex items-center gap-1.5 text-[12px] font-medium text-[#64748b] dark:text-[#94a3b8] sm:text-xs"
                >
                  <CheckCircle2
                    size={14}
                    className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                  />
                  {benefit}
                </span>
              ))}
            </div>

            {/* TRUST INDICATOR */}
            <div className="mt-3 flex items-center justify-center gap-3 lg:justify-start">
              <div className="flex -space-x-2">
                {[
                  "photo-1500648767791-00dcc994a43e",
                  "photo-1534528741775-53994a69daeb",
                  "photo-1506794778202-cad84cf45f1d",
                ].map((photo) => (
                  <img
                    key={photo}
                    src={`https://images.unsplash.com/${photo}?auto=format&fit=crop&w=80&h=80&q=80`}
                    alt="Business owner"
                    className="h-8 w-8 rounded-full border-2 border-[#f1f6f9] object-cover dark:border-[#132942]"
                  />
                ))}
              </div>

              <div className="text-left">
                <div className="flex items-center gap-1">
                  <Star
                    size={12}
                    fill="currentColor"
                    className="text-amber-500"
                  />
                  <span className="text-sm font-bold text-[#0b1b30] dark:text-white">
                    Built for modern businesses
                  </span>
                </div>
                <p className="mt-0.5 text-[12px] text-[#64748b] dark:text-[#94a3b8]">
                  One profile. Everything connected.
                </p>
              </div>
            </div>
          </div>

          {/* RIGHT: TWO DIFFERENT DIGITAL VISITING CARDS */}
          {/* Mobile: image/cards second | Desktop: right */}
          <div className="order-2 relative mx-auto flex min-h-[390px] w-full max-w-[500px] items-center justify-center sm:min-h-[440px] lg:order-2 lg:min-h-[500px]">
            {/* Soft background glow */}
            <div className="pointer-events-none absolute inset-10 rounded-full bg-cyan-400/10 blur-[70px]" />

            {/* BACK CARD: BUSINESS CONSULTANT */}
            <div className="absolute right-1 top-5 z-0 w-[78%] max-w-[370px] rotate-[7deg] overflow-hidden rounded-xl border border-[#b9e2d8] bg-[#e3f5ef] text-[#0b302b] shadow-[0_18px_40px_-22px_rgba(0,0,0,0.35)] dark:border-[#315e59] dark:bg-[#143b38] dark:text-white sm:right-3 sm:top-7 sm:rounded-2xl">
              {/* Consultant banner */}
              <div className="relative h-[90px] overflow-hidden sm:h-[108px]">
                <img
                  src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=900&q=85"
                  alt="Consulting office banner"
                  className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(13,148,136,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(13,148,136,0.04)_1px,transparent_1px)] bg-[size:48px_48px]" />

                <span className="absolute left-3 top-3 rounded-full border border-white/30 bg-[#0b302b]/75 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">
                  BUSINESS CONSULTING
                </span>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-emerald-200">
                    GROW WITH CONFIDENCE
                  </p>
                </div>
              </div>

              {/* Consultant profile */}
              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                {/* Profile image and identity */}
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=160&h=160&q=85"
                    alt="Arjun Mehta"
                    className="h-14 w-14 shrink-0 rounded-xl border-2 border-white object-cover object-center shadow-sm sm:h-16 sm:w-16"
                  />

                  <div className="min-w-0 flex-1">
                    <h3 className="truncate text-sm font-black sm:text-base">
                      Arjun Mehta
                    </h3>

                    <p className="mt-1 truncate text-[10px] font-semibold text-[#147d70] dark:text-emerald-300 sm:text-xs">
                      Business Consultant
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] opacity-80 sm:text-xs">
                      <span className="inline-flex items-center gap-1">
                        <MapPin size={11} className="shrink-0" />
                        Delhi, India
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={11}
                          fill="currentColor"
                          className="shrink-0 text-amber-500"
                        />
                        <strong>4.8</strong>
                        <span>(86 reviews)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Divider and social handles */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#b9e2d8] pt-3 dark:border-[#315e59]">
                  <div className="flex items-center gap-1.5 sm:gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#b9e2d8] bg-white/70 text-[9px] font-black dark:border-[#315e59] dark:bg-[#0b302b]">
                      in
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#b9e2d8] bg-white/70 text-[9px] font-black dark:border-[#315e59] dark:bg-[#0b302b]">
                      X
                    </span>

                    <span className="truncate text-[9px] opacity-80 sm:text-[10px]">
                      @arjun.advisory
                    </span>
                  </div>

                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#a7d8ca] bg-white/70 text-[#147d70] dark:border-[#315e59] dark:bg-[#0b302b] dark:text-emerald-300">
                    <ArrowUpRight size={17} />
                  </div>
                </div>
              </div>

              {/* Thin teal card edge */}
              <div className="h-1 w-full bg-[#147d70] dark:bg-emerald-400" />

              {/* Consultant social handles */}
              <div className="flex items-center gap-2 border-t border-[#b9e2d8] px-3 py-2 dark:border-[#315e59] sm:px-4">
                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/70 text-[9px] font-black dark:bg-[#0b302b]">
                  in
                </span>

                <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white/70 text-[9px] font-black dark:bg-[#0b302b]">
                  X
                </span>

                <span className="truncate text-[9px] opacity-80">
                  @arjun.advisory
                </span>
              </div>

              <div className="h-1 w-full bg-[#147d70] dark:bg-emerald-400" />
            </div>

            {/* FRONT CARD: GROOMING & SALON */}
            <div className="absolute bottom-5 left-0 z-10 w-[86%] max-w-[405px] -rotate-[4deg] overflow-hidden rounded-xl border border-[#29435f] bg-white text-[#0b1b30] shadow-[0_24px_55px_-25px_rgba(0,0,0,0.42)] transition-transform duration-500 hover:-translate-y-1 hover:rotate-0 dark:bg-[#0b1b30] dark:text-white sm:bottom-6 sm:left-2 sm:rounded-2xl">
              {/* Salon banner */}
              <div className="relative h-[100px] overflow-hidden sm:h-[118px]">
                <img
                  src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=900&q=85"
                  alt="Modern barbershop banner"
                  className="h-full w-full object-cover"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#0b1b30]/85 via-[#0b1b30]/10 to-transparent" />

                <span className="absolute left-3 top-3 rounded-full border border-white/25 bg-[#0b1b30]/75 px-2.5 py-1 text-[9px] font-bold text-white backdrop-blur">
                  GROOMING &amp; SALON
                </span>

                <div className="absolute bottom-2.5 left-3 right-3">
                  <p className="text-[9px] font-bold uppercase tracking-widest text-cyan-300">
                    YOUR STYLE. YOUR IDENTITY.
                  </p>
                </div>
              </div>

              {/* Salon profile */}
              <div className="px-3 pb-3 sm:px-4 sm:pb-4">
                <div className="flex items-center gap-3">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&h=200&q=85"
                    alt="Rajesh Sharma"
                    className="relative z-10 h-14 w-14 shrink-0 rounded-xl border-[3px] border-white object-cover object-center shadow-md dark:border-[#0b1b30] sm:h-16 sm:w-16"
                  />

                  <div className="min-w-0 flex-1">
                    <div className="flex min-w-0 items-center gap-1">
                      <h3 className="truncate text-sm font-black sm:text-base">
                        Rajesh Sharma
                      </h3>

                      <BadgeCheck
                        size={14}
                        className="shrink-0 text-cyan-500"
                      />
                    </div>

                    <p className="mt-1 truncate text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 sm:text-xs">
                      Grooming Specialist
                    </p>

                    <div className="mt-1.5 flex flex-wrap items-center gap-x-3 gap-y-1 text-[10px] text-[#64748b] dark:text-[#94a3b8] sm:text-xs">
                      <span className="inline-flex items-center gap-1">
                        <MapPin
                          size={11}
                          className="shrink-0 text-cyan-600 dark:text-cyan-300"
                        />
                        Mumbai, India
                      </span>

                      <span className="inline-flex items-center gap-1">
                        <Star
                          size={11}
                          fill="currentColor"
                          className="shrink-0 text-amber-500"
                        />
                        <strong className="text-[#0b1b30] dark:text-white">
                          4.9
                        </strong>
                        <span>(120 reviews)</span>
                      </span>
                    </div>
                  </div>
                </div>

                {/* Social handles and connect */}
                <div className="mt-3 flex items-center justify-between gap-2 border-t border-[#d7e3eb] pt-3 dark:border-[#29435f]">
                  <div className="flex items-center gap-1.5 text-[#64748b] dark:text-[#94a3b8] sm:gap-2">
                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d7e3eb] bg-[#f1f6f9] text-[9px] font-black dark:border-[#29435f] dark:bg-[#132942]">
                      ig
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d7e3eb] bg-[#f1f6f9] text-[9px] font-black dark:border-[#29435f] dark:bg-[#132942]">
                      in
                    </span>

                    <span className="flex h-7 w-7 items-center justify-center rounded-lg border border-[#d7e3eb] bg-[#f1f6f9] text-[9px] font-black dark:border-[#29435f] dark:bg-[#132942]">
                      X
                    </span>
                  </div>

                  <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-cyan-400 px-2.5 py-2 text-[10px] font-bold text-[#0b1b30] sm:px-3">
                    <Phone size={12} />
                    Connect
                  </span>
                </div>
              </div>

              {/* Thin card edge */}
              <div className="h-1 w-full bg-cyan-400" />
            </div>

            {/* Floating identity chip */}
            <div className="absolute left-0 top-[38%] z-20 hidden -rotate-3 items-center gap-2 rounded-xl border border-[#d7e3eb] bg-white/95 p-2 shadow-lg dark:border-[#29435f] dark:bg-[#132942]/95 sm:flex">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/15 text-cyan-700 dark:text-cyan-300">
                <ShieldCheck size={17} />
              </div>

              <div>
                <p className="text-[9px] font-bold text-cyan-700 dark:text-cyan-300">
                  YOUR IDENTITY
                </p>

                <p className="mt-0.5 text-[10px] font-bold text-[#0b1b30] dark:text-white">
                  One smart link
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom spacing stays inside rounded panel */}
        <div className="h-12 sm:h-12 lg:h-12" />
      </div>

     
    </section>
  );
}

export default Hero;
