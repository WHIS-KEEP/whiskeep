import { useEffect, useRef } from 'react'; // useEffect, useRef 훅 import
import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from '@/hooks/mutations/useLoginMutations';

import loginImage from '@/assets/login.png';
import logoImage from '@/assets/logo.svg'; // 로고 경로 확인
import paintImage from '@/assets/paint.png'; // paint.png 이미지 경로 추가

const Login = () => {
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

  // --- 애니메이션 대상 요소에 대한 Ref 생성 ---
  const paintImageRef = useRef<HTMLImageElement>(null);
  const logoImageRef = useRef<HTMLImageElement>(null);

  // --- 컴포넌트 마운트 시 애니메이션 실행 ---
  useEffect(() => {
    // JavaScript로 직접 애니메이션 구현
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
        'clip-path 800ms cubic-bezier(0.22, 1, 0.36, 1)';
      // 왼쪽에서 오른쪽으로 페인트칠하듯 애니메이션
      paintImage.style.clipPath = 'inset(0 0 0 0)'; // 오른쪽 0% 잘림 (전체 보임)

      // 로고 애니메이션 (페인트 애니메이션이 완료된 후)
      setTimeout(() => {
        // 로고도 같은 페인트칠 효과 사용
        logoImage.style.transition =
          'clip-path 600ms cubic-bezier(0.22, 1, 0.36, 1)';
        logoImage.style.clipPath = 'inset(0 0 0 0)'; // 전체 이미지가 보이게
      }, 0); // 페인트 애니메이션 시작 후 0ms 후에 로고 애니메이션 시작(0->n으로 변동 시 n ms)
    }, 100); // 약간의 지연 후 애니메이션 시작
  }, []); // 마운트 시 한 번만 실행

  const handleLogin = (provider: 'google' | 'kakao') => {
    sessionStorage.setItem('provider', provider);
    if (provider === 'google') {
      googleLogin.mutate('google');
    } else {
      kakaoLogin.mutate('kakao');
    }
  };

  return (
    <div className="flex-1 overflow-hidden relative">
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
            {/* 2. 페인트 이미지 (애니메이션 대상) */}
            <img
              ref={paintImageRef}
              src={paintImage}
              alt="Paint effect"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-auto object-contain z-20 pointer-events-none"
            />
            {/* 3. 로고 이미지 (애니메이션 대상) */}
            <img
              ref={logoImageRef}
              src={logoImage}
              alt="Logo"
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1/2 h-auto object-contain z-30 pointer-events-none"
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
