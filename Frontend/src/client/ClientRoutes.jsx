import { Routes, Route, useLocation } from "react-router-dom";

// Components
import Navbar from "./components/Navbar/Navbar";
import Home from "./components/Home-page/home";
import Booking from "./pages/Booking-page/book";
import Portfolio from "./pages/Portfolio-page/portfolio";
import Timeline from "./pages/TimeLine-page/timeline";
import Venues from "./pages/Venue-page/venue";
import VenueDetails from "./pages/Venue-page/VenueDetail";
import ChatBot from "./pages/Chat-Bot/chatbot";

function ClientRoutes() {
  const location = useLocation();
  const isHomePage = location.pathname === '/';

  return (
    <>
       <Navbar />
       <ChatBot />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/booking" element={<Booking />} />
        <Route path="/portfolio" element={<Portfolio />} />
        <Route path="/timeline/:id" element={<Timeline />} />
        <Route path="/venues" element={<Venues />} />
        <Route path="/venue/:city/:name" element={<VenueDetails />} />
      </Routes>
    </>
  )
}

export default ClientRoutes;