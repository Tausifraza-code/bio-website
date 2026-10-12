import { useState } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  LogIn,
  Menu,
  Moon,
  Sun,
  Sparkles,
  X,
  ArrowRight,
} from "lucide-react";

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#home" },
    { label: "Services", href: "#services" },
    { label: "About", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[var(--border-color)] bg-[var(--header-bg)] backdrop-blur-xl">
      <div className="mx-auto w-full max-w-[1300px] px-4 sm:px-6 lg:px-8">
        <div className="flex h-[64px] items-center justify-between gap-2 sm:h-[70px] lg:h-[76px] lg:gap-4">
          {/* Logo */}
          <a
            href="#home"
            onClick={closeMenu}
            aria-label="BIO Website home"
            className="group flex shrink-0 items-center gap-2 sm:gap-2.5"
          >
            <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-[12px] border border-emerald-400/40 bg-gradient-to-br from-emerald-500 to-cyan-500 text-white shadow-md shadow-emerald-500/25 transition-all duration-200 group-hover:scale-105 group-hover:shadow-emerald-500/40 sm:h-10 sm:w-10 lg:h-11 lg:w-11 lg:rounded-[14px]">
              <CreditCard
                size={19}
                className="sm:size-[21px]"
                strokeWidth={2}
              />
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
            </span>

            <span className="flex flex-col">
              <span className="whitespace-nowrap text-[15px] font-extrabold leading-tight tracking-[-0.03em] text-[var(--text-primary)] transition-colors sm:text-[16px] xl:text-[18px]">
                BIO Website
              </span>

              <span className="mt-0.5 whitespace-nowrap text-[7.5px] font-bold tracking-[0.06em] text-cyan-700 sm:text-[8px] xl:text-[9.5px] dark:text-cyan-400">
                SMART BUSINESS CARD &amp; PORTFOLIO
              </span>
            </span>
          </a>

          {/* Navigation */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center justify-center gap-0.5 rounded-full border border-[var(--border-color)] bg-[var(--surface)]/75 p-1 backdrop-blur-md shadow-xs md:flex lg:gap-1"
          >
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold text-[var(--text-secondary)] transition-all duration-200 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] md:px-2.5 md:py-1 md:text-[11.5px] lg:px-3.5 lg:py-1.5 lg:text-[13px]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* Desktop and Tablet actions */}
          <div className="hidden shrink-0 items-center gap-1.5 md:flex lg:gap-2.5">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-emerald-500/40 hover:bg-[var(--surface-raised)] active:scale-95 lg:h-10 lg:w-10"
            >
              {theme === "dark" ? (
                <Sun
                  size={17}
                  className="text-amber-400 transition-transform hover:rotate-45"
                />
              ) : (
                <Moon
                  size={17}
                  className="text-cyan-600 transition-transform hover:-rotate-12"
                />
              )}
            </button>

            {/* Customer Login — inactive/secondary style */}
            <Link
              to="/login"
              className="inline-flex h-9 items-center justify-center gap-1.5 whitespace-nowrap rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-2.5 text-xs font-semibold text-[var(--text-primary)] transition-all duration-200 hover:border-cyan-500/40 hover:bg-[var(--surface-raised)] active:scale-95 sm:px-2.5 md:text-[11.5px] lg:h-10 lg:px-3.5 lg:text-[13px]"
            >
              <LogIn
                size={13}
                className="shrink-0 text-cyan-700 dark:text-cyan-400"
              />
              <span>Customer Login</span>
            </Link>

            {/* Create Card — active/primary style */}
            <Link
              to="/register"
              className="group relative inline-flex h-9 items-center justify-center gap-1.5 overflow-hidden whitespace-nowrap rounded-xl border border-emerald-500 bg-gradient-to-r from-emerald-500 to-cyan-500 px-3 text-xs font-bold text-white shadow-md shadow-emerald-500/30 transition-all duration-200 hover:-translate-y-0.5 hover:from-emerald-600 hover:to-cyan-600 hover:shadow-lg hover:shadow-emerald-500/40 active:scale-95 md:px-3 md:text-[11.5px] lg:h-10 lg:px-4 lg:text-[13px]"
            >
              <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/50 to-transparent" />
              <Sparkles
                size={13}
                className="shrink-0 transition-transform group-hover:rotate-12"
              />
              <span>Create Card</span>
            </Link>
          </div>

          {/* Mobile and tablet controls */}
          <div className="flex items-center justify-self-end gap-2 md:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label="Toggle color theme"
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] transition-all active:scale-95 sm:h-10 sm:w-10"
            >
              {theme === "dark" ? (
                <Sun size={17} className="text-amber-400" />
              ) : (
                <Moon size={17} className="text-cyan-600" />
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-primary)] transition-all active:scale-95 sm:h-10 sm:w-10"
            >
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile dropdown */}
        {menuOpen && (
          <div className="border-t border-[var(--border-color)] py-3 md:hidden">
            <nav aria-label="Mobile navigation" className="flex flex-col gap-1">
              {navLinks.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={closeMenu}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-semibold text-[var(--text-secondary)] transition hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
                >
                  <span>{link.label}</span>
                  <ArrowRight size={14} className="opacity-50" />
                </a>
              ))}
            </nav>

            <div className="mt-3 grid grid-cols-2 gap-2 border-t border-[var(--border-color)] pt-3">
              <Link
                to="/login"
                onClick={closeMenu}
                className="flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-2 py-2.5 text-xs font-semibold text-[var(--text-primary)] active:scale-95"
              >
                <LogIn size={14} className="text-cyan-700 dark:text-cyan-400" />
                Customer Login
              </Link>

              <Link
                to="/register"
                onClick={closeMenu}
                className="flex min-w-0 items-center justify-center gap-1.5 rounded-xl border border-emerald-500 bg-gradient-to-r from-emerald-500 to-cyan-500 px-2 py-2.5 text-xs font-bold text-white shadow-sm shadow-emerald-500/25 active:scale-95"
              >
                <Sparkles size={14} />
                Create Card
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}

export default Navbar;
