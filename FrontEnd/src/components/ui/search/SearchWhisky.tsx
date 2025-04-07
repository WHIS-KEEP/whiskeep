import { Input } from '@/components/shadcn/input';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/toggle/toggle-group';
import { Whisky } from '@/types/search';
import { Search } from 'lucide-react';
import { useEffect, useState } from 'react';

type SortCriteria = 'rating_desc' | 'rating_asc' | 'records_desc';

const sortOptions: { value: SortCriteria; label: string }[] = [
  { value: 'rating_desc', label: '별점 높은 순' },
  { value: 'rating_asc', label: '별점 낮은 순' },
  { value: 'records_desc', label: '기록 많은 순' },
];

interface Props {
  data: Whisky[];
  onSelect?: (id: number) => void;
  onFilteredChange?: (items: Whisky[]) => void;
  height?: string;
  hideTitle?: boolean;
}

export default function SearchWhiskyContent({
  data,
  onFilteredChange,
  hideTitle = false,
}: Props) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgeRange, setSelectedAgeRange] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<SortCriteria>('rating_desc');

  const typeOptions = [
    { value: 'SINGLE_MALT', label: '싱글 몰트' },
    { value: 'BLENDED', label: '블렌디드' },
    { value: 'BOURBON', label: '버번' },
    { value: 'TENNESSEE', label: '테네시' },
    { value: 'RYE', label: '라이' },
    { value: 'GIN', label: '진' },
    { value: 'SINGLE_GRAIN', label: '싱글 그레인' },
    { value: 'LIQUEUR', label: '리큐르' },
    { value: 'OTHER', label: '기타' },
  ];

  const processedResults = data
    .filter((item) => {
      const term = searchTerm.toLowerCase();

      const nameMatch =
        item.koName.toLowerCase().includes(term) ||
        (item.enName?.toLowerCase().includes(term) ?? false);

      const ageMatch =
        !selectedAgeRange ||
        (() => {
          const age = item.age ?? 0;
          const selectedAgeRangeNum = Number(selectedAgeRange);

          switch (selectedAgeRangeNum) {
            case 10:
              return age <= 10;
            case 12:
              return age > 10 && age <= 12;
            case 15:
              return age > 12 && age <= 15;
            case 18:
              return age > 15 && age <= 18;
            case 19:
              return age > 18;
            default:
              return true;
          }
        })();

      const typeMatch = !selectedType || item.type === selectedType;

      return nameMatch && ageMatch && typeMatch;
    })
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'rating_desc':
          return b.avgRating - a.avgRating;
        case 'rating_asc':
          return a.avgRating - b.avgRating;
        case 'records_desc':
          return b.recordCounts - a.recordCounts;
        default:
          return 0;
      }
    });

  useEffect(() => {
    // processedResults가 실제로 바뀐 경우에만
    if (onFilteredChange) {
      onFilteredChange(processedResults);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchTerm, selectedAgeRange, selectedType, sortCriteria]);

  return (
    <div className="flex flex-col w-full">
      {!hideTitle && (
        <h2 className="mb-2 text-base font-semibold">위스키 검색</h2>
      )}
      {/* Search Input */}
      <div className="relative mb-4 mt-2">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="위스키, 양조장 검색"
          className="h-11 text-lg rounded-[18px] pl-12"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Age Filter */}
      <div className="flex items-center gap-4 p-2">
        <p className="text-base font-medium text-muted-foreground flex-shrink-0">
          숙성 연도
        </p>
        <ScrollArea
          className="w-full overflow-x-auto cursor-grab"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
          }}
        >
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={selectedAgeRange ?? ''}
            onValueChange={(value) => setSelectedAgeRange(value || null)}
            className="flex justify-start gap-1.5"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {['10', '12', '15', '18', '19'].map((age) => (
              <ToggleGroupItem
                key={age}
                value={age}
                className="rounded-[20px] h-8 px-5 text-base data-[state=on]:bg-primary data-[state=on]:text-primary-foreground border"
              >
                {age === '10'
                  ? '10년산 이하'
                  : age === '12'
                    ? '12년산'
                    : age === '15'
                      ? '15년산'
                      : age === '18'
                        ? '18년산'
                        : age === '19'
                          ? '19년산 이상'
                          : ''}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ScrollBar orientation="horizontal" className="h-1" />
        </ScrollArea>
      </div>

      {/* Type Filter */}
      <div className="flex items-center gap-4 p-2">
        <p className="text-base font-medium text-muted-foreground flex-shrink-0">
          타입
        </p>
        <ScrollArea
          className="w-full overflow-x-auto scrollbar-hide cursor-grab -mx-1 px-1"
          style={{
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none', // Firefox
          }}
        >
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={selectedType ?? ''}
            onValueChange={(value) => setSelectedType(value || null)}
            className="flex justify-start gap-1.5"
            style={{ scrollSnapType: 'x mandatory' }}
          >
            {typeOptions.map(({ value, label }) => (
              <ToggleGroupItem
                key={value}
                value={value}
                className="rounded-[20px] h-8 px-5 text-base data-[state=on]:bg-primary-50 data-[state=on]:text-primary-foreground border"
              >
                {label}
              </ToggleGroupItem>
            ))}
          </ToggleGroup>
          <ScrollBar orientation="horizontal" className="h-0" />
        </ScrollArea>
      </div>

      {/* Sort */}
      <div className="m-2 w-full flex justify-end items-center p-2">
        <Select
          value={sortCriteria}
          onValueChange={(v) => setSortCriteria(v as SortCriteria)}
        >
          <SelectTrigger className="w-auto h-5 text-sm px-1 border-none focus:ring-0 bg-transparent text-muted-foreground hover:text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-sm min-h-[1.5rem]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
