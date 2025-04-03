import API from '@/lib/util/axiosInstance';

// TOP 9 위스키 조회하기
export const getPopularWhiskies = () => {
  return API.get('/members/popular-whiskies').then((res) => res.data);
};

// 숙련자가 선택한 위스키 등록하기
export const postFamiliarSurvey = (ids: number[]) => {
  return API.post('/members/preference/familiar', {
    experience: 'familiar',
    likedWhiskies: ids,
  });
};
