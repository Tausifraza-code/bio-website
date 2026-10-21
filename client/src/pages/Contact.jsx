// import { useState } from "react";
// import {
//   ArrowRight,
//   BadgeCheck,
//   CheckCircle2,
//   Clock,
//   Copy,
//   ExternalLink,
//   Mail,
//   MapPin,
//   MessageCircle,
//   Phone,
//   Send,
//   ShieldCheck,
// } from "lucide-react";

// const needsList = [
//   "Digital Visiting Card",
//   "Product / Service Catalog",
//   "Custom Domain Setup",
//   "Multi-Staff Franchise",
//   "General Question",
// ];

// const surface =
//   "border border-[#d7e3eb] bg-white dark:border-[#29435f] dark:bg-[#132942]";
// const heading = "text-[#0b1b30] dark:text-white";
// const muted = "text-[#64748b] dark:text-[#94a3b8]";

// const fieldClass =
//   "w-full min-w-0 rounded-xl border border-[#d7e3eb] bg-white px-3.5 py-3 text-sm text-[#0b1b30] outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-white dark:placeholder:text-slate-500";

// function Contact() {
//   const [formData, setFormData] = useState({
//     fullName: "",
//     email: "",
//     phone: "",
//     need: "Digital Visiting Card",
//     message: "",
//   });

//   const [submitted, setSubmitted] = useState(false);
//   const [copiedEmail, setCopiedEmail] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData((prev) => ({ ...prev, [name]: value }));
//   };

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     setSubmitted(true);
//   };

//   const handleCopyEmail = async () => {
//     try {
//       await navigator.clipboard.writeText("support@visitingcard.pro");
//       setCopiedEmail(true);
//       setTimeout(() => setCopiedEmail(false), 2000);
//     } catch {
//       setCopiedEmail(false);
//     }
//   };

//   return (
//     <section
//       id="contact"
//       className="relative isolate overflow-hidden bg-[#f1f6f9] py-5 text-[#0b1b30] dark:!bg-[#0b1b30] dark:text-white sm:py-12 lg:py-5"
//     >
//       {/* Navy and cyan ambient background */}
//       <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute left-[-5%] top-1/3 h-[420px] w-[420px] rounded-full bg-cyan-400/[0.07] blur-[140px]" />
//         <div className="absolute bottom-1/4 right-[-5%] h-[420px] w-[420px] rounded-full bg-cyan-400/[0.06] blur-[140px]" />
//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#29435f_1px,transparent_1px),linear-gradient(to_bottom,#29435f_1px,transparent_1px)] bg-[size:48px_48px] opacity-[0.06] dark:opacity-[0.12]" />
//       </div>

//       <div className="mx-auto w-full max-w-[1280px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-12">
//         {/* Header */}
//         <header className="mx-auto max-w-[760px] text-center">
//           <div className="mb-4 inline-flex max-w-full flex-wrap items-center justify-center gap-x-2 gap-y-1 rounded-full border border-cyan-500/25 bg-cyan-500/[0.07] px-3 py-2 text-center text-[10px] font-semibold text-cyan-700 dark:text-cyan-300 min-[380px]:px-4 sm:text-xs">
//             <span className="relative flex h-2 w-2">
//               <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-400 opacity-60" />
//               <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-400" />
//             </span>
//             <MessageCircle size={14} />
//             <span className="min-w-0">
//               Direct Client Advisory &amp; Support
//             </span>
//           </div>

//           <h2
//             className={`text-[clamp(30px,3.8vw,48px)] font-black leading-[1.12] tracking-[-0.035em] ${heading}`}
//           >
//             Let&apos;s Build Your High-Converting{" "}
//             <span className="text-cyan-600 dark:text-cyan-300">
//               Digital Presence
//             </span>
//           </h2>

//           <p
//             className={`mx-auto mt-4 max-w-[580px] text-sm leading-relaxed sm:text-base ${muted}`}
//           >
//             Have questions about catalog features, QR generation, or onboarding
//             your brand? Reach out anytime — we reply fast.
//           </p>
//         </header>

//         {/* Direct contact cards */}
//         <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//           <a
//             href="https://wa.me/919820188287?text=Hi%2C%20I%20want%20to%20know%20more%20about%20BIO%20Website"
//             target="_blank"
//             rel="noreferrer"
//             className={`group flex min-w-0 flex-col justify-between rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-950/5 ${surface}`}
//           >
//             <div>
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-700 transition group-hover:bg-cyan-400 group-hover:text-[#0b1b30] dark:text-cyan-300">
//                   <MessageCircle size={22} />
//                 </span>
//                 <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
//                   Instant Chat
//                 </span>
//               </div>
//               <h3 className={`mt-4 text-sm font-bold ${heading}`}>
//                 WhatsApp Support
//               </h3>
//               <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
//                 Connect directly with our onboarding specialists on WhatsApp.
//               </p>
//             </div>
//             <div className="mt-5 flex min-w-0 items-center justify-between gap-2 border-t border-[#d7e3eb] pt-4 text-xs font-semibold text-cyan-700 dark:border-[#29435f] dark:text-cyan-300">
//               <span>+91 98201 88287</span>
//               <ExternalLink size={14} />
//             </div>
//           </a>

//           <a
//             href="tel:+919820188287"
//             className={`group flex min-w-0 flex-col justify-between rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-950/5 ${surface}`}
//           >
//             <div>
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-700 transition group-hover:bg-cyan-400 group-hover:text-[#0b1b30] dark:text-cyan-300">
//                   <Phone size={22} />
//                 </span>
//                 <span className="rounded-full bg-cyan-400/10 px-2.5 py-1 text-[10px] font-bold text-cyan-700 dark:text-cyan-300">
//                   9:30 AM – 7:30 PM
//                 </span>
//               </div>
//               <h3 className={`mt-4 text-sm font-bold ${heading}`}>
//                 Direct Call Hotline
//               </h3>
//               <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
//                 Speak directly with an enterprise advisor for tailored setup.
//               </p>
//             </div>
//             <div className="mt-5 flex min-w-0 items-center justify-between gap-2 border-t border-[#d7e3eb] pt-4 text-xs font-semibold text-cyan-700 dark:border-[#29435f] dark:text-cyan-300">
//               <span>+91 98201 88287</span>
//               <Phone size={14} />
//             </div>
//           </a>

//           <div
//             className={`group flex min-w-0 flex-col justify-between rounded-2xl p-5 transition duration-300 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-950/5 ${surface}`}
//           >
//             <div>
//               <div className="flex flex-wrap items-center justify-between gap-2">
//                 <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-700 transition group-hover:bg-cyan-400 group-hover:text-[#0b1b30] dark:text-cyan-300">
//                   <Mail size={22} />
//                 </span>
//                 <span
//                   className={`rounded-full bg-[#f1f6f9] px-2.5 py-1 text-[10px] font-medium dark:bg-[#0b1b30] ${muted}`}
//                 >
//                   ~45 min reply
//                 </span>
//               </div>
//               <h3 className={`mt-4 text-sm font-bold ${heading}`}>
//                 Email Inquiries
//               </h3>
//               <p className={`mt-2 text-xs leading-relaxed ${muted}`}>
//                 Send feature inquiries, team invites, or partnership decks.
//               </p>
//             </div>
//             <div className="mt-5 flex min-w-0 items-center justify-between gap-2 border-t border-[#d7e3eb] pt-4 dark:border-[#29435f]">
//               <span
//                 className={`min-w-0 truncate text-xs font-semibold ${heading}`}
//               >
//                 support@visitingcard.pro
//               </span>
//               <button
//                 type="button"
//                 onClick={handleCopyEmail}
//                 className="flex min-h-9 shrink-0 items-center gap-1.5 rounded-lg bg-cyan-400/10 px-2.5 py-2 text-[11px] font-semibold text-cyan-700 transition hover:bg-cyan-400/20 dark:text-cyan-300"
//               >
//                 <Copy size={12} />
//                 {copiedEmail ? "Copied" : "Copy"}
//               </button>
//             </div>
//           </div>
//         </div>

//         {/* Contact form and information */}
//         <div className="mt-8 grid min-w-0 grid-cols-1 items-start gap-6 lg:grid-cols-12 lg:gap-8">
//           {/* Form */}
//           <div
//             className={`relative overflow-hidden rounded-[26px] p-5 shadow-sm sm:p-8 lg:col-span-7 ${surface}`}
//           >
//             <span className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent" />

//             <div className="border-b border-[#d7e3eb] pb-5 dark:border-[#29435f]">
//               <h3
//                 className={`text-lg font-bold tracking-tight sm:text-xl ${heading}`}
//               >
//                 Send a Message
//               </h3>
//               <p className={`mt-2 text-xs leading-5 sm:text-sm ${muted}`}>
//                 Fill in your details and an advisor will prepare a preview card
//                 for you.
//               </p>
//             </div>

//             {submitted ? (
//               <div
//                 role="status"
//                 aria-live="polite"
//                 className="mt-6 flex flex-col items-center justify-center rounded-2xl border border-cyan-400/25 bg-cyan-400/[0.07] p-8 text-center"
//               >
//                 <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
//                   <CheckCircle2 size={32} />
//                 </div>
//                 <h4 className={`mt-4 text-lg font-black ${heading}`}>
//                   Inquiry Received!
//                 </h4>
//                 <p
//                   className={`mt-2 max-w-sm text-xs leading-relaxed sm:text-sm ${muted}`}
//                 >
//                   Thanks for reaching out. We will get in touch on
//                   WhatsApp/Email within 45 minutes.
//                 </p>
//                 <button
//                   type="button"
//                   onClick={() => setSubmitted(false)}
//                   className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-300"
//                 >
//                   Send Another Message
//                   <ArrowRight size={14} />
//                 </button>
//               </div>
//             ) : (
//               <form onSubmit={handleSubmit} className="mt-6 space-y-5">
//                 <div className="grid min-w-0 grid-cols-1 gap-4 sm:grid-cols-2">
//                   <div>
//                     <label
//                       htmlFor="fullName"
//                       className={`mb-2 block text-xs font-semibold ${muted}`}
//                     >
//                       Your Name <span className="text-cyan-500">*</span>
//                     </label>
//                     <input
//                       id="fullName"
//                       name="fullName"
//                       type="text"
//                       required
//                       autoComplete="name"
//                       placeholder="e.g. Rajesh Sharma"
//                       value={formData.fullName}
//                       onChange={handleChange}
//                       className={fieldClass}
//                     />
//                   </div>

//                   <div>
//                     <label
//                       htmlFor="phone"
//                       className={`mb-2 block text-xs font-semibold ${muted}`}
//                     >
//                       WhatsApp / Mobile <span className="text-cyan-500">*</span>
//                     </label>
//                     <input
//                       id="phone"
//                       name="phone"
//                       type="tel"
//                       required
//                       autoComplete="tel"
//                       placeholder="+91 98201 XXXXX"
//                       value={formData.phone}
//                       onChange={handleChange}
//                       className={fieldClass}
//                     />
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="email"
//                     className={`mb-2 block text-xs font-semibold ${muted}`}
//                   >
//                     Email Address <span className="text-cyan-500">*</span>
//                   </label>
//                   <input
//                     id="email"
//                     name="email"
//                     type="email"
//                     required
//                     autoComplete="email"
//                     placeholder="you@yourbusiness.com"
//                     value={formData.email}
//                     onChange={handleChange}
//                     className={fieldClass}
//                   />
//                 </div>

//                 <div>
//                   <label
//                     className={`mb-3 block text-xs font-semibold ${muted}`}
//                   >
//                     What are you looking for?
//                   </label>
//                   <div className="flex min-w-0 flex-wrap gap-2">
//                     {needsList.map((item) => {
//                       const active = formData.need === item;

//                       return (
//                         <button
//                           key={item}
//                           type="button"
//                           onClick={() =>
//                             setFormData((prev) => ({ ...prev, need: item }))
//                           }
//                           aria-pressed={active}
//                           className={`min-h-10 min-w-0 rounded-xl border px-3 py-2 text-xs font-medium transition ${
//                             active
//                               ? "border-cyan-400 bg-cyan-400 text-[#0b1b30]"
//                               : "border-[#d7e3eb] bg-white text-[#475569] hover:border-cyan-400 dark:border-[#29435f] dark:bg-[#0b1b30] dark:text-[#94a3b8] dark:hover:text-cyan-300"
//                           }`}
//                         >
//                           {item}
//                         </button>
//                       );
//                     })}
//                   </div>
//                 </div>

//                 <div>
//                   <label
//                     htmlFor="message"
//                     className={`mb-2 block text-xs font-semibold ${muted}`}
//                   >
//                     Message / Business Details (Optional)
//                   </label>
//                   <textarea
//                     id="message"
//                     name="message"
//                     rows={4}
//                     placeholder="Tell us about your business, branches, or any special requests..."
//                     value={formData.message}
//                     onChange={handleChange}
//                     className={`${fieldClass} resize-y`}
//                   />
//                 </div>

//                 <button
//                   type="submit"
//                   className="group flex min-h-12 w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-[#f1f6f9] hover:text-[#0b1b30] shadow-lg shadow-cyan-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#132942]"
//                 >
//                   <Send
//                     size={16}
//                     className="transition-transform group-hover:translate-x-0.5"
//                   />
//                   Submit Inquiry
//                 </button>

//                 <p
//                   className={`flex items-start justify-center gap-2 text-center text-[11px] leading-5 ${muted}`}
//                 >
//                   <ShieldCheck
//                     size={14}
//                     className="mt-0.5 shrink-0 text-cyan-500"
//                   />
//                   <span>
//                     No spam. Your phone number is strictly used for the
//                     requested demo.
//                   </span>
//                 </p>
//               </form>
//             )}
//           </div>

//           {/* Headquarters and guarantees */}
//           <div className="space-y-4 lg:col-span-5">
//             <div className={`rounded-[24px] p-5 shadow-sm sm:p-6 ${surface}`}>
//               <div className="flex items-center gap-3">
//                 <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-600 dark:text-cyan-300">
//                   <MapPin size={19} />
//                 </div>
//                 <div>
//                   <h4 className={`text-sm font-bold ${heading}`}>
//                     Registered Headquarters
//                   </h4>
//                   <p className={`mt-1 text-xs ${muted}`}>Mumbai Tech Hub</p>
//                 </div>
//               </div>

//               <p className={`mt-5 text-xs leading-relaxed ${muted}`}>
//                 Level 5, Platina Tech Park, Bandra Kurla Complex (BKC), Mumbai,
//                 Maharashtra 400051, India.
//               </p>

//               <div
//                 className={`mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#d7e3eb] pt-4 text-xs dark:border-[#29435f] ${muted}`}
//               >
//                 <span className="flex min-w-0 items-center gap-2">
//                   <Clock size={14} className="text-cyan-500" />
//                   Mon – Sat: 9:30 AM – 7:30 PM
//                 </span>
//                 <span className="font-semibold text-cyan-700 dark:text-cyan-300">
//                   IST
//                 </span>
//               </div>
//             </div>

//             <div className={`rounded-[24px] p-5 sm:p-6 ${surface}`}>
//               <div
//                 className={`flex items-center gap-2 text-xs font-bold uppercase tracking-wider ${heading}`}
//               >
//                 Why Partner With Us
//               </div>

//               <div className="mt-5 space-y-4">
//                 <div
//                   className={`flex items-start gap-3 text-xs leading-5 ${muted}`}
//                 >
//                   <BadgeCheck
//                     size={17}
//                     className="mt-0.5 shrink-0 text-cyan-500"
//                   />
//                   <p>
//                     <strong className={`font-semibold ${heading}`}>
//                       Live in 2 Minutes:
//                     </strong>{" "}
//                     Generate your card, upload catalog photos, and print QR
//                     codes immediately.
//                   </p>
//                 </div>

//                 <div
//                   className={`flex items-start gap-3 text-xs leading-5 ${muted}`}
//                 >
//                   <BadgeCheck
//                     size={17}
//                     className="mt-0.5 shrink-0 text-cyan-500"
//                   />
//                   <p>
//                     <strong className={`font-semibold ${heading}`}>
//                       Native Address Book Sync:
//                     </strong>{" "}
//                     Save contacts directly as native .VCF cards on Apple and
//                     Android devices.
//                   </p>
//                 </div>

//                 <div
//                   className={`flex items-start gap-3 text-xs leading-5 ${muted}`}
//                 >
//                   <BadgeCheck
//                     size={17}
//                     className="mt-0.5 shrink-0 text-cyan-500"
//                   />
//                   <p>
//                     <strong className={`font-semibold ${heading}`}>
//                       Direct WhatsApp Orders:
//                     </strong>{" "}
//                     Every customer enquiry routes right into your phone chat.
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default Contact;
