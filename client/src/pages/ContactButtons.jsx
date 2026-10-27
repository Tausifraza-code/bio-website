import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  Link2,
  Phone,
  MessageCircle,
  Mail,
  MapPin,
  Share2,
  Globe,
  UserRoundPlus,
  Wallet,
  Pencil,
  Trash2,
  ArrowUp,
  ArrowDown,
  X,
  Save,
  Loader2,
  Check,
  ExternalLink,
  ToggleLeft,
  ToggleRight,
  Settings2,
  MousePointerClick,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";

import {
  fetchContactButtons,
  saveContactButtons,
  clearContactButtonsError,
} from "../redux/slice/contactButtonsSlice";

const ACTION_TYPES = [
  { value: "call", label: "Phone Call", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
  { value: "directions", label: "Get Directions", icon: MapPin },
  { value: "share", label: "Share Profile", icon: Share2 },
  { value: "website", label: "Website", icon: Globe },
  { value: "saveContact", label: "Save Contact", icon: UserRoundPlus },
  { value: "upi", label: "UPI Payment", icon: Wallet },
  { value: "customLink", label: "Custom Link", icon: Link2 },
];

const ICON_OPTIONS = [
  { value: "link", label: "Link", icon: Link2 },
  { value: "phone", label: "Phone", icon: Phone },
  { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
  { value: "email", label: "Email", icon: Mail },
  { value: "location", label: "Location", icon: MapPin },
  { value: "share", label: "Share", icon: Share2 },
  { value: "website", label: "Website", icon: Globe },
  { value: "contact", label: "Contact", icon: UserRoundPlus },
  { value: "upi", label: "UPI", icon: Wallet },
];

const ICON_MAP = {
  link: Link2,
  phone: Phone,
  whatsapp: MessageCircle,
  email: Mail,
  location: MapPin,
  share: Share2,
  website: Globe,
  contact: UserRoundPlus,
  upi: Wallet,
};

const EMPTY_FORM = {
  label: "",
  actionType: "customLink",
  icon: "link",
  customUrl: "",
  enabled: true,
};

const inputClass =
  "w-full rounded-xl border border-[#29435f] bg-[#132942] px-4 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition focus:border-cyan-400 focus:ring-4 focus:ring-cyan-400/[0.07]";

const primaryButton =
  "inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/20 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50";

function getActionLabel(actionType) {
  return (
    ACTION_TYPES.find((item) => item.value === actionType)?.label ||
    "Custom Action"
  );
}

function normalizeButton(button) {
  return {
    ...button,
    id: String(button._id || button.id || button.buttonId),
  };
}

function getButtonIcon(icon) {
  return ICON_MAP[icon] || Link2;
}

export default function ContactButtons() {
  const dispatch = useDispatch();

  const {
    buttons = [],
    loading = false,
    saving = false,
    error = null,
    loaded = false,
  } = useSelector((state) => state.contactButtons || {});

  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [formError, setFormError] = useState("");
  const [localButtons, setLocalButtons] = useState([]);
  
  // Custom Delete Modal State
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  useEffect(() => {
    if (!loaded && !loading) {
      dispatch(fetchContactButtons());
    }
  }, [dispatch, loaded, loading]);

  useEffect(() => {
    setLocalButtons(
      [...buttons].sort((a, b) => Number(a.order || 0) - Number(b.order || 0)),
    );
  }, [buttons]);

  const enabledCount = localButtons.filter((button) => button.enabled).length;

  const openAddModal = () => {
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setFormError("");
    dispatch(clearContactButtonsError());
    setModalOpen(true);
  };

  const openEditModal = (button) => {
    setEditingId(button.id);
    setFormData({
      label: button.label || "",
      actionType: button.actionType || "customLink",
      icon: button.icon || "link",
      customUrl: button.customUrl || "",
      enabled: button.enabled !== false,
    });
    setFormError("");
    dispatch(clearContactButtonsError());
    setModalOpen(true);
  };

  const closeModal = () => {
    setModalOpen(false);
    setEditingId(null);
    setFormData({ ...EMPTY_FORM });
    setFormError("");
  };

  const updateField = (field, value) => {
    setFormData((previous) => ({
      ...previous,
      [field]: value,
    }));
    setFormError("");
  };

  const persistButtons = async (nextButtons) => {
    const payload = nextButtons.map((button, index) => ({
      buttonId:
        button.buttonId || button.id || `contact-${Date.now()}-${index}`,
      label: button.label,
      icon: button.icon || "link",
      actionType: button.actionType,
      enabled: button.enabled !== false,
      order: index,
      customUrl: button.customUrl || "",
    }));

    try {
      await dispatch(saveContactButtons(payload)).unwrap();
      return true;
    } catch {
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const label = formData.label.trim();

    if (!label) {
      setFormError("Please enter a button label.");
      return;
    }

    if (
      ["website", "customLink"].includes(formData.actionType) &&
      !formData.customUrl.trim()
    ) {
      setFormError("Please enter a URL for this button.");
      return;
    }

    if (
      ["website", "customLink"].includes(formData.actionType) &&
      !/^https?:\/\/\S+/i.test(formData.customUrl.trim())
    ) {
      setFormError("Enter a valid URL starting with https:// or http://.");
      return;
    }

    let nextButtons;

    if (editingId) {
      nextButtons = localButtons.map((button) =>
        button.id === editingId
          ? {
              ...button,
              ...formData,
              label,
              customUrl: formData.customUrl.trim(),
            }
          : button,
      );
    } else {
      nextButtons = [
        ...localButtons,
        {
          ...formData,
          label,
          customUrl: formData.customUrl.trim(),
          buttonId: `contact-${Date.now()}`,
          enabled: formData.enabled,
          order: localButtons.length,
        },
      ];
    }

    const success = await persistButtons(nextButtons);

    if (success) {
      closeModal();
    } else {
      setFormError(
        "Unable to save the button. Please check the error message and try again.",
      );
    }
  };

  const triggerDelete = (button) => {
    setDeleteConfirmId(button.id);
  };

  const handleConfirmDelete = async () => {
    if (!deleteConfirmId) return;

    const nextButtons = localButtons.filter((item) => item.id !== deleteConfirmId);
    await persistButtons(nextButtons);
    setDeleteConfirmId(null);
  };

  const handleToggle = async (button) => {
    const nextButtons = localButtons.map((item) =>
      item.id === button.id ? { ...item, enabled: !item.enabled } : item,
    );

    await persistButtons(nextButtons);
  };

  const handleReorder = async (index, direction) => {
    const targetIndex = index + direction;

    if (targetIndex < 0 || targetIndex >= localButtons.length) {
      return;
    }

    const nextButtons = [...localButtons];

    [nextButtons[index], nextButtons[targetIndex]] = [
      nextButtons[targetIndex],
      nextButtons[index],
    ];

    setLocalButtons(nextButtons);
    const success = await persistButtons(nextButtons);

    if (!success) {
      setLocalButtons(localButtons);
    }
  };

  const renderButtonCard = (button, index) => {
    const Icon = getButtonIcon(button.icon);

    return (
      <article
        key={button.id}
        className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-cyan-400/30 hover:shadow-xl hover:shadow-black/20 sm:p-5"
      >
        <div className="flex items-start gap-3">
          
          {/* Reorder Buttons */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleReorder(index, -1)}
              disabled={index === 0 || saving}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-[#132942] hover:text-cyan-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              title="Move up"
            >
              <ArrowUp size={16} />
            </button>

            <button
              type="button"
              onClick={() => handleReorder(index, 1)}
              disabled={index === localButtons.length - 1 || saving}
              className="rounded-lg p-1.5 text-slate-500 transition hover:bg-[#132942] hover:text-cyan-400 disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-slate-500"
              title="Move down"
            >
              <ArrowDown size={16} />
            </button>
          </div>

          {/* Icon */}
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942] text-cyan-400">
            <Icon size={22} />
          </div>

          {/* Content */}
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="break-words font-bold text-white">
                {button.label}
              </h3>

              <span
                className={`rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${
                  button.enabled
                    ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-400"
                    : "border-slate-500/20 bg-slate-500/10 text-slate-400"
                }`}
              >
                {button.enabled ? "Enabled" : "Disabled"}
              </span>
            </div>

            <p className="mt-1 text-xs font-medium text-slate-400">
              {getActionLabel(button.actionType)}
            </p>

            {button.customUrl && (
              <p className="mt-2 break-all text-xs text-cyan-400/80">
                {button.customUrl}
              </p>
            )}
          </div>
        </div>

        {/* Action Bar */}
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[#29435f] pt-4">
          <button
            type="button"
            onClick={() => handleToggle(button)}
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-300 transition hover:bg-[#132942] hover:text-cyan-400 disabled:opacity-50"
          >
            {button.enabled ? (
              <ToggleRight size={20} className="text-cyan-400" />
            ) : (
              <ToggleLeft size={20} />
            )}
            {button.enabled ? "Disable" : "Enable"}
          </button>

          <div className="flex items-center gap-1">
            {button.customUrl && (
              <a
                href={button.customUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg p-2 text-slate-400 transition hover:bg-[#132942] hover:text-cyan-400"
                title="Open Link"
              >
                <ExternalLink size={17} />
              </a>
            )}

            <button
              type="button"
              onClick={() => openEditModal(button)}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-[#132942] hover:text-cyan-400"
              title="Edit"
            >
              <Pencil size={17} />
            </button>

            <button
              type="button"
              onClick={() => triggerDelete(button)}
              disabled={saving}
              className="rounded-lg p-2 text-slate-400 transition hover:bg-red-400/10 hover:text-red-400 disabled:opacity-50"
              title="Delete"
            >
              <Trash2 size={17} />
            </button>
          </div>
        </div>
      </article>
    );
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
            
            <h3 className="text-lg font-bold text-white">Delete Button?</h3>
            <p className="mt-2 text-sm leading-6 text-slate-400">
              Are you sure you want to delete this contact button? This action cannot be undone.
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
                disabled={saving}
                className="flex-1 flex items-center justify-center gap-2 rounded-xl bg-red-500 py-2.5 text-xs font-bold text-white transition hover:bg-red-400 disabled:opacity-50"
              >
                {saving ? <Loader2 size={15} className="animate-spin" /> : <Trash2 size={15} />}
                {saving ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="relative mx-auto max-w-6xl px-1 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* Header */}
        <section className="relative overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/20">
          <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400 to-transparent" />

          <div className="flex flex-col justify-between gap-5 p-5 sm:flex-row sm:items-center sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] text-cyan-400 shadow-lg shadow-black/10">
                <MousePointerClick size={25} />
              </div>

              <div>
                <div className="mb-2 flex flex-wrap items-center gap-2">
                  <span className="rounded-full border border-cyan-400/20 bg-cyan-400/[0.07] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-300">
                    Mini Website
                  </span>
                  <span className="text-xs font-medium text-slate-400">
                    Button Management
                  </span>
                </div>

                <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                  Contact Buttons
                </h1>

                <p className="mt-2 max-w-xl text-sm leading-6 text-slate-400">
                  Create and customize the action buttons displayed on your mini
                  website. Add as many buttons as you need.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={openAddModal}
              className={`${primaryButton} shrink-0`}
            >
              <Plus size={18} />
              Add New Button
            </button>
          </div>
        </section>

        {/* Stats */}
        <section className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-3">
          <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:border-[#38516e]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-cyan-400/20 bg-[#132942] p-3 text-cyan-400">
                <Settings2 size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Total Buttons</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {localButtons.length}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:border-[#38516e]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-emerald-400/20 bg-emerald-400/10 p-3 text-emerald-400">
                <Check size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Enabled Buttons</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {enabledCount}
                </p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-4 transition hover:border-[#38516e]">
            <div className="flex items-center gap-3">
              <div className="rounded-xl border border-slate-500/20 bg-slate-500/10 p-3 text-slate-400">
                <ToggleLeft size={21} />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-400">Disabled Buttons</p>
                <p className="mt-1 text-2xl font-bold text-white">
                  {localButtons.length - enabledCount}
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Error */}
        {error && (
          <div
            role="alert"
            className="mt-5 flex items-start gap-3 rounded-xl border border-red-400/20 bg-red-400/[0.07] p-4 text-sm text-red-300"
          >
            <AlertCircle size={19} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Buttons List */}
        <section className="mt-7">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-white">
                Your Custom Buttons
              </h2>
              <p className="mt-1 text-sm text-slate-400">
                Manage visibility and display order.
              </p>
            </div>

            {saving && (
              <span className="inline-flex items-center gap-2 text-xs font-bold text-cyan-400">
                <Loader2 size={15} className="animate-spin" />
                Saving changes...
              </span>
            )}
          </div>

          {loading && !loaded ? (
            <div className="flex min-h-48 items-center justify-center rounded-2xl border border-[#29435f] bg-[#0b1b30]">
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <Loader2 size={20} className="animate-spin text-cyan-400" />
                Loading your buttons...
              </div>
            </div>
          ) : localButtons.length === 0 ? (
            <div className="rounded-3xl border border-dashed border-[#38516e] bg-[#0b1b30] px-5 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] text-cyan-400">
                <Link2 size={29} />
              </div>

              <h3 className="mt-5 text-lg font-bold text-white">
                No contact buttons yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-400">
                Start with a button for your website, WhatsApp, email, or any
                other supported action. Your buttons will appear here after you
                create them.
              </p>

              <button
                type="button"
                onClick={openAddModal}
                className={`${primaryButton} mt-6`}
              >
                <Plus size={18} />
                Create Your First Button
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              {localButtons.map((button, index) =>
                renderButtonCard(button, index),
              )}
            </div>
          )}
        </section>

        <p className="mt-6 text-center text-xs leading-5 text-slate-500">
          Changes are saved to your account. Only enabled buttons will be
          displayed on your public mini website.
        </p>
      </div>

      {/* Add / Edit Modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-[#020817]/80 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !saving) {
              closeModal();
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            className="my-auto w-full max-w-lg overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30] shadow-2xl"
          >
            <div className="absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

            <div className="flex items-center justify-between border-b border-[#29435f] p-5 sm:p-6">
              <div>
                <h2 className="text-lg font-bold text-white">
                  {editingId ? "Edit Contact Button" : "Create Contact Button"}
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  Customize how this button appears and behaves.
                </p>
              </div>

              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                className="rounded-xl border border-[#29435f] bg-[#132942] p-2 text-slate-400 transition hover:border-cyan-400/50 hover:text-cyan-400 disabled:opacity-50"
              >
                <X size={19} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5 p-5 sm:p-6">
              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Button Label <span className="text-cyan-400">*</span>
                </label>

                <input
                  type="text"
                  value={formData.label}
                  onChange={(event) => updateField("label", event.target.value)}
                  placeholder="e.g. Visit My Website"
                  maxLength={80}
                  required
                  className={inputClass}
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Action Type
                </label>

                <select
                  value={formData.actionType}
                  onChange={(event) =>
                    updateField("actionType", event.target.value)
                  }
                  className={inputClass}
                >
                  {ACTION_TYPES.map((action) => (
                    <option key={action.value} value={action.value} className="bg-[#132942]">
                      {action.label}
                    </option>
                  ))}
                </select>

                <p className="mt-2 text-xs leading-5 text-slate-500">
                  Choose what happens when a visitor clicks the button.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold text-slate-300">
                  Button Icon
                </label>

                <select
                  value={formData.icon}
                  onChange={(event) => updateField("icon", event.target.value)}
                  className={inputClass}
                >
                  {ICON_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value} className="bg-[#132942]">
                      {option.label}
                    </option>
                  ))}
                </select>

                <div className="mt-3 flex items-center gap-3 rounded-xl border border-[#29435f] bg-[#132942] p-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#0b1b30] text-cyan-400">
                    {(() => {
                      const Icon = getButtonIcon(formData.icon);
                      return <Icon size={21} />;
                    })()}
                  </div>

                  <div>
                    <p className="text-sm font-bold text-white">
                      {formData.label.trim() || "Button Preview"}
                    </p>
                    <p className="text-xs text-slate-400">
                      {getActionLabel(formData.actionType)}
                    </p>
                  </div>
                </div>
              </div>

              {["website", "customLink"].includes(formData.actionType) && (
                <div>
                  <label className="mb-2 block text-sm font-semibold text-slate-300">
                    Destination URL <span className="text-cyan-400">*</span>
                  </label>

                  <input
                    type="url"
                    value={formData.customUrl}
                    onChange={(event) =>
                      updateField("customUrl", event.target.value)
                    }
                    placeholder="https://example.com"
                    required
                    className={inputClass}
                  />
                </div>
              )}

              <label className="flex cursor-pointer items-center justify-between gap-3 rounded-xl border border-[#29435f] bg-[#132942] p-4">
                <div>
                  <p className="text-sm font-bold text-white">
                    Enable this button
                  </p>
                  <p className="mt-1 text-xs text-slate-400">
                    Disabled buttons will be hidden on your mini website.
                  </p>
                </div>

                <input
                  type="checkbox"
                  checked={formData.enabled}
                  onChange={(event) =>
                    updateField("enabled", event.target.checked)
                  }
                  className="h-4 w-4 accent-cyan-400"
                />
              </label>

              {formError && (
                <p role="alert" className="text-sm font-semibold text-red-400">
                  {formError}
                </p>
              )}

              <div className="flex flex-col-reverse gap-3 border-t border-[#29435f] pt-5 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="rounded-xl border border-[#38516e] bg-[#132942] px-5 py-3 text-sm font-semibold text-slate-300 transition hover:bg-[#1a3658] disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={saving}
                  className={primaryButton}
                >
                  {saving ? (
                    <Loader2 size={17} className="animate-spin" />
                  ) : (
                    <Save size={17} />
                  )}
                  {saving
                    ? "Saving..."
                    : editingId
                      ? "Update Button"
                      : "Create Button"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}