import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getWhiskyDetail, getWhiskyRecords, toggleWhiskyLike } from '@/lib/api/whisky';

// 위스키 상세 정보 조회 훅
export const useWhiskyDetail = (whiskyId: number) => {
  return useQuery({
    queryKey: ['whiskyDetail', whiskyId],
    queryFn: () => getWhiskyDetail(whiskyId),
    enabled: !!whiskyId,
  });
};

// 위스키 리뷰 목록 조회 훅
export const useWhiskyRecords = (whiskyId: number, page: number = 1) => {
  return useQuery({
    queryKey: ['whiskyRecords', whiskyId, page],
    queryFn: () => getWhiskyRecords(whiskyId, page),
    enabled: !!whiskyId,
    // keepPreviousData: true,
  });
};

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