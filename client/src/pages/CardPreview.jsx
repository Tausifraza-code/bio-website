import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Clock3,
  CreditCard,
  Sparkles,
  ShieldAlert,
  ArrowRight,
  ExternalLink,
} from "lucide-react";

function CardPreview() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[var(--page-bg)] px-4 py-8 text-[var(--text-primary)]">
      {/* Background ambient glow */}
      <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#10b981]/[0.08] blur-[140px]" />
        <div className="absolute left-1/3 top-1/4 h-[300px] w-[300px] rounded-full bg-[#22d3ee]/[0.06] blur-[120px]" />
      </div>

      {/* Top Navigation */}
      <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2 text-xs font-semibold text-[var(--text-secondary)] shadow-sm backdrop-blur-md transition-all hover:border-[#10b981]/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] active:scale-95"
        >
          <ArrowLeft size={14} />
          <span>Back to Dashboard</span>
        </Link>
      </div>

      {/* Card Activation Pending Box */}
      <div className="relative w-full max-w-[420px] rounded-[24px] border border-[var(--border-color)] bg-[var(--surface)] p-6 sm:p-8 text-center shadow-2xl shadow-black/30 backdrop-blur-xl">
        {/* Decorative Top Accent Line */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-transparent via-[#10b981]/50 to-transparent" />

        {/* Status Badge */}
        <div className="mb-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 px-3 py-1 text-[11px] font-semibold text-amber-400">
          <Clock3 size={12} className="animate-pulse" />
          <span>Status: Awaiting Activation</span>
        </div>

        {/* Central Icon */}
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-amber-500/30 bg-gradient-to-br from-amber-500/20 to-amber-600/10 shadow-lg shadow-amber-500/10">
          <Clock3 size={30} className="text-amber-400" />
          <span className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border border-[var(--surface)] bg-amber-500 text-white shadow-xs">
            <ShieldAlert size={12} />
          </span>
        </div>

        {/* Title & Headline */}
        <h1 className="mt-4 text-xl font-black tracking-tight text-[var(--text-primary)] sm:text-2xl">
          Card Activation Pending
        </h1>

        {/* Description */}
        <p className="mt-2.5 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
          This digital visiting card is currently in private draft mode. Complete
          the launch activation to immediately unlock live public sharing, QR
          standee downloads, and WhatsApp inquiry buttons.
        </p>

        {/* What gets unlocked strip */}
        <div className="mt-5 rounded-2xl border border-[var(--border-color)] bg-[var(--surface-raised)]/60 p-3.5 text-left">
          <p className="flex items-center gap-1.5 text-[10.5px] font-extrabold uppercase tracking-wider text-[var(--text-secondary)]">
            <Sparkles size={12} className="text-[#10b981]" />
            <span>Unlocks instantly upon activation:</span>
          </p>
          <ul className="mt-2 space-y-1.5 text-[11px] text-[var(--text-primary)]">
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              <span>Public Live URL for bio &amp; Instagram</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#22d3ee]" />
              <span>1-Tap .vcf contact saving directly into phonebook</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#10b981]" />
              <span>Instant WhatsApp ordering CTAs &amp; Catalog</span>
            </li>
          </ul>
        </div>

        {/* Actions */}
        <div className="mt-6 flex flex-col gap-2.5">
          <Link
            to="/dashboard"
            className="flex min-h-[44px] w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-4 py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-[#10b981]/25 transition-all hover:brightness-110 active:scale-98"
          >
            <CreditCard size={15} />
            <span>Activate Card from Dashboard</span>
            <ArrowRight size={14} />
          </Link>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-1 text-center text-xs font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            <span>Return to Homepage</span>
            <ExternalLink size={12} />
          </Link>
        </div>

        {/* Footer Note */}
        <p className="mt-5 text-center text-[10px] text-[var(--text-secondary)]/70">
          Auto-approved instantly upon payment verification
        </p>
      </div>
    </div>
  );
}

export default CardPreview;

