import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Navbar from '../components/layout/Navbar';
import Header from '@/components/layout/Header';
import Main from '../pages/Main';
import List from '@/pages/List';
import Collection from '@/pages/Collection';
import Mypage from '@/pages/Mypage';

const Router = () => {
  return (
    <div className="mobile-container flex flex-col h-full">
      {/* 상단 헤더 */}
      <Header />
      {/* 메인 콘텐츠 (스크롤 영역) */}
      <div
        className="flex-grow overflow-auto"
        style={{ padding: '1.25rem', paddingBottom: '150px' }}
      >
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="*" element={<NotFound />} />
          <Route path="main" element={<Main />} />
          <Route path="list" element={<List />} />
          <Route path="collection" element={<Collection />} />
          <Route path="mypage" element={<Mypage />} />
          {/* <Route path="login" element={<Login />} /> */}
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
