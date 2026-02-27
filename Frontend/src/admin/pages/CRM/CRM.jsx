import React, { useState, useEffect } from "react";
import { Toaster, toast } from "sonner";
import { 
  HiOutlineClock, HiOutlineUsers, HiOutlineCurrencyDollar, 
  HiOutlineAdjustments, HiOutlineLocationMarker,
  HiOutlineX
} from "react-icons/hi";
import "./CRM.css";
import CustomDropdown from "../../components/CustomDropdown/CustomDropdown"; // <-- Imported CustomDropdown

const CRM = () => {
  const [leads, setLeads] = useState([]);
  
  // Updated default sort state to match the exact string from the CustomDropdown
  const [sortBy, setSortBy] = useState("Recent Enquiry"); 
  const [filterStatus, setFilterStatus] = useState("All");
  const [selectedLead, setSelectedLead] = useState(null); 

  // --- 1. FETCH REAL LEADS FROM MONGODB ---
  const fetchLeads = async () => {
    try {
      const response = await fetch("http://localhost:5000/api/leads");
      const data = await response.json();
      setLeads(data);
    } catch (error) {
      toast.error("Failed to sync CRM with database");
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // --- 2. CONVERT LEAD TO BOOKING ---
  const handleConfirmLead = async (lead) => {
    try {
      const loadingToast = toast.loading("Converting lead to booking...");

      const response = await fetch(`http://localhost:5000/api/crm/confirm/${lead._id}`, {
        method: "POST", 
        headers: { "Content-Type": "application/json" },
      });

      if (response.ok) {
        toast.dismiss(loadingToast);
        toast.success(`${lead.name} has been moved to Bookings!`, {
          description: "Client profile and Booking event created successfully.",
        });
        
        fetchLeads(); // Instantly refresh the board
        setSelectedLead(null); // Close the modal
      } else {
        const errData = await response.json();
        toast.dismiss(loadingToast);
        toast.error(`Conversion failed: ${errData.message}`);
      }
    } catch (err) {
      toast.error("Network error: Could not reach the server.");
    }
  };

  // --- 3. BULLETPROOF SORTING & FILTERING ---
  const processedLeads = leads
    .filter(lead => filterStatus === "All" || lead.status === filterStatus)
    .sort((a, b) => {
      // Logic updated to match the new CustomDropdown options
      if (sortBy === "Recent Enquiry") return new Date(b.enquireDate || Date.now()) - new Date(a.enquireDate || Date.now());
      if (sortBy === "Event Date") return new Date(a.date || Date.now()) - new Date(b.date || Date.now());
      return 0;
    });

  return (
    <div className="crm-page">
      <Toaster position="top-right" richColors />
      
      {/* TOOLBAR */}
      <div className="crm-toolbar">
        <div className="toolbar-left">
          <HiOutlineAdjustments className="filter-icon" />
          <span className="toolbar-label">CRM Lead Engine</span>
        </div>

        {/* --- REPLACED SELECTS WITH CUSTOM DROPDOWNS --- */}
        <div className="toolbar-right" style={{ display: 'flex', gap: '15px', alignItems: 'flex-end' }}>
          
          <div style={{ width: '180px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Status Filter</label>
            <CustomDropdown 
              options={['All', 'Confirm', 'On Talk', 'Follow Up']}
              selected={filterStatus}
              onSelect={setFilterStatus}
            />
          </div>

          <div style={{ width: '180px' }}>
            <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#64748b', marginBottom: '6px', display: 'block', textTransform: 'uppercase' }}>Sort By</label>
            <CustomDropdown 
              options={['Recent Enquiry', 'Event Date']}
              selected={sortBy}
              onSelect={setSortBy}
            />
          </div>

        </div>
      </div>

      {/* LEADS GRID */}
      <div className="leads-grid">
        {processedLeads.length === 0 ? (
          <div style={{ padding: "40px", color: "#64748b", gridColumn: "1 / -1", textAlign: "center" }}>
            No leads found for this status.
          </div>
        ) : (
          processedLeads.map((lead) => (
            <div key={lead._id} className="lead-card">
              <div className={`lead-status-dot ${(lead.status || 'on-talk').replace(/\s+/g, '-').toLowerCase()}`}></div>
              <div className="lead-badge">{lead.status || 'On Talk'}</div>
              
              <div className="lead-header">
                <h3>{lead.name}</h3>
                <span className="tradition-tag">{lead.tradition || 'Standard'}</span>
              </div>

              <div className="lead-body">
                <div className="info-row"><HiOutlineClock /> <span>{lead.date || 'TBD'}</span></div>
                <div className="info-row"><HiOutlineUsers /> <span>{lead.guestCount || 0} Guests</span></div>
                <div className="info-row"><HiOutlineCurrencyDollar /> <span>₹{lead.budget || '0'}</span></div>
              </div>

              <div className="lead-footer">
                <button className="btn-view" onClick={() => setSelectedLead(lead)}>View Details</button>
                {lead.status !== 'Confirm' && (
                  <button className="btn-convert" onClick={() => handleConfirmLead(lead)}>Confirm Lead</button>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* --- VIEW DETAILS MODAL --- */}
      {selectedLead && (
        <div className="modal-overlay" onClick={() => setSelectedLead(null)}>
          <div className="details-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="header-text">
                <h2>{selectedLead.name}</h2>
                <span className="sub-text">
                  Enquired on {selectedLead.enquireDate ? new Date(selectedLead.enquireDate).toLocaleDateString() : 'Unknown Date'}
                </span>
              </div>
              <button className="close-modal" onClick={() => setSelectedLead(null)}>
                <HiOutlineX />
              </button>
            </div>

            <div className="modal-content-grid">
              <div className="detail-item">
                <label>Contact Number</label>
                <p>{selectedLead.contact}</p>
              </div>
              <div className="detail-item">
                <label>Event Type</label>
                <p>{selectedLead.eventType || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Event Date</label>
                <p>{selectedLead.date || 'TBD'}</p>
              </div>
              <div className="detail-item">
                <label>Duration</label>
                <p>{selectedLead.duration || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Preferred Location</label>
                <p><HiOutlineLocationMarker /> {selectedLead.location || 'N/A'}</p>
              </div>
              <div className="detail-item">
                <label>Tradition</label>
                <p className="tradition-highlight">{selectedLead.tradition || 'N/A'}</p>
              </div>
              <div className="detail-item full-width">
                <label>Requested Services</label>
                <div className="services-tags">
                  {(selectedLead.services || []).length > 0 ? (
                    selectedLead.services.map((s, i) => (
                      <span key={i} className="service-tag">{s}</span>
                    ))
                  ) : (
                    <span className="service-tag">None Specified</span>
                  )}
                </div>
              </div>
              <div className="detail-item">
                <label>Guest Count</label>
                <p>{selectedLead.guestCount || 0} People</p>
              </div>
              <div className="detail-item">
                <label>Estimated Budget</label>
                <p className="budget-text">₹{selectedLead.budget || '0'}</p>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn-outline" onClick={() => setSelectedLead(null)}>Close</button>
              {selectedLead.status !== 'Confirm' && (
                <button className="btn-primary" onClick={() => handleConfirmLead(selectedLead)}>
                  Confirm & Move to Bookings
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CRM;