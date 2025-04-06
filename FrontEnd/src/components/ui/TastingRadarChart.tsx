import { useState } from 'react';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend,
} from 'recharts';
// import useMemberTastingProfile from '@/hooks/queries/useMemberTastingProfile';
import useWhiskyTastingProfile from '@/hooks/queries/useWhiskyTastingProfile';

// 테이스팅 프로필 타입 정의
export type ProfileType = 'nosing' | 'tasting' | 'finish';

// 테이스팅 프로필 속성 인터페이스 정의
export interface TasteScore {
  fruityScore: number;
  sweetScore: number;
  spicyScore: number;
  oakyScore: number;
  herbalScore: number;
  brinyScore: number;
}

export interface TastingProfile {
  nosing: TasteScore;
  tasting: TasteScore;
  finish: TasteScore;
}

// 컴포넌트 Props 인터페이스 정의
interface TastingRadarChartProps {
  whiskyId?: number;
  width?: string | number;
  height?: string | number;
  className?: string;
  profile?: TastingProfile; // 직접 프로필 데이터를 전달할 경우
}

// 차트 데이터 포맷 변환 함수
const formatChartData = (whiskyProfile: TasteScore) => {
  return [
    {
      subject: '달콤',
      whisky: whiskyProfile.sweetScore * 20, // 0-5 스케일을 0-100으로 변환
      fullMark: 100,
    },
    {
      subject: '매움',
      whisky: whiskyProfile.spicyScore * 20,
      fullMark: 100,
    },
    {
      subject: '과일',
      whisky: whiskyProfile.fruityScore * 20,
      fullMark: 100,
    },
    {
      subject: '오크',
      whisky: whiskyProfile.oakyScore * 20,
      fullMark: 100,
    },
    {
      subject: '허브',
      whisky: whiskyProfile.herbalScore * 20,
      fullMark: 100,
    },
    {
      subject: '바다',
      whisky: whiskyProfile.brinyScore * 20,
      fullMark: 100,
    },
  ];
};

export function TastingRadarChart({
  whiskyId,
  width = '100%',
  height = '100%',
  className = '',
  profile: providedProfile,
}: TastingRadarChartProps) {
  // 현재 선택된 프로필 타입 (기본값: tasting)
  const [activeProfile, setActiveProfile] = useState<ProfileType>('tasting');

  // 커스텀 훅을 사용하여 위스키 테이스팅 프로필 데이터만 가져오기
  const { data: whiskyProfile, isLoading } = useWhiskyTastingProfile(whiskyId);

  // 사용할 위스키 프로필 결정 (제공된 프로필 > 가져온 프로필 > 기본값)
  const whiskeyData = providedProfile || whiskyProfile;

  // whiskeyData가 존재할 때만 차트 데이터 표시
  if (!whiskeyData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <p className="text-sm text-gray-600">데이터를 불러올 수 없습니다.</p>
      </div>
    );
  }
  // 현재 선택된 프로필 가져오기
  const currentWhiskyProfile = whiskeyData[activeProfile];

  // 차트 데이터 준비 (위스키 프로필만 표시)
  const chartData = formatChartData(currentWhiskyProfile);

  // 선택된 프로필 타입 변경
  const handleProfileTypeChange = (type: ProfileType) => {
    setActiveProfile(type);
  };

  return (
    <div className={className} style={{ width, height }}>
      {/* 프로필 타입 선택 탭 - 검정색 텍스트로 변경 */}
      <div className="flex justify-between items-center text-xs text-gray-600 mb-2 border-b border-gray-300 pb-1">
        <button
          className={`px-2 py-1 ${activeProfile === 'nosing' ? 'text-primary-dark font-bold' : ''}`}
          onClick={() => handleProfileTypeChange('nosing')}
        >
          Nosing
        </button>
        <span className="text-gray-400">|</span>
        <button
          className={`px-2 py-1 ${activeProfile === 'tasting' ? 'text-primary-dark font-bold' : ''}`}
          onClick={() => handleProfileTypeChange('tasting')}
        >
          Tasting
        </button>
        <span className="text-gray-400">|</span>
        <button
          className={`px-2 py-1 ${activeProfile === 'finish' ? 'text-primary-dark font-bold' : ''}`}
          onClick={() => handleProfileTypeChange('finish')}
        >
          Finish
        </button>
      </div>

      {/* 차트 컨테이너 */}
      {isLoading ? (
        <div className="flex items-center justify-center w-full h-full">
          <p className="text-sm text-gray-600">차트 로딩 중...</p>
        </div>
      ) : (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="70%" data={chartData}>
            <PolarGrid stroke="rgba(255, 255, 255, 0.3)" />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10, fill: '#333333' }} // 글씨만 검정색으로
              stroke="rgba(255, 255, 255, 0.5)"
            />
            <PolarRadiusAxis
              angle={30}
              domain={[0, 100]}
              tick={false}
              axisLine={false}
              stroke="rgba(255, 255, 255, 0)"
            />
            {/* 위스키 프로필 레이더 */}
            <Radar
              name="위스키"
              dataKey="whisky"
              stroke="#F9B233"
              fill="#F9B233"
              fillOpacity={0.65}
            />
            <Legend
              iconSize={10}
              wrapperStyle={{ fontSize: '10px', color: '#333333' }}
              formatter={(value) => (
                <span style={{ color: '#333333' }}>{value}</span>
              )}
            />
          </RadarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
}

export default TastingRadarChart;
