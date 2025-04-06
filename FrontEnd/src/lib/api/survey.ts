import API from '@/lib/util/axiosInstance';

// 위스키 TOP 9 Request type
export interface SurveyWhisky {
  whiskyId: number;
  koName: string;
  whiskyImg: string;
}

// 초보자 Response Body type
export interface BeginnerSurveyRequest {
  preferenceOrder: number[];
  tastingScore: {
    fruity: number;
    sweet: number;
    spicy: number;
    oaky: number;
    herbal: number;
    briny: number;
  };
}

// TOP 9 위스키 조회하기
export const getPopularWhiskies = (): Promise<SurveyWhisky[]> => {
  return API.get('/members/popular-whiskies').then((res) => res.data);
};

// 숙련자가 설문 결과(선택한 위스키 리스트) 등록하기
export const postFamiliarSurvey = (ids: number[]) => {
  return API.post('/members/preference/familiar', {
    experience: 'familiar',
    likedWhiskies: ids,
  });
};

// 초보자 설문 결과 등록하기
export const postBeginnerSurvey = (data: BeginnerSurveyRequest) => {
  return API.post('/members/preference/beginner', {
    experience: 'beginner',
    ...data,
  });
};
