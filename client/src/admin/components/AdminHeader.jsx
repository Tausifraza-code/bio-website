import { Menu, Search, Bell, Sun, Moon } from "lucide-react";

export default function AdminHeader({
  onMenuClick,
  theme = "light",
  onThemeToggle,
  branding,
}) {
  const isDark = theme === "dark";

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0b1728]/95 sm:px-6">
      {/* Left: Menu and Search */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="relative hidden w-full max-w-sm sm:block">
          <Search
            size={18}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />

          <input
            type="search"
            placeholder="Search..."
            aria-label="Search admin panel"
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2 pl-10 pr-4 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/10 dark:border-slate-700 dark:bg-slate-900 dark:text-white"
          />
        </div>
      </div>

      {/* Right: Theme and Notifications */}
      <div className="flex shrink-0 items-center gap-2">
        <button
          type="button"
          onClick={onThemeToggle}
          aria-label={isDark ? "Switch to light theme" : "Switch to dark theme"}
          title={isDark ? "Light mode" : "Dark mode"}
          className="rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          {isDark ? <Sun size={19} /> : <Moon size={19} />}
        </button>

        <button
          type="button"
          aria-label="Notifications"
          title="Notifications"
          className="relative rounded-xl border border-slate-200 p-2.5 text-slate-600 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
        >
          <Bell size={19} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-cyan-500" />
        </button>

        <div className="ml-1 hidden items-center gap-2 border-l border-slate-200 pl-3 dark:border-slate-700 sm:flex">
          <div>
            <p className="max-w-[150px] truncate text-sm font-semibold text-slate-800 dark:text-white">
              {branding?.websiteName || "BIO Website"}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Admin Panel
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
