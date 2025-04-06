import { useMutation } from '@tanstack/react-query';
import api from '@/lib/util/axiosInstance';


// 로그인 API 요청 : 리다이렉트하므로 mutaton 사용
const getSocialLogin = async (provider: 'google' | 'kakao') => {
  const response = await api.get(`/members/login/${provider}`);
  window.location.href = response.data;
};

// 로그인 요청 Hook
export const useLoginMutations = () => {
  return useMutation({
    mutationFn: getSocialLogin,
    onMutate: () => {
      // // 뮤테이션 함수가 실행되기 직전에 호출되는 함수
      // if (localStorage.getItem('accessToken')) {
      //   localStorage.removeItem('accessToken');
      //   console.log('소셜 로그인 전 기존 토큰 삭제 완료');
      // }
    },
  });
};
