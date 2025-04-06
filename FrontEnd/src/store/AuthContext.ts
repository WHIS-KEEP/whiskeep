// AuthContext.ts
import { createContext } from 'react';

// 사용자 정보 타입 정의
export interface MemberResponse {
  nickName: string;
  profileImg: string;
}

// AuthContext 타입 정의
interface AuthContextType {
  token: string | null;
  user: MemberResponse | null;
  login: (token: string, user: MemberResponse) => void;
  logout: () => void;
}

const defaultContextValue: AuthContextType = {
  token: null,
  user: null,
  login: () => {},
  logout: () => {},
};

// AuthContext 정의
export const AuthContext = createContext<AuthContextType>(defaultContextValue);
