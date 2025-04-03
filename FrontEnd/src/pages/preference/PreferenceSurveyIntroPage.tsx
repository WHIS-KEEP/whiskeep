import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PreferenceSurveyIntroPage = () => {
  const navigate = useNavigate();
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const handleCardSelect = (cardType: string) => {
    setSelectedCard(cardType);
    // Add a small delay before navigation to show the selection effect
    setTimeout(() => {
      navigate(`/preference/${cardType}`);
    }, 300);
  };

  return (
    <div className="flex flex-col justify-between h-full bg-[#F5F5F0]">
      {/* Header with logo */}
      <div className="w-full pt-4 pb-6">
        <div className="px-6">
          <h1 className="text-[24px] font-bold text-[#5B4B40]">WHISKEEP</h1>
        </div>
      </div>

      <div className="px-6 flex-1">
        {/* Progress bar */}
        <div className="flex gap-2 mb-10">
          <div className="h-2 rounded-full bg-[#5B4B40] flex-1"></div>
          <div className="h-2 rounded-full bg-[#D9D9D6] flex-1"></div>
          <div className="h-2 rounded-full bg-[#D9D9D6] flex-1"></div>
        </div>

        {/* Question */}
        <h1 className="text-[22px] font-bold text-center leading-[140%] mb-12 text-[#2D2D2D]">
          위스키를 경험해 본 적 있으신가요?
        </h1>

        {/* Selection cards */}
        <div className="flex flex-col gap-6">
          <button
            onClick={() => handleCardSelect('beginner')}
            className={`w-full p-6 border-2 rounded-[24px] flex flex-col items-center justify-center transition-all duration-200 min-h-[180px] ${
              selectedCard === 'beginner'
                ? 'border-[#5B4B40] bg-[#F5F5F0] shadow-md'
                : 'border-[#D9D9D6] bg-white'
            }`}
          >
            <div className="text-center">
              <p className="text-[18px] font-bold text-[#2D2D2D] mb-1">
                위스키에 대해
              </p>
              <p className="text-[16px] text-[#6E6E6E]">잘 알지 못 해요</p>
            </div>
          </button>

          <button
            onClick={() => handleCardSelect('familiar')}
            className={`w-full p-6 border-2 rounded-[24px] flex flex-col items-center justify-center transition-all duration-200 min-h-[180px] ${
              selectedCard === 'familiar' || !selectedCard
                ? 'border-[#D3BFA8] bg-[#D3BFA8]'
                : 'border-[#D9D9D6] bg-white'
            }`}
          >
            <div className="text-center">
              <p className="text-[18px] font-bold text-[#2D2D2D] mb-1">
                내가 좋아하는
              </p>
              <p className="text-[16px] text-[#6E6E6E]">
                위스키를 고를 수 있어요
              </p>
            </div>
          </button>
        </div>
      </div>

      {/* Navigation footer */}
      <div className="w-full py-4 border-t border-[#D9D9D6] bg-white">
        <div className="flex justify-between px-6">
          <button className="p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M15 18L9 12L15 6"
                stroke="#2D2D2D"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 12C14.2091 12 16 10.2091 16 8C16 5.79086 14.2091 4 12 4C9.79086 4 8 5.79086 8 8C8 10.2091 9.79086 12 12 12Z"
                fill="#2D2D2D"
              />
              <path
                d="M12 14C8.13401 14 5 17.134 5 21H19C19 17.134 15.866 14 12 14Z"
                fill="#2D2D2D"
              />
            </svg>
          </button>
          <button className="p-2">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <rect x="3" y="3" width="7" height="7" rx="1" fill="#2D2D2D" />
              <rect x="3" y="14" width="7" height="7" rx="1" fill="#2D2D2D" />
              <rect x="14" y="3" width="7" height="7" rx="1" fill="#2D2D2D" />
              <rect x="14" y="14" width="7" height="7" rx="1" fill="#2D2D2D" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSurveyIntroPage;
