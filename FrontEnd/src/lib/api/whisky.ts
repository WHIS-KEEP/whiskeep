import api from '@/lib/util/axiosInstance'; // 인증 설정된 axios 인스턴스 사용
import { WhiskyDetail, RecordListResponse } from '@/types/whisky';

// 위스키 상세 정보 조회 API
export const getWhiskyDetail = async (
  whiskyId: number,
): Promise<WhiskyDetail> => {
  const response = await api.get<WhiskyDetail>(`/whiskies/${whiskyId}`);
  return response.data;
};

// 위스키 리뷰 목록 조회 API
export const getWhiskyRecords = async (
  whiskyId: number,
  page = 0,
  size = 3,
): Promise<RecordListResponse> => {
  const response = await api.get<RecordListResponse>(
    `/whiskies/${whiskyId}/records?page=${page}&size=${size}`,
  );
  return response.data;
};

// 위스키 좋아요 토글 API
export const toggleWhiskyLike = async (
  whiskyId: number,
): Promise<{ isLiked: boolean }> => {
  try {
    const response = await api.post<{ isLiked: boolean }>(
      `/whiskies/${whiskyId}/like`,
    );
    return response.data;
  } catch (error) {
    console.error('위스키 좋아요 토글 실패:', error);
    throw error;
  }
};

export const getWhiskyTastingProfile = async (whiskyId: number) => {
  const response = await api.get(`/whiskies/${whiskyId}/score`);
  return response.data;
};
