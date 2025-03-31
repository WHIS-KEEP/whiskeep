// Context 타입 정의
export interface AuthContextType {
  token: string | null;
  login: (token: string) => void;
  logout: () => void;
}

// 로그인 처리 함수
export const loginUser = (
  newToken: string,
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setToken(newToken);
  localStorage.setItem('accessToken', newToken);
};

// 로그아웃 처리 함수
export const logoutUser = (
  setToken: React.Dispatch<React.SetStateAction<string | null>>,
) => {
  setToken(null);
  localStorage.removeItem('accessToken');
};
