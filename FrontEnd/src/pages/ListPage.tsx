import { useCallback, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Whisky } from '@/types/search';
import SearchWhisky from '@/components/ui/search/SearchWhisky';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { useSearchMutation } from '@/hooks/mutations/useSearchMutation';

const ListPage = () => {
  const navigate = useNavigate();
  const [shouldScrollToTop, setShouldScrollToTop] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [whiskies, setWhiskies] = useState<Whisky[]>([]);
  const [searchAfter, setSearchAfter] = useState<[] | [number, number]>([]);
  const [hasNext, setHasNext] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const previousFiltersRef = useRef<string>('');

  const [filters, setFilters] = useState<{
    keyword: string | undefined;
    age: number | undefined;
    type: string | undefined;
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

  // 안전한 fetch 함수: filters는 인자로 직접 받는다
  const fetchWhiskies = useCallback(
    (isLoadMore = false, customFilters?: typeof filters) => {
      const targetFilters = customFilters ?? filters;

      if (isLoadMore && isLoadingMore) return;
      if (isLoadMore) setIsLoadingMore(true);

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
          onError: () => {
            if (isLoadMore) setIsLoadingMore(false);
          },
        },
      );
    },
    [mutate, searchAfter, isLoadingMore], // eslint-disable-line react-hooks/exhaustive-deps
  );

  // 필터 변경 감지 및 새 요청
  useEffect(() => {
    const currentFilters = JSON.stringify(filters);
    const hasChanged = currentFilters !== previousFiltersRef.current;

    if (hasChanged) {
      previousFiltersRef.current = currentFilters;
      setSearchAfter([]);
      setShouldScrollToTop(true);
      fetchWhiskies(false, filters); // filters 직접 넘김
    }
  }, [filters]); // eslint-disable-line react-hooks/exhaustive-deps

  // 최초 1회 데이터 로드
  useEffect(() => {
    fetchWhiskies(false, filters);
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // 스크롤 플래그 리셋
  useEffect(() => {
    if (shouldScrollToTop) {
      const timeout = setTimeout(() => {
        setShouldScrollToTop(false);
      }, 200);
      return () => clearTimeout(timeout);
    }
  }, [shouldScrollToTop]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    navigate(`/detail/${id}`);
  };

  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchWhiskies(true, filters);
    }
  };

  const handleFilterChange = (newFilters: typeof filters) => {
    setSearchAfter([]); // 초기화
    setFilters(newFilters);
  };

  return (
    <div className="h-screen w-full bg-bg-muted pb-20 flex flex-col">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col flex-grow overflow-hidden">
        {/* 검색 + 필터 */}
        <SearchWhisky
          onSelect={handleSelect}
          onFilteredChange={handleFilterChange}
          height="auto"
          hideTitle
        />

        {/* 결과 렌더링 */}
        <div className="flex-grow overflow-hidden">
          <SearchWhiskyResult
            items={whiskies}
            selectedId={selectedId}
            onSelect={handleSelect}
            onLoadMore={handleLoadMore}
            hasNext={hasNext}
            shouldScrollToTops={shouldScrollToTop}
          />
        </div>
      </div>
    </div>
  );
};

export default ListPage;
