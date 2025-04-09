import { useState, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/shadcn/dialog';
import { Input } from '@/components/shadcn/input';
import { Button } from '@/components/shadcn/Button';
import { Switch } from '@/components/shadcn/switch';
import { Plus, Send, Star } from 'lucide-react';
import WhiskySelectionDialog from '@/components/ui/Modal';
import exampleImage from '@/assets/example.png';
import { cn } from '@/lib/util/utils';
import useRecordSubmit from '@/hooks/mutations/useRecordSubmit';
import whiskyGlass from '@/assets/whiskyGlass.svg';

// 백엔드 API 응답 타입에 맞게 인터페이스 수정
interface WhiskyData {
  whiskyId: number;
  koName: string;
  whiskyImg?: string;
}

const StarRating = ({
  rating = 0,
  max = 5,
  onRatingChange,
}: {
  rating?: number;
  max?: number;
  onRatingChange?: (rating: number) => void;
}) => (
  <div className="flex items-center gap-1">
    {Array.from({ length: max }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          'h-6 w-6 cursor-pointer',
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-300 text-gray-300',
        )}
        onClick={() => onRatingChange?.(index + 1)}
      />
    ))}
  </div>
);

export default function QuickRecordSection() {
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const dialogCloseRef = useRef<HTMLButtonElement>(null);
  const [selectedWhisky, setSelectedWhisky] = useState<WhiskyData>();
  const [userRating, setUserRating] = useState(0);

  const { submitRecord } = useRecordSubmit();

  const handleCloseDialog = () => dialogCloseRef.current?.click();

  const handleWhiskySelect = (whisky: {
    id: number;
    koName: string;
    imageUrl: string | undefined;
  }) => {
    const whiskyData: WhiskyData = {
      whiskyId: whisky.id,
      koName: whisky.koName,
      whiskyImg: whisky.imageUrl,
    };
    setSelectedWhisky(whiskyData);
    handleCloseDialog();
  };

  const handleSubmitRecord = async () => {
    const isSuccess = await submitRecord({
      whiskyId: selectedWhisky?.whiskyId,
      rating: userRating,
      content: comment,
      isPublic,
    });

    if (isSuccess) {
      alert('기록이 성공적으로 등록되었습니다.');
      setSelectedWhisky(undefined);
      setUserRating(0);
      setComment('');
      setIsPublic(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-4">
        {/* 헤더 부분 */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center  gap-2">
            <img src={whiskyGlass} alt="whisky glass" className="w-6 h-6" />
            <h2 className="font-semibold text-lg">오늘 한 잔</h2>
            <p className="text-sm text-gray-500">
              당신의 오늘 한 잔을 기록해보세요
            </p>
          </div>
        </div>

        {/* 메인 컨텐츠 */}
        <div className="flex items-center gap-4 border border-gray-200 p-4 rounded-lg transition-colors hover:bg-gray-50">
          {/* 이미지 부분 - 크기를 더 크게 증가 */}
          <DialogTrigger asChild>
            <div
              className={cn(
                'flex items-center justify-center rounded-lg shrink-0 overflow-hidden cursor-pointer transition-all',
                selectedWhisky?.whiskyImg
                  ? 'h-24 w- bg-transparent' // 이미지 크기 더 크게 증가
                  : 'h-24 w-24 bg-gray-100 text-gray-500 border-2 border-dashed border-gray-300 hover:bg-gray-200', // 선택 전 크기도 증가
              )}
            >
              {selectedWhisky?.whiskyImg ? (
                <div className="w-full h-full flex items-center justify-center">
                  <img
                    src={selectedWhisky.whiskyImg}
                    alt={selectedWhisky.koName}
                    className="w-full h-full object-contain p-2"
                    onError={(e) => (e.currentTarget.src = exampleImage)}
                  />
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center">
                  <Plus size={32} />
                  <span className="text-xs mt-1">위스키 선택</span>
                </div>
              )}
            </div>
          </DialogTrigger>

          {/* 컨텐츠 부분 - 순서 변경 */}
          <div className="flex-grow flex flex-col gap-3 py-1">
            {/* 위스키 이름 먼저 표시 (선택했을 경우) - 순서 변경 */}
            {selectedWhisky && (
              <div className="text-base font-medium text-gray-700 bg-gray-50 p-2 rounded-md">
                {selectedWhisky.koName}
              </div>
            )}

            {/* 별점과 공개/비공개 그 다음에 표시 - 순서 변경 */}
            <div className="flex items-center justify-between mt-0">
              <StarRating rating={userRating} onRatingChange={setUserRating} />
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-sm text-gray-500">
                  {isPublic ? '공개' : '비공개'}
                </span>
                <Switch
                  checked={isPublic}
                  onCheckedChange={setIsPublic}
                  className="scale-110"
                />
              </div>
            </div>

            {/* 입력 필드 */}
            <div className="relative flex items-center mt-1">
              <Input
                type="text"
                placeholder="위스킵 해보세요 😊"
                className="text-m pr-10 h-10 border-b rounded-none border-0 border-gray-200 focus-visible:ring-0 focus-visible:border-b-primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-10 w-10"
                onClick={handleSubmitRecord}
              >
                <Send
                  size={18}
                  className={cn(
                    'transition-colors',
                    !selectedWhisky || userRating === 0
                      ? 'text-gray-300'
                      : 'text-primary hover:text-primary-dark',
                  )}
                />
              </Button>
            </div>
          </div>
        </div>
      </div>

      <DialogContent className="w-[370px] max-h-[600px] overflow-hidden border-none rounded-[18px]">
        <WhiskySelectionDialog
          variant="regist"
          boxContent={
            <div className="w-full h-full flex items-center justify-center overflow-hidden">
              <Plus size={32} />
            </div>
          }
          onWhiskySelect={handleWhiskySelect}
          onClose={handleCloseDialog}
        />
        <DialogClose asChild>
          <button className="hidden" ref={dialogCloseRef}>
            닫기
          </button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
