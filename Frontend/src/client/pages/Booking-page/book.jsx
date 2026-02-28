import React, { useEffect, useState } from "react";
import "./book.css";

const Booking = () => {
  const [client, setClient] = useState(null);

  useEffect(() => {
    const loggedInClient = {
      name: "Kumar",
      eventType: "Wedding Ceremony",
      eventDate: "12 March 2026",
      venue: "Royal Palace Hall",
      paymentStatus: "Paid",
      amountPaid: "₹2,50,000",
      paymentMode: "UPI",
      transactionId: "TXN45896321",
      receiptNumber: "REC2026-145",
    };

    setClient(loggedInClient);
  }, []);

  return (
    <div className="booking-page">
      <div className="overlay">
        <div className="booking-container">

          {/* Welcome Section */}
          <center> <h1 className="welcome-text">
            Welcome {client ? client.name : "Guest"}
          </h1> </center>

          {client ? (
            <>
              {/* Booking Details */}
              <div className="booking-card">
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
              </div>

              {/* Payment Details */}
              <div className="payment-card">
                <h3>Payment Details</h3>
                <div className="detail">
                  <span>Status:</span>
                  <p>{client.paymentStatus}</p>
                </div>
                <div className="detail">
                  <span>Amount Paid:</span>
                  <p>{client.amountPaid}</p>
                </div>
                <div className="detail">
                  <span>Payment Mode:</span>
                  <p>{client.paymentMode}</p>
                </div>
                <div className="detail">
                  <span>Transaction ID:</span>
                  <p>{client.transactionId}</p>
                </div>
              </div>

              {/* Receipt Section */}
              <div className="receipt-card">
                <h3>Payment Receipt</h3>
                <p>Receipt Number: {client.receiptNumber}</p>
                <button className="download-btn">Download Receipt</button>
              </div>
            </>
          ) : (
            <p>Loading your booking details...</p>
          )}
        </div>

        {/* Footer */}
        <footer className="footer">
          <div className="footer-content">
            <div>
              <h3>Contact Us</h3>
              <p>Email: vivahasya@weddingplanner.com</p>
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
              <p>Bangalore,India</p>
            </div>
          </div>

          <p className="copyright">
            © 2026 Royal Wedding Planners. All Rights Reserved.
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Booking;