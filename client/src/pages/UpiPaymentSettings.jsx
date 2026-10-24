import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyPaymentSettings,
  savePaymentSettings,
  clearPaymentSettingsMessage,
} from "../redux/slice/paymentSettingsSlice";
import { IndianRupee, Save, CheckCircle2 } from "lucide-react";

const BANK_HANDLES = [
  "@okaxis",
  "@okhdfcbank",
  "@oksbi",
  "@paytm",
  "@ybl",
  "@ibl",
  "@icici",
  "@barodampay",
];

const inputClass =
  "w-full rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3.5 text-sm text-white placeholder:text-slate-400/70 outline-none transition focus:border-cyan-300/60 focus:ring-4 focus:ring-cyan-300/[0.07]";

export default function UpiPaymentSettings() {
  const dispatch = useDispatch();
  const {
    data: settings,
    loading,
    saving,
    error: apiError,
    message,
  } = useSelector((state) => state.paymentSettings);

  const [upiId, setUpiId] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    dispatch(fetchMyPaymentSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;

    setUpiId(settings.upiId || "");
  }, [settings]);

  const handleHandleSuggestion = (handle) => {
    const prefix = upiId.trim().split("@")[0];

    if (!prefix) {
      setFormError("Enter the first part of your UPI ID first.");
      return;
    }

    setUpiId(`${prefix}${handle}`);
    setFormError("");
    setNotice("");
  };

  const handleSave = async (event) => {
    event.preventDefault();

    if (saving || loading) return;

    const normalizedUpiId = upiId.trim();

    if (!/^[\w.-]+@[\w.-]+$/.test(normalizedUpiId)) {
      setFormError("Enter a valid UPI ID, for example business@okaxis.");
      return;
    }

    setFormError("");
    setNotice("");
    dispatch(clearPaymentSettingsMessage());

    try {
      await dispatch(savePaymentSettings(normalizedUpiId)).unwrap();
      setNotice("Payment settings saved successfully.");
    } catch {
      // API error Redux state mein available hai.
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1b30] px-4 py-7 text-white sm:px-6 sm:py-9 lg:px-8">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[450px] w-[450px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.08] blur-[150px]" />
        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(148,190,225,1) 1px, transparent 1px), linear-gradient(90deg, rgba(148,190,225,1) 1px, transparent 1px)",
            backgroundSize: "44px 44px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl">
        <section className="overflow-hidden rounded-3xl border border-[#29435f] bg-[#10243b] shadow-2xl shadow-black/10">
          <div className="h-[2px] bg-gradient-to-r from-transparent via-cyan-300 to-transparent" />

          {/* Header */}
          <header className="flex flex-col gap-5 p-5 sm:p-7 lg:flex-row lg:items-center lg:justify-between lg:p-8">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#193754]">
                <IndianRupee size={23} className="text-cyan-300" />
              </div>

              <div>
                <span className="mb-2 inline-flex rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200">
                  Business Settings
                </span>

                <h1 className="text-xl font-bold tracking-tight sm:text-2xl">
                  UPI &amp; Online Payment Settings
                </h1>

                <p className="mt-2 max-w-2xl text-xs leading-6 text-slate-300 sm:text-sm">
                  Configure your business UPI details for customer payments.
                </p>
              </div>
            </div>
          </header>

          <div className="mx-5 border-t border-[#29435f] sm:mx-7 lg:mx-8" />

          <form onSubmit={handleSave} className="p-5 sm:p-7 lg:p-8">
            <div className="grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              {/* UPI settings */}
              <section className="min-w-0 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754]">
                    <IndianRupee size={19} className="text-cyan-300" />
                  </div>

                  <div>
                    <h2 className="text-base font-bold">
                      Merchant UPI ID (VPA)
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Enter the UPI ID where your customers should send their
                      payments.
                    </p>
                  </div>
                </div>

                <label
                  htmlFor="merchant-upi-id"
                  className="mb-2 mt-6 block text-xs font-bold text-slate-200"
                >
                  Your UPI ID <span className="text-cyan-300">*</span>
                </label>

                <input
                  id="merchant-upi-id"
                  type="text"
                  value={upiId}
                  maxLength={100}
                  autoComplete="off"
                  onChange={(event) => {
                    setUpiId(event.target.value);
                    setFormError("");
                    setNotice("");
                  }}
                  placeholder="e.g. yourbusiness@okaxis"
                  className={inputClass}
                />

                <div className="mt-5">
                  <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-slate-400">
                    Quick bank handle suggestions
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {BANK_HANDLES.map((handle) => (
                      <button
                        key={handle}
                        type="button"
                        onClick={() => handleHandleSuggestion(handle)}
                        className="rounded-full border border-[#38516e] bg-[#132942] px-3 py-2 text-[11px] font-semibold text-slate-200 transition hover:border-cyan-300/50 hover:text-cyan-200"
                      >
                        {handle}
                      </button>
                    ))}
                  </div>

                  <p className="mt-2 text-[10px] leading-5 text-slate-400">
                    These are suggestions only. Verify your actual UPI ID with
                    your payment app or bank.
                  </p>
                </div>

                <div className="mt-6 rounded-2xl border border-[#29435f] bg-[#10243b] p-4">
                  <p className="mb-3 text-xs font-bold text-slate-200">
                    Common UPI Apps
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {[
                      "Google Pay",
                      "PhonePe",
                      "Paytm",
                      "BHIM UPI",
                      "CRED",
                      "Other UPI Apps",
                    ].map((app) => (
                      <span
                        key={app}
                        className="rounded-lg border border-[#38516e] bg-[#132942] px-3 py-1.5 text-[10px] font-semibold text-slate-300"
                      >
                        {app}
                      </span>
                    ))}
                  </div>

                  <p className="mt-3 text-[10px] leading-5 text-slate-400">
                    Available apps depend on the customer's device and payment
                    provider.
                  </p>
                </div>
              </section>

            </div>

            {(formError || apiError) && (
              <div
                role="alert"
                className="mt-5 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3 text-xs leading-5 text-red-200"
              >
                {formError || apiError}
              </div>
            )}

            {(message || notice) && (
              <div
                role="status"
                className="mt-5 flex items-start gap-3 rounded-xl border border-emerald-400/25 bg-emerald-400/[0.06] px-4 py-3"
              >
                <CheckCircle2
                  size={17}
                  className="mt-0.5 shrink-0 text-emerald-300"
                />
                <p className="text-xs leading-5 text-slate-200">
                  {message || notice}
                </p>
              </div>
            )}

            {/* Footer actions */}
            <footer className="mt-7 flex justify-end border-t border-[#29435f] pt-6">
              <button
                type="submit"
                disabled={loading || saving}
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3 text-xs font-bold text-[#071729] shadow-lg shadow-cyan-950/20 transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
              >
                <Save size={16} />
                {loading
                  ? "Loading Settings..."
                  : saving
                    ? "Saving..."
                    : "Save Payment Settings"}
              </button>
            </footer>
          </form>
        </section>

      </div>
    </main>
  );
}
