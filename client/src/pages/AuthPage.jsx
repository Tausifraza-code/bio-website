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

      navigate("/dashboard");
    } else {
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

      navigate("/dashboard");
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
        ? "border border-emerald-500/80 bg-[var(--surface-raised)] text-[var(--text-primary)] shadow-[0_0_15px_rgba(16,185,129,0.08)] ring-1 ring-emerald-500/40"
        : "border border-[var(--border-color)] bg-[var(--surface-raised)] text-[var(--text-primary)] placeholder:text-[var(--text-secondary)]/50 focus:border-[#10b981] focus:ring-2 focus:ring-[#10b981]/15"
    }`;

  return (
    <div className={`app-shell theme-${theme}`}>
      <main className="relative min-h-screen overflow-x-hidden bg-[var(--page-bg)] px-3 py-4 text-[var(--text-primary)] transition-colors duration-250 sm:px-6 sm:py-6">
        {/* Background ambient glow */}
        <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
          <div className="absolute -left-32 top-32 h-80 w-80 rounded-full bg-[#10b981]/[0.08] blur-[120px]" />
          <div className="absolute -right-32 bottom-20 h-80 w-80 rounded-full bg-[#22d3ee]/[0.08] blur-[120px]" />
        </div>

        <div className="relative mx-auto w-full max-w-[680px]">
          {/* Top bar */}
          <div className="mb-3.5 flex items-center justify-between gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-xl border border-[var(--border-color)] bg-[var(--surface)] px-3 py-1.5 text-xs font-semibold text-[var(--text-secondary)] transition hover:border-[#10b981]/40 hover:bg-[var(--surface-raised)] hover:text-[var(--text-primary)]"
            >
              <ArrowLeft size={14} />
              Back to Public Website
            </Link>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={toggleTheme}
                aria-label="Toggle color theme"
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-[var(--border-color)] bg-[var(--surface)] text-[var(--text-secondary)] transition-all duration-200 hover:border-[#10b981]/40 hover:bg-[var(--surface-raised)] active:scale-95"
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
          <section className="rounded-[22px] border border-[var(--border-color)] bg-[var(--surface)] p-4 shadow-xl shadow-black/20 sm:p-6 md:p-7">
            {/* Header */}
            <div className="mx-auto max-w-[540px] text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-[16px] border border-emerald-300/30 bg-gradient-to-br from-[#10b981] to-[#22d3ee] text-white shadow-md shadow-[#10b981]/25">
                <Store size={22} strokeWidth={1.8} />
              </div>

              <h1 className="mt-2.5 text-xl sm:text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
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
                    ? "border border-[#10b981]/40 bg-[var(--surface)] text-[#10b981] shadow-md shadow-[#10b981]/10"
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
                    ? "border border-[#10b981]/40 bg-[var(--surface)] text-[#10b981] shadow-md shadow-[#10b981]/10"
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
                        Full Name <span className="text-[#10b981]">*</span>
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

                  {/* Email */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="signup-email"
                        className="text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Email Address <span className="text-[#10b981]">*</span>
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

                  {/* Phone */}
                  <div>
                    <div className="mb-2 flex items-center justify-between">
                      <label
                        htmlFor="signup-phone"
                        className="flex flex-wrap items-center gap-2 text-sm font-semibold text-[var(--text-secondary)]"
                      >
                        Phone Number <span className="text-[#10b981]">*</span>
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
                      Email Address or Phone Number{" "}
                      <span className="text-[#10b981]">*</span>
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
                    <span className="text-[#10b981]">*</span>
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
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1.5 text-[var(--text-secondary)] transition hover:text-[var(--text-primary)]"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Live Testing Account Credentials banner */}
              {mode === "login" && (
                <div className="flex items-center justify-between gap-3 rounded-[18px] border border-[#22d3ee]/25 bg-[#22d3ee]/[0.08] p-3.5 sm:p-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                      <Sparkles
                        size={14}
                        className="shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                      />
                      <span>
                        {registeredUser
                          ? `Registered User Credentials (${registeredUser.fullName || "User"})`
                          : "Live Testing Account Credentials"}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] text-[var(--text-secondary)]">
                      Email:{" "}
                      <span className="font-semibold text-[var(--text-primary)]">
                        {registeredUser
                          ? registeredUser.email || registeredUser.phone
                          : "test@biowebsite.com"}
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
                    className="shrink-0 rounded-xl bg-[#10b981] px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-[#10b981]/25 transition-all hover:bg-[#059669] active:scale-95"
                  >
                    Auto-Fill
                  </button>
                </div>
              )}

              {/* Launch plans */}
              {mode === "signup" && (
                <>
                  <div className="pt-0.5">
                    <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                      <h2 className="flex items-center gap-1.5 text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                        <Sparkles
                          size={15}
                          className="text-[#0891b2] dark:text-[#22d3ee]"
                        />
                        Choose Launch Plan
                        <span className="text-[#10b981]">*</span>
                      </h2>
                      <span className="text-xs text-[var(--text-secondary)]">
                        Select card validity
                      </span>
                    </div>

                    <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                      {plans.map((plan) => {
                        const selected = selectedPlan === plan.id;

                        return (
                          <button
                            key={plan.id}
                            type="button"
                            onClick={() => setSelectedPlan(plan.id)}
                            aria-pressed={selected}
                            className={`relative rounded-[18px] border p-3 text-left transition-all duration-200 sm:p-3.5 ${
                              selected
                                ? "border-[#10b981] bg-[#10b981]/[0.14] ring-1 ring-[#10b981]/40 shadow-md shadow-[#10b981]/10"
                                : "border-[var(--border-color)] bg-[var(--surface-raised)] hover:border-[#10b981]/40"
                            }`}
                          >
                            {plan.bestValue && (
                              <span className="absolute -top-2 right-3.5 rounded-full bg-gradient-to-r from-[#10b981] to-[#22d3ee] px-2 py-0.5 text-[9.5px] font-extrabold text-white shadow-sm">
                                Best Value
                              </span>
                            )}

                            <div className="flex items-center justify-between gap-2">
                              <span className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                                {plan.name}
                              </span>

                              <span
                                className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition-colors ${
                                  selected
                                    ? "border-[#10b981] bg-[#10b981] text-white"
                                    : "border-[var(--border-color)] bg-[var(--surface)] text-transparent"
                                }`}
                              >
                                {selected ? (
                                  <Check size={10} strokeWidth={3} />
                                ) : null}
                              </span>
                            </div>

                            <span className="mt-1.5 block text-xl font-extrabold text-[#10b981]">
                              ₹{plan.price}
                            </span>

                            <span className="mt-0.5 block text-xs text-[var(--text-secondary)]">
                              {plan.description}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Payable amount */}
                  <div className="flex items-center justify-between gap-3 rounded-[15px] border border-[#10b981]/25 bg-[#10b981]/[0.06] p-3 sm:p-3.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-sm font-bold text-[#10b981]">
                        ₹
                      </span>
                      <div>
                        <p className="text-xs font-bold text-[var(--text-primary)] sm:text-sm">
                          Payable Amount (Auto-Filled):
                        </p>
                        <p className="mt-0.5 text-[10.5px] text-[var(--text-secondary)]">
                          {activePlan.id === "yearly"
                            ? "1 Year Annual Plan"
                            : "3 Years Comprehensive Plan"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <p className="text-lg font-extrabold text-[#10b981]">
                        ₹{activePlan.price}
                      </p>
                      <span className="rounded-full border border-emerald-500/30 bg-emerald-500/15 px-2 py-0.5 text-[9.5px] font-bold text-emerald-400">
                        ✓ Auto-Filled
                      </span>
                    </div>
                  </div>

                  {/* Info badge */}
                  <div className="flex items-start gap-2.5 rounded-[15px] border border-[#22d3ee]/20 bg-[#22d3ee]/[0.04] p-3">
                    <Sparkles
                      size={15}
                      className="mt-0.5 shrink-0 text-[#0891b2] dark:text-[#22d3ee]"
                    />
                    <p className="text-xs leading-4.5 text-[var(--text-secondary)]">
                      Quick 10-Second Registration. You can customize your shop
                      name, photos, address, and products anytime inside your
                      dashboard after creating your account!
                    </p>
                  </div>
                </>
              )}

              {message && (
                <div
                  role="status"
                  className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-3 text-xs leading-relaxed text-[var(--text-primary)]"
                >
                  {message}
                </div>
              )}

              {/* Submit */}
              <button
                type="submit"
                className={`flex min-h-[46px] w-full items-center justify-center gap-2 rounded-[15px] px-4 py-2.5 text-center text-xs sm:text-sm font-extrabold text-white shadow-lg transition-all hover:-translate-y-0.5 active:scale-[0.99] ${
                  mode === "signup"
                    ? "border border-emerald-400/40 bg-gradient-to-r from-[#10b981] to-[#22d3ee] shadow-[#10b981]/25 hover:brightness-110"
                    : "bg-[#10b981] shadow-[#10b981]/25 hover:bg-[#059669]"
                }`}
              >
                {mode === "signup" ? (
                  <>
                    <Sparkles size={16} />
                    <span>
                      Create Account &amp; Continue with ₹{activePlan.price}{" "}
                      Plan
                    </span>
                    <ArrowRight size={16} className="shrink-0" />
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
