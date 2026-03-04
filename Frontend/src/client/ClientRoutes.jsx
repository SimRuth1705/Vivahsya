import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home-page/home";
import Booking from "./pages/Booking-page/book";
import Portfolio from "./pages/Portfolio-page/portfolio";
import Weddings from "./pages/Portfolio-page/weddings"; // Import these
import Decor from "./pages/Portfolio-page/Decor";       // Import these
import Photography from "./pages/Portfolio-page/Photography"; // Import these
import Timeline from "./pages/TimeLine-page/timeline";
import Venues from "./pages/Venue-page/venue";
import VenueDetails from "./pages/Venue-page/VenueDetail";
import ChatBot from "./pages/Chat-Bot/chatbot";

function ClientRoutes() {
  const location = useLocation();

  return (
    <>
      <Navbar />
      <ChatBot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        
        {/* Portfolio Routes */}
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/portfolio/weddings" element={<Weddings />} />
        <Route path="/portfolio/decor" element={<Decor />} />
        <Route path="/portfolio/photography" element={<Photography />} />
        
        <Route path="/timeline" element={<Timeline />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:city/:name" element={<VenueDetails />} />
        
        <Route path="*" element={<h1 style={{marginTop: "100px", textAlign: "center"}}>404 ERROR: React Router cannot find {location.pathname}</h1>} />
      </Routes>
    </>
  )
}

export default ClientRoutes;