import React from "react";
import "./portfolio.css";

// correct path from assets
import img1 from "../../assets/wedding-hero-1.jpg";
import img2 from "../../assets/wedding-hero-2.jpg";
import img3 from "../../assets/wedding-hero-3.jpg";
import img4 from "../../assets/wedding-hero-4.jpg";
import img5 from "../../assets/wedding-hero-5.jpg";
import img6 from "../../assets/wedding-hero-6.jpg";

const Portfolio = () => {
  return (
    <div className="portfolio-page">

      {/* HERO */}
      <div 
        className="hero-section"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="hero-content">
          <h3>OUR PORTFOLIO</h3>
          <h1>TIMELSS WEDDING STORIES</h1>
          <button className="explore-btn">EXPLORE COLLECTION</button>
        </div>
      </div>

      {/* BUTTONS */}
      <div className="category-buttons">
        <button>ALL WORK</button>
        <button>WEDDINGS</button>
        <button>DECOR</button>
        <button>PHOTOGRAPHY</button>
      </div>

      {/* GALLERY */}
      <div className="gallery">

        <div className="gallery-item tall">
          <img src={img1} alt="" />
        </div>

        <div className="gallery-item">
          <img src={img2} alt="" />
        </div>

        <div className="gallery-item">
          <img src={img3} alt="" />
        </div>

        <div className="gallery-item">
          <img src={img4} alt="" />
        </div>

        <div className="gallery-item">
          <img src={img5} alt="" />
        </div>

        <div className="gallery-item tall">
          <img src={img6} alt="" />
        </div>

      </div>

    </div>
  );
};

export default Portfolio;