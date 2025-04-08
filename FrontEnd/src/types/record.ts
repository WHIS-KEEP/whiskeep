//types/record.ts
export interface RecordSummary {
  recordId: number;
  recordImg: string;
}

export interface MyRecordResponse {
  whiskyId: number;
  whiskyImg: string;
  whiskyKoName: string;
  whiskyEnName: string;
  recordList: RecordSummary[];
}

export interface RecordDetail {
  recordImg: string;
  rating: number;
  content: string;
  createdAt: string;
  memberId?: number;
  whiskyId?: number;
  tags?: string[];
  isPublic?: boolean;
}

// URL 파라미터용 타입 (react-router-dom과 호환)
export interface RecordRouteParams {
  whiskyId: string;
  recordId: string;
  [key: string]: string | undefined;
}

export interface User {
  memberId: number;
  email: string;
  name: string;
  nickname: string;
  profileImg: string;
}
