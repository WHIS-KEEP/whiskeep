export interface Whisky {
  whiskyId: number;
  koName: string;
  enName?: string;
  type: string;
  age: number | null;
  abv: number | null;
  avgRating: number;
  recordCounts: number;
  whiskyImg?: string;
}
