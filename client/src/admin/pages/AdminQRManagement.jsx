import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import * as XLSX from "xlsx";
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
import api from "../../redux/api";
import { getPublicQRUrl } from "../../utils/qrUrl";

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

const appendStyle = (xml, collection, style) => {
  const pattern = new RegExp(
    `(<${collection} count=")(\\d+)(">[\\s\\S]*?)(</${collection}>)`,
  );

  if (!pattern.test(xml)) {
    throw new Error(`Unable to format the Excel workbook (${collection}).`);
  }

  return xml.replace(
    pattern,
    (_, opening, count, content, closing) =>
      `${opening}${Number(count) + 1}${content}${style}${closing}`,
  );
};

const downloadQRInventoryWorkbook = async (items) => {
  const headers = [
    "Serial Number",
    "Activation Code",
    "QR Path",
    "QR URL",
    "QR Format / Design",
    "Assigned User",
    "Business Name",
    "Status",
    "Generated Date",
    "Assigned Date",
  ];
  const displayValue = (value) =>
    value === null || value === undefined || String(value).trim() === ""
      ? "—"
      : String(value).trim();
  const formatNames = {
    standee: "Standee",
    pocket: "Pocket Card",
    keychain: "Keychain",
  };
  const statusLabels = {
    available: "Available",
    assigned: "Assigned",
    disabled: "Disabled",
  };
  const rows = items.map((item) => {
    const assignedUser = item.assignedUser;
    const assignedUserId = item.assignedUserId;
    const assignedUserLabel =
      assignedUser?.fullName && assignedUser?.email
        ? `${assignedUser.fullName} (${assignedUser.email})`
        : assignedUser?.fullName ||
        assignedUser?.email ||
        (typeof assignedUserId === "string"
          ? assignedUserId
          : assignedUserId?._id);

    return [
      displayValue(item.serialNumber),
      displayValue(item.activationCode),
      displayValue(item.qrPath),
      displayValue(item.qrUrl || getPublicQRUrl(item.qrPath)),
      Array.isArray(item.formats) && item.formats.length
        ? item.formats
            .map(
              (format) =>
                formatNames[format] ||
                String(format).charAt(0).toUpperCase() +
                  String(format).slice(1),
            )
            .join(", ")
        : "—",
      displayValue(assignedUserLabel),
      displayValue(item.businessName),
      statusLabels[item.status] || displayValue(item.status),
      formatDate(item.generatedAt),
      formatDate(item.assignedAt),
    ];
  });
  const worksheet = XLSX.utils.aoa_to_sheet([headers, ...rows]);

  worksheet["!cols"] = [
    { wch: 30 },
    { wch: 20 },
    { wch: 36 },
    { wch: 46 },
    { wch: 26 },
    { wch: 34 },
    { wch: 28 },
    { wch: 16 },
    { wch: 24 },
    { wch: 24 },
  ];
  worksheet["!rows"] = [{ hpt: 30 }];
  worksheet["!autofilter"] = {
    ref: `A1:J${rows.length + 1}`,
  };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "QR Inventory");

  // SheetJS Community Edition does not serialize cell styles into XLSX files.
  const archive = await JSZip.loadAsync(
    XLSX.write(workbook, { bookType: "xlsx", type: "array" }),
  );
  const stylesFile = archive.file("xl/styles.xml");
  const worksheetFile = archive.file("xl/worksheets/sheet1.xml");

  if (!stylesFile || !worksheetFile) {
    throw new Error("Unable to create the formatted Excel workbook.");
  }

  let stylesXml = await stylesFile.async("string");
  stylesXml = appendStyle(
    stylesXml,
    "fonts",
    '<font><b/><color rgb="FFFFFFFF"/><sz val="11"/><name val="Calibri"/></font>',
  );
  stylesXml = appendStyle(
    stylesXml,
    "fills",
    '<fill><patternFill patternType="solid"><fgColor rgb="FF155E75"/><bgColor indexed="64"/></patternFill></fill>',
  );
  stylesXml = appendStyle(
    stylesXml,
    "borders",
    '<border><left style="thin"><color rgb="FFD8E1E8"/></left><right style="thin"><color rgb="FFD8E1E8"/></right><top style="thin"><color rgb="FFD8E1E8"/></top><bottom style="thin"><color rgb="FFD8E1E8"/></bottom><diagonal/></border>',
  );
  stylesXml = appendStyle(
    stylesXml,
    "cellXfs",
    '<xf numFmtId="0" fontId="1" fillId="2" borderId="1" xfId="0" applyFont="1" applyFill="1" applyBorder="1" applyAlignment="1"><alignment horizontal="center" vertical="center" wrapText="1"/></xf>',
  );
  stylesXml = appendStyle(
    stylesXml,
    "cellXfs",
    '<xf numFmtId="0" fontId="0" fillId="0" borderId="1" xfId="0" applyBorder="1" applyAlignment="1"><alignment horizontal="left" vertical="center" wrapText="1"/></xf>',
  );

  const worksheetXml = await worksheetFile.async("string");
  const styledWorksheetXml = worksheetXml.replace(
    /<row r="(\d+)"[^>]*>[\s\S]*?<\/row>/g,
    (row, rowNumber) => {
      const styleId = rowNumber === "1" ? "1" : "2";

      return row.replace(/<c\b([^>]*)>/g, (_, attributes) => {
        const cleanAttributes = attributes.replace(/\s+s="[^"]*"/g, "");
        return `<c${cleanAttributes} s="${styleId}">`;
      });
    },
  );

  archive.file("xl/styles.xml", stylesXml);
  archive.file("xl/worksheets/sheet1.xml", styledWorksheetXml);

  const blob = await archive.generateAsync({
    type: "blob",
    mimeType:
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `qr-inventory-${new Date().toISOString().slice(0, 10)}.xlsx`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
};

const normalizeFileType = (fileType) => {
  const type = String(fileType || "").toLowerCase();
  return type === "jpeg" ? "jpg" : type;
};

const isDesignAlreadyDownloaded = (item, format, fileType) => {
  const selectedType = normalizeFileType(fileType);

  return (item.downloadHistory || []).some(
    (entry) =>
      entry.format === format &&
      normalizeFileType(entry.fileType) === selectedType,
  );
};

const downloadQRDesign = async (
  item,
  format,
  fileType,
  onDownloadRecorded,
  returnBlob = false,
) => {
  const url = getPublicQRUrl(item.qrPath);

  if (!url || item.status === "disabled") {
    if (returnBlob) throw new Error("This QR code is unavailable.");
    window.alert("This QR code is unavailable.");
    return;
  }

  const type = String(fileType).toLowerCase();

  if (!["png", "jpg", "jpeg", "svg", "pdf"].includes(type)) {
    if (returnBlob) throw new Error("Unsupported file format.");
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
      const blob = new Blob([svg], {
        type: "image/svg+xml;charset=utf-8",
      });

      if (returnBlob) return blob;

      downloadBlob(blob, "svg");
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

        if (returnBlob) {
          return pdf.output("blob");
        }

        pdf.save(`${filename}.pdf`);
        await recordDownload();
      } else {
        const mimeType =
          type === "jpg" || type === "jpeg" ? "image/jpeg" : "image/png";

        const blob = await new Promise((resolve) =>
          canvas.toBlob(resolve, mimeType, 0.96),
        );

        if (!blob) throw new Error("Image export failed.");

        if (returnBlob) {
          return blob;
        }

        downloadBlob(blob, type === "jpeg" ? "jpg" : type);
        await recordDownload();
      }
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  } catch (error) {
    console.error("QR download error:", error);
    if (returnBlob) {
      throw error;
    }
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
  const [copiedValue, setCopiedValue] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState("100");
  const [bulkFileType, setBulkFileType] = useState("png");
  const [bulkStatus, setBulkStatus] = useState("available");
  const [skipPreviouslyDownloaded, setSkipPreviouslyDownloaded] =
    useState(true);
  const [bulkProgress, setBulkProgress] = useState("");

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

  const handleExport = async () => {
    try {
      const items = await dispatch(
        exportQRInventory({
          ...(status ? { status } : {}),
          ...(search ? { search } : {}),
        }),
      ).unwrap();

      if (items.length === 0) {
        window.alert("No QR inventory found for the selected filters.");
        return;
      }

      await downloadQRInventoryWorkbook(items);
    } catch (error) {
      console.error("QR inventory Excel export failed:", error);
      window.alert(
        (typeof error === "string" ? error : error?.message) ||
          "Unable to export QR inventory.",
      );
    }
  };

  const handleBulkDownload = async () => {
    if (bulkDownloading) return;

    const requestedQuantity = Number(bulkQuantity);
    if (!Number.isSafeInteger(requestedQuantity) || requestedQuantity < 1) {
      setFormError("Enter a positive whole number for the QR set quantity.");
      return;
    }

    setFormError("");
    setBulkProgress("Loading QR inventory...");
    setBulkDownloading(true);

    try {
      const pageSize = 100;
      const filters = {
        ...(bulkStatus ? { status: bulkStatus } : {}),
        ...(search ? { search } : {}),
      };
      const firstResponse = await api.get("/admin/qr-sets/inventory", {
        params: { ...filters, page: 1, limit: pageSize },
      });
      if (!firstResponse.data?.success) {
        throw new Error(
          firstResponse.data?.message || "Unable to load QR inventory.",
        );
      }

      const firstData = firstResponse.data.data;
      const firstPagination = firstData?.pagination || {};
      const actualPageSize = Number(firstPagination.limit) || pageSize;
      const totalPages =
        Number(firstPagination.totalPages) ||
        Math.ceil(Number(firstPagination.total || 0) / actualPageSize);
      const selectedSets = [];
      const selectedSetIds = new Set();
      let missingQRPaths = 0;
      const addEligibleSets = (items) => {
        for (const item of items) {
          if (item.status === "disabled") continue;
          if (!item.qrPath) {
            missingQRPaths += 1;
            continue;
          }
          if (selectedSets.length >= requestedQuantity) continue;

          const setId = String(item._id);
          if (selectedSetIds.has(setId)) continue;

          const formats = ["standee", "pocket", "keychain"].filter(
            (format) =>
              !skipPreviouslyDownloaded ||
              !isDesignAlreadyDownloaded(item, format, bulkFileType),
          );
          if (formats.length) {
            selectedSets.push({ item, formats });
            selectedSetIds.add(setId);
          }
        }
      };

      addEligibleSets(firstData?.sets || []);
      for (let currentPage = 2; currentPage <= totalPages; currentPage += 1) {
        setBulkProgress(
          `Loading QR inventory page ${currentPage} of ${totalPages}...`,
        );
        const response = await api.get("/admin/qr-sets/inventory", {
          params: {
            ...filters,
            page: currentPage,
            limit: pageSize,
          },
        });
        if (!response.data?.success) {
          throw new Error(
            response.data?.message || "Unable to load QR inventory.",
          );
        }
        addEligibleSets(response.data.data?.sets || []);
      }

      if (selectedSets.length === 0) {
        setFormError(
          "No eligible QR designs were found. They may already be downloaded, disabled, or missing QR paths.",
        );
        setBulkProgress("");
        return;
      }

      const designCount = selectedSets.reduce(
        (total, selection) => total + selection.formats.length,
        0,
      );
      const zip = new JSZip();
      const successfullyAdded = [];
      const designFileNames = {
        standee: "Standee",
        pocket: "Pocket",
        keychain: "Keychain",
      };
      let failedDesigns = 0;
      let preparedDesigns = 0;
      const setNumberWidth = Math.max(2, String(selectedSets.length).length);

      for (const [setIndex, { item, formats }] of selectedSets.entries()) {
        const setNumber = String(setIndex + 1).padStart(setNumberWidth, "0");
        for (const format of formats) {
          preparedDesigns += 1;
          setBulkProgress(
            `Preparing design ${preparedDesigns} of ${designCount}...`,
          );

          try {
            const blob = await downloadQRDesign(
              item,
              format,
              bulkFileType,
              undefined,
              true,
            );
            if (!(blob instanceof Blob) || blob.size === 0) {
              throw new Error("The generated design file is empty.");
            }

            const fileType = normalizeFileType(bulkFileType);
            zip.file(
              `QR-Set-${setNumber}-${designFileNames[format]}.${fileType}`,
              blob,
            );
            successfullyAdded.push({ item, format, fileType });
          } catch (error) {
            failedDesigns += 1;
            console.error(
              `Failed to prepare ${format} for ${item.serialNumber || item._id}:`,
              error,
            );
          }
        }
      }

      if (successfullyAdded.length === 0) {
        throw new Error(
          "No QR designs could be generated, so no ZIP was downloaded.",
        );
      }

      setBulkProgress("Creating ZIP file...");
      const zipBlob = await zip.generateAsync({ type: "blob" }, (metadata) =>
        setBulkProgress(`Creating ZIP file: ${Math.round(metadata.percent)}%`),
      );
      const objectUrl = URL.createObjectURL(zipBlob);
      const link = document.createElement("a");
      link.href = objectUrl;
      link.download = `BIO-QR-${normalizeFileType(bulkFileType).toUpperCase()}-${new Date()
        .toISOString()
        .slice(0, 10)}.zip`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.setTimeout(() => URL.revokeObjectURL(objectUrl), 30000);

      setBulkProgress("Recording download history...");
      let historyFailures = 0;
      const historyBatchSize = 10;
      for (
        let start = 0;
        start < successfullyAdded.length;
        start += historyBatchSize
      ) {
        const batch = successfullyAdded.slice(start, start + historyBatchSize);
        setBulkProgress(
          `Recording download history ${Math.min(start + historyBatchSize, successfullyAdded.length)} of ${successfullyAdded.length}...`,
        );
        const results = await Promise.allSettled(
          batch.map(({ item, format, fileType }) =>
            dispatch(
              recordQRDownload({
                id: item._id,
                format,
                fileType,
              }),
            ).unwrap(),
          ),
        );
        historyFailures += results.filter(
          (result) => result.status === "rejected",
        ).length;
      }

      let inventoryRefreshFailed = false;
      try {
        await dispatch(
          fetchQRInventory({
            page,
            limit: 20,
            ...(status ? { status } : {}),
            ...(search ? { search } : {}),
          }),
        ).unwrap();
      } catch (error) {
        inventoryRefreshFailed = true;
        console.error(
          "QR inventory refresh after bulk download failed:",
          error,
        );
      }

      const summary =
        `Download complete: ${selectedSets.length} of ${requestedQuantity} requested QR sets, ` +
        `${successfullyAdded.length} design file(s) in the ZIP.` +
        (failedDesigns
          ? ` ${failedDesigns} design(s) could not be generated.`
          : "") +
        (selectedSets.length < requestedQuantity
          ? " Fewer eligible sets were available than requested."
          : "") +
        (missingQRPaths
          ? ` ${missingQRPaths} QR set(s) were skipped because their QR path is missing.`
          : "") +
        (historyFailures
          ? ` History recording failed for ${historyFailures} design(s); those may be included again next time.`
          : "") +
        (inventoryRefreshFailed
          ? " The inventory list could not be refreshed."
          : "");
      setBulkProgress(summary);
    } catch (error) {
      console.error("Bulk QR ZIP download failed:", error);
      setFormError(error?.message || "Unable to create the QR ZIP.");
      setBulkProgress("");
    } finally {
      setBulkDownloading(false);
    }
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

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
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
          // {
          //   label: "Disabled on this page",
          //   value: disabled,
          //   icon: Ban,
          //   tone: "text-red-600 dark:text-red-300",
          // },
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

      <section className="rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
        <div>
          <h2 className="font-semibold">Bulk QR Download</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Each selected QR set can add up to three design files to one ZIP.
            Inventory is fetched in pages of up to 100 sets (the API maximum),
            while your quantity is not page-limited. Designs are rendered
            sequentially; available inventory and browser memory determine the
            practical limit.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <div>
            <label
              htmlFor="bulk-qr-quantity"
              className="mb-1 block text-sm font-medium"
            >
              Quantity (QR sets)
            </label>
            <input
              id="bulk-qr-quantity"
              type="number"
              min="1"
              step="1"
              value={bulkQuantity}
              onChange={(event) => setBulkQuantity(event.target.value)}
              disabled={bulkDownloading}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-[#07111f]"
            />
          </div>

          <div>
            <label
              htmlFor="bulk-qr-file-type"
              className="mb-1 block text-sm font-medium"
            >
              File format
            </label>
            <select
              id="bulk-qr-file-type"
              value={bulkFileType}
              onChange={(event) => setBulkFileType(event.target.value)}
              disabled={bulkDownloading}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-[#07111f]"
            >
              <option value="png">PNG</option>
              <option value="jpg">JPG</option>
              <option value="svg">SVG</option>
              <option value="pdf">PDF</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="bulk-qr-status"
              className="mb-1 block text-sm font-medium"
            >
              QR status
            </label>
            <select
              id="bulk-qr-status"
              value={bulkStatus}
              onChange={(event) => setBulkStatus(event.target.value)}
              disabled={bulkDownloading}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm dark:border-slate-700 dark:bg-[#07111f]"
            >
              <option value="available">Available QR sets</option>
              <option value="assigned">Assigned QR sets</option>
              <option value="">All eligible QR sets</option>
            </select>
          </div>

          <label className="flex items-center gap-2 self-end pb-3 text-sm">
            <input
              type="checkbox"
              checked={skipPreviouslyDownloaded}
              onChange={(event) =>
                setSkipPreviouslyDownloaded(event.target.checked)
              }
              disabled={bulkDownloading}
              className="size-4 accent-cyan-600"
            />
            Skip previously downloaded
          </label>

          <button
            type="button"
            onClick={handleBulkDownload}
            disabled={bulkDownloading || loading}
            className="inline-flex items-center justify-center gap-2 self-end rounded-xl bg-cyan-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {bulkDownloading ? (
              <RefreshCw size={16} className="animate-spin" />
            ) : (
              <Download size={16} />
            )}
            {bulkDownloading ? "Preparing ZIP..." : "Download ZIP"}
          </button>
        </div>

        {bulkProgress && (
          <p
            className="mt-4 text-sm text-cyan-700 dark:text-cyan-300"
            role="status"
          >
            {bulkProgress}
          </p>
        )}
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
                <th className="px-3 py-3 font-semibold">Assigned Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    <RefreshCw size={17} className="mr-2 inline animate-spin" />
                    Loading inventory...
                  </td>
                </tr>
              ) : sets.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
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
