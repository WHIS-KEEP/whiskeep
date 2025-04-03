import React, { useState, useRef } from 'react';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { Image as ImageIcon } from 'lucide-react';
import whiskyPlaceholder from '../assets/bottle.png';

// 커스텀 훅 가져오기
import useImageUpload from '../hooks/mutations/useImageUpload';
import useRecordSubmit, {
  WhiskyInfo,
} from '../hooks/mutations/useRecordSubmit';

// Dialog 컴포넌트 가져오기
import WhiskySelectionDialog from '@/components/ui/Modal';
import {
  Dialog,
  DialogContent,
  DialogClose,
  DialogTrigger,
} from '@/components/shadcn/dialog';

const RecordPage: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 상태 관리
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);
  const [selectedWhisky, setSelectedWhisky] = useState<WhiskyInfo | null>(null);

  // 모달 상태 관리
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  // 다이얼로그 닫기 버튼 ref
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // 커스텀 훅 사용
  const { uploadedImageUrl, isUploading, uploadError, uploadImage } =
    useImageUpload();

  const { isSubmitting, submitError, submitRecord } = useRecordSubmit();

  // 위스키 선택 시 처리
  const handleSelectWhisky = (whisky: {
    id: number;
    name: string;
    imageUrl?: string;
  }) => {
    console.log('Selected whisky in RecordPage:', whisky);
    // 선택된 위스키 정보 상태 업데이트
    setSelectedWhisky({
      id: whisky.id,
      name: whisky.name,
      imageUrl: whisky.imageUrl || whiskyPlaceholder,
    });

    // 모달 닫기 (상태 업데이트)
    setIsDialogOpen(false);
  };

  // 모달 닫기 핸들러
  const handleCloseDialog = () => {
    // 프로그래매틱하게 다이얼로그 닫기 버튼 클릭
    if (dialogCloseRef.current) {
      dialogCloseRef.current.click();
    }
  };

  // 파일 선택 창 열기
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 파일 변경 시 처리
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch {
      // 변수 없이 catch 블록 사용
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 기록 등록 처리
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('기록 내용을 입력해주세요.');
      return;
    }

    if (!selectedWhisky) {
      alert('위스키를 선택해주세요.');
      return;
    }

    const success = await submitRecord({
      whiskyId: selectedWhisky.id,
      rating,
      content,
      isPublic,
      recordImg: uploadedImageUrl, // imagePath 대신 recordImg로 변경
    });

    if (success) {
      alert('기록이 성공적으로 등록되었습니다.');
      window.location.href = '/collection';
    } else if (submitError) {
      alert(submitError.message || '기록 등록에 실패했습니다.');
    }
  };

  // 로딩 상태 통합
  const isLoading = isUploading || isSubmitting;

  // 선택된 위스키가 있을 때와 없을 때 다이얼로그 표시 내용
  const dialogBoxContent = selectedWhisky?.imageUrl ? (
    <div className="w-full h-full flex items-center justify-center overflow-hidden">
      <img
        src={selectedWhisky.imageUrl}
        alt={selectedWhisky.name}
        className="w-full h-full object-contain"
        onError={(e) => (e.currentTarget.src = whiskyPlaceholder)}
      />
    </div>
  ) : (
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
      <ScrollArea className="flex-1 bg-background rounded-[18px]">
        <div className="p-4 pb-20">
          {/* 기록 등록 제목 */}
          <div className="flex items-center pb-1 mb-3">
            <p className="text-black-800 font-bold text-xl mr-2">기록 등록</p>
            <div className="h-0.5 bg-gray-200 flex-grow"></div>
          </div>

          {/* 위스키 선택 영역 - Dialog로 감싸기 */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <div className="flex justify-center mb-6">
                <div className="w-40 h-55 border border-gray-300 rounded-md flex flex-col items-center justify-center cursor-pointer bg-white">
                  {selectedWhisky ? (
                    <>
                      <img
                        src={selectedWhisky.imageUrl || whiskyPlaceholder}
                        alt={selectedWhisky.name}
                        className="w-24 h-32 object-contain"
                      />
                      <p className="text-gray-700 text-sm mt-2">
                        {selectedWhisky.name}
                      </p>
                    </>
                  ) : (
                    <>
                      <div className="relative">
                        <img
                          src={whiskyPlaceholder}
                          alt="위스키 선택"
                          className="w-24 h-32 object-contain grayscale opacity-60"
                        />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <span className="text-white text-xl font-bold">
                            +
                          </span>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-2">
                        위스키를 선택하세요!
                      </p>
                    </>
                  )}
                </div>
              </div>
            </DialogTrigger>

            {/* Modal Content */}
            <DialogContent className="w-[370px] max-h-[600px] overflow-hidden border-none rounded-[18px]">
              <WhiskySelectionDialog
                variant="regist"
                title="위스키를 선택해주세요"
                boxContent={dialogBoxContent}
                onWhiskySelect={handleSelectWhisky}
                onClose={handleCloseDialog}
              />
              {/* 숨겨진 닫기 버튼 (프로그래매틱 닫기용) */}
              <DialogClose asChild>
                <button className="hidden" ref={dialogCloseRef}>
                  닫기
                </button>
              </DialogClose>
            </DialogContent>
          </Dialog>

          {/* 별점 및 공개 여부 */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer ${star <= rating ? 'text-primary' : 'text-gray-200'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-m text-gray-500">공개</span>
              <div className="relative">
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={isPublic}
                  onChange={() => setIsPublic(!isPublic)}
                  id="public-toggle"
                />
                <label
                  htmlFor="public-toggle"
                  className={`block w-10 h-6 rounded-full transition-colors ${isPublic ? 'bg-wood' : 'bg-primary-50'}`}
                >
                  <span
                    className={`absolute w-4 h-4 bg-white rounded-full top-1 left-1 transition-transform ${isPublic ? 'transform translate-x-4' : ''}`}
                  />
                </label>
              </div>
            </div>
          </div>

          {/* 기록 입력 영역 */}
          <textarea
            placeholder="기록을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-98 p-4 border border-gray-300 rounded-lg resize-none mb-2 focus:outline-none"
          />

          {/* 숨겨진 파일 입력 필드 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* 사진 등록 버튼 */}
          <div className="flex flex-col gap-2 mb-2">
            <button
              type="button"
              className="flex items-center gap-1 text-main"
              onClick={handleImageButtonClick}
              disabled={isLoading}
            >
              <ImageIcon size={15} />
              <span>{isUploading ? '업로드 중...' : '사진 등록'}</span>
            </button>

            {uploadedImageUrl && (
              <div className="mt-2">
                <p className="text-sm text-green-600 flex items-center gap-1 mb-2">
                  <span>✓</span>
                  <span>이미지가 업로드되었습니다</span>
                </p>
                {/* 이미지 미리보기 */}
                <div className="w-full h-40 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={uploadedImageUrl}
                    alt="업로드된 이미지"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="text-sm text-red-600">
                {uploadError.message || '이미지 업로드에 실패했습니다.'}
              </div>
            )}
          </div>

          {/* 등록 버튼 */}
          <button
            type="button"
            className={`w-full py-3 rounded-md mt-auto transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-wood-70 text-white hover:bg-[#c5b89e]'
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isSubmitting ? '등록 중...' : '등록하기'}
          </button>
        </div>
        <ScrollBar orientation="vertical" />
      </ScrollArea>
    </>
  );
};

export default RecordPage;
