import { useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { OcrResponse } from '@/lib/api/OCR';

// OCR 오류 이미지 import
import ocr404Image from '../../assets/OCR/ocr404.png';
import ocr406Image from '../../assets/OCR/ocr406.png';
import ocr500Image from '../../assets/OCR/ocr500.png';

const errorImages: Record<string, string> = {
  'ocr404.png': ocr404Image,
  'ocr406.png': ocr406Image,
  'ocr500.png': ocr500Image,
};

interface ResultLocationState {
  result: OcrResponse;
  error?: string;
  timedOut?: boolean;
  errorImage?: string;
  origin: 'modal-camera' | 'main-camera';
}

const ResultPage = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const state = location.state as ResultLocationState;
  const [selectedId, setSelectedId] = useState<number | null>(null);

  const handleSelect = (id: number) => {
    setSelectedId(id);

    if (state?.origin === 'modal-camera') {
      navigate('/main', {
        state: {
          ocrResult: state.result,
          backToModal: true,
        },
      });
    } else {
      navigate(`/detail/${id}`);
    }
  };

  // 예외 처리 UI 렌더링
  if (state?.error || !state?.result) {
    const imageSrc = state?.errorImage
      ? errorImages[state.errorImage]
      : undefined;

    return (
      <div className="text-center">
        {imageSrc && (
          <div className="mt-20 mb-7 flex justify-center">
            <img
              src={imageSrc}
              alt="오류 이미지"
              className="max-w-full h-auto"
              style={{ maxWidth: '250px' }}
            />
          </div>
        )}
        <p className="mb-5 text-3xl font-bold text-text-main">검색 실패</p>
        <p className="mb-5 whitespace-pre-line text-text-main">
          {state?.error}
        </p>
        {state?.timedOut && (
          <p className="mt-2 text-sm text-text-main">(요청 시간 초과)</p>
        )}
        <button
          onClick={() => navigate('/ocr', { state: { origin: state.origin } })}
          className="px-6 py-2 mt-8 text-white bg-text-muted-40 rounded-[10px]"
        >
          다시 촬영하기
        </button>
      </div>
    );
  }

  // Timeout만 있는 경우
  if (state?.timedOut && !state?.error) {
    return (
      <div className="text-center">
        <p className="mb-5 text-3xl font-bold text-text-main">결과 없음</p>
        <p className="mb-5 whitespace-pre-line text-text-main">
          결과를 찾는 데 시간이 초과되었습니다.{'\n'}
          네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.
        </p>
        <button
          onClick={() => navigate('/ocr', { state: { origin: state.origin } })}
          className="mt-8 px-6 py-2 text-white bg-text-muted-40 rounded-[10px]"
        >
          다시 촬영하기
        </button>
      </div>
    );
  }

  const { whiskies } = state.result;
  const isEmpty = whiskies.length === 0;

  return (
    <div className="h-screen w-full bg-bg-muted pt-5 pb-20 flex flex-col">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col flex-grow overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 text-center">
          위스키 검색 결과
        </h2>

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
              onLoadMore={() => {}}
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
