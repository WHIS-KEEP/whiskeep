import { createContext, useContext, useState, ReactNode } from 'react';

// Context 타입 정의
interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// 기본값 설정
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider 컴포넌트
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem('accessToken'),
  );

  // 로그인 처리
  const login = (newToken: string) => {
    setToken(newToken);
    localStorage.setItem('accessToken', newToken);
  };

  // 로그아웃 처리
  const logout = () => {
    setToken(null);
    localStorage.removeItem('accessToken');
  };

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook을 사용하여 AuthContext 접근
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
