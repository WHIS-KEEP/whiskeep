import { Button } from '@/components/shadcn/Button';
import googleLogo from '../../assets/google.svg';

interface GoogleButtonProps {
  // brand: string; // text prop의 타입
  onClick?: () => void; // onClick prop
  disabled?: boolean; // disabled prop
}

const GoogleButton = ({ onClick }: GoogleButtonProps) => {
  return (
    <Button
      onClick={onClick}
      variant="outline"
      size="m"
      className=" cursor-pointer flex items-center rounded-[10px] bg-white hover:bg-white active:bg-white justify-center gap-1.75 border border-white  w-90 h-15 active:transform active:scale-90 active transition-all duration-150"
    >
      <img src={googleLogo} alt="google logo" className="w-8 h-8" />
      <span className="text-align-center text-[15px] font-semibold">
        구글 로그인
      </span>
    </Button>
  );
};

export default GoogleButton;
