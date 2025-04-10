import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import logo from '../assets/logo.svg'; // 로고 경로 확인 필요

const HomePage = () => {
  const [opacity, setOpacity] = useState(0);
  const [animationComplete, setAnimationComplete] = useState(false);
  const logoRef = useRef<HTMLImageElement>(null); // ref 타입 명시
  const navigate = useNavigate();

  // 로고 페이드인 애니메이션
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

        // 페이드인 완료 후 로고 위치 정보 저장을 위한 짧은 지연
        setTimeout(() => {
          setAnimationComplete(true);
        }, 500);
      }
    }, interval);

    return () => clearInterval(fadeInInterval);
  }, []);

  // 로고 위치 정보를 세션 스토리지에 저장하고 페이지 전환
  useEffect(() => {
    if (animationComplete && logoRef.current) {
      const logoRect = logoRef.current.getBoundingClientRect();

      // 로고 위치 정보 세션 스토리지에 저장
      sessionStorage.setItem(
        'logoPosition',
        JSON.stringify({
          top: logoRect.top,
          left: logoRect.left,
          width: logoRect.width,
          height: logoRect.height,
        }),
      );

      // 페이지 전환 (약간 지연)
      setTimeout(() => {
        navigate('/login');
      }, 100);
    }
  }, [animationComplete, navigate]);

  return (
    <motion.div
      className="flex flex-col items-center justify-center min-h-[90vh] p-6 bg-bg-muted rounded-lg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{
        opacity: animationComplete ? 0 : 1,
        transition: { duration: 0.3 },
      }}
    >
      <div className="flex items-center justify-center">
        <motion.img
          ref={logoRef}
          src={logo}
          alt="Wiskeep"
          className="h-10 w-auto"
          style={{
            opacity: opacity,
            WebkitBackgroundClip: 'text',
            color: 'transparent',
          }}
          animate={
            animationComplete
              ? {
                  y: -100,
                  scale: 1.2,
                  transition: { duration: 0.5, ease: 'easeInOut' },
                }
              : {}
          }
          transition={{ opacity: { duration: 0.4, ease: 'easeInOut' } }}
        />
      </div>
    </motion.div>
  );
};

export default HomePage;
