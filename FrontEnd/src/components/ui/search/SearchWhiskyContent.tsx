import { useCallback, useEffect, useState, useRef } from 'react';
import SearchWhisky from '@/components/ui/search/SearchWhisky';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { useSearchMutation } from '@/hooks/mutations/useSearchMutation';
import { Whisky } from '@/types/search';

interface Props {
  onSelect: (whisky: {
    id: number;
    koName: string;
    imageUrl: string | undefined;
  }) => void;
  closeDialog?: () => void;
}

const SearchWhiskyContent = ({ onSelect, closeDialog }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [whiskies, setWhiskies] = useState<Whisky[]>([]);
  const [searchAfter, setSearchAfter] = useState<[] | [number, number]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const previousFiltersRef = useRef<string>('');

  const [filters, setFilters] = useState<{
    keyword?: string;
    age?: number;
    type?: string;
    sortField: string;
    desc: boolean;
  }>({
    keyword: undefined,
    age: undefined,
    type: undefined,
    sortField: 'avgRating',
    desc: true,
  });

  const { mutate } = useSearchMutation();

  // 필터 변경 감지
  const isFilterChanged = useCallback(() => {
    const currentFilters = JSON.stringify(filters);
    const filterChanged = currentFilters !== previousFiltersRef.current;

    if (filterChanged) {
      previousFiltersRef.current = currentFilters;
    }

    return filterChanged;
  }, [filters]);

  const fetchWhiskies = useCallback(
    (isLoadMore = false) => {
      // 이미 로딩 중인 경우 중복 요청 방지
      if (isLoadMore && isLoadingMore) {
        return;
      }

      if (isLoadMore) {
        setIsLoadingMore(true);
      } else if (isFilterChanged()) {
        // 필터 변경 시 searchAfter 초기화 및 스크롤 초기화 플래그 설정
        setSearchAfter([] as []);
        setShouldScrollToTop(true);
      }

      mutate(
        {
          keyword: filters.keyword,
          pageSize: 15, // 페이지 사이즈 증가
          searchAfter: isLoadMore ? searchAfter : ([] as []),
          sortField: filters.sortField,
          desc: filters.desc,
          age: filters.age,
          type: filters.type,
        },
        {
          onSuccess: (res) => {
            if (isLoadMore) {
              // 기존 목록에 새로운 아이템 추가
              setWhiskies((prev) => [...prev, ...res.whiskies]);
            } else {
              // 필터 변경 시 목록 완전 교체
              setWhiskies(res.whiskies);
            }

            setSearchAfter(res.nextSearchAfter);
            setHasNext(res.hasNext);

            if (isLoadMore) {
              setIsLoadingMore(false);
            }

            // 디버깅용 로그
            console.log(
              `Loaded ${res.whiskies.length} items, hasNext: ${res.hasNext}`,
              res.nextSearchAfter,
            );
          },
          onError: (err) => {
            console.error('검색 에러:', err);
            if (isLoadMore) {
              setIsLoadingMore(false);
            }
          },
        },
      );
    },
    [filters, searchAfter, isLoadingMore, mutate, isFilterChanged],
  );

  // 필터 변경 시 새 검색 실행
  useEffect(() => {
    if (isFilterChanged()) {
      fetchWhiskies(false);
    }
  }, [filters, fetchWhiskies, isFilterChanged]);

  // shouldScrollToTop 플래그 리셋 (짧은 지연 후)
  useEffect(() => {
    if (shouldScrollToTop) {
      const timeout = setTimeout(() => {
        setShouldScrollToTop(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [shouldScrollToTop]);

  // 초기 데이터 로드
  useEffect(() => {
    fetchWhiskies(false);
  }, []);

  const handleWhiskyClick = (id: number) => {
    const whisky = whiskies.find((w) => w.whiskyId === id);
    if (!whisky) return;

    setSelectedId(whisky.whiskyId);
    onSelect({
      id: whisky.whiskyId,
      koName: whisky.koName,
      imageUrl: whisky.whiskyImg,
    });

    closeDialog?.();
  };

  // 필터 변경 시 상태 업데이트 및 searchAfter 초기화
  const handleFilterChange = (newFilters: {
    keyword?: string;
    age?: number;
    type?: string;
    sortField: string;
    desc: boolean;
  }) => {
    setSearchAfter([] as []);
    setFilters(newFilters);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingMore) {
      console.log('Loading more items...', searchAfter);
      fetchWhiskies(true);
    }
  }, [hasNext, isLoadingMore, searchAfter, fetchWhiskies]);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-shrink-0">
        <SearchWhisky
          onFilteredChange={handleFilterChange}
          height="0px"
          hideTitle
        />
      </div>

      <div className="flex-grow overflow-hidden">
        <SearchWhiskyResult
          items={whiskies}
          selectedId={selectedId}
          onSelect={handleWhiskyClick}
          height="100%"
          onLoadMore={handleLoadMore}
          hasNext={hasNext}
          shouldScrollToTops={shouldScrollToTop}
        />
      </div>
    </div>
  );
};

export default SearchWhiskyContent;
