import API from '@/lib/util/axiosInstance';
import { TastingProfile } from '@/components/ui/Tastingchart';

/**
 * 위스키의 테이스팅 프로필을 가져오는 API 함수
 *
 * @param id 위스키 ID
 * @returns 테이스팅 프로필 데이터
 */
export const fetchTastingProfile = async (
  id: number,
): Promise<TastingProfile> => {
  try {
    const response = await API.get(`/whiskies/${id}/score`);

    // 백엔드 응답 데이터 형식 변환
    const data = response.data;

    // 서버 응답을 테이스팅 프로필 형식으로 변환
    return {
      fruityScore: data.fruityScore || 0,
      sweetScore: data.sweetScore || 0,
      spicyScore: data.spicyScore || 0,
      oakyScore: data.oakyScore || 0,
      herbalScore: data.herbalScore || 0,
      brinyScore: data.brinyScore || 0,
    };
  } catch (error) {
    console.error('테이스팅 프로필을 가져오는 중 오류 발생:', error);
    // 에러 발생 시 기본값 반환
    return {
      fruityScore: 0,
      sweetScore: 0,
      spicyScore: 0,
      oakyScore: 0,
      herbalScore: 0,
      brinyScore: 0,
    };
  }
};
