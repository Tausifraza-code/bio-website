
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
  fixedAmount = null,
  productName = "",
}) => {
  const isProductPayment =
    fixedAmount !== null &&
    fixedAmount !== undefined &&
    Number(fixedAmount) > 0;

  const [amount, setAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState("");
  const [copied, setCopied] = useState(false);
  const [notice, setNotice] = useState("");

  const merchantUPI = upiId.trim();
  const payableAmount = isProductPayment
    ? Number(fixedAmount)
    : Number(customAmount || amount || 0);

  const upiLink = useMemo(() => {
    if (!merchantUPI) return "";

    const params = new URLSearchParams({
      pa: merchantUPI,
      pn: businessName,
      am: payableAmount.toFixed(2),
      cu: "INR",
      tn: productName
        ? `Payment for ${productName}`
        : `Payment to ${businessName}`,
    });

    return `upi://pay?${params.toString()}`;
  }, [merchantUPI, businessName, payableAmount, productName]);

  const generatedQR = useMemo(
    () =>
      `https://api.qrserver.com/v1/create-qr-code/?size=320x320&margin=12&data=${encodeURIComponent(
        upiLink,
      )}`,
    [upiLink],
  );

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleEscape = (event) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      setNotice("");
      setCopied(false);
      if (isProductPayment) {
        setAmount(String(fixedAmount));
        setCustomAmount("");
      }
    }
  }, [isOpen, fixedAmount, isProductPayment]);

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

  const validPayment =
    Boolean(merchantUPI) &&
    merchantUPI.includes("@") &&
    payableAmount > 0 &&
    payableAmount <= 100000;

  const openUPIApp = (app) => {
    if (!validPayment) {
      setNotice("Please check the UPI ID and payment amount.");
      return;
    }

    const encodedParams = new URLSearchParams({
      pa: merchantUPI,
      pn: businessName,
      am: payableAmount.toFixed(2),
      cu: "INR",
      tn: productName
        ? `Payment for ${productName}`
        : `Payment to ${businessName}`,
    }).toString();

    const links = {
      gpay: `tez://upi/pay?${encodedParams}`,
      phonepe: `phonepe://pay?${encodedParams}`,
      paytm: `paytmmp://pay?${encodedParams}`,
      other: `upi://pay?${encodedParams}`,
    };

    // Must be triggered directly by the user's click.
    window.location.href = links[app] || links.other;
  };

  const handleDownloadQR = async () => {
    try {
      const response = await fetch(generatedQR);
      if (!response.ok) throw new Error("QR download failed");

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center overflow-y-auto bg-black/80 p-3 backdrop-blur-md sm:p-6"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-modal-title"
        className="relative my-auto max-h-[90vh] w-full max-w-2xl overflow-hidden rounded-3xl border border-[#38516e] bg-[#0b1b30] shadow-2xl shadow-black/60"
      >
        <div className="h-1.5 bg-gradient-to-r from-transparent via-cyan-300 to-blue-400" />

        <button
          type="button"
          onClick={onClose}
          aria-label="Close payment popup"
          className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 hover:text-white"
        >
          <X size={18} />
        </button>

        <div className="max-h-[calc(90vh-6px)] overflow-y-auto p-5 sm:p-7">
          {isProductPayment ? (
            <>
              <div className="text-center">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                  <IndianRupee size={27} />
                </div>

                <p className="mt-4 text-sm font-medium text-slate-400">
                  Amount to Pay
                </p>

                <h2
                  id="payment-modal-title"
                  className="mt-1 text-4xl font-extrabold text-white"
                >
                  ₹{payableAmount.toLocaleString("en-IN")}
                </h2>

                {productName && (
                  <p className="mt-2 text-sm text-slate-400">
                    {productName}
                  </p>
                )}

                <p className="mt-3 text-xs text-slate-400">
                  Select your preferred UPI app
                </p>
              </div>

              <div className="mt-7 grid grid-cols-2 gap-3">
                <button
                  type="button"
                  disabled={!validPayment}
                  onClick={() => openUPIApp("gpay")}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-3 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:opacity-40"
                >
                  <span className="text-xl font-black text-blue-400">G</span>
                  Google Pay
                </button>

                <button
                  type="button"
                  disabled={!validPayment}
                  onClick={() => openUPIApp("phonepe")}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-3 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:opacity-40"
                >
                  <Smartphone size={19} className="text-purple-400" />
                  PhonePe
                </button>

                <button
                  type="button"
                  disabled={!validPayment}
                  onClick={() => openUPIApp("paytm")}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-3 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:opacity-40"
                >
                  <span className="font-black text-cyan-300">P</span>
                  Paytm
                </button>

                <button
                  type="button"
                  disabled={!validPayment}
                  onClick={() => openUPIApp("other")}
                  className="flex min-h-14 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-3 py-3 font-bold text-white transition hover:border-cyan-300/50 hover:bg-cyan-300/10 disabled:opacity-40"
                >
                  <ExternalLink size={18} className="text-cyan-300" />
                  Other UPI
                </button>
              </div>

              <div className="mt-5 rounded-2xl border border-[#38516e] bg-[#132942] p-4">
                <p className="text-xs text-slate-400">Paying to UPI ID</p>
                <div className="mt-2 flex items-center justify-between gap-3">
                  <p className="break-all text-sm font-semibold text-white">
                    {merchantUPI || "UPI ID not available"}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleCopy(merchantUPI)}
                    className="shrink-0 rounded-lg border border-[#38516e] p-2 text-slate-300 hover:text-white"
                    aria-label="Copy UPI ID"
                  >
                    {copied ? <Check size={17} /> : <Copy size={17} />}
                  </button>
                </div>
              </div>

              <p className="mt-4 text-center text-xs leading-relaxed text-slate-400">
                Your UPI app will open to authorize the payment. Payment
                completion is not verified by this page.
              </p>
            </>
          ) : (
            <>
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
                    className="break-words text-lg font-bold text-white sm:text-xl"
                  >
                    {businessName}
                  </h2>
                  <span className="mt-1 inline-flex items-center gap-1 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-2.5 py-1 text-xs font-semibold text-cyan-200">
                    <BadgeCheck size={13} />
                    Verified
                  </span>
                </div>
              </div>

              <div className="mt-5 flex flex-col gap-3 rounded-2xl border border-[#38516e] bg-[#132942] p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="min-w-0">
                  <p className="text-xs font-medium text-slate-400">UPI ID</p>
                  <p className="mt-1 break-all text-sm font-semibold text-white">
                    {merchantUPI}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleCopy(merchantUPI)}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#38516e] px-3 py-2 text-sm font-semibold text-white"
                >
                  {copied ? <Check size={15} /> : <Copy size={15} />}
                  {copied ? "Copied" : "Copy UPI"}
                </button>
              </div>

              <div className="mt-6">
                <label
                  htmlFor="payment-amount"
                  className="text-sm font-semibold text-white"
                >
                  Amount to Pay (INR ₹)
                </label>
                <div className="mt-3 flex items-center gap-2 rounded-2xl border border-[#38516e] bg-[#080b16] px-4 py-3 focus-within:border-cyan-300">
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
                    className="w-full min-w-0 bg-transparent text-2xl font-bold text-white outline-none"
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
                          className={`rounded-xl border px-2 py-2.5 text-sm font-semibold ${
                            selected
                              ? "border-cyan-300 bg-cyan-300/15 text-cyan-200"
                              : "border-[#38516e] bg-[#132942] text-slate-300"
                          }`}
                        >
                          ₹{value.toLocaleString("en-IN")}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

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
                  <p className="mt-3 text-xs text-slate-500">
                    Scan using any compatible UPI app
                  </p>
                </div>

                <div className="flex flex-col justify-center">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10 text-cyan-300">
                    <Smartphone size={21} />
                  </div>
                  <h3 className="mt-3 text-lg font-bold text-white">
                    Pay using UPI
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-slate-300">
                    Scan the QR code or open a compatible UPI app.
                  </p>
                  <div className="mt-4 flex flex-col gap-2">
                    <button
                      type="button"
                      onClick={handleDownloadQR}
                      disabled={!validPayment}
                      className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-sm font-semibold text-white disabled:opacity-40"
                    >
                      <Download size={16} />
                      Download QR
                    </button>
                    <button
                      type="button"
                      onClick={() => openUPIApp("other")}
                      disabled={!validPayment}
                      className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-300 to-blue-400 px-4 py-3 text-sm font-bold text-[#080b16] disabled:opacity-40"
                    >
                      <ExternalLink size={16} />
                      Open in App
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-5 rounded-2xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                <div className="flex items-start gap-3">
                  <ShieldCheck size={19} className="shrink-0 text-cyan-300" />
                  <div>
                    <p className="text-sm font-semibold text-cyan-200">
                      Direct Bank-to-Bank Transfer via UPI
                    </p>
                    <p className="mt-1 text-sm text-slate-300">
                      Use your UPI app to authorize the transfer.
                    </p>
                  </div>
                </div>
              </div>
            </>
          )}

          {notice && (
            <p
              role="status"
              className="mt-4 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] px-3 py-2 text-center text-sm text-cyan-100"
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
