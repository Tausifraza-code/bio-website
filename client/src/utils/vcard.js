/**
 * vCard Utility (RFC 2426 compliant)
 * Handles downloading shopkeeper contact card with embedded Base64 profile and banner images,
 * website link, public profile link, business details, etc.
 */

const esc = (value = "") =>
  String(value ?? "")
    .trim()
    .replace(/\\/g, "\\\\")
    .replace(/\r?\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");

/**
 * Fold lines longer than `limit` characters using CRLF + space per RFC 2426.
 */
export const foldLine = (line = "", limit = 72) => {
  if (!line || line.length <= limit) return line;
  const chunks = [];
  for (let i = 0; i < line.length; i += limit) {
    chunks.push(line.slice(i, i + limit));
  }
  return chunks.join("\r\n ");
};

/**
 * Resizes an image Blob via HTML Canvas and converts to standard JPEG Base64.
 * This guarantees:
 * 1. Compact file size (avoids megabyte-sized vCards that crash phonebook apps).
 * 2. Uniform JPEG encoding supported by iOS Contacts, Google Contacts, Outlook, etc.
 */
const resizeBlobToBase64 = (blob, maxDim = 400) => {
  return new Promise((resolve) => {
    const blobUrl = URL.createObjectURL(blob);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(blobUrl);
      try {
        let width = img.naturalWidth || img.width || maxDim;
        let height = img.naturalHeight || img.height || maxDim;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");

        // White background for transparent PNG/WebP before converting to JPEG
        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];

        resolve({
          imageType: "JPEG",
          base64: base64.replace(/\s+/g, ""),
        });
      } catch {
        // Fallback: convert original blob directly if canvas fails
        fallbackFileReader(blob, resolve);
      }
    };

    img.onerror = () => {
      URL.revokeObjectURL(blobUrl);
      fallbackFileReader(blob, resolve);
    };

    img.src = blobUrl;
  });
};

const fallbackFileReader = (blob, resolve) => {
  try {
    const reader = new FileReader();
    reader.onload = () => {
      const result = String(reader.result || "");
      const mime = blob.type || "image/jpeg";
      let type = mime.split("/")[1]?.toUpperCase() || "JPEG";
      if (type === "JPG") type = "JPEG";
      const base64 = result.split(",")[1] || "";
      resolve({
        imageType: type,
        base64: base64.replace(/\s+/g, ""),
      });
    };
    reader.onerror = () => resolve(null);
    reader.readAsDataURL(blob);
  } catch {
    resolve(null);
  }
};

/**
 * Loads an image via HTMLImageElement and converts to Base64 via Canvas.
 * First tries with crossOrigin=anonymous; if canvas is tainted, retries without CORS attribute.
 */
const convertImageSrcToBase64 = (src, maxDim = 400) => {
  return new Promise((resolve) => {
    const drawToBase64 = (img) => {
      try {
        let width = img.naturalWidth || img.width || maxDim;
        let height = img.naturalHeight || img.height || maxDim;

        if (width > maxDim || height > maxDim) {
          if (width > height) {
            height = Math.round((height * maxDim) / width);
            width = maxDim;
          } else {
            width = Math.round((width * maxDim) / height);
            height = maxDim;
          }
        }

        const canvas = document.createElement("canvas");
        canvas.width = Math.max(1, width);
        canvas.height = Math.max(1, height);
        const ctx = canvas.getContext("2d");

        ctx.fillStyle = "#ffffff";
        ctx.fillRect(0, 0, width, height);
        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL("image/jpeg", 0.85);
        const base64 = dataUrl.split(",")[1];

        return {
          imageType: "JPEG",
          base64: base64.replace(/\s+/g, ""),
        };
      } catch {
        return null;
      }
    };

    // Attempt 1: with crossOrigin=anonymous (needed for CORS-enabled hosts)
    const imgWithCors = new Image();
    imgWithCors.crossOrigin = "anonymous";

    imgWithCors.onload = () => {
      const result = drawToBase64(imgWithCors);
      if (result) {
        resolve(result);
      } else {
        // Canvas tainted — retry without crossOrigin (can still draw but toDataURL may fail on some browsers)
        const imgNoCors = new Image();
        imgNoCors.onload = () => {
          const r2 = drawToBase64(imgNoCors);
          resolve(r2); // null if still fails
        };
        imgNoCors.onerror = () => resolve(null);
        imgNoCors.src =
          src + (src.includes("?") ? "&" : "?") + "_nc=" + Date.now();
      }
    };

    imgWithCors.onerror = () => {
      // Server may not support crossOrigin — try without it
      const imgNoCors = new Image();
      imgNoCors.onload = () => {
        const result = drawToBase64(imgNoCors);
        resolve(result);
      };
      imgNoCors.onerror = () => resolve(null);
      imgNoCors.src = src;
    };

    imgWithCors.src = src;
  });
};

/**
 * Fetches an image (from URL, relative path, or Data URL) and returns its Base64 representation.
 * Returns { imageType: "JPEG", base64: string } or null.
 */
export const getImageBase64 = async (imageUrl, maxDim = 400) => {
  if (!imageUrl || typeof imageUrl !== "string") return null;

  const cleanUrl = imageUrl.trim();
  if (!cleanUrl) return null;

  // 1. Data URL
  if (cleanUrl.startsWith("data:image/")) {
    try {
      const match = cleanUrl.match(
        /^data:image\/([a-zA-Z0-9+.-]+);base64,(.+)$/,
      );
      if (match) {
        let type = match[1].toUpperCase();
        if (type === "JPG") type = "JPEG";

        // If it's already standard JPEG or PNG and not overly giant, return it
        if (type === "JPEG" || type === "PNG") {
          return {
            imageType: type,
            base64: match[2].replace(/\s+/g, ""),
          };
        }
        // Otherwise resize/convert to JPEG via Image+Canvas
        return await convertImageSrcToBase64(cleanUrl, maxDim);
      }
    } catch {
      // Ignore parsing error
    }
  }

  // 2. Resolve relative URL if needed
  let resolvedUrl = cleanUrl;
  if (typeof window !== "undefined") {
    if (cleanUrl.startsWith("//")) {
      resolvedUrl = `${window.location.protocol}${cleanUrl}`;
    } else if (cleanUrl.startsWith("/")) {
      resolvedUrl = `${window.location.origin}${cleanUrl}`;
    }
  }

  // 3. Try fetch with CORS
  try {
    const res = await fetch(resolvedUrl, { mode: "cors" });
    if (res.ok) {
      const blob = await res.blob();
      const result = await resizeBlobToBase64(blob, maxDim);
      if (result) return result;
    }
  } catch {
    // Fetch failed (e.g. CORS restrictions on remote asset), continue to fallback
  }

  // 4. Fallback via Image element
  try {
    const result = await convertImageSrcToBase64(resolvedUrl, maxDim);
    if (result) return result;
  } catch {
    // Image fallback failed
  }

  return null;
};

/**
 * Generates and triggers the download of a .vcf (vCard 3.0) file.
 * Includes:
 * - Dukandar full name / display name
 * - Business name (ORG)
 * - Job title / Headline (TITLE)
 * - Mobile / Phone (TEL)
 * - Email (EMAIL)
 * - Work Address (ADR)
 * - Website URL (URL)
 * - Public Profile URL (URL;TYPE=PROFILE and X-BIO-PROFILE-URL)
 * - About / Bio / Headline (NOTE)
 * - Actual Profile Image (PHOTO;ENCODING=b;TYPE=JPEG:<base64>)
 * - Actual Banner Image (LOGO;ENCODING=b;TYPE=JPEG:<base64> and X-BIO-BANNER;...)
 */
export const downloadVCardContact = async ({
  profile = {},
  businessInfo = {},
  publicProfileUrl = "",
}) => {
  const p = profile || {};
  const b = businessInfo || {};

  const firstName = (p.firstName || "").trim();
  const lastName = (p.lastName || "").trim();
  const fullName = [firstName, lastName].filter(Boolean).join(" ").trim();

  const businessName = (
    p.businessName ||
    b.businessName ||
    b.name ||
    ""
  ).trim();

  const displayName = fullName || businessName || "Contact";

  const lines = ["BEGIN:VCARD", "VERSION:3.0"];

  // Display Name & Structured Name
  lines.push(`FN;CHARSET=UTF-8:${esc(displayName)}`);
  lines.push(`N;CHARSET=UTF-8:${esc(lastName)};${esc(firstName)};;;`);

  // Business Name / Organization
  if (businessName) {
    lines.push(`ORG;CHARSET=UTF-8:${esc(businessName)}`);
  }

  // Job Title / Headline
  const jobTitle = (p.jobTitle || p.headline || b.title || b.role || "").trim();
  if (jobTitle) {
    lines.push(`TITLE;CHARSET=UTF-8:${esc(jobTitle)}`);
  }

  // Phone Number
  const phone = (p.phone || b.phone || "").trim();
  if (phone) {
    lines.push(`TEL;TYPE=CELL,VOICE:${esc(phone)}`);
  }

  // WhatsApp (if different from primary phone)
  const whatsapp = (p.whatsapp || b.whatsapp || "").trim();
  if (whatsapp && whatsapp !== phone) {
    lines.push(`item1.TEL:${esc(whatsapp)}`);
    lines.push(`item1.X-ABLabel:WhatsApp`);
  }

  // Email
  const email = (p.email || b.email || "").trim();
  if (email) {
    lines.push(`item2.EMAIL;TYPE=INTERNET,pref:${esc(email)}`);
    lines.push(`item2.X-ABLabel:Email`);
  }

  // Website Link (agar alag website di hai toh)
  const websiteRaw = (
    p.website ||
    p.websiteUrl ||
    b.website ||
    b.websiteUrl ||
    ""
  ).trim();

  let websiteUrl = "";
  if (websiteRaw) {
    websiteUrl = /^https?:\/\//i.test(websiteRaw)
      ? websiteRaw
      : `https://${websiteRaw}`;
    lines.push(`item3.URL;TYPE=WORK:${esc(websiteUrl)}`);
    lines.push(`item3.X-ABLabel:Website`);
  }

  // Public Profile Link (Digital Card)
  let publicUrl = (publicProfileUrl || p.qrUrl || b.qrTargetUrl || "").trim();

  if (!publicUrl && p.subdomain && typeof window !== "undefined") {
    publicUrl = `${window.location.origin}/card-preview/${encodeURIComponent(
      p.subdomain,
    )}`;
  } else if (!publicUrl && typeof window !== "undefined") {
    publicUrl = window.location.href.split("?")[0];
  }

  if (publicUrl) {
    const formattedPublicUrl = /^https?:\/\//i.test(publicUrl)
      ? publicUrl
      : `https://${publicUrl}`;

    // Public Profile URL - specifically labeled as "Profile"
    const profileGroup = websiteUrl ? "item4" : "item3";

    lines.push(`${profileGroup}.URL;TYPE=OTHER:${esc(formattedPublicUrl)}`);
    lines.push(`${profileGroup}.X-ABLabel:Profile`);
  }

  // Address
  const streetParts = [
    p.shopUnit || b.shopUnit,
    p.area || b.area,
    p.landmark || b.landmark,
  ].filter(Boolean);

  const street = streetParts.join(", ").trim();
  const city = (p.city || b.city || "").trim();
  const state = (p.state || b.state || "").trim();
  const pincode = (p.pincode || b.pincode || "").trim();

  if (street || city || state || pincode) {
    lines.push(
      `ADR;TYPE=WORK;CHARSET=UTF-8:;;${esc(street)};${esc(city)};${esc(
        state,
      )};${esc(pincode)};India`,
    );
  } else if (b.address && b.address !== "Address not added") {
    lines.push(`ADR;TYPE=WORK;CHARSET=UTF-8:;;${esc(b.address)};;;;`);
  }

  // About / Bio / Headline
  const about = (p.bio || p.headline || b.about || b.bio || "").trim();
  if (about) {
    lines.push(`NOTE;CHARSET=UTF-8:${esc(about)}`);
  }

  // Actual Profile Image
  const profileImageUrl =
    p.avatar ||
    p.profileImage ||
    p.logo ||
    b.avatar ||
    b.profileImage ||
    b.logo ||
    "";

  if (profileImageUrl && !profileImageUrl.startsWith("data:")) {
    // Strategy 1: Try to embed as Base64 (best compatibility with phonebook apps)
    let embeddedSuccessfully = false;
    try {
      const profileImageObj = await getImageBase64(profileImageUrl, 400);
      if (profileImageObj && profileImageObj.base64) {
        lines.push(
          foldLine(
            `PHOTO;ENCODING=b;TYPE=${profileImageObj.imageType}:${profileImageObj.base64}`,
          ),
        );
        embeddedSuccessfully = true;
      }
    } catch (err) {
      console.warn("Base64 embedding failed, falling back to URL:", err);
    }

    // Strategy 2: If Base64 fails (CORS etc.), embed as URL — Google Contacts, iOS Contacts support this
    if (!embeddedSuccessfully) {
      const resolvedPhotoUrl = /^https?:\/\//i.test(profileImageUrl)
        ? profileImageUrl
        : `${window.location.origin}${profileImageUrl}`;
      lines.push(`PHOTO;VALUE=URI:${resolvedPhotoUrl}`);
    }
  } else if (profileImageUrl && profileImageUrl.startsWith("data:")) {
    // Data URL — embed directly as Base64
    try {
      const profileImageObj = await getImageBase64(profileImageUrl, 400);
      if (profileImageObj && profileImageObj.base64) {
        lines.push(
          foldLine(
            `PHOTO;ENCODING=b;TYPE=${profileImageObj.imageType}:${profileImageObj.base64}`,
          ),
        );
      }
    } catch (err) {
      console.warn("Failed embedding data URL profile photo in vCard:", err);
    }
  }

  // Banner image intentionally excluded from vCard — only profile photo (PHOTO) is embedded.

  lines.push("END:VCARD");

  // Create Blob and trigger download
  const blob = new Blob([`${lines.join("\r\n")}\r\n`], {
    type: "text/vcard;charset=utf-8",
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;

  const rawFilename = displayName || businessName || "contact";
  const cleanFilename =
    rawFilename
      .replace(/[<>:"/\\|?*]/g, "-")
      .replace(/[\x00-\x1F]/g, "")
      .replace(/\s+/g, "_")
      .trim() || "contact";

  anchor.download = `${cleanFilename}.vcf`;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();

  setTimeout(() => URL.revokeObjectURL(url), 1500);

  return { success: true, fileName: `${cleanFilename}.vcf` };
};
