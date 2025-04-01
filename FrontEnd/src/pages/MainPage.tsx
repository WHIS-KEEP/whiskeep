// FILE: MainPageContent.tsx
import { useState, useRef } from 'react';
import { cn } from '@/lib/util/utils';
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogClose,
} from '@/components/shadcn/dialog';
import { Button } from '@/components/shadcn/button';
import { Input } from '@/components/shadcn/input';
import { Switch } from '@/components/shadcn/switch';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { Star, Send, Plus } from 'lucide-react'; // Using lucide-react for icons

// Import the dialog content component
import WhiskySelectionDialog from '@/components/ui/Modal';
// Import your Whiskycard component
import Whiskycard from '@/components/ui/Whiskycard'; // Adjust path as needed

// 이미지 임포트 추가
import sampleImage from '../assets/sample.png';
import exampleImage from '../assets/example.png';

// 위스키 데이터 인터페이스 추가
interface WhiskyData {
  id: string;
  name: string;
  enName?: string;
  type?: string;
  country?: string;
  avgRating?: number;
  imageUrl?: string;
  abv?: number;
  rating?: number;
  description?: string;
}

// Dummy data for recommendations
const dummyRecommendations = Array.from({ length: 8 }, (_, i) => ({
  id: `rec_${i + 1}`,
  imageUrl: i % 2 === 0 ? sampleImage : exampleImage, // 임포트한 이미지 사용
  name: `추천 위스키 ${i + 1}`,
  description: `싱글 몰트 | 4${i % 6}%`,
  rating: Math.round((4 + Math.random()) * 10) / 10, // Example rating
  tag: i % 4 === 0 ? 'OAK' : i % 4 === 1 ? 'SHERRY' : undefined, // Example tag
}));

// Simple Star Rating Component
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
          'h-5 w-5 cursor-pointer', // 클릭 가능하도록 cursor 추가
          index < Math.floor(rating)
            ? 'fill-yellow-400 text-yellow-400'
            : 'fill-gray-300 text-gray-300', // Basic fill logic
        )}
        onClick={() => onRatingChange && onRatingChange(index + 1)}
      />
    ))}
  </div>
);

export function MainPageContent() {
  // State for the input field and toggle
  const [comment, setComment] = useState('');
  const [isPublic, setIsPublic] = useState(false);
  // Dialog 열림/닫힘 상태 추가
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  // 다이얼로그 닫기 버튼 ref
  const dialogCloseRef = useRef<HTMLButtonElement>(null);

  // 선택된 위스키와 평점 상태 추가
  const [selectedWhisky, setSelectedWhisky] = useState<WhiskyData | null>(null);
  const [userRating, setUserRating] = useState(0);

  // 위스키 선택 핸들러
  const handleWhiskySelect = (whisky: WhiskyData) => {
    console.log('Selected whisky in MainPage:', whisky);
    setSelectedWhisky(whisky);

    // 프로그래매틱하게 다이얼로그 닫기
    setIsDialogOpen(false);
  };

  // 모달 닫기 핸들러
  const handleCloseDialog = () => {
    // 프로그래매틱하게 다이얼로그 닫기 버튼 클릭
    if (dialogCloseRef.current) {
      dialogCloseRef.current.click();
    }
  };

  // Placeholder BoxContent for the Dialog (showing the bottle icon)
  const dialogBoxContent = (
    <div className="flex items-center justify-center w-full h-full bg-gray-200">
      <div className="flex items-center justify-center h-16 w-16 bg-gray-400 text-white rounded-lg">
        <Plus size={32} />
      </div>
    </div>
  );

  return (
    <div className="flex flex-col gap-6 bg-gray-50 min-h-screen w-[412px] mx-auto rounded-[18px]">
      {/* --- 오늘 한 잔 Section --- */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <div className="bg-white rounded-xl shadow p-4 flex flex-col gap-3">
          {/* Section Title */}
          <div className="flex items-center gap-2">
            <span role="img" aria-label="whisky glass">
              🥃
            </span>
            <h2 className="font-semibold text-base">오늘 한 잔</h2>
            <p className="text-xs text-gray-500 ml-1">
              당신의 오늘 한 잔 빠르게 기록해보세요.
            </p>
          </div>

          {/* Main Content Area */}
          <div className="flex items-center gap-3 border border-transparent hover:border-gray-200 p-2 rounded-lg transition-colors">
            {/* 위스키 이미지 또는 기본 아이콘 */}
            <DialogTrigger asChild>
              <div className="flex items-center justify-center h-16 w-12 bg-gray-300 text-white rounded-lg shrink-0 overflow-hidden cursor-pointer">
                {selectedWhisky && selectedWhisky.imageUrl ? (
                  <img
                    src={selectedWhisky.imageUrl}
                    alt={selectedWhisky.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = exampleImage)}
                  />
                ) : (
                  <Plus size={24} />
                )}
              </div>
            </DialogTrigger>

            {/* Rating and Input Area */}
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
                {/* Send Icon (conditionally rendered or styled) */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute right-0 h-8 w-8"
                >
                  <Send size={16} className="text-gray-400" />
                </Button>
              </div>
            </div>

            {/* Public Toggle */}
            <div className="flex flex-col items-center gap-1 shrink-0 ml-2">
              <span className="text-xs text-gray-500">공개</span>
              <Switch
                checked={isPublic}
                onCheckedChange={setIsPublic}
                aria-readonly
              />
            </div>
          </div>
        </div>
        {/* Dialog Content (Rendered when triggered) */}
        <DialogContent className="w-[370px] max-h-[600px] overflow-hidden border-none rounded-[18px]">
          <WhiskySelectionDialog
            variant="regist" // Or "edit" depending on context
            boxContent={
              selectedWhisky?.imageUrl ? (
                <div className="w-full h-full flex items-center justify-center overflow-hidden">
                  <img
                    src={selectedWhisky.imageUrl}
                    alt={selectedWhisky.name}
                    className="w-full h-full object-contain"
                    onError={(e) => (e.currentTarget.src = exampleImage)}
                  />
                </div>
              ) : (
                dialogBoxContent
              )
            }
            onWhiskySelect={handleWhiskySelect}
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

      {/* --- 현진 님을 위한 위스키 추천 Section --- */}
      <div className="flex flex-col gap-3">
        <h2 className="font-semibold text-lg">현진 님을 위한 위스키 추천</h2>
        <ScrollArea className="w-full whitespace-nowrap rounded-md border">
          <div className="flex space-x-4 pb-4 p-2">
            {dummyRecommendations.map((whisky) => (
              <Whiskycard
                key={whisky.id}
                title={whisky.name}
                description={whisky.description}
                whiskyImage={whisky.imageUrl}
                showLikeButton={true}
                showChart={true}
                className="w-[180px] shrink-0"
              />
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

export default MainPageContent;
