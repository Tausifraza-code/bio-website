import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { QrCode, Clock3, Copy, Download } from "lucide-react";

function QRCodeCard({ cardUrl = window.location.href, isActivated = false }) {
  const [qrImage, setQrImage] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(cardUrl, {
      width: 320,
      margin: 2,
      errorCorrectionLevel: "H",
      color: {
        dark: "#101629",
        light: "#ffffff",
      },
    })
      .then((url) => {
        if (!cancelled) setQrImage(url);
      })
      .catch((error) => {
        console.error("QR generation failed:", error);
      });

    return () => {
      cancelled = true;
    };
  }, [cardUrl]);

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(cardUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      window.prompt("Copy your business card link:", cardUrl);
    }
  };

  const downloadQR = () => {
    if (!qrImage) return;

    const link = document.createElement("a");
    link.href = qrImage;
    link.download = "bio-website-qr.png";
    link.click();
  };

  return (
    <section className="mx-auto w-full max-w-[672px] border-t border-[var(--border-color)] px-4 py-8 sm:px-6">
      <div className="rounded-[26px] border border-[var(--border-color)] bg-[var(--surface)] px-4 py-7 text-center sm:px-8">
        <div className="flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-violet-500/30 bg-violet-500/10 text-violet-400">
            <QrCode size={23} />
          </span>

          <h3 className="text-base font-extrabold text-[var(--text-primary)] sm:text-lg">
            Scan QR Code to Share or Save
          </h3>
        </div>

        <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-500/40 bg-amber-500/10 px-3 py-2 text-[10px] font-extrabold text-amber-400">
          <Clock3 size={13} />
          {isActivated ? "Card Active" : "Pending Admin Activation (Inactive)"}
        </div>

        <p className="mx-auto mt-4 max-w-sm text-sm leading-6 text-[var(--text-secondary)]">
          Point your smartphone camera to save contact or share with prospective
          clients instantly.
        </p>

        <div className="relative mx-auto mt-6 flex h-[216px] w-[216px] items-center justify-center overflow-hidden rounded-[20px] border border-white/20 bg-white p-3 sm:h-[240px] sm:w-[240px]">
          {qrImage ? (
            <img
              src={qrImage}
              alt="Business card QR code"
              className={`h-full w-full object-contain ${
                isActivated ? "" : "blur-[1.5px]"
              }`}
            />
          ) : (
            <div className="h-10 w-10 animate-pulse rounded-lg bg-slate-200" />
          )}

          {!isActivated && (
            <span className="absolute rounded-lg border border-amber-500/50 bg-[#111629]/95 px-3 py-2 text-[11px] font-extrabold text-amber-400 shadow-lg">
              Pending Activation
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={copyLink}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-amber-500/40 bg-amber-500/10 px-4 py-3 text-sm font-bold text-amber-400 transition hover:bg-amber-500/20"
          >
            <Copy size={16} />
            {copied ? "Copied!" : "Copy Link"}
          </button>

          <button
            type="button"
            onClick={downloadQR}
            disabled={!qrImage}
            className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-slate-500/30 bg-slate-700 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-600 disabled:opacity-50"
          >
            <Download size={16} />
            Download QR PNG
          </button>
        </div>
      </div>
    </section>
  );
}

export default QRCodeCard;
