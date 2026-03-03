import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import "./book.css";

const Booking = () => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingData = async () => {
      const token = localStorage.getItem("token");

      // Guard: Redirect to login if no token is found
      if (!token) {
        window.location.href = "/login";
        return;
      }

      try {
        const response = await fetch("http://localhost:5000/api/bookings/my-booking", {
          headers: {
            "Authorization": `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        });

        if (response.ok) {
          const data = await response.json();
          
          // Map MongoDB data (from populate) to your UI fields
          setClient({
            name: data.clientId?.name || "Valued Client",
            eventType: data.title || "Wedding Ceremony",
            eventDate: data.leadId?.date || "TBD",
            venue: data.timeline[0]?.venue || "Venue Details Pending",
            paymentStatus: data.status === 'Confirmed' ? "Partial Paid" : "Pending",
            amountPaid: `₹${data.leadId?.budget || '0'}`,
            paymentMode: "Online Transfer",
            transactionId: data._id.slice(-10).toUpperCase(),
            receiptNumber: `VH-${data._id.slice(-5)}`,
          });
        } else {
          toast.error("Could not retrieve your booking details.");
        }
      } catch (error) {
        toast.error("Network error: Is the Vivahasya server running?");
      } finally {
        setLoading(false);
      }
    };

    fetchBookingData();
  }, []);

  if (loading) return <div className="loading-state">Syncing with Vivahasya Portal...</div>;

  return (
    <div className="booking-page">
      <Toaster position="top-right" richColors />
      <div className="overlay">
        <div className="booking-container">

          {/* Welcome Section */}
          <center> 
            <h1 className="welcome-text">
              Welcome {client ? client.name : "Guest"}
            </h1> 
          </center>

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
                  <p className="status-highlight">{client.paymentStatus}</p>
                </div>
                <div className="detail">
                  <span>Amount Paid:</span>
                  <p>{client.amountPaid}</p>
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
            <div className="no-data-msg">
              <h3>No Active Booking</h3>
              <p>Your details will appear once the admin confirms your inquiry.</p>
            </div>
          )}
        </div>

        {/* Footer Section */}
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
    </div>
  );
};

export default Booking;