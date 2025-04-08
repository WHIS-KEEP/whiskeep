// src/hooks/useCheckLikeStatus.ts
import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLikedWhiskies,
  LIKES_QUERY_KEY,
  LikedWhisky,
} from '@/lib/api/like'; // API 파일 경로 확인

/**
 * 특정 위스키 ID의 찜 상태를 확인하는 커스텀 훅.
 * 내부적으로 React Query의 캐시된 찜 목록 데이터를 활용합니다.
 *
 * @param whiskyId 확인할 위스키의 ID. null 또는 undefined일 경우 false를 반환합니다.
 * @returns 객체: { isLiked: boolean, isLoading: boolean, isError: boolean }
 *          - isLiked: 해당 위스키의 찜 상태 (true/false)
 *          - isLoading: 찜 목록 데이터를 로딩 중인지 여부
 *          - isError: 찜 목록 데이터를 가져오는 중 에러 발생 여부
 */
export const useCheckLikeStatus = (
  whiskyId: number | undefined | null,
): { isLiked: boolean; isLoading: boolean; isError: boolean } => {
  // useQuery를 사용하여 캐시된 찜 목록 데이터를 가져옵니다.
  const {
    data: likedWhiskiesData,
    isLoading,
    isError,
  } = useQuery<LikedWhisky[], Error>({
    queryKey: [LIKES_QUERY_KEY], // 찜 목록 데이터의 공통 쿼리 키
    queryFn: fetchLikedWhiskies, // 전체 목록을 가져오는 API 함수
    // staleTime을 설정하면 캐시된 데이터가 해당 시간 동안 fresh 상태로 유지->refresh 줄임
  });

  // useMemo를 사용하여 whiskyId 또는 캐시된 데이터가 변경될 때만 찜 상태를 다시 계산합니다.
  const isLiked = useMemo(() => {
    // whiskyId가 없거나, 데이터 로딩 중이거나, 에러가 발생했거나, 데이터가 유효한 배열이 아니면 false 반환
    if (
      !whiskyId ||
      isLoading ||
      isError ||
      !Array.isArray(likedWhiskiesData)
    ) {
      return false;
    }
    // 캐시된 찜 목록 배열(likedWhiskiesData)에서 현재 whiskyId가 있는지 검색합니다.
    return likedWhiskiesData.some((whisky) => whisky.whiskyId === whiskyId);
  }, [whiskyId, likedWhiskiesData, isLoading, isError]); // 의존성 배열 설정

  // 계산된 찜 상태(isLiked)와 로딩/에러 상태를 반환합니다.
  return { isLiked, isLoading, isError };
};
