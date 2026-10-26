import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../redux/api";
import {
  ArrowUpRight,
  Award,
  CheckCircle2,
  ChevronRight,
  Copy,
  Globe,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  QrCode,
  Send,
  Share2,
  ShieldCheck,
  ShoppingBag,
  Star,
} from "lucide-react";

const themes = {
  executive: {
    primary: "#1e3a8a",
    accent: "#7c3aed",
    background: "#0c1630",
    surface: "#152447",
    card: "#101c38",
    text: "#f8fafc",
    muted: "#a5b4cf",
    border: "#33466c",
  },
  emerald: {
    primary: "#10b981",
    accent: "#14b8a6",
    background: "#062c25",
    surface: "#104438",
    card: "#0c382f",
    text: "#ecfdf5",
    muted: "#a7cfc3",
    border: "#216653",
  },
  rose: {
    primary: "#f43f5e",
    accent: "#fb923c",
    background: "#321722",
    surface: "#49202f",
    card: "#24151d",
    text: "#fff1f2",
    muted: "#e7bdc8",
    border: "#71404e",
  },
  obsidian: {
    primary: "#94a3b8",
    accent: "#64748b",
    background: "#09090b",
    surface: "#18181b",
    card: "#111114",
    text: "#f4f4f5",
    muted: "#a1a1aa",
    border: "#3f3f46",
  },
  sunset: {
    primary: "#f59e0b",
    accent: "#f97316",
    background: "#24130b",
    surface: "#3b2113",
    card: "#191513",
    text: "#fff7ed",
    muted: "#d6bba4",
    border: "#65452f",
  },
};

const defaultBanner =
  "https://images.unsplash.com/photo-1497366216548-37526070297c?w=1600";

function CardPreview() {
  const { subdomain } = useParams();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileError, setProfileError] = useState("");

  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({
    name: "",
    phone: "",
    email: "",
    message: "",
  });

  useEffect(() => {
    let cancelled = false;

    const fetchPublicProfile = async () => {
      setLoading(true);
      setProfileError("");
      setProfile(null);

      try {
        if (!subdomain) {
          throw new Error("Business profile URL is missing.");
        }

        const response = await api.get(
          `/profile/public/${encodeURIComponent(subdomain)}`,
        );
        const publicProfile = response.data?.profile;

        if (!response.data?.success || !publicProfile) {
          throw new Error("Business profile was not found.");
        }

        if (!cancelled) {
          setProfile(publicProfile);
        }
      } catch (error) {
        if (!cancelled) {
          setProfileError(
            error.response?.data?.message ||
              error.message ||
              "Unable to load this business profile.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    fetchPublicProfile();

    return () => {
      cancelled = true;
    };
  }, [subdomain]);

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 p-6 text-white">
        Loading business profile...
      </main>
    );
  }

  if (profileError || !profile) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center gap-3 bg-slate-950 p-6 text-center text-white">
        <h1 className="text-2xl font-bold">Profile unavailable</h1>
        <p>{profileError || "This business profile could not be found."}</p>
        <Link to="/" className="underline">
          Go to Home
        </Link>
      </main>
    );
  }

  const theme = themes[profile?.activeTheme] || themes.sunset;

  const fullName =
    [profile?.firstName, profile?.lastName].filter(Boolean).join(" ") ||
    "Your Name";

  const businessName = profile?.businessName || "My Business";
  const role =
    profile?.jobTitle || profile?.role || "Business Owner / Professional";

  const location =
    [
      profile?.shopUnit,
      profile?.area,
      profile?.city,
      profile?.state,
      profile?.pincode,
    ]
      .filter(Boolean)
      .join(", ") || "India";

  const phone = profile?.phone || "";
  const whatsapp = profile?.whatsapp || phone;
  const email = profile?.email || "";
  const website = profile?.website || profile?.websiteUrl || "";
  const about =
    profile?.bio ||
    profile?.headline ||
    `Welcome to ${businessName}! Contact us for business inquiries.`;

  const banner = profile?.banner || defaultBanner;
  const avatar = profile?.avatar || "";
  const qrCode = profile?.qrCode || "";
  const logo = profile?.logo || "";

  const openWhatsApp = () => {
    const number = whatsapp.replace(/\D/g, "");
    if (!number) {
      alert("WhatsApp number has not been added to this profile.");
      return;
    }

    window.open(
      `https://wa.me/${number}?text=${encodeURIComponent(
        `Hi, I'm interested in ${businessName}.`,
      )}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      alert("Unable to copy the link. Please copy it from the address bar.");
    }
  };

  const shareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: businessName,
          text: `Check out ${businessName}`,
          url: window.location.href,
        });
      } catch {
        // The user may close the share dialog.
      }
    } else {
      copyLink();
    }
  };

  const submitInquiry = (event) => {
    event.preventDefault();
    alert(
      "The inquiry form UI is ready, but message delivery needs backend integration.",
    );
  };

  const sectionStyle = {
    borderTop: `1px solid ${theme.border}`,
  };

  const cardStyle = {
    background: theme.card,
    border: `1px solid ${theme.border}`,
  };

  const softStyle = {
    background: theme.surface,
    border: `1px solid ${theme.border}`,
  };

  const accentButtonStyle = {
    background: `linear-gradient(100deg, ${theme.primary}, ${theme.accent})`,
    color: "#ffffff",
  };

  const contactItems = [
    {
      label: "Call Business",
      value: phone,
      icon: Phone,
      href: phone ? `tel:${phone.replace(/\s/g, "")}` : "",
    },
    {
      label: "Email Business",
      value: email,
      icon: Mail,
      href: email ? `mailto:${email}` : "",
    },
    {
      label: "Business Website",
      value: website,
      icon: Globe,
      href: website
        ? /^https?:\/\//i.test(website)
          ? website
          : `https://${website}`
        : "",
    },
    {
      label: "Business Address",
      value: location,
      icon: MapPin,
      href: profile?.mapLink || "",
    },
  ];

  return (
    <main
      className="min-h-screen px-3 py-4 sm:px-5 sm:py-6"
      style={{
        background: theme.background,
        color: theme.text,
      }}
    >
      <div className="mx-auto w-full max-w-[1120px]">
        <div
          className="mb-3 flex flex-wrap items-center justify-between gap-3 rounded-2xl px-4 py-3"
          style={softStyle}
        >
          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 text-sm font-semibold transition hover:opacity-75"
            style={{ color: theme.text }}
          >
            <ChevronRight className="rotate-180" size={18} />
            Back to Dashboard
          </Link>

          <button
            type="button"
            onClick={copyLink}
            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold"
            style={accentButtonStyle}
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Card Link"}
          </button>
        </div>

        {/* BUSINESS CARD */}
        <article
          className="overflow-hidden rounded-[24px] border shadow-2xl sm:rounded-[30px]"
          style={{
            background: theme.background,
            borderColor: theme.border,
          }}
        >
          {/* BUSINESS BANNER */}
          <header className="relative">
            <div className="relative h-[220px] w-full overflow-hidden sm:h-[280px] lg:h-[320px]">
              <img
                src={banner}
                alt={`${businessName} banner`}
                className="absolute inset-0 h-full w-full object-cover object-center"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-black/10" />

              <div className="absolute left-5 top-5 sm:left-8 sm:top-8">
                <span
                  className="inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-extrabold uppercase tracking-wider sm:text-sm"
                  style={{
                    background: "rgba(10,10,10,0.65)",
                    color: "#ffffff",
                    borderColor: theme.primary,
                  }}
                >
                  <Star size={15} style={{ color: theme.primary }} />
                  Featured Business
                </span>
              </div>

              <div className="absolute inset-x-5 bottom-6 sm:inset-x-8 sm:bottom-8">
                <p
                  className="mb-2 text-xs font-bold uppercase tracking-[0.2em] sm:text-sm"
                  style={{ color: theme.primary }}
                >
                  Discover
                </p>

                <h1 className="max-w-3xl text-3xl font-black leading-tight text-white sm:text-4xl lg:text-5xl">
                  {businessName}
                </h1>

                {profile?.headline && (
                  <p className="mt-2 max-w-2xl text-sm text-white/85 sm:text-base">
                    {profile.headline}
                  </p>
                )}
              </div>
            </div>
          </header>

          {/* PROFILE IDENTITY */}
          <section className="px-5 pb-7 sm:px-8 lg:px-10" style={sectionStyle}>
            <div className="-mt-10 flex flex-wrap items-end justify-between gap-3 sm:-mt-12">
              <div
                className="relative z-10 flex h-20 w-20 shrink-0 items-center justify-center overflow-hidden rounded-2xl border-4 shadow-xl sm:h-24 sm:w-24"
                style={{
                  background: theme.surface,
                  borderColor: theme.background,
                }}
              >
                {avatar ? (
                  <img
                    src={avatar}
                    alt={fullName}
                    className="h-full w-full object-cover object-center"
                  />
                ) : logo ? (
                  <img
                    src={logo}
                    alt={businessName}
                    className="h-full w-full object-contain p-2"
                  />
                ) : (
                  <span className="text-4xl font-black">
                    {businessName.charAt(0).toUpperCase()}
                  </span>
                )}
              </div>

              <span
                className="mb-1 inline-flex items-center gap-2 rounded-full border px-4 py-2 mt-1 sm:mt-1 text-xs font-extrabold uppercase sm:text-sm"
                style={{
                  borderColor: theme.primary,
                  color: theme.primary,
                  background: theme.surface,
                }}
              >
                <ShieldCheck size={17} />
                Verified Profile
              </span>
            </div>

            <div className="mt-5">
              <h2 className="flex flex-wrap items-center gap-2 text-2xl font-black tracking-tight sm:text-3xl">
                {fullName}
                <ShieldCheck size={24} style={{ color: theme.primary }} />
              </h2>

              <p
                className="mt-1.5 text-sm font-semibold sm:text-base"
                style={{ color: theme.muted }}
              >
                {role}
              </p>

              <p
                className="mt-2 flex items-center gap-2 text-sm"
                style={{ color: theme.muted }}
              >
                <MapPin size={18} style={{ color: theme.primary }} />
                {location}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span
                  className="rounded-lg border px-3 py-2 text-xs font-bold uppercase"
                  style={{
                    borderColor: theme.border,
                    background: theme.surface,
                    color: theme.text,
                  }}
                >
                  <span style={{ color: theme.primary }}>● </span>
                  Profile Actively Monitored
                </span>

                {profile?.industry && (
                  <span
                    className="rounded-lg border px-3 py-2 text-xs font-semibold"
                    style={{
                      borderColor: theme.border,
                      background: theme.surface,
                      color: theme.muted,
                    }}
                  >
                    {profile.industry}
                  </span>
                )}
              </div>
            </div>

            {/* QUICK ACTIONS */}
            <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
              <button
                type="button"
                onClick={openWhatsApp}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold transition hover:brightness-110"
                style={softStyle}
              >
                <MessageCircle size={23} style={{ color: theme.primary }} />
                <span className="text-sm">WhatsApp</span>
              </button>

              <a
                href={phone ? `tel:${phone.replace(/\s/g, "")}` : undefined}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold transition hover:brightness-110"
                style={softStyle}
              >
                <Phone size={23} style={{ color: theme.primary }} />
                <span className="text-sm">Call</span>
              </a>

              <button
                type="button"
                onClick={shareProfile}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold transition hover:brightness-110"
                style={softStyle}
              >
                <Share2 size={23} style={{ color: theme.primary }} />
                <span className="text-sm">Share</span>
              </button>

              <a
                href={phone ? `tel:${phone.replace(/\s/g, "")}` : undefined}
                className="flex min-h-[76px] flex-col items-center justify-center gap-2 rounded-xl p-3 text-sm font-bold transition hover:brightness-110"
                style={softStyle}
              >
                <Phone size={23} style={{ color: theme.primary }} />
                <span className="text-sm">Save Contact</span>
              </a>
            </div>
          </section>

          {/* ABOUT */}
          <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
            <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={softStyle}
              >
                <Award size={21} style={{ color: theme.primary }} />
              </span>
              About the Business
            </h3>

            <div className="rounded-2xl p-5 sm:p-7" style={softStyle}>
              <p className="whitespace-pre-line text-base leading-8 sm:text-lg">
                {about}
              </p>
            </div>
          </section>

          {/* PRODUCTS AND SERVICES */}
          <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
            <h3 className="mb-5 flex flex-wrap items-center justify-between gap-3 text-lg font-extrabold">
              <span className="flex items-center gap-3">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={softStyle}
                >
                  <ShoppingBag size={21} style={{ color: theme.primary }} />
                </span>
                Featured Products &amp; Services
              </span>

              <span
                className="rounded-lg border px-3 py-2 text-sm"
                style={softStyle}
              >
                1 item
              </span>
            </h3>

            <div
              className="flex flex-col gap-5 rounded-2xl p-5 sm:flex-row sm:items-center sm:p-6"
              style={cardStyle}
            >
              <div
                className="flex h-28 w-full shrink-0 items-center justify-center rounded-2xl sm:h-32 sm:w-36"
                style={softStyle}
              >
                <ShoppingBag size={36} style={{ color: theme.primary }} />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xl font-extrabold">
                  {profile?.businessName
                    ? `${profile.businessName} Product`
                    : "Featured Business Product"}
                </h4>

                <p
                  className="mt-3 text-sm leading-7 sm:text-base"
                  style={{ color: theme.muted }}
                >
                  {profile?.headline ||
                    "Contact us to learn more about our products and services."}
                </p>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span
                    className="rounded-lg border px-3 py-2 text-sm"
                    style={softStyle}
                  >
                    Catalog
                  </span>
                  <span
                    className="inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-bold"
                    style={{
                      borderColor: theme.border,
                      color: theme.primary,
                      background: theme.surface,
                    }}
                  >
                    <CheckCircle2 size={17} />
                    Available
                  </span>
                </div>
              </div>

              <button
                type="button"
                onClick={openWhatsApp}
                className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl px-5 py-3 font-extrabold"
                style={accentButtonStyle}
              >
                Enquire Now
                <ArrowUpRight size={18} />
              </button>
            </div>
          </section>

          {/* CONTACT INFORMATION */}
          <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
            <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={softStyle}
              >
                <Phone size={21} style={{ color: theme.primary }} />
              </span>
              Contact &amp; Business Information
            </h3>

            <div className="grid gap-3 sm:grid-cols-2">
              {contactItems.map((item) => {
                const Icon = item.icon;
                const content = (
                  <>
                    <span
                      className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl"
                      style={softStyle}
                    >
                      <Icon size={22} style={{ color: theme.primary }} />
                    </span>

                    <span className="min-w-0 flex-1">
                      <span
                        className="block text-xs font-extrabold uppercase tracking-wider"
                        style={{ color: theme.muted }}
                      >
                        {item.label}
                      </span>
                      <span className="mt-1 block break-words text-sm font-bold sm:text-base">
                        {item.value || "Not added"}
                      </span>
                    </span>

                    <ChevronRight size={19} style={{ color: theme.primary }} />
                  </>
                );

                return item.href ? (
                  <a
                    key={item.label}
                    href={item.href}
                    target={
                      item.label === "Business Website" ||
                      item.label === "Business Address"
                        ? "_blank"
                        : undefined
                    }
                    rel="noreferrer"
                    className="flex min-w-0 items-center gap-3 rounded-2xl p-4 transition hover:brightness-110"
                    style={softStyle}
                  >
                    {content}
                  </a>
                ) : (
                  <div
                    key={item.label}
                    className="flex min-w-0 items-center gap-3 rounded-2xl p-4"
                    style={softStyle}
                  >
                    {content}
                  </div>
                );
              })}
            </div>
          </section>

          {/* CUSTOMER REVIEWS */}
          <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
            <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={softStyle}
              >
                <Star size={21} style={{ color: theme.primary }} />
              </span>
              Customer Experience &amp; Trust
            </h3>

            <div className="rounded-2xl p-6" style={softStyle}>
              <div className="flex flex-col items-center text-center">
                <span
                  className="flex h-14 w-14 items-center justify-center rounded-2xl"
                  style={cardStyle}
                >
                  <Star size={27} style={{ color: theme.primary }} />
                </span>

                <h4 className="mt-4 text-lg font-extrabold">
                  Your experience matters
                </h4>

                <p
                  className="mt-2 max-w-lg text-sm leading-6"
                  style={{ color: theme.muted }}
                >
                  Contact the business to learn more or share feedback through
                  its available channels.
                </p>

                <button
                  type="button"
                  onClick={openWhatsApp}
                  className="mt-4 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold"
                  style={accentButtonStyle}
                >
                  <MessageCircle size={17} />
                  Contact Business
                </button>
              </div>
            </div>
          </section>

          {/* BUSINESS INQUIRY */}
          <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
            <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
              <span
                className="flex h-11 w-11 items-center justify-center rounded-xl"
                style={softStyle}
              >
                <Mail size={21} style={{ color: theme.primary }} />
              </span>
              Share Your Contact / Business Inquiry
            </h3>

            <form
              onSubmit={submitInquiry}
              className="space-y-4 rounded-2xl p-4 sm:p-6"
              style={softStyle}
            >
              <div>
                <h4 className="text-xl font-extrabold">Let's Connect</h4>
                <p
                  className="mt-2 text-sm sm:text-base"
                  style={{ color: theme.muted }}
                >
                  Share your details and message with the business.
                </p>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your Name"
                  className="min-w-0 rounded-xl border px-4 py-4 outline-none"
                  style={{
                    background: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  }}
                />

                <input
                  required
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  placeholder="Phone Number"
                  type="tel"
                  className="min-w-0 rounded-xl border px-4 py-4 outline-none"
                  style={{
                    background: theme.background,
                    color: theme.text,
                    borderColor: theme.border,
                  }}
                />
              </div>

              <input
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="Email Address"
                type="email"
                className="w-full rounded-xl border px-4 py-4 outline-none"
                style={{
                  background: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                }}
              />

              <textarea
                required
                value={form.message}
                onChange={(e) => setForm({ ...form, message: e.target.value })}
                placeholder="Your Message"
                rows={5}
                className="w-full resize-y rounded-xl border px-4 py-4 outline-none"
                style={{
                  background: theme.background,
                  color: theme.text,
                  borderColor: theme.border,
                }}
              />

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-3 rounded-xl px-5 py-4 font-extrabold"
                style={accentButtonStyle}
              >
                <Send size={19} />
                Submit Inquiry
              </button>
            </form>
          </section>

          {/* QR CODE */}
          {qrCode && (
            <section className="px-4 py-5 sm:px-6 lg:px-8" style={sectionStyle}>
              <h3 className="mb-5 flex items-center gap-3 text-lg font-extrabold">
                <span
                  className="flex h-11 w-11 items-center justify-center rounded-xl"
                  style={softStyle}
                >
                  <QrCode size={21} style={{ color: theme.primary }} />
                </span>
                Scan &amp; Connect
              </h3>

              <div
                className="flex flex-col items-center rounded-2xl p-6 text-center"
                style={softStyle}
              >
                <h4 className="text-xl font-extrabold">Connect With Us</h4>
                <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                  Scan this QR code to connect with our business.
                </p>

                <div className="mt-5 rounded-2xl bg-white p-4">
                  <img
                    src={qrCode}
                    alt={`${businessName} QR Code`}
                    className="h-48 w-48 object-contain sm:h-56 sm:w-56"
                  />
                </div>

                <p className="mt-4 text-xs" style={{ color: theme.muted }}>
                  Scan using your phone camera
                </p>
              </div>
            </section>
          )}

          {/* FOOTER */}
          <footer
            className="px-5 py-8 text-center sm:px-8"
            style={{
              borderTop: `1px solid ${theme.border}`,
              background: theme.surface,
            }}
          >
            <div className="mx-auto flex max-w-2xl flex-col items-center">
              <ShieldCheck size={25} style={{ color: theme.primary }} />
              <p className="mt-3 text-base font-extrabold">{businessName}</p>
              <p className="mt-2 text-sm" style={{ color: theme.muted }}>
                {about}
              </p>

              <button
                type="button"
                onClick={shareProfile}
                className="mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 font-bold"
                style={accentButtonStyle}
              >
                <Share2 size={17} />
                Share Business Card
              </button>

              <p className="mt-6 text-xs" style={{ color: theme.muted }}>
                Digital Business Profile
              </p>
            </div>
          </footer>
        </article>
      </div>
    </main>
  );
}

export default CardPreview;
