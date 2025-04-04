// import React, { useRef, useState, useEffect } from 'react';

// function CameraOCR() {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [video, setVideo] = useState(true); // 초기값으로 true 설정하여 카메라 접근 시도

//   const getUserVideo = async () => {
//     if (video === true) {
//       const containts = { video: { width: 412, height: 412 } };
//       try {
//         const stream = await navigator.mediaDevices.getUserMedia(containts);
//         if (videoRef.current) {
//           videoRef.current.srcObject = stream;
//           videoRef.current.onloadedmetadata = () => {
//             videoRef.current?.play();
//           };
//         }
//       } catch (err) {
//         console.error('카메라 접근 오류:', err);
//       }
//     }
//   };

//   const sendImage = async (imageDataURL: string) => {
//     try {
//       // 실제 백엔드 API 엔드포인트 주소로 변경해야 합니다.
//       const response = await fetch('/api/ocr', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ image: imageDataURL }),
//       });

//       if (response.ok) {
//         const data = await response.json();
//         console.log('OCR 결과:', data);
//         // OCR 결과를 처리하는 로직 (예: 화면에 표시)
//       } else {
//         console.error('이미지 전송 실패:', response.status);
//       }
//     } catch (error) {
//       console.error('이미지 전송 중 오류 발생:', error);
//     }
//   };

//   const handleCamera = () => {
//     const videoElement = videoRef.current;
//     const canvasElement = canvasRef.current;

//     if (videoElement && canvasElement) {
//       const canvasContext = canvasElement.getContext('2d');
//       if (!canvasContext) return;

//       // canvas의 크기 = 비디오의 크기
//       canvasElement.width = videoElement.videoWidth;
//       canvasElement.height = videoElement.videoHeight;

//       // 비디오의 현재 프레임을 canvas에 기록
//       canvasContext.drawImage(
//         videoElement,
//         0,
//         0,
//         canvasElement.width,
//         canvasElement.height,
//       );

//       // canvas의 내용을 이미지 데이터 png로 변환
//       const imageDataURL = canvasElement.toDataURL('image/png');

//       // 이미지 데이터를 백엔드로 전송하는 함수 호출
//       sendImage(imageDataURL);
//     } else {
//       console.error('비디오 또는 캔버스 요소를 찾을 수 없습니다.');
//     }
//   };

//   useEffect(() => {
//     getUserVideo();
//   }, [video]); // video 상태가 변경될 때 getUserVideo 호출

//   return (
//     <div
//       style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
//     >
//       <video
//         ref={videoRef}
//         autoPlay
//         playsInline
//         muted
//         style={{ width: '100%', maxWidth: '412px', height: 'auto' }}
//       />
//       <button
//         onClick={handleCamera}
//         style={{ marginTop: '10px', padding: '10px 20px', fontSize: '16px' }}
//       >
//         사진 촬영
//       </button>
//       <canvas ref={canvasRef} style={{ display: 'none' }} />
//     </div>
//   );
// }

// export default CameraOCR;
