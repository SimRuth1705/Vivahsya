import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import {
  HiOutlinePencilAlt,
  HiOutlineSave,
  HiOutlineClock,
  HiOutlineUsers,
} from "react-icons/hi";
import "./CRM.css";

const CRM = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Helper to get token for all requests
  const getAuthHeaders = (contentType = "application/json") => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": contentType,
      "Authorization": `Bearer ${token}`, // Critical for adminOnly middleware
    };
  };

  // ... inside your CRM component
const fetchLeads = async () => {
  const token = localStorage.getItem("token");

  // GUARD: If no token exists, don't even call the server
  if (!token) {
    console.warn("No token found, redirecting to login...");
    window.location.href = "/login";
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/leads", {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      // If unauthorized, clear the dead token and kick to login
      if (response.status === 401 || response.status === 403) {
        localStorage.clear();
        window.location.href = "/login";
        return;
      }
      throw new Error("Failed to fetch leads.");
    }

    const data = await response.json();
    setLeads(data);
  } catch (error) {
    toast.error(error.message || "Database connection failed.");
  }
};

  // --- 2. FETCH SPECIFIC TIMELINE ---
  const fetchTimeline = async (id) => {
    if (!id) return;
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        headers: getAuthHeaders(),
      });
      const data = await res.json();
      setTimelineEvents(data.timeline || []);
    } catch (err) {
      toast.error("Timeline sync failed. Check server connection.");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // --- 3. HANDLE UPDATE LOGIC ---
  const handleUpdateEvent = async () => {
    if (!selectedBookingId) {
      toast.error("Please select a booking from the Lead Engine first.");
      return;
    }

    try {
      // Sending the FULL timeline array as expected by the backend
      const res = await fetch(`http://localhost:5000/api/bookings/timeline/${selectedBookingId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ timeline: timelineEvents }),
      });

      if (res.ok) {
        toast.success("Timeline synced successfully!");
        setEditingIndex(null);
      } else {
        const errorData = await res.json();
        toast.error(`Sync Failed: ${errorData.message}`);
      }
    } catch (err) {
      toast.error("Connection Refused: Is your backend running on port 5000?");
    }
  };

  const handleInputChange = (index, field, value) => {
    const updated = [...timelineEvents];
    updated[index][field] = value;
    setTimelineEvents(updated);
  };

  const manageTimeline = (id) => {
    setSelectedBookingId(id);
    fetchTimeline(id);
    setActiveTab("timeline");
  };

  return (
    <div className="crm-page admin-white-bg">
      <Toaster position="top-right" richColors />

      {/* HEADER NAVIGATION */}
      <div className="crm-header-nav">
        <button className={activeTab === "leads" ? "active" : ""} onClick={() => setActiveTab("leads")}>
          Lead Engine
        </button>
        <button 
          className={activeTab === "timeline" ? "active" : ""} 
          onClick={() => setActiveTab("timeline")}
          disabled={!selectedBookingId}
        >
          {selectedBookingId ? "Manage Timeline" : "Select a Lead first"}
        </button>
      </div>

      {/* LEAD ENGINE VIEW */}
      {activeTab === "leads" && (
        <div className="leads-grid">
          {leads.map((lead) => (
            <div key={lead._id} className="lead-card">
              <div className="lead-header">
                <h3>{lead.name}</h3>
                <span className="lead-badge">{lead.status}</span>
              </div>
              <div className="lead-body">
                <div className="info-row"><HiOutlineClock /> <span>{lead.date}</span></div>
                <div className="info-row"><HiOutlineUsers /> <span>{lead.guestCount} Guests</span></div>
              </div>
              <div className="lead-footer">
                <button className="btn-primary" onClick={() => manageTimeline(lead._id)}>
                  Manage Timeline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* TIMELINE EDITOR VIEW */}
      {activeTab === "timeline" && (
        <div className="timeline-editor-container">
          <div className="editor-grid">
            {timelineEvents.length === 0 ? (
              <p className="no-data">No timeline events found for this booking.</p>
            ) : (
              timelineEvents.map((event, index) => (
                <div key={index} className="editor-card">
                  <div className="card-header">
                    <h3>{event.title}</h3>
                    <button onClick={() => setEditingIndex(editingIndex === index ? null : index)}>
                      <HiOutlinePencilAlt /> {editingIndex === index ? "Cancel" : "Edit"}
                    </button>
                  </div>

                  {editingIndex === index ? (
                    <div className="edit-form">
                      <label>Venue</label>
                      <input type="text" value={event.venue} onChange={(e) => handleInputChange(index, "venue", e.target.value)} />
                      <div className="form-row">
                        <div>
                          <label>Date</label>
                          <input type="text" value={event.date} onChange={(e) => handleInputChange(index, "date", e.target.value)} />
                        </div>
                        <div>
                          <label>Time</label>
                          <input type="text" value={event.time} onChange={(e) => handleInputChange(index, "time", e.target.value)} />
                        </div>
                      </div>
                      <label>Schedule (one per line)</label>
                      <textarea
                        rows="4"
                        value={event.schedule.join("\n")}
                        onChange={(e) => handleInputChange(index, "schedule", e.target.value.split("\n"))}
                      />
                      <button className="save-btn" onClick={handleUpdateEvent}>
                        <HiOutlineSave /> Push Updates to Client
                      </button>
                    </div>
                  ) : (
                    <div className="read-only-preview">
                      <p><strong>Venue:</strong> {event.venue}</p>
                      <p><strong>Date:</strong> {event.date} | {event.time}</p>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;