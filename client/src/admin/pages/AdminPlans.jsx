import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Plus,
  RefreshCw,
  Pencil,
  Power,
  X,
  Layers,
  CheckCircle2,
} from "lucide-react";
import {
  fetchAdminPlans,
  createAdminPlan,
  updateAdminPlan,
  toggleAdminPlanStatus,
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
  const { plans, loading, saving, error, successMessage } = useSelector(
    (state) => state.adminPlans,
  );

  const [modalOpen, setModalOpen] = useState(false);
  const [editingPlan, setEditingPlan] = useState(null);
  const [form, setForm] = useState(emptyForm);
  const [search, setSearch] = useState("");

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
    const action = plan.isActive ? "disable" : "enable";
    if (!window.confirm(`${action} "${plan.name}"?`)) return;

    try {
      await dispatch(toggleAdminPlanStatus(plan._id)).unwrap();
    } catch {
      // Error is displayed from Redux state.
    }
  };

  return (
    <div className="space-y-6">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            PLAN MANAGEMENT
          </p>
          <h1 className="mt-2 text-2xl font-bold text-slate-900 dark:text-white sm:text-3xl">
            Subscription Plans
          </h1>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Create plans and manage their availability.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => dispatch(fetchAdminPlans())}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-[#0b1728] dark:text-white"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            Refresh
          </button>
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-bold text-slate-950 hover:bg-cyan-400"
          >
            <Plus size={17} /> Add Plan
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {[
          ["Total plans", plans.length],
          ["Active plans", plans.filter((p) => p.isActive).length],
          ["Disabled plans", plans.filter((p) => !p.isActive).length],
        ].map(([label, value]) => (
          <div
            key={label}
            className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]"
          >
            <div className="flex items-center justify-between">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {label}
              </p>
              <Layers size={18} className="text-cyan-500" />
            </div>
            <p className="mt-3 text-2xl font-bold text-slate-900 dark:text-white">
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
      {successMessage && (
        <div
          role="status"
          className="rounded-xl bg-emerald-50 p-3 text-sm text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300"
        >
          {successMessage}
        </div>
      )}

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="border-b border-slate-200 p-4 dark:border-slate-800">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search plans..."
            aria-label="Search plans"
            className="w-full rounded-xl border border-slate-200 bg-transparent px-4 py-2.5 text-sm outline-none focus:border-cyan-500 sm:max-w-sm dark:border-slate-700"
          />
        </div>

        {loading && plans.length === 0 ? (
          <div className="flex min-h-48 items-center justify-center gap-2 text-sm text-slate-500">
            <RefreshCw size={17} className="animate-spin" /> Loading plans...
          </div>
        ) : visiblePlans.length === 0 ? (
          <div className="p-10 text-center">
            <Layers className="mx-auto text-slate-400" size={30} />
            <p className="mt-3 font-semibold text-slate-800 dark:text-white">
              No plans found
            </p>
            <p className="mt-1 text-sm text-slate-500">
              Add a plan or try another search.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
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
                          onClick={() => handleToggle(plan)}
                          disabled={saving}
                          aria-label={`${plan.isActive ? "Disable" : "Enable"} ${plan.name}`}
                          className="rounded-lg border border-slate-200 p-2 hover:bg-slate-50 disabled:opacity-50 dark:border-slate-700 dark:hover:bg-slate-800"
                        >
                          <Power size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {modalOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center overflow-y-auto bg-black/60 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="plan-form-title"
            className="my-auto w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-5 shadow-2xl dark:border-slate-800 dark:bg-[#0b1728] sm:p-6"
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
                  value={form.durationUnit}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      durationUnit: e.target.value,
                    }))
                  }
                  className="..."
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
                  className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold dark:border-slate-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="rounded-xl bg-cyan-500 px-5 py-2.5 text-sm font-bold text-slate-950 disabled:opacity-60"
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
    </div>
  );
}
