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

  // Smooth Scroll Logic
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.8, smooth: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    return () => lenis.destroy();
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

function AppContent({ loading }) {
  const location = useLocation();

  // Hide navbar on admin and client routes
  const hideNavbar =
    location.pathname.startsWith("/client") ||
    location.pathname.startsWith("/admin");

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
}

export default App;