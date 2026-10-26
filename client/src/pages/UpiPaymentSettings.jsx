import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchMyPaymentSettings,
  savePaymentSettings,
  clearPaymentSettingsMessage,
} from "../redux/slice/paymentSettingsSlice";
import {
  IndianRupee,
  Upload,
  Camera,
  Save,
  Clock3,
  CheckCircle2,
  AlertCircle,
  QrCode,
  ShieldCheck,
  X,
} from "lucide-react";

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

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  const [qrFile, setQrFile] = useState(null);
  const [qrPreview, setQrPreview] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  const status = settings?.status || "not_configured";
  const rejectionReason = settings?.rejectionReason || "";
  const savedQrUrl = settings?.qrImage?.url || "";

  useEffect(() => {
    dispatch(fetchMyPaymentSettings());
  }, [dispatch]);

  useEffect(() => {
    if (!settings) return;

    setUpiId(settings.upiId || "");
    setQrPreview(settings.qrImage?.url || "");
    setQrFile(null);
  }, [settings]);

  useEffect(() => {
    return () => {
      if (qrPreview.startsWith("blob:")) {
        URL.revokeObjectURL(qrPreview);
      }
    };
  }, [qrPreview]);

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

  const handleQrUpload = (event) => {
    const file = event.target.files?.[0];
    event.target.value = "";

    if (!file) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(file.type)) {
      setFormError("Please upload a JPG, PNG or WEBP image.");
      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setFormError("Image size must not exceed 5 MB.");
      return;
    }

    setQrFile(file);
    setQrPreview(URL.createObjectURL(file));
    setFormError("");
    setNotice("");
  };

  const removeQr = () => {
    setQrFile(null);
    setQrPreview(savedQrUrl);
    setFormError("");
    setNotice("");
    dispatch(clearPaymentSettingsMessage());
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

    const formData = new FormData();
    formData.append("upiId", normalizedUpiId);

    if (qrFile) formData.append("qrImage", qrFile);

    try {
      await dispatch(savePaymentSettings(upiId)).unwrap();
      setQrFile(null);
      setNotice("Payment settings saved and submitted for admin approval.");
    } catch {
      // API error Redux state mein available hai.
    }
  };

  const statusConfig = {
    not_configured: {
      label: "Setup Pending",
      className: "border-[#38516e] bg-[#132942] text-slate-300",
      Icon: AlertCircle,
    },
    pending: {
      label: "Pending Approval",
      className: "border-amber-400/25 bg-amber-400/[0.08] text-amber-200",
      Icon: Clock3,
    },
    approved: {
      label: "Approved",
      className: "border-emerald-400/25 bg-emerald-400/[0.08] text-emerald-200",
      Icon: CheckCircle2,
    },
    rejected: {
      label: "Rejected",
      className: "border-red-400/25 bg-red-400/[0.08] text-red-200",
      Icon: AlertCircle,
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.not_configured;

  const StatusIcon = currentStatus.Icon;

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
                  Configure your business UPI details and submit them for
                  administrator approval.
                </p>
              </div>
            </div>

            <div
              className={`inline-flex w-fit shrink-0 items-center gap-2 rounded-full border px-4 py-2.5 text-xs font-bold ${currentStatus.className}`}
            >
              <StatusIcon size={16} />
              {currentStatus.label}
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

              {/* Optional QR upload */}
              <section className="min-w-0 rounded-2xl border border-[#29435f] bg-[#0b1b30]/70 p-4 sm:p-6">
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754]">
                    <QrCode size={19} className="text-cyan-300" />
                  </div>

                  {/* <div>
                    <h2 className="text-base font-bold">
                      Payment QR / Standee Image
                    </h2>
                    <p className="mt-1 text-xs leading-5 text-slate-300">
                      Optionally upload your existing business QR code or
                      counter standee.
                    </p>
                  </div> */}
                </div>

                <label
                  htmlFor="payment-qr-upload"
                  className="mt-6 flex min-h-56 cursor-pointer flex-col items-center justify-center rounded-2xl border border-dashed border-[#38516e] bg-[#10243b] p-5 text-center transition hover:border-cyan-300/50 hover:bg-[#132942]"
                >
                  {qrPreview ? (
                    <img
                      src={qrPreview}
                      alt="Payment QR preview"
                      className="max-h-48 max-w-full rounded-xl object-contain"
                    />
                  ) : (
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#193754]">
                      <Camera size={27} className="text-cyan-300" />
                    </div>
                  )}

                  <span className="mt-4 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-2.5 text-xs font-bold text-[#071729] transition hover:bg-cyan-200">
                    <Upload size={15} />
                    {qrPreview ? "Choose Another Image" : "Upload Image"}
                  </span>

                  <span className="mt-2 text-[10px] leading-5 text-slate-400">
                    JPG, PNG or WEBP · Maximum 5 MB
                  </span>

                  <input
                    id="payment-qr-upload"
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    className="sr-only"
                    onChange={handleQrUpload}
                  />
                </label>

                {qrFile && (
                  <div className="mt-3 flex items-center gap-2 rounded-xl border border-[#29435f] bg-[#132942] p-3">
                    <QrCode size={17} className="shrink-0 text-cyan-300" />

                    <span className="min-w-0 flex-1 truncate text-xs text-slate-200">
                      {qrFile.name}
                    </span>

                    <button
                      type="button"
                      onClick={removeQr}
                      aria-label="Remove QR image"
                      className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-slate-300 transition hover:bg-red-400/10 hover:text-red-300"
                    >
                      <X size={15} />
                    </button>
                  </div>
                )}

                <div className="mt-5 rounded-xl border border-[#29435f] bg-[#10243b] p-4">
                  <div className="flex items-start gap-3">
                    <ShieldCheck size={19} className="shrink-0 text-cyan-300" />

                    <div>
                      <p className="text-xs font-bold text-slate-200">
                        Admin approval required
                      </p>
                      <p className="mt-1 text-[11px] leading-5 text-slate-400">
                        Your payment details must be approved before the public
                        profile can accept payments.
                      </p>
                    </div>
                  </div>
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

            {status === "rejected" && rejectionReason && (
              <div
                role="alert"
                className="mt-4 rounded-xl border border-red-400/25 bg-red-400/[0.08] px-4 py-3"
              >
                <p className="text-xs font-bold text-red-200">
                  Admin's rejection reason
                </p>
                <p className="mt-1 text-xs leading-5 text-red-100">
                  {rejectionReason}
                </p>
              </div>
            )}

            {/* Footer actions */}
            <footer className="mt-7 flex flex-col gap-4 border-t border-[#29435f] pt-6 sm:flex-row sm:items-center sm:justify-between">
              <p className="max-w-md text-[11px] leading-5 text-slate-400">
                Changes will require admin review before payment functionality
                can be enabled on your public mini website.
              </p>

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

        <p className="mt-5 text-center text-[10px] leading-5 text-slate-400">
          Secure business settings · Payment activation is controlled by
          administrator approval.
        </p>
      </div>
    </main>
  );
}
