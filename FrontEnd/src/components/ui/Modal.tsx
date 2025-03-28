import React, { useState } from 'react';
// import { useNavigate } from 'react-router-dom'; // react-router-dom의 useNavigate 훅 제거
import { cn } from '@/lib/util/utils';
import { Card, CardContent } from '@/components/ui/card';
import Btn from '@/components/ui/Btn'; // 커스텀 버튼 컴포넌트
import { Button } from '@/components/ui/Button'; // shadcn/ui 또는 커스텀 Button 컴포넌트
import Whiskycard from '@/components/ui/Whiskycard'; // Whiskycard 컴포넌트 경로 확인
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

// --- (타입 정의, 인터페이스, 제목 매핑, 더미 데이터는 이전과 동일) ---
type CardProps = React.ComponentProps<typeof Card>;
type ModalVariant = 'regist' | 'edit' | 'search' | 'wishlist';

export interface ModalProps extends Omit<CardProps, 'title'> {
  variant: ModalVariant;
  title?: string;
  boxContent?: React.ReactNode;
}

const variantTitles: Record<ModalVariant, string> = {
  regist: '오늘의 한 잔 위스키가\n등록되지 않았습니다.\n위스키를 등록해주세요.',
  edit: '위스키를 변경해주세요.',
  search: '위스키 검색',
  wishlist: '나의 찜 리스트',
};

const dummySearchResults = Array.from({ length: 20 }, (_, i) => ({
  id: `whisky_${i + 1}`,
  name: `더미 위스키 ${i + 1}`,
  type: i % 2 === 0 ? '싱글 몰트' : '버번',
  country: i % 3 === 0 ? '스코틀랜드' : '미국',
}));

const dummyWishlistItems = Array.from({ length: 15 }, (_, i) => ({
  id: `wish_${i + 1}`,
  imageUrl: `/images/whisky-placeholder.png`,
  name: `찜한 위스키 ${i + 1}`,
  rating: Math.round((4 + Math.random()) * 10) / 10,
}));
// --- (타입 정의, 인터페이스, 제목 매핑, 더미 데이터 끝) ---

export function Modal({
  className,
  variant,
  title: propTitle,
  boxContent,
  ...props
}: ModalProps) {
  // const navigate = useNavigate(); // useNavigate 훅 제거
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  const displayTitle = propTitle || variantTitles[variant];

  const handleConfirm = () => {
    console.log('선택된 아이템 ID:', selectedItemId);
    // TODO: 선택된 아이템 ID로 작업 수행
    // navigate('/Main'); // react-router-dom의 navigate 함수 대신 window.location 사용
    window.location.href = '/Main';
  };

  const handleCancel = () => {
    // navigate('/Main'); // react-router-dom의 navigate 함수 대신 window.location 사용
    window.location.href = '/Main';
  };

  const handleSelectItem = (id: string) => {
    setSelectedItemId((prevId) => (prevId === id ? null : id));
  };

  // --- 각 variant 별 내용 렌더링 함수 ---

  const renderRegistOrEditContent = () => (
    <>
      <p className="whitespace-pre-line text-center text-base text-gray-600 opacity-90">
        {displayTitle}
      </p>
      <div
        className={cn(
          'mb-4 mt-4 flex h-[180px] w-[180px] items-center justify-center rounded-[10px] bg-muted p-4',
        )}
      >
        {boxContent || (
          <p className="text-sm text-muted-foreground">박스 내용</p>
        )}
      </div>
      <div className="flex w-full flex-col items-center gap-3">
        <Btn
          size="l"
          color="color-wood-70"
          text="카메라로 검색"
          textColor="text-white"
          onClick={() => (window.location.href = '/camera-search')} // navigate 대신 window.location 사용
        />
        <Btn
          size="l"
          color="color-wood-70"
          text="목록에서 검색"
          textColor="text-white"
          onClick={() => {
            /* 검색 모달 열기 로직 */
            console.log('목록에서 검색');
            // window.location.href = '/search';
          }}
        />
        <Btn
          size="l"
          color="color-wood-70"
          text="찜 목록에서 선택"
          textColor="text-white"
          onClick={() => {
            /* 찜 목록 모달 열기 로직 */
            console.log('찜 목록에서 선택');
            // window.location.href = '/wishlist';
          }}
        />
      </div>
    </>
  );

  const renderSearchContent = () => (
    <>
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
      <div className="w-full flex-grow overflow-y-auto rounded-md border p-2 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="grid grid-cols-1 gap-2">
          {dummySearchResults.map((item) => (
            <Button // shadcn/ui Button 사용 (선택 가능한 아이템)
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
      </div>

      {/* 5. 하단 버튼 */}
      <div className="mt-4 flex w-full justify-end gap-3">
        {/* Btn 컴포넌트에 variant prop 사용 가정 */}
        <Btn
          size="m"
          // variant="outline" // 취소 버튼 스타일 (Btn 컴포넌트가 지원해야 함)
          text="취소"
          onClick={handleCancel}
        />
        <Btn
          size="m"
          // variant="default" // 선택 버튼 스타일 (기본값 사용 또는 명시)
          text="선택"
          onClick={handleConfirm}
          // disabled={!selectedItemId} // 아이템 미선택 시 비활성화
        />
      </div>
    </>
  );

  const renderWishlistContent = () => (
    <>
      {/* 1. 상단 텍스트 */}
      <p className="mb-4 text-lg font-semibold">{displayTitle}</p>

      {/* 2. 찜 리스트 (스크롤 영역) */}
      <div className="w-full flex-grow overflow-y-auto rounded-md border p-2 scrollbar-thin scrollbar-thumb-gray-300">
        <div className="grid grid-cols-2 gap-3">
          {dummyWishlistItems.map((item) => (
            <Button // Button으로 감싸서 선택 기능 구현
              key={item.id}
              variant="outline"
              className={cn(
                'h-auto w-full rounded-[10px] border p-0',
                'transition-all duration-150 ease-in-out',
                selectedItemId === item.id
                  ? 'border-2 border-black ring-1 ring-black'
                  : 'border-gray-200 hover:bg-gray-50',
              )}
              onClick={() => handleSelectItem(item.id)}
            >
              <Whiskycard
                // Whiskycard props (실제 컴포넌트에 맞게 조정 필요)
                title={item.name} // user가 수정한 prop 사용
                description={`${item.rating}/5.0`} // user가 수정한 prop 사용
                // imageUrl={item.imageUrl} // 필요시 사용
              />
            </Button>
          ))}
          {/* TODO: 무한 스크롤 로직 구현 */}
        </div>
      </div>

      {/* 3. 하단 버튼 */}
      <div className="mt-4 flex w-full justify-end gap-3">
        {/* Btn 컴포넌트에 variant prop 사용 가정 */}
        <Btn
          size="m"
          //   variant="outline" // 취소 버튼 스타일
          text="취소"
          onClick={handleCancel}
        />
        <Btn
          size="m"
          // variant="default" // 선택 버튼 스타일
          text="선택"
          onClick={handleConfirm}
          // disabled={!selectedItemId} // 아이템 미선택 시 비활성화
        />
      </div>
    </>
  );

  // --- 메인 렌더링 로직 ---
  const isRegistOrEdit = variant === 'regist' || variant === 'edit';

  return (
    <Card
      className={cn(
        'flex h-[600px] w-[355px] flex-col overflow-hidden',
        className,
      )}
      {...props}
    >
      <CardContent
        className={cn(
          'flex h-full flex-col p-4',
          isRegistOrEdit ? 'items-center justify-center gap-5' : 'gap-0',
        )}
      >
        {isRegistOrEdit && renderRegistOrEditContent()}
        {variant === 'search' && renderSearchContent()}
        {variant === 'wishlist' && renderWishlistContent()}
      </CardContent>
    </Card>
  );
}

export default Modal;

// --- Tailwind 스크롤바 플러그인 설치 및 설정 필요 ---
// npm install -D tailwind-scrollbar 또는 yarn add -D tailwind-scrollbar
// tailwind.config.js의 plugins 배열에 require('tailwind-scrollbar') 추가
