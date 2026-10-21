
import React, { useState } from "react";
import {
  Gift,
  Copy,
  Check,
  MessageCircle,
  TrendingUp,
  Clock,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Link2,
  ChevronRight,
} from "lucide-react";

const Refer = () => {
  const [copied, setCopied] = useState(false);

  const referralLink =
    "https://digital-eight-liart.vercel.app/ref/ankit";

  /* ==================== COPY REFERRAL LINK ==================== */

  const handleCopy = async () => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const input = document.createElement("textarea");
        input.value = referralLink;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const success = document.execCommand("copy");
        document.body.removeChild(input);

        if (!success) {
          throw new Error("Copy failed");
        }
      }

      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error("Unable to copy referral link:", error);
    }
  };

  /* ==================== WHATSAPP SHARE ==================== */

  const handleWhatsAppShare = () => {
    const message =
      `Hey! 👋\n\n` +
      `I found this amazing platform to create a professional Mini Website Card for your business.\n\n` +
      `✨ Use my referral link to get started:\n` +
      `${referralLink}\n\n` +
      `You can create your own digital visiting card, share payments via UPI, and grow your business online! 🚀`;

    const whatsappUrl =
      `https://wa.me/?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  /* ==================== STATS ==================== */

  const stats = [
    {
      id: "total",
      label: "Total Referrals",
      value: "0",
      detail: "Businesses referred",
      icon: Users,
    },
    {
      id: "earned",
      label: "Rewards Earned",
      value: "₹0",
      detail: "0 active referrals",
      icon: TrendingUp,
    },
    {
      id: "pending",
      label: "Pending Activation",
      value: "0",
      detail: "Awaiting activation",
      icon: Clock,
    },
  ];

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

        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#132942] shadow-lg shadow-cyan-950/20">
              <Gift size={23} className="text-cyan-300" />
            </div>

            <div>
              <div className="mb-1.5 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                  Rewards & Growth
                </span>

                <span className="rounded-full border border-[#38516e] bg-[#132942] px-2.5 py-1 text-[10px] font-semibold text-slate-300">
                  Referral Program
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Refer & Earn
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Invite business owners, help them grow online, and earn
                rewards when they activate their mini website.
              </p>
            </div>
          </div>

          <div className="flex w-fit items-center gap-2 rounded-xl border border-[#29435f] bg-[#10243b] px-3.5 py-2.5">
            <ShieldCheck size={15} className="text-cyan-300" />
            <span className="text-xs font-medium text-slate-300">
              Your referral dashboard
            </span>
          </div>
        </header>

        {/* ==================== REWARD BANNER ==================== */}

        <section className="relative mb-6 overflow-hidden rounded-2xl border border-cyan-300/20 bg-gradient-to-r from-[#132942] via-[#10243b] to-[#132942]">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-300 to-blue-400" />

          <div className="absolute -right-16 -top-20 h-56 w-56 rounded-full bg-cyan-300/[0.06] blur-3xl" />

          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
                <Gift size={23} className="text-cyan-300" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-300">
                  Your referral reward
                </p>

                <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                  Earn ₹100 per activation
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400">
                  Refer a business that registers through your link and
                  activates its card to qualify for the advertised reward
                  or subscription extension.
                </p>
              </div>
            </div>

            <div className="flex shrink-0 items-center self-start rounded-xl border border-[#38516e] bg-[#0b1b30]/70 px-3.5 py-2.5 sm:self-center">
              <span className="text-xs font-semibold text-slate-200">
                Invite. Activate. Earn.
              </span>
            </div>
          </div>
        </section>

        {/* ==================== REFERRAL LINK CARD ==================== */}

        <section className="relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b] shadow-2xl shadow-black/10">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300" />

          <div className="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr]">
            {/* Left information panel */}

            <div className="relative flex flex-col justify-center border-b border-[#29435f] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#193754]">
                <Link2 size={26} className="text-cyan-300" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                Your personal invite
              </span>

              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                One link.
                <br />
                More opportunities.
              </h2>

              <p className="mt-3 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
                Share your unique referral link with shop owners,
                freelancers, and other businesses looking to build their
                online presence.
              </p>

              <div className="mt-6 space-y-3">
                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                    <Check size={13} />
                  </span>
                  Share your referral link
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                    <Check size={13} />
                  </span>
                  Invite businesses to register
                </div>

                <div className="flex items-center gap-3 text-xs text-slate-300">
                  <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-cyan-300/10 text-cyan-300">
                    <Check size={13} />
                  </span>
                  Earn eligible referral rewards
                </div>
              </div>
            </div>

            {/* Right link panel */}

            <div className="flex flex-col justify-center bg-[#0b1b30]/40 p-5 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <label
                  htmlFor="referral-link"
                  className="text-xs font-bold text-slate-200"
                >
                  Your referral link
                </label>

                <span className="flex items-center gap-1.5 text-[10px] font-semibold text-cyan-300">
                  <span className="h-1.5 w-1.5 rounded-full bg-cyan-300" />
                  Ready to share
                </span>
              </div>

              <div className="rounded-xl border border-[#38516e] bg-[#0b1b30] p-2">
                <input
                  id="referral-link"
                  type="text"
                  readOnly
                  value={referralLink}
                  onFocus={(e) => e.target.select()}
                  aria-label="Your referral link"
                  className="w-full bg-transparent px-2 py-2.5 font-mono text-xs text-cyan-100 outline-none"
                />

                <div className="mt-1 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#38516e] bg-[#132942] px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40 hover:bg-[#193754] hover:text-cyan-200 active:scale-[0.98]"
                  >
                    {copied ? (
                      <>
                        <Check size={15} className="text-cyan-300" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        Copy Referral Link
                      </>
                    )}
                  </button>

                  <button
                    type="button"
                    onClick={handleWhatsAppShare}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.98]"
                  >
                    <MessageCircle size={16} />
                    Share on WhatsApp
                    <ArrowUpRight
                      size={14}
                      className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                    />
                  </button>
                </div>
              </div>

              {copied && (
                <p className="mt-3 flex items-center gap-2 text-xs text-cyan-300">
                  <Check size={13} />
                  Referral link copied to clipboard.
                </p>
              )}

              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                The referral tracking and reward eligibility depend on
                your platform's referral system and activation rules.
              </p>
            </div>
          </div>
        </section>

        {/* ==================== STATISTICS ==================== */}

        <section className="mt-8">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">
              Referral Overview
            </h2>

            <p className="mt-1 text-xs text-slate-400">
              Track your referrals and rewards in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => {
              const Icon = stat.icon;

              return (
                <div
                  key={stat.id}
                  className="group relative overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b] p-5 transition duration-200 hover:border-cyan-300/30 hover:bg-[#132942]"
                >
                  <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-cyan-300/[0.04] blur-2xl transition group-hover:bg-cyan-300/[0.09]" />

                  <div className="relative flex items-start justify-between gap-3">
                    <div>
                      <p className="text-xs font-medium text-slate-400">
                        {stat.label}
                      </p>

                      <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                        {stat.value}
                      </p>

                      <p className="mt-2 text-[11px] text-slate-500">
                        {stat.detail}
                      </p>
                    </div>

                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754] transition group-hover:border-cyan-300/30">
                      <Icon size={20} className="text-cyan-300" />
                    </div>
                  </div>

                  <div className="relative mt-5 h-1 overflow-hidden rounded-full bg-[#29435f]">
                    <div className="h-full w-1/4 rounded-full bg-gradient-to-r from-cyan-300 to-blue-400 opacity-70" />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* ==================== REFERRED BUSINESSES ==================== */}

        <section className="mt-8 overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b]">
          <div className="flex flex-col gap-3 border-b border-[#29435f] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
                <Users size={19} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Referred Businesses
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Businesses that joined through your link.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-lg border border-[#38516e] bg-[#0b1b30] px-3 py-1.5 text-xs font-semibold text-slate-300">
              0 businesses
            </span>
          </div>

          <div className="px-5 py-12 text-center sm:px-8 sm:py-14">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-[#38516e] bg-[#132942]">
              <Users size={23} className="text-slate-400" />
            </div>

            <h3 className="mt-4 text-sm font-bold text-white">
              Your referral journey starts here
            </h3>

            <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
              You haven't referred any businesses yet. Share your link
              with business owners and your referral list can start
              growing here.
            </p>

            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="mt-5 inline-flex items-center gap-2 rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.98]"
            >
              <MessageCircle size={15} />
              Invite a Business
              <ChevronRight size={14} />
            </button>
          </div>
        </section>

        {/* ==================== FOOTER NOTE ==================== */}

        <p className="mt-6 text-center text-[10px] leading-5 text-slate-500">
          Referral counts and reward amounts shown here are currently
          static placeholders. Connect your referral API to display
          account-specific data.
        </p>
      </div>
    </main>
  );
};

export default Refer;
