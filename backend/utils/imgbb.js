const FormData = require("form-data");
const sharp = require("sharp");

const getImageUrl = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value.url || value.display_url || value.displayUrl || "";
  }

  return "";
};

/**
 * Optimizes an image buffer using sharp if possible to prevent large payloads
 * from causing network timeouts when uploading to ImgBB.
 */
const optimizeBuffer = async (buffer) => {
  try {
    if (!buffer || buffer.length < 300 * 1024) {
      return { buffer, contentType: "image/jpeg" };
    }

    const image = sharp(buffer, { failOnError: false });
    const metadata = await image.metadata();

    if (!metadata.format || metadata.format === "gif") {
      return { buffer, contentType: metadata.format ? `image/${metadata.format}` : "image/jpeg" };
    }

    const optimized = await image
      .rotate()
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .jpeg({ quality: 85, mozjpeg: true })
      .toBuffer();

    return { buffer: optimized, contentType: "image/jpeg" };
  } catch (error) {
    console.warn("Image optimization skipped, using original buffer:", error.message);
    return { buffer, contentType: "image/jpeg" };
  }
};

/**
 * Uploads an image buffer to ImgBB (https://api.imgbb.com/1/upload).
 *
 * @param {Buffer} imageBuffer - Raw image buffer
 * @param {string} [filename] - Original image filename
 * @param {string} [mimetype] - MIME type of the image
 * @returns {Promise<{url: string, displayUrl: string, deleteUrl: string, thumb: string, filename: string}>}
 */
const uploadToImgBB = async (imageBuffer, filename, mimetype) => {
  if (!imageBuffer) {
    throw new Error("Image buffer is required");
  }

  const apiKey = process.env.IMGBB_API_KEY?.trim();
  const rawApiUrl = process.env.IMGBB_API_URL?.trim() || "https://api.imgbb.com/1/upload";

  if (!apiKey) {
    throw new Error("ImgBB API key is missing (IMGBB_API_KEY)");
  }

  const apiUrl = rawApiUrl.includes("?")
    ? `${rawApiUrl}&key=${encodeURIComponent(apiKey)}`
    : `${rawApiUrl}?key=${encodeURIComponent(apiKey)}`;

  // Optimize buffer to prevent timeout on large uploads
  const { buffer: readyBuffer, contentType } = await optimizeBuffer(imageBuffer);

  const cleanFilename = filename
    ? filename.replace(/[^\w.-]/g, "_")
    : `image_${Date.now()}.jpg`;

  const performUpload = async (timeoutMs = 45000) => {
    const form = new FormData();
    form.append("key", apiKey);
    form.append("image", readyBuffer, {
      filename: cleanFilename,
      contentType: mimetype || contentType || "image/jpeg",
    });
    form.append("name", cleanFilename.replace(/\.[^.]+$/, ""));

    const formBuffer = form.getBuffer();
    const headers = {
      ...form.getHeaders(),
      "Content-Length": String(formBuffer.length),
      Accept: "application/json",
      "User-Agent":
        "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
    };

    const response = await fetch(apiUrl, {
      method: "POST",
      headers,
      body: formBuffer,
      signal: AbortSignal.timeout(timeoutMs),
    });

    const responseText = await response.text();
    let data;

    try {
      data = JSON.parse(responseText);
    } catch {
      if (response.status === 503 || responseText.includes("down for maintenance")) {
        throw new Error(
          "ImgBB service is currently down for maintenance (503 Service Unavailable). Please try again shortly.",
        );
      }
      throw new Error(
        `ImgBB returned an invalid response (HTTP ${response.status}): ${responseText.slice(0, 150)}`,
      );
    }

    if (!response.ok || !data?.success || !data?.data?.url) {
      console.error("ImgBB Error Response:", data);
      throw new Error(
        data?.error?.message || `ImgBB upload failed with status ${response.status}`,
      );
    }

    return {
      url: data.data.url,
      displayUrl: data.data.display_url || data.data.url,
      deleteUrl: data.data.delete_url || "",
      thumb: data.data.thumb?.url || "",
      filename: data.data.image?.filename || cleanFilename,
    };
  };

  try {
    return await performUpload(45000);
  } catch (error) {
    const isTimeout =
      error.name === "TimeoutError" ||
      error.name === "AbortError" ||
      error.message?.includes("timeout") ||
      error.message?.includes("aborted");

    if (isTimeout) {
      throw new Error(
        "ImgBB upload timed out. The ImgBB service (https://api.imgbb.com/1/upload) took too long to respond. Please try again.",
      );
    }

    throw error;
  }
};

module.exports = {
  uploadToImgBB,
  getImageUrl,
};
