
import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  Calendar,
  Clock,
  Wallet,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  X,
  QrCode,
  Download,
  ExternalLink,
  ArrowRight,
  Zap,
  Upload,
  Image as ImageIcon,
  Save,
  Loader2,
  CreditCard,
  IndianRupee,
  CheckCircle2,
  Info,
} from "lucide-react";

const BUSINESS_NAME = "ankit's Business";

const BUSINESS_IMAGE =
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=400&auto=format&fit=crop&q=80";

const DEFAULT_UPI_ID = "yourname@paytm";

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000, 5000];

const QUICK_HANDLES = [
  "@okaxis",
  "@okhdfcbank",
  "@oksbi",
  "@paytm",
  "@ybl",
  "@ibl",
  "@jio",
  "@airtelpay",
  "@federalbank",
];

const SUPPORTED_APPS = [
  "Google Pay",
  "PhonePe",
  "Paytm",
  "BHIM UPI",
  "CRED",
  "All Bank Apps",
];

const Payment = () => {
  const [upiId, setUpiId] = useState(DEFAULT_UPI_ID);
  const [qrCode, setQrCode] = useState(null);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [notice, setNotice] = useState("");

  const merchantUPI = upiId.trim() || DEFAULT_UPI_ID;
  const payableAmount = Number(customAmount || amount || 0);

  const upiLink = useMemo(() => {
    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: BUSINESS_NAME,
      cu: "INR",
    });

    if (payableAmount > 0) {
      params.set("am", payableAmount.toFixed(2));
    }

    params.set("tn", `Payment to ${BUSINESS_NAME}`);

    return `upi://pay?${params.toString()}`;
  }, [merchantUPI, payableAmount]);

  const generatedQR = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
      upiLink
    )}`;
  }, [upiLink]);

  useEffect(() => {
    if (!paymentOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        setPaymentOpen(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [paymentOpen]);

  useEffect(() => {
    return () => {
      if (qrCode?.startsWith("blob:")) {
        URL.revokeObjectURL(qrCode);
      }
    };
  }, [qrCode]);

  const handleQRUpload = (event) => {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setNotice("Please select a valid image file.");
      event.target.value = "";
      return;
    }

    if (qrCode?.startsWith("blob:")) {
      URL.revokeObjectURL(qrCode);
    }

    setQrCode(URL.createObjectURL(file));
    setNotice("QR image selected successfully.");
    event.target.value = "";
  };

  const handleCopy = async (value = merchantUPI) => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setNotice("Copied to clipboard.");

      window.setTimeout(() => setCopied(false), 2000);
      window.setTimeout(() => setNotice(""), 2500);
    } catch {
      setNotice("Copy failed. Please copy the text manually.");
    }
  };

  const handleSave = () => {
    if (!upiId.trim() || !upiId.includes("@")) {
      setNotice("Please enter a valid UPI ID, for example name@paytm.");
      return;
    }

    setSaving(true);
    setSaved(false);
    setNotice("");

    window.setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setNotice(
        "Demo save complete. Connect your backend to permanently save settings."
      );

      window.setTimeout(() => {
        setSaved(false);
        setNotice("");
      }, 3000);
    }, 800);
  };

  const handleOpenUPI = () => {
    if (!merchantUPI.includes("@") || payableAmount <= 0 || payableAmount > 100000) {
      setNotice("Please enter a valid UPI ID and payment amount.");
      return;
    }

    window.location.href = upiLink;
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(generatedQR);

      if (!response.ok) {
        throw new Error("QR download failed");
      }

      const blob = await response.blob();
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = objectUrl;
      link.download = "ankits-business-payment-qr.png";

      document.body.appendChild(link);
      link.click();
      link.remove();

      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    } catch {
      window.open(generatedQR, "_blank", "noopener,noreferrer");
      setNotice("QR opened in a new tab. Save the image from there.");
    }
  };

  const validPayment =
    merchantUPI.includes("@") &&
    payableAmount > 0 &&
    payableAmount <= 100000;

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#0b1b30] text-white">
      {/* Background glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-cyan-400/[0.07] blur-[120px]" />
        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-blue-500/[0.07] blur-[120px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.5) 1px, transparent 1px)",
            backgroundSize: "42px 42px",
          }}
        />
      </div>

      <main className="relative mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8">
        {/* Page heading */}
        <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-cyan-300">
              <Wallet size={16} />
              Payments &amp; Subscription
            </div>

            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              Payment Dashboard
            </h1>

            <p className="mt-2 text-sm text-slate-300">
              Manage your subscription and receive direct UPI payments.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setPaymentOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-bold text-[#080b16] shadow-lg shadow-cyan-950/30 transition hover:-translate-y-0.5 hover:from-cyan-200 hover:to-blue-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cyan-300"
          >
            <CreditCard size={17} />
            Pay Now
            <ArrowRight size={16} />
          </button>
        </div>

        {/* Subscription card */}
        <section className="overflow-hidden rounded-3xl border border-[#29435f] bg-[#0b1b30]/95 shadow-2xl shadow-black/20">
          <div className="h-1 bg-gradient-to-r from-transparent via-cyan-300 to-blue-400" />

          <div className="p-5 sm:p-7">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="flex items-start gap-4">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <BadgeCheck size={25} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-xl font-bold sm:text-2xl">
                      1 Year Annual Plan
                    </h2>

                    <span className="rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1 text-xs font-semibold text-cyan-200">
                      Active Subscription
                    </span>
                  </div>

                  <p className="mt-2 text-2xl font-bold text-cyan-300">
                    ₹499
                  </p>

                  <p className="mt-2 max-w-xl text-sm leading-relaxed text-slate-300">
                    Your Mini Website Card is fully verified, online, and
                    accessible 24/7 across all devices.
                  </p>
                </div>
              </div>

              <div className="min-w-48 rounded-2xl border border-[#38516e] bg-[#132942] p-4">
                <p className="text-xs font-medium text-slate-300">
                  Subscription Validity
                </p>

                <p className="mt-2 text-2xl font-bold">
                  364{" "}
                  <span className="text-sm font-medium text-slate-300">
                    days left
                  </span>
                </p>
              </div>
            </div>

            <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <StatBox label="Total Paid" value="₹499" icon={Wallet} />
              <StatBox label="Activated" value="10 Oct 2026" icon={Calendar} />
              <StatBox label="Valid Until" value="10 Oct 2027" icon={Clock} />
              <StatBox label="Payment Status" value="100% Paid" icon={ShieldCheck} />
            </div>
          </div>
        </section>

        {/* UPI settings */}
        <section className="mt-6 rounded-3xl border border-[#29435f] bg-[#0b1b30]/95 p-5 shadow-xl shadow-black/10 sm:p-7">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                <Wallet size={21} />
              </div>

              <div>
                <h2 className="text-lg font-bold sm:text-xl">
                  UPI &amp; Online Payment Settings
                </h2>

                <p className="mt-1 text-sm text-slate-300">
                  Receive direct bank-to-bank payments from your customers.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-full border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-200">
              Configure your UPI
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            {/* UPI ID configuration */}
            <div className="rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5">
              <label
                htmlFor="merchant-upi"
                className="text-sm font-semibold text-white"
              >
                Merchant UPI ID (VPA)
              </label>

              <p className="mt-1 text-sm leading-relaxed text-slate-300">
                Enter your real UPI ID to receive payments directly into your
                linked bank account.
              </p>

              <input
                id="merchant-upi"
                type="text"
                value={upiId}
                onChange={(event) =>
                  setUpiId(event.target.value.trimStart())
                }
                placeholder="yourname@paytm"
                className="mt-4 w-full rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-sm text-white outline-none transition placeholder:text-slate-400 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
              />

              <div className="mt-4">
                <p className="mb-2 text-xs font-semibold tracking-wider text-slate-400">
                  QUICK UPI HANDLES
                </p>

                <div className="flex flex-wrap gap-2">
                  {QUICK_HANDLES.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        const base =
                          merchantUPI.split("@")[0] || "yourname";

                        setUpiId(`${base}${handle}`);
                      }}
                      className="rounded-lg border border-[#38516e] bg-[#132942] px-3 py-2 text-xs font-medium text-slate-200 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-200"
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-5 border-t border-[#29435f] pt-4">
                <p className="mb-3 text-xs font-semibold tracking-wider text-slate-400">
                  SUPPORTED PAYMENT APPS
                </p>

                <div className="flex flex-wrap gap-2">
                  {SUPPORTED_APPS.map((app) => (
                    <span
                      key={app}
                      className="rounded-lg border border-[#38516e]/70 bg-[#132942] px-2.5 py-1.5 text-xs text-slate-300"
                    >
                      {app}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Customer preview */}
            <div className="rounded-2xl border border-[#38516e] bg-gradient-to-br from-cyan-300/[0.08] to-blue-400/[0.04] p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-cyan-300">
                Customer Preview
              </p>

              <h3 className="mt-2 text-lg font-bold">
                How customers pay you
              </h3>

              <p className="mt-1 text-sm text-slate-300">
                Preview the payment popup customers will see on your digital
                visiting card.
              </p>

              <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#080b16] p-4">
                <div className="flex items-center gap-3">
                  <img
                    src={BUSINESS_IMAGE}
                    alt={BUSINESS_NAME}
                    className="h-12 w-12 rounded-xl border border-[#38516e] object-cover"
                  />

                  <div className="min-w-0 flex-1">
                    <p className="truncate font-bold">{BUSINESS_NAME}</p>

                    <p className="mt-1 flex items-center gap-1 text-xs text-cyan-300">
                      <BadgeCheck size={13} />
                      Verified
                    </p>
                  </div>
                </div>

                <div className="mt-4 rounded-xl border border-[#38516e] bg-[#132942] p-3">
                  <p className="text-xs text-slate-400">Merchant UPI ID</p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    {merchantUPI}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setPaymentOpen(true)}
                  className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3 text-sm font-bold text-[#080b16] transition hover:from-cyan-200 hover:to-blue-300"
                >
                  <Smartphone size={17} />
                  Pay Now
                  <ArrowRight size={16} />
                </button>
              </div>

              <div className="mt-4 flex items-start gap-2 text-sm leading-relaxed text-slate-300">
                <Zap size={16} className="mt-0.5 shrink-0 text-cyan-300" />
                <p>
                  Customers can select an amount, scan a QR, or open a
                  compatible UPI app.
                </p>
              </div>
            </div>
          </div>

          {/* Optional uploaded QR */}
          <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#080b16] p-5">
            <div className="flex items-start gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                <QrCode size={20} />
              </div>

              <div>
                <h3 className="font-bold">
                  Store Counter Standee / QR Code Image
                  <span className="ml-2 text-xs font-medium text-slate-400">
                    Optional
                  </span>
                </h3>

                <p className="mt-1 text-sm leading-relaxed text-slate-300">
                  Upload your existing payment QR image for display. The
                  payment popup generates a separate QR from the configured
                  UPI ID and selected amount.
                </p>
              </div>
            </div>

            <div className="mt-4 flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex h-28 w-28 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#38516e] bg-[#132942]">
                {qrCode ? (
                  <img
                    src={qrCode}
                    alt="Uploaded payment QR"
                    className="h-full w-full object-contain p-1"
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-slate-400">
                    <ImageIcon size={25} />
                    <span className="text-xs">No image</span>
                  </div>
                )}
              </div>

              <div>
                <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-cyan-200">
                  <Upload size={16} />
                  {qrCode ? "Change QR Image" : "Upload QR Image"}
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleQRUpload}
                  />
                </label>

                {qrCode && (
                  <button
                    type="button"
                    onClick={() => {
                      if (qrCode.startsWith("blob:")) {
                        URL.revokeObjectURL(qrCode);
                      }
                      setQrCode(null);
                    }}
                    className="ml-3 text-sm font-medium text-cyan-300 transition hover:text-cyan-200"
                  >
                    Remove
                  </button>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  Supported formats: JPG, PNG, WebP.
                </p>
              </div>
            </div>
          </div>

          {/* Save settings */}
          <div className="mt-6 flex flex-col gap-4 border-t border-[#29435f] pt-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-2 text-sm text-slate-300">
              <Info size={17} className="mt-0.5 shrink-0 text-cyan-300" />
              <p>
                Save your settings after changing your UPI ID. This demo
                shows the save interaction; connect your backend to persist
                settings.
              </p>
            </div>

            <button
              type="button"
              onClick={handleSave}
              disabled={saving}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-5 py-3 text-sm font-bold text-[#080b16] transition hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? (
                <Loader2 size={17} className="animate-spin" />
              ) : saved ? (
                <CheckCircle2 size={17} />
              ) : (
                <Save size={17} />
              )}
              {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
            </button>
          </div>

          {notice && !paymentOpen && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-4 py-3 text-sm text-cyan-100"
            >
              {notice}
            </p>
          )}
        </section>
      </main>

      {/* Payment Modal */}
      {paymentOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setPaymentOpen(false);
            }
          }}
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="payment-modal-title"
            className="relative my-auto w-full max-w-2xl overflow-hidden rounded-3xl border border-[#38516e] bg-[#0b1b30] shadow-2xl shadow-black/60"
          >
            <div className="h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-blue-400" />

            <button
              type="button"
              onClick={() => setPaymentOpen(false)}
              aria-label="Close payment popup"
              className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white"
            >
              <X size={18} />
            </button>

            <div className="max-h-[88vh] overflow-y-auto p-5 sm:p-7">
              {/* Merchant identity */}
              <div className="flex items-center gap-3 pr-10">
                <img
                  src={BUSINESS_IMAGE}
                  alt={BUSINESS_NAME}
                  className="h-14 w-14 rounded-2xl border border-[#38516e] object-cover"
                />

                <div className="min-w-0">
                  <h2
                    id="payment-modal-title"
                    className="break-words text-lg font-bold sm:text-xl"
                  >
                    {BUSINESS_NAME}
                  </h2>

                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                    <BadgeCheck size={13} />
                    Verified
                  </span>
                </div>
              </div>

              {/* Merchant UPI */}
              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#38516e] bg-[#132942] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">UPI ID</p>
                  <p className="mt-1 break-all text-sm font-semibold">
                    {merchantUPI}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(merchantUPI)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#38516e] px-3 py-2 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/10"
                >
                  {copied ? (
                    <Check size={15} className="text-cyan-300" />
                  ) : (
                    <Copy size={15} />
                  )}
                  {copied ? "Copied" : "Copy UPI"}
                </button>
              </div>

              {/* Amount selector */}
              <div className="mt-6">
                <label
                  htmlFor="payment-amount"
                  className="text-sm font-semibold text-white"
                >
                  Amount to Pay (INR ₹)
                </label>

                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#38516e] bg-[#080b16] px-4 py-3 transition focus-within:border-cyan-300 focus-within:ring-4 focus-within:ring-cyan-300/10">
                  <IndianRupee size={22} className="text-cyan-300" />
                  <input
                    id="payment-amount"
                    type="number"
                    min="1"
                    max="100000"
                    step="1"
                    value={customAmount || amount}
                    onChange={(event) => {
                      setCustomAmount(event.target.value);
                      setAmount("");
                    }}
                    placeholder="Enter amount"
                    className="w-full min-w-0 bg-transparent text-2xl font-bold text-white outline-none placeholder:text-slate-500"
                  />
                </div>

                <div className="mt-3">
                  <p className="mb-2 text-xs font-medium tracking-wider text-slate-400">
                    QUICK AMOUNTS
                  </p>

                  <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {QUICK_AMOUNTS.map((value) => {
                      const selected =
                        Number(customAmount || amount) === value;

                      return (
                        <button
                          type="button"
                          key={value}
                          onClick={() => {
                            setAmount(String(value));
                            setCustomAmount("");
                          }}
                          className={`rounded-xl border px-2 py-2.5 text-sm font-semibold transition ${
                            selected
                              ? "border-cyan-300 bg-cyan-300/15 text-cyan-200"
                              : "border-[#38516e] bg-[#132942] text-slate-300 hover:border-cyan-300/40 hover:bg-cyan-300/[0.07]"
                          }`}
                        >
                          ₹{value.toLocaleString("en-IN")}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {payableAmount > 0 && payableAmount <= 100000 && (
                  <p className="mt-3 text-sm text-slate-300">
                    Amount to pay:{" "}
                    <span className="font-bold text-cyan-300">
                      ₹{payableAmount.toLocaleString("en-IN")}
                    </span>
                  </p>
                )}
              </div>

              {/* QR payment panel */}
              <div className="mt-6 grid gap-5 sm:grid-cols-[1fr_1.1fr]">
                <div className="rounded-2xl border border-[#dbe3ed] bg-white p-4 text-center text-slate-900">
                  <div className="flex items-center justify-center gap-2 text-sm font-bold">
                    <QrCode size={17} />
                    Scan &amp; Pay QR
                  </div>

                  <div className="mx-auto mt-4 flex aspect-square w-full max-w-[230px] items-center justify-center overflow-hidden rounded-xl bg-white p-2">
                    {validPayment ? (
                      <img
                        src={generatedQR}
                        alt="UPI payment QR code"
                        className="h-full w-full object-contain"
                      />
                    ) : (
                      <div className="px-3 text-sm text-slate-600">
                        Enter a valid UPI ID and amount to generate the QR.
                      </div>
                    )}
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-500">
                    Scan using any compatible UPI app
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                    <Smartphone size={21} />
                  </div>

                  <h3 className="mt-3 text-lg font-bold">
                    Scan with any UPI Scanner
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Point PhonePe, Google Pay, Paytm, or BHIM scanner at this
                    code to pay the selected amount.
                  </p>

                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      disabled={!validPayment}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-sm font-semibold transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <Download size={16} />
                      Download QR
                    </button>

                    <button
                      type="button"
                      onClick={handleOpenUPI}
                      disabled={!validPayment}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3 text-sm font-bold text-[#080b16] transition hover:from-cyan-200 hover:to-blue-300 disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      <ExternalLink size={16} />
                      Open in App
                    </button>
                  </div>

                  <p className="mt-3 text-xs leading-relaxed text-slate-400">
                    Open in App attempts to launch a compatible UPI app on
                    your device.
                  </p>
                </div>
              </div>

              {/* Bank transfer note */}
              <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                    <ShieldCheck size={19} />
                  </div>

                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      Direct Bank-to-Bank Transfer via UPI
                    </p>

                    <p className="mt-1 text-sm leading-relaxed text-slate-300">
                      Use your UPI app to authorize the transfer. Applicable
                      bank or payment-app terms may vary.
                    </p>
                  </div>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                Payments are completed in your UPI app. This page does not
                independently verify whether a payment succeeded.
              </p>

              {notice && (
                <p
                  role="status"
                  className="mt-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-center text-sm text-cyan-100"
                >
                  {notice}
                </p>
              )}
            </div>
          </section>
        </div>
      )}

      <style>{`
        * {
          box-sizing: border-box;
        }

        button:focus-visible,
        input:focus-visible {
          outline: 2px solid rgba(103, 232, 249, 0.85);
          outline-offset: 3px;
        }
      `}</style>
    </div>
  );
};

const StatBox = ({ label, value, icon: Icon }) => {
  return (
    <div className="rounded-2xl border border-[#29435f] bg-[#132942]/80 p-4 transition hover:border-cyan-300/40">
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
          <Icon size={19} />
        </div>

        <div className="min-w-0">
          <p className="text-xs font-medium text-slate-400">{label}</p>
          <p className="mt-1 break-words text-sm font-bold text-white">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
};

export default Payment;