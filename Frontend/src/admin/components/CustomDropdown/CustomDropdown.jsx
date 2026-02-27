import React, { useState } from 'react';
import './CustomDropdown.css'; // Make sure this path matches where you saved the CSS

const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="dropdown-container">
      {/* Label */}
      {label && <label className="dropdown-label">{label}</label>}
      
      {/* The Clickable Box */}
      <div
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0} // Makes it accessible via keyboard
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} // Closes if user clicks away
      >
        <span className={`dropdown-text ${selected ? 'selected' : 'placeholder'}`}>
          {selected || `Select ${label}`}
        </span>
        
        {/* Dropdown Arrow Icon */}
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {/* The Dropdown Menu */}
      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation(); // Prevents the click from immediately reopening the menu
                onSelect(option);
                setIsOpen(false);
              }}
            >
              {option}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;