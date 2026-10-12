import { useEffect, useRef, useState } from "react";
import PaymentModal from "../components/PaymentModal";
import {
  Menu,
  Copy,
  LogOut,
  ExternalLink,
  Smartphone,
  Pencil,
  IndianRupee,
  Palette,
  Package,
  Share2,
  MessageSquare,
  Sparkles,
  QrCode,
  Clock3,
  Check,
  MapPin,
  Phone,
  Mail,
  Globe,
  Star,
  Eye,
  ChevronDown,
  ShieldCheck,
  Store,
  Download,
  MessageCircle,
  AlertTriangle,
  Send,
  Trash2,
  X,
  CheckCircle2,
  PanelLeftClose,
  PanelLeftOpen,
  UserCheck,
  UserPlus,
} from "lucide-react";

const sidebarItems = [
  {
    id: "live-view",
    label: "Live Mini Website View",
    icon: Smartphone,
    action: "scroll-card",
  },
  {
    id: "edit-profile",
    label: "Edit Profile & Address",
    icon: Pencil,
    action: "edit-profile",
  },
  {
    id: "payments",
    label: "UPI & Payments",
    icon: IndianRupee,
    iconColor: "text-emerald-400",
    badge: "Setup",
    badgeStyle: "border border-amber-500/40 bg-amber-500/15 text-amber-300",
    action: "open-pay",
  },
  {
    id: "themes",
    label: "Website Themes",
    icon: Palette,
    badge: "5 Themes",
    badgeStyle: "border border-indigo-500/40 bg-indigo-500/20 text-indigo-300",
    action: "scroll-themes",
  },
  {
    id: "products",
    label: "Manage Products",
    icon: Package,
    badge: "1",
    badgeStyle: "bg-white/10 text-slate-300",
    action: "scroll-products",
  },
  {
    id: "social-cards",
    label: "Social Media Cards",
    icon: Share2,
    badge: "Thumbnails",
    badgeStyle: "border border-pink-500/40 bg-pink-500/20 text-pink-300",
    action: "social-cards",
  },
  {
    id: "inquiries",
    label: "Leads & Inquiries",
    icon: MessageSquare,
    badge: "1",
    badgeStyle: "border border-violet-500/40 bg-violet-500/20 text-violet-300",
    action: "scroll-inquiries",
  },
  {
    id: "refer-earn",
    label: "Refer & Earn",
    icon: Sparkles,
    iconColor: "text-emerald-400",
    badge: "New",
    badgeStyle:
      "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
    action: "refer-earn",
  },
  {
    id: "qr-sharing",
    label: "QR Code & Sharing",
    icon: QrCode,
    action: "scroll-qr",
  },
];

const drawerCategories = [
  {
    title: "STUDIO & PROFILE",
    items: [
      {
        id: "live-view",
        label: "Live Mini Website View",
        icon: Smartphone,
        action: "scroll-card",
      },
      {
        id: "edit-profile",
        label: "Edit Profile & Address",
        icon: Pencil,
        action: "edit-profile",
      },
      {
        id: "products",
        label: "Manage Products",
        icon: Package,
        badge: "1",
        badgeStyle: "bg-white/10 text-slate-300",
        action: "scroll-products",
      },
    ],
  },
  {
    title: "BRANDING & PAYMENTS",
    items: [
      {
        id: "payments",
        label: "UPI & Payments",
        icon: IndianRupee,
        iconColor: "text-emerald-400",
        badge: "Setup",
        badgeStyle: "border border-amber-500/40 bg-amber-500/15 text-amber-300",
        action: "open-pay",
      },
      {
        id: "themes",
        label: "Website Themes",
        icon: Palette,
        badge: "5 Themes",
        badgeStyle:
          "border border-indigo-500/40 bg-indigo-500/20 text-indigo-300",
        action: "scroll-themes",
      },
      {
        id: "social-cards",
        label: "Social Media Cards",
        icon: Share2,
        action: "social-cards",
      },
    ],
  },
  {
    title: "AUDIENCE & GROWTH",
    items: [
      {
        id: "inquiries",
        label: "Leads & Inquiries",
        icon: MessageSquare,
        action: "scroll-inquiries",
      },
      {
        id: "qr-sharing",
        label: "QR Code & vCard Sharing",
        icon: QrCode,
        badge: "QR Print",
        badgeStyle:
          "border border-indigo-500/40 bg-indigo-500/20 text-indigo-300",
        action: "scroll-qr",
      },
      {
        id: "refer-earn",
        label: "Refer & Earn",
        icon: Sparkles,
        iconColor: "text-emerald-400",
        badge: "₹150",
        badgeStyle:
          "border border-emerald-500/40 bg-emerald-500/20 text-emerald-300",
        action: "refer-earn",
      },
    ],
  },
];

const themes = [
  { name: "Executive Royal", colors: ["#6255ff", "#25204c"] },
  { name: "Emerald Luxe", colors: ["#10b981", "#064e3b"] },
  { name: "Rose Gold & Champagne", colors: ["#f43f78", "#e9cda7"] },
  { name: "Obsidian Noir & Platinum", colors: ["#475569", "#cbd5e1"] },
  { name: "Sunset Amber & Coral", colors: ["#f59e0b", "#fb7185"] },
];

const themeConfigs = {
  "Executive Royal": {
    name: "Executive Royal",
    accent: "#6366f1",
    accentHover: "#4f46e5",
    accentText: "text-indigo-400",
    badgeBg: "bg-indigo-500/20 text-indigo-300 border-indigo-500/40",
    headerGrad: "linear-gradient(145deg, #1e1b4b, #0d1326)",
    cardBg: "#0d1326",
    actionBtnGrad: "linear-gradient(135deg, #4f46e5, #7c3aed)",
    primaryButtonBg: "bg-indigo-600 hover:bg-indigo-500",
  },
  "Emerald Luxe": {
    name: "Emerald Luxe",
    accent: "#10b981",
    accentHover: "#059669",
    accentText: "text-emerald-400",
    badgeBg: "bg-emerald-500/20 text-emerald-300 border-emerald-500/40",
    headerGrad: "linear-gradient(145deg, #064e3b, #0d1e1c)",
    cardBg: "#081c19",
    actionBtnGrad: "linear-gradient(135deg, #059669, #0d9488)",
    primaryButtonBg: "bg-emerald-600 hover:bg-emerald-500",
  },
  "Rose Gold & Champagne": {
    name: "Rose Gold & Champagne",
    accent: "#f43f5e",
    accentHover: "#e11d48",
    accentText: "text-rose-400",
    badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
    headerGrad: "linear-gradient(145deg, #4c0519, #1c1017)",
    cardBg: "#1f1018",
    actionBtnGrad: "linear-gradient(135deg, #f43f5e, #fb7185)",
    primaryButtonBg: "bg-rose-600 hover:bg-rose-500",
  },
  "Obsidian Noir & Platinum": {
    name: "Obsidian Noir & Platinum",
    accent: "#94a3b8",
    accentHover: "#64748b",
    accentText: "text-slate-300",
    badgeBg: "bg-slate-500/20 text-slate-200 border-slate-500/40",
    headerGrad: "linear-gradient(145deg, #1e293b, #0f172a)",
    cardBg: "#111827",
    actionBtnGrad: "linear-gradient(135deg, #475569, #334155)",
    primaryButtonBg: "bg-slate-700 hover:bg-slate-600",
  },
  "Sunset Amber & Coral": {
    name: "Sunset Amber & Coral",
    accent: "#f59e0b",
    accentHover: "#d97706",
    accentText: "text-amber-400",
    badgeBg: "bg-amber-500/20 text-amber-300 border-amber-500/40",
    headerGrad: "linear-gradient(145deg, #451a03, #1c1410)",
    cardBg: "#1a120c",
    actionBtnGrad: "linear-gradient(135deg, #f59e0b, #e11d48)",
    primaryButtonBg: "bg-amber-600 hover:bg-amber-500",
  },
};

function Dashboard() {
  const [selectedPlan, setSelectedPlan] = useState("1");
  const [activeTheme, setActiveTheme] = useState(() => {
    try {
      return localStorage.getItem("bio-active-theme") || "Executive Royal";
    } catch {
      return "Executive Royal";
    }
  });
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [activeNavItem, setActiveNavItem] = useState("Live Mini Website View");
  const [previewMode, setPreviewMode] = useState(false);
  const [standeeCode, setStandeeCode] = useState("");
  const [notice, setNotice] = useState("");
  const [showPayModal, setShowPayModal] = useState(false);
  const [isActivated, setIsActivated] = useState(false);
  const [cardActionNotice, setCardActionNotice] = useState("");
  const cardActionNoticeTimer = useRef(null);
  const [toastMessage, setToastMessage] = useState("");
  const toastTimer = useRef(null);

  const [contactInfo, setContactInfo] = useState(() => {
    try {
      const saved = localStorage.getItem("bio-contact-info");
      if (saved) return JSON.parse(saved);
      const reg = localStorage.getItem("bio-registered-user");
      const regUser = reg ? JSON.parse(reg) : null;
      return {
        phone: regUser?.phone || "",
        email: regUser?.email || "",
        address: "",
        hours: "Mon - Sat: 9:30 AM - 7:30 PM",
      };
    } catch {
      return {
        phone: "",
        email: "",
        address: "",
        hours: "Mon - Sat: 9:30 AM - 7:30 PM",
      };
    }
  });

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewHoverRating, setReviewHoverRating] = useState(0);
  const [reviewFullName, setReviewFullName] = useState("");
  const [reviewRelationship, setReviewRelationship] =
    useState("Verified Customer");
  const [reviewTestimonial, setReviewTestimonial] = useState("");
  const [reviewSuccessMessage, setReviewSuccessMessage] = useState("");
  const [reviewsList, setReviewsList] = useState(() => {
    try {
      const saved = localStorage.getItem("bio-customer-reviews");
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const ratingLabels = {
    1: "1.0 - Poor",
    2: "2.0 - Fair",
    3: "3.0 - Good",
    4: "4.0 - Very Good",
    5: "5.0 - Excellent!",
  };

  const registeredUser = (() => {
    try {
      const saved = localStorage.getItem("bio-registered-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  })();
  const ownerName = registeredUser?.fullName || "Your Business";

  const averageRating =
    reviewsList.length > 0
      ? (
          reviewsList.reduce((acc, r) => acc + r.rating, 0) / reviewsList.length
        ).toFixed(1)
      : "5.0";

  const handleReviewSubmit = (e) => {
    e.preventDefault();
    if (!reviewFullName.trim() || !reviewTestimonial.trim()) {
      showToast("Please enter your name and testimonial.");
      return;
    }

    const newReview = {
      id: Date.now(),
      rating: reviewRating,
      fullName: reviewFullName.trim(),
      relationship: reviewRelationship.trim() || "Verified Customer",
      testimonial: reviewTestimonial.trim(),
      date: new Date().toLocaleDateString(),
    };

    const updated = [newReview, ...reviewsList];
    setReviewsList(updated);
    try {
      localStorage.setItem("bio-customer-reviews", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }

    setReviewSuccessMessage(
      "Thank you! Your testimonial and star review has been posted.",
    );
    showToast("Review submitted successfully!");

    window.setTimeout(() => {
      setReviewFullName("");
      setReviewRelationship("Verified Customer");
      setReviewTestimonial("");
      setReviewRating(5);
      setReviewSuccessMessage("");
      setShowReviewForm(false);
    }, 2200);
  };

  const handleDeleteReview = (id) => {
    const updated = reviewsList.filter((r) => r.id !== id);
    setReviewsList(updated);
    try {
      localStorage.setItem("bio-customer-reviews", JSON.stringify(updated));
    } catch (err) {
      console.error(err);
    }
    showToast("Review removed.");
  };

  const [inquiryName, setInquiryName] = useState("");
  const [inquiryEmail, setInquiryEmail] = useState("");
  const [inquiryPhone, setInquiryPhone] = useState("");
  const [inquiryMessage, setInquiryMessage] = useState("");

  const handleInquirySubmit = (e) => {
    e.preventDefault();
    if (!inquiryName.trim() || !inquiryPhone.trim()) {
      showToast("Please enter your name and phone number.");
      return;
    }

    const cleanTargetPhone = (() => {
      const raw = contactInfo?.phone || registeredUser?.phone || "";
      let digits = raw.replace(/[^0-9]/g, "");
      if (digits.length === 10) digits = "91" + digits;
      return digits;
    })();

    const messageText =
      `*New Inquiry for ${ownerName}*\n\n` +
      `👤 *Name:* ${inquiryName.trim()}\n` +
      `📞 *Phone:* ${inquiryPhone.trim()}\n` +
      (inquiryEmail.trim() ? `✉️ *Email:* ${inquiryEmail.trim()}\n` : "") +
      `💬 *Message:* ${inquiryMessage.trim() || "Hello! I am interested in your services/products."}`;

    const whatsappUrl = cleanTargetPhone
      ? `https://web.whatsapp.com/send?phone=${cleanTargetPhone}&text=${encodeURIComponent(messageText)}`
      : `https://web.whatsapp.com/send?text=${encodeURIComponent(messageText)}`;

    showToast("Redirecting to WhatsApp Web...");

    const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
    if (!win || win.closed || typeof win.closed === "undefined") {
      window.location.href = whatsappUrl;
    }
  };

  const handleNavClick = (item) => {
    setActiveNavItem(item.label);
    setSidebarOpen(false);

    switch (item.action) {
      case "scroll-card":
        document
          .getElementById("visiting-card")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "edit-profile":
        showToast(
          "Tap any field on your card to edit profile & contact details!",
        );
        document
          .getElementById("visiting-card")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "scroll-products":
        document
          .getElementById("products-section")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "open-pay":
        setShowPayModal(true);
        break;
      case "scroll-themes":
        document
          .getElementById("theme-selector")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "social-cards":
        showToast(
          "Social media card thumbnails are generated for your profile.",
        );
        break;
      case "scroll-inquiries":
        document
          .getElementById("inquiry-form")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "scroll-qr":
        document
          .getElementById("qr-section")
          ?.scrollIntoView({ behavior: "smooth" });
        break;
      case "refer-earn":
        showToast(
          "Refer & Earn: Earn ₹150 for every friend who activates their card!",
        );
        break;
      default:
        break;
    }
  };

  const amount = selectedPlan === "1" ? 499 : 999;
  const currentThemeConfig =
    themeConfigs[activeTheme] || themeConfigs["Executive Royal"];

  const showToast = (message) => {
    setToastMessage(message);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToastMessage(""), 3500);
  };

  const handleThemeSelect = (themeName) => {
    setActiveTheme(themeName);
    try {
      localStorage.setItem("bio-active-theme", themeName);
    } catch (err) {
      console.error(err);
    }
    showToast({
      title: "Theme Applied Successfully!",
      description: `${themeName} theme applied to your mini website.`,
      actionLabel: "Launch (₹499)",
      onAction: () => setShowPayModal(true),
    });
  };

  const updateContactField = (field, label, currentValue) => {
    const input = window.prompt(label, currentValue || "");
    if (input !== null) {
      const updated = { ...contactInfo, [field]: input.trim() };
      setContactInfo(updated);
      try {
        localStorage.setItem("bio-contact-info", JSON.stringify(updated));
      } catch (err) {
        console.error(err);
      }
      showToast(
        input.trim()
          ? `${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully!`
          : `${field.charAt(0).toUpperCase() + field.slice(1)} cleared.`,
      );
    }
  };

  const showCardActionNotice = (message) => {
    setCardActionNotice(message);
    window.clearTimeout(cardActionNoticeTimer.current);
    cardActionNoticeTimer.current = window.setTimeout(
      () => setCardActionNotice(""),
      3500,
    );
  };

  useEffect(() => {
    return () => {
      window.clearTimeout(cardActionNoticeTimer.current);
      window.clearTimeout(toastTimer.current);
    };
  }, []);

  const copyLink = async () => {
    const link = `${window.location.origin}/preview`;
    try {
      await navigator.clipboard.writeText(link);
      setNotice("Preview link copied!");
    } catch {
      setNotice(`Your preview link: ${link}`);
    }
    window.setTimeout(() => setNotice(""), 3000);
  };

  const handleStandee = (event) => {
    event.preventDefault();
    setNotice(
      standeeCode.trim()
        ? "Standee activation will be available after backend integration."
        : "Please enter your standee code.",
    );
    window.setTimeout(() => setNotice(""), 3500);
  };

  const logout = () => {
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-[#080b1b] text-slate-100">
      {/* Payment modal */}
      {showPayModal && <PaymentModal onClose={() => setShowPayModal(false)} />}

      {/* Slide-out Sidebar Drawer */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop overlay */}
          <div
            className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Sidebar */}
          <aside
            className="relative z-10 flex h-full w-[88vw] max-w-[310px] flex-col justify-between border-r border-white/10 bg-[#090e1f] p-4 sm:p-5 shadow-2xl overflow-y-auto"
            style={{ maxHeight: "100vh" }}
          >
            <div>
              {/* Drawer Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/50 bg-violet-500/20">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
                      alt="Business owner"
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <h3 className="truncate text-sm font-extrabold text-white">
                      {ownerName}&apos;s Business
                    </h3>
                    <div className="flex items-center gap-1.5 text-[11px] font-semibold text-amber-400">
                      <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                      <span>Pending Activation</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSidebarOpen(false)}
                  className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                  title="Close sidebar"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Digital Card Link Section */}
              <div className="mt-4">
                <label className="text-[10px] font-extrabold tracking-widest text-slate-500 uppercase">
                  DIGITAL CARD LINK
                </label>
                <div className="mt-1.5 flex items-center justify-between gap-2 rounded-xl border border-white/10 bg-[#10172e] p-1.5 pl-3">
                  <span className="truncate font-mono text-[11px] text-slate-300">
                    {window.location.origin}/preview
                  </span>
                  <button
                    onClick={copyLink}
                    className="shrink-0 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] font-bold text-slate-200 transition hover:bg-white/10 hover:text-white active:scale-95"
                  >
                    Copy
                  </button>
                </div>
              </div>

              {/* Categorized Navigation matching Slide-out Drawer */}
              <nav className="mt-5 space-y-5">
                {drawerCategories.map((category) => (
                  <div key={category.title}>
                    <h4 className="px-1 text-[10px] font-extrabold tracking-wider text-slate-500 uppercase">
                      {category.title}
                    </h4>
                    <div className="mt-1.5 space-y-1">
                      {category.items.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeNavItem === item.label;

                        return (
                          <button
                            key={item.label}
                            onClick={() => handleNavClick(item)}
                            className={`flex min-h-[42px] w-full items-center gap-3 rounded-xl px-3 py-2 text-left text-xs sm:text-[13px] font-semibold transition ${
                              isActive
                                ? "bg-gradient-to-r from-violet-600 to-indigo-600 text-white font-bold shadow-md shadow-violet-950/40"
                                : "text-slate-300 hover:bg-white/5 hover:text-white"
                            }`}
                          >
                            <Icon
                              size={17}
                              className={
                                isActive
                                  ? "shrink-0 text-white"
                                  : item.iconColor || "text-slate-400"
                              }
                            />
                            <span className="min-w-0 flex-1 truncate">
                              {item.label}
                            </span>
                            {item.badge && (
                              <span
                                className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                  item.badgeStyle ||
                                  "bg-white/10 text-slate-300"
                                }`}
                              >
                                {item.badge}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </nav>
            </div>

            {/* Bottom Actions */}
            <div className="pt-6 border-t border-white/10 mt-6 space-y-3">
              <button
                onClick={() => {
                  window.location.href = "/preview";
                }}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 py-3 text-xs sm:text-sm font-extrabold text-white shadow-lg shadow-indigo-950/40 transition hover:brightness-110 active:scale-[0.98]"
              >
                <ExternalLink size={15} />
                Preview Private Card
              </button>

              <button
                onClick={logout}
                className="flex w-full items-center justify-center gap-2 text-xs font-semibold text-rose-400 transition hover:text-rose-300 py-1"
              >
                <LogOut size={14} />
                Log Out of Account
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Dashboard header */}
      <header className="sticky top-0 z-40 flex min-h-[64px] sm:min-h-[74px] items-center justify-between gap-2.5 sm:gap-4 border-b border-white/10 bg-[#0c1325]/95 px-3 py-2.5 backdrop-blur-xl sm:px-6 lg:px-9">
        <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
          <div className="flex h-9 w-9 sm:h-11 sm:w-11 shrink-0 items-center justify-center overflow-hidden rounded-full border border-violet-400/50 bg-violet-500/20">
            <img
              src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&h=120&q=80"
              alt="Business owner"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
              <h1 className="truncate text-xs sm:text-base font-extrabold text-white max-w-[130px] sm:max-w-none">
                Your Business
              </h1>
              <span className="rounded-full border border-amber-500/40 bg-amber-500/10 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300 whitespace-nowrap">
                ACTIVATION PENDING
              </span>
            </div>
            <p className="mt-0.5 truncate text-[11px] sm:text-xs text-slate-400">
              Business Owner / Professional
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          {/* Navbar Menu button is ONLY responsible for opening the slide-out navigation drawer */}
          <button
            onClick={() => setSidebarOpen(true)}
            className="flex items-center gap-1.5 sm:gap-2 rounded-xl bg-violet-600 px-2.5 py-2 sm:px-3 sm:py-2.5 text-xs font-bold text-white transition hover:bg-violet-500 active:scale-95"
            title="Open Menu"
          >
            <Menu size={16} />
            <span className="hidden sm:inline">Menu</span>
          </button>

          <button
            onClick={() => {
              window.location.href = "/preview";
            }}
            className="hidden items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 sm:flex"
          >
            <ExternalLink size={15} />
            Card Preview
          </button>

          <button
            onClick={() =>
              showCardActionNotice(
                "Card Activation Pending: Please complete payment to activate link copying and public sharing.",
              )
            }
            className="hidden items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-2.5 text-xs font-semibold text-slate-300 hover:bg-white/10 md:flex"
          >
            <Copy size={15} />
            Copy Link
          </button>

          <button
            onClick={logout}
            title="Back to website"
            className="flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:bg-white/10 active:scale-95"
          >
            <LogOut size={16} />
          </button>
        </div>
      </header>

      <div className="mx-auto max-w-[1720px] px-3 py-4 sm:px-6 lg:px-7">
        {/* Activation and pricing banner */}
        <section className="mb-6 sm:mb-7 flex flex-col gap-4 sm:gap-5 rounded-[22px] sm:rounded-[26px] border border-amber-500/40 bg-gradient-to-r from-[#2b1c12] via-[#281c1c] to-[#201a30] p-4 sm:p-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex items-start gap-3 sm:gap-4">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl sm:rounded-2xl bg-amber-500/20 text-amber-300">
              <Clock3 size={22} className="sm:size-[25px]" />
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                <h2 className="text-sm sm:text-base font-extrabold text-amber-200">
                  Card Activation Pending — Choose Plan to Launch
                </h2>
                <span className="rounded-full bg-amber-500/20 px-2 py-0.5 sm:px-2.5 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-amber-200">
                  PAYMENT REQUIRED
                </span>
              </div>
              <p className="mt-1 max-w-2xl text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-300">
                Select your plan below. Price is auto-calculated. Complete
                payment to activate your card, unlock WhatsApp sharing, and
                enable vCard downloads.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 sm:gap-3 w-full sm:w-auto sm:flex-row sm:flex-wrap sm:items-center xl:justify-end">
            <div className="flex w-full sm:w-auto rounded-2xl border border-amber-500/30 bg-[#111626] p-1">
              <button
                onClick={() => setSelectedPlan("1")}
                className={`flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-bold transition ${
                  selectedPlan === "1"
                    ? "bg-violet-600 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {selectedPlan === "1" && <Check size={14} />}1 Year (₹499)
              </button>

              <button
                onClick={() => setSelectedPlan("3")}
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-xl px-2.5 sm:px-3 py-2 text-xs font-bold transition ${
                  selectedPlan === "3"
                    ? "bg-violet-600 text-white"
                    : "text-slate-300 hover:bg-white/5"
                }`}
              >
                {selectedPlan === "3" && <Check size={14} />}3 Years (₹999)
                <span className="absolute -top-3 right-1 sm:right-2 rounded-full bg-amber-500 px-1.5 py-0.5 text-[8px] sm:text-[9px] font-extrabold text-black">
                  BEST VALUE
                </span>
              </button>
            </div>

            <button
              onClick={() => setShowPayModal(true)}
              className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-4 py-3 text-sm font-extrabold text-white shadow-lg shadow-violet-950/40 transition hover:brightness-110 active:scale-[0.99]"
            >
              <IndianRupee size={16} />
              Pay ₹{amount} &amp; Launch Card
            </button>

            <button
              onClick={() => {
                window.location.href = "/preview";
              }}
              className="hidden items-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-3 py-2.5 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 sm:flex"
            >
              <ExternalLink size={15} />
              Preview
            </button>
          </div>
        </section>

        {notice && (
          <div
            role="status"
            className="mb-5 rounded-xl border border-violet-400/30 bg-violet-500/10 px-4 py-3 text-xs sm:text-sm text-violet-200"
          >
            {notice}
          </div>
        )}

        {cardActionNotice && (
          <div
            role="alert"
            className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:right-auto z-50 flex sm:w-[calc(100%-2rem)] max-w-md sm:-translate-x-1/2 items-center gap-2.5 sm:gap-3 rounded-2xl border border-amber-300/70 bg-amber-500 px-3.5 py-3 text-xs sm:text-sm font-bold text-black shadow-2xl"
          >
            <AlertTriangle size={17} className="shrink-0" />
            <span>{cardActionNotice}</span>
          </div>
        )}

        {toastMessage &&
          (typeof toastMessage === "object" ? (
            /* Rich Top-Right Notification */
            <aside
              aria-label="Notification"
              className="fixed right-3 left-3 sm:left-auto sm:right-4 top-16 sm:top-20 z-50 flex sm:max-w-md items-center gap-3 rounded-2xl border border-emerald-400/40 bg-gradient-to-r from-[#038550] via-[#059669] to-[#047857] px-3.5 py-3 text-white shadow-2xl shadow-emerald-950/60 backdrop-blur-xl animate-in slide-in-from-top-4 duration-300"
            >
              <div className="flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full bg-white/20 text-white">
                <Check size={16} className="stroke-[3]" />
              </div>

              <div className="min-w-0 flex-1">
                <h4 className="text-xs font-black tracking-wide text-white">
                  {toastMessage.title || "Success!"}
                </h4>
                <p className="mt-0.5 truncate text-[11px] font-medium text-emerald-100">
                  {toastMessage.description}
                </p>
              </div>

              {toastMessage.actionLabel && (
                <button
                  type="button"
                  onClick={() => {
                    toastMessage.onAction?.();
                    setToastMessage("");
                  }}
                  className="shrink-0 rounded-xl bg-white px-2.5 py-1 sm:px-3.5 sm:py-1.5 text-xs font-black text-emerald-800 shadow-sm transition hover:bg-emerald-50 active:scale-95"
                >
                  {toastMessage.actionLabel}
                </button>
              )}

              <button
                type="button"
                onClick={() => setToastMessage("")}
                className="rounded-lg p-1 text-emerald-200 transition hover:bg-white/10 hover:text-white"
                title="Dismiss"
              >
                <X size={14} />
              </button>
            </aside>
          ) : (
            <div
              role="status"
              className="fixed bottom-4 left-3 right-3 sm:left-1/2 sm:right-auto z-50 flex sm:w-[calc(100%-2rem)] max-w-md sm:-translate-x-1/2 items-center gap-2.5 sm:gap-3 rounded-2xl border border-violet-400/50 bg-[#0f172a] px-3.5 py-3 text-xs sm:text-sm font-bold text-white shadow-2xl shadow-violet-950/70 backdrop-blur-xl"
            >
              <Check size={17} className="shrink-0 text-emerald-400" />
              <span>{toastMessage}</span>
            </div>
          ))}

        <div className="flex items-start gap-5">
          {/* Collapsible In-Page Sidebar: hidden on small/tablet screens, visible on lg screens */}
          <aside
            className={`hidden lg:block shrink-0 transition-all duration-300 ${
              sidebarCollapsed ? "w-[68px]" : "w-[260px] xl:w-[275px]"
            }`}
          >
            {!sidebarCollapsed ? (
              <div className="space-y-4">
                {/* NAVIGATION Card */}
                <div className="rounded-[26px] border border-white/10 bg-[#0d1426] p-4 shadow-xl">
                  <div className="mb-3 flex items-center justify-between border-b border-white/10 pb-3 px-1">
                    <span className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                      NAVIGATION
                    </span>
                    <button
                      onClick={() => setSidebarCollapsed(true)}
                      className="rounded-lg p-1 text-slate-400 transition hover:bg-white/10 hover:text-white"
                      title="Collapse sidebar"
                    >
                      <PanelLeftClose size={18} />
                    </button>
                  </div>

                  <nav className="space-y-1">
                    {sidebarItems.map((item) => {
                      const Icon = item.icon;
                      const isActive = activeNavItem === item.label;

                      return (
                        <button
                          key={item.id}
                          onClick={() => handleNavClick(item)}
                          className={`flex min-h-[42px] w-full items-center gap-3 rounded-2xl px-3 py-2 text-left text-xs font-semibold transition ${
                            isActive
                              ? "bg-[#5448ea] text-white font-bold shadow-md shadow-indigo-950/50"
                              : "text-slate-300 hover:bg-white/5 hover:text-white"
                          }`}
                        >
                          <Icon
                            size={18}
                            className={`shrink-0 ${
                              isActive
                                ? "text-white"
                                : item.iconColor || "text-slate-400"
                            }`}
                          />
                          <span className="min-w-0 flex-1 truncate">
                            {item.label}
                          </span>
                          {item.badge && (
                            <span
                              className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
                                item.badgeStyle || "bg-white/10 text-slate-300"
                              }`}
                            >
                              {item.badge}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </nav>
                </div>

                {/* VISITOR ACTIVITY Card */}
                <div className="rounded-[26px] border border-white/10 bg-[#0d1426] p-4 sm:p-5 shadow-xl">
                  <h3 className="text-[11px] font-extrabold tracking-wider text-slate-400 uppercase">
                    VISITOR ACTIVITY
                  </h3>

                  <div className="mt-3 flex items-center justify-between border-b border-white/10 pb-3 text-xs sm:text-sm">
                    <span className="text-slate-400">Total Profile Views</span>
                    <strong className="text-white font-bold">1</strong>
                  </div>

                  <div className="flex items-center justify-between border-b border-white/10 py-3 text-xs sm:text-sm">
                    <span className="text-slate-400">Inquiries Received</span>
                    <strong className="text-violet-400 font-bold">1</strong>
                  </div>

                  <button
                    onClick={() =>
                      showCardActionNotice(
                        "Card is pending activation: vCard download unlocks after activation.",
                      )
                    }
                    className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl border border-amber-500/30 bg-[#1e1919] py-3 text-xs font-bold text-amber-300 transition hover:bg-amber-500/20 active:scale-[0.98]"
                  >
                    <UserCheck size={16} />
                    vCard Download (Locked)
                  </button>
                </div>
              </div>
            ) : (
              /* Collapsed slim icon-only sidebar */
              <div className="sticky top-24 flex flex-col items-center rounded-[26px] border border-white/10 bg-[#0d1426] py-3.5 px-2 shadow-xl">
                <button
                  onClick={() => setSidebarCollapsed(false)}
                  className="flex h-10 w-10 items-center justify-center rounded-xl text-slate-400 transition hover:bg-white/10 hover:text-white"
                  title="Expand sidebar"
                >
                  <PanelLeftOpen size={19} />
                </button>

                <div className="my-2 h-[1px] w-7 bg-white/10" />

                <div className="flex flex-col items-center gap-1.5 w-full">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = activeNavItem === item.label;

                    return (
                      <button
                        key={item.id}
                        onClick={() => handleNavClick(item)}
                        title={item.label}
                        className={`flex h-11 w-11 items-center justify-center rounded-2xl transition ${
                          isActive
                            ? "bg-[#5448ea] text-white shadow-md shadow-indigo-950/50"
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        }`}
                      >
                        <Icon
                          size={19}
                          className={
                            isActive
                              ? "text-white"
                              : item.iconColor || "text-slate-400"
                          }
                        />
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </aside>

          {/* Main dashboard content */}
          <main className="min-w-0 flex-1">
            {/* Mobile Horizontal Quick Navigation Bar */}
            <div className="mb-5 block lg:hidden">
              <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none [scrollbar-width:none] [-ms-overflow-style:none]">
                {sidebarItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeNavItem === item.label;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavClick(item)}
                      className={`flex shrink-0 items-center gap-1.5 rounded-full px-3 py-2 text-xs font-bold transition-all active:scale-95 ${
                        isActive
                          ? "bg-violet-600 text-white shadow-md shadow-violet-950/50"
                          : "border border-white/10 bg-[#0d1426] text-slate-300 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      <Icon
                        size={14}
                        className={
                          isActive
                            ? "text-white"
                            : item.iconColor || "text-slate-400"
                        }
                      />
                      <span>{item.label}</span>
                      {item.badge && (
                        <span
                          className={`rounded-full px-1.5 py-0.2 text-[9px] font-extrabold ${
                            item.badgeStyle || "bg-white/10 text-slate-300"
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Standee connection */}
            <section
              id="standee-section"
              className="mb-6 rounded-[22px] sm:rounded-[27px] border border-violet-500/40 bg-gradient-to-br from-[#17152f] to-[#171027] p-4 sm:p-7"
            >
              <div className="flex flex-col gap-4 sm:gap-5">
                <div className="flex flex-wrap items-start justify-between gap-2.5">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-2xl bg-violet-600 text-white">
                      <QrCode size={20} className="sm:size-[22px]" />
                    </div>
                    <div className="min-w-0">
                      <h2 className="text-sm sm:text-base font-extrabold">
                        Link Physical Counter Standee
                      </h2>
                      <p className="mt-0.5 text-xs text-slate-400 sm:text-sm">
                        Received your acrylic counter standee? Connect it once
                        to go live.
                      </p>
                    </div>
                  </div>

                  <span className="shrink-0 rounded-full bg-amber-500/15 px-2.5 py-0.5 sm:px-3 sm:py-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300">
                    ACTION REQUIRED
                  </span>
                </div>

                <form onSubmit={handleStandee}>
                  <label
                    htmlFor="standeeCode"
                    className="mb-1.5 block text-xs font-bold text-slate-300"
                  >
                    Standee Alphanumeric Code *
                  </label>

                  <div className="flex flex-col gap-2 sm:flex-row">
                    <input
                      id="standeeCode"
                      value={standeeCode}
                      onChange={(event) => setStandeeCode(event.target.value)}
                      placeholder="E.G. XR-1001 OR SHOPX007"
                      className="min-w-0 flex-1 rounded-2xl border border-white/15 bg-[#101629] px-3.5 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm outline-none placeholder:text-slate-500 focus:border-violet-400"
                    />

                    <button
                      type="submit"
                      className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 sm:px-5 sm:py-3 text-xs sm:text-sm font-bold text-white hover:bg-violet-500 active:scale-[0.99]"
                    >
                      <Check size={16} />
                      Activate Standee
                    </button>
                  </div>

                  <p className="mt-2 text-[11px] sm:text-xs text-slate-400">
                    Enter the code printed on your physical standee. Once
                    activated, customers scanning it can reach your page.
                  </p>
                </form>
              </div>
            </section>

            {/* Preview heading */}
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-extrabold sm:text-2xl">
                  Live Mini Website Preview
                </h2>
                <p className="mt-0.5 text-xs sm:text-sm text-slate-400">
                  This is how prospective clients see your digital card when you
                  share the link or QR code.
                </p>
              </div>

              <button
                onClick={() => {
                  window.location.href = "/preview";
                }}
                className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-violet-500/40 bg-violet-500/10 px-3.5 py-2 sm:px-4 sm:py-2.5 text-xs sm:text-sm font-bold text-violet-300 hover:bg-violet-500/20 active:scale-95"
              >
                <Eye size={16} />
                Full Screen Mode
              </button>
            </div>

            {/* Theme selector */}
            <section
              id="theme-selector"
              className="mb-5 flex flex-col gap-3 rounded-[22px] border border-white/10 bg-[#0d1426] p-3.5 sm:p-4 xl:flex-row xl:items-center xl:justify-between"
            >
              <div className="flex items-center gap-2 text-xs sm:text-sm font-bold">
                <Palette
                  size={17}
                  style={{ color: currentThemeConfig.accent }}
                />
                <span className="text-slate-200">Active Theme:</span>
                <span style={{ color: currentThemeConfig.accent }}>
                  {activeTheme}
                </span>
              </div>

              <div className="flex flex-wrap gap-1.5 sm:gap-2">
                {themes.map((theme) => {
                  const isCurrent = activeTheme === theme.name;
                  const cfg =
                    themeConfigs[theme.name] || themeConfigs["Executive Royal"];
                  return (
                    <button
                      key={theme.name}
                      onClick={() => handleThemeSelect(theme.name)}
                      style={
                        isCurrent
                          ? {
                              borderColor: cfg.accent,
                              backgroundColor: `${cfg.accent}22`,
                              boxShadow: `0 0 12px ${cfg.accent}33`,
                            }
                          : {}
                      }
                      className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold transition ${
                        isCurrent
                          ? "text-white"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-white/25 hover:text-white"
                      }`}
                    >
                      <span className="flex -space-x-1">
                        {theme.colors.map((color) => (
                          <span
                            key={color}
                            style={{ backgroundColor: color }}
                            className="h-3 w-3 rounded-full border border-white/20"
                          />
                        ))}
                      </span>
                      <span>{theme.name}</span>
                      {isCurrent && (
                        <Check size={13} style={{ color: cfg.accent }} />
                      )}
                    </button>
                  );
                })}
              </div>
            </section>

            {/* Digital visiting card styled by active theme */}
            <section
              id="visiting-card"
              style={{
                backgroundColor: currentThemeConfig.cardBg,
              }}
              className={`overflow-hidden rounded-[22px] sm:rounded-[28px] border border-white/15 transition-colors duration-500 shadow-2xl ${
                previewMode
                  ? "fixed inset-2 z-50 overflow-y-auto sm:inset-8"
                  : ""
              }`}
            >
              {previewMode && (
                <div
                  style={{ backgroundColor: currentThemeConfig.accent }}
                  className="sticky top-0 z-10 flex items-center justify-between gap-2 px-3 py-2.5 sm:px-4 sm:py-3 text-xs sm:text-sm font-semibold text-white"
                >
                  <span className="flex items-center gap-1.5 truncate">
                    <Eye size={16} />
                    <span className="truncate">Interactive Live Customer Preview Mode</span>
                  </span>
                  <button
                    onClick={() => setPreviewMode(false)}
                    className="shrink-0 rounded-lg bg-white/20 px-2.5 py-1 sm:px-3 sm:py-2 text-xs font-bold"
                  >
                    Back to Editor
                  </button>
                </div>
              )}

              <div className="mx-auto max-w-[700px] p-2.5 sm:p-6">
                {/* Business cover */}
                <div className="relative h-40 overflow-hidden rounded-t-[18px] sm:rounded-t-[25px] sm:h-64">
                  <img
                    src="https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=85"
                    alt="Business office cover"
                    className="h-full w-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                  <span className="absolute left-2.5 top-2.5 sm:left-4 sm:top-4 rounded-full border border-white/20 bg-black/60 px-2.5 py-1 text-[10px] sm:text-xs font-bold text-white max-w-[70%] truncate">
                    <Store size={13} className="mr-1 inline" />
                    General Service Provider
                  </span>
                  <button
                    onClick={copyLink}
                    title="Share profile"
                    className="absolute right-2.5 top-2.5 sm:right-4 sm:top-4 flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                  >
                    <Share2 size={16} className="sm:size-[18px]" />
                  </button>
                </div>

                {/* Profile */}
                <div
                  className="relative border-b border-white/10 p-4 sm:p-7 transition-all duration-500"
                  style={{
                    background: currentThemeConfig.headerGrad,
                  }}
                >
                  <div className="mb-4 sm:mb-5 flex flex-col gap-3 sm:flex-row sm:items-end">
                    <div className="relative -mt-14 h-24 w-24 sm:-mt-20 sm:h-36 sm:w-36 shrink-0 overflow-hidden rounded-[20px] sm:rounded-[25px] border-4 border-[#11182c] bg-slate-700 shadow-xl">
                      <img
                        src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&h=300&q=85"
                        alt="Business owner profile"
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute bottom-1.5 right-1.5 sm:bottom-2 sm:right-2 flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-emerald-500 text-white shadow-md">
                        <Check size={12} className="stroke-[3] sm:size-[14px]" />
                      </div>
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                        <h3 className="break-words text-xl font-black text-white sm:text-3xl">
                          {ownerName}
                        </h3>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[10px] sm:text-xs font-bold ${currentThemeConfig.badgeBg}`}
                        >
                          <Sparkles size={12} />
                          Verified Business • 1 Year
                        </span>
                      </div>
                      <p
                        style={{ color: currentThemeConfig.accent }}
                        className="mt-1 font-bold text-xs sm:text-base break-words"
                      >
                        Business Owner / Professional{" "}
                        <span className="text-slate-400 font-normal">at</span>{" "}
                        <span
                          style={{ color: currentThemeConfig.accent }}
                          className="font-bold"
                        >
                          {ownerName}&apos;s Business
                        </span>
                      </p>
                      <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-400">
                        <div className="flex items-center gap-0.5">
                          {[1, 2, 3, 4, 5].map((s) => (
                            <Star
                              key={s}
                              size={13}
                              className="fill-amber-400 text-amber-400"
                            />
                          ))}
                        </div>
                        <span className="font-extrabold text-white">
                          {averageRating}
                        </span>
                        <span className="text-slate-400">
                          ({reviewsList.length} reviews)
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-300">
                    &ldquo;Welcome to my official digital visiting card &amp; mini
                    website&rdquo;
                  </p>

                  <div className="mt-3 flex flex-wrap items-center gap-2 text-xs sm:text-sm text-slate-300">
                    <MapPin size={15} className="text-rose-400" />
                    <span>India</span>
                    <span className="text-slate-600">•</span>
                    <span className="font-semibold text-emerald-400">
                      Open for Inquiries
                    </span>
                  </div>

                  {/* Contact buttons */}
                  <div className="mt-5 grid grid-cols-3 gap-2 sm:grid-cols-6">
                    {[
                      {
                        label: "Save Contact",
                        icon: UserPlus,
                        color: currentThemeConfig.accent,
                        isPrimary: true,
                      },
                      { label: "Call", icon: Phone, color: "#10b981" },
                      {
                        label: "WhatsApp",
                        icon: MessageCircle,
                        color: "#10b981",
                      },
                      { label: "Email", icon: Mail, color: "#60a5fa" },
                      { label: "Directions", icon: MapPin, color: "#fb7185" },
                      { label: "Share", icon: Share2, color: "#f59e0b" },
                    ].map((action) => {
                      const Icon = action.icon;
                      return (
                        <button
                          key={action.label}
                          onClick={() =>
                            showCardActionNotice(
                              action.label === "Save Contact"
                                ? "Card Pending Activation: .vcf contact download is disabled until activated by Admin."
                                : `Card Pending Activation: ${action.label} is disabled until activated by Admin.`,
                            )
                          }
                          style={
                            action.isPrimary
                              ? {
                                  background: currentThemeConfig.actionBtnGrad,
                                  borderColor: currentThemeConfig.accent,
                                }
                              : {}
                          }
                          className={`flex min-h-[68px] sm:min-h-[76px] flex-col items-center justify-center gap-1.5 rounded-2xl border px-1 py-2 sm:py-3 transition hover:scale-105 active:scale-95 ${
                            action.isPrimary
                              ? "text-white shadow-lg shadow-black/40"
                              : "border-white/10 bg-white/5 hover:bg-white/10 text-slate-200"
                          }`}
                        >
                          <Icon size={19} className="sm:size-[21px]" style={{ color: action.color }} />
                          <span className="text-center text-[10px] font-bold leading-tight sm:text-xs">
                            {action.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* About business */}
                <div className="border-b border-white/10 p-4 sm:p-7">
                  <h3 className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-extrabold">
                    <Store
                      size={18}
                      className="sm:size-[20px]"
                      style={{ color: currentThemeConfig.accent }}
                    />
                    ABOUT OUR BUSINESS
                  </h3>
                  <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm leading-relaxed sm:leading-6 text-slate-300">
                    Welcome to Your Business! Contact us directly for
                    appointments, consultations, orders, or service inquiries.
                  </p>
                </div>

                {/* Products */}
                <div
                  id="products-section"
                  className="border-b border-white/10 p-4 sm:p-7"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="flex items-center gap-3 text-base font-extrabold">
                      <Sparkles
                        size={20}
                        style={{ color: currentThemeConfig.accent }}
                      />
                      FEATURED PRODUCTS & SERVICES
                    </h3>
                    <span className="shrink-0 text-xs text-slate-400">
                      1 item
                    </span>
                  </div>

                  <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <h4 className="font-bold">Featured Service / Product</h4>
                      <span
                        style={{
                          borderColor: `${currentThemeConfig.accent}55`,
                          color: currentThemeConfig.accent,
                          backgroundColor: `${currentThemeConfig.accent}15`,
                        }}
                        className="rounded-full border px-3 py-1 text-xs font-semibold"
                      >
                        Contact for pricing
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-300">
                      Quality solution provided with high standards of customer
                      satisfaction.
                    </p>

                    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-white/10 pt-3">
                      <span className="text-xs font-bold text-slate-400">
                        CORE SERVICE
                      </span>

                      <div className="flex flex-wrap items-center gap-2">
                        {/* WhatsApp Button */}
                        <a
                          href="https://web.whatsapp.com/"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2 text-xs font-bold text-emerald-400 transition hover:bg-emerald-500/20"
                        >
                          <MessageCircle size={15} />
                          WhatsApp
                        </a>

                        {/* Inquire Now Button */}
                        <button
                          onClick={() =>
                            document
                              .getElementById("inquiry-form")
                              ?.scrollIntoView({
                                behavior: "smooth",
                                block: "start",
                              })
                          }
                          style={{
                            background: currentThemeConfig.actionBtnGrad,
                          }}
                          className="flex items-center gap-1 rounded-xl px-4 py-2 text-xs font-bold text-white shadow-md transition hover:brightness-110 active:scale-95"
                        >
                          Inquire Now <span aria-hidden="true">›</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Contact details */}
                <div className="border-b border-white/10 p-4 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <h3 className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-extrabold">
                      <Phone
                        size={18}
                        className="sm:size-[20px]"
                        style={{ color: currentThemeConfig.accent }}
                      />
                      CONTACT &amp; BUSINESS HOURS
                    </h3>
                    <span className="text-[11px] sm:text-xs font-semibold text-slate-400">
                      Click any card to connect or edit
                    </span>
                  </div>

                  <div className="mt-4 grid gap-2.5 sm:gap-3 sm:grid-cols-2">
                    <ContactItem
                      icon={Phone}
                      title="Phone Number"
                      value={contactInfo.phone || "Add your phone number"}
                      isPlaceholder={!contactInfo.phone}
                      actionType="call"
                      themeAccent={currentThemeConfig.accent}
                      onClick={() => {
                        if (contactInfo.phone) {
                          window.location.href = `tel:${contactInfo.phone.replace(/\s+/g, "")}`;
                          navigator.clipboard?.writeText(contactInfo.phone);
                          showToast(
                            `📞 Dialing ${contactInfo.phone} (copied to clipboard)`,
                          );
                        } else {
                          updateContactField(
                            "phone",
                            "Enter your phone number (e.g. +91 98765 43210):",
                            "",
                          );
                        }
                      }}
                      onEdit={() =>
                        updateContactField(
                          "phone",
                          "Edit your phone number:",
                          contactInfo.phone,
                        )
                      }
                    />

                    <ContactItem
                      icon={Mail}
                      title="Email Address"
                      value={contactInfo.email || "Add your email address"}
                      isPlaceholder={!contactInfo.email}
                      actionType="email"
                      themeAccent={currentThemeConfig.accent}
                      onClick={() => {
                        if (contactInfo.email) {
                          window.location.href = `mailto:${contactInfo.email}`;
                          navigator.clipboard?.writeText(contactInfo.email);
                          showToast(
                            `✉️ Opening email to ${contactInfo.email} (copied to clipboard)`,
                          );
                        } else {
                          updateContactField(
                            "email",
                            "Enter your email address (e.g. contact@business.com):",
                            "",
                          );
                        }
                      }}
                      onEdit={() =>
                        updateContactField(
                          "email",
                          "Edit your email address:",
                          contactInfo.email,
                        )
                      }
                    />

                    <ContactItem
                      icon={MapPin}
                      title="Physical Address"
                      value={contactInfo.address || "Add your business address"}
                      isPlaceholder={!contactInfo.address}
                      actionType="map"
                      themeAccent={currentThemeConfig.accent}
                      onClick={() => {
                        if (contactInfo.address) {
                          window.open(
                            `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                              contactInfo.address,
                            )}`,
                            "_blank",
                            "noopener,noreferrer",
                          );
                          showToast(
                            `📍 Opening Google Maps for ${contactInfo.address}`,
                          );
                        } else {
                          updateContactField(
                            "address",
                            "Enter your business address (e.g. Connaught Place, New Delhi):",
                            "",
                          );
                        }
                      }}
                      onEdit={() =>
                        updateContactField(
                          "address",
                          "Edit your business address:",
                          contactInfo.address,
                        )
                      }
                    />

                    <ContactItem
                      icon={Clock3}
                      title="Operating Hours"
                      value={
                        contactInfo.hours || "Mon - Sat: 9:30 AM - 7:30 PM"
                      }
                      actionType="hours"
                      themeAccent={currentThemeConfig.accent}
                      onClick={() => {
                        const hours =
                          contactInfo.hours || "Mon - Sat: 9:30 AM - 7:30 PM";
                        navigator.clipboard?.writeText(hours);
                        showToast(
                          `⏰ Operating Hours: ${hours} (Copied to clipboard)`,
                        );
                      }}
                      onEdit={() =>
                        updateContactField(
                          "hours",
                          "Edit your operating hours:",
                          contactInfo.hours || "Mon - Sat: 9:30 AM - 7:30 PM",
                        )
                      }
                    />

                    <ContactItem
                      icon={Globe}
                      title="Digital Profile Card Link"
                      value={`${window.location.origin}/preview`}
                      actionType="link"
                      themeAccent={currentThemeConfig.accent}
                      onClick={() => {
                        const link = `${window.location.origin}/preview`;
                        window.open(link, "_blank", "noopener,noreferrer");
                        navigator.clipboard?.writeText(link);
                        showToast(
                          "🔗 Digital profile link copied and opened in a new tab!",
                        );
                      }}
                    />
                  </div>
                </div>

                {/* Reviews */}
                <div className="border-b border-white/10 p-4 sm:p-7">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-extrabold">
                      <Star
                        size={18}
                        className="text-amber-400 fill-amber-400 sm:size-[20px]"
                      />
                      CUSTOMER REVIEWS &amp; TRUST
                    </h3>
                    <button
                      type="button"
                      onClick={() => setShowReviewForm(!showReviewForm)}
                      style={{
                        borderColor: `${currentThemeConfig.accent}66`,
                        backgroundColor: `${currentThemeConfig.accent}15`,
                        color: currentThemeConfig.accent,
                      }}
                      className="rounded-xl border px-3 py-1.5 sm:py-2 text-xs font-bold transition hover:brightness-125 active:scale-95"
                    >
                      {showReviewForm ? "+ Close Form" : "+ Write a Review"}
                    </button>
                  </div>

                  {/* Overall Score Card */}
                  {reviewsList.length > 0 && (
                    <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-[22px] border border-white/10 bg-[#0d1426] p-5 sm:p-6">
                      <div className="flex items-center gap-4">
                        <span className="text-3xl font-black text-white sm:text-4xl">
                          {averageRating}
                        </span>
                        <div>
                          <div className="flex items-center gap-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star
                                key={star}
                                size={16}
                                className={`${
                                  Math.round(Number(averageRating)) >= star
                                    ? "text-amber-400 fill-amber-400"
                                    : "text-slate-600 fill-transparent"
                                }`}
                              />
                            ))}
                          </div>
                          <p className="mt-1 text-xs text-slate-400">
                            Based on {reviewsList.length}{" "}
                            {reviewsList.length === 1
                              ? "customer review"
                              : "customer reviews"}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-xs font-bold text-emerald-400">
                        <ShieldCheck size={14} />
                        100% Verified
                      </div>
                    </div>
                  )}

                  {/* Review Form Card */}
                  {showReviewForm && (
                    <div className="mt-4 rounded-[20px] sm:rounded-[24px] border border-amber-500/30 bg-[#0e162b]/95 p-4 shadow-2xl sm:p-7">
                      <div className="mb-4 sm:mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-3 sm:pb-4">
                        <div className="flex items-center gap-2">
                          <Star
                            size={17}
                            className="text-amber-400 fill-amber-400"
                          />
                          <h4 className="text-xs font-bold text-white sm:text-base">
                            Give Feedback to {ownerName}&apos;s Business
                          </h4>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowReviewForm(false)}
                          className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition hover:bg-white/10 hover:text-white"
                        >
                          <X size={15} />
                        </button>
                      </div>

                      <form onSubmit={handleReviewSubmit} className="space-y-3.5 sm:space-y-4">
                        {/* Rating Stars */}
                        <div>
                          <label className="block text-xs font-bold text-slate-300">
                            Your Rating:
                          </label>
                          <div className="mt-2 flex flex-wrap items-center gap-1.5 sm:gap-2">
                            <div className="flex items-center gap-0.5 sm:gap-1">
                              {[1, 2, 3, 4, 5].map((starVal) => {
                                const isFilled =
                                  (reviewHoverRating || reviewRating) >=
                                  starVal;
                                return (
                                  <button
                                    key={starVal}
                                    type="button"
                                    onMouseEnter={() =>
                                      setReviewHoverRating(starVal)
                                    }
                                    onMouseLeave={() => setReviewHoverRating(0)}
                                    onClick={() => setReviewRating(starVal)}
                                    className="p-0.5 transition-transform hover:scale-110 focus:outline-none"
                                  >
                                    <Star
                                      size={22}
                                      className={`sm:size-[26px] ${
                                        isFilled
                                          ? "text-amber-400 fill-amber-400"
                                          : "text-slate-600 fill-transparent"
                                      }`}
                                    />
                                  </button>
                                );
                              })}
                            </div>
                            <span className="ml-1 sm:ml-2 text-xs sm:text-sm font-bold text-amber-400">
                              {ratingLabels[reviewHoverRating || reviewRating]}
                            </span>
                          </div>
                        </div>

                        {/* Full Name */}
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-300">
                            Your Full Name{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <input
                            required
                            value={reviewFullName}
                            onChange={(e) => setReviewFullName(e.target.value)}
                            placeholder="e.g. Rahul Sharma"
                            className="w-full rounded-2xl border border-white/15 bg-[#10172c] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
                          />
                        </div>

                        {/* City / Relationship */}
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-300">
                            Your City or Relationship (Optional)
                          </label>
                          <input
                            value={reviewRelationship}
                            onChange={(e) =>
                              setReviewRelationship(e.target.value)
                            }
                            placeholder="Verified Customer"
                            className="w-full rounded-2xl border border-white/15 bg-[#10172c] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
                          />
                        </div>

                        {/* Testimonial */}
                        <div>
                          <label className="mb-1.5 block text-xs font-bold text-slate-300">
                            Your Testimonial / Experience{" "}
                            <span className="text-rose-400">*</span>
                          </label>
                          <div className="relative">
                            <textarea
                              required
                              rows={3}
                              value={reviewTestimonial}
                              onChange={(e) =>
                                setReviewTestimonial(e.target.value)
                              }
                              placeholder="Tell new customers about the quality of service, turnaround time, or customer satisfaction..."
                              className="w-full resize-none rounded-2xl border border-white/15 bg-[#10172c] px-3.5 py-2.5 sm:px-4 sm:py-3.5 pr-10 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-amber-400"
                            />
                            {reviewTestimonial.trim().length > 0 && (
                              <CheckCircle2
                                size={16}
                                className="pointer-events-none absolute bottom-3 right-3 text-emerald-400 fill-emerald-500/20"
                              />
                            )}
                          </div>
                        </div>

                        {/* Success Message Banner */}
                        {reviewSuccessMessage && (
                          <div className="flex items-center gap-2 rounded-2xl border border-emerald-500/40 bg-emerald-500/10 px-3.5 py-2.5 text-xs sm:text-sm font-semibold text-emerald-300">
                            <Check
                              size={16}
                              className="shrink-0 text-emerald-400"
                            />
                            <span>{reviewSuccessMessage}</span>
                          </div>
                        )}

                        {/* Actions */}
                        <div className="flex items-center justify-end gap-2.5 pt-1">
                          <button
                            type="button"
                            onClick={() => setShowReviewForm(false)}
                            className="px-3 py-1.5 text-xs sm:text-sm font-semibold text-slate-400 transition hover:text-white"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            style={{
                              background: currentThemeConfig.actionBtnGrad,
                            }}
                            className="flex items-center gap-1.5 rounded-xl px-4 py-2 sm:px-5 sm:py-2.5 text-xs sm:text-sm font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-95"
                          >
                            <Send size={14} />
                            Post Testimonial
                          </button>
                        </div>
                      </form>
                    </div>
                  )}

                  {/* Reviews List */}
                  {reviewsList.length > 0 && (
                    <div className="mt-4 space-y-3">
                      {reviewsList.map((review) => (
                        <div
                          key={review.id}
                          className="rounded-[20px] sm:rounded-[22px] border border-white/10 bg-[#0d1426] p-4 sm:p-6"
                        >
                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-1">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                  key={s}
                                  size={15}
                                  className={`${
                                    review.rating >= s
                                      ? "text-amber-400 fill-amber-400"
                                      : "text-slate-600 fill-transparent"
                                  }`}
                                />
                              ))}
                            </div>

                            <div className="flex items-center gap-2">
                              <span className="rounded-full border border-emerald-500/30 bg-emerald-500/10 px-2 py-0.5 text-[10px] sm:text-xs font-bold text-emerald-400">
                                Verified Client
                              </span>
                              <button
                                type="button"
                                onClick={() => handleDeleteReview(review.id)}
                                title="Delete review"
                                className="p-1 text-rose-400 transition hover:text-rose-300 active:scale-95"
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </div>

                          <p className="mt-2.5 text-xs sm:text-sm italic text-slate-200">
                            &ldquo;{review.testimonial}&rdquo;
                          </p>

                          <div className="mt-3.5 flex items-center gap-2.5">
                            <div
                              style={{
                                background: currentThemeConfig.actionBtnGrad,
                              }}
                              className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-full text-xs sm:text-sm font-extrabold text-white shadow-md"
                            >
                              {review.fullName.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0">
                              <p className="truncate text-xs sm:text-sm font-bold text-white">
                                {review.fullName}
                              </p>
                              <p className="text-[11px] sm:text-xs text-slate-400">
                                {review.relationship || "Verified Customer"}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Empty state card */}
                  {reviewsList.length === 0 && (
                    <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 px-4 py-7 text-center">
                      <Star size={32} className="mx-auto text-amber-400" />
                      <h4 className="mt-2 text-sm font-bold">
                        Be the first to leave a review!
                      </h4>
                      <p className="mx-auto mt-1.5 max-w-sm text-xs sm:text-sm text-slate-400">
                        Have you worked with or purchased from {ownerName}
                        &apos;s Business? Share your rating and feedback.
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowReviewForm(true)}
                        style={{ background: currentThemeConfig.actionBtnGrad }}
                        className="mt-3.5 rounded-xl px-4 py-2 text-xs sm:text-sm font-extrabold text-white transition hover:brightness-110 active:scale-95"
                      >
                        + Write First Review
                      </button>
                    </div>
                  )}
                </div>

                {/* Inquiry form */}
                <div
                  id="inquiry-form"
                  className="scroll-mt-24 border-b border-white/10 p-4 sm:p-7"
                >
                  <h3 className="flex items-center gap-2.5 sm:gap-3 text-sm sm:text-base font-extrabold">
                    <Send
                      size={18}
                      className="sm:size-[20px]"
                      style={{ color: currentThemeConfig.accent }}
                    />
                    SHARE YOUR CONTACT / SEND INQUIRY
                  </h3>
                  <p className="mt-1 text-xs sm:text-sm text-slate-400">
                    Share your contact number or leave a message for {ownerName}{" "}
                    to receive a fast response.
                  </p>

                  <form
                    onSubmit={handleInquirySubmit}
                    className="mt-4 space-y-3.5 sm:space-y-4"
                  >
                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-300">
                        Your Name *
                      </label>
                      <input
                        required
                        value={inquiryName}
                        onChange={(e) => setInquiryName(e.target.value)}
                        placeholder="e.g. Rahul Sharma"
                        className="w-full rounded-2xl border border-white/15 bg-[#101629] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
                      />
                    </div>

                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-300">
                          Email Address
                        </label>
                        <input
                          type="email"
                          value={inquiryEmail}
                          onChange={(e) => setInquiryEmail(e.target.value)}
                          placeholder="name@example.com"
                          className="w-full rounded-2xl border border-white/15 bg-[#101629] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
                        />
                      </div>
                      <div>
                        <label className="mb-1.5 block text-xs font-bold text-slate-300">
                          Phone Number *
                        </label>
                        <input
                          required
                          type="tel"
                          value={inquiryPhone}
                          onChange={(e) => setInquiryPhone(e.target.value)}
                          placeholder="+91 98765 43210"
                          className="w-full rounded-2xl border border-white/15 bg-[#101629] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="mb-1.5 block text-xs font-bold text-slate-300">
                        Your Requirements / Message
                      </label>
                      <textarea
                        rows={3}
                        value={inquiryMessage}
                        onChange={(e) => setInquiryMessage(e.target.value)}
                        placeholder="Describe what you are looking for..."
                        className="w-full resize-y rounded-2xl border border-white/15 bg-[#101629] px-3.5 py-2.5 sm:px-4 sm:py-3.5 text-xs sm:text-sm text-white outline-none placeholder:text-slate-500 focus:border-violet-400"
                      />
                    </div>

                    <button
                      type="submit"
                      style={{ background: currentThemeConfig.actionBtnGrad }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl px-4 py-3 sm:py-4 text-xs sm:text-sm font-extrabold text-white shadow-lg transition hover:brightness-110 active:scale-[0.99]"
                    >
                      <Send size={16} />
                      Submit Inquiry Instantly
                    </button>
                  </form>
                </div>

                {/* QR code placeholder */}
                <div id="qr-section" className="scroll-mt-24 p-4 sm:p-7">
                  <div className="rounded-[22px] sm:rounded-[25px] border border-white/15 bg-white/[0.03] p-4 sm:p-6 text-center">
                    <div className="flex items-center justify-center gap-2 sm:gap-3">
                      <QrCode
                        size={22}
                        className="sm:size-[25px]"
                        style={{ color: currentThemeConfig.accent }}
                      />
                      <h3 className="text-sm sm:text-base font-extrabold">
                        Scan QR Code to Share or Save
                      </h3>
                    </div>
                    <span className="mt-3 inline-flex rounded-full border border-amber-500/30 bg-amber-500/10 px-2.5 py-1 text-[9px] sm:text-[10px] font-extrabold text-amber-300">
                      <Clock3 size={12} className="mr-1 inline" />
                      Pending Admin Activation (Inactive)
                    </span>
                    <p className="mx-auto mt-2 max-w-sm text-xs sm:text-sm text-slate-400">
                      Point your smartphone camera to save contact or share with
                      prospective clients instantly.
                    </p>

                    <div className="relative mx-auto mt-4 flex h-[190px] w-[190px] sm:h-[216px] sm:w-[216px] items-center justify-center overflow-hidden rounded-[20px] border border-slate-300 bg-white p-3 shadow-lg">
                      <img
                        src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&format=png&margin=12&data=${encodeURIComponent(
                          `${window.location.origin}/preview`,
                        )}`}
                        alt="Business profile QR code"
                        className={`h-full w-full object-contain ${
                          isActivated ? "" : "blur-[1.5px] opacity-60"
                        }`}
                      />
                      {!isActivated && (
                        <span className="absolute rounded-lg border border-amber-500/60 bg-[#111827]/95 px-2.5 py-1.5 text-[11px] sm:text-xs font-extrabold text-amber-300 shadow-lg">
                          Pending Activation
                        </span>
                      )}{" "}
                    </div>

                    <div className="mt-4 flex flex-col sm:flex-row justify-center gap-2 sm:gap-3">
                      <button
                        onClick={() =>
                          showCardActionNotice(
                            "Card is pending admin activation. Link copying is disabled until activated by Admin.",
                          )
                        }
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-amber-300 hover:bg-amber-500/20 active:scale-95"
                      >
                        <Copy size={15} />
                        Copy Link
                      </button>
                      <button
                        onClick={() =>
                          showCardActionNotice(
                            "Card is pending admin activation. QR code download is disabled until activated by Admin.",
                          )
                        }
                        className="flex w-full sm:w-auto items-center justify-center gap-2 rounded-xl border border-white/10 bg-slate-700 px-4 py-2.5 sm:py-3 text-xs sm:text-sm font-bold text-slate-200 hover:bg-slate-600 active:scale-95"
                      >
                        <Download size={15} />
                        Download QR PNG
                      </button>
                    </div>
                  </div>
                </div>

                <footer className="flex flex-col items-center justify-between gap-2.5 border-t border-white/10 px-4 py-4 text-xs text-slate-400 sm:flex-row sm:px-7 sm:py-5">
                  <span>
                    Powered by{" "}
                    <strong className="text-slate-200">BIO Website</strong>
                  </span>
                  <a
                    href="/"
                    style={{ color: currentThemeConfig.accent }}
                    className="font-bold hover:brightness-125"
                  >
                    Create Your Own Mini Website →
                  </a>
                </footer>
              </div>
            </section>
          </main>
        </div>
      </div>
    </div>
  );
}

function ContactItem({
  icon: Icon,
  title,
  value,
  onClick,
  onEdit,
  actionType,
  isPlaceholder,
  themeAccent,
}) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick?.();
        }
      }}
      className="group relative flex min-w-0 cursor-pointer items-start justify-between gap-2.5 sm:gap-3 rounded-xl sm:rounded-2xl border border-white/10 bg-white/5 p-3 sm:p-4 text-left transition-all duration-200 hover:border-white/25 hover:bg-white/[0.08] hover:shadow-lg active:scale-[0.99] focus:outline-none"
    >
      <div className="flex min-w-0 flex-1 items-start gap-2.5 sm:gap-3">
        <div
          style={{
            borderColor: `${themeAccent || "#818cf8"}40`,
            backgroundColor: `${themeAccent || "#818cf8"}18`,
            color: themeAccent || "#818cf8",
          }}
          className="flex h-9 w-9 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl border transition-colors duration-200"
        >
          <Icon size={17} className="sm:size-[19px]" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <p className="text-[11px] sm:text-xs text-slate-400 transition-colors group-hover:text-slate-300">
              {title}
            </p>
            {isPlaceholder && (
              <span
                style={{
                  backgroundColor: `${themeAccent || "#818cf8"}25`,
                  color: themeAccent || "#818cf8",
                }}
                className="rounded-full px-1.5 py-0.2 sm:px-2 sm:py-0.5 text-[8px] sm:text-[9px] font-bold"
              >
                Click to add
              </span>
            )}
          </div>
          <p
            className={`mt-0.5 sm:mt-1 break-all sm:break-words text-xs sm:text-sm font-semibold transition-colors ${
              isPlaceholder
                ? "text-slate-400 group-hover:text-slate-200"
                : "text-slate-200 group-hover:text-white"
            }`}
          >
            {value}
          </p>
        </div>
      </div>

      <div className="flex shrink-0 items-center gap-1 pt-0.5 opacity-60 transition-opacity group-hover:opacity-100">
        {onEdit && (
          <button
            type="button"
            title={`Edit ${title}`}
            onClick={(e) => {
              e.stopPropagation();
              onEdit();
            }}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-400 transition-colors hover:border-white/30 hover:bg-white/10 hover:text-white"
          >
            <Pencil size={12} />
          </button>
        )}
        {(actionType === "link" ||
          (actionType === "map" && !isPlaceholder)) && (
          <div
            style={{ color: themeAccent || "#818cf8" }}
            className="flex h-7 w-7 items-center justify-center rounded-lg transition-colors"
          >
            <ExternalLink size={14} />
          </div>
        )}
      </div>
    </div>
  );
}

export default Dashboard;
