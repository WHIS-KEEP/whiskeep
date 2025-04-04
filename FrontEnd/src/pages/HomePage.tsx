import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // react-router-dom을 사용하여 페이지 이동

import logo from '../assets/logo.svg';

const Home = () => {
  const [opacity, setOpacity] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // 점차 선명해지는 로고 애니메이션
    const fadeInDuration = 2000;
    const interval = 40;
    const steps = fadeInDuration / interval;
    let currentStep = 0;

    const fadeInInterval = setInterval(() => {
      currentStep++;
      const newOpacity = currentStep / steps;
      setOpacity(newOpacity);

      if (currentStep >= steps) {
        clearInterval(fadeInInterval);
      }
    }, interval);

    const navigationDelay = 3500;
    setTimeout(() => {
      navigate('/main');
    }, navigationDelay);

    return () => clearInterval(fadeInInterval);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-6 bg-bg-muted rounded-lg">
      <div className="flex items-center justify-center">
        <img
          src={logo}
          alt="Wiskeep"
          className="h-10 w-auto"
          style={{
            opacity: opacity,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
            transition: 'opacity 0.2s ease-in-out',
          }}
        />
      </div>
    </div>
  );
};

export default Home;
