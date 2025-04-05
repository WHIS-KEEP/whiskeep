import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWhiskyRecord } from '@/hooks/queries/useRecordQueries';
import { ChevronLeft } from 'lucide-react';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { Separator } from '@/components/shadcn/separator';
import { AspectRatio } from '@/components/shadcn/aspect-ratio';

const WhiskyRecordPage: React.FC = () => {
  const { whiskyId } = useParams<{ whiskyId: string }>();
  const id = whiskyId ? parseInt(whiskyId) : 0;
  const navigate = useNavigate();

  // React Query 훅 사용
  const { data, isLoading, error } = useWhiskyRecord(id);

  // 상태 관리
  const [imgLoaded, setImgLoaded] = useState<boolean>(false);

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    window.history.back();
  };

  // 이미지 클릭 핸들러 - 상세 페이지로 이동
  const handleImageClick = (recordId: number) => {
    navigate(`/records/${whiskyId}/${recordId}`);
  };

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-primary-dark">로딩 중...</div>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-primary-dark">정보를 불러올 수 없습니다.</div>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={handleGoBack}
        >
          돌아가기
        </button>
      </div>
    );
  }

  // 데이터가 없는 경우
  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-4">
        <div className="text-primary-dark">데이터가 없습니다.</div>
        <button
          className="px-4 py-2 bg-gray-200 rounded"
          onClick={handleGoBack}
        >
          돌아가기
        </button>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-background">
      <div style={{ paddingBottom: '150px' }}>
        {/* 뒤로가기 버튼 */}
        <div className="flex items-center p-4">
          <button
            className="text-primary-dark"
            onClick={handleGoBack}
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        <div className="p-4 space-y-6">
          {/* 1. 위스키 정보 섹션 */}
          <div className="flex flex-col items-center space-y-4">
            {/* 위스키 병 이미지 */}
            <div className="w-full max-w-xs mx-auto">
              <img
                src={data.whiskyImg}
                alt={data.whiskyKoName}
                className="object-contain w-full h-auto max-h-64 mx-auto"
                onLoad={() => setImgLoaded(true)}
                style={{
                  opacity: imgLoaded ? 1 : 0,
                  transition: 'opacity 0.3s ease',
                }}
              />
              {!imgLoaded && (
                <div className="flex justify-center items-center h-64">
                  <p>이미지 로딩 중...</p>
                </div>
              )}
            </div>

            {/* 위스키 이름 및 정보 */}
            <div className="text-center">
              <h1 className="text-xl font-semibold text-primary-dark">
                {data.whiskyKoName}
              </h1>
              <p className="text-sm text-primary-50">{data.whiskyEnName}</p>
            </div>
          </div>

          {/* 구분선 */}
          <Separator className="my-2" />

          {/* 2. 나의 기록 섹션 */}
          <div className="space-y-3">
            {/* 기록 제목 */}
            <h2 className="text-lg font-semibold text-primary-dark">
              나의 기록
              {data.recordList && (
                <span className="text-sm text-primary-50 ml-1">
                  ({data.recordList.length})
                </span>
              )}
            </h2>

            {/* 기록 이미지 그리드 */}
            {data.recordList && data.recordList.length > 0 ? (
              <div className="grid grid-cols-3 gap-1">
                {data.recordList.map((record) => (
                  <AspectRatio
                    key={record.recordId}
                    ratio={1 / 1}
                    className="bg-primary-30 rounded-sm overflow-hidden"
                  >
                    <img
                      src={record.recordImg}
                      alt={`Record ${record.recordId}`}
                      className="object-cover w-full h-full transition-transform hover:scale-105"
                      onClick={() => handleImageClick(record.recordId)}
                    />
                  </AspectRatio>
                ))}
              </div>
            ) : (
              <p className="text-center py-4 text-primary-50">
                아직 기록이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default WhiskyRecordPage;
