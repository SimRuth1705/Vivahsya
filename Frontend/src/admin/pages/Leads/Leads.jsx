import React, { useState, useEffect, useRef } from "react";
import { Toaster, toast } from "sonner";
import "./Leads.css";

// --- 1. TABLE STATUS DROPDOWN (Quick change from the table) ---
const TableStatusDropdown = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const statuses = ["New", "Contacted", "Converted", "Lost"];

  return (
    <div
      className="table-status-container"
      ref={ref}
      style={{ position: "relative" }}
    >
      <button
        className={`status-badge status-${currentStatus.toLowerCase()} clickable`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        {currentStatus} ▼
      </button>
      {isOpen && (
        <ul
          className="table-status-menu"
          style={{
            position: "absolute",
            zIndex: 100,
            background: "white",
            border: "1px solid #ddd",
            borderRadius: "4px",
            padding: "5px",
            listStyle: "none",
            width: "120px",
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            top: "100%",
            left: "0",
          }}
        >
          {statuses.map((s) => (
            <li
              key={s}
              style={{ padding: "8px", cursor: "pointer", fontSize: "12px" }}
              onClick={() => {
                onStatusChange(s);
                setIsOpen(false);
              }}
            >
              {s}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 2. CUSTOM SELECT (Used in the Modal Form) ---
const CustomSelect = ({
  label,
  options,
  value,
  onChange,
  isStatus = false,
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

  const getStatusClass = (status) => {
    if (!isStatus) return "";
    switch (status) {
      case "New":
        return "status-new";
      case "Contacted":
        return "status-contacted";
      case "Converted":
        return "status-converted";
      case "Lost":
        return "status-lost";
      default:
        return "";
    }
  };

  const handleOptionClick = (e, opt) => {
    e.preventDefault();
    e.stopPropagation();
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div className="form-group" ref={ref} style={{ position: "relative" }}>
      <label>{label}</label>
      <div
        className={`custom-select-trigger ${isStatus ? getStatusClass(value) + " badge-trigger" : ""}`}
        onClick={(e) => {
          e.preventDefault();
          setIsOpen(!isOpen);
        }}
      >
        <span>{value}</span>
        <span className="arrow">{isOpen ? "▲" : "▼"}</span>
      </div>
      {isOpen && (
        <ul
          className="custom-select-menu"
          style={{
            display: "block",
            position: "absolute",
            zIndex: 10000,
            background: "white",
            width: "100%",
            border: "1px solid #ddd",
            borderRadius: "8px",
            marginTop: "5px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {options.map((opt) => (
            <li
              key={opt}
              className={`custom-select-item ${value === opt ? "selected" : ""}`}
              onClick={(e) => handleOptionClick(e, opt)}
              style={{ padding: "10px", cursor: "pointer", listStyle: "none" }}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

// --- 3. MAIN LEADS COMPONENT ---
const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    source: "Website",
    status: "New",
    notes: "",
  });

  // FETCH LEADS FROM MONGODB
  useEffect(() => {
    const fetchLeads = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/leads");
        const data = await response.json();
        setLeads(data);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load leads from database");
        setLoading(false);
      }
    };
    fetchLeads();
  }, []);

  const updateLeadStatus = async (id, newStatus) => {
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      // Inside Leads.jsx -> updateLeadStatus function
      if (newStatus === "Converted") {
        await fetch("http://localhost:5000/api/bookings", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: updatedLead.name,
            type: "Wedding",
            date: new Date().toISOString().split("T")[0],
            startTime: "09:00",
            endTime: "10:00",
            amount: "₹0",
            source: updatedLead.source, 
            status: "Pending",
            leadId: updatedLead._id,
          }),
        });
        toast.success("Lead converted with Source tracking!");
      }

      if (response.ok) {
        const updatedLead = await response.json();
        setLeads((prev) => prev.map((l) => (l._id === id ? updatedLead : l)));
        if (newStatus === "Converted") {
          await fetch("http://localhost:5000/api/bookings", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              title: updatedLead.name,
              type: "Wedding",
              date: new Date().toISOString().split("T")[0],
              amount: "₹0",
              status: "Pending",
              leadId: updatedLead._id,
            }),
          });
          toast.success("Lead converted and synced with Bookings & Calendar!");
        } else {
          toast.success(`Status updated to ${newStatus}`);
        }
      }
    } catch (error) {
      toast.error("Connection error: Could not sync with database");
    }
  };

  const filteredLeads =
    filter === "All" ? leads : leads.filter((l) => l.status === filter);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isEditing
      ? `http://localhost:5000/api/leads/${currentId}`
      : "http://localhost:5000/api/leads";
    const method = isEditing ? "PUT" : "POST";

    try {
      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const savedLead = await response.json();
        if (isEditing) {
          setLeads(leads.map((l) => (l._id === currentId ? savedLead : l)));
          toast.success("Lead updated successfully!");
        } else {
          setLeads([savedLead, ...leads]);
          toast.success("New lead saved to MongoDB!");
        }
        closeModal();
      }
    } catch (error) {
      toast.error("Error connecting to database");
    }
  };

  const handleDelete = (id) => {
    toast.custom(
      (t) => (
        <div className="custom-toast-box">
          <div className="toast-text">
            <strong>Delete Lead?</strong>
            <p>This action cannot be undone.</p>
          </div>
          <div className="toast-actions">
            <button
              className="toast-btn cancel"
              onClick={() => toast.dismiss(t)}
            >
              Cancel
            </button>
            <button
              className="toast-btn delete"
              onClick={async () => {
                try {
                  await fetch(`http://localhost:5000/api/leads/${id}`, {
                    method: "DELETE",
                  });
                  setLeads((prev) => prev.filter((l) => l._id !== id));
                  toast.dismiss(t);
                  toast.success("Lead deleted");
                } catch (err) {
                  toast.error("Failed to delete lead");
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
      ),
      { duration: Infinity },
    );
  };

  const handleEdit = (lead) => {
    setFormData(lead);
    setCurrentId(lead._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      name: "",
      email: "",
      phone: "",
      source: "Website",
      status: "New",
      notes: "",
    });
  };

  if (loading) return <div className="loading-screen">Loading Leads...</div>;

  return (
    <div className="leads-container">
      <Toaster position="top-right" richColors />

      <div className="leads-header">
        <h1>Leads</h1>
        <button className="add-lead-btn" onClick={() => setShowModal(true)}>
          + New Lead
        </button>
      </div>

      <div className="filter-bar">
        {["All", "New", "Contacted", "Converted", "Lost"].map((f) => (
          <button
            key={f}
            className={`filter-btn ${filter === f ? "active" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="table-wrapper">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Contact</th>
              <th>Source</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredLeads.map((lead) => (
              <tr key={lead._id}>
                <td>
                  <strong>{lead.name}</strong>
                </td>
                <td>
                  <div>{lead.email}</div>
                  <small style={{ color: "#888" }}>{lead.phone}</small>
                </td>
                <td>{lead.source}</td>
                <td>
                  <TableStatusDropdown
                    currentStatus={lead.status}
                    onStatusChange={(newStatus) =>
                      updateLeadStatus(lead._id, newStatus)
                    }
                  />
                </td>
                <td>
                  <button
                    className="action-btn edit"
                    onClick={() => handleEdit(lead)}
                  >
                    Edit
                  </button>
                  <button
                    className="action-btn delete"
                    onClick={() => handleDelete(lead._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredLeads.length === 0 && (
          <div className="no-data">No leads found.</div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Lead" : "Add New Lead"}</h2>
              <button className="close-modal-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label>Full Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email Address</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="form-grid">
                <div className="form-group">
                  <label>Phone Number</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <CustomSelect
                  label="Source"
                  options={["Website", "Instagram", "Referral", "Other"]}
                  value={formData.source}
                  onChange={(val) => setFormData({ ...formData, source: val })}
                />
              </div>
              <CustomSelect
                label="Status"
                options={["New", "Contacted", "Converted", "Lost"]}
                value={formData.status}
                onChange={(val) => setFormData({ ...formData, status: val })}
                isStatus={true}
              />
              <div className="modal-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button type="submit" className="save-btn">
                  Save Lead
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
