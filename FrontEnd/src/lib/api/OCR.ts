// src/services/OCR.ts (또는 apiService.ts)

import { ApiError, handleApiError, createNetworkError } from '../util/error';

/**
 * OCR API 응답 타입 정의
 * 백엔드 구현이 아직 없으므로 유연한 타입 정의 사용
 * 추후 백엔드 구현 완료 시 실제 응답 구조에 맞게 조정 필요!!!!!
 */
export interface OcrResponse {
  // 백엔드에서 반환하는 실제 구조에 맞게 조정 필요
  [key: string]: unknown;
}

/**
 * API 통신을 위한 기본 객체
 */
const API = {
  /**
   * POST 요청을 보내는 범용 메서드
   * @param endpoint API 엔드포인트 경로
   * @param data 요청 본문에 포함될 데이터 객체
   * @returns Promise<TResponse> - 성공 시 파싱된 JSON 응답
   * @throws {ApiError} - 요청 실패 시
   */
  post: async <TResponse>(
    endpoint: string,
    data: Record<string, unknown>,
  ): Promise<TResponse> => {
    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // 필요시 인증 토큰 등 다른 헤더 추가
          // 'Authorization': `Bearer ${your_token}`
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        // error.ts로 이동된 오류 처리 로직 사용
        const error = await handleApiError(response, endpoint);
        throw error;
      }

      // 성공 응답 처리 (JSON 파싱)
      const responseData: TResponse = await response.json();
      return responseData;
    } catch (error) {
      // 네트워크 오류 또는 위에서 throw된 ApiError 처리
      console.error(`API POST 요청 실패 (${endpoint}):`, error);
      // ApiError가 아닌 다른 타입의 에러(예: 네트워크 에러)도 ApiError 형태로 통일
      if (error instanceof Error && !(error as ApiError).status) {
        throw createNetworkError(error);
      }
      // ApiError 또는 다른 처리된 에러는 그대로 다시 던짐
      throw error;
    }
  },

  /**
   * GET 요청 메서드 (참고용 예시)
   */
  get: async <TResponse>(endpoint: string): Promise<TResponse> => {
    try {
      const response = await fetch(endpoint, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${your_token}`
        },
      });
      if (!response.ok) {
        // error.ts로 이동된 오류 처리 로직 사용
        const error = await handleApiError(response, endpoint);
        throw error;
      }
      const responseData: TResponse = await response.json();
      return responseData;
    } catch (error) {
      console.error(`API GET 요청 실패 (${endpoint}):`, error);
      if (error instanceof Error && !(error as ApiError).status) {
        throw createNetworkError(error);
      }
      throw error;
    }
  },
};

/**
 * OCR API 엔드포인트 주소
 */
const OCR_ENDPOINT = '/ocr';

/**
 * 이미지 데이터 URL을 OCR API로 전송하는 함수
 * @param imageDataURL Base64 인코딩된 이미지 데이터 문자열 (e.g., "data:image/png;base64,...")
 * @returns Promise<OcrResponse> - OCR 처리 결과
 * @throws {ApiError} - API 요청 실패 시
 */
export const sendImageToOCR = async (
  imageDataURL: string,
): Promise<OcrResponse> => {
  const payload = { image: imageDataURL };
  // API 객체의 post 메서드를 사용하여 요청 전송
  try {
    return await API.post<OcrResponse>(OCR_ENDPOINT, payload);
  } catch {
    // API 호출 실패 시 빈 응답을 반환
    return {};
  }
};

// API 객체 자체를 export하여 다른 종류의 요청에도 사용할 수 있게 할 수 있습니다.
// export default API;
