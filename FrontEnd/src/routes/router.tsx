import { Routes, Route, Navigate } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Navbar from '../components/layout/Navbar';
import Header from '@/components/layout/Header';
import Main from '../pages/Main';
import List from '@/pages/List';
import Collection from '@/pages/Collection';
import Mypage from '@/pages/Mypage';
import Login from '@/pages/Login';
import Test from '@/pages/Test';
import LoginSuccess from '@/pages/LoginSuccess';
import useAuth from '@/store/useContext';
import { JSX } from 'react';

// 보호된 페이지 (로그인한 사용자만 접근 가능)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const Router = () => {
  return (
    <div className="mobile-container flex flex-col h-full">
      {/* 상단 헤더 */}
      <Header />
      {/* 메인 콘텐츠 (스크롤 영역) */}
      <div
        className="flex-grow overflow-auto bg-bg-muted"
        style={{ padding: '1.25rem', paddingBottom: '150px' }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route
            path="main"
            element={
              <ProtectedRoute>
                <Main />
              </ProtectedRoute>
            }
          />
          <Route path="list" element={<List />} />
          <Route path="collection" element={<Collection />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="login" element={<Login />} />
          <Route path="login/success" element={<LoginSuccess />} />
          <Route path="test" element={<Test />} />
          <Route path="like" element={<Like />} />
          <Route path="record" element={<Record />} />
          <Route path="record-detail" element={<RecordDetail />} />
        </Routes>
      </div>

      {/* 하단 네비게이션 바 */}
      <div
        style={{
          position: 'fixed',
          bottom: 0,
          width: 'var(--mobile-width)',
          maxWidth: 'var(--mobile-width)',
          zIndex: 50,
        }}
      >
        <Navbar />
      </div>
    </div>
  );
};

export default Router;
