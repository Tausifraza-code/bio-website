import React, { useEffect, useState } from "react";
import {
  Palette,
  Check,
  Crown,
  Leaf,
  Gem,
  Moon,
  Sun,
  ExternalLink,
  CircleDot,
  Lightbulb,
  CheckCircle2,
} from "lucide-react";

/* ==================== THEMES DATA ==================== */
const THEMES = [
  {
    id: "executive",
    name: "Executive Royal",
    category: "Corporate & Tech",
    description:
      "Prestigious sapphire and royal indigo frosted glass for corporate websites and technology businesses.",
    colors: ["#1e3a8a", "#7c3aed"],
    icon: Crown,
    aesthetic:
      "Corporate sapphire and royal indigo with a polished frosted-glass appearance.",
    ambient:
      "Multi-layer background lighting with soft blue and indigo ambience.",
    lightColors: ["#1e3a8a", "#7c3aed"],
  },
  {
    id: "emerald",
    name: "Emerald Luxe",
    category: "Medical & Property",
    description:
      "Deep imperial emerald and luminous jade for healthcare, clinics, and property businesses.",
    colors: ["#10b981", "#14b8a6"],
    icon: Leaf,
    aesthetic:
      "Deep imperial emerald and luminous jade for a fresh, premium appearance.",
    ambient:
      "Multi-layer background lighting with soft emerald and teal ambience.",
    lightColors: ["#10b981", "#14b8a6"],
  },
  {
    id: "rose",
    name: "Rose Gold & Champagne",
    category: "Fashion & Salon",
    description:
      "Blush champagne and rose gold for boutiques, salons, fashion, and beauty brands.",
    colors: ["#f43f5e", "#fb923c"],
    icon: Gem,
    aesthetic:
      "Shimmering blush champagne and rose gold with a refined fashion aesthetic.",
    ambient:
      "Multi-layer background lighting with soft rose and champagne ambience.",
    lightColors: ["#f43f5e", "#fb923c"],
  },
  {
    id: "obsidian",
    name: "Obsidian Noir & Platinum",
    category: "Barber & Executive",
    description:
      "Smoked glass, titanium graphite, and platinum accents for premium brands.",
    colors: ["#334155", "#94a3b8"],
    icon: Moon,
    aesthetic:
      "Smoked glass, titanium graphite, and platinum for an understated premium look.",
    ambient:
      "Multi-layer background lighting with monochrome platinum highlights.",
    lightColors: ["#334155", "#94a3b8"],
  },
  {
    id: "sunset",
    name: "Sunset Amber & Coral",
    category: "Creative & Cafe",
    description:
      "Radiant golden amber and warm coral for cafes, creatives, and restaurants.",
    colors: ["#f59e0b", "#f97316"],
    icon: Sun,
    aesthetic:
      "Golden amber and warm coral for a lively, creative business identity.",
    ambient:
      "Multi-layer background lighting with warm amber and coral accents.",
    lightColors: ["#f59e0b", "#f97316"],
  },
];

const STORAGE_KEY = "bio-active-theme";

const getInitialTheme = () => {
  try {
    const savedTheme = localStorage.getItem(STORAGE_KEY);

    if (savedTheme) {
      // Support the theme names used by the existing dashboard.
      const themeAliases = {
        "Executive Royal": "executive",
        "Emerald Luxe": "emerald",
        "Rose Gold & Champagne": "rose",
        "Obsidian Noir & Platinum": "obsidian",
        "Sunset Amber & Coral": "sunset",
      };

      const normalizedTheme = themeAliases[savedTheme] || savedTheme;

      if (THEMES.some((theme) => theme.id === normalizedTheme)) {
        return normalizedTheme;
      }
    }
  } catch {
    // Fall back to the default theme if storage is unavailable.
  }

  return "sunset";
};

const WebsiteThemes = () => {
  const [activeTheme, setActiveTheme] = useState(getInitialTheme);

  const activeThemeData = THEMES.find(
    (theme) => theme.id === activeTheme
  );

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, activeTheme);
    } catch {
      // Theme selection still works for the current session.
    }
  }, [activeTheme]);

  const handleSelectTheme = (themeId) => {
    setActiveTheme(themeId);
  };

  const handleViewLive = () => {
    window.open("/card", "_blank", "noopener,noreferrer");
  };

  return (
    // Background wrapper completely transparent, removed blur/grid effects
    <div className="relative min-h-screen bg-transparent font-sans text-slate-200">
      <main className="relative mx-auto max-w-7xl px-1 py-8 sm:px-6 lg:px-8">
        
        {/* PAGE HEADER */}
        <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#0b1b30] text-cyan-400 shadow-lg shadow-black/20">
              <Palette size={22} />
            </div>

            <div>
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Website Themes
                </h1>

                <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  {THEMES.length} Themes
                </span>
              </div>

              <p className="max-w-2xl text-sm leading-relaxed text-slate-400">
                Customize your mini website with a professional theme.
                Choose a design to personalize your public business card.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleViewLive}
            className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#0b1b30] px-5 py-3 text-sm font-bold text-slate-200 transition hover:border-cyan-400/50 hover:bg-[#132942] hover:text-cyan-400 active:scale-[0.98]"
          >
            <ExternalLink
              size={17}
              className="transition-transform group-hover:translate-x-0.5"
            />
            View Live Preview
          </button>
        </div>

        {/* CURRENT THEME BANNER */}
        <section className="relative mb-8 overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 sm:p-6">
          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                  Currently Selected
                </p>
                <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                  {activeThemeData?.name}
                </h2>
                <p className="mt-1 text-sm text-cyan-400/80">
                  {activeThemeData?.category}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3">
              <span className="text-xs font-medium text-slate-400">
                Theme palette
              </span>

              <div className="flex -space-x-1">
                {activeThemeData?.colors.map((color, index) => (
                  <span
                    key={index}
                    className="h-7 w-7 rounded-full border-2 border-[#132942] shadow-sm"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <CheckCircle2 size={17} className="text-cyan-400" />
            </div>
          </div>
        </section>

        {/* THEME CARDS */}
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-white">Explore Themes</h2>
            <p className="mt-1 text-sm text-slate-400">
              Select a theme that suits your business.
            </p>
          </div>

          <span className="hidden rounded-lg border border-[#29435f] bg-[#132942] px-3 py-1.5 text-xs font-semibold text-slate-400 sm:inline-flex">
            {THEMES.length} available
          </span>
        </div>

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
          {THEMES.map((theme) => {
            const isActive = activeTheme === theme.id;
            const Icon = theme.icon;

            return (
              <article
                key={theme.id}
                className={`group relative flex flex-col overflow-hidden rounded-2xl border bg-[#0b1b30] transition duration-300 ${
                  isActive
                    ? "border-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.1)] ring-1 ring-cyan-400/20"
                    : "border-[#29435f] hover:-translate-y-1 hover:border-[#38516e] hover:shadow-xl hover:shadow-black/20"
                }`}
              >
                {/* Theme color preview */}
                <div className="relative h-28 overflow-hidden bg-[#132942]">
                  <div
                    className="absolute inset-0 opacity-20 transition duration-500 group-hover:opacity-40"
                    style={{
                      background: `linear-gradient(115deg, ${theme.colors[0]}, ${theme.colors[1]})`,
                    }}
                  />

                  <div className="absolute left-4 top-4 flex items-center gap-2">
                    <div className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-[#0b1b30]/80 text-white backdrop-blur-md">
                      <Icon size={18} />
                    </div>

                    <span className="rounded-full border border-white/10 bg-[#0b1b30]/80 px-2.5 py-1 text-[10px] font-semibold text-slate-200 backdrop-blur-md">
                      {theme.category}
                    </span>
                  </div>

                  {isActive && (
                    <span className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full border border-cyan-400/30 bg-cyan-400/20 px-2.5 py-1.5 text-[10px] font-bold text-cyan-400 backdrop-blur-md">
                      <Check size={12} strokeWidth={3} />
                      SELECTED
                    </span>
                  )}

                  <div className="absolute bottom-3 left-4 right-4 flex items-center gap-2">
                    <span
                      className="h-1.5 flex-1 rounded-full opacity-80"
                      style={{ backgroundColor: theme.colors[0] }}
                    />
                    <span
                      className="h-1.5 flex-1 rounded-full opacity-80"
                      style={{ backgroundColor: theme.colors[1] }}
                    />
                  </div>
                </div>

                <div className="flex flex-1 flex-col p-5">
                  <h3 className="text-base font-bold tracking-tight text-white">
                    {theme.name}
                  </h3>

                  <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-400">
                    {theme.description}
                  </p>

                  <div className="mt-5 flex items-center justify-between gap-3 border-t border-[#29435f] pt-4">
                    <div>
                      <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                        Color palette
                      </p>

                      <div className="flex items-center gap-2">
                        {theme.colors.map((color, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-1.5"
                          >
                            <span
                              className="h-4 w-4 rounded-full border border-white/10 shadow-sm"
                              style={{ backgroundColor: color }}
                            />
                            <span className="text-[10px] font-medium text-slate-400">
                              {color}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleSelectTheme(theme.id)}
                    disabled={isActive}
                    aria-pressed={isActive}
                    className={`mt-5 flex w-full items-center justify-center gap-2 rounded-xl border px-4 py-3 text-sm font-bold transition active:scale-[0.98] ${
                      isActive
                        ? "cursor-default border-cyan-400 bg-cyan-400 text-[#0b1b30] shadow-lg shadow-cyan-400/20"
                        : "border-[#38516e] bg-[#132942] text-slate-300 hover:border-cyan-400/50 hover:bg-cyan-400/10 hover:text-cyan-400"
                    }`}
                  >
                    {isActive ? (
                      <>
                        <CheckCircle2 size={16} />
                        Applied Theme
                      </>
                    ) : (
                      <>
                        <Palette size={16} />
                        Select Theme
                      </>
                    )}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        {/* ACTIVE THEME DETAILS */}
        <section className="relative mt-8 overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 sm:p-6">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

          <div className="mb-5 flex items-center">
            <div>
              <h2 className="text-lg font-bold text-white">Active Theme Details</h2>
              <p className="mt-1 text-sm text-slate-400">
                Information about your currently selected design.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            {/* Active Aesthetic */}
            <div className="rounded-xl border border-[#29435f] bg-[#132942] p-4 transition hover:border-cyan-400/30">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <CircleDot size={16} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Active Aesthetic
                </p>
              </div>

              <p className="text-sm font-bold text-white">
                {activeThemeData?.name}
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                {activeThemeData?.aesthetic}
              </p>
            </div>

            {/* Ambient Light */}
            <div className="rounded-xl border border-[#29435f] bg-[#132942] p-4 transition hover:border-cyan-400/30">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <Lightbulb size={16} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Ambient Light
                </p>
              </div>

              <div className="mb-3 flex items-center gap-2">
                {activeThemeData?.lightColors.map((color, index) => (
                  <span
                    key={index}
                    className="h-7 w-7 rounded-full border-2 border-[#132942] shadow-lg"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>

              <p className="text-sm leading-relaxed text-slate-400">
                {activeThemeData?.ambient}
              </p>
            </div>

            {/* Sync Status */}
            <div className="rounded-xl border border-[#29435f] bg-[#132942] p-4 transition hover:border-cyan-400/30">
              <div className="mb-3 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-400/10 text-cyan-400">
                  <CheckCircle2 size={16} />
                </div>
                <p className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Local Selection
                </p>
              </div>

              <p className="flex items-center gap-2 text-sm font-bold text-cyan-400">
                <Check size={15} strokeWidth={3} />
                Theme selection saved
              </p>

              <p className="mt-2 text-sm leading-relaxed text-slate-400">
                Your selection is stored in this browser. Make sure your
                public card reads the same theme setting to apply it to
                visitors.
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default WebsiteThemes;