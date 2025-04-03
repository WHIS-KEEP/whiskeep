import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { Heart, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/shadcn/Button';
import PaginationBtn from '@/components/ui/PagenationBtn';

import { cn } from '@/lib/util/utils';
import { formatDateTime } from '@/lib/util/formatDate';


// API 및 타입 임포트
import { WhiskyDetail, RecordListResponse } from '@/types/whisky';
import { getWhiskyDetail, getWhiskyRecords, toggleWhiskyLike } from '@/lib/api/whisky';

// 샘플 이미지 (실제 구현 시 경로 수정 필요)
import sampleImage from '@/assets/sample.png';

const DetailPage = () => {
  const { whiskyId } = useParams<{ whiskyId: string }>();
  const [page, setPage] = useState(1);
  const [isLiked, setIsLiked] = useState(false);

  // 데이터 상태
  const [whiskyDetail, setWhiskyDetail] = useState<WhiskyDetail | null>(null);
  const [recordsData, setRecordsData] = useState<RecordListResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // 위스키 상세 정보 조회
  useEffect(() => {
    const fetchWhiskyDetail = async () => {
      if (!whiskyId) return;
      
      setIsLoading(true);
      try {
        // string을 number로 변환
        const data = await getWhiskyDetail(parseInt(whiskyId, 10));
        setWhiskyDetail(data);
        setError(null);
      } catch (err) {
        console.error('위스키 상세 정보 조회 실패:', err);
        setError('위스키 정보를 불러오는데 실패했습니다.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchWhiskyDetail();
  }, [whiskyId]);

  // 위스키 리뷰 목록 조회
  useEffect(() => {
    const fetchWhiskyRecords = async () => {
      if (!whiskyId) return;
      
      try {
        // string을 number로 변환
        const apiPage = page - 1;
        const data = await getWhiskyRecords(parseInt(whiskyId, 10,), apiPage);
        setRecordsData(data);
      } catch (err) {
        console.error('위스키 리뷰 목록 조회 실패:', err);
      }
    };

    fetchWhiskyRecords();
  }, [whiskyId, page]);

  // 좋아요 토글
  const handleLikeToggle = async () => {
    if (!whiskyId) return;
    
    try {
      // string을 number로 변환
      const result = await toggleWhiskyLike(parseInt(whiskyId, 10));
      setIsLiked(result.isLiked); // API 응답의 실제 상태 사용
    } catch (err) {
      console.error('위스키 좋아요 토글 실패:', err);
    }
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 별점 렌더링 컴포넌트
  const StarRating = ({ rating = 0, max = 5 }: { rating: number; max?: number }) => (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'h-4 w-4',
            index < Math.floor(rating)
              ? 'fill-yellow-400 text-yellow-400'
              : index < rating
              ? 'fill-yellow-400 text-yellow-400 opacity-60'
              : 'fill-gray-300 text-gray-300'
          )}
        />
      ))}
    </div>
  );

  // 로딩 상태 처리
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>위스키 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>{error}</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-white w-[412px] mx-auto">
      <div style={{ paddingBottom: '150px' }}>
        {/* 헤더 백 버튼 */}
        <div className="flex items-center p-4">
          <Link to="/list" className="mr-2">
            <ChevronLeft size={24} />
          </Link>
        </div>

        {/* 위스키 이미지 섹션 */}
        <div className="relative">
          <div className="w-full h-64 bg-gradient-to-b from-blue-100 to-purple-100 flex items-center justify-center overflow-hidden">
            <img
              src={whiskyDetail?.whiskyImg || sampleImage}
              alt={whiskyDetail?.koName}
              className="object-contain h-full"
            />
          </div>

          {/* Wiskeep's Pick 배지 */}
          <div className="absolute top-4 left-4 bg-rose-300 text-white px-3 py-1 rounded-full text-sm">
            Whiskeep's Pick
          </div>
          
          {/* 좋아요 버튼 */}
          <Button 
            onClick={handleLikeToggle}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 bg-white bg-opacity-70 rounded-full h-10 w-10"
          >
            <Heart 
              size={20} 
              fill={isLiked ? "#D42B2B" : "none"} 
              color={isLiked ? "#D42B2B" : "#000"} 
            />
          </Button>
        </div>

        {/* 제품 정보 섹션 */}
        <div className="p-4 border-b border-gray-200">
          <h1 className="text-xl font-bold">{whiskyDetail?.koName}</h1>
          <p className="text-gray-600 text-sm">{whiskyDetail?.enName}</p>
        </div>

        {/* 테이스팅 프로필 섹션 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-2">홍길동님 취향 분석</h2>
          <div className="bg-gray-100 p-4 rounded-lg">
            <div className="flex justify-between text-xs text-gray-500 mb-2">
              <span>Nosing</span>
              <span>|</span>
              <span>Tasting</span>
              <span>|</span>
              <span>Finish</span>
            </div>
            <div className="flex justify-center">
              {/* 테이스팅 프로필 차트 (백엔드에서 제공되면 추가) */}
              <div className="w-full h-40 bg-gray-200 rounded flex items-center justify-center">
                <p className="text-gray-500">테이스팅 프로필 차트</p>
              </div>
            </div>
          </div>
        </div>

        {/* 상세 정보 테이블 */}
        <div className="p-4 border-b border-gray-200">
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium">양조장</td>
                <td className="py-2 text-right">{whiskyDetail?.distillery}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium">나라, 지역</td>
                <td className="py-2 text-right">{whiskyDetail?.country}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium">도수</td>
                <td className="py-2 text-right">{whiskyDetail?.abv}%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">종류</td>
                <td className="py-2 text-right">{whiskyDetail?.type}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 제품 설명 */}
        <div className="p-4 border-b border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            {whiskyDetail?.description}
          </p>
        </div>

        {/* 테이스팅 노트 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold mb-3">Tasting Notes</h2>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium w-16">향</td>
                <td className="py-2">{whiskyDetail?.tastingNotes.nosing.join(', ')}</td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium">맛</td>
                <td className="py-2">{whiskyDetail?.tastingNotes.tasting.join(', ')}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">피니시</td>
                <td className="py-2">{whiskyDetail?.tastingNotes.finish.join(', ')}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 리뷰 섹션 */}
        <div className="p-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-bold">기록 노트</h2>
            <div className="flex items-center text-sm">
              <span className="font-bold mr-1">평점</span>
              <span className="mr-1">{whiskyDetail?.recordInfo.ratingAvg.toFixed(1)}</span>
              <span className="text-gray-500">({whiskyDetail?.recordInfo.recordCnt}+)</span>
            </div>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-4">
            {recordsData?.records.map((record) => (
              <div key={record.recordId} className="border-b border-gray-200 pb-4">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-rose-200 rounded-full flex items-center justify-center text-white text-xs mr-2">
                    {record.profileImage ? (
                      <img 
                        src={record.profileImage} 
                        alt={record.nickname} 
                        className="w-full h-full rounded-full object-cover" 
                      />
                    ) : (
                      record.nickname.charAt(0)
                    )}
                  </div>
                  <div>
                    <div className="font-medium">{record.nickname}</div>
                    <div className="text-xs text-gray-500">{formatDateTime(record.createdAt)}</div>
                  </div>
                </div>
                <p className="text-sm mb-2">{record.content}</p>
                {record.recordImg && (
                  <div className="mb-2">
                    <img 
                      src={record.recordImg} 
                      alt="리뷰 이미지" 
                      className="w-16 h-16 object-cover rounded-md" 
                    />
                  </div>
                )}
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Button variant="ghost" size="icon" className="h-8 w-8 p-0">
                      <Heart size={16} className="text-gray-400" />
                    </Button>
                    <span className="text-xs">3</span>
                  </div>
                  <StarRating rating={record.rating} />
                </div>
              </div>
            ))}
          </div>

          {/* 페이지네이션 */}
          {recordsData && recordsData.pageInfo && recordsData.pageInfo.totalPages  > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <PaginationBtn 
                type="prev"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              />
         
              {Array.from({ length: recordsData.pageInfo.totalPages }).map((_, index) => {
                const pageNumber = index + 1;
                // 5페이지 이상일 경우 현재 페이지 주변 페이지만 표시
                if (
                  recordsData.pageInfo.totalPages <= 5 ||
                  (pageNumber === 1) ||
                  (pageNumber === recordsData.pageInfo.totalPages) ||
                  (Math.abs(pageNumber - page) <= 1)
                ) {
                  return (
                    <PaginationBtn 
                      key={pageNumber}
                      page={pageNumber}
                      isActive={pageNumber === page}
                      onClick={() => handlePageChange(pageNumber)}
                    />
                  );
                } else if (
                  (pageNumber === 2 && page > 3) ||
                  (pageNumber === recordsData.pageInfo.totalPages - 1 && page < recordsData.pageInfo.totalPages - 2)
                ) {
                  return <span key={pageNumber} className="text-gray-400">...</span>;
                }
                return null;
              })}
              
              <PaginationBtn 
                type="next"
                onClick={() => handlePageChange(Math.min(recordsData.pageInfo.totalPages, page + 1))}
                disabled={page === recordsData.pageInfo.totalPages}
              />
            </div>
          )}
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default DetailPage;