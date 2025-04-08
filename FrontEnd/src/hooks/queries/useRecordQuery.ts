// hooks/queries/useRecordQuery.ts
import { useQuery, useMutation, QueryClient } from '@tanstack/react-query';
import { getRecordDetail, deleteRecord } from '@/lib/api/record';

// 기록 상세 조회 훅 - whiskyId와 recordId 모두 필요
export const useRecordDetail = (
  whiskyId: string | undefined,
  recordId: string | undefined,
) => {
  return useQuery({
    queryKey: ['recordDetail', whiskyId, recordId],
    queryFn: () => getRecordDetail(whiskyId as string, recordId as string),
    enabled: !!whiskyId && !!recordId,
  });
};

// 기록 삭제 훅
export const useDeleteRecord = () => {
  const queryClient = new QueryClient();

  return useMutation({
    mutationFn: ({
      whiskyId,
      recordId,
    }: {
      whiskyId: string;
      recordId: string;
    }) => deleteRecord(whiskyId, recordId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['records'] });
    },
  });
};
