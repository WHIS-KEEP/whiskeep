import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '@/assets/logo.svg';
import { useWhiskiesQuery } from '@/hooks/queries/useFamiliarSurveyQuery';
import { useSubmitSurveyMutation } from '@/hooks/mutations/useSurveyMutation';

const FamiliarSurveyPage = () => {
  const navigate = useNavigate();
  const { data: whiskies = [] } = useWhiskiesQuery();
  const { mutate: submitSurvey } = useSubmitSurveyMutation();

  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const toggleWhisky = (id: number) => {
    setSelectedIds((prev) => {
      if (prev.includes(id)) {
        return prev.filter((i) => i !== id);
      } else if (prev.length < 3) {
        return [...prev, id];
      } else {
        alert('최대 3개까지만 선택할 수 있어요!');
        return prev;
      }
    });
  };

  const handleSubmit = () => {
    if (selectedIds.length === 0)
      return alert('위스키를 1개 이상 선택해주세요!');
    submitSurvey(selectedIds, {
      onSuccess: () => {
        navigate('/preference/complete');
      },
      onError: () => {
        alert('서버 전송 중 오류가 발생했어요. 다시 시도해주세요.');
      },
    });
  };

  const getCardStyle = (isSelected: boolean) => {
    return `
      w-[120px] h-[160px] rounded-[16px] flex flex-col items-center justify-center text-center px-2 border transition-colors
      ${
        isSelected
          ? 'bg-[var(--wood-70)] border-[var(--primary-dark)] shadow-lg'
          : 'bg-[#FDFCF9] border-[var(--primary-dark)] hover:bg-[#f0ede6]'
      }
    `;
  };

  return (
    <div className="min-h-screen bg-[var(--bg-muted)]">
      {/* Header */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '1.25rem' }}
      >
        <img src={logo} alt="Wiskeep" className="h-7 w-auto" />
      </div>

      <div className="px-6 pt-2 pb-6">
        <p className="text-center text-[14px] text-[var(--text-muted)] font-medium mb-2">
          위스키를 즐겨드시는군요!
        </p>
        <h2 className="text-center text-[16px] font-semibold text-[var(--text-main)] leading-[140%]">
          선호하는 위스키가 있다면 <br className="block sm:hidden" />
          <strong>최대 3개까지</strong> 선택해주세요.
        </h2>
      </div>

      {/* 카드 목록 */}
      <div className="px-6 grid grid-cols-3 gap-x-4 gap-y-6 place-items-center mb-10">
        {whiskies.map((whisky) => {
          const isSelected = selectedIds.includes(whisky.whiskyId);
          return (
            <button
              key={whisky.whiskyId}
              onClick={() => toggleWhisky(whisky.whiskyId)}
              className={getCardStyle(isSelected)}
            >
              <img
                src={whisky.whiskyImg}
                alt={whisky.koName}
                className="h-[90px] object-contain mb-2"
              />
              <span className="text-[14px] text-[var(--text-main)] leading-[140%] font-medium">
                {whisky.koName}
              </span>
            </button>
          );
        })}
      </div>
      {/* 버튼 영역 */}
      <div className="px-6 flex gap-3 pb-8">
        {/* 선택 완료 */}
        <button
          onClick={handleSubmit}
          className="w-full h-12 rounded-[12px] bg-[var(--primary-dark)] text-white font-semibold text-[15px] transition-colors hover:bg-[var(--primary-50)] border border-[var(--primary-dark)]"
        >
          선택 완료
        </button>

        {/* 뒤로 가기 */}
        <button
          onClick={() => navigate('/preference')}
          className="w-full h-12 rounded-[12px] bg-transparent text-[var(--primary-dark)] font-semibold text-[15px] border border-[var(--primary-dark)] transition-colors hover:bg-[var(--primary-30)]"
        >
          뒤로 가기
        </button>
      </div>
    </div>
  );
};

export default FamiliarSurveyPage;
