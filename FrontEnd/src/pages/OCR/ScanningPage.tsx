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
  origin?: 'modal-camera' | 'main-camera';
}

const MIN_DISPLAY_TIME_MS = 1000;
const API_TIMEOUT_MS = 600000;

function ScanningPage(): JSX.Element {
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;
  const [message, setMessage] = useState<string>('위스키를 찾는 중입니다...');
  const isMounted = useRef<boolean>(true);
  const origin = location.state?.origin;

  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  useEffect(() => {
    if (!state?.imageFile) {
      console.error('ScanningPage: No image file received.');
      if (isMounted.current) {
        setMessage('이미지를 인식할 수 없습니다. 메인 페이지로 돌아갑니다.');
        setTimeout(() => navigate('/main'), 2000);
      }
      return;
    }

    const imageFile = state.imageFile; // ✅ 변수 변경
    let apiTimerId: NodeJS.Timeout | null = null;
    let minDisplayTimerId: NodeJS.Timeout | null = null;

    const performOcr = async () => {
      try {
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

        if (origin === 'modal-camera') {
          navigate('/main', {
            state: {
              ocrResult: ocrResult,
              backToModal: true,
            },
          });
          return;
        }

        navigate('/result', {
          state: {
            result: ocrResult,
            origin: 'main-camera',
          } as ResultNavigationState,
        });
      } catch (err: unknown) {
        await new Promise<void>((resolve) =>
          setTimeout(resolve, MIN_DISPLAY_TIME_MS),
        );

        const errorState: ErrorState = handleOcrError(err);
        navigate('/result', {
          state: {
            error: errorState.error,
            timedOut: errorState.timedOut,
            errorImage: errorState.errorImage,
            origin,
          } as ResultNavigationState,
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
    };
  }, [state, navigate, origin]);

  return (
    <div className="fixed inset-0 flex flex-col justify-center items-center z-50 gap-6">
      <span className="loader" />
      <p>{message}</p>
    </div>
  );
}

export default ScanningPage;
