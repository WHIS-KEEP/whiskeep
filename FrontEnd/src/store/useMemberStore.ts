import { MemberScore } from '@/types/member';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface UserState {
  score: MemberScore | null; // 사용자 점수 상태
  setUserScore: (score: MemberScore) => void;
}

// zustand 스토어 생성 및 persist 미들웨어 적용
const useMemberStore = create<UserState>()(
  persist(
    (set) => ({
      score: null, // 초기값은 null
      setUserScore: (score) => set({ score }), // 상태 업데이트 함수
    }),
    {
      name: 'member-score', // sessionStorage에 저장될 key 이름
      storage: createJSONStorage(() => sessionStorage), // sessionStorage에 JSON 형식으로 저장
    },
  ),
);

export default useMemberStore;
