import React, { useState, useEffect } from "react";
import "./portfolio.css";

const Weddings = () => {
  const [items, setItems] = useState([]);
  const [selectedGallery, setSelectedGallery] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/portfolio");
        const data = await res.json();
        // Change "Weddings" to "Decor" or "Photography" for the other files
        setItems(data.filter(item => item.category === "Weddings"));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  if (loading) return <div className="vp-portfolio-wrapper"><div className="vp-loader-status">Curating Collection...</div></div>;

  return (
    <div className="vp-portfolio-wrapper">
      <h1 className="vp-category-title">Weddings Collection</h1>

      {!selectedGallery ? (
        <main className="vp-content-container">
          <div className="vp-editorial-grid">
            {items.map((item, index) => (
              <div 
                key={item._id} 
                className={`vp-portfolio-card ${index % 3 === 0 ? "vp-featured" : ""}`}
                onClick={() => setSelectedGallery(item)}
              >
                <div className="vp-image-reveal-box">
                  <img src={item.coverImage} alt={item.title} className="vp-card-img" />
                  <div className="vp-card-info-overlay">
                    <span className="vp-card-type-label">View Gallery</span>
                    <h3 className="vp-card-main-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </main>
      ) : (
        <main className="vp-content-container">
          <div className="vp-editorial-grid">
            {selectedGallery.images.map((img, idx) => (
              <div className="vp-portfolio-card" key={idx}>
                <div className="vp-image-reveal-box">
                  <img src={img} alt="Gallery detail" className="vp-card-img" />
                </div>
              </div>
            ))}
          </div>
          <div className="vp-back-nav">
            <button className="vp-nav-link" onClick={() => setSelectedGallery(null)}>
              Back to Collection
            </button>
          </div>
        </main>
      )}
    </div>
  );
};

export default Weddings;