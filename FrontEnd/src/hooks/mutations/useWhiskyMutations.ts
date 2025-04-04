import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleWhiskyLike } from '@/lib/api/whisky';

// 위스키 좋아요 토글 뮤테이션 훅
export const useToggleWhiskyLike = (whiskyId: number) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => toggleWhiskyLike(whiskyId),
    onSuccess: () => {
      // 위스키 상세 정보 쿼리 무효화 (좋아요 상태 업데이트를 위해)
      queryClient.invalidateQueries({ queryKey: ['whiskyDetail', whiskyId] });
    },
  });
};