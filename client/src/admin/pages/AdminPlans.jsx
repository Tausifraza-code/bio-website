import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import toast from "react-hot-toast";
import {
  Plus,
  RefreshCw,
  Pencil,
  X,
  Layers,
  CheckCircle2,
  Trash2,
} from "lucide-react";

import {
  fetchAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  toggleAdminPlanStatus,
  deleteAdminPlan,
  clearAdminPlansMessages,
} from "../../redux/slice/adminPlansSlice";

const emptyForm = {
  name: "",
  price: "",
  durationValue: "1",
  durationUnit: "years",
  description: "",
  features: "",
  isActive: true,
  sortOrder: "0",
};

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(value) || 0);

export default function AdminPlans() {
  const dispatch = useDispatch();
  const {
    plans,
    loading,
    saving,
    deleting,
    deletingPlanId,
    error,
    successMessage,
  } = useSelector((state) => state.adminPlans);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");
  const [deleteModal, setDeleteModal] = useState({
    open: false,
    plan: null,
  });

  useEffect(() => {
    if (plans.length === 0) dispatch(fetchAdminPlans());
  }, [dispatch, plans.length]);

  const visiblePlans = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return plans;
    return plans.filter((plan) =>
      `${plan.name} ${plan.description || ""}`.toLowerCase().includes(term),
    );
  }, [plans, search]);

  const openCreate = () => {
    dispatch(clearAdminPlansMessages());
    setEditingPlan(null);
    setForm(emptyForm);
    setModalOpen(true);
  };

  const openEdit = (plan) => {
    dispatch(clearAdminPlansMessages());
    setEditingPlan(plan);
    setForm({
      name: plan.name || "",
      price: String(plan.price ?? ""),
      durationValue: String(plan.durationValue ?? 1),
      durationUnit: plan.durationUnit || "years",
      description: plan.description || "",
      features: (plan.features || []).join("\n"),
      isActive: Boolean(plan.isActive),
      sortOrder: String(plan.sortOrder ?? 0),
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (!saving) setModalOpen(false);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const payload = {
      name: form.name.trim(),
      price: Number(form.price),
      durationValue: Number(form.durationValue),
      durationUnit: form.durationUnit,
      description: form.description.trim(),
      features: form.features
        .split("\n")
        .map((feature) => feature.trim())
        .filter(Boolean),
      isActive: form.isActive,
      sortOrder: Number(form.sortOrder) || 0,
    };

    if (
      !payload.name ||
      !Number.isFinite(payload.price) ||
      payload.price < 0 ||
      !Number.isInteger(payload.durationValue) ||
      payload.durationValue < 1
    ) {
      return;
    }

    try {
      if (editingPlan) {
        await dispatch(
          updateAdminPlan({ id: editingPlan._id, changes: payload }),
        ).unwrap();
      } else {
        await dispatch(createAdminPlan(payload)).unwrap();
      }
      setModalOpen(false);
    } catch {
      // Error is displayed from Redux state.
    }
  };

  const handleToggle = async (plan) => {
    try {
      await dispatch(toggleAdminPlanStatus(plan)).unwrap();

      toast.success(
        `Plan ${plan.isActive ? "disabled" : "activated"} successfully!`,
      );
    } catch (error) {
      toast.error(
        typeof error === "string" ? error : "Failed to update plan status.",
      );
    }
  };

  const openDeleteModal = (plan) => {
    setDeleteModal({
      open: true,
      plan,
    });
  };

  const closeDeleteModal = () => {
    if (deleting) return;

    setDeleteModal({
      open: false,
      plan: null,
    });
  };

  const handleDelete = async () => {
    if (!deleteModal.plan) return;

    try {
      await dispatch(deleteAdminPlan(deleteModal.plan._id)).unwrap();
      toast.success("Plan deleted successfully!");

      setDeleteModal({
        open: false,
        plan: null,
      });
    } catch (error) {
      toast.error(typeof error === "string" ? error : "Failed to delete plan.");
    }
  };

  return (
    <div className="min-w-0 space-y-4 sm:space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            PLAN MANAGEMENT
          </p>
          <h1 className="mt-2 text-xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Subscription Plans
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create plans and manage their availability.
          </p>
        </div>
        <div className="grid w-full grid-cols-2 gap-2 sm:w-auto sm:flex sm:flex-wrap">
          <button
            type="button"
            onClick={() => dispatch(fetchAdminPlans())}
            disabled={loading}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 sm:px-4 dark:border-slate-800 dark:bg-[#0b1728] dark:text-white"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-500 px-3 py-2.5 text-sm font-bold text-white hover:bg-cyan-400 sm:px-4"
          >
            <Plus size={17} /> Add Plan
          </button>
        </div>
      </section>

      <section className="grid grid-cols-3 gap-2 sm:gap-4">
        {[
          ["Total plans", plans.length],
          ["Active plans", plans.filter((p) => p.isActive).length],
          ["Disabled plans", plans.filter((p) => !p.isActive).length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="min-w-0 rounded-xl border border-slate-200 bg-white p-3 sm:rounded-2xl sm:p-5 dark:border-slate-800 dark:bg-[#0b1728]"
          >
            <div className="flex min-h-9 items-start justify-between gap-1">
              <p className="text-xs leading-4 text-slate-500 sm:text-sm dark:text-slate-400">
                {label}
              </p>
              <Layers size={16} className="shrink-0 text-cyan-500 sm:size-[18px]" />
            </div>
            <p className="mt-2 text-xl font-bold text-slate-900 sm:mt-3 sm:text-2xl dark:text-white">
              {value}
            </p>
          </div>
        ))}
      </section>

      {error && (
        <div
          role="alert"
          className="rounded-xl bg-red-50 p-3 text-sm text-red-700 dark:bg-red-950/30 dark:text-red-300"
        >
          {error}
        </div>
      )}

      <section className="min-w-0 overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="border-b border-slate-200 p-3 sm:p-4 dark:border-slate-800">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plans..."
            aria-label="Search plans"
            className="min-h-11 w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-cyan-500 sm:max-w-sm dark:border-slate-700"
          />
        </div>

        {loading && plans.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <RefreshCw size={17} className="animate-spin" /> Loading plans...
          </div>
        ) : visiblePlans.length === 0 ? (
          <div className="p-6 text-center sm:p-10">
            <Layers className="mx-auto text-slate-400" size={30} />
            <p className="mt-3 font-semibold text-slate-800 dark:text-white">
              No plans found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add a plan or try another search.
            </p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 xl:hidden dark:divide-slate-800">
              {visiblePlans.map((plan) => (
                <article key={plan._id} className="min-w-0 space-y-4 p-4">
                  <div className="flex min-w-0 items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h2 className="break-words font-semibold text-slate-900 dark:text-white">
                        {plan.name}
                      </h2>
                      {plan.description && (
                        <p className="mt-1 break-words text-sm text-slate-500 dark:text-slate-400">
                          {plan.description}
                        </p>
                      )}
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${
                        plan.isActive
                          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                          : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Disabled"}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Price
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
                        {money(plan.price)}
                      </p>
                    </div>
                    <div className="min-w-0 rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Duration
                      </p>
                      <p className="mt-1 break-words text-sm font-semibold text-slate-900 dark:text-white">
                        {plan.durationValue} {plan.durationUnit}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(plan)}
                      disabled={saving}
                      aria-label={`Edit ${plan.name}`}
                      className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <Pencil size={15} />
                      Edit
                    </button>
                    <button
                      type="button"
                      role="switch"
                      aria-checked={Boolean(plan.isActive)}
                      aria-label={`${plan.isActive ? "Disable" : "Enable"} ${plan.name}`}
                      onClick={() => handleToggle(plan)}
                      disabled={saving}
                      className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-slate-200 px-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50 sm:px-2 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
                    >
                      <span
                        aria-hidden="true"
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full transition-colors ${
                          plan.isActive
                            ? "bg-cyan-500 dark:bg-cyan-400"
                            : "bg-slate-300 dark:bg-slate-600"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform ${
                            plan.isActive ? "translate-x-4" : "translate-x-0.5"
                          }`}
                        />
                      </span>
                      {plan.isActive ? "On" : "Off"}
                    </button>
                    <button
                      type="button"
                      onClick={() => openDeleteModal(plan)}
                      disabled={deleting}
                      aria-label={`Delete ${plan.name}`}
                      className="inline-flex min-h-11 min-w-0 items-center justify-center gap-1 rounded-lg border border-red-200 px-2 text-xs font-semibold text-red-600 hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                    >
                      {deletingPlanId === plan._id ? (
                        <RefreshCw size={15} className="shrink-0 animate-spin" />
                      ) : (
                        <Trash2 size={15} className="shrink-0" />
                      )}
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>

            <div className="hidden overflow-x-auto xl:block">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-slate-50 text-xs uppercase text-slate-500 dark:bg-slate-900/60 dark:text-slate-400">
                <tr>
                  <th className="px-5 py-4">Plan</th>
                  <th className="px-5 py-4">Price</th>
                  <th className="px-5 py-4">Duration</th>
                  <th className="px-5 py-4">Status</th>
                  <th className="px-5 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {visiblePlans.map((plan) => (
                  <tr key={plan._id}>
                    <td className="px-5 py-4">
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {plan.name}
                      </p>
                      {plan.description && (
                        <p className="mt-1 max-w-xs truncate text-xs text-slate-500">
                          {plan.description}
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {money(plan.price)}
                    </td>
                    <td className="px-5 py-4">
                      {plan.durationValue} {plan.durationUnit}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                          plan.isActive
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"
                            : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"
                        }`}
                      >
                        {plan.isActive ? "Active" : "Disabled"}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openEdit(plan)}
                          aria-label={`Edit ${plan.name}`}
                          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          type="button"
                          role="switch"
                          aria-checked={Boolean(plan.isActive)}
                          aria-label={`${plan.isActive ? "Disable" : "Enable"} ${plan.name}`}
                          onClick={() => handleToggle(plan)}
                          disabled={saving}
                          className={`relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 dark:focus:ring-offset-[#0b1728] ${
                            plan.isActive
                              ? "bg-cyan-500 dark:bg-cyan-400"
                              : "bg-slate-300 dark:bg-slate-600"
                          }`}
                        >
                          <span
                            className={`inline-block h-5 w-5 transform rounded-full bg-white shadow transition-transform duration-200 ${
                              plan.isActive ? "translate-x-6" : "translate-x-1"
                            }`}
                          />
                        </button>
                        <button
                          type="button"
                          onClick={() => openDeleteModal(plan)}
                          disabled={deleting}
                          aria-label={`Delete ${plan.name}`}
                          title="Delete Plan"
                          className="rounded-lg border border-red-200 p-2 text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50 dark:border-red-900/50 dark:text-red-400 dark:hover:bg-red-950/30"
                        >
                          {deletingPlanId === plan._id ? (
                            <RefreshCw size={16} className="animate-spin" />
                          ) : (
                            <Trash2 size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-3 sm:p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-form-title"
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-2xl sm:max-h-[calc(100dvh-2rem)] sm:p-6 dark:border-slate-800 dark:bg-[#0b1728]"
          >
            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2
                  id="plan-form-title"
                  className="text-xl font-bold text-slate-900 dark:text-white"
                >
                  {editingPlan ? "Edit Plan" : "Add New Plan"}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Configure the plan details below.
                </p>
              </div>
              <button
                type="button"
                onClick={closeModal}
                disabled={saving}
                aria-label="Close form"
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="plan-name"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Plan name
                </label>
                <input
                  id="plan-name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                />
              </div>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label
                    htmlFor="plan-price"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Price (₹)
                  </label>
                  <input
                    id="plan-price"
                    type="number"
                    required
                    min="0"
                    step="0.01"
                    value={form.price}
                    onChange={(e) =>
                      setForm({ ...form, price: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                  />
                </div>
                <div>
                  <label
                    htmlFor="plan-duration"
                    className="mb-1.5 block text-sm font-medium"
                  >
                    Duration value
                  </label>
                  <input
                    id="plan-duration"
                    type="number"
                    required
                    min="1"
                    step="1"
                    value={form.durationValue}
                    onChange={(e) =>
                      setForm({ ...form, durationValue: e.target.value })
                    }
                    className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="plan-unit"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Duration unit
                </label>
                <select
                  id="plan-unit"
                  value={form.durationUnit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      durationUnit: e.target.value,
                    }))
                  }
                  aria-label="Duration unit"
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                >
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                  <option value="years">Years</option>
                </select>
              </div>

              <div>
                <label
                  htmlFor="plan-description"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Description
                </label>
                <textarea
                  id="plan-description"
                  rows={2}
                  maxLength={500}
                  value={form.description}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                />
              </div>

              <div>
                <label
                  htmlFor="plan-features"
                  className="mb-1.5 block text-sm font-medium"
                >
                  Features (one per line)
                </label>
                <textarea
                  id="plan-features"
                  rows={3}
                  value={form.features}
                  onChange={(e) =>
                    setForm({ ...form, features: e.target.value })
                  }
                  placeholder={
                    "Premium profile\nCustom QR code\nPriority support"
                  }
                  className="w-full rounded-xl border border-slate-200 bg-transparent px-3 py-2.5 outline-none focus:border-cyan-500 dark:border-slate-700"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl bg-slate-50 p-3 dark:bg-slate-900/60">
                <div>
                  <p className="text-sm font-semibold">Plan availability</p>
                  <p className="text-xs text-slate-500">
                    Active plans can be shown to customers.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={form.isActive}
                  onChange={(e) =>
                    setForm({ ...form, isActive: e.target.checked })
                  }
                  aria-label="Plan active"
                  className="h-4 w-4 accent-cyan-500"
                />
              </div>

              <div className="flex flex-col-reverse gap-2 pt-2 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  onClick={closeModal}
                  disabled={saving}
                  className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold sm:w-auto dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="min-h-11 w-full rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-white disabled:opacity-60 sm:w-auto"
                >
                  {saving
                    ? "Saving..."
                    : editingPlan
                      ? "Save Changes"
                      : "Create Plan"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {deleteModal.open && (
        <div
          className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/60 p-3 backdrop-blur-sm sm:p-4"
          onClick={closeDeleteModal}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-plan-title"
            aria-describedby="delete-plan-description"
            onClick={(event) => event.stopPropagation()}
            className="my-auto max-h-[calc(100dvh-1.5rem)] w-full max-w-md overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl sm:max-h-[calc(100dvh-2rem)] dark:border-slate-800 dark:bg-[#0b1728]"
          >
            <div className="flex items-center justify-between border-b border-slate-100 p-4 sm:p-5 dark:border-slate-800">
              <h2
                id="delete-plan-title"
                className="text-lg font-bold text-slate-900 dark:text-white"
              >
                Delete Plan
              </h2>
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                aria-label="Close delete confirmation"
                className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-slate-800"
              >
                <X size={20} />
              </button>
            </div>

            <div className="space-y-3 p-4 sm:p-5">
              <p
                id="delete-plan-description"
                className="text-sm leading-6 text-slate-600 dark:text-slate-300"
              >
                Are you sure you want to delete{" "}
                <span className="font-semibold text-slate-900 dark:text-white">
                  &quot;{deleteModal.plan?.name}&quot;
                </span>
                ? This action cannot be undone.
              </p>
            </div>

            <div className="flex flex-col-reverse gap-2 border-t border-slate-100 p-4 sm:flex-row sm:justify-end sm:p-5 dark:border-slate-800">
              <button
                type="button"
                onClick={closeDeleteModal}
                disabled={deleting}
                className="min-h-11 w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-cyan-500 disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto dark:border-slate-700 dark:hover:bg-slate-800"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-bold text-white transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto dark:focus:ring-offset-[#0b1728]"
              >
                {deleting && deleteModal.plan?._id === deletingPlanId ? (
                  <RefreshCw size={16} className="animate-spin" />
                ) : (
                  <Trash2 size={16} />
                )}
                {deleting ? "Deleting..." : "Delete Plan"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
