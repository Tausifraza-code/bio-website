import {
  ArrowUpRight,
  CheckCircle2,
  Download,
  Layers,
  Palette,
  Share2,
  Smartphone,
  UserPlus,
} from "lucide-react";
import stepCreate from "../assets/step-create.jpg.avif";
import stepRegister from "../assets/step-register.jpg.jpeg";
import stepSave from "../assets/step-save.jpg.avif";
import stepShare from "../assets/step-share.jpg.avif";

const steps = [
  {
    number: "01",
    stepLabel: "Step 01",
    title: "Register",
    tagline: "Quick 30-Second Setup",
    description:
      "Get started with BIO and claim your unique custom handle to establish your professional digital identity.",
    features: [
      "No app download required",
      "Claim your unique bio.site URL",
      "Instant account activation",
    ],
    badge: "Quick Setup",
    icon: UserPlus,
    image: stepRegister,
    imageAlt: "Register on BIO digital business card",
  },
  {
    number: "02",
    stepLabel: "Step 02",
    title: "Create",
    tagline: "Custom Brand Identity",
    description:
      "Add your contact details, social links, portfolio, and branding to build a polished, high-converting digital card.",
    features: [
      "Direct phone, email & WhatsApp links",
      "Showcase services & social media",
      "Dynamic color accents & themes",
    ],
    badge: "Design Suite",
    icon: Palette,
    image: stepCreate,
    imageAlt: "Create and design your digital business card",
  },
  {
    number: "03",
    stepLabel: "Step 03",
    title: "Share",
    tagline: "Instant QR & NFC Ready",
    description:
      "Share your digital business card effortlessly at meetings, networking events, or online with a quick scan or tap.",
    features: [
      "Dynamic high-res QR code",
      "1-Tap NFC contactless sharing",
      "Share via WhatsApp, SMS & socials",
    ],
    badge: "Instant Sharing",
    icon: Share2,
    image: stepShare,
    imageAlt: "Share your digital business card with QR code",
  },
  {
    number: "04",
    stepLabel: "Step 04",
    title: "Save",
    tagline: "1-Tap Contact Phonebook Sync",
    description:
      "Let clients and prospects save your contact information directly into their smartphone phonebook in seconds.",
    features: [
      "Direct 1-tap vCard phonebook sync",
      "Zero manual typing or lost contacts",
      "100% offline accessible once saved",
    ],
    badge: "1-Tap Sync",
    icon: Download,
    image: stepSave,
    imageAlt: "Save contact details directly to smartphone phonebook",
  },
];

export default function HowItWorks() {
  return (
    <section className="overflow-visible bg-[#eaf8f4] px-5 py-6 text-[#0b1b30] transition-colors duration-300 dark:bg-[#0b1b30] dark:text-white sm:px-6 sm:py-6 lg:px-6 lg:py-6">
      <div className="mx-auto grid max-w-[1240px] grid-cols-1 gap-12 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)] lg:gap-16 xl:gap-20">
        {/* LEFT: Native Sticky Heading (Stays sticky while Cards 1-4 scroll, then naturally releases after card 4) */}
        <div className="lg:sticky lg:top-24 lg:h-fit lg:self-start">
          <div className="max-w-[700px]">
            {/* Pill Badge */}
            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-600/25 bg-white/70 px-4 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-sm backdrop-blur-md dark:border-cyan-400/25 dark:bg-[#132942]/80 dark:text-cyan-300">
              <Layers size={14} className="text-cyan-600 dark:text-cyan-400" />
              How it works
            </span>

            {/* Main Headline */}
            <h2 className="font-serif text-4xl font-bold leading-[1.06] tracking-tight text-[#0b1b30] sm:text-5xl lg:text-6xl xl:text-7xl dark:text-white">
              How to make a{" "}
              <span className="block text-cyan-600 dark:text-cyan-300">
                digital business card
              </span>
            </h2>

            {/* Description */}
            <p className="mt-6 max-w-lg text-base leading-7 text-[#64748b] dark:text-[#cbd5e1] sm:text-lg sm:leading-8">
              Create your professional digital identity, share your details
              instantly with QR or NFC, and make every connection count.
            </p>

            {/* Trust Highlights */}
            <div className="mt-8 grid grid-cols-1 gap-2.5 sm:grid-cols-2 max-w-md">
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span>Takes under 2 minutes</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span>No app download needed</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <CheckCircle2 size={16} className="shrink-0 text-emerald-500" />
                <span>100% Free forever plan</span>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-slate-700 dark:text-slate-300">
                <Smartphone size={16} className="shrink-0 text-cyan-500" />
                <span>Works on all smartphones</span>
              </div>
            </div>

            {/* Primary Action Button */}
            <a
              href="/register"
              className="mt-8 inline-flex min-h-[58px] items-center justify-center rounded-full bg-cyan-400 px-9 py-4 text-base font-bold text-white hover:text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition-all duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:shadow-cyan-400/35 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 dark:bg-[#22d3ee] dark:hover:text-[#0b1b30] dark:text-white dark:hover:bg-[#67e8f9] dark:focus-visible:ring-offset-[#0b1b30]"
            >
              <span>Create your card</span>
              <ArrowUpRight
                className="ml-2 transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                size={19}
              />
            </a>
          </div>
        </div>

        {/* RIGHT: Four naturally scrolling cards (1 to 4) */}
        <div className="flex min-w-0 flex-col gap-8 sm:gap-10 lg:gap-12">
          {steps.map((step) => {
            const StepIcon = step.icon;

            return (
              <article
                key={step.number}
                className="group/card grid min-h-[350px] grid-cols-1 gap-6 rounded-[28px] border border-[#d7e3eb] bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-md dark:border-[#29435f] dark:bg-[#132942] sm:grid-cols-[0.9fr_1.1fr] sm:gap-7 sm:p-8 lg:min-h-[380px] lg:gap-8 lg:p-9"
              >
                {/* Card textual content */}
                <div className="flex min-w-0 flex-col items-start justify-between">
                  <div>
                    {/* Step Number Tag */}
                    <div className="inline-flex items-center gap-2 rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-700 dark:bg-cyan-950/60 dark:text-cyan-300">
                      <StepIcon size={13} />
                      <span>{step.stepLabel}</span>
                    </div>

                    {/* Step Title */}
                    <h3 className="mt-4 font-serif text-3xl font-bold tracking-tight text-[#0b1b30] dark:text-white sm:text-4xl">
                      {step.title}
                    </h3>

                    {/* Tagline */}
                    <p className="mt-1 text-xs font-semibold text-cyan-600 dark:text-cyan-400">
                      {step.tagline}
                    </p>

                    {/* Description */}
                    <p className="mt-3.5 max-w-sm text-sm leading-relaxed text-[#64748b] dark:text-[#cbd5e1] sm:text-base sm:leading-7">
                      {step.description}
                    </p>

                    {/* Feature Bullets */}
                    <ul className="mt-5 space-y-1.5 border-t border-slate-100 pt-4 dark:border-slate-800/80">
                      {step.features.map((feat, i) => (
                        <li
                          key={i}
                          className="flex items-center gap-2 text-xs font-medium text-slate-600 dark:text-slate-300"
                        >
                          <CheckCircle2
                            size={13}
                            className="shrink-0 text-teal-600 dark:text-teal-400"
                          />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Step bottom indicator */}
                  <div className="mt-6 flex items-center gap-2 text-sm font-semibold text-cyan-700 dark:text-cyan-300">
                    <span>Explore {step.title}</span>
                    <ArrowUpRight
                      size={16}
                      className="transition-transform duration-300 group-hover/card:translate-x-0.5 group-hover/card:-translate-y-0.5"
                    />
                  </div>
                </div>

                {/* Card Media (Smooth GPU-rendered, zero layout-shift container) */}
                <div className="relative aspect-[16/11] min-h-[230px] w-full overflow-hidden rounded-2xl bg-[#d7e3eb] dark:bg-[#29435f] sm:min-h-[260px] lg:min-h-[290px]">
                  <img
                    src={step.image}
                    alt={step.imageAlt}
                    loading="lazy"
                    decoding="async"
                    className="absolute inset-0 z-10 h-full w-full object-cover transition-transform duration-700 ease-out hover:scale-105"
                    onError={(event) => {
                      console.error(
                        "Failed to load How It Works image:",
                        step.image,
                      );
                      event.currentTarget.style.display = "none";
                    }}
                  />

                  {/* Floating badge */}
                  <div className="absolute bottom-3 left-3 z-20 flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-slate-800 shadow-sm backdrop-blur-md dark:bg-[#0b1b30]/90 dark:text-white">
                    <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
                    <span>{step.badge}</span>
                  </div>

                  {/* Fallback background if an image is missing */}
                  <div className="pointer-events-none absolute inset-0 z-0 flex items-center justify-center bg-gradient-to-br from-emerald-100 via-cyan-50 to-[#d7e3eb] dark:from-[#132942] dark:via-[#0b1b30] dark:to-[#29435f]">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/70 text-cyan-700 shadow-sm dark:bg-[#132942] dark:text-cyan-300">
                      <StepIcon size={30} />
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
