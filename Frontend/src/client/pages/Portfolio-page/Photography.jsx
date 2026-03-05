import React, { useState, useEffect } from "react";
import API_BASE_URL from "../../../../config"; // 👈 1. Import your live config URL
import "./portfolio.css";

const Photography = () => {
  const [items, setItems] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        // 👈 2. Replaced hardcoded URL with API_BASE_URL
        const res = await fetch(`${API_BASE_URL}/api/portfolio`);
        const data = await res.json();
        // Filters only for Photography category
        setItems(data.filter(item => item.category === "Photography"));
      } catch (err) {
        console.error("Photography Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return (
    <div className="vp-portfolio-wrapper">
      <div className="vp-loader-status">Developing Photography Collection...</div>
    </div>
  );

  return (
    <div className="vp-portfolio-wrapper">
      <h1 className="vp-category-title">Photography Collection</h1>

      {!selectedGallery ? (
        <main className="vp-content-container">
          <div className="vp-editorial-grid">
            {items.length > 0 ? items.map((item, index) => (
              <div 
                key={item._id} 
                className={`vp-portfolio-card ${index % 3 === 0 ? "vp-featured" : ""}`}
                onClick={() => setSelectedGallery(item)}
              >
                <div className="vp-image-reveal-box">
                  <img src={item.coverImage} alt={item.title} className="vp-card-img" />
                  <div className="vp-card-info-overlay">
                    <span className="vp-card-type-label">View Portfolio</span>
                    <h3 className="vp-card-main-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: "center", width: "100%", color: "#999" }}>
                No photography projects found.
              </p>
            )}
          </div>
        </main>
      ) : (
        <main className="vp-content-container">
          <div className="vp-editorial-grid">
            {selectedGallery.images.map((img, idx) => (
              <div className="vp-portfolio-card" key={idx}>
                <div className="vp-image-reveal-box">
                  <img src={img} alt="Photo detail" className="vp-card-img" />
                </div>
              </div>
            ))}
          </div>
          <div className="vp-back-nav">
            <button className="vp-nav-link" onClick={() => setSelectedGallery(null)}>
              Back to Photography
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default Photography;