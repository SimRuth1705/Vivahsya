import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { 
  HiStar, 
  HiOutlineLocationMarker, 
  HiOutlineUserGroup, 
  HiOutlineHome 
} from "react-icons/hi";
import "./VenueDetail.css";

const VenueDetails = () => {
  const { name } = useParams();
  const location = useLocation();
  const [venue, setVenue] = useState(location.state?.venue || null);
  const [loading, setLoading] = useState(!venue);

  const [showAllPhotos, setShowAllPhotos] = useState(false);

  useEffect(() => {
    if (!venue) {
      const fetchVenueDetails = async () => {
        try {
          const response = await fetch(`http://localhost:5000/api/venues`);
          const allVenues = await response.json();
          const decodedName = decodeURIComponent(name).replace(/-/g, " ");
          const found = allVenues.find(v => v.name.toLowerCase() === decodedName.toLowerCase());
          setVenue(found);
        } catch (err) {
          console.error("Error fetching venue:", err);
        } finally {
          setLoading(false);
        }
      };
      fetchVenueDetails();
    }
  }, [name, venue]);

  if (loading) return <div className="vd-loading-screen">Loading Premium Venue...</div>;
  if (!venue) return <div className="vd-error-screen">Venue not found in our collection.</div>;

  // Safely merge cover photo and gallery
  const dynamicGallery = [
    venue.image, 
    ...(Array.isArray(venue.gallery) ? venue.gallery : [])
  ].filter(Boolean);

  return (
    <div className="venue-detail-page-modern">
      {/* 1. CINEMATIC HERO SECTION */}
      <div className="vd-hero-container">
        <img src={venue.image} alt={venue.name} className="vd-hero-img" />
        <div className="vd-hero-overlay"></div>
        <div className="vd-hero-watermark">VIVAHASYA COLLECTION</div>
      </div>

      {/* 2. OVERLAPPING INFO CARD */}
      <div className="vd-main-card">
        <div className="vd-card-header">
          <div className="vd-card-title-col">
            <h1 className="vd-title">{venue.name}</h1>
            <p className="vd-subtitle">
              <HiOutlineLocationMarker className="vd-inline-icon" /> {venue.location} &nbsp;•&nbsp; {venue.type}
            </p>
          </div>
          <div className="vd-rating-box">
            <div className="vd-rating-score"><HiStar size={18} /> {venue.rating || "5.0"}</div>
            <div className="vd-rating-reviews">{venue.reviews || "0"} verified reviews</div>
          </div>
        </div>

        <div className="vd-address-section">
          <div className="vd-address-line1">
            {venue.address || "Complete location details provided upon inquiry."}
          </div>
          <div className="vd-stats-grid">
            {venue.pax && (
              <div className="vd-stat-item">
                <div className="vd-stat-icon-wrapper">
                  <HiOutlineUserGroup size={22} />
                </div>
                <div className="vd-stat-text">
                  <small>Guest Capacity</small>
                  <p>{venue.pax}</p>
                </div>
              </div>
            )}
            {venue.rooms && (
              <div className="vd-stat-item">
                <div className="vd-stat-icon-wrapper">
                  <HiOutlineHome size={22} />
                </div>
                <div className="vd-stat-text">
                  <small>Accommodation</small>
                  <p>{venue.rooms}</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. PREMIUM MASONRY PORTFOLIO */}
      {dynamicGallery.length > 1 && (
        <div className="vd-portfolio-container">
          <div className="vd-portfolio-header">
            <h3 className="vd-section-title">Visual Portfolio</h3>
            <span className="vd-photo-count">{dynamicGallery.length} High-Res Images</span>
          </div>

          <div className="vd-gallery-content">
            {/* Pure CSS Masonry handles the layout beautifully */}
            <div className={showAllPhotos ? "vd-photo-masonry" : "vd-photo-grid"}>
              {dynamicGallery
                .slice(0, showAllPhotos ? dynamicGallery.length : 8)
                .map((img, i) => (
                  <div className="vd-photo-item" key={i}>
                    <img
                      src={img}
                      alt={`${venue.name} gallery ${i + 1}`}
                      loading="lazy"
                      onError={(e) => { e.target.src = "https://placehold.co/600x400?text=Image+Unavailable"; }}
                    />
                  </div>
                ))}
            </div>

            {!showAllPhotos && dynamicGallery.length > 8 && (
              <div className="vd-view-more-wrapper">
                <button className="vd-view-more-btn" onClick={() => setShowAllPhotos(true)}>
                  Explore All {dynamicGallery.length} Photos
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default VenueDetails;