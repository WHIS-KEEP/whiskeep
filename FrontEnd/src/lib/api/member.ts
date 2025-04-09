import { MemberScore } from '@/types/member';
import API from '../util/axiosInstance';

export const getUserScore = async (): Promise<MemberScore | null> => {
  const response = await API.get('/members/score');
  return response.data;
};

// 로그아웃
export const postLogout = async () => {
  return await API.post('/members/logout');
};
