import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Check,
  Eye,
  LayoutTemplate,
  LoaderCircle,
  Save,
  Sparkles,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  fetchMyProfile,
  saveMyProfile,
} from "../redux/slice/profileSlice";

const layouts = [
  { id: "modern-business", name: "Modern Business", description: "Professional business profile with a balanced layout.", style: "modern" },
  { id: "minimal-card", name: "Minimal Card", description: "Clean, compact design with focus on essential details.", style: "minimal" },
  { id: "creator-portfolio", name: "Creator Portfolio", description: "Showcase your work, social links and personal brand.", style: "creator" },
  { id: "corporate-executive", name: "Corporate Executive", description: "Structured, polished design for professionals.", style: "corporate" },
  { id: "storefront", name: "Storefront", description: "A product-first layout for shops and businesses.", style: "store" },
  { id: "freelancer-pro", name: "Freelancer Pro", description: "Highlight your services and professional information.", style: "freelancer" },
  { id: "elegant-profile", name: "Elegant Profile", description: "A refined profile presentation with generous spacing.", style: "elegant" },
  { id: "agency-pro", name: "Agency Pro", description: "A bold presentation for agencies and service teams.", style: "agency" },
  { id: "digital-card", name: "Digital Card", description: "A digital visiting card with quick contact actions.", style: "digital" },
  { id: "service-pro", name: "Service Pro", description: "A service-focused layout for enquiries and bookings.", style: "service" },
];

const Bar = ({ w = "w-full", h = "h-1", c = "bg-slate-500/50", extra = "" }) => (
  <div className={`${w} ${h} rounded-full ${c} ${extra}`} />
);

const Avatar = ({ shape = "rounded-lg", color = "from-cyan-300 to-blue-500", size = "h-8 w-8" }) => (
  <div className={`${size} ${shape} bg-gradient-to-br ${color}`} />
);

/* ============ DISTINCT LAYOUT PREVIEWS ============ */

const LayoutPreview = ({ style }) => {
  switch (style) {
    case "modern":
      return (
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Avatar />
            <div className="flex-1 space-y-1.5">
              <Bar w="w-20" c="bg-slate-200/80" />
              <Bar w="w-14" h="h-1.5" />
            </div>
          </div>
          <div className="min-h-12 rounded-lg border border-cyan-300/10 bg-gradient-to-br from-[#0C3556] to-[#0A2340] p-2">
            <Bar w="w-3/4" c="bg-cyan-200/70" />
            <Bar w="w-full" extra="mt-2" />
            <Bar w="w-2/3" extra="mt-1" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 flex-1 rounded-md bg-cyan-300/20" />
            <div className="h-5 flex-1 rounded-md bg-blue-400/20" />
            <div className="h-5 flex-1 rounded-md bg-slate-400/10" />
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="flex flex-col items-center space-y-2 py-1">
          <Avatar shape="rounded-full" />
          <Bar w="w-16" c="bg-slate-200/80" />
          <Bar w="w-12" />
          <div className="mt-2 h-8 w-3/4 rounded-md border border-[#1A4568] bg-[#0A2340]" />
          <div className="h-5 w-2/3 rounded-md bg-cyan-300/20" />
        </div>
      );

    case "creator":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar shape="rounded-full" color="from-pink-400 to-purple-500" size="h-7 w-7" />
            <div className="flex-1"><Bar w="w-16" c="bg-slate-200/80" /></div>
            <div className="h-5 w-5 rounded-full border border-cyan-300/30 bg-cyan-300/10" />
          </div>
          <div className="grid grid-cols-3 gap-1">
            <div className="h-9 rounded bg-[#123B5B]" />
            <div className="h-9 rounded bg-[#1A4568]" />
            <div className="h-9 rounded bg-[#123B5B]" />
            <div className="h-9 rounded bg-[#1A4568]" />
            <div className="h-9 rounded bg-[#123B5B]" />
            <div className="h-9 rounded bg-[#1A4568]" />
          </div>
          <div className="flex justify-center gap-1 pt-1">
            <div className="h-4 w-4 rounded-full bg-cyan-300/25" />
            <div className="h-4 w-4 rounded-full bg-pink-400/25" />
            <div className="h-4 w-4 rounded-full bg-purple-400/25" />
            <div className="h-4 w-4 rounded-full bg-blue-400/25" />
          </div>
        </div>
      );

    case "corporate":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar shape="rounded" color="from-slate-300 to-slate-500" size="h-7 w-7" />
            <div className="flex-1 space-y-1">
              <Bar w="w-20" c="bg-slate-200/80" />
              <Bar w="w-12" h="h-0.5" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <div className="col-span-1 space-y-1 rounded border border-[#1A4568] bg-[#0A2340] p-1.5">
              <Bar h="h-0.5" c="bg-slate-400/60" />
              <Bar h="h-0.5" c="bg-slate-400/60" />
              <Bar h="h-0.5" c="bg-slate-400/60" />
            </div>
            <div className="col-span-2 space-y-1 rounded border border-cyan-300/10 bg-gradient-to-br from-[#0C3556] to-[#0A2340] p-2">
              <Bar w="w-3/4" c="bg-cyan-200/70" />
              <Bar extra="mt-1" />
              <Bar w="w-2/3" extra="mt-1" />
              <Bar w="w-3/4" extra="mt-1" />
            </div>
          </div>
          <div className="flex gap-1.5">
            <div className="h-4 flex-1 rounded bg-cyan-300/20" />
            <div className="h-4 flex-1 rounded bg-slate-400/10" />
          </div>
        </div>
      );

    case "store":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Bar w="w-16" c="bg-slate-200/80" />
            <div className="h-5 w-5 rounded bg-cyan-300/20" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-11 rounded-lg border border-[#1A4568] bg-[#0A2340]" />
            <div className="h-11 rounded-lg border border-[#1A4568] bg-[#0A2340]" />
            <div className="h-11 rounded-lg border border-[#1A4568] bg-[#0A2340]" />
            <div className="h-11 rounded-lg border border-[#1A4568] bg-[#0A2340]" />
          </div>
          <div className="h-5 rounded-md bg-cyan-300/20" />
        </div>
      );

    case "freelancer":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar shape="rounded-full" color="from-amber-300 to-orange-500" />
            <div className="flex-1 space-y-1">
              <Bar w="w-16" c="bg-slate-200/80" />
              <Bar w="w-12" />
            </div>
          </div>
          <div className="space-y-1.5">
            {[0, 1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between rounded-md border border-[#1A4568] bg-[#0A2340] px-2 py-1.5">
                <Bar w="w-16" c="bg-slate-400/70" />
                <div className="h-2 w-2 rounded-sm bg-cyan-300/60" />
              </div>
            ))}
          </div>
          <div className="h-4 rounded-md bg-cyan-300/20" />
        </div>
      );

    case "elegant":
      return (
        <div className="space-y-2">
          <div className="flex flex-col items-center py-1">
            <Avatar shape="rounded-full" color="from-[#0C3556] to-[#0A2340]" size="h-9 w-9" />
            <Bar w="w-20" c="bg-slate-200/80" extra="mt-2" />
            <div className="mt-1.5 flex items-center gap-1">
              <div className="h-px w-3 bg-cyan-300/50" />
              <Bar w="w-8" h="h-0.5" c="bg-cyan-300/30" />
              <div className="h-px w-3 bg-cyan-300/50" />
            </div>
          </div>
          <div className="mx-auto w-5/6 space-y-1">
            <Bar />
            <Bar />
            <Bar w="w-2/3" />
          </div>
          <div className="mx-auto h-5 w-2/3 rounded-full border border-cyan-300/30 bg-cyan-300/10" />
        </div>
      );

    case "agency":
      return (
        <div className="space-y-2">
          <div className="rounded-lg border border-cyan-300/20 bg-gradient-to-br from-[#0C3556] to-[#0A2340] p-2">
            <Bar w="w-3/4" h="h-1.5" c="bg-cyan-200/80" />
            <Bar extra="mt-1.5" />
            <Bar w="w-1/2" extra="mt-1" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-9 rounded-md bg-[#123B5B]" />
            <div className="h-9 rounded-md bg-[#1A4568]" />
          </div>
          <div className="flex gap-1.5">
            <div className="h-5 flex-1 rounded-md bg-cyan-300/30" />
            <div className="h-5 flex-1 rounded-md bg-slate-400/10" />
          </div>
        </div>
      );

    case "digital":
      return (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar size="h-7 w-7" />
              <div className="space-y-1">
                <Bar w="w-14" c="bg-slate-200/80" />
                <Bar w="w-10" h="h-0.5" />
              </div>
            </div>
            <div className="h-8 w-8 rounded border border-cyan-300/30 bg-cyan-300/10" />
          </div>
          <div className="flex justify-center">
            <div className="h-14 w-14 rounded border border-[#1A4568] bg-[#0A2340] p-1">
              <div className="grid h-full grid-cols-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={i} className={`rounded-sm ${i % 2 === 0 ? "bg-slate-200/70" : "bg-slate-500/40"}`} />
                ))}
              </div>
            </div>
          </div>
          <div className="flex justify-center gap-1">
            <div className="h-4 w-8 rounded-md bg-cyan-300/20" />
            <div className="h-4 w-8 rounded-md bg-blue-400/20" />
            <div className="h-4 w-8 rounded-md bg-slate-400/10" />
          </div>
        </div>
      );

    case "service":
      return (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Avatar color="from-emerald-300 to-cyan-500" size="h-7 w-7" />
            <div className="flex-1"><Bar w="w-16" c="bg-slate-200/80" /></div>
          </div>
          <div className="space-y-1.5">
            <div className="flex items-center justify-between rounded-lg border border-[#1A4568] bg-[#0A2340] p-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-cyan-300/20" />
                <Bar w="w-12" c="bg-slate-400/70" />
              </div>
              <div className="h-3 w-6 rounded-sm bg-cyan-300/40" />
            </div>
            <div className="flex items-center justify-between rounded-lg border border-[#1A4568] bg-[#0A2340] p-1.5">
              <div className="flex items-center gap-1.5">
                <div className="h-4 w-4 rounded bg-emerald-300/20" />
                <Bar w="w-14" c="bg-slate-400/70" />
              </div>
              <div className="h-3 w-6 rounded-sm bg-emerald-300/40" />
            </div>
          </div>
          <div className="h-5 rounded-md bg-cyan-300/20" />
        </div>
      );

    default:
      return null;
  }
};

/* ============ MAIN COMPONENT ============ */

const ProfileLayouts = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, saving, error } = useSelector(
    (state) => state.profile || {},
  );

  const [selectedLayout, setSelectedLayout] = useState("modern-business");
  const [message, setMessage] = useState("");
  const [saveError, setSaveError] = useState("");

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile?.activeLayout) {
      const valid = layouts.some((layout) => layout.id === profile.activeLayout);
      if (valid) setSelectedLayout(profile.activeLayout);
    }
  }, [profile?.activeLayout]);

  const handleSave = async () => {
    setMessage("");
    setSaveError("");

    try {
      await dispatch(saveMyProfile({ activeLayout: selectedLayout })).unwrap();
      setMessage("Profile layout saved successfully.");
    } catch (err) {
      setSaveError(
        typeof err === "string"
          ? err
          : err?.response?.data?.message ||
              err?.message ||
              "Unable to save the layout. Please try again.",
      );
    }
  };

  const selected = layouts.find((layout) => layout.id === selectedLayout);

  return (
    <div className="min-w-0 space-y-6 text-slate-100">
      <header className="overflow-hidden rounded-2xl border border-[#164467] bg-gradient-to-br from-[#082443] via-[#061D38] to-[#041529] p-5 sm:p-7">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
              <LayoutTemplate size={24} />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-cyan-300">
                Personalize your website
              </p>
              <h1 className="mt-1 text-2xl font-extrabold text-white sm:text-3xl">
                Profile Layouts
              </h1>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-400">
                Choose how your business profile is arranged. This setting is
                separate from your Website Color Theme.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate("/mini")}
            className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-3 text-sm font-bold text-cyan-200 transition hover:bg-cyan-300/15"
          >
            <Eye size={17} />
            View Mini Website
          </button>
        </div>
      </header>

      {loading && !profile ? (
        <div className="flex items-center justify-center gap-3 rounded-2xl border border-[#164467] bg-[#061D38] p-12 text-slate-300">
          <LoaderCircle className="animate-spin text-cyan-300" size={22} />
          Loading your profile...
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Choose your layout</h2>
              <p className="mt-1 text-sm text-slate-400">
                {layouts.length} layout options available
              </p>
            </div>
            <p className="text-xs text-slate-500">
              Selected:{" "}
              <span className="font-semibold text-cyan-300">{selected?.name}</span>
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-3">
            {layouts.map((layout, index) => {
              const active = selectedLayout === layout.id;
              return (
                <button
                  key={layout.id}
                  type="button"
                  onClick={() => {
                    setSelectedLayout(layout.id);
                    setMessage("");
                    setSaveError("");
                  }}
                  aria-pressed={active}
                  className={`group overflow-hidden rounded-2xl border text-left transition duration-200 hover:-translate-y-0.5 ${
                    active
                      ? "border-cyan-300/60 bg-[#082443] shadow-[0_0_0_1px_rgba(34,211,238,0.12)]"
                      : "border-[#164467] bg-[#061D38] hover:border-cyan-300/30"
                  }`}
                >
                  <div className="relative bg-[#041529] p-4">
                    <div className="mx-auto min-h-[130px] max-w-[250px] rounded-xl border border-[#1A4568] bg-[#082443] p-3 shadow-xl">
                      <LayoutPreview style={layout.style} />
                    </div>

                    <span className="absolute left-3 top-3 rounded-md border border-white/10 bg-[#061D38]/90 px-2 py-1 text-[10px] font-bold text-slate-300">
                      LAYOUT {String(index + 1).padStart(2, "0")}
                    </span>

                    {active && (
                      <span className="absolute right-3 top-3 flex h-7 w-7 items-center justify-center rounded-full bg-cyan-300 text-[#041529]">
                        <Check size={16} strokeWidth={3} />
                      </span>
                    )}
                  </div>

                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="min-w-0 flex-1">
                        <h3 className="font-bold text-white">{layout.name}</h3>
                        <p className="mt-1.5 text-xs leading-5 text-slate-400">
                          {layout.description}
                        </p>
                      </div>
                      <span
                        className={`mt-0.5 shrink-0 rounded-lg border px-2 py-1 text-[10px] font-bold ${
                          active
                            ? "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
                            : "border-[#164467] text-slate-500"
                        }`}
                      >
                        {active ? "Selected" : "Select"}
                      </span>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>

          {(message || saveError || error) && (
            <div
              role="status"
              className={`rounded-xl border px-4 py-3 text-sm ${
                message
                  ? "border-emerald-400/20 bg-emerald-400/[0.07] text-emerald-200"
                  : "border-rose-400/20 bg-rose-400/[0.07] text-rose-200"
              }`}
            >
              {message || saveError || error}
            </div>
          )}

          <footer className="sticky bottom-3 z-10 flex flex-col gap-3 rounded-2xl border border-[#164467] bg-[#041529]/95 p-4 shadow-2xl backdrop-blur-xl sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <Sparkles size={16} className="shrink-0 text-cyan-300" />
              Your selected layout will be saved to your profile.
            </div>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading || !profile}
              className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-cyan-400 px-5 py-3 text-sm font-extrabold text-[#041529] transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {saving ? (
                <LoaderCircle size={17} className="animate-spin" />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving Layout..." : "Save Selected Layout"}
            </button>
          </footer>
        </>
      )}
    </div>
  );
};

export default ProfileLayouts;