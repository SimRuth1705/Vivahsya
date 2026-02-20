import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import "./CRM.css";

// --- SEARCH COMPONENT ---
const SearchBar = ({ value, onChange }) => (
  <div className="crm-search-container">
    <span className="search-icon">🔍</span>
    <input
      type="text"
      placeholder="Search clients by name, phone, or email..."
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="crm-search-input"
    />
  </div>
);

const CRM = () => {
  const [clients, setClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    location: "",
    events: 0,
    totalSpent: "0",
  });

  // 1. GET ALL CLIENTS
  const fetchClients = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/crm");
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setClients(data);
      setLoading(false);
    } catch (err) {
      toast.error("Database connection failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  // 2. SEARCH FILTER
  const filteredClients = clients.filter(
    (client) =>
      client.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      client.phone?.includes(searchTerm) ||
      client.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // 3. ADD OR UPDATE HANDLER
  const handleSubmit = async (e) => {
    e.preventDefault();

    const method = isEditing ? "PUT" : "POST";
    const url = isEditing 
      ? `http://localhost:5000/api/crm/${currentId}` 
      : "http://localhost:5000/api/crm";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData), 
      });

      if (res.ok) {
        toast.success(isEditing ? "Profile Updated Successfully!" : "New Client Added!");
        fetchClients(); 
        closeModal();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || "Something went wrong");
      }
    } catch (err) {
      toast.error("Network error: Server is offline");
    }
  };

  // 4. DELETE HANDLER (RIGHT-SIDE TOAST)
  const handleDelete = (id) => {
    toast.custom((t) => (
      <div className="crm-toast-box">
        <div className="toast-content">
          <strong>Delete Client?</strong>
          <p>This will permanently remove their data from Vivahasya.</p>
        </div>
        <div className="toast-actions">
          <button className="t-btn cancel" onClick={() => toast.dismiss(t)}>Cancel</button>
          <button 
            className="t-btn delete" 
            onClick={async () => {
              try {
                const res = await fetch(`http://localhost:5000/api/crm/${id}`, { method: "DELETE" });
                if (res.ok) {
                  setClients(prev => prev.filter(c => c._id !== id));
                  toast.dismiss(t);
                  toast.success("Client records deleted");
                }
              } catch (err) {
                toast.error("Could not delete from database");
              }
            }}
          >
            Confirm
          </button>
        </div>
      </div>
    ), { position: 'top-right', duration: Infinity });
  };

  // 5. EDIT INITIALIZER
  const handleEdit = (client) => {
    setFormData({
      name: client.name,
      phone: client.phone,
      email: client.email || "",
      location: client.location || "",
      events: client.events || 0,
      totalSpent: client.totalSpent || "0",
    });
    setCurrentId(client._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setCurrentId(null);
    setFormData({
      name: "",
      phone: "",
      email: "",
      location: "",
      events: 0,
      totalSpent: "0",
    });
  };

  if (loading) return <div className="loading">Syncing Vivahasya CRM...</div>;

  return (
    <div className="crm-container">
      <Toaster position="top-right" richColors />
      
      <div className="crm-header">
        <div className="header-title">
          <h1>Customer Relations</h1>
          <span className="client-count">{clients.length} Total Clients</span>
        </div>
        <button className="add-client-btn" onClick={() => { setIsEditing(false); setShowModal(true); }}>
          + Add Client
        </button>
      </div>

      <div className="crm-toolbar">
        <SearchBar value={searchTerm} onChange={setSearchTerm} />
      </div>

      <div className="crm-table-wrapper">
        <table className="crm-table">
          <thead>
            <tr>
              <th>Client Name</th>
              <th>Contact Info</th>
              <th>Location</th>
              <th>History</th>
              <th>Lifetime Value</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredClients.map((client) => (
              <tr key={client._id}>
                <td>
                  <div className="client-name-cell">
                    <div className="client-avatar">{client.name ? client.name.charAt(0) : "?"}</div>
                    <span className="name-text">{client.name}</span>
                  </div>
                </td>
                <td>
                  <div className="contact-cell">
                    <span>{client.phone}</span>
                    <span className="sub-text">{client.email}</span>
                  </div>
                </td>
                <td>{client.location}</td>
                <td><span className="badge-events">{client.events || 0} Events</span></td>
                <td className="value-text">₹{client.totalSpent || 0}</td>
                <td>
                  <button className="crm-action-btn edit" onClick={() => handleEdit(client)}>Edit</button>
                  <button className="crm-action-btn delete" onClick={() => handleDelete(client._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredClients.length === 0 && <div className="crm-empty">No clients found matching "{searchTerm}"</div>}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={(e) => e.target.className === "modal-overlay" && closeModal()}>
          <div className="modal-content">
            <div className="modal-header">
              <h2>{isEditing ? "Edit Profile" : "Add New Client"}</h2>
              <button className="close-btn" onClick={closeModal}>&times;</button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-row">
                <div className="input-group">
                  <label>Full Name</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
                </div>
                <div className="input-group">
                  <label>Phone Number</label>
                  <input type="tel" value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} required />
                </div>
              </div>
              <div className="form-row">
                <div className="input-group">
                  <label>Email Address</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
                </div>
                <div className="input-group">
                  <label>Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
                </div>
              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn-save">Save Profile</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;