import { useState } from 'react';
import { cn } from '@/lib/util/utils';
import Whiskycard from '@/components/ui/Whiskycard';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { LikedWhisky } from '@/lib/api/like'; // LikedWhisky 타입 임포트

interface LikedWhiskyGridProps {
  likedItems: LikedWhisky[];
  onItemClick: (item: LikedWhisky) => void;
  cardWidthClass?: string; // 카드 너비 클래스를 prop으로 받음 (선택적)
}

export function LikedWhiskyList({
  likedItems,
  onItemClick,
  cardWidthClass, // prop 받기
}: LikedWhiskyGridProps) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);

  const handleClick = (item: LikedWhisky) => {
    setSelectedItemId(item.whiskyId);
    onItemClick(item);
  };

  // 기본 카드 너비 클래스 (prop이 없을 경우 사용)
  const defaultCardWidth = 'w-[170px]';

  return (
    // ScrollArea와 내부 그리드 로직
    <ScrollArea className="w-full flex-grow rounded-md min-h-[70vh]">
      {likedItems.length === 0 ? (
        <div className="flex items-center justify-center h-[70vh] w-full text-gray-500">
          찜한 위스키가 없습니다.
        </div>
      ) : (
        <div className="flex justify-center ">
          {/* 반응형 간격 재조정: 기본(모달) gap-x-2, sm 이상(페이지) gap-x-4 */}
          <div className="grid grid-cols-2 gap-x-2 sm:gap-x-   gap-y-4 w-full pt-2 px-2 pb-10 justify-items-center">
            {likedItems.map((item) => (
              <Whiskycard
                key={item.whiskyId}
                className={cn(
                  'cursor-pointer',
                  // 전달받은 cardWidthClass 사용, 없으면 기본값 사용
                  cardWidthClass || defaultCardWidth,
                  'h-auto rounded-[18px] border p-0', // 높이와 다른 스타일 유지
                  'transition-transform duration-200 ease-in-out',
                  selectedItemId === item.whiskyId
                    ? 'scale-105 shadow-lg'
                    : 'scale-100 border-gray-200 hover:shadow-md',
                )}
                onClick={() => handleClick(item)}
                koName={item.koName}
                abv={item.abv}
                type={item.type} // type prop 전달
                whiskyImage={item.whiskyImg ? item.whiskyImg : undefined}
                whiskyId={item.whiskyId}
                showLikeButton={true} // 찜 목록이므로 찜 버튼 표시
                showChart={false}
                forceLikedState={true} // 찜 목록이므로 항상 true
              />
            ))}
          </div>
        </div>
      )}
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
}

export default LikedWhiskyList;
