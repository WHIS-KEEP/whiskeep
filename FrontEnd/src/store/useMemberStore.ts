import { MemberScore } from '@/types/member';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  score: MemberScore | null | undefined; // 사용자 점수 상태
  setUserScore: (score: MemberScore) => void;
}

// zustand 스토어 생성 및 persist 미들웨어 적용
const useMemberStore = create<UserState>()(
  persist(
    (set) => ({
      score: undefined, // undefined 아직 안 불럼
      setUserScore: (score) => set({ score }), // 상태 업데이트 함수
    }),
    {
      name: 'member-score',
      storage: createJSONStorage(() => localStorage),
      // 초기화 시 hydration 할 때 undefined 되지 않도록 해주는 설정
      // hydration 이후에도 undefined가 되려면 이거 생략
      partialize: (state) => ({ score: state.score ?? null }),
    },
  ),
);

export default useMemberStore;
