// FILE: Modal.tsx
import React, { useState } from 'react';
// import { cn } from '@/lib/util/utils';
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
// import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import LikedWhiskyList from '@/components/ui/LikedWhiskyList';
import { useQuery } from '@tanstack/react-query';
import {
  fetchLikedWhiskies,
  LIKES_QUERY_KEY,
  LikedWhisky,
} from '@/lib/api/like';

// 이미지 임포트 추가
import exampleImage from '../../assets/example.png';
import SearchWhiskyContent from './search/SearchWhiskyContent';

import { useNavigate } from 'react-router-dom';

// --- Types, Interfaces, Titles ---
type PromptVariant = 'regist' | 'edit';
export interface WhiskySelectionDialogProps {
  variant: PromptVariant;
  title?: string;
  boxContent?: React.ReactNode;
}

type SelectedWhisky = {
  id: number;
  koName: string;
  imageUrl?: string;
};

const variantTitles: Record<PromptVariant, string> = {
  regist: '오늘의 한 잔 위스키가\n등록되지 않았습니다.\n위스키를 등록해주세요.',
  edit: '위스키를 변경해주세요.',
};


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
  const navigate = useNavigate();
  const displayTitle = propTitle || variantTitles[variant];

  // 선택된 위스키 정보 상태 (LikedWhisky만 가능하도록 수정)
  const [selectedWhisky, setSelectedWhisky] = useState<SelectedWhisky | null>(
    null,
  );

  // 내부 Dialog 상태
  const [wishlistDialogOpen, setWishlistDialogOpen] = useState(false); // 찜 목록
  const [searchDialogOpen, setSearchDialogOpen] = useState(false); // 전체 검색

  // 찜 목록 데이터 가져오기
  const { data: likedItemsData } = useQuery({
    queryKey: [LIKES_QUERY_KEY],
    queryFn: fetchLikedWhiskies,
  });
  const likedItems: LikedWhisky[] = Array.isArray(likedItemsData)
    ? likedItemsData
    : [];

  // 부모 Dialog 닫기 함수
  const closeParentDialog = () => {
    if (onClose) {
      onClose();
    }
  };

  // 위스키 ID로 찜 목록에서 위스키 찾기 함수 (수정됨)
  const findWhiskyById = (id: number): SelectedWhisky | null => {
    const fromWishlist = likedItems.find((item) => item.whiskyId === id);
    if (fromWishlist) {
      return {
        id: fromWishlist.whiskyId,
        koName: fromWishlist.koName,
        imageUrl: fromWishlist.whiskyImg,
      };
    }
    return null;
  };

  // 위스키 선택 핸들러 수정 (타입 및 로직 확인)
  const handleWhiskySelected = (id: number) => {
    const whisky = findWhiskyById(id); // 이제 LikedWhisky | null 반환
    if (whisky) {
      console.log(`Whisky ${id} selected:`, whisky);
      setSelectedWhisky({
        id: whisky.id,
        koName: whisky.koName,
        imageUrl: whisky.imageUrl,
      }); // 상태 타입 일치

      // 상위 컴포넌트로 선택된 위스키 정보 전달 (형식 맞추기)
      if (onWhiskySelect) {
        const selectedData = {
          id: whisky.id,
          koName: whisky.koName,
          // LikedWhisky 타입에 whiskyImg가 있다고 가정하고 접근
          // 만약 없다면 undefined 처리 필요
          imageUrl: whisky.imageUrl, // LikedWhisky의 이미지 속성 사용
        };
        onWhiskySelect(selectedData);
      }

      // 내부 Dialog 닫기 (찜 목록만)
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

    // 선택된 위스키가 있는 경우 이미지 표시 (LikedWhisky 타입에 맞춰 접근)
    if (selectedWhisky) {
      const imageUrl = selectedWhisky.imageUrl || exampleImage; // LikedWhisky의 이미지 속성

      return (
        <div className="w-full h-full flex items-center justify-center overflow-hidden">
          <img
            src={imageUrl}
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
          {/* 카메라로 검색 */}
          <Btn
            size="l"
            color="color-wood-70"
            text="카메라로 검색"
            textColor="text-white"
            onClick={() => navigate('/ocr')}
            className="w-full"
          />
          {/* 전체 위스키 목록 검색 */}
          <Dialog open={searchDialogOpen} onOpenChange={setSearchDialogOpen}>
            <DialogTrigger asChild>
              <Btn
                size="l"
                color="color-wood-70"
                text="위스키 목록에서 검색"
                textColor="text-white"
                className="w-full"
              />
            </DialogTrigger>
            <DialogContent className="w-[370px] h-[600px] p-3 flex flex-col overflow-hidden border-none rounded-[18px]">
              <SearchWhiskyContent
                onSelect={(whisky) => {
                  setSelectedWhisky({
                    id: whisky.id,
                    koName: whisky.koName,
                    imageUrl: whisky.imageUrl,
                  });
                  onWhiskySelect?.(whisky);
                  setSearchDialogOpen(false);
                  setTimeout(() => closeParentDialog(), 100);
                }}
                closeDialog={() => {
                  setSearchDialogOpen(false);
                  setTimeout(() => closeParentDialog(), 100);
                }}
              />
            </DialogContent>
          </Dialog>
          {/** 찜 목록에서 선택 */}
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
