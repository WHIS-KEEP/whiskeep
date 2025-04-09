// src/pages/LikePage.tsx
// Renders at /like (라우터 설정 필요)

import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Button } from '@/components/shadcn/Button';
import {
  fetchLikedWhiskies,
  LIKES_QUERY_KEY,
  LikedWhisky,
} from '@/lib/api/like';
import LikedWhiskyList from '@/components/ui/LikedWhiskyList';

export function LikePage() {
  const navigate = useNavigate();

  // React Query를 사용하여 찜 목록 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });

  // data가 undefined, null이거나 배열이 아닐 경우 빈 배열로 처리
  const likedItems: LikedWhisky[] = Array.isArray(data) ? data : [];

  // LikedWhiskyList 클릭 콜백 핸들러 (LikePage의 동작 구현)
  const handlePageItemClick = (item: LikedWhisky) => {
    // 재클릭 시 상세 페이지로 이동
    navigate(`/detail/${item.whiskyId}`);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p>찜 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center p-4 text-center">
        <p className="text-red-500 font-semibold mb-2">오류 발생</p>
        <p>찜 목록을 불러오는 데 실패했습니다.</p>
        <Button onClick={() => navigate('/main')} className="mt-4">
          메인으로 돌아가기
        </Button>
      </div>
    );
  }

  // 메인 컨텐츠 렌더링
  return (
    <div className="container bg-white rounded-[18px] flex flex-col flex-grow w-full p-4">
      <div className="mt-2 mb-4">
        <div className="flex items-center pl-1">
          <h1 className="text-xl font-semibold mr-4">나의 찜 리스트</h1>
          <div className="h-px bg-gray-200 flex-grow"></div>
        </div>
      </div>
      <LikedWhiskyList
        likedItems={likedItems}
        onItemClick={handlePageItemClick} // 페이지 동작을 정의한 핸들러 전달
      />
    </div>
  );
}

export default LikePage;
