// AuthContext.ts
import { createContext } from 'react';

interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

const defaultContextValue: AuthContextType = {
  token: null,
  login: () => {},
  logout: () => {},
};

// AuthContext 정의
export const AuthContext = createContext<AuthContextType>(defaultContextValue);
