/**
 * 프로젝트 전체에서 사용되는 데이터명을 중앙화하여 관리하는 파일
 */

// 기록 필드 (/api/records)
export const RECORD_FIELDS = {
  WHISKY_ID: 'whiskyId',
  RATING: 'rating', //1~5
  CONTENT: 'content',
  RECORD_IMG: 'recordImg',  // 유저가 직접 기록하는 이미지
  IS_PUBLIC: 'isPublic',
  WHISKY_IMG: 'whiskyImg',  // 위스키 고유 이미지
} as const;



// 위스키 관련 필드명
export const WHISKY_FIELDS = {
  ID: 'whiskyId',
  NAME: 'name',
  ENGLISH_NAME: 'englishName',
  IMAGE: 'whiskyImg',
  ABV: 'abv',
  TYPE: 'type',
  BREWERY: 'brewery',
  REGION: 'region',
  IS_PICK: 'isPick',
  IS_LIKED: 'isLiked',
} as const;

// 타입으로도 사용할 수 있도록 타입 정의
export type WhiskyField = keyof typeof WHISKY_FIELDS;
export type WhiskyFieldValue = (typeof WHISKY_FIELDS)[WhiskyField];

// 테이스팅 노트 관련 필드명
export const TASTING_NOTES_FIELDS = {
  NOSE: 'nose',
  PALATE: 'palate',
  FINISH: 'finish',
} as const;

export type TastingNoteField = keyof typeof TASTING_NOTES_FIELDS;
export type TastingNoteFieldValue =
  (typeof TASTING_NOTES_FIELDS)[TastingNoteField];

// 리뷰 관련 필드명
export const REVIEW_FIELDS = {
  ID: 'id',
  AUTHOR: 'author',
  AVATAR_URL: 'avatarUrl',
  RATING: 'rating',
  COMMENT: 'comment',
  IMAGE_URL: 'imageUrl',
  CREATED_AT: 'createdAt',
} as const;

export type ReviewField = keyof typeof REVIEW_FIELDS;
export type ReviewFieldValue = (typeof REVIEW_FIELDS)[ReviewField];

// 사용자 관련 필드명
export const USER_FIELDS = {
  MEMBER_ID: 'memberId',
  EMAIL: 'email',
  NAME: 'name',
  NICKNAME: 'nickname',
  PROFILE_IMG: 'profileImg',
  PROVIDER: 'provider',
} as const;

export type UserField = keyof typeof USER_FIELDS;
export type UserFieldValue = (typeof USER_FIELDS)[UserField];

// API 엔드포인트 (예시)
export const API_ENDPOINTS = {
  LOGIN: '/api/auth/login',
  REGISTER: '/api/auth/register',
  WHISKY: '/api/whisky',
  REVIEW: '/api/review',
} as const;

export type ApiEndpoint = keyof typeof API_ENDPOINTS;
export type ApiEndpointValue = (typeof API_ENDPOINTS)[ApiEndpoint];

// 기타 상수 값
export const CONSTANTS = {
  MAX_RATING: 5,
  DEFAULT_PAGE_SIZE: 10,
} as const;
