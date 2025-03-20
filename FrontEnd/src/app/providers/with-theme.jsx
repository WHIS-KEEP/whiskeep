import { ThemeProvider } from "../../features/theme-switcher"

export const withTheme = (component) => () => {
  return <ThemeProvider>{component()}</ThemeProvider>
}
