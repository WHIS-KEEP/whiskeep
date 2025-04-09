import Navbar from '@/components/layout/Navbar';
import { useWhiskyRecordString } from '@/hooks/queries/useRecordQueries';
import {
  useDeleteRecord,
  useRecordDetail,
} from '@/hooks/queries/useRecordQuery';
import { RecordRouteParams } from '@/types/record';
import { ChevronLeft, Star } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

// 날짜 포맷 함수
const formatDate = (dateString: string): string => {
  // 함수 내용 유지
  if (!dateString) return '';

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;

    return new Intl.DateTimeFormat('ko-KR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    }).format(date);
  } catch (error) {
    console.error('날짜 포맷 에러:', error);
    return dateString;
  }
};

const StarRating = ({
  rating = 0,
  onChange,
}: {
  rating: number;
  onChange?: (rating: number) => void;
}) => {
  return (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-5 w-5 ${
            star <= rating
              ? 'fill-[#4f5039] text-[#4f5039]'
              : 'fill-gray-200 text-gray-200'
          } ${onChange ? 'cursor-pointer' : ''}`}
          onClick={() => onChange && onChange(star)}
        />
      ))}
    </div>
  );
};

const RecordDetailPage = () => {
  // 상태 및 훅 유지
  const { whiskyId, recordId } = useParams<RecordRouteParams>();
  const navigate = useNavigate();
  // const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const { data: whiskyRecordData } = useWhiskyRecordString(whiskyId);

  const {
    data: recordDetail,
    isLoading,
    isError,
    error,
  } = useRecordDetail(whiskyId, recordId);

  const { mutate: deleteRecordMutation } = useDeleteRecord();

  // 핸들러 함수들 유지
  const handleGoBack = () => {
    navigate(-1);
  };

  const handleEdit = () => {
    navigate(`/records/${whiskyId}/${recordId}/edit`);
  };

  const handleDeleteRecord = async () => {
    const confirm = window.confirm('이 기록을 정말 삭제 하시겠습니까?');
    if (!confirm) return;

    if (!whiskyId || !recordId) return;

    deleteRecordMutation(
      { whiskyId, recordId },
      {
        onSuccess: async () => {
          // data의 recordList가 null이거나 길이가 1(지금 삭제한 항목)이면 collection으로 이동
          if (
            !whiskyRecordData ||
            !whiskyRecordData.recordList ||
            whiskyRecordData.recordList.length <= 1
          ) {
            navigate('/collection');
          } else {
            navigate(`/records/${whiskyId}`);
            window.location.reload();
          }
        },
        onError: (error) => {
          console.error('삭제 오류:', error);
          alert('삭제에 실패했습니다.');
          // setShowDeleteConfirm(false);
        },
      },
    );
  };

  // 로딩 및 에러 상태 유지
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p>기록을 불러오는 중...</p>
      </div>
    );
  }

  if (isError || !recordDetail) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p>기록을 불러오는데 실패했습니다.</p>
        {error instanceof Error && (
          <p className="text-sm text-red-500">{error.message}</p>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white w-full mx-auto h-screen flex flex-col relative z-0">
      <div className="flex-1 overflow-auto">
        <div className="flex flex-col pb-16">
          {/* 헤더 */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <button
              className="text-gray-700"
              onClick={handleGoBack}
              aria-label="뒤로가기"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center flex-1">
              {
                <div className="flex justify-end mr-0">
                  <button
                    onClick={handleEdit}
                    className="font-medium text-gray-500"
                  >
                    수정
                  </button>
                  <span className="mx-2">|</span>
                  <button
                    onClick={handleDeleteRecord}
                    className="font-medium text-gray-500"
                  >
                    삭제
                  </button>
                </div>
              }
            </div>
            <div className="w-0" />
          </div>

          {/* 메인 컨텐츠 */}
          <div className="flex-1">
            {/* 이미지 섹션 */}
            <div className="w-full">
              {recordDetail.recordImg ? (
                <img
                  src={recordDetail.recordImg}
                  alt="기록 이미지"
                  className="w-full object-cover"
                  style={{ maxHeight: '500px', height: 'auto' }}
                />
              ) : (
                <div className="w-full h-[300px] bg-gray-200 flex items-center justify-center">
                  <p className="text-gray-500">이미지가 없습니다 🙁</p>
                </div>
              )}
            </div>

            {/* 평점 섹션 */}
            <div className="p-4 flex items-center justify-between border-b">
              <div className="flex items-center">
                <span className="text-gray-700 mr-2">나의 점수</span>
                <StarRating rating={recordDetail.rating} />
              </div>
              <span className="text-gray-500 text-sm">
                {formatDate(recordDetail.createdAt)}
              </span>
            </div>

            {/* 내용 섹션 */}
            <div className="p-4">
              <p className="text-lg text-[#2f2f2f]">
                {recordDetail.content || '내용이 없습니다.'}
              </p>
            </div>

            {/* 태그 섹션 */}
            {recordDetail.tags && (
              <div className="p-4">
                <h2 className="text-lg font-medium mb-2">태그</h2>
                <div className="flex flex-wrap gap-2">
                  {recordDetail.tags.length > 0 ? (
                    recordDetail.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-gray-100 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">태그가 없습니다</p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 하단 네비게이션 바 */}
      <Navbar />
    </div>
  );
};

export default RecordDetailPage;
