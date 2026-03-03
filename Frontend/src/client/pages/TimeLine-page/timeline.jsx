import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { HiOutlineClock, HiOutlineLocationMarker, HiOutlineCalendar } from "react-icons/hi";
import "./Timeline.css";

// Import your local assets
import engagementImg from "../../assets/engagement.png";
import haldiImg from "../../assets/haldi.png";
import mehendiImg from "../../assets/mehendi.png";
import weddingImg from "../../assets/wedding.png";
import receptionImg from "../../assets/reception.png";

const Timeline = () => {
  const { id } = useParams(); // Grabs the Booking ID from the URL
  const [openIndex, setOpenIndex] = useState(null);
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mapping local assets to event titles
  const imageMap = {
    "Engagement Ceremony": engagementImg,
    "Haldi Function": haldiImg,
    "Mehendi Night": mehendiImg,
    "Wedding Ceremony": weddingImg,
    "Reception": receptionImg
  };

  useEffect(() => {
    // Fetch the specific booking using the ID from the URL
    fetch(`http://localhost:5000/api/bookings/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Booking not found");
        return res.json();
      })
      .then((data) => {
        setBookingData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching timeline:", err);
        setLoading(false);
      });
  }, [id]);

  const toggleEvent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  if (loading) return <div className="loading-screen">Loading Wedding Schedule...</div>;
  if (!bookingData) return <div className="error-screen">Wedding Schedule Not Found.</div>;

  return (
    <div className="timeline-page-wrapper">
      <header className="timeline-hero">
        <h1>{bookingData.title}</h1>
        <p>A celebration of love and togetherness</p>
      </header>

      <div className="timeline-container">
        <div className="vertical-line"></div>

        {bookingData.timeline && bookingData.timeline.map((event, index) => (
          <div 
            key={index} 
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"}`}
          >
            <div className="timeline-dot"></div>
            
            <div className="content-card">
              <div className="event-main">
                <img 
                  src={imageMap[event.title] || weddingImg} 
                  alt={event.title} 
                  className="event-image" 
                />
                <div className="event-info">
                  <span className="event-type-tag">{event.title}</span>
                  <h3>{event.venue}</h3>
                  
                  <div className="meta-info">
                    <span><HiOutlineCalendar /> {event.date}</span>
                    <span><HiOutlineClock /> {event.time}</span>
                  </div>
                </div>
              </div>

              <button className="expand-btn" onClick={() => toggleEvent(index)}>
                {openIndex === index ? "Close Details" : "View Full Schedule"}
              </button>

              {openIndex === index && (
                <div className="expanded-details">
                  <h4>Event Schedule</h4>
                  <ul>
                    {event.schedule.map((item, i) => (
                      <li key={i}>{item}</li>
                    ))}
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