import { useMutation } from '@tanstack/react-query';
import { postFamiliarSurvey } from '@/lib/api/survey';

export const useSubmitSurveyMutation = () =>
  useMutation({
    mutationFn: postFamiliarSurvey,
  });
