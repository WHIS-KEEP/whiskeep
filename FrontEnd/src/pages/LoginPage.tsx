import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { useLoginMutations } from '@/hooks/mutations/useLoginMutations';

const Login = () => {
  const googleLogin = useLoginMutations();
  const kakaoLogin = useLoginMutations();

  const handleLogin = (provider: 'google' | 'kakao') => {
    sessionStorage.setItem('provider', provider);
    if (provider === 'google') {
      googleLogin.mutate('google');
    } else {
      kakaoLogin.mutate('kakao');
    }
  };

  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        <GoogleButton onClick={() => handleLogin('google')} />
        <KakaoButton onClick={() => handleLogin('kakao')} />
      </div>
    </div>
  );
};

export default Login;
