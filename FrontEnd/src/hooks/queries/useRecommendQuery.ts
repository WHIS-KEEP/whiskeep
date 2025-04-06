import { useQuery } from '@tanstack/react-query';
import { getRecommendations } from '@/lib/api/recommend';

export const useRecommendQuery = () => {
  return useQuery({
    queryKey: ['recommendations'],
    queryFn: getRecommendations,
    enabled: false, // PreferenceCompletePage에서 수동으로 refetch
    retry: false,
  });
};
