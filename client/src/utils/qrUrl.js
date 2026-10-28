const apiBaseUrl =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api";
const backendOrigin = apiBaseUrl.replace(/\/api\/?$/, "").replace(/\/+$/, "");

export const getPublicQRUrl = (qrPath) => {
  if (typeof qrPath !== "string" || !qrPath.trim()) return "";

  const normalizedPath = qrPath.startsWith("/") ? qrPath : `/${qrPath}`;
  return `${backendOrigin}${normalizedPath}`;
};
