import React, { useEffect, useState } from "react";

const SaleCountdown = () => {
  const [timeLeft, setTimeLeft] = useState({ hours: 5, minutes: 0, seconds: 0 });

  // Calculate future time
  useEffect(() => {
    const endTime = new Date().getTime() + 5 * 60 * 60 * 1000; // current time + 5 hours

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = endTime - now;

      if (distance <= 0) {
        clearInterval(interval);
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0 });
      } else {
        const hours = Math.floor((distance / (1000 * 60 * 60)) % 24);
        const minutes = Math.floor((distance / (1000 * 60)) % 60);
        const seconds = Math.floor((distance / 1000) % 60);
        setTimeLeft({ hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Add leading zeros
  const format = (n) => (n < 10 ? `0${n}` : n);

  return (
    <div className="text-sm sm:text-base lg:text-lg font-bold text-center sm:text-right">
      <span className="block sm:inline">Hurry up! Sale ends in:</span>
      <p className="text-red-600 text-lg sm:text-xl lg:text-2xl mt-1 sm:mt-0">
        {format(timeLeft.hours)}:{format(timeLeft.minutes)}:{format(timeLeft.seconds)}
      </p>
    </div>
  );
};

export default SaleCountdown;
