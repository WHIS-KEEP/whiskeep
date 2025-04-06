// hooks/queries/useUserScoreQuery.ts
import { getUserScore } from '@/lib/api/member';
import { useQuery } from '@tanstack/react-query';

export const useMemberScoreQuery = () => {
  return useQuery({
    queryKey: ['user', 'score'],
    queryFn: getUserScore,
    retry: false,
    enabled: false,
    staleTime: 1000 * 60 * 5, // 5분 간 fresh
  });
};
