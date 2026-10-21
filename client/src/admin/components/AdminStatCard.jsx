import { ArrowUpRight } from "lucide-react";

export default function AdminStatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "cyan",
}) {
  const accentStyles = {
    cyan: {
      icon: "bg-cyan-50 text-cyan-600 dark:bg-cyan-500/10 dark:text-cyan-400",
      border: "hover:border-cyan-300 dark:hover:border-cyan-500/40",
    },
    emerald: {
      icon: "bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400",
      border: "hover:border-emerald-300 dark:hover:border-emerald-500/40",
    },
    violet: {
      icon: "bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400",
      border: "hover:border-violet-300 dark:hover:border-violet-500/40",
    },
    amber: {
      icon: "bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400",
      border: "hover:border-amber-300 dark:hover:border-amber-500/40",
    },
  };

  const styles = accentStyles[accent] || accentStyles.cyan;

  return (
    <article
      className={`rounded-2xl border border-slate-200 bg-white p-5 transition-colors dark:border-slate-800 dark:bg-[#0b1728] ${styles.border}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
            {title}
          </p>

          <p className="mt-3 break-words text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
            {value ?? "—"}
          </p>
        </div>

        {Icon && (
          <div className={`shrink-0 rounded-xl p-3 ${styles.icon}`}>
            <Icon size={21} strokeWidth={1.8} />
          </div>
        )}
      </div>

      {description && (
        <div className="mt-4 flex items-start gap-1.5 text-xs text-slate-500 dark:text-slate-400">
          <ArrowUpRight size={14} className="mt-0.5 shrink-0" />
          <span>{description}</span>
        </div>
      )}
    </article>
  );
}
