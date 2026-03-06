import { useEffect, useState } from "react";
import { toast, Toaster } from "sonner";
import API_BASE_URL from "../../../../config";
import "./InquiryModal.css";

function InquiryModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    contact: "",
    location: "",
    date: "",
    eventType: "Wedding",
    budget: "",
    duration: "1 Day",
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      document.body.style.overflow = "hidden";
    } else {
      setIsVisible(false);
      const timer = setTimeout(() => setShouldRender(false), 220);
      document.body.style.overflow = "";
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.contact || !formData.location || !formData.date) {
      toast.error("Please fill all fields before submitting.");
      return;
    }

    const leadData = {
      ...formData,
      status: "New",
    };

    try {
      const response = await fetch(`${API_BASE_URL}/api/leads`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(leadData),
      });

      if (response.ok) {
        toast.success("Inquiry submitted! Our team will contact you soon.");
        setFormData({
          name: "", email: "", contact: "", location: "",
          date: "", eventType: "Wedding", budget: "", duration: "1 Day",
        });
        setTimeout(() => onClose(), 1500);
      } else {
        toast.error("Could not submit inquiry. Please try again.");
      }
    } catch (err) {
      toast.error("Connection failed. Is the backend running?");
    }
  };

  if (!shouldRender) return null;

  return (
    <div className={`inquiry-modal-overlay ${isVisible ? "open" : ""}`} onClick={onClose}>
      <Toaster position="top-right" richColors />
      
      <div className={`inquiry-modal-card ${isVisible ? "open" : ""}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="inquiry-modal-close" onClick={onClose}>&times;</button>

        <div className="inquiry-modal-header">
          <h2>Plan your wedding</h2>
          <p>Fill in your details and we'll be in touch.</p>
        </div>

        <form className="inquiry-modal-form" onSubmit={handleSubmit} noValidate>
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

          <div className="inquiry-date-wrap">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
            />
          </div>

          <input
            type="text"
            name="location"
            placeholder="Event Location (City)"
            value={formData.location}
            onChange={handleChange}
            required
          />

          <button type="submit" className="inquiry-submit-btn">
            SUBMIT REQUEST
          </button>
        </form>
      </div>
    </div>
  );
}

export default InquiryModal;
