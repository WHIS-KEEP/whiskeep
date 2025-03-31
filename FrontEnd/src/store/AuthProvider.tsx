// AuthProvider.tsx
import { ReactNode, useState } from 'react';
import { AuthContext } from './AuthContext'; // AuthContext import
import { MemberResponse } from './AuthContext'; // MemberResponse 타입 import

// Provider 컴포넌트
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken') || null,
  );
  const [user, setUser] = useState<MemberResponse | null>(null);

  // 로그인 처리
  const login = (newToken: string, newUser: MemberResponse) => {
    setToken(newToken);
    setUser(newUser);
    localStorage.setItem('accessToken', newToken);
  };

  // 로그아웃 처리
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
