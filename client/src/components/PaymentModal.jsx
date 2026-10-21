import { useState } from "react";
import {
  X,
  IndianRupee,
  Check,
  Globe,
  Share2,
  Download,
  QrCode,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Zap,
} from "lucide-react";

const plans = [
  {
    id: "1",
    name: "1 Year Plan",
    price: 499,
    label: "Standard annual activation",
  },
  {
    id: "3",
    name: "3 Years Plan",
    price: 999,
    label: "Includes 1 Free Companion Card",
    bestValue: true,
  },
];

const unlocks = [
  { icon: Globe, text: "Public Live Card URL" },
  { icon: Download, text: "1-Tap .vcf Downloads" },
  { icon: Share2, text: "WhatsApp 1-Click Sharing" },
  { icon: QrCode, text: "Active QR Standee" },
];

function PaymentModal({ onClose }) {
  const [selectedPlan, setSelectedPlan] = useState("1");

  const activePlan = plans.find((plan) => plan.id === selectedPlan) || plans[0];

  const handlePayment = (e) => {
    e.preventDefault();

    // Razorpay integration goes here.
    alert("Payment gateway will be connected when the backend is ready.");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 backdrop-blur-md animate-in fade-in duration-200 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* Modal Card */}
      <div className="relative max-h-[94vh] w-full max-w-[440px] overflow-y-auto rounded-[24px] border border-[#d7e3eb] bg-white text-[#0b1b30] shadow-2xl shadow-black/20 transition-all scrollbar-none dark:border-[#29435f] dark:bg-[#132942] dark:text-white dark:shadow-black/60">
        {/* Ambient Glow */}
        <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-[#22d3ee]/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#22d3ee]/10 blur-3xl" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-[#d7e3eb] bg-[#f1f6f9] text-[#64748b] transition-all hover:border-[#22d3ee]/50 hover:bg-[#22d3ee]/10 hover:text-[#0891b2] hover:scale-105 active:scale-95 dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-[#94a3b8] dark:hover:text-[#22d3ee]"
        >
          <X size={15} />
        </button>

        <div className="relative px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Header */}
          <div className="mb-5 flex flex-col items-center text-center">
            <span className="mb-2 inline-flex items-center rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3 py-1 text-[10px] font-semibold text-[#0891b2] dark:text-[#22d3ee]">
              Razorpay Secure Gateway
            </span>

            <h2 className="text-xl font-extrabold tracking-tight text-[#0b1b30] dark:text-white sm:text-[22px]">
              Activate Your Mini Website
            </h2>

            <p className="mt-1 max-w-[320px] text-xs leading-5 text-[#64748b] dark:text-[#94a3b8]">
              Complete payment to auto-approve your profile, unlock public
              sharing, and enable .vcf downloads.
            </p>
          </div>

          {/* Step 1 — Choose Plan */}
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                <Zap size={12} className="text-[#0891b2] dark:text-[#22d3ee]" />
                STEP 1: CHOOSE YOUR PLAN
              </span>

              <span className="text-[10px] text-[#94a3b8]">
                Select validity tier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;

                return (
                  <button
                    key={plan.id}
                    type="button"
                    onClick={() => setSelectedPlan(plan.id)}
                    aria-pressed={isSelected}
                    className={`relative rounded-[16px] border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#22d3ee] bg-[#22d3ee]/10 ring-1 ring-[#22d3ee]/40 shadow-md shadow-[#22d3ee]/10"
                        : "border-[#d7e3eb] bg-[#f1f6f9] hover:border-[#22d3ee]/50 dark:border-[#29435f] dark:bg-[#0b1b30] dark:hover:border-[#22d3ee]/50"
                    }`}
                  >
                    {plan.bestValue && (
                      <span className="absolute -top-2 right-2.5 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee] px-2 py-0.5 text-[8.5px] font-extrabold text-[#0b1b30] shadow-sm">
                        Best Value
                      </span>
                    )}

                    <div className="mb-1 flex items-center justify-between gap-1">
                      <span className="text-xs font-bold text-[#0b1b30] dark:text-white">
                        {plan.name}
                      </span>

                      <span
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-[#22d3ee] bg-[#22d3ee] text-[#0b1b30]"
                            : "border-[#cbd5e1] bg-transparent dark:border-[#29435f]"
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} />}
                      </span>
                    </div>

                    <div className="text-lg font-extrabold text-[#0891b2] dark:text-[#22d3ee]">
                      ₹{plan.price}
                    </div>

                    <div className="mt-0.5 text-[10px] leading-tight text-[#64748b] dark:text-[#94a3b8]">
                      {plan.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Auto-filled Amount */}
          <div className="mb-3 rounded-[16px] border border-[#d7e3eb] bg-[#f1f6f9]/70 p-3 dark:border-[#29435f] dark:bg-[#0b1b30]/70">
            <div className="mb-2 flex items-center justify-between gap-2">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[#64748b] dark:text-[#94a3b8]">
                <IndianRupee
                  size={12}
                  className="text-[#0891b2] dark:text-[#22d3ee]"
                />
                STEP 2: AUTO-FILLED AMOUNT
              </span>

              <span className="flex items-center gap-1 rounded-full border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-2 py-0.5 text-[9.5px] font-bold text-[#0891b2] dark:text-[#22d3ee]">
                <Check size={10} strokeWidth={3} />
                Auto-Filled: ₹{activePlan.price}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2.5">
              <div className="flex min-w-0 flex-1 items-center gap-2 rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3 py-2 text-xs">
                <IndianRupee
                  size={14}
                  className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                />

                <span className="font-extrabold text-[#0b1b30] dark:text-white">
                  {activePlan.price} ({activePlan.name})
                </span>
              </div>

              <div className="shrink-0 text-right">
                <div className="text-[11px] font-bold text-[#0b1b30] dark:text-white">
                  {activePlan.id === "1"
                    ? "Standard Annual"
                    : "3 Years Comprehensive"}
                </div>

                <div className="text-[9px] text-[#64748b] dark:text-[#94a3b8]">
                  Taxes &amp; Hosting Included
                </div>
              </div>
            </div>
          </div>

          {/* Instant Unlocks */}
          <div className="mb-3 rounded-[16px] border border-[#d7e3eb] bg-[#f1f6f9]/50 p-3 dark:border-[#29435f] dark:bg-[#0b1b30]/50">
            <div className="mb-2 text-[10px] font-extrabold tracking-wider text-[#64748b] dark:text-[#94a3b8]">
              INSTANT AUTO-UNLOCKS UPON PAYMENT:
            </div>

            <div className="grid grid-cols-2 gap-x-3 gap-y-2">
              {unlocks.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-[11px] text-[#0b1b30] dark:text-white"
                >
                  <Icon
                    size={13}
                    className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                  />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Methods */}
          <div className="mb-3.5 flex items-center justify-between gap-2 rounded-xl border border-[#d7e3eb] bg-[#f1f6f9]/70 px-3 py-2 dark:border-[#29435f] dark:bg-[#0b1b30]/60">
            <span className="flex items-center gap-1.5 text-[11px] text-[#64748b] dark:text-[#94a3b8]">
              <ShieldCheck
                size={14}
                className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
              />
              UPI, Cards, NetBanking, GPay, PhonePe
            </span>

            <span className="shrink-0 text-[11px] font-bold text-[#0891b2] dark:text-[#22d3ee]">
              Razorpay
            </span>
          </div>

          {/* Pay Button */}
          <button
            type="button"
            onClick={handlePayment}
            className="group flex w-full items-center justify-center gap-2 rounded-xl bg-[#22d3ee] py-3 text-xs font-extrabold text-[#0b1b30] shadow-lg shadow-[#22d3ee]/15 transition-all hover:-translate-y-0.5 hover:bg-[#67e8f9] hover:shadow-xl hover:shadow-[#22d3ee]/20 active:translate-y-0 sm:text-sm"
          >
            <CreditCard size={16} />

            <span>Pay ₹{activePlan.price} &amp; Launch Card Instantly</span>

            <ArrowRight
              size={14}
              className="transition-transform group-hover:translate-x-1"
            />
          </button>

          {/* Pay Later */}
          <button
            type="button"
            onClick={onClose}
            className="mt-2.5 w-full text-center text-[11px] font-medium text-[#64748b] transition hover:text-[#0891b2] dark:text-[#94a3b8] dark:hover:text-[#22d3ee]"
          >
            — I'll Pay Later, Continue Editing Profile
          </button>

          {/* Footer Note */}
          <p className="mt-2.5 text-center text-[9.5px] text-[#64748b]/80 dark:text-[#94a3b8]/80">
            Auto-approved immediately • Super Admin notified in real-time
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
