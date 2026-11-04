import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../redux/api";
import {
  Upload, Image as ImageIcon, Trash2, RefreshCw, Check,
  ChevronDown, ArrowLeft, ArrowRight, Link as LinkIcon,
  User, Briefcase, Phone, MessageSquare, Mail, Loader2,
  Store, Navigation, MapPin, Clock, Wallet, Zap, Rocket,
  Save, AtSign, Building2, Globe, Camera, Pencil, Share2,
  QrCode, Download, CheckCircle2, Circle, Sparkles
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyProfile, saveMyProfile } from "../redux/slice/profileSlice";

/* ==================== SHARED STYLES ==================== */

const inputCls =
  "w-full min-w-0 rounded-xl border border-[#29435f] bg-[#0b1b30] px-3.5 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none transition duration-200 hover:border-[#38516e] focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10";

const cardCls =
  "rounded-2xl border border-[#29435f] bg-[#132942]/80 p-4 sm:p-5";

const secondaryButtonCls =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-cyan-300/50 hover:bg-[#193754] hover:text-cyan-200 disabled:cursor-not-allowed disabled:opacity-50";

const primaryButtonCls =
  "inline-flex items-center justify-center gap-2 rounded-xl border border-cyan-200/30 bg-cyan-300 px-5 py-3 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50";

/* ==================== TAB ORDER ==================== */

const TAB_ORDER = [
  "Profile",
  "Professional",
  "Contact & Address",
  "UPI and Payment",
  "Lead Capture",
];

/* ==================== BUSINESS HOURS ==================== */

const businessHourPresets = [
  "Mon - Sat: 9:30 AM - 7:30 PM | Sun: Closed",
  "Mon - Fri: 9:00 AM - 6:00 PM | Sat - Sun: Closed",
  "Mon - Sun: 10:00 AM - 8:00 PM",
  "24/7 Open",
  "Mon - Sat: 10:00 AM - 9:00 PM | Sun: 11:00 AM - 5:00 PM",
];

/* ==================== ABOUT US DATA ==================== */

const aboutUs = [
  {
    category: "barber",
    title: "About Our Barber Shop",
    shortDescription: "Professional grooming and stylish haircuts.",
    description:
      "Welcome to our barber shop, where style meets quality. We provide professional haircuts, beard trimming, shaving, hair styling, and grooming services. Our experienced barbers focus on customer satisfaction, hygiene, and modern styles to give every customer a fresh and confident look.",
    services: ["Haircut", "Beard Trimming", "Clean Shave", "Hair Styling", "Hair Wash", "Grooming Services"],
  },
  {
    category: "bakery",
    title: "About Our Bakery",
    shortDescription: "Freshly baked products made with love.",
    description:
      "Welcome to our bakery, your destination for fresh, delicious, and high-quality baked goods. We prepare cakes, pastries, cookies, breads, and other bakery products using quality ingredients. Our goal is to deliver freshness, great taste, and a delightful experience for every customer.",
    services: ["Fresh Bread", "Birthday Cakes", "Pastries", "Cookies", "Custom Cakes", "Bakery Snacks"],
  },
  {
    category: "tool_shop",
    title: "About Our Tool Shop",
    shortDescription: "Reliable tools for professionals and DIY projects.",
    description:
      "Welcome to our tool shop, offering a wide range of reliable tools and equipment for professionals, technicians, and DIY enthusiasts. We focus on quality, durability, and affordability to help our customers complete their projects efficiently.",
    services: ["Hand Tools", "Power Tools", "Measuring Tools", "Repair Tools", "Safety Equipment", "Tool Accessories"],
  },
  {
    category: "hardware_shop",
    title: "About Our Hardware Shop",
    shortDescription: "Quality hardware supplies for every project.",
    description:
      "Welcome to our hardware shop, your trusted destination for construction, repair, and home improvement supplies. We offer a variety of hardware products, fittings, plumbing supplies, electrical accessories, paints, and building materials to support projects of every size.",
    services: ["Building Materials", "Paints and Brushes", "Plumbing Supplies", "Electrical Accessories", "Locks and Fittings", "Screws and Fasteners"],
  },
  {
    category: "biryani_shop",
    title: "About Our Biryani Shop",
    shortDescription: "Authentic and flavorful biryani for every occasion.",
    description:
      "Welcome to our biryani shop, where aromatic spices, quality ingredients, and delicious recipes come together. We serve freshly prepared biryani with rich flavors and satisfying portions. Whether you are ordering lunch, dinner, or food for a special occasion, we aim to make every meal memorable.",
    services: ["Chicken Biryani", "Mutton Biryani", "Veg Biryani", "Egg Biryani", "Family Combos", "Party Orders"],
  },
  {
    category: "restaurant",
    title: "About Our Restaurant",
    shortDescription: "Delicious food and memorable dining experiences.",
    description:
      "Welcome to our restaurant, where great food, warm hospitality, and a comfortable atmosphere come together. We offer a diverse menu prepared with quality ingredients and attention to taste. Our mission is to provide excellent service and a satisfying dining experience for families, friends, and food lovers.",
    services: ["Dine-In", "Takeaway", "Online Food Orders", "Family Meals", "Group Dining", "Special Menu"],
  },
  {
    category: "fast_food_shop",
    title: "About Our Fast Food Shop",
    shortDescription: "Quick bites packed with delicious flavors.",
    description:
      "Welcome to our fast food shop, serving tasty and freshly prepared meals for customers on the go. From burgers and pizzas to sandwiches, fries, and wraps, we offer convenient food options with great taste and friendly service.",
    services: ["Burgers", "Pizza", "French Fries", "Sandwiches", "Wraps and Rolls", "Combo Meals"],
  },
  {
    category: "cafe",
    title: "About Our Cafe",
    shortDescription: "Your cozy place for coffee, snacks, and relaxation.",
    description:
      "Welcome to our cafe, a welcoming space to enjoy freshly brewed coffee, refreshing beverages, and delicious snacks. Whether you are meeting friends, working remotely, or simply taking a break, we aim to create a comfortable atmosphere with quality food and friendly service.",
    services: ["Hot Coffee", "Cold Coffee", "Tea", "Milkshakes", "Snacks", "Desserts"],
  },
    {
    category: "doctor",
    title: "About Our Medical Practice",
    shortDescription: "Professional healthcare with care and compassion.",
    description:
      "Welcome to our medical practice, where patient care, trust, and well-being come first. We focus on providing professional healthcare consultations, medical guidance, preventive care, and personalized attention. Our goal is to help patients maintain better health through compassionate service and quality medical support.",
    services: ["General Consultation", "Health Checkups", "Medical Advice", "Preventive Healthcare", "Patient Care", "Follow-up Consultation"],
  },
  {
    category: "engineer",
    title: "About Our Engineering Services",
    shortDescription: "Innovative engineering solutions for modern challenges.",
    description:
      "Welcome to our engineering services, where technical expertise meets innovation. We provide professional engineering solutions with a focus on quality, efficiency, safety, and reliability. Our aim is to deliver practical solutions that meet client requirements and industry standards.",
    services: ["Project Planning", "Technical Consulting", "Design Solutions", "Quality Inspection", "Engineering Support", "Project Management"],
  },
  {
    category: "developer",
    title: "About Our Development Services",
    shortDescription: "Building modern digital experiences through technology.",
    description:
      "Welcome to our development services, where creativity and technology come together. We specialize in building modern websites, web applications, software solutions, and digital products. Our focus is on clean code, responsive design, performance, and user-friendly experiences.",
    services: ["Website Development", "Web Applications", "Frontend Development", "Backend Development", "E-commerce Solutions", "Website Maintenance"],
  },
  {
    category: "lawyer",
    title: "About Our Legal Services",
    shortDescription: "Professional legal guidance you can trust.",
    description:
      "Welcome to our legal practice, committed to providing professional legal guidance and client-focused support. We assist individuals and businesses with legal consultations, documentation, dispute resolution, and legal representation while maintaining professionalism and confidentiality.",
    services: ["Legal Consultation", "Documentation", "Civil Law", "Business Legal Advice", "Dispute Resolution", "Legal Representation"],
  },
  {
    category: "photographer",
    title: "About Our Photography Studio",
    shortDescription: "Capturing beautiful moments and timeless memories.",
    description:
      "Welcome to our photography studio, where every moment tells a story. We specialize in capturing beautiful memories through creative photography, professional editing, and attention to detail. From personal portraits to special events, we aim to deliver photographs that last a lifetime.",
    services: ["Wedding Photography", "Portrait Photography", "Event Photography", "Product Photography", "Photo Editing", "Pre-Wedding Shoots"],
  },
  {
    category: "interior_designer",
    title: "About Our Interior Design Studio",
    shortDescription: "Creating beautiful and functional living spaces.",
    description:
      "Welcome to our interior design studio, where creativity, comfort, and functionality come together. We design stylish residential and commercial spaces according to client preferences, lifestyle, and budget. Our goal is to transform ordinary spaces into beautiful and practical environments.",
    services: ["Home Interior Design", "Office Interior Design", "Space Planning", "Furniture Selection", "Lighting Design", "3D Interior Visualization"],
  },
  {
    category: "real_estate",
    title: "About Our Real Estate Services",
    shortDescription: "Helping you find the right property and investment.",
    description:
      "Welcome to our real estate services, your trusted partner for buying, selling, and renting properties. We help clients explore suitable residential and commercial properties with professional guidance, transparent communication, and personalized assistance.",
    services: ["Property Buying", "Property Selling", "Rental Services", "Residential Properties", "Commercial Properties", "Property Consultation"],
  },
  {
    category: "fitness_trainer",
    title: "About Our Fitness Training",
    shortDescription: "Helping you build strength and achieve fitness goals.",
    description:
      "Welcome to our fitness training services, where your health and fitness goals matter. We provide personalized workout guidance, fitness planning, strength training, and lifestyle support. Our focus is to help clients build healthy habits and improve their overall fitness.",
    services: ["Personal Training", "Strength Training", "Weight Management", "Workout Planning", "Fitness Assessment", "Online Training"],
  },
];

const industryOptions = [
  { value: "barber", label: "Barber" },
  { value: "bakery", label: "Bakery" },
  { value: "tool_shop", label: "Tool Shop" },
  { value: "hardware_shop", label: "Hardware Shop" },
  { value: "biryani_shop", label: "Biryani Shop" },
  { value: "restaurant", label: "Restaurant" },
  { value: "fast_food_shop", label: "Fast Food Shop" },
  { value: "cafe", label: "Cafe" },
  { value: "doctor", label: "Doctor" },
  { value: "engineer", label: "Engineer" },
  { value: "developer", label: "Developer" },
  { value: "lawyer", label: "Lawyer" },
  { value: "photographer", label: "Photographer" },
  { value: "interior_designer", label: "Interior Designer" },
  { value: "real_estate", label: "Real Estate" },
  { value: "fitness_trainer", label: "Fitness Trainer" },

];

const jobTitleOptions = [
  { value: "business_owner", label: "Business Owner" },
  { value: "founder", label: "Founder" },
  { value: "ceo", label: "CEO" },
  { value: "manager", label: "Manager" },
  { value: "doctor", label: "Doctor" },
  { value: "dentist", label: "Dentist" },
  { value: "engineer", label: "Engineer" },
  { value: "software_engineer", label: "Software Engineer" },
  { value: "developer", label: "Software Developer" },
  { value: "frontend_developer", label: "Frontend Developer" },
  { value: "backend_developer", label: "Backend Developer" },
  { value: "full_stack_developer", label: "Full Stack Developer" },
  { value: "designer", label: "Designer" },
  { value: "ui_ux_designer", label: "UI/UX Designer" },
  { value: "graphic_designer", label: "Graphic Designer" },
  { value: "teacher", label: "Teacher" },
  { value: "professor", label: "Professor" },
  { value: "lawyer", label: "Lawyer" },
  { value: "architect", label: "Architect" },
  { value: "photographer", label: "Photographer" },
  { value: "interior_designer", label: "Interior Designer" },
  { value: "real_estate_agent", label: "Real Estate Agent" },
  { value: "fitness_trainer", label: "Fitness Trainer" },
  { value: "consultant", label: "Consultant" },
  { value: "freelancer", label: "Freelancer" },
  { value: "student", label: "Student" },
];

/* ==================== REUSABLE COMPONENTS ==================== */

const Divider = () => (
  <div className="my-7 h-px bg-gradient-to-r from-transparent via-[#38516e] to-transparent sm:my-8" />
);

const Section = ({ icon: Icon, title, subtitle, children, className = "" }) => (
  <section className={`min-w-0 ${className}`}>
    <div className="mb-5 flex items-start gap-3.5">
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-br from-cyan-300/15 to-blue-400/5 text-cyan-200">
        <Icon size={20} strokeWidth={1.8} />
      </div>
      <div className="min-w-0 flex-1 pt-0.5">
        <h2 className="text-base font-bold tracking-tight text-white sm:text-lg">{title}</h2>
        {subtitle && (
          <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-400">{subtitle}</p>
        )}
      </div>
    </div>
    {children}
  </section>
);

const Field = ({
  label, value, onChange, placeholder, type = "text",
  required = false, icon: Icon, className = "", hint, ...props
}) => (
  <div className={`min-w-0 ${className}`}>
    <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
      {Icon && <Icon size={15} className="shrink-0 text-cyan-300" />}
      <span>{label}</span>
      {required && <span className="text-cyan-200">*</span>}
    </label>
    <input
      type={type}
      value={value || ""}
      onChange={onChange}
      placeholder={placeholder}
      required={required}
      className={inputCls}
      {...props}
    />
    {hint && <p className="mt-1.5 text-xs leading-5 text-slate-400">{hint}</p>}
  </div>
);

const ImageUploader = ({ title, recommendation, image, onUpload, onRemove }) => {
  const inputId = React.useId();

  return (
    <div className="group flex min-w-0 flex-col items-center rounded-2xl border border-[#29435f] bg-[#132942]/65 p-4 text-center transition hover:border-cyan-300/30 hover:bg-[#132942]">
      <p className="mb-1 text-sm font-bold text-white">{title}</p>
      <p className="mb-3 text-[10px] text-slate-400">{recommendation}</p>

      <div className="relative mb-3 h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-[#38516e] bg-[#0b1b30]">
        {image ? (
          <img src={image} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-slate-500">
            <ImageIcon size={20} />
          </div>
        )}
      </div>

      <div className="flex items-center gap-2">
        <label
          htmlFor={inputId}
          className="flex cursor-pointer items-center gap-1.5 rounded-lg border border-cyan-300/25 bg-cyan-300/10 px-3 py-1.5 text-xs font-semibold text-cyan-100"
        >
          {image ? <RefreshCw size={12} /> : <Upload size={12} />}
          {image ? "Change" : "Upload"}
        </label>

        <input
          id={inputId}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/gif"
          className="hidden"
          onChange={onUpload}
        />

        {image && (
          <button
            type="button"
            onClick={onRemove}
            className="rounded-lg border border-[#38516e] bg-[#0b1b30] p-1.5 text-slate-400 hover:text-red-300"
          >
            <Trash2 size={12} />
          </button>
        )}
      </div>
    </div>
  );
};

/* ==================== LIVE DEVICE FRAME ==================== */

const LiveProfileFrame = ({ formData, avatar, logo, banner, qrCode, activeTheme }) => {
  const fullName = [formData.firstName, formData.lastName].filter(Boolean).join(" ");

  const themes = {
    executive: ["#1e3a8a", "#7c3aed"],
    emerald: ["#10b981", "#14b8a6"],
    rose: ["#f43f5e", "#fb923c"],
    obsidian: ["#334155", "#94a3b8"],
    sunset: ["#f59e0b", "#f97316"],
  };

  const colors = themes[activeTheme] || themes.sunset;

  const contactItems = [
    { label: "Call", value: formData.phone, href: `tel:${formData.phone}` },
    { label: "WhatsApp", value: formData.whatsapp, href: `https://wa.me/${formData.whatsapp}` },
    { label: "Email", value: formData.email, href: `mailto:${formData.email}` },
    { label: "Website", value: formData.websiteUrl || formData.website, href: formData.websiteUrl || formData.website },
  ].filter((item) => item.value);

  const address = [
    formData.shopUnit,
    formData.area,
    formData.city,
    formData.state,
    formData.pincode,
  ].filter(Boolean).join(", ");

  return (
    <div className="mx-auto w-full max-w-[340px] rounded-[2.5rem] border-[7px] border-[#263b54] bg-[#071326] p-2 shadow-2xl shadow-black/40">
      <div className="mx-auto mb-2 h-5 w-20 rounded-full bg-[#263b54]" />

      <div className="overflow-hidden rounded-[1.8rem] bg-white text-slate-800">
        <div
          className="relative h-32 bg-cover bg-center"
          style={{
            backgroundImage: banner
              ? `url(${banner})`
              : `linear-gradient(135deg, ${colors[0]}, ${colors[1]})`,
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />

          {logo && (
            <img
              src={logo}
              alt="Business logo"
              className="absolute right-3 top-3 h-10 w-10 rounded-lg bg-white object-contain p-1"
            />
          )}
        </div>

        <div className="relative px-4 pb-5">
          <div className="-mt-11 mb-3 flex h-20 w-20 items-center justify-center overflow-hidden rounded-2xl border-4 border-white bg-slate-100 shadow-lg">
            {avatar ? (
              <img src={avatar} alt="Profile" className="h-full w-full object-cover" />
            ) : (
              <User size={34} className="text-slate-400" />
            )}
          </div>

          <h3 className="break-words text-xl font-extrabold text-slate-900">
            {fullName || "Your Name"}
          </h3>

          <p className="mt-1 text-sm font-semibold" style={{ color: colors[0] }}>
            {formData.jobTitle || "Your Designation"}
          </p>

          <p className="mt-1 text-xs font-medium text-slate-500">
            {formData.businessName || "Business Name"}
          </p>

          {formData.headline && (
            <p className="mt-3 text-sm font-semibold text-slate-700">{formData.headline}</p>
          )}

          {formData.bio && (
            <p className="mt-3 whitespace-pre-wrap break-words text-xs leading-5 text-slate-600">
              {formData.bio}
            </p>
          )}

          {contactItems.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-2">
              {contactItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target={item.label === "Website" ? "_blank" : undefined}
                  rel={item.label === "Website" ? "noreferrer" : undefined}
                  className="truncate rounded-lg px-2 py-2 text-center text-[11px] font-bold text-white"
                  style={{ background: colors[0] }}
                >
                  {item.label}
                </a>
              ))}
            </div>
          )}

          {(formData.city || formData.state || address) && (
            <div className="mt-4 flex items-start gap-2 border-t border-slate-100 pt-3 text-xs text-slate-500">
              <MapPin size={14} className="mt-0.5 shrink-0" />
              <span className="break-words">
                {address || [formData.city, formData.state].filter(Boolean).join(", ")}
              </span>
            </div>
          )}

          {formData.businessHours && (
            <div className="mt-3 flex items-start gap-2 text-xs text-slate-500">
              <Clock size={14} className="mt-0.5 shrink-0" />
              <span>{formData.businessHours}</span>
            </div>
          )}

          {formData.upiId && (
            <div className="mt-3 rounded-xl bg-slate-50 p-3">
              <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                Payment UPI
              </p>
              <p className="mt-1 break-all text-xs font-semibold text-slate-700">
                {formData.upiId}
              </p>
              {qrCode && (
                <img src={qrCode} alt="Payment QR" className="mx-auto mt-3 h-24 w-24 object-contain" />
              )}
            </div>
          )}

          {formData.mapLink && (
            <a
              href={formData.mapLink}
              target="_blank"
              rel="noreferrer"
              className="mt-4 block rounded-xl border border-slate-200 py-2.5 text-center text-xs font-bold text-slate-700"
            >
              Get Directions
            </a>
          )}
        </div>

        <div className="border-t border-slate-100 px-4 py-3 text-center text-[10px] font-semibold text-slate-400">
          Digital Business Card
        </div>
      </div>

      <div className="mx-auto mt-2 h-1 w-16 rounded-full bg-[#52647a]" />
    </div>
  );
};

/* ==================== MAIN COMPONENT ==================== */

const EditProfile = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { profile, loading, saving: reduxSaving } = useSelector((state) => state.profile);

  const [activeTab, setActiveTab] = useState("Profile");
  const [avatar, setAvatar] = useState(null);
  const [logo, setLogo] = useState(null);
  const [banner, setBanner] = useState(null);
  const [qrCode, setQrCode] = useState(null);

  const [activeTheme, setActiveTheme] = useState("sunset");
  const [selectedPlan, setSelectedPlan] = useState("1year");
  const [saved, setSaved] = useState(false);
  const [capturingGPS, setCapturingGPS] = useState(false);
  const [customHoursSelected, setCustomHoursSelected] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    businessName: "",
    industry: "",
    subdomain: "",
    jobTitle: "",
    headline: "",
    bio: "",
    phone: "",
    whatsapp: "",
    email: "",
    website: "",
    websiteUrl: "",
    shopUnit: "",
    area: "",
    city: "",
    state: "",
    pincode: "",
    landmark: "",
    mapLink: "",
    businessHours: "",
    upiId: "",
    leadCapture: { enabled: false },
  });

  useEffect(() => {
    dispatch(fetchMyProfile());
  }, [dispatch]);

  useEffect(() => {
    if (!profile) return;

    setFormData((prev) => ({
      ...prev,
      ...profile,
      leadCapture: {
        ...prev.leadCapture,
        ...(profile.leadCapture || {}),
      },
    }));

    setAvatar(profile.avatar || null);
    setLogo(profile.logo || null);
    setBanner(profile.banner || null);
    setQrCode(profile.qrCode || null);

    if (profile.activeTheme) setActiveTheme(profile.activeTheme);
    if (profile.selectedPlan) setSelectedPlan(profile.selectedPlan);

    setCustomHoursSelected(
      Boolean(profile.businessHours) &&
      !businessHourPresets.includes(profile.businessHours)
    );
  }, [profile]);

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSaved(false);
  };

  const handleUpload = (type) => async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedFields = ["avatar", "logo", "banner", "qrCode"];

    if (!allowedFields.includes(type)) {
      alert("Invalid image type");
      return;
    }

    try {
      const uploadData = new FormData();
      uploadData.append("image", file, file.name);
      uploadData.append("field", type);

      const { data } = await api.post("/profile/upload-image", uploadData, {
        headers: { "Content-Type": undefined },
      });

      if (!data.success) throw new Error(data.message || "Image upload failed");

      const imageUrl = data.profile?.[type] || data.imageUrl;

      if (!imageUrl || imageUrl.startsWith("blob:")) {
        throw new Error("Permanent image URL was not returned");
      }

      const setters = {
        avatar: setAvatar,
        logo: setLogo,
        banner: setBanner,
        qrCode: setQrCode,
      };

      setters[type](imageUrl);
      setSaved(false);
    } catch (error) {
      console.error("Image upload failed:", error.response?.data || error);
      alert(error.response?.data?.message || error.message || "Image upload failed");
    } finally {
      event.target.value = "";
    }
  };

  const handleAutoCaptureGPS = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by this browser.");
      return;
    }

    setCapturingGPS(true);

    navigator.geolocation.getCurrentPosition(
      ({ coords }) => {
        handleChange(
          "mapLink",
          `https://maps.google.com/?q=${coords.latitude},${coords.longitude}`
        );
        setCapturingGPS(false);
      },
      () => {
        setCapturingGPS(false);
        alert("Unable to access your location. Please allow location permission and try again.");
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const handleSave = async () => {
    setSaved(false);

    const profileDataToSave = {
      ...formData,
      avatar,
      logo,
      banner,
      qrCode,
      activeTheme,
      selectedPlan,
    };

    try {
      await dispatch(saveMyProfile(profileDataToSave)).unwrap();
      setSaved(true);
      navigate("/mini", { replace: true });
    } catch (error) {
      console.error("Profile save failed:", error);
      alert(typeof error === "string" ? error : "Profile save nahi hua. Please try again.");
    }
  };

  const currentTabIndex = TAB_ORDER.indexOf(activeTab);
  const isFirstTab = currentTabIndex === 0;
  const isLastTab = currentTabIndex === TAB_ORDER.length - 1;

  const handleNext = () => {
    if (!isLastTab) {
      setActiveTab(TAB_ORDER[currentTabIndex + 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    if (!isFirstTab) {
      setActiveTab(TAB_ORDER[currentTabIndex - 1]);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrimaryAction = () => {
    if (isLastTab) handleSave();
    else handleNext();
  };

  const themes = [
    { id: "executive", name: "Executive Royal", category: "Corporate & Tech", description: "Prestigious sapphire and royal indigo for corporate profiles.", colors: ["#1e3a8a", "#7c3aed"] },
    { id: "emerald", name: "Emerald Luxe", category: "Medical & Property", description: "Deep imperial emerald and luminous jade.", colors: ["#10b981", "#14b8a6"] },
    { id: "rose", name: "Rose Gold & Champagne", category: "Fashion & Salon", description: "Blush champagne and rose gold.", colors: ["#f43f5e", "#fb923c"] },
    { id: "obsidian", name: "Obsidian Noir & Platinum", category: "Barber & Executive", description: "Smoked glass, titanium graphite and platinum.", colors: ["#334155", "#94a3b8"] },
    { id: "sunset", name: "Sunset Amber & Coral", category: "Creative & Cafe", description: "Golden tangerine and warm amber coral.", colors: ["#f59e0b", "#f97316"] },
  ];

  const quickHandles = ["@okaxis", "@okhdfcbank", "@oksbi", "@paytm", "@ybl", "@ibl"];
  const activeThemeData = themes.find((theme) => theme.id === activeTheme);

  const totalFields = Object.keys(formData).length + 4;

  const filledFields =
    Object.values(formData).filter((val) => {
      if (val === null || val === undefined) return false;
      if (typeof val === "string") return val.trim() !== "";
      return true;
    }).length +
    [avatar, logo, banner, qrCode].filter(Boolean).length;

  const completionPercentage = Math.min(
    100,
    Math.round((filledFields / totalFields) * 100)
  );

  const selectedAbout = aboutUs.find((item) => item.category === formData.industry);

  return (
    <div className="relative min-h-screen overflow-x-clip px-1 py-5 font-sans text-white sm:px-5 sm:py-7 lg:px-8">

      {/* HEADER - DESKTOP ONLY */}
      <header className="relative mx-auto mb-6 hidden w-full max-w-[1350px] flex-col gap-4 border-b border-[#29435f] pb-5 sm:flex sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl">
            Edit Profile
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Update your profile information and make your digital identity more attractive.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="rounded-xl border border-[#38516e] bg-[#132942] px-5 py-2.5 text-sm font-semibold text-slate-300 hover:bg-[#193754]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={loading || reduxSaving}
            className={primaryButtonCls}
          >
            {loading || reduxSaving ? (
              <Loader2 size={16} className="animate-spin" />
            ) : isLastTab ? (
              <Save size={16} />
            ) : (
              <ArrowRight size={16} />
            )}
            {reduxSaving ? "Saving..." : isLastTab ? "Save Changes" : "Next"}
          </button>
        </div>
      </header>

      <div className="relative mx-auto grid w-full max-w-[1350px] grid-cols-1 items-start gap-6 lg:grid-cols-3">

  {/* RIGHT COLUMN - MOBILE ORDER FIRST */}
  <aside className="order-first min-w-0 space-y-6 lg:sticky lg:top-6 lg:order-2 lg:self-start">

    {/* LIVE FRAME - MOBILE AND DESKTOP */}
    <div className="w-full overflow-hidden rounded-3xl border border-[#29435f] bg-[#132942]/80 shadow-xl lg:mx-auto lg:max-w-[340px]">
      <div className="flex items-center justify-between border-b border-[#29435f] px-4 py-3">
        <h3 className="flex items-center gap-2 text-sm font-bold text-white">
          <Camera size={15} className="text-cyan-400" />
          Live Profile Frame
        </h3>

        <span className="rounded-full border border-cyan-400/20 bg-cyan-400/10 px-2.5 py-0.5 text-[10px] font-bold text-cyan-300">
          Real-time
        </span>
      </div>

      {/* MOBILE: FULL WIDTH, REDUCED HEIGHT, NO JUSTIFY-CENTER */}
      <div className="w-full p-1">
        <div className="h-[380px] w-full overflow-hidden rounded-[20px] border-[4px] border-[#0b1b30] shadow-2xl sm:h-[480px] sm:rounded-[28px] sm:border-[6px]">
          <div className="h-full w-full overflow-x-hidden overflow-y-auto overscroll-contain [scrollbar-width:thin] [scrollbar-color:#22d3ee_#132942]">
            <LiveProfileFrame
              formData={formData}
              avatar={avatar}
              logo={logo}
              banner={banner}
              qrCode={qrCode}
              activeTheme={activeTheme}
            />
          </div>
        </div>
      </div>

      <p className="px-4 pb-4 text-center text-[10px] leading-4 text-slate-500">
        Changes you make in the form appear here instantly. Save your profile to publish the changes.
      </p>
    </div>

    {/* DESKTOP ONLY SIDEBAR CONTENT */}
    <div className="hidden space-y-6 lg:block">

      {/* PROFILE COMPLETION */}
      <div className="rounded-3xl border border-[#29435f] bg-[#132942]/80 p-6 shadow-xl">
        <h3 className="mb-5 flex items-center gap-2 text-sm font-bold text-white">
          <User size={16} className="text-cyan-400" /> Profile Completion
        </h3>

        <div className="flex items-center gap-4 border-b border-[#29435f] pb-5">
          <div className="relative h-20 w-20 shrink-0">
            <svg className="h-full w-full -rotate-90 transform" viewBox="0 0 36 36">
              <path
                className="text-[#0b1b30]"
                strokeWidth="3"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                className="text-cyan-400"
                strokeWidth="3"
                strokeDasharray={`${completionPercentage}, 100`}
                strokeLinecap="round"
                stroke="currentColor"
                fill="none"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>

            <div className="absolute inset-0 flex items-center justify-center text-base font-extrabold text-white">
              {completionPercentage}%
            </div>
          </div>

          <div>
            <p className="text-sm font-bold text-white">
              {completionPercentage === 100 ? "Perfect!" : completionPercentage > 50 ? "Looking Good!" : "Needs Work"}
            </p>
            <p className="mt-1 text-xs leading-5 text-slate-400">
              Complete your profile to get more visibility and engagement.
            </p>
          </div>
        </div>

        <div className="mt-5 space-y-3.5">
          {[
            { label: "Basic Information", key: "firstName" },
            { label: "Profile Photo", key: "avatar" },
            { label: "Banner Image", key: "banner" },
            { label: "About Me", key: "bio" },
            { label: "Contact Details", key: "phone" },
            { label: "Business Hours", key: "businessHours" },
            { label: "Payment / UPI", key: "upiId" },
            { label: "QR Code", key: "qrCode" },
          ].map((item) => {
            const isDone =
              item.key === "avatar" ? !!avatar :
              item.key === "banner" ? !!banner :
              item.key === "qrCode" ? !!qrCode :
              !!formData[item.key];

            return (
              <div
                key={item.key}
                className={`flex items-center gap-3 text-xs font-medium ${isDone ? "text-slate-300" : "text-slate-500"}`}
              >
                {isDone ? (
                  <CheckCircle2 size={16} className="text-cyan-400" />
                ) : (
                  <Circle size={16} className="text-slate-600" />
                )}
                {item.label}
              </div>
            );
          })}
        </div>
      </div>

     

      {/* CTA */}
      <div className="rounded-3xl border border-[#29435f] bg-gradient-to-br from-[#132942] to-[#0b1b30] p-6 text-center shadow-xl">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-400">
          <Rocket size={24} />
        </div>

        <h3 className="text-sm font-bold text-white">
          Make Your Profile Stand Out
        </h3>

        <p className="mt-2 text-xs leading-5 text-slate-400">
          Get more visitors, more views and more opportunities with a complete profile.
        </p>

        <button
          type="button"
          onClick={() => navigate("/mini")}
          className="mt-5 w-full rounded-xl border border-cyan-400/20 bg-cyan-400/10 py-3 text-xs font-bold text-cyan-400 transition hover:bg-cyan-400/20"
        >
          View Profile
        </button>
      </div>
    </div>
  </aside>

  {/* LEFT COLUMN - FORM */}
  <div className="order-last min-w-0 space-y-6 lg:order-1 lg:col-span-2">

    {/* PROFILE SUMMARY - DESKTOP ONLY */}
    <div className="hidden overflow-hidden rounded-3xl border border-[#29435f] bg-[#132942]/80 shadow-2xl lg:block">
      <div
        className="relative h-40 w-full bg-[#0b1b30] bg-cover bg-center"
        style={{ backgroundImage: banner ? `url(${banner})` : "none" }}
      >
        <div className="absolute inset-0 bg-gradient-to-t from-[#132942] to-transparent opacity-80" />
      </div>

      <div className="relative px-6 pb-6 pt-0">
        <div className="absolute -top-12 left-6 h-24 w-24 overflow-hidden rounded-full border-4 border-[#132942] bg-[#0b1b30]">
          {avatar ? (
            <img src={avatar} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            <div className="flex h-full items-center justify-center text-slate-500">
              <User size={40} />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-4 pt-14 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h2 className="text-2xl font-bold text-white">
              {[formData.firstName, formData.lastName].filter(Boolean).join(" ") || "Your Name"}
            </h2>

            <p className="mt-0.5 text-sm font-medium text-cyan-400">
              {formData.jobTitle || "Your Designation"}
            </p>

            {(formData.city || formData.state) && (
              <p className="mt-1 flex items-center gap-1 text-xs text-slate-400">
                <MapPin size={12} />
                {[formData.city, formData.state].filter(Boolean).join(", ")}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>

    {/* TABS */}
    <div className="rounded-t-2xl border-b border-[#29435f] bg-[#132942]/80">
      <div className="no-scrollbar flex overflow-x-auto px-2">
        {TAB_ORDER.map((tab, index) => {
          const isActive = activeTab === tab;
          const isCompleted = index < currentTabIndex;

          return (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`relative flex items-center gap-2 whitespace-nowrap px-4 py-4 text-sm font-semibold transition ${
                isActive
                  ? "border-b-2 border-cyan-400 text-cyan-400"
                  : "text-slate-400 hover:text-slate-200"
              }`}
            >
              <span
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-bold ${
                  isActive
                    ? "bg-cyan-400 text-[#0b1b30]"
                    : isCompleted
                      ? "bg-emerald-400/20 text-emerald-400"
                      : "bg-[#0b1b30] text-slate-500"
                }`}
              >
                {isCompleted && !isActive ? <Check size={10} strokeWidth={4} /> : index + 1}
              </span>
              {tab}
            </button>
          );
        })}
      </div>
    </div>

    <div className="rounded-b-3xl border-x border-b border-[#29435f] bg-[#10233b]/90 p-5 sm:p-7">

      {/* TAB 1: PROFILE */}
      {activeTab === "Profile" && (
        <div className="animate-fadeIn space-y-8">
          <Section
            title="Profile Images"
            subtitle="Upload your profile photo, banner, logo and QR code."
            icon={Camera}
          >
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <ImageUploader title="Profile Photo" recommendation="400x400 px" image={avatar} onUpload={handleUpload("avatar")} onRemove={() => setAvatar(null)} />
              <ImageUploader title="Cover Banner" recommendation="1200x500 px" image={banner} onUpload={handleUpload("banner")} onRemove={() => setBanner(null)} />
              <ImageUploader title="Logo" recommendation="400x400 px" image={logo} onUpload={handleUpload("logo")} onRemove={() => setLogo(null)} />
              <ImageUploader title="QR Code" recommendation="Square" image={qrCode} onUpload={handleUpload("qrCode")} onRemove={() => setQrCode(null)} />
            </div>
          </Section>

          <Divider />

          <Section
            title="Basic Information"
            subtitle="Enter your personal details and business category."
            icon={User}
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="First Name" value={formData.firstName} onChange={(e) => handleChange("firstName", e.target.value)} placeholder="First name" required />
              <Field label="Last Name" value={formData.lastName} onChange={(e) => handleChange("lastName", e.target.value)} placeholder="Last name" required />
              <Field label="Business Name" value={formData.businessName} onChange={(e) => handleChange("businessName", e.target.value)} placeholder="Business name" required />

              <div className="min-w-0">
  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
    <Building2 size={15} className="text-cyan-300" />
    Your Industry / Category *
  </label>

  <select
    value={
      industryOptions.some((item) => item.value === formData.industry)
        ? formData.industry
        : formData.industry
          ? "custom"
          : ""
    }
    onChange={(e) => {
      const category = e.target.value;

      if (category === "custom") {
        handleChange("industry", "");
        return;
      }

      handleChange("industry", category);

      const selectedCategory = aboutUs.find(
        (item) => item.category === category
      );

      if (selectedCategory) {
        handleChange("bio", selectedCategory.description);
      }
    }}
    required
    className={`${inputCls} appearance-none`}
  >
    <option value="" disabled>
      Select your industry
    </option>

    {industryOptions.map((item) => (
      <option
        key={item.value}
        value={item.value}
        className="bg-[#132942] text-white"
      >
        {item.label}
      </option>
    ))}

    <option value="custom" className="bg-[#132942] text-cyan-300">
      + Add Custom Category
    </option>
  </select>

  {formData.industry &&
    !industryOptions.some((item) => item.value === formData.industry) && (
      <p className="mt-2 text-xs text-cyan-300">
        Custom category: {formData.industry}
      </p>
    )}

  {(formData.industry === "" ||
    !industryOptions.some((item) => item.value === formData.industry)) &&
    (formData.industry === "" || !industryOptions.some((item) => item.value === formData.industry)) &&
    (
      <Field
        label="Enter Custom Category"
        value={formData.industry}
        onChange={(e) => handleChange("industry", e.target.value)}
        placeholder="e.g. Digital Marketing, Event Management"
        required
        className="mt-3"
      />
    )}
</div>

<div className="min-w-0">
  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
    <Briefcase size={15} className="text-cyan-300" />
    Job Title / Role
  </label>

  <select
    value={
      jobTitleOptions.some((item) => item.value === formData.jobTitle)
        ? formData.jobTitle
        : formData.jobTitle
          ? "custom"
          : ""
    }
    onChange={(e) => {
      const value = e.target.value;

      if (value === "custom") {
        handleChange("jobTitle", "");
        return;
      }

      handleChange("jobTitle", value);
    }}
    className={`${inputCls} appearance-none`}
  >
    <option value="" disabled>
      Select your job title
    </option>

    {jobTitleOptions.map((item) => (
      <option
        key={item.value}
        value={item.value}
        className="bg-[#132942] text-white"
      >
        {item.label}
      </option>
    ))}

    <option value="custom" className="bg-[#132942] text-cyan-300">
      + Add Custom Job Title
    </option>
  </select>

  {(formData.jobTitle === "" ||
    !jobTitleOptions.some((item) => item.value === formData.jobTitle)) && (
    <Field
      label="Enter Custom Job Title"
      icon={Pencil}
      value={formData.jobTitle}
      onChange={(e) => handleChange("jobTitle", e.target.value)}
      placeholder="e.g. Digital Marketing Specialist"
      className="mt-3"
    />
  )}
</div>
              <Field label="Short Headline / Slogan" value={formData.headline} onChange={(e) => handleChange("headline", e.target.value)} placeholder="Your short tagline" />

              <div className="sm:col-span-2">
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  <User size={15} className="text-cyan-300" /> About / Business Bio
                </label>

                <textarea
                  rows={4}
                  maxLength={500}
                  value={formData.bio}
                  onChange={(e) => handleChange("bio", e.target.value)}
                  placeholder="Tell customers about your business..."
                  className={`${inputCls} resize-y`}
                />

                <div className="mt-2 flex justify-between">
                  <p className="text-xs text-slate-400">Keep your introduction clear and customer-friendly.</p>
                  <p className="text-xs font-semibold text-cyan-200">{(formData.bio || "").length} / 500 characters</p>
                </div>

                {selectedAbout && (
                  <div className="mt-4 rounded-2xl border border-[#29435f] bg-[#132942]/70 p-4 sm:p-5">
                    <h3 className="text-base font-bold text-white">{selectedAbout.title}</h3>
                    <p className="mt-1 text-sm text-cyan-300">{selectedAbout.shortDescription}</p>

                    <div className="mt-4">
                      <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Available Services</p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedAbout.services.map((service) => (
                          <span key={service} className="rounded-lg border border-cyan-300/20 bg-cyan-300/10 px-3 py-1.5 text-xs font-medium text-cyan-100">
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 2: PROFESSIONAL */}
      {activeTab === "Professional" && (
        <div className="animate-fadeIn space-y-8">
          <Section title="Business Details" subtitle="Manage your working hours and main website." icon={Briefcase}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="min-w-0">
                <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
                  <Clock size={15} className="text-cyan-300" /> Business Hours
                </label>

                <div className="relative">
                  <select
                    value={businessHourPresets.includes(formData.businessHours) ? formData.businessHours : customHoursSelected ? "custom" : ""}
                    onChange={(e) => {
                      const value = e.target.value;

                      if (value === "custom") {
                        setCustomHoursSelected(true);
                        if (businessHourPresets.includes(formData.businessHours)) handleChange("businessHours", "");
                      } else {
                        setCustomHoursSelected(false);
                        handleChange("businessHours", value);
                      }
                    }}
                    className={`${inputCls} appearance-none pr-10`}
                  >
                    <option value="" disabled>Select business hours</option>
                    {businessHourPresets.map((hours) => (
                      <option key={hours} value={hours} className="bg-[#132942] text-white">{hours}</option>
                    ))}
                    <option value="custom" className="bg-[#132942] text-white">+ Custom Hours</option>
                  </select>

                  <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-200" />
                </div>

                {customHoursSelected && (
                  <input
                    type="text"
                    value={formData.businessHours}
                    onChange={(e) => handleChange("businessHours", e.target.value)}
                    placeholder="e.g. Mon - Wed: 10:00 AM - 5:00 PM"
                    className={`${inputCls} mt-2`}
                  />
                )}
              </div>

              <Field label="Website URL" icon={Globe} type="url" value={formData.websiteUrl} onChange={(e) => handleChange("websiteUrl", e.target.value)} placeholder="https://..." />
            </div>
          </Section>

          <Divider />

          <Section title="Custom Shop Subdomain" subtitle="Manage the web handle associated with your digital visiting card." icon={Globe}>
            <div className={cardCls}>
              <div className="flex min-w-0 flex-col gap-2 sm:flex-row sm:items-center">
                <div className="flex min-w-0 flex-1 items-center rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 focus-within:border-cyan-300">
                  <span className="shrink-0 text-xs text-slate-400">https://</span>
                  <input
                    type="text"
                    value={formData.subdomain}
                    onChange={(e) => handleChange("subdomain", e.target.value.toLowerCase().replace(/\s+/g, "-"))}
                    className="min-w-0 flex-1 bg-transparent px-2 py-3 text-sm font-mono text-cyan-100 outline-none"
                    aria-label="Custom subdomain"
                  />
                </div>

                <span className="rounded-xl border border-[#29435f] bg-[#0b1b30] px-3 py-3 text-xs text-slate-400">
                  .yourdomain.com
                </span>
              </div>

              <div className="mt-5 rounded-xl border border-[#29435f] bg-[#0b1b30]/70 p-3.5">
                <div className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                  <LinkIcon size={14} className="text-cyan-300" /> Current direct link
                </div>

                <a href={formData.website || "#"} target="_blank" rel="noreferrer" className="block break-all text-sm font-medium leading-6 text-cyan-200 hover:underline">
                  {formData.website || "No link added yet"}
                </a>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 3: CONTACT & ADDRESS */}
      {activeTab === "Contact & Address" && (
        <div className="animate-fadeIn space-y-8">
          <Section title="Contact Information" subtitle="Help customers reach you through their preferred contact method." icon={Phone}>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {/* PHONE NUMBER */}
<div className="min-w-0">
  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
    <Phone size={15} className="text-cyan-300" />
    Phone Number
    <span className="text-cyan-200">*</span>
  </label>

  <div className="flex overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30] transition focus-within:border-cyan-300 focus-within:ring-4 focus-within:ring-cyan-300/10">
   <span className="flex shrink-0 items-center whitespace-nowrap border-r border-[#29435f] bg-[#132942] px-3 text-sm font-semibold text-cyan-300">
  +91
</span>

    <input
      type="tel"
      inputMode="numeric"
      maxLength={10}
      value={(formData.phone || "").replace(/^\+91/, "")}
      onChange={(e) => {
        const number = e.target.value.replace(/\D/g, "").slice(0, 10);
        handleChange("phone", number ? `+91${number}` : "");
      }}
      placeholder="8956235689"
      required
      className="w-full min-w-0 bg-transparent px-3.5 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none"
    />
  </div>
  <p className="mt-1.5 text-xs text-slate-400">
    Enter your 10-digit Indian mobile number.
  </p>
</div>

{/* WHATSAPP NUMBER */}
<div className="min-w-0">
  <label className="mb-2 flex items-center gap-1.5 text-sm font-semibold text-slate-200">
    <MessageSquare size={15} className="text-cyan-300" />
    WhatsApp Number
  </label>

  <div className="flex overflow-hidden rounded-xl border border-[#29435f] bg-[#0b1b30] transition focus-within:border-cyan-300 focus-within:ring-4 focus-within:ring-cyan-300/10">
   <span className="flex shrink-0 items-center whitespace-nowrap border-r border-[#29435f] bg-[#132942] px-3 text-sm font-semibold text-cyan-300">
  +91
</span>

    <input
      type="tel"
      inputMode="numeric"
      maxLength={10}
      value={(formData.whatsapp || "").replace(/^\+91/, "")}
      onChange={(e) => {
        const number = e.target.value.replace(/\D/g, "").slice(0, 10);
        handleChange("whatsapp", number ? `+91${number}` : "");
      }}
      placeholder="8956235689"
      className="w-full min-w-0 bg-transparent px-3.5 py-3 text-sm font-medium text-white placeholder:text-slate-500 outline-none"
    />
  </div>
  <p className="mt-1.5 text-xs text-slate-400">
    Enter your 10-digit WhatsApp number.
  </p>
</div>
              <Field label="Email ID" icon={Mail} type="email" value={formData.email} onChange={(e) => handleChange("email", e.target.value)} placeholder="you@business.com" required />
              <Field label="Website / Card Link" icon={LinkIcon} type="url" value={formData.website} onChange={(e) => handleChange("website", e.target.value)} placeholder="https://..." />
            </div>
          </Section>

          <Divider />

          <Section title="Storefront Address" subtitle="Set your business location so customers can identify your shop." icon={Store}>
            <div className={cardCls}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Shop / Unit Number" value={formData.shopUnit} onChange={(e) => handleChange("shopUnit", e.target.value)} placeholder="E.g. Shop 12, Ground Floor" />
                <Field label="Area / Locality" value={formData.area} onChange={(e) => handleChange("area", e.target.value)} placeholder="E.g. Andheri West" />
              </div>

              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <Field label="City" value={formData.city} onChange={(e) => handleChange("city", e.target.value)} placeholder="Enter city" />
                <Field label="State" value={formData.state} onChange={(e) => handleChange("state", e.target.value)} placeholder="Enter state" />
                <Field label="Pincode" value={formData.pincode} onChange={(e) => handleChange("pincode", e.target.value)} placeholder="E.g. 400070" />
              </div>

              <div className="mt-4">
                <Field label="Landmark (Optional)" value={formData.landmark} onChange={(e) => handleChange("landmark", e.target.value)} placeholder="E.g. Opposite Phoenix Marketcity" />
              </div>

              <div className="mt-5 rounded-2xl border border-[#29435f] bg-[#0b1b30]/75 p-4">
                <div className="mb-3 flex items-center gap-2">
                  <MapPin size={17} className="text-cyan-200" />
                  <label className="text-sm font-bold text-white">Google Maps Shop Directions Link</label>
                </div>

                <div className="flex flex-col gap-3 lg:flex-row">
                  <input
                    type="url"
                    value={formData.mapLink}
                    onChange={(e) => handleChange("mapLink", e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className={`${inputCls} min-w-0 flex-1`}
                  />

                  <button type="button" onClick={handleAutoCaptureGPS} disabled={capturingGPS} className={secondaryButtonCls}>
                    {capturingGPS ? <Loader2 size={16} className="animate-spin" /> : <Navigation size={16} className="text-cyan-200" />}
                    {capturingGPS ? "Capturing Location..." : "Capture My GPS"}
                  </button>
                </div>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 4: UPI AND PAYMENT */}
      {activeTab === "UPI and Payment" && (
        <div className="animate-fadeIn space-y-8">
          <Section title="Receive Payments & UPI" subtitle="Add your merchant UPI ID and upload your payment QR code for customers." icon={Wallet}>
            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
              <div className={cardCls}>
                <div className="mb-4 flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-300/10 text-cyan-200">
                    <Wallet size={19} />
                  </div>

                  <div>
                    <h3 className="text-sm font-bold text-white">Merchant UPI ID</h3>
                    <p className="mt-1 text-xs text-slate-400">Your payment address</p>
                  </div>
                </div>

                <Field label="UPI ID (Unified Payments Interface)" icon={AtSign} value={formData.upiId} onChange={(e) => handleChange("upiId", e.target.value)} placeholder="yourbusiness@okaxis" />

                <p className="mb-3 mt-5 text-xs font-bold uppercase tracking-[0.12em] text-slate-400">
                  Quick UPI handles
                </p>

                <div className="flex flex-wrap gap-2">
                  {quickHandles.map((handle) => (
                    <button
                      key={handle}
                      type="button"
                      onClick={() => {
                        const base = formData.upiId.split("@")[0] || "yourbusiness";
                        handleChange("upiId", `${base}${handle}`);
                      }}
                      className={`rounded-xl border px-3 py-2 text-xs font-semibold transition ${
                        formData.upiId.endsWith(handle)
                          ? "border-cyan-300/50 bg-cyan-300/10 text-cyan-100"
                          : "border-[#38516e] bg-[#0b1b30] text-slate-300 hover:border-cyan-300/40 hover:text-cyan-200"
                      }`}
                    >
                      {handle}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col justify-center rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-cyan-300/[0.08] to-blue-400/[0.04] p-5 text-center">
                <Zap size={32} className="mx-auto mb-3 text-cyan-300" />
                <p className="text-sm font-bold text-cyan-100">UPI Payment Setup</p>
                <p className="mt-2 text-xs leading-5 text-slate-300">
                  Your UPI ID and payment QR are collected here for your card. The public card must implement the payment action.
                </p>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* TAB 5: LEAD CAPTURE */}
      {activeTab === "Lead Capture" && (
        <div className="animate-fadeIn space-y-8">
          <Section title="QR Lead Capture" subtitle="Collect customer details when someone scans your physical business QR code." icon={User}>
            <div className={cardCls}>
              <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex-1">
                  <h3 className="text-base font-bold text-white">Enable Customer Lead Capture</h3>
                  <p className="mt-2 text-sm leading-6 text-slate-400">
                    When customers scan your physical QR code, a popup will ask for their name and phone number. Their details will be saved in your inquiries.
                  </p>
                  <p className="mt-3 text-xs font-semibold text-cyan-300">
                    Status: {formData.leadCapture?.enabled ? "Enabled" : "Disabled"}
                  </p>
                </div>

                <button
                  type="button"
                  role="switch"
                  aria-label="Enable customer lead capture"
                  aria-checked={Boolean(formData.leadCapture?.enabled)}
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      leadCapture: {
                        ...prev.leadCapture,
                        enabled: !prev.leadCapture?.enabled,
                      },
                    }));
                    setSaved(false);
                  }}
                  className="flex h-11 w-16 shrink-0 items-center justify-center self-end sm:self-auto"
                >
                  <span className={`relative h-7 w-12 rounded-full transition-colors ${formData.leadCapture?.enabled ? "bg-emerald-500" : "bg-slate-600"}`}>
                    <span className={`absolute left-1 top-1 h-5 w-5 rounded-full bg-white shadow transition-transform ${formData.leadCapture?.enabled ? "translate-x-5" : "translate-x-0"}`} />
                  </span>
                </button>
              </div>
            </div>
          </Section>
        </div>
      )}

      {/* BOTTOM NAVIGATION */}
      <div className="mt-8 flex flex-col gap-4 border-t border-[#29435f] pt-6 sm:flex-row sm:items-center sm:justify-between">
        {saved && (
          <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/10 px-4 py-2 text-sm font-bold text-cyan-300">
            <Check size={16} /> Profile Saved Successfully!
          </div>
        )}

        <div className="flex w-full gap-3 sm:ml-auto sm:w-auto">
          {!isFirstTab && (
            <button
              type="button"
              onClick={handlePrev}
              className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-5 py-3 text-sm font-semibold text-slate-200 hover:border-cyan-300/50 hover:text-cyan-200 sm:flex-none"
            >
              <ArrowLeft size={16} /> Previous
            </button>
          )}

          <button
            type="button"
            onClick={handlePrimaryAction}
            disabled={loading || reduxSaving}
            className={`${primaryButtonCls} flex-1 sm:min-w-[180px] sm:flex-none`}
          >
            {loading || reduxSaving ? <Loader2 size={17} className="animate-spin" /> : isLastTab ? <Save size={17} /> : <ArrowRight size={17} />}
            {reduxSaving ? "Saving..." : isLastTab ? "Save Changes" : "Next"}
          </button>
        </div>
      </div>

      <div className="mt-4 flex items-center justify-center gap-2 sm:hidden">
        {TAB_ORDER.map((tab, idx) => (
          <span
            key={tab}
            className={`h-1.5 rounded-full transition-all ${
              idx === currentTabIndex
                ? "w-6 bg-cyan-400"
                : idx < currentTabIndex
                  ? "w-1.5 bg-emerald-400/60"
                  : "w-1.5 bg-slate-600"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</div>
    </div>
  );
};

export default EditProfile;