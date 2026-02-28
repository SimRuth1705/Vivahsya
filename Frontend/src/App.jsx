import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// Layout/Global Components
import Navbar from "./homepage/components/Navbar/Navbar";
import Loader from "./homepage/components/Loader/Loader";
import ProtectedRoute from './homepage/components/ProtectedRoute/ProtectedRoute';
import { AuthProvider } from './homepage/components/AuthContext/AuthContext'; // Context provider for auth state

// Route Bundles
import AdminRoutes from './admin/AdminRoutes'; // The admin routes you provided
import ClientApp from './client/ClientRoutes';     // The client routing you provided

// Homepage Pages
import Home from "./homepage/pages/Home";
import Portfolio from "./homepage/pages/Portfolio";
import LoginPage from './homepage/pages/LoginPage';

gsap.registerPlugin(ScrollTrigger);

function App() {
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track login state


  /* Loader Logic */
  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      // Give the DOM a tiny moment to paint, then refresh GSAP
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
      <Navbar /> 
        <Routes>
          {/* 1. PUBLIC LANDING PAGES */}
          <Route path="/" element={<><Navbar introReady={!loading} /><Home introReady={!loading} /></>} />
          <Route path="/portfolio" element={<><Navbar introReady={!loading} /><Portfolio /></>} />
          <Route path="/login" element={<LoginPage />} />

          {/* 2. ADMIN PORTAL (Nested & Protected) */}
          {/* Note the '/*' - this allows AdminRoutes to handle sub-paths like /admin/dashboard */}
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
              <ProtectedRoute>
                <ClientApp />
              </ProtectedRoute>
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