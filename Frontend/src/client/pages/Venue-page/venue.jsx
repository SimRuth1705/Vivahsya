import React, { useState } from "react";
import "./venue.css";
import { Link } from "react-router-dom";

import v1 from "../../assets/wedding-hero-1.jpg";
import v2 from "../../assets/wedding-hero-2.jpg";
import v3 from "../../assets/wedding-hero-3.jpg";
import v4 from "../../assets/wedding-hero-4.jpg";
import v5 from "../../assets/wedding-hero-5.jpg";
import v6 from "../../assets/wedding-hero-6.jpg";
import v7 from "../../assets/wedding-hero-7.jpg";
import v8 from "../../assets/wedding-hero-8.jpg";

const Venue = () => {

  const venuesData = {
    Bangalore: [
      { name: "Royal Palace", img: v1 },
      { name: "Garden Hall", img: v2 },
      { name: "Grand Resort", img: v3 },
      { name: "Elite Banquet", img: v4 },
      { name: "Luxury Banquet", img: v5 },
      { name: "Resort Banquet", img: v6 },
      { name: "Royal Hall", img: v7 },
      { name: "Grand Banquet", img: v8 }
    ],
    Goa: [
      { name: "Beach Resort", img: v2 },
      { name: "Sea Palace", img: v3 },
      { name: "Sunset Hall", img: v1 },
      { name: "Ocean View", img: v4 },
      { name: "Luxury Banquet", img: v5 },
      { name: "Resort Banquet", img: v6 },
      { name: "Royal Hall", img: v7 },
      { name: "Grand Banquet", img: v8 }
    ],
Mangalore: [
  { name: "Coastal Hall", img: v1 },
  { name: "Temple Garden", img: v2 },
  { name: "Palm Resort", img: v3 },
  { name: "Lotus Venue", img: v4 }
],

Shivamogga: [
  { name: "Green Valley", img: v5 },
  { name: "Forest Resort", img: v6 },
  { name: "River Hall", img: v7 },
  { name: "Nature Palace", img: v8 }
],
  };

  /* 🔥 NO DEFAULT CITY */
  const [selectedCity, setSelectedCity] = useState("");

  return (
    <div className="venue-page">

      <div className="venue-title">
        <h2>Venues</h2>
      </div>

      <div className="venue-hero">
        <h1>FIND YOUR DREAM WEDDING VENUE</h1>
        <p>Explore the finest wedding venue tailored to your desires</p>
      </div>

      {/* CITY BUTTONS */}
      <div className="venue-locations">
        {Object.keys(venuesData).map((city) => (
          <button
            key={city}
            onClick={() => setSelectedCity(city)}
            className={selectedCity === city ? "active-city" : ""}
          >
            {city}
          </button>
        ))}
      </div>

      {/* GRID */}
      <div className="venue-grid">

        {/* show nothing until click */}
        {selectedCity && venuesData[selectedCity].map((venue, index) => (
          <Link  to={`/venue/${selectedCity}/${venue.name}`}
              className="venue-card" key={index}>
            <img src={venue.img} alt={venue.name} />

            <div className="venue-overlay">
              <h3>{venue.name}</h3>
            </div>
          </Link>
        ))}

      </div>

    </div>
  );
};

export default Venue;