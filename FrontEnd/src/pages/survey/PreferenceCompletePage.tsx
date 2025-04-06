import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberScoreQuery } from '@/hooks/queries/useMemberQuery';
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
import useMemberStore from '@/store/useMemberStore';
import { useQueryClient } from '@tanstack/react-query';

const PreferenceCompletePage = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient(); // React Query 캐시 제어를 위한 client

  // zustand의 사용자 점수 저장 함수
  const setUserScore = useMemberStore((state) => state.setUserScore);

  // 사용자 점수 refetch (초기 로딩 시 사용)
  const { refetch: refetchScore } = useMemberScoreQuery();

  // 추천 결과 refetch (초기 로딩 시 사용)
  const { refetch: refetchRecommend, isFetching: isRecommending } =
    useRecommendQuery({ enabled: false }); // 수동 호출을 위해 enabled: false 설정

  useEffect(() => {
    const run = async () => {
      try {
        const { data: score } = await refetchScore();

        // 점수 없으면 /preference 페이지로 이동
        if (!score || !score.nosing) {
          navigate('/preference');
          return;
        }

        // zustand에 사용자 점수 저장
        setUserScore(score);

        // 추천 리스트 refetch (데이터 자체는 사용하지 않고 성공 여부만 확인)
        const { data, isSuccess } = await refetchRecommend();
        console.log('data', data);
        console.log('추천 결과:', isSuccess);

        // 추천 성공이면 main 페이지로 이동
        if (isSuccess) {
          navigate('/main');
        } else {
          // 추천이 비어 있을 경우 캐시까지 제거
          queryClient.removeQueries({ queryKey: ['recommendations'] });
          console.warn('추천 결과 없음');
          navigate('/preference');
        }
      } catch (e) {
        // API 호출 중 예외 발생 시 에러 페이지로 이동
        console.error('추천 로딩 실패', e);
        navigate('*');
      }
    };

    run();
  }, [navigate, refetchScore, refetchRecommend, setUserScore]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-muted)]">
      {isRecommending && (
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[var(--primary-dark)] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="mt-4 text-sm text-[var(--text-muted)]">
            나에게 맞는 위스키를 추천 중입니다...
          </p>
        </div>
      )}
    </div>
  );
};

export default PreferenceCompletePage;
