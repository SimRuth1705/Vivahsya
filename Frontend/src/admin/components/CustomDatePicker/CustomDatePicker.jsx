import React, { useState, useEffect, useRef } from "react";
import "./CustomDatePicker.css";

const CustomDatePicker = ({ label, value, onChange }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [viewDate, setViewDate] = useState(new Date());
  const containerRef = useRef(null);
  
  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December",
  ];

  useEffect(() => {
    if (value) setViewDate(new Date(value));
    const handleClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target))
        setIsOpen(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [value]);

  const renderDays = () => {
    const year = viewDate.getFullYear();
    const month = viewDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    const days = [];
    
    for (let i = 0; i < firstDay; i++)
      days.push(<div key={`empty-${i}`} className="bd-day empty"></div>);
      
    for (let d = 1; d <= daysInMonth; d++) {
      // Format to YYYY-MM-DD to match standard date inputs
      const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      days.push(
        <div
          key={d}
          className={`bd-day ${value === dateStr ? "selected" : ""}`}
          onClick={() => {
            onChange(dateStr);
            setIsOpen(false);
          }}
        >
          {d}
        </div>,
      );
    }
    return days;
  };

  return (
    <div className="custom-input-container" ref={containerRef}>
      {label && <label>{label}</label>}
      <div className="custom-select-box" onClick={() => setIsOpen(!isOpen)}>
        <span>{value || "dd - mm - yyyy"}</span>
        <span>📅</span>
      </div>
      
      {isOpen && (
        <div className="bd-calendar-popup">
          <div className="bd-header">
            <span>
              {monthNames[viewDate.getMonth()]} {viewDate.getFullYear()}
            </span>
            <div className="bd-nav">
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() - 1, 1))}
              >
                &lt;
              </button>
              <button
                type="button"
                onClick={() => setViewDate(new Date(viewDate.getFullYear(), viewDate.getMonth() + 1, 1))}
              >
                &gt;
              </button>
            </div>
          </div>
          <div className="bd-grid-head">
            {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
              <span key={d}>{d}</span>
            ))}
          </div>
          <div className="bd-grid-body">{renderDays()}</div>
        </div>
      )}
    </div>
  );
};

export default CustomDatePicker;