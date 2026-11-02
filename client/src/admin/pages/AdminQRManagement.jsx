import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import QRCode from "qrcode";
import { jsPDF } from "jspdf";
import JSZip from "jszip";
import * as XLSX from "xlsx";
import {
  siInstagram,
  siFacebook,
  siWhatsapp,
  siYoutube,
  siX,
} from "simple-icons";
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
  deactivatePhysicalQR,
  activatePhysicalQR,
  fetchPhysicalQRInventory,
} from "../../redux/slice/adminQRSlice";
import api from "../../redux/api";
import { getPublicQRUrl } from "../../utils/qrUrl";

const statusStyles = {
  available:
    "bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300",
  assigned: "bg-cyan-50 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300",
  disabled: "bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-300",
};

const qrFormatOptions = [
  { value: "standee", label: "Standee" },
  { value: "pocket", label: "Pocket Card" },
  { value: "keychain", label: "Keychain" },
];

const qrFormatLabels = {
  standee: "Standee",
  pocket: "Pocket Card",
  keychain: "Keychain",
};

// New records have one format; legacy records use the formats array.
const getItemFormats = (item) => {
  if (item?.format) {
    return [item.format];
  }

  return Array.isArray(item?.formats)
    ? item.formats.filter((format) =>
        qrFormatOptions.some((option) => option.value === format),
      )
    : [];
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
      getItemFormats(item)
        .map((format) => formatNames[format] || format)
        .join(", ") || "—",
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
      margin: 3,
      width: 2400,
      color: {
        dark: "#102C35",
        light: "#FFFFFF",
      },
    });

    const layouts = {
      standee: {
        width: 900,
        height: 1273,
        qrSize: 440,
        activationX: 735,
        activationY: 620,
        socialY: 1010,
        socialSize: 29,
        socialGap: 95,
        footerY: 1160,
      },
      pocket: {
        width: 1011,
        height: 638,
        qrSize: 200,
        activationX: 850,
        activationY: 320,
        activationWidth: 175,
        socialY: 500,
        socialSize: 20,
        socialGap: 82,
        footerY: 640,
      },
      keychain: {
        width: 600,
        height: 600,
        qrSize: 190,
        activationX: 510,
        activationY: 300,
        activationWidth: 110,
        socialY: 465,
        socialSize: 17,
        socialGap: 48,
        footerY: 590,
      },
    };

    const layout = layouts[format];
    if (!layout) throw new Error("Invalid QR design format.");

    const headingPositions = {
      standee: {
        title: 315,
        subtitle: 350,
      },
      pocket: {
        title: 155,
        subtitle: 185,
      },
      keychain: {
        title: 155,
        subtitle: 185,
      },
    };

    const headingY = headingPositions[format];

    const qrPositions = {
      standee: 405,
      pocket: 220,
      keychain: 220,
    };

    const qrY = qrPositions[format];

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
    const qrBottom = qrY + qrSize;

    const formatPositions = {
      pocket: {
        connectTextY: qrBottom + 42,
        socialIconsY: qrBottom + 90,
      },
      keychain: {
        connectTextY: qrBottom + 42,
        socialIconsY: qrBottom + 90,
      },
    };

    const formatPosition = formatPositions[format];
    const connectTextY = formatPosition?.connectTextY ?? qrBottom + 57;
    const socialIconsY = formatPosition?.socialIconsY ?? layout.socialY;

    // Brand-style SVG icons with their labels.

    const socialItems = [
      {
        name: "Save Contact",
        color: "#0F766E",
        path: `
      <rect x="-12" y="-13" width="24" height="26" rx="3"
        fill="none" stroke="#fff" stroke-width="2.5"/>
      <circle cx="-3" cy="-5" r="4"
        fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M-10 7 C-10 0 4 0 4 7"
        fill="none" stroke="#fff" stroke-width="2"/>
      <path d="M7 -5 V5 M2 0 H12"
        fill="none" stroke="#fff" stroke-width="2.5"
        stroke-linecap="round"/>
    `,
      },
      { name: "Instagram", color: "#E4405F", icon: siInstagram },
      {
        name: "LinkedIn",
        color: "#0A66C2",
        path: `
      <path fill="#fff" d="
        M-12 -7 H-7 V11 H-12 Z
        M-12 -13 H-7 V-9 H-12 Z
        M-3 -7 H2 V-4
        C4 -9 13 -9 13 -1 V11 H8 V1
        C8 -4 2 -4 2 1 V11 H-3 Z"/>
    `,
      },
      { name: "Facebook", color: "#1877F2", icon: siFacebook },
      { name: "WhatsApp", color: "#25D366", icon: siWhatsapp },
      { name: "YouTube", color: "#FF0000", icon: siYoutube },
      { name: "X", color: "#111827", icon: siX },
    ];

    const socialStartX =
      W / 2 - ((socialItems.length - 1) * layout.socialGap) / 2;

    const socialIcons = socialItems
      .map((social, index) => {
        const x = socialStartX + index * layout.socialGap;
        const y = socialIconsY;

        return `
 <g transform="translate(${x}, ${y})">
  <circle r="${layout.socialSize}" fill="${social.color}"/>
  ${
    social.icon
      ? `
      <svg
        x="-12"
        y="-12"
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <path d="${social.icon.path}" fill="#ffffff" />
      </svg>
    `
      : `
      <g transform="scale(${layout.socialSize / 29})">
        ${social.path}
      </g>
    `
  }

            <text
              x="0"
              y="${layout.socialSize + (format === "standee" ? 24 : 17)}"
              text-anchor="middle"
              font-family="Arial,sans-serif"
              font-size="${
                format === "standee" ? 14 : format === "pocket" ? 10 : 7
              }"
              font-weight="700"
              fill="#10243A"
            >${social.name}</text>
          </g>
        `;
      })
      .join("");

    const activationCodeText = `
      <g transform="translate(${layout.activationX}, ${layout.activationY}) rotate(90)">
        <text
        x="${format === "standee" ? -72 : format === "pocket" ? -75 : -55}"
          y="0"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 13 : format === "pocket" ? 10 : 7}"
          font-weight="700"
          fill="#1D4ED8"
        >ACTIVATION CODE</text>

        <text
          x="${format === "standee" ? 72 : format === "pocket" ? 75 : 55}"
          y="0"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 15 : format === "pocket" ? 11 : 8}"
          font-weight="700"
          fill="#10243A"
        >${escapeXml(activationCode)}</text>
      </g>
    `;

    const footerCurve = `
      <path
        d="M0 ${layout.footerY}
           Q${W / 2} ${layout.footerY - 75} ${W} ${layout.footerY}
           V${H} H0 Z"
        fill="url(#footerGradient)"
      />

      <path
        d="M0 ${layout.footerY}
           Q${W / 2} ${layout.footerY - 75} ${W} ${layout.footerY}"
        fill="none"
        stroke="#67E8F9"
        stroke-width="${format === "standee" ? 5 : 3}"
      />
    `;

    const footerTextY = {
      standee: 1210,
      pocket: 620,
      keychain: 580,
    }[format];

    const svg = `
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="${W}"
        height="${H}"
        viewBox="0 0 ${W} ${H}"
      >

        <defs>
          <linearGradient id="headerGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stop-color="#103E91"/>
            <stop offset="100%" stop-color="#1765CF"/>
          </linearGradient>

          <linearGradient id="footerGradient" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stop-color="#103E91"/>
            <stop offset="100%" stop-color="#1765CF"/>
          </linearGradient>

          <filter id="qrShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="7" stdDeviation="9"
              flood-color="#0F2945" flood-opacity=".12"/>
          </filter>
        </defs>

        <rect width="${W}" height="${H}" fill="#F3F7FC"/>

        <!-- Premium curved header -->
        <path
          d="M0 0 H${W} V${Math.round(H * 0.1)}
          Q${W / 2} ${Math.round(H * 0.18)} 0 ${Math.round(H * 0.1)} Z"
          fill="url(#headerGradient)"
        />

        <text
          x="${W / 2}"
          y="${format === "standee" ? 95 : format === "pocket" ? 55 : 48}"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 49 : 34}"
          font-weight="700"
          fill="#ffffff"
        >BIO SITE</text>

        <!-- Main heading -->
        <text
          x="${W / 2}"
          y="${headingY.title}"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 43 : format === "pocket" ? 30 : 27}"
          font-weight="700"
          fill="#164A9B"
        >SCAN TO CONNECT</text>

        <text
          x="${W / 2}"
          y="${headingY.subtitle}"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 22 : format === "pocket" ? 19 : 16}"
          fill="#1765A8"
        >One scan. Instant connection.</text>

        <!-- QR card -->
        <rect
          x="${qrX - 25}"
          y="${qrY - 25}"
          width="${qrSize + 50}"
          height="${qrSize + 50}"
          rx="26"
          fill="#ffffff"
          stroke="#D5E7FC"
          stroke-width="4"
          filter="url(#qrShadow)"
        />

        <rect
          x="${qrX - 12}"
          y="${qrY - 12}"
          width="${qrSize + 24}"
          height="${qrSize + 24}"
          rx="13"
          fill="none"
          stroke="#1765CF"
          stroke-width="3"
        />

        <image
          href="${qrDataUrl}"
          x="${qrX}"
          y="${qrY}"
          width="${qrSize}"
          height="${qrSize}"
          preserveAspectRatio="xMidYMid meet"
        />

        <!-- QR caption -->
        <text
          x="${W / 2}"
          y="${connectTextY}"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 24 : 16}"
          font-weight="700"
          fill="#10243A"
        >Connect with us</text>

        <!-- Vertical activation code, without a panel -->
        ${activationCodeText}

        <!-- Premium curved footer background -->
        ${footerCurve}

        <!-- Social media logos and labels -->
        ${socialIcons}

        <text
          x="${W / 2}"
          y="${footerTextY}"
          text-anchor="middle"
          font-family="Arial,sans-serif"
          font-size="${format === "standee" ? 34 : 20}"
          font-style="italic"
          font-weight="700"
          fill="#ffffff"
        >Scan &amp; Connect</text>

        <!-- Footer curve accent -->
        <path
          d="M0 ${layout.footerY}
             Q${W / 2} ${layout.footerY - 75} ${W} ${layout.footerY}"
          fill="none"
          stroke="#67E8F9"
          stroke-width="${format === "standee" ? 5 : 3}"
        />

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
      const exportScale = 3;
      canvas.width = W * exportScale;
      canvas.height = H * exportScale;

      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas is unavailable.");

      context.setTransform(exportScale, 0, 0, exportScale, 0, 0);
      context.imageSmoothingEnabled = true;
      context.imageSmoothingQuality = "high";
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
  const [actionLoadingId, setActionLoadingId] = useState("");
  const [copiedValue, setCopiedValue] = useState("");
  const [bulkDownloading, setBulkDownloading] = useState(false);
  const [bulkQuantity, setBulkQuantity] = useState("100");
  const [bulkFileType, setBulkFileType] = useState("png");
  const [bulkStatus, setBulkStatus] = useState("available");
  const [skipPreviouslyDownloaded, setSkipPreviouslyDownloaded] =
    useState(true);
  const [bulkProgress, setBulkProgress] = useState("");

  const [selectedFormats, setSelectedFormats] = useState([
    "standee",
    "pocket",
    "keychain",
  ]);

  const [bulkFormats, setBulkFormats] = useState([
    "standee",
    "pocket",
    "keychain",
  ]);

  const loadInventory = useCallback(() => {
    return dispatch(
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

  const handlePhysicalQRStatusChange = async (item) => {
    try {
      setActionLoadingId(item._id);

      if (item.status === "disabled") {
        await dispatch(activatePhysicalQR(item._id)).unwrap();
      } else {
        await dispatch(deactivatePhysicalQR(item._id)).unwrap();
      }

      await loadInventory();
    } catch (error) {
      setFormError(
        typeof error === "string"
          ? error
          : error?.message || "Unable to update QR status.",
      );
    } finally {
      setActionLoadingId("");
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

    if (selectedFormats.length === 0) {
      setFormError("Please select at least one QR format.");
      return;
    }

    const result = await dispatch(
      generateQRBatch({
        count: amount,
        formats: selectedFormats,
      }),
    );

    if (generateQRBatch.fulfilled.match(result)) {
      setPage(1);
      setStatus("available");
      setSearch("");
      setSearchInput("");

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
      setFormError(
        "Enter a positive whole number for the QR code quantity per format.",
      );
      return;
    }

    if (bulkFormats.length === 0) {
      setFormError("Please select at least one format for bulk download.");
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
      const selectedSetMap = new Map();
      const selectedCounts = Object.fromEntries(
        bulkFormats.map((format) => [format, 0]),
      );
      let missingQRPaths = 0;
      const addEligibleSets = (items) => {
        for (const item of items) {
          if (item.status === "disabled") continue;
          if (!item.qrPath) {
            missingQRPaths += 1;
            continue;
          }

          const availableFormats = getItemFormats(item);
          const setId = String(item._id);
          for (const format of availableFormats) {
            if (!bulkFormats.includes(format)) continue;
            if (selectedCounts[format] >= requestedQuantity) continue;
            if (
              skipPreviouslyDownloaded &&
              isDesignAlreadyDownloaded(item, format, bulkFileType)
            ) {
              continue;
            }

            let selection = selectedSetMap.get(setId);
            if (!selection) {
              selection = {
                item,
                formats: [],
              };

              selectedSetMap.set(setId, selection);
              selectedSets.push(selection);
            }

            if (selection.formats.includes(format)) continue;

            selection.formats.push(format);
            selectedCounts[format] += 1;
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

      const formatSummary = bulkFormats
        .map(
          (format) =>
            `${qrFormatLabels[format]}: ${selectedCounts[format]}/${requestedQuantity}`,
        )
        .join(", ");

      const incompleteFormats = bulkFormats.filter(
        (format) => selectedCounts[format] < requestedQuantity,
      );

      const summary =
        `Download complete: ${formatSummary}. ` +
        `${successfullyAdded.length} design file(s) added to ZIP.` +
        (failedDesigns
          ? ` ${failedDesigns} design(s) could not be generated.`
          : "") +
        (incompleteFormats.length
          ? " Some selected formats had fewer eligible records than requested."
          : "") +
        (missingQRPaths
          ? ` ${missingQRPaths} QR record(s) were skipped because their QR path is missing.`
          : "") +
        (historyFailures
          ? ` History recording failed for ${historyFailures} design(s).`
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

      <section className="grid grid-cols-1 gap-5 lg:grid-cols-3">
        <form
          onSubmit={handleGenerate}
          className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728] lg:col-span-2"
        >
          <div className="flex items-start gap-3">
            <div className="rounded-xl bg-cyan-50 p-3 text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300">
              <PackagePlus size={22} />
            </div>
            <div>
              <h2 className="font-semibold">Generate Independent QR Codes</h2>
              <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                Select the formats you want to generate. Each format gets its
                own serial number, activation code and QR destination.
              </p>
            </div>
          </div>

          <div className="mt-5 grid grid-cols-1 items-end gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="min-w-0">
              <label
                htmlFor="qr-count"
                className="mb-2 block text-sm font-medium"
              >
                Number of QR codes per selected format
              </label>
              <input
                id="qr-count"
                type="number"
                min="1"
                max="1000"
                step="1"
                value={count}
                onChange={(event) => setCount(event.target.value)}
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-4 py-3 outline-none focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 dark:border-slate-700 dark:bg-[#07111f]"
              />
            </div>

            <button
              type="submit"
              disabled={generating}
              className="w-full rounded-xl bg-cyan-500 px-5 py-3 font-semibold text-white transition hover:bg-cyan-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
            >
              {generating ? "Generating..." : "Generate QR"}
            </button>
          </div>

          <div className="mt-6">
            <p className="mb-3 text-sm font-semibold">Select QR formats</p>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3 dark:border-cyan-800 dark:bg-cyan-500/10">
                <input
                  type="checkbox"
                  checked={selectedFormats.length === qrFormatOptions.length}
                  onChange={(event) =>
                    setSelectedFormats(
                      event.target.checked
                        ? qrFormatOptions.map((option) => option.value)
                        : [],
                    )
                  }
                  disabled={generating}
                  className="size-4 shrink-0 accent-cyan-600"
                />
                <span className="text-sm font-semibold">All Formats</span>
              </label>

              {qrFormatOptions.map((format) => (
                <label
                  key={format.value}
                  className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 transition hover:border-cyan-400 dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(format.value)}
                    onChange={(event) =>
                      setSelectedFormats((current) =>
                        event.target.checked
                          ? [...current, format.value]
                          : current.filter((item) => item !== format.value),
                      )
                    }
                    disabled={generating}
                    className="size-4 shrink-0 accent-cyan-600"
                  />

                  <span className="text-sm font-medium">{format.label}</span>
                </label>
              ))}
            </div>

            <p className="mt-3 text-xs leading-relaxed text-slate-500 dark:text-slate-400">
              Example: Quantity 100 + All Formats = 300 independent QR codes.
            </p>
          </div>
        </form>

        <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 dark:border-slate-800 dark:bg-[#0b1728]">
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

      <section className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-[#0b1728] sm:p-5">
        <div>
          <h2 className="font-semibold">Bulk QR Download</h2>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            Select designs and set a quantity for each format. Inventory is
            fetched in pages of up to 100 QR codes (the API maximum), while your
            quantity is not page-limited. Designs are rendered sequentially;
            available inventory and browser memory determine the practical
            limit.
          </p>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-4 min-[360px]:grid-cols-2 lg:grid-cols-4">
          <div className="min-w-0">
            <label
              htmlFor="bulk-qr-quantity"
              className="mb-1 block text-sm font-medium"
            >
              Quantity per selected format
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

          <div className="min-w-0">
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

          <div className="min-w-0 min-[360px]:col-span-2 lg:col-span-1">
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

          <div className="min-[360px]:col-span-2 lg:col-span-4">
            <p className="mb-3 text-sm font-semibold">
              Select designs for ZIP download
            </p>

            <div className="mb-3 grid grid-cols-1 gap-2 min-[360px]:grid-cols-2 sm:grid-cols-4">
              <label className="flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-cyan-200 bg-cyan-50/70 p-3 text-sm font-medium dark:border-cyan-800 dark:bg-cyan-500/10">
                <input
                  type="checkbox"
                  checked={bulkFormats.length === qrFormatOptions.length}
                  onChange={(event) =>
                    setBulkFormats(
                      event.target.checked
                        ? qrFormatOptions.map((option) => option.value)
                        : [],
                    )
                  }
                  disabled={bulkDownloading}
                  className="size-4 shrink-0 accent-cyan-600"
                />
                <span className="min-w-0 leading-tight">All Formats</span>
              </label>

              {qrFormatOptions.map((format) => (
                <label
                  key={format.value}
                  className="flex min-w-0 cursor-pointer items-center gap-2 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700"
                >
                  <input
                    type="checkbox"
                    checked={bulkFormats.includes(format.value)}
                    onChange={(event) =>
                      setBulkFormats((current) =>
                        event.target.checked
                          ? [...current, format.value]
                          : current.filter((item) => item !== format.value),
                      )
                    }
                    disabled={bulkDownloading}
                    className="size-4 shrink-0 accent-cyan-600"
                  />
                  <span className="min-w-0 leading-tight">{format.label}</span>
                </label>
              ))}
            </div>
          </div>

          <label className="flex min-w-0 cursor-pointer items-center gap-3 rounded-xl border border-slate-200 p-3 text-sm dark:border-slate-700 min-[360px]:col-span-2 lg:col-span-1">
            <input
              type="checkbox"
              checked={skipPreviouslyDownloaded}
              onChange={(event) =>
                setSkipPreviouslyDownloaded(event.target.checked)
              }
              disabled={bulkDownloading}
              className="size-4 shrink-0 accent-cyan-600"
            />
            Skip previously downloaded
          </label>

          <button
            type="button"
            onClick={handleBulkDownload}
            disabled={bulkDownloading || loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-cyan-500 px-4 py-3 text-sm font-semibold text-white transition hover:bg-cyan-600 disabled:cursor-not-allowed disabled:opacity-50 min-[360px]:col-span-2 lg:col-span-1"
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
        <div className="flex flex-col gap-4 border-b border-slate-200 p-5 dark:border-slate-800 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <h2 className="font-semibold">QR Inventory</h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Search, filter and review generated QR sets.
            </p>
          </div>

          <div className="flex w-full min-w-0 flex-col gap-3 sm:flex-row xl:flex-1">
            <form onSubmit={handleSearch} className="relative min-w-0 flex-1">
              <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
              />
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder="Search Set ID or business"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white py-2.5 pl-9 pr-3 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-[#07111f]"
              />
            </form>

            <div className="w-full min-w-0 sm:w-44 sm:flex-none">
              <select
                value={status}
                onChange={handleStatusChange}
                aria-label="Filter QR status"
                className="w-full min-w-0 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm outline-none focus:border-cyan-500 dark:border-slate-700 dark:bg-[#07111f]"
              >
                <option value="">All statuses</option>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
              </select>
            </div>
          </div>
        </div>

        {/* Desktop/tablet inventory */}
        <div className="hidden overflow-x-auto md:block">
          <table className="w-full min-w-[1200px] text-left text-sm">
            <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500 dark:bg-slate-800/50 dark:text-slate-400">
              <tr>
                <th className="px-3 py-3 font-semibold">Set ID</th>
                <th className="px-3 py-3 font-semibold">QR Format</th>
                <th className="px-3 py-3 font-semibold">Activation Code</th>
                <th className="px-3 py-3 font-semibold">Business / QR Path</th>
                <th className="px-3 py-3 font-semibold">Status</th>
                <th className="px-3 py-3 font-semibold">Assigned Date</th>
                <th className="px-3 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {loading ? (
                <tr>
                  <td
                    colSpan={7}
                    className="px-5 py-14 text-center text-slate-500"
                  >
                    <RefreshCw size={17} className="mr-2 inline animate-spin" />
                    Loading inventory...
                  </td>
                </tr>
              ) : sets.length === 0 ? (
                <tr>
                  <td
                    colSpan={7}
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
                      <div className="flex flex-wrap gap-1.5">
                        {getItemFormats(item).length
                          ? getItemFormats(item).map((format) => (
                              <span
                                key={format}
                                className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                              >
                                {qrFormatLabels[format] || format}
                              </span>
                            ))
                          : "—"}
                      </div>
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
                    <td className="whitespace-nowrap px-3 py-3">
                      <button
                        type="button"
                        onClick={() => handlePhysicalQRStatusChange(item)}
                        disabled={actionLoadingId === item._id}
                        className={`rounded-lg px-3 py-2 text-xs font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                          item.status === "disabled"
                            ? "bg-emerald-600 hover:bg-emerald-700"
                            : "bg-red-600 hover:bg-red-700"
                        }`}
                      >
                        {actionLoadingId === item._id
                          ? "Please wait..."
                          : item.status === "disabled"
                            ? "Activate"
                            : "Deactivate"}
                      </button>
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
                <div className="mt-3">
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    QR Format
                  </p>

                  <div className="mt-1 flex flex-wrap gap-1.5">
                    {getItemFormats(item).length
                      ? getItemFormats(item).map((format) => (
                          <span
                            key={format}
                            className="rounded-full bg-cyan-50 px-2.5 py-1 text-xs font-semibold text-cyan-700 dark:bg-cyan-500/10 dark:text-cyan-300"
                          >
                            {qrFormatLabels[format] || format}
                          </span>
                        ))
                      : "—"}
                  </div>
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
                <button
                  type="button"
                  onClick={() => handlePhysicalQRStatusChange(item)}
                  disabled={actionLoadingId === item._id}
                  className={`mt-4 w-full rounded-lg px-3 py-2.5 text-sm font-semibold text-white transition disabled:cursor-not-allowed disabled:opacity-50 ${
                    item.status === "disabled"
                      ? "bg-emerald-600 hover:bg-emerald-700"
                      : "bg-red-600 hover:bg-red-700"
                  }`}
                >
                  {actionLoadingId === item._id
                    ? "Please wait..."
                    : item.status === "disabled"
                      ? "Activate"
                      : "Deactivate"}
                </button>
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
