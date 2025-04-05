// types/index.ts
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