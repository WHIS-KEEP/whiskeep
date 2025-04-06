// src/pages/SearchPage.tsx
// Renders at /search (라우터 설정 필요)

import { useState } from 'react';
// import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/util/utils';
import { Button } from '@/components/shadcn/Button'; // shadcn/ui Button
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
import { Star, Search } from 'lucide-react';

// --- Sorting Criteria Definition ---
type SortCriteria =
  | 'popularity_desc'
  | 'rating_desc'
  | 'rating_asc'
  | 'records_desc';

const sortOptions: { value: SortCriteria; label: string }[] = [
  { value: 'popularity_desc', label: '인기순' },
  { value: 'rating_desc', label: '별점 높은 순' },
  { value: 'rating_asc', label: '별점 낮은 순' },
  { value: 'records_desc', label: '기록 많은 순' },
];

// --- 더미 데이터 ---
const dummySearchResults = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  name: `더미 위스키 ${i + 1}`,
  enName: `Dummy Whisky ${i + 1}`,
  type: i % 3 === 0 ? '싱글 몰트' : i % 3 === 1 ? '버번' : '블렌디드',
  country:
    i % 4 === 0
      ? '스코틀랜드'
      : i % 4 === 1
        ? '미국'
        : i % 4 === 2
          ? '아일랜드'
          : '캐나다',
  avgRating: Math.round((3.0 + Math.random() * 1.9) * 10) / 10,
  recordCounts: Math.floor(Math.random() * 1500),
  popularity: Math.floor(Math.random() * 500),
  abv: Math.floor(40 + Math.random() * 10),
}));

export function SearchPage() {
  // const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] =
    useState<SortCriteria>('popularity_desc');

  const countries = ['미국', '아일랜드', '캐나다', '스코틀랜드'];
  const types = ['버번', '싱글 몰트', '그레인', '블렌디드 몰트'];

  const handleSelectItem = (id: number) => {
    setSelectedItemId(id.toString());
  };

  const handleCountryChange = (value: string) =>
    setSelectedCountry(value || null);
  const handleTypeChange = (value: string) => setSelectedType(value || null);

  const processedResults = dummySearchResults
    .filter((item) => {
      const searchTermMatch =
        !searchTerm ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.enName &&
          item.enName.toLowerCase().includes(searchTerm.toLowerCase()));
      const countryMatch = !selectedCountry || item.country === selectedCountry;
      const typeMatch = !selectedType || item.type === selectedType;
      return searchTermMatch && countryMatch && typeMatch;
    })
    .sort((a, b) => {
      switch (sortCriteria) {
        case 'rating_desc':
          return b.avgRating - a.avgRating;
        case 'rating_asc':
          return a.avgRating - b.avgRating;
        case 'records_desc':
          return b.recordCounts - a.recordCounts;
        case 'popularity_desc':
          return (b.popularity ?? 0) - (a.popularity ?? 0);
        default:
          return 0;
      }
    });

  const formatCount = (count: number): string => {
    return count > 999 ? '(999+)' : `(${count})`;
  };

  return (
    <div className="container rounded-[18px] bg-white mx-auto flex h-[calc(100vh-150px)] flex-col p-4">
      {/* 페이지 제목 */}
      <h1 className="mb-4 text-xl font-semibold">위스키 검색</h1>
      {/* 1. 검색창 - SearchWhiskyDialogContent와 동일한 스타일 */}
      <div className="relative mb-3">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
        <Input
          type="search"
          placeholder="위스키 이름을 검색하세요..."
          className="h-9 text-sm rounded-[18px] pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      {/* 2. 필터 영역 - ToggleGroup으로 변경 */}
      <div className="mb-1 flex flex-col gap-1">
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-muted-foreground flex-shrink-0">
            국가별
          </p>
          <ScrollArea className="w-full whitespace-nowrap rounded-md pb-1">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={selectedCountry ?? ''}
              onValueChange={handleCountryChange}
              className="flex justify-start gap-1.5"
            >
              {countries.map((country) => (
                <ToggleGroupItem
                  key={country}
                  value={country}
                  className="rounded-[20px] h-6 px-4 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex-shrink-0 border"
                  aria-label={`Filter by ${country}`}
                >
                  {country}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
        </div>
        <div className="flex items-center gap-1.5">
          <p className="text-xs font-medium text-muted-foreground flex-shrink-0">
            타입별
          </p>
          <ScrollArea className="w-full whitespace-nowrap rounded-">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={selectedType ?? ''}
              onValueChange={handleTypeChange}
              className="flex justify-start gap-1.5"
            >
              {types.map((type) => (
                <ToggleGroupItem
                  key={type}
                  value={type}
                  className="rounded-[20px] h-6 px-4 text-xs data-[state=on]:bg-primary data-[state=on]:text-primary-foreground flex-shrink-0 border"
                  aria-label={`Filter by ${type}`}
                >
                  {type}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
            <ScrollBar orientation="horizontal" className="h-1.5" />
          </ScrollArea>
        </div>
      </div>
      {/* 3. 정렬 - Select 드롭다운으로 변경 */}
      <div className="mb-1 w-full flex justify-end items-center text-xs">
        <Select
          value={sortCriteria}
          onValueChange={(value) => setSortCriteria(value as SortCriteria)}
        >
          <SelectTrigger className="w-auto h-5 text-xs px-1 border-none focus:ring-0 bg-transparent text-muted-foreground hover:text-foreground">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {sortOptions.map((option) => (
              <SelectItem
                key={option.value}
                value={option.value}
                className="text-xs min-h-[1.5rem]"
              >
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {/* 4. 검색 결과 목록 - 향상된 아이템 디자인 */}
      <div className="flex-1 min-h-0 mb-4">
        <ScrollArea className="w-full h-full">
          {processedResults.length > 0 ? (
            <div className="flex flex-col gap-2  p-1">
              {processedResults.map((item) => (
                <Button
                  key={item.id}
                  variant="outline"
                  className={cn(
                    'h-auto w-full justify-start rounded-[10px] p-1.5 text-left flex items-center gap-2',
                    selectedItemId === item.id.toString()
                      ? 'border bg-accent'
                      : 'border hover:bg-accent/50',
                  )}
                  onClick={() => handleSelectItem(item.id)}
                >
                  <div className="w-10 h-26 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="text-muted-foreground"
                    >
                      <path d="M11.83 12.59a2.12 2.12 0 0 1-2.2 2.16c-1.17 0-2.12-.95-2.12-2.12 0-.1.01-.19.03-.28l-1.5-3.36a.62.62 0 0 1 .18-.7l5.16-2.55a.63.63 0 0 1 .76.18l1.4 1.4"></path>
                      <path d="M15.83 12.59a2.12 2.12 0 0 1-2.2 2.16c-1.17 0-2.12-.95-2.12-2.12 0-.1.01-.19.03-.28l-1.5-3.36a.62.62 0 0 1 .18-.7l5.16-2.55a.63.63 0 0 1 .76.18l1.4 1.4"></path>
                      <path d="M18 18H6"></path>
                      <path d="M17 11h-1.86a.14.14 0 0 1-.14-.14V8.42a.14.14 0 0 1 .14-.14h3.72a.14.14 0 0 1 .14.14v5.44a.14.14 0 0 1-.14.14H17"></path>
                    </svg>
                  </div>
                  <div className="flex-grow flex flex-col justify-center gap-0">
                    <p className="font-semibold text-sm leading-tight truncate">
                      {item.name}
                    </p>
                    {item.enName && (
                      <p className="text-xs text-muted-foreground leading-tight truncate">
                        {item.enName}
                      </p>
                    )}
                    <div className="flex items-center justify-between text-[11px] text-muted-foreground leading-tight mt-0.5">
                      <span>
                        {item.type} {item.abv ? `| ${item.abv}%` : ''}
                      </span>
                      <div className="flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                        <span>{item.avgRating.toFixed(1)}</span>
                        <span className="ml-0.5">
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
              <p className="text-sm text-muted-foreground">
                검색 결과가 없습니다.
              </p>
            </div>
          )}
          <ScrollBar orientation="vertical" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default SearchPage;
