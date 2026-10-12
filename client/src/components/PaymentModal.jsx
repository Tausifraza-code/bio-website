import { useState } from "react";
import {
  X,
  Sparkles,
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

  const activePlan = plans.find((p) => p.id === selectedPlan) || plans[0];

  const handlePayment = (e) => {
    e.preventDefault();
    // Razorpay integration goes here
    alert("Payment gateway will be connected when the backend is ready.");
  };

  return (
    // Backdrop
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal card */}
      <div className="relative w-full max-w-[440px] max-h-[94vh] overflow-y-auto rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] shadow-2xl shadow-black/80 scrollbar-none transition-all">
        {/* Ambient background glow inside card */}
        <div className="pointer-events-none absolute -top-16 -right-16 h-48 w-48 rounded-full bg-[#10b981]/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-48 w-48 rounded-full bg-[#22d3ee]/15 blur-3xl" />

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-3.5 top-3.5 z-10 flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-secondary)] transition-all hover:bg-[var(--border-color)] hover:text-[var(--text-primary)] hover:scale-105 active:scale-95"
        >
          <X size={14} />
        </button>

        <div className="relative px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Header */}
          <div className="mb-4 flex flex-col items-center text-center">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-[10px] font-semibold text-emerald-400">
              <Sparkles size={11} />
              Razorpay Secure Gateway
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-[22px]">
              Activate Your Mini Website
            </h2>
            <p className="mt-1 max-w-[320px] text-xs leading-5 text-[var(--text-secondary)]">
              Complete payment to auto-approve your profile, unlock public
              sharing, and enable .vcf downloads.
            </p>
          </div>

          {/* Step 1 — Choose plan */}
          <div className="mb-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[var(--text-secondary)]">
                <Zap size={11} className="text-[#10b981]" />
                STEP 1: CHOOSE YOUR PLAN
              </span>
              <span className="text-[10px] text-[var(--text-secondary)]/70">
                Select validity tier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {plans.map((plan) => {
                const isSelected = selectedPlan === plan.id;
                return (
                  <button
                    key={plan.id}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-[16px] border p-3 text-left transition-all duration-200 ${
                      isSelected
                        ? "border-[#10b981] bg-[#10b981]/10 ring-1 ring-[#10b981]/40 shadow-md shadow-[#10b981]/10"
                        : "border-[var(--border-color)] bg-[var(--surface-raised)]/70 hover:border-[#10b981]/40"
                    }`}
                  >
                    {plan.bestValue && (
                      <span className="absolute -top-2 right-2.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-2 py-0.5 text-[8.5px] font-extrabold text-white shadow-2xs">
                        Best Value
                      </span>
                    )}
                    <div className="mb-1 flex items-center justify-between">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {plan.name}
                      </span>
                      <span
                        className={`flex h-4 w-4 items-center justify-center rounded-full border transition-all ${
                          isSelected
                            ? "border-[#10b981] bg-[#10b981] text-white"
                            : "border-[var(--border-color)] bg-transparent"
                        }`}
                      >
                        {isSelected && <Check size={10} strokeWidth={3} className="text-white" />}
                      </span>
                    </div>
                    <div className="text-lg font-extrabold text-[#10b981]">
                      ₹{plan.price}
                    </div>
                    <div className="mt-0.5 text-[10px] leading-tight text-[var(--text-secondary)]">
                      {plan.label}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Step 2 — Auto-filled amount */}
          <div className="mb-3 rounded-[16px] border border-[var(--border-color)] bg-[var(--surface-raised)]/50 p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-[var(--text-secondary)]">
                <IndianRupee size={11} className="text-[#10b981]" />
                STEP 2: AUTO-FILLED AMOUNT
              </span>
              <span className="flex items-center gap-1 rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400">
                <Check size={9} strokeWidth={3} />
                Auto-Filled: ₹{activePlan.price}
              </span>
            </div>

            <div className="flex items-center justify-between gap-2.5">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-emerald-500/30 bg-[#10b981]/10 px-3 py-2 text-xs">
                <IndianRupee size={14} className="shrink-0 text-[#10b981]" />
                <span className="font-extrabold text-[var(--text-primary)]">
                  {activePlan.price} ({activePlan.name})
                </span>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-[var(--text-primary)]">
                  {activePlan.id === "1" ? "Standard Annual" : "3 Years Comprehensive"}
                </div>
                <div className="text-[9px] text-[var(--text-secondary)]">
                  Taxes &amp; Hosting Included
                </div>
              </div>
            </div>
          </div>

          {/* Unlocks */}
          <div className="mb-3 rounded-[16px] border border-[var(--border-color)] bg-[var(--surface-raised)]/40 p-3">
            <div className="mb-2 text-[10px] font-extrabold tracking-wider text-[var(--text-secondary)]">
              INSTANT AUTO-UNLOCKS UPON PAYMENT:
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {unlocks.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-[11px] text-[var(--text-primary)]"
                >
                  <Icon size={13} className="shrink-0 text-[#22d3ee]" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods row */}
          <div className="mb-3.5 flex items-center justify-between rounded-xl border border-[var(--border-color)] bg-[var(--surface-raised)]/50 px-3 py-2">
            <span className="flex items-center gap-1.5 text-[11px] text-[var(--text-secondary)]">
              <ShieldCheck size={14} className="text-emerald-400" />
              UPI, Cards, NetBanking, GPay, PhonePe
            </span>
            <span className="text-[11px] font-bold text-[#10b981]">Razorpay</span>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#22d3ee] py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:brightness-110 active:scale-[0.99]"
          >
            <CreditCard size={16} />
            <span>Pay ₹{activePlan.price} &amp; Launch Card Instantly</span>
            <ArrowRight size={14} />
          </button>

          {/* Pay later link */}
          <button
            onClick={onClose}
            className="mt-2.5 w-full text-center text-[11px] font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            — I'll Pay Later, Continue Editing Profile
          </button>

          {/* Footer note */}
          <p className="mt-2.5 text-center text-[9.5px] text-[var(--text-secondary)]/80">
            Auto-approved immediately • Super Admin notified in real-time
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;

