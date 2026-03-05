import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import { HiOutlineCalendar, HiOutlineChevronLeft, HiOutlineChevronRight, HiOutlinePlus } from "react-icons/hi";
import API_BASE_URL from "../../../../config"; // 👈 1. Import your live config
import "./Events.css";

// --- 1. CUSTOM DROPDOWN ---
const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);
  const options = ["Wedding", "Birthday", "Corporate", "Anniversary"];

  useEffect(() => {
    const close = (e) => dropdownRef.current && !dropdownRef.current.contains(e.target) && setIsOpen(false);
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className={`status-dot dot-${value.toLowerCase()}`}></span>
        {value}
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {options.map(opt => (
            <li key={opt} onClick={() => { onChange(opt); setIsOpen(false); }}>
              <span className={`status-dot dot-${opt.toLowerCase()}`}></span> {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 2. MAIN COMPONENT ---
const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formEvent, setFormEvent] = useState({
    title: "", date: "", startTime: "10:00", endTime: "14:00", type: "Wedding", status: "Confirmed"
  });

  const fetchEvents = async () => {
    try {
      const token = localStorage.getItem("token");
      // 👈 2. Updated to API_BASE_URL
      const res = await fetch(`${API_BASE_URL}/api/bookings`, {
        headers: { "Authorization": `Bearer ${token}` }
      });
      const data = await res.json();

      if (res.ok && Array.isArray(data)) {
        // MAPPER: Standardizes ISO dates to YYYY-MM-DD for the calendar grid
        const mapped = data.map(evt => ({
          ...evt,
          startTime: evt.startTime || "10:00", // Default for CRM leads
          date: evt.date ? new Date(evt.date).toISOString().split('T')[0] : ""
        }));
        setEvents(mapped);
      }
    } catch (err) {
      toast.error("Network error: Calendar out of sync");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    const method = isEditing ? "PUT" : "POST";
    
    // 👈 3. Updated both URLs to use API_BASE_URL
    const url = isEditing 
      ? `${API_BASE_URL}/api/bookings/${editEventId}` 
      : `${API_BASE_URL}/api/bookings`;

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${token}` },
        body: JSON.stringify(formEvent)
      });
      if (res.ok) {
        toast.success(isEditing ? "Schedule Updated" : "Event Booked");
        setShowModal(false);
        fetchEvents();
      }
    } catch (err) { toast.error("Action failed"); }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];

    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);

    for (let d = 1; d <= daysInMonth; d++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const dayEvents = events.filter(e => e.date === dateString);

      days.push(
        <div key={d} className="calendar-day" onClick={() => {
          setFormEvent({ title: "", date: dateString, startTime: "10:00", endTime: "14:00", type: "Wedding", status: "Confirmed" });
          setIsEditing(false);
          setShowModal(true);
        }}>
          <span className="day-num">{d}</span>
          <div className="event-stack">
            {dayEvents.map(evt => (
              <div key={evt._id} className={`event-chip ${evt.type?.toLowerCase()}`} 
                   onClick={(e) => { e.stopPropagation(); setFormEvent(evt); setEditEventId(evt._id); setIsEditing(true); setShowModal(true); }}>
                {evt.startTime} - {evt.title}
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  if (loading) return <div className="loader">Syncing Schedule...</div>;

  return (
    <div className="events-container">
      <Toaster richColors />
      <div className="events-header">
        <div className="calendar-nav">
          <h1>Calendar</h1>
          <div className="nav-btns">
            <button onClick={() => setCurrentDate(new Date(year, month - 1, 1))}><HiOutlineChevronLeft /></button>
            <span className="current-month">{monthNames[month]} {year}</span>
            <button onClick={() => setCurrentDate(new Date(year, month + 1, 1))}><HiOutlineChevronRight /></button>
          </div>
        </div>
        <button className="add-event-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>
          <HiOutlinePlus /> New Event
        </button>
      </div>

      <div className="calendar-grid">
        <div className="grid-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => <div key={d}>{d}</div>)}
        </div>
        <div className="grid-body">{renderCalendar()}</div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)}>
          <div className="modal-card" onClick={e => e.stopPropagation()}>
            <h2>{isEditing ? "Edit Assignment" : "Add New Event"}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Event Name</label>
                <input value={formEvent.title} onChange={e => setFormEvent({...formEvent, title: e.target.value})} required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Date</label>
                  <input type="date" value={formEvent.date} onChange={e => setFormEvent({...formEvent, date: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Type</label>
                  <StatusDropdown value={formEvent.type} onChange={val => setFormEvent({...formEvent, type: val})} />
                </div>
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">Confirm Slot</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;