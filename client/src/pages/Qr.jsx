
import React, { useState } from "react";
import {
  Copy,
  Check,
  Download,
  Link2,
  Globe,
  MessageSquare,
  ScanLine,
  Loader2,
  Sparkles,
  ShieldCheck,
  AlertCircle,
  Lock,
  ArrowUpRight,
  QrCode,
  CreditCard,
  UserRound,
} from "lucide-react";

const Qr = () => {
  const [copiedField, setCopiedField] = useState(null);
  const [standeeCode, setStandeeCode] = useState("");
  const [standeeActivated, setStandeeActivated] = useState(false);
  const [downloading, setDownloading] = useState(false);

  const directCardLink =
    "https://digital-eight-liart.vercel.app/card/ankits-business";

  const customSubdomain = "https://ankit-business.yourdomain.com";

  /* ==================== COPY LINK ==================== */

  const handleCopy = async (text, field) => {
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const input = document.createElement("textarea");
        input.value = text;
        input.style.position = "fixed";
        input.style.opacity = "0";

        document.body.appendChild(input);
        input.select();

        const success = document.execCommand("copy");
        document.body.removeChild(input);

        if (!success) throw new Error("Copy failed");
      }

      setCopiedField(field);
      setTimeout(() => setCopiedField(null), 2000);
    } catch (error) {
      console.error("Unable to copy link:", error);
    }
  };

  /* ==================== DOWNLOAD QR ==================== */

  const handleDownloadQR = async () => {
    setDownloading(true);

    try {
      const qrUrl =
        `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
          directCardLink
        )}&bgcolor=ffffff&color=000000&margin=20`;

      const response = await fetch(qrUrl);

      if (!response.ok) {
        throw new Error("QR code download failed");
      }

      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const anchor = document.createElement("a");

      anchor.href = url;
      anchor.download = "ankits-business-qr.png";
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();

      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (error) {
      console.error("QR download failed:", error);
      window.open(
        `https://api.qrserver.com/v1/create-qr-code/?size=1000x1000&data=${encodeURIComponent(
          directCardLink
        )}`,
        "_blank",
        "noopener,noreferrer"
      );
    } finally {
      setDownloading(false);
    }
  };

  /* ==================== DOWNLOAD VCARD ==================== */

  const handleDownloadVCard = () => {
    const vCard = [
      "BEGIN:VCARD",
      "VERSION:3.0",
      "FN:ankit",
      "ORG:ankit's Business",
      "TEL:+91 8956235689",
      "EMAIL:ankit123@gmail.com",
      `URL:${directCardLink}`,
      "ADR:;;Mumbai, Maharashtra;;400001;India",
      "END:VCARD",
    ].join("\r\n");

    const blob = new Blob([vCard], {
      type: "text/vcard;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = url;
    anchor.download = "ankits-business.vcf";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();

    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };

  /* ==================== WHATSAPP SHARE ==================== */

  const handleWhatsAppShare = () => {
    const message =
      `Check out my Mini Website Card!\n\n${directCardLink}\n\n` +
      "Visit my digital business card for more information.";

    window.open(
      `https://wa.me/?text=${encodeURIComponent(message)}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  /* ==================== STANDEE ==================== */

  const handleActivateStandee = () => {
    if (!standeeCode.trim() || standeeActivated) return;

    // Demo-only activation; replace with a backend API when available.
    setStandeeActivated(true);
  };

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

        <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-cyan-300/20 bg-[#132942]">
              <QrCode size={23} className="text-cyan-300" />
            </div>

            <div>
              <div className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.22em] text-cyan-300">
                Digital identity
              </div>

              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Share Your Mini Website
              </h1>

              <p className="mt-2 max-w-xl text-xs leading-6 text-slate-400 sm:text-sm">
                Share your business card online, download your QR code,
                and help customers connect with your business.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.98] sm:self-center"
          >
            <MessageSquare size={15} />
            Share Website
            <ArrowUpRight size={14} />
          </button>
        </header>

        {/* ==================== ACTIVATION BANNER ==================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-[#38516e] bg-[#10243b]">
          <div className="h-1 bg-gradient-to-r from-cyan-300 via-blue-400 to-cyan-300" />

          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3.5">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-amber-300/20 bg-amber-300/10">
                <AlertCircle size={20} className="text-amber-300" />
              </div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-sm font-bold text-white">
                    Card Activation Pending
                  </h2>

                  <span className="rounded-md border border-amber-300/20 bg-amber-300/[0.08] px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-amber-200">
                    Demo mode
                  </span>
                </div>

                <p className="mt-1.5 text-xs leading-6 text-slate-400">
                  One-time payment of ₹499 is shown for activation.
                  Confirm payment status before enabling live services.
                </p>

                <p className="mt-1 text-[11px] text-slate-500">
                  Validity and wallet benefits depend on your selected plan.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                window.alert(
                  "Demo mode: connect your payment gateway to activate this card."
                )
              }
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-cyan-300/20 bg-[#193754] px-4 py-3 text-xs font-bold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-[#21415f] active:scale-[0.98]"
            >
              <Sparkles size={14} />
              Pay ₹499 & Activate
            </button>
          </div>
        </section>

        {/* ==================== BUSINESS LINKS ==================== */}

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LinkCard
            icon={Link2}
            label="Direct Card Link"
            description="Your public business card URL"
            value={directCardLink}
            copied={copiedField === "direct"}
            onCopy={() => handleCopy(directCardLink, "direct")}
            tag="Direct access"
          />

          <LinkCard
            icon={Globe}
            label="Custom Subdomain"
            description="Your branded business URL"
            value={customSubdomain}
            copied={copiedField === "subdomain"}
            onCopy={() => handleCopy(customSubdomain, "subdomain")}
            tag="Preview"
          />
        </section>

        {/* ==================== QR CODE WORKSPACE ==================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b] shadow-2xl shadow-black/10">
          <div className="flex items-center justify-between gap-3 border-b border-[#29435f] px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-base font-bold text-white">
                Your Business QR Code
              </h2>

              <p className="mt-1 text-xs text-slate-400">
                Scan to open your digital business card.
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
              <ScanLine size={19} className="text-cyan-300" />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_0.85fr]">
            {/* QR Preview */}

            <div className="flex flex-col items-center justify-center border-b border-[#29435f] bg-[#0b1b30]/50 p-6 sm:p-8 lg:border-b-0 lg:border-r">
              <div className="mb-5 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754] text-lg font-bold text-cyan-200">
                  A
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    ankit's Business
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Digital business card
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#38516e] bg-white p-3 shadow-xl shadow-black/20">
                <img
                  src={`https://api.qrserver.com/v1/create-qr-code/?size=400x400&data=${encodeURIComponent(
                    directCardLink
                  )}&bgcolor=ffffff&color=000000&margin=10`}
                  alt="QR code for ankit's Business"
                  className="h-52 w-52 sm:h-60 sm:w-60"
                />
              </div>

              <div className="mt-4 flex items-center gap-2 rounded-full border border-amber-300/20 bg-amber-300/[0.07] px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
                <span className="text-[10px] font-semibold text-amber-200">
                  Activation pending
                </span>
              </div>

              <p className="mt-3 max-w-xs text-center text-[11px] leading-5 text-slate-500">
                Scan the QR code using a phone camera to open the configured
                business link.
              </p>
            </div>

            {/* QR Actions */}

            <div className="flex flex-col justify-center p-5 sm:p-7">
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-300">
                QR code tools
              </span>

              <h3 className="mt-2 text-lg font-bold text-white">
                Share your business anywhere
              </h3>

              <p className="mt-2 text-xs leading-6 text-slate-400">
                Download a high-resolution QR code for packaging, business
                cards, shop counters, or promotional material.
              </p>

              <div className="mt-6 space-y-3">
                <button
                  type="button"
                  onClick={() => handleCopy(directCardLink, "qrlink")}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#38516e] bg-[#0b1b30] p-4 text-left transition hover:border-cyan-300/40 hover:bg-[#132942]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10">
                      {copiedField === "qrlink" ? (
                        <Check size={17} className="text-cyan-300" />
                      ) : (
                        <Copy size={17} className="text-cyan-300" />
                      )}
                    </span>

                    <span>
                      <span className="block text-xs font-bold text-white">
                        {copiedField === "qrlink"
                          ? "Link copied"
                          : "Copy card link"}
                      </span>

                      <span className="mt-1 block text-[10px] text-slate-400">
                        Copy your website address
                      </span>
                    </span>
                  </span>

                  <ArrowUpRight size={15} className="text-slate-500" />
                </button>

                <button
                  type="button"
                  onClick={handleDownloadQR}
                  disabled={downloading}
                  className="flex w-full items-center justify-between gap-3 rounded-xl bg-cyan-300 p-4 text-left text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#0b1b30]/10">
                      {downloading ? (
                        <Loader2 size={17} className="animate-spin" />
                      ) : (
                        <Download size={17} />
                      )}
                    </span>

                    <span>
                      <span className="block text-xs font-bold">
                        {downloading ? "Preparing download..." : "Download QR code"}
                      </span>

                      <span className="mt-1 block text-[10px] text-[#0b1b30]/70">
                        High-resolution PNG image
                      </span>
                    </span>
                  </span>

                  <ArrowUpRight size={15} />
                </button>

                <button
                  type="button"
                  onClick={handleWhatsAppShare}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#38516e] bg-[#0b1b30] p-4 text-left transition hover:border-cyan-300/40 hover:bg-[#132942]"
                >
                  <span className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-cyan-300/10">
                      <MessageSquare size={17} className="text-cyan-300" />
                    </span>

                    <span>
                      <span className="block text-xs font-bold text-white">
                        Share on WhatsApp
                      </span>

                      <span className="mt-1 block text-[10px] text-slate-400">
                        Send your business card to customers
                      </span>
                    </span>
                  </span>

                  <ArrowUpRight size={15} className="text-slate-500" />
                </button>
              </div>

              <div className="mt-5 flex items-start gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30]/70 p-3">
                <ShieldCheck
                  size={15}
                  className="mt-0.5 shrink-0 text-cyan-300"
                />

                <p className="text-[10px] leading-5 text-slate-400">
                  Anyone with your public link may be able to access your
                  business card. Verify that your URL is correct before
                  printing or distributing the QR code.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ==================== STANDEE ACTIVATION ==================== */}

        <section className="mb-6 overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b]">
          <div className="border-b border-[#29435f] p-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
                <ScanLine size={20} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Physical Counter Standee
                </h2>

                <p className="mt-1 text-xs text-slate-400">
                  Connect your physical standee to your business card.
                </p>
              </div>
            </div>
          </div>

          <div className="p-5 sm:p-6">
            {standeeActivated ? (
              <div className="flex items-start gap-3 rounded-xl border border-cyan-300/20 bg-cyan-300/[0.06] p-4">
                <Check size={18} className="mt-0.5 text-cyan-300" />

                <div>
                  <h3 className="text-sm font-bold text-white">
                    Demo activation complete
                  </h3>

                  <p className="mt-1 text-xs leading-5 text-slate-400">
                    Code {standeeCode} has been marked activated in this
                    session. A backend connection is required for actual
                    standee verification.
                  </p>
                </div>
              </div>
            ) : (
              <>
                <label
                  htmlFor="standee-code"
                  className="mb-2 block text-xs font-semibold text-slate-300"
                >
                  Standee alphanumeric code
                </label>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <input
                    id="standee-code"
                    type="text"
                    value={standeeCode}
                    onChange={(e) =>
                      setStandeeCode(e.target.value.toUpperCase())
                    }
                    placeholder="E.g. XR-1001"
                    className="min-w-0 flex-1 rounded-xl border border-[#29435f] bg-[#0b1b30] px-4 py-3 font-mono text-sm font-semibold tracking-wider text-white outline-none transition placeholder:text-slate-500 focus:border-cyan-300/60 focus:ring-2 focus:ring-cyan-300/[0.08]"
                  />

                  <button
                    type="button"
                    onClick={handleActivateStandee}
                    disabled={!standeeCode.trim()}
                    className="inline-flex min-h-11 items-center justify-center gap-2 rounded-xl bg-cyan-300 px-5 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Check size={14} />
                    Activate Standee
                  </button>
                </div>

                <p className="mt-3 text-[11px] leading-5 text-slate-500">
                  Demo only: this action currently updates local component
                  state. Connect the standee verification API before using it
                  for real activations.
                </p>
              </>
            )}
          </div>
        </section>

        {/* ==================== VCARD DOWNLOAD ==================== */}

        <section className="overflow-hidden rounded-2xl border border-[#29435f] bg-[#10243b]">
          <div className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between sm:p-6">
            <div className="flex items-start gap-3">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
                <UserRound size={20} className="text-cyan-300" />
              </div>

              <div>
                <h2 className="text-sm font-bold text-white">
                  Download Contact Card
                </h2>

                <p className="mt-1 max-w-lg text-xs leading-6 text-slate-400">
                  Download a vCard contact file containing the configured
                  business name, phone, email, address, and website.
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleDownloadVCard}
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#38516e] bg-[#132942] px-4 py-3 text-xs font-bold text-slate-200 transition hover:border-cyan-300/40 hover:bg-[#193754] hover:text-cyan-200 active:scale-[0.98]"
            >
              <Download size={15} />
              Download .VCF
            </button>
          </div>

          <div className="flex items-center gap-2 border-t border-[#29435f] bg-[#0b1b30]/50 px-5 py-3 sm:px-6">
            <CreditCard size={14} className="shrink-0 text-slate-500" />

            <p className="text-[10px] leading-5 text-slate-500">
              Check your contact details before sharing. The details in this
              demo are hardcoded and should be replaced with saved business
              profile information.
            </p>

            <Lock size={13} className="ml-auto shrink-0 text-slate-500" />
          </div>
        </section>
      </div>
    </main>
  );
};

/* ==================== REUSABLE LINK CARD ==================== */

const LinkCard = ({
  icon: Icon,
  label,
  description,
  value,
  copied,
  onCopy,
  tag,
}) => (
  <section className="min-w-0 rounded-2xl border border-[#29435f] bg-[#10243b] p-5 transition hover:border-cyan-300/25">
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex min-w-0 items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-cyan-300/15 bg-[#193754]">
          <Icon size={18} className="text-cyan-300" />
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-bold text-white">{label}</h2>
          <p className="mt-1 text-[11px] text-slate-400">{description}</p>
        </div>
      </div>

      <span className="shrink-0 rounded-md border border-[#38516e] bg-[#0b1b30] px-2 py-1 text-[9px] font-semibold text-slate-300">
        {tag}
      </span>
    </div>

    <div className="flex min-w-0 items-center gap-2 rounded-xl border border-[#29435f] bg-[#0b1b30] p-2">
      <input
        type="text"
        readOnly
        value={value}
        aria-label={label}
        onFocus={(e) => e.target.select()}
        className="min-w-0 flex-1 bg-transparent px-2 py-2 font-mono text-[11px] text-cyan-100 outline-none"
      />

      <button
        type="button"
        onClick={onCopy}
        aria-label={copied ? "Copied" : `Copy ${label}`}
        className="inline-flex shrink-0 items-center justify-center gap-1.5 rounded-lg border border-[#38516e] bg-[#132942] px-3 py-2.5 text-[10px] font-bold text-slate-200 transition hover:border-cyan-300/40 hover:bg-[#193754] hover:text-cyan-200 active:scale-95"
      >
        {copied ? (
          <>
            <Check size={12} className="text-cyan-300" />
            Copied
          </>
        ) : (
          <>
            <Copy size={12} />
            Copy
          </>
        )}
      </button>
    </div>
  </section>
);

export default Qr;
