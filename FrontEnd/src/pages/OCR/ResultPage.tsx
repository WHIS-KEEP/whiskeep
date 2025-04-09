import { useLocation, useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import { X } from 'lucide-react'; // Assuming you want a close button
import { OcrResponse } from '@/lib/api/OCR';

// OCR 오류 이미지 import
import ocr404Image from '../../assets/OCR/ocr404.png';
import ocr406Image from '../../assets/OCR/ocr406.png';
import ocr500Image from '../../assets/OCR/ocr500.png';

// 이미지 매핑 객체
const errorImages: Record<string, string> = {
  'ocr404.png': ocr404Image,
  'ocr406.png': ocr406Image,
  'ocr500.png': ocr500Image,
};

// Define the expected structure of the location state
interface ResultLocationState {
  result?: OcrResponse; // OCR 응답 데이터로 변경
  error?: string;
  timedOut?: boolean;
  errorImage?: string; // 에러 이미지 경로 추가
}

function ResultPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultLocationState | null; // Type assertion

  const handleGoBack = () => {
    navigate('/main'); // Navigate explicitly to the OCR page
  };

  const renderContent = () => {
    if (state?.error) {
      // 이미지 파일명에 해당하는 실제 이미지 소스 가져오기
      const imageSrc = state.errorImage
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
            {state.error}
          </p>
          {state.timedOut && (
            <p className="mt-2 text-sm text-text-main">(요청 시간 초과)</p>
          )}
        </div>
      );
    }

    if (state?.timedOut && !state?.error) {
      // Handle timeout specifically if no other error message was generated
      return (
        <div className="text-center text-yellow-400 mt-4">
          <p className="mb-2 text-lg">결과 없음</p>
          <p className="whitespace-pre-line">
            결과를 찾는 데 시간이 초과되었습니다.
          </p>
          <p className="mt-2 text-sm whitespace-pre-line">
            네트워크 상태를 확인하거나 잠시 후 다시 시도해 주세요.
          </p>
        </div>
      );
    }

    if (state?.result) {
      // --- TODO: Replace this with your actual result rendering logic ---
      // Check if result indicates "not found" or is empty based on your API structure
      const isEmptyResult =
        !state.result ||
        (Array.isArray(state.result) && state.result.length === 0) ||
        (typeof state.result === 'object' &&
          Object.keys(state.result).length === 0);

      if (isEmptyResult) {
        return (
          <div className="text-center text-gray-400 mt-4">
            <p className="mb-2 text-lg">결과 없음</p>
            <p>이미지에서 관련 정보를 찾을 수 없습니다.</p>
          </div>
        );
      }

      return (
        <div className="text-left w-full mt-4">
          <h2 className="mb-4 text-xl font-semibold text-center">OCR 결과</h2>
          <pre className="p-4 text-sm whitespace-pre-wrap bg-gray-800 rounded max-h-60 overflow-y-auto">
            {JSON.stringify(state.result, null, 2)}
          </pre>
          {/* Add buttons or links to use the result data */}
        </div>
      );
      // --- End of TODO section ---
    }

    // Default case if state is somehow invalid or empty without error/result
    return (
      <div className="text-center text-gray-400 mt-4">
        <p>결과를 표시할 수 없습니다.</p>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-start w-full min-h-[100dvh] max-w-md p-6 pt-12 mx-auto bg-bg-muted text-white">
      {/* Close Button */}
      <button
        className="absolute z-10 p-1 cursor-pointer top-4 left-4 text-white/80 hover:text-white"
        onClick={handleGoBack}
        aria-label="닫기"
      >
        <X size={28} />
      </button>

      <div className="flex flex-col items-center w-full max-w-sm mt-8">
        <div className="w-full">{renderContent()}</div>

        <button
          onClick={() => navigate('/ocr')}
          className="px-6 py-2 mt-8 text-white bg-text-muted-40 rounded-[10px]"
        >
          다시 스캔하기
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
