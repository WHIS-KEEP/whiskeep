import { MemberScore } from '@/types/member';
import { create } from 'zustand';
// 위에서 정의한 타입

interface UserState {
  score: MemberScore | null;
  setUserScore: (score: MemberScore) => void;
}

const useMemberStore = create<UserState>((set) => ({
  score: null,
  setUserScore: (score) => set({ score }),
}));

export default useMemberStore;
