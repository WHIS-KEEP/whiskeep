import API from '@/lib/util/axiosInstance';
import { handleError } from '@/lib/util/error';

/**
 * 백엔드 /likes 엔드포인트에서 반환하는 위스키 객체 타입
 */
export interface LikedWhisky {
  whiskyId: number;
  koName: string;
  whiskyImg: string;
  abv: number;
}

// GET /likes 요청의 응답 타입
interface LikesApiResponse {
  whiskies: LikedWhisky[];
}

// React Query에서 사용할 쿼리 키
export const LIKES_QUERY_KEY = 'likes';

// 찜한 위스키 목록 전체 가져오기
export const fetchLikedWhiskies = async (): Promise<LikedWhisky[]> => {
  try {
    // 실제 응답 구조인 LikesApiResponse 타입으로 응답을 기대
    const response = await API.get<LikesApiResponse>('/likes');
    // 실제 응답 구조에 맞게 'whiskies' 배열을 직접 반환
    // response.data 와 response.data.whiskies 가 존재하는지 확인 (안전성)
    if (response.data && Array.isArray(response.data.whiskies)) {
      return response.data.whiskies;
    } else {
      // 예상치 못한 구조일 경우 경고 로그 및 빈 배열 반환
      return [];
    }
  } catch (error: unknown) {
    handleError(error);
    return []; // 에러 발생 시 빈 배열 반환
  }
};

// 찜 추가
export const addToLikes = async (whiskyId: number): Promise<boolean> => {
  try {
    // 백엔드 엔드포인트에 맞게 /{whiskyId}/likes 로 POST 요청
    const response = await API.post(`/${whiskyId}/likes`);
    // 성공 응답 상태 코드 확인 (백엔드 구현에 따라 200 또는 201)
    return response.status === 200 || response.status === 201;
  } catch (error: unknown) {
    handleError(error);
    return false;
  }
};

// 찜 삭제
export const removeFromLikes = async (whiskyId: number): Promise<boolean> => {
  try {
    // 백엔드 엔드포인트에 맞게 /{whiskyId}/likes 로 DELETE 요청
    const response = await API.delete(`/${whiskyId}/likes`);
    // 성공 응답 상태 코드 확인 (백엔드 구현에 따라 200 또는 204 No Content)
    return response.status === 200 || response.status === 204;
  } catch (error: unknown) {
    handleError(error);
    return false;
  }
};

// 찜 상태 토글
export const toggleLike = async (
  whiskyId: number,
  isLiked: boolean,
): Promise<boolean> => {
  if (isLiked) {
    return removeFromLikes(whiskyId);
  } else {
    return addToLikes(whiskyId);
  }
};
