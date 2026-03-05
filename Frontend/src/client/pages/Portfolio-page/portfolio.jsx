import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import API_BASE_URL from "../../../../config"; // 👈 1. Import your live config URL
import "./portfolio.css";

const fallbackHero = "https://images.unsplash.com/photo-1519225421980-715cb0215aed?q=80&w=2070&auto=format&fit=crop";

const Portfolio = () => {
  const navigate = useNavigate();
  const [portfolioItems, setPortfolioItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPortfolio = async () => {
      try {
        // 👈 2. Replaced hardcoded URL with API_BASE_URL
        const res = await fetch(`${API_BASE_URL}/api/portfolio`);
        const data = await res.json();
        setPortfolioItems(data);
      } catch (err) {
        console.error("Failed to fetch portfolio:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPortfolio();
  }, []);

  const heroImage = portfolioItems.length > 0 ? portfolioItems[0].coverImage : fallbackHero;

  return (
    <div className="vp-portfolio-wrapper">
      {/* 1. UNIQUE CINEMATIC HERO */}
      <header 
        className="vp-hero-section"
        style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${heroImage})` }}
      >
        <div className="vp-hero-content">
          <span className="vp-hero-tag">VIVAHASYA GALLERY</span>
          <h1 className="vp-hero-main-title">Timeless Wedding Stories</h1>
          <div className="vp-hero-divider"></div>
        </div>
      </header>

      {/* 2. UNIQUE CATEGORY NAV */}
      <nav className="vp-category-navbar">
        <button className="vp-nav-link" onClick={() => navigate("/client/portfolio/weddings")}>Weddings</button>
        <button className="vp-nav-link" onClick={() => navigate("/client/portfolio/decor")}>Decor</button>
        <button className="vp-nav-link" onClick={() => navigate("/client/portfolio/photography")}>Photography</button>
      </nav>

      {/* 3. UNIQUE DYNAMIC GRID */}
      <main className="vp-content-container">
        {loading ? (
          <div className="vp-loader-status">Curating Collection...</div>
        ) : (
          <div className="vp-editorial-grid">
            {portfolioItems.slice(0, 6).map((item, index) => (
              <div 
                className={`vp-portfolio-card ${index % 3 === 0 ? "vp-featured" : ""}`} 
                key={item._id}
                onClick={() => navigate(`/client/portfolio/${item.category.toLowerCase()}`)}
              >
                <div className="vp-image-reveal-box">
                  <img src={item.coverImage} alt={item.title} className="vp-card-img" />
                  <div className="vp-card-info-overlay">
                    <span className="vp-card-type-label">{item.category}</span>
                    <h3 className="vp-card-main-title">{item.title}</h3>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default Portfolio;