import { useEffect, useState } from 'react';
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

  const fetchWhiskies = (isLoadMore = false) => {
    if (isLoadMore && isLoadingMore) {
      return;
    }

    if (isLoadMore) setIsLoadingMore(true);

    const payload = {
      keyword: filters.keyword,
      pageSize: 10,
      searchAfter: isLoadMore ? searchAfter : ([] as []),
      sortField: filters.sortField,
      desc: filters.desc,
      age: filters.age,
      type: filters.type,
    };

    mutate(payload, {
      onSuccess: (res) => {
        if (isLoadMore) {
          setWhiskies((prev) => [...prev, ...res.whiskies]);
        } else {
          setWhiskies(res.whiskies);
        }

        setSearchAfter(res.nextSearchAfter);
        setHasNext(res.hasNext);

        if (isLoadMore) setIsLoadingMore(false);
      },
      onError: () => {
        if (isLoadMore) setIsLoadingMore(false);
      },
    });
  };

  useEffect(() => {
    fetchWhiskies(false);
    setShouldScrollToTop(true);
  }, [filters]);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    navigate(`/detail/${id}`);
  };

  const handleLoadMore = () => {
    if (hasNext && !isLoadingMore) {
      fetchWhiskies(true);
    }
  };

  return (
    <div className="h-screen w-full bg-bg-muted pt-5 pb-20 scrollbar-hide">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col h-full">
        {/* 검색 + 필터 컴포넌트 */}
        <SearchWhisky
          onSelect={handleSelect}
          onFilteredChange={({ keyword, age, type, sortField, desc }) =>
            setFilters({
              keyword,
              age,
              type,
              sortField,
              desc,
            })
          }
          height="0px"
          hideTitle
        />

        {/* 결과 렌더링 컴포넌트 */}
        <SearchWhiskyResult
          items={whiskies}
          selectedId={selectedId}
          onSelect={handleSelect}
          height="100%"
          onLoadMore={handleLoadMore} // 무한 스크롤 고려
          hasNext={hasNext}
          shouldScrollToTops={shouldScrollToTop}
        />
      </div>
    </div>
  );
};

export default ListPage;
