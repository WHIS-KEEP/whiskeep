// Google로 로그인
// Google 로고가 늘어나지 않도록 종횡비는 유지
// 버튼에는 항상 Google "G"의 표준 색상이 포함

import { Button } from '@/components/ui/Button';
import googleLogo from '../../assets/google.svg';

// interface GoogleButtonProps {
//   brand: string; // text prop의 타입
//   onClick?: () => void; // onClick prop
// }

const GoogleButton = ({ onClick }: GoogleButtonProps) => {
  return (
    <Button
      type="button"
      variant="outline"
      size="m"
      className=" cursor-pointer flex items-center rounded-[10px] bg-white hover:bg-white active:bg-white justify-center gap-1.75 border border-white  w-72 h-12 active:transform active:scale-85 active transition-all duration-150"
      onClick={onClick}
    >
      <img src={googleLogo} alt="${brand} 로고" className="w-7 h-7" />
      <span className="text-align-center text-base font-semibold">
        구글로 로그인
      </span>
    </Button>
  );
};

export default GoogleButton;
