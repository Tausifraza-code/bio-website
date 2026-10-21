import { useState } from "react";
import {
  Phone,
  Mail,
  MapPin,
  Link2,
  ArrowUpRight,
  BadgeCheck,
  Check,
  Copy,
  Wifi,
  Layers,
  Eye,
  RotateCcw,
  SlidersHorizontal,
} from "lucide-react";

/* Custom Instagram Icon (Accurate brand SVG) */
function InstagramIcon({ size = 14 }) {
  return (
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
}

/* Custom LinkedIn Icon (Accurate brand SVG) */
function LinkedInIcon({ size = 14 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </svg>
  );
}

/* Custom WhatsApp Icon */
function WhatsAppIcon({ size = 14 }) {
  return (
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
}

const profiles = [
  {
    id: "ayesha",
    slotIndex: 0,
    name: "Ayesha Khan",
    role: "Lead Interior Designer",
    category: "Architecture & Decor",
    tagline: "Modern Minimalist Spaces",
    city: "Mumbai, India",
    email: "ayesha@designstudio.co",
    phone: "+91 98765 43210",
    handle: "bio.site/ayesha",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80",
    banner: "from-sky-400 via-cyan-500 to-blue-600",
    accent: "#0284c7",
    glowColor: "rgba(2, 132, 199, 0.45)",
    rotation: -11,
    offset: 44,
  },
  {
    id: "rohan",
    slotIndex: 1,
    name: "Rohan Mehta",
    role: "Growth Marketing Director",
    category: "Brand & Performance",
    tagline: "Scale B2B & D2C Brands",
    city: "Bengaluru, India",
    email: "rohan@brandcraft.co",
    phone: "+91 87654 32109",
    handle: "bio.site/rohan",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    banner: "from-emerald-400 via-teal-500 to-cyan-700",
    accent: "#0d9488",
    glowColor: "rgba(13, 148, 136, 0.45)",
    rotation: -5.5,
    offset: 16,
  },
  {
    id: "arjun",
    slotIndex: 2,
    name: "Arjun Verma",
    role: "Founder & CEO",
    category: "Venture & Tech",
    tagline: "Intelligent Connected Systems",
    city: "New Delhi, India",
    email: "arjun@nextgen.co",
    phone: "+91 76543 21098",
    handle: "bio.site/arjun",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=300&q=80",
    banner: "from-amber-400 via-yellow-500 to-emerald-600",
    accent: "#b45309",
    glowColor: "rgba(180, 83, 9, 0.45)",
    rotation: 0,
    offset: 0,
  },
  {
    id: "sneha",
    slotIndex: 3,
    name: "Dr. Sneha Kapoor",
    role: "Aesthetic Specialist",
    category: "Clinical Wellness",
    tagline: "Holistic Skin Health & Care",
    city: "Pune, India",
    email: "sneha@glowcare.co",
    phone: "+91 91234 56780",
    handle: "bio.site/sneha",
    image:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80",
    banner: "from-pink-400 via-rose-500 to-fuchsia-600",
    accent: "#e11d48",
    glowColor: "rgba(225, 29, 72, 0.45)",
    rotation: 5.5,
    offset: 16,
  },
  {
    id: "karan",
    slotIndex: 4,
    name: "Karan Malhotra",
    role: "E-Commerce Founder",
    category: "Retail & Supply Chain",
    tagline: "Modern Lifestyle Collective",
    city: "Jaipur, India",
    email: "karan@shopverse.co",
    phone: "+91 99887 66554",
    handle: "bio.site/karan",
    image:
      "https://images.unsplash.com/photo-1507591064344-4c6ce005b128?auto=format&fit=crop&w=300&q=80",
    banner: "from-orange-400 via-rose-500 to-red-600",
    accent: "#ea580c",
    glowColor: "rgba(234, 88, 12, 0.45)",
    rotation: 11,
    offset: 44,
  },
];

function ContactRow({ icon: Icon, children, accent, onCopy, copied }) {
  return (
    <div
      onClick={onCopy}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onCopy?.();
        }
      }}
      className="group/row flex min-w-0 items-center justify-between gap-2 rounded-lg px-2 py-1 transition-colors hover:bg-slate-100/90 dark:hover:bg-slate-800/80 cursor-pointer"
      title="Click to copy"
    >
      <div className="flex min-w-0 items-center gap-2.5">
        <span
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 group-hover/row:scale-110"
          style={{ backgroundColor: accent }}
        >
          <Icon size={12} />
        </span>
        <span className="min-w-0 truncate text-[11px] font-medium text-slate-700 sm:text-xs dark:text-slate-200">
          {children}
        </span>
      </div>

      <span className="shrink-0 opacity-0 transition-opacity duration-200 group-hover/row:opacity-100 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200">
        {copied ? (
          <Check size={12} className="text-emerald-500" />
        ) : (
          <Copy size={11} />
        )}
      </span>
    </div>
  );
}

function ProfileCard({
  profile,
  index,
  isHovered,
  isSelected,
  onSelect,
  copiedHandle,
  onCopyHandle,
}) {
  const isCenter = index === 2;

  return (
    <article
      onClick={(e) => {
        e.stopPropagation();
        onSelect(profile.id);
      }}
      className={[
        "bio-fan-card relative w-[190px] select-none text-left sm:w-[225px] lg:w-[255px]",
        "overflow-hidden rounded-[24px] border border-white/90 dark:border-slate-700/60",
        "bg-[#fffefb] dark:bg-[#112238]",
        "shadow-[0_16px_36px_-12px_rgba(11,27,48,0.18)] dark:shadow-[0_20px_45px_-12px_rgba(0,0,0,0.6)]",
        "cursor-pointer transition-[box-shadow,border-color,background-color] duration-500 ease-out",
        isSelected
          ? "ring-2 ring-cyan-500 shadow-[0_25px_50px_-12px_rgba(6,182,212,0.4)]"
          : isHovered
            ? "ring-1 ring-cyan-400/50"
            : "",
      ].join(" ")}
      style={{
        boxShadow: isHovered
          ? `0 28px 60px -15px ${profile.glowColor}, 0 12px 24px -10px rgba(0,0,0,0.15)`
          : undefined,
      }}
    >
      {/* Top Banner with ambient gradient, NFC tag & Category */}
      <div
        className={`relative h-[88px] bg-gradient-to-br ${profile.banner} sm:h-[102px] lg:h-[114px] overflow-hidden p-3 flex flex-col justify-between`}
      >
        <div className="pointer-events-none absolute -right-6 -top-6 h-28 w-28 rounded-full border border-white/25" />
        <div className="pointer-events-none absolute right-6 top-6 h-12 w-12 rounded-full border border-white/20" />
        <div className="pointer-events-none absolute -left-6 bottom-0 h-16 w-16 rounded-full bg-white/10 blur-xl" />

        <div className="relative z-10 flex items-center justify-between">
          <span className="inline-flex items-center gap-1 rounded-full bg-black/25 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-white backdrop-blur-md">
            <Wifi size={10} className="rotate-90 text-cyan-300" />
            NFC
          </span>

          <span className="rounded-full bg-white/25 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white backdrop-blur-md">
            {profile.category}
          </span>
        </div>

        <div className="relative z-10 self-end">
          <span className="text-[11px] font-black tracking-widest text-[#0b1b30]/80">
            BIO•ID
          </span>
        </div>
      </div>

      {/* Profile Body */}
      <div className="relative px-3.5 pb-4 pt-0 sm:px-4 sm:pb-5">
        <div className="-mt-7 flex items-end justify-between gap-2">
          <div className="relative">
            <img
              src={profile.image}
              alt={profile.name}
              loading="lazy"
              className="h-[58px] w-[58px] rounded-full border-[3px] border-[#fffefb] dark:border-[#112238] object-cover shadow-md sm:h-[66px] sm:w-[66px]"
            />
            <span
              className="absolute bottom-0 right-0 h-4 w-4 rounded-full border-2 border-white dark:border-[#112238] flex items-center justify-center text-white"
              style={{ backgroundColor: profile.accent }}
              title="Verified Identity"
            >
              <BadgeCheck size={10} />
            </span>
          </div>

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onCopyHandle(profile.handle);
            }}
            className="group/btn mb-1 flex h-7 w-7 items-center justify-center rounded-full text-white shadow-sm transition-transform duration-300 hover:scale-110 active:scale-95 sm:h-8 sm:w-8"
            style={{ backgroundColor: profile.accent }}
            title="Share & Copy Profile Link"
          >
            {copiedHandle === profile.handle ? (
              <Check size={13} className="stroke-[3]" />
            ) : (
              <ArrowUpRight
                size={15}
                className="transition-transform duration-300 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
              />
            )}
          </button>
        </div>

        <div className="mt-2.5">
          <div className="flex items-center gap-1.5">
            <h3 className="truncate text-sm font-extrabold tracking-tight text-[#0b1b30] dark:text-white sm:text-base">
              {profile.name}
            </h3>
            <BadgeCheck
              size={14}
              className="shrink-0 text-cyan-600 dark:text-cyan-400"
            />
          </div>
          <p className="truncate text-[11px] font-medium text-slate-500 dark:text-slate-400 sm:text-xs">
            {profile.role}
          </p>
        </div>

        <div className="mt-1.5 rounded-md bg-slate-100/90 px-2 py-0.5 text-[10px] font-medium text-slate-600 dark:bg-slate-800/80 dark:text-slate-300 truncate">
          {profile.tagline}
        </div>

        <div className="my-2 h-px bg-slate-200/80 dark:bg-slate-700/60" />

        <div className="space-y-0.5">
          <ContactRow
            icon={Phone}
            accent={profile.accent}
            copied={copiedHandle === profile.phone}
            onCopy={() => onCopyHandle(profile.phone)}
          >
            {profile.phone}
          </ContactRow>
          <ContactRow
            icon={Mail}
            accent={profile.accent}
            copied={copiedHandle === profile.email}
            onCopy={() => onCopyHandle(profile.email)}
          >
            {profile.email}
          </ContactRow>
          <ContactRow
            icon={MapPin}
            accent={profile.accent}
            copied={copiedHandle === profile.city}
            onCopy={() => onCopyHandle(profile.city)}
          >
            {profile.city}
          </ContactRow>
          <ContactRow
            icon={Link2}
            accent={profile.accent}
            copied={copiedHandle === profile.handle}
            onCopy={() => onCopyHandle(profile.handle)}
          >
            {profile.handle}
          </ContactRow>
        </div>

        <div className="mt-2.5 flex items-center justify-between pt-1">
          <div className="flex items-center gap-1.5">
            {[
              { Icon: InstagramIcon, label: "Instagram" },
              { Icon: LinkedInIcon, label: "LinkedIn" },
              { Icon: WhatsAppIcon, label: "WhatsApp" },
            ].map(({ Icon, label }, i) => (
              <span
                key={i}
                title={label}
                className="flex h-6 w-6 items-center justify-center rounded-full transition-transform duration-200 hover:scale-110 sm:h-7 sm:w-7"
                style={{
                  backgroundColor: `${profile.accent}18`,
                  color: profile.accent,
                }}
              >
                <Icon size={12} />
              </span>
            ))}
          </div>

          <span className="text-[9px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            {isCenter ? "Primary" : "Active"}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function BioFanCards() {
  const [hoveredCardId, setHoveredCardId] = useState(null);
  const [selectedCardId, setSelectedCardId] = useState("arjun");
  const [isDeckHovered, setIsDeckHovered] = useState(false);
  const [forceSpread, setForceSpread] = useState(false);
  const [copiedHandle, setCopiedHandle] = useState(null);

  const handleCopy = (text) => {
    try {
      navigator.clipboard?.writeText(text);
      setCopiedHandle(text);
      setTimeout(() => setCopiedHandle(null), 2200);
    } catch {
      setCopiedHandle(text);
      setTimeout(() => setCopiedHandle(null), 2200);
    }
  };

  const isExpanded = forceSpread || isDeckHovered || Boolean(hoveredCardId);

  return (
    <section className="relative overflow-hidden bg-[radial-gradient(ellipse_at_top,_#e0f7f3_0%,_#ebf8f5_50%,_#f8fcfa_100%)] px-4 py-16 text-[#0b1b30] transition-colors duration-500 dark:bg-[radial-gradient(ellipse_at_top,_#102844_0%,_#0b1b30_60%,_#071220_100%)] dark:text-white sm:px-6 sm:py-6 lg:py-6">
      {/* Ambient background glow & atmospheric mesh */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 h-[350px] w-[600px] rounded-full bg-cyan-400/15 blur-[100px] dark:bg-cyan-500/10" />
        <div className="absolute right-10 top-1/3 h-[250px] w-[250px] rounded-full bg-teal-400/15 blur-[90px] dark:bg-teal-500/10" />
        <div className="absolute left-10 bottom-10 h-[220px] w-[220px] rounded-full bg-blue-400/10 blur-[80px] dark:bg-blue-600/10" />
      </div>

      <div className="relative mx-auto max-w-7xl">
        {/* Section heading */}
        <div className="mx-auto max-w-4xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-cyan-600/25 bg-white/80 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.18em] text-cyan-700 shadow-sm backdrop-blur-md dark:border-cyan-400/25 dark:bg-[#132942]/80 dark:text-cyan-300">
            <Layers size={14} className="text-cyan-500" />
            <span>Digital Identity Suite</span>
            <span className="h-1.5 w-1.5 rounded-full bg-cyan-500 animate-pulse" />
          </div>

          <h2 className="mt-5 text-3xl font-black leading-tight tracking-tight sm:text-5xl lg:text-6xl">
            Every connection starts{" "}
            <span className="block text-cyan-600 dark:text-cyan-300">
              with your signature identity.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-sm leading-relaxed text-slate-600 dark:text-slate-300 sm:text-base sm:leading-8">
            Present your verified credentials, one-tap contact details, and
            curated links in a dynamic card built for modern professionals.
          </p>

          {/* Quick profile switch tabs & spread toggle */}
          <div className="mt-7 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Eye size={12} /> Inspect:
            </span>
            {profiles.map((p) => {
              const active = selectedCardId === p.id;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedCardId(p.id);
                    setHoveredCardId(p.id);
                  }}
                  className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition-all duration-300 ${
                    active
                      ? "bg-cyan-600 text-white shadow-md shadow-cyan-600/30 scale-105"
                      : "bg-white/70 text-slate-700 hover:bg-white hover:text-cyan-600 dark:bg-[#132942]/70 dark:text-slate-300 dark:hover:bg-[#183454] dark:hover:text-cyan-300 border border-slate-200/60 dark:border-slate-700/60"
                  }`}
                >
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: p.accent }}
                  />
                  {p.name.split(" ")[0]}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setForceSpread((prev) => !prev)}
              className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-semibold border transition-all duration-300 ${
                forceSpread
                  ? "bg-teal-600 text-white border-teal-600 shadow-sm"
                  : "bg-white/70 text-slate-600 border-slate-200/60 dark:bg-[#132942]/70 dark:text-slate-300 dark:border-slate-700/60 hover:text-cyan-600 dark:hover:text-cyan-300"
              }`}
              title="Toggle spread layout"
            >
              <SlidersHorizontal size={11} />
              {forceSpread ? "Spread: On" : "Spread"}
            </button>

            <button
              type="button"
              onClick={() => {
                setSelectedCardId("arjun");
                setHoveredCardId(null);
                setForceSpread(false);
              }}
              className="inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white transition-colors"
              title="Reset view"
            >
              <RotateCcw size={11} />
              Reset
            </button>
          </div>
        </div>

        {/* Fan Cards Stage */}
        <div
          className={`bio-fan-stage relative mx-auto mt-12 h-[450px] max-w-[1140px] sm:mt-16 sm:h-[490px] lg:mt-20 lg:h-[530px] ${
            isExpanded ? "bio-fan-expanded" : "bio-fan-collapsed"
          }`}
          onMouseEnter={() => setIsDeckHovered(true)}
          onMouseLeave={() => {
            setIsDeckHovered(false);
            setHoveredCardId(null);
          }}
        >
          {profiles.map((profile, index) => {
            const isHovered = hoveredCardId === profile.id;
            const isSelected = selectedCardId === profile.id;
            const isAnyHovered = Boolean(hoveredCardId);

            const slotMultiplier = index - 2;

            const currentRotation =
              isHovered || (isSelected && isExpanded)
                ? 0
                : isExpanded
                  ? profile.rotation * 0.7
                  : profile.rotation;

            const elevationY = isHovered
              ? -26
              : isSelected
                ? -14
                : isExpanded
                  ? index === 2
                    ? -8
                    : profile.offset * 0.35
                  : profile.offset;

            let zIndex = 20 - Math.abs(2 - index);
            if (index === 2) zIndex = 30;
            if (isSelected) zIndex = 42;
            if (isHovered) zIndex = 50;

            const scale = isHovered ? 1.06 : isSelected ? 1.03 : 1;
            const opacity =
              isAnyHovered && !isHovered && !isSelected ? 0.78 : 1;

            return (
              <div
                key={profile.id}
                onMouseEnter={() => setHoveredCardId(profile.id)}
                onMouseLeave={() => {
                  if (hoveredCardId === profile.id) setHoveredCardId(null);
                }}
                className={`bio-card-wrapper bio-card-slot-${index} absolute left-1/2 top-4 origin-bottom transition-all duration-700 ease-[cubic-bezier(0.2,0.85,0.25,1)]`}
                style={{
                  zIndex,
                  "--slot-mult": slotMultiplier,
                  transform: `translateX(calc(-50% + var(--card-x, 0px))) translateY(${elevationY}px) rotate(${currentRotation}deg) scale(${scale})`,
                  opacity,
                }}
              >
                <ProfileCard
                  profile={profile}
                  index={index}
                  isHovered={isHovered}
                  isSelected={isSelected}
                  onSelect={(id) => {
                    setSelectedCardId(id);
                    setHoveredCardId(id);
                  }}
                  copiedHandle={copiedHandle}
                  onCopyHandle={handleCopy}
                />
              </div>
            );
          })}
        </div>

        {/* Interactive feedback & helper */}
        <div className="relative mt-3 flex flex-col items-center justify-center gap-1.5 text-center">
          {copiedHandle ? (
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/15 border border-emerald-500/30 px-3.5 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-300 animate-bounce">
              <Check size={13} className="stroke-[3]" />
              Copied "{copiedHandle}" to clipboard!
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs font-medium text-slate-500 dark:text-slate-400">
              <span className="flex h-2 w-2 rounded-full bg-cyan-500 animate-ping" />
              <span>
                Hover or tap cards to inspect details and copy credentials
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Responsive Spread Geometry in Pure CSS Variables */}
      <style>{`
        .bio-fan-stage.bio-fan-collapsed {
          --card-step: 56px;
        }
        .bio-fan-stage.bio-fan-expanded {
          --card-step: 195px;
        }

        .bio-card-wrapper {
          --card-x: calc(var(--slot-mult) * var(--card-step));
        }

        @media (max-width: 1200px) {
          .bio-fan-stage.bio-fan-collapsed {
            --card-step: 46px;
          }
          .bio-fan-stage.bio-fan-expanded {
            --card-step: 155px;
          }
        }

        @media (max-width: 900px) {
          .bio-fan-stage.bio-fan-collapsed {
            --card-step: 36px;
          }
          .bio-fan-stage.bio-fan-expanded {
            --card-step: 110px;
          }
        }

        @media (max-width: 640px) {
          .bio-fan-card {
            width: 175px !important;
          }
          .bio-fan-stage.bio-fan-collapsed {
            --card-step: 24px;
          }
          .bio-fan-stage.bio-fan-expanded {
            --card-step: 64px;
          }
        }

        @media (max-width: 440px) {
          .bio-fan-card {
            width: 158px !important;
          }
          .bio-fan-stage.bio-fan-collapsed {
            --card-step: 18px;
          }
          .bio-fan-stage.bio-fan-expanded {
            --card-step: 48px;
          }
        }
      `}</style>
    </section>
  );
}
