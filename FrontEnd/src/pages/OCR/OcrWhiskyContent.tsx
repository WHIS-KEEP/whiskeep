import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { OcrResponse } from '@/lib/api/OCR';
import Btn from '@/components/ui/Btn';

interface Props {
  ocrResult: OcrResponse;
  onSelect: (whisky: {
    id: number;
    koName: string;
    imageUrl: string | undefined;
  }) => void;
  closeDialog?: () => void;
}

const OcrWhiskyContent = ({ ocrResult, onSelect, closeDialog }: Props) => {
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const navigate = useNavigate();

  const { whiskies } = ocrResult;

  const handleWhiskyClick = (id: number) => {
    const whisky = whiskies.find((w) => w.whiskyId === id);
    if (!whisky) return;

    setSelectedId(whisky.whiskyId);

    onSelect({
      id: whisky.whiskyId,
      koName: whisky.koName,
      imageUrl: whisky.whiskyImg,
    });

    closeDialog?.();
  };

  const handleRetry = () => {
    navigate('/ocr', {
      state: { origin: 'modal-camera' },
    });
  };

  return (
    <div className="flex flex-col max-w-full h-[500px] overflow-hidden items-center justify-between">
      <h2 className="text-lg font-semibold mb-3 text-center">
        이미지 검색결과 {whiskies.length}개
      </h2>

      {/* ✅ 리스트는 스크롤 가능, 버튼은 밀리지 않도록 */}
      <div className="w-full flex flex-col flex-grow overflow-hidden">
        <div className="w-full flex-grow overflow-y-auto mb-3 ">
          <SearchWhiskyResult
            items={whiskies}
            selectedId={selectedId}
            onSelect={handleWhiskyClick}
            height="auto"
            onLoadMore={() => {}}
            hasNext={false}
            shouldScrollToTops={false}
          />
        </div>

        {/* ✅ 고정된 버튼 */}
        <div className="flex-shrink-0">
          <Btn
            size="l"
            color="color-wood-70"
            text="다시 촬영하기"
            textColor="text-white"
            onClick={handleRetry}
            className="w-full"
          />
        </div>
      </div>
    </div>
  );
};

export default OcrWhiskyContent;
