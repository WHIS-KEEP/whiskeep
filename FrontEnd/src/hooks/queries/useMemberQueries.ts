import { useQuery } from '@tanstack/react-query';
import axios from 'axios';

// 사용자 정보 API 요청
const fetchUser = async () => {
  const token = localStorage.getItem('access-token');
  if (!token) throw new Error('No token found');

  const response = await axios.get('http://localhost:8080/api/members', {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// 사용자 정보 조회 Hook
export const useUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: fetchUser,
    retry: false, // 토큰이 없으면 재시도 안 함
    staleTime: 1000 * 60 * 5, // 5분 동안 데이터 유지
  });
};
