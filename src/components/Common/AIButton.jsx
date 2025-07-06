import React, { useState } from 'react';
import './AIButton.css';

const AIButton = ({ onClick, text = "Ask AI", loading = false, disabled = false }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const handleClick = (e) => {
    console.log('AIButton handleClick called');
    setIsClicked(true);
    setTimeout(() => setIsClicked(false), 200); // Reset after 200ms
    if (onClick) {
      console.log('Calling onClick prop');
      onClick(e);
    } else {
      console.log('No onClick prop provided');
    }
  };

  return (
    <button
      className={`
        ai-mic-button
        ${loading ? 'loading' : ''}
        ${disabled ? 'disabled' : ''}
        ${isHovered ? 'hovered' : ''}
        ${isPressed ? 'pressed' : ''}
        ${isClicked ? 'clicked' : ''}
      `}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      disabled={disabled || loading}
      title={text}
    >
        {loading ? (
          <div className="loading-spinner">
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
            <div className="spinner-ring"></div>
          </div>
        ) : (
          <svg 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            <path 
              d="M12 15a3 3 0 0 0 3-3V7a3 3 0 1 0-6 0v5a3 3 0 0 0 3 3Zm5-3a1 1 0 1 0-2 0 5 5 0 1 1-10 0 1 1 0 1 0-2 0 7 7 0 0 0 14 0Z" 
              fill="currentColor"
            />
          </svg>
        )}
      </button>
    );
  };
  
  export default AIButton; 