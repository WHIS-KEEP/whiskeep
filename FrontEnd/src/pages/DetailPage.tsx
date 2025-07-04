import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { ChevronLeft, Star } from 'lucide-react';
import PaginationBtn from '@/components/ui/PagenationBtn';
import useAuth from '@/store/useContext';
import TastingRadarChart from '@/components/ui/TastingRadarChart';
import { cn } from '@/lib/util/utils';
import { formatDateTime } from '@/lib/util/formatDate';
import HeartButton from '@/components/ui/Heart';

// React Query 훅 임포트
import {
  useWhiskyDetail,
  useWhiskyRecords,
} from '@/hooks/queries/useWhiskyQueries';

// 추천 정보를 가져오는 훅 추가
import { useRecommendQuery } from '@/hooks/queries/useRecommendQuery';
// 샘플 이미지 (실제 구현 시 경로 수정 필요)
import backgroundImage from '@/assets/whisky_background.png';

const DetailPage = () => {
  const { whiskyId } = useParams<{ whiskyId: string }>();
  const whiskyIdNumber = whiskyId ? parseInt(whiskyId, 10) : 0;

  // 컴포넌트 내부
  const [page, setPage] = useState(1);

  const { user } = useAuth();

  const [isWhiskeepPick, setIsWhiskeepPick] = useState<boolean>(false);

  // React Query 훅 사용
  const {
    data: whiskyDetail,
    isLoading: isDetailLoading,
    error: detailError,
  } = useWhiskyDetail(whiskyIdNumber);

  const { data: recordsData, isLoading: isRecordsLoading } = useWhiskyRecords(
    whiskyIdNumber,
    page,
  );

  // 추천 목록 데이터 가져오기
  const { data: recommendations } = useRecommendQuery();

  // 현재 위스키가 추천 목록에 있는지 확인
  useEffect(() => {
    if (recommendations && recommendations.length > 0) {
      const isInRecommendList = recommendations.some(
        (whisky) => whisky.whiskyId === whiskyIdNumber,
      );
      setIsWhiskeepPick(isInRecommendList);
    }
  }, [recommendations, whiskyIdNumber]);

  // 뒤로가기 핸들러
  const handleGoBack = () => {
    window.history.back();
  };

  // 페이지 변경
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // 별점 렌더링 컴포넌트
  const StarRating = ({
    rating = 0,
    max = 5,
  }: {
    rating: number;
    max?: number;
  }) => (
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
                : 'fill-gray-300 text-gray-300',
          )}
        />
      ))}
    </div>
  );

  // 로딩 상태 처리
  if (isDetailLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>위스키 정보를 불러오는 중...</p>
      </div>
    );
  }

  // 에러 상태 처리
  if (detailError) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p>위스키 정보를 불러오는데 실패했습니다.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1 bg-white w-full max-w-screen-md mx-auto ">
      <div style={{ paddingBottom: '0' }}>
        {/* 헤더 백 버튼 */}
        <div className="flex items-center p-4">
          <button
            className="mr-2 text-primary-dark"
            onClick={handleGoBack}
            aria-label="뒤로가기"
          >
            <ChevronLeft size={24} />
          </button>
        </div>

        {/* 위스키 이미지 섹션 */}
        <div className="relative">
          <div
            className="w-full h-[300px] relative"
            style={{
              backgroundImage: `url(${backgroundImage})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          >
            {/* 위스키 이미지를 오른쪽으로 배치 */}
            {whiskyDetail?.whiskyImg && (
              <div className="absolute bottom-0 right-12 h-[280px] flex items-end">
                <img
                  src={whiskyDetail.whiskyImg}
                  alt={whiskyDetail.koName}
                  className="h-full object-contain z-10"
                />
              </div>
            )}
          </div>

          {/* Wiskeep's Pick 배지 */}
          {isWhiskeepPick && (
            <div className="absolute left-4 bottom-4 bg-rose-300 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm z-20">
              Whiskeep's Pick
            </div>
          )}
        </div>

        <div className="p-4">
          <div className="flex justify-between items-start">
            <h1 className="text-xl font-bold">{whiskyDetail?.koName}</h1>
            <div className="mr-3 mt-1">
              <HeartButton
                whiskyId={whiskyIdNumber}
                forceLikedState={whiskyDetail?.isLiked}
                className="static" // absolute 대신 static 사용
                buttonClassName="bg-transparent shadow-none border-none"
                heartIconClassName="size-7"
              />
            </div>
          </div>
          <p className="text-gray-600 text-sm">{whiskyDetail?.enName}</p>
        </div>
        {/* 테이스팅 프로필 섹션 */}
        <div className="p-4 border-b border-gray-200">
          <div
            className="p-4 rounded-lg text-white"
            style={{ backgroundColor: 'var(--bg-muted)' }}
          >
            <h2 className="text-lg font-medium text-gray-600 mb-2">
              <span className="font-bold">
                {user ? `${user.nickname}님` : '게스트님'}
              </span>{' '}
              취향 분석
            </h2>
            {/* 테이스팅 프로필 차트 추가 - 이제 내부에 탭 선택 UI 포함 */}
            <div className="w-full h-50 flex items-center justify-center mt-2 mb-6">
              <TastingRadarChart
                whiskyId={whiskyIdNumber}
                height="110%"
                width="110%"
                className="w-full h-full"
              />
            </div>
          </div>
        </div>

        {/* 상세 정보 테이블 */}
        <div className="p-4 border-b border-gray-200">
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 font-medium w-1/2">양조장</td>
                <td className="py-2 text-left">{whiskyDetail?.distillery}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium w-1/2">나라, 지역</td>
                <td className="py-2 text-left">{whiskyDetail?.country}</td>
              </tr>
              <tr>
                <td className="py-2 font-medium w-1/2">도수</td>
                <td className="py-2 text-left">{whiskyDetail?.abv}%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium">종류</td>
                <td className="py-2 text-left">{whiskyDetail?.type}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 제품 설명 */}
        <div className="p-5 border-b border-gray-200">
          <p className="text-sm text-gray-700 leading-relaxed">
            {whiskyDetail?.description}
          </p>
        </div>

        {/* 테이스팅 노트 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-bold mb-3">Tasting Notes</h2>
          <table className="w-full">
            <tbody>
              <tr>
                <td className="py-2 font-medium w-1/3">향</td>
                <td className="py-2 text-left">
                  {whiskyDetail?.tastingNotes?.nosing?.join(', ') ||
                    '정보 없음'}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium w-1/3">맛</td>
                <td className="py-2 text-left">
                  {whiskyDetail?.tastingNotes?.tasting?.join(', ') ||
                    '정보 없음'}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium w-1/3">피니시</td>
                <td className="py-2 text-left">
                  {whiskyDetail?.tastingNotes?.finish?.join(', ') ||
                    '정보 없음'}
                </td>
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
              <span className="mr-1">
                {whiskyDetail?.recordInfo?.ratingAvg?.toFixed(1) || '0.0'}
              </span>
              <span className="text-gray-500">
                ({whiskyDetail?.recordInfo?.recordCnt || 0})
              </span>
            </div>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-8 pb-14">
            {isRecordsLoading ? (
              <p className="text-center py-4">리뷰를 불러오는 중...</p>
            ) : recordsData?.records && recordsData.records.length > 0 ? (
              recordsData.records.map((record) => (
                <div
                  key={record.recordId}
                  className="border-b border-gray-200 pb-6"
                >
                  <div className="flex justify-between">
                    {/* 왼쪽: 프로필, 이름, 내용, 별점 */}
                    <div className="flex-1 pr-3">
                      {/* 프로필 및 이름 */}
                      <div className="flex items-center mb-3">
                        <div className="w-10 h-10 bg-rose-200 rounded-full flex items-center justify-center text-white text-sm mr-3">
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
                          <div className="text-medium font-medium">
                            {record.nickname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {formatDateTime(record.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* 내용 */}
                      <p className="text-base mb-3 text-left">
                        {record.content}
                      </p>

                      {/* 별점을 내용 아래, 왼쪽으로 배치 */}
                      <div>
                        <StarRating rating={record.rating} />
                      </div>
                    </div>

                    {/* 오른쪽: 이미지*/}
                    {record.recordImg && (
                      <div className="ml-3">
                        <img
                          src={record.recordImg}
                          alt="리뷰 이미지"
                          className="w-28 h-28 object-cover rounded-md"
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center py-8 mt-10 text-gray-500">
                공개된 기록이 없습니다
              </p>
            )}
          </div>

          {/* 페이지네이션 */}
          {recordsData?.pageInfo && recordsData.pageInfo.totalPages > 0 && (
            <div className="flex justify-center items-center mt-6 space-x-2">
              <PaginationBtn
                type="prev"
                onClick={() => handlePageChange(Math.max(1, page - 1))}
                disabled={page === 1}
              />

              {Array.from({ length: recordsData.pageInfo.totalPages }).map(
                (_, index) => {
                  const pageNumber = index + 1;
                  // 5페이지 이상일 경우 현재 페이지 주변 페이지만 표시
                  if (
                    recordsData.pageInfo.totalPages <= 5 ||
                    pageNumber === 1 ||
                    pageNumber === recordsData.pageInfo.totalPages ||
                    Math.abs(pageNumber - page) <= 1
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
                    (pageNumber === recordsData.pageInfo.totalPages - 1 &&
                      page < recordsData.pageInfo.totalPages - 2)
                  ) {
                    return (
                      <span key={pageNumber} className="text-gray-400">
                        ...
                      </span>
                    );
                  }
                  return null;
                },
              )}

              <PaginationBtn
                type="next"
                onClick={() =>
                  handlePageChange(
                    Math.min(recordsData.pageInfo.totalPages, page + 1),
                  )
                }
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

export default DetailPage; // 메인 컴포넌트 내보내기
