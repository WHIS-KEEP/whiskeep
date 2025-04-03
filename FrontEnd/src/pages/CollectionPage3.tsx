import {
  useState,
  useRef,
  TouchEvent,
  MouseEvent,
  useMemo,
  useEffect,
} from 'react';

// --- 상수 정의 ---
const BOTTLES_PER_SHELF = 5; // 선반당 병 개수
const SHELVES_PER_PAGE = 3; // 페이지당 선반 개수
const BOTTLES_PER_PAGE = BOTTLES_PER_SHELF * SHELVES_PER_PAGE; // 페이지당 최대 병 개수 (15)

// --- 더미 데이터 ---
// 페이지 2 이상 테스트를 위해 주석 해제
const initialItems = [
  { id: 1, image: '/example.png' }, // 페이지 1, 선반 1
  { id: 2, image: '/example.png' },
  { id: 3, image: '/example.png' },
  { id: 4, image: '/example.png' },
  { id: 5, image: '/example.png' },
  { id: 6, image: '/example.png' }, // 페이지 1, 선반 2
  { id: 7, image: '/example.png' },
  { id: 8, image: '/example.png' },
  { id: 9, image: '/example.png' },
  { id: 10, image: '/example.png' },
  { id: 11, image: '/example.png' }, // 페이지 1, 선반 3
  { id: 12, image: '/example.png' },
  { id: 13, image: '/example.png' },
  { id: 14, image: '/example.png' },
  { id: 15, image: '/example.png' },
  { id: 16, image: '/example.png' }, // 페이지 2, 선반 1
  { id: 17, image: '/example.png' },
  { id: 18, image: '/example.png' },
];

// 선반-병 위치 관계를 위한 CSS 변수를 포함한 스타일
const collectionStyles = `
  :root {
    /* 기본 레이아웃 설정 */
    --viewport-height: 100vh;
    --shelf-width: 90%;
    --shelf-height: 18vh;
    --shelf-spacing: 2vh;
    
    /* 병 위치 및 크기 설정 */
    --bottle-height: 75%;
    --bottle-max-width: 55%;
  }
`;

// --- 컴포넌트 ---
const Collection = () => {
  const [items] = useState(initialItems);
  const [currentPage, setCurrentPage] = useState(0);

  // CSS 변수 페이지 로드 시 적용
  useEffect(() => {
    // 이미 style 태그가 있는지 확인
    let styleElement = document.getElementById('collection-styles');

    // 없으면 새로 생성
    if (!styleElement) {
      styleElement = document.createElement('style');
      styleElement.id = 'collection-styles';
      styleElement.innerHTML = collectionStyles;
      document.head.appendChild(styleElement);
    }

    // 컴포넌트 언마운트 시 스타일 제거
    return () => {
      if (styleElement && document.head.contains(styleElement)) {
        document.head.removeChild(styleElement);
      }
    };
  }, []);

  const totalPages = useMemo(
    () => Math.ceil(items.length / BOTTLES_PER_PAGE) || 1,
    [items.length],
  );

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
      // (드래그 종료 시에는 dragEnd에서 이미 최종 위치로 설정됨)
      // 만약 닷(dot) 클릭 등으로 페이지가 변경될 경우 이 useEffect가 애니메이션을 담당
      if (!isDragging) {
        // requestAnimationFrame을 사용하여 다음 프레임에서 translate 업데이트
        // 이렇게 하면 CSS transition이 적용될 시간을 확보할 수 있음
        const frameId = requestAnimationFrame(() => {
          setCurrentTranslate(targetTranslate);
          // prevTranslate도 동기화하여 다음 드래그 시작 시점 문제 방지
          setPrevTranslate(targetTranslate);
        });
        return () => cancelAnimationFrame(frameId); // 클린업 함수
      } else {
        // 드래그 중에는 dragMove가 translate를 제어하므로 여기서는 아무것도 안 함
        // 단, prevTranslate는 동기화해주는 것이 안전할 수 있음 (선택 사항)
        // setPrevTranslate(targetTranslate);
      }
    }
  }, [currentPage, isDragging]); // currentPage 변경 시 실행

  return (
    <div className="fixed inset-0 flex flex-col">
      {/* 여기에 상단바가 있다고 가정 */}
      <div className="flex-1 overflow-hidden bg-[#efebe0]">
        <div className="h-full w-full relative">
          {' '}
          {/* 상대 위치를 위한 컨테이너 */}
          {currentPage === 0 && (
            <div className="absolute w-full h-full">
              {/* 첫 번째 선반 */}
              <div
                className="absolute bg-contain bg-no-repeat bg-center"
                style={{
                  top: '15vh',
                  left: '50%',
                  width: '90%',
                  height: '18vh',
                  transform: 'translateX(-50%)',
                  backgroundImage: "url('./IMG_3143.png')",
                }}
              >
                {/* === 병 그리드 컨테이너 === */}
                <div
                  className="absolute w-full grid grid-cols-5 px-2"
                  style={{ height: '85%', bottom: '5%' }}
                >
                  {Array.from({ length: BOTTLES_PER_SHELF }).map((_, index) => {
                    const bottle = items[index];
                    return (
                      <div
                        key={`bottle-0-0-${index}`}
                        className="flex justify-center items-end"
                      >
                        {bottle ? (
                          <img
                            src={bottle.image}
                            alt={`병 ${bottle.id}`}
                            className="object-contain select-none"
                            draggable="false"
                            style={{
                              height: '75%',
                              maxWidth: '55%',
                              transform: 'translateY(-40%)',
                              filter:
                                'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 두 번째 선반 */}
              <div
                className="absolute bg-contain bg-no-repeat bg-center"
                style={{
                  top: '40vh',
                  left: '50%',
                  width: '90%',
                  height: '18vh',
                  transform: 'translateX(-50%)',
                  backgroundImage: "url('./IMG_3143.png')",
                }}
              >
                <div
                  className="absolute w-full grid grid-cols-5 px-2"
                  style={{ height: '85%', bottom: '5%' }}
                >
                  {Array.from({ length: BOTTLES_PER_SHELF }).map((_, index) => {
                    const bottleIndex = BOTTLES_PER_SHELF + index;
                    const bottle = items[bottleIndex];
                    return (
                      <div
                        key={`bottle-0-1-${index}`}
                        className="flex justify-center items-end"
                      >
                        {bottle ? (
                          <img
                            src={bottle.image}
                            alt={`병 ${bottle.id}`}
                            className="object-contain select-none"
                            draggable="false"
                            style={{
                              height: '75%',
                              maxWidth: '55%',
                              transform: 'translateY(-40%)',
                              filter:
                                'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 세 번째 선반 */}
              <div
                className="absolute bg-contain bg-no-repeat bg-center"
                style={{
                  top: '65vh',
                  left: '50%',
                  width: '90%',
                  height: '18vh',
                  transform: 'translateX(-50%)',
                  backgroundImage: "url('./IMG_3143.png')",
                }}
              >
                <div
                  className="absolute w-full grid grid-cols-5 px-2"
                  style={{ height: '85%', bottom: '5%' }}
                >
                  {Array.from({ length: BOTTLES_PER_SHELF }).map((_, index) => {
                    const bottleIndex = BOTTLES_PER_SHELF * 2 + index;
                    const bottle = items[bottleIndex];
                    return (
                      <div
                        key={`bottle-0-2-${index}`}
                        className="flex justify-center items-end"
                      >
                        {bottle ? (
                          <img
                            src={bottle.image}
                            alt={`병 ${bottle.id}`}
                            className="object-contain select-none"
                            draggable="false"
                            style={{
                              height: '75%',
                              maxWidth: '55%',
                              transform: 'translateY(-40%)',
                              filter:
                                'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {currentPage === 1 && (
            <div className="absolute w-full h-full">
              {/* 첫 번째 선반 (페이지 2) */}
              <div
                className="absolute bg-contain bg-no-repeat bg-center"
                style={{
                  top: '15vh',
                  left: '50%',
                  width: '90%',
                  height: '18vh',
                  transform: 'translateX(-50%)',
                  backgroundImage: "url('./IMG_3143.png')",
                }}
              >
                <div
                  className="absolute w-full grid grid-cols-5 px-2"
                  style={{ height: '85%', bottom: '5%' }}
                >
                  {Array.from({ length: BOTTLES_PER_SHELF }).map((_, index) => {
                    const bottleIndex = BOTTLES_PER_PAGE + index;
                    const bottle = items[bottleIndex];
                    return (
                      <div
                        key={`bottle-1-0-${index}`}
                        className="flex justify-center items-end"
                      >
                        {bottle ? (
                          <img
                            src={bottle.image}
                            alt={`병 ${bottle.id}`}
                            className="object-contain select-none"
                            draggable="false"
                            style={{
                              height: '75%',
                              maxWidth: '55%',
                              transform: 'translateY(-40%)',
                              filter:
                                'drop-shadow(0 4px 3px rgba(0, 0, 0, 0.1))',
                            }}
                          />
                        ) : (
                          <div className="w-full h-full"></div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
          {/* === 페이지네이션 표시기 (점) === */}
          {totalPages > 1 && (
            <div
              className="absolute bottom-5 left-0 right-0 flex justify-center gap-2"
              role="tablist"
              aria-label="컬렉션 페이지네이션"
            >
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => goToPage(i)}
                  className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full transition-colors duration-200 ${
                    i === currentPage
                      ? 'bg-black scale-110'
                      : 'bg-gray-400 hover:bg-gray-500'
                  }`}
                  aria-label={`${i + 1}페이지로 이동`}
                  aria-selected={i === currentPage}
                  role="tab"
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Collection;
