import { useDispatch, useSelector } from "react-redux"
import { toggleTheme as toggleThemeAction } from "./slice"
import { RootState } from "../../../shared/config/store"

export const useTheme = () => {
  const dispatch = useDispatch()
  const theme = useSelector((state: RootState) => state.theme.current)

  const toggleTheme = () => {
    dispatch(toggleThemeAction())
  }

  return { theme, toggleTheme }
}
