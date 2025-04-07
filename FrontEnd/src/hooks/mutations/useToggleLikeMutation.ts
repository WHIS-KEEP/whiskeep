// FrontEnd/src/hooks/mutations/useToggleLikeMutation.ts
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toggleLike, LIKES_QUERY_KEY } from '@/lib/api/like'; // API 및 쿼리 키 import
// import { useCheckLikeStatus } from './useCheckLikeStatus'; // 필요한 경우 import

/**
 * 위스키 찜 상태를 토글하는 뮤테이션 훅.
 * 성공 시 찜 목록 캐시를 무효화합니다.
 */
export const useToggleLikeMutation = () => {
  const queryClient = useQueryClient();

  // 뮤테이션 정의
  return useMutation({
    mutationFn: ({
      whiskyId,
      isCurrentlyLiked,
    }: {
      whiskyId: number;
      isCurrentlyLiked: boolean;
    }) => toggleLike(whiskyId, isCurrentlyLiked), // like.ts의 toggleLike 함수 사용

    // 뮤테이션 성공 시
    onSuccess: () => {
      // 찜 목록 캐시 무효화하여 최신 상태 반영
      queryClient.invalidateQueries({ queryKey: [LIKES_QUERY_KEY] });
    },
  });
};
