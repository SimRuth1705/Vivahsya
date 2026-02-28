import React, { useEffect, useState } from "react";
import "./book.css";

const Booking = () => {
  const [client, setClient] = useState(null);

  // Simulated logged-in client data
  useEffect(() => {
    const loggedInClient = {
      name: "Mani Kumar",
      email: "mani@gmail.com",
      phone: "+91 9876543210",
      eventType: "Wedding Ceremony",
      eventDate: "12 March 2026",
      venue: "Royal Palace Hall",
      status: "Confirmed",
    };

    setClient(loggedInClient);
  }, []);

  return (
    <div className="booking-page">
      <div className="booking-container">
        <h1>My Booking Details</h1>

        {client ? (
          <div className="booking-card">
            <div className="detail">
              <span>Name:</span>
              <p>{client.name}</p>
            </div>

            <div className="detail">
              <span>Email:</span>
              <p>{client.email}</p>
            </div>

            <div className="detail">
              <span>Phone:</span>
              <p>{client.phone}</p>
            </div>

            <div className="detail">
              <span>Event Type:</span>
              <p>{client.eventType}</p>
            </div>

            <div className="detail">
              <span>Event Date:</span>
              <p>{client.eventDate}</p>
            </div>

            <div className="detail">
              <span>Venue:</span>
              <p>{client.venue}</p>
            </div>

            <div className="detail status">
              <span>Status:</span>
              <p>{client.status}</p>
            </div>
          </div>
        ) : (
          <p>Loading your booking details...</p>
        )}
      </div>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div>
            <h3>Contact Us</h3>
            <p>Email: support@weddingplanner.com</p>
            <p>Phone: +91 9876543210</p>
          </div>

          <div>
            <h3>Policies</h3>
            <p>Privacy Policy</p>
            <p>Terms & Conditions</p>
            <p>Refund Policy</p>
          </div>

          <div>
            <h3>Location</h3>
            <p>Royal Wedding Planners</p>
            <p>Bangalore, India</p>
          </div>
        </div>

        <p className="copyright">
          © 2026 Royal Wedding Planners. All Rights Reserved.
        </p>
      </footer>
    </div>
  );
};

export default Booking;