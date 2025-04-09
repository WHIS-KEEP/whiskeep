import { Button } from '@/components/shadcn/Button';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { cn } from '@/lib/util/utils';
import { Whisky } from '@/types/search';
import { Star } from 'lucide-react';
import exampleImage from '../../../assets/example.png';
import { useEffect, useRef, useState } from 'react';

interface Props {
  items: Whisky[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  height?: string;
  onLoadMore: () => void;
  hasNext: boolean;
  shouldScrollToTops?: boolean;
}

export default function WhiskyListResult({
  items,
  selectedId,
  onSelect,
  onLoadMore,
  hasNext,
  shouldScrollToTops,
}: Props) {
  const loaderRef = useRef<HTMLDivElement | null>(null);
  const viewportRef = useRef<HTMLDivElement | null>(null);
  const [isScrolling, setIsScrolling] = useState(false);
  const [prevItemsLength, setPrevItemsLength] = useState(0);

  const formatCount = (count: number) =>
    count > 999 ? '(999+)' : `(${count})`;
    
  // 긴 텍스트 자르기 함수
  const truncateText = (text: string, limit: number) => {
    if (!text) return '';
    return text.length > limit ? text.substring(0, limit) + '...' : text;
  };

  // 스크롤을 Top으로 올리는 로직 - 필터 변경 시에만 작동하도록 수정
  useEffect(() => {
    if (
      shouldScrollToTops &&
      viewportRef.current &&
      items.length !== prevItemsLength
    ) {
      // 필터 변경으로 인한 새 결과일 때만 스크롤 초기화
      viewportRef.current.scrollTop = 0;
    }

    // 아이템 길이가 변경되면 저장
    if (items.length !== prevItemsLength) {
      setPrevItemsLength(items.length);
    }
  }, [shouldScrollToTops, items.length, prevItemsLength]);

  // IntersectionObserver 로직 개선
  useEffect(() => {
    const target = loaderRef.current;
    const root = viewportRef.current;

    if (!target || !root || !hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isScrolling) {
          setIsScrolling(true);
          onLoadMore();
          // 스크롤 요청 후 짧은 딜레이를 두어 중복 요청 방지
          setTimeout(() => {
            setIsScrolling(false);
          }, 300);
        }
      },
      {
        root,
        rootMargin: '100px', // 더 일찍 감지하도록 마진 증가
        threshold: 0.1, // 임계값 낮춤
      },
    );

    observer.observe(target);

    return () => {
      observer.disconnect();
    };
  }, [hasNext, onLoadMore, isScrolling, items.length]);

  // 스크롤 이벤트 핸들러 추가
  useEffect(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;

    const handleScroll = () => {
      // 스크롤 끝에 가까워지면 추가 로드 (IntersectionObserver 보완)
      const isNearBottom =
        viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight <
        100;

      if (isNearBottom && hasNext && !isScrolling) {
        setIsScrolling(true);
        onLoadMore();
        setTimeout(() => setIsScrolling(false), 300);
      }
    };

    viewport.addEventListener('scroll', handleScroll);
    return () => viewport.removeEventListener('scroll', handleScroll);
  }, [hasNext, onLoadMore, isScrolling]);

  return (
    <ScrollArea
      className="w-full max-w-[var(--mobile-width)] overflow-y-auto pb-10"
      style={{ height: '100%' }}
      viewportRef={viewportRef}
    >
      {items.length > 0 ? (
        <div className="flex flex-col gap-2 p-1">
          {items.map((item) => (
            <Button
              key={item.whiskyId}
              variant="outline"
              className={cn(
                'w-full max-w-full h-[90px] p-3 text-left flex items-center gap-4 rounded-[14px]',
                selectedId === item.whiskyId
                  ? 'border-2 border-primary ring-1 ring-primary bg-accent'
                  : 'border hover:bg-accent/50',
              )}
              onClick={() => onSelect(item.whiskyId)}
            >
              {/* 이미지 영역 - 고정 크기 */}
              <div className="w-14 h-16 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.whiskyImg || exampleImage}
                  alt={item.koName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 메인 컨테이너 - 수직 중앙 정렬 */}
              <div className="flex-grow flex flex-col justify-center min-w-0 max-w-[calc(100%-80px)] h-full">
                {/* 상단 영역: 이름 */}
                <div className="w-full">
                  {/* 한글 이름 */}
                  <p className="font-semibold text-base leading-tight">
                    {truncateText(item.koName, 30)}
                  </p>
                  
                  {/* 영문 이름 */}
                  {item.enName && (
                    <p className="text-sm text-muted-foreground">
                      {truncateText(item.enName, 35)}
                    </p>
                  )}
                </div>
                
                {/* 하단 영역: 타입 정보와 별점 */}
                <div className="flex items-center justify-between w-full mt-1">
                  {/* 타입 정보 */}
                  <div className="text-xs text-muted-foreground max-w-[60%] overflow-hidden text-ellipsis whitespace-nowrap">
                    {item.type} {item.abv ? `| ${item.abv}%` : ''}
                  </div>
                  
                  {/* 별점 영역 - 오른쪽으로 배치 */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm font-medium">{item.avgRating.toFixed(1)}</span>
                    <span className="text-xs text-muted-foreground">
                      {formatCount(item.recordCounts)}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {/* 무한 스크롤 감지 영역 */}
          <div
            ref={loaderRef}
            className="h-10 flex items-center justify-center"
          >
            {hasNext && items.length > 0 && (
              <div className="w-6 h-6 border-t-2 border-primary rounded-full animate-spin" />
            )}
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
    </ScrollArea>
  );
}