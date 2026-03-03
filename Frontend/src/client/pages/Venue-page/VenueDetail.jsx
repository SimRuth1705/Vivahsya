import React, { useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import "./VenueDetail.css";

import v1 from "../../assets/wedding-hero-1.jpg";
import v2 from "../../assets/wedding-hero-2.jpg";
import v3 from "../../assets/wedding-hero-3.jpg";
import v4 from "../../assets/wedding-hero-4.jpg";

const VenueDetails = () => {
  const { name } = useParams();
  const location = useLocation();
  const stateVenue = location.state?.venue;

  const [activeTab, setActiveTab] = useState("portfolio");
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const venue = {
    images: stateVenue?.image
      ? [stateVenue.image, v2, v3, v4]
      : [v1, v2, v3, v4],
  };

  const heroImage = venue.images[0];
  const decodedName = decodeURIComponent(name).replace(/-/g, " ");

  // Build gallery (max 19 images)
  const allImages = [];
  if (stateVenue?.image) {
    allImages.push(stateVenue.image);

    const pathParts = stateVenue.image.split("/");
    const filename = pathParts.pop();
    const basePath = pathParts.join("/") + "/";

    const nameParts = filename.split(".");
    const fileBase = nameParts[0];
    const extension = nameParts[1];

    const prefixMatch = fileBase.match(/^(.*?)\d+$/);
    let prefix = prefixMatch ? prefixMatch[1] : "image";

    for (let i = 1; i <= 19; i++) {
      const testImage = `${basePath}${prefix}${i}.${extension}`;
      if (testImage !== stateVenue.image) {
        allImages.push(testImage);
      }
    }

    while (allImages.length < 19) {
      allImages.push(v1, v2, v3, v4);
    }
  } else {
    while (allImages.length < 19) {
      allImages.push(...venue.images);
    }
  }

  allImages.length = 19;

  return (
    <div className="venue-detail-page-modern">
      {/* HERO SECTION */}
      <div className="vd-hero-container">
        <img src={heroImage} alt={decodedName} className="vd-hero-img" />
        <div className="vd-hero-overlay"></div>
        <div className="vd-hero-watermark">WedMeGood</div>
      </div>

      {/* MAIN CARD */}
      <div className="vd-main-card">
        <div className="vd-card-header">
          <div className="vd-card-title-col">
            <h1 className="vd-title">{decodedName}</h1>
            <p className="vd-subtitle">
              (Formerly known as {decodedName})
            </p>
          </div>
          <div className="vd-rating-box">
            <div className="vd-rating-score">⭐ 4.8</div>
            <div className="vd-rating-reviews">11 reviews</div>
          </div>
        </div>

        {/* Address */}
        <div className="vd-address-section">
          <div className="vd-address-line1">
            <span>Main Road, India (View on Map)</span>
          </div>
          <div className="vd-address-line2">
            Specific Area, India
          </div>
        </div>
      </div>

      {/* PORTFOLIO */}
      <div className="vd-portfolio-container">
        <div className="vd-portfolio-tabs">
          <div
            className={`vd-ptab ${
              activeTab === "portfolio" ? "active" : ""
            }`}
            onClick={() => setActiveTab("portfolio")}
          >
            PORTFOLIO (19)
          </div>
        </div>

        {activeTab === "portfolio" && (
          <div className="vd-photo-gallery-wrapper">
            <div
              className={
                showAllPhotos ? "vd-photo-masonry" : "vd-photo-grid"
              }
            >
              {allImages
                .slice(0, showAllPhotos ? allImages.length : 12)
                .map((img, i) => {
                  const fallbacks = [v1, v2, v3, v4];
                  return (
                    <img
                      key={i}
                      src={img}
                      alt={`${decodedName} ${i + 1}`}
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = fallbacks[i % 4];
                      }}
                    />
                  );
                })}
            </div>

            {!showAllPhotos && (
              <div className="vd-view-more-container">
                <button
                  className="vd-view-more-btn"
                  onClick={() => setShowAllPhotos(true)}
                >
                  View 7 more
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default VenueDetails;