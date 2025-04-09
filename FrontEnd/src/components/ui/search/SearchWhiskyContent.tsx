import { useCallback, useEffect, useState } from 'react';
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
    (isLoadMore = false) => {
      if (isLoadMore && isLoadingMore) return;
      if (isLoadMore) setIsLoadingMore(true);

      mutate(
        {
          keyword: filters.keyword,
          pageSize: 10,
          searchAfter: isLoadMore ? searchAfter : ([] as []),
          sortField: filters.sortField,
          desc: filters.desc,
          age: filters.age,
          type: filters.type,
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
    [filters, searchAfter, isLoadingMore, mutate],
  );

  useEffect(() => {
    fetchWhiskies(false);
    setShouldScrollToTop(true);
  }, [filters]);

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

  return (
    <div className="flex flex-col h-full">
      <SearchWhisky
        onFilteredChange={(filters) => setFilters(filters)}
        height="0px"
        hideTitle
      />

      <SearchWhiskyResult
        items={whiskies}
        selectedId={selectedId}
        onSelect={handleWhiskyClick}
        height="100%"
        onLoadMore={() => fetchWhiskies(true)}
        hasNext={hasNext}
        shouldScrollToTops={shouldScrollToTop}
      />
    </div>
  );
};

export default SearchWhiskyContent;
