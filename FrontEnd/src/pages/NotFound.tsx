import { Link } from "react-router-dom"

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[50vh] p-6 bg-bg-muted rounded-lg">
      <h1 className="text-4xl font-bold mb-4 text-point-red-dark">404</h1>
      <p className="text-xl mb-6 text-text-muted">페이지를 찾을 수 없습니다.</p>
      <Link to="/" className="bg-primary hover:bg-primary-dark text-white font-bold py-2 px-4 rounded transition-colors">
        홈으로 돌아가기
      </Link>
    </div>
  )
}

export default NotFound
