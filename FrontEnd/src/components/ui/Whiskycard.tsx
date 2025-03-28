import { cn } from '@/lib/util/utils';
import { Heart } from 'lucide-react';
import { Card, CardContent } from './card';
import defaultBgImg from '../../assets/issac.webp';
import defaultWhiskyImg from '../../assets/sample.png';
import { useState, useRef } from 'react'; // useRef 추가
import React, { PureComponent } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';

const data = [
  {
    subject: 'Sweet',
    A: 120,
    B: 110,
    fullMark: 150,
  },
  {
    subject: 'Smoky',
    A: 98,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Fruity',
    A: 86,
    B: 130,
    fullMark: 150,
  },
  {
    subject: 'Body',
    A: 99,
    B: 100,
    fullMark: 150,
  },
  {
    subject: 'Spice',
    A: 85,
    B: 90,
    fullMark: 150,
  },
  {
    subject: 'Floral',
    A: 65,
    B: 85,
    fullMark: 150,
  },
];

// Props 인터페이스 정의
interface WhiskycardProps extends React.ComponentProps<typeof Card> {
  title: string;
  description: string;
  bgImage?: string; // 배경 이미지 URL (선택적)
  whiskyImage?: string; // 위스키 이미지 URL (선택적)
}

class Example extends PureComponent {
  render() {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={false} />
          <PolarRadiusAxis angle={30} domain={[0, 150]} tick={false} />
          <Radar
            name="A"
            dataKey="A"
            stroke="#F9B233"
            fill="#F9B233"
            fillOpacity={0.85}
          />
          <Radar
            name="B"
            dataKey="B"
            stroke="9C723E"
            fill="#9C723E"
            fillOpacity={0.55}
          />
        </RadarChart>
      </ResponsiveContainer>
    );
  }
}

export function Whiskycard({
  className,
  title,
  description,
  bgImage = defaultBgImg, // 기본값으로 에셋 이미지 사용
  whiskyImage = defaultWhiskyImg, // 기본값으로 에셋 이미지 사용
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
          'w-[170px] h-[260px] rounded-[18px] overflow-hidden relative p-0 py-0 gap-0 flex flex-col',
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
          <div className="absolute bottom-26 left-29 w-[60px] h-[60px]">
            <Example />
          </div>
        </CardContent>

        {/* 중앙에 배치할 이미지 */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <img
            src={whiskyImage}
            alt="whisky"
            className="w-[150px] h-[150px] object-cover"
          />
        </div>

        {/* 카드 아랫부분 */}
        <div className="h-[100px] bg-primary-dark rounded-b-[18px] flex items-end justify-between p-2">
          <div className="p-1.5 w-full">
            <div className="space-y-2">
              <p className="text-sm max-w-[150px] font-medium leading-none text-white overflow-hidden whitespace-nowrap text-ellipsis">
                {title} {/* props로 받은 title 사용 */}
              </p>
              <p className="text-xs max-w-[123px] text-white overflow-hidden whitespace-nowrap text-ellipsis">
                {description} {/* props로 받은 description 사용 */}
              </p>
            </div>
          </div>
          {/* 하얀 원과 하트를 묶어서 클릭 이벤트 처리 */}
          <button onClick={handleLikeClick} className={buttonClasses}>
            <Heart
              ref={heartRef}
              className={heartClasses}
              fill={isLiked ? 'red' : 'white'}
            />{' '}
            {/* 찜 상태에 따라 fill 색상 변경 */}
          </button>
        </div>
      </Card>
    </div>
  );
}

export default Whiskycard;
