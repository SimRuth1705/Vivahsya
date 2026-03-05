import React, { useState, useEffect } from "react";
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";
import API_BASE_URL from "../../../../config"; // 👈 1. Import your live config URL
import "./Timeline.css";

// Import your local assets
import engagementImg from "../../assets/engagement.png";
import haldiImg from "../../assets/haldi.png";
import mehendiImg from "../../assets/mehendi.png";
import weddingImg from "../../assets/wedding.png";
import receptionImg from "../../assets/reception.png";

const Timeline = () => {
  const [openIndex, setOpenIndex] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const imageMap = {
    "Engagement Ceremony": engagementImg,
    "Haldi Function": haldiImg,
    "Mehendi Night": mehendiImg,
    "Wedding Ceremony": weddingImg,
    "Reception": receptionImg
  };

  useEffect(() => {
    const fetchTimelineData = async () => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        // 👈 2. Replaced hardcoded URL with API_BASE_URL
        const response = await fetch(`${API_BASE_URL}/api/bookings/my-booking`, {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          setBookingData(data);
        } else {
          const errData = await response.json();
          setError(errData.message || "Could not load timeline.");
        }
      } catch (err) {
        setError("Connection failed. Please check your internet or server.");
      } finally {
        setLoading(false);
      }
    };

    fetchTimelineData();
  }, []);

  const toggleEvent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  // --- SAFE RENDER GUARDS ---
  if (loading) {
    return <div className="timeline-message-container"><p className="timeline-message">Syncing your beautiful moments...</p></div>;
  }

  if (error) {
    return (
      <div className="timeline-message-container">
        <div className="timeline-message error">
          <p>{error}</p>
          <button onClick={() => { localStorage.clear(); window.location.href='/login'; }}>
            Log Out & Try Again
          </button>
        </div>
      </div>
    );
  }

  if (!bookingData || !bookingData.timeline || bookingData.timeline.length === 0) {
    return (
      <div className="timeline-container">
        <h2>{bookingData?.title || "Your Wedding"} Timeline</h2>
        <div className="timeline-message-container">
          <div className="timeline-message empty">
            <p>Your timeline is currently being crafted by your planner. Check back soon!</p>
          </div>
        </div>
      </div>
    );
  }

  // --- MAIN TIMELINE RENDER ---
  return (
    <div className="timeline-container">
      <h2>{bookingData.title} Timeline</h2>

      <div className="timeline">
        <div className="line"></div>

        {bookingData.timeline.map((event, index) => (
          <div key={index} className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}>
            <div className="content">
              <div className="event-header">
                <img 
                  src={imageMap[event.title] || weddingImg} 
                  alt={event.title} 
                  className="event-icon" 
                />
                <h3>{event.title}</h3>
                <span className="status confirmed">Confirmed</span>
              </div>
              
              <div className="event-details-text">
                <p><HiOutlineLocationMarker className="icon"/> <strong>Venue:</strong> {event.venue}</p>
                <p><HiOutlineCalendar className="icon"/> <strong>Date:</strong> {event.date}</p>
                <p><HiOutlineClock className="icon"/> <strong>Time:</strong> {event.time}</p>
              </div>

              <button className="view-btn" onClick={() => toggleEvent(index)}>
                {openIndex === index ? "Close Details" : "View Full Schedule"}
              </button>

              {openIndex === index && (
                <div className="event-schedule-list">
                  <ul>
                    {event.schedule && event.schedule.length > 0 ? (
                      event.schedule.map((item, i) => <li key={i}>{item}</li>)
                    ) : (
                      <li>Specific times to be decided.</li>
                    )}
                  </ul>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Timeline;