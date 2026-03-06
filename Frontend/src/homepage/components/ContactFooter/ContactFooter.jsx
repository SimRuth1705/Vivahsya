import { useState } from "react";
import "./ContactFooter.css";
import InquiryModal from "../InquiryModal/InquiryModal";

function ContactFooter() {
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);

  return (
    <>
      <footer className="footer-wrapper">
        <div className="footer-container">
          {/* Top Section: Branding & CTA */}
          <div className="footer-main">
            <div className="footer-brand">
              <h1 className="footer-logo">VIVAHASYA.</h1>
              <p className="footer-tagline">Crafting eternal memories with artistic precision.</p>
            </div>

            <div className="footer-cta">
              <p className="cta-text">Have a celebration in mind?</p>
              <button className="cta-button" onClick={() => setIsInquiryOpen(true)}>
                Get In Touch
                <span className="arrow">?</span>
              </button>
            </div>
          </div>

          {/* Middle Section: Links & Info */}
          <div className="footer-details">
            <div className="detail-col">
              <h5>Office</h5>
              <p>ITI Employees Layout, Annapurneshwari Nagar,</p>
              <p>Bengaluru, Karnataka 560091</p>
            </div>

            <div className="detail-col">
              <h5>Contact</h5>
              <p>daretolapafwrd@gmail.com</p>
              <p>+91 1203495093</p>
            </div>

            <div className="detail-col">
              <h5>Socials</h5>
              <a href="#instagram">Instagram</a>
              <a href="#facebook">Facebook</a>
            </div>
          </div>

          {/* Bottom Section: Legal */}
          <div className="footer-bottom">
            <p>© 2026 Vivahasya. All rights reserved.</p>
            <div className="legal-links">
              <a href="#privacy">Privacy Policy</a>
              <a href="#terms">Terms of Service</a>
            </div>
          </div>
        </div>
      </footer>

      <InquiryModal isOpen={isInquiryOpen} onClose={() => setIsInquiryOpen(false)} />
    </>
  );
}

export default ContactFooter;
