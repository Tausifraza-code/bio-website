// import {
//   ArrowRight,
//   CheckCircle2,
//   ContactRound,
//   Link2,
//   MessageCircle,
//   QrCode,
//   Share2,
//   ShieldCheck,
//   Smartphone,
//   UserRoundPlus,
//   Zap,
// } from "lucide-react";

// const steps = [
//   {
//     number: "01",
//     title: "Create your page",
//     description:
//       "Add your business details, contact information, services and brand identity.",
//     icon: Smartphone,
//     tag: "BUILD",
//   },
//   {
//     number: "02",
//     title: "Share one link",
//     description:
//       "Share your BIO link or QR code through messages, social media or printed materials.",
//     icon: Share2,
//     tag: "SHARE",
//   },
//   {
//     number: "03",
//     title: "Make connections",
//     description:
//       "Help customers explore your business, save your contact or start an enquiry.",
//     icon: MessageCircle,
//     tag: "CONNECT",
//   },
// ];

// const comparisons = [
//   {
//     title: "Contact sharing",
//     oldTitle: "Paper card",
//     oldText: "Customers may need to type your details manually.",
//     newTitle: "BIO Website",
//     newText:
//       "Customers can save your contact using a VCF file, when available.",
//     icon: ContactRound,
//   },
//   {
//     title: "Products & services",
//     oldTitle: "Paper card",
//     oldText: "A printed card has limited space for information.",
//     newTitle: "BIO Website",
//     newText: "Present your services, product details and pricing on your page.",
//     icon: Link2,
//   },
//   {
//     title: "Sharing your business",
//     oldTitle: "Paper card",
//     oldText: "Customers need to keep the card or type its details later.",
//     newTitle: "BIO Website",
//     newText: "Share your page through a link or QR code.",
//     icon: QrCode,
//   },
//   {
//     title: "Updating information",
//     oldTitle: "Paper card",
//     oldText: "Changes to printed details may require new cards.",
//     newTitle: "BIO Website",
//     newText: "Update the details on your page without reprinting a card.",
//     icon: Zap,
//   },
// ];

// const previews = [
//   {
//     number: "01",
//     eyebrow: "CONTACT SHARING",
//     title: "A lasting connection",
//     description: "Make your contact details easier to save and access.",
//     icon: UserRoundPlus,
//     type: "contact",
//   },
//   {
//     number: "02",
//     eyebrow: "QR ACCESS",
//     title: "Scan to discover",
//     description: "Give customers another way to open your business page.",
//     icon: QrCode,
//     type: "qr",
//   },
//   {
//     number: "03",
//     eyebrow: "CUSTOMER ENQUIRIES",
//     title: "Start a conversation",
//     description:
//       "Provide a direct route for customers to ask about your services.",
//     icon: MessageCircle,
//     type: "message",
//   },
// ];

// const cardClass =
//   "min-w-0 rounded-2xl border border-[#d7e3eb] bg-white transition duration-300 dark:border-[#29435f] dark:bg-[#132942]";

// const primaryText = "text-[#0b1b30] dark:text-white";

// const secondaryText = "text-[#64748b] dark:text-[#94a3b8]";

// function SectionLabel({ children }) {
//   return (
//     <div className="inline-flex max-w-full items-center justify-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/[0.07] px-3 py-2 text-center text-[9px] font-bold uppercase tracking-[0.1em] text-cyan-700 dark:text-cyan-300 min-[380px]:px-3.5 min-[380px]:text-[10px] min-[380px]:tracking-[0.13em] sm:text-xs">
//       <span className="h-2 w-2 shrink-0 rounded-full bg-cyan-400" />
//       <span className="min-w-0">{children}</span>
//     </div>
//   );
// }

// function About() {
//   return (
//     <section
//       id="about"
//       className="relative isolate overflow-hidden bg-[#f1f6f9] py-8 text-[#0b1b30] dark:!bg-[#0b1b30] dark:text-white sm:py-7 lg:py-7"
//     >
//       {/* Background effects */}
//       <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
//         <div className="absolute left-1/2 top-0 h-80 w-[600px] max-w-full -translate-x-1/2 rounded-full bg-cyan-400/[0.07] blur-[120px]" />

//         <div className="absolute right-0 top-[35%] h-72 w-72 rounded-full bg-cyan-400/[0.06] blur-[110px]" />

//         <div className="absolute inset-0 bg-[linear-gradient(to_right,#29435f_1px,transparent_1px),linear-gradient(to_bottom,#29435f_1px,transparent_1px)] bg-[size:64px_64px] opacity-[0.06] [mask-image:linear-gradient(to_bottom,black,transparent_90%)] dark:opacity-[0.12]" />
//       </div>

//       <div className="mx-auto max-w-[1330px] px-3 min-[380px]:px-4 sm:px-6 lg:px-10 xl:px-12">
//         {/* 01 — Why BIO exists */}
//         <div className="mx-auto max-w-[850px] text-center">
//           <SectionLabel>Why BIO Website Exists</SectionLabel>

//           <h2
//             className={`mt-4 text-[clamp(1.75rem,10vw,3.8rem)] font-black leading-[1.1] tracking-[-0.04em] sm:tracking-[-0.055em] ${primaryText}`}
//           >
//             Built to turn fleeting handshakes into{" "}
//             <span className="text-cyan-600 dark:text-cyan-300">
//               lasting connections.
//             </span>
//           </h2>

//           <p
//             className={`mx-auto mt-4 max-w-[700px] text-sm leading-7 sm:text-base sm:leading-8 ${secondaryText}`}
//           >
//             Your business deserves more than a piece of paper. BIO Website
//             brings your business identity, contact details, products and
//             customer connections together in one shareable mini website.
//           </p>
//         </div>

//         {/* Product capability cards */}
//         <div className="mt-7 grid min-w-0 grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           {[
//             {
//               value: "01",
//               title: "One business page",
//               text: "Your profile and business details together.",
//             },
//             {
//               value: "1-Tap",
//               title: "Contact sharing",
//               text: "Save contact details with a VCF download.",
//             },
//             {
//               value: "QR",
//               title: "Quick access",
//               text: "Open your page through a shareable QR code.",
//             },
//             {
//               value: "Anytime",
//               title: "Digital availability",
//               text: "Your link can be shared whenever customers need it.",
//             },
//           ].map((item) => (
//             <article
//               key={item.title}
//               className={`${cardClass} group relative overflow-hidden p-4 hover:-translate-y-1 hover:border-cyan-400/60 hover:shadow-lg hover:shadow-cyan-950/[0.5%] min-[380px]:p-5`}
//             >
//               <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-cyan-400/[0.07] blur-2xl transition group-hover:bg-cyan-400/[0.14]" />

//               <div className="relative">
//                 <span className="text-2xl font-black tracking-tight text-cyan-700 dark:text-cyan-300">
//                   {item.value}
//                 </span>

//                 <h3 className={`mt-3 text-sm font-bold ${primaryText}`}>
//                   {item.title}
//                 </h3>

//                 <p className={`mt-1.5 text-xs leading-5 ${secondaryText}`}>
//                   {item.text}
//                 </p>
//               </div>
//             </article>
//           ))}
//         </div>

//         {/* 02 — How BIO works */}
//         <div className="mt-5 sm:mt-5">
//           <div className="flex min-w-0 flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div className="min-w-0">
//               <SectionLabel>Simple by Design</SectionLabel>

//               <h3
//                 className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${primaryText}`}
//               >
//                 From first click to real connection.
//               </h3>
//             </div>

//             <p className={`max-w-[420px] text-sm leading-6 ${secondaryText}`}>
//               Three simple steps to make your business easier to discover and
//               contact.
//             </p>
//           </div>

//           <div className="relative mt-8 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
//             <div className="pointer-events-none absolute left-[17%] right-[17%] top-10 hidden border-t border-dashed border-cyan-400/35 lg:block" />

//             {steps.map((step) => {
//               const Icon = step.icon;

//               return (
//                 <article
//                   key={step.number}
//                   className={`${cardClass} group relative p-5 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-950/[0.04] sm:p-6`}
//                 >
//                   <div className="relative flex items-center justify-between">
//                     <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-700 transition duration-300 group-hover:bg-cyan-400 group-hover:text-[#0b1b30] dark:text-cyan-300">
//                       <Icon size={24} />
//                     </div>

//                     <span
//                       className={`font-mono text-sm font-bold tracking-widest ${secondaryText}`}
//                     >
//                       {step.number}
//                     </span>
//                   </div>

//                   <div className="mt-5 flex items-center gap-2">
//                     <span className="text-[10px] font-extrabold tracking-[0.16em] text-cyan-700 dark:text-cyan-300">
//                       {step.tag}
//                     </span>

//                     <span className="h-px flex-1 bg-[#d7e3eb] dark:bg-[#29435f]" />
//                   </div>

//                   <h4 className={`mt-3 text-lg font-extrabold ${primaryText}`}>
//                     {step.title}
//                   </h4>

//                   <p className={`mt-2 text-sm leading-6 ${secondaryText}`}>
//                     {step.description}
//                   </p>

//                   <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-cyan-700 dark:text-cyan-300">
//                     <CheckCircle2 size={15} />A simple customer experience
//                   </div>
//                 </article>
//               );
//             })}
//           </div>
//         </div>

//         {/* 03 — Paper vs digital */}
//         <div className="relative mt-5 overflow-hidden rounded-[22px] border border-[#d7e3eb] bg-white p-4 shadow-sm dark:border-[#29435f] dark:bg-[#132942] min-[380px]:rounded-[28px] min-[380px]:p-5 sm:mt-5 sm:p-8 lg:p-10">
//           <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-cyan-400/[0.08] blur-[90px]" />

//           <div className="pointer-events-none absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-cyan-400/[0.05] blur-[90px]" />

//           <div className="relative flex flex-col gap-5 border-b border-[#d7e3eb] pb-6 dark:border-[#29435f] sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <SectionLabel>The Digital Difference</SectionLabel>

//               <h3
//                 className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${primaryText}`}
//               >
//                 Paper card vs. BIO Website
//               </h3>

//               <p
//                 className={`mt-2 max-w-[580px] text-sm leading-6 ${secondaryText}`}
//               >
//                 See how a digital business page can make sharing your
//                 information more convenient.
//               </p>
//             </div>

//             <a
//               href="/register"
//               className="inline-flex min-h-11 w-full shrink-0 items-center justify-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#f1f6f9] hover:text-[#0b1b30] transition hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#132942] min-[430px]:w-fit"
//             >
//               Create Your Page
//               <ArrowRight size={15} />
//             </a>
//           </div>

//           {/* Column labels */}
//           <div className="relative mt-6 hidden grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1fr)] gap-3 px-4 md:grid">
//             <span
//               className={`text-[10px] font-bold uppercase tracking-[0.14em] ${secondaryText}`}
//             >
//               Use case
//             </span>

//             <span
//               className={`text-[10px] font-bold uppercase tracking-[0.14em] ${secondaryText}`}
//             >
//               Traditional paper
//             </span>

//             <span className="text-[10px] font-bold uppercase tracking-[0.14em] text-cyan-700 dark:text-cyan-300">
//               Smart digital page
//             </span>
//           </div>

//           <div className="relative mt-4 space-y-3">
//             {comparisons.map((item) => {
//               const Icon = item.icon;

//               return (
//                 <article
//                   key={item.title}
//                   className="grid min-w-0 grid-cols-1 gap-3 rounded-2xl border border-[#d7e3eb] bg-[#f1f6f9] p-3 transition duration-200 hover:border-cyan-400/50 dark:border-[#29435f] dark:bg-[#0b1b30] sm:p-4 md:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_minmax(0,1fr)] md:items-stretch"
//                 >
//                   <div className="flex items-center gap-3 px-1 py-1 md:py-2">
//                     <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-700 dark:text-cyan-300">
//                       <Icon size={19} />
//                     </span>

//                     <div>
//                       <p
//                         className={`text-[9px] font-bold uppercase tracking-wider md:hidden ${secondaryText}`}
//                       >
//                         Use case
//                       </p>

//                       <h4 className={`text-sm font-bold ${primaryText}`}>
//                         {item.title}
//                       </h4>
//                     </div>
//                   </div>

//                   <div className="rounded-xl border border-rose-500/15 bg-rose-500/[0.035] p-3.5">
//                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-rose-500">
//                       {item.oldTitle}
//                     </p>

//                     <p className={`mt-1.5 text-xs leading-5 ${secondaryText}`}>
//                       {item.oldText}
//                     </p>
//                   </div>

//                   <div className="rounded-xl border border-cyan-400/20 bg-cyan-400/[0.06] p-3.5">
//                     <p className="text-[10px] font-extrabold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
//                       {item.newTitle}
//                     </p>

//                     <p className={`mt-1.5 text-xs leading-5 ${primaryText}`}>
//                       {item.newText}
//                     </p>
//                   </div>
//                 </article>
//               );
//             })}
//           </div>

//           <p className={`relative mt-4 text-[10px] leading-5 ${secondaryText}`}>
//             BIO Website complements traditional networking. Actual capabilities
//             depend on the features enabled on your page and the customer's
//             device.
//           </p>
//         </div>

//         {/* 04 — Feature mini previews */}
//         <div className="mt-5 sm:mt-5">
//           <div className="mx-auto max-w-[720px] text-center">
//             <SectionLabel>Made for Real Connections</SectionLabel>

//             <h3
//               className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl ${primaryText}`}
//             >
//               Less friction. More ways to connect.
//             </h3>

//             <p
//               className={`mx-auto mt-3 max-w-[600px] text-sm leading-6 ${secondaryText}`}
//             >
//               Show customers what they can do on your digital business page with
//               clear, familiar actions.
//             </p>
//           </div>

//           <div className="mt-8 grid min-w-0 grid-cols-1 gap-4 lg:grid-cols-3">
//             {previews.map((preview) => (
//               <article
//                 key={preview.number}
//                 className={`${cardClass} group relative overflow-hidden p-5 hover:-translate-y-1 hover:border-cyan-400/50 hover:shadow-xl hover:shadow-cyan-950/[0.04] sm:p-6`}
//               >
//                 <div className="flex items-center justify-between">
//                   <span className="min-w-0 text-[10px] font-bold tracking-[0.12em] text-cyan-700 dark:text-cyan-300 min-[380px]:tracking-[0.15em]">
//                     {preview.eyebrow}
//                   </span>

//                   <span className={`font-mono text-xs ${secondaryText}`}>
//                     {preview.number}
//                   </span>
//                 </div>

//                 <div className="mt-4 flex min-h-[145px] items-center justify-center rounded-2xl border border-[#d7e3eb] bg-[#f1f6f9] p-3 dark:border-[#29435f] dark:bg-[#0b1b30] min-[380px]:p-4">
//                   {preview.type === "contact" && (
//                     <div className="w-full max-w-[245px] rounded-xl border border-[#d7e3eb] bg-white p-3 shadow-sm dark:border-[#29435f] dark:bg-[#132942]">
//                       <div className="flex items-center gap-3">
//                         <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-cyan-400/10 text-cyan-700 dark:text-cyan-300">
//                           <ContactRound size={21} />
//                         </div>

//                         <div className="min-w-0 flex-1">
//                           <p
//                             className={`truncate text-xs font-bold ${primaryText}`}
//                           >
//                             Business Contact
//                           </p>

//                           <p className={`mt-1 text-[10px] ${secondaryText}`}>
//                             Contact.vcf
//                           </p>
//                         </div>

//                         <CheckCircle2 size={17} className="text-cyan-500" />
//                       </div>

//                       <div className="mt-3 flex items-center justify-center gap-2 rounded-lg bg-cyan-400 px-3 py-2 text-center text-[10px] font-bold text-[#0b1b30]">
//                         <UserRoundPlus size={13} />
//                         Save contact
//                       </div>
//                     </div>
//                   )}

//                   {preview.type === "qr" && (
//                     <div className="flex w-full max-w-[245px] flex-col items-center gap-3 rounded-xl border border-[#d7e3eb] bg-white p-3 dark:border-[#29435f] dark:bg-[#132942] min-[380px]:flex-row min-[380px]:gap-4 min-[380px]:text-left">
//                       <div className="flex h-[82px] w-[82px] shrink-0 items-center justify-center rounded-lg bg-white p-2 text-[#0b1b30]">
//                         <QrCode size={67} strokeWidth={1.7} />
//                       </div>

//                       <div className="max-w-[125px] min-w-0">
//                         <p className={`text-xs font-bold ${primaryText}`}>
//                           Scan to open
//                         </p>

//                         <p
//                           className={`mt-1 text-[10px] leading-4 ${secondaryText}`}
//                         >
//                           Your business page, ready to share.
//                         </p>
//                       </div>
//                     </div>
//                   )}

//                   {preview.type === "message" && (
//                     <div className="w-full max-w-[245px] rounded-xl border border-[#d7e3eb] bg-white p-3 dark:border-[#29435f] dark:bg-[#132942]">
//                       <div className="flex min-w-0 items-center gap-2">
//                         <span className="flex h-8 w-8 items-center justify-center rounded-full bg-cyan-400/10 text-cyan-700 dark:text-cyan-300">
//                           <MessageCircle size={16} />
//                         </span>

//                         <div className="min-w-0">
//                           <p className={`text-xs font-bold ${primaryText}`}>
//                             New enquiry
//                           </p>

//                           <p className={`text-[9px] ${secondaryText}`}>
//                             Customer message preview
//                           </p>
//                         </div>
//                       </div>

//                       <div
//                         className={`mt-3 rounded-lg rounded-tl-none bg-cyan-400/10 p-2.5 text-[10px] leading-4 ${primaryText}`}
//                       >
//                         Hi, I would like to know more about your services.
//                       </div>

//                       <div className="mt-2 flex justify-end">
//                         <span className="rounded-full bg-cyan-400 px-3 py-1.5 text-center text-[9px] font-bold text-[#0b1b30]">
//                           Open WhatsApp
//                         </span>
//                       </div>
//                     </div>
//                   )}
//                 </div>

//                 <h4 className={`mt-4 text-base font-extrabold ${primaryText}`}>
//                   {preview.title}
//                 </h4>

//                 <p className={`mt-2 text-xs leading-5 ${secondaryText}`}>
//                   {preview.description}
//                 </p>
//               </article>
//             ))}
//           </div>
//         </div>

//         {/* Closing CTA */}
//         <div className="relative mt-5 overflow-hidden rounded-[22px] border border-cyan-400/20 bg-white p-5 text-center dark:bg-[#132942] min-[380px]:rounded-[28px] min-[380px]:p-6 sm:mt-5 sm:p-8">
//           <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-72 -translate-x-1/2 rounded-full bg-cyan-400/[0.08] blur-[80px]" />

//           <div className="relative mx-auto max-w-[650px]">
//             <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl border border-cyan-400/20 bg-cyan-400/10 text-cyan-700 dark:text-cyan-300">
//               <ShieldCheck size={24} />
//             </div>

//             <h3
//               className={`mt-4 text-2xl font-black tracking-tight sm:text-3xl ${primaryText}`}
//             >
//               Give your business a link worth sharing.
//             </h3>

//             <p className={`mt-3 text-sm leading-6 ${secondaryText}`}>
//               Bring your business identity, contact details and offerings
//               together in one place.
//             </p>

//             <a
//               href="/register"
//               className="group mt-6 inline-flex min-h-12 w-full items-center justify-center gap-2.5 rounded-xl bg-cyan-400 px-6 py-3 text-sm font-bold text-[#f1f6f9] hover:text-[#0b1b30] shadow-lg shadow-cyan-950/10 transition hover:-translate-y-0.5 hover:bg-cyan-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-[#132942] min-[430px]:w-auto"
//             >
//               Create Your Mini Website
//               <ArrowRight
//                 size={17}
//                 className="transition-transform group-hover:translate-x-1"
//               />
//             </a>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// }

// export default About;
