import { useQuery } from '@tanstack/react-query';
import { getPopularWhiskies } from '@/lib/api/survey';

export const useWhiskiesQuery = () =>
  useQuery({
    queryKey: ['surveyWhiskies'],
    queryFn: getPopularWhiskies,
    staleTime: 1000 * 60 * 10,
  });
