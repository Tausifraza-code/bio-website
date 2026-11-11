import { Link } from "react-router-dom";
import {
  ArrowLeft,
  ShieldCheck,
  UserRound,
  Database,
  Eye,
  Image,
  CreditCard,
  Trash2,
  LockKeyhole,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const sections = [
  {
    icon: UserRound,
    title: "1. Information We Collect",
    content: [
      "When you register or use BIO SITESS, we may collect information you provide, including your name, email address, phone number, password and account details.",
      "When you create a digital profile, you may provide your business name, industry, biography, contact information, address, website, social media links, business hours and UPI ID.",
      "You may also upload profile photographs, logos, banners, product images and gallery images.",
      "When customers contact a profile owner through an inquiry form, information such as their name, email address, phone number and message may be collected.",
      "When users submit reviews, we collect the reviewer name, email address if provided, rating and comment.",
    ],
  },
  {
    icon: Database,
    title: "2. How We Use Your Information",
    content: [
      "We use account information to create and manage user accounts and provide access to the BIO SITESS dashboard.",
      "Profile information is used to create, display and maintain digital visiting cards and public business profiles.",
      "Inquiry and review information is used to provide customer communication and review functionality.",
      "Uploaded images and product information are used to display your business content and digital gallery.",
      "Payment information is used to process plan purchases, verify transactions and maintain purchase records.",
    ],
  },
  {
    icon: Eye,
    title: "3. Public Profile and Visibility",
    content: [
      "Information you add to your public digital profile may be visible to anyone who visits your profile or scans its associated QR code.",
      "You should avoid publishing information that you do not want to make publicly accessible.",
      "The visibility of profile information may depend on the profile features and settings you choose to enable.",
      "Inquiries submitted through a public profile may be delivered to the profile owner.",
    ],
  },
  {
    icon: Image,
    title: "4. Third-Party Services",
    content: [
      "BIO SITESS uses ImgBB for hosting certain uploaded images. Images uploaded through applicable features may be processed and stored by this third-party image hosting service.",
      "BIO SITESS uses Razorpay to process plan payments. Our backend maintains transaction references, payment status, plan details, amounts and relevant purchase dates.",
      "Third-party services process information according to their own privacy policies and terms. Users should review those policies when using the respective services.",
    ],
  },
  {
    icon: CreditCard,
    title: "5. Payments",
    content: [
      "Plan purchases are processed through Razorpay.",
      "BIO SITESS stores payment-related records such as Razorpay order references, payment references, purchase amount, selected plan, transaction status and purchase or expiry dates.",
      "Payment processing is subject to the applicable terms and privacy practices of Razorpay and the payment method provider.",
    ],
  },
  {
    icon: LockKeyhole,
    title: "6. Cookies, Analytics and Tracking",
    content: [
      "BIO SITESS does not use Google Analytics or Google Tag Manager.",
      "BIO SITESS does not use analytics or advertising tracking cookies.",
      "The website may use browser storage, such as local storage, for application preferences such as the selected display theme. This is different from analytics or advertising tracking.",
    ],
  },
  {
    icon: ShieldCheck,
    title: "7. Data Security",
    content: [
      "We take reasonable steps to protect information handled by the platform.",
      "Users are responsible for keeping their login credentials confidential and should not share their passwords with others.",
      "No online service or method of electronic storage can be guaranteed to be completely secure.",
    ],
  },
  {
    icon: Trash2,
    title: "8. Account Deletion and Data Handling",
    content: [
      "Users who want to request account deletion should contact BIO SITESS support.",
      "Our current administrative account deletion process removes the user's account, associated MiniProfile records and plan purchase records, and clears referral references pointing to that user.",
      "The current deletion process does not automatically remove all related inquiry, review, gallery, product or QR records. Some records may therefore remain after an account is deleted.",
      "If you have questions about information associated with your account, contact our support team.",
    ],
  },
  {
    icon: UserRound,
    title: "9. Your Responsibility",
    content: [
      "You are responsible for ensuring that the information and content you upload or publish on BIO SITESS are accurate and that you have the necessary rights or permissions to share them.",
      "Please do not publish sensitive personal information on a public profile unless you intend to make it publicly accessible.",
    ],
  },
  {
    icon: Mail,
    title: "10. Contact Us",
    content: [
      "For questions or concerns about this Privacy Policy or your information, contact BIO SITESS using the details below.",
    ],
  },
];

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen bg-[#f1f6f9] px-5 pb-6 pt-32 text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white sm:px-8 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
            <ShieldCheck size={32} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            BIO SITESS
          </p>

          <h1 className="mt-3 text-4xl font-black sm:text-5xl">
            Privacy Policy
          </h1>

          <p className="mx-auto mt-5 max-w-2xl leading-8 text-slate-600 dark:text-slate-300">
            This Privacy Policy explains what information BIO SITESS collects,
            how it is used and how it is handled when you use our platform.
          </p>

          <p className="mt-4 text-xs text-slate-500 dark:text-slate-400">
            Last updated: November 7, 2026
          </p>

          <Link
            to="/"
            className="mt-6 inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-[#0b1b30] shadow-sm transition-colors hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 lg:hidden"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Home
          </Link>
        </header>

        <div className="space-y-5">
          {sections.map((section) => {
            const Icon = section.icon;

            return (
              <section
                key={section.title}
                className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-[#29435f] dark:bg-[#132942] sm:p-8"
              >
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                    <Icon size={21} />
                  </div>

                  <h2 className="text-lg font-bold sm:text-xl">
                    {section.title}
                  </h2>
                </div>

                <div className="mt-5 space-y-3">
                  {section.content.map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-sm leading-7 text-slate-600 dark:text-slate-300"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </section>
            );
          })}
        </div>

        <section className="mt-8 rounded-2xl border border-slate-200 bg-cyan-50 p-7 dark:border-[#29435f] dark:bg-[#132942]">
          <h2 className="text-xl font-bold">BIO SITESS Support</h2>

          <div className="mt-5 space-y-4 text-sm">
            <a
              href="mailto:Biosites.in@gmail.com"
              className="flex items-center gap-3 break-all"
            >
              <Mail size={18} className="text-cyan-600 dark:text-cyan-300" />
              Biosites.in@gmail.com
            </a>

            <a href="tel:+919210339252" className="flex items-center gap-3">
              <Phone size={18} className="text-cyan-600 dark:text-cyan-300" />
              +91 92103 39252
            </a>

            <p className="flex items-start gap-3">
              <MapPin
                size={18}
                className="shrink-0 text-cyan-600 dark:text-cyan-300"
              />
              Property No. V-6, Old No. 5/6, Khasra No. 28, Near 100 Foota Road,
              Vijay Park, Maujpur, East Delhi, Delhi – 110053, India.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
