import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { DndContext, closestCenter, DragEndEvent } from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

const SortableItem = ({ id }: { id: string }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id });
  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="w-full p-4 my-2 rounded-lg bg-[var(--bg)] text-center text-lg font-medium border border-[var(--primary-dark)]"
    >
      {id}
    </div>
  );
};

interface Props {
  items: string[];
  onChange: (items: string[]) => void;
  onNext?: () => void;
  onPrev?: () => void;
}

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
      <h2 className="text-[16px] font-bold mb-4 text-[var(--text-main)]">
        향, 맛, 여운 중 선호하는 순서로 드래그해주세요
      </h2>

      <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext
          items={currentItems}
          strategy={verticalListSortingStrategy}
        >
          {currentItems.map((item) => (
            <SortableItem key={item} id={item} />
          ))}
        </SortableContext>
      </DndContext>

      <div className="mt-8 flex gap-3 justify-center max-w-[280px] mx-auto">
        <button
          onClick={() => {
            if (onPrev) onPrev();
            else navigate('/preference'); // default 동작
          }}
          className="flex-1 h-12 border border-[var(--primary-dark)] text-[var(--primary-dark)] rounded-[12px] text-[16px] font-semibold"
        >
          이전
        </button>

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

export default PreferenceOrderQuestion;
