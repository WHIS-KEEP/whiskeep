import { Link } from "react-router-dom"
import { ThemeSwitcher } from "../../../features/theme-switcher"
import { LanguageSwitcher } from "../../../features/language-switcher"
import styles from "./Header.module.css"

export const Header = () => {
  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <Link to="/">A409FE</Link>
        </div>

        <nav className={styles.nav}>
          <ul className={styles.navList}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/profile">Profile</Link>
            </li>
          </ul>
        </nav>

        <div className={styles.actions}>
          <ThemeSwitcher />
          <LanguageSwitcher />
          <Link to="/auth" className={styles.authButton}>
            Login
          </Link>
        </div>
      </div>
    </header>
  )
}
