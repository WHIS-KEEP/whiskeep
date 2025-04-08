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
import RecordCreatePage from '@/pages/RecordCreatePage';
import PreferenceSurveyIntroPage from '@/pages/survey/PreferenceSurveyIntroPage';
import BeginnerSurveyPage from '@/pages/survey/BeginnerSurveyPage';
import FamiliarSurveyPage from '@/pages/survey/FamiliarSurveyPage';
import PreferenceCompletePage from '@/pages/survey/PreferenceCompletePage';

import WhiskyRecordPage from '@/pages/WhiskyRecordPage';
import LikePage from '@/pages/LikePage';
import DetailPage from '@/pages/DetailPage';
import OCR from '@/pages/OCR/OCR';
import ScanningPage from '@/pages/OCR/ScanningPage';
import ResultPage from '@/pages/OCR/ResultPage';

import useMemberStore from '@/store/useMemberStore';
import RecordDetailPage from '@/pages/RecordDetailPage';
import RecordEditPage from '@/pages/RecordEditPage';

// 보호된 페이지 (로그인한 사용자만 접근 가능)
const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth();
  return token ? children : <Navigate to="/login" replace />;
};

// 설문조사를 하기 전 사용자
const PreferenceProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const score = useMemberStore((state) => state.score);

  return score ? children : <Navigate to="/preference" replace />;
};

// 설문을 이미 한 사람은 접근 불가
const BlockIfAlreadyHasScore = ({ children }: { children: JSX.Element }) => {
  const score = useMemberStore((state) => state.score);
  return score ? <Navigate to="/main" replace /> : children;
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
      <Route
        path="/preference"
        element={
          <BlockIfAlreadyHasScore>
            <PreferenceSurveyIntroPage />
          </BlockIfAlreadyHasScore>
        }
      />
      <Route
        path="/preference/beginner"
        element={
          <BlockIfAlreadyHasScore>
            <BeginnerSurveyPage />
          </BlockIfAlreadyHasScore>
        }
      />
      <Route
        path="/preference/familiar"
        element={
          <BlockIfAlreadyHasScore>
            <FamiliarSurveyPage />
          </BlockIfAlreadyHasScore>
        }
      />
      <Route
        path="/preference/complete"
        element={
          <BlockIfAlreadyHasScore>
            <PreferenceCompletePage />
          </BlockIfAlreadyHasScore>
        }
      />

      <Route element={<Layout />}>
        <Route
          element={
            <ProtectedRoute>
              <PreferenceProtectedRoute>
                <Outlet />
              </PreferenceProtectedRoute>
            </ProtectedRoute>
          }
        >
          <Route path="main" element={<Main />} />
          <Route path="list" element={<List />} />
          <Route path="collection" element={<Collection />} />
          <Route path="mypage" element={<Mypage />} />
          <Route path="/records/create" element={<RecordCreatePage />} />
          <Route path="/records/:whiskyId" element={<WhiskyRecordPage />} />
          <Route path="/like" element={<LikePage />} />
          <Route path="detail/:whiskyId" element={<DetailPage />} />
          <Route path="/ocr" element={<OCR />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/scanning" element={<ScanningPage />} />
          <Route
            path="/records/:whiskyId/:recordId"
            element={<RecordDetailPage />}
          />
          <Route
            path="/records/:whiskyId/:recordId/edit"
            element={<RecordEditPage />}
          />
        </Route>
      </Route>

      {/* 404 페이지 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default Router;
