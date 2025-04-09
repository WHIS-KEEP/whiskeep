import QuickRecordSection from '@/components/ui/main/QuickRecordSection';
import WhiskyRecommendationSection from '@/components/ui/main/WhiskyRecommendationSection';
import { useLocation } from 'react-router-dom';

const MainPage = () => {
  const location = useLocation();
  const backToModal = location.state?.backToModal || false;
  const ocrResult = location.state?.ocrResult;
  return (
    <div className="flex flex-col gap-8 bg-white w-full max-w-3xl mx-auto rounded-t-[18px] py-5 px-0 mb-16">
      <QuickRecordSection
        autoOpen={backToModal}
        ocrResult={ocrResult}
      />
      <div className="w-full">
        <WhiskyRecommendationSection />
      </div>
    </div>
  );
};

export default MainPage;
