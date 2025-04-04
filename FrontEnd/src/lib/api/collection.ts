import API from '@/lib/util/axiosInstance';
import { AxiosError } from 'axios';

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
    // 디버깅을 위해 API 요청 정보 출력
    console.log('🔍 API 요청 준비:', {
      method: 'GET',
      url: '/records',
    });

    const startTime = performance.now();
    const response = await API.get<Whisky[]>('/records');
    const endTime = performance.now();

    // 디버깅을 위해 API 응답 정보 출력
    console.log(`✅ API 응답 (${Math.round(endTime - startTime)}ms):`, {
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
      endpoint: response.config?.url,
      fullUrl: response.config?.baseURL
        ? `${response.config.baseURL}${response.config.url || ''}`
        : response.config?.url,
    });
    console.log('📊 응답 데이터:', response.data);

    // API 응답 데이터를 기존 형식에 맞게 변환
    const formattedData = response.data.map((whisky) => ({
      id: whisky.whiskyId,
      image: whisky.whiskyImg,
    }));

    console.log('🔄 변환된 데이터:', formattedData);

    return formattedData;
  } catch (error: unknown) {
    // unknown 타입으로 변경하고 타입 가드 사용
    console.error('❌ 위스키 데이터를 불러오는 중 오류 발생:', error);

    // 상세한 오류 정보 출력
    if (error instanceof AxiosError && error.response) {
      // 서버가 응답을 반환한 경우
      console.error('📡 응답 데이터:', {
        status: error.response.status,
        statusText: error.response.statusText,
        headers: error.response.headers,
        data: error.response.data,
        endpoint: error.config?.url,
        fullUrl: error.config?.baseURL
          ? `${error.config.baseURL}${error.config.url || ''}`
          : error.config?.url,
      });
    } else if (error instanceof AxiosError && error.request) {
      // 요청은 보냈지만 응답을 받지 못한 경우
      console.error('📡 요청 정보:', {
        request: error.request,
        endpoint: error.config?.url,
        fullUrl: error.config?.baseURL
          ? `${error.config.baseURL}${error.config.url || ''}`
          : error.config?.url,
      });
    } else if (error instanceof Error) {
      // 요청 설정 과정에서 오류가 발생한 경우
      console.error('📡 요청 준비 오류:', {
        message: error.message,
        config: error instanceof AxiosError ? error.config : undefined,
      });
    }

    // 오류 발생 시 빈 배열 반환
    return [];
  }
};
