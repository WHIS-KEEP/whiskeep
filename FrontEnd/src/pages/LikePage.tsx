// src/pages/WishlistPage.tsx (또는 LikePage.tsx)
// Renders at /like (라우터 설정 필요)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/util/utils';
import Btn from '@/components/ui/Btn'; // 커스텀 버튼
import { Button } from '@/components/shadcn/button'; // shadcn/ui Button
import Whiskycard from '@/components/ui/Whiskycard'; // Whiskycard 컴포넌트 경로 확인
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'; // ScrollArea, ScrollBar 임포트 추가

// --- 더미 데이터 ---
const dummyWishlistItems = Array.from({ length: 15 }, (_, i) => ({
  id: `wish_${i + 1}`,
  imageUrl: `/images/whisky-placeholder.png`,
  name: `찜한 위스키 ${i + 1}`,
  rating: Math.round((4 + Math.random()) * 10) / 10,
}));
// --- 더미 데이터 끝 ---

export function WishlistPage() {
  // 컴포넌트 이름 변경 (e.g., LikePage) 가능
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleConfirm = () => {
    console.log('선택된 아이템 ID:', selectedItemId);
    // TODO: 선택된 아이템 ID로 작업 수행
    navigate('/Main'); // 메인 페이지로 이동
  };

  const handleCancel = () => {
    navigate('/Main'); // 메인 페이지로 이동
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="container mx-auto flex h-screen max-w-md flex-col p-4">
      {' '}
      {/* 페이지 컨테이너 */}
      {/* 1. 상단 텍스트 */}
      <h1 className="mb-4 text-xl font-semibold">나의 찜 리스트</h1>
      {/* 2. 찜 리스트 (스크롤 영역) */}
      {/* ScrollArea 컴포넌트로 교체 */}
      <ScrollArea className="w-full flex-grow rounded-md border">
        <div className="grid grid-cols-2 gap-3 p-2">
          {dummyWishlistItems.map((item) => (
            <Button // Button으로 감싸서 선택 기능 구현
              key={item.id}
              variant="outline"
              className={cn(
                'h-auto w-full rounded-[10px] border p-0', // 내부 패딩 0
                'transition-all duration-150 ease-in-out',
                selectedItemId === item.id
                  ? 'border-2 border-black ring-1 ring-black'
                  : 'border-gray-200 hover:bg-gray-50',
              )}
              onClick={() => handleSelectItem(item.id)}
            >
              <Whiskycard
                // Whiskycard props (실제 컴포넌트에 맞게 조정 필요)
                title={item.name}
                description={`${item.rating}/5.0`}
                // imageUrl={item.imageUrl} // 필요시 사용
              />
            </Button>
          ))}
          {/* TODO: 무한 스크롤 로직 구현 */}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {/* 3. 하단 버튼 */}
      <div className="mt-4 flex w-full shrink-0 justify-center gap-3 border-t pt-4">
        {' '}
        {/* 상단 테두리 및 패딩 추가 */}
        <Btn
          size="m"
          //   variant="outline" // Btn 컴포넌트가 variant="outline" 지원 가정
          text="취소"
          onClick={handleCancel}
        />
        <Btn
          size="m"
          // variant="default" // Btn 컴포넌트가 기본 variant 지원 가정
          text="선택"
          onClick={handleConfirm}
          //   disabled={!selectedItemId}
        />
      </div>
    </div>
  );
}

export default WishlistPage; // 또는 export default LikePage;
