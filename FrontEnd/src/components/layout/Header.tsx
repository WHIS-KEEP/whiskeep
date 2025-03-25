import React from "react"
import logo from "../../assets/logo.svg"
import { Heart } from "lucide-react"
import { Link } from "react-router-dom"

function Header() {
  return (
    <div className="flex items-center justify-between" style={{ padding: "1.25rem" }}>
      <Link to="/main">
        <div className="flex items-center ">
          <img src={logo} alt="Wiskeep" className="h-10 w-auto" />
        </div>
      </Link>

      <div className="relative inline-flex">
        <Heart size={24} />
        {/* 숫자 뱃지 - 나중에 동적으로 변경될 카운트, 나중에 기능 수정 */}
        <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white" style={{ backgroundColor: "#D42B2B" }}>
          1
        </span>
      </div>
    </div>
  )
}

export default Header
