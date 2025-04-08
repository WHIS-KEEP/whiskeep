import { useQuery, keepPreviousData } from '@tanstack/react-query';
import {
  getWhiskyDetail,
  getWhiskyRecords,
  searchWhiskies,
  WhiskySearchParams,
} from '@/lib/api/whisky';

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

// 위스키 검색 훅
export const useSearchWhiskies = (params: WhiskySearchParams = {}) => {
  return useQuery({
    queryKey: ['searchWhiskies', params],
    queryFn: () => searchWhiskies(params),
    enabled: true,
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터를 신선하게 유지
  });
};
