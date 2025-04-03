// FILE: WhiskySelectionDialog.tsx
import React, { useState } from 'react';
import { cn } from '@/lib/util/utils';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from '@/components/shadcn/dialog';
// --- Shadcn UI Components ---
import Btn from '@/components/ui/Btn';
import { Button } from '@/components/shadcn/Button';
import Whiskycard from '@/components/ui/Whiskycard';
import { Input } from '@/components/shadcn/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import {
  ToggleGroup,
  ToggleGroupItem,
} from '@/components/shadcn/toggle/toggle-group';
import { Star } from 'lucide-react';
import { Search } from 'lucide-react';

// 이미지 임포트 추가
import exampleImage from '../../assets/example.png';

// --- TypeScript Interface ---
interface WhiskySearchResult {
  id: number;
  name: string;
  enName?: string;
  type: string;
  country: string;
  avgRating: number;
  recordCounts: number;
  popularity?: number;
  imageUrl?: string;
  abv?: number;
}

// --- Types, Interfaces, Titles ---
type PromptVariant = 'regist' | 'edit';
export interface WhiskySelectionDialogProps {
  variant: PromptVariant;
  title?: string;
  boxContent?: React.ReactNode;
}
const variantTitles: Record<PromptVariant, string> = {
  regist: '오늘의 한 잔 위스키가\n등록되지 않았습니다.\n위스키를 등록해주세요.',
  edit: '위스키를 변경해주세요.',
};

// --- Dummy Data ---
const dummySearchResults: WhiskySearchResult[] = [
  // ... (Keep dummy data as is) ...
  {
    id: 1257,
    name: '아드베그 5년산',
    enName: 'Ardbeg 5 Years',
    type: 'Single Malt Whisky',
    country: 'Scotland',
    avgRating: 4.7,
    recordCounts: 1250,
    popularity: 300,
    imageUrl:
      'https://whiskeep-bucket.s3.amazonaws.com/whisky/images/Ardbeg_5_Years.png',
    abv: 47,
  },
  {
    id: 2,
    name: '발렌타인 40년산',
    enName: "Ballantine's 40 Years Old",
    type: '블렌디드',
    country: '스코틀랜드',
    avgRating: 4.9,
    recordCounts: 850,
    popularity: 500,
    imageUrl: exampleImage,
    abv: 70,
  },
  {
    id: 3,
    name: '버팔로 트레이스',
    enName: 'Buffalo Trace',
    type: '버번',
    country: '미국',
    avgRating: 4.2,
    recordCounts: 55,
    popularity: 120,
    imageUrl: exampleImage,
    abv: 45,
  },
  {
    id: 4,
    name: '글렌피딕 15년',
    enName: 'Glenfiddich 15 Year Old',
    type: '싱글 몰트',
    country: '스코틀랜드',
    avgRating: 4.6,
    recordCounts: 90,
    popularity: 250,
    imageUrl: exampleImage,
    abv: 40,
  },
  {
    id: 5,
    name: '레드브레스트 12년 CS',
    enName: 'Redbreast 12 Year Old Cask Strength',
    type: '싱글 팟 스틸',
    country: '아일랜드',
    avgRating: 4.8,
    recordCounts: 70,
    popularity: 180,
    imageUrl: exampleImage,
    abv: 58.6,
  },
  ...Array.from({ length: 15 }, (_, i) => ({
    id: i + 6,
    name: `더미 위스키 ${i + 6}`,
    enName: `Dummy Whisky ${i + 6}`,
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
    imageUrl: exampleImage,
    abv: Math.floor(40 + Math.random() * 10),
  })),
];

interface WishlistItem {
  id: number;
  name: string;
  rating: number;
  imageUrl: string;
}
const dummyWishlistItems: WishlistItem[] = Array.from(
  { length: 15 },
  (_, i) => ({
    id: i + 1,
    name: `Wishlist Item ${i + 1}`,
    rating: Math.round((4 + Math.random()) * 10) / 10,
    imageUrl: exampleImage,
  }),
);
// --- End Data & Types ---

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

// --- SearchWhiskyDialogContent Component (MODIFIED ScrollArea Height) ---
function SearchWhiskyDialogContent({
  onSelect,
  closeParentDialog,
}: {
  onSelect: (id: number) => void;
  closeParentDialog?: () => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const [selectedCountry, setSelectedCountry] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortCriteria, setSortCriteria] =
    useState<SortCriteria>('popularity_desc');

  const countries = ['미국', '아일랜드', '캐나다', '스코틀랜드'];
  const types = ['버번', '싱글 몰트', '그레인', '블랜디드 몰트'];

  const handleSelectItem = (id: number) =>
    setSelectedItemId((prev) => (prev === id ? null : id));

  const handleConfirm = () => {
    if (selectedItemId) {
      onSelect(selectedItemId);

      // 부모 다이얼로그도 닫기
      if (closeParentDialog) {
        setTimeout(() => {
          closeParentDialog();
        }, 100);
      }
    } else {
      console.log('항목이 선택되지 않았습니다.');
    }
  };

  const handleCountryChange = (value: string) =>
    setSelectedCountry(value || null);
  const handleTypeChange = (value: string) => setSelectedType(value || null);

  const processedResults = dummySearchResults
    .filter((item) => {
      /* ... filtering logic ... */
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
      /* ... sorting logic ... */
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
    <>
      <DialogHeader className="mb-2">
        <DialogTitle>위스키 검색</DialogTitle>
      </DialogHeader>

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

      {/* Filter Section */}
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

      {/* Sorting Control */}
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
                {' '}
                {option.label}{' '}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Results List - REDUCED Height */}
      <ScrollArea className="w-full flex-grow rounded-[10px] h-[180px]">
        {processedResults.length > 0 ? (
          <div className="flex flex-col gap-1 p-1">
            {processedResults.map((item) => (
              <Button
                key={item.id}
                variant="outline"
                className={cn(
                  'h-auto w-full justify-start rounded-[10px] p-1.5 text-left flex items-center gap-2',
                  selectedItemId === item.id
                    ? 'border-2 border-primary ring-1 ring-primary bg-accent'
                    : 'border hover:bg-accent/50',
                )}
                onClick={() => handleSelectItem(item.id)}
              >
                <div className="w-10 h-14 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                  <img
                    src={item.imageUrl || exampleImage}
                    alt={item.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = exampleImage)}
                  />
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

      {/* Footer Buttons */}
      <DialogFooter className="mt-3 w-full flex flex-row justify-center items-center gap-2">
        <DialogClose asChild>
          <Btn
            size="m"
            text="선택"
            color="color-wood-70"
            onClick={handleConfirm}
            disabled={!selectedItemId}
            className={!selectedItemId ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </DialogClose>
        <DialogClose asChild>
          <Btn size="m" color="color-text-muted-40" text="취소" />
        </DialogClose>
      </DialogFooter>
    </>
  );
}

// --- WishlistDialogContent Component ---
function WishlistDialogContent({
  onSelect,
  closeParentDialog,
}: {
  onSelect: (id: number) => void;
  closeParentDialog?: () => void;
}) {
  const [selectedItemId, setSelectedItemId] = useState<number | null>(null);
  const handleSelectItem = (id: number) =>
    setSelectedItemId((prev) => (prev === id ? null : id));
  const handleConfirm = () => {
    if (selectedItemId) {
      onSelect(selectedItemId);

      // 부모 다이얼로그도 닫기
      if (closeParentDialog) {
        setTimeout(() => {
          closeParentDialog();
        }, 100);
      }
    } else {
      console.log('찜 목록 항목이 선택되지 않았습니다.');
    }
  };

  return (
    <>
      <DialogHeader className="mb-2">
        <DialogTitle>나의 찜 리스트</DialogTitle>
      </DialogHeader>
      <ScrollArea className="w-full flex-grow rounded-[10px] h-[360px]">
        {' '}
        {/* Wishlist 높이는 유지하거나 필요시 조정 */}
        {dummyWishlistItems.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-2 w-full justify-items-center">
            {dummyWishlistItems.map((item) => (
              <div
                key={item.id}
                className={cn(
                  'cursor-pointer transition-all duration-150 ease-in-out w-full relative rounded-[18px] overflow-hidden',
                  selectedItemId === item.id
                    ? 'ring-1 ring-primary ring-offset-2'
                    : 'hover:opacity-90',
                )}
                onClick={() => handleSelectItem(item.id)}
              >
                <Whiskycard
                  className="w-[162px] h-[234px]"
                  title={item.name}
                  description={`${item.rating.toFixed(1)}/5.0`}
                  showLikeButton={false}
                  showChart={false}
                  whiskyImage={item.imageUrl}
                />
                {selectedItemId === item.id && (
                  <div className="absolute top-1.5 left-1.5 h-5 w-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center border border-background">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <polyline points="20 6 9 17 4 12"></polyline>
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <p className="text-sm text-muted-foreground">
              찜 목록이 비어있습니다.
            </p>
          </div>
        )}
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      <DialogFooter className="mt-3 w-full flex flex-row justify-center items-center gap-2">
        <DialogClose asChild>
          <Btn
            size="m"
            text="선택"
            color="color-wood-70"
            onClick={handleConfirm}
            disabled={!selectedItemId}
            className={!selectedItemId ? 'opacity-50 cursor-not-allowed' : ''}
          />
        </DialogClose>
        <DialogClose asChild>
          <Btn size="m" color="color-text-muted-40" text="취소" />
        </DialogClose>
      </DialogFooter>
    </>
  );
}

// --- WhiskySelectionDialog Component (MODIFIED) ---
export function WhiskySelectionDialog({
  variant,
  title: propTitle,
  boxContent,
  onWhiskySelect, // 추가: 선택된 위스키 정보를 상위 컴포넌트로 전달하는 콜백
  onClose, // 추가: 모달을 닫는 콜백 함수
}: WhiskySelectionDialogProps & {
  onWhiskySelect?: (whisky: WhiskySearchResult | WishlistItem) => void;
  onClose?: () => void; // 추가: 모달 닫기 콜백 타입 정의
}) {
  const displayTitle = propTitle || variantTitles[variant];

  // 선택된 위스키 정보를 저장할 상태 추가
  const [selectedWhisky, setSelectedWhisky] = useState<
    WhiskySearchResult | WishlistItem | null
  >(null);

  // 내부 Dialog의 열림/닫힘 상태를 Dialog 별로 따로 관리
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);

  // 부모 Dialog 닫기 함수
  const closeParentDialog = () => {
    if (onClose) {
      onClose();
    }
  };

  // 위스키 검색 결과에서 ID로 위스키 찾기 함수
  const findWhiskyById = (id: number) => {
    // 위스키 검색 결과에서 찾기
    const fromSearch = dummySearchResults.find((item) => item.id === id);
    if (fromSearch) return fromSearch;

    // 찜 목록에서 찾기
    const fromWishlist = dummyWishlistItems.find((item) => item.id === id);
    if (fromWishlist) return fromWishlist;

    return null;
  };

  // 위스키 선택 핸들러 수정
  const handleWhiskySelected = (id: number) => {
    const whisky = findWhiskyById(id);
    if (whisky) {
      console.log(`Whisky ${id} selected:`, whisky);
      setSelectedWhisky(whisky);

      // 상위 컴포넌트로 선택된 위스키 정보 전달
      if (onWhiskySelect) {
        onWhiskySelect(whisky);
      }

      // 내부 Dialog 닫기
      setSearchDialogOpen(false);
      setWishlistDialogOpen(false);

      // 외부 모달도 함께 닫기
      setTimeout(() => {
        closeParentDialog();
      }, 100); // 약간의 지연으로 UX 개선
    }
  };

  // 선택된 위스키가 있으면 이미지를 표시하고, 없으면 기본 아이콘 표시
  const renderContent = () => {
    // boxContent가 명시적으로 제공된 경우 이를 우선적으로 사용
    if (boxContent) {
      return boxContent;
    }

    // 선택된 위스키가 있는 경우 이미지 표시
    if (selectedWhisky) {
      const imageUrl =
        'imageUrl' in selectedWhisky ? selectedWhisky.imageUrl : exampleImage;
      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
            alt={
              'name' in selectedWhisky ? selectedWhisky.name : '선택된 위스키'
            }
            className="w-full h-full object-contain"
            onError={(e) => (e.currentTarget.src = exampleImage)}
          />
        </div>
      );
    }

    // 기본 아이콘 (선택된 위스키가 없을 때)
    return defaultBoxContent;
  };

  const defaultBoxContent = (
    <div className="flex items-center justify-center w-full h-full">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="64"
        height="64"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-muted-foreground opacity-50"
      >
        <path d="M15 3h6v6" />
        <path d="M10 14 21 3" />
        <path d="M18 13v5a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h5" />
        <path d="M14 3v6h-6" />
        <path d="M3 14 11 6" />
      </svg>
    </div>
  );

  return (
    <>
      <div className="flex flex-col items-center justify-center gap-5 p-6 pt-0">
        <p className="whitespace-pre-line text-center text-base text-gray-600 opacity-90 mb-4">
          {displayTitle}
        </p>
        <div className="mb-4 flex h-[180px] w-[180px] items-center justify-center rounded-[10px] bg-muted p-0 overflow-hidden">
          {renderContent()}
        </div>
        <div className="flex w-full flex-col items-center gap-3">
          <Btn
            size="l"
            color="color-wood-70"
            text="카메라로 검색"
            textColor="text-white"
            onClick={() => (window.location.href = '/camera-search')}
            className="w-full"
          />
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Btn
                size="l"
                color="color-wood-70"
                text="목록에서 검색"
                textColor="text-white"
                className="w-full"
              />
            </DialogTrigger>
            <DialogContent className="w-[370px] h-[600px] p-3 flex flex-col overflow-hidden border-none rounded-[18px]">
              <SearchWhiskyDialogContent
                onSelect={handleWhiskySelected}
                closeParentDialog={closeParentDialog}
              />
            </DialogContent>
          </Dialog>
          <Dialog
            open={wishlistDialogOpen}
            onOpenChange={setWishlistDialogOpen}
          >
            <DialogTrigger asChild>
              <Btn
                size="l"
                color="color-wood-70"
                text="찜 목록에서 선택"
                textColor="text-white"
                className="w-full"
              />
            </DialogTrigger>
            <DialogContent className="w-[370px] h-[600px] p-3 flex flex-col overflow-hidden border-none rounded-[18px]">
              <WishlistDialogContent
                onSelect={handleWhiskySelected}
                closeParentDialog={closeParentDialog}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </>
  );
}

export default WhiskySelectionDialog;
