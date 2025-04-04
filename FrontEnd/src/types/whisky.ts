// 위스키 상세 정보 타입
export interface WhiskyDetail {
  whiskyId: number;
  whiskyImg: string;
  isLiked: boolean;
  koName: string;
  enName: string;
  distillery: string;
  country: string;
  abv: number;
  type: string;
  description: string;
  tastingNotes: {
    nosing: string[];
    tasting: string[];
    finish: string[];
  };
  recordInfo: {
    ratingAvg: number;
    recordCnt: number;
  };
}

// 위스키 리뷰 목록 타입
export interface RecordListResponse {
  records: RecordItem[];
  pageInfo: {
    page: number;
    size: number;
    totalPages: number;
  };
}

export interface RecordItem {
  recordId: number;
  nickname: string;
  profileImage: string;
  content: string;
  recordImg: string;
  rating: number;
  createdAt: string;
  isPublic: boolean;
}