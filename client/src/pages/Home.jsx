import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
// import About from "../pages/About";
// import Contact from "../pages/Contact";
import BioIdentitySection from "../components/BioIdentitySection";
import BioSharingSection from "./BioSharingSection";
import BioServicesGallery from "./BioServicesGallery";
import BioFanCards from "./BioFanCards";
import HowItWorks from "../components/HowItWorks";
import Testimonials from "../components/Testimonials";
import Footer from "../components/Footer";

const Home = () => {
  const [theme, setTheme] = useState(() => {
    try {
      return localStorage.getItem("bio-theme") || "dark";
    } catch {
      return "dark";
    }
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;

    try {
      localStorage.setItem("bio-theme", theme);
    } catch {
      // Ignore storage errors.
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme((current) => (current === "dark" ? "light" : "dark"));
  };

  return (
    <div className={`app-shell theme-${theme}`}>
      <div className="bg-[linear-gradient(180deg,#c9eee1_0%,#eaf6f1_45%,#ffffff_100%)] dark:bg-[#0b1b30] dark:bg-none">
        <Navbar theme={theme} onToggleTheme={toggleTheme} />
        <main className="home-main">
          <Hero />
          <Features />
          <BioIdentitySection />
          <BioSharingSection />
          <BioServicesGallery />
          <BioFanCards />
          <HowItWorks />
          <Testimonials />
          {/* <About />
          <Contact /> */}
        </main>
      </div>

      <Footer />
    </div>
  );
};

export default Home;
