import React, { ReactNode, useEffect } from "react"
import { useSelector } from "react-redux"
import { RootState } from "../../../shared/config/store"

interface ThemeProviderProps {
  children: ReactNode
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const theme = useSelector((state: RootState) => state.theme.current)

  useEffect(() => {
    // 초기 테마 설정
    document.documentElement.classList.toggle("dark", theme === "dark")
  }, [theme])

  return <>{children}</>
}
