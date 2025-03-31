// AuthProvider.tsx
import { ReactNode, useState } from 'react';
import { AuthContext } from './AuthContext'; // AuthContext import
import { loginUser, logoutUser } from './authContextUtils'; // 비-컴포넌트 로직을 import

// Provider 컴포넌트
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken') || null,
  );

  // 로그인 처리
  const login = (newToken: string) => {
    loginUser(newToken, setToken); // 비-컴포넌트 함수 호출
  };

  // 로그아웃 처리
  const logout = () => {
    logoutUser(setToken); // 비-컴포넌트 함수 호출
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
