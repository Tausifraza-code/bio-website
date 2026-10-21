import { useState } from "react";
import { Link } from "react-router-dom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";

import "swiper/css";
import "swiper/css/pagination";
import {
  ArrowRight,
  ArrowUpRight,
  QrCode,
  ContactRound,
  ShoppingBag,
  Share2,
  Link2,
  MessageSquareText,
} from "lucide-react";

const services = [
  {
    title: "Digital Visiting Card",
    description:
      "Create a professional digital identity with your profile, business details, contact information and social links.",
    image:
      "https://i.pinimg.com/1200x/95/a8/db/95a8dbbdd019c31cc92b4a51d54456c9.jpg?auto=format&fit=crop&w=900&q=85",
    icon: ContactRound,
    color: "bg-[#dceff4]",
  },
  {
    title: "Instant QR Code",
    description:
      "Let customers discover your business instantly. Make your digital profile easy to access and share with a scan.",
    image:
      "https://cdn.prod.website-files.com/617ac0d059899a9a3c8216e9/69a0e1a58da2929e1cb6fd2c_70fc5a7167d2f44f9acd0c235c509c83_Carousel_Widget_880px.avif?auto=format&fit=crop&w=900&q=85",
    icon: QrCode,
    color: "bg-[#dceff4]",
  },
  {
    title: "1-Tap Save Contact",
    description:
      "Help customers save your contact details directly to their phones with a convenient downloadable contact card.",
    image:
      "https://i.pinimg.com/736x/9d/74/b3/9d74b36bb762576f4e6a86a469a4fcbc.jpg?auto=format&fit=crop&w=900&q=85",
    icon: ContactRound,
    color: "bg-[#e4eaf5]",
  },
  {
    title: "Products & Services",
    description:
      "Showcase your products, services, prices and offers in one organised mini website that customers can browse.",
    image:
      "https://i.pinimg.com/736x/7b/51/22/7b5122ca12037fd94a1fad87bd61b4c5.jpg?auto=format&fit=crop&w=900&q=85",
    icon: ShoppingBag,
    color: "bg-[#f1e8dc]",
  },
  {
    title: "Social & Trust Hub",
    description:
      "Bring your social profiles and important business links together so customers can connect with you easily.",
    image:
      "https://i.pinimg.com/736x/a3/b3/3c/a3b33c1cd7b876b66a17997f0c04a7af.jpg?auto=format&fit=crop&w=900&q=85",
    icon: Share2,
    color: "bg-[#e3e9f1]",
  },
  {
    title: "Lead Capture System",
    description:
      "Make it easier for potential customers to reach out, start conversations and enquire about your services.",
    image:
      "https://i.pinimg.com/736x/bf/b7/bc/bfb7bc09c3eb1a7267d0e31541723135.jpg?auto=format&fit=crop&w=900&q=85",
    icon: MessageSquareText,
    color: "bg-[#e6eee9]",
  },
  {
    title: "One Smart Link",
    description:
      "Share one memorable link that brings your professional identity, services and contact options together.",
    image:
      "https://i.pinimg.com/1200x/d8/72/6e/d8726ea073d5d35ac53c883f6b65debd.jpg?auto=format&fit=crop&w=900&q=85",
    icon: Link2,
    color: "bg-[#e4edf5]",
  },
];

function ServiceCard({ service, active, onMouseEnter, onMouseLeave }) {
  return (
    <article
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      className="h-full w-full min-w-0 overflow-hidden rounded-3xl border border-[#d7e3eb] bg-white dark:border-[#29435f] dark:bg-[#132942]"
    >
      <div
        className={`relative overflow-hidden transition-[height] duration-500 ease-in-out ${
          active
            ? "h-[165px] sm:h-[190px] lg:h-[170px]"
            : "h-[230px] sm:h-[280px] lg:h-[310px]"
        }`}
      >
        <img
          src={service.image}
          alt={service.title}
          loading="lazy"
          className="h-full w-full object-cover object-center"
        />
      </div>

      <div className="flex flex-col p-5 sm:p-5 lg:p-6">
        <div className="flex items-center justify-between gap-3">
          <h3 className="min-w-0 break-words text-base font-bold leading-snug text-[#0b1b30] dark:text-white  sm:text-lg">
            {service.title}
          </h3>

          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#f1f6f9] text-[#0891b2] dark:bg-[#0b1b30] dark:text-[#22d3ee]">
            <ArrowUpRight size={19} />
          </span>
        </div>

        <div
          className={`grid transition-[grid-template-rows,opacity,margin] duration-500 ease-in-out ${
            active
              ? "mt-3 grid-rows-[1fr] opacity-100"
              : "mt-3 grid-rows-[1fr] opacity-100 sm:mt-0 sm:grid-rows-[0fr] sm:opacity-0"
          }`}
        >
          <div className="overflow-hidden">
            <p className="text-sm leading-6 text-[#64748b] dark:text-[#94a3b8] sm:text-base">
              {service.description}
            </p>

            <a
              href="/register"
              className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#0891b2] hover:text-[#0e7490] dark:text-[#22d3ee]"
            >
              Get started <ArrowRight size={17} />
            </a>
          </div>
        </div>
      </div>
    </article>
  );
}

export default function BioServicesGallery() {
  const [activeCard, setActiveCard] = useState(null);

  return (
    <section
      id="services"
      aria-labelledby="bio-services-heading"
      className="relative overflow-hidden bg-[#eaf8f4] px-4 py-6 text-[#0b1b30] dark:bg-[#0b1b30] dark:text-white sm:px-6 sm:py-6 lg:py-6"
    >
      <div className="mx-auto w-full max-w-[1240px]">
        <header className="mb-8 text-center sm:mb-10 lg:mb-12">
          <p className="mb-3 text-[10px] font-bold uppercase tracking-[0.22em] text-[#0891b2] dark:text-[#22d3ee] sm:text-xs">
            Everything your business needs
          </p>

          <h2
            id="bio-services-heading"
            className="mx-auto max-w-3xl text-3xl font-extrabold leading-tight tracking-[-0.04em] text-[#0b1b30] dark:text-white sm:text-4xl lg:text-5xl"
          >
            Your business,{" "}
            <span className="text-[#0891b2] dark:text-[#22d3ee]">
              ready to connect.
            </span>
          </h2>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-[#64748b] dark:text-[#a5b4c7] sm:text-base sm:leading-7">
            Everything you need to showcase your identity, share your details
            and help customers connect with you — all in one place.
          </p>
        </header>

        <div className="w-full min-w-0 overflow-hidden px-4 sm:hidden">
          <Swiper
            modules={[Pagination]}
            slidesPerView={1}
            slidesPerGroup={1}
            spaceBetween={16}
            centeredSlides={false}
            pagination={{ clickable: true }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                spaceBetween: 16,
              },
            }}
            className="bio-services-slider !w-full !overflow-hidden !pb-10"
          >
            {services.map((service, index) => (
              <SwiperSlide key={service.title} className="!h-auto">
                <ServiceCard
                  service={service}
                  active={activeCard === index}
                  onMouseEnter={() => setActiveCard(index)}
                  onMouseLeave={() => setActiveCard(null)}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>

        <div className="hidden w-full min-w-0 grid-cols-2 gap-5 sm:grid lg:grid-cols-4">
          {services.map((service, index) => (
            <ServiceCard
              key={service.title}
              service={service}
              active={activeCard === index}
              onMouseEnter={() => setActiveCard(index)}
              onMouseLeave={() => setActiveCard(null)}
            />
          ))}

          <NextStepCard />
        </div>

        <div className="mt-4 sm:hidden">
          <NextStepCard />
        </div>
      </div>
    </section>
  );
}

function NextStepCard() {
  return (
    <Link
      to="/register"
      className="group relative flex min-h-[210px] flex-col justify-between overflow-hidden rounded-[24px] bg-[#0891b2] p-5 text-white transition duration-300 hover:bg-[#0e7490] sm:min-h-[260px] sm:p-6 lg:min-h-[300px]"
    >
      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/75 sm:text-xs">
        Your next step
      </span>

      <span className="text-2xl font-extrabold leading-tight tracking-tight sm:text-3xl">
        Create your
        <br />
        BIO website.
      </span>

      <span className="flex h-10 w-10 items-center justify-center self-end rounded-full bg-[#0b1b30] text-white transition-transform duration-300 group-hover:translate-x-1 group-hover:scale-105 sm:h-12 sm:w-12">
        <ArrowRight size={22} />
      </span>
    </Link>
  );
}
