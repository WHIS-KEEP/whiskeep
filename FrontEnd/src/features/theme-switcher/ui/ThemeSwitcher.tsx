import React from "react"
import { useTheme } from "../model/hooks"
import styles from "./ThemeSwitcher.module.css"

export const ThemeSwitcher: React.FC = () => {
  const { theme, toggleTheme } = useTheme()

  return (
    <button className={styles.switcher} onClick={toggleTheme} aria-label={`현재 테마: ${theme}, 클릭하여 테마 변경`}>
      {theme === "light" ? "🌙" : "☀️"}
    </button>
  )
}
