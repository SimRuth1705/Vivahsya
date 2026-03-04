import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast, Toaster } from "sonner";
import CustomDatePicker from "../../../admin/components/CustomDatePicker/CustomDatePicker";
import CustomDropdown from "../../../admin/components/CustomDropdown/CustomDropdown";
import "./Inquiry.css";
import video from "../../assets/baos.mp4";

function Inquiry() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    date: "",
    eventType: "",
    budget: "",
    duration: "1 Day",
  });

  const eventTypeOptions = [
    { value: "Wedding", label: "Wedding" },
    { value: "Engagement", label: "Engagement" },
    { value: "Reception", label: "Reception" },
  ];

  // 👇 THIS WAS MISSING: It handles the typing in the input fields
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // 👇 The updated PUBLIC submit function (No login required)
  const handleSubmit = async (e) => {
    e.preventDefault();

    const leadData = {
      ...formData,
      status: "New",
    };

    try {
      // Notice: No token/Authorization header needed here!
      const response = await fetch("http://localhost:5000/api/leads", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        toast.success("Inquiry submitted! Our team will contact you soon.");
        // Clear the form after success
        setFormData({
          name: "",
          email: "",
          contact: "",
          location: "",
          date: "",
          eventType: "",
          budget: "",
          duration: "1 Day",
        });
      } else {
        toast.error("Could not submit inquiry. Please try again.");
      }
    } catch (err) {
      toast.error("Connection failed. Is the backend running?");
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
            
            <CustomDatePicker
              value={formData.date}
              onChange={(val) => setFormData({ ...formData, date: val })}
            />

            <input
              type="text"
              name="location"
              placeholder="Event Location (City)"
              value={formData.location}
              onChange={handleChange}
              required
            />

            <button type="submit">Submit Request</button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default Inquiry;