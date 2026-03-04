import React, { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import "./book.css";

const ClientBooking = () => {
  const [bookingData, setBookingData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookingData = async () => {
      const token = localStorage.getItem("token");

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
          
          setBookingData({
            clientName: data.clientId?.name || "Valued Client",
            eventType: data.type || data.title || "Wedding Ceremony",
            eventDate: data.leadId?.date || data.date || "TBD",
            venueName: data.venueId?.name || "Venue Details Pending",
            status: data.status || "Pending",
            budget: data.leadId?.budget || data.amount || "0",
            bookingId: data._id.slice(-8).toUpperCase(),
            receiptNo: `VH-${data._id.slice(-5)}`,
          });
        } else {
          toast.error("Booking details are not available yet.");
        }
      } catch (error) {
        toast.error("Network error: Could not connect to Vivahasya server.");
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
          <center> 
            <h1 className="welcome-text">
              Welcome {bookingData ? bookingData.clientName : "Guest"}
            </h1> 
          </center>

          {bookingData ? (
            <>
              <div className="booking-card">
                <div className="detail">
                  <span>Event Type:</span>
                  <p>{bookingData.eventType}</p>
                </div>
                <div className="detail">
                  <span>Event Date:</span>
                  <p>{bookingData.eventDate}</p>
                </div>
                <div className="detail">
                  <span>Venue:</span>
                  <p>{bookingData.venueName}</p>
                </div>
              </div>

              <div className="payment-card">
                <h3>Booking Status</h3>
                <div className="detail">
                  <span>Status:</span>
                  <p className={`status-highlight ${bookingData.status.toLowerCase()}`}>
                    {bookingData.status}
                  </p>
                </div>
                <div className="detail">
                  <span>Total Budget:</span>
                  <p>₹{bookingData.budget}</p>
                </div>
                <div className="detail">
                  <span>Booking ID:</span>
                  <p>#{bookingData.bookingId}</p>
                </div>
              </div>

              <div className="receipt-card">
                <h3>Payment Receipt</h3>
                <p>Receipt Number: {bookingData.receiptNo}</p>
                <button className="download-btn" onClick={() => toast.success("Downloading...")}>
                  Download Receipt
                </button>
              </div>
            </>
          ) : (
            <div className="no-data-msg">
              <h3>Inquiry Pending</h3>
              <p>Your details will appear once the admin confirms your event assignment.</p>
            </div>
          )}
        </div>

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
              <p>Royal Wedding Planners, Bangalore, India</p>
            </div>
          </div>
          <p className="copyright">© 2026 Vivahasya. All Rights Reserved.</p>
        </footer>
      </div>
    </div>
  );
};

export default ClientBooking;