import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import "./Vendors.css";

// --- RATING STARS COMPONENT ---
const RatingStars = ({ rating }) => (
  <div className="rating-stars">
    {[...Array(5)].map((_, i) => (
      <span key={i} className={i < rating ? "star filled" : "star"}>
        ★
      </span>
    ))}
  </div>
);

// --- CUSTOM CATEGORY DROPDOWN ---
const CategoryDropdown = ({ selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);
  const categories = [
    { name: "Catering", color: "#ef6c00", bg: "#fff3e0" },
    { name: "Photography", color: "#1565c0", bg: "#e3f2fd" },
    { name: "Florist", color: "#ad1457", bg: "#fce4ec" },
    { name: "Venue", color: "#7b1fa2", bg: "#f3e5f5" },
    { name: "Decor", color: "#00695c", bg: "#e0f2f1" },
  ];

  return (
    <div className="custom-dropdown-container">
      <label className="dropdown-label">Service Category</label>
      <div
        className={`custom-dropdown-trigger ${isOpen ? "active" : ""}`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <span
          className="selected-dot"
          style={{
            backgroundColor:
              categories.find((c) => c.name === selected)?.color || "#ccc",
          }}
        ></span>
        {selected}
        <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
      </div>

      {isOpen && (
        <div className="custom-dropdown-menu">
          {categories.map((cat) => (
            <div
              key={cat.name}
              className="custom-dropdown-item"
              onClick={() => {
                onSelect(cat.name);
                setIsOpen(false);
              }}
              style={{ "--hover-bg": cat.bg, "--hover-color": cat.color }}
            >
              <span
                className="item-dot"
                style={{ backgroundColor: cat.color }}
              ></span>
              {cat.name}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const Vendors = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const [formData, setFormData] = useState({
    name: "",
    category: "Catering",
    phone: "",
    email: "",
    location: "",
    rating: 5,
  });

  const fetchVendors = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/vendors");
      const data = await res.json();
      setVendors(data);
      setLoading(false);
    } catch (err) {
      toast.error("Database connection failed");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVendors();
  }, []);

  if (loading) return <div className="loading-spinner">Connecting to Vivahasya Database...</div>;

  const filteredVendors = vendors.filter((v) => {
    const matchesCategory = filter === "All" || v.category === filter;
    const matchesSearch =
      v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      v.location.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const method = isEditing ? "PUT" : "POST";
    const url = isEditing
      ? `http://localhost:5000/api/vendors/${currentId}`
      : "http://localhost:5000/api/vendors";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success(
          isEditing ? "Vendor details updated" : "New vendor added!",
        );
        fetchVendors();
        closeModal();
      }
    } catch (err) {
      toast.error("Error saving to database");
    }
  };

  const handleDelete = (id) => {
  // This creates a custom toast pop-up on the right
  toast.custom((t) => (
    <div className="delete-confirm-popup">
      <div className="popup-content">
        <h4>Remove Vendor?</h4>
        <p>This action cannot be undone.</p>
      </div>
      <div className="popup-actions">
        <button className="btn-cancel-toast" onClick={() => toast.dismiss(t)}>
          Cancel
        </button>
        <button 
          className="btn-delete-toast" 
          onClick={async () => {
            try {
              const res = await fetch(`http://localhost:5000/api/vendors/${id}`, {
                method: "DELETE",
              });
              if (res.ok) {
                setVendors(prev => prev.filter(v => v._id !== id));
                toast.success("Vendor deleted successfully");
              }
              toast.dismiss(t);
            } catch (err) {
              toast.error("Failed to delete vendor");
            }
          }}
        >
          Delete
        </button>
      </div>
    </div>
  ), { position: 'top-right', duration: Infinity });
};


  const openEditModal = (vendor) => {
    setFormData(vendor);
    setCurrentId(vendor._id);
    setIsEditing(true);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setIsEditing(false);
    setFormData({
      name: "",
      category: "Catering",
      phone: "",
      email: "",
      location: "",
      rating: 5,
    });
  };

  if (loading)
    return <div className="loading-screen">Syncing Vendor Network...</div>;

  return (
    <div className="vendors-container">
      <Toaster position="top-right" richColors />

      <div className="vendors-header">
        <div className="header-info">
          <h1>Vendor Network</h1>
          <p>{vendors.length} Partners connected</p>
        </div>
        <button
          className="add-vendor-btn"
          onClick={() => {
            setIsEditing(false);
            setShowModal(true);
          }}
        >
          + Add Vendor
        </button>
      </div>

      <div className="vendors-toolbar">
        <div className="category-filters">
          {["All", "Catering", "Photography", "Florist", "Venue", "Decor"].map(
            (f) => (
              <button
                key={f}
                className={`v-filter-btn ${filter === f ? "active" : ""}`}
                onClick={() => setFilter(f)}
              >
                {f}
              </button>
            ),
          )}
        </div>
        <div className="vendor-search">
          <input
            type="text"
            placeholder="Search by name or city..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="vendors-table-wrapper">
        <table className="vendors-table">
          <thead>
            <tr>
              <th>Business Name</th>
              <th>Category</th>
              <th>Contact Details</th>
              <th>Location</th>
              <th>Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredVendors.map((vendor) => (
              <tr key={vendor._id}>
                <td className="vendor-name-main">{vendor.name}</td>
                <td>
                  <span className={`cat-tag ${vendor.category.toLowerCase()}`}>
                    {vendor.category}
                  </span>
                </td>
                <td>
                  <div className="v-contact-info">
                    <span>{vendor.phone}</span>
                    <small>{vendor.email}</small>
                  </div>
                </td>
                <td>{vendor.location}</td>
                <td>
                  <RatingStars rating={vendor.rating} />
                </td>
                <td>
                  <div className="action-btns">
                    <button
                      className="v-edit"
                      onClick={() => openEditModal(vendor)}
                    >
                      Edit
                    </button>
                    <button
                      className="v-del"
                      onClick={() => handleDelete(vendor._id)}
                    >
                      Remove
                    </button>
                  </div>
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
              <h2>{isEditing ? "Edit Vendor" : "Add New Vendor"}</h2>
              <button className="close-btn" onClick={closeModal}>
                &times;
              </button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="input-group">
                  <label>Business Name</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    required
                  />
                </div>
                {/* 👇 INTEGRATED CUSTOM DROPDOWN */}
                <CategoryDropdown
                  selected={formData.category}
                  onSelect={(val) =>
                    setFormData({ ...formData, category: val })
                  }
                />
              </div>
              <div className="form-grid">
                <div className="input-group">
                  <label>Phone Number</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="input-group">
                  <label>Location (City)</label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) =>
                      setFormData({ ...formData, location: e.target.value })
                    }
                  />
                </div>
              </div>
              <div className="input-group">
                <label>Rating (1 to 5)</label>
                <input
                  type="number"
                  min="1"
                  max="5"
                  value={formData.rating}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      rating: parseInt(e.target.value),
                    })
                  }
                />
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  onClick={closeModal}
                  className="btn-cancel"
                >
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  Save Vendor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Vendors;
