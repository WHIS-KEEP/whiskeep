// src/pages/LikePage.tsx
// Renders at /like (라우터 설정 필요)

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { cn } from '@/lib/util/utils';
import { Button } from '@/components/shadcn/Button';
import Whiskycard from '@/components/ui/Whiskycard';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import {
  fetchLikedWhiskies,
  LIKES_QUERY_KEY,
  LikedWhisky,
} from '@/lib/api/like';

export function LikePage() {
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  // React Query를 사용하여 찜 목록 데이터 가져오기
  const { data, isLoading, isError } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });

  // 디버깅용: 데이터 로딩 확인
  useEffect(() => {
    console.log('LikePage data:', data);
  }, [data]);

  // data가 undefined, null이거나 배열이 아닐 경우 빈 배열로 처리
  const likedItems: LikedWhisky[] = Array.isArray(data) ? data : [];

  const handleSelectItem = (whiskyId: number) => {
    setSelectedItemId((prevId) => {
      if (prevId === whiskyId) {
        // 이미 선택된 아이템을 다시 클릭하면 디테일 페이지로 이동
        navigate(`/records/${whiskyId}`);
        return null;
      }
      return whiskyId;
    });
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="container mx-auto flex h-screen max-w-md flex-col items-center justify-center p-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mb-4"></div>
        <p>찜 목록을 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="container mx-auto flex h-screen max-w-md flex-col items-center justify-center p-4 text-center">
        <p className="text-red-500 font-semibold mb-2">오류 발생</p>
        <p>찜 목록을 불러오는 데 실패했습니다.</p>
        <Button onClick={() => navigate('/main')} className="mt-4">
          메인으로 돌아가기
        </Button>
      </div>
    );
  }

  return (
    <div className="container bg-white rounded-[18px] flex h-screen w-full flex-col p-4">
      <h1 className="mb-4 text-xl pl-1 font-semibold pb-4">나의 찜 리스트</h1>
      <ScrollArea className="w-full flex-grow rounded-md">
        {likedItems.length === 0 ? (
          <div className="flex items-center justify-center h-40 text-gray-500">
            찜한 위스키가 없습니다.
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 w-full">
              {likedItems.map((item) => (
                <div
                  key={item.whiskyId}
                  className="flex justify-center items-center"
                >
                  <Button
                    variant="outline"
                    className={cn(
                      'h-auto w-[180px] rounded-[18px] border p-0',
                      'transition-all duration-150 ease-in-out',
                      selectedItemId === item.whiskyId
                        ? 'border-2 border-black ring-1 ring-black'
                        : 'border-gray-200 hover:bg-gray-50',
                    )}
                    onClick={() => handleSelectItem(item.whiskyId)}
                  >
                    <Whiskycard
                      title={item.koName}
                      description={`${item.abv}%`}
                      whiskyImage={item.whiskyImg ? item.whiskyImg : undefined}
                      whiskyId={item.whiskyId}
                      showLikeButton={true}
                      showChart={false}
                    />
                  </Button>
                </div>
              ))}
            </div>
          </div>
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </div>
  );
}

export default LikePage;
