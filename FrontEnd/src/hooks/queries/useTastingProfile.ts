import { useQuery } from '@tanstack/react-query';
import { fetchTastingProfile } from '@/lib/api/tastingProfile';

/**
 * 위스키의 테이스팅 프로필을 불러오는 커스텀 훅
 *
 * @param whiskyId 위스키 ID
 * @returns 테이스팅 프로필 데이터와 로딩 상태
 */
export const useTastingProfile = (whiskyId?: number) => {
  return useQuery({
    queryKey: ['tastingProfile', whiskyId],
    queryFn: () => (whiskyId ? fetchTastingProfile(whiskyId) : null),
    enabled: !!whiskyId,
  });
};

export default useTastingProfile;
