// AuthProvider.tsx
import { ReactNode, useState, useEffect } from 'react';
import { AuthContext } from './AuthContext'; // AuthContext import
import { MemberResponse } from './AuthContext'; // MemberResponse 타입 import

// Provider 컴포넌트
const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    sessionStorage.getItem('accessToken') || null,
  );
  const [user, setUser] = useState<MemberResponse | null>(null);

  useEffect(() => {
    const savedToken = sessionStorage.getItem('accessToken');
    const savedUser = sessionStorage.getItem('user');
    
    if (savedToken) {
      setToken(savedToken);
    }
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  // 로그인 처리
  const login = (newToken: string, newUser: MemberResponse) => {
    setToken(newToken);
    setUser(newUser);
    sessionStorage.setItem('accessToken', newToken);
    sessionStorage.setItem('user', JSON.stringify(newUser));
  };

  // 로그아웃 처리
  const logout = () => {
    setToken(null);
    setUser(null);
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
