import { Button } from '@/components/shadcn/Button';
import kakaoLogo from '../../assets/kakao.png';

interface KakaoButtonProps {
  onClick?: () => void; // onClick prop
}

const KakaoButton = ({ onClick }: KakaoButtonProps) => {
  return (
    <Button
      variant="outline"
      className="cursor-pointer flex items-center rounded-[10px] bg-[#FEE500] hover:bg-[#FEE500] active:bg-[#FEE500] justify-center gap-3 border border-[#FEE500] w-90 h-15 active:transform active:scale-90 active transition-all duration-150"
      onClick={onClick}
    >
      <img src={kakaoLogo} alt="kakao logo " className="w-5.5 h-5.5" />
      <span className="text-align-center text-[15px] font-semibold">
        카카오 로그인
      </span>
    </Button>
  );
};

export default KakaoButton;
