import ExecutivePro from "../components/ExecutivePro";
import MinimalLuxury from "../components/MinimalLuxury";
import CreativePortfolio from "../components/CreativePortfolio";
import CorporateExecutive from "../components/CorporateExecutive";
import Storefront from "../components/Storefront";
import FreelancerPro from "../components/FreelancerPro";
import ElegantProfile from "../components/ElegantProfile";
import AgencyPro from "../components/AgencyPro";
import DigitalCard from "../components/DigitalCard";
import ServicePro from "../components/ServicePro";

export const DEFAULT_LAYOUT = "modern-business";

const LAYOUT_COMPONENTS = {
  "modern-business": ExecutivePro,
  "minimal-card": MinimalLuxury,
  "creator-portfolio": CreativePortfolio,
  "corporate-executive": CorporateExecutive,
  storefront: Storefront,
  "freelancer-pro": FreelancerPro,
  "elegant-profile": ElegantProfile,
  "agency-pro": AgencyPro,
  "digital-card": DigitalCard,
  "service-pro": ServicePro,
};

const LAYOUT_ALIASES = {
  executivePro: "modern-business",
  minimalLuxury: "minimal-card",
  creativePortfolio: "creator-portfolio",
  corporateExecutive: "corporate-executive",
  freelancerPro: "freelancer-pro",
  elegantProfile: "elegant-profile",
  agencyPro: "agency-pro",
  digitalCard: "digital-card",
  servicePro: "service-pro",
};

export const normalizeLayoutId = (id) => {
  const normalized = LAYOUT_ALIASES[id] || id;
  return LAYOUT_COMPONENTS[normalized] ? normalized : DEFAULT_LAYOUT;
};

export const getLayoutComponent = (id) =>
  LAYOUT_COMPONENTS[normalizeLayoutId(id)];
