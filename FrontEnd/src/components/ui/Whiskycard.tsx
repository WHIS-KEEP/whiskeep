import { cn } from '@/lib/util/utils';
// import { Heart } from 'lucide-react'; // 제거
import { Card, CardContent } from '../shadcn/card';
import defaultBgImg from '../../assets/issac.webp';
import defaultWhiskyImg from '../../assets/sample.png';
// import { useState, useRef, useEffect } from 'react'; // 제거 (또는 다른 곳에서 사용하지 않으면)
import TastingRadarChart, { TastingProfile } from './Tastingchart';
// import { useCheckLikeStatus } from '@/hooks/mutations/useCheckLikeMutation'; // 제거
// import { useToggleLikeMutation } from '@/hooks/mutations/useToggleLikeMutation'; // 제거
import LikeButton from './Heart'; // 새로 만든 컴포넌트 임포트

// Props 인터페이스 정의
interface WhiskycardProps extends React.ComponentProps<typeof Card> {
  title: string;
  description: string;
  bgImage?: string;
  whiskyImage?: string;
  showLikeButton?: boolean;
  showChart?: boolean;
  whiskyId?: number;
  tastingProfile?: TastingProfile;
}

export function Whiskycard({
  className,
  title,
  description,
  bgImage = defaultBgImg,
  whiskyImage = defaultWhiskyImg,
  showLikeButton = true,
  showChart = true,
  whiskyId,
  tastingProfile,
  ...props
}: WhiskycardProps) {
  // --- 기존 하트 관련 로직 제거 ---
  // const { isLiked, isLoading } = useCheckLikeStatus(whiskyId);
  // const toggleLikeMutation = useToggleLikeMutation();
  // const [localLiked, setLocalLiked] = useState(false);
  // const heartRef = useRef<SVGSVGElement>(null);
  // useEffect(() => { ... }, [isLiked, isLoading]);
  // const handleLikeClick = (e: React.MouseEvent) => { ... };
  // const heartClasses = cn(...);
  // const buttonClasses = ...;
  // --- 제거 완료 ---

  return (
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
          className="opacity-50 absolute top-0 left-0 w-full h-full overflow-hidden"
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
      <div className="absolute top-9/20 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src={whiskyImage}
          alt="whisky"
          className="w-[150px] h-[150px] object-cover"
        />
      </div>

      {/* 카드 아랫부분 */}
      <div className="h-[100px] bg-primary-dark rounded-b-[18px] flex items-end justify-between p-2 relative">
        {' '}
        {/* relative 추가 */}
        <div className="p-1.5 w-full">
          <div className="space-y-2">
            <p className="text-sm max-w-[150px] font-medium leading-none text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {title}
            </p>
            <p className="text-xs max-w-[123px] text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {description}
            </p>
          </div>
        </div>
        {/* LikeButton 컴포넌트 사용 */}
        {showLikeButton &&
          whiskyId && ( // whiskyId가 있을 때만 렌더링
            <LikeButton whiskyId={whiskyId} />
          )}
      </div>
    </Card>
  );
}

export default Whiskycard;
