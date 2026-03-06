import { useEffect, useState } from "react";
import "./InquiryModal.css";

function InquiryModal({ isOpen, onClose }) {
  const [shouldRender, setShouldRender] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(isOpen);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    eventDate: "",
    city: "",
  });

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => setIsVisible(true));
      const previousOverflow = document.body.style.overflow;
      document.body.style.overflow = "hidden";
      return () => {
        document.body.style.overflow = previousOverflow;
      };
    }

    setIsVisible(false);
    const closeTimer = setTimeout(() => {
      setShouldRender(false);
    }, 220);
    document.body.style.overflow = "";

    return () => clearTimeout(closeTimer);
  }, [isOpen]);

  useEffect(() => {
    const onEsc = (event) => {
      if (event.key === "Escape" && isOpen) {
        onClose();
      }
    };

    window.addEventListener("keydown", onEsc);
    return () => window.removeEventListener("keydown", onEsc);
  }, [isOpen, onClose]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    onClose();
  };

  if (!shouldRender) {
    return null;
  }

  return (
    <div
      className={`inquiry-modal-overlay ${isVisible ? "open" : ""}`}
      onClick={onClose}
      role="presentation"
    >
      <div
        className={`inquiry-modal-card ${isVisible ? "open" : ""}`}
        onClick={(event) => event.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Inquiry form"
      >
        <button
          type="button"
          className="inquiry-modal-close"
          aria-label="Close inquiry form"
          onClick={onClose}
        >
          X
        </button>

        <div className="inquiry-modal-header">
          <h2>Plan your wedding</h2>
          <p>Fill in your details and we&apos;ll be in touch.</p>
        </div>

        <form className="inquiry-modal-form" onSubmit={handleSubmit}>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
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
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
            required
          />

          <div className="inquiry-date-wrap">
            <input
              type="date"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              required
            />
            <span className="inquiry-date-icon" aria-hidden="true">
              📅
            </span>
          </div>

          <input
            type="text"
            name="city"
            placeholder="Event Location (City)"
            value={formData.city}
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
