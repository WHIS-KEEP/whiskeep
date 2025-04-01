// Detail/{whiskyId} 로 접속

import { useParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';

const DetailPage = () => {
  const { whiskyId } = useParams();

  return (
    <ScrollArea className="flex-1 bg-background">
      <div style={{ paddingBottom: '150px' }}>
        <div className="p-4">DetailPage {whiskyId}</div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default DetailPage;
