import { useEffect, useState } from "react";

import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Features from "../components/Features";
import Contact from "../pages/Contact";
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
      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <main>
        <Hero />
        <Features />
        <Contact />
      </main>

      <Footer />
    </div>
  );
};

export default Home;
