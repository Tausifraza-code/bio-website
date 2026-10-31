
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import {
  registerUser,
  loginUser,
  clearAuthMessage,
} from "../redux/slice/authSlice";
import { fetchMyProfile } from "../redux/slice/profileSlice";
import toast from "react-hot-toast";

import {
  ArrowLeft,
  ArrowRight,
  Store,
  UserRoundPlus,
  LogIn,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  Sun,
  Moon,
} from "lucide-react";

const plans = [
  {
    id: "yearly",
    name: "1 Year Plan",
    price: 499,
    description: "Standard Annual Card",
  },
  {
    id: "three-years",
    name: "3 Years Plan",
    price: 999,
    description: "+1 Free Companion Card",
    bestValue: true,
  },
];

function AuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const {
    loading,
    error: _error,
    success: _success,
    message: _message,
  } = useSelector((state) => state.auth);

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("bio-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    document.documentElement.classList.toggle("dark", theme === "dark");

    try {
      localStorage.setItem("bio-theme", theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  const [mode, setMode] = useState(() =>
    location.pathname === "/register" ? "signup" : "login",
  );

  useEffect(() => {
    if (location.pathname === "/register") {
      setMode("signup");
    } else if (location.pathname === "/login") {
      setMode("login");
    }
  }, [location.pathname]);

  const [showPassword, setShowPassword] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState("yearly");

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    loginId: "",
    referralCode: "",
  });

  const [localMessage, setLocalMessage] = useState("");

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setLocalMessage("");
    navigate(nextMode === "signup" ? "/register" : "/login");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const [registeredUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bio-registered-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch(clearAuthMessage());

    if (mode === "signup") {
      const userData = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        phone: formData.phone.trim(),
        password: formData.password,
        referralCode: formData.referralCode.trim().toUpperCase(),
      };

      try {
        const result = await dispatch(registerUser(userData)).unwrap();

        toast.success(result.message || "Registration successful");
        navigate("/login");
      } catch (err) {
        toast.error(typeof err === "string" ? err : "Registration failed");
      }

      return;
    }

    // LOGIN
    try {
      const result = await dispatch(
        loginUser({
          loginId: formData.loginId,
          password: formData.password,
        }),
      ).unwrap();

      toast.success(result.message || "Login successful");

      // Fetch logged-in user's profile
      const profile = await dispatch(fetchMyProfile()).unwrap();

      // Get profile subdomain
      const subdomain = profile?.subdomain;

      if (subdomain) {
        // Redirect to user's Preview Page
        navigate(
          `/card-preview/${encodeURIComponent(subdomain)}`,
        );
      } else {
        toast.error(
          "Profile subdomain not found. Please complete your profile.",
        );
        navigate("/dashboard");
      }
    } catch (err) {
      toast.error(
        typeof err === "string"
          ? err
          : "Unable to complete login or load profile.",
      );

      // If login succeeded but profile fetch failed,
      // allow the user to access the dashboard.
      if (localStorage.getItem("bioToken")) {
        navigate("/dashboard");
      }
    }
  };

  const handleAutoFill = () => {
    if (registeredUser) {
      setFormData((prev) => ({
        ...prev,
        loginId:
          registeredUser.email || registeredUser.phone || "test@biowebsite.com",
        password: registeredUser.password || "123456",
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        loginId: "test@biowebsite.com",
        password: "123456",
      }));
    }
  };

  const isNameValid = formData.fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone.trim());
  const isPasswordSecure = formData.password.length >= 6;
  const isLoginIdValid = formData.loginId.trim().length >= 3;

  const getInputClass = (isValid) =>
    `w-full rounded-[14px] py-2.5 pl-10 pr-10 text-xs sm:text-sm outline-none transition-all duration-200 ${
      isValid
        ? "border border-cyan-500 bg-white text-[#0b1b30] ring-1 ring-cyan-500/30 dark:border-cyan-400 dark:bg-[#0b1b30] dark:text-white"
        : "border border-[#d7e3eb] bg-white text-[#0b1b30] placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white dark:placeholder:text-slate-500"
    }`;

  return (
    <div
      className={`app-shell theme-${theme} min-h-screen bg-[#f1f6f9] text-[#f1f6f9] hover:text-[[#0b1b30]] dark:bg-[#0b1b30] dark:text-white`}
    >
      <main className="relative min-h-screen overflow-x-hidden bg-[#f1f6f9] px-3 py-4 text-[#f1f6f9] transition-colors duration-300 dark:!bg-[#0b1b30] dark:text-white sm:px-6 sm:py-6">
        {/* Background ambient glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-[#22d3ee]/[0.08] blur-[120px]" />
          <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#22d3ee]/[0.08] blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[680px]">
          {/* Top bar */}
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[#22d3ee]/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              Back to Public Website
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[#22d3ee]/40 hover:bg-[var(--surface-raised)] active:scale-95"
              >
                {theme === "dark" ? (
                  <Sun
                    size={15}
                    className="text-amber-400 transition-transform hover:rotate-45"
                  />
                ) : (
                  <Moon
                    size={15}
                    className="text-[#0891b2] transition-transform hover:-rotate-12 dark:text-[#22d3ee]"
                  />
                )}
              </button>

              <span className="rounded-full border border-[#22d3ee]/25 bg-[#22d3ee]/10 px-3 py-1 text-xs font-bold text-[#0891b2] dark:text-[#22d3ee]">
                BIO Website Hub
              </span>
            </div>
          </div>

          {/* Main Card */}
          <section className="rounded-[22px] border border-[#d7e3eb] bg-white p-4 shadow-xl shadow-slate-900/[0.04] dark:border-[#29435f] dark:bg-[#132942] sm:p-6 md:p-7">
            {/* Header */}
            <div className="mx-auto max-w-[540px] text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] border border-cyan-300/30 bg-[#22d3ee] text-[#0b1b30] shadow-md shadow-[#22d3ee]/25">
                <Store size={22} strokeWidth={1.8} />
              </div>

              <h1 className="mt-2.5 text-xl font-extrabold tracking-tight text-[var(--text-primary)] sm:text-2xl">
                {mode === "signup"
                  ? "Create Your Mini Website"
                  : "Customer Account Login"}
              </h1>

              <p className="mt-1 text-xs leading-5 text-[var(--text-secondary)]">
                {mode === "signup"
                  ? "Launch your digital visiting card with product portfolios, vCard instant download, and WhatsApp integration in 2 minutes."
                  : "Access your personalized mini website dashboard, edit your contact details, and view customer inquiries."}
              </p>
            </div>

            {/* Mode Toggle */}
            <div className="mx-auto mt-4 flex w-full max-w-[420px] items-center justify-center gap-1.5 rounded-[18px] border border-[var(--border-color)] bg-[var(--surface-raised)]/90 p-1 shadow-inner">
              <button
                type="button"
                onClick={() => changeMode("signup")}
                className={`flex min-h-[36px] flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  mode === "signup"
                    ? "border border-[#22d3ee]/40 bg-[var(--surface)] text-[#0891b2] shadow-md shadow-[#22d3ee]/10 dark:text-[#22d3ee]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <UserRoundPlus size={14} />
                <span>New Customer Sign Up</span>
              </button>

              <button
                type="button"
                onClick={() => changeMode("login")}
                className={`flex min-h-[36px] flex-1 items-center justify-center gap-2 rounded-[14px] px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
                  mode === "login"
                    ? "border border-[#22d3ee]/40 bg-[var(--surface)] text-[#0891b2] shadow-md shadow-[#22d3ee]/10 dark:text-[#22d3ee]"
                    : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                <LogIn size={14} />
                <span>Returning Customer Login</span>
              </button>
            </div>

            {/* The Form */}
            <form onSubmit={handleSubmit} className="mt-5 space-y-3.5">
              {mode === "signup" ? (
                <>
                  {/* Full Name */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="fullName"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Full Name{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                      {isNameValid && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                          Valid
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="fullName"
                        name="fullName"
                        type="text"
                        autoComplete="name"
                        placeholder="e.g. Rahul Sharma"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        maxLength={100}
                        className={getInputClass(isNameValid)}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="signup-email"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Email Address{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                      {isEmailValid && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                          Valid Email
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Mail
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="signup-email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        placeholder="you@example.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className={getInputClass(isEmailValid)}
                      />
                    </div>
                  </div>

                  {/* Phone */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="phone"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Mobile Number{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                      {isPhoneValid && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                          Valid Number
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <Phone
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="phone"
                        name="phone"
                        type="tel"
                        inputMode="numeric"
                        autoComplete="tel"
                        placeholder="10-digit mobile number"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        maxLength={10}
                        className={getInputClass(isPhoneValid)}
                      />
                    </div>
                  </div>

                  {/* Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="signup-password"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Password{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                      {isPasswordSecure && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                          Secure
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="signup-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="new-password"
                        placeholder="Minimum 6 characters"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength={6}
                        className={`${getInputClass(isPasswordSecure)} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:bg-[#22d3ee]/10 hover:text-[#0891b2] dark:hover:text-[#22d3ee]"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Referral Code — Registration Only */}
                  <div>
                    <div className="mb-2">
                      <label
                        htmlFor="referralCode"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Referral Code{" "}
                        <span className="text-xs font-normal">(Optional)</span>
                      </label>
                    </div>

                    <div className="relative">
                      <UserRoundPlus
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />

                      <input
                        id="referralCode"
                        name="referralCode"
                        type="text"
                        autoComplete="off"
                        placeholder="Enter referral code"
                        value={formData.referralCode}
                        onChange={handleChange}
                        maxLength={50}
                        className={getInputClass(false)}
                      />
                    </div>

                    <p className="mt-1.5 text-xs text-[var(--text-secondary)]">
                      Have a referral code? Enter it here.
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {/* Login ID */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="loginId"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Email Address or Mobile Number{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                      {isLoginIdValid && (
                        <span className="flex items-center gap-1 text-xs font-bold text-cyan-600 dark:text-cyan-300">
                          <CheckCircle2 size={13} />
                          Entered
                        </span>
                      )}
                    </div>

                    <div className="relative">
                      <UserRound
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="loginId"
                        name="loginId"
                        type="text"
                        autoComplete="username"
                        placeholder="Enter email or mobile number"
                        value={formData.loginId}
                        onChange={handleChange}
                        required
                        className={getInputClass(isLoginIdValid)}
                      />
                    </div>
                  </div>

                  {/* Login Password */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="login-password"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Password{" "}
                        <span className="text-[#0891b2] dark:text-[#22d3ee]">
                          *
                        </span>
                      </label>
                    </div>

                    <div className="relative">
                      <LockKeyhole
                        size={18}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                      />
                      <input
                        id="login-password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        placeholder="Enter your password"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        className={`${getInputClass(isPasswordSecure)} pr-12`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((prev) => !prev)}
                        aria-label={
                          showPassword ? "Hide password" : "Show password"
                        }
                        className="absolute right-3 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:bg-[#22d3ee]/10 hover:text-[#0891b2] dark:hover:text-[#22d3ee]"
                      >
                        {showPassword ? (
                          <EyeOff size={17} />
                        ) : (
                          <Eye size={17} />
                        )}
                      </button>
                    </div>
                  </div>

                  {mode === "login" && (
                    <div className="flex justify-end">
                      <Link
                        to="/forgot-password"
                        className="text-sm font-medium text-[#0891b2] transition hover:text-cyan-700 dark:text-[#22d3ee]"
                      >
                        Forgot Password?
                      </Link>
                    </div>
                  )}
                </>
              )}

              {/* Auto-fill — Login Only */}
              {mode === "login" && (
                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="inline-flex items-center rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-3 py-2 text-xs font-semibold text-[#0891b2] transition hover:border-[#22d3ee]/60 hover:bg-[#22d3ee]/15 dark:text-[#22d3ee]"
                >
                  Auto-Fill Test Credentials
                </button>
              )}

              {/* Feedback Message */}
              {localMessage && (
                <div
                  role="status"
                  className="rounded-xl border border-[#22d3ee]/30 bg-[#22d3ee]/10 px-4 py-3 text-sm text-[#0e7490] dark:text-cyan-200"
                >
                  {localMessage}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="group flex min-h-11 w-full items-center justify-center gap-2 rounded-xl bg-[#22d3ee] px-4 py-3 text-sm font-extrabold text-[#f1f6f9] hover:text-[#0b1b30] shadow-lg shadow-[#22d3ee]/15 transition duration-200 hover:-translate-y-0.5 hover:bg-[#67e8f9] hover:shadow-xl hover:shadow-[#22d3ee]/20 active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? (
                  "Please wait..."
                ) : mode === "signup" ? (
                  <>
                    <span>Create My Mini Website</span>
                    <ArrowRight
                      size={16}
                      className="shrink-0 transition-transform group-hover:translate-x-1"
                    />
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    <span>Sign In to My Mini Website</span>
                  </>
                )}
              </button>

              <p className="text-center text-[11px] text-[var(--text-secondary)]">
                {mode === "signup"
                  ? "By continuing, you agree to our Terms of Service and Privacy Policy."
                  : "Your account dashboard will be available after authentication is connected."}
              </p>
            </form>
          </section>

          <p className="mt-5 text-center text-xs text-[var(--text-secondary)]">
            © {new Date().getFullYear()} BIO Website · Smart Business Identity
          </p>
        </div>
      </main>
    </div>
  );
}

export default AuthPage;
