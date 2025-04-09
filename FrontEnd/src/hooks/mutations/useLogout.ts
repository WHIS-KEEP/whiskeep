// hooks/mutations/useLogout.ts
import { postLogout } from '@/lib/api/member';
import { useMutation } from '@tanstack/react-query';

export const useLogout = () => {
  return useMutation({
    mutationFn: postLogout,
  });
};
