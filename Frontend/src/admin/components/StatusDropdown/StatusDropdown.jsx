import React, { useState, useRef, useEffect } from 'react';
import './StatusDropdown.css'; // Make sure you have this CSS file

const StatusDropdown = ({ currentStatus, onStatusChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState('bottom'); // Default to bottom
  const dropdownRef = useRef(null);

  // Status Colors
  const getStatusColor = (status) => {
    switch (status) {
      case 'New': return 'status-new';
      case 'Contacted': return 'status-contacted';
      case 'Converted': return 'status-converted';
      case 'Lost': return 'status-lost';
      default: return 'status-default';
    }
  };

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Smart Toggle Logic
  const toggleDropdown = () => {
    if (!isOpen) {
      // 1. Get the position of the dropdown button
      const rect = dropdownRef.current.getBoundingClientRect();
      
      // 2. Calculate space remaining at the bottom of the screen
      const spaceBelow = window.innerHeight - rect.bottom;
      
      // 3. If space is less than 200px (height of menu), open UP
      if (spaceBelow < 300) {
        setMenuPosition('top');
      } else {
        setMenuPosition('bottom');
      }
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="custom-dropdown" ref={dropdownRef}>
      <div 
        className={`dropdown-trigger ${getStatusColor(currentStatus)}`} 
        onClick={toggleDropdown} // Use the smart toggle here
      >
        {currentStatus}
        <span className="dropdown-arrow">▼</span>
      </div>

      {isOpen && (
        <ul className={`dropdown-menu ${menuPosition}`}> {/* Apply 'top' or 'bottom' class */}
          {['New', 'Contacted', 'Converted', 'Lost'].map((status) => (
            <li 
              key={status} 
              onClick={() => { onStatusChange(status); setIsOpen(false); }}
              className={`dropdown-item ${status === currentStatus ? 'selected' : ''}`}
            >
              <span className={`status-dot ${getStatusColor(status)}`}></span>
              {status}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default StatusDropdown;