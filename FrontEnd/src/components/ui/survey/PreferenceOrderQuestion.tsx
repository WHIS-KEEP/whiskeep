import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable';

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

// 설명 매핑
const descriptionMap: Record<string, string> = {
  향: '코로 먼저 느껴지는 향기',
  맛: '입 안에서 느껴지는 풍미',
  여운: '목 넘김 후 남는 감각',
};

const SortableItem = ({ id, index }: { id: string; index: number }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
  };

  return (
    <div className="flex flex-col items-center w-[100px] mx-2">
      <span className="text-sm font-medium text-[var(--text-muted)] mb-2">
        {index + 1}순위
      </span>
      <div
        ref={setNodeRef}
        {...attributes}
        {...listeners}
        style={style}
        className="w-full h-[120px] p-4 rounded-lg bg-[var(--bg)] text-center text-sm font-medium border border-[var(--primary-dark)] flex flex-col items-center justify-center"
      >
        <div className="text-[16px] mb-2 text-[var(--text-main)] font-bold">
          {id}
        </div>
        <p className="text-xs text-[var(--text-muted)] leading-snug">
          {descriptionMap[id]}
        </p>
      </div>
    </div>
  );
};

const PreferenceOrderQuestion = ({
  items,
  onChange,
  onNext,
  onPrev,
}: Props) => {
  const navigate = useNavigate();
  const [currentItems, setCurrentItems] = useState(items);

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      const oldIndex = currentItems.indexOf(active.id as string);
      const newIndex = currentItems.indexOf(over.id as string);
      const newOrder = arrayMove(currentItems, oldIndex, newIndex);
      setCurrentItems(newOrder);
      onChange(newOrder);
    }
  };

  return (
    <div className="text-center px-6 py-8">
      <h2 className="text-base font-semibold mb-6 text-[var(--text-main)]">
        향, 맛, 여운 중 선호하는 순서로 드래그하여 정렬해주세요.
      </h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={currentItems}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex justify-center">
            {currentItems.map((item, index) => (
              <SortableItem key={item} id={item} index={index} />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      {/* 버튼 영역 */}
      <div className="w-full px-6 pb-8 flex gap-3 mt-10 justify-center mx-auto">
        <button
          onClick={() => {
            if (onPrev) onPrev();
            else navigate('/preference');
          }}
          className="w-full h-12 rounded-[12px] bg-transparent text-[var(--primary-dark)] font-semibold text-[15px] border border-[var(--primary-dark)] transition-colors hover:bg-[var(--primary-30)]"
        >
          이전
        </button>
        {onNext && (
          <button
            onClick={onNext}
            className="w-full h-12 rounded-[12px] bg-[var(--primary-dark)] text-white font-semibold text-[15px] transition-colors hover:bg-[var(--primary-50)] border border-[var(--primary-dark)]"
          >
            다음
          </button>
        )}
      </div>
    </div>
  );
};

export default PreferenceOrderQuestion;
