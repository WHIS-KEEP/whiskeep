import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';

import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/store/AuthContext";
import { useLoginMutations } from "@/hooks/mutations/useLoginMutations";

const Login = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

    // OAuth 리디렉트 처리
    useEffect(() => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("token");
  
      if (token) {
        login(token);
        navigate("/");
      }
    }, []);


  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        <Button text="선택" size="m" color="color-text-muted-40" />
        <GoogleButton
          onClick={() => googleLogin.mutate("google")}
          disabled={googleLogin.isPending}
        />
        <KakaoButton
          onClick={() => kakaoLogin.mutate("kakao")}
          disabled={kakaoLogin.isPending}
        />
      </div>
    </div>
  );
};

export default Login;
