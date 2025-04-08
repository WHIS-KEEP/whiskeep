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
    // console.log('LikePage data:', data); // 필요 시 주석 해제
  }, [data]);

  // data가 undefined, null이거나 배열이 아닐 경우 빈 배열로 처리
  const likedItems: LikedWhisky[] = Array.isArray(data) ? data : [];

  const handleSelectItem = (whiskyId: number) => {
    setSelectedItemId((prevId) => {
      // 이미 선택된 아이템을 다시 클릭하면 상세 기록 페이지로 이동
      if (prevId === whiskyId) {
        navigate(`/records/${whiskyId}`);
        return null; // 선택 해제
      }
      // 새로운 아이템 선택
      return whiskyId;
    });
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
      <h1 className="mb-4 text-xl pl-1 font-semibold pb-2 flex-shrink-0">
        나의 찜 리스트
      </h1>
      <ScrollArea className="w-full flex-grow rounded-md">
        {likedItems.length === 0 ? (
          <div className="flex items-center justify-center h-full pb-10 text-gray-500">
            찜한 위스키가 없습니다.
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="grid grid-cols-2 gap-x-4 gap-y-6 w-full pt-2 px-2 pb-10">
              {likedItems.map((item) => (
                <Whiskycard
                  key={item.whiskyId}
                  className={cn(
                    'cursor-pointer',
                    'h-auto w-[180px] rounded-[18px] border p-0', // 기본 레이아웃 및 테두리
                    'transition-transform duration-200 ease-in-out', // transform(scale)에 대한 transition 추가
                    selectedItemId === item.whiskyId
                      ? 'scale-105 shadow-lg' // 선택 시 확대 및 그림자 효과
                      : 'scale-100 border-gray-200 hover:shadow-md', // 기본 상태 및 호버 시 약간의 그림자
                  )}
                  onClick={() => handleSelectItem(item.whiskyId)}
                  title={item.koName}
                  description={`${item.abv}%`}
                  whiskyImage={item.whiskyImg ? item.whiskyImg : undefined}
                  whiskyId={item.whiskyId}
                  showLikeButton={true}
                  showChart={false}
                />
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
