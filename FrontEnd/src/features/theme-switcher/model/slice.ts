import { createSlice, PayloadAction } from "@reduxjs/toolkit"

const getPreferredTheme = (): string => {
  if (window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches) {
    return "dark"
  }
  return "light"
}

interface ThemeState {
  current: string
}

const initialState: ThemeState = {
  current: localStorage.getItem("theme") || getPreferredTheme(),
}

const themeSlice = createSlice({
  name: "theme",
  initialState,
  reducers: {
    toggleTheme: (state) => {
      const newTheme = state.current === "light" ? "dark" : "light"
      state.current = newTheme
      document.documentElement.classList.toggle("dark", newTheme === "dark")
      localStorage.setItem("theme", newTheme)
    },
  },
})

export const { toggleTheme } = themeSlice.actions
export default themeSlice.reducer
