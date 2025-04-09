import { useCallback, useEffect, useState, useRef } from 'react';
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
  const [searchAfter, setSearchAfter] = useState<[] | [number, number]>(
    [] as [],
  );
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
        // 필터 변경 시 스크롤 초기화 플래그 설정
        setShouldScrollToTop(true);
      }

      const payload = {
        keyword: filters.keyword,
        pageSize: 15, // 페이지 사이즈 증가
        searchAfter: isLoadMore ? searchAfter : ([] as []),
        sortField: filters.sortField,
        desc: filters.desc,
        age: filters.age,
        type: filters.type,
      };

      mutate(payload, {
        onSuccess: (res) => {
          if (isLoadMore) {
            // 무한 스크롤: 기존 항목에 새 항목 추가
            setWhiskies((prev) => [...prev, ...res.whiskies]);
          } else {
            // 필터 변경: 항목 완전 교체
            setWhiskies(res.whiskies);
          }

          setSearchAfter(res.nextSearchAfter);
          setHasNext(res.hasNext);

          if (isLoadMore) {
            setIsLoadingMore(false);
          }
        },
        onError: () => {
          if (isLoadMore) {
            setIsLoadingMore(false);
          }
        },
      });
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
  }, [fetchWhiskies]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    navigate(`/detail/${id}`);
  };

  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchWhiskies(true);
    }
  };

  const handleFilterChange = (newFilters: {
    keyword: string | undefined;
    age: number | undefined;
    type: string | undefined;
    sortField: string;
    desc: boolean;
  }) => {
    // 필터 변경 시 searchAfter 초기화
    setSearchAfter([] as []);
    setFilters(newFilters);
  };

  return (
    <div className="h-screen w-full bg-bg-muted pt-5 pb-20 flex flex-col">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col flex-grow overflow-hidden">
        {/* 검색 + 필터 컴포넌트 */}
        <SearchWhisky
          onSelect={handleSelect}
          onFilteredChange={handleFilterChange}
          height="auto"
          hideTitle
        />

        {/* 결과 렌더링 컴포넌트 */}
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
