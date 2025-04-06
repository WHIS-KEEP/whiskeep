import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from '@/hooks/mutations/useLoginMutations';

const Login = () => {
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        <GoogleButton
          onClick={() => {
            sessionStorage.setItem('provider', 'google');
            googleLogin.mutate('google');
          }}
        />
        <KakaoButton
          onClick={() => {
            sessionStorage.setItem('provider', 'kakao');
            kakaoLogin.mutate('kakao');
          }}
        />
      </div>
    </div>
  );
};

export default Login;
