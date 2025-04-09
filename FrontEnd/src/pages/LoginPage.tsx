import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from '@/hooks/mutations/useLoginMutations';

import loginImage from '@/assets/login.png';
import logoImage from '@/assets/logo.svg'; // 로고 경로 확인

const Login = () => {
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

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
      {/* 메인 컨텐츠 영역: 전체 높이 사용, 내부 아이템 수직/수평 중앙 정렬 */}
      <div className="flex flex-col items-center justify-center h-full">
        {/* --- 로고 + 이미지 그룹 시작 (이 부분이 애니메이션 대상) --- */}
        {/* 이 그룹 자체의 너비와 정렬을 설정합니다. 버튼과 동일하게 max-w-sm 적용 */}
        <div className="w-full flex flex-col items-center mb-20">
          {' '}
          {/* 그룹 아래 여백 추가 */}
          {/* --- 로고 영역 시작 --- */}
          <div className="mb-35 mt-70 flex justify-center w-full">
            {' '}
            {/* 로고와 이미지 간격 */}
            <img src={logoImage} alt="App Logo" className="h-12 w-auto" />
          </div>
          {/* --- 로고 영역 끝 --- */}
          {/* --- 메인 이미지 영역 시작 --- */}
          {/* 이미지 자체의 아래 여백(mb)은 제거하고, 그룹 전체의 mb로 간격 관리 */}
          <div className="w-full rounded-b-[40px] overflow-hidden">
            <img
              src={loginImage}
              alt="Whiskey tasting"
              className="w-full object-contain block"
            />
          </div>
          {/* --- 메인 이미지 영역 끝 --- */}
        </div>
        {/* --- 로고 + 이미지 그룹 끝 --- */}

        {/* --- 버튼 영역 시작 (별도 영역) --- */}
        {/* 버튼 영역의 너비와 정렬을 설정합니다. 로고/이미지 그룹과 동일하게 max-w-sm 적용 */}
        {/* 그룹과의 간격은 위 그룹의 mb-12로 조절했으므로 mt는 제거하거나 작은 값(예: mt-4)으로 설정 가능 */}
        <div className="flex flex-col items-center gap-8 w-full max-w-sm">
          <GoogleButton onClick={() => handleLogin('google')} />
          <KakaoButton onClick={() => handleLogin('kakao')} />
        </div>
        {/* --- 버튼 영역 끝 --- */}
      </div>
      {/* 메인 컨텐츠 영역 끝 */}
    </div>
  );
};

export default Login;
