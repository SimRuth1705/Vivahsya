import React, { useState } from 'react';
import './CustomDropdown.css'; 

const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Helper to find the label for the current selection
  const currentLabel = options.find(opt => opt.value === selected)?.label;

  return (
    <div className="dropdown-container">
      <div
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setIsOpen(false), 150)} 
      >
        <span className={`dropdown-text ${selected ? 'selected' : 'placeholder'}`}>
          {/* ✅ Displays the readable label (e.g., "Bangalore") or the placeholder */}
          {currentLabel || `Select ${label || 'Option'}`}
        </span>
        
        <svg 
          className={`dropdown-arrow ${isOpen ? 'open' : ''}`} 
          fill="none" 
          stroke="currentColor" 
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => (
            <li
              key={index}
              className="dropdown-item"
              onClick={(e) => {
                e.stopPropagation();
                // ✅ This matches the prop name in the function signature at the top
                if (onSelect) onSelect(option.value); 
                setIsOpen(false);
              }}
            >
              {option.label} 
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;