import React, { useState, useEffect } from "react";
import { toast, Toaster } from "sonner";
import {
  HiOutlinePencilAlt,
  HiOutlineSave,
  HiOutlineClock,
  HiOutlineUsers,
  HiOutlinePlus
} from "react-icons/hi";
import API_BASE_URL from "../../../../config"; // 👈 1. Imported live config URL
import "./CRM.css";

const CRM = () => {
  const [activeTab, setActiveTab] = useState("leads");
  const [leads, setLeads] = useState([]);
  const [timelineEvents, setTimelineEvents] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // --- NEW STATES FOR ADDING EVENTS ---
  const [isAdding, setIsAdding] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: "Wedding Ceremony",
    venue: "",
    date: "",
    time: "",
    schedule: []
  });

  // Helper to get token for all requests
  const getAuthHeaders = (contentType = "application/json") => {
    const token = localStorage.getItem("token");
    return {
      "Content-Type": contentType,
      "Authorization": `Bearer ${token}`,
    };
  };

  const fetchLeads = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      window.location.href = "/login";
      return;
    }

    try {
      // 👈 2. Updated to API_BASE_URL
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        headers: getAuthHeaders(),
      });

      if (!response.ok) {
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

  const fetchTimeline = async (id) => {
    if (!id) return;
    try {
      // 👈 3. Updated to API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/bookings/${id}`, {
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

  // --- HANDLE UPDATING EXISTING EVENTS ---
  const handleUpdateEvent = async () => {
    if (!selectedBookingId) return;

    try {
      // 👈 4. Updated to API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/bookings/timeline/${selectedBookingId}`, {
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
      toast.error("Connection Refused.");
    }
  };

  // --- HANDLE ADDING NEW EVENT ---
  const handleAddNewEvent = async () => {
    if (!newEvent.venue || !newEvent.date) {
      toast.error("Venue and Date are required!");
      return;
    }

    const updatedTimeline = [...timelineEvents, newEvent];

    try {
      // 👈 5. Updated to API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/bookings/timeline/${selectedBookingId}`, {
        method: "PUT",
        headers: getAuthHeaders(),
        body: JSON.stringify({ timeline: updatedTimeline }),
      });

      if (res.ok) {
        toast.success(`${newEvent.title} added to the client's timeline!`);
        setTimelineEvents(updatedTimeline);
        setIsAdding(false);
        // Reset form
        setNewEvent({ title: "Wedding Ceremony", venue: "", date: "", time: "", schedule: [] });
      } else {
        toast.error("Failed to add event.");
      }
    } catch (err) {
      toast.error("Server error.");
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

  // Titles that map exactly to your Client Timeline images
  const eventOptions = [
    "Engagement Ceremony",
    "Haldi Function",
    "Mehendi Night",
    "Wedding Ceremony",
    "Reception"
  ];

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
                <div className="info-row"><HiOutlineUsers /> <span>{lead.guestCount || "TBD"} Guests</span></div>
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
          
          {/* ADD NEW EVENT BUTTON / FORM */}
          <div className="add-event-section" style={{ marginBottom: "2rem", padding: "1rem", background: "#f8fafc", borderRadius: "8px", border: "1px dashed #cbd5e1" }}>
            {!isAdding ? (
              <button className="btn-primary" onClick={() => setIsAdding(true)} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <HiOutlinePlus /> Add New Timeline Event
              </button>
            ) : (
              <div className="edit-form new-event-form">
                <h3 style={{ marginBottom: "1rem" }}>Create New Event</h3>
                
                <label>Event Type (Maps to Client Image)</label>
                <select 
                  value={newEvent.title} 
                  onChange={(e) => setNewEvent({...newEvent, title: e.target.value})}
                  style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                >
                  {eventOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>

                <label>Venue</label>
                <input type="text" placeholder="e.g. Grand Taj Hall" value={newEvent.venue} onChange={(e) => setNewEvent({...newEvent, venue: e.target.value})} />
                
                <div className="form-row" style={{ display: "flex", gap: "10px" }}>
                  <div style={{ flex: 1 }}>
                    <label>Date</label>
                    <input type="text" placeholder="e.g. 15th October 2026" value={newEvent.date} onChange={(e) => setNewEvent({...newEvent, date: e.target.value})} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <label>Time</label>
                    <input type="text" placeholder="e.g. 10:00 AM" value={newEvent.time} onChange={(e) => setNewEvent({...newEvent, time: e.target.value})} />
                  </div>
                </div>

                <label>Schedule (one activity per line)</label>
                <textarea
                  rows="4"
                  placeholder="Guest Arrival&#10;Ring Exchange&#10;Dinner"
                  value={newEvent.schedule.join("\n")}
                  onChange={(e) => setNewEvent({...newEvent, schedule: e.target.value.split("\n")})}
                />
                
                <div style={{ display: "flex", gap: "10px", marginTop: "10px" }}>
                  <button className="save-btn" onClick={handleAddNewEvent}>
                    <HiOutlineSave /> Save to Client Portal
                  </button>
                  <button className="btn-secondary" onClick={() => setIsAdding(false)} style={{ padding: "10px", borderRadius: "4px", border: "1px solid #ccc", background: "#fff", cursor: "pointer" }}>
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* LIST OF EXISTING EVENTS */}
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
                      <label>Event Type</label>
                      <select 
                        value={event.title} 
                        onChange={(e) => handleInputChange(index, "title", e.target.value)}
                        style={{ width: "100%", padding: "8px", marginBottom: "10px", borderRadius: "4px", border: "1px solid #ccc" }}
                      >
                        {eventOptions.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                      </select>

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