import React, { useState, useEffect } from "react";
import "./MarqueeBanner.css";

const MarqueeBanner = () => {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isHovered, setIsHovered] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const bannerMessages = [
    { text: "FLASH SALE: Up To 70% OFF!", type: "flash" },
    { text: "Free Shipping on Orders Above ₹999", type: "shipping" },
    { text: "New Arrivals: Latest Fashion Trends", type: "new" },
    { text: "Premium Collection: Designer Wear", type: "premium" },
    { text: "100% Secure Payment & Easy Returns", type: "security" },
    { text: "Download Our App for Exclusive Deals", type: "app" },
    { text: "Buy 2 Get 1 Free on Selected Items", type: "offer" },
    { text: "Customer Satisfaction Guaranteed", type: "satisfaction" }
  ];

  const formatTime = (date) => {
    return date.toLocaleTimeString('en-IN', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div 
      className="marquee-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Live Time Display */}
      <div className="live-time">
        {/* <span className="time-icon">🕐</span> */}
        <span className="time-text">{formatTime(currentTime)}</span>
        <span className="live-indicator">LIVE</span>
      </div>

      {/* Main Marquee Content */}
      <div className={`marquee-content ${isHovered ? 'paused' : ''}`}>
        {bannerMessages.map((message, index) => (
          <div key={index} className={`marquee-item ${message.type}`}>
            {/* <span className="marquee-icon">...</span> */}
            <span className="marquee-text">{message.text}</span>
            {/* <span className="marquee-icon">...</span> */}
          </div>
        ))}
      </div>

      {/* Gradient Overlays */}
      <div className="marquee-gradient-left"></div>
      <div className="marquee-gradient-right"></div>

      {/* Interactive Elements */}
      <div className="marquee-controls">
        <button className="control-btn pause-btn" onClick={() => setIsHovered(!isHovered)}>
          {isHovered ? 'Play' : 'Pause'}
        </button>
      </div>
    </div>
  );
};

export default MarqueeBanner;
