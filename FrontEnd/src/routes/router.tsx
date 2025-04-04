import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from '@/pages/HomePage';
import NotFound from '@/pages/NotFoundPage';
import Main from '@/pages/MainPage';
import List from '@/pages/ListPage';
import Collection from '@/pages/CollectionPage';
import Mypage from '@/pages/Mypage';
import Login from '@/pages/LoginPage';
import Test from '@/pages/TestPage';
import LoginSuccess from '@/pages/LoginSuccess';
import useAuth from '@/store/useContext';
import { JSX } from 'react';
import Layout from '@/components/layout/Layout';
import DetailPage from '@/pages/DetailPage';
import RecordCreatePage from '@/pages/RecordCreatePage';
import LikePage from '@/pages/LikePage';

// 보호된 페이지 (로그인한 사용자만 접근 가능)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="login/success" element={<LoginSuccess />} />
      <Route element={<Layout />}>
        <Route
          element={
            <ProtectedRoute>
            <Outlet />
            </ProtectedRoute>
          }
        >
          <Route path="main" element={<Main />} />
          <Route path="list" element={<List />} />
          <Route path="collection" element={<Collection />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="detail/:whiskyId" element={<DetailPage />} />
          <Route path="/records/create" element={<RecordCreatePage />} />
          <Route path="/like" element={<LikePage />} />
        </Route>
      </Route>

      {/* 404 페이지 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
