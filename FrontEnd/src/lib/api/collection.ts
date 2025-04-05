import API from '@/lib/util/axiosInstance';
import { handleError } from '@/lib/util/error'; // 경로는 실제 구조에 맞게 수정

// 위스키 타입 정의
export interface Whisky {
  whiskyId: number;
  whiskyImg: string;
}

// React Query에서 사용할 쿼리 키
export const COLLECTION_QUERY_KEY = 'collection';

/**
 * 사용자 컬렉션의 위스키 데이터를 가져오는 API 함수
 *
 * @returns 위스키 목록
 */
export const fetchWhiskyCollection = async (): Promise<
  { id: number; image: string }[]
> => {
  try {
    const response = await API.get<Whisky[]>('/records');

    const formattedData = response.data.map((whisky) => ({
      id: whisky.whiskyId,
      image: whisky.whiskyImg,
    }));

    return formattedData;
  } catch (error: unknown) {
    return handleError(error);
  }
};
