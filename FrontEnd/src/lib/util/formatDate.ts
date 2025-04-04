// 날짜 포맷팅 유틸 함수

/**
 * ISO 날짜 문자열을 "YYYY-MM-DD HH:MM:SS" 형식으로 변환
 */
export const formatDateTime = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
};

/**
 * ISO 날짜 문자열을 "YYYY-MM-DD" 형식으로 변환
 */
export const formatDate = (isoString: string): string => {
  const date = new Date(isoString);

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
};
