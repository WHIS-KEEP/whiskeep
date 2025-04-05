import { AxiosError } from 'axios';

export const handleError = (
  error: unknown,
): { id: number; image: string }[] => {
  console.error('위스키 데이터를 불러오는 중 오류 발생:', error);

  // 상세한 오류 정보 출력
  if (error instanceof AxiosError && error.response) {
    // 서버가 응답을 반환한 경우
    console.error('응답 데이터:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      endpoint: error.config?.url,
    });
  } else if (error instanceof AxiosError && error.request) {
    // 요청은 보냈지만 응답을 받지 못한 경우
    console.error('요청 정보:', {
      request: error.request,
      endpoint: error.config?.url,
    });
  } else if (error instanceof Error) {
    // 요청 설정 과정에서 오류가 발생한 경우
    console.error('요청 준비 오류:', {
      message: error.message,
      config: error instanceof AxiosError ? error.config : undefined,
    });
  }

  // 오류 발생 시 빈 배열 반환
  return [];
};
