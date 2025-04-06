import { getRecommendations } from '@/lib/api/recommend';
import { useQuery } from '@tanstack/react-query';

interface UseRecommendQueryOptions {
  enabled?: boolean;
}

export const useRecommendQuery = ({
  enabled = true,
}: UseRecommendQueryOptions = {}) => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
    enabled, // 호출하는 쪽에서 자동 여부 결정
    retry: false,
  });
};
