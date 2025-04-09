import { useState } from 'react';
import SearchWhiskyResult from '@/components/ui/search/SearchWhiskyResult';
import { OcrResponse } from '@/lib/api/OCR';

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

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-grow overflow-hidden">
        <h2 className="text-lg font-semibold mb-4 text-center">
          이미지 검색결과 {whiskies.length}개
        </h2>
        <SearchWhiskyResult
          items={whiskies}
          selectedId={selectedId}
          onSelect={handleWhiskyClick}
          height="100%"
          onLoadMore={() => {}}
          hasNext={false}
          shouldScrollToTops={false}
        />
      </div>
    </div>
  );
};

export default OcrWhiskyContent;
