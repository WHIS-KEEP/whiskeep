import { useState } from 'react';

interface FlavorScoreQuestionProps {
  question: string;
  example: string;
  imageSrc: string;
  value: number;
  onChange: (value: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
  isLast?: boolean;
  onSubmit?: () => void;
}

const FlavorScoreQuestion = ({
  question,
  example,
  imageSrc,
  value,
  onChange,
  onPrev,
  onNext,
  isLast,
  onSubmit,
}: FlavorScoreQuestionProps) => {
  const [imgLoaded, setImgLoaded] = useState(false);

  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <h2 className="text-md font-semibold text-[var(--text-main)] mb-4">
        {question}
      </h2>
      <h4 className="text-sm font-medium text-[var(--text-main)] mb-6">
        ({example})
      </h4>

      {/* 이미지 or skeleton */}
      <div className="w-full max-w-[280px] h-[180px] m-6 relative">
        {!imgLoaded && (
          <div className="absolute top-0 left-0 w-full h-full bg-gray-200 rounded-xl animate-pulse" />
        )}
        <img
          src={imageSrc}
          alt="visual"
          loading="eager"
          onLoad={() => setImgLoaded(true)}
          className={`w-full h-full object-cover rounded-xl transition-opacity duration-300 ${
            imgLoaded ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>

      {/* 숫자 라벨 */}
      <div className="w-full max-w-[280px] mb-2 mt-8 flex justify-between text-sm text-[var(--text-muted)] font-medium">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      {/* 슬라이더 */}
      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[280px] accent-[var(--primary-dark)] mb-2"
      />

      {/* 싫어요 / 좋아요 라벨 */}
      <div className="w-full max-w-[280px] flex justify-between text-sm text-[var(--text-muted)] mb-10">
        <span>싫어요</span>
        <span>좋아요</span>
      </div>

      {/* 버튼 영역 */}
      <div className="w-full px-6 pb-8 flex gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            className="w-full h-12 rounded-[12px] bg-transparent text-[var(--primary-dark)] font-semibold text-[15px] border border-[var(--primary-dark)] transition-colors hover:bg-[var(--primary-30)]"
          >
            이전
          </button>
        )}
        {isLast ? (
          <button
            onClick={onSubmit}
            className="w-full h-12 rounded-[12px] bg-[var(--primary-dark)] text-white font-semibold text-[15px] transition-colors hover:bg-[var(--primary-50)] border border-[var(--primary-dark)]"
          >
            제출하기
          </button>
        ) : (
          onNext && (
            <button
              onClick={onNext}
              className="w-full h-12 rounded-[12px] bg-[var(--primary-dark)] text-white font-semibold text-[15px] transition-colors hover:bg-[var(--primary-50)] border border-[var(--primary-dark)]"
            >
              다음
            </button>
          )
        )}
      </div>
    </div>
  );
};

export default FlavorScoreQuestion;
