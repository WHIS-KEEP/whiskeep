import QuickRecordSection from '@/components/ui/main/QuickRecordSection';
import WhiskyRecommendationSection from '@/components/ui/main/WhiskyRecommendationSection';

const MainPage = () => {
  return (
    <div className="flex flex-col gap-8 bg-white w-full max-w-3xl mx-auto rounded-t-[18px] py-5 px-0 mb-0">
      <QuickRecordSection />
      <div className="w-full">
        <WhiskyRecommendationSection />
      </div>
    </div>
  );
};

export default MainPage;
