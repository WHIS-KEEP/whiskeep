import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { getWhiskyDetail, getWhiskyRecords } from '@/lib/api/whisky';

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
    queryFn: () => getWhiskyRecords(whiskyId, page - 1, 3),
    enabled: !!whiskyId,
    placeholderData: keepPreviousData,
  });
};
