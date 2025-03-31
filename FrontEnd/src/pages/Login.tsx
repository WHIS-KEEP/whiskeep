import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from "@/hooks/mutations/useLoginMutations";

const Login = () => {
  const googleLogin = useLoginMutations();
  // const kakaoLogin = useLoginMutations();
  
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        <GoogleButton
          onClick={() => googleLogin.mutate("google")}
          disabled={googleLogin.isPending}
        />
        <KakaoButton
          // onClick={() => kakaoLogin.mutate("kakao")}
          // disabled={kakaoLogin.isPending}
        />
      </div>
    </div>
  );
};

export default Login;
