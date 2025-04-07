import { useQuery } from '@tanstack/react-query';
import { getWhiskyTastingProfile } from '@/lib/api/whisky';
import { TastingProfile } from '@/components/ui/TastingRadarChart';

const useWhiskyTastingProfile = (whiskyId?: number) => {
  return useQuery({
    queryKey: ['whiskyTastingProfile', whiskyId],
    queryFn: async () => {
      if (!whiskyId) return null;

      const data = await getWhiskyTastingProfile(whiskyId);

      // API 응답 형식에 맞게 데이터 변환
      return {
        nosing: {
          fruityScore: data.nosing?.fruityScore || 0,
          sweetScore: data.nosing?.sweetScore || 0,
          spicyScore: data.nosing?.spicyScore || 0,
          oakyScore: data.nosing?.oakyScore || 0,
          herbalScore: data.nosing?.herbalScore || 0,
          brinyScore: data.nosing?.brinyScore || 0,
        },
        tasting: {
          fruityScore: data.tasting?.fruityScore || 0,
          sweetScore: data.tasting?.sweetScore || 0,
          spicyScore: data.tasting?.spicyScore || 0,
          oakyScore: data.tasting?.oakyScore || 0,
          herbalScore: data.tasting?.herbalScore || 0,
          brinyScore: data.tasting?.brinyScore || 0,
        },
        finish: {
          fruityScore: data.finish?.fruityScore || 0,
          sweetScore: data.finish?.sweetScore || 0,
          spicyScore: data.finish?.spicyScore || 0,
          oakyScore: data.finish?.oakyScore || 0,
          herbalScore: data.finish?.herbalScore || 0,
          brinyScore: data.finish?.brinyScore || 0,
        },
      } as TastingProfile;
    },
    enabled: !!whiskyId,
  });
};

export default useWhiskyTastingProfile;
