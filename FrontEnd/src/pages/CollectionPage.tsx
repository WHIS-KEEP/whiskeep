import {
  useState,
  useRef,
  TouchEvent,
  MouseEvent,
  useMemo,
  useEffect,
} from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  fetchWhiskyCollection,
  COLLECTION_QUERY_KEY,
} from '../lib/api/collection';
import { useNavigate } from 'react-router-dom';
import whiskyShelf from '../assets/shelf.svg';
import { FaSquarePlus } from 'react-icons/fa6';

// --- 상수 정의 ---
const BOTTLES_PER_SHELF = 4; // 선반당 병 개수
const SHELVES_PER_PAGE = 3; // 페이지당 선반 개수
const BOTTLES_PER_PAGE = BOTTLES_PER_SHELF * SHELVES_PER_PAGE; // 페이지당 최대 병 개수 (12)

// --- 컴포넌트 ---
const Collection = () => {
  const [currentPage, setCurrentPage] = useState(0);

  // React Query를 사용하여 위스키 데이터 가져오기
  const { data: items = [], isPending } = useQuery({
    queryKey: [COLLECTION_QUERY_KEY],
    queryFn: fetchWhiskyCollection,
  });

  const totalPages = useMemo(
    () => Math.ceil(items.length / BOTTLES_PER_PAGE) || 1,
    [items.length],
  );

  const navigate = useNavigate();

  const sliderRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState(0);
  const [currentTranslate, setCurrentTranslate] = useState(0);
  const [prevTranslate, setPrevTranslate] = useState(0);
  const animationFrameId = useRef<number | null>(null);

  const goToPage = (page: number) => {
    if (page >= 0 && page < totalPages) {
      setCurrentPage(page);
    }
  };

  const getPositionX = (event: TouchEvent | MouseEvent): number => {
    return event.type.includes('touch')
      ? (event as TouchEvent).touches[0].clientX
      : (event as MouseEvent).clientX;
  };

  const dragStart = (event: TouchEvent | MouseEvent) => {
    setIsDragging(true);
    setStartPos(getPositionX(event));
    const sliderWidth = sliderRef.current?.offsetWidth || 0;
    const initialTranslate = -currentPage * sliderWidth;
    setPrevTranslate(initialTranslate);
    setCurrentTranslate(initialTranslate);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (event.type === 'mousedown') {
      (event.target as HTMLElement).ondragstart = () => false;
    }
  };

  const dragMove = (event: TouchEvent | MouseEvent) => {
    if (!isDragging || !sliderRef.current) return;
    const currentPosition = getPositionX(event);
    const diff = currentPosition - startPos;
    const newTranslate = prevTranslate + diff;
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    animationFrameId.current = requestAnimationFrame(() => {
      setCurrentTranslate(newTranslate);
    });
  };

  const dragEnd = () => {
    if (!isDragging || !sliderRef.current) return;

    setIsDragging(false);
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }

    const sliderWidth = sliderRef.current.offsetWidth;
    const movedBy = currentTranslate - prevTranslate;
    const threshold = sliderWidth * 0.2;

    let newPage = currentPage;
    if (movedBy < -threshold && currentPage < totalPages - 1) {
      newPage = currentPage + 1;
    } else if (movedBy > threshold && currentPage > 0) {
      newPage = currentPage - 1;
    }

    setCurrentPage(newPage);
    const finalTranslate = -newPage * sliderWidth;
    // 약간의 딜레이를 주어 transition이 적용되도록 할 수 있지만,
    // 여기서는 useEffect가 currentPage 변경을 감지하여 처리하므로 즉시 설정해도 무방
    setCurrentTranslate(finalTranslate);
    setPrevTranslate(finalTranslate);

    if (sliderRef.current) {
      Array.from(sliderRef.current.querySelectorAll('img')).forEach(
        (img) => (img.ondragstart = null),
      );
    }
  };

  // currentPage 변경 시 슬라이더 위치 업데이트 (애니메이션 포함)
  useEffect(() => {
    if (sliderRef.current) {
      const sliderWidth = sliderRef.current.offsetWidth;
      const targetTranslate = -currentPage * sliderWidth;

      // 드래그 중이 아닐 때만 부드럽게 이동하도록 처리
      // 만약 닷(dot) 클릭 등으로 페이지가 변경될 경우 이 useEffect가 애니메이션을 담당
      if (!isDragging) {
        // requestAnimationFrame을 사용하여 다음 프레임에서 translate 업데이트
        const frameId = requestAnimationFrame(() => {
          setCurrentTranslate(targetTranslate);
          // prevTranslate도 동기화하여 다음 드래그 시작 시점 문제 방지
          setPrevTranslate(targetTranslate);
        });
        return () => cancelAnimationFrame(frameId); // 클린업 함수
      } else {
        // 드래그 중에는 dragMove가 translate를 제어하므로 여기서는 아무것도 안 함
      }
    }
  }, [currentPage, isDragging]); // currentPage 변경 시 실행

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* 여기에 상단바가 있다고 가정 */}
      <div className="flex-1 overflow-hidden bg-[#efebe0]">
        <div className="h-full flex items-center justify-center">
          {isPending ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-3 text-gray-700">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="w-[var(--mobile-width)] relative px-2 pb-30">
              {/* 이미지 슬라이더 영역 */}
              <div
                className="overflow-hidden relative w-[var(--mobile-width)]"
                ref={sliderRef}
                onTouchStart={dragStart}
                onTouchMove={dragMove}
                onTouchEnd={dragEnd}
                onMouseDown={dragStart}
                onMouseMove={dragMove}
                onMouseUp={dragEnd}
                onMouseLeave={dragEnd}
                style={{ cursor: isDragging ? 'grabbing' : 'grab' }}
              >
                <div
                  // 드래그 중이 아닐 때만 transition 적용 (페이지 이동 시 부드럽게)
                  className={`flex ${!isDragging ? 'transition-transform duration-300 ease-out' : ''}`}
                  style={{
                    width: `${totalPages * 100}%`,
                    transform: `translateX(${currentTranslate}px)`,
                    userSelect: 'none',
                  }}
                >
                  {/* === 각 페이지 렌더링 === */}
                  {Array.from({ length: totalPages }).map((_, pageIndex) => {
                    // 현재 페이지에 표시될 병들 계산
                    const startIndex = pageIndex * BOTTLES_PER_PAGE;
                    const endIndex = startIndex + BOTTLES_PER_PAGE;
                    const bottlesForCurrentPage = items.slice(
                      startIndex,
                      endIndex,
                    );

                    return (
                      <div
                        key={pageIndex}
                        className="w-full flex-shrink-0" // 각 페이지는 슬라이더 너비만큼 차지
                        style={{ width: `${100 / totalPages}%` }} // 너비 분배
                        aria-label={`페이지 ${pageIndex + 1}`}
                        role="tabpanel"
                        // hidden 속성 제거: translateX로 시각적 제어
                      >
                        <div className="flex flex-col items-center px-2 ">
                          {/* === 선반 렌더링 === */}
                          {Array.from({ length: SHELVES_PER_PAGE }).map(
                            (_, shelfIndex) => {
                              // 이 선반에 표시될 병들 계산
                              const shelfStartIndex =
                                shelfIndex * BOTTLES_PER_SHELF;
                              const shelfEndIndex =
                                shelfStartIndex + BOTTLES_PER_SHELF;
                              // bottlesForCurrentPage에서 현재 선반에 해당하는 병들만 추출
                              const bottlesForThisShelf =
                                bottlesForCurrentPage.slice(
                                  shelfStartIndex,
                                  shelfEndIndex,
                                );

                              return (
                                <div
                                  key={`shelf-${pageIndex}-${shelfIndex}`}
                                  className="flex flex-col items-center h-[25vh] w-full max-w-[var(--mobile-width)] -mt-4"
                                >
                                  {/* 병 영역 */}
                                  <div className="grid grid-cols-4 w-full h-[70%] px-2">
                                    {Array.from({
                                      length: BOTTLES_PER_SHELF,
                                    }).map((_, slotIndex) => {
                                      const bottle =
                                        bottlesForThisShelf[slotIndex];
                                      return (
                                        <div
                                          key={`slot-${pageIndex}-${shelfIndex}-${slotIndex}`}
                                          className="flex justify-center items-end h-full"
                                        >
                                          {bottle ? (
                                            <img
                                              src={bottle.image}
                                              alt={`병 ${bottle.id}`}
                                              className="w-auto max-w-[80%] max-h-52 object- select-none -mb-8"
                                              draggable="false"
                                              onClick={() =>
                                                navigate(
                                                  `/records/${bottle.id}`,
                                                )
                                              }
                                            />
                                          ) : (
                                            <div className="w-0 h-0" />
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>

                                  {/* 선반 이미지 */}
                                  <div
                                    className="w-full h-[30%] bg-no-repeat bg-contain bg-bottom pointer-events-none"
                                    style={{
                                      backgroundImage: `url(${whiskyShelf})`,
                                      backgroundSize: '100% 100%',
                                    }}
                                  />
                                </div>
                              );
                            },
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* === 페이지네이션 표시기 (점) === */}
              {totalPages > 1 && (
                <div
                  className="absolute bottom-20 left-0 right-0 flex justify-center gap-2 z-10"
                  role="tablist"
                  aria-label="컬렉션 페이지네이션"
                >
                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goToPage(i)}
                      className={`w-2.5 h-2.5 rounded-full transition-all duration-300
          ${
            i === currentPage
              ? 'bg-[#3C3C3C] scale-125' // 현재 페이지는 진한 색 + 크기 증가
              : 'bg-[#BDBDBD] opacity-70'
          }`}
                      aria-label={`${i + 1}페이지로 이동`}
                      aria-selected={i === currentPage}
                      role="tab"
                    />
                  ))}
                </div>
              )}

              {/* 빈 컬렉션 메시지 (선반 위에 겹쳐서 표시) */}
              {items.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="bg-white/80 backdrop-blur-sm px-8 py-6 rounded-xl shadow-md text-center">
                    <p className="text-lg text-gray-700">
                      아직 컬렉션에 위스키가 없습니다.
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      위스키를 추가해보세요!
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
          {/* 기록 추가하기 버튼 */}
          <div className="fixed bottom-24 left-0 right-8 flex justify-end">
            <button onClick={() => navigate('/records/create')}>
              <FaSquarePlus size={40} className="text-wood bg-bg" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Collection;
