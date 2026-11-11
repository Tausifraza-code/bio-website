import { Link } from "react-router-dom";
import {
  ArrowRight,
  ContactRound,
  QrCode,
  BriefcaseBusiness,
  Image,
  MessageCircle,
  ShieldCheck,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const services = [
  {
    icon: ContactRound,
    title: "Digital Visiting Cards",
    description:
      "Create a professional digital identity and share your contact information with ease.",
  },
  {
    icon: QrCode,
    title: "Smart QR Codes",
    description:
      "Connect people to your digital profile through convenient QR code sharing.",
  },
  {
    icon: BriefcaseBusiness,
    title: "Business Showcase",
    description:
      "Present your business, services, products and contact information in one place.",
  },
  {
    icon: Image,
    title: "Digital Gallery",
    description:
      "Showcase your work, products and business images through your online profile.",
  },
  {
    icon: MessageCircle,
    title: "Customer Connections",
    description:
      "Make it easier for potential customers to contact you and submit inquiries.",
  },
  {
    icon: ShieldCheck,
    title: "Profile Management",
    description:
      "Manage and update your digital profile through your personal dashboard.",
  },
];

export default function About() {
  return (
    <main className="min-h-screen bg-[#f1f6f9] text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white">
      <section className="relative overflow-hidden px-5 pb-6 pt-36 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-cyan-400/[0.08] blur-[100px] dark:bg-cyan-400/[0.07]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[#132942]/[0.10] blur-[100px] dark:bg-cyan-400/[0.05]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-400/10 px-4 py-2 text-xs font-bold uppercase tracking-wider text-cyan-700 dark:text-cyan-300">
            <ContactRound size={15} />
            About BIO SITESS
          </span>

          <h1 className="mt-7 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Your Digital Identity,
            <span className="block text-cyan-600 dark:text-cyan-300">
              All in One Place.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-3xl text-base leading-8 text-slate-600 dark:text-slate-300 sm:text-lg">
            BIO SITESS is an independent digital platform designed to help
            individuals, professionals and businesses create and share their
            digital identity through smart digital visiting cards, QR codes and
            online business profiles.
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-3">
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-full bg-cyan-400 px-7 py-3.5 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-300"
            >
              Get Started <ArrowRight size={17} />
            </Link>

            <Link
              to="/"
              className="rounded-full border border-slate-300 px-7 py-3.5 text-sm font-semibold transition hover:border-cyan-400 dark:border-slate-600"
            >
              Explore BIO SITESS
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-6">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-2 lg:items-center">
          <div>
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
              Who We Are
            </p>
            <h2 className="mt-4 text-3xl font-extrabold sm:text-4xl">
              Making Digital Connections Simpler
            </h2>
            <p className="mt-5 leading-8 text-slate-600 dark:text-slate-300">
              BIO SITESS brings essential professional and business information
              together in a shareable digital profile. Instead of relying only
              on traditional printed visiting cards, users can create an online
              profile that can be accessed and shared digitally.
            </p>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              Our platform is independently operated under the BIO SITESS brand.
              We aim to make it easier for people to present their professional
              identity and connect with customers.
            </p>
          </div>

          <div className="rounded-3xl border border-cyan-500/15 bg-white p-8 shadow-xl dark:border-[#29435f] dark:bg-[#132942] sm:p-10">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
              <ContactRound size={29} />
            </div>
            <h3 className="mt-6 text-2xl font-bold">Our Purpose</h3>
            <p className="mt-4 leading-8 text-slate-600 dark:text-slate-300">
              To provide a convenient digital space where individuals and
              businesses can present their information, showcase their work and
              make meaningful connections.
            </p>
          </div>
        </div>
      </section>

      <section className="px-5 py-6 sm:px-8 lg:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-12 max-w-2xl text-center">
            <p className="text-sm font-bold uppercase tracking-widest text-cyan-600 dark:text-cyan-300">
              What We Offer
            </p>
            <h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">
              Everything You Need to Share Your Identity
            </h2>
            <p className="mt-4 leading-7 text-slate-600 dark:text-slate-300">
              Tools to help you present your professional identity and connect
              with people digitally.
            </p>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => {
              const Icon = service.icon;

              return (
                <article
                  key={service.title}
                  className="rounded-2xl border border-slate-200 bg-white p-6 transition hover:-translate-y-1 hover:border-cyan-400 dark:border-[#29435f] dark:bg-[#132942]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                    <Icon size={23} />
                  </div>
                  <h3 className="mt-5 text-lg font-bold">{service.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                    {service.description}
                  </p>
                </article>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-4 py-6 sm:px-8 sm:py-6 lg:px-6">
        <div className="mx-auto max-w-5xl rounded-3xl border border-cyan-500/20 bg-white p-5 dark:border-[#29435f] dark:bg-[#132942] sm:p-8 lg:p-12">
          <div className="text-left">
            <h2 className="text-2xl font-extrabold sm:text-3xl">
              Get in Touch
            </h2>
            <p className="mt-3 max-w-md text-sm leading-6 text-slate-600 dark:text-slate-300 sm:text-base sm:leading-7">
              Have a question about BIO SITESS? Contact our support team.
            </p>
          </div>

          <div className="mt-7 grid min-w-0 gap-6 sm:mt-9 sm:grid-cols-3">
            <a
              href="mailto:Biosites.in@gmail.com"
              className="flex min-w-0 flex-col items-start gap-3 text-left"
            >
              <Mail
                className="shrink-0 text-cyan-600 dark:text-cyan-300"
                size={25}
              />
              <span className="break-words text-sm font-semibold [overflow-wrap:anywhere]">
                Biosites.in@gmail.com
              </span>
            </a>

            <a
              href="tel:+919210339252"
              className="flex min-w-0 flex-col items-start gap-3 text-left"
            >
              <Phone
                className="shrink-0 text-cyan-600 dark:text-cyan-300"
                size={25}
              />
              <span className="text-sm font-semibold">+91 92103 39252</span>
            </a>

            <div className="flex min-w-0 flex-col items-start gap-3 text-left">
              <MapPin
                className="shrink-0 text-cyan-600 dark:text-cyan-300"
                size={25}
              />
              <span className="break-words text-sm font-semibold leading-6 [overflow-wrap:anywhere]">
                Property No. V-6, Old No. 5/6, Khasra No. 28, Near 100 Foota
                Road, Vijay Park, Maujpur, East Delhi, Delhi – 110053, India.
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
