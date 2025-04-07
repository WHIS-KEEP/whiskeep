import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendImageToOCR } from '@/lib/api/OCR'; // Adjust path if necessary
import { handleOcrError, ErrorState } from '@/lib/util/error'; // Adjust path if necessary
import { JSX } from 'react';
import { OcrResponse } from '@/lib/api/OCR';

// Define the expected structure of the location state
interface LocationState {
  imageDataURL?: string;
}

// Define the structure for the result state passed to the next page
interface ResultNavigationState {
  result?: OcrResponse; // OCR 결과 타입으로 변경
  error?: string;
  timedOut?: boolean;
}

const MIN_DISPLAY_TIME_MS = 1000; // Minimum time to show "Scanning..." (1 seconds)
const API_TIMEOUT_MS = 10000; // Maximum time to wait for API response (10 seconds)

function ScanningPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null; // Type assertion
  const [message, setMessage] = useState<string>('스캔 중...');
  const isMounted = useRef<boolean>(true); // Track component mount state for async operations

  useEffect(() => {
    // Ensure component is still mounted on cleanup
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!state?.imageDataURL) {
      console.error('ScanningPage: No image data received.');
      if (isMounted.current) {
        setMessage('오류: 이미지 데이터가 없습니다. 이전 페이지로 돌아갑니다.');
        // Optionally navigate back after a delay
        setTimeout(() => navigate(-1), 2000);
      }
      return;
    }

    const imageDataURL = state.imageDataURL;
    let apiTimerId: NodeJS.Timeout | null = null;
    let minDisplayTimerId: NodeJS.Timeout | null = null;

    const performOcr = async () => {
      try {
        console.log('ScanningPage: Starting OCR process...');
        // Start API call and minimum display timer concurrently
        const minDisplayPromise = new Promise<void>((resolve) => {
          minDisplayTimerId = setTimeout(resolve, MIN_DISPLAY_TIME_MS);
        });

        const apiPromise = sendImageToOCR(imageDataURL);

        // Race the API call against a timeout
        const timeoutPromise = new Promise<never>((_, reject) => {
          apiTimerId = setTimeout(() => {
            reject(new Error('API timeout')); // Custom error for timeout
            console.warn('ScanningPage: API call timed out.');
          }, API_TIMEOUT_MS);
        });

        // Wait for the API call or timeout
        const ocrResult = await Promise.race([apiPromise, timeoutPromise]);

        // Now wait for the minimum display time as well
        await minDisplayPromise;
        console.log('ScanningPage: OCR Success:', ocrResult);

        // Navigate to result page with data
        navigate('/result', {
          state: { result: ocrResult } as ResultNavigationState,
        });
      } catch (err: unknown) {
        console.error('ScanningPage: OCR failed:', err);

        // 로그 추가
        console.log('ScanningPage: Entering catch block. Error:', err);

        // Ensure minimum display time has passed before showing error/navigating
        await new Promise<void>((resolve) => {
          const remainingTime =
            MIN_DISPLAY_TIME_MS -
            (minDisplayTimerId
              ? 0
              : performance.now()); /* Need start time if precise */ // Simplified logic
          setTimeout(resolve, Math.max(0, remainingTime)); // Wait for remaining min time if any
        });

        console.log('ScanningPage: Minimum display time passed.');

        // 중앙 집중화된 오류 처리 로직 사용
        const errorState: ErrorState = handleOcrError(err);
        console.log('ScanningPage: Error processed:', errorState);

        // 결과 페이지로 이동 (오류 정보 포함)
        console.log(
          'ScanningPage: Navigating to /result with state:',
          errorState,
        );
        navigate('/result', {
          state: errorState as ResultNavigationState,
        });
      } finally {
        // Clear any running timers
        if (apiTimerId) clearTimeout(apiTimerId);
        if (minDisplayTimerId) clearTimeout(minDisplayTimerId); // Should already be cleared if awaited
      }
    };

    performOcr();

    // Cleanup function for timers if component unmounts early
    return () => {
      if (apiTimerId) clearTimeout(apiTimerId);
      if (minDisplayTimerId) clearTimeout(minDisplayTimerId);
      console.log('ScanningPage: Unmounting, timers cleared.');
    };
  }, [state, navigate]); // Rerun effect if state or navigate changes

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen max-w-md mx-auto bg-black text-white">
      {/* You can add a spinner here */}
      <div className="animate-pulse text-xl font-semibold">{message}</div>
    </div>
  );
}

export default ScanningPage;
