import { useRef, useState, useEffect, useCallback, ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { JSX } from 'react';
import { X, Image as ImageIcon } from 'lucide-react';
import {
  getCameraErrorMessage,
  getImageCaptureErrorMessage,
} from '@/lib/util/error';

function OCRPage(): JSX.Element {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();

  const [videoActive] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState<boolean>(false);

  const handleGoBack = useCallback(() => {
    navigate('/main');
  }, [navigate]);

  const getUserVideo = useCallback(async () => {
    setIsCameraReady(false);
    setError(null);

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setError('현재 브라우저에서는 카메라 기능을 지원하지 않습니다.');
      return;
    }

    if (videoActive) {
      const constraints: MediaStreamConstraints = {
        video: {
          width: { ideal: 720 },
          height: { ideal: 720 },
          facingMode: 'environment',
        },
      };
      try {
        const stream: MediaStream =
          await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.onloadedmetadata = () => {
            videoRef.current?.play().catch((err: Error) => {
              console.error('비디오 자동 재생 실패:', err);
              setError(`카메라 재생 실패: ${err.message}`);
              setIsCameraReady(false);
            });
          };
          videoRef.current.onplaying = () => {
            console.log('카메라 재생 시작됨');
            setIsCameraReady(true);
            setError(null);
          };
          videoRef.current.onerror = (e) => {
            console.error('Video Element Error:', e);
            setError('비디오 재생 중 오류가 발생했습니다.');
            setIsCameraReady(false);
          };
        }
      } catch (err: unknown) {
        console.error('카메라 접근 오류:', err);
        setError(getCameraErrorMessage(err));
        setIsCameraReady(false);
      }
    } else {
      if (videoRef.current && videoRef.current.srcObject) {
        const stream = videoRef.current.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        videoRef.current.srcObject = null;
      }
      setIsCameraReady(false);
    }
  }, [videoActive]);

  useEffect(() => {
    getUserVideo();

    const videoElement = videoRef.current;

    // 컴포넌트가 언마운트될 때 비디오 스트림 정리
    return () => {
      // 참조값을 변수에 저장하여 effect 클린업 함수 내에서 사용
      if (videoElement && videoElement.srcObject) {
        const stream = videoElement.srcObject as MediaStream;
        stream.getTracks().forEach((track) => track.stop());
        console.log('카메라 스트림 정리 완료 (언마운트)');
      }
    };
  }, [getUserVideo]);

  const handleSendImage = useCallback(
    (file: File) => {
      if (!file) {
        setError(getImageCaptureErrorMessage('no_image'));
        return;
      }

      console.log('OCRPage: Image prepared, navigating to scanning page...');
      setError(null);
      navigate('/scanning', { state: { imageFile: file } });
    },
    [navigate],
  );

  // 생략된 import 및 상단 선언 부분은 그대로 유지

  const captureFrameAndSend = useCallback(() => {
    if (!isCameraReady || !videoRef.current || !canvasRef.current) {
      console.warn('캡처 버튼 클릭: 카메라 미준비 또는 ref 없음.');
      if (!isCameraReady)
        setError(getImageCaptureErrorMessage('no_camera_ready'));
      return;
    }

    const videoElement = videoRef.current;
    const canvasElement = canvasRef.current;

    if (
      videoElement.readyState >= 2 &&
      videoElement.videoWidth > 0 &&
      videoElement.videoHeight > 0
    ) {
      const context = canvasElement.getContext('2d');
      if (!context) {
        setError(getImageCaptureErrorMessage('canvas_context'));
        return;
      }

      canvasElement.width = videoElement.videoWidth;
      canvasElement.height = videoElement.videoHeight;
      context.drawImage(
        videoElement,
        0,
        0,
        canvasElement.width,
        canvasElement.height,
      );

      canvasElement.toBlob((blob) => {
        if (!blob) {
          setError(getImageCaptureErrorMessage('empty_image'));
          return;
        }

        const file = new File([blob], 'captured.png', { type: 'image/png' });
        handleSendImage(file);
      }, 'image/png');
    } else {
      setError(
        getImageCaptureErrorMessage(
          'video_state',
          videoElement.readyState.toString(),
        ),
      );
      console.warn('캡처 실패. 비디오 상태:', {
        readyState: videoElement.readyState,
        videoWidth: videoElement.videoWidth,
        videoHeight: videoElement.videoHeight,
        error: videoElement.error,
      });
    }
  }, [isCameraReady, handleSendImage]);

  const handleFileButtonClick = () => {
    setError(null);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];

      if (!file.type.startsWith('image/')) {
        setError(getImageCaptureErrorMessage('file_format'));
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      // ✅ 더 이상 FileReader 사용 안 함
      handleSendImage(file);

      // 입력 초기화 (같은 이미지 다시 선택 가능하게 하기 위함)
      if (fileInputRef.current) fileInputRef.current.value = '';
    } else {
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="relative w-full h-screen max-w-md mx-auto overflow-hidden bg-black">
      <button
        className="absolute z-30 p-1 cursor-pointer top-4 left-4 text-white/80 hover:text-white"
        onClick={handleGoBack}
        aria-label="뒤로 가기"
      >
        <X size={28} />
      </button>

      <div
        className="absolute top-16 left-0 right-0 bg-black"
        style={{
          maxHeight: 'calc(100vh - 200px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {error && (
          <div className="absolute inset-0 z-10 flex items-center justify-center p-5 text-lg font-bold text-center text-white bg-black/70">
            {error}
          </div>
        )}

        {!isCameraReady && !error && (
          <div className="absolute inset-0 z-0 flex items-center justify-center p-5 text-lg font-bold text-center text-white">
            카메라 준비 중...
          </div>
        )}

        <video
          ref={videoRef}
          className={`block w-full h-auto object-contain ${
            isCameraReady && !error ? 'visible' : 'invisible'
          }`}
          style={{ maxHeight: '100%' }}
          autoPlay
          playsInline
          muted
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>

      <div className="absolute bottom-70 left-0 right-0 z-20 flex items-center justify-around w-full p-4 bg-black/50 shrink-0">
        <div className="relative flex items-center justify-center w-[70px] h-[70px]">
          <div className="absolute z-0 w-[50px] h-[50px] rounded-full bg-gray-800" />
          <button
            className="relative z-10 p-2 text-white transition-opacity duration-200 ease-in-out bg-transparent border-none rounded-full cursor-pointer hover:bg-white/10"
            onClick={handleFileButtonClick}
            aria-label="사진 첨부"
            disabled={!!error}
          >
            <ImageIcon size={28} />
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        <button
          className={`relative flex items-center justify-center w-[70px] h-[70px] rounded-full shadow-md transition-opacity duration-200 ease-in-out ${
            !isCameraReady || !!error
              ? 'opacity-50 cursor-not-allowed'
              : 'cursor-pointer'
          }`}
          onClick={captureFrameAndSend}
          disabled={!isCameraReady || !!error}
          aria-label="사진 촬영"
          aria-disabled={!isCameraReady || !!error}
        >
          <div className="absolute top-0 bottom-0 left-0 right-0 m-auto z-10 w-full h-full rounded-full bg-white border-4 border-white/30" />
          <div className="absolute top-0 bottom-0 left-0 right-0 m-auto z-20 w-[95%] h-[95%] rounded-full bg-black" />
          <div className="absolute top-0 bottom-0 left-0 right-0 m-auto z-30 w-[90%] h-[90%] rounded-full bg-white" />
        </button>

        <div className="w-[70px]"></div>
      </div>
    </div>
  );
}

export default OCRPage;
