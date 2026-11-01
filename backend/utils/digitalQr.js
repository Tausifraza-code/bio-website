const MiniProfile = require("../models/MiniProfile");
const QRCodeGenerator = require("qrcode");
const { uploadToImgBB } = require("./imgbb");

const ensureDigitalQR = async (userId) => {
  const profile = await MiniProfile.findOne({ userId });

  // Profile ya subdomain nahi hai toh QR pending rahega
  if (!profile || !profile.subdomain) {
    return {
      status: "pending",
      message: "Public profile is not created yet.",
    };
  }

  const baseUrl = process.env.PUBLIC_PROFILE_BASE_URL;

  if (!baseUrl) {
    throw new Error("PUBLIC_PROFILE_BASE_URL is missing.");
  }

  const qrUrl =
    `${baseUrl.replace(/\/+$/, "")}/card-preview/` +
    encodeURIComponent(profile.subdomain);

  // QR already exists and URL has not changed
  if (profile.qrCode && profile.qrUrl === qrUrl) {
    return {
      status: "ready",
      qrCode: profile.qrCode,
      qrUrl: profile.qrUrl,
    };
  }

  // Generate QR image
  const qrBuffer = await QRCodeGenerator.toBuffer(qrUrl, {
    type: "png",
    width: 1000,
    margin: 2,
    errorCorrectionLevel: "H",
  });

  // Upload QR image to ImgBB
  const uploadResult = await uploadToImgBB(
    qrBuffer,
    `digital-qr-${profile.subdomain}.png`,
    "image/png",
  );

  if (!uploadResult?.url) {
    throw new Error("Digital QR upload failed.");
  }

  profile.qrCode = uploadResult.url;
  profile.qrUrl = qrUrl;

  await profile.save();

  return {
    status: "ready",
    qrCode: profile.qrCode,
    qrUrl: profile.qrUrl,
  };
};

module.exports = { ensureDigitalQR };
