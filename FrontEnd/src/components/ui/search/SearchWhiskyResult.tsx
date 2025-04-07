import { Button } from '@/components/shadcn/Button';
import { ScrollArea } from '@/components/shadcn/scroll-area';
import { cn } from '@/lib/util/utils';
import { Whisky } from '@/types/search';
import { Star } from 'lucide-react';
import exampleImage from '../../../assets/example.png';

interface Props {
  items: Whisky[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  height?: string;
}

export default function WhiskyListResult({
  items,
  selectedId,
  onSelect,
  height = '400px',
}: Props) {
  const formatCount = (count: number) =>
    count > 999 ? '(999+)' : `(${count})`;

  return (
    <ScrollArea className="w-full scrollbar-hide" style={{ height }}>
      {items.length > 0 ? (
        <div className="flex flex-col gap-2 p-1">
          {items.map((item) => (
            <Button
              key={item.id}
              variant="outline"
              className={cn(
                'h-auto w-full justify-start rounded-[14px] p-3 text-left flex items-center gap-4',
                selectedId === item.id
                  ? 'border-2 border-primary ring-1 ring-primary bg-accent'
                  : 'border hover:bg-accent/50',
              )}
              onClick={() => onSelect(item.id)}
            >
              <div className="w-14 h-18 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={item.whiskyImg || exampleImage}
                  alt={item.koName}
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex-grow flex flex-col justify-center gap-1">
                <p className="font-semibold text-base leading-normal truncate">
                  {item.koName}
                </p>
                {item.enName && (
                  <p className="text-sm text-muted-foreground leading-normal truncate">
                    {item.enName}
                  </p>
                )}
                <div className="flex items-center justify-between text-xs text-muted-foreground mt-1">
                  <span>
                    {item.type} {item.abv ? `| ${item.abv}%` : ''}
                  </span>
                  <div className="flex items-center gap-1">
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
