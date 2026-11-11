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
  FaGithub,
  FaPinterest,
  FaDiscord,
  FaSnapchat,
  FaTiktok,
  FaReddit,
  FaThreads,
  FaTwitch,
  FaSpotify,
  FaMedium,
} from "react-icons/fa6";

const resolvePlatform = (social = {}) => {
  const pName = String(social.platformName || "").toLowerCase().trim();
  const p = String(
    social.platform || social.name || social.type || "",
  ).toLowerCase().trim();
  const u = String(social.url || "").toLowerCase().trim();
  const combined = `${p} ${pName} ${u}`;

  if (/instagram|insta/.test(combined)) return "instagram";
  if (/facebook|fb\b/.test(combined)) return "facebook";
  if (/linkedin/.test(combined)) return "linkedin";
  if (/youtube|youtu\.be/.test(combined)) return "youtube";
  if (/whatsapp|wa\.me/.test(combined)) return "whatsapp";
  if (/telegram|t\.me/.test(combined)) return "telegram";
  if (/twitter|x\.com|\bx\b/.test(combined)) return "twitter";
  if (/github/.test(combined)) return "github";
  if (/pinteres|pin\.it/.test(combined)) return "pinterest";
  if (/discord|discord\.gg/.test(combined)) return "discord";
  if (/snapchat/.test(combined)) return "snapchat";
  if (/tiktok/.test(combined)) return "tiktok";
  if (/reddit/.test(combined)) return "reddit";
  if (/threads/.test(combined)) return "threads";
  if (/twitch/.test(combined)) return "twitch";
  if (/spotify/.test(combined)) return "spotify";
  if (/medium/.test(combined)) return "medium";
  if (/website|globe|site|web|http/.test(combined)) return "website";

  return "link";
};

const getDisplayName = (social, key) => {
  if (social.platformName && social.platformName.trim()) {
    return social.platformName.trim();
  }

  const prettyNames = {
    instagram: "Instagram",
    facebook: "Facebook",
    linkedin: "LinkedIn",
    youtube: "YouTube",
    whatsapp: "WhatsApp",
    telegram: "Telegram",
    twitter: "X",
    github: "GitHub",
    pinterest: "Pinterest",
    discord: "Discord",
    snapchat: "Snapchat",
    tiktok: "TikTok",
    reddit: "Reddit",
    threads: "Threads",
    twitch: "Twitch",
    spotify: "Spotify",
    medium: "Medium",
    website: "Website",
    link: "Link",
  };

  if (key && prettyNames[key]) {
    return prettyNames[key];
  }

  const raw = String(social.platform || social.name || "").trim();
  if (raw && raw !== "custom") {
    return raw.charAt(0).toUpperCase() + raw.slice(1);
  }

  return "Link";
};

export const downloadStandeePNG = async ({
  qrValue,
  shopName = "My Business",
  socialLinks = [],
}) => {
  const W = 1800;
  const links = Array.isArray(socialLinks)
    ? socialLinks.filter((social) => social?.url)
    : [];

  // Exactly 6 icons in a single row
  const columns = 6;
  const socialRows = Math.ceil(links.length / columns);
  const qrSize = 1080;
  const qrX = (W - qrSize) / 2;
  const qrY = 710;
  const cardBottom = qrY + qrSize + 65;

  const currentY = cardBottom + 70;
  const itemHeight = 165;
  const gapY = 32;
  const socialBlockHeight = links.length
    ? socialRows * itemHeight + (socialRows - 1) * gapY
    : 0;

  const footerHeight = 250;
  const minCanvasHeight = 2950;
  const H = Math.max(
    minCanvasHeight,
    currentY + socialBlockHeight + 140 + footerHeight,
  );
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

  const centerText = (text, y, font, color, maxTextWidth) => {
    ctx.textAlign = "center";
    ctx.font = font;
    ctx.fillStyle = color;
    if (maxTextWidth) {
      ctx.fillText(text, W / 2, y, maxTextWidth);
    } else {
      ctx.fillText(text, W / 2, y);
    }
  };

  // Background
  ctx.fillStyle = "#F5F8FC";
  ctx.fillRect(0, 0, W, H);

  // Header Gradient
  const headerGradient = ctx.createLinearGradient(0, 0, W, 600);
  headerGradient.addColorStop(0, "#073B91");
  headerGradient.addColorStop(1, "#1265CC");

  ctx.fillStyle = headerGradient;
  ctx.fillRect(0, 0, W, 580);

  // Header bottom wave
  ctx.beginPath();
  ctx.moveTo(0, 500);
  ctx.quadraticCurveTo(W / 2, 700, W, 500);
  ctx.lineTo(W, 580);
  ctx.lineTo(0, 580);
  ctx.closePath();
  ctx.fillStyle = "#1265CC";
  ctx.fill();

  // Header texts
  centerText("Contact to", 185, "italic 88px Arial", "#FFFFFF");

  const nameLength = String(shopName).length;
  const shopNameFontSize = nameLength > 24 ? 90 : nameLength > 16 ? 105 : 125;
  centerText(
    shopName,
    350,
    `bold ${shopNameFontSize}px Arial`,
    "#FFFFFF",
    W - 160,
  );

  // Cyan accent bar under business name
  roundedRect(W / 2 - 120, 465, 240, 12, 6, "#67E8F9");

  // QR Code Generation with high resolution
  const qrDataUrl = await QRCode.toDataURL(qrValue, {
    width: 1400,
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

  // Outer White Card for QR Code
  roundedRect(
    qrX - 65,
    qrY - 65,
    qrSize + 130,
    qrSize + 130,
    42,
    "#FFFFFF",
    "#D5E5F8",
  );

  // Inner Accent Border for QR Code
  roundedRect(
    qrX - 22,
    qrY - 22,
    qrSize + 44,
    qrSize + 44,
    26,
    null,
    "#1765C5",
  );

  // Draw QR Image
  ctx.drawImage(qrImage, qrX, qrY, qrSize, qrSize);

  // Social Links Section — 6 Icons in Single Row with Proper Grid Alignment
  if (links.length > 0) {
    const itemWidth = 180;
    const gapX = 24;
    const iconSize = 100;
    const actualIconSize = 68;
    const iconOffset = Math.round((iconSize - actualIconSize) / 2); // 16px

    const fullRowWidth = columns * itemWidth + (columns - 1) * gapX; // 1200px
    const gridStartX = (W - fullRowWidth) / 2; // 300px

    const brandColors = {
      instagram: "#E4405F",
      facebook: "#1877F2",
      linkedin: "#0A66C2",
      youtube: "#FF0000",
      whatsapp: "#25D366",
      telegram: "#26A5E4",
      twitter: "#000000",
      github: "#24292e",
      pinterest: "#E60023",
      discord: "#5865F2",
      snapchat: "#FFFC00",
      tiktok: "#010101",
      reddit: "#FF4500",
      threads: "#000000",
      twitch: "#9146FF",
      spotify: "#1DB954",
      medium: "#00ab6c",
      website: "#1265CC",
      link: "#1265CC",
    };

    const iconComponents = {
      instagram: FaInstagram,
      facebook: FaFacebookF,
      linkedin: FaLinkedinIn,
      youtube: FaYoutube,
      whatsapp: FaWhatsapp,
      telegram: FaTelegram,
      twitter: FaXTwitter,
      github: FaGithub,
      pinterest: FaPinterest,
      discord: FaDiscord,
      snapchat: FaSnapchat,
      tiktok: FaTiktok,
      reddit: FaReddit,
      threads: FaThreads,
      twitch: FaTwitch,
      spotify: FaSpotify,
      medium: FaMedium,
      website: FaGlobe,
      link: FaLink,
    };

    for (let index = 0; index < links.length; index++) {
      const social = links[index];
      const key = resolvePlatform(social);
      const brandColor = brandColors[key] || "#1265CC";
      const Icon = iconComponents[key] || FaLink;
      const isSnapchat = key === "snapchat";
      const iconFgColor = isSnapchat ? "#000000" : "#FFFFFF";

      const row = Math.floor(index / columns);
      const col = index % columns;

      // Every row starts from column 0 (directly below the first icon of row 1)
      const x = gridStartX + col * (itemWidth + gapX);

      const y = currentY + row * (itemHeight + gapY);
      const iconX = x + (itemWidth - iconSize) / 2;
      const iconY = y + 5;

      // Icon bubble
      roundedRect(iconX, iconY, iconSize, iconSize, 22, brandColor);

      // Render actual SVG Icon
      const iconSvg = renderToStaticMarkup(
        React.createElement(Icon, {
          color: iconFgColor,
          size: actualIconSize,
        }),
      );
      const svgBlob = new Blob(
        [iconSvg.replace(/currentColor/g, iconFgColor)],
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

        // Exact mathematical center positioning inside the bubble
        ctx.drawImage(
          iconImage,
          iconX + iconOffset,
          iconY + iconOffset,
          actualIconSize,
          actualIconSize,
        );
      } finally {
        URL.revokeObjectURL(svgUrl);
      }

      // Display Name centered under the icon with adaptive font size to prevent squishing
      const platformName = getDisplayName(social, key);
      const nameLength = platformName.length;
      const fontSize = nameLength > 14 ? 20 : nameLength > 10 ? 22 : 25;

      ctx.textAlign = "center";
      ctx.fillStyle = "#10233D";
      ctx.font = `bold ${fontSize}px Arial`;
      ctx.fillText(platformName, x + itemWidth / 2, y + 140, itemWidth - 10);
    }
  }

  // Footer text "Scan & Connect"
  centerText(
    "Scan & Connect",
    footerY - 80,
    "italic bold 85px Arial",
    "#1265CC",
  );

  // Footer curved bottom banner
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

  // Trigger download
  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = `${shopName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-premium-qr-standee.png`;

  document.body.appendChild(link);
  link.click();
  link.remove();
};
