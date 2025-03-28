import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type ProviderType = "google" | "kakao";

// 로그인 API 요청
const loginApi = async (provider: ProviderType) => {
  const response = await axios.get(`http://localhost:8080/api/members/login/${provider}`);
  console.log("로그인 API 응답:", response.data); // 응답 데이터 확인
  return response.data;
};

// 로그인 요청 Hook
export const useLoginMutations = () => {
  return useMutation<String, Error, ProviderType>({
    mutationFn: loginApi,
  });
};
