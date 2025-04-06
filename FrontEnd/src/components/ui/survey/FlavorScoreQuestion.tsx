interface FlavorScoreQuestionProps {
  question: string;
  example: string;
  imageSrc: string;
  value: number;
  onChange: (value: number) => void;
  onPrev?: () => void;
  onNext?: () => void;
}

const FlavorScoreQuestion = ({
  question,
  example,
  imageSrc,
  value,
  onChange,
  onPrev,
  onNext,
}: FlavorScoreQuestionProps) => {
  return (
    <div className="flex flex-col items-center text-center px-6 py-8">
      <h2 className="text-[15px] font-semibold text-[var(--text-main)] mb-6">
        {question}
      </h2>
      <h4>{example}</h4>
      <img
        src={imageSrc}
        alt="visual"
        className="w-full max-w-[260px] h-[160px] object-cover rounded-xl mb-6"
      />

      <div className="w-full max-w-[280px] mb-2 flex justify-between text-sm text-[var(--text-muted)] font-medium">
        {[1, 2, 3, 4, 5].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      <input
        type="range"
        min={1}
        max={5}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full max-w-[280px] accent-[var(--primary-dark)] mb-2"
      />

      <div className="w-full max-w-[280px] flex justify-between text-sm text-[var(--text-muted)] mb-6">
        <span>싫어요</span>
        <span>좋아요</span>
      </div>

      <div className="w-full max-w-[280px] flex gap-3">
        {onPrev && (
          <button
            onClick={onPrev}
            className="flex-1 h-12 border border-[var(--primary-dark)] text-[var(--primary-dark)] rounded-[12px] text-[16px] font-semibold"
          >
            이전
          </button>
        )}
        {onNext && (
          <button
            onClick={onNext}
            className="flex-1 h-12 bg-[var(--wood)] text-[var(--primary-dark)] rounded-[12px] text-[16px] font-semibold"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default FlavorScoreQuestion;
