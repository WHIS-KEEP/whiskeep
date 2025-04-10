import { useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { Button } from '@/components/shadcn/Button';
import { cn } from '@/lib/util/utils';
import { Droplets } from 'lucide-react';
import { LikedWhisky } from '@/lib/api/like';
import HeartButton from '@/components/ui/Heart';

interface LikedWhiskyListProps {
  likedItems: LikedWhisky[];
  onItemClick: (item: LikedWhisky) => void;
  className?: string;
  cardWidthClass?: string;
}

export default function LikedWhiskyList({
  likedItems,
  onItemClick,
  className,
}: LikedWhiskyListProps) {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);

  // 위스키 타입에 따른 배지 스타일 정의 (프로젝트 색상 시스템 활용)
  const getTypeBadgeStyle = (type: string) => {
    switch (type?.toLowerCase()) {
      default:
        return 'bg-[var(--primary-30)] text-[var(--primary-dark)]';
    }
  };

  const handleSelect = (whiskyId: number) => {
    setSelectedId(whiskyId);
    const selectedItem = likedItems.find((item) => item.whiskyId === whiskyId);
    if (selectedItem) {
      onItemClick(selectedItem);
    }
  };

  const navigate = useNavigate();

  return (
    <ScrollArea
      className={cn('w-full overflow-y-auto pb-10', className)}
      style={{ height: '100%' }}
      viewportRef={viewportRef}
    >
      {likedItems.length > 0 ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-3">
          {likedItems.map((item) => (
            <div
              key={item.whiskyId}
              className={cn(
                'bg-[var(--bg-muted)] overflow-hidden rounded-xl border cursor-pointer transition-all duration-200',
                selectedId === item.whiskyId
                  ? 'ring-2 ring-[var(--point-red)] border-[var(--point-red)] scale-[1.02]'
                  : 'border-[var(--text-muted-20)] hover:border-[var(--text-muted-40)] hover:shadow-sm',
              )}
              onClick={() => handleSelect(item.whiskyId)}
            >
              {/* 카드 레이아웃 */}
              <div className="flex flex-col h-full">
                {/* 이미지 영역 */}
                <div className="relative w-full pt-[100%] bg-[var(--bg)]">
                  {/* 이미지 컨테이너 */}
                  <div className="absolute inset-0 p-3 flex items-center justify-center">
                    <img
                      src={item.whiskyImg || '/api/placeholder/120/120'}
                      alt={item.koName}
                      className="object-contain max-h-full max-w-full"
                    />
                  </div>

                  {/* 찜 아이콘 */}
                  <div className="absolute top-2 right-2">
                    <HeartButton
                      whiskyId={item.whiskyId}
                      forceLikedState={true}
                      buttonClassName="w-[24px] h-[24px] p-0"
                      heartIconClassName="size-8"
                    />
                  </div>

                  {/* ABV 배지 */}
                  {item.abv && (
                    <div className="absolute bottom-2 left-2 flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-white/70 backdrop-blur-sm">
                      <Droplets className="w-3 h-3 text-[var(--primary)]" />
                      <span className="text-xs font-medium text-[var(--text-main)]">
                        {item.abv}%
                      </span>
                    </div>
                  )}
                </div>

                {/* 정보 영역 */}
                <div className="p-2 flex flex-col flex-grow">
                  {/* 한글 이름 */}
                  <h3 className="font-medium text-sm text-[var(--text-main)] line-clamp-1">
                    {item.koName}
                  </h3>

                  {/* 영문 이름 */}
                  {item.enName && (
                    <p className="text-xs text-[var(--text-muted)] line-clamp-1 mb-1.5">
                      {item.enName}
                    </p>
                  )}

                  {/* 하단 영역 */}
                  <div className="flex items-center justify-between mt-auto">
                    {/* 위스키 타입 */}
                    {item.type && (
                      <span
                        className={cn(
                          'inline-block px-1.5 py-0.5 rounded-full text-xs font-medium',
                          getTypeBadgeStyle(item.type),
                        )}
                      >
                        {item.type}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center h-full gap-3 py-12">
          <div className="p-4 rounded-full bg-[var(--bg)]">
            <HeartButton
              whiskyId={undefined}
              forceLikedState={false}
              buttonClassName="w-[40px] h-[40px] flex items-center justify-center"
              heartIconClassName="w-8 h-8 text-[var(--text-muted-40)]"
            />
          </div>
          <p className="text-base font-medium text-[var(--text-main)]">
            찜한 위스키가 없습니다
          </p>
          <p className="text-sm text-[var(--text-muted)]">
            마음에 드는 위스키를 찜해보세요
          </p>
          <Button
            variant="outline"
            className="mt-3 text-sm border-[var(--primary)] text-[var(--primary)] hover:bg-[var(--primary-30)] cursor-pointer"
            onClick={() => navigate('/list')}
            /* 위스키 탐색 페이지로 이동 */
          >
            위스키 둘러보기
          </Button>
        </div>
      )}
    </ScrollArea>
  );
}
