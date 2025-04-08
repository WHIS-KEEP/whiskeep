import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Image as ImageIcon, ChevronLeft } from 'lucide-react';

// 커스텀 훅 가져오기
import useImageUpload from '@/hooks/mutations/useImageUpload';
import useRecordSubmit, {
  RecordUpdateData,
} from '@/hooks/mutations/useRecordSubmit';
import { useRecordDetail } from '@/hooks/queries/useRecordQuery';
import { RecordRouteParams } from '@/types/record';

// Switch 컴포넌트 가져오기
import { Switch } from '@/components/shadcn/switch';

const RecordEditPage: React.FC = () => {
  const { whiskyId, recordId } = useParams<RecordRouteParams>();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // 기존 기록 데이터 조회
  const {
    data: recordDetail,
    isLoading: isLoadingRecord,
    isError: isErrorRecord,
  } = useRecordDetail(whiskyId, recordId);

  // 상태 관리
  const [rating, setRating] = useState<number>(0);
  const [content, setContent] = useState<string>('');
  const [isPublic, setIsPublic] = useState<boolean>(false);

  // 커스텀 훅 사용
  const {
    uploadedImageUrl,
    setUploadedImageUrl,
    isUploading,
    uploadError,
    uploadImage,
  } = useImageUpload();

  const { isSubmitting, submitError, updateRecord } = useRecordSubmit();

  // 기존 데이터 로드
  useEffect(() => {
    if (recordDetail) {
      setRating(recordDetail.rating || 0);
      setContent(recordDetail.content || '');
      setIsPublic(recordDetail.isPublic || false);

      // 이미지 URL 설정
      if (recordDetail.recordImg) {
        setUploadedImageUrl(recordDetail.recordImg);
      }
    }
  }, [recordDetail, setUploadedImageUrl]);

  // 뒤로가기
  const handleGoBack = () => {
    navigate(-1);
  };

  // 파일 선택 창 열기
  const handleImageButtonClick = () => {
    fileInputRef.current?.click();
  };

  // 이미지 파일 변경 시 처리
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      await uploadImage(file);
    } catch {
      alert('이미지 업로드에 실패했습니다.');
    }
  };

  // 기록 수정 처리
  const handleSubmit = async () => {
    if (!content.trim()) {
      alert('기록 내용을 입력해주세요.');
      return;
    }

    if (!recordId || !whiskyId) {
      alert('오류가 발생했습니다. 다시 시도해주세요.');
      return;
    }

    const updateData: RecordUpdateData = {
      whiskyId: parseInt(whiskyId), // URL에서 가져온 whiskyId 사용
      recordId: recordId,
      rating,
      content,
      isPublic: isPublic || false,
      recordImg: uploadedImageUrl,
    };

    const success = await updateRecord(updateData);

    if (success) {
      alert('기록이 성공적으로 수정되었습니다.');
      navigate(`/records/${whiskyId}/${recordId}`);
    } else if (submitError) {
      alert(submitError.message || '기록 수정에 실패했습니다.');
    }
  };

  // 로딩 상태 통합
  const isLoading = isUploading || isSubmitting || isLoadingRecord;

  // 에러 처리
  if (isErrorRecord) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <p className="text-lg text-red-600">기록을 불러오는데 실패했습니다.</p>
        <button
          onClick={handleGoBack}
          className="mt-4 px-4 py-2 bg-gray-200 rounded-md"
        >
          뒤로 가기
        </button>
      </div>
    );
  }

  // 로딩 중 표시
  if (isLoadingRecord) {
    return (
      <div className="flex justify-center items-center h-screen bg-white">
        <p>기록을 불러오는 중...</p>
      </div>
    );
  }

  return (
    <div className="bg-white w-full max-w-[412px] mx-auto h-screen flex flex-col">
      {/* 헤더 */}
      <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
        <button
          className="text-gray-700"
          onClick={handleGoBack}
          aria-label="뒤로가기"
        >
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-lg font-medium text-center flex-1">기록 수정</h1>
        <div className="w-8"></div> {/* 균형을 위한 여백 */}
      </div>

      <div className="flex-1 overflow-auto">
        <div className="p-4 pb-20">
          {/* 별점 및 공개 여부 */}
          <div className="flex justify-between items-center mb-1">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  className={`text-3xl cursor-pointer ${star <= rating ? 'text-primary' : 'text-gray-200'}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </span>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-500">
                {isPublic ? '공개' : '비공개'}
              </span>
              <Switch checked={isPublic} onCheckedChange={setIsPublic} />
            </div>
          </div>

          {/* 기록 입력 영역 */}
          <textarea
            placeholder="기록을 입력하세요."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-96 p-4 border border-gray-300 rounded-lg resize-none mb-2 focus:outline-none text-base text-[#2f2f2f]"
          />

          {/* 숨겨진 파일 입력 필드 */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />

          {/* 사진 등록 버튼 */}
          <div className="flex flex-col gap-2 mb-2">
            <button
              type="button"
              className="flex items-center gap-1 text-main"
              onClick={handleImageButtonClick}
              disabled={isLoading}
            >
              <ImageIcon size={15} />
              <span>{isUploading ? '업로드 중...' : '사진 수정'}</span>
            </button>

            {uploadedImageUrl && (
              <div className="mt-2">
                <p className="text-sm text-green-600 flex items-center gap-1 mb-2">
                  <span>✓</span>
                  <span>이미지가 업로드되었습니다</span>
                </p>
                {/* 이미지 미리보기 */}
                <div className="w-full h-40 border-gray-300 rounded-lg overflow-hidden">
                  <img
                    src={uploadedImageUrl}
                    alt="업로드된 이미지"
                    className="w-full h-full object-contain"
                  />
                </div>
              </div>
            )}

            {uploadError && (
              <div className="text-sm text-red-600">
                {uploadError.message || '이미지 업로드에 실패했습니다.'}
              </div>
            )}
          </div>

          {/* 수정 버튼 */}
          <button
            type="button"
            className={`w-full py-3 rounded-md mt-auto transition-colors ${
              isLoading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-wood-70 text-white hover:bg-[#c5b89e]'
            }`}
            onClick={handleSubmit}
            disabled={isLoading}
          >
            {isSubmitting ? '수정 중...' : '수정하기'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RecordEditPage;
