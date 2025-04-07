import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Whiskycard from '@/components/ui/Whiskycard';
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
import useAuth from '@/store/useContext';
import '../../../styles/LoadingSpinner.css';
import { useNavigate } from 'react-router-dom';

export default function WhiskyRecommendationSection() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const { data: recommends, isLoading, isError } = useRecommendQuery();

  const [currentIndex, setCurrentIndex] = useState(0);
  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSpinner(false);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading || showSpinner) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 gap-6">
        <span className="loader" />
        <p>위스키를 추천 중입니다...</p>
      </div>
    );
  }

  if (isError || !recommends || recommends.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 gap-6">
        <p>추천 결과가 존재하지 않습니다.</p>
      </div>
    );
  }

  const total = recommends.length;

  const getRelativePosition = (idx: number) => {
    if (idx === currentIndex) return 0;
    if ((idx + 1) % total === currentIndex) return -1;
    if ((idx - 1 + total) % total === currentIndex) return 1;
    return 999;
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + total) % total);
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % total);
  };

  return (
    <div className="flex flex-col gap-3 items-center">
      <h2 className="font-semibold text-lg mb-2 px-4 self-start">
        {user?.name} 님을 위한 위스키 추천
      </h2>

      <div className="relative w-full flex justify-center items-center overflow-hidden h-[300px]">
        {/* 왼쪽 버튼 */}
        <button
          className="absolute left-1 z-10 p-2 bg-white rounded-full shadow-2xl"
          onClick={handleNext}
        >
          ◀
        </button>

        {/* 카드 캐러셀 */}
        <motion.div
          className="relative w-full h-full touch-pan-x cursor-grab active:cursor-grabbing"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.x > 50) {
              handlePrev();
            } else if (info.offset.x < -50) {
              handleNext();
            }
          }}
        >
          {recommends.map((whisky, idx) => {
            const pos = getRelativePosition(idx);
            if (pos === 999) return null;

            let style =
              'absolute top-0 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ';
            if (pos === 0) {
              style += 'scale-100 opacity-100 z-10';
            } else if (pos === -1) {
              style += '-translate-x-[150%] scale-85 opacity-70 z-0';
            } else if (pos === 1) {
              style += 'translate-x-[50%] scale-85 opacity-70 z-0';
            }

            return (
              <div
                key={whisky.whiskyId}
                className={style}
                onClick={() => navigate(`/detail/${whisky.whiskyId}`)}
              >
                <Whiskycard
                  koName={whisky.koName}
                  enName={whisky.enName}
                  type={whisky.type}
                  whiskyImage={whisky.whiskyImg}
                  abv={whisky.abv}
                  showLikeButton={false}
                  showChart={false}
                  className="w-[200px]"
                />
              </div>
            );
          })}
        </motion.div>

        {/* 오른쪽 버튼 */}
        <button
          className="absolute right-1 z-10 p-2 bg-white rounded-full shadow-2xl"
          onClick={handlePrev}
        >
          ▶
        </button>
      </div>
    </div>
  );
}
