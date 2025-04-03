// hooks/mutations/useSubmitSurveyMutation.ts
import { useMutation } from '@tanstack/react-query';
import API from '@/lib/util/axiosInstance';

interface FamiliarSurveyRequest {
  experience: 'familiar';
  likedWhiskies: number[];
}

export const useSubmitSurveyMutation = () => {
  return useMutation({
    mutationFn: (selectedIds: number[]) => {
      const request: FamiliarSurveyRequest = {
        experience: 'familiar',
        likedWhiskies: selectedIds,
      };
      return API.post('/members/preference/familiar', request);
    },
  });
};
