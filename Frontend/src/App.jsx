import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useEffect, useState } from "react";
import Lenis from "@studio-freight/lenis";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

// ✅ UPDATED IMPORT: Pointing to Navbar-Home and matching your new export name
import NavbarHome from "./homepage/components/NavBar/Navbar-Home"; 
import Loader from "./homepage/components/Loader/Loader";
import { AuthProvider } from "./homepage/components/AuthContext/AuthContext";

// Route Bundles
import AdminRoutes from "./admin/AdminRoutes";
import ClientApp from "./client/ClientRoutes";

// Homepage Pages
import Home from "./homepage/pages/Home";
import Portfolio from "./homepage/pages/Portfolio";
import Servicess from "./homepage/pages/Servicess";
import Contact from "./homepage/pages/Contact";
import About from "./homepage/pages/About";
import LoginPage from "./admin/pages/Login/Login";

// Venue Pages
import Venues from "./client/pages/Venue-page/venue";
import VenueDetails from "./client/pages/Venue-page/VenueDetail";

gsap.registerPlugin(ScrollTrigger);

// ---------------- PROTECTED ROUTE GUARD ----------------
const ProtectedRoute = ({ children, allowedRole, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isOwner = user.role === 'owner';

  if (requiredRole) {
    const hasPermission = isOwner || user.role === requiredRole;
    if (!hasPermission) return <Navigate to="/" replace />;
  }

  if (allowedRole && user.role !== allowedRole && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ---------------- APP CONTENT ----------------
const AppContent = ({ loading }) => {
  const location = useLocation();

  // Controls which pages do NOT show the home-style Navbar
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/client") ||
    location.pathname.startsWith("/venues") ||
    location.pathname.startsWith("/venue/");

  return (
    <>
      {/* ✅ UPDATED COMPONENT: Using NavbarHome to match the export */}
      {!hideNavbar && <NavbarHome introReady={!loading} />}

      <Routes>
        <Route path="/" element={<Home introReady={!loading} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Servicess />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Public Venue Routes */}
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:city/:name" element={<VenueDetails />} />

        {/* Admin Portal */}
        <Route
          path="/admin/*"
          element={
            <ProtectedRoute requiredRole="employee">
              <AdminRoutes />
            </ProtectedRoute>
          }
        />

        {/* Client Portal */}
        <Route
          path="/client/*"
          element={
            <ProtectedRoute allowedRole="client">
              <ClientApp />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

// ---------------- MAIN APP ----------------
function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      setTimeout(() => ScrollTrigger.refresh(), 100);
    }, 2700);
    return () => clearTimeout(timer);
  }, []);

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

export default App;
