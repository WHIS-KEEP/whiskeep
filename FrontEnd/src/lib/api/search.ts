// api/search.ts

import API from '../util/axiosInstance';

export interface SearchRequest {
  keyword?: string;
  pageSize: number;
  searchAfter: [] | [number, number];
  sortField: string;
  desc: boolean;
  age?: number;
  type?: string;
}

export const postSearchWhiskies = async (payload: SearchRequest) => {
  const response = await API.post('/whiskies/search', payload);
  return response.data;
};
