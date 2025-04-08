import { useState, useRef, useEffect } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/util/utils';
import { useCheckLikeStatus } from '@/hooks/mutations/useCheckLikeMutation';
import { useToggleLikeMutation } from '@/hooks/mutations/useToggleLikeMutation';

interface LikeButtonProps {
  whiskyId: number | undefined;
  className?: string; // 외부에서 스타일 주입 가능하도록
  buttonClassName?: string; // 버튼 자체 스타일
  heartClassName?: string; // 하트 아이콘 스타일
}

export function LikeButton({
  whiskyId,
  className,
  buttonClassName,
  heartClassName,
}: LikeButtonProps) {
  // 서버로부터 실제 찜 상태 확인
  const { isLiked, isLoading } = useCheckLikeStatus(whiskyId);
  // 찜 상태 변경을 위한 mutation
  const toggleLikeMutation = useToggleLikeMutation();

  const [localLiked, setLocalLiked] = useState(false);
  const heartRef = useRef<SVGSVGElement>(null);

  // 서버 상태가 변경되거나 로딩이 끝나면 로컬 상태 업데이트
  useEffect(() => {
    if (!isLoading) {
      setLocalLiked(isLiked);
    }
  }, [isLiked, isLoading]);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // 상위 요소로 이벤트 전파 방지

    if (!whiskyId || toggleLikeMutation.isPending) return; // ID 없거나 뮤테이션 진행 중이면 무시

    if (heartRef.current) {
      // 애니메이션 클래스 적용
      if (!localLiked) {
        heartRef.current.classList.add('animate-like-in');
        heartRef.current.classList.remove('animate-like-out');
      } else {
        heartRef.current.classList.add('animate-like-out');
        heartRef.current.classList.remove('animate-like-in');
      }

      // 애니메이션 종료 후 상태 변경 및 서버 요청
      setTimeout(() => {
        if (heartRef.current) {
          heartRef.current.classList.remove(
            'animate-like-in',
            'animate-like-out',
          );
        }

        // 로컬 UI 상태 먼저 업데이트 (개선된 사용자 경험)
        const newLikedState = !localLiked;
        setLocalLiked(newLikedState);

        // 서버에 찜 상태 변경 요청 (이전 상태를 전달해야 함)
        toggleLikeMutation.mutate({
          whiskyId,
          isCurrentlyLiked: !newLikedState, // 토글 전 상태 전달
        });
      }, 150); // 애니메이션 시간과 맞춤
    }
  };

  // 기본 스타일 정의 (기존 Whiskycard에서 가져옴)
  const defaultButtonClasses =
    'absolute bottom-2 right-2 object-cover object-top w-[24px] h-[24px] rounded-full flex justify-center items-center bg-white shadow-lg border-none outline-none cursor-pointer';
  const defaultHeartClasses =
    'size-4 text-point-red transition-all duration-150';

  return (
    <button
      onClick={handleLikeClick}
      // className prop과 기본/주입된 버튼 클래스 병합
      className={cn(defaultButtonClasses, buttonClassName, className)}
      disabled={isLoading || toggleLikeMutation.isPending} // 로딩 중 또는 뮤테이션 중 비활성화
      aria-label={localLiked ? '찜 해제하기' : '찜하기'} // 접근성 레이블
    >
      <Heart
        ref={heartRef}
        // 기본/주입된 하트 클래스 병합
        className={cn(defaultHeartClasses, heartClassName)}
        fill={localLiked ? 'currentColor' : '#CBCBC4'} // fill을 currentColor로 변경하여 text-red-500 적용
      />
    </button>
  );
}

export default LikeButton;
