import React, { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./MobileHeader.module.css"
import { SafeArea } from "../../../shared/ui/layout/SafeArea"
import { ThemeSwitcher } from "../../../features/theme-switcher"

export const MobileHeader: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState<boolean>(false)

  const toggleMenu = (): void => {
    setMenuOpen(!menuOpen)
  }

  // 메뉴가 열렸을 때 스크롤 방지
  if (menuOpen) {
    document.body.style.overflow = "hidden"
  } else {
    document.body.style.overflow = ""
  }

  return (
    <SafeArea top>
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <div className={styles.logo}>
            <Link to="/">(임시로고)</Link>
          </div>

          <div className={styles.actions}>
            <ThemeSwitcher />
            <button className={styles.menuButton} onClick={toggleMenu} aria-label={menuOpen ? "메뉴 닫기" : "메뉴 열기"}>
              <div className={`${styles.menuIcon} ${menuOpen ? styles.open : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav className={styles.mobileNav}>
            <ul className={styles.navList}>
              <li>
                <Link to="/" onClick={() => setMenuOpen(false)}>
                  홈
                </Link>
              </li>
              <li>
                <Link to="/login" onClick={() => setMenuOpen(false)}>
                  로그인
                </Link>
              </li>
            </ul>
          </nav>
        )}
      </header>
    </SafeArea>
  )
}
