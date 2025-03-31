import { Routes, Route } from 'react-router-dom';
import Home from '../pages/Home';
import NotFound from '../pages/NotFound';
import Navbar from '../components/layout/Navbar';
import Header from '@/components/layout/Header';
import Main from '../pages/Main';
import List from '@/pages/List';
import Collection from '@/pages/Collection';
import Mypage from '@/pages/Mypage';
import Login from '@/pages/Login';
// import Test from '@/pages/Test';
import Like from '@/pages/Like';
import Record from '@/pages/Record';
import RecordDetail from '@/pages/Record-detail';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Router = () => {
  return (
    <div className="mobile-container flex flex-col h-full">
      {/* 상단 헤더 */}
      <Header />
      {/* 메인 콘텐츠 (스크롤 영역) */}
      <ScrollArea className="flex-grow bg-bg-muted">
        <div style={{ paddingBottom: '150px' }}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="*" element={<NotFound />} />
            <Route path="main" element={<Main />} />
            <Route path="list" element={<List />} />
            <Route path="collection" element={<Collection />} />
            <Route path="mypage" element={<Mypage />} />
            <Route path="login" element={<Login />} />
            {/* <Route path="test" element={<Test />} /> */}
            <Route path="like" element={<Like />} />
            <Route path="record" element={<Record />} />
            <Route path="record-detail" element={<RecordDetail />} />
          </Routes>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>

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
