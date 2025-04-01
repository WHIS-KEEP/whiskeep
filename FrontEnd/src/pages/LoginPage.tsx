import GoogleButton from '@/components/ui/Googlebutton';
import KakaoButton from '@/components/ui/Kakaobutton';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';

const Login = () => {
  return (
    <ScrollArea className="flex-1">
      <div className="p-4">
        <div className="mt-4 flex flex-col py-50 items-center gap-5">
          <GoogleButton />
          <KakaoButton />
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default Login;
