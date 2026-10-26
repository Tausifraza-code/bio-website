import React, { useEffect, useRef, useState } from "react";
import { Html5Qrcode } from "html5-qrcode";
import QRCode from "qrcode";

import { useDispatch, useSelector } from "react-redux";
import {
  bindPhysicalQR,
  clearQRMessages,
  fetchMyBoundQR,
} from "../redux/slice/qrSlice";
import {
  Copy,
  Check,
  Download,
  Link2,
  Globe,
  MessageSquare,
  ScanLine,
  Loader2,
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
  const [qrImage, setQrImage] = useState("");
  const [decodedQRUrl, setDecodedQRUrl] = useState("");
  const [qrPath, setQrPath] = useState("");
  const [scannerOpen, setScannerOpen] = useState(false);
  const [qrBusy, setQrBusy] = useState(false);
  const [qrMessage, setQrMessage] = useState("");
  const scannerRef = useRef(null);
  const scannerInstanceRef = useRef(null);
  const dispatch = useDispatch();

  const { boundQR, binding, fetching, successMessage, error } = useSelector(
    (state) => state.qr,
  );

  const directCardLink = boundQR?.subdomain
    ? `${window.location.origin}/card-preview/${encodeURIComponent(
        boundQR.subdomain,
      )}`
    : "";

  const customSubdomain = boundQR?.subdomain
    ? `${window.location.origin}/card-preview/${encodeURIComponent(
        boundQR.subdomain,
      )}`
    : "";

  const apiBaseUrl =
    import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
  const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");
  const businessName =
    boundQR?.businessName || boundQR?.subdomain || "Your Business";
  const qrPublicUrl = boundQR?.qrPath
    ? `${backendOrigin}${boundQR.qrPath}`
    : "";
  const profileUrl = boundQR?.subdomain
    ? `${window.location.origin}/card-preview/${encodeURIComponent(
        boundQR.subdomain,
      )}`
    : "";
  const whatsappMessage =
    `Check out my ${businessName} Mini Website Card! ` +
    `${qrPublicUrl} Visit my digital business card for more information.`;
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    whatsappMessage,
  )}`;

  useEffect(() => {
    dispatch(fetchMyBoundQR());

    return () => {
      dispatch(clearQRMessages());
    };
  }, [dispatch]);

  useEffect(() => {
    let cancelled = false;

    async function generateQRImage() {
      if (!qrPublicUrl) {
        setQrImage("");
        return;
      }

      try {
        const image = await QRCode.toDataURL(qrPublicUrl, {
          width: 1000,
          margin: 2,
          errorCorrectionLevel: "H",
        });

        if (!cancelled) setQrImage(image);
      } catch (error) {
        console.error("QR image generation failed:", error);
        if (!cancelled) setQrImage("");
      }
    }

    generateQRImage();

    return () => {
      cancelled = true;
    };
  }, [qrPublicUrl]);

  useEffect(
    () => () => {
      const scanner = scannerInstanceRef.current;

      if (!scanner) return;

      void scanner
        .stop()
        .catch((error) => {
          console.error("Unable to stop QR scanner during cleanup:", error);
        })
        .finally(() => {
          try {
            scanner.clear();
          } catch (error) {
            console.error("Unable to clear QR scanner during cleanup:", error);
          }
        });
    },
    [],
  );

  const handleDecodedQR = (decodedText) => {
    try {
      const parsed = new URL(decodedText);
      console.log("Decoded QR URL:", decodedText);
      console.log("Decoded pathname:", parsed.pathname);

      if (!["http:", "https:"].includes(parsed.protocol)) {
        throw new Error("Unsupported QR URL protocol.");
      }

      const existingPath = parsed.pathname.replace(/\/+$/, "");

      if (!existingPath || existingPath === "/") {
        throw new Error("The QR URL does not contain an existing path.");
      }

      setDecodedQRUrl(decodedText);
      setQrPath(existingPath);
      setQrMessage(
        "QR decoded successfully. Verify the original URL before binding.",
      );
    } catch (error) {
      setQrMessage(
        error instanceof Error
          ? error.message
          : "Unable to read a valid QR URL.",
      );
    }
  };

  const startQRScanner = async () => {
    if (!scannerRef.current || scannerInstanceRef.current) return;

    setQrMessage("");

    const scanner = new Html5Qrcode(scannerRef.current.id);
    scannerInstanceRef.current = scanner;

    try {
      await scanner.start(
        { facingMode: "environment" },
        { fps: 10, qrbox: { width: 240, height: 240 } },
        async (decodedText) => {
          handleDecodedQR(decodedText);

          try {
            await scanner.stop();
            scanner.clear();
          } catch (error) {
            console.error("Unable to stop QR scanner after decoding:", error);
            setQrMessage(
              "QR decoded, but the camera could not be stopped cleanly.",
            );
          }

          scannerInstanceRef.current = null;
          setScannerOpen(false);
        },
        () => {},
      );

      setScannerOpen(true);
    } catch (error) {
      console.error("QR camera could not start:", error);

      try {
        scanner.clear();
      } catch (cleanupError) {
        console.error(
          "Unable to clear QR scanner after startup failure:",
          cleanupError,
        );
      }

      scannerInstanceRef.current = null;
      setQrMessage(
        "Camera could not start. Allow camera access or upload a QR image.",
      );
    }
  };

  const handleQRImageUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setQrBusy(true);
    setQrMessage("");

    let scanner;

    try {
      scanner = new Html5Qrcode("qr-file-reader");

      const decodedText = await scanner.scanFile(file, true);
      handleDecodedQR(decodedText);
    } catch (error) {
      console.error("Unable to decode uploaded QR image:", error);
      setQrMessage("Could not decode this image. Try a clearer QR photo.");
    } finally {
      if (scanner) {
        try {
          scanner.clear();
        } catch (error) {
          console.error("Unable to clear uploaded QR scanner:", error);
          setQrMessage(
            "QR image was processed, but its reader could not be cleared.",
          );
        }
      }

      setQrBusy(false);
      event.target.value = "";
    }
  };

  const stopQRScanner = async () => {
    const scanner = scannerInstanceRef.current;
    let stopFailed = false;

    if (scanner) {
      try {
        await scanner.stop();
      } catch (error) {
        console.error("Unable to stop QR scanner:", error);
        stopFailed = true;
      }

      try {
        scanner.clear();
      } catch (error) {
        console.error("Unable to clear QR scanner:", error);
        stopFailed = true;
      }
    }

    scannerInstanceRef.current = null;
    setScannerOpen(false);

    if (stopFailed) {
      setQrMessage(
        "Camera could not be stopped cleanly. Please check camera access.",
      );
    }
  };

  const handleBindPhysicalQR = async () => {
    if (!qrPath) return;

    dispatch(clearQRMessages());

    try {
      await dispatch(bindPhysicalQR({ qrPath })).unwrap();
    } catch (err) {
      console.error("QR binding failed:", err);
    }
  };

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

  const handleDownloadQR = () => {
    if (!qrImage || !boundQR) return;

    setDownloading(true);
    try {
      const anchor = document.createElement("a");
      anchor.href = qrImage;
      anchor.download = `business-qr-${boundQR.qrPath
        .replace(/^\/+/, "")
        .replace(/[^a-zA-Z0-9_-]/g, "-")}.png`;
      document.body.appendChild(anchor);
      anchor.click();
      anchor.remove();
    } catch (error) {
      console.error("QR download failed:", error);
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
    if (!qrPublicUrl) return;

    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
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
                Share your business card online, download your QR code, and help
                customers connect with your business.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleWhatsAppShare}
            disabled={!qrPublicUrl}
            className="inline-flex min-h-11 items-center justify-center gap-2 self-start rounded-xl bg-cyan-300 px-4 py-3 text-xs font-bold text-[#0b1b30] transition hover:bg-cyan-200 active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-50 sm:self-center"
          >
            <MessageSquare size={15} />
            Share Website
            <ArrowUpRight size={14} />
          </button>
        </header>

        {/* ==================== ACTIVATION BANNER ==================== */}
        {/* 
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
                  One-time payment of ₹499 is shown for activation. Confirm
                  payment status before enabling live services.
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
                  "Demo mode: connect your payment gateway to activate this card.",
                )
              }
              className="inline-flex shrink-0 items-center justify-center rounded-xl border border-cyan-300/20 bg-[#193754] px-4 py-3 text-xs font-bold text-cyan-200 transition hover:border-cyan-300/40 hover:bg-[#21415f] active:scale-[0.98]"
            >
              Pay ₹499 & Activate
            </button>
          </div>
        </section> */}

        {/* ==================== BUSINESS LINKS ==================== */}

        <section className="mb-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
          <LinkCard
            icon={Link2}
            label="Direct Card Link"
            description="Your public business card URL"
            value={profileUrl || directCardLink}
            copied={copiedField === "direct"}
            onCopy={() => handleCopy(profileUrl || directCardLink, "direct")}
            tag="Direct access"
          />

          <LinkCard
            icon={Globe}
            label="Business Profile URL"
            description="Your dynamic public business profile URL"
            value={customSubdomain || "Create and save your profile first"}
            copied={copiedField === "subdomain"}
            onCopy={() => {
              if (customSubdomain) {
                handleCopy(customSubdomain, "subdomain");
              }
            }}
            tag="Profile"
          />
        </section>

        {/* ==================== BIND EXISTING QR ==================== */}

        <section className="mb-6 rounded-2xl border border-[#29435f] bg-[#10243b] p-5 sm:p-6">
          <h2 className="text-lg font-bold text-white">
            Bind Existing Physical QR
          </h2>

          <p className="mt-2 text-sm leading-6 text-slate-400">
            Scan your already-printed QR or upload its image. We will read the
            original URL and preserve its existing path.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={startQRScanner}
              disabled={scannerOpen || qrBusy}
              className="rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#0b1b30] disabled:opacity-50"
            >
              Scan with Camera
            </button>

            <label
              className={`rounded-xl border border-[#38516e] px-4 py-3 text-sm font-semibold text-white ${
                qrBusy || scannerOpen
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer"
              }`}
            >
              Upload QR Image
              <input
                type="file"
                accept="image/*"
                className="hidden"
                disabled={qrBusy || scannerOpen}
                onChange={handleQRImageUpload}
              />
            </label>
          </div>

          <div
            id="qr-camera-reader"
            ref={scannerRef}
            aria-hidden={!scannerOpen}
            className={`mt-5 max-w-md overflow-hidden rounded-xl ${
              scannerOpen ? "" : "hidden"
            }`}
          />

          {scannerOpen && (
            <button
              type="button"
              onClick={stopQRScanner}
              className="mt-3 rounded-lg border border-[#38516e] px-4 py-2 text-sm text-white"
            >
              Stop Camera
            </button>
          )}

          <div id="qr-file-reader" className="hidden" />

          {qrMessage && (
            <p className="mt-4 text-sm text-cyan-200" role="status">
              {qrMessage}
            </p>
          )}

          {qrBusy && (
            <p className="mt-2 text-sm text-slate-400" aria-live="polite">
              Decoding QR image…
            </p>
          )}

          {decodedQRUrl && (
            <div className="mt-5 rounded-xl border border-[#38516e] bg-[#0b1b30] p-4">
              <p className="text-xs font-semibold text-slate-400">
                Original decoded URL
              </p>

              <p className="mt-2 break-all text-sm text-white">
                {decodedQRUrl}
              </p>

              <p className="mt-4 text-xs font-semibold text-slate-400">
                Existing QR path
              </p>

              <p className="mt-1 font-mono text-sm text-cyan-200">{qrPath}</p>

              <p className="mt-3 text-xs leading-5 text-amber-200">
                Verify that this QR belongs to your business before binding.
                Decoding the URL does not itself change the printed QR
                destination.
              </p>
            </div>
          )}

          <button
            type="button"
            onClick={handleBindPhysicalQR}
            disabled={!qrPath || binding}
            className="mt-4 w-full rounded-xl bg-cyan-300 px-4 py-3 text-sm font-bold text-[#0b1b30] transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {binding ? "Binding QR..." : "Bind QR to My Profile"}
          </button>

          {successMessage && (
            <p className="mt-3 text-sm text-emerald-500" role="status">
              {successMessage}
            </p>
          )}

          {error && (
            <p className="mt-3 text-sm text-red-500" role="alert">
              {error}
            </p>
          )}

          {boundQR && boundQR.qrPath === qrPath && (
            <div className="mt-3 text-sm text-slate-300">
              <p>QR Path: {boundQR.qrPath}</p>
              <p>Profile: {boundQR.subdomain}</p>
            </div>
          )}
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
                  {(businessName || "Your Business").charAt(0).toUpperCase()}
                </div>

                <div>
                  <h3 className="text-sm font-bold text-white">
                    {businessName}
                  </h3>

                  <p className="mt-1 text-[11px] text-slate-400">
                    Digital business card
                  </p>
                </div>
              </div>

              <div className="flex min-h-60 min-w-60 items-center justify-center rounded-2xl border border-[#38516e] bg-white p-3 shadow-xl shadow-black/20">
                {fetching ? (
                  <p className="text-sm text-slate-600">
                    Loading your saved QR code...
                  </p>
                ) : qrImage ? (
                  <img
                    src={qrImage}
                    alt="Bound business QR code"
                    className="mx-auto h-60 w-60 rounded-xl bg-white p-2"
                  />
                ) : (
                  <p className="max-w-48 text-center text-sm text-slate-600">
                    Bind a QR code to display it here.
                  </p>
                )}
              </div>

              {boundQR && (
                <div className="mt-4 max-w-sm text-center">
                  <p className="font-semibold text-white">
                    Profile: {boundQR.subdomain}
                  </p>
                  <p className="text-sm text-slate-400">
                    QR Path: {boundQR.qrPath}
                  </p>
                  <p className="break-all text-sm text-cyan-200">
                    {qrPublicUrl}
                  </p>
                </div>
              )}

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
                  onClick={() => {
                    if (qrPublicUrl) {
                      handleCopy(qrPublicUrl, "qrlink");
                    }
                  }}
                  disabled={!qrPublicUrl}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#38516e] bg-[#0b1b30] p-4 text-left transition hover:border-cyan-300/40 hover:bg-[#132942] disabled:cursor-not-allowed disabled:opacity-50"
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
                  disabled={!qrImage || downloading}
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
                        {downloading
                          ? "Preparing download..."
                          : "Download QR code"}
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
                  disabled={!qrPublicUrl}
                  className="flex w-full items-center justify-between gap-3 rounded-xl border border-[#38516e] bg-[#0b1b30] p-4 text-left transition hover:border-cyan-300/40 hover:bg-[#132942] disabled:cursor-not-allowed disabled:opacity-50"
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
                  business card. Verify that your URL is correct before printing
                  or distributing the QR code.
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
                    session. A backend connection is required for actual standee
                    verification.
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
