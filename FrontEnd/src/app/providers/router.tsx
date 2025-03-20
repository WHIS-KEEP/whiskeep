import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import { LoginPage } from "../../pages/login/ui/LoginPage"
import { AuthPage } from "../../pages/auth/ui/AuthPage"

const router = createBrowserRouter([
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/auth",
    element: <AuthPage />,
  },
  // 기타 라우트들을 여기에 추가
  {
    path: "/",
    element: <div>메인 페이지</div>, // 임시 메인 페이지
  },
])

export const RouterConfig: React.FC = () => {
  return <RouterProvider router={router} />
}
