import { ArrowLeft, Clock3 } from "lucide-react";

function CardPreview() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-[#060a18] px-4">
      {/* Background glow */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-900/20 blur-[120px]" />
      </div>

      {/* Back to Dashboard button */}
      <div className="absolute left-5 top-5">
        <a
          href="/dashboard"
          className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-slate-300 backdrop-blur-sm transition hover:bg-white/10 hover:text-white"
        >
          <ArrowLeft size={14} />
          Back to Dashboard
        </a>
      </div>

      {/* Card Activation Pending box */}
      <div className="relative w-full max-w-[340px] rounded-[22px] border border-white/10 bg-[#0d1425]/90 px-8 py-10 text-center shadow-2xl backdrop-blur-xl">
        {/* Icon */}
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-amber-500/30 bg-amber-500/10">
          <Clock3 size={26} className="text-amber-400" />
        </div>

        {/* Title */}
        <h1 className="mt-5 text-lg font-extrabold text-white">
          Card Activation Pending
        </h1>

        {/* Description */}
        <p className="mt-3 text-sm leading-6 text-slate-400">
          This digital visiting card is currently not live. The business owner
          must complete activation payment before this card can be publicly
          viewed or shared.
        </p>
      </div>
    </div>
  );
}

export default CardPreview;
