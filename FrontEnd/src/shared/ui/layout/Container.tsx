import React, { ReactNode } from "react"
import styles from "./Container.module.css"

interface ContainerProps {
  children: ReactNode
  className?: string
  fullWidth?: boolean
  style?: React.CSSProperties
}

/**
 * 모바일 화면에 최적화된 컨테이너 컴포넌트
 */
export const Container: React.FC<ContainerProps> = ({ children, className = "", fullWidth = false, style = {} }) => {
  return (
    <div className={`${styles.container} ${fullWidth ? styles.fullWidth : ""} ${className}`} style={style}>
      {children}
    </div>
  )
}
