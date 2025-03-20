import React, { ReactNode } from "react"
import styles from "./SafeArea.module.css"

interface SafeAreaProps {
  children: ReactNode
  top?: boolean
  bottom?: boolean
  className?: string
}

/**
 * 모바일 기기의 노치나 홈 인디케이터를 고려한 안전 영역 컴포넌트
 */
export const SafeArea: React.FC<SafeAreaProps> = ({ children, top = true, bottom = true, className = "" }) => {
  return (
    <div
      className={`
        ${styles.safeArea}
        ${top ? styles.safeAreaTop : ""}
        ${bottom ? styles.safeAreaBottom : ""}
        ${className}
      `}
    >
      {children}
    </div>
  )
}
