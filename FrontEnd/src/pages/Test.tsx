import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import Whiskycard from '@/components/ui/Whiskycard';
import Btn from '@/components/ui/Btn';
import { useState } from 'react';
// 테스트용 이미지 import
import testBgImg from '../assets/issac.webp';
import testWhiskyImg from '../assets/sample.png';
import Modal from '@/components/ui/Modal';
const Test = () => {
  // 상태 관리
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 테스트용 정적 데이터
  const testWhiskyData = {
    title: '******위스키 이름******',
    description: '**위스키 설명 또는 가격**',
    bgImage: testBgImg,
    whiskyImage: testWhiskyImg,
  };

  // 버튼 클릭 처리
  const handleButtonClick = async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 테스트용 타임아웃
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.log('테스트 버튼 클릭됨');
    } catch (err) {
      console.error('버튼 액션 중 오류 발생:', err);
      setError('액션 처리에 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        {/* 테스트 페이지입니다. 컴포넌트를 불러와서 기능테스트까지 안전하게 할 수 있게 하기 위함입니다. */}
        {/* 테스트를 통해 기능 변동이나 코드 변동이 있을 시 반영이 쉽도록... */}
        <Modal variant="wishlist" />
        {/* 위스키 카드 */}
        <Whiskycard
          title={testWhiskyData.title}
          description={testWhiskyData.description}
          bgImage={testWhiskyData.bgImage}
          whiskyImage={testWhiskyData.whiskyImage}
        />

        {/* 구글 소셜 로그인 */}
        <GoogleButton />

        {/* 카카오 소셜 로그인 */}
        <KakaoButton onClick={() => console.log('카카오 로그인 클릭')} />

        {/* 버튼 */}
        <Btn
          text={isLoading ? '로딩 중...' : '테스트'}
          size="m"
          color="color-text-muted-40"
          onClick={handleButtonClick}
        />

        {/* 에러 메시지 표시 */}
        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
};

export default Test;
