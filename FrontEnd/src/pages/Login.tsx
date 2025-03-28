import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';

const Login = () => {
  return (
    <div className="flex-1 p-4 overflow-auto">
      <div className="mt-4 flex flex-col py-50 items-center gap-5">
        <GoogleButton />
        <KakaoButton />
      </div>
    </div>
  );
};

export default Login;
