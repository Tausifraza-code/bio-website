import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import QRCode from "qrcode";
import {
  FaFacebookF,
  FaGlobe,
  FaInstagram,
  FaLink,
  FaLinkedinIn,
  FaTelegram,
  FaWhatsapp,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

export const downloadStandeePNG = async ({
  qrValue,
  shopName,
  socialLinks = [],
}) => {
  const W = 1800;
  const links = Array.isArray(socialLinks)
    ? socialLinks.filter((social) => social?.url)
    : [];
  const socialRows = Math.ceil(links.length / 6);
  const currentY = 1785;
  const ctaY = links.length
    ? currentY + socialRows * 190 + 85
    : currentY + 100;
  const footerHeight = 230;
  const H = Math.max(2700, ctaY + footerHeight + 120);
  const footerY = H - footerHeight;

  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Unable to initialize the standee canvas.");
  }

  canvas.width = W;
  canvas.height = H;

  const roundedRect = (x, y, w, h, r, fill, stroke) => {
    ctx.beginPath();
    ctx.roundRect(x, y, w, h, r);

    if (fill) {
      ctx.fillStyle = fill;
      ctx.fill();
    }

    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = 5;
      ctx.stroke();
    }
  };

  const centerText = (text, y, font, color) => {
    ctx.textAlign = "center";
    ctx.font = font;
    ctx.fillStyle = color;
    ctx.fillText(text, W / 2, y);
  };

  ctx.fillStyle = "#F5F8FC";
  ctx.fillRect(0, 0, W, H);

  const headerGradient = ctx.createLinearGradient(0, 0, W, 600);
  headerGradient.addColorStop(0, "#073B91");
  headerGradient.addColorStop(1, "#1265CC");

  ctx.fillStyle = headerGradient;
  ctx.fillRect(0, 0, W, 570);

  ctx.beginPath();
  ctx.moveTo(0, 490);
  ctx.quadraticCurveTo(W / 2, 690, W, 490);
  ctx.lineTo(W, 570);
  ctx.lineTo(0, 570);
  ctx.closePath();
  ctx.fillStyle = "#1265CC";
  ctx.fill();

  centerText("Contact to", 180, "italic 75px Arial", "#FFFFFF");
  centerText(shopName, 340, "bold 90px Arial", "#FFFFFF");
  roundedRect(W / 2 - 95, 460, 190, 10, 5, "#67E8F9");

  const qrDataUrl = await QRCode.toDataURL(qrValue, {
    width: 1100,
    margin: 2,
    errorCorrectionLevel: "H",
    color: {
      dark: "#071B35",
      light: "#FFFFFF",
    },
  });

  const qrImage = new Image();

  await new Promise((resolve, reject) => {
    qrImage.onload = resolve;
    qrImage.onerror = reject;
    qrImage.src = qrDataUrl;
  });

  const qrSize = 900;
  const qrX = (W - qrSize) / 2;
  const qrY = 700;

  roundedRect(
    qrX - 65,
    qrY - 65,
    qrSize + 130,
    qrSize + 130,
    38,
    "#FFFFFF",
    "#D5E5F8",
  );
  roundedRect(
    qrX - 22,
    qrY - 22,
    qrSize + 44,
    qrSize + 44,
    22,
    null,
    "#1765C5",
  );
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  if (links.length > 0) {
    const iconSize = 100;
    const columns = 6;
    const itemWidth = 150;
    const itemHeight = 165;
    const gapX = 18;
    const gapY = 35;

    const brandColors = {
      instagram: "#E4405F",
      facebook: "#1877F2",
      linkedin: "#0A66C2",
      youtube: "#FF0000",
      whatsapp: "#25D366",
      telegram: "#26A5E4",
      twitter: "#111827",
      website: "#1265CC",
    };

    const iconComponents = {
      instagram: FaInstagram,
      facebook: FaFacebookF,
      linkedin: FaLinkedinIn,
      youtube: FaYoutube,
      whatsapp: FaWhatsapp,
      telegram: FaTelegram,
      twitter: FaXTwitter,
      website: FaGlobe,
    };

    for (let index = 0; index < links.length; index++) {
      const social = links[index];
      const platform = String(
        social.platform || social.name || social.type || "Social",
      );
      const normalized = platform.toLowerCase();

      const key = normalized.includes("instagram")
        ? "instagram"
        : normalized.includes("facebook")
          ? "facebook"
          : normalized.includes("linkedin")
            ? "linkedin"
            : normalized.includes("youtube")
              ? "youtube"
              : normalized.includes("whatsapp")
                ? "whatsapp"
                : normalized.includes("telegram")
                  ? "telegram"
                  : normalized.includes("twitter") || normalized === "x"
                    ? "twitter"
                    : normalized.includes("web")
                      ? "website"
                      : null;

      const brandColor = key ? brandColors[key] : "#1265CC";
      const Icon = key ? iconComponents[key] : FaLink;
      const row = Math.floor(index / columns);
      const itemsInRow = Math.min(columns, links.length - row * columns);
      const rowWidth = itemsInRow * itemWidth + (itemsInRow - 1) * gapX;
      const startX = (W - rowWidth) / 2;
      const col = index % columns;
      const x = startX + col * (itemWidth + gapX);
      const y = currentY + row * (itemHeight + gapY);
      const iconX = x + (itemWidth - iconSize) / 2;
      const iconY = y + 5;

      roundedRect(iconX, iconY, iconSize, iconSize, 20, brandColor);

      const iconSvg = renderToStaticMarkup(
        React.createElement(Icon, {
          color: "#FFFFFF",
          size: 76,
        }),
      );
      const svgBlob = new Blob(
        [iconSvg.replace(/currentColor/g, "#FFFFFF")],
        { type: "image/svg+xml;charset=utf-8" },
      );
      const svgUrl = URL.createObjectURL(svgBlob);
      const iconImage = new Image();

      try {
        await new Promise((resolve, reject) => {
          iconImage.onload = resolve;
          iconImage.onerror = reject;
          iconImage.src = svgUrl;
        });

        ctx.drawImage(iconImage, iconX + 12, iconY + 12, 76, 76);
      } finally {
        URL.revokeObjectURL(svgUrl);
      }

      const platformName =
        key === "twitter"
          ? "X"
          : key === "website"
            ? "Website"
            : platform.charAt(0).toUpperCase() + platform.slice(1);

      ctx.textAlign = "center";
      ctx.fillStyle = "#10233D";
      ctx.font = "bold 27px Arial";
      ctx.fillText(platformName, x + itemWidth / 2, y + 140, itemWidth - 8);
    }
  }

  centerText(
    "Scan & Connect",
    footerY - 75,
    "italic bold 75px Arial",
    "#1265CC",
  );

  const footerGradient = ctx.createLinearGradient(0, footerY, W, H);
  footerGradient.addColorStop(0, "#073B91");
  footerGradient.addColorStop(1, "#1265CC");

  ctx.beginPath();
  ctx.moveTo(0, footerY + 75);
  ctx.quadraticCurveTo(W / 2, footerY - 75, W, footerY + 75);
  ctx.lineTo(W, H);
  ctx.lineTo(0, H);
  ctx.closePath();
  ctx.fillStyle = footerGradient;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(0, footerY + 75);
  ctx.quadraticCurveTo(W / 2, footerY - 75, W, footerY + 75);
  ctx.strokeStyle = "#67E8F9";
  ctx.lineWidth = 7;
  ctx.stroke();

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${shopName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-premium-qr-standee.png`;

  document.body.appendChild(link);
  link.click();
  link.remove();
};