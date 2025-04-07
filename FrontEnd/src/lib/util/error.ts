import { AxiosError } from 'axios'; // Axios 사용하는 경우 필요

/**
 * API 응답 본문 타입 정의 (unknown 대신 Record<string, unknown> 사용)
 */
export type ApiResponseBody = Record<string, unknown>;

/**
 * API 호출 시 발생할 수 있는 오류 구조를 정의합니다.
 * fetch API 사용 시 response 객체의 속성을 포함할 수 있습니다.
 */
export interface ApiError extends Error {
  status?: number; // HTTP 상태 코드
  statusText?: string; // HTTP 상태 메시지
  responseBody?: ApiResponseBody; // 오류 응답 본문 (JSON 파싱 가능 시)
  // response?: Response; // fetch 응답 객체 자체를 포함할 수도 있음
}

/**
 * OCR 결과 페이지로 전달할 오류 상태 인터페이스
 */
export interface ErrorState {
  error: string;
  timedOut: boolean;
}

/**
 * fetch API 응답에서 오류가 발생했을 때 처리하는 함수 (response 객체 필요)
 * @param response fetch API의 응답 객체
 * @param endpoint 요청한 API 엔드포인트 경로 (선택 사항)
 * @returns Promise<ApiError> 구조화된 API 오류 객체
 */
export const handleApiError = async (
  response: Response,
  endpoint?: string,
): Promise<ApiError> => {
  const errorBodyText = await response.text();
  let parsedBody: ApiResponseBody = {}; // 기본값 설정
  try {
    // 파싱 결과가 객체가 아닌 경우 처리하기 위해 타입 체크 추가
    const parsed = JSON.parse(errorBodyText);
    if (parsed && typeof parsed === 'object') {
      parsedBody = parsed as ApiResponseBody;
    } else {
      // 비객체 값은 message 속성으로 포함
      parsedBody = { message: parsed };
    }
  } catch {
    // 변수를 사용하지 않는 경우 변수 자체를 생략
    console.warn(
      `API 오류 응답 본문이 유효한 JSON이 아님 (${endpoint || response.url}):`,
      errorBodyText,
    );
  }

  const error: ApiError = new Error(
    `API Error: ${response.status} ${response.statusText} on ${endpoint || response.url}`,
  );
  error.status = response.status;
  error.statusText = response.statusText;
  error.responseBody = parsedBody;
  // error.response = response; // 필요시 응답 객체 저장

  return error;
};

/**
 * 네트워크 오류 또는 기타 클라이언트 측 오류를 ApiError 형식으로 변환하는 함수
 * (status 코드는 없으므로 Error 기본 속성 위주)
 * @param error 원본 오류 객체
 * @returns ApiError 형식으로 변환된 오류 객체
 */
export const createNetworkError = (error: Error): ApiError => {
  // ApiError 인터페이스를 따르지만, status 관련 필드는 없을 수 있음
  const networkError: ApiError = new Error(
    `Network or Client Error: ${error.message}`,
  );
  networkError.name = error.name; // 원래 에러 이름 유지
  // stack 정보도 필요하면 복사
  // networkError.stack = error.stack;
  return networkError;
};

/**
 * 카메라 관련 오류 메시지를 생성하는 함수
 * @param err 카메라 접근 시 발생한 오류
 * @returns 사용자에게 보여줄 오류 메시지
 */
export const getCameraErrorMessage = (err: unknown): string => {
  let message = '카메라 접근 중 오류 발생';
  if (err instanceof Error) {
    if (
      err.name === 'NotAllowedError' ||
      err.name === 'PermissionDeniedError'
    ) {
      message = '카메라 권한이 필요합니다. 설정에서 권한을 허용해주세요.';
    } else if (
      err.name === 'NotFoundError' ||
      err.name === 'DevicesNotFoundError'
    ) {
      message = '사용 가능한 카메라를 찾을 수 없습니다.';
    } else if (
      err.name === 'NotReadableError' ||
      err.name === 'TrackStartError'
    ) {
      message =
        '카메라를 시작할 수 없습니다. 다른 앱에서 사용 중인지 확인해주세요.';
    } else if (
      err.name === 'OverconstrainedError' ||
      err.name === 'ConstraintNotSatisfiedError'
    ) {
      message = '요청한 해상도 또는 설정을 카메라가 지원하지 않습니다.';
    } else {
      message = `카메라 오류 (${err.name}): ${err.message}`;
    }
  }
  return message;
};

/**
 * OCR API 오류를 처리하고 ErrorState 객체를 반환하는 함수
 * @param err OCR API 호출 중 발생한 오류
 * @returns 결과 페이지로 전달할 오류 상태 객체
 */
export const handleOcrError = (err: unknown): ErrorState => {
  console.error('OCR 요청 처리 실패:', err);

  let errorMessage = 'OCR 처리 중 오류가 발생했습니다.';
  let timedOut = false;

  if (err instanceof Error && err.message === 'API timeout') {
    errorMessage =
      '결과를 찾는 데 시간이 오래 걸립니다. 잠시 후 다시 시도해주세요.';
    timedOut = true;
  } else if (err instanceof Error && 'status' in err) {
    const apiError = err as ApiError;
    errorMessage = `OCR 처리 실패 (코드: ${apiError.status || 'N/A'})`;
    if (apiError.message) errorMessage += `: ${apiError.message}`;
  } else if (err instanceof Error) {
    const networkError = createNetworkError(err);
    errorMessage = networkError.message;
  }

  return { error: errorMessage, timedOut };
};

/**
 * OCR 이미지 캡처 관련 오류 처리 함수
 * @param reason 오류 발생 이유 (예: 'canvas_context', 'empty_image')
 * @param details 추가 세부 정보 (선택 사항)
 * @returns 사용자에게 보여줄 오류 메시지
 */
export const getImageCaptureErrorMessage = (
  reason: string,
  details?: string,
): string => {
  switch (reason) {
    case 'no_camera_ready':
      return '카메라가 준비되지 않았습니다.';
    case 'canvas_context':
      return '캔버스 컨텍스트를 가져올 수 없습니다.';
    case 'empty_image':
      return '이미지 캡처 실패 (빈 데이터)';
    case 'video_state':
      return `카메라 화면을 캡처할 수 없습니다.${details ? ` (readyState: ${details})` : ''}`;
    case 'file_format':
      return '이미지 파일만 첨부 가능합니다.';
    case 'file_read':
      return '파일을 읽는 중 오류가 발생했습니다.';
    case 'no_image':
      return '캡처 또는 파일 읽기에 실패했습니다.';
    default:
      return '이미지 처리 중 오류가 발생했습니다.';
  }
};

/**
 * (참고) 기존 handleError 함수 - Axios 오류 처리에 특화되어 있음
 * 현재 OCRPage에서는 직접 사용하지 않지만, 다른 Axios 호출에서 사용 가능
 */
export const handleError = (
  error: unknown,
  context?: string, // 오류 발생 컨텍스트 정보 추가 (예: '위스키 데이터 로딩')
): { id: number; image: string }[] => {
  // 반환 타입은 예시이며 실제 사용처에 맞게 수정 필요
  const contextMessage = context ? `${context} 중 오류 발생:` : '오류 발생:';
  console.error(contextMessage, error);

  if (error instanceof AxiosError && error.response) {
    console.error('서버 응답 오류 상세:', {
      status: error.response.status,
      statusText: error.response.statusText,
      data: error.response.data,
      endpoint: error.config?.url,
    });
  } else if (error instanceof AxiosError && error.request) {
    console.error('요청 실패 (응답 없음) 상세:', {
      request: error.request, // 요청 객체 자체는 매우 클 수 있으므로 필요한 정보만 로깅 고려
      endpoint: error.config?.url,
      message: error.message,
    });
  } else if (error instanceof Error) {
    console.error('요청 설정 또는 기타 오류 상세:', {
      message: error.message,
      name: error.name,
      stack: error.stack, // 디버깅 시 유용
      config: error instanceof AxiosError ? error.config : undefined,
    });
  } else {
    console.error('알 수 없는 타입의 오류:', error);
  }

  // 실제 반환값은 이 함수를 사용하는 곳의 요구사항에 따라 달라져야 함
  // OCR 페이지 오류 처리에서는 이 함수를 직접 호출하지 않음
  return []; // 예시 반환값
};

/**
 * 오류 메시지를 사용자 친화적인 형태로 가공하는 함수
 * @param err 오류 객체
 * @param defaultMessage 기본 오류 메시지
 * @returns 사용자에게 표시할 오류 메시지
 */
export const getDisplayErrorMessage = (
  err: unknown,
  defaultMessage = '오류가 발생했습니다.',
): string => {
  if (err instanceof Error) {
    if ('status' in err) {
      const apiError = err as ApiError;
      const statusMsg = apiError.status ? ` (${apiError.status})` : '';
      return `${apiError.message}${statusMsg}`;
    }
    return err.message;
  }
  return defaultMessage;
};
