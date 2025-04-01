// 페이지 단에서 <Button text="선택" size="l" onClick={handleClick} /> 이렇게 사용
// 클릭 이벤트 핸들러는 페이지 단에서 정의
import { Button } from '@/components/shadcn/button';

interface ButtonMProps {
  text: string; // text prop의 타입
  onClick?: () => void; // 클릭 이벤트 핸들러
  size?: 's' | 'm' | 'l'; // 버튼의 사이즈
  color?: 'default' | 'color-wood-70' | 'color-text-muted-40'; // 버튼의 색상
  textColor?: 'text-primary-dark' | 'text-white'; // 텍스트 색상 (두 가지 옵션만 허용)
  disabled?: boolean; // 비활성화 상태
  className?: string; // 추가 스타일을 위한 클래스명
}

const Btn = ({
  text,
  onClick,
  size,
  color,
  textColor = 'text-primary-dark',
  disabled = false,
  className = '',
}: ButtonMProps) => {
  return (
    <Button
      variant="outline"
      size={size} // 프로젝트 기획 상 사이즈는 s, m, l 세 가지 사이즈만 사용
      color={color} // Button 컴포넌트에 직접 color prop 전달
      className={`cursor-pointer flex items-center rounded-[10px] justify-center border border-gray-100 active:transform active:scale-85 active transition-all duration-150 ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
      onClick={onClick}
      {...(disabled ? { disabled } : {})}
    >
      <span
        className={`text-align-center text-base font-semibold ${textColor}`}
      >
        {text}
      </span>
    </Button>
  );
};

export default Btn;
