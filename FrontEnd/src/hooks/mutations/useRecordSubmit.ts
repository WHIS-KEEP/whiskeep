import { useState } from 'react';
import API from '@/lib/util/axiosInstance';

export interface WhiskyInfo {
  id: number;
  name: string;
  imageUrl: string | null;
}

export interface RecordSubmitData {
  whiskyId?: number;
  rating: number;
  content: string;
  isPublic: boolean;
  recordImg?: string | null;
}

export interface RecordUpdateData extends RecordSubmitData {
  recordId: string;
}

interface UseRecordSubmitReturn {
  isSubmitting: boolean;
  submitError: Error | null;
  submitRecord: (data: RecordSubmitData) => Promise<boolean>;
  updateRecord: (data: RecordUpdateData) => Promise<boolean>;
}

const useRecordSubmit = (): UseRecordSubmitReturn => {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<Error | null>(null);

  const submitRecord = async (data: RecordSubmitData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!data.content.trim()) {
        throw new Error('기록 내용을 입력해주세요.');
      }

      if (!data.whiskyId) {
        throw new Error('위스키를 선택해주세요.');
      }

      // API 인스턴스 사용
      await API.post('/records', data);
      return true;
    } catch (error) {
      console.error('기록 등록 중 오류가 발생했습니다.', error);
      setSubmitError(
        error instanceof Error ? error : new Error('기록 등록에 실패했습니다.'),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateRecord = async (data: RecordUpdateData): Promise<boolean> => {
    try {
      setIsSubmitting(true);
      setSubmitError(null);

      if (!data.content.trim()) {
        throw new Error('기록 내용을 입력해주세요.');
      }

      if (!data.whiskyId) {
        throw new Error('위스키를 선택해주세요.');
      }

      if (!data.recordId) {
        throw new Error('기록 ID가 유효하지 않습니다.');
      }

      // API 인스턴스 사용
      await API.put(`/records/${data.whiskyId}/${data.recordId}`, data);
      return true;
    } catch (error) {
      console.error('기록 수정 중 오류가 발생했습니다.', error);
      setSubmitError(
        error instanceof Error ? error : new Error('기록 수정에 실패했습니다.'),
      );
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitError,
    submitRecord,
    updateRecord,
  };
};

export default useRecordSubmit;
