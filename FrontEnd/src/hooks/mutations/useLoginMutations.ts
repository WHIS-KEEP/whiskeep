import { useMutation } from "@tanstack/react-query";
import axios from "axios";

// 로그인 API 요청 : 리다이렉트하므로 mutaton 사용
const getSocialLogin = async (provider: "google" | "kakao") => {
  const response = await axios.get(`http://localhost:8080/api/members/login/${provider}`);
  window.location.href = response.data;
};

// 로그인 요청 Hook
export const useLoginMutations = () => {
  return useMutation({
    mutationFn: getSocialLogin,
  });
};
