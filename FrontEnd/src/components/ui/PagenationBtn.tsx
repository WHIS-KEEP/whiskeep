import { Button } from '@/components/shadcn/Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationBtnProps {
  page?: number | string; // 페이지 번호 또는 화살표를 위한 문자열
  isActive?: boolean; // 현재 활성화된 페이지인지
  onClick?: () => void; // 클릭 이벤트 핸들러
  disabled?: boolean; // 비활성화 상태
  className?: string; // 추가 스타일을 위한 클래스명
  type?: 'number' | 'prev' | 'next'; // 버튼 타입 (숫자, 이전, 다음)
}

const PaginationBtn = ({
  page,
  isActive = false,
  onClick,
  disabled = false,
  className = '',
  type = 'number',
}: PaginationBtnProps) => {
  // 버튼 내용 결정
  const getButtonContent = () => {
    if (type === 'prev') return <ChevronLeft size={16} />;
    if (type === 'next') return <ChevronRight size={16} />;
    return page;
  };

  // 활성화 상태에 따른 색상 설정
  const getColorProps = () => {
    if (disabled) {
      return {
        color: 'color-text-muted-40',
        className: 'text-primary-50 cursor-not-allowed',
      };
    }

    if (isActive) {
      return {
        color: 'color-primary',
        className: 'text-white font-medium',
      };
    }

    return {
      color: 'default',
      className: 'text-primary-dark hover:bg-gray-100',
    };
  };

  const colorProps = getColorProps();

  return (
    <Button
      variant="outline"
      size="icon"
      color={
        colorProps.color as 'default' | 'color-primary' | 'color-text-muted-40'
      }
      className={`w-8 h-8 rounded-full flex items-center justify-center p-0 border-0 ${colorProps.className} ${className}`}
      onClick={onClick}
      asChild
    >
      <button disabled={disabled}>{getButtonContent()}</button>
    </Button>
  );
};

export default PaginationBtn;
