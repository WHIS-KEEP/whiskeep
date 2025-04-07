import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import { X } from 'lucide-react'; // Assuming you want a close button
import { OcrResponse } from '@/lib/api/OCR';

// Define the expected structure of the location state
interface ResultLocationState {
  result?: OcrResponse; // OCR 응답 데이터로 변경
  error?: string;
  timedOut?: boolean;
}

function ResultPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as ResultLocationState | null; // Type assertion

  const handleGoBack = () => {
    // Decide where to go back. Maybe to the OCR page or the main page?
    // navigate(-1); // Go back one step (to ScanningPage, maybe not ideal)
    navigate('/ocr'); // Navigate explicitly to the OCR page
    // Or navigate('/'); // Navigate to home
  };

  const renderContent = () => {
    if (state?.error) {
      return (
        <div className="text-center text-red-400">
          <p className="mb-4 text-lg">오류 발생</p>
          <p>{state.error}</p>
          {state.timedOut && <p className="mt-2 text-sm">(요청 시간 초과)</p>}
        </div>
      );
    }

    if (state?.timedOut && !state?.error) {
      // Handle timeout specifically if no other error message was generated
      return (
        <div className="text-center text-yellow-400">
          <p className="mb-4 text-lg">결과 없음</p>
          <p>결과를 찾는 데 시간이 초과되었습니다.</p>
          <p className="mt-2 text-sm">
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
          <div className="text-center text-gray-400">
            <p className="mb-4 text-lg">결과 없음</p>
            <p>이미지에서 관련 정보를 찾을 수 없습니다.</p>
          </div>
        );
      }

      return (
        <div className="text-left w-full">
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
      <div className="text-center text-gray-400">
        <p>결과를 표시할 수 없습니다.</p>
      </div>
    );
  };

  return (
    <div className="relative flex flex-col items-center justify-center w-full min-h-[100dvh] max-w-md p-6 mx-auto bg-gray-900 text-white">
      {/* Close Button */}
      <button
        className="absolute z-10 p-1 cursor-pointer top-4 left-4 text-white/80 hover:text-white"
        onClick={handleGoBack}
        aria-label="닫기"
      >
        <X size={28} />
      </button>

      <div className="flex flex-col items-center w-full max-w-sm">
        <div className="mb-8 w-full">{renderContent()}</div>

        <button
          onClick={() => navigate('/ocr')}
          className="px-6 py-2 text-white bg-text-muted-40 rounded-[10px]"
        >
          다시 스캔하기
        </button>
      </div>
    </div>
  );
}

export default ResultPage;
