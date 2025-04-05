// libs/api/record.ts
import api from '@/lib/util/axiosInstance'; // 인증 설정된 axios 인스턴스 사용
import { MyRecordResponse } from '@/types/record';

/**
 * 위스키별 기록 조회 API
 * @param whiskyId 위스키 ID
 * @returns 위스키 정보와 기록 목록
 */
export const getWhiskyRecord = async (
  whiskyId: number
): Promise<MyRecordResponse> => {
  try {
    const response = await api.get<MyRecordResponse>(`/records/${whiskyId}`);
    return response.data;
  } catch (error) {
    console.error('위스키 기록 조회 실패:', error);
    throw error;
  }
};