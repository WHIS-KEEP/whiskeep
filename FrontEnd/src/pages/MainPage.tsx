import QuickRecordSection from '@/components/ui/main/QuickRecordSection';
import WhiskyRecommendationSection from '@/components/ui/main/WhiskyRecommendationSection';

const MainPage = () => {
  return (
    <div className="flex flex-col gap-6 bg-gray-50 w-[412px] mx-auto rounded-[18px] p-4">
      <QuickRecordSection />
      <WhiskyRecommendationSection />
    </div>
  );
};

export default MainPage;
