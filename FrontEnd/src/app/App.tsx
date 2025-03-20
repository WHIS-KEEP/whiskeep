import React, { useState, useEffect } from "react"
import { Routes, Route, Navigate } from "react-router-dom"
import "./styles/app.css"
import { LandingPage, LoginPage } from "../pages"
import { MobileHeader, Footer } from "../widgets"

export function App(): React.ReactElement {
  const [isMobile, setIsMobile] = useState<boolean>(false)

  // 뷰포트 크기 감지
  useEffect(() => {
    const checkIfMobile = (): void => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkIfMobile()
    window.addEventListener("resize", checkIfMobile)

    return () => {
      window.removeEventListener("resize", checkIfMobile)
    }
  }, [])

  return (
    <div className="app">
      <MobileHeader />
      <main className="content">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}
