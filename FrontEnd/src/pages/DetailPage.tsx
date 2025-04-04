import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { Heart, ChevronLeft, Star } from 'lucide-react';
import { Button } from '@/components/shadcn/Button';
import PaginationBtn from '@/components/ui/PagenationBtn';
import useAuth from '@/store/useContext';

import { cn } from '@/lib/util/utils';
import { formatDateTime } from '@/lib/util/formatDate';

// React Query 훅 임포트
import {
  useWhiskyDetail,
  useWhiskyRecords,
} from '@/hooks/queries/useWhiskyQueries';
import { useToggleWhiskyLike } from '@/hooks/mutations/useWhiskyMutations';

// 샘플 이미지 (실제 구현 시 경로 수정 필요)
import backgroundImage from '@/assets/whisky_background.png';

const DetailPage = () => {
  const { whiskyId } = useParams<{ whiskyId: string }>();
  const whiskyIdNumber = whiskyId ? parseInt(whiskyId, 10) : 0;

  const [page, setPage] = useState(1);

  const { user } = useAuth();

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

  const { mutate: toggleLike } = useToggleWhiskyLike(whiskyIdNumber);

  // 좋아요 토글
  const handleLikeToggle = () => {
    toggleLike();
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
    <ScrollArea className="flex-1 bg-white w-[412px] mx-auto ">
      <div style={{ paddingBottom: '0' }}>
        {/* 헤더 백 버튼 */}
        <div className="flex items-center p-4">
          <Link to="/list" className="mr-2">
            <ChevronLeft size={24} />
          </Link>
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
          <div className="absolute left-4 bottom-4 bg-rose-300 bg-opacity-90 text-white px-4 py-2 rounded-full text-sm z-20">
            Whiskeep's Pick
          </div>
        </div>

        {/* 제품 정보 섹션 - 좋아요 버튼을 이름 옆으로 배치 */}
        <div className="p-4">
          <div className="mb-2">
            <div className="flex justify-between items-start">
              <h1 className="text-xl font-bold">{whiskyDetail?.koName}</h1>
              <Button
                onClick={handleLikeToggle}
                variant="ghost"
                size="icon"
                className="rounded-full h-10 w-10 -mt-1"
              >
                <Heart
                  size={24}
                  fill={whiskyDetail?.isLiked ? '#D42B2B' : 'none'}
                  color={whiskyDetail?.isLiked ? '#D42B2B' : '#000'}
                />
              </Button>
            </div>
            <p className="text-gray-600 text-sm">{whiskyDetail?.enName}</p>
          </div>
        </div>
        {/* 테이스팅 프로필 섹션 */}
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-sm font-medium text-gray-500 mb-2">
            {user ? `${user.nickname}님` : '게스트님'} 취향 분석
          </h2>
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
                <td className="py-2">
                  {whiskyDetail?.tastingNotes.nosing.join(', ')}
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-2 font-medium">맛</td>
                <td className="py-2">
                  {whiskyDetail?.tastingNotes.tasting.join(', ')}
                </td>
              </tr>
              <tr>
                <td className="py-2 font-medium">피니시</td>
                <td className="py-2">
                  {whiskyDetail?.tastingNotes.finish.join(', ')}
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
                {whiskyDetail?.recordInfo.ratingAvg.toFixed(1)}
              </span>
              <span className="text-gray-500">
                ({whiskyDetail?.recordInfo.recordCnt})
              </span>
            </div>
          </div>

          {/* 리뷰 목록 */}
          <div className="space-y-8">
            {' '}
            {/* space-y-4에서 space-y-8로 변경하여 리뷰 간격 넓힘 */}
            {isRecordsLoading ? (
              <p className="text-center py-4">리뷰를 불러오는 중...</p>
            ) : (
              recordsData?.records.map((record) => (
                <div
                  key={record.recordId}
                  className="border-b border-gray-200 pb-6"
                >
                  {' '}
                  {/* pb-4에서 pb-6으로 변경하여 하단 여백 증가 */}
                  <div className="flex justify-between">
                    {/* 왼쪽: 프로필, 이름, 내용, 별점 */}
                    <div className="flex-1 pr-3">
                      {/* 프로필 및 이름 */}
                      <div className="flex items-center mb-3">
                        {' '}
                        {/* mb-2에서 mb-3으로 변경하여 이름과 내용 사이 간격 증가 */}
                        <div className="w-10 h-10 bg-rose-200 rounded-full flex items-center justify-center text-white text-sm mr-3">
                          {' '}
                          {/* 크기와 여백 증가 */}
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
                            {' '}
                            {/* 이름 글자 크기 증가 */}
                            {record.nickname}
                          </div>
                          <div className="text-sm text-gray-500">
                            {' '}
                            {/* 날짜 글자 크기 증가 */}
                            {formatDateTime(record.createdAt)}
                          </div>
                        </div>
                      </div>

                      {/* 내용 - 왼쪽 정렬로 변경 및 글씨 크기 증가 */}
                      <p className="text-base mb-3 text-left">
                        {' '}
                        {/* text-center → text-left, text-sm → text-base, mb-2 → mb-3 */}
                        {record.content}
                      </p>

                      {/* 별점을 내용 아래, 왼쪽으로 배치 */}
                      <div>
                        <StarRating rating={record.rating} />
                      </div>
                    </div>

                    {/* 오른쪽: 이미지 (더 크게) */}
                    {record.recordImg && (
                      <div className="ml-3">
                        {' '}
                        {/* ml-2에서 ml-3으로 여백 증가 */}
                        <img
                          src={record.recordImg}
                          alt="리뷰 이미지"
                          className="w-28 h-28 object-cover rounded-md" /* w-24 h-24에서 w-28 h-28로 크기 증가 */
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))
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

// export default WhiskyDetailPage; // 메인 컴포넌트 내보내기
