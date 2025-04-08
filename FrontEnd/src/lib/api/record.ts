// libs/api/record.ts
import api from '@/lib/util/axiosInstance'; // 인증 설정된 axios 인스턴스 사용
import { MyRecordResponse } from '@/types/record';
import { RecordDetail } from '@/types/record';

/**
 * 위스키별 기록 조회 API
 * @param whiskyId 위스키 ID
 * @returns 위스키 정보와 기록 목록
 */
export const getWhiskyRecord = async (
  whiskyId: number | string,
): Promise<MyRecordResponse> => {
  try {
    const response = await api.get<MyRecordResponse>(`/records/${whiskyId}`);
    return response.data;
  } catch (error) {
    console.error('위스키 기록 조회 실패:', error);
    throw error;
  }
};

// 기록 상세 조회 API
export const getRecordDetail = async (
  whiskyId: string,
  recordId: string,
): Promise<RecordDetail> => {
  const response = await api.get<RecordDetail>(
    `records/${whiskyId}/${recordId}`,
  );
  return response.data;
};

// 기록 삭제 API
export const deleteRecord = async (
  whiskyId: string,
  recordId: string,
): Promise<void> => {
  await api.delete(`records/${whiskyId}/${recordId}`);
};
