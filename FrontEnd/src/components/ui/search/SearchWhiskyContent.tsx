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

  const fetchWhiskies = useCallback(
    (isLoadMore = false, customFilters?: typeof filters) => {
      const targetFilters = customFilters || filters;

      // 중복 호출 방지
      if (isLoadMore && isLoadingMore) return;

      if (isLoadMore) {
        setIsLoadingMore(true);
      }

      mutate(
        {
          keyword: targetFilters.keyword,
          pageSize: 15,
          searchAfter: isLoadMore ? searchAfter : [],
          sortField: targetFilters.sortField,
          desc: targetFilters.desc,
          age: targetFilters.age,
          type: targetFilters.type,
        },
        {
          onSuccess: (res) => {
            setWhiskies((prev) =>
              isLoadMore ? [...prev, ...res.whiskies] : res.whiskies,
            );
            setSearchAfter(res.nextSearchAfter);
            setHasNext(res.hasNext);
            if (isLoadMore) setIsLoadingMore(false);
          },
          onError: (err) => {
            console.error('검색 에러:', err);
            if (isLoadMore) setIsLoadingMore(false);
          },
        },
      );
    },
    [filters, isLoadingMore, mutate, searchAfter],
  );

  // 필터 변경 시 새 검색 실행
  useEffect(() => {
    const currentFilters = JSON.stringify(filters);
    const hasChanged = currentFilters !== previousFiltersRef.current;

    if (hasChanged) {
      previousFiltersRef.current = currentFilters;
      setSearchAfter([]);
      setShouldScrollToTop(true);
      fetchWhiskies(false, filters);
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // 초기 데이터 로딩
  useEffect(() => {
    fetchWhiskies(false);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // shouldScrollToTop flag 리셋
  useEffect(() => {
    if (shouldScrollToTop) {
      const timeout = setTimeout(() => {
        setShouldScrollToTop(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [shouldScrollToTop]);

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

  const handleFilterChange = (newFilters: typeof filters) => {
    setSearchAfter([]);
    setFilters(newFilters);
  };

  const handleLoadMore = useCallback(() => {
    if (hasNext && !isLoadingMore) {
      fetchWhiskies(true);
    }
  }, [hasNext, isLoadingMore, fetchWhiskies]);

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
