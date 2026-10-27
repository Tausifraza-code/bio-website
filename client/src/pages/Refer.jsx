import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Gift,
  Copy,
  Check,
  MessageCircle,
  Clock,
  Users,
  ArrowUpRight,
  ShieldCheck,
  Link2,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  UserRound,
  Mail,
  CalendarDays,
  AlertCircle,
  Share2,
} from "lucide-react";
import {
  getMyReferrals,
  clearReferralError,
} from "../redux/slice/referSlice";

const Refer = () => {
  const dispatch = useDispatch();

  const {
    user,
    referrals = [],
    totalReferrals = 0,
    pagination,
    loading,
    error,
  } = useSelector((state) => state.referral);

  const [copied, setCopied] = useState(false);
  const [copyError, setCopyError] = useState("");
  const [page, setPage] = useState(1);

  const currentPage = pagination?.currentPage ?? 1;
  const totalPages = pagination?.totalPages ?? 0;
  const limit = pagination?.limit ?? 10;

  // Fetch referrals from backend
  useEffect(() => {
    dispatch(getMyReferrals({ page, limit: 10 }));
  }, [dispatch, page]);

  // Actual referral code from logged-in user's backend data
  const referralCode = user?.referralCode || "";

  // Update this path if your registration route is different
  const referralLink = useMemo(() => {
    if (!referralCode) return "";

    return `${window.location.origin}/register?referralCode=${encodeURIComponent(
      referralCode
    )}`;
  }, [referralCode]);

  // Copy referral link
  const handleCopy = async () => {
    if (!referralLink) {
      setCopyError("Your referral code is not available yet.");
      return;
    }

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(referralLink);
      } else {
        const input = document.createElement("textarea");
        input.value = referralLink;
        input.style.position = "fixed";
        input.style.left = "-9999px";
        input.style.top = "0";

        document.body.appendChild(input);
        input.focus();
        input.select();

        const success = document.execCommand("copy");
        document.body.removeChild(input);

        if (!success) {
          throw new Error("Copy failed");
        }
      }

      setCopied(true);
      setCopyError("");

      window.setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Unable to copy referral link:", err);
      setCopyError("Unable to copy the link. Please copy it manually.");
    }
  };

  // Share referral link on WhatsApp
  const handleWhatsAppShare = () => {
    if (!referralLink) {
      setCopyError("Your referral code is not available yet.");
      return;
    }

    const message =
      `Hey! 👋\n\n` +
      `Create your own professional digital business card and mini website.\n\n` +
      `Use my referral link to get started:\n${referralLink}\n\n` +
      `Build your online business presence today! 🚀`;

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  // Refresh current page
  const handleRefresh = () => {
    dispatch(clearReferralError());
    dispatch(getMyReferrals({ page, limit: 10 }));
  };

  // Pagination
  const handlePrevious = () => {
    if (currentPage > 1) {
      setPage(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      setPage(currentPage + 1);
    }
  };

  // Format registration date
  const formatDate = (date) => {
    if (!date) return "Date unavailable";

    const parsedDate = new Date(date);

    if (Number.isNaN(parsedDate.getTime())) {
      return "Date unavailable";
    }

    return parsedDate.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <main className="min-h-screen bg-transparent text-slate-200">
      <div className="mx-auto max-w-6xl px-3 py-6 sm:px-6 sm:py-9 lg:px-8">

        {/* Page header */}
        <header className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942] shadow-lg shadow-black/10">
              <Gift size={23} className="text-cyan-400" />
            </div>

            <div>
              <div className="mb-2 flex flex-wrap items-center gap-2">
                <span className="text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-400">
                  Community & Growth
                </span>

                <span className="rounded-full border border-[#29435f] bg-[#132942] px-2.5 py-1 text-[10px] font-semibold text-slate-400">
                  Referral Program
                </span>
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Refer & Share
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Invite business owners to create their digital presence and
                track the people who join using your referral link.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRefresh}
            disabled={loading}
            className="inline-flex w-fit items-center justify-center gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30] px-4 py-3 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              size={15}
              className={loading ? "animate-spin" : ""}
            />
            Refresh data
          </button>
        </header>

        {/* Referral link banner */}
        <section className="relative mb-7 overflow-hidden rounded-2xl border border-cyan-400/20 bg-gradient-to-r from-[#0b1b30] via-[#132942] to-[#0b1b30] shadow-xl shadow-black/20">
          <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-cyan-400 to-blue-500" />

          <div className="relative flex flex-col gap-5 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-7">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-cyan-400/10">
                <Share2 size={22} className="text-cyan-400" />
              </div>

              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-cyan-400">
                  Your personal invitation
                </p>

                <h2 className="mt-1.5 text-xl font-bold text-white sm:text-2xl">
                  Grow your network
                </h2>

                <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                  Share your unique link with shop owners, freelancers, and
                  businesses interested in creating a mini website.
                </p>
              </div>
            </div>

            <div className="flex w-fit items-center gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30]/80 px-3.5 py-2.5">
              <ShieldCheck size={16} className="text-cyan-400" />
              <span className="text-xs font-semibold text-slate-300">
                Personal referral link
              </span>
            </div>
          </div>
        </section>

        {/* Backend error */}
        {error && (
          <div className="mb-6 flex flex-col gap-3 rounded-xl border border-red-400/20 bg-red-400/5 p-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-3">
              <AlertCircle
                size={18}
                className="mt-0.5 shrink-0 text-red-400"
              />
              <div>
                <p className="text-sm font-semibold text-red-300">
                  Unable to load referral data
                </p>
                <p className="mt-1 break-words text-xs leading-5 text-slate-400">
                  {error}
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleRefresh}
              className="w-fit rounded-lg border border-red-400/20 px-3 py-2 text-xs font-semibold text-red-300 transition hover:bg-red-400/10"
            >
              Try again
            </button>
          </div>
        )}

        {/* Referral link card */}
        <section className="mb-8 overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] shadow-2xl shadow-black/20">
          <div className="h-1 w-full bg-gradient-to-r from-cyan-400 via-blue-500 to-cyan-400" />

          <div className="grid grid-cols-1 lg:grid-cols-[0.85fr_1.15fr]">
            {/* Left panel */}
            <div className="border-b border-[#29435f] p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-400/20 bg-[#132942]">
                <Link2 size={25} className="text-cyan-400" />
              </div>

              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-400">
                How it works
              </span>

              <h2 className="mt-2 text-xl font-bold text-white sm:text-2xl">
                One link.
                <br />
                Easy sharing.
              </h2>

              <p className="mt-3 max-w-sm text-xs leading-6 text-slate-400 sm:text-sm">
                Send your personal referral link to people who want to build
                their business presence online.
              </p>

              <div className="mt-6 space-y-4">
                {[
                  "Copy your personal referral link",
                  "Share it with business owners",
                  "Track registrations in your dashboard",
                ].map((item, index) => (
                  <div key={item} className="flex items-center gap-3">
                    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg border border-cyan-400/20 bg-cyan-400/10 text-xs font-bold text-cyan-400">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-slate-300">
                      {item}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right panel */}
            <div className="flex flex-col justify-center bg-[#132942]/40 p-5 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-3">
                <label
                  htmlFor="referral-link"
                  className="text-xs font-bold text-slate-200"
                >
                  Your referral link
                </label>

                <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan-400">
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      referralLink ? "animate-pulse bg-cyan-400" : "bg-slate-500"
                    }`}
                  />
                  {referralLink ? "Ready to share" : "Loading code"}
                </span>
              </div>

              <div className="rounded-xl border border-[#29435f] bg-[#0b1b30] p-2">
                <input
                  id="referral-link"
                  type="text"
                  readOnly
                  value={
                    referralLink ||
                    (loading
                      ? "Loading your referral link..."
                      : "Referral code unavailable")
                  }
                  onFocus={(event) => event.target.select()}
                  aria-label="Your referral link"
                  className="w-full min-w-0 bg-transparent px-2 py-3 font-mono text-xs text-cyan-400 outline-none sm:text-sm"
                />

                <div className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={handleCopy}
                    disabled={!referralLink}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-lg border border-[#38516e] bg-[#132942] px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-cyan-400/40 hover:bg-[#1a3658] hover:text-cyan-400 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {copied ? (
                      <>
                        <Check
                          size={15}
                          className="text-cyan-400"
                          strokeWidth={3}
                        />
                        Link Copied
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
                    disabled={!referralLink}
                    className="group inline-flex min-h-11 items-center justify-center gap-2 rounded-lg bg-cyan-400 px-4 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50"
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
                <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-cyan-400">
                  <Check size={13} strokeWidth={3} />
                  Referral link copied successfully.
                </p>
              )}

              {copyError && (
                <p className="mt-3 text-xs leading-5 text-red-300">
                  {copyError}
                </p>
              )}

              <p className="mt-4 text-[11px] leading-5 text-slate-500">
                Your referral code is loaded from your account information.
              </p>
            </div>
          </div>
        </section>

        {/* Referral overview - no earnings section */}
        <section className="mb-8">
          <div className="mb-4">
            <h2 className="text-base font-bold text-white">
              Referral Overview
            </h2>
            <p className="mt-1 text-xs text-slate-400">
              Your referral activity based on the latest backend data.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {/* Total referrals */}
            <div className="group rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold text-slate-400">
                    Total Referrals
                  </p>

                  <p className="mt-3 text-3xl font-bold tracking-tight text-white">
                    {loading && referrals.length === 0 ? (
                      <span className="inline-block h-9 w-14 animate-pulse rounded-lg bg-[#132942]" />
                    ) : (
                      totalReferrals
                    )}
                  </p>

                  <p className="mt-2 text-[11px] text-slate-500">
                    Registered through your referral
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                  <Users size={20} className="text-cyan-400" />
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#132942]">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500 opacity-80" />
              </div>
            </div>

            {/* Referral code */}
            <div className="group rounded-2xl border border-[#29435f] bg-[#0b1b30] p-5 transition hover:-translate-y-0.5 hover:border-cyan-400/30">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-400">
                    Your Referral Code
                  </p>

                  <p className="mt-3 break-all text-xl font-bold tracking-wide text-white">
                    {referralCode || (loading ? "Loading..." : "Unavailable")}
                  </p>

                  <p className="mt-2 text-[11px] text-slate-500">
                    Your unique account referral code
                  </p>
                </div>

                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                  <Gift size={20} className="text-cyan-400" />
                </div>
              </div>

              <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-[#132942]">
                <div className="h-full w-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-400 opacity-80" />
              </div>
            </div>
          </div>
        </section>

        {/* Referred businesses */}
        <section className="overflow-hidden rounded-2xl border border-[#29435f] bg-[#0b1b30] shadow-xl shadow-black/20">
          <div className="flex flex-col gap-3 border-b border-[#29435f] p-5 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                <Users size={19} className="text-cyan-400" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Referred Businesses
                </h2>
                <p className="mt-1 text-xs text-slate-400">
                  People who registered through your referral link.
                </p>
              </div>
            </div>

            <span className="w-fit rounded-lg border border-[#29435f] bg-[#132942] px-3 py-1.5 text-xs font-semibold text-slate-300">
              {totalReferrals} {totalReferrals === 1 ? "referral" : "referrals"}
            </span>
          </div>

          {loading && referrals.length === 0 ? (
            <div className="space-y-3 p-5 sm:p-6">
              {[1, 2, 3].map((item) => (
                <div
                  key={item}
                  className="flex animate-pulse items-center gap-4 rounded-xl border border-[#29435f]/70 p-4"
                >
                  <div className="h-11 w-11 rounded-xl bg-[#132942]" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 rounded bg-[#132942]" />
                    <div className="h-3 w-1/2 rounded bg-[#132942]" />
                  </div>
                </div>
              ))}
            </div>
          ) : referrals.length > 0 ? (
            <>
              {/* Desktop table */}
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[600px] text-left">
                  <thead>
                    <tr className="border-b border-[#29435f] bg-[#132942]/50">
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Business / User
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Email Address
                      </th>
                      <th className="px-6 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                        Registration Date
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {referrals.map((referral, index) => (
                      <tr
                        key={referral.userId || referral._id || index}
                        className="border-b border-[#29435f]/60 transition last:border-b-0 hover:bg-[#132942]/40"
                      >
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                              <UserRound
                                size={17}
                                className="text-cyan-400"
                              />
                            </div>

                            <span className="text-sm font-semibold text-slate-200">
                              {referral.fullName || "Unnamed User"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <Mail
                              size={14}
                              className="shrink-0 text-slate-500"
                            />
                            <span className="break-all">
                              {referral.email || "Email unavailable"}
                            </span>
                          </div>
                        </td>

                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2 text-xs text-slate-400">
                            <CalendarDays
                              size={14}
                              className="shrink-0 text-slate-500"
                            />
                            {formatDate(referral.registeredAt)}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile cards */}
              <div className="space-y-3 p-4 md:hidden">
                {referrals.map((referral, index) => (
                  <div
                    key={referral.userId || referral._id || index}
                    className="rounded-xl border border-[#29435f] bg-[#10233a]/70 p-4"
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-400/20 bg-[#132942]">
                        <UserRound size={19} className="text-cyan-400" />
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="break-words text-sm font-bold text-white">
                          {referral.fullName || "Unnamed User"}
                        </p>

                        <p className="mt-1 break-all text-xs leading-5 text-slate-400">
                          {referral.email || "Email unavailable"}
                        </p>
                      </div>
                    </div>

                    <div className="mt-4 flex items-center gap-2 border-t border-[#29435f]/70 pt-3 text-xs text-slate-500">
                      <CalendarDays size={14} className="text-cyan-400" />
                      Registered: {formatDate(referral.registeredAt)}
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex flex-col gap-3 border-t border-[#29435f] px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <p className="text-xs text-slate-500">
                  Page {currentPage} of {Math.max(totalPages, 1)}
                  <span className="mx-2 text-slate-700">•</span>
                  {totalReferrals} total referrals
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={handlePrevious}
                    disabled={currentPage <= 1 || loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ChevronLeft size={15} />
                    Previous
                  </button>

                  <button
                    type="button"
                    onClick={handleNext}
                    disabled={currentPage >= totalPages || loading}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-[#29435f] bg-[#132942] px-3 py-2 text-xs font-semibold text-slate-300 transition hover:border-cyan-400/40 hover:text-cyan-400 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Next
                    <ChevronRight size={15} />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="px-5 py-12 text-center sm:px-8 sm:py-16">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-[#38516e] bg-[#132942]">
                {error ? (
                  <AlertCircle size={26} className="text-red-400" />
                ) : (
                  <Users size={26} className="text-slate-500" />
                )}
              </div>

              <h3 className="mt-5 text-base font-bold text-white">
                {error
                  ? "Referral data could not be loaded"
                  : "Your referral journey starts here"}
              </h3>

              <p className="mx-auto mt-2 max-w-md text-xs leading-6 text-slate-400">
                {error
                  ? "Please try refreshing your referral data."
                  : "You haven't referred any users yet. Share your personal link to start growing your referral network."}
              </p>

              {error ? (
                <button
                  type="button"
                  onClick={handleRefresh}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-300"
                >
                  <RefreshCw size={15} />
                  Try again
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  disabled={!referralLink}
                  className="mt-6 inline-flex items-center gap-2 rounded-xl bg-cyan-400 px-5 py-3 text-xs font-bold text-[#0b1b30] shadow-lg shadow-cyan-400/10 transition hover:bg-cyan-300 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <MessageCircle size={16} />
                  Invite a Business
                  <ArrowUpRight size={14} />
                </button>
              )}
            </div>
          )}
        </section>

        {/* Footer */}
        <p className="mt-6 text-center text-[10px] leading-5 text-slate-500">
          Referral details are retrieved from your account. Only registrations
          returned by the referral API are displayed here.
        </p>
      </div>
    </main>
  );
};

export default Refer;