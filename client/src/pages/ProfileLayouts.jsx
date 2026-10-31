
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

const PreviewLine = ({ className = "w-full", color = "bg-slate-300", height = "h-1" }) => (
  <div className={`${className} ${height} rounded-full ${color}`} />
);

const PreviewImage = ({ className = "" }) => (
  <div className={`overflow-hidden bg-gradient-to-br from-slate-200 via-slate-300 to-slate-400 ${className}`}>
    <div className="flex h-full items-center justify-center">
      <div className="h-1/2 aspect-square rounded-full border-4 border-white/50 bg-slate-400/60" />
    </div>
  </div>
);

const LayoutPreview = ({ style }) => {
  const line = (width = "w-full", color = "bg-slate-300", height = "h-1") => (
    <PreviewLine className={width} color={color} height={height} />
  );

  switch (style) {
    case "modern":
      return (
        <div className="overflow-hidden rounded-lg bg-white text-slate-800">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded-md bg-[#087FA5]" />
              <div className="space-y-1">
                {line("w-12", "bg-slate-700", "h-1.5")}
                {line("w-8", "bg-slate-300", "h-0.5")}
              </div>
            </div>
            <div className="h-5 w-12 rounded-full bg-[#087FA5]" />
          </div>
          <div className="grid grid-cols-5 items-center gap-2 bg-gradient-to-br from-[#F0FAFC] to-white p-3">
            <div className="col-span-3 space-y-2">
              {line("w-8", "bg-cyan-600", "h-1")}
              {line("w-full", "bg-slate-800", "h-2")}
              {line("w-4/5", "bg-slate-700", "h-2")}
              {line("w-full", "bg-slate-300", "h-1")}
              {line("w-2/3", "bg-slate-300", "h-1")}
              <div className="flex gap-1 pt-1">
                <div className="h-5 w-14 rounded-full bg-[#087FA5]" />
                <div className="h-5 w-12 rounded-full border border-cyan-200" />
              </div>
            </div>
            <PreviewImage className="col-span-2 aspect-[3/4] rounded-xl" />
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-slate-100 bg-white p-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-md bg-[#F0F8FA] p-2">
                {line("w-5", "bg-cyan-500", "h-1.5")}
                <div className="mt-1">{line("w-full", "bg-slate-300", "h-1")}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "minimal":
      return (
        <div className="rounded-lg bg-[#F8F7F4] p-3 text-center">
          <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-full bg-[#252525]">
            <div className="h-5 w-5 rounded-full bg-[#D9CBB7]" />
          </div>
          <div className="mx-auto mt-2 w-24 space-y-1.5">
            {line("w-full", "bg-[#292929]", "h-1.5")}
            <div className="mx-auto">{line("w-3/4", "bg-[#A59B8D]", "h-1")}</div>
          </div>
          <div className="mx-auto mt-3 h-5 w-24 rounded-full bg-[#252525]" />
          <div className="mx-auto mt-3 max-w-[170px] space-y-1.5 rounded-lg border border-[#E9E3DA] bg-white p-2">
            {line("w-full", "bg-[#D6D0C7]")}
            {line("w-4/5", "bg-[#D6D0C7]")}
            {line("w-2/3", "bg-[#D6D0C7]")}
          </div>
          <div className="mt-3 flex justify-center gap-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-5 w-5 rounded-full border border-[#DED7CC] bg-white" />
            ))}
          </div>
        </div>
      );

    case "creator":
      return (
        <div className="overflow-hidden rounded-lg bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600" />
              <div className="space-y-1">
                {line("w-14", "bg-slate-800", "h-1.5")}
                {line("w-10", "bg-slate-300", "h-0.5")}
              </div>
            </div>
            <div className="h-5 w-10 rounded-full bg-cyan-600" />
          </div>
          <div className="bg-gradient-to-br from-[#F0FBFF] to-white p-3">
            <div className="grid grid-cols-5 gap-2">
              <div className="col-span-3 space-y-2 py-1">
                {line("w-10", "bg-cyan-600")}
                {line("w-full", "bg-slate-800", "h-2")}
                {line("w-4/5", "bg-slate-800", "h-2")}
                {line("w-full", "bg-slate-300")}
                <div className="h-5 w-16 rounded-full bg-cyan-600" />
              </div>
              <PreviewImage className="col-span-2 aspect-[3/4] rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-2">
            {[1, 2, 3, 4, 5, 6].map((item) => (
              <div key={item} className={`aspect-square rounded-md ${item % 2 ? "bg-gradient-to-br from-cyan-100 to-blue-200" : "bg-gradient-to-br from-slate-200 to-slate-300"}`} />
            ))}
          </div>
          <div className="flex justify-center gap-2 border-t border-slate-100 py-2">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="h-4 w-4 rounded-full bg-cyan-100" />
            ))}
          </div>
        </div>
      );

    case "corporate":
      return (
        <div className="overflow-hidden rounded-lg bg-[#F4F7FA]">
          <div className="flex items-center justify-between bg-[#102B43] px-3 py-2">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-md bg-white/20" />
              {line("w-16", "bg-white/80", "h-1.5")}
            </div>
            <div className="h-4 w-10 rounded bg-white/15" />
          </div>
          <div className="grid grid-cols-5 gap-2 p-3">
            <div className="col-span-2 space-y-2">
              <PreviewImage className="aspect-square rounded-lg" />
              {line("w-full", "bg-slate-700", "h-1.5")}
              {line("w-4/5", "bg-slate-400")}
              {line("w-full", "bg-slate-300")}
              <div className="h-5 rounded bg-[#1C587A]" />
            </div>
            <div className="col-span-3 space-y-2 rounded-lg border border-slate-200 bg-white p-2">
              {line("w-2/3", "bg-[#173C57]", "h-1.5")}
              {line("w-full", "bg-slate-300")}
              {line("w-full", "bg-slate-300")}
              {line("w-4/5", "bg-slate-300")}
              <div className="mt-2 grid grid-cols-2 gap-1">
                <div className="h-7 rounded bg-[#E7F0F5]" />
                <div className="h-7 rounded bg-[#E7F0F5]" />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-slate-200 bg-white p-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded bg-[#EAF1F5] p-2">
                {line("w-3/4", "bg-[#315F7A]")}
                <div className="mt-1">{line("w-full", "bg-slate-300", "h-0.5")}</div>
              </div>
            ))}
          </div>
        </div>
      );

    case "store":
      return (
        <div className="overflow-hidden rounded-lg bg-white">
          <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
            <div className="flex items-center gap-1.5">
              <div className="h-5 w-5 rounded bg-[#102B43]" />
              {line("w-16", "bg-slate-800", "h-1.5")}
            </div>
            <div className="flex gap-1">
              <div className="h-5 w-5 rounded-full bg-slate-100" />
              <div className="h-5 w-5 rounded-full bg-slate-100" />
            </div>
          </div>
          <div className="bg-[#F2F6F8] p-2">
            <div className="grid grid-cols-2 gap-2">
              <PreviewImage className="aspect-[4/3] rounded-lg" />
              <div className="flex flex-col justify-center space-y-2 rounded-lg bg-white p-2">
                {line("w-10", "bg-cyan-600")}
                {line("w-full", "bg-slate-800", "h-1.5")}
                {line("w-4/5", "bg-slate-800", "h-1.5")}
                {line("w-full", "bg-slate-300")}
                <div className="h-5 w-16 rounded bg-[#102B43]" />
              </div>
            </div>
          </div>
          <div className="px-3 py-2">
            {line("w-20", "bg-slate-800", "h-1.5")}
            <div className="mt-2 grid grid-cols-4 gap-1.5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="overflow-hidden rounded-md border border-slate-100 bg-slate-50">
                  <div className="aspect-square bg-gradient-to-br from-slate-200 to-slate-300" />
                  <div className="space-y-1 p-1">
                    {line("w-full", "bg-slate-400", "h-0.5")}
                    {line("w-2/3", "bg-slate-300", "h-0.5")}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      );

    case "freelancer":
      return (
        <div className="overflow-hidden rounded-lg bg-[#F6F8FA]">
          <div className="grid grid-cols-5 gap-2 bg-[#132E43] p-3">
            <div className="col-span-3 flex flex-col justify-center space-y-2">
              {line("w-10", "bg-[#56D5C5]")}
              {line("w-full", "bg-white", "h-2")}
              {line("w-4/5", "bg-white", "h-2")}
              {line("w-full", "bg-white/40")}
              <div className="h-5 w-16 rounded bg-[#24B6A6]" />
            </div>
            <PreviewImage className="col-span-2 aspect-square rounded-xl" />
          </div>
          <div className="p-3">
            {line("w-20", "bg-slate-800", "h-1.5")}
            <div className="mt-2 space-y-1.5">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center gap-2 rounded-md border border-slate-200 bg-white p-2">
                  <div className="h-5 w-5 rounded bg-[#E0F5F1]" />
                  <div className="flex-1 space-y-1">
                    {line("w-3/4", "bg-slate-600")}
                    {line("w-full", "bg-slate-200", "h-0.5")}
                  </div>
                  <div className="h-3 w-3 rounded-sm bg-[#24B6A6]" />
                </div>
              ))}
            </div>
            <div className="mt-2 h-5 rounded bg-[#24B6A6]" />
          </div>
        </div>
      );

    case "elegant":
      return (
        <div className="overflow-hidden rounded-lg bg-[#FAF9F6] text-[#252525]">
          <div className="flex items-center justify-between border-b border-[#E9E4DB] bg-white px-3 py-2">
            {line("w-14", "bg-[#252525]", "h-1.5")}
            <div className="h-5 w-12 rounded-full bg-[#252525]" />
          </div>
          <div className="px-4 py-3 text-center">
            <PreviewImage className="mx-auto aspect-square w-14 rounded-full border-2 border-white shadow-md" />
            <div className="mx-auto mt-2 w-24 space-y-1.5">
              {line("w-full", "bg-[#252525]", "h-1.5")}
              <div className="mx-auto">{line("w-3/4", "bg-[#A58A62]")}</div>
            </div>
            <div className="mx-auto mt-2 flex w-20 items-center gap-1">
              <div className="h-px flex-1 bg-[#A58A62]" />
              <div className="h-1 w-4 rounded bg-[#A58A62]" />
              <div className="h-px flex-1 bg-[#A58A62]" />
            </div>
            <div className="mx-auto mt-3 max-w-[180px] space-y-1.5">
              {line("w-full", "bg-[#D4CEC4]")}
              {line("w-full", "bg-[#D4CEC4]")}
              {line("w-3/4", "bg-[#D4CEC4]")}
            </div>
            <div className="mx-auto mt-3 h-5 w-20 rounded-full bg-[#252525]" />
          </div>
          <div className="grid grid-cols-3 gap-1 border-t border-[#E9E4DB] bg-[#F1EEE8] p-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="h-7 rounded bg-white" />
            ))}
          </div>
        </div>
      );

    case "agency":
      return (
        <div className="overflow-hidden rounded-lg bg-[#EAF1F4]">
          <div className="relative overflow-hidden bg-[#102B3A] p-3">
            <div className="absolute -right-5 -top-8 h-24 w-24 rounded-full border border-[#5ED8C8]/30" />
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="h-6 w-6 rounded-lg bg-white/20" />
                <div className="space-y-1">
                  {line("w-14", "bg-white", "h-1.5")}
                  {line("w-10", "bg-white/40", "h-0.5")}
                </div>
              </div>
              <div className="h-5 w-12 rounded bg-[#20B7A5]" />
            </div>
            <div className="relative mt-4 grid grid-cols-5 gap-2">
              <div className="col-span-3 space-y-2 py-1">
                {line("w-12", "bg-[#8CEADD]")}
                {line("w-full", "bg-white", "h-2")}
                {line("w-4/5", "bg-white", "h-2")}
                {line("w-full", "bg-white/40")}
                <div className="h-5 w-16 rounded bg-[#20B7A5]" />
              </div>
              <PreviewImage className="col-span-2 aspect-[4/5] rounded-lg" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-1.5 p-2">
            {[1, 2, 3].map((item) => (
              <div key={item} className="rounded-md border border-[#D3E0E6] bg-white p-2">
                <div className="mb-2 h-4 w-4 rounded bg-[#DDF5F0]" />
                {line("w-full", "bg-slate-600")}
                <div className="mt-1">{line("w-3/4", "bg-slate-300", "h-0.5")}</div>
              </div>
            ))}
          </div>
          <div className="mx-2 mb-2 h-5 rounded bg-[#20B7A5]" />
        </div>
      );

    case "digital":
      return (
        <div className="mx-auto max-w-[210px] overflow-hidden rounded-xl border border-[#D8E6EC] bg-[#F4F8FA] shadow-md">
          <div className="bg-gradient-to-br from-[#102B43] to-[#1A5266] px-3 py-3 text-center">
            <div className="mx-auto h-9 w-9 rounded-full border-2 border-white/70 bg-white/20" />
            <div className="mx-auto mt-2 w-20 space-y-1">
              {line("w-full", "bg-white", "h-1.5")}
              <div className="mx-auto">{line("w-3/4", "bg-white/50")}</div>
            </div>
            <div className="mt-3 flex justify-center gap-1">
              <div className="h-5 w-12 rounded-full bg-[#24B6A6]" />
              <div className="h-5 w-12 rounded-full border border-white/50" />
            </div>
          </div>
          <div className="p-3">
            <div className="mx-auto grid aspect-square w-14 grid-cols-5 gap-0.5 rounded border border-slate-200 bg-white p-1">
              {Array.from({ length: 25 }).map((_, index) => (
                <div key={index} className={`rounded-[1px] ${[0, 1, 4, 5, 8, 10, 12, 14, 16, 18, 20, 23, 24].includes(index) ? "bg-[#102B43]" : "bg-slate-200"}`} />
              ))}
            </div>
            <div className="mt-3 grid grid-cols-2 gap-1.5">
              <div className="h-7 rounded-md bg-white shadow-sm" />
              <div className="h-7 rounded-md bg-white shadow-sm" />
              <div className="h-7 rounded-md bg-white shadow-sm" />
              <div className="h-7 rounded-md bg-white shadow-sm" />
            </div>
          </div>
        </div>
      );

    case "service":
      return (
        <div className="overflow-hidden rounded-lg bg-[#F4F8F9]">
          <div className="bg-gradient-to-br from-[#102B3A] to-[#17635F] p-3">
            <div className="flex items-center justify-between">
              <div className="h-6 w-6 rounded-md bg-white/20" />
              <div className="h-5 w-12 rounded-full bg-white/15" />
            </div>
            <div className="mt-3 space-y-2">
              {line("w-12", "bg-[#8CEADD]")}
              {line("w-3/4", "bg-white", "h-2")}
              {line("w-full", "bg-white/50")}
              <div className="h-5 w-20 rounded bg-[#20B7A5]" />
            </div>
          </div>
          <div className="p-3">
            {line("w-20", "bg-slate-800", "h-1.5")}
            <div className="mt-2 grid grid-cols-2 gap-1.5">
              {[1, 2, 3, 4].map((item) => (
                <div key={item} className="rounded-md border border-slate-200 bg-white p-2">
                  <div className="mb-2 h-5 w-5 rounded bg-[#DDF5F0]" />
                  {line("w-full", "bg-slate-700")}
                  <div className="mt-1">{line("w-3/4", "bg-slate-300", "h-0.5")}</div>
                </div>
              ))}
            </div>
            <div className="mt-2 rounded-md border border-slate-200 bg-white p-2">
              {line("w-1/2", "bg-slate-700")}
              <div className="mt-2 flex gap-1">
                <div className="h-4 flex-1 rounded bg-slate-100" />
                <div className="h-4 flex-1 rounded bg-slate-100" />
                <div className="h-4 flex-1 rounded bg-[#20B7A5]" />
              </div>
            </div>
          </div>
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
  const [showToast, setShowToast] = useState(false);

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

      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
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
      {showToast && (
        <div
          className="fixed right-5 top-5 z-[200] flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm font-semibold shadow-2xl"
          style={{
            background: "#065f46",
            border: "1px solid #10b981",
            color: "#ecfdf5",
            animation: "toastSlideInRight 0.3s ease",
          }}
        >
          <Check size={18} style={{ color: "#6ee7b7" }} strokeWidth={3} />
          Layout saved successfully!
        </div>
      )}

      <style>{`
        @keyframes toastSlideInRight {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>

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
