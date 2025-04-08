import { cn } from '@/lib/util/utils';
import { Heart } from 'lucide-react';
import { Card, CardContent } from '../shadcn/card';
import defaultBgImg from '../../assets/whisky_background.png';
import { useState, useRef } from 'react';
import TastingRadarChart, { TastingProfile } from './Tastingchart';

// Props 인터페이스 정의
interface WhiskycardProps extends React.ComponentProps<typeof Card> {
  koName: string;
  enName?: string; // 영어이름 (선택적)
  type?: string; // 위스키 타입 (선택적)
  abv: number; // 알콜 도수
  bgImage?: string; // 배경 이미지 URL (선택적)
  whiskyImage: string; // 위스키 이미지 URL (선택적)
  showLikeButton?: boolean; // 하트 버튼 표시 여부 (선택적)
  showChart?: boolean; // 차트 표시 여부 (선택적)
  whiskyId?: number; // 위스키 ID (차트 데이터를 가져오기 위함)
  tastingProfile?: TastingProfile; // 테이스팅 프로필 (선택적, 직접 제공할 경우)
}

export function Whiskycard({
  className,
  koName,
  enName,
  type,
  abv,
  bgImage = defaultBgImg, // 기본값으로 에셋 이미지 사용
  whiskyImage, // 기본값으로 에셋 이미지 사용
  showLikeButton = true, // 기본값은 하트 버튼 표시
  showChart = true, // 기본값은 차트 표시
  whiskyId,
  tastingProfile,
  ...props
}: WhiskycardProps) {
  const [isLiked, setIsLiked] = useState(false); // 찜 상태를 관리하는 state
  const heartRef = useRef<SVGSVGElement>(null); // Heart 컴포넌트에 대한 ref

  const handleLikeClick = () => {
    if (heartRef.current) {
      if (!isLiked) {
        heartRef.current.classList.add('animate-like-in');
        heartRef.current.classList.remove('animate-like-out');
      } else {
        heartRef.current.classList.add('animate-like-out');
        heartRef.current.classList.remove('animate-like-in');
      }
      setTimeout(() => {
        if (heartRef.current) {
          heartRef.current.classList.remove('animate-like-in');
          heartRef.current.classList.remove('animate-like-out');
        }
        setIsLiked(!isLiked); // 찜 상태를 토글 (애니메이션 후)
      }, 150); // 애니메이션 지속 시간과 동일하게 설정
    } else {
      setIsLiked(!isLiked); // ref가 없을 경우 즉시 상태 토글
    }
  };

  const heartClasses = cn(
    'size-3 text-red-500 transition-all duration-150', // Transition for color change
  );

  const buttonClasses =
    'absolute bottom-2 right-2 object-cover object-top w-[24px] h-[24px] rounded-full flex justify-center items-center bg-white shadow-lg border-none outline-none cursor-pointer';

  return (
    <div className="relative">
      {/* 카드 전체를 flex-col로 만들어 내부 요소들을 세로로 배치 */}
      <Card
        className={cn(
          'w-[180px] h-[260px] rounded-[18px] overflow-hidden relative p-0 py-0 gap-0 flex flex-col',
          className,
        )}
        {...props}
      >
        {/* 카드 윗부분 */}
        <CardContent className="p-0 m-0 h-[160px] relative overflow-hidden">
          {/* 하얀색 배경 레이어 for 명화 레이어 깎기 */}
          <div className="absolute top-0 left-0 w-full h-full rounded-br-[18px] bg-white"></div>
          {/* 명화 레이어 깎기 (clip-path 적용 - 곡선) */}
          <div
            className="opacity-70 absolute top-0 left-0 w-full h-full overflow-hidden"
            style={{ clipPath: 'inset(0 0 0 0 round 0 0 50px 0)' }}
          >
            <img
              src={bgImage}
              alt="bgimg"
              className="absolute top-0 left-0 w-full h-full object-cover object-top"
            />
          </div>
          {/* Radar Chart를 우측 상단에 배치 */}
          {showChart && (
            <div className="absolute bottom-26 left-29 w-[60px] h-[60px]">
              <TastingRadarChart
                whiskyId={whiskyId}
                profile={tastingProfile}
                width="60px"
                height="60px"
              />
            </div>
          )}
        </CardContent>

        {/* 중앙에 배치할 이미지 */}
        <div className="absolute top-8/20 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <img
            src={whiskyImage}
            alt="whisky"
            className="w-[150px] h-[150px] object-cover"
          />
        </div>

        {/* 카드 아랫부분 */}
        <div className="h-[100px] bg-primary-dark rounded-b-[18px] flex items-end justify-between p-2">
          <div className="p-1.5 w-full">
            <div className="space-y-2 mt-1">
              <p className="text-sm max-w-[150px] font-medium leading-none text-white overflow-hidden whitespace-nowrap text-ellipsis">
                {koName}
              </p>
              <p className="text-xs max-w-[150px] font-medium leading-none text-white overflow-hidden whitespace-nowrap text-ellipsis">
                {enName}
              </p>
              <p className="text-xs max-w-[150px] text-white overflow-hidden whitespace-nowrap text-ellipsis">
                <span>{type}</span> | <span>{abv} %</span>
              </p>
            </div>
          </div>
          {/* 하트 버튼 (showLikeButton이 true일 때만 표시) */}
          {showLikeButton && (
            <button onClick={handleLikeClick} className={buttonClasses}>
              <Heart
                ref={heartRef}
                className={heartClasses}
                fill={isLiked ? 'red' : 'white'}
              />{' '}
              {/* 찜 상태에 따라 fill 색상 변경 */}
            </button>
          )}
        </div>
      </Card>
    </div>
  );
}

export default Whiskycard;
