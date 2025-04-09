import { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sendImageToOCR } from '@/lib/api/OCR';
import { handleOcrError, ErrorState } from '@/lib/util/error';
import { JSX } from 'react';
import { OcrResponse } from '@/lib/api/OCR';

// Define the expected structure of the location state
interface LocationState {
  imageFile?: File;
}

interface ResultNavigationState {
  result?: OcrResponse;
  error?: string;
  timedOut?: boolean;
}

const MIN_DISPLAY_TIME_MS = 1000;
const API_TIMEOUT_MS = 30000;

function ScanningPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [message, setMessage] = useState<string>('스캔 중... (최대 30초)');
  const isMounted = useRef<boolean>(true);

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!state?.imageFile) {
      console.error('ScanningPage: No image file received.');
      if (isMounted.current) {
        setMessage('오류: 이미지 파일이 없습니다. 이전 페이지로 돌아갑니다.');
        setTimeout(() => navigate(-1), 2000);
      }
      return;
    }

    const imageFile = state.imageFile; // ✅ 변수 변경
    let apiTimerId: NodeJS.Timeout | null = null;
    let minDisplayTimerId: NodeJS.Timeout | null = null;

    const performOcr = async () => {
      try {
        console.log('ScanningPage: Starting OCR process...');
        const minDisplayPromise = new Promise<void>((resolve) => {
          minDisplayTimerId = setTimeout(resolve, MIN_DISPLAY_TIME_MS);
        });

        const apiPromise = sendImageToOCR(imageFile); // ✅ 여기서 File 전달

        const timeoutPromise = new Promise<never>((_, reject) => {
          apiTimerId = setTimeout(() => {
            reject(new Error('API timeout'));
            console.warn('ScanningPage: API call timed out.');
          }, API_TIMEOUT_MS);
        });

        const ocrResult = await Promise.race([apiPromise, timeoutPromise]);
        await minDisplayPromise;

        console.log('ScanningPage: OCR Success:', ocrResult);

        navigate('/result', {
          state: { result: ocrResult } as ResultNavigationState,
        });
      } catch (err: unknown) {
        console.error('ScanningPage: OCR failed:', err);
        console.log('ScanningPage: Entering catch block. Error:', err);

        await new Promise<void>((resolve) =>
          setTimeout(resolve, MIN_DISPLAY_TIME_MS),
        );

        console.log('ScanningPage: Minimum display time passed.');

        const errorState: ErrorState = handleOcrError(err);
        console.log('ScanningPage: Error processed:', errorState);

        navigate('/result', {
          state: errorState as ResultNavigationState,
        });
      } finally {
        if (apiTimerId) clearTimeout(apiTimerId);
        if (minDisplayTimerId) clearTimeout(minDisplayTimerId);
      }
    };

    performOcr();

    return () => {
      if (apiTimerId) clearTimeout(apiTimerId);
      if (minDisplayTimerId) clearTimeout(minDisplayTimerId);
      console.log('ScanningPage: Unmounting, timers cleared.');
    };
  }, [state, navigate]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-screen max-w-md mx-auto bg-black text-white">
      <div className="animate-pulse text-xl font-semibold whitespace-pre-line text-center">
        {message}
      </div>
    </div>
  );
}

export default ScanningPage;
