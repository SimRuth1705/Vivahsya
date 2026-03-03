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

  const user = JSON.parse(localStorage.getItem("user"));
  const isOwner = user?.role === 'owner';

  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads", {
        headers: {
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

  // --- Inside your Leads component ---

// --- Inside Leads.jsx ---

const handleSendMail = async () => {
  const toastId = toast.loading(`Sending credentials to ${currentLead.email}...`);
  
  try {
    // ✅ CHANGE 'leads' TO 'crm' TO MATCH YOUR server.js ROUTE
    const response = await fetch(`http://localhost:5000/api/crm/confirm/${currentLead._id}`, {
      method: "POST",
      headers: { 
        "Authorization": `Bearer ${localStorage.getItem("token")}` 
      }
    });

    const data = await response.json();

    if (response.ok) {
      toast.success("Mail Sent! Client can now login.", { id: toastId });
      fetchLeads();
      setShowEditModal(false);
    } else {
      toast.error(data.message || "Mail failed to send.", { id: toastId });
    }
  } catch (err) {
    toast.error("Server connection error.", { id: toastId });
  }
};

  const handleEditClick = (lead) => {
    setCurrentLead({ ...lead });
    setShowEditModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentLead({ ...currentLead, [name]: value });
  };

  const handleCustomChange = (name, value) => {
    setCurrentLead({ ...currentLead, [name]: value });
  };

  const traditionOptions = [
    { value: 'South Indian', label: 'South Indian' },
    { value: 'North Indian', label: 'North Indian' },
    { value: 'Christian', label: 'Christian' },
    { value: 'Muslim', label: 'Muslim' },
    { value: 'Other', label: 'Other' }
  ];

  const statusOptions = [
    { value: 'On Talk', label: 'On Talk' },
    { value: 'Follow Up', label: 'Follow Up' },
    { value: 'Confirm', label: 'Confirm' },
    { value: 'Lost', label: 'Lost' }
  ];

  return (
    <div className="leads-page">
      <Toaster position="top-right" richColors />

      <div className="leads-header">
        <div className="title-area">
          <h1>Inbound Client Leads</h1>
          <p>Review and edit details submitted by the client team</p>
        </div>
        
        <div className="leads-utility">
          <div className="search-wrapper">
            <HiOutlineSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search by client name..." 
              value={searchTerm}
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
              {isOwner && <th>Budget</th>}
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads
              .filter(l => (l.name || "").toLowerCase().includes(searchTerm.toLowerCase()))
              .map((lead) => (
                <tr key={lead._id}>
                  <td>
                    <div className="primary-text">{lead.name}</div>
                    <div className="secondary-text">{lead.contact || lead.email}</div>
                  </td>
                  <td>
                    <div className="primary-text">{lead.eventType || 'N/A'}</div>
                    <div className="secondary-text">{lead.date || 'TBD'}</div>
                  </td>
                  <td>
                    <span className={`tradition-tag ${(lead.tradition || "other").toLowerCase().replace(' ', '-')}`}>
                      {lead.tradition || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <div className="primary-text">{lead.location || 'N/A'}</div>
                    <div className="secondary-text">{lead.guestCount || 0} Guests</div>
                  </td>
                  {isOwner && <td className="budget-text">₹{lead.budget || '0'}</td>}
                  <td>
                    <span className={`status-pill ${(lead.status || "new").toLowerCase().replace(' ', '-')}`}>
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
                      onChange={(val) => handleCustomChange('date', val)}
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
                      options={traditionOptions}
                      selected={currentLead.tradition || ''}
                      onSelect={(val) => handleCustomChange('tradition', val)}
                    />
                  </div>

                  {isOwner && (
                    <div className="field-wrapper">
                      <label>Budget</label>
                      <input name="budget" value={currentLead.budget || ''} onChange={handleInputChange} />
                    </div>
                  )}

                  <div className="field-wrapper full-width">
                    <label>Initial Status</label>
                    <CustomDropdown
                      options={statusOptions}
                      selected={currentLead.status || ''}
                      onSelect={(val) => handleCustomChange('status', val)}
                    />
                  </div>
                </div>
              </div>

              {/* UPDATED MODAL FOOTER WITH 3 BUTTONS */}
              <div className="modal-footer-refined">
                <button type="button" className="btn-discard" onClick={() => setShowEditModal(false)}>Cancel</button>
                
                <div className="footer-right-group">
                  <button type="button" className="btn-send-mail" onClick={handleSendMail}>Send Mail</button>
                  <button type="submit" className="btn-save">Update Details</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;