import logo from '../../assets/logo.svg';
import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();

  // 현재 경로에 따른 배경색 매핑
  const getBackgroundColor = () => {

    if (
      location.pathname.startsWith('/detail/') ||
      location.pathname.startsWith('/records/')
    ) {
      return 'bg-white'; // 디테일 페이지와 records 페이지는 흰색 배경
    }
    return 'bg-bg-muted'; // 기본 배경색
  };

  return (
    <div
      className={`flex items-center justify-between ${getBackgroundColor()} `}
      style={{ padding: '1.25rem' }}
    >
      <Link to="/main">
        <div className="flex items-center ">
          <img src={logo} alt="Wiskeep" className="h-7 w-auto" />
        </div>
      </Link>

      <div className="relative inline-flex">
        <Heart size={24} />
        {/* 숫자 뱃지 - 나중에 동적으로 변경될 카운트, 나중에 기능 수정 */}
        <span
          className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
          style={{ backgroundColor: '#D42B2B' }}
        >
          1
        </span>
      </div>
    </div>
  );
}

export default Header;
