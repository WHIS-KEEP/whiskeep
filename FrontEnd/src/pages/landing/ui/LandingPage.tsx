import { useState, useEffect } from "react"
import { Navigate } from "react-router-dom"
import { Container } from "../../../shared/ui/layout/Container"

export const LandingPage: React.FC = () => {
  const [redirect, setRedirect] = useState<boolean>(false)

  useEffect(() => {
    // 3.5초 후에 로그인 페이지로 리다이렉트
    const timer = setTimeout(() => {
      setRedirect(true)
    }, 3500)

    return () => clearTimeout(timer)
  }, [])

  if (redirect) {
    return <Navigate to="/login" />
  }

  return (
    <Container>
      <div className="landing-page">
        <div className="logo-container">
          <h1 className="logo">(임시로고)</h1>
        </div>
      </div>
    </Container>
  )
}
