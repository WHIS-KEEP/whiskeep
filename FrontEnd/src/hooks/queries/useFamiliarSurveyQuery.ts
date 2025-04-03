// hooks/querys/useWhiskiesQuery.ts
import API from '@/lib/util/axiosInstance';
import { useQuery } from '@tanstack/react-query';

export interface SurveyWhisky {
  whiskyId: number;
  koName: string;
  whiskyImg: string;
}

const fetchWhiskies = async (): Promise<SurveyWhisky[]> => {
  const { data } = await API.get('/members/popular-whiskies'); // 실제 API 경로로 수정
  return data;
};

export const useWhiskiesQuery = () => {
  return useQuery<SurveyWhisky[]>({
    queryKey: ['surveyWhiskies'],
    queryFn: fetchWhiskies,
    staleTime: 1000 * 60 * 10, // 10분 캐시
  });
};
