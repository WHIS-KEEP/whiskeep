import logo from '../../assets/logo.svg';
import { Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchLikedWhiskies, LIKES_QUERY_KEY } from '@/lib/api/like';

function Header() {
  const location = useLocation();

  // 찜 목록 데이터 가져오기
  const { data: likedWhiskies } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });

  // 찜 개수 계산 (배열이 없으면 0으로 처리)
  const likeCount = Array.isArray(likedWhiskies) ? likedWhiskies.length : 0;

  // 10개 이상이면 '9+'로 표시
  const displayCount = likeCount >= 10 ? '9+' : likeCount.toString();

  // 현재 경로에 따른 배경색 매핑
  const getBackgroundColor = () => {
    if (
      location.pathname.startsWith('/detail/') ||
      (location.pathname.startsWith('/records/') && !location.pathname.includes('/create'))
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
        <Link to="/like">
          <Heart size={30} className="text-primary" />
          {/* 찜 개수 표시 뱃지 */}
          {likeCount > 0 && (
            <span
              className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full text-xs text-white"
              style={{ backgroundColor: '#f87171 ' }}
            >
              {displayCount}
            </span>
          )}
        </Link>
      </div>
    </div>
  );
}

export default Header;
