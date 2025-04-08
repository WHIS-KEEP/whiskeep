// hooks/mutations/useSearchMutation.ts
import { postSearchWhiskies, SearchRequest } from '@/lib/api/search';
import { useMutation } from '@tanstack/react-query';

export const useSearchMutation = () => {
  return useMutation({
    mutationFn: (payload: SearchRequest) => postSearchWhiskies(payload),
  });
};
