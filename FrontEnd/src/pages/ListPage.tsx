import { useState } from 'react';
import { dummySearchResults, Whisky } from '@/types/search';

import SearchWhisky from '@/components/ui/search/SearchWhisky';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { useNavigate } from 'react-router-dom';

const ListPage = () => {
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [filteredItems, setFilteredItems] =
    useState<Whisky[]>(dummySearchResults);

  const handleSelect = (id: number) => {
    setSelectedId(id);
    navigate(`/detail/${id}`);
  };

  return (
    <div className="h-screen w-full bg-bg-muted pt-5 pb-20 scrollbar-hide">
      <div className="bg-white rounded-t-[18px] p-4 flex flex-col h-full">
        {/* 검색 + 필터 컴포넌트 */}
        <SearchWhisky
          data={dummySearchResults}
          onSelect={(id) => {
            handleSelect(id);
          }}
          onFilteredChange={(items) => setFilteredItems(items)}
          height="0px" // 리스트를 아래서 따로 보여줄 거라면 높이 0
          hideTitle // 제목은 위에서 렌더링했으니 숨김
        />

        {/* 결과 렌더링 컴포넌트 */}
        <SearchWhiskyResult
          items={filteredItems}
          selectedId={selectedId}
          onSelect={handleSelect}
          height="100%"
        />
      </div>
    </div>
  );
};

export default ListPage;
