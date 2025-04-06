import { useMutation } from '@tanstack/react-query';
import API from '@/lib/util/axiosInstance';

interface UpdateUserPayload {
  nickname: string;
  profileImage?: File | null;
}

export const useUpdateUserMutation = () => {
  return useMutation({
    mutationFn: async ({ nickname, profileImage }: UpdateUserPayload) => {
      const formData = new FormData();

      formData.append(
        'member',
        new Blob([JSON.stringify({ nickname })], {
          type: 'application/json',
        }),
      );

      if (profileImage) {
        formData.append('profileImg', profileImage);
      }

      return API.put('/members', formData).then((res) => res.data);
    },
  });
};

export const useCheckNicknameMutation = () => {
  return useMutation({
    mutationFn: (nickname: string) =>
      API.post('/members/check-nickname', { nickname }).then((res) => res.data),
  });
};
