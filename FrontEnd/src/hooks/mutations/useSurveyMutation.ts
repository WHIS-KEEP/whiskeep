import { useMutation } from '@tanstack/react-query';
import {
  BeginnerSurveyRequest,
  postBeginnerSurvey,
  postFamiliarSurvey,
} from '@/lib/api/survey';

export const useSubmitSurveyMutation = () =>
  useMutation({
    mutationFn: postFamiliarSurvey,
  });

export const useBeginnerSurveyMutation = () => {
  return useMutation({
    mutationFn: (data: BeginnerSurveyRequest) => postBeginnerSurvey(data),
  });
};
