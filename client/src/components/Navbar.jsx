import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  CreditCard,
  Menu,
  Moon,
  Sun,
  X,
  ArrowRight,
} from "lucide-react";

function Navbar({ theme, onToggleTheme }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 15);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Features", href: "#services" },
    { label: "Why Us", href: "#about" },
    { label: "Contact", href: "#contact" },
  ];

  const closeMenu = () => setMenuOpen(false);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-200 ${
        scrolled
          ? "border-b border-[var(--border-color)] bg-[var(--page-bg)]/85 backdrop-blur-md"
          : "border-b border-transparent bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 w-full max-w-[1280px] items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand */}
        <div className="flex items-center gap-8">
          <a
            href="#home"
            onClick={closeMenu}
            className="flex items-center gap-2.5 text-base font-extrabold tracking-tight text-[var(--text-primary)] transition hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#10b981] text-white shadow-xs">
              <CreditCard size={17} strokeWidth={2.2} />
            </div>
            <span>
              Bio<span className="text-[#10b981]">Card</span>
            </span>
          </a>

          {/* Desktop Navigation Links */}
          <nav aria-label="Main navigation" className="hidden md:flex items-center gap-6">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>

        {/* Desktop Right Actions */}
        <div className="hidden md:flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)] transition hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
          >
            {theme === "dark" ? (
              <Sun size={16} className="text-amber-400" />
            ) : (
              <Moon size={16} className="text-cyan-600" />
            )}
          </button>

          {/* Login */}
          <Link
            to="/login"
            className="rounded-lg px-3.5 py-1.5 text-sm font-medium text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
          >
            Log in
          </Link>

          {/* Primary CTA */}
          <Link
            to="/register"
            className="inline-flex items-center gap-1.5 rounded-lg bg-[#10b981] px-4 py-2 text-sm font-semibold text-white shadow-xs transition hover:bg-[#059669] active:scale-95"
          >
            <span>Create card</span>
            <ArrowRight size={14} />
          </Link>
        </div>

        {/* Mobile Controls */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label="Toggle theme"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-secondary)]"
          >
            {theme === "dark" ? <Sun size={16} className="text-amber-400" /> : <Moon size={16} className="text-cyan-600" />}
          </button>

          <button
            type="button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            className="flex h-8 w-8 items-center justify-center rounded-lg text-[var(--text-primary)]"
          >
            {menuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

      </div>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className="border-b border-[var(--border-color)] bg-[var(--page-bg)] px-4 py-4 md:hidden shadow-lg">
          <nav className="flex flex-col gap-3">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={closeMenu}
                className="py-1 text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="mt-4 flex flex-col gap-2 border-t border-[var(--border-color)] pt-4">
            <Link
              to="/login"
              onClick={closeMenu}
              className="py-2 text-center text-sm font-medium text-[var(--text-primary)]"
            >
              Log in
            </Link>
            <Link
              to="/register"
              onClick={closeMenu}
              className="flex items-center justify-center gap-1.5 rounded-lg bg-[#10b981] py-2 text-center text-sm font-semibold text-white"
            >
              <span>Create card</span>
              <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

export default Navbar;
