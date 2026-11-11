import { useEffect, useState } from "react";
import { Menu, Bell, Sun, Moon } from "lucide-react";

const getGreeting = () => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return "Good Morning";
  }

  if (hour >= 12 && hour < 17) {
    return "Good Afternoon";
  }

  return "Good Evening";
};

export default function AdminHeader({
  onMenuClick,
  theme = "light",
  onThemeToggle,
  branding,
}) {
  const isDark = theme === "dark";

  const [greeting, setGreeting] = useState(getGreeting);

  // Update greeting automatically when the time changes.
  useEffect(() => {
    const interval = setInterval(() => {
      setGreeting(getGreeting());
    }, 60000);

    return () => clearInterval(interval);
  }, []);

  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 backdrop-blur-sm dark:border-slate-800 dark:bg-[#0b1728]/95 sm:px-6">
      {/* Left: Menu and Greeting */}
      <div className="flex min-w-0 flex-1 items-center gap-3">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open sidebar"
          className="rounded-lg p-2 text-slate-600 transition hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 lg:hidden"
        >
          <Menu size={21} />
        </button>

        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold tracking-tight text-slate-900 dark:text-white sm:text-xl">
            {greeting}!
          </h2>

          <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400 sm:text-sm">
            Welcome back to your {branding?.websiteName || "BIO SITES"}{" "}
            dashboard.
          </p>
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
              {branding?.websiteName || "BIO SITES"}
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
