import axios from 'axios';
import useAuth from '@/store/useContext'; // 전역 로그인 상태 관리

export const useLoginQueries = () => {
  const { token, logout } = useAuth();

  const instance = axios.create({
    baseURL: 'http://localhost:8080/api',
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  });

  // 응답 인터셉터 추가 (401 Unauthorized 처리)
  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        console.error('토큰 만료됨, 로그아웃 처리');
        logout();
      }
      return Promise.reject(error);
    },
  );

  return instance;
};
