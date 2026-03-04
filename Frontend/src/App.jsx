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
import LoginPage from "./admin/pages/Login/Login";

// Venue Pages
import Venues from "./client/pages/Venue-page/venue";
import VenueDetails from "./client/pages/Venue-page/VenueDetail";

gsap.registerPlugin(ScrollTrigger);

// ---------------- PROTECTED ROUTE GUARD ----------------
// Updated to handle both allowedRole and hierarchical requiredRole
const ProtectedRoute = ({ children, allowedRole, requiredRole }) => {
  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  const isOwner = user.role === 'owner';

  // If a specific role like 'employee' or 'owner' is required
  if (requiredRole) {
    const hasPermission = isOwner || user.role === requiredRole;
    if (!hasPermission) return <Navigate to="/" replace />;
  }

  // Legacy role check for basic portal separation
  if (allowedRole && user.role !== allowedRole && !isOwner) {
    return <Navigate to="/" replace />;
  }

  return children;
};

// ---------------- APP CONTENT ----------------
const AppContent = ({ loading }) => {
  const location = useLocation();

  // ✅ UPDATED: Hides NavBar on /venues and /venue/... paths
  const hideNavbar =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/client") ||
    location.pathname.startsWith("/venues") ||
    location.pathname.startsWith("/venue/");

  return (
    <>
      {!hideNavbar && <NavBar introReady={!loading} />}

      <Routes>
        <Route path="/" element={<Home introReady={!loading} />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/services" element={<Servicess />} />
        <Route path="/login" element={<LoginPage />} />
        
        {/* Public Venue Routes */}
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:city/:name" element={<VenueDetails />} />

        {/* Admin Portal - Managed via AdminRoutes.jsx internals or wrapped here */}
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