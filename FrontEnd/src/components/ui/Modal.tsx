// FILE: Modal.tsx
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
import LikedWhiskyList from '@/components/ui/LikedWhiskyList';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLikedWhiskies,
  LIKES_QUERY_KEY,
  LikedWhisky,
} from '@/lib/api/like';
import { useSearchWhiskies } from '@/hooks/queries/useWhiskyQueries';
import { WhiskySearchResult as ApiWhiskySearchResult } from '@/lib/api/whisky';

// 이미지 임포트 추가
import exampleImage from '../../assets/example.png';

// --- TypeScript Interface ---
// interface WhiskySearchResult {
//   id: number;
//   koName: string;
//   enName?: string;
//   type: string;
//   country: string;
//   avgRating: number;
//   recordCounts: number;
//   popularity?: number;
//   imageUrl?: string;
//   abv?: number;
// }

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

  // API 호출로 대체
  const {
    data: searchResponse,
    isLoading,
    isError,
  } = useSearchWhiskies({
    keyword: searchTerm,
    sortField: sortCriteria.split('_')[0],
    desc: sortCriteria.endsWith('desc'),
    type: selectedType?.toUpperCase(),
  });

  const countries = ['미국', '아일랜드', '캐나다', '스코틀랜드'];
  const types = ['버번', '싱글 몰트', '그레인', '블렌디드 몰트'];

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

  // API 응답 데이터 처리
  const processedResults = searchResponse?.whiskies || [];

  const formatCount = (count: number): string => {
    return count > 999 ? '(999+)' : `(${count})`;
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <p className="text-sm text-muted-foreground ml-2">검색 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-red-500 font-semibold mb-1">오류 발생</p>
        <p className="text-sm text-muted-foreground">
          검색 결과를 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }

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
                key={item.whiskyId}
                variant="outline"
                className={cn(
                  'h-auto w-full justify-start rounded-[10px] p-1.5 text-left flex items-center gap-2',
                  selectedItemId === item.whiskyId
                    ? 'border-2 border-primary ring-1 ring-primary bg-accent'
                    : 'border hover:bg-accent/50',
                )}
                onClick={() => handleSelectItem(item.whiskyId)}
              >
                <div className="w-10 h-14 flex-shrink-0 flex items-center justify-center bg-gray-100 rounded overflow-hidden">
                  <img
                    src={item.whiskyImg || exampleImage}
                    alt={item.koName}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = exampleImage)}
                  />
                </div>
                <div className="flex-grow flex flex-col justify-center gap-0">
                  <p className="font-semibold text-sm leading-tight truncate">
                    {item.koName}
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

  // --- 실제 찜 목록 데이터 가져오기 ---
  const {
    data: likedItemsData, // 이름 변경 (likedItems 사용 중복 방지)
    isLoading,
    isError,
  } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });

  // 실제 사용할 데이터 (로딩/에러 처리 후)
  const actualLikedItems: LikedWhisky[] = Array.isArray(likedItemsData)
    ? likedItemsData
    : [];
  // --- 데이터 가져오기 끝 ---

  // 타입 수정: WishlistItem -> LikedWhisky
  const handleGridItemClick = (item: LikedWhisky) => {
    setSelectedItemId(item.whiskyId); // LikedWhisky의 속성 사용
  };

  const handleConfirm = () => {
    if (selectedItemId) {
      onSelect(selectedItemId);
      if (closeParentDialog) {
        setTimeout(() => closeParentDialog(), 100);
      }
    } else {
      console.log('찜 목록 항목이 선택되지 않았습니다.');
    }
  };

  // --- 로딩 및 에러 상태 처리 ---
  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-full">
        {/* 간단한 로딩 스피너 또는 메시지 */}
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-2"></div>
        <p className="text-sm text-muted-foreground">찜 목록 로딩 중...</p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center">
        <p className="text-red-500 font-semibold mb-1">오류 발생</p>
        <p className="text-sm text-muted-foreground">
          찜 목록을 불러오는데 실패했습니다.
        </p>
      </div>
    );
  }
  // --- 로딩/에러 처리 끝 ---

  return (
    <div className="flex flex-col h-full">
      <DialogHeader className="mb-2 flex-shrink-0">
        <DialogTitle>나의 찜 리스트</DialogTitle>
      </DialogHeader>

      <div className="flex-grow overflow-auto">
        <LikedWhiskyList
          likedItems={actualLikedItems}
          onItemClick={handleGridItemClick}
          cardWidthClass="w-[155px]"
        />
      </div>

      <DialogFooter className="mt-3 w-full flex flex-row justify-center items-center gap-2 flex-shrink-0">
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
    </div>
  );
}

// --- WhiskySelectionDialog Component (MODIFIED) ---
export function WhiskySelectionDialog({
  variant,
  title: propTitle,
  boxContent,
  onWhiskySelect,
  onClose,
}: WhiskySelectionDialogProps & {
  onWhiskySelect?: (whisky: {
    id: number;
    koName: string;
    imageUrl: string | undefined;
  }) => void;
  onClose?: () => void;
}) {
  const displayTitle = propTitle || variantTitles[variant];

  // 선택된 위스키 정보를 저장할 상태 추가
  const [selectedWhisky, setSelectedWhisky] = useState<
    ApiWhiskySearchResult | LikedWhisky | null
  >(null);

  // 내부 Dialog의 열림/닫힘 상태를 Dialog 별로 따로 관리
  const [searchDialogOpen, setSearchDialogOpen] = useState(false);
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false);

  // 찜 목록 데이터 가져오기
  const { data: likedItemsData } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });
  const likedItems: LikedWhisky[] = Array.isArray(likedItemsData)
    ? likedItemsData
    : [];

  // 검색 결과 데이터 가져오기 (기본 인기순으로)
  const { data: searchResponse } = useSearchWhiskies({
    sortField: 'popularity',
    desc: true,
    pageSize: 5,
  });
  const searchItems: ApiWhiskySearchResult[] = searchResponse?.whiskies || [];

  // 부모 Dialog 닫기 함수
  const closeParentDialog = () => {
    if (onClose) {
      onClose();
    }
  };

  // 위스키 ID로 검색 결과 또는 찜 목록에서 위스키 찾기 함수
  const findWhiskyById = (id: number) => {
    // 위스키 검색 결과에서 찾기
    const fromSearch = searchItems.find((item) => item.whiskyId === id);
    if (fromSearch) return fromSearch;

    // 찜 목록에서 찾기
    const fromWishlist = likedItems.find((item) => item.whiskyId === id);
    if (fromWishlist) return fromWishlist;

    return null;
  };

  // 위스키 선택 핸들러 수정
  const handleWhiskySelected = (id: number) => {
    const whisky = findWhiskyById(id);
    if (whisky) {
      console.log(`Whisky ${id} selected:`, whisky);
      setSelectedWhisky(whisky);

      // 상위 컴포넌트로 선택된 위스키 정보 전달 (형식 맞추기)
      if (onWhiskySelect) {
        const selectedData = {
          id: whisky.whiskyId, // 공통 ID 필드
          koName: whisky.koName, // 공통 이름 필드
          imageUrl: 'whiskyImg' in whisky ? whisky.whiskyImg : undefined, // ApiWhiskySearchResult 타입에만 존재
        };
        onWhiskySelect(selectedData);
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
        'whiskyImg' in selectedWhisky ? selectedWhisky.whiskyImg : exampleImage;

      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl || exampleImage}
            alt={selectedWhisky.koName || '선택된 위스키'}
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
