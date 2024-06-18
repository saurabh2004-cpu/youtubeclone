import React from 'react';
import './utility.css'; // Import the utility.css file

function Button({ text, ...props }) {
  return (
    <button className="my-button" {...props}>
      {text}
    </button>
  );
}

export default Button;
