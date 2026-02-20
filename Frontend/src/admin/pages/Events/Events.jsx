import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import "./Events.css";

// --- 1. CUSTOM DROPDOWN COMPONENT ---
const StatusDropdown = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const getStatusColor = (type) => {
    switch (type) {
      case "Wedding": return "dot-wedding";
      case "Birthday": return "dot-birthday";
      case "Corporate": return "dot-corporate";
      case "Anniversary": return "dot-anniversary";
      default: return "dot-default";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div className="dropdown-trigger" onClick={() => setIsOpen(!isOpen)}>
        <div className="trigger-content">
          <span className={`status-dot ${getStatusColor(value)}`}></span>
          <span className="trigger-text">{value}</span>
        </div>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <ul className="dropdown-menu">
          {["Wedding", "Birthday", "Corporate", "Anniversary"].map((type) => (
            <li
              key={type}
              onClick={() => { onChange(type); setIsOpen(false); }}
              className={`dropdown-item ${type === value ? "selected" : ""}`}
            >
              <span className={`status-dot ${getStatusColor(type)}`}></span>
              {type}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 2. CUSTOM DATE PICKER COMPONENT ---
const CustomDatePicker = ({ value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const [tempSelectedDate, setTempSelectedDate] = useState(value);
  const containerRef = useRef(null);

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

  useEffect(() => {
    if (isOpen) {
      if (value) {
        setViewDate(new Date(value));
        setTempSelectedDate(value);
      } else {
        setTempSelectedDate("");
      }
    }
  }, [isOpen, value]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const getDaysInMonth = (year, month) => new Date(year, month + 1, 0).getDate();
  const getFirstDayOfMonth = (year, month) => new Date(year, month, 1).getDay();
  const handlePrevMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1));
  const handleNextMonth = () => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1));

  const handleDateClick = (day) => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setTempSelectedDate(dateString);
  };

  const handleSave = () => { onChange(tempSelectedDate); setIsOpen(false); };
  const handleCancel = () => { setIsOpen(false); };

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="dp-day empty"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const currentString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const isSelected = tempSelectedDate === currentString;
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      days.push(
        <div key={day} className={`dp-day ${isSelected ? "selected" : ""} ${isToday ? "today" : ""}`} onClick={() => handleDateClick(day)}>
          {day}
        </div>
      );
    }
    return days;
  };

  const getDisplayText = () => {
    if (!value) return "dd - mm - yyyy";
    const [y, m, d] = value.split("-");
    return `${d} - ${m} - ${y}`;
  };

  return (
    <div className="custom-datepicker" ref={containerRef}>
      <div className="dp-trigger" onClick={() => setIsOpen(!isOpen)}>
        <span className={`dp-text ${!value ? "placeholder" : ""}`}>{getDisplayText()}</span>
        <span className="dp-icon">📅</span>
      </div>
      {isOpen && (
        <div className="dp-popup">
          <div className="dp-header">
            <span className="dp-month-label">{monthNames[viewDate.getMonth()]}, {viewDate.getFullYear()}</span>
            <div className="dp-arrows">
              <button type="button" onClick={handlePrevMonth}>&lt;</button>
              <button type="button" onClick={handleNextMonth}>&gt;</button>
            </div>
          </div>
          <div className="dp-grid-header">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => <div key={d} className="dp-weekday">{d}</div>)}
          </div>
          <div className="dp-grid-body">{renderDays()}</div>
          <div className="dp-footer">
            <button type="button" className="dp-btn-cancel" onClick={handleCancel}>Cancel</button>
            <button type="button" className="dp-btn-save" onClick={handleSave}>Save</button>
          </div>
        </div>
      )}
    </div>
  );
};

// --- 3. MAIN EVENTS COMPONENT ---
const Events = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editEventId, setEditEventId] = useState(null);
  const [events, setEvents] = useState([]);

  // Fetch Events from Backend
  const fetchEvents = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/bookings");
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      toast.error("Could not load events.");
    }
  };

  useEffect(() => { fetchEvents(); }, []);

  const [formEvent, setFormEvent] = useState({
    title: "",
    date: "",
    startTime: "09:00",
    endTime: "10:00", 
    type: "Wedding",
    status: "Pending",
    amount: "₹0",
  });

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const handlePrevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const handleNextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const handleDateClick = (day) => {
    const selectedDate = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setFormEvent({ title: "", date: selectedDate, startTime: "09:00", endTime: "10:00", type: "Wedding", status: "Pending", amount: "₹0" });
    setIsEditing(false);
    setShowModal(true);
  };

  const handleEventClick = (e, evt) => {
    e.stopPropagation();
    setFormEvent(evt);
    setIsEditing(true);
    setEditEventId(evt._id);
    setShowModal(true);
  };

  const handleDeleteEvent = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await fetch(`http://localhost:5000/api/bookings/${id}`, { method: "DELETE" });
      if (res.ok) {
        setEvents(prev => prev.filter(evt => evt._id !== id));
        toast.success("Event removed from calendar.");
      }
    } catch (err) {
      toast.error("Failed to delete.");
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing ? `http://localhost:5000/api/bookings/${editEventId}` : "http://localhost:5000/api/bookings";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method: method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formEvent),
      });
      const data = await response.json();

      if (!response.ok) return toast.error(data.message || "Action failed");

      if (isEditing) {
        setEvents(events.map(evt => evt._id === editEventId ? data : evt));
        toast.success("Event updated!");
      } else {
        setEvents([...events, data]);
        toast.success("Slot booked successfully!");
      }
      setShowModal(false);
    } catch (err) {
      toast.error("Network error.");
    }
  };

  const getEventTypeColor = (type) => {
    switch (type) {
      case "Wedding": return "evt-wedding";
      case "Birthday": return "evt-birthday";
      case "Corporate": return "evt-corporate";
      case "Anniversary": return "evt-anniversary";
      default: return "evt-default";
    }
  };

  const renderCalendar = () => {
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    for (let day = 1; day <= daysInMonth; day++) {
      const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
      const dayEvents = events.filter((e) => e.date === dateString);
      const isToday = new Date().toDateString() === new Date(year, month, day).toDateString();
      days.push(
        <div key={day} className={`calendar-day ${isToday ? "today" : ""}`} onClick={() => handleDateClick(day)}>
          <div className="day-number">{day}</div>
          <div className="day-events">
            {dayEvents.map((evt) => (
              <div key={evt._id} className={`event-chip ${getEventTypeColor(evt.type)}`} onClick={(e) => handleEventClick(e, evt)}>
                <span className="event-title">{evt.startTime} - {evt.title}</span>
                <span className="delete-btn" onClick={(e) => handleDeleteEvent(e, evt._id)}>&times;</span>
              </div>
            ))}
          </div>
        </div>
      );
    }
    return days;
  };

  return (
    <div className="events-container">
      <Toaster position="top-right" richColors />
      <div className="events-header">
        <div className="header-left">
          <h1>Calendar</h1>
          <div className="month-controls">
            <button onClick={handlePrevMonth}>&lt;</button>
            <span>{monthNames[month]} {year}</span>
            <button onClick={handleNextMonth}>&gt;</button>
          </div>
        </div>
        <button className="add-event-btn" onClick={() => {
            setFormEvent({ title: "", date: "", startTime: "09:00", endTime: "10:00", type: "Wedding", status: "Pending", amount: "₹0" });
            setIsEditing(false);
            setShowModal(true);
        }}>+ Add Event</button>
      </div>

      <div className="calendar-wrapper">
        <div className="calendar-grid-header">
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => <div key={d} className="week-day">{d}</div>)}
        </div>
        <div className="calendar-grid">{renderCalendar()}</div>
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && setShowModal(false)}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Event" : "New Event"}</h2>
              <button className="close-modal-btn" onClick={() => setShowModal(false)}>&times;</button>
            </div>
            <form onSubmit={handleFormSubmit}>
              <div className="form-group">
                <label>Event Title</label>
                <input type="text" className="styled-input" value={formEvent.title} onChange={(e) => setFormEvent({ ...formEvent, title: e.target.value })} required autoFocus />
              </div>
              <div className="form-row" style={{ display: 'flex', gap: '10px' }}>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Start Time</label>
                  <input type="time" className="styled-input" value={formEvent.startTime} onChange={(e) => setFormEvent({ ...formEvent, startTime: e.target.value })} required />
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>End Time</label>
                  <input type="time" className="styled-input" value={formEvent.endTime} onChange={(e) => setFormEvent({ ...formEvent, endTime: e.target.value })} required />
                </div>
              </div>
              <div className="form-group">
                <label>Date</label>
                <CustomDatePicker value={formEvent.date} onChange={(val) => setFormEvent({ ...formEvent, date: val })} />
              </div>
              <div className="form-group">
                <label>Event Type</label>
                <StatusDropdown value={formEvent.type} onChange={(val) => setFormEvent({ ...formEvent, type: val })} />
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="save-btn">{isEditing ? "Update" : "Save"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Events;