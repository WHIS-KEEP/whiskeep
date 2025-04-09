import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { OcrResponse } from '@/lib/api/OCR';

interface ResultNavigationState {
  result: OcrResponse;
  origin?: 'modal-camera' | 'main-camera';
}

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const state = location.state as ResultNavigationState | null;

  const [selectedId, setSelectedId] = useState<number | null>(null);

  if (!state || !state.result) {
    return (
      <div className="h-screen w-full flex items-center justify-center text-gray-400">
        결과가 없습니다.
      </div>
    );
  }

  const { whiskies } = state.result;

  const handleSelect = (id: number) => {
    setSelectedId(id);

    console.log(state);
    console.log(state.origin);

    if (state.origin === 'modal-camera') {
      // 👇 모달에서 시작했으므로 메인으로 리다이렉트 + 상태 전달
      navigate('/main', {
        state: {
          ocrResult: {
            ...state.result,
          },
          backToModal: true,
        },
      });
    } else {
      // ✅ 일반 카메라 검색이면 상세페이지로 이동
      navigate(`/detail/${id}`);
    }
  };

  const isEmpty = whiskies.length === 0;

  return (
    <div className="h-screen w-full bg-bg-muted pt-5 pb-20 flex flex-col">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col flex-grow overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 text-center">OCR 결과</h2>

        {isEmpty ? (
          <div className="text-center text-gray-400 mt-8">
            <p className="mb-2 text-lg">결과 없음</p>
            <p>이미지에서 위스키 정보를 찾을 수 없습니다.</p>
          </div>
        ) : (
          <div className="flex-grow overflow-hidden">
            <SearchWhiskyResult
              items={whiskies}
              selectedId={selectedId}
              onSelect={handleSelect}
              onLoadMore={() => {}} // OCR 결과이므로 더 불러오기는 없음
              hasNext={false}
              shouldScrollToTops={false}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResultPage;
