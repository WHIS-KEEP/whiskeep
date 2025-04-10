// src/services/OCR.ts (또는 apiService.ts)

import API from '@/lib/util/axiosInstance'; // API 요청을 위한 axios 인스턴스
import { Whisky } from '@/types/search';

/**
 * OCR API 응답 타입 정의
 * 백엔드 구현이 아직 없으므로 유연한 타입 정의 사용
 * 추후 백엔드 구현 완료 시 실제 응답 구조에 맞게 조정 필요!!!!!
 */
export interface OcrResponse {
  sameWhiskyIds: number[];
  whiskies: Whisky[];
}

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
export const sendImageToOCR = async (image: File): Promise<OcrResponse> => {
  const formData = new FormData();
  formData.append('image', image);

  const response = await API.post<OcrResponse>(OCR_ENDPOINT, formData);
  return response.data;
};

// API 객체 자체를 export하여 다른 종류의 요청에도 사용할 수 있게 할 수 있습니다.
// export default API;
