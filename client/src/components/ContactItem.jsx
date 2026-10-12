import React from "react";

const ContactItem = ({
  icon: Icon,
  label,
  value,
  onClick,
}) => {
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex w-full items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.03] p-3 text-left transition hover:border-white/15 hover:bg-white/[0.06]"
    >
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#5448ea]/10 text-[#8b82ff]">
        <Icon size={17} />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-[10px] font-medium uppercase tracking-wider text-slate-500">
          {label}
        </p>

        <p className="mt-0.5 truncate text-sm font-medium text-slate-200 group-hover:text-white">
          {value || "Not added"}
        </p>
      </div>
    </button>
  );
};

export default ContactItem;