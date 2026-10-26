import { useRef } from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function ProfileQRCode({ profileUrl }) {
  const qrRef = useRef(null);

  const downloadQR = () => {
    const canvas = qrRef.current?.querySelector("canvas");
    if (!canvas) return;

    const link = document.createElement("a");
    link.download = "my-bio-profile-qr.png";
    link.href = canvas.toDataURL("image/png");
    link.click();
  };

  const shareProfile = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: "My BIO Profile",
          url: profileUrl,
        });
      } else {
        await navigator.clipboard.writeText(profileUrl);
        alert("Profile link copied!");
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Unable to share profile:", error);
      }
    }
  };

  if (!profileUrl) return null;

  return (
    <section
      className="rounded-2xl border border-emerald-500/20
      bg-white p-5 text-center shadow-sm dark:bg-slate-900"
    >
      <h2
        className="mb-2 text-xl font-semibold text-slate-900
        dark:text-white"
      >
        My Profile QR Code
      </h2>

      <p className="mb-5 text-sm text-slate-500 dark:text-slate-400">
        Scan to open your digital profile.
      </p>

      <div
        ref={qrRef}
        className="mx-auto mb-5 flex w-fit rounded-xl bg-white p-3"
      >
        <QRCodeCanvas value={profileUrl} size={220} level="H" includeMargin />
      </div>

      <div className="flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={downloadQR}
          className="rounded-lg bg-emerald-600 px-5 py-3
            font-medium text-white hover:bg-emerald-700"
        >
          Download QR
        </button>

        <button
          type="button"
          onClick={shareProfile}
          className="rounded-lg border border-slate-300 px-5 py-3
            font-medium text-slate-800 hover:bg-slate-100
            dark:border-slate-600 dark:text-white
            dark:hover:bg-slate-800"
        >
          Share Profile
        </button>
      </div>

      <p className="mt-4 break-all text-xs text-slate-500">{profileUrl}</p>
    </section>
  );
}
