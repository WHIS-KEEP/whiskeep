import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from 'recharts';
import useTastingProfile from '@/hooks/queries/useTastingProfile';

// 테이스팅 프로필 속성 인터페이스 정의
export interface TastingProfile {
  fruityScore: number;
  sweetScore: number;
  spicyScore: number;
  oakyScore: number;
  herbalScore: number;
  brinyScore: number;
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
const formatChartData = (profile: TastingProfile) => {
  return [
    {
      subject: '달콤함',
      value: profile.sweetScore * 20, // 0-5 스케일을 0-100으로 변환
      fullMark: 100,
    },
    {
      subject: '매움',
      value: profile.spicyScore * 20,
      fullMark: 100,
    },
    {
      subject: '과일향',
      value: profile.fruityScore * 20,
      fullMark: 100,
    },
    {
      subject: '오크향',
      value: profile.oakyScore * 20,
      fullMark: 100,
    },
    {
      subject: '허브',
      value: profile.herbalScore * 20,
      fullMark: 100,
    },
    {
      subject: '브라이니',
      value: profile.brinyScore * 20,
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
  // 직접 프로필이 제공되면 그것을 사용하고, 아니면 커스텀 훅을 통해 API에서 데이터를 가져옴
  const { data: fetchedProfile } = useTastingProfile(
    providedProfile ? undefined : whiskyId,
  );

  // 사용할 프로필 결정 (제공된 프로필 > 가져온 프로필 > 기본값)
  const profile = providedProfile ||
    fetchedProfile || {
      fruityScore: 3.0,
      sweetScore: 2.5,
      spicyScore: 3.8,
      oakyScore: 2.0,
      herbalScore: 2.5,
      brinyScore: 1.0,
    };

  // 차트 데이터 준비
  const chartData = formatChartData(profile);

  return (
    <div className={className} style={{ width, height }}>
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart cx="50%" cy="50%" outerRadius="75%" data={chartData}>
          <PolarGrid />
          <PolarAngleAxis
            dataKey="subject"
            tick={{ fontSize: 10, fill: '#FFFFFF' }}
          />
          <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} />
          <Radar
            name="테이스팅 프로필"
            dataKey="value"
            stroke="#F9B233"
            fill="#F9B233"
            fillOpacity={0.65}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default TastingRadarChart;
