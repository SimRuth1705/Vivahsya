import { BrowserRouter, Routes, Route, Navigate, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Layout / Global
import NavBar from "./homepage/components/NavBar/Navbar";
import Loader from "./homepage/components/Loader/Loader";
import { AuthProvider } from "./homepage/components/AuthContext/AuthContext";

// Route Bundles
import AdminRoutes from "./admin/AdminRoutes";
import ClientApp from "./client/ClientRoutes";

// Homepage Pages
import Home from "./homepage/pages/Home";
import Portfolio from "./homepage/pages/Portfolio";
import Servicess from "./homepage/pages/Servicess";
import LoginPage from "./homepage/pages/LoginPage";

gsap.registerPlugin(ScrollTrigger);

// ---------------- APP CONTENT ----------------
const AppContent = ({ loading }) => {
  const location = useLocation();

  // Hide navbar for admin & client portals
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/client");

  return (
    <>
      {!hideNavbar && <NavBar introReady={!loading} />}

      <Routes>
        {/* Public Pages */}
        <Route path="/" element={<Home introReady={!loading} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Servicess />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Admin Portal */}
        <Route path="/admin/*" element={<AdminRoutes />} />

        {/* Client Portal */}
        <Route path="/client/*" element={<ClientApp />} />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ---------------- MAIN APP ----------------
function App() {
  const [loading, setLoading] = useState(true);

  // Loader Logic
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 2700);

    return () => clearTimeout(timer);
  }, []);

  // Smooth Scroll (Lenis)
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.8, smooth: true });
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000);
    });

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <AuthProvider>
      {loading && <Loader />}
      <BrowserRouter>
        <AppContent loading={loading} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;