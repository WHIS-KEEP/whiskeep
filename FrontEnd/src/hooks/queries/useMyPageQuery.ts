import { useQuery } from '@tanstack/react-query';
import API from '@/lib/util/axiosInstance';

interface UserData {
  name: string;
  email: string;
  nickname: string;
  profileImg?: string;
}

export const useMyPageQuery = () => {
  return useQuery<UserData>({
    queryKey: ['myPageUser'],
    queryFn: async () => {
      const response = await API.get('/members');
      return response.data;
    },
  });
};
