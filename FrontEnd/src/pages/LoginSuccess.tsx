import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import useAuth from '@/store/useContext'; // 전역 로그인 상태 관리

const LoginSuccess = () => {
  const navigate = useNavigate();
  const { login } = useAuth(); // 로그인 상태 저장을 위한 Context API 사용
  const isFetched = useRef(false); // API 요청 중복 방지

  useEffect(() => {
    const fetchAccessToken = async () => {
      // URL에서 code 파라미터 추출
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('code');

      if (!code) {
        alert('다시 시도해주세요!');
        navigate('/login'); // 로그인 페이지로 리디렉트
        return;
      }

      try {
        // 백엔드의 access-token 발급 API 호출
        const response = await axios.post(
          `http://localhost:8080/api/members/login/success?code=${code}`,
        );

        // 받은 access-token을 localStorage에 저장
        console.log(response.data);
        const { accessToken, member } = response.data;
        login(accessToken, member);

        // 메인 페이지로 이동
        navigate('/main');
      } catch (error) {
        console.error('로그인 실패:', error);
        alert('로그인 실패! 다시 시도해주세요.');
        navigate('/login'); // 로그인 실패 시 로그인 페이지로 리디렉트
      }
    };

    if (!isFetched.current) {
      isFetched.current = true; // 한 번만 실행
      fetchAccessToken(); // access-token 발급 요청
    }
  }, [login, navigate]); // 컴포넌트 마운트 시 실행

  return (
    <div className="flex-1 p-4 overflow-auto flex justify-center items-center">
      <div className="w-10 h-10 border-4 border-gray-500 border-solid rounded-full border-t-transparent animate-spin"></div>
    </div>
  ); // 로그인 처리 중 표시
};

export default LoginSuccess;
