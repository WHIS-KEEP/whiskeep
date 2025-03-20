import { configureStore } from "@reduxjs/toolkit"
import themeReducer from "../../features/theme-switcher/model/slice"

/**
 * Redux 스토어 설정
 */
export const store = configureStore({
  reducer: {
    theme: themeReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware(),
  devTools: process.env.NODE_ENV !== "production",
})

// 스토어의 상태 타입 추출
export type RootState = ReturnType<typeof store.getState>

// 디스패치 타입 추출
export type AppDispatch = typeof store.dispatch
