import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
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
  Sparkles,
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

  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("bio-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
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
  });
  const [message, setMessage] = useState("");

  const activePlan = plans.find((plan) => plan.id === selectedPlan) || plans[0];

  const changeMode = (nextMode) => {
    setMode(nextMode);
    setMessage("");
    navigate(nextMode === "signup" ? "/register" : "/login");
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const [registeredUser, setRegisteredUser] = useState(() => {
    try {
      const saved = localStorage.getItem("bio-registered-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const handleSubmit = (event) => {
    event.preventDefault();

    if (mode === "signup") {
      const userToSave = {
        fullName: formData.fullName.trim() || "Business Owner",
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        password: formData.password,
        plan: activePlan.name,
        price: activePlan.price,
      };

      try {
        localStorage.setItem("bio-registered-user", JSON.stringify(userToSave));
        localStorage.setItem("bio-user-logged-in", "true");
        setRegisteredUser(userToSave);
      } catch (err) {
        console.error("Failed to save registered user:", err);
      }

      // Smoothly navigate directly to dashboard
      navigate("/dashboard");
    } else {
      // Login mode: authenticate and redirect to dashboard
      const userToSave = registeredUser || {
        fullName: formData.loginId.includes("@")
          ? formData.loginId.split("@")[0]
          : "Business Owner",
        email: formData.loginId.includes("@") ? formData.loginId : "",
        phone: !formData.loginId.includes("@") ? formData.loginId : "",
        password: formData.password || "123456",
        plan: "1 Year Plan",
        price: 499,
      };

      try {
        localStorage.setItem("bio-registered-user", JSON.stringify(userToSave));
        localStorage.setItem("bio-user-logged-in", "true");
      } catch (err) {
        console.error("Failed to save user session:", err);
      }

      // Redirect directly to dashboard
      navigate("/dashboard");
    }
  };

  const handleAutoFill = () => {
    // Fill credentials of the registered user, or fallback to the live testing account
    if (registeredUser) {
      setFormData((prev) => ({
        ...prev,
        loginId: registeredUser.email || registeredUser.phone || "test@biowebsite.com",
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

  // Field validations matching user screenshot
  const isNameValid = formData.fullName.trim().length >= 2;
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim());
  const isPhoneValid = /^[6-9]\d{9}$/.test(formData.phone.trim());
  const isPasswordSecure = formData.password.length >= 6;
  const isLoginIdValid = formData.loginId.trim().length >= 3;

  const getInputClass = (isValid) =>
    `w-full rounded-[18px] py-4 pl-12 pr-12 text-sm outline-none transition-all duration-200 ${
      isValid
        ? "border border-emerald-500/80 bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_0_15px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/40"
        : "border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-violet-500 focus:ring-2 focus:ring-violet-500/15"
    }`;

  return (
    <div className={`app-shell theme-${theme}`}>
      <main className="relative min-h-screen overflow-x-hidden bg-[var(--page-bg)] px-4 py-6 text-[var(--text-primary)] transition-colors duration-250 sm:px-6 sm:py-8">
        {/* Background ambient glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-32 h-96 w-96 rounded-full bg-violet-600/[0.08] blur-[120px]" />
          <div className="absolute -right-32 bottom-20 h-96 w-96 rounded-full bg-indigo-600/[0.08] blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[800px]">
          {/* Top bar back link and theme toggle */}
          <div className="mb-6 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3.5 py-2.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-violet-500/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)] sm:text-sm"
            >
              <ArrowLeft size={15} />
              Back to Public Website
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-violet-500/40 hover:bg-[var(--surface-raised)] hover:text-amber-400 active:scale-95 sm:h-10 sm:w-10"
              >
                {theme === "dark" ? (
                  <Sun
                    size={17}
                    className="text-amber-400 transition-transform hover:rotate-45"
                  />
                ) : (
                  <Moon
                    size={17}
                    className="text-violet-600 transition-transform hover:-rotate-12"
                  />
                )}
              </button>

              <span className="rounded-full border border-violet-500/25 bg-violet-500/10 px-3.5 py-2 text-xs font-bold text-[var(--accent)] sm:text-sm">
                BIO Website Hub
              </span>
            </div>
          </div>

        {/* Main Card */}
        <section className="rounded-[28px] border border-[var(--border-color)] bg-[var(--surface)] p-5 shadow-2xl shadow-black/20 sm:p-8 md:p-10">
          {/* Header Store Icon & Title */}
          <div className="mx-auto max-w-[540px] text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-[20px] border border-violet-300/30 bg-gradient-to-br from-violet-500 to-indigo-600 text-white shadow-lg shadow-violet-600/20">
              <Store size={28} strokeWidth={1.8} />
            </div>

            <h1 className="mt-4 text-[clamp(26px,4vw,34px)] font-extrabold tracking-tight text-[var(--text-primary)]">
              {mode === "signup"
                ? "Create Your Mini Website"
                : "Customer Account Login"}
            </h1>

            <p className="mt-2 text-xs leading-6 text-[var(--text-secondary)] sm:text-sm">
              {mode === "signup"
                ? "Launch your digital visiting card with product portfolios, vCard instant download, and WhatsApp integration in 2 minutes."
                : "Access your personalized mini website dashboard, edit your contact details, and view customer inquiries."}
            </p>
          </div>

          {/* New Customer / Returning Customer Mode Toggle */}
          <div className="mx-auto mt-7 flex w-full max-w-[465px] items-center justify-center gap-1.5 rounded-[22px] border border-[var(--border-color)] bg-[var(--surface-raised)]/90 p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => changeMode("signup")}
              className={`flex flex-1 min-h-[42px] items-center justify-center gap-2 rounded-[16px] px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-[13px] ${
                mode === "signup"
                  ? "border border-violet-500/40 bg-[var(--surface)] text-[var(--accent)] shadow-md shadow-violet-600/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <UserRoundPlus size={15} />
              <span>New Customer Sign Up</span>
            </button>

            <button
              type="button"
              onClick={() => changeMode("login")}
              className={`flex flex-1 min-h-[42px] items-center justify-center gap-2 rounded-[16px] px-3 py-2 text-xs font-semibold transition-all duration-200 sm:text-[13px] ${
                mode === "login"
                  ? "border border-violet-500/40 bg-[var(--surface)] text-[var(--accent)] shadow-md shadow-violet-600/10"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LogIn size={15} />
              <span>Returning Customer Login</span>
            </button>
          </div>

          {/* The Form */}
          <form onSubmit={handleSubmit} className="mt-8 space-y-5">
            {mode === "signup" ? (
              <>
                {/* Full Name */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="fullName"
                      className="text-sm font-semibold text-[var(--text-secondary)]"
                    >
                      Full Name <span className="text-rose-500">*</span>
                    </label>
                    {isNameValid && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
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

                {/* Email Address */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="signup-email"
                      className="text-sm font-semibold text-[var(--text-secondary)]"
                    >
                      Email Address <span className="text-rose-500">*</span>
                    </label>
                    {isEmailValid && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
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
                      placeholder="e.g. rahul@gmail.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={254}
                      className={getInputClass(isEmailValid)}
                    />
                  </div>
                </div>

                {/* Phone Number */}
                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="signup-phone"
                      className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"
                    >
                      Phone Number <span className="text-rose-500">*</span>
                      <span className="text-xs font-normal">
                        (10-digit mobile)
                      </span>
                    </label>
                    {isPhoneValid && (
                      <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                        <CheckCircle2 size={13} />
                        Valid Mobile
                      </span>
                    )}
                  </div>

                  <div className="relative">
                    <Phone
                      size={18}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                    />
                    <input
                      id="signup-phone"
                      name="phone"
                      type="tel"
                      autoComplete="tel-national"
                      placeholder="e.g. 9820154321"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      inputMode="numeric"
                      pattern="[6-9][0-9]{9}"
                      title="Enter a valid 10-digit Indian mobile number"
                      className={getInputClass(isPhoneValid)}
                    />
                  </div>
                </div>
              </>
            ) : (
              /* Login ID */
              <div>
                <div className="mb-2 flex items-center justify-between">
                  <label
                    htmlFor="loginId"
                    className="text-sm font-semibold text-[var(--text-secondary)]"
                  >
                    Email Address or Phone Number <span className="text-rose-500">*</span>
                  </label>
                  {isLoginIdValid && (
                    <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
                      <CheckCircle2 size={13} />
                      Valid
                    </span>
                  )}
                </div>

                <div className="relative">
                  <Mail
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-secondary)]"
                  />
                  <input
                    id="loginId"
                    name="loginId"
                    type="text"
                    autoComplete="username"
                    placeholder="Enter your email or mobile number"
                    value={formData.loginId}
                    onChange={handleChange}
                    required
                    className={getInputClass(isLoginIdValid)}
                  />
                </div>
              </div>
            )}

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between">
                <label
                  htmlFor="password"
                  className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"
                >
                  {mode === "signup" ? "Password" : "Account Password"}
                  <span className="text-rose-500">*</span>
                  {mode === "signup" && (
                    <span className="text-xs font-normal">
                      (min 6 characters)
                    </span>
                  )}
                </label>
                {isPasswordSecure && (
                  <span className="flex items-center gap-1 text-xs font-bold text-emerald-400">
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
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={
                    mode === "signup" ? "new-password" : "current-password"
                  }
                  placeholder={
                    mode === "signup"
                      ? "Create a password (min 6 characters)"
                      : "Enter your account password"
                  }
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={6}
                  className={`${getInputClass(isPasswordSecure)} pr-12`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Live Testing Account Credentials banner: Login Mode only */}
            {mode === "login" && (
              <div className="flex items-center justify-between gap-3 rounded-[18px] border border-violet-500/25 bg-violet-600/[0.08] p-3.5 sm:p-4">
                <div className="min-w-0">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                    <Sparkles size={14} className="text-violet-400 shrink-0" />
                    <span>
                      {registeredUser
                        ? `Registered User Credentials (${registeredUser.fullName || "User"})`
                        : "Live Testing Account Credentials"}
                    </span>
                  </div>
                  <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                    Email:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {registeredUser ? registeredUser.email || registeredUser.phone : "test@biowebsite.com"}
                    </span>{" "}
                    | Pass:{" "}
                    <span className="font-semibold text-[var(--text-primary)]">
                      {registeredUser ? registeredUser.password : "123456"}
                    </span>
                  </p>
                </div>

                <button
                  type="button"
                  onClick={handleAutoFill}
                  className="shrink-0 rounded-xl bg-violet-600 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-600/25 transition-all hover:bg-violet-500 active:scale-95"
                >
                  Auto-Fill
                </button>
              </div>
            )}

            {/* Launch plans: signup only */}
            {mode === "signup" && (
              <>
                <div className="pt-1">
                  <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                    <h2 className="flex items-center gap-2 text-sm font-bold text-[var(--text-primary)]">
                      <Sparkles size={16} className="text-violet-400" />
                      Choose Launch Plan
                      <span className="text-rose-500">*</span>
                    </h2>
                    <span className="text-xs text-[var(--text-secondary)]">
                      Select card validity
                    </span>
                  </div>

                  <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2">
                    {plans.map((plan) => {
                      const selected = selectedPlan === plan.id;

                      return (
                        <button
                          key={plan.id}
                          type="button"
                          onClick={() => setSelectedPlan(plan.id)}
                          aria-pressed={selected}
                          className={`relative rounded-[22px] border p-4 sm:p-5 text-left transition-all duration-200 ${
                            selected
                              ? "border-violet-500 bg-violet-600/[0.14] ring-1 ring-violet-500/40 shadow-lg shadow-violet-600/10"
                              : "border-[var(--border-color)] bg-[var(--surface-raised)] hover:border-violet-500/40"
                          }`}
                        >
                          {plan.bestValue && (
                            <span className="absolute -top-2.5 right-4 rounded-full bg-gradient-to-r from-amber-500 to-rose-500 px-2.5 py-0.5 text-[10px] font-extrabold text-white shadow-sm">
                              Best Value
                            </span>
                          )}

                          <div className="flex items-center justify-between gap-2">
                            <span className="text-sm font-bold text-[var(--text-primary)]">
                              {plan.name}
                            </span>

                            <span
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                selected
                                  ? "border-violet-500 bg-violet-600 text-white"
                                  : "border-[var(--border-color)] bg-[var(--surface)] text-transparent"
                              }`}
                            >
                              {selected ? <Check size={12} strokeWidth={3} /> : null}
                            </span>
                          </div>

                          <span className="mt-2.5 block text-2xl font-extrabold text-violet-400">
                            ₹{plan.price}
                          </span>

                          <span className="mt-1 block text-xs text-[var(--text-secondary)]">
                            {plan.description}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Payable amount */}
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-violet-500/25 bg-violet-500/[0.06] p-4 sm:p-4.5">
                  <div className="flex items-center gap-3">
                    <span className="text-base font-bold text-emerald-400">₹</span>
                    <div>
                      <p className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        Payable Amount (Auto-Filled):
                      </p>
                      <p className="mt-0.5 text-[11px] text-[var(--text-secondary)]">
                        {activePlan.id === "yearly" ? "1 Year Annual Plan" : "3 Years Comprehensive Plan"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <p className="text-xl font-extrabold text-violet-400">
                      ₹{activePlan.price}
                    </p>
                    <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                      ✓ Auto-Filled
                    </span>
                  </div>
                </div>

                {/* Info badge */}
                <div className="flex items-start gap-3 rounded-[18px] border border-violet-500/20 bg-violet-500/[0.04] p-4">
                  <Sparkles
                    size={17}
                    className="mt-0.5 shrink-0 text-violet-400"
                  />
                  <p className="text-xs leading-5 text-[var(--text-secondary)]">
                    Quick 10-Second Registration. You can customize your shop name, photos, address, and products anytime inside your dashboard after creating your account!
                  </p>
                </div>
              </>
            )}

            {message && (
              <div
                role="status"
                className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-4 text-xs leading-relaxed text-[var(--text-primary)]"
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className={`flex min-h-[54px] w-full items-center justify-center gap-2 rounded-[18px] px-4 py-3.5 text-center text-sm font-extrabold text-white shadow-xl transition-all hover:-translate-y-0.5 active:scale-[0.99] sm:text-base ${
                mode === "signup"
                  ? "border border-violet-400/40 bg-gradient-to-r from-violet-600 to-indigo-600 shadow-violet-600/20 hover:brightness-110"
                  : "bg-[#5b51ef] hover:bg-[#4f44e8] shadow-indigo-600/25"
              }`}
            >
              {mode === "signup" ? (
                <>
                  <Sparkles size={17} />
                  <span>Create Account &amp; Continue with ₹{activePlan.price} Plan</span>
                  <ArrowRight size={17} className="shrink-0" />
                </>
              ) : (
                <>
                  <LogIn size={18} />
                  <span>Sign In to My Mini Website</span>
                </>
              )}
            </button>

            <p className="text-center text-xs text-[var(--text-secondary)]">
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

