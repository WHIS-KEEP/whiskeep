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

    if (heartRef.current) {
      if (!isLiked) {
        heartRef.current.classList.add('animate-like-in');
        heartRef.current.classList.remove('animate-like-out');
      } else {
        heartRef.current.classList.add('animate-like-out');
        heartRef.current.classList.remove('animate-like-in');
      }

      setTimeout(() => {
        if (heartRef.current) {
          heartRef.current.classList.remove(
            'animate-like-in',
            'animate-like-out',
          );
        }

        toggleLikeMutation.mutate({
          whiskyId,
          isCurrentlyLiked: isLiked,
        });
      }, 150);
    }
  };

  const defaultButtonClasses =
    'absolute bottom-2 right-2 object-cover object-top w-[24px] h-[24px] rounded-full flex justify-center items-center bg-white shadow-lg border-none outline-none cursor-pointer';
  const defaultHeartIconClasses = 'size-4 transition-all duration-150';

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
          isLiked ? 'text-red-500' : 'text-point-red',
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
