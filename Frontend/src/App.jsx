import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Layout/Global Components
import NavBar from "./homepage/components/NavBar/NavBar";
import Loader from "./homepage/components/Loader/Loader";
import { AuthProvider } from './homepage/components/AuthContext/AuthContext'; 

// Route Bundles
import AdminRoutes from './admin/AdminRoutes'; 
import ClientApp from './client/ClientRoutes'; // Consolidated naming conflict

// Homepage Pages
import Home from "./homepage/pages/Home";
import Portfolio from "./homepage/pages/Portfolio";
import LoginPage from './homepage/pages/LoginPage';

// Note: Ensure ProtectedRoute is imported or defined here if used
// import ProtectedRoute from './components/ProtectedRoute';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); 

  /* Loader Logic */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => {
        ScrollTrigger.refresh();
      }, 100);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

  /* Smooth Scroll Logic */
  useEffect(() => {
    const lenis = new Lenis({ duration: 1.8, smooth: true });
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add((time) => lenis.raf(time * 1000));
    return () => lenis.destroy();
  }, []);

  return (
    <>
      <AuthProvider> 
        {loading && <Loader />}
        <BrowserRouter>
          {/* Global NavBar: Stays visible across all routes */}
          <NavBar introReady={!loading} /> 
          
          <Routes>
            {/* 1. PUBLIC LANDING PAGES */}
            <Route path="/" element={<Home introReady={!loading} />} />
            <Route path="/portfolio" element={<Portfolio />} />
            <Route path="/login" element={<LoginPage />} />

            {/* 2. ADMIN PORTAL (Nested & Protected) */}
            <Route 
              path="/admin/*" 
              element={
                <AdminRoutes 
                  setIsAuthenticated={setIsAuthenticated} 
                  onLogout={() => setIsAuthenticated(false)} 
                />
              } 
            />

            {/* 3. CLIENT PORTAL (Protected) */}
            <Route
              path="/client/*"
              element={
                // Ensure ProtectedRoute is properly defined in your project
                <ClientApp />
              }
            />

            {/* 4. FALLBACK */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  );
}

export default App;