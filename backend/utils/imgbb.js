const getImageUrl = (value) => {
  if (!value) return "";

  if (typeof value === "string") return value;

  if (typeof value === "object") {
    return value.url || value.display_url || value.displayUrl || "";
  }

  return "";
};

const uploadToImgBB = async (imageBuffer, filename) => {
  if (!imageBuffer) {
    throw new Error("Image buffer is required");
  }

  if (!process.env.IMGBB_API_KEY || !process.env.IMGBB_API_URL) {
    throw new Error("ImgBB configuration is missing from .env");
  }

  const formData = new URLSearchParams();
  formData.set("key", process.env.IMGBB_API_KEY);
  formData.set("image", imageBuffer.toString("base64"));
  formData.set("name", filename || "image");

  const response = await fetch(process.env.IMGBB_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData,
  });

  const responseData = await response.json();

  if (!response.ok || !responseData?.success || !responseData?.data) {
    throw new Error("ImgBB upload failed");
  }

  const image = responseData.data;

  return {
    url: getImageUrl(image.url),
    displayUrl: getImageUrl(image.display_url) || getImageUrl(image.url),
    deleteUrl: getImageUrl(image.delete_url),
    thumb: getImageUrl(image.thumb),
    filename: image.image?.filename || filename || "",
  };
};

module.exports = {
  uploadToImgBB,
  getImageUrl,
};
