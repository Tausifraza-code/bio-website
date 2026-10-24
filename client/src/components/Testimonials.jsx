import { useState, useEffect, useRef } from "react";
import {
  ArrowUpRight,
  BadgeCheck,
  ChevronLeft,
  ChevronRight,
  Users,
} from "lucide-react";

const reviews = [
  {
    id: "r1",
    name: "Aarav Sharma",
    role: "Founder, Creative Studio",
    initials: "AS",
    tag: "Business Owner",
    quote:
      "BIO makes sharing my professional identity effortless. Everything my clients need is available in one clean, beautifully designed digital card.",
    detail:
      "From the first day I used BIO, client onboarding got noticeably smoother. People save my card on the spot instead of asking for it later.",
  },
  {
    id: "r2",
    name: "Priya Mehta",
    role: "Independent Consultant",
    initials: "PM",
    tag: "Networking",
    quote:
      "I wanted something more memorable than a printed card. BIO gives me one simple link for my profile, contact details and social accounts.",
    detail:
      "I used to lose leads because people couldn't find my contact info. Now my BIO link is everywhere and follow-ups happen naturally.",
  },
  {
    id: "r3",
    name: "Kabir Verma",
    role: "Marketing Professional",
    initials: "KV",
    tag: "Personal Brand",
    quote:
      "The experience feels genuinely modern. I share my digital card at events without carrying printed cards — and people actually save it.",
    detail:
      "The QR code at events is a game-changer. People scan it on the spot and instantly appear in my analytics. No more chasing emails.",
  },
  {
    id: "r4",
    name: "Ananya Kapoor",
    role: "Freelance Designer",
    initials: "AK",
    tag: "Creative",
    quote:
      "Having my work identity and contact information together makes my introduction easier. The digital card is simple to share and easy to remember.",
    detail:
      "As a designer, presentation is everything. BIO lets me control exactly how I appear professionally — and clients always remember my card.",
  },
];

/* Marquee: duplicate 3× so it loops seamlessly */
const MARQUEE = [...reviews, ...reviews, ...reviews];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [enterDir, setEnterDir] = useState("next");
  const pendingRef = useRef(null);
  const timerRef = useRef(null);

  const navigate = (toIdx, dir) => {
    if (toIdx === active || exiting) return;
    clearTimeout(timerRef.current);
    setExiting(true);
    setEnterDir(dir);
    pendingRef.current = toIdx;
  };

  /* After exit animation finishes, swap card */
  useEffect(() => {
    if (!exiting) return;
    const t = setTimeout(() => {
      setActive(pendingRef.current);
      setExiting(false);
    }, 260);
    return () => clearTimeout(t);
  }, [exiting]);

  /* Auto-advance every 5 s */
  useEffect(() => {
    timerRef.current = setTimeout(
      () => navigate((active + 1) % reviews.length, "next"),
      5000,
    );
    return () => clearTimeout(timerRef.current);
  }, [active]);

  const prev = () =>
    navigate((active - 1 + reviews.length) % reviews.length, "prev");
  const next = () => navigate((active + 1) % reviews.length, "next");

  const r = reviews[active];

  return (
    <section
      className="relative overflow-hidden bg-[#eaf8f4] px-0 py-0 text-[#0b1b30] transition-colors duration-300 dark:bg-[#0b1b30] dark:text-white"
      style={{ contain: "layout paint" }}
    >
      {/* ────────────────────────────────────────────────────────
          TOP BAND — heading + subtext (padded)
      ──────────────────────────────────────────────────────── */}
      <div className="px-5 pt-12 sm:px-12 sm:pt-12 lg:px-20 lg:pt-20">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-end sm:justify-between">
            <div>
              {/* Label */}
              <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e3eb] bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[#0891b2] shadow-sm dark:border-[#29435f] dark:bg-[#132942] dark:text-[#22d3ee]">
                <Users size={12} strokeWidth={2.5} />
                <span>What professionals say</span>
              </div>

              <h2 className="mt-5 text-3xl font-black leading-[1.06] tracking-[-0.04em] text-[#0b1b30] dark:text-white sm:text-4xl lg:text-5xl">
                First impressions.{" "}
                <span className="text-[#0891b2] dark:text-[#22d3ee]">
                  Lasting connections.
                </span>
              </h2>

              <p className="mt-3 max-w-xl text-sm leading-7 text-[#64748b] dark:text-[#94a3b8] sm:text-base">
                Hear from professionals who made their introductions count with
                a single digital card.
              </p>
            </div>

            {/* CTA — visible only md+ */}
            <a
              href="/register"
              className="group hidden shrink-0 items-center gap-2 rounded-full bg-[#0891b2] px-6 py-3 text-sm font-bold text-white shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0e7490] dark:bg-[#22d3ee] dark:text-[#0b1b30] dark:hover:bg-[#67e8f9] sm:inline-flex"
            >
              Create your card
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* ────────────────────────────────────────────────────────
          MARQUEE TICKER
      ──────────────────────────────────────────────────────── */}
      <div className="relative mt-10 overflow-hidden border-y border-[#d7e3eb] bg-white/60 py-3.5 dark:border-[#29435f] dark:bg-[#0b1b30]/60">
        <div className="ts-marquee flex gap-12 whitespace-nowrap">
          {MARQUEE.map((item, i) => (
            <span
              key={i}
              className="inline-flex shrink-0 items-center gap-3 text-xs font-semibold text-[#64748b] dark:text-[#94a3b8]"
            >
              {/* Avatar */}
              <span className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#0b1b30] text-[9px] font-black text-[#22d3ee] dark:bg-[#132942]">
                {item.initials}
              </span>
              <span>{item.name}</span>
              <span className="text-[#d7e3eb] dark:text-[#29435f]">—</span>
              <span className="font-medium italic">
                "{item.quote.slice(0, 52)}…"
              </span>
              <span className="mx-2 h-1 w-1 rounded-full bg-[#d7e3eb] dark:bg-[#29435f]" />
            </span>
          ))}
        </div>
        {/* Fade masks */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-white/80 dark:from-[#0b1b30]/80" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-white/80 dark:from-[#0b1b30]/80" />
      </div>

      {/* ────────────────────────────────────────────────────────
          MAIN GRID
      ──────────────────────────────────────────────────────── */}
      <div className="px-5 pb-5 pt-5 sm:px-5 sm:pb-5 sm:pt-5 lg:px-5 lg:pb-5 lg:pt-5">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-12 lg:gap-6">
            {/* ── Left: Author Stack ── */}
            <div className="flex flex-col gap-3 lg:col-span-4">
              {reviews.map((rev, idx) => {
                const isActive = idx === active;
                return (
                  <button
                    key={rev.id}
                    type="button"
                    onClick={() =>
                      navigate(idx, idx > active ? "next" : "prev")
                    }
                    className={`group relative flex items-center gap-4 overflow-hidden rounded-2xl border px-5 py-4 text-left transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2] dark:focus-visible:ring-[#22d3ee] ${
                      isActive
                        ? "border-[#0891b2]/30 bg-white shadow-[0_8px_24px_rgba(11,27,48,0.08)] dark:border-[#22d3ee]/20 dark:bg-[#132942]"
                        : "border-[#d7e3eb] bg-white/50 hover:border-[#0891b2]/20 hover:bg-white dark:border-[#29435f] dark:bg-transparent dark:hover:border-[#22d3ee]/20 dark:hover:bg-[#132942]/50"
                    }`}
                  >
                    {/* Active left accent */}
                    {isActive && (
                      <span className="absolute left-0 top-3 bottom-3 w-[3px] rounded-r-full bg-[#0891b2] dark:bg-[#22d3ee]" />
                    )}

                    {/* Avatar */}
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-xs font-black transition-all duration-300 ${
                        isActive
                          ? "bg-[#0b1b30] text-[#22d3ee] shadow-sm dark:bg-[#22d3ee] dark:text-[#0b1b30]"
                          : "bg-[#eaf8f4] text-[#0891b2] dark:bg-[#0b1b30] dark:text-[#94a3b8]"
                      }`}
                    >
                      {rev.initials}
                    </span>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5">
                        <p
                          className={`truncate text-sm font-bold transition-colors duration-200 ${
                            isActive
                              ? "text-[#0b1b30] dark:text-white"
                              : "text-[#64748b] dark:text-[#94a3b8]"
                          }`}
                        >
                          {rev.name}
                        </p>
                        {isActive && (
                          <BadgeCheck
                            size={13}
                            className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                          />
                        )}
                      </div>
                      <p className="mt-0.5 truncate text-xs text-[#64748b] dark:text-[#94a3b8]">
                        {rev.role}
                      </p>
                    </div>

                    {/* Tag */}
                    <span
                      className={`hidden shrink-0 rounded-full border px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] transition-all duration-200 sm:block ${
                        isActive
                          ? "border-[#0891b2]/25 bg-[#e0f7fa] text-[#0891b2] dark:border-[#22d3ee]/25 dark:bg-[#0b1b30] dark:text-[#22d3ee]"
                          : "border-[#d7e3eb] bg-transparent text-[#94a3b8] dark:border-[#29435f]"
                      }`}
                    >
                      {rev.tag}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* ── Right: Featured Quote Card ── */}
            <div className="lg:col-span-8">
              <div
                key={r.id}
                className={`relative flex min-h-[380px] flex-col justify-between overflow-hidden rounded-[28px] border border-[#d7e3eb] bg-white p-7 shadow-[0_20px_60px_-16px_rgba(11,27,48,0.09)] dark:border-[#29435f] dark:bg-[#132942] sm:p-9 lg:min-h-[420px] lg:p-11 ${
                  exiting
                    ? enterDir === "next"
                      ? "ts-exit-left"
                      : "ts-exit-right"
                    : enterDir === "next"
                      ? "ts-enter-right"
                      : "ts-enter-left"
                }`}
              >
                {/* Subtle watermark */}
                <span
                  aria-hidden
                  className="pointer-events-none absolute -bottom-10 -right-4 select-none text-[160px] font-black leading-none text-[#eaf8f4] dark:text-[#0b1b30]"
                >
                  BIO
                </span>

                {/* Top */}
                <div className="relative z-10">
                  <div className="flex items-center justify-between gap-4">
                    <span className="rounded-full border border-[#d7e3eb] bg-[#eaf8f4] px-3.5 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-[#0891b2] dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-[#22d3ee]">
                      {r.tag}
                    </span>
                    <span className="font-mono text-xs font-bold tracking-widest text-[#d7e3eb] dark:text-[#29435f]">
                      {String(active + 1).padStart(2, "0")}
                      <span className="mx-1.5 text-[#0891b2] dark:text-[#22d3ee]">
                        /
                      </span>
                      {String(reviews.length).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Big decorative quote */}
                  <span
                    aria-hidden
                    className="mt-5 block font-serif text-[6.5rem] font-black leading-none text-[#d7e3eb] dark:text-[#29435f] sm:text-[7.5rem]"
                  >
                    "
                  </span>

                  <blockquote className="-mt-3 text-xl font-bold leading-[1.42] tracking-tight text-[#0b1b30] dark:text-white sm:text-2xl lg:text-[1.65rem]">
                    {r.quote}
                  </blockquote>

                  <p className="mt-4 max-w-lg text-sm leading-relaxed text-[#64748b] dark:text-[#94a3b8]">
                    {r.detail}
                  </p>
                </div>

                {/* Footer */}
                <div className="relative z-10 mt-8 flex flex-wrap items-center justify-between gap-5 border-t border-[#d7e3eb] pt-6 dark:border-[#29435f]">
                  {/* Author */}
                  <div className="flex items-center gap-3.5">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#0b1b30] text-sm font-black text-[#22d3ee] shadow-sm dark:bg-[#22d3ee] dark:text-[#0b1b30]">
                      {r.initials}
                    </span>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <p className="font-bold text-[#0b1b30] dark:text-white">
                          {r.name}
                        </p>
                        <BadgeCheck
                          size={14}
                          className="text-[#0891b2] dark:text-[#22d3ee]"
                        />
                      </div>
                      <p className="mt-0.5 text-xs text-[#64748b] dark:text-[#94a3b8]">
                        {r.role}
                      </p>
                    </div>
                  </div>

                  {/* Nav arrows + dots */}
                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-1.5">
                      {reviews.map((_, i) => (
                        <button
                          key={i}
                          type="button"
                          aria-label={`Go to review ${i + 1}`}
                          onClick={() =>
                            navigate(i, i > active ? "next" : "prev")
                          }
                          className={`rounded-full transition-all duration-400 focus-visible:outline-none ${
                            i === active
                              ? "h-2 w-6 bg-[#0891b2] dark:bg-[#22d3ee]"
                              : "h-2 w-2 bg-[#d7e3eb] hover:bg-[#0891b2]/40 dark:bg-[#29435f] dark:hover:bg-[#22d3ee]/30"
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      type="button"
                      onClick={prev}
                      aria-label="Previous review"
                      className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d7e3eb] bg-white text-[#0b1b30] transition-all duration-200 hover:border-[#0891b2]/40 hover:bg-[#eaf8f4] hover:text-[#0891b2] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2] dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white dark:hover:border-[#22d3ee]/40 dark:hover:text-[#22d3ee]"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={next}
                      aria-label="Next review"
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-[#0891b2] text-white shadow-sm shadow-[#0891b2]/20 transition-all duration-200 hover:bg-[#0e7490] active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0891b2] dark:bg-[#22d3ee] dark:text-[#0b1b30] dark:hover:bg-[#67e8f9]"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* ── Bottom CTA strip ── */}
          <div className="mt-5 flex flex-col items-start justify-between gap-5 rounded-[22px] border border-[#d7e3eb] bg-white p-6 dark:border-[#29435f] dark:bg-[#132942] sm:flex-row sm:items-center sm:p-7">
            <div>
              <p className="text-base font-bold text-[#0b1b30] dark:text-white">
                Ready to create your own digital identity?
              </p>
              <p className="mt-1 text-sm text-[#64748b] dark:text-[#94a3b8]">
                One card. All your details. Free forever.
              </p>
            </div>
            <a
              href="/register"
              className="group inline-flex shrink-0 items-center gap-2 rounded-full bg-[#0891b2] px-7 py-3.5 text-sm font-bold text-white shadow-sm shadow-[#0891b2]/20 transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#0e7490] dark:bg-[#22d3ee] dark:text-[#0b1b30] dark:hover:bg-[#67e8f9]"
            >
              Create your card
              <ArrowUpRight
                size={15}
                className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
              />
            </a>
          </div>
        </div>
      </div>

      {/* ── Animation CSS ── */}
      <style>{`
        /* Marquee */
        @keyframes tsMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .ts-marquee {
          animation: tsMarquee 36s linear infinite;
          will-change: transform;
        }
        .ts-marquee:hover { animation-play-state: paused; }

        /* Slide enter */
        @keyframes tsEnterRight {
          from { opacity: 0; transform: translateX(30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes tsEnterLeft {
          from { opacity: 0; transform: translateX(-30px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        /* Slide exit */
        @keyframes tsExitLeft {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(-20px); }
        }
        @keyframes tsExitRight {
          from { opacity: 1; transform: translateX(0); }
          to   { opacity: 0; transform: translateX(20px); }
        }

        .ts-enter-right { animation: tsEnterRight 320ms cubic-bezier(0.22,1,0.36,1) both; }
        .ts-enter-left  { animation: tsEnterLeft  320ms cubic-bezier(0.22,1,0.36,1) both; }
        .ts-exit-left   { animation: tsExitLeft   220ms ease-in both; }
        .ts-exit-right  { animation: tsExitRight  220ms ease-in both; }

        @media (prefers-reduced-motion: reduce) {
          .ts-marquee,
          .ts-enter-right,
          .ts-enter-left,
          .ts-exit-left,
          .ts-exit-right {
            animation: none !important;
          }
        }
      `}</style>
    </section>
  );
}
