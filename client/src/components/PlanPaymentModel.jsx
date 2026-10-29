
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchActivePlans } from "../redux/slice/adminPlansSlice";

const formatPrice = (price) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
  }).format(Number(price) || 0);

const getDuration = (plan) => {
  const value = Number(plan.durationValue) || 1;
  const unit = String(plan.durationUnit || "month").toLowerCase();

  return `${value} ${unit}${value > 1 ? "s" : ""}`;
};

export default function PlanPaymentModal({
  isOpen,
  onClose,
  subdomain,
  onProceed,
}) {
  const dispatch = useDispatch();

  // Assumes the reducer is registered as state.adminPlans.
  const {
    activePlans = [],
    activePlansLoading = false,
    activePlansError = null,
  } = useSelector((state) => state.adminPlans || {});

  const [selectedPlanId, setSelectedPlanId] = useState("");
  const [processing, setProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState("");

  useEffect(() => {
    if (!isOpen) return;

    dispatch(fetchActivePlans());
    setPaymentError("");
  }, [isOpen, dispatch]);

  useEffect(() => {
    if (!activePlans.length) {
      setSelectedPlanId("");
      return;
    }

    setSelectedPlanId((currentId) =>
      activePlans.some((plan) => plan._id === currentId)
        ? currentId
        : activePlans[0]._id
    );
  }, [activePlans]);

  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (event) => {
      if (event.key === "Escape" && !processing) onClose?.();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, processing, onClose]);

  if (!isOpen) return null;

  const selectedPlan = activePlans.find(
    (plan) => plan._id === selectedPlanId
  );

  const handleProceed = async () => {
    if (!selectedPlan || !onProceed || processing) return;

    setProcessing(true);
    setPaymentError("");

    try {
      await onProceed(selectedPlan, subdomain);
    } catch (error) {
      setPaymentError(
        error?.response?.data?.message ||
          error?.message ||
          "Payment start nahi ho paaya."
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center overflow-y-auto bg-slate-950/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (
          event.target === event.currentTarget &&
          !processing
        ) {
          onClose?.();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="plan-modal-title"
        className="my-auto max-h-[94vh] w-full max-w-5xl overflow-y-auto rounded-2xl border border-cyan-400/30 bg-[#081a30] text-slate-100 shadow-2xl shadow-black/50"
      >
        {/* Header */}
        <header className="flex items-center gap-3 border-b border-white/10 p-4 sm:p-6">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-2xl text-cyan-300">
            ♛
          </div>

          <div className="min-w-0 flex-1">
            <h2
              id="plan-modal-title"
              className="text-xl font-bold tracking-tight sm:text-2xl"
            >
              Choose Your Plan
            </h2>
            <p className="mt-1 text-xs text-slate-400 sm:text-sm">
              Apni digital presence ko publish karein
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            aria-label="Close modal"
            className="rounded-lg px-3 py-1 text-3xl leading-none text-slate-400 transition hover:bg-white/5 hover:text-cyan-300 disabled:opacity-50"
          >
            ×
          </button>
        </header>

        {/* Steps */}
        <div className="flex items-start gap-2 border-b border-white/10 px-3 py-5 sm:gap-4 sm:px-7">
          {["Select Plan", "Payment", "Verify", "Publish"].map(
            (step, index) => (
              <div
                key={step}
                className="flex min-w-0 flex-1 items-center gap-2"
              >
                <div className="flex min-w-0 flex-col items-center gap-2">
                  <span
                    className={`flex h-8 w-8 items-center justify-center rounded-full border text-xs font-bold ${
                      index === 0
                        ? "border-cyan-400 bg-cyan-400 text-slate-950"
                        : "border-slate-600 text-slate-400"
                    }`}
                  >
                    {index + 1}
                  </span>
                  <span
                    className={`text-center text-[10px] sm:text-xs ${
                      index === 0
                        ? "font-semibold text-cyan-300"
                        : "text-slate-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>

                {index < 3 && (
                  <div className="mb-5 h-px min-w-2 flex-1 bg-slate-700" />
                )}
              </div>
            )
          )}
        </div>

        <div className="grid grid-cols-1 gap-5 p-4 sm:p-6 lg:grid-cols-[1.6fr_0.9fr]">
          {/* Plans */}
          <div>
            <div className="mb-4 flex items-center justify-between gap-3">
              <h3 className="font-semibold text-slate-100">
                Available Plans
              </h3>

              {!activePlansLoading && (
                <span className="rounded-full bg-cyan-400/10 px-3 py-1 text-xs text-cyan-300">
                  {activePlans.length} plans
                </span>
              )}
            </div>

            {activePlansLoading ? (
              <div className="flex min-h-48 flex-col items-center justify-center gap-3 text-sm text-slate-400">
                <div className="h-8 w-8 animate-spin rounded-full border-2 border-cyan-400/20 border-t-cyan-400" />
                Loading plans...
              </div>
            ) : activePlansError ? (
              <div className="rounded-xl border border-red-400/20 bg-red-400/5 p-5 text-sm text-red-300">
                {typeof activePlansError === "string"
                  ? activePlansError
                  : "Plans load nahi ho paaye."}
                <button
                  type="button"
                  onClick={() => dispatch(fetchActivePlans())}
                  className="mt-3 block rounded-lg border border-red-300/30 px-3 py-2 hover:bg-red-400/10"
                >
                  Try Again
                </button>
              </div>
            ) : activePlans.length === 0 ? (
              <div className="rounded-xl border border-slate-700 p-6 text-center text-sm text-slate-400">
                Abhi koi active plan available nahi hai.
              </div>
            ) : (
              <div className="space-y-3">
                {activePlans.map((plan, index) => {
                  const selected = selectedPlanId === plan._id;
                  const features = Array.isArray(plan.features)
                    ? plan.features
                    : [];

                  return (
                    <button
                      key={plan._id}
                      type="button"
                      aria-pressed={selected}
                      onClick={() => {
                        setSelectedPlanId(plan._id);
                        setPaymentError("");
                      }}
                      className={`w-full rounded-xl border p-4 text-left transition duration-200 ${
                        selected
                          ? "border-cyan-400 bg-cyan-400/[0.07] shadow-lg shadow-cyan-950/20"
                          : "border-slate-700 bg-[#0b2039] hover:border-cyan-400/50"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border text-xl ${
                            selected
                              ? "border-cyan-400/40 bg-cyan-400/10 text-cyan-300"
                              : "border-slate-600 bg-slate-800 text-slate-300"
                          }`}
                        >
                          {index === 0 ? "♛" : index === 1 ? "◇" : "✦"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <h4 className="font-bold text-white">
                              {plan.name}
                            </h4>

                            {index === 0 && (
                              <span className="rounded bg-cyan-400 px-2 py-0.5 text-[9px] font-extrabold text-slate-950">
                                PLAN
                              </span>
                            )}
                          </div>

                          <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                            {plan.description ||
                              "Apne business ko online publish karein."}
                          </p>
                        </div>

                        <span
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border text-xs ${
                            selected
                              ? "border-cyan-400 bg-cyan-400 text-slate-950"
                              : "border-slate-500 text-transparent"
                          }`}
                        >
                          ✓
                        </span>
                      </div>

                      <div className="mt-4 flex flex-wrap items-end justify-between gap-3">
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {features.map((feature, featureIndex) => {
                            const label =
                              typeof feature === "string"
                                ? feature
                                : feature?.name || feature?.title;

                            return label ? (
                              <span
                                key={`${plan._id}-${featureIndex}`}
                                className="text-[11px] text-slate-300"
                              >
                                <span className="mr-1 text-cyan-300">✓</span>
                                {label}
                              </span>
                            ) : null;
                          })}
                        </div>

                        <div className="shrink-0">
                          <strong className="text-lg font-extrabold text-white">
                            {formatPrice(plan.price)}
                          </strong>
                          <span className="ml-1 text-[10px] text-slate-400">
                            / {getDuration(plan)}
                          </span>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            )}

            <div className="mt-4 flex items-center gap-3 rounded-xl border border-slate-700 bg-[#0a1e35] p-4">
              <span className="text-xl text-cyan-300">♧</span>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-slate-200">
                  Secure payment with Razorpay
                </p>
                <p className="mt-1 text-[10px] leading-4 text-slate-400">
                  Payment ko backend se verify karne ke baad hi publish kiya jayega.
                </p>
              </div>
              <span className="text-xs font-extrabold text-slate-300">
                Razorpay
              </span>
            </div>
          </div>

          {/* Summary */}
          <aside className="self-start rounded-xl border border-slate-700 bg-[#091c32] p-5">
            <h3 className="font-bold">Order Summary</h3>

            {selectedPlan ? (
              <>
                <div className="my-5 flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/30 bg-cyan-400/10 text-xl text-cyan-300">
                    ♛
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="break-words text-sm font-semibold">
                      {selectedPlan.name}
                    </p>
                    <p className="mt-1 text-xs text-slate-400">
                      {getDuration(selectedPlan)} plan
                    </p>
                  </div>
                </div>

                <div className="space-y-4 border-y border-slate-700 py-4">
                  <div className="flex items-start justify-between gap-3 text-xs">
                    <span className="text-slate-400">Plan price</span>
                    <strong>{formatPrice(selectedPlan.price)}</strong>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 py-5">
                  <span className="text-sm font-semibold">Total payable</span>
                  <strong className="text-xl font-extrabold text-cyan-300">
                    {formatPrice(selectedPlan.price)}
                  </strong>
                </div>

                <p className="text-[10px] leading-5 text-slate-500">
                  Final amount and applicable taxes, if any, will be
                  determined and validated by the server.
                </p>
              </>
            ) : (
              <p className="py-8 text-sm text-slate-400">
                Select a plan to view the summary.
              </p>
            )}

            <div className="my-5 border-t border-slate-700 pt-5">
              <h4 className="mb-4 text-sm font-semibold">Why Choose Us?</h4>

              {[
                "Secure checkout",
                "Server-verified payment",
                "Publish after verification",
              ].map((item) => (
                <p
                  key={item}
                  className="mb-3 flex gap-2 text-xs text-slate-300"
                >
                  <span className="text-cyan-300">✓</span>
                  {item}
                </p>
              ))}
            </div>

            {paymentError && (
              <p
                role="alert"
                className="mb-4 rounded-lg border border-red-400/30 bg-red-400/5 p-3 text-xs leading-5 text-red-300"
              >
                {paymentError}
              </p>
            )}

            <button
              type="button"
              onClick={handleProceed}
              disabled={
                !selectedPlan ||
                activePlansLoading ||
                processing ||
                !onProceed
              }
              className="flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-400 to-cyan-300 px-4 py-3 text-sm font-extrabold text-slate-950 transition hover:shadow-lg hover:shadow-cyan-400/20 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {processing ? "Processing..." : "Proceed to Payment"}
              {!processing && <span>→</span>}
            </button>

            <p className="mt-3 text-center text-[10px] leading-5 text-slate-500">
              Payment success hone ke baad server verification required hai.
            </p>
          </aside>
        </div>
      </section>
    </div>
  );
}
