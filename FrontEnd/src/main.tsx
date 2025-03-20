// FSD 구조에서는 app/index.tsx가 진입점입니다
import "./app/index"
import React from "react"
import ReactDOM from "react-dom/client"
import { RouterConfig } from "./app/providers/router"
import "./shared/ui/styles/global.css"

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterConfig />
  </React.StrictMode>
)
