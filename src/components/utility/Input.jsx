import React, { useState } from 'react';
import './utility.css'; // Import the utility.css file

function Input({ label, type = "text", className = "", ...props }) {
  const [isFocused, setIsFocused] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  const handleInputChange = (event) => setIsValid(event.target.value !== '');

  return (
    <div className="group">
      {label && (
        <label className={`inline-block mb-1 pl-1 ${isFocused || isValid ? 'focused' : ''}`} htmlFor={label}>
          {label}
        </label>
      )}
      <input
        type={type}
        className={`input ${className}`}
        {...props}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        required
      />
      <span className="highlight"></span>
      <span className="bar"></span>
    </div>
  );
}

export default Input;
