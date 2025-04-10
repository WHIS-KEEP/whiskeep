import { useState, useEffect, useRef } from 'react';
// import { motion } from 'framer-motion';
import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from '@/hooks/mutations/useLoginMutations';

import loginImage from '@/assets/login.png';
import logoImage from '@/assets/logo.svg';
import paintImage from '@/assets/paint.png';

// 로고 위치 정보에 대한 인터페이스 정의
// interface LogoPosition {
//   top: number;
//   left: number;
//   width: number;
//   height: number;
// }

const Login = () => {
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

  // --- 애니메이션 대상 요소에 대한 Ref 생성 ---
  const paintImageRef = useRef<HTMLImageElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);
  // const movingLogoRef = useRef<HTMLImageElement>(null);

  // const [initialLogoPosition, setInitialLogoPosition] =
  //   useState<LogoPosition | null>(null);
  // const [animationComplete, setAnimationComplete] = useState(false);
  const [showPaintAnimation, setShowPaintAnimation] = useState(false);

  // 세션 스토리지에서 이전 페이지의 로고 위치 정보 가져오기
  useEffect(() => {
    const storedPosition = sessionStorage.getItem('logoPosition');

    if (storedPosition) {
      // setInitialLogoPosition(JSON.parse(storedPosition));
      // 로고 이동 애니메이션이 있을 경우, 페인트 애니메이션은 이후에 시작
      setShowPaintAnimation(false);
    } else {
      // 저장된 위치가 없으면 페인트 애니메이션 바로 시작
      // setAnimationComplete(true);
      setShowPaintAnimation(true);
    }

    // 애니메이션이 끝나면 세션 스토리지 정리
    return () => {
      sessionStorage.removeItem('logoPosition');
    };
  }, []);

  // // 로고 애니메이션 완료 표시
  // useEffect(() => {
  //   if (initialLogoPosition) {
  //     const timer = setTimeout(() => {
  //       // setAnimationComplete(true);
  //       setShowPaintAnimation(true); // 로고 이동 후 페인트 애니메이션 시작
  //     }, 2000); // 로고 애니메이션 시간과 맞춰야 함

  //     return () => clearTimeout(timer);
  //   }
  // }, [initialLogoPosition]);

  // 페인트 및 로고 애니메이션 (기존 코드)
  useEffect(() => {
    // 로고 이동 애니메이션이 끝났거나, 처음부터 없었을 때만 실행
    if (!showPaintAnimation) return;

    const paintImage = paintImageRef.current;
    const logoImage = logoImageRef.current;

    if (!paintImage || !logoImage) return;

    // 시작 상태 설정 - 모든 이미지가 왼쪽 끝부터 시작
    paintImage.style.opacity = '1';
    paintImage.style.clipPath = 'inset(0 100% 0 0)'; // 왼쪽 끝 0%만 보이게 (오른쪽 100% 잘림)

    // 로고도 왼쪽 끝만 보이게 설정 (동일한 효과)
    logoImage.style.opacity = '1';
    logoImage.style.clipPath = 'inset(0 100% 0 0)'; // 왼쪽 끝 0%만 보이게

    // 페인트 효과 (왼쪽에서 오른쪽으로)
    setTimeout(() => {
      // 부드러운 트랜지션 설정
      paintImage.style.transition =
        'clip-path 1000ms cubic-bezier(0.22, 1, 0.36, 1)';
      // 왼쪽에서 오른쪽으로 페인트칠하듯 애니메이션
      paintImage.style.clipPath = 'inset(0 0 0 0)'; // 오른쪽 0% 잘림 (전체 보임)

      // 로고 애니메이션 (페인트 애니메이션이 완료된 후)
      setTimeout(() => {
        // 로고도 같은 페인트칠 효과 사용
        logoImage.style.transition =
          'clip-path 1000ms cubic-bezier(0.22, 1, 0.36, 1)';
        logoImage.style.clipPath = 'inset(0 0 0 0)'; // 전체 이미지가 보이게
      }, 0); // 페인트 애니메이션 시작 후 0ms 후에 로고 애니메이션 시작
    }, 100); // 약간의 지연 후 애니메이션 시작
  }, [showPaintAnimation]); // showPaintAnimation이 true가 될 때 실행

  const handleLogin = (provider: 'google' | 'kakao') => {
    sessionStorage.setItem('provider', provider);
    if (provider === 'google') {
      googleLogin.mutate('google');
    } else {
      kakaoLogin.mutate('kakao');
    }
  };

  // 현재 뷰포트 크기 계산
  // const viewportHeight = typeof window !== 'undefined' ? window.innerHeight : 0;
  // const viewportWidth = typeof window !== 'undefined' ? window.innerWidth : 0;

  // 로고의 초기 위치와 최종 위치 계산 (없으면 기본값)
  // const initialTop = initialLogoPosition
  //   ? initialLogoPosition.top
  //   : viewportHeight / 2;
  // const initialLeft = initialLogoPosition
  //   ? initialLogoPosition.left
  //   : viewportWidth / 2;

  // 로고 크기 계산
  // const initialScale =
  //   initialLogoPosition && movingLogoRef.current
  //     ? initialLogoPosition.width / movingLogoRef.current.offsetWidth || 1
  //     : 1;

  // 페이지가 처음 렌더링될 때 로고의 초기 위치 스타일
  // const initialLogoStyle: React.CSSProperties = initialLogoPosition
  //   ? {
  //       position: 'absolute',
  //       top: initialTop,
  //       left: initialLeft,
  //       transform: `translate(-50%, -50%) scale(${initialScale})`,
  //       zIndex: 50,
  //       opacity: 1,
  //     }
  //   : {};

  return (
    <div className="flex-1 overflow-hidden relative">
      {/* 로고 이동 애니메이션 (홈페이지에서 넘어올 때) */}
      {/* {initialLogoPosition && !animationComplete && (
        <motion.img
          ref={movingLogoRef}
          src={logoImage}
          alt="Moving Logo"
          className="absolute w-auto h-10 z-50 pointer-events-none"
          style={initialLogoStyle}
          animate={{
            top: '50%',
            left: '50%',
            scale: 1,
            transition: { duration: 0.6, ease: 'easeInOut' },
          }}
        />
      )} */}

      <div className="flex flex-col items-center justify-center h-full">
        <div className="w-full flex flex-col items-center mb-20">
          {/* --- 메인 이미지 영역 (상대 위치 지정 및 레이어링) --- */}
          <div className="relative w-full rounded-b-[40px] overflow-hidden">
            {/* 1. 배경 이미지 */}
            <img
              src={loginImage}
              alt="Whiskey tasting background"
              className="w-full object-contain block relative z-10"
            />
            {/* 2. 페인트 이미지 (애니메이션 대상) - 로고 이동 애니메이션 후에만 표시 */}
            <img
              ref={paintImageRef}
              src={paintImage}
              alt="Paint effect"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-auto object-contain z-20 pointer-events-none"
              style={{ opacity: 1 }}
            />
            {/* 3. 로고 이미지 (애니메이션 대상) - 로고 이동 애니메이션 후에만 표시 */}
            <img
              ref={logoImageRef}
              src={logoImage}
              alt="Logo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-auto object-contain z-30 pointer-events-none"
              style={{ opacity: 1 }}
            />
          </div>
          {/* --- 메인 이미지 영역 끝 --- */}
        </div>
        {/* --- 이미지 그룹 끝 --- */}

        {/* --- 버튼 영역 시작 --- */}
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <GoogleButton onClick={() => handleLogin('google')} />
          <KakaoButton onClick={() => handleLogin('kakao')} />
        </div>
        {/* --- 버튼 영역 끝 --- */}
      </div>
    </div>
  );
};

export default Login;
