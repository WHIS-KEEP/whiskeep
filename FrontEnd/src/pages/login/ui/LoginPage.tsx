import React from "react"
import { Container } from "../../../shared/ui/layout/Container"
import "../../../shared/ui/styles/googleButton.css"

// 카카오 로그인 컴포넌트
const SocialKakao: React.FC = () => {
  const REST_API_KEY = import.meta.env.VITE_KAKAO_REST_API_KEY || "REST API KEY"
  const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI || "http://localhost:3000/auth"

  // OAuth 요청 URL
  const kakaoURL = `https://kauth.kakao.com/oauth/authorize?client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}&response_type=code`

  const handleLogin = () => {
    window.location.href = kakaoURL
  }

  return (
    <button
      onClick={handleLogin}
      className="**h-[40px]** w-1/2 **py-0 px-3** rounded-md bg-[#FEE500] text-[#3A1D1D] **text-sm** font-medium flex items-center justify-center gap-2 hover:bg-[#FDDC3F] transition-colors **rounded**"
    >
      <img src="./public/kakao_login_medium_narrow.png" alt="카카오로 로그인" className="w-full max-w-xs" />
    </button>
  )
}

// 구글 로그인 컴포넌트 (예시)
const SocialGoogle: React.FC = () => {
  const handleLogin = () => {
    // 구글 로그인 로직 구현 필요
    alert("구글 로그인 기능 구현 예정입니다.")
  }

  return (
    <button className="gsi-material-button" style={{ width: "183px" }} onClick={handleLogin}>
      <div className="gsi-material-button-state"></div>
      <div className="gsi-material-button-content-wrapper">
        <div className="gsi-material-button-icon">
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" xmlnsXlink="http://www.w3.org/1999/xlink" style={{ display: "block" }}>
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
        </div>
        <span className="gsi-material-button-contents">구글로 로그인</span>
        <span style={{ display: "none" }}>Sign in with Google</span>
      </div>
    </button>
  )
}

export const LoginPage: React.FC = () => (
  <Container>
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
      <h1 className="text-2xl font-bold mb-8">로그인</h1>
      <div className="flex flex-col gap-4 w-full max-w-xs">
        <SocialKakao />
        <SocialGoogle />
      </div>
    </div>
  </Container>
)
