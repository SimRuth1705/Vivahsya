import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import {
  HiOutlinePencilAlt,
  HiOutlineTrash,
  HiOutlineOfficeBuilding,
} from "react-icons/hi"; // Added venue icon
import "./Bookings.css";

// --- (Keep your existing BookingStatusDropdown, CustomSelect, and CustomDatePicker components as they are) ---

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const [clients, setClients] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [venues, setVenues] = useState([]); // 1. Added Venue State
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
    venueId: "", // 2. Added venueId to formData
  });

  // 3. Updated Fetch to include Venues
  const fetchData = async () => {
    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      const [bookRes, vendorRes, venueRes] = await Promise.all([
        fetch("http://localhost:5000/api/bookings", { headers }),
        fetch("http://localhost:5000/api/vendors", { headers }),
        fetch("http://localhost:5000/api/venues", { headers }),
      ]);

      const bookingsData = await bookRes.json();
      const vendorsData = await vendorRes.json();
      const venuesData = await venueRes.json();
      
      setBookings(bookingsData);
      setVendors(vendorsData);
      setVenues(venuesData);
      
      // Extract clients from bookings that have clientId populated
      const clientsFromBookings = bookingsData
        .filter(b => b.clientId)
        .map(b => b.clientId)
        .filter((client, index, self) => self.findIndex(c => c._id === client._id) === index);
      setClients(clientsFromBookings);
    } catch (error) {
      console.error("Fetch error:", error);
  }, []);

  const handleEdit = (booking) => {
    setFormData({
      ...booking,
      clientId: booking.clientId?._id || booking.clientId,
      vendorId: booking.vendorId?._id || booking.vendorId,
      venueId: booking.venueId?._id || booking.venueId, // 4. Populate venueId on edit
    });
    setCurrentId(booking._id);
    setIsEditing(true);
    setShowModal(true);
  };

  // ... (Keep handleDelete and handleStatusChange the same)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/bookings/${currentId}`
      : "http://localhost:5000/api/bookings";

    try {
      const response = await fetch(url, {
        method: isEditing ? "PUT" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        fetchData();
        toast.success(isEditing ? "Details Updated!" : "Event Assigned!");
        closeModal();
      }
    } catch (err) {
      toast.error("DB Sync Error");
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
      venueId: "", // Reset venueId
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

      {/* ... (Filter Tabs) */}

      <div className="bookings-table-wrapper">
        <table className="bookings-table">
          <thead>
            <tr>
              <th>Event Title</th>
              <th>Client (CRM)</th>
              <th>Venue</th> {/* 5. New Column */}
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
                  <span className="venue-cell">{b.venueId?.name || "TBD"}</span>
                </td>
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
                    required
                  />
                </div>
              </div>

              <div className="form-row">
                <CustomSelect
                  label="Assign Client"
                  options={clients}
                  value={formData.clientId}
                  onChange={(val) =>
                    setFormData({ ...formData, clientId: val })
                  }
                />
                <CustomSelect
                  label="Assign Vendor"
                  options={vendors}
                  value={formData.vendorId}
                  onChange={(val) =>
                    setFormData({ ...formData, vendorId: val })
                  }
                />
              </div>

              {/* 6. NEW FORM ROW FOR VENUE */}
              <div className="form-row">
                <CustomSelect
                  label="Select Venue"
                  options={venues}
                  value={formData.venueId}
                  onChange={(val) => setFormData({ ...formData, venueId: val })}
                  placeholder="Choose a Venue"
                />
                <div className="form-sub-row">
                  <CustomSelect
                    label="Event Type"
                    options={[
                      "Wedding",
                      "Birthday",
                      "Corporate",
                      "Anniversary",
                    ]}
                    value={formData.type}
                    onChange={(val) => setFormData({ ...formData, type: val })}
                  />
                </div>
              </div>

              <div className="form-row">
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
