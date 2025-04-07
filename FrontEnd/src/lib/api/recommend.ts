import { FlavorScores } from '@/types/score';
import API from '../util/axiosInstance';

export interface RecommendWhisky {
  whiskyId: number;
  koName: string;
  enName: string;
  type: string;
  whiskyImg: string;
  abv: number;
  tastingScore?: FlavorScores; // 일부는 없을 수도 있음
}

export interface RecommendResponse {
  recommendList: RecommendWhisky[];
}

export const getRecommendations = async (): Promise<RecommendWhisky[]> => {
  const res = await API.get<RecommendResponse>('/recommends');

  return res.data.recommendList ?? []; // 추천 결과가 없을 경우 빈 배열 반환
};
