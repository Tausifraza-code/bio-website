import ExecutivePro from "./ExecutivePro";
import MinimalLuxury from "./MinimalLuxury";
import CreativePortfolio from "./CreativePortfolio";
import CorporateExecutive from "./CorporateExecutive";
import Storefront from "./Storefront";
import FreelancerPro from "./FreelancerPro";
import ElegantProfile from "./ElegantProfile";
import AgencyPro from "./AgencyPro";
import DigitalCard from "./DigitalCard";
import ServicePro from "./ServicePro";

// ==========================================
// MINI PROFILE LAYOUT REGISTRY
// ==========================================

export const layoutRegistry = {
  executivePro: {
    id: "executivePro",
    name: "Executive Pro",
    component: ExecutivePro,
  },

  minimalLuxury: {
    id: "minimalLuxury",
    name: "Minimal Luxury",
    component: MinimalLuxury,
  },

  creativePortfolio: {
    id: "creativePortfolio",
    name: "Creative Portfolio",
    component: CreativePortfolio,
  },

  corporateExecutive: {
    id: "corporateExecutive",
    name: "Corporate Executive",
    component: CorporateExecutive,
  },

  storefront: {
    id: "storefront",
    name: "Storefront",
    component: Storefront,
  },

  freelancerPro: {
    id: "freelancerPro",
    name: "Freelancer Pro",
    component: FreelancerPro,
  },

  elegantProfile: {
    id: "elegantProfile",
    name: "Elegant Profile",
    component: ElegantProfile,
  },

  agencyPro: {
    id: "agencyPro",
    name: "Agency Pro",
    component: AgencyPro,
  },

  digitalCard: {
    id: "digitalCard",
    name: "Digital Card",
    component: DigitalCard,
  },

  servicePro: {
    id: "servicePro",
    name: "Service Pro",
    component: ServicePro,
  },
};

// ==========================================
// DEFAULT LAYOUT
// ==========================================

export const DEFAULT_LAYOUT = "executivePro";

// ==========================================
// GET LAYOUT COMPONENT
// ==========================================

export const getLayoutComponent = (layoutId) => {
  return (
    layoutRegistry[layoutId]?.component ||
    layoutRegistry[DEFAULT_LAYOUT].component
  );
};

// ==========================================
// GET ALL AVAILABLE LAYOUTS
// ==========================================

export const getAvailableLayouts = () => {
  return Object.values(layoutRegistry).map(({ id, name }) => ({
    id,
    name,
  }));
};

export default layoutRegistry;
