import { Button } from '@/components/shadcn/Button';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { cn } from '@/lib/util/utils';
import { Whisky } from '@/types/search';
import { Star } from 'lucide-react';
import exampleImage from '../../../assets/example.png';
import { useEffect, useRef } from 'react';

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

  const formatCount = (count: number) =>
    count > 999 ? '(999+)' : `(${count})`;

  useEffect(() => {
    if (shouldScrollToTops && viewportRef.current) {
      viewportRef.current.scrollTop = 0;
    }

    const target = loaderRef.current;
    const root = viewportRef.current;

    if (!target || !root || !hasNext) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMore();
        }
      },
      {
        root,
        rootMargin: '0px',
        threshold: 0.5,
      },
    );

    observer.observe(target);

    return () => {
      observer.unobserve(target);
      observer.disconnect();
    };
  }, [items.length, hasNext, shouldScrollToTops, onLoadMore]);

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
                'w-full max-w-full h-auto p-3 text-left flex items-center gap-4 rounded-[14px] overflow-hidden',
                selectedId === item.whiskyId
                  ? 'border-2 border-primary ring-1 ring-primary bg-accent'
                  : 'border hover:bg-accent/50',
              )}
              onClick={() => onSelect(item.whiskyId)}
            >
              {/* 이미지 영역 */}
              <div className="w-14 h-18 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.whiskyImg || exampleImage}
                  alt={item.koName}
                  className="w-full h-full object-contain"
                />
              </div>

              {/* 텍스트 영역 */}
              <div className="flex-grow flex flex-col justify-center gap-1 min-w-0 overflow-hidden">
                <p className="font-semibold text-base leading-normal truncate">
                  {item.koName}
                </p>
                {item.enName && (
                  <p className="text-sm text-muted-foreground leading-normal truncate">
                    {item.enName}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span className="truncate">
                    {item.type} {item.abv ? `| ${item.abv}%` : ''}
                  </span>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Star className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                    <span className="text-sm">{item.avgRating.toFixed(1)}</span>
                    <span className="ml-0.5 text-xs">
                      {formatCount(item.recordCounts)}
                    </span>
                  </div>
                </div>
              </div>
            </Button>
          ))}
          {/* 무한 스크롤 감지 영역 */}
          <div ref={loaderRef} className="h-6" />
        </div>
      ) : (
        <div className="flex items-center justify-center h-full">
          <p className="text-sm text-muted-foreground">검색 결과가 없습니다.</p>
        </div>
      )}
      {/* <ScrollBar orientation="vertical" className="hidden" /> */}
    </ScrollArea>
  );
}
