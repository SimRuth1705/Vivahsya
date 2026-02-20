import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import "./Bookings.css";

// --- 1. SMART DROPDOWN (STATUS) ---
const BookingStatusDropdown = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState("bottom");
  const dropdownRef = useRef(null);

  const getStatusColor = (status) => {
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleDropdown = () => {
    if (!isOpen && dropdownRef.current) {
      const rect = dropdownRef.current.getBoundingClientRect();
      const spaceBelow = window.innerHeight - rect.bottom;
      setMenuPosition(spaceBelow < 200 ? "top" : "bottom");
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="booking-dropdown" ref={dropdownRef}>
      <div
        className={`booking-dropdown-trigger ${getStatusColor(currentStatus)}`}
        onClick={toggleDropdown}
      >
        <span className="status-text">{currentStatus}</span>
        <span className="dropdown-arrow">▼</span>
      </div>
      {isOpen && (
        <ul className={`booking-dropdown-menu ${menuPosition}`}>
          {["Pending", "Confirmed", "Completed", "Cancelled"].map((status) => (
            <li
              key={status}
              className={`booking-dropdown-item ${status === currentStatus ? "selected" : ""} ${getStatusColor(status)}`}
              onClick={() => {
                onStatusChange(status);
                setIsOpen(false);
              }}
            >
              {status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 2. CUSTOM SELECT (FOR CLIENTS & VENDORS) ---
const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  isStatus = false,
  displayKey = "name",
  placeholder = "Select option",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  // Find the label to display based on the ID value
  const selectedOption = options.find((opt) => (opt._id || opt) === value);
  const displayValue = selectedOption
    ? selectedOption[displayKey] || selectedOption
    : placeholder;

  const getStatusClass = (status) => {
    if (!isStatus) return "";
    switch (status) {
      case "Pending":
        return "status-pending";
      case "Confirmed":
        return "status-confirmed";
      case "Completed":
        return "status-completed";
      case "Cancelled":
        return "status-cancelled";
      default:
        return "";
    }
  };

  return (
    <div className="custom-input-container" ref={ref}>
      <label>{label}</label>
      <div
        className={`custom-select-box ${isStatus ? getStatusClass(value) + " status-mode" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span>{displayValue}</span>
        <span className="arrow">▼</span>
      </div>
      {isOpen && (
        <ul className="custom-select-list">
          {options.map((opt) => {
            const optId = opt._id || opt;
            const optLabel = opt[displayKey] || opt;
            return (
              <li
                key={optId}
                className={`custom-select-option ${value === optId ? "selected" : ""} ${isStatus ? getStatusClass(optLabel) : ""}`}
                onClick={() => {
                  onChange(optId);
                  setIsOpen(false);
                }}
              >
                {optLabel} {opt.category ? `(${opt.category})` : ""}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// --- 3. CUSTOM DATE PICKER ---
const CustomDatePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef(null);
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  useEffect(() => {
    if (value) setViewDate(new Date(value));
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [value]);

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    for (let i = 0; i < firstDay; i++)
      days.push(<div key={`empty-${i}`} className="bd-day empty"></div>);
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push(
        <div
          key={d}
          className={`bd-day ${value === dateStr ? "selected" : ""}`}
          onClick={() => {
            onChange(dateStr);
            setIsOpen(false);
          }}
        >
          {d}
        </div>,
      );
    }
    return days;
  };

  return (
    <div className="custom-input-container" ref={containerRef}>
      <label>{label}</label>
      <div className="custom-select-box" onClick={() => setIsOpen(!isOpen)}>
        <span>{value || "dd - mm - yyyy"}</span>
        <span>📅</span>
      </div>
      {isOpen && (
        <div className="bd-calendar-popup">
          <div className="bd-header">
            <span>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <div className="bd-nav">
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    new Date(
                      viewDate.getFullYear(),
                      viewDate.getMonth() - 1,
                      1,
                    ),
                  )
                }
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() =>
                  setViewDate(
                    new Date(
                      viewDate.getFullYear(),
                      viewDate.getMonth() + 1,
                      1,
                    ),
                  )
                }
              >
                &gt;
              </button>
            </div>
          </div>
          <div className="bd-grid-head">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="bd-grid-body">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

// --- MAIN BOOKINGS COMPONENT ---
const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [formData, setFormData] = useState({
    title: "",
    type: "Wedding",
    date: "",
    amount: "",
    status: "Pending",
    clientId: "",
    vendorId: "",
  });

  const fetchData = async () => {
    try {
      const [bookRes, clientRes, vendorRes] = await Promise.all([
        fetch("http://localhost:5000/api/bookings"),
        fetch("http://localhost:5000/api/crm"),
        fetch("http://localhost:5000/api/vendors"),
      ]);
      setBookings(await bookRes.json());
      setClients(await clientRes.json());
      setVendors(await vendorRes.json());
    } catch (error) {
      toast.error("Failed to sync database");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredBookings =
    filter === "All" ? bookings : bookings.filter((b) => b.status === filter);

  const handleStatusChange = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/bookings/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (response.ok) {
        const updated = await response.json();
        setBookings((prev) => prev.map((b) => (b._id === id ? updated : b)));
        toast.success(`Status: ${newStatus}`);
      }
    } catch (err) {
      toast.error("Update failed");
    }
  };

  const handleEdit = (booking) => {
    setFormData({
      ...booking,
      clientId: booking.clientId?._id || booking.clientId,
      vendorId: booking.vendorId?._id || booking.vendorId,
    });
    setCurrentId(booking._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div className="delete-confirm-popup">
          <div className="popup-content">
            <h4>Remove Booking?</h4>
            <p>This will be deleted from MongoDB.</p>
          </div>
          <div className="popup-actions">
            <button
              className="btn-cancel-toast"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </button>
            <button
              className="btn-delete-toast"
              onClick={async () => {
                try {
                  const res = await fetch(
                    `http://localhost:5000/api/bookings/${id}`,
                    { method: "DELETE" },
                  );
                  if (res.ok) {
                    setBookings((prev) => prev.filter((b) => b._id !== id));
                    toast.success("Deleted!");
                  }
                  toast.dismiss(t);
                } catch (err) {
                  toast.error("Delete failed");
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { position: "top-right", duration: Infinity },
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/bookings/${currentId}`
      : "http://localhost:5000/api/bookings";
    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        fetchData();
        toast.success(isEditing ? "Updated!" : "Assigned!");
        closeModal();
      }
    } catch (err) {
      toast.error("DB Connection Error");
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      title: "",
      type: "Wedding",
      date: "",
      amount: "",
      status: "Pending",
      clientId: "",
      vendorId: "",
    });
  };

  return (
    <div className="bookings-container">
      <Toaster position="top-right" richColors />
      <div className="bookings-header">
        <h1>Event Assignments</h1>
        <button className="add-booking-btn" onClick={() => setShowModal(true)}>
          + New Assignment
        </button>
      </div>

      <div className="bookings-filter">
        {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map((f) => (
          <button
            key={f}
            className={`filter-tab ${filter === f ? "active" : ""}`}
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
              <th>Client (CRM)</th>
              <th>Vendor</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredBookings.map((b) => (
              <tr key={b._id}>
                <td>
                  <strong>{b.title}</strong>
                </td>
                <td>{b.clientId?.name || "No Client"}</td>
                <td>
                  <span className="vendor-tag">
                    {b.vendorId?.name || "Unassigned"}
                  </span>
                </td>
                <td>{b.date}</td>
                <td style={{ width: "160px" }}>
                  <BookingStatusDropdown
                    currentStatus={b.status}
                    onStatusChange={(s) => handleStatusChange(b._id, s)}
                  />
                </td>
                <td>
                  <button
                    className="action-icon edit"
                    onClick={() => handleEdit(b)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-icon delete"
                    onClick={() => handleDelete(b._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div
          className="modal-overlay"
          onClick={(e) =>
            e.target.className === "modal-overlay" && closeModal()
          }
        >
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Assignment" : "New Assignment"}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="custom-input-container">
                  <label>Event Nickname</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                    placeholder="Ex: Sharma Wedding"
                  />
                </div>
                <div className="custom-input-container">
                  <label>Budget (₹)</label>
                  <input
                    type="text"
                    className="custom-input"
                    value={formData.amount}
                    onChange={(e) =>
                      setFormData({ ...formData, amount: e.target.value })
                    }
                    placeholder="Ex: 50000"
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                {/* POPULATED FROM CRM */}
                <CustomSelect
                  label="Assign Client"
                  options={clients}
                  value={formData.clientId}
                  onChange={(val) =>
                    setFormData({ ...formData, clientId: val })
                  }
                  placeholder="Select Client from CRM"
                />
                {/* POPULATED FROM VENDORS */}
                <CustomSelect
                  label="Assign Vendor"
                  options={vendors}
                  value={formData.vendorId}
                  onChange={(val) =>
                    setFormData({ ...formData, vendorId: val })
                  }
                  placeholder="Select Vendor"
                />
              </div>

              <div className="form-row">
                <CustomSelect
                  label="Event Type"
                  options={["Wedding", "Birthday", "Corporate", "Anniversary"]}
                  value={formData.type}
                  onChange={(val) => setFormData({ ...formData, type: val })}
                />
                <CustomDatePicker
                  label="Event Date"
                  value={formData.date}
                  onChange={(val) => setFormData({ ...formData, date: val })}
                />
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Assignment
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
