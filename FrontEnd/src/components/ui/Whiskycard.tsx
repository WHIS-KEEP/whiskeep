import { cn } from '@/lib/util/utils';
import { Card, CardContent } from '../shadcn/card';
import defaultBgImg from '../../assets/whisky_background.png';
import TastingRadarChart, { TastingProfile } from './Tastingchart';
import HeartButton from './Heart';

// Props 인터페이스 정의
interface WhiskycardProps extends React.ComponentProps<typeof Card> {
  koName: string;
  enName?: string;
  type?: string;
  abv: number;
  bgImage?: string;
  whiskyImage?: string;
  showLikeButton?: boolean;
  showChart?: boolean;
  whiskyId?: number;
  tastingProfile?: TastingProfile;
  forceLikedState?: boolean;
}

export function Whiskycard({
  className,
  koName,
  enName,
  type,
  abv,
  bgImage = defaultBgImg,
  whiskyImage,
  showLikeButton = true,
  showChart = true,
  whiskyId,
  tastingProfile,
  forceLikedState,
  ...props
}: WhiskycardProps) {
  return (
    <Card
      className={cn(
        'w-[240px] h-[340px] rounded-[22px] overflow-hidden relative p-0 py-0 gap-0 flex flex-col',
        className,
      )}
      {...props}
    >
      {/* 카드 윗부분 - 높이 증가 */}
      <CardContent className="p-0 m-0 h-[210px] relative overflow-hidden">
        {/* 하얀색 배경 레이어 */}
        <div className="absolute top-0 left-0 w-full h-full rounded-br-[24px] bg-white"></div>
        {/* 명화 레이어 깎기 (clip-path 적용 - 곡선) */}
        <div
          className="opacity-70 absolute top-0 left-0 w-full h-full overflow-hidden"
          style={{ clipPath: 'inset(0 0 0 0 round 0 0 60px 0)' }}
        >
          <img
            src={bgImage}
            alt="bgimg"
            className="absolute top-0 left-0 w-full h-full object-cover object-top"
          />
        </div>
        {/* Radar Chart를 우측 상단에 배치 - 크기 증가 */}
        {showChart && (
          <div className="absolute bottom-32 left-36 w-[80px] h-[80px]">
            <TastingRadarChart
              whiskyId={whiskyId}
              profile={tastingProfile}
              width="80px"
              height="80px"
            />
          </div>
        )}
      </CardContent>

      {/* 중앙에 배치할 이미지 - 크기 증가 */}
      <div className="absolute top-8/20 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
        <img
          src={whiskyImage}
          alt="whisky"
          className="w-[180px] h-[180px] object-cover"
        />
      </div>

      {/* 카드 아랫부분 - 높이 증가, 패딩 증가 */}
      <div className="h-[130px] bg-primary-dark rounded-b-[22px] flex items-end justify-between p-3 relative">
        <div className="p-2 w-full">
          <div className="space-y-2 mt-2">
            <p className="text-base md:text-lg max-w-[200px] font-medium leading-tight text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {koName}
            </p>
            <p className="text-sm md:text-base max-w-[200px] font-medium leading-tight text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {enName}
            </p>
            <p className="text-sm max-w-[200px] text-white overflow-hidden whitespace-nowrap text-ellipsis">
              <span>{type}</span> | <span>{abv} %</span>
            </p>
          </div>
        </div>
        {/* HeartButton 사용 및 forceLikedState 전달 - 크기 증가 */}
        {showLikeButton && whiskyId && (
          <HeartButton
            className="mb-8 absolute right-2 top-2 "
            whiskyId={whiskyId}
            forceLikedState={forceLikedState} // 전달
          />
        )}
      </div>
    </Card>
  );
}

export default Whiskycard;