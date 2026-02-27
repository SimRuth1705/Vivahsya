import React, { useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import AdminRoutes from "./admin/AdminRoutes";
import { Toaster } from "sonner";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(
    !!localStorage.getItem("token"),
  );

  // --- THE LOGOUT ENGINE ---
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsAuthenticated(false);

    // Using navigate instead of window.location for a smoother SPA experience
    window.location.href = "/admin/login";
  };

  return (
    <Router>
      <Toaster position="top-right" richColors />
      <Routes>
        <Route
          path="/admin/*"
          element={
            <AdminRoutes
              isAuthenticated={isAuthenticated}
              setIsAuthenticated={setIsAuthenticated}
              onLogout={handleLogout}
            />
          }
        />

        {/* Root Redirect: If someone hits base URL, send to admin dashboard */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Global Fallback */}
        <Route path="*" element={<Navigate to="/admin/dashboard" replace />} />
      </Routes>
    </Router>
  );
};

export default App;
