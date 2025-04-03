// useImageUpload.ts
import { useState } from 'react';
import API from '@/lib/util/axiosInstance'; // 실제 경로로 수정

const useImageUpload = () => {
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<Error | null>(null);

  const uploadImage = async (file: File) => {
    setIsUploading(true);
    setUploadError(null);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await API.post('/records/image', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // 서버 응답에서 fileUrl 추출
      const fileUrl = response.data.fileUrl;
      setUploadedImageUrl(fileUrl);
      return fileUrl;
    } catch (error) {
      console.error('이미지 업로드 중 오류가 발생했습니다.', error);
      setUploadError(
        error instanceof Error
          ? error
          : new Error('알 수 없는 오류가 발생했습니다.'),
      );
      throw error;
    } finally {
      setIsUploading(false);
    }
  };

  return { uploadedImageUrl, isUploading, uploadError, uploadImage };
};

export default useImageUpload;
