import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowRight, ContactRound, Menu, Moon, Sun, X } from "lucide-react";
import { fetchPublicBranding } from "../redux/slice/adminSlice";

const Navbar = ({ theme, onToggleTheme }) => {
  const dispatch = useDispatch();
  const branding = useSelector((state) => state.admin.branding);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  const isDark = theme === "dark";

  useEffect(() => {
    dispatch(fetchPublicBranding());
  }, [dispatch]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About", href: "/#about" },
    { name: "Features", href: "/#services" },
    { name: "Industries", href: "/#industries" },
    { name: "Contact", href: "/#contact" },
  ];

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 12);

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  /* Close mobile menu on desktop widths. */
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const handler = (e) => {
      if (e.matches) setIsMenuOpen(false);
    };
    mq.addEventListener?.("change", handler);
    return () => mq.removeEventListener?.("change", handler);
  }, []);

  /* Close mobile menu on Escape. */
  useEffect(() => {
    if (!isMenuOpen) return;
    const onKey = (e) => {
      if (e.key === "Escape") setIsMenuOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isMenuOpen]);

  const closeMenu = () => setIsMenuOpen(false);

  const navSurface = "border-transparent bg-transparent shadow-none";

  const linkColor = isDark
    ? "text-slate-300 hover:text-cyan-300"
    : "text-[#29435f] hover:text-[#0891b2]";

  const themeButton = isDark
    ? "border-[#38516e] bg-[#0b1b30] text-cyan-200 hover:border-cyan-300/50 hover:bg-[#193754]"
    : "border-[#d7e3eb] bg-white text-[#29435f] hover:border-cyan-400 hover:bg-cyan-50";

  const loginColor = isDark
    ? "text-slate-200 hover:text-cyan-300"
    : "text-[#29435f] hover:text-cyan-700";

  const primaryButton =
    "group inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-full border border-cyan-200/30 bg-cyan-300 px-6 py-3 text-sm font-bold text-[#0b1b30] shadow-sm transition-all duration-200 hover:bg-cyan-200 touch-manipulation";

  return (
    <header
      className={`absolute inset-x-0 top-0 z-50 w-full transition-colors duration-300 ${
        isDark
          ? "bg-[#0b1b30]"
          : isMenuOpen
          ? "bg-[#f0fdf9] shadow-md"
          : isScrolled
          ? "bg-[#f0fdf9]/95 backdrop-blur-md shadow-sm"
          : "bg-transparent"
      }`}
      style={{
        backgroundColor: isDark
          ? "#0b1b30"
          : isMenuOpen
          ? "#f0fdf9"
          : isScrolled
          ? "rgba(240, 253, 249, 0.95)"
          : "transparent",
        paddingTop: "0px",
        paddingLeft: "0px",
        paddingRight: "0px",
        paddingBottom: "0px",
      }}
    >
      <nav
        aria-label="Main navigation"
        className={`mx-auto w-full max-w-[1240px] border-0 bg-transparent shadow-none transition-all duration-300 ${navSurface} ${
          isScrolled ? "" : ""
        }`}
      >
        <div className="flex min-h-[76px] w-full items-center justify-between gap-4 px-5 sm:px-8 lg:px-10 xl:px-12">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            aria-label="BIO home"
            className="group flex min-w-0 shrink-0 items-center gap-2 touch-manipulation"
          >
            {branding?.websiteLogo ? (
              <img
                src={branding.websiteLogo}
                alt={branding.websiteName || "BIO Website"}
                className="h-11 w-11 shrink-0 rounded-lg bg-white object-contain p-1"
              />
            ) : (
              <span
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${
                  isDark
                    ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-200"
                    : "border-cyan-200 bg-cyan-50 text-cyan-700"
                }`}
              >
                <ContactRound size={22} strokeWidth={2.2} />
              </span>
            )}

            <span
              className={`truncate text-[19px] font-extrabold tracking-tight min-[380px]:text-[21px] ${
                isDark ? "text-white" : "text-[#0b1b30]"
              }`}
            >
              {branding?.websiteName || "BIO Website"}
            </span>
          </Link>

          {/* Desktop navigation */}
          <div className="hidden min-w-0 flex-1 items-center justify-center gap-5 lg:flex xl:gap-8 2xl:gap-10">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className={`relative whitespace-nowrap py-2 text-sm font-medium transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:rounded-full after:bg-cyan-300 after:transition-all after:duration-200 hover:after:w-full ${linkColor}`}
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* Desktop actions */}
          <div className="hidden shrink-0 items-center gap-4 lg:flex xl:gap-6">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              title={isDark ? "Light mode" : "Dark mode"}
              className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors touch-manipulation ${themeButton}`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <Link
              to="/login"
              className={`whitespace-nowrap px-1 py-2 text-[13px] font-semibold transition-colors touch-manipulation ${loginColor}`}
            >
              Log in
            </Link>

            <Link to="/register" className={primaryButton}>
              Get Started
              <ArrowRight
                size={15}
                className="transition-transform duration-200 group-hover:translate-x-0.5"
              />
            </Link>
          </div>

          {/* Mobile actions */}
          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2 lg:hidden">
            <button
              type="button"
              onClick={onToggleTheme}
              aria-label={
                isDark ? "Switch to light mode" : "Switch to dark mode"
              }
              className={`flex h-11 w-11 items-center justify-center rounded-lg border touch-manipulation ${themeButton}`}
            >
              {isDark ? <Sun size={17} /> : <Moon size={17} />}
            </button>

            <button
              type="button"
              onClick={() => setIsMenuOpen((prev) => !prev)}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
              aria-expanded={isMenuOpen}
              aria-controls="bio-mobile-menu"
              className={`flex h-11 w-11 items-center justify-center rounded-lg border transition-colors touch-manipulation ${
                isDark
                  ? "border-[#38516e] text-slate-200 hover:bg-[#193754]"
                  : "border-[#d7e3eb] text-[#29435f] hover:bg-cyan-50"
              }`}
            >
              {isMenuOpen ? <X size={19} /> : <Menu size={19} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          id="bio-mobile-menu"
          className={`grid transition-[grid-template-rows,opacity] duration-300 ease-out lg:hidden ${
            isMenuOpen
              ? "grid-rows-[1fr] opacity-100"
              : "grid-rows-[0fr] opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <div
              className={`overscroll-contain border-t px-3 pb-6 pt-3 shadow-xl min-[380px]:px-4 ${
                isDark
                  ? "border-[#29435f] bg-[#0b1b30]"
                  : "border-[#d7e3eb] bg-[#f0fdf9]"
              }`}
            >
              <div className="flex flex-col">
                {navLinks.map((link) => (
                  <a
                    key={link.name}
                    href={link.href}
                    onClick={closeMenu}
                    className={`flex min-h-12 items-center justify-between border-b text-sm font-medium transition-colors touch-manipulation ${
                      isDark
                        ? "border-[#29435f]/70 text-slate-200 hover:text-cyan-300"
                        : "border-[#e2eaf0] text-[#29435f] hover:text-cyan-700"
                    }`}
                  >
                    {link.name}
                    <ArrowRight size={15} className="opacity-60" />
                  </a>
                ))}
              </div>

              <div className="mt-4 grid grid-cols-1 gap-2.5 min-[380px]:grid-cols-2 min-[380px]:gap-3">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className={`flex min-h-11 items-center justify-center rounded-lg border text-sm font-semibold transition-colors touch-manipulation shadow-sm ${
                    isDark
                      ? "border-[#38516e] bg-[#0b1b30] text-slate-200 hover:border-cyan-300/40 hover:text-cyan-200"
                      : "border-[#d7e3eb] bg-white text-[#29435f] hover:border-cyan-300 hover:bg-cyan-50"
                  }`}
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className={`${primaryButton} min-h-11 px-3 text-[#f1f6f9] hover:text-[#0b1b30] text-xs min-[380px]:px-4 min-[380px]:text-[13px]`}
                >
                  Get Started
                  <ArrowRight size={15} />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
