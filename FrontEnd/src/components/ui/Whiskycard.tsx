import { cn } from '@/lib/util/utils';
import { Card, CardContent } from '../shadcn/card';
import defaultBgImg from '../../assets/whisky_background.png';
import HeartButton from './Heart';
import TastingRadarChart, { TastingProfile } from './TastingRadarChart';

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
        'w-[280px] h-[400px] rounded-[24px] overflow-hidden relative p-0 py-0 gap-0 flex flex-col',
        className,
      )}
      {...props}
    >
      {/* 카드 윗부분 - 상단 여백 제거 */}
      <CardContent className="p-0 m-0 h-[300px] relative overflow-visible">
        {/* 하얀색 배경 레이어 */}
        <div className="absolute top-0 left-0 w-full h-[320px] rounded-br-[28px] bg-white"></div>
        {/* 명화 레이어 깎기 (clip-path 적용 - 곡선) */}
        <div
          className="opacity-70 absolute top-0 left-0 w-full h-[320px] overflow-hidden"
          style={{ clipPath: 'inset(0 0 0 0 round 0 0 70px 0)' }}
        >
          <img
            src={bgImage}
            alt="bgimg"
            className="absolute top-0 left-0 w-full h-full object-cover object-center"
          />
        </div>
        {/* Radar Chart를 우측 상단에 배치 */}
        {showChart && (
          <div className="absolute right-10 w-[100px] h-[100px] z-20">
            <TastingRadarChart
              whiskyId={whiskyId}
              profile={tastingProfile}
              width="150px"
              height="150px"
              showTabs={false}
              showLegend={false}
              showLabels={false}
              // className="bg-bg/70 rounded-full scale-75"
            />
          </div>
        )}
      </CardContent>

      {/* 중앙에 배치할 이미지 - 위치를 더 위로 조정 */}
      <div className="absolute top-[80px] left-1/2 -translate-x-1/2 z-10">
        <img
          src={whiskyImage}
          alt="whisky"
          className="w-[220px] h-[220px] object-cover"
        />
      </div>

      {/* 카드 아랫부분 - 상단 마진 감소 */}
      <div className="h-[150px] bg-primary-dark rounded-b-[24px] flex items-center justify-between p-4 relative mt-[30px]">
        <div className="px-2 w-full">
          <div className="space-y-3">
            <p className="text-lg mb-0.5 md:text-xl max-w-[220px] font-medium leading-tight text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {koName}
            </p>
            <p className="text-base md:text-lg max-w-[220px] font-medium leading-tight text-white overflow-hidden whitespace-nowrap text-ellipsis">
              {enName}
            </p>
            <p className="text-sm -mb-8 max-w-[220px] text-white overflow-hidden whitespace-nowrap text-ellipsis">
              <span>{type}</span> | <span>{abv} %</span>
            </p>
          </div>
        </div>
        {/* HeartButton 사용 및 forceLikedState 전달 */}
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
