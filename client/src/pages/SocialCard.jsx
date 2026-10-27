import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchSocialCards,
  saveSocialCards,
} from "../redux/slice/socialCardsSlice";
import {
  Share2,
  Plus,
  X,
  MessageCircle,
  ChevronDown,
  Check,
  Loader2,
  Users,
  ExternalLink,
  Trash2,
  ArrowUpRight,
  Globe,
  AlertTriangle,
} from "lucide-react";

/* ==================== BRAND ICONS ==================== */

const InstagramIcon = ({ size = 16, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    style={style}
  >
    <rect x="2" y="2" width="20" height="20" rx="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const LinkedinIcon = ({ size = 16, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M20.5 2h-17A1.5 1.5 0 0 0 2 3.5v17A1.5 1.5 0 0 0 3.5 22h17a1.5 1.5 0 0 0 1.5-1.5v-17A1.5 1.5 0 0 0 20.5 2zM8 19H5v-9h3zM6.5 8.25A1.75 1.75 0 1 1 8.25 6.5 1.75 1.75 0 0 1 6.5 8.25zM19 19h-3v-4.74c0-1.42-.6-1.93-1.38-1.93A1.74 1.74 0 0 0 13 14.19a.66.66 0 0 0 0 .14V19h-3v-9h2.9v1.3a3.11 3.11 0 0 1 2.7-1.4c1.55 0 3.36.86 3.36 3.66z" />
  </svg>
);

const FacebookIcon = ({ size = 16, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M22 12a10 10 0 1 0-11.56 9.87v-6.98H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.77-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.98A10 10 0 0 0 22 12z" />
  </svg>
);

const YoutubeIcon = ({ size = 16, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8zM9.6 15.6V8.4l6.2 3.6z" />
  </svg>
);

const TwitterIcon = ({ size = 16, className = "", style = {} }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    style={style}
  >
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zM17.083 19.77h1.833L7.084 4.126H5.117z" />
  </svg>
);

/* ==================== PLATFORMS ==================== */

const PLATFORMS = {
  instagram: {
    id: "instagram",
    name: "Instagram",
    icon: InstagramIcon,
    color: "#E4405F",
    placeholderUrl: "https://instagram.com/",
    placeholderHandle: "@yourbusiness",
    description: "Share photos, reels and stories.",
  },
  linkedin: {
    id: "linkedin",
    name: "LinkedIn",
    icon: LinkedinIcon,
    color: "#0A66C2",
    placeholderUrl: "https://linkedin.com/in/",
    placeholderHandle: "@yourname",
    description: "Connect with professionals.",
  },
  facebook: {
    id: "facebook",
    name: "Facebook",
    icon: FacebookIcon,
    color: "#1877F2",
    placeholderUrl: "https://facebook.com/",
    placeholderHandle: "@yourpage",
    description: "Grow your business community.",
  },
  youtube: {
    id: "youtube",
    name: "YouTube",
    icon: YoutubeIcon,
    color: "#FF4545",
    placeholderUrl: "https://youtube.com/@",
    placeholderHandle: "@yourchannel",
    description: "Showcase your videos.",
  },
  whatsapp: {
    id: "whatsapp",
    name: "WhatsApp Channel",
    icon: MessageCircle,
    color: "#25D366",
    placeholderUrl: "https://whatsapp.com/channel/",
    placeholderHandle: "@yourchannel",
    description: "Keep customers updated.",
  },
  twitter: {
    id: "twitter",
    name: "X (Twitter)",
    icon: TwitterIcon,
    color: "#FFFFFF",
    placeholderUrl: "https://x.com/",
    placeholderHandle: "@yourhandle",
    description: "Join the conversation.",
  },
  custom: {
    id: "custom",
    name: "Custom Platform",
    icon: Globe,
    color: "#22d3ee",
    placeholderUrl: "https://",
    placeholderHandle: "@username",
    description: "Connect your online profile.",
  },
};

const QUICK_PLATFORMS = Object.values(PLATFORMS);

const INITIAL_FORM = {
  platform: "instagram",
  platformName: "",
  icon: "link",
  handle: "",
  audience: "",
  url: "",
  description: "",
  thumbnail: "my-photo",
  ctaLabel: "Follow",
  verifiedTick: true,
};

const SocialCards = () => {
  const dispatch = useDispatch();
  const {
    cards,
    loading,
    saving: reduxSaving,
    error: reduxError,
    loaded,
  } = useSelector((state) => state.socialCards);

  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({ ...INITIAL_FORM });

  // Custom Delete Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchSocialCards());
    }
  }, [dispatch, loaded, loading]);

  const currentPlatform = PLATFORMS[formData.platform] || {
    id: formData.platform,
    name: formData.platformName || "Custom Platform",
    icon: Globe,
    color: "#22d3ee",
    placeholderUrl: "https://",
    placeholderHandle: "@username",
    description: "Connect your online profile.",
  };

  const CurrentIcon = currentPlatform.icon;

  const openModal = (platformId = "instagram") => {
    setFormData({
      ...INITIAL_FORM,
      platform: PLATFORMS[platformId] ? platformId : "instagram",
    });

    setError("");
    setSaved(false);
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving || reduxSaving) return;

    setModalOpen(false);
    setError("");
    setSaved(false);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    setError("");
    setSaved(false);
  };

  const handleSubmit = async () => {
    if (!formData.handle.trim() && !formData.url.trim()) {
      setError("Please enter a username or profile URL.");
      return;
    }

    if (formData.url.trim()) {
      try {
        const parsedUrl = new URL(formData.url.trim());

        if (!["http:", "https:"].includes(parsedUrl.protocol)) {
          setError("Please enter a valid HTTP or HTTPS profile URL.");
          return;
        }
      } catch {
        setError("Please enter a valid profile URL.");
        return;
      }
    }

    const platform = PLATFORMS[formData.platform];
    const newCard = {
      ...formData,
      platformName:
        formData.platform === "custom"
          ? formData.platformName.trim()
          : platform?.name || formData.platformName || formData.platform,
      icon:
        formData.platform === "custom"
          ? formData.icon || "link"
          : formData.platform,
      handle: formData.handle.trim(),
      url: formData.url.trim(),
      id: `social-${Date.now()}`,
    };

    setSaving(true);
    setError("");

    try {
      await dispatch(saveSocialCards([...cards, newCard])).unwrap();
      setSaved(true);

      setTimeout(() => {
        setSaved(false);
        setModalOpen(false);
        setFormData({ ...INITIAL_FORM });
      }, 800);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to save your social profile. Please try again.",
      );
    } finally {
      setSaving(false);
    }
  };

  const triggerDelete = (id) => {
    setDeleteConfirmId(id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;
    setError("");

    const updatedCards = cards.filter(
      (card) => String(card.id || card._id) !== String(deleteConfirmId),
    );

    try {
      await dispatch(saveSocialCards(updatedCards)).unwrap();
      setDeleteConfirmId(null);
    } catch (err) {
      setError(
        typeof err === "string"
          ? err
          : "Unable to delete the social profile. Please try again.",
      );
      setDeleteConfirmId(null);
    }
  };

  return (
    <main className="relative min-h-screen bg-transparent text-slate-200">
      
      {/* Custom Delete Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-4 backdrop-blur-md" onClick={() => setDeleteConfirmId(null)}>
          <div className="relative w-full max-w-sm overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-red-400/20 bg-red-400/10">
              <AlertTriangle size={24} className="text-red-400" />
            </div>
            
            <h3 className="text-lg font-bold text-white">Delete Profile?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this social media profile card? This action cannot be undone.
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="flex-1 rounded-xl border border-[#38516e] bg-[#132942] py-2.5 text-xs font-bold text-slate-300 transition hover:bg-[#1a3658]"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={saving || reduxSaving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {saving || reduxSaving ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {saving || reduxSaving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-1 py-7 sm:px-6 sm:py-9 lg:px-8">
        
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/20">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="relative p-5 sm:p-7 lg:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] text-cyan-400 shadow-lg shadow-black/10">
                  <Share2 size={22} />
                </div>

                <div className="min-w-0">
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                      Social Connections
                    </span>

                    <span className="rounded-full border border-[#29435f] bg-[#132942] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                      {cards.length} {cards.length === 1 ? "Profile" : "Profiles"}
                    </span>
                  </div>

                  <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                    Social Media <span className="text-cyan-400">Cards</span>
                  </h1>

                  <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                    Bring your social profiles together and help customers
                    discover your business across platforms.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => openModal("instagram")}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98]"
              >
                <Plus size={17} strokeWidth={2.5} />
                Add Social Account
              </button>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
          <StatCard
            icon={Share2}
            title="Connected Profiles"
            value={cards.length}
            description="Social accounts added"
          />

          <StatCard
            icon={Globe}
            title="Available Platforms"
            value={Object.keys(PLATFORMS).length}
            description="Platforms you can connect"
          />

          <StatCard
            icon={Users}
            title="Audience Reach"
            value={formatAudience(cards)}
            description="Based on entered audience figures"
          />
        </section>

        {/* Quick Add */}
        <section className="mt-6 overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-xl shadow-black/20">
          <div className="border-b border-[#29435f] px-5 py-4 sm:px-6">
            <div className="flex items-start">
              <div>
                <h2 className="text-sm font-bold text-white pt-1">
                  Quick Add Platform
                </h2>
                <p className="mt-1 text-xs leading-5 text-slate-400 mb-1">
                  Select a platform to start creating its profile card.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-3 p-4 sm:grid-cols-4 sm:p-5 lg:grid-cols-7">
            {QUICK_PLATFORMS.map((platform) => {
              const Icon = platform.icon;

              return (
                <button
                  key={platform.id}
                  type="button"
                  onClick={() => openModal(platform.id)}
                  className="group flex min-h-[100px] flex-col items-center justify-center gap-3 rounded-2xl border border-[#29435f] bg-[#132942] px-2 py-4 transition hover:-translate-y-1 hover:border-cyan-400/50 hover:bg-[#1a3658] active:scale-[0.98]"
                >
                  <span
                    className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 transition group-hover:scale-110"
                    style={{ backgroundColor: `${platform.color}15` }}
                  >
                    <Icon size={20} style={{ color: platform.color }} />
                  </span>

                  <span className="text-center text-[11px] font-bold text-slate-300 transition group-hover:text-cyan-400">
                    {platform.name}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Profile list */}
        <section className="mt-8">
          <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                Your connections
              </p>

              <h2 className="mt-1 text-lg font-bold text-white sm:text-xl">
                Connected Profiles
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Manage the social accounts displayed on your mini website.
              </p>
            </div>

            {cards.length > 0 && (
              <span className="rounded-xl border border-[#29435f] bg-[#132942] px-3 py-2 text-[11px] font-semibold text-slate-300">
                {cards.length} active
              </span>
            )}
          </div>

          {reduxError && (
            <p
              role="alert"
              className="mb-4 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-300"
            >
              {reduxError}
            </p>
          )}

          {loading && cards.length === 0 ? (
            <div
              role="status"
              className="flex items-center justify-center gap-2 rounded-3xl border border-[#29435f] bg-[#0b1b30] px-5 py-12 text-sm text-slate-400"
            >
              <Loader2 size={18} className="animate-spin text-cyan-400" />
              Loading social profiles...
            </div>
          ) : cards.length === 0 ? (
            <div className="relative overflow-hidden rounded-3xl border border-dashed border-[#38516e] bg-[#0b1b30] px-5 py-12 text-center sm:py-16">
              <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942]">
                <Share2 size={27} className="text-cyan-400" />
              </div>

              <h3 className="relative mt-5 text-base font-bold text-white sm:text-lg">
                Your social presence starts here
              </h3>

              <p className="relative mx-auto mt-2 max-w-sm text-xs leading-6 text-slate-400">
                Add your first profile to give visitors a direct way to find and
                follow your business online.
              </p>

              <button
                type="button"
                onClick={() => openModal("instagram")}
                className="relative mt-6 inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98]"
              >
                <Plus size={16} />
                Add Your First Profile
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {cards.map((card) => {
                const platform = PLATFORMS[card.platform] || {
                  name: card.platformName || card.platform || "Social Profile",
                  icon: Globe,
                  color: "#22d3ee",
                };
                const Icon = platform.icon;

                return (
                  <article
                    key={card.id || card._id}
                    className="group relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] transition duration-300 hover:-translate-y-1 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-cyan-400/5"
                  >
                    <div className="h-[2px] bg-gradient-to-r from-cyan-400/80 via-blue-500/40 to-transparent" />

                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div
                          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-white/10 transition group-hover:scale-105"
                          style={{ backgroundColor: `${platform.color}15` }}
                        >
                          <Icon size={22} style={{ color: platform.color }} />
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="text-sm font-bold text-white">
                              {platform.name}
                            </h3>

                            {card.verifiedTick && (
                              <span
                                title="Verified badge enabled"
                                className="inline-flex h-[17px] w-[17px] items-center justify-center rounded-full bg-blue-500"
                              >
                                <Check
                                  size={10}
                                  strokeWidth={3.5}
                                  className="text-white"
                                />
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-all text-xs font-medium text-cyan-400">
                            {card.handle || "Profile handle not provided"}
                          </p>

                          {card.audience && (
                            <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-400">
                              <Users size={12} className="text-slate-500" />
                              {card.audience}
                            </p>
                          )}
                        </div>

                        <button
                          type="button"
                          onClick={() => triggerDelete(card.id || card._id)}
                          aria-label={`Delete ${platform.name} profile`}
                          title="Delete profile"
                          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-400 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-400"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>

                      {card.description && (
                        <p className="mt-4 text-xs leading-6 text-slate-400">
                          {card.description}
                        </p>
                      )}

                      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-[#29435f] pt-4">
                        <div className="min-w-0">
                          <p className="text-[9px] font-bold uppercase tracking-[0.15em] text-slate-500">
                            Action button
                          </p>
                          <p className="mt-1 text-xs font-bold text-slate-200">
                            {card.ctaLabel || "Follow"}
                          </p>
                        </div>

                        {card.url && (
                          <a
                            href={card.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-lg border border-cyan-400/30 bg-cyan-400/10 px-3 py-2 text-[10px] font-bold text-cyan-400 transition hover:border-cyan-400/50 hover:bg-cyan-400/20"
                          >
                            Open Profile
                            <ExternalLink size={12} />
                          </a>
                        )}
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* Add profile modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-[#020817]/80 p-3 backdrop-blur-md sm:p-5"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeModal();
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="relative max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/50"
          >
            <div className="sticky top-0 z-10 border-b border-[#29435f] bg-[#0b1b30]/95 backdrop-blur-xl">
              <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

              <div className="flex items-start justify-between gap-3 p-5 sm:p-6">
                <div className="flex items-start gap-3">
                  <div
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/10"
                    style={{
                      backgroundColor: `${currentPlatform.color}20`,
                    }}
                  >
                    <CurrentIcon
                      size={20}
                      style={{ color: currentPlatform.color }}
                    />
                  </div>

                  <div>
                    <h2 className="text-base font-bold text-white sm:text-lg">
                      Add Social Profile
                    </h2>

                    <p className="mt-1 text-xs leading-5 text-slate-400">
                      Configure the details for your profile card.
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving || reduxSaving}
                  aria-label="Close dialog"
                  className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[#29435f] bg-[#132942] text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:opacity-50"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            <div className="space-y-5 p-5 sm:p-6">
              {/* Platform */}
              <Field label="Social Media Platform">
                <div className="relative">
                  <span className="pointer-events-none absolute left-3.5 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center">
                    <CurrentIcon
                      size={15}
                      style={{ color: currentPlatform.color }}
                    />
                  </span>

                  <select
                    value={formData.platform}
                    onChange={(event) =>
                      handleChange("platform", event.target.value)
                    }
                    className={`${inputCls} appearance-none pl-10 pr-10`}
                  >
                    {Object.values(PLATFORMS).map((platform) => (
                      <option
                        key={platform.id}
                        value={platform.id}
                        className="bg-[#132942]"
                      >
                        {platform.name}
                      </option>
                    ))}
                  </select>

                  <ChevronDown
                    size={15}
                    className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                  />
                </div>
              </Field>

              {formData.platform === "custom" && (
                <Field label="Custom Platform Name">
                  <input
                    type="text"
                    maxLength={60}
                    value={formData.platformName || ""}
                    onChange={(event) =>
                      handleChange("platformName", event.target.value)
                    }
                    placeholder="e.g. Telegram, Pinterest, GitHub"
                    className={inputCls}
                  />
                </Field>
              )}

              {/* Username and audience */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Username / Handle">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.handle}
                    onChange={(event) =>
                      handleChange("handle", event.target.value)
                    }
                    placeholder={currentPlatform.placeholderHandle}
                    className={inputCls}
                  />
                </Field>

                <Field label="Audience / Followers">
                  <input
                    type="text"
                    maxLength={100}
                    value={formData.audience}
                    onChange={(event) =>
                      handleChange("audience", event.target.value)
                    }
                    placeholder="e.g. 14.8K followers"
                    className={inputCls}
                  />
                </Field>
              </div>

              {/* Profile URL */}
              <Field label="Profile URL / Direct Link">
                <input
                  type="url"
                  maxLength={500}
                  value={formData.url}
                  onChange={(event) => handleChange("url", event.target.value)}
                  placeholder={currentPlatform.placeholderUrl}
                  className={inputCls}
                />
              </Field>

              {/* Description */}
              <Field label="Card Description">
                <textarea
                  rows={3}
                  maxLength={250}
                  value={formData.description}
                  onChange={(event) =>
                    handleChange("description", event.target.value)
                  }
                  placeholder="Tell visitors what they can find on this profile..."
                  className={`${inputCls} resize-y leading-6`}
                />
              </Field>

              {/* Thumbnail choice */}
              <Field label="Profile Thumbnail Preference">
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {[
                    { id: "my-photo", label: "My Photo" },
                    { id: "business-logo", label: "Business Logo" },
                    { id: "custom", label: "Custom Photo" },
                  ].map((option) => {
                    const active = formData.thumbnail === option.id;

                    return (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => handleChange("thumbnail", option.id)}
                        className={`flex min-h-11 items-center justify-center gap-2 rounded-xl border px-3 py-3 text-xs font-bold transition ${
                          active
                            ? "border-cyan-400/50 bg-cyan-400/[0.08] text-cyan-400"
                            : "border-[#29435f] bg-[#132942] text-slate-300 hover:border-[#38516e] hover:bg-[#1a3658]"
                        }`}
                      >
                        {active && <Check size={13} strokeWidth={3} />}
                        {option.label}
                      </button>
                    );
                  })}
                </div>
              </Field>

              {/* CTA and verified */}
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <Field label="Action Button Label">
                  <input
                    type="text"
                    maxLength={40}
                    value={formData.ctaLabel}
                    onChange={(event) =>
                      handleChange("ctaLabel", event.target.value)
                    }
                    placeholder="Follow"
                    className={inputCls}
                  />
                </Field>

                <div className="flex items-center sm:pt-6">
                  <label className="inline-flex cursor-pointer items-center gap-3 select-none">
                    <input
                      type="checkbox"
                      checked={formData.verifiedTick}
                      onChange={(event) =>
                        handleChange("verifiedTick", event.target.checked)
                      }
                      className="h-4 w-4 accent-cyan-400"
                    />

                    <span className="flex items-center gap-2 text-xs font-bold text-slate-300">
                      Show verified badge
                      <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-500">
                        <Check
                          size={9}
                          strokeWidth={4}
                          className="text-white"
                        />
                      </span>
                    </span>
                  </label>
                </div>
              </div>

              {/* Error */}
              {error && (
                <p
                  role="alert"
                  className="rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-300"
                >
                  {error}
                </p>
              )}
            </div>

            {/* Modal footer */}
            <div className="sticky bottom-0 flex flex-col-reverse gap-3 border-t border-[#29435f] bg-[#0b1b30]/95 p-5 backdrop-blur-xl sm:flex-row sm:justify-end sm:p-6">
              <button
                type="button"
                onClick={closeModal}
                disabled={saving || reduxSaving}
                className="inline-flex min-h-11 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] px-5 py-3 text-xs font-bold text-slate-300 transition hover:bg-[#1a3658] disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleSubmit}
                disabled={saving || reduxSaving || saved}
                className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving || reduxSaving ? (
                  <>
                    <Loader2 size={15} className="animate-spin" />
                    Adding Profile...
                  </>
                ) : saved ? (
                  <>
                    <Check size={15} strokeWidth={3} />
                    Profile Added
                  </>
                ) : (
                  <>
                    <Plus size={15} />
                    Add Profile Card
                    <ArrowUpRight size={14} />
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

/* ==================== REUSABLE COMPONENTS ==================== */

const inputCls =
  "w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.07]";

const Field = ({ label, children }) => (
  <div className="min-w-0">
    <label className="mb-2 block text-[11px] font-bold text-slate-300">
      {label}
    </label>
    {children}
  </div>
);

const StatCard = ({ icon: Icon, title, value, description }) => (
  <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:border-[#38516e] sm:p-5">
    <div className="flex items-start justify-between gap-3">
      <div>
        <p className="text-xs font-medium text-slate-400">{title}</p>

        <p className="mt-2 text-2xl font-bold tracking-tight text-white">
          {value}
        </p>

        <p className="mt-1 text-[10px] leading-5 text-slate-500">
          {description}
        </p>
      </div>

      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/15 bg-[#132942]">
        <Icon size={18} className="text-cyan-400" />
      </div>
    </div>
  </div>
);

/* Sum audience values only when they are written as plain numbers.
   Labels such as "14.8K followers" are retained as entered but not
   guessed or converted into a numeric total. */
const formatAudience = (cards) => {
  const total = cards.reduce((sum, card) => {
    const value = (card.audience || "").trim().replace(/,/g, "");

    if (!value || !/^\d+(\.\d+)?$/.test(value)) return sum;

    return sum + Number(value);
  }, 0);

  return total.toLocaleString("en-IN");
};

export default SocialCards;