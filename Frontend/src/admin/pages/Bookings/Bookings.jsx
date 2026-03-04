import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineUserGroup } from "react-icons/hi";
import "./Bookings.css";

// --- STATUS PILL COMPONENT ---
const BookingStatusPill = ({ currentStatus }) => {
  const statusClass = currentStatus?.toLowerCase() || "pending";
  return (
    <div className="status-dropdown-container">
      <span className={`status-pill ${statusClass}`}>
        {currentStatus}
      </span>
    </div>
  );
};

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [filter, setFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // --- DATA FETCHING ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      // ✅ Using 127.0.0.1 for browser stability over 'localhost'
      const bookRes = await fetch("http://127.0.0.1:5000/api/bookings", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (bookRes.status === 401) {
        toast.error("Session expired. Please login again.");
        return;
      }

      const data = await bookRes.json();
      
      if (bookRes.ok && Array.isArray(data)) {
        setBookings(data);
      } else {
        setBookings([]);
      }
    } catch (error) {
      console.error("Sync error:", error);
      toast.error("Network error: Check if backend is running");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTER LOGIC ---
  const filteredBookings = Array.isArray(bookings) 
    ? bookings.filter((b) => (filter === "All" ? true : b.status === filter))
    : [];

  // --- RENDER ---
  if (loading) return (
    <div className="loading-state">
      <div className="spinner"></div>
      Syncing Event Assignments...
    </div>
  );

  return (
    <div className="bookings-container">
      <Toaster position="top-right" richColors />
      
      <div className="bookings-header">
        <div className="header-text">
          <h1><HiOutlineCalendar /> Event Assignments</h1>
          <p className="subtitle">Real-time monitor for all confirmed wedding & event schedules</p>
        </div>
        <div className="header-stats">
          <div className="stat-tag">Total: {bookings.length}</div>
        </div>
      </div>

      <div className="filter-tabs">
        {["All", "Pending", "Confirmed", "Completed"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Client Details</th>
              <th>Venue</th>
              <th>Assigned Vendor</th>
              <th>Event Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.length > 0 ? (
              filteredBookings.map((b) => (
                <tr key={b._id}>
                  <td className="title-cell">
                    <strong>{b.title || "Unnamed Event"}</strong>
                    <span className="type-sub">{b.type}</span>
                  </td>
                  
                  <td className="client-info">
                    <div className="user-flex">
                      <HiOutlineUserGroup className="row-icon" />
                      {/* ✅ Handles data from both manual creation and CRM confirm */}
                      <span>{b.clientId?.name || b.title.split("'s")[0] || "Client"}</span>
                    </div>
                  </td>

                  <td>
                    <div className="venue-flex">
                      <HiOutlineLocationMarker className="row-icon" />
                      <span className="venue-cell">{b.venueId?.name || "TBD"}</span>
                    </div>
                  </td>

                  <td>
                    <span className={`vendor-tag ${!b.vendorId ? "unassigned" : ""}`}>
                      {b.vendorId?.name || "Needs Vendor"}
                    </span>
                  </td>

                  <td className="date-cell">
                    {b.date ? new Date(b.date).toLocaleDateString('en-IN', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric'
                    }) : "No Date Set"}
                  </td>

                  <td>
                    <BookingStatusPill currentStatus={b.status} />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="empty-row">
                  <div className="empty-content">
                    <p>No assignments found for status: <strong>{filter}</strong></p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Bookings;