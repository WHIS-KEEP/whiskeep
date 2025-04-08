import { cn } from '@/lib/util/utils';
import { Card, CardContent } from '../shadcn/card';
import defaultBgImg from '../../assets/whisky_background.png';
// import { useState, useRef } from 'react'; // 로컬 상태 제거
import TastingRadarChart, { TastingProfile } from './Tastingchart';
import HeartButton from './Heart'; // HeartButton 임포트

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
  forceLikedState?: boolean; // forceLikedState prop 정의 추가
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
  forceLikedState, // prop 받기
  ...props
}: WhiskycardProps) {
  return (
    // className="relative" div 제거 (Card가 루트)
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
      <div className="h-[100px] bg-primary-dark rounded-b-[18px] flex items-end justify-between p-2 relative">
        {' '}
        {/* relative 추가 */}
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
