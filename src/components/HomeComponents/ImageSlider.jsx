import React, { useState, useEffect, useRef } from "react";

const images = [
  "https://res.cloudinary.com/dx0ooqk4w/image/upload/v1751197144/934044814._CB551384116__cjlosk.jpg",
  "https://res.cloudinary.com/dx0ooqk4w/image/upload/v1751197143/1646263a1864391e4725e7fb44f29f16.w3000.h600._CR0_0_3000_600_SX1920__cxw8gr.jpg",
  "https://res.cloudinary.com/dx0ooqk4w/image/upload/v1751197143/PC_Hero_1_3000._CB582457311__tcsx8r.jpg",
  
  // Add more image URLs
];

const ImageSlider = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);

  const prevSlide = () => {
    setCurrentIndex((prev) =>
      prev === 0 ? images.length - 1 : prev - 1
    );
  };

  const nextSlide = () => {
    setCurrentIndex((prev) =>
      prev === images.length - 1 ? 0 : prev + 1
    );
  };

  // Auto-slide every 1 second
  useEffect(() => {
    if (!isPaused) {
      intervalRef.current = setInterval(() => {
        nextSlide();
      }, 1000); // 1 second
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isPaused]);

  // Pause auto-slide on hover
  const handleMouseEnter = () => {
    setIsPaused(true);
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
  };

  return (
    <div 
      className="relative w-full mx-auto z-10 image-slider"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={images[currentIndex]}
        alt="Slideshow"
        className="w-full h-[150px] sm:h-[200px] md:h-[250px] lg:h-64 object-cover rounded transition-all duration-1000 ease-in"
      />

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full text-sm sm:text-base image-slider-button hover:bg-opacity-70 transition-all duration-200"
      >
        ◀
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-black bg-opacity-50 text-white p-1 sm:p-2 rounded-full text-sm sm:text-base image-slider-button hover:bg-opacity-70 transition-all duration-200"
      >
        ▶
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
        {images.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentIndex(index)}
            className={`w-2 h-2 rounded-full transition-all duration-1000 ease-in ${
              index === currentIndex 
                ? 'bg-white scale-125' 
                : 'bg-white bg-opacity-50 hover:bg-opacity-75'
            }`}
          />
        ))}
      </div>

      {/* Auto-slide indicator */}
      <div className="absolute top-4 right-4 bg-black bg-opacity-50 text-white px-2 py-1 rounded-full text-xs">
        {isPaused ? '⏸️ Paused' : '▶️ Auto'}
      </div>
    </div>
  );
};

export default ImageSlider;
