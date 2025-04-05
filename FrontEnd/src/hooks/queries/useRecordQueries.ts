// hooks/queries/useRecordQueries.ts
import { useQuery } from '@tanstack/react-query';
import { getWhiskyRecord } from '@/lib/api/record';
import { MyRecordResponse } from '@/types/record';

export const useWhiskyRecord = (whiskyId: number) => {
  return useQuery<MyRecordResponse, Error>({
    queryKey: ['whiskyRecord', whiskyId],
    queryFn: () => getWhiskyRecord(whiskyId),
    enabled: whiskyId > 0,  // ID가 유효할 때만 쿼리 실행
    staleTime: 1000 * 60 * 5,  // 5분 동안 데이터를 신선하게 유지
    retry: 1,  // 실패 시 1회 재시도
  });
};
