import React, { useEffect, useState } from "react"
import { Container } from "../../../shared/ui/layout/Container"

export const AuthPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // URL에서 인증 코드 추출
    const code = new URL(window.location.href).searchParams.get("code")

    if (code) {
      // 백엔드 서버로 인증 코드 전송
      handleKakaoLogin(code)
    } else {
      setIsLoading(false)
      setError("인증 코드를 찾을 수 없습니다.")
    }
  }, [])

  const handleKakaoLogin = async (code: string) => {
    try {
      setIsLoading(true)

      // 실제 구현에서는 백엔드 API 호출로 대체해야 합니다
      console.log("인증 코드:", code)

      // 백엔드 API 호출 예시:
      // const response = await fetch('/api/auth/kakao', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ code })
      // })

      // 로그인 성공 후 처리 (예: 메인 페이지로 이동)
      setTimeout(() => {
        // 로딩 상태를 보여주기 위한 임시 지연
        setIsLoading(false)
        window.location.href = "/"
      }, 2000)
    } catch (err) {
      setIsLoading(false)
      setError("로그인 처리 중 오류가 발생했습니다.")
      console.error("카카오 로그인 에러:", err)
    }
  }

  return (
    <Container>
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6">
        {isLoading ? (
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-t-primary rounded-full animate-spin mb-4 mx-auto"></div>
            <p className="text-lg">로그인 처리 중입니다...</p>
          </div>
        ) : error ? (
          <div className="text-center">
            <div className="text-destructive text-xl mb-4">⚠️</div>
            <p className="text-destructive">{error}</p>
            <button onClick={() => (window.location.href = "/login")} className="mt-4 px-4 py-2 bg-primary text-primary-foreground rounded-md hover:opacity-90 transition-opacity">
              로그인 페이지로 돌아가기
            </button>
          </div>
        ) : null}
      </div>
    </Container>
  )
}
