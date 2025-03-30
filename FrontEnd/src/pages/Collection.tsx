import React from 'react';

// shadcn/ui를 사용하고 있으므로, 테마에 정의된 색상 (예: background, muted, border 등)과
// Tailwind CSS 유틸리티 클래스를 활용하여 선반 디자인을 구현합니다.

const Collection = () => {
  // 선반 스타일을 정의합니다. 좀 더 사실적인 느낌을 위해 하단에 약간 어두운 테두리를 추가할 수 있습니다.
  // bg-muted 또는 bg-border 같은 shadcn/ui 테마 색상을 사용하거나,
  // 직접 나무 느낌의 색상(예: bg-yellow-800, bg-stone-700)을 지정할 수 있습니다.
  // 여기서는 약간 어두운 나무 느낌의 색상을 사용해 보겠습니다.
  const shelfStyle = `
    w-full h-6 bg-stone-700 rounded-sm shadow-md
    border-b-4 border-stone-800
    flex items-center px-4  // 내부 아이템(병) 정렬을 위해 추가 (지금은 비어있음)
  `;

  return (
    // flex-1: 남은 공간을 모두 차지
    // p-4 md:p-8: 패딩 (중간 크기 화면 이상에서는 더 큰 패딩)
    // overflow-auto: 내용이 넘칠 경우 스크롤 생성
    // bg-background: shadcn/ui 테마의 기본 배경색 사용
    <div className="flex-1 p-4 md:p-8 overflow-auto bg-background">
      <h2 className="text-2xl font-semibold mb-8 text-foreground">
        My Whisky Shelf
      </h2>

      {/* 선반들을 감싸는 컨테이너 */}
      {/* flex flex-col: 자식 요소들을 세로로 쌓음 */}
      {/* space-y-24: 선반 사이의 수직 간격 (병 높이를 고려하여 충분히 설정) */}
      <div className="flex flex-col space-y-24">
        {/* 첫 번째 선반 */}
        <div className={shelfStyle}>
          {/* 나중에 이 안에 위스키 병 컴포넌트들을 배치합니다. */}
          {/* 예시: <WhiskyBottle name="Glenfiddich 12" /> */}
          <span className="text-xs text-muted-foreground italic">
            Shelf 1 - Bottles will go here
          </span>
        </div>

        {/* 두 번째 선반 */}
        <div className={shelfStyle}>
          {/* 나중에 이 안에 위스키 병 컴포넌트들을 배치합니다. */}
          <span className="text-xs text-muted-foreground italic">
            Shelf 2 - Bottles will go here
          </span>
        </div>

        {/* 세 번째 선반 */}
        <div className={shelfStyle}>
          {/* 나중에 이 안에 위스키 병 컴포넌트들을 배치합니다. */}
          <span className="text-xs text-muted-foreground italic">
            Shelf 3 - Bottles will go here
          </span>
        </div>

        {/* 필요에 따라 더 많은 선반 추가 */}
        {/*
        <div className={shelfStyle}>
          <span className="text-xs text-muted-foreground italic">Shelf 4 - Bottles will go here</span>
        </div>
        */}
      </div>
    </div>
  );
};

export default Collection;
