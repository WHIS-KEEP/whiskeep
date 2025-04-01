// src/pages/SearchPage.tsx
// Renders at /search (라우터 설정 필요)

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { cn } from '@/lib/util/utils';
import Btn from '@/components/ui/Btn'; // 커스텀 버튼
import { Button } from '@/components/shadcn/button'; // shadcn/ui Button
import { Input } from '@/components/shadcn/input';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'; // ScrollArea, ScrollBar 임포트 추가
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/shadcn/select';

// --- 더미 데이터 ---
const dummySearchResults = Array.from({ length: 20 }, (_, i) => ({
  id: `whisky_${i + 1}`,
  name: `더미 위스키 ${i + 1}`,
  type: i % 2 === 0 ? '싱글 몰트' : '버번',
  country: i % 3 === 0 ? '스코틀랜드' : '미국',
}));
// --- 더미 데이터 끝 ---

export function SearchPage() {
  const navigate = useNavigate();
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const handleConfirm = () => {
    console.log('선택된 아이템 ID:', selectedItemId);
    // TODO: 선택된 아이템 ID로 작업 수행
    navigate('/Main'); // 메인 페이지로 이동
  };

  const handleCancel = () => {
    navigate('/Main'); // 메인 페이지로 이동
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };

  return (
    <div className="container mx-auto flex h-screen max-w-md flex-col p-4">
      {' '}
      {/* 페이지 컨테이너 */}
      {/* 페이지 제목 (선택적) */}
      <h1 className="mb-4 text-xl font-semibold">위스키 검색</h1>
      {/* 1. 검색창 */}
      <Input
        type="search"
        placeholder="위스키 이름을 검색하세요..."
        className="mb-4"
      />
      {/* 2. 필터 영역 */}
      <div className="mb-4 grid w-full grid-cols-2 gap-3">
        {/* 국가 필터 */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="국가 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="미국">미국</SelectItem>
            <SelectItem value="아일랜드">아일랜드</SelectItem>
            <SelectItem value="캐나다">캐나다</SelectItem>
            <SelectItem value="스코틀랜드">스코틀랜드</SelectItem>
          </SelectContent>
        </Select>
        {/* 타입 필터 */}
        <Select>
          <SelectTrigger>
            <SelectValue placeholder="타입 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="버번">버번</SelectItem>
            <SelectItem value="싱글 몰트">싱글 몰트</SelectItem>
            <SelectItem value="그레인">그레인</SelectItem>
            <SelectItem value="블랜디드 몰트">블랜디드 몰트</SelectItem>
          </SelectContent>
        </Select>
      </div>
      {/* 3. 정렬 */}
      <div className="mb-3 w-full text-right text-sm text-gray-500">
        정렬: 인기순 {/* TODO: 실제 정렬 기능 구현 */}
      </div>
      {/* 4. 검색 결과 목록 (스크롤 영역) */}
      {/* ScrollArea 컴포넌트로 교체 */}
      <ScrollArea className="w-full flex-grow rounded-md border">
        <div className="grid grid-cols-1 gap-2 p-2">
          {dummySearchResults.map((item) => (
            <Button // shadcn/ui Button 사용
              key={item.id}
              variant="outline"
              className={cn(
                'h-[85px] w-full justify-start rounded-[10px] border px-4 py-2 text-left',
                'transition-all duration-150 ease-in-out',
                selectedItemId === item.id
                  ? 'border-2 border-black font-semibold ring-1 ring-black'
                  : 'border-gray-200 hover:bg-gray-50',
              )}
              onClick={() => handleSelectItem(item.id)}
            >
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-xs text-gray-500">
                  {item.country} / {item.type}
                </div>
              </div>
            </Button>
          ))}
          {/* TODO: 무한 스크롤 로직 구현 */}
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
      {/* 5. 하단 버튼 */}
      {/* sticky bottom-0 bg-background py-4 등으로 하단에 고정 가능 */}
      <div className="mt-4 flex w-full shrink-0 justify-center gap-3 border-t pt-4">
        {' '}
        {/* 상단 테두리 및 패딩 추가 */}
        <Btn
          size="m"
          // variant="outline" // Btn 컴포넌트가 variant="outline" 지원 가정
          text="취소"
          onClick={handleCancel}
        />
        <Btn
          size="m"
          // variant="default" // Btn 컴포넌트가 기본 variant 지원 가정
          text="선택"
          onClick={handleConfirm}
          // disabled={!selectedItemId}
        />
      </div>
    </div>
  );
}

export default SearchPage;
