import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import { useState } from 'react';

const PreferenceSurveyIntroPage = () => {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<'beginner' | 'familiar' | null>(
    null,
  );

  const handleSelect = (type: 'beginner' | 'familiar') => {
    setSelected(type);
    navigate(`/preference/${type}`);
  };

  return (
    <div className="min-h-screen bg-[var(--bg-muted)]">
      {/* Header 대신 */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '1.25rem' }}
      >
        <div className="flex items-center">
          <img src={logo} alt="Wiskeep" className="h-7 w-auto" />
        </div>
      </div>

      <div className="px-6 pt-6 pb-10">
        {/* Progress Bar
        <div className="flex justify-between items-center w-full max-w-xs mx-auto mt-2 mb-8">
          <div className="w-[60px] h-[6px] rounded-full bg-[var(--primary-dark)]" />
          <div className="w-[60px] h-[6px] rounded-full bg-[var(--text-muted-20)]" />
          <div className="w-[60px] h-[6px] rounded-full bg-[var(--text-muted-20)]" />
          <div className="w-[60px] h-[6px] rounded-full bg-[var(--text-muted-20)]" />
        </div> */}

        {/* 질문 */}
        <h2 className="text-[18px] font-bold text-center text-[var(--text-main)] leading-[140%] mb-8">
          위스키를 경험해 본 적 있으신가요?
        </h2>

        {/* 카드 */}
        <div className="flex justify-center gap-4">
          {/* 입문자 카드 */}
          <button
            onClick={() => handleSelect('beginner')}
            className={`w-[140px] h-[180px] rounded-[16px] flex items-center justify-center text-center px-2 border transition-colors
              ${
                selected === 'beginner'
                  ? 'bg-[var(--wood)]'
                  : 'bg-[#FDFCF9] hover:bg-[#f0ede6]'
              }
              border-[var(--primary-dark)]`}
          >
            <span className="text-[14px] text-[var(--text-main)] leading-[140%] font-medium">
              위스키에 대해
              <br />잘 알지 못 해요
            </span>
          </button>

          {/* 숙련자 카드 */}
          <button
            onClick={() => handleSelect('familiar')}
            className={`w-[140px] h-[180px] rounded-[16px] flex items-center justify-center text-center px-2 border transition-colors
              ${
                selected === 'familiar'
                  ? 'bg-[var(--wood)]'
                  : 'bg-[#FDFCF9] hover:bg-[#f0ede6]'
              }
              border-[var(--primary-dark)]`}
          >
            <span className="text-[14px] text-[var(--text-main)] leading-[140%] font-medium">
              내가 좋아하는
              <br />
              위스키를
              <br />
              고를 수 있어요
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default PreferenceSurveyIntroPage;
