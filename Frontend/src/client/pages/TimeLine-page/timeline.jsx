import React, { useState } from "react";
import "./Timeline.css";

import engagementImg from "../../assets/engagement.png";
import haldiImg from "../../assets/haldi.png";
import mehendiImg from "../../assets/mehendi.png";
import weddingImg from "../../assets/wedding.png";
import receptionImg from "../../assets/reception.png";

const Timeline = () => {

  const [openIndex, setOpenIndex] = useState(null);

  const events = [
    {
      title: "Engagement Ceremony",
      image: engagementImg,
      status: "Confirmed",
      date: "28 April 2026",
      time: "09:00 AM",
      venue: "Grand Hilton",
      schedule: [
        "07:00 AM – Guest Arrivals",
        "08:30 AM – Breakfast Service",
        "10:30 AM – Ring Exchange",
        "01:00 PM – Lunch"
      ]
    },
    {
      title: "Haldi Function",
      image: haldiImg,
      status: "Confirmed",
      date: "28 April 2026",
      time: "11:00 AM",
      venue: "Grand Hilton",
      schedule: [
        "11:00 AM – Rituals Begin",
        "12:30 PM – Music & Dance",
        "01:30 PM – Lunch"
      ]
    },
    {
      title: "Mehendi Night",
      image: mehendiImg,
      status: "Confirmed",
      date: "28 April 2026",
      time: "05:00 PM",
      venue: "Grand Hilton",
      schedule: [
        "05:00 PM – Mehendi Start",
        "07:00 PM – DJ Night",
        "09:00 PM – Dinner"
      ]
    },
    {
      title: "Wedding Ceremony",
      image: weddingImg,
      status: "Confirmed",
      date: "29 April 2026",
      time: "10:00 AM",
      venue: "Royal Palace Convention Hall",
      schedule: [
        "08:00 AM – Baraat Arrival",
        "09:00 AM – Welcome Rituals",
        "10:00 AM – Muhurtham",
        "12:30 PM – Wedding Lunch"
      ]
    },
    {
      title: "Reception",
      image: receptionImg,
      status: "Confirmed",
      date: "29 April 2026",
      time: "06:00 PM",
      venue: "Royal Palace Convention Hall",
      schedule: [
        "06:00 PM – Guest Welcome",
        "07:00 PM – Couple Entry",
        "08:00 PM – Cake Cutting",
        "09:00 PM – Dinner"
      ]
    }
  ];

  const toggleEvent = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="timeline-container">
      <h2>Wedding Timeline</h2>

      <div className="timeline">
        <div className="line"></div>

        {events.map((event, index) => (
          <div
            key={index}
            className={`timeline-item ${
              index % 2 === 0 ? "left" : "right"
            }`}
          >
            <div className="content">

              <div className="event-header">
                <img src={event.image} alt={event.title} className="event-icon" />
                <h3>{event.title}</h3>
                <span className="status confirmed">
                  {event.status}
                </span>
              </div>

              <p><strong>Date:</strong> {event.date}</p>
              <p><strong>Time:</strong> {event.time}</p>
              <p><strong>Venue:</strong> {event.venue}</p>

              <button
                className="view-btn"
                onClick={() => toggleEvent(index)}
              >
                {openIndex === index ? "Hide Event" : "View Event"}
              </button>

              {openIndex === index && (
                <div className="event-details">
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