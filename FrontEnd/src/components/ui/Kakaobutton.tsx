import { Button } from '@/components/shadcn/button';
import googleLogo from '../../assets/kakao.png';

interface KakaoButtonProps {
  onClick?: () => void; // onClick prop
}

const KakaoButton = ({ onClick }: KakaoButtonProps) => {
  return (
    <Button
      variant="outline"
      className="cursor-pointer flex items-center rounded-[10px] bg-[#FEE500] hover:bg-[#FEE500] active:bg-[#FEE500] justify-center gap-3 border border-[#FEE500] w-72 h-12 active:transform active:scale-85 active transition-all duration-150"
      onClick={onClick}
    >
      <img src={googleLogo} alt="kakao logo " className="w-5 h-5" />
      <span className="text-align-center text-base font-semibold">
        카카오 로그인
      </span>
    </Button>
  );
};

export default KakaoButton;
