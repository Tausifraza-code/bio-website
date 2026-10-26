import { useState } from "react";
import QRCode from "qrcode";

export default function TestQRGenerator() {
  const [qrImage, setQrImage] = useState("");
  const [error, setError] = useState("");

  const testUrl = "http://localhost:5000/test-qr-457";

  const generateQR = async () => {
    try {
      setError("");

      const image = await QRCode.toDataURL(testUrl, {
        width: 400,
        margin: 2,
        errorCorrectionLevel: "H",
      });

      setQrImage(image);
    } catch (err) {
      setError("QR code generate nahi hua.");
      console.error(err);
    }
  };

  return (
    <div className="space-y-4 rounded-xl bg-white p-5 text-gray-900">
      <h2 className="text-lg font-bold">Temporary Test QR</h2>

      <p className="break-all text-sm">{testUrl}</p>

      <button
        type="button"
        onClick={generateQR}
        className="rounded-lg bg-cyan-500 px-4 py-2 font-semibold"
      >
        Generate Test QR
      </button>

      {error && <p className="text-red-600">{error}</p>}

      {qrImage && (
        <div className="space-y-3">
          <img
            src={qrImage}
            alt="Temporary QR code for testing"
            className="h-64 w-64"
          />

          <a
            href={qrImage}
            download="temporary-test-qr.png"
            className="block font-semibold text-blue-700"
          >
            Download Test QR
          </a>
        </div>
      )}
    </div>
  );
}
