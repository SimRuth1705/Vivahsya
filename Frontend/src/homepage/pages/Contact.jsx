import { useMemo, useState } from "react";
import "./Contact.css";

function Contact() {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    eventDate: "",
    venue: "",
    ideas: "",
  });

  const minDate = useMemo(() => {
    const today = new Date();
    return today.toISOString().split("T")[0];
  }, []);

  const handleChange = (event) => {
    const { id, value } = event.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const { name, email, phone, ideas } = formData;
    if (name && email && phone && ideas) {
      setIsPopupOpen(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        eventDate: "",
        venue: "",
        ideas: "",
      });
    }
  };

  const closePopup = () => setIsPopupOpen(false);

  return (
    <div className="contact-page">
      <header className="contact-header">Lets Plan Your Dream Wedding</header>

      <section className="contact-section">
        <h2>Contact Our Wedding Experts</h2>

        <div className="contact-form">
          <form id="contactForm" onSubmit={handleSubmit}>
            <input
              type="text"
              id="name"
              placeholder="Full Name"
              required
              value={formData.name}
              onChange={handleChange}
            />

            <input
              type="email"
              id="email"
              placeholder="Email Address"
              required
              value={formData.email}
              onChange={handleChange}
            />

            <input
              type="tel"
              id="phone"
              placeholder="Contact Number"
              required
              value={formData.phone}
              onChange={handleChange}
            />

            <label htmlFor="eventDate">
              <strong>Select Wedding Date</strong>
            </label>
            <input
              type="date"
              id="eventDate"
              required
              min={minDate}
              value={formData.eventDate}
              onChange={handleChange}
            />

            <input
              type="text"
              id="venue"
              placeholder="Preferred Wedding Location / Venue"
              value={formData.venue}
              onChange={handleChange}
            />

            <textarea
              id="ideas"
              rows="4"
              placeholder="Ideas for your dream wedding (theme, colors, decor, special moments...)"
              required
              value={formData.ideas}
              onChange={handleChange}
            />

            <button type="submit">Send Inquiry</button>
          </form>
        </div>
      </section>

      <div className={`popup ${isPopupOpen ? "open" : ""}`} id="popup">
        <div className="popup-content">
          <h3>Thank You!</h3>
          <p>
            Our team will get in touch with you shortly to start planning your
            magical day.
          </p>
          <button className="close-btn" onClick={closePopup}>
            Close
          </button>
        </div>
      </div>

      <footer className="contact-footer">
        2026 Vivahasya Celebrations | Bringing your Dream Wedding to Reality
      </footer>
    </div>
  );
}

export default Contact;
