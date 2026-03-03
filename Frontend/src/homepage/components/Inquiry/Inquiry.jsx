import React, { useState } from "react";
import { toast, Toaster } from "sonner";
// Ensure these paths match your folder structure exactly
import CustomDatePicker from "../../../admin/components/CustomDatePicker/CustomDatePicker"; 
import CustomDropdown from "../../../admin/components/CustomDropdown/CustomDropdown";
import "./Inquiry.css";
import video from "../../assets/baos.mp4";

function Inquiry() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    date: "",
    eventType: "",
    tradition: "",
    budget: "",
    duration: "1 Day",
    guestCount: "",
    message: "",
  });

  const locationOptions = [
    { value: "bangalore", label: "Bangalore" },
    { value: "mysore", label: "Mysore" },
    { value: "chennai", label: "Chennai" },
    { value: "hyderabad", label: "Hyderabad" },
  ];

  const eventTypeOptions = [
    { value: "Wedding", label: "Wedding" },
    { value: "Engagement", label: "Engagement" },
    { value: "Reception", label: "Reception" },
  ];

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // 1. Get the token from storage
  const token = localStorage.getItem("token");

  if (!token) {
    toast.error("Please login to submit an inquiry.");
    navigate("/login");
    return;
  }

  const leadData = {
    ...formData,
    guestCount: Number(formData.guestCount),
    status: 'New'
  };

  try {
    const response = await fetch("http://localhost:5000/api/leads", {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 👈 This fixes the 401 error
      },
      body: JSON.stringify(leadData),
    });

    if (response.ok) {
      toast.success("Inquiry submitted! You can view it in your dashboard.");
      // Optional: Redirect to their "Leads" view to see it shown there
    } else if (response.status === 401) {
      toast.error("Session expired. Please login again.");
      navigate("/login");
    }
  } catch (err) {
    toast.error("Connection failed.");
  }
};

  return (
    <section className="inquiry-wrapper">
      <Toaster position="top-right" richColors />
      
      <div className="video-wrapper">
        <video src={video} autoPlay muted loop playsInline />
      </div>

      <div className="inquiry-section">
        <h2 className="title">Let’s Plan Your Celebration</h2>
        <div className="underline"></div>

        <div className="form-card">
          <h3>Get in touch</h3>

          <form onSubmit={handleSubmit}>
            <input 
              type="text" 
              name="name" 
              placeholder="Full Name" 
              value={formData.name} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="email" 
              name="email" 
              placeholder="Email Address" 
              value={formData.email} 
              onChange={handleChange} 
              required 
            />
            <input 
              type="tel" 
              name="contact" 
              placeholder="Phone Number" 
              value={formData.contact} 
              onChange={handleChange} 
              required 
            />

            <div className="form-row">
              {/* Custom Date Picker */}
              <CustomDatePicker 
                value={formData.date} 
                onChange={(val) => setFormData({ ...formData, date: val })} 
              />
              
              {/* Custom Dropdown - FIXED prop from onChange to onSelect */}
              <CustomDropdown 
                label="Event"
                options={eventTypeOptions}
                selected={formData.eventType}
                onSelect={(val) => setFormData({ ...formData, eventType: val })}
              />
            </div>

            {/* Custom Dropdown - FIXED prop from onChange to onSelect */}
            <CustomDropdown 
              label="Location"
              options={locationOptions}
              selected={formData.location}
              onSelect={(val) => setFormData({ ...formData, location: val })}
            />

            <div className="form-row">
                <input 
                  type="text" 
                  name="tradition" 
                  placeholder="Tradition" 
                  value={formData.tradition} 
                  onChange={handleChange} 
                />
                <input 
                  type="number" 
                  name="guestCount" 
                  placeholder="Guests" 
                  value={formData.guestCount} 
                  onChange={handleChange} 
                />
            </div>

            <textarea 
              name="message" 
              placeholder="Tell us more..." 
              value={formData.message} 
              onChange={handleChange}
            ></textarea>
            
            <button type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Inquiry;