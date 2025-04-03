import {
  useState,
  useRef,
  TouchEvent,
  MouseEvent,
  useMemo,
  useEffect,
} from 'react';
import api from '../lib/util/axiosInstance';

// --- 상수 정의 ---
const BOTTLES_PER_SHELF = 5; // 선반당 병 개수
const SHELVES_PER_PAGE = 3; // 페이지당 선반 개수
const BOTTLES_PER_PAGE = BOTTLES_PER_SHELF * SHELVES_PER_PAGE; // 페이지당 최대 병 개수 (15)

// 위스키 타입 정의
interface Whisky {
  whiskyId: number;
  whiskyImg: string;
}

// --- 컴포넌트 ---
const Collection = () => {
  const [items, setItems] = useState<{ id: number; image: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);

  // API에서 위스키 데이터 가져오기
  useEffect(() => {
    const fetchWhiskyData = async () => {
      try {
        setLoading(true);

        // 디버깅을 위해 API 요청 정보 출력
        console.log('🔍 API 요청 준비:', {
          method: 'GET',
          url: '/records',
        });

        const startTime = performance.now();
        const response = await api.get<Whisky[]>('/records');
        const endTime = performance.now();

        // 디버깅을 위해 API 응답 정보 출력
        console.log(`✅ API 응답 (${Math.round(endTime - startTime)}ms):`, {
          status: response.status,
          statusText: response.statusText,
          headers: response.headers,
          endpoint: response.config?.url,
          fullUrl: response.config?.baseURL
            ? `${response.config.baseURL}${response.config.url || ''}`
            : response.config?.url,
        });
        console.log('📊 응답 데이터:', response.data);

        // API 응답 데이터를 기존 형식에 맞게 변환
        const formattedData = response.data.map((whisky) => ({
          id: whisky.whiskyId,
          image: whisky.whiskyImg,
        }));

        console.log('🔄 변환된 데이터:', formattedData);

        setItems(formattedData);
      } catch (error: any) {
        // any 타입으로 지정
        console.error('❌ 위스키 데이터를 불러오는 중 오류 발생:', error);

        // 상세한 오류 정보 출력
        if (error.response) {
          // 서버가 응답을 반환한 경우
          console.error('📡 응답 데이터:', {
            status: error.response.status,
            statusText: error.response.statusText,
            headers: error.response.headers,
            data: error.response.data,
            endpoint: error.config?.url,
            fullUrl: error.config?.baseURL
              ? `${error.config.baseURL}${error.config.url || ''}`
              : error.config?.url,
          });
        } else if (error.request) {
          // 요청은 보냈지만 응답을 받지 못한 경우
          console.error('📡 요청 정보:', {
            request: error.request,
            endpoint: error.config?.url,
            fullUrl: error.config?.baseURL
              ? `${error.config.baseURL}${error.config.url || ''}`
              : error.config?.url,
          });
        } else {
          // 요청 설정 과정에서 오류가 발생한 경우
          console.error('📡 요청 준비 오류:', {
            message: error.message,
            config: error.config,
          });
        }

        // 오류 발생 시 빈 배열로 설정
        setItems([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWhiskyData();
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
        <div className="h-full flex items-center justify-center">
          {loading ? (
            <div className="flex flex-col items-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
              <p className="mt-3 text-gray-700">데이터를 불러오는 중...</p>
            </div>
          ) : (
            <div className="w-full max-w-5xl lg:max-w-6xl relative px-2">
              {/* 이미지 슬라이더 영역 */}
              <div
                className="overflow-hidden w-full relative"
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
                        <div className="flex flex-col items-center gap-y-15 px-2  ">
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
                                // 선반 컨테이너 (배경 이미지)
                                <div
                                  key={`shelf-${pageIndex}-${shelfIndex}`}
                                  className="relative w-full max-w-4xl h-[20vh] bg-contain bg-no-repeat bg-center"
                                  style={{
                                    backgroundImage: "url('./IMG_3143.png')",
                                  }}
                                >
                                  {/* === 병 그리드 컨테이너 === */}
                                  <div
                                    className={`
                                      absolute left-0 right-0 grid grid-cols-5 px-2 h-full 
                                      bottom-15.5`}
                                  >
                                    {/* 선반당 슬롯 개수(5개)만큼 반복 */}
                                    {Array.from({
                                      length: BOTTLES_PER_SHELF,
                                    }).map((_, slotIndex) => {
                                      const bottle =
                                        bottlesForThisShelf[slotIndex];
                                      return (
                                        <div
                                          key={`slot-${pageIndex}-${shelfIndex}-${slotIndex}`}
                                          // 슬롯 자체의 정렬보다는 병 이미지 크기 조절이 더 중요할 수 있음
                                          className="flex justify-center items-center h-full" // 중앙 정렬 (필요에 따라 items-start, items-end 등으로 변경 가능)
                                        >
                                          {bottle ? (
                                            <img
                                              src={bottle.image}
                                              alt={`병 ${bottle.id}`}
                                              // max-h 값 조절로 선반 내 병 크기 제어
                                              className="max-h-[70%] sm:max-h-[75%] md:max-h-[80%] object-contain select-none"
                                              draggable="false"
                                            />
                                          ) : (
                                            <div className="w-full h-full"></div> // 빈 슬롯
                                          )}
                                        </div>
                                      );
                                    })}
                                  </div>
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
                  className="absolute -bottom-10 left-0 right-0 flex justify-center gap-2"
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
        </div>
      </div>
    </div>
  );
};

export default Collection;
