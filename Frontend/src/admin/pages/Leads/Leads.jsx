import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { 
  HiOutlineSearch, HiOutlinePencilAlt, 
  HiOutlineX 
} from "react-icons/hi";
import "./Leads.css";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown";
import CustomDatePicker from "../../components/CustomDatePicker/CustomDatePicker"; 

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentLead, setCurrentLead] = useState(null);

  // --- ROLE CHECK LOGIC ---
  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.role === 'owner';

  // --- 1. Fetch Real Leads from MongoDB ---
  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        headers: {
          // Send the token so the backend middleware doesn't block the request
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      const data = await response.json();
      
      if (response.ok) {
        setLeads(data);
      } else {
        toast.error(data.message || "Unauthorized access");
      }
    } catch (error) {
      toast.error("Failed to sync leads with database");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // --- 2. Save Edits to MongoDB ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:5000/api/leads/${currentLead._id}`, {
        method: "PUT",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(currentLead),
      });

      if (response.ok) {
        const updatedLead = await response.json();
        setLeads(leads.map(l => l._id === updatedLead._id ? updatedLead : l));
        toast.success("Client Details Updated!");
        setShowEditModal(false);
      } else {
        toast.error("Update failed. Check permissions.");
      }
    } catch (err) {
      toast.error("Network error: Could not reach server.");
    }
  };

  const handleInjectTestLead = async () => {
    const dummyLead = {
      name: "Arjun Patel",
      contact: "9876543210",
      email: "arjun@example.com",
      eventType: "Wedding",
      date: "2026-11-20",
      duration: "2 Days",
      tradition: "North Indian",
      budget: "8,00,000",
      location: "Taj West End",
      guestCount: 450,
      status: "On Talk"
    };

    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(dummyLead),
      });

      if (response.ok) {
        toast.success("Test lead injected!");
        fetchLeads();
      }
    } catch (err) {
      toast.error("Network error.");
    }
  };

  const handleEditClick = (lead) => {
    setCurrentLead(lead);
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead({ ...currentLead, [name]: value });
  };

  const handleCustomDropdownChange = (name, value) => {
    setCurrentLead({ ...currentLead, [name]: value });
  };

  return (
    <div className="leads-page">
      <Toaster position="top-right" richColors />

      <div className="leads-header">
        <div className="title-area">
          <h1>Inbound Client Leads</h1>
          <p>Review and edit details submitted by the client team</p>
        </div>
        
        <div className="leads-utility">
          {isOwner && (
            <button onClick={handleInjectTestLead} className="inject-btn">
              + Inject Test Lead
            </button>
          )}

          <div className="search-wrapper">
            <HiOutlineSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by client name..." 
              onChange={(e) => setSearchTerm(e.target.value)} 
            />
          </div>
        </div>
      </div>

      <div className="leads-table-container">
        <table className="leads-table">
          <thead>
            <tr>
              <th>Client / Contact</th>
              <th>Event / Date</th>
              <th>Tradition</th>
              <th>Location / Guests</th>
              {isOwner && <th>Budget</th>} {/* PROTECTED COLUMN */}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.filter(l => (l.name || "").toLowerCase().includes(searchTerm.toLowerCase())).map((lead) => (
              <tr key={lead._id}>
                <td>
                  <div className="primary-text">{lead.name}</div>
                  <div className="secondary-text">{lead.contact}</div>
                </td>
                <td>
                  <div className="primary-text">{lead.eventType || 'N/A'}</div>
                  <div className="secondary-text">{lead.date || 'TBD'}</div>
                </td>
                <td>
                  <span className={`tradition-tag ${lead.tradition ? lead.tradition.toLowerCase().replace(' ', '-') : 'other'}`}>
                    {lead.tradition || 'N/A'}
                  </span>
                </td>
                <td>
                  <div className="primary-text">{lead.location || 'N/A'}</div>
                  <div className="secondary-text">{lead.guestCount || 0} Guests</div>
                </td>
                
                {/* PROTECTED DATA CELL */}
                {isOwner && <td className="budget-text">₹{lead.budget || '0'}</td>}
                
                <td>
                  <span className={`status-pill ${(lead.status || "on-talk").toLowerCase().replace(' ', '-')}`}>
                    {lead.status}
                  </span>
                </td>
                <td>
                  <button className="edit-action-btn" onClick={() => handleEditClick(lead)}>
                    <HiOutlinePencilAlt /> Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showEditModal && currentLead && (
        <div className="modal-overlay">
          <div className="lead-modal-refined">
            <div className="modal-header">
              <div className="header-title">
                <h2>Edit Client Submission</h2>
                <p>Modify details for {currentLead.name}</p>
              </div>
              <button className="close-btn" onClick={() => setShowEditModal(false)}><HiOutlineX /></button>
            </div>
            
            <form onSubmit={handleUpdate} className="refined-form">
              <div className="form-section">
                <h3 className="section-label">CLIENT & EVENT DETAILS</h3>
                <div className="form-grid-refined">
                  <div className="field-wrapper">
                    <label>Client Name</label>
                    <input name="name" value={currentLead.name || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="field-wrapper">
                    <label>Contact Number</label>
                    <input name="contact" value={currentLead.contact || ''} onChange={handleInputChange} required />
                  </div>
                  <div className="field-wrapper">
                    <label>Event Type</label>
                    <input name="eventType" value={currentLead.eventType || ''} onChange={handleInputChange} />
                  </div>
                  <div className="field-wrapper">
                    <CustomDatePicker
                      label="Event Date"
                      value={currentLead.date || ''}
                      onChange={(val) => handleCustomDropdownChange('date', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h3 className="section-label">CUSTOMIZATION & STATUS</h3>
                <div className="form-grid-refined">
                  <div className="field-wrapper">
                    <label>Tradition</label>
                    <CustomDropdown
                      options={['South Indian', 'North Indian', 'Christian', 'Muslim', 'Other']}
                      selected={currentLead.tradition || ''}
                      onSelect={(val) => handleCustomDropdownChange('tradition', val)}
                    />
                  </div>

                  {/* PROTECTED INPUT FIELD */}
                  {isOwner && (
                    <div className="field-wrapper">
                      <label>Budget</label>
                      <input name="budget" value={currentLead.budget || ''} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="field-wrapper full-width">
                    <label>Initial Status</label>
                    <CustomDropdown
                      options={['On Talk', 'Follow Up', 'Confirm', 'Lost']}
                      selected={currentLead.status || ''}
                      onSelect={(val) => handleCustomDropdownChange('status', val)}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer-refined">
                <button type="button" className="btn-discard" onClick={() => setShowEditModal(false)}>Cancel</button>
                <button type="submit" className="btn-save">Update Details</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;