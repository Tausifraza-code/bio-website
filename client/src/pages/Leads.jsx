
import React, { useState } from "react";
import {
  MessageSquare,
  Send,
  Check,
  Loader2,
  User,
  Mail,
  Phone,
  Briefcase,
  Clock,
  Trash2,
  ArrowUpRight,
  Search,
  X,
} from "lucide-react";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  });

  const [errors, setErrors] = useState({});

  /* ==================== HANDLERS ==================== */

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.message.trim()) {
      newErrors.message = "Message is required";
    }

    if (
      formData.email &&
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)
    ) {
      newErrors.email = "Invalid email address";
    }

    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const newErrors = validate();

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);

    setTimeout(() => {
      const newLead = {
        id: Date.now(),
        ...formData,
        timestamp: new Date().toLocaleString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        }),
        status: "New",
      };

      setLeads((prev) => [newLead, ...prev]);
      setSubmitting(false);
      setSubmitted(true);
      setErrors({});

      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "",
        message: "",
      });

      setTimeout(() => setSubmitted(false), 2500);
    }, 900);
  };

  const handleDelete = (id) => {
    setLeads((prev) => prev.filter((lead) => lead.id !== id));
  };

  const filteredLeads = leads.filter((lead) => {
    const query = searchQuery.toLowerCase();

    return (
      lead.name.toLowerCase().includes(query) ||
      lead.email.toLowerCase().includes(query) ||
      lead.message.toLowerCase().includes(query) ||
      (lead.subject || "").toLowerCase().includes(query)
    );
  });

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#0b1b30] text-white">
      {/* ==================== BACKGROUND ==================== */}

      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-[420px] w-[420px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />

        <div className="absolute -right-40 top-[35%] h-[450px] w-[450px] rounded-full bg-blue-500/[0.07] blur-[150px]" />

        <div
          className="absolute inset-0 opacity-[0.025]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,1) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,1) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">
        {/* ==================== PAGE HEADER ==================== */}

        <header className="mb-8">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#132942] shadow-lg shadow-cyan-950/20">
                <MessageSquare size={22} className="text-cyan-300" />
              </div>

              <div>
                <div className="mb-1.5 flex flex-wrap items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                    Business workspace
                  </span>

                  <span className="rounded-full border border-[#38516e] bg-[#132942] px-2 py-0.5 text-[10px] font-semibold text-slate-300">
                    {leads.length} {leads.length === 1 ? "Lead" : "Leads"}
                  </span>
                </div>

                <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl lg:text-3xl">
                  Customer Inquiries
                </h1>

                <p className="mt-1.5 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                  Manage customer messages and keep track of potential
                  business opportunities from your mini website.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start rounded-xl border border-[#29435f] bg-[#10243b] px-3.5 py-2.5 sm:self-center">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>

              <span className="text-xs font-medium text-slate-300">
                Lead management
              </span>
            </div>
          </div>
        </header>

        {/* ==================== MAIN GRID ==================== */}

        <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1.15fr)_minmax(300px,0.85fr)]">
          {/* ==================== INQUIRY FORM ==================== */}

          <section className="relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b]/95 shadow-2xl shadow-black/10">
            <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-300" />

            <div className="p-5 sm:p-7">
              <div className="mb-6 flex items-start">
                <div>
                  <h2 className="text-base font-bold text-white sm:text-lg">
                    Send an Inquiry
                  </h2>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Preview the form customers can use to contact your
                    business.
                  </p>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Name + Email */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field
                    label="Your Name"
                    icon={User}
                    required
                    error={errors.name}
                  >
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) =>
                        handleChange("name", e.target.value)
                      }
                      placeholder="E.g. Rajesh Sharma"
                      className={`${inputCls} ${
                        errors.name ? "border-red-400/60" : ""
                      }`}
                    />
                  </Field>

                  <Field
                    label="Email Address"
                    icon={Mail}
                    error={errors.email}
                  >
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleChange("email", e.target.value)
                      }
                      placeholder="you@example.com"
                      className={`${inputCls} ${
                        errors.email ? "border-red-400/60" : ""
                      }`}
                    />
                  </Field>
                </div>

                {/* Phone + Subject */}

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <Field label="Phone Number" icon={Phone}>
                    <input
                      type="tel"
                      value={formData.phone}
                      onChange={(e) =>
                        handleChange("phone", e.target.value)
                      }
                      placeholder="+91 98765 43210"
                      className={inputCls}
                    />
                  </Field>

                  <Field label="Subject" icon={Briefcase}>
                    <input
                      type="text"
                      value={formData.subject}
                      onChange={(e) =>
                        handleChange("subject", e.target.value)
                      }
                      placeholder="E.g. Product Inquiry"
                      className={inputCls}
                    />
                  </Field>
                </div>

                {/* Message */}

                <Field
                  label="Your Message"
                  icon={MessageSquare}
                  required
                  error={errors.message}
                >
                  <textarea
                    rows={5}
                    value={formData.message}
                    onChange={(e) =>
                      handleChange("message", e.target.value)
                    }
                    placeholder="Tell us what you need..."
                    className={`${inputCls} resize-y leading-6 ${
                      errors.message ? "border-red-400/60" : ""
                    }`}
                  />
                </Field>

                {/* Form Footer */}

                <div className="flex flex-col gap-4 border-t border-[#29435f] pt-5 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-[11px] text-slate-400">
                    <span className="mr-1 text-red-400">*</span>
                    Required fields
                  </p>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-950/20 transition duration-200 hover:bg-cyan-200 hover:shadow-cyan-400/10 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {submitting ? (
                      <>
                        <Loader2 size={15} className="animate-spin" />
                        Sending...
                      </>
                    ) : submitted ? (
                      <>
                        <Check size={15} strokeWidth={3} />
                        Inquiry Sent!
                      </>
                    ) : (
                      <>
                        <Send
                          size={15}
                          className="transition-transform group-hover:translate-x-0.5"
                        />
                        Submit Inquiry
                      </>
                    )}
                  </button>
                </div>

                {submitted && (
                  <div className="flex items-center gap-2 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.07] px-4 py-3 text-xs text-cyan-200">
                    <Check size={15} />
                    Inquiry added successfully to your lead list.
                  </div>
                )}
              </form>
            </div>
          </section>

          {/* ==================== SIDE INFORMATION ==================== */}

          <aside className="space-y-5">
            <section className="overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b]">
              <div className="border-b border-[#29435f] px-5 py-4">
                <h2 className="text-sm font-bold text-white">
                  Inquiry Overview
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  A quick snapshot of your customer activity.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3 p-4">
                <div className="rounded-xl border border-[#29435f] bg-[#0b1b30] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10">
                    <MessageSquare size={17} className="text-cyan-300" />
                  </div>

                  <p className="text-2xl font-bold text-white">
                    {leads.length}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Total inquiries
                  </p>
                </div>

                <div className="rounded-xl border border-[#29435f] bg-[#0b1b30] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-blue-400/10">
                    <User size={17} className="text-blue-300" />
                  </div>

                  <p className="text-2xl font-bold text-white">
                    {leads.filter((lead) => lead.status === "New").length}
                  </p>

                  <p className="mt-1 text-[11px] text-slate-400">
                    New inquiries
                  </p>
                </div>
              </div>
            </section>

            <section className="relative overflow-hidden rounded-2xl border border-cyan-300/15 bg-gradient-to-br from-[#132942] to-[#10243b] p-5">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-cyan-300/[0.07] blur-2xl" />

              <div className="relative">
                <h3 className="text-sm font-bold text-white">
                  Grow your inquiries
                </h3>

                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Share your mini website link or business QR code to make
                  it easier for potential customers to contact you.
                </p>

                <div className="mt-4 flex items-center gap-2 text-[11px] font-semibold text-cyan-300">
                  <span className="h-px w-6 bg-cyan-300/50" />
                  Stay connected with customers
                </div>
              </div>
            </section>
          </aside>
        </div>

        {/* ==================== LEADS LIST ==================== */}

        <section className="mt-8">
          <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-lg font-bold text-white">
                  Received Inquiries
                </h2>

                <span className="rounded-lg border border-cyan-300/20 bg-cyan-300/[0.08] px-2.5 py-1 text-[10px] font-bold text-cyan-300">
                  {leads.length} TOTAL
                </span>
              </div>

              <p className="mt-1.5 text-xs text-slate-400">
                Review and manage messages from your potential customers.
              </p>
            </div>

            {leads.length > 0 && (
              <div className="relative w-full sm:max-w-xs">
                <Search
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search inquiries..."
                  className="w-full rounded-xl border border-[#29435f] bg-[#10243b] py-3 pl-10 pr-10 text-xs text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/[0.08]"
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label="Clear search"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 transition hover:text-cyan-300"
                  >
                    <X size={15} />
                  </button>
                )}
              </div>
            )}
          </div>

          {/* Empty State */}

          {leads.length === 0 ? (
            <div className="relative overflow-hidden rounded-2xl border border-dashed border-[#38516e] bg-[#10243b]/60 px-5 py-12 text-center sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#132942]">
                <MessageSquare
                  size={26}
                  className="text-cyan-300"
                  strokeWidth={1.5}
                />
              </div>

              <h3 className="mt-5 text-base font-bold text-white">
                No inquiries yet
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400 sm:text-sm">
                Customer messages will appear here when inquiries are
                submitted. Share your mini website or QR code to encourage
                customers to get in touch.
              </p>

              <div className="mx-auto mt-5 flex w-fit items-center gap-2 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-[11px] text-slate-300">
                <Clock size={13} className="text-cyan-300" />
                Waiting for your first inquiry
              </div>
            </div>
          ) : filteredLeads.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-[#38516e] bg-[#10243b]/60 px-5 py-10 text-center">
              <Search size={24} className="mx-auto text-slate-500" />

              <h3 className="mt-3 text-sm font-semibold text-white">
                No matching inquiries
              </h3>

              <p className="mt-1.5 text-xs text-slate-400">
                No results found for "{searchQuery}".
              </p>

              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="mt-4 inline-flex items-center gap-2 rounded-lg border border-[#38516e] bg-[#132942] px-4 py-2 text-xs font-semibold text-cyan-300 transition hover:border-cyan-300/40 hover:bg-[#193754]"
              >
                <X size={13} />
                Clear Search
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredLeads.map((lead) => (
                <article
                  key={lead.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b] transition duration-200 hover:border-cyan-300/30 hover:bg-[#122841]"
                >
                  <div className="absolute bottom-0 left-0 top-0 w-1 bg-gradient-to-b from-cyan-300 via-blue-400 to-transparent opacity-80" />

                  <div className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      {/* Avatar */}

                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754] text-base font-bold text-cyan-200 sm:h-12 sm:w-12">
                        {lead.name.charAt(0).toUpperCase()}
                      </div>

                      {/* Lead Details */}

                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="break-words text-sm font-bold text-white sm:text-base">
                            {lead.name}
                          </h3>

                          <span className="inline-flex items-center gap-1.5 rounded-md border border-cyan-300/20 bg-cyan-300/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-cyan-300">
                            <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                            {lead.status}
                          </span>
                        </div>

                        {lead.subject && (
                          <p className="mt-2 break-words text-xs font-semibold text-cyan-200">
                            {lead.subject}
                          </p>
                        )}

                        <p className="mt-2 whitespace-pre-wrap break-words text-xs leading-6 text-slate-300 sm:text-sm">
                          {lead.message}
                        </p>

                        {/* Contact Information */}

                        <div className="mt-4 flex flex-col gap-2 border-t border-[#29435f] pt-3 text-[11px] text-slate-400 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-5">
                          {lead.email && (
                            <a
                              href={`mailto:${lead.email}`}
                              className="flex min-w-0 items-center gap-2 transition hover:text-cyan-300"
                            >
                              <Mail size={13} className="shrink-0" />
                              <span className="break-all">{lead.email}</span>
                            </a>
                          )}

                          {lead.phone && (
                            <a
                              href={`tel:${lead.phone}`}
                              className="flex items-center gap-2 transition hover:text-cyan-300"
                            >
                              <Phone size={13} className="shrink-0" />
                              <span>{lead.phone}</span>
                            </a>
                          )}

                          <span className="flex items-center gap-2">
                            <Clock size={13} className="shrink-0" />
                            {lead.timestamp}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}

                      <div className="flex shrink-0 items-center gap-1.5">
                        {lead.email && (
                          <a
                            href={`mailto:${lead.email}`}
                            title="Reply by email"
                            aria-label={`Reply to ${lead.name}`}
                            className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-300 transition hover:border-cyan-300/40 hover:bg-cyan-300/10 hover:text-cyan-300"
                          >
                            <ArrowUpRight size={16} />
                          </a>
                        )}

                        <button
                          type="button"
                          onClick={() => handleDelete(lead.id)}
                          title="Delete inquiry"
                          aria-label={`Delete inquiry from ${lead.name}`}
                          className="flex h-9 w-9 items-center justify-center rounded-xl border border-[#38516e] bg-[#132942] text-slate-400 transition hover:border-red-400/40 hover:bg-red-400/10 hover:text-red-300 active:scale-95"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

/* ==================== REUSABLE INPUT ==================== */

const inputCls =
  "w-full rounded-xl border border-[#29435f] bg-[#0b1b30] px-3.5 py-3 text-sm font-medium text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/[0.08]";

const Field = ({ label, icon: Icon, required, error, children }) => (
  <div className="min-w-0">
    <label className="mb-2 flex items-center gap-2 text-[11px] font-semibold uppercase tracking-wider text-slate-300">
      {Icon && <Icon size={13} className="text-cyan-300" />}
      {label}
      {required && <span className="text-red-400">*</span>}
    </label>

    {children}

    {error && (
      <p className="mt-1.5 flex items-center gap-1.5 text-[11px] font-medium text-red-300">
        <span className="h-1 w-1 rounded-full bg-red-400" />
        {error}
      </p>
    )}
  </div>
);

export default Leads;