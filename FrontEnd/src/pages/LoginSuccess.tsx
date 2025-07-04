import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '@/lib/util/axiosInstance'; // API 요청을 위한 axios 인스턴스
import useAuth from '@/store/useContext'; // 전역 로그인 상태 관리
import { useMemberScoreQuery } from '@/hooks/queries/useMemberQuery';
import useMemberStore from '@/store/useMemberStore';

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 로그인 상태 저장을 위한 Context API 사용
  const isFetched = useRef(false); // API 요청 중복 방지

  const [loading, setLoading] = useState(true);
  const { refetch: fetchScore } = useMemberScoreQuery();
  const setMemberStore = useMemberStore((state) => state.setUserScore);

  useEffect(() => {
    const fetchAccessTokenAndScore = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');
      const provider = sessionStorage.getItem('provider');

      if (!code || !provider) {
        alert('다시 시도해주세요!');
        sessionStorage.removeItem('provider'); // 세션 스토리지에 provider 남는 것 방지
        navigate('/login'); // 로그인 페이지로 리디렉트
        return;
      }

      try {
        setLoading(true);

        // 백엔드의 access-token 발급 API 호출
        const response = await api.post(`/members/login/success`, {
          provider: provider,
          code: code,
        });

        const { accessToken, member } = response.data;
        login(accessToken, member); // Context에 저장

        // 1. 로그인 후 zustand에서 점수 확인
        const existingScore = useMemberStore.getState().score;

        if (existingScore) {
          // zustand에 점수가 이미 존재하면,
          navigate('/main');
          return;
        }
        // 2. 점수가 없다면 백엔드에서 점수 조회
        const { data: score } = await fetchScore();
        if (score && score.nosing) {
          setMemberStore(score);
          navigate('/main');
        } else {
          navigate('/preference');
        }
      } catch (error) {
        console.error('로그인 또는 점수 조회 실패:', error);
        alert('문제가 발생했습니다. 다시 시도해주세요.');
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };

    if (!isFetched.current) {
      isFetched.current = true; // 한 번만 실행
      fetchAccessTokenAndScore(); // access-token 발급 요청
    }
  }, [login, navigate, setMemberStore, fetchScore]); // 컴포넌트 마운트 시 실행

  if (loading) {
    return (
      <div className="flex-1 p-4 overflow-auto flex justify-center items-center">
        <div className="w-10 h-10 border-4 border-gray-500 border-solid rounded-full border-t-transparent animate-spin"></div>
      </div>
    );
  }
  return (
    <div className="flex-1 p-4 overflow-auto flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-gray-500 border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  ); // 로그인 처리 중 표시
};

export default LoginSuccess;
