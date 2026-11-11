import { useState } from "react";
import { Link } from "react-router-dom";
import {
  ArrowLeft,
  Mail,
  Phone,
  MapPin,
  Send,
  MessageCircle,
  Clock,
  ContactRound,
} from "lucide-react";

export default function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const subject = encodeURIComponent(form.subject || "BIO SITESS Inquiry");

    const body = encodeURIComponent(
      `Name: ${form.name}\nEmail: ${form.email}\n\nMessage:\n${form.message}`,
    );

    window.location.href = `mailto:Biosites.in@gmail.com?subject=${subject}&body=${body}`;
  };

  const contactDetails = [
    {
      icon: Mail,
      title: "Email Us",
      value: "Biosites.in@gmail.com",
      href: "mailto:Biosites.in@gmail.com",
    },
    {
      icon: Phone,
      title: "Call Us",
      value: "+91 92103 39252",
      href: "tel:+919210339252",
    },
    {
      icon: MapPin,
      title: "Visit Us",
      value:
        "Property No. V-6, Old No. 5/6, Khasra No. 28, Near 100 Foota Road, Vijay Park, Maujpur, East Delhi, Delhi - 110053, India",
      href: "https://www.google.com/maps/search/?api=1&query=Property+No+V-6+Vijay+Park+Maujpur+East+Delhi+110053",
    },
  ];

  return (
    <main className="min-h-screen bg-[#f1f6f9] text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white">
      {/* Hero */}
      <section className="relative overflow-hidden px-5 pb-6 pt-36 sm:px-8 lg:px-12">
        <div className="pointer-events-none absolute -right-20 top-0 h-96 w-96 rounded-full bg-cyan-400/[0.08] blur-[100px] dark:bg-cyan-400/[0.07]" />
        <div className="pointer-events-none absolute -left-20 bottom-0 h-80 w-80 rounded-full bg-[#132942]/[0.10] blur-[100px] dark:bg-cyan-400/[0.05]" />

        <div className="relative mx-auto max-w-4xl text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
            <ContactRound size={32} />
          </div>

          <p className="mt-6 text-xs font-bold uppercase tracking-[0.2em] text-cyan-600 dark:text-cyan-300">
            Contact BIO SITESS
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl">
            Let's Start a
            <span className="block text-cyan-600 dark:text-cyan-300">
              Conversation.
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-slate-600 dark:text-slate-300">
            Have a question, need assistance or want to know more about BIO
            SITES? We're happy to hear from you.
          </p>

          <Link
            to="/"
            className="mt-7 inline-flex min-h-11 items-center gap-2 rounded-full bg-cyan-300 px-5 py-2.5 text-sm font-bold text-[#0b1b30] shadow-sm transition-colors hover:bg-cyan-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cyan-600 lg:hidden"
          >
            <ArrowLeft size={16} aria-hidden="true" />
            Back to Home
          </Link>
        </div>
      </section>

      {/* Contact Content */}
      <section className="px-5 pb-6 sm:px-8 lg:px-12">
        <div className="mx-auto grid max-w-6xl gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* Contact Information */}
          <div className="space-y-5">
            <div>
              <h2 className="text-2xl font-extrabold">Get in Touch</h2>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                Choose your preferred way to reach BIO SITESS. Our contact
                information is provided below.
              </p>
            </div>

            {contactDetails.map((item) => {
              const Icon = item.icon;

              return (
                <a
                  key={item.title}
                  href={item.href}
                  target={item.title === "Visit Us" ? "_blank" : undefined}
                  rel={item.title === "Visit Us" ? "noreferrer" : undefined}
                  className="flex gap-4 rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-400 hover:shadow-lg dark:border-[#29435f] dark:bg-[#132942]"
                >
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                    <Icon size={22} />
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-bold">{item.title}</h3>
                    <p className="mt-2 break-words text-sm leading-6 text-slate-600 dark:text-slate-300">
                      {item.value}
                    </p>
                  </div>
                </a>
              );
            })}

            <div className="rounded-2xl border border-slate-200 bg-cyan-50 p-5 dark:border-[#29435f] dark:bg-[#132942]">
              <div className="flex items-center gap-3">
                <Clock size={21} className="text-cyan-600 dark:text-cyan-300" />
                <h3 className="font-bold">Need Help?</h3>
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">
                For assistance with your digital profile, account or
                platform-related questions, contact us through email or phone.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-xl dark:border-[#29435f] dark:bg-[#132942] sm:p-9">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-cyan-400/15 text-cyan-600 dark:text-cyan-300">
                <MessageCircle size={23} />
              </div>

              <div>
                <h2 className="text-2xl font-extrabold">Send Us a Message</h2>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  Fill in the details below.
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  maxLength={100}
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 dark:border-[#29435f] dark:bg-[#0b1b30]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  maxLength={254}
                  value={form.email}
                  onChange={handleChange}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 dark:border-[#29435f] dark:bg-[#0b1b30]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  required
                  maxLength={200}
                  value={form.subject}
                  onChange={handleChange}
                  placeholder="What is your inquiry about?"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 dark:border-[#29435f] dark:bg-[#0b1b30]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-semibold">
                  Your Message
                </label>
                <textarea
                  name="message"
                  required
                  rows={5}
                  maxLength={5000}
                  value={form.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3.5 text-sm outline-none transition focus:border-cyan-400 focus:ring-2 focus:ring-cyan-400/20 dark:border-[#29435f] dark:bg-[#0b1b30]"
                />
              </div>

              <button
                type="submit"
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-400 px-6 py-4 text-sm font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/15 transition hover:bg-cyan-300 active:scale-[0.98]"
              >
                Send Message
                <Send size={17} />
              </button>

              <p className="text-center text-xs leading-6 text-slate-500 dark:text-slate-400">
                Your default email application will open with your message
                prepared for BIO SITESS support.
              </p>
            </form>
          </div>
        </div>
      </section>
    </main>
  );
}
