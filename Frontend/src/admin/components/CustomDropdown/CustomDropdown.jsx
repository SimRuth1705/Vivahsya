import React, { useState } from 'react';
import './CustomDropdown.css'; 

const CustomDropdown = ({ label, options, selected, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false);

  // ✅ Fixed Helper: Works if options are objects OR simple strings
  const getSelectedLabel = () => {
    if (!selected) return null;
    const found = options.find(opt => 
      typeof opt === 'object' ? opt.value === selected : opt === selected
    );
    return typeof found === 'object' ? found.label : found;
  };

  const currentLabel = getSelectedLabel();

  return (
    <div className="dropdown-container">
      <div
        className="dropdown-header"
        onClick={() => setIsOpen(!isOpen)}
        tabIndex={0}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)} 
      >
        <span className={`dropdown-text ${selected ? 'selected' : 'placeholder'}`}>
          {currentLabel || `Select ${label || 'Option'}`}
        </span>
        
        <svg className={`dropdown-arrow ${isOpen ? 'open' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
        </svg>
      </div>

      {isOpen && (
        <ul className="dropdown-list">
          {options.map((option, index) => {
            // ✅ Handle both object {label, value} and simple string
            const val = typeof option === 'object' ? option.value : option;
            const lab = typeof option === 'object' ? option.label : option;

            return (
              <li
                key={index}
                className={`dropdown-item ${selected === val ? 'active' : ''}`}
                onMouseDown={(e) => {
                  e.preventDefault(); // Prevents onBlur from closing before click registers
                  if (onSelect) onSelect(val); 
                  setIsOpen(false);
                }}
              >
                {lab} 
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default CustomDropdown;