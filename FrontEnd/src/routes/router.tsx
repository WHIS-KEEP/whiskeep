import { Routes, Route, Outlet, Navigate } from 'react-router-dom';
import Home from '@/pages/HomePage';
import NotFound from '@/pages/NotFoundPage';
import Main from '@/pages/MainPage';
import List from '@/pages/ListPage';
import Collection from '@/pages/CollectionPage';
import Mypage from '@/pages/Mypage';
import Login from '@/pages/LoginPage';
import LoginSuccess from '@/pages/LoginSuccess';
import useAuth from '@/store/useContext';
import { JSX } from 'react';
import Layout from '@/components/layout/Layout';
import DetailPage from '@/pages/DetailPage';
import RecordCreatePage from '@/pages/RecordCreatePage';
import PreferenceSurveyIntroPage from '@/pages/preference/PreferenceSurveyIntroPage';
import BeginnerSurveyPage from '@/pages/preference/BeginnerSurveyPage';
import FamiliarSurveyPage from '@/pages/preference/FamiliarSurveyPage';
import PreferenceCompletePage from '@/pages/preference/PreferenceCompletePage';
import WhiskyRecordPage from '@/pages/WhiskyRecordPage';

// 보호된 페이지 (로그인한 사용자만 접근 가능)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// 로그인한 사용자는 접근 불가
const PublicRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? <Navigate to="/main" replace /> : children;
};

const Router = () => {
  return (
    <Routes>
      {/* 로그인한 사용자는 접근 불가 */}

      <Route
        path="/"
        element={
          <PublicRoute>
            <Home />
          </PublicRoute>
        }
      />

      <Route
        path="login"
        element={
          <PublicRoute>
            <Login />
          </PublicRoute>
        }
      />
      <Route
        path="login/success"
        element={
          <PublicRoute>
            <LoginSuccess />
          </PublicRoute>
        }
      />
      <Route path="/preference" element={<PreferenceSurveyIntroPage />} />
      <Route path="/preference/beginner" element={<BeginnerSurveyPage />} />
      <Route path="/preference/familiar" element={<FamiliarSurveyPage />} />
      <Route path="/preference/complete" element={<PreferenceCompletePage />} />

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
          {/* 새로 추가한 라우트 */}
          <Route path="detail/:whiskyId" element={<DetailPage />} />
          <Route path="/records/create" element={<RecordCreatePage />} />
          <Route path="/records/:whiskyId" element={<WhiskyRecordPage />} />
        </Route>
      </Route>

      {/* 404 페이지 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
