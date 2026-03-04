import React, { useState, useEffect } from "react";
import "./portfolio.css";

const Decor = () => {
  const [items, setItems] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/portfolio");
        const data = await res.json();
        // Filters only for Decor category
        setItems(data.filter(item => item.category === "Decor"));
      } catch (err) {
        console.error("Decor Fetch Error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return (
    <div className="vp-portfolio-wrapper">
      <div className="vp-loader-status">Curating Decor Collection...</div>
    </div>
  );

  return (
    <div className="vp-portfolio-wrapper">
      <h1 className="vp-category-title">Decor & Aesthetics</h1>

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
                    <span className="vp-card-type-label">View Details</span>
                    <h3 className="vp-card-main-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            )) : (
              <p style={{ textAlign: "center", width: "100%", color: "#999" }}>
                No decor projects found.
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
                  <img src={img} alt="Decor detail" className="vp-card-img" />
                </div>
              </div>
            ))}
          </div>
          <div className="vp-back-nav">
            <button className="vp-nav-link" onClick={() => setSelectedGallery(null)}>
              Back to Decor Collection
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default Decor;