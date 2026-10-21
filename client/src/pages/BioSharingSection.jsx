import { ArrowRight, Check, Link2, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

/* Authentic WhatsApp Icon */
const WhatsAppIcon = ({ size = 22 }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.05 24l6.348-1.665c1.732.946 3.685 1.444 5.652 1.446h.005c6.554 0 11.89-5.335 11.893-11.893a11.82 11.82 0 00-3.488-8.482" />
  </svg>
);

/* Authentic Instagram Icon */
const InstagramIcon = ({ size = 22 }) => (
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

/* High-precision origami paper plane SVG matching reference */
function PaperPlane({ className = "" }) {
  return (
    <svg
      viewBox="0 0 200 130"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} [--plane-top-start:#155e75] [--plane-top-end:#0891b2] [--plane-body-start:#164e63] [--plane-body-end:#0e7490] [--plane-under-start:#0e7490] [--plane-under-end:#06b6d4] [--plane-fold:#164e63] [--plane-highlight:#67e8f9] dark:[--plane-top-start:#22d3ee] dark:[--plane-top-end:#22d3ee] dark:[--plane-body-start:#132942] dark:[--plane-body-end:#22d3ee] dark:[--plane-under-start:#22d3ee] dark:[--plane-under-end:#132942] dark:[--plane-fold:#132942] dark:[--plane-highlight:#22d3ee]`}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id="planeTopGrad"
          x1="15"
          y1="25"
          x2="185"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--plane-top-start)" />
          <stop offset="100%" stopColor="var(--plane-top-end)" />
        </linearGradient>
        <linearGradient
          id="planeBodyGrad"
          x1="30"
          y1="55"
          x2="185"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--plane-body-start)" />
          <stop offset="100%" stopColor="var(--plane-body-end)" />
        </linearGradient>
        <linearGradient
          id="planeUnderGrad"
          x1="80"
          y1="75"
          x2="185"
          y2="20"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor="var(--plane-under-start)" />
          <stop offset="100%" stopColor="var(--plane-under-end)" />
        </linearGradient>
      </defs>
      {/* Keel shadow fold */}
      <path d="M185 20 L65 105 L95 72 Z" fill="var(--plane-fold)" />
      {/* Lower underwing */}
      <path d="M185 20 L95 72 L18 70 Z" fill="url(#planeUnderGrad)" />
      {/* Center body fold */}
      <path d="M185 20 L95 72 L88 38 Z" fill="url(#planeBodyGrad)" />
      {/* Main upper wing */}
      <path d="M185 20 L88 38 L12 12 Z" fill="url(#planeTopGrad)" />
      {/* Center fold highlight */}
      <path
        d="M185 20 L88 38 Z"
        stroke="var(--plane-highlight)"
        strokeWidth="1.2"
        opacity="0.6"
      />
    </svg>
  );
}

const checklistItems = [
  "Share with anyone, anywhere",
  "Keep all important links in one place",
  "Help customers connect with you faster",
];

export default function BioSharingSection() {
  return (
    <section
      id="bio-sharing"
      aria-labelledby="bio-sharing-heading"
      className="relative isolate w-full overflow-hidden bg-[#eaf8f4] py-6 dark:bg-[#0b1b30] sm:py-6 lg:py-6"
    >
      {/* Shared container matching Hero and Features width exactly */}
      <div className="relative z-10 mx-auto w-full max-w-[1240px] px-4 sm:px-6 lg:px-2 xl:px-4">
        {/* Unified Banner Card */}
        <div className="relative overflow-hidden rounded-[26px] border border-[#d7e3eb]/80 shadow-md dark:border-[#29435f] sm:rounded-[34px] lg:rounded-[40px]">
          <div className="grid grid-cols-1 items-stretch lg:grid-cols-12">
            {/* ========================================================
                LEFT: DARK TEAL CONTENT PANEL (5 cols on lg)
            ======================================================== */}
            <div className="relative z-10 flex flex-col justify-center bg-cyan-600 px-5 py-8 text-white dark:bg-[#0b1b30] sm:px-8 sm:py-10 md:px-10 lg:col-span-5 lg:px-9 lg:py-12 xl:px-11">
              {/* Subtle ambient lighting */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-white/[0.04] blur-2xl"
              />

              <div className="relative z-10 max-w-[500px]">
                {/* Eyebrow */}
                <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200 dark:text-[#22d3ee] sm:text-xs">
                  ONE LINK. ENDLESS POSSIBILITIES.
                </p>

                {/* Heading matching reference */}
                <h2
                  id="bio-sharing-heading"
                  className="mt-3 text-[clamp(1.9rem,3.8vw,3.1rem)] font-extrabold leading-[1.08] tracking-tight text-white"
                >
                  Your Business,
                  <br />
                  Ready to Be{" "}
                  <span className="text-cyan-200 dark:text-[#22d3ee]">
                    Shared.
                  </span>
                </h2>

                {/* Description */}
                <p className="mt-3.5 text-xs leading-relaxed text-white/85 dark:text-[#a5b4c7] sm:mt-4 sm:text-sm sm:leading-6">
                  Share your professional identity, services and contact details
                  with a single, easy-to-remember link.
                </p>

                {/* Two Horizontal Progress Indicators stacked vertically */}
                <div className="mt-6 space-y-3.5 sm:mt-7 sm:space-y-4">
                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      Easy Sharing
                    </p>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[86%] rounded-full bg-[#5eead4] dark:bg-[#22d3ee]" />
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-white sm:text-sm">
                      Better Reach
                    </p>
                    <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-white/20">
                      <div className="h-full w-[82%] rounded-full bg-[#5eead4] dark:bg-[#22d3ee]" />
                    </div>
                  </div>
                </div>

                {/* Three Checklist Items with solid white circles */}
                <ul className="mt-6 space-y-2.5 sm:mt-7 sm:space-y-3">
                  {checklistItems.map((item) => (
                    <li
                      key={item}
                      className="flex items-center gap-2.5 text-xs font-medium text-white/95 sm:text-[13px]"
                    >
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-white text-cyan-600 dark:bg-[#132942] dark:text-[#22d3ee] sm:h-5 sm:w-5">
                        <Check size={11} strokeWidth={3.5} />
                      </span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>

                {/* CTA Button */}
                {/* <div className="mt-7 sm:mt-8">
                  <Link
                    to="/register"
                    className="group inline-flex min-h-[46px] items-center justify-center gap-2.5 rounded-full bg-[#c8f7ec] px-6 py-2.5 text-xs font-bold text-[#07453e] shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:bg-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-200 sm:min-h-[50px] sm:px-7 sm:text-sm"
                  >
                    <span>Create Your Mini Website</span>
                    <ArrowRight
                      size={16}
                      className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
                    />
                  </Link>
                </div> */}
              </div>
            </div>

            {/* ========================================================
                RIGHT: PALE MINT ILLUSTRATION AREA (7 cols on lg)
                Contains dotted curved flight path, paper plane, 5 icons & floating card
            ======================================================== */}
            <div className="relative flex min-w-0 items-center justify-center overflow-hidden bg-[#eaf8f4] h-[340px] dark:bg-[#0b1b30] sm:h-[380px] lg:col-span-7 lg:h-auto lg:min-h-[520px]">
              {/* Organic curved sweep from left panel on desktop */}
              <svg
                viewBox="0 0 120 600"
                preserveAspectRatio="none"
                className="pointer-events-none absolute left-[-1px] top-0 bottom-0 hidden h-full w-[100px] z-10 lg:block fill-cyan-600 dark:fill-[#0b1b30]"
                aria-hidden="true"
              >
                <path d="M0 0 L40 0 C95 180 85 410 0 600 Z" />
              </svg>

              {/* Soft decorative background glows */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute right-[10%] top-[15%] h-56 w-56 rounded-full bg-cyan-200/50 blur-3xl dark:bg-[#22d3ee]/[0.06]"
              />
              <div
                aria-hidden="true"
                className="pointer-events-none absolute bottom-[10%] left-[20%] h-56 w-56 rounded-full bg-emerald-200/40 blur-3xl dark:bg-[#22d3ee]/[0.06]"
              />

              {/* Looping Dotted Flight Path SVG with circular radar ring */}
              <svg
                viewBox="0 0 650 520"
                preserveAspectRatio="none"
                className="pointer-events-none absolute inset-0 h-full w-full [--sharing-route:#08796f] [--sharing-radar:#0f766e] [--sharing-node:#2dd4bf] dark:[--sharing-route:#22d3ee] dark:[--sharing-radar:#22d3ee] dark:[--sharing-node:#22d3ee]"
                fill="none"
                aria-hidden="true"
              >
                {/* Subtle wireframe radar circle near airplane */}
                <ellipse
                  cx="460"
                  cy="205"
                  rx="40"
                  ry="24"
                  stroke="var(--sharing-radar)"
                  strokeWidth="1.2"
                  strokeDasharray="3 4"
                  opacity="0.3"
                />

                {/* Looping Flight Trail */}
                <path
                  d="M175 110 C210 145 280 200 375 220 S520 180 540 250 S480 410 370 425 S170 430 155 350 S130 190 240 180 S460 215 510 145"
                  stroke="var(--sharing-route)"
                  strokeWidth="2.5"
                  strokeDasharray="6 8"
                  strokeLinecap="round"
                  opacity="0.65"
                />

                {/* Glowing cyan node circles */}
                <circle
                  cx="215"
                  cy="155"
                  r="4.5"
                  fill="var(--sharing-node)"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx="395"
                  cy="225"
                  r="4.5"
                  fill="var(--sharing-node)"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx="485"
                  cy="385"
                  r="4.5"
                  fill="var(--sharing-node)"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
                <circle
                  cx="160"
                  cy="340"
                  r="4.5"
                  fill="var(--sharing-node)"
                  stroke="#ffffff"
                  strokeWidth="2"
                />
              </svg>

              {/* Origami Paper Plane (Upper Right) */}
              <div className="absolute right-[5%] sm:right-[10%] top-[10%] sm:top-[12%] lg:right-[12%] lg:top-[14%] z-20">
                <PaperPlane className="w-24 sm:w-32 lg:w-40 xl:w-44 h-auto drop-shadow-md" />
              </div>

              {/* Communication Icon 1: WhatsApp (Top-Center) */}
              <div className="absolute top-[8%] left-[22%] sm:left-[26%] lg:left-[30%] lg:top-[10%] z-20 flex items-center gap-1.5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md dark:border dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                  <WhatsAppIcon size={20} />
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#0b1b30] shadow-sm dark:bg-[#132942] dark:text-white dark:border dark:border-[#29435f]">
                  Chat
                </span>
              </div>

              {/* Communication Icon 2: Instagram (Upper-Left) */}
              {/* Communication Icon 2: Instagram (Upper-Left) */}
              {/* Communication Icon 2: Instagram */}
              <div className="absolute top-[21%] left-[12%] sm:left-[14%] lg:left-[15%] z-40 flex flex-col items-center gap-1">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md dark:border dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                  <InstagramIcon size={20} />
                </div>
                <span className="rounded-full bg-white px-2 py-0.5 text-[9px] sm:text-[11px] font-bold text-[#0b1b30] shadow-sm dark:bg-[#132942] dark:text-white dark:border dark:border-[#29435f]">
                  Follow
                </span>
              </div>

              {/* Communication Icon 3: Phone (Lower-Left) */}
              <div className="absolute bottom-[8%] left-[8%] sm:left-[12%] lg:left-[18%] lg:bottom-[12%] z-20 flex items-center gap-1.5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md dark:border dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                  <Phone size={19} strokeWidth={2.2} />
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#0b1b30] shadow-sm dark:bg-[#132942] dark:text-white dark:border dark:border-[#29435f]">
                  Call
                </span>
              </div>

              {/* Communication Icon 4: Mail (Bottom-Right) */}
              <div className="absolute bottom-[6%] right-[8%] sm:right-[12%] lg:right-[18%] lg:bottom-[10%] z-20 flex items-center gap-1.5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md dark:border dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                  <Mail size={19} strokeWidth={2.2} />
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#0b1b30] shadow-sm dark:bg-[#132942] dark:text-white dark:border dark:border-[#29435f]">
                  Mail
                </span>
              </div>

              {/* Communication Icon 5: Share / Link (Middle-Right) */}
              <div className="absolute top-[44%] right-[2%] sm:right-[4%] lg:right-[6%] lg:top-[42%] z-20 flex items-center gap-1.5">
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-2xl bg-cyan-600 text-white shadow-md dark:border dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                  <Link2 size={19} strokeWidth={2.4} />
                </div>
                <span className="rounded-full bg-white px-2.5 py-0.5 text-[10px] sm:text-xs font-bold text-[#0b1b30] shadow-sm dark:bg-[#132942] dark:text-white dark:border dark:border-[#29435f]">
                  Share
                </span>
              </div>

              {/* ========================================================
                  CENTRAL FLOATING WHITE LINK CARD
                  Desktop: Overlaps seam / center-left of illustration area
                  Mobile: Centered with compact dimensions (no overlapping with icons)
              ======================================================== */}
              <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-30 w-[185px] sm:w-[210px] lg:left-[22%] lg:w-[230px] xl:left-[24%] xl:w-[250px] rounded-2xl sm:rounded-3xl border border-white/95 bg-white p-4 sm:p-5 shadow-[0_20px_50px_rgba(11,27,48,0.14)] dark:border-[#29435f] dark:bg-[#132942]">
                <div className="mb-2.5 sm:mb-3.5 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-cyan-100 text-cyan-600 dark:bg-[#0b1b30] dark:text-[#22d3ee]">
                  <Link2 size={22} strokeWidth={2.4} />
                </div>

                <h3 className="text-sm sm:text-base lg:text-lg font-black leading-[1.22] tracking-tight text-[#0b1b30] dark:text-white">
                  One Simple Link
                  <br />
                  For Everything
                  <br />
                  That Matters.
                </h3>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
