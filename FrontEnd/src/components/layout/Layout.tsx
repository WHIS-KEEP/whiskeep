import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Navbar from './Navbar';

const Layout = () => {
  const location = useLocation();
  const hideLayout = location.pathname === '/login'; // 필요한 경우 더 추가 가능

  return (
    <div className="flex flex-col h-full">
      {!hideLayout && <Header />}
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
      {!hideLayout && <Navbar />}
    </div>
  );
};

export default Layout;
