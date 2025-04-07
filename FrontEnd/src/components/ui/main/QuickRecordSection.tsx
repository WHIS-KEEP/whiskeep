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

interface WhiskyData {
  id: number;
  koName: string;
  imageUrl?: string;
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
  <div className="flex items-center gap-0.5">
    {Array.from({ length: max }).map((_, index) => (
      <Star
        key={index}
        className={cn(
          'h-5 w-5 cursor-pointer',
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

  const handleSubmitRecord = async () => {
    const isSuccess = await submitRecord({
      whiskyId: selectedWhisky?.id,
      rating: userRating,
      content: comment,
      isPublic,
    });

    if (isSuccess) {
      alert('기록이 성공적으로 등록되었습니다.');
      // 등록 성공 후 초기화
      setSelectedWhisky(undefined);
      setUserRating(0);
      setComment('');
      setIsPublic(false);
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
        <div className="flex items-center gap-2">
          <span role="img" aria-label="whisky glass">
            🥃
          </span>
          <h2 className="font-semibold text-base">오늘 한 잔</h2>
          <p className="text-xs text-gray-500 ml-1">
            당신의 오늘 한 잔 빠르게 기록해보세요.
          </p>
        </div>

        <div className="flex items-center gap-3 border border-transparent hover:border-gray-200 p-2 rounded-lg transition-colors">
          <DialogTrigger asChild>
            <div className="flex items-center justify-center h-16 w-12 bg-gray-300 text-white rounded-lg shrink-0 overflow-hidden cursor-pointer">
              {selectedWhisky?.imageUrl ? (
                <img
                  src={selectedWhisky.imageUrl}
                  alt="whisky"
                  className="w-full h-full object-contain"
                  onError={(e) => (e.currentTarget.src = exampleImage)}
                />
              ) : (
                <Plus size={24} />
              )}
            </div>
          </DialogTrigger>

          <div className="flex-grow flex flex-col gap-2">
            <StarRating rating={userRating} onRatingChange={setUserRating} />
            <div className="relative flex items-center">
              <Input
                type="text"
                placeholder="한 잔이니까 한 마디...☆"
                className="text-sm pr-10 h-8 border-b rounded-none border-0 border-gray-300 focus-visible:ring-0 focus-visible:border-b-primary"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 h-8 w-8"
                onClick={handleSubmitRecord}
              >
                <Send size={16} className="text-gray-400" />
              </Button>
            </div>
          </div>

          <div className="flex flex-col items-center gap-1 shrink-0 ml-2">
            <span className="text-xs text-gray-500">
              {isPublic ? '공개' : '비공개'}
            </span>
            <Switch checked={isPublic} onCheckedChange={setIsPublic} />
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
          onWhiskySelect={setSelectedWhisky}
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
