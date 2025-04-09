import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Whiskycard from '@/components/ui/Whiskycard';
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
import useAuth from '@/store/useContext';
import '../../../styles/LoadingSpinner.css';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight } from 'lucide-react'; // Lucide 아이콘 import

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
    <div className="flex flex-col gap-4 items-center w-full px-0 md:px-0 mb-0">
      <h2 className="font-semibold text-md md:text-md lg:text-md mb-1 self-start pl-5 mt-4">
        <span className="text-2xl md:text-3xl lg:text-4xl">
          {user?.nickname}
        </span>{' '}
        님을 위한 위스키 추천
      </h2>

      {/* 높이 증가: h-[500px] md:h-[550px] lg:h-[600px] */}
      <div className="relative w-full flex justify-center items-center overflow-hidden h-[500px] md:h-[550px] lg:h-[600px]">
        {/* 왼쪽 버튼 - Lucide 아이콘으로 교체하고 스타일 개선 */}
        <button
          className="absolute left-2 md:left-4 z-20 p-2 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          onClick={handlePrev}
          aria-label="이전 위스키"
        >
          <ChevronLeft size={28} strokeWidth={2.5} className="text-gray-700" />
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
              'absolute top-1/12 left-1/2 transform -translate-x-1/2 transition-all duration-500 ease-in-out ';
            if (pos === 0) {
              style += 'scale-110 opacity-100 z-10';
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
                  showChart={true}
                  whiskyId={whisky.whiskyId} // 이 속성이 추가되어야 함!
                  className="w-[280px] sm:w-[320px] md:w-[360px]"
                />
              </div>
            );
          })}
        </motion.div>

        {/* 오른쪽 버튼 - Lucide 아이콘으로 교체하고 스타일 개선 */}
        <button
          className="absolute right-2 md:right-4 z-20 p-2 md:p-3 bg-white rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-200 flex items-center justify-center"
          onClick={handleNext}
          aria-label="다음 위스키"
        >
          <ChevronRight size={28} strokeWidth={2.5} className="text-gray-700" />
        </button>
      </div>
    </div>
  );
}
