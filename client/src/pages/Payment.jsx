import React, { useEffect, useMemo, useState } from "react";
import {
  BadgeCheck,
  ShieldCheck,
  Smartphone,
  Copy,
  Check,
  X,
  QrCode,
  Download,
  ExternalLink,
  IndianRupee,
} from "lucide-react";

const QUICK_AMOUNTS = [100, 250, 500, 1000, 2000, 5000];

const Payment = ({
  isOpen = false,
  onClose = () => {},
  upiId = "",
  businessName = "My Business",
  businessImage = "",
}) => {
  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const merchantUPI = upiId.trim();
  const payableAmount = Number(customAmount || amount || 0);

  const upiLink = useMemo(() => {
    if (!merchantUPI) return "";

    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: businessName,
      cu: "INR",
    });

    if (payableAmount > 0) {
      params.set("am", payableAmount.toFixed(2));
    }

    params.set("tn", `Payment to ${businessName}`);

    return `upi://pay?${params.toString()}`;
  }, [merchantUPI, businessName, payableAmount]);

  const generatedQR = useMemo(() => {
    return `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
      upiLink,
    )}`;
  }, [upiLink]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

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

  const handleOpenUPI = () => {
    if (
      !merchantUPI.includes("@") ||
      payableAmount <= 0 ||
      payableAmount > 100000
    ) {
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
      link.download = "payment-qr.png";

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
    Boolean(merchantUPI) &&
    merchantUPI.includes("@") &&
    payableAmount > 0 &&
    payableAmount <= 100000;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="relative my-auto w-full max-w-3xl max-h-[88vh] overflow-hidden rounded-3xl border border-[#38516e] bg-[#0b1b30] shadow-2xl shadow-black/60"
      >
        <div className="h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-blue-400" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close payment popup"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 transition hover:border-cyan-300/50 hover:bg-cyan-300/10 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="max-h-[calc(88vh-6px)] overflow-y-auto p-4 sm:p-5">
          {/* Merchant identity */}
          <div className="flex items-center gap-3 pr-10">
            {businessImage && (
              <img
                src={businessImage}
                alt={businessName}
                className="h-14 w-14 rounded-2xl border border-[#38516e] object-cover"
              />
            )}

            <div className="min-w-0">
              <h2
                id="payment-modal-title"
                className="break-words text-lg font-bold sm:text-xl"
              >
                {businessName}
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
                  const selected = Number(customAmount || amount) === value;

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
          <div className="mt-5 grid gap-4 sm:grid-cols-[0.9fr_1.1fr]">
            <div className="rounded-2xl border border-[#dbe3ed] bg-white p-4 text-center text-slate-900">
              <div className="flex items-center justify-center gap-2 text-sm font-bold">
                <QrCode size={17} />
                Scan &amp; Pay QR
              </div>

              <div className="mx-auto mt-3 flex aspect-square w-full max-w-[240px] items-center justify-center overflow-hidden rounded-xl bg-white p-2">
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
                Point PhonePe, Google Pay, Paytm, or BHIM scanner at this code
                to pay the selected amount.
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
                Open in App attempts to launch a compatible UPI app on your
                device.
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
                  Use your UPI app to authorize the transfer. Applicable bank or
                  payment-app terms may vary.
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
  );
};

export default Payment;
