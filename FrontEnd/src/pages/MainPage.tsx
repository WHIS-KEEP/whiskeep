import QuickRecordSection from '@/components/ui/main/QuickRecordSection';
import WhiskyRecommendationSection from '@/components/ui/main/WhiskyRecommendationSection';

const MainPage = () => {
  return (
    <div className="flex flex-col gap-10 bg-white w-full max-w-2xl mx-auto rounded-t-[18px] py-8 px-4 mb-16">
      <QuickRecordSection />
      <WhiskyRecommendationSection />
    </div>
  );
};

export default MainPage;