import { useRef } from 'react';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/util/utils';
import { useCheckLikeStatus } from '@/hooks/queries/useGetLikeQueries';
import { useToggleLikeMutation } from '@/hooks/mutations/useToggleLikeMutation';

interface HeartButtonProps {
  whiskyId: number | undefined;
  forceLikedState?: boolean;
  className?: string;
  buttonClassName?: string;
  heartIconClassName?: string;
}

export function HeartButton({
  whiskyId,
  forceLikedState,
  className,
  buttonClassName,
  heartIconClassName,
}: HeartButtonProps) {
  const checkStatusQuery = useCheckLikeStatus(whiskyId);
  const isLiked = forceLikedState === true ? true : checkStatusQuery.isLiked;
  const isLoading =
    forceLikedState === true ? false : checkStatusQuery.isLoading;

  const toggleLikeMutation = useToggleLikeMutation();
  const heartRef = useRef<SVGSVGElement>(null);

  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!whiskyId || toggleLikeMutation.isPending || isLoading) return;

    toggleLikeMutation.mutate({
      whiskyId,
      isCurrentlyLiked: isLiked,
    });
  };

  const defaultButtonClasses =
    'static object-cover object-top w-[24px] h-[24px] flex justify-center items-center bg-transparent shadow-none border-none outline-none cursor-pointer';
  const defaultHeartIconClasses = 'size-5 transition-all duration-150';

  return (
    <button
      onClick={handleLikeClick}
      className={cn(defaultButtonClasses, buttonClassName, className)}
      disabled={isLoading || toggleLikeMutation.isPending}
      aria-label={isLiked ? '찜 해제하기' : '찜하기'}
    >
      <Heart
        ref={heartRef}
        className={cn(
          defaultHeartIconClasses,
          isLiked ? 'text-[var(--point-red)]' : 'text-black',
          heartIconClassName,
        )}
        fill={isLiked ? 'currentColor' : 'white'}
        stroke={isLiked ? 'none' : 'currentColor'}
        strokeWidth={isLiked ? 0 : 1.5}
        size={16}
      />
    </button>
  );
}

export default HeartButton;
