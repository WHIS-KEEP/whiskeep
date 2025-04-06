import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMemberScoreQuery } from '@/hooks/queries/useMemberQuery';
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
import useMemberStore from '@/store/useMemberStore';

const PreferenceCompletePage = () => {
  const navigate = useNavigate();
  const setUserScore = useMemberStore((state) => state.setUserScore);
  const { refetch: refetchScore } = useMemberScoreQuery();
  const { refetch: refetchRecommend } = useRecommendQuery();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const run = async () => {
      try {
        const { data: score } = await refetchScore();
        if (!score || !score.nosing) {
          navigate('/preference');
          return;
        }

        setUserScore(score);

        const { data: recommends } = await refetchRecommend();
        if (recommends && recommends.length > 0) {
          navigate('/main');
        } else {
          console.warn('추천 결과 없음');
          navigate('/main');
        }
      } catch (e) {
        console.error('추천 로딩 실패', e);
        navigate('*');
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [navigate, refetchScore, refetchRecommend, setUserScore]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--bg-muted)]">
      {loading && (
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
