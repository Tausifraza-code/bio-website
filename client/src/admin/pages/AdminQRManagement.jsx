import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import {
  QrCode,
  Search,
  Download,
  RefreshCw,
  PackagePlus,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Clock3,
  Ban,
  AlertCircle,
  Copy,
  Check,
} from "lucide-react";

import {
  fetchQRInventory,
  generateQRBatch,
  exportQRInventory,
  clearQRMessages,
  recordQRDownload,
} from "../../redux/slice/adminQRSlice";

const statusStyles = {
  available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  assigned: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  disabled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const formatDate = (value) => {
  if (!value) return "—";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleString("en-IN", {
    timeZone: "Asia/Kolkata",
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// const getPublicQRUrl = (qrPath) => {
//   const apiBaseUrl =
//     import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";

//   const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

//   if (!qrPath) return "";
//   return `${backendOrigin}${qrPath}`;
// };

const getPublicQRUrl = (qrPath) => {
  if (!qrPath) return "";

  const publicBaseUrl =
    import.meta.env.VITE_PUBLIC_QR_BASE_URL || window.location.origin;

  return `${publicBaseUrl.replace(/\/+$/, "")}${qrPath}`;
};

const downloadQRDesign = async (item, format, fileType, onDownloadRecorded) => {
  const url = getPublicQRUrl(item.qrPath);

  if (!url || item.status === "disabled") {
    window.alert("This QR code is unavailable.");
    return;
  }

  const type = String(fileType).toLowerCase();

  if (!["png", "jpg", "jpeg", "svg", "pdf"].includes(type)) {
    window.alert("Unsupported file format.");
    return;
  }

  const recordDownload = async () => {
    try {
      await onDownloadRecorded?.(item, format, type);
    } catch (error) {
      console.error("QR download history recording failed:", error);
    }
  };

  try {
    const qrDataUrl = await QRCode.toDataURL(url, {
      errorCorrectionLevel: "H",
      margin: 2,
      width: 1000,
      color: {
        dark: "#102C35",
        light: "#FFFFFF",
      },
    });

    const layouts = {
      standee: {
        width: 900,
        height: 1273,
        qrSize: 500,
        title: "SCAN TO CONNECT",
        subtitle: "Your business, one scan away",
      },
      pocket: {
        width: 1011,
        height: 638,
        qrSize: 250,
        title: "MY DIGITAL BUSINESS CARD",
        subtitle: "Scan to view our profile",
      },
      keychain: {
        width: 600,
        height: 600,
        qrSize: 250,
        title: "SCAN ME",
        subtitle: "Connect with us",
      },
    };

    const layout = layouts[format];
    if (!layout) throw new Error("Invalid QR design format.");

    const businessName = String(item.businessName || "Your Business").replace(
      /[<>&"']/g,
      "",
    );

    const activationCode = String(item.activationCode || "CODE UNAVAILABLE");

    const escapeXml = (value) =>
      String(value).replace(
        /[<>&"']/g,
        (char) =>
          ({
            "<": "&lt;",
            ">": "&gt;",
            "&": "&amp;",
            '"': "&quot;",
            "'": "&apos;",
          })[char],
      );

    const W = layout.width;
    const H = layout.height;
    const qrSize = layout.qrSize;
    const qrX = (W - qrSize) / 2;
    const qrY = {
      standee: 410,
      pocket: 230,
      keychain: 190,
    }[format];

    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg"
        width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
        <rect width="100%" height="100%" fill="#ffffff"/>
        <path d="M0 0 H${W} V${Math.round(H * 0.12)}
          Q${W / 2} ${Math.round(H * 0.2)} 0 ${Math.round(H * 0.12)} Z"
          fill="#064e3b"/>
        <text x="${W / 2}" y="${Math.round(H * 0.065)}"
          text-anchor="middle" font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 46 : 30}"
          font-weight="700" fill="#ffffff">BIO</text>
        <text x="${W / 2}" y="${Math.round(H * 0.23)}"
          text-anchor="middle" font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 44 : 30}"
          font-weight="700" fill="#064e3b">${escapeXml(layout.title)}</text>
        <text x="${W / 2}" y="${
          format === "standee" ? 340 : format === "pocket" ? 185 : 160
        }"
          text-anchor="middle" font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 25 : 20}"
          fill="#0e7490">${escapeXml(businessName)}</text>
        <rect x="${qrX - 18}" y="${qrY - 18}"
          width="${qrSize + 36}" height="${qrSize + 36}"
          rx="20" fill="#ffffff" stroke="#a7f3d0" stroke-width="5"/>
        <image href="${qrDataUrl}" x="${qrX}" y="${qrY}"
          width="${qrSize}" height="${qrSize}"
          preserveAspectRatio="xMidYMid meet"/>
       <text
  x="${W / 2}"
  y="${Math.min(H - 115, qrY + qrSize + 65)}"
  text-anchor="middle"
  font-family="Arial,sans-serif"
  font-size="${format === "standee" ? 25 : 20}"
  font-weight="600"
  fill="#102c35"
>
  ${escapeXml(layout.subtitle)}
</text>

<text
  x="${W / 2}"
  y="${H - 65}"
  text-anchor="middle"
  font-family="Arial,sans-serif"
  font-size="${format === "standee" ? 23 : 18}"
  font-weight="700"
  fill="#064e3b"
>
  ${escapeXml(`ACTIVATION CODE: ${activationCode}`)}
</text>
        <rect x="${W * 0.18}" y="${H - 35}" width="${W * 0.64}"
          height="8" rx="4" fill="#06b6d4"/>
      </svg>
    `;

    const filename = `BIO-${format}-${item.serialNumber || "QR"}`;

    const downloadBlob = (blob, extension) => {
      const objectUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `${filename}.${extension}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setTimeout(() => URL.revokeObjectURL(objectUrl), 1000);
    };

    if (type === "svg") {
      downloadBlob(
        new Blob([svg], {
          type: "image/svg+xml;charset=utf-8",
        }),
        "svg",
      );
      await recordDownload();
      return;
    }

    const svgBlob = new Blob([svg], {
      type: "image/svg+xml;charset=utf-8",
    });
    const svgUrl = URL.createObjectURL(svgBlob);

    try {
      const image = new Image();

      await new Promise((resolve, reject) => {
        image.onload = resolve;
        image.onerror = reject;
        image.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = W;
      canvas.height = H;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");

      context.fillStyle = "#ffffff";
      context.fillRect(0, 0, W, H);
      context.drawImage(image, 0, 0, W, H);

      if (type === "pdf") {
        const pdf = new jsPDF({
          orientation: W >= H ? "landscape" : "portrait",
          unit: "mm",
          format: [W * 0.264583, H * 0.264583],
        });

        const imageData = canvas.toDataURL("image/png");

        pdf.addImage(imageData, "PNG", 0, 0, W * 0.264583, H * 0.264583);

        pdf.save(`${filename}.pdf`);
        await recordDownload();
      } else {
        const mimeType =
          type === "jpg" || type === "jpeg" ? "image/jpeg" : "image/png";

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, mimeType, 0.96),
        );

        if (!blob) throw new Error("Image export failed.");

        downloadBlob(blob, type === "jpeg" ? "jpg" : type);
        await recordDownload();
      }
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  } catch (error) {
    console.error("QR download error:", error);
    window.alert("Unable to download the QR design. Please try again.");
  }
};

export default function AdminQRManagement() {
  const dispatch = useDispatch();

  const { sets, pagination, loading, generating, exporting, error, message } =
    useSelector((state) => state.adminQR);

  const [count, setCount] = useState("100");
  const [status, setStatus] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [formError, setFormError] = useState("");
  const [downloadTypes, setDownloadTypes] = useState({});
  const [copiedValue, setCopiedValue] = useState("");

  const handleDownloadRecorded = useCallback(
    async (item, format, fileType) => {
      await dispatch(
        recordQRDownload({
          id: item._id,
          format,
          fileType,
        }),
      ).unwrap();
    },
    [dispatch],
  );

  const loadInventory = useCallback(() => {
    dispatch(
      fetchQRInventory({
        page,
        limit: 20,
        ...(status ? { status } : {}),
        ...(search ? { search } : {}),
      }),
    );
  }, [dispatch, page, status, search]);

  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  useEffect(() => {
    return () => {
      dispatch(clearQRMessages());
    };
  }, [dispatch]);

  const copyValue = async (value) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedValue(value);
      window.setTimeout(() => setCopiedValue(""), 1600);
    } catch {
      setFormError("Unable to copy. Please copy the value manually.");
    }
  };

  const renderCopyField = (value, label) => (
    <div className="flex min-w-0 items-center gap-2">
      <code className="min-w-0 break-all text-xs text-slate-600 dark:text-slate-300">
        {value || "—"}
      </code>
      {value && (
        <button
          type="button"
          onClick={() => copyValue(value)}
          aria-label={`Copy ${label}`}
          title={`Copy ${label}`}
          className="shrink-0 rounded-md border border-slate-200 p-1.5 text-slate-500 hover:bg-slate-100 dark:border-slate-700 dark:hover:bg-slate-800"
        >
          {copiedValue === value ? (
            <Check size={14} className="text-emerald-600" />
          ) : (
            <Copy size={14} />
          )}
        </button>
      )}
    </div>
  );

  const renderFormatDownload = (item, format) => {
    const key = `${item._id}:${format}`;
    const fileType = downloadTypes[key] || "png";
    const history = (item.downloadHistory || []).filter(
      (entry) => entry.format === format,
    );
    const latestDownload = history.sort(
      (a, b) => new Date(b.downloadedAt) - new Date(a.downloadedAt),
    )[0];

    return (
      <div
        key={format}
        className="min-w-0 rounded-lg border border-slate-200 p-2 dark:border-slate-700"
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="text-xs font-semibold">
            {format === "pocket"
              ? "Pocket Card"
              : format === "standee"
                ? "Standee"
                : "Keychain"}
          </span>

          <span
            className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-semibold ${
              latestDownload
                ? "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                : "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400"
            }`}
          >
            {latestDownload ? "Downloaded" : "Not downloaded"}
          </span>
        </div>

        {latestDownload && (
          <p className="mt-1 text-[10px] text-slate-500 dark:text-slate-400">
            Last: {formatDate(latestDownload.downloadedAt)}
          </p>
        )}

        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
          <select
            aria-label={`${format} file type`}
            value={fileType}
            onChange={(event) =>
              setDownloadTypes((current) => ({
                ...current,
                [key]: event.target.value,
              }))
            }
            className="w-full min-w-0 rounded-md border border-slate-200 bg-white px-2 py-2 text-xs dark:border-slate-700 dark:bg-[#07111f]"
          >
            <option value="png">PNG</option>
            <option value="jpg">JPG</option>
            <option value="svg">SVG</option>
            <option value="pdf">PDF</option>
          </select>

          <button
            type="button"
            onClick={() =>
              downloadQRDesign(item, format, fileType, handleDownloadRecorded)
            }
            disabled={!item.qrPath || item.status === "disabled"}
            className="inline-flex items-center justify-center gap-1 whitespace-nowrap rounded-md bg-cyan-500 px-3 py-2 text-xs font-semibold text-white transition-colors hover:bg-cyan-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            <Download size={13} />
            Download
          </button>
        </div>
      </div>
    );
  };

  const handleSearch = (event) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput.trim());
  };

  const handleStatusChange = (event) => {
    setStatus(event.target.value);
    setPage(1);
  };

  const handleGenerate = async (event) => {
    event.preventDefault();
    setFormError("");

    const amount = Number(count);

    if (!Number.isInteger(amount) || amount < 1 || amount > 1000) {
      setFormError("Enter a whole number between 1 and 1,000.");
      return;
    }

    const result = await dispatch(generateQRBatch(amount));

    if (generateQRBatch.fulfilled.match(result)) {
      setPage(1);
      setStatus("available");
      setSearch("");
      setSearchInput("");
      // Reload inventory after the new batch is created.
      dispatch(
        fetchQRInventory({
          page: 1,
          limit: 20,
          status: "available",
        }),
      );
    }
  };

  const handleExport = () => {
    dispatch(exportQRInventory(status ? { status } : {}));
  };

  const changePage = (nextPage) => {
    if (nextPage < 1 || nextPage > pagination.totalPages) return;
    setPage(nextPage);
  };

  const total = Number(pagination.total || 0);
  const available = sets.filter((item) => item.status === "available").length;
  const assigned = sets.filter((item) => item.status === "assigned").length;
  const disabled = sets.filter((item) => item.status === "disabled").length;

  return (
    <div className="space-y-7">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-cyan-600 dark:text-cyan-400">
            INVENTORY MANAGEMENT
          </p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight sm:text-3xl">
            QR Management
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-slate-500 dark:text-slate-400">
            Generate business QR sets, track assignments and export inventory.
            Every set supports Standee, Pocket Card and Keychain formats.
          </p>
        </div>

        <button
          type="button"
          onClick={loadInventory}
          disabled={loading}
          className="flex w-fit items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-800 dark:bg-[#0b1728] dark:hover:bg-slate-800"
        >
          <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </section>

      {(error || formError || message) && (
        <div
          role="status"
          className={`flex items-start gap-3 rounded-xl border p-4 text-sm ${
            error || formError
              ? "border-red-200 bg-red-50 text-red-700 dark:border-red-900/50 dark:bg-red-950/30 dark:text-red-300"
              : "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-300"
          }`}
        >
          {error || formError ? (
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
          ) : (
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
          )}
          <span>{formError || error || message}</span>
          <button
            type="button"
            aria-label="Dismiss message"
            onClick={() => {
              setFormError("");
              dispatch(clearQRMessages());
            }}
            className="ml-auto font-semibold"
          >
            ×
          </button>
        </div>
      )}

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          {
            label: "Total matching records",
            value: total,
            icon: QrCode,
            tone: "text-cyan-600 dark:text-cyan-300",
          },
          {
            label: "Available on this page",
            value: available,
            icon: PackagePlus,
            tone: "text-emerald-600 dark:text-emerald-300",
          },
          {
            label: "Assigned on this page",
            value: assigned,
            icon: Clock3,
            tone: "text-blue-600 dark:text-blue-300",
          },
          {
            label: "Disabled on this page",
            value: disabled,
            icon: Ban,
            tone: "text-red-600 dark:text-red-300",
          },
        ].map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.label}
              className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    {item.label}
                  </p>
                  <p className="mt-3 text-2xl font-bold">
                    {item.value.toLocaleString("en-IN")}
                  </p>
                </div>
                <div
                  className={`rounded-xl bg-slate-100 p-3 dark:bg-slate-800 ${item.tone}`}
                >
                  <Icon size={21} />
                </div>
              </div>
            </div>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <form
          onSubmit={handleGenerate}
          className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728] xl:col-span-2"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
              <PackagePlus size={22} />
            </div>
            <div>
              <h2 className="font-semibold">Generate QR Sets</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Each set includes all three print formats and one unique QR
                destination.
              </p>
            </div>
          </div>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <div className="flex-1">
              <label
                htmlFor="qr-count"
                className="mb-2 block text-sm font-medium"
              >
                Number of sets
              </label>
              <input
                id="qr-count"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-[#07111f]"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="self-end rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {generating ? "Generating..." : "Generate Sets"}
            </button>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["Standee", "Pocket Card", "Keychain"].map((format) => (
              <span
                key={format}
                className="rounded-full border border-slate-200 px-3 py-1.5 text-xs font-medium text-slate-600 dark:border-slate-700 dark:text-slate-300"
              >
                {format}
              </span>
            ))}
          </div>
        </form>

        <div className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-emerald-50 p-3 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300">
              <Download size={21} />
            </div>
            <div>
              <h2 className="font-semibold">Export Inventory</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Download a CSV using the selected status filter.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleExport}
            disabled={exporting}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold transition hover:bg-slate-50 disabled:opacity-60 dark:border-slate-700 dark:hover:bg-slate-800"
          >
            <Download size={17} />
            {exporting ? "Preparing CSV..." : "Download CSV"}
          </button>
          <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">
            {status
              ? `Export includes "${status}" records only.`
              : "Export includes all QR inventory records."}
          </p>
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white dark:border-slate-800 dark:bg-[#0b1728]">
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h2 className="font-semibold">QR Inventory</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search, filter and review generated QR sets.
            </p>
          </div>

          <div className="flex flex-col gap-3 sm:flex-row">
            <form onSubmit={handleSearch} className="relative">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search Set ID or business"
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-500 sm:w-64 dark:border-slate-700 dark:bg-[#07111f]"
              />
            </form>

            <select
              value={status}
              onChange={handleStatusChange}
              aria-label="Filter QR status"
              className="rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-[#07111f]"
            >
              <option value="">All statuses</option>
              <option value="available">Available</option>
              <option value="assigned">Assigned</option>
              <option value="disabled">Disabled</option>
            </select>
          </div>
        </div>

        {/* Desktop/tablet inventory */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Set ID</th>
                <th className="px-3 py-3 font-semibold">Activation Code</th>
                <th className="px-3 py-3 font-semibold">Business / QR Path</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Design Downloads</th>
                <th className="px-3 py-3 font-semibold">Assigned Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    <RefreshCw size={17} className="mr-2 inline animate-spin" />
                    Loading inventory...
                  </td>
                </tr>
              ) : sets.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-5 py-14 text-center text-slate-500 dark:text-slate-400"
                  >
                    No QR sets found for these filters.
                  </td>
                </tr>
              ) : (
                sets.map((item) => (
                  <tr
                    key={item._id}
                    className="align-top transition hover:bg-slate-50/70 dark:hover:bg-slate-800/30"
                  >
                    <td className="px-3 py-3">
                      <span className="break-all font-semibold">
                        {item.serialNumber}
                      </span>
                    </td>
                    <td className="px-3 py-3">
                      <div className="space-y-1">
                        <code className="font-semibold tracking-wide text-cyan-700 dark:text-cyan-300">
                          {item.activationCode || "—"}
                        </code>
                        {item.activationCode && (
                          <button
                            type="button"
                            onClick={() => copyValue(item.activationCode)}
                            className="flex items-center gap-1 text-xs text-slate-500 hover:text-cyan-600"
                          >
                            {copiedValue === item.activationCode ? (
                              <Check size={13} />
                            ) : (
                              <Copy size={13} />
                            )}{" "}
                            {copiedValue === item.activationCode
                              ? "Copied"
                              : "Copy code"}
                          </button>
                        )}
                      </div>
                    </td>
                    <td className="max-w-[250px] px-3 py-3">
                      <p className="mb-2 font-medium">
                        {item.businessName || "Unassigned business"}
                      </p>
                      {renderCopyField(item.qrPath, "QR path")}
                    </td>
                    <td className="px-3 py-3">
                      <span
                        className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${
                          statusStyles[item.status] ||
                          "bg-slate-100 text-slate-600"
                        }`}
                      >
                        {item.status || "unknown"}
                      </span>
                    </td>
                    <td className="min-w-[560px] px-3 py-3">
                      <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 2xl:grid-cols-3">
                        {["standee", "pocket", "keychain"].map((format) =>
                          renderFormatDownload(item, format),
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-3 py-3 text-xs text-slate-500 dark:text-slate-400">
                      {formatDate(item.assignedAt)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile inventory cards: no horizontal scrolling */}
        <div className="space-y-4 p-3 md:hidden">
          {loading ? (
            <div className="py-10 text-center text-sm text-slate-500">
              <RefreshCw size={17} className="mr-2 inline animate-spin" />
              Loading inventory...
            </div>
          ) : sets.length === 0 ? (
            <div className="py-10 text-center text-sm text-slate-500 dark:text-slate-400">
              No QR sets found for these filters.
            </div>
          ) : (
            sets.map((item) => (
              <article
                key={item._id}
                className="min-w-0 rounded-2xl border border-slate-200 p-4 dark:border-slate-700"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0">
                    <p className="text-xs font-medium uppercase tracking-wide text-slate-500">
                      Set ID
                    </p>
                    <p className="mt-1 break-all font-semibold">
                      {item.serialNumber}
                    </p>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold capitalize ${statusStyles[item.status] || "bg-slate-100 text-slate-600"}`}
                  >
                    {item.status || "unknown"}
                  </span>
                </div>
                <div className="mt-4 rounded-xl bg-slate-50 p-3 dark:bg-slate-800/50">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Activation code
                  </p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <code className="break-all font-bold tracking-wide text-cyan-700 dark:text-cyan-300">
                      {item.activationCode || "—"}
                    </code>
                    {item.activationCode && (
                      <button
                        type="button"
                        onClick={() => copyValue(item.activationCode)}
                        className="shrink-0 rounded-md border border-slate-200 p-2 dark:border-slate-700"
                        aria-label="Copy activation code"
                      >
                        {copiedValue === item.activationCode ? (
                          <Check size={15} className="text-emerald-600" />
                        ) : (
                          <Copy size={15} />
                        )}
                      </button>
                    )}
                  </div>
                </div>
                <div className="mt-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Business
                  </p>
                  <p className="mt-1 break-words font-medium">
                    {item.businessName || "Unassigned business"}
                  </p>
                </div>
                <div className="mt-3">
                  <p className="mb-1 text-xs text-slate-500 dark:text-slate-400">
                    QR path
                  </p>
                  {renderCopyField(item.qrPath, "QR path")}
                </div>
                <div className="mt-3 text-xs text-slate-500 dark:text-slate-400">
                  Assigned: {formatDate(item.assignedAt)}
                </div>
                <div className="mt-4 border-t border-slate-200 pt-4 dark:border-slate-700">
                  <h3 className="mb-3 text-sm font-semibold">
                    Design downloads
                  </h3>
                  <div className="space-y-3">
                    {["standee", "pocket", "keychain"].map((format) =>
                      renderFormatDownload(item, format),
                    )}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>

        <div className="flex flex-col gap-3 border-t border-slate-200 px-5 py-4 sm:flex-row sm:items-center sm:justify-between dark:border-slate-800">
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.page || 1} of {pagination.totalPages || 0} ·{" "}
            {(pagination.total || 0).toLocaleString("en-IN")} matching records
          </p>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => changePage(page - 1)}
              disabled={loading || page <= 1}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
            >
              <ChevronLeft size={16} />
              Previous
            </button>
            <button
              type="button"
              onClick={() => changePage(page + 1)}
              disabled={loading || page >= pagination.totalPages}
              className="flex items-center gap-1 rounded-lg border border-slate-200 px-3 py-2 text-sm disabled:opacity-40 dark:border-slate-700"
            >
              Next
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}
