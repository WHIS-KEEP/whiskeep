import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import Whiskycard from '@/components/ui/Whiskycard';
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
import useAuth from '@/store/useContext';

export default function WhiskyRecommendationSection() {
  const { user } = useAuth();
  const { data: recommends, isLoading, isError } = useRecommendQuery();

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 gap-6">
        <span className="loader"></span>
        <p>위스키를 추천 중입니다...</p>
      </div>
    );
  }

  if (isError || !recommends || recommends.length === 0) {
    return (
      <div className="fixed inset-0 flex flex-col justify-center items-center z-50 gap-6">
        <p>추천 결과가 존재하지 않습니다.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      <h2 className="font-semibold text-lg">
        {user?.name} 님을 위한 위스키 추천
      </h2>
      <ScrollArea className="w-full whitespace-nowrap rounded-md border">
        <div className="flex space-x-4 pb-4 p-2">
          {recommends.map((whisky) => (
            <Whiskycard
              key={whisky.whiskyId}
              koName={whisky.koName}
              enName={whisky.enName}
              type={whisky.type}
              whiskyImage={whisky.whiskyImg}
              abv={whisky.abv}
              showLikeButton={false}
              showChart={true}
              className="w-[180px] shrink-0"
            />
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
