import {
  ArrowRight,
  BadgeCheck,
  CheckCircle2,
  Headset,
  Zap,
} from "lucide-react";

const benefits = [
  {
    title: "Professional Identity",
    description: "A polished online presence for your business.",
    icon: BadgeCheck,
  },
  {
    title: "Simple & Reliable",
    description: "Your important details, organised in one place.",
    icon: CheckCircle2,
  },
  {
    title: "Always Connected",
    description: "Help customers reach you whenever they need.",
    icon: Headset,
  },
  {
    title: "Fast & Convenient",
    description: "Share your business with a single link.",
    icon: Zap,
  },
];

function BenefitCard({ item }) {
  const Icon = item.icon;
  return (
    <article className="group min-w-0 rounded-2xl border border-[#d7e3eb] bg-white p-5 shadow-[0_8px_24px_rgba(11,27,48,0.04)] transition duration-300 hover:-translate-y-1 hover:border-[#0891b2]/50 hover:shadow-[0_14px_30px_rgba(11,27,48,0.08)] dark:border-[#29435f] dark:bg-[#132942] dark:hover:border-[#22d3ee]/50 sm:p-5">
      <div className="flex min-w-0 items-center gap-3">
        <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[#d7e3eb] bg-[#f1f6f9] text-[#0891b2] transition-colors group-hover:border-[#0891b2]/25 group-hover:bg-[#e0f7fa] dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-[#22d3ee] dark:group-hover:bg-[#123440]">
          <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
        </span>
        <h3 className="min-w-0 text-base font-bold leading-snug tracking-tight text-[#0b1b30] dark:text-white sm:text-lg">
          {item.title}
        </h3>
      </div>
      <p className="mt-4 text-sm leading-6 text-[#64748b] dark:text-[#94a3b8]">
        {item.description}
      </p>
      <a
        href="/register"
        className="group/link mt-4 inline-flex min-h-7 items-center gap-2 text-sm font-semibold text-[#0891b2] transition-colors hover:text-[#0e7490] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#22d3ee] focus-visible:ring-offset-4 dark:text-[#22d3ee] dark:hover:text-cyan-200"
      >
        Learn More{" "}
        <ArrowRight
          size={17}
          aria-hidden="true"
          className="transition-transform duration-200 group-hover/link:translate-x-1"
        />
      </a>
    </article>
  );
}

export default function Features() {
  return (
    <section
      id="services"
      aria-labelledby="features-heading"
      className="features-section relative isolate w-full overflow-hidden bg-[#eaf8f4] py-6 text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white sm:py-6 lg:py-6"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-20"
        style={{
          backgroundImage:
            "radial-gradient(circle, rgba(8,145,178,0.22) 1px, transparent 1.2px)",
          backgroundSize: "38px 38px",
        }}
      />
      {/* Match Hero.jsx container width and responsive padding exactly. */}
      <div className="mx-auto grid w-full max-w-[1240px] grid-cols-1 items-center gap-10 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:gap-8 lg:px-2 xl:gap-10 xl:px-4">
        <div className="min-w-0">
          <p className="mb-4 flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-700 dark:text-[#22d3ee] sm:text-xs">
            <span aria-hidden="true" className="h-px w-7 shrink-0 bg-current" />
            The BIO advantage
          </p>
          <h2
            id="features-heading"
            className="max-w-[620px] text-[clamp(2.2rem,4.1vw,3.5rem)] font-extrabold leading-[1.06] tracking-[-0.045em] text-[#0b1b30] dark:text-white"
          >
            Business Solution That Works Around You in{" "}
            <span className="!text-[#0891b2] dark:!text-[#22d3ee]">
              Easy Way
            </span>
          </h2>
          <p className="mt-6 max-w-[570px] text-[15px] leading-[1.8] text-[#64748b] dark:text-[#a5b4c7] sm:text-base sm:leading-7 lg:text-[17px]">
            Bring your business identity, digital visiting card, products, and
            customer connections together in one simple, high-converting mini
            website.
          </p>
          <a
            href="/register"
            className="group mt-8 inline-flex min-h-[58px] max-w-full items-center justify-center gap-3 whitespace-nowrap rounded-full bg-cyan-400 px-7 py-4 text-[15px] font-bold text-[#f1f6f9] shadow-sm transition duration-300 hover:-translate-y-1 hover:bg-cyan-300 hover:text-[#0b1b30] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 sm:px-8"
          >
            More Feature{" "}
            <ArrowRight
              aria-hidden="true"
              size={17}
              className="shrink-0 transition-transform duration-200 group-hover:translate-x-1"
            />
          </a>
        </div>
        <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:gap-4 xl:gap-5">
          {benefits.map((item) => (
            <BenefitCard key={item.title} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
