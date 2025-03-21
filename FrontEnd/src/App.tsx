import { BrowserRouter } from "react-router-dom"
import Router from "./routes/router"

const App = () => {
  return (
    <BrowserRouter>
      {/* 컬러 팔레트가 Tailwind CSS에서 정상적으로 로드되었음을 확인 */}
      <div className="hidden">
        <div className="bg-primary-dark"></div>
        <div className="bg-primary"></div>
        <div className="bg-primary-50"></div>
        <div className="bg-primary-30"></div>

        <div className="bg-point-red-dark"></div>
        <div className="bg-point-red"></div>
        <div className="bg-point-red-40"></div>
        <div className="bg-point-red-dark-20"></div>

        <div className="bg-wood"></div>
        <div className="bg-wood-70"></div>
        <div className="bg-wood-30"></div>

        <div className="bg-bg"></div>
        <div className="bg-bg-muted"></div>

        <div className="text-text-main"></div>
        <div className="text-text-muted"></div>
        <div className="text-text-muted-40"></div>
        <div className="text-text-muted-20"></div>
      </div>

      <Router />
    </BrowserRouter>
  )
}

export default App
