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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4"
      style={{ background: "rgba(4,6,18,0.85)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      {/* Modal card matching Reference UI proportions */}
      <div className="relative w-full max-w-[445px] max-h-[92vh] overflow-y-auto rounded-[24px] border border-white/10 bg-[#0d1325] shadow-2xl shadow-black/80 scrollbar-none">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-3.5 top-3.5 flex h-7 w-7 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
        >
          <X size={14} />
        </button>

        <div className="px-5 pb-5 pt-5 sm:px-6 sm:pb-6 sm:pt-6">
          {/* Header */}
          <div className="mb-4 flex flex-col items-center text-center">
            <span className="mb-2 inline-flex items-center gap-1.5 rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1 text-[10px] font-semibold text-violet-300">
              <Sparkles size={11} />
              Razorpay Secure Gateway
            </span>
            <h2 className="text-xl font-extrabold tracking-tight text-white sm:text-[22px]">
              Activate Your Mini Website
            </h2>
            <p className="mt-1 max-w-[320px] text-xs leading-5 text-slate-400">
              Complete payment to auto-approve your profile, unlock public
              sharing, and enable .vcf downloads.
            </p>
          </div>

          {/* Step 1 — Choose plan */}
          <div className="mb-3.5">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-slate-400">
                <Sparkles size={11} className="text-violet-400" />
                STEP 1: CHOOSE YOUR PLAN
              </span>
              <span className="text-[10px] text-slate-500">
                Select validity tier
              </span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {plans.map((plan) => (
                <button
                  key={plan.id}
                  onClick={() => setSelectedPlan(plan.id)}
                  className={`relative rounded-[16px] border p-3 text-left transition ${
                    selectedPlan === plan.id
                      ? "border-violet-500 bg-violet-500/10"
                      : "border-white/10 bg-white/[0.03] hover:border-white/20"
                  }`}
                >
                  {plan.bestValue && (
                    <span className="absolute -top-2 right-2.5 rounded-full bg-amber-400 px-1.5 py-0.5 text-[8.5px] font-extrabold text-black">
                      Best Value
                    </span>
                  )}
                  <div className="mb-0.5 flex items-center justify-between">
                    <span className="text-xs font-bold text-white">
                      {plan.name}
                    </span>
                    <span
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        selectedPlan === plan.id
                          ? "border-violet-500 bg-violet-500"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {selectedPlan === plan.id && (
                        <Check size={10} className="text-white" />
                      )}
                    </span>
                  </div>
                  <div className="text-lg font-extrabold text-violet-400">
                    ₹{plan.price}
                  </div>
                  <div className="mt-0.5 text-[10px] leading-tight text-slate-400">
                    {plan.label}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Step 2 — Auto-filled amount */}
          <div className="mb-3 rounded-[16px] border border-white/10 bg-white/[0.03] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1.5 text-[10px] font-extrabold tracking-wider text-slate-400">
                <IndianRupee size={11} className="text-violet-400" />
                STEP 2: AUTO-FILLED AMOUNT
              </span>
              <span className="flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400">
                <Check size={9} />
                Auto-Filled: ₹{activePlan.price}
              </span>
            </div>

            <div className="flex items-center gap-2.5">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-violet-500/30 bg-[#111a35] px-3 py-2 text-xs">
                <IndianRupee size={14} className="shrink-0 text-violet-400" />
                <span className="font-bold text-white">
                  {activePlan.price} ({activePlan.name})
                </span>
              </div>
              <div className="text-right">
                <div className="text-[11px] font-bold text-white">
                  Standard Annual
                </div>
                <div className="text-[9px] text-slate-500">
                  Taxes & Hosting Included
                </div>
              </div>
            </div>
          </div>

          {/* Unlocks */}
          <div className="mb-3 rounded-[16px] border border-white/10 bg-white/[0.02] p-3">
            <div className="mb-2 text-[10px] font-extrabold tracking-wider text-slate-400">
              INSTANT AUTO-UNLOCKS UPON PAYMENT:
            </div>
            <div className="grid grid-cols-2 gap-y-2 gap-x-3">
              {unlocks.map(({ icon: Icon, text }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 text-[11px] text-slate-300"
                >
                  <Icon size={13} className="shrink-0 text-violet-400" />
                  <span>{text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Payment methods row */}
          <div className="mb-4 flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-3 py-2">
            <span className="flex items-center gap-1.5 text-[11px] text-slate-400">
              <ShieldCheck size={13} className="text-emerald-400" />
              UPI, Cards, NetBanking, GPay, PhonePe
            </span>
            <span className="text-[11px] font-bold text-violet-400">Razorpay</span>
          </div>

          {/* Pay button */}
          <button
            onClick={handlePayment}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-indigo-600 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-violet-900/40 transition hover:brightness-110 active:scale-[0.99]"
          >
            <CreditCard size={16} />
            Pay ₹{activePlan.price} &amp; Launch Card Instantly
          </button>

          {/* Pay later link */}
          <button
            onClick={onClose}
            className="mt-2.5 w-full text-center text-[11px] text-slate-500 transition hover:text-slate-300"
          >
            — I'll Pay Later, Continue Editing Profile
          </button>

          {/* Footer note */}
          <p className="mt-3 text-center text-[9.5px] text-slate-600">
            Auto-approved immediately • Super Admin notified in real-time
          </p>
        </div>
      </div>
    </div>
  );
}

export default PaymentModal;
