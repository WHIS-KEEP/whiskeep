// src/components/pages/RecordDetailPage.jsx (예시 경로)
import React from 'react';
import { Card, CardContent } from '@/components/ui/card'; // shadcn/ui 카드 컴포넌트

// 이 컴포넌트는 사용자의 특정 기록(사진 + 텍스트)을 보여주는 페이지입니다.
// 상위 레이아웃에 의해 하단 네비게이션 바 위의 공간을 채우도록 배치됩니다.

const RecordDetailPage = () => {
  // --- Placeholder Data ---
  // 실제 애플리케이션에서는 props나 API 호출을 통해 데이터를 받아옵니다.
  const record = {
    imageUrl: '/images/sashimi-uni-suntory.jpg', // 실제 이미지 경로로 변경 필요
    altText: '회, 우니, 산토리 하이볼 조합 사진',
    notes: [
      '회 와 우니 와 산토리 의 조합! 같이 마시니까 너무 잘 어울린다..... 다음에 는 모모 랑 먹어야지! 크크',
      '오늘 끝',
    ],
  };
  // --- End Placeholder Data ---

  return (
    // flex-1: 상위 flex 컨테이너에서 남은 공간을 모두 차지
    // overflow-y-auto: 내용이 세로로 넘칠 경우 이 영역 내에서 스크롤
    // bg-background: shadcn/ui 테마 배경색
    <div className="flex-1 overflow-y-auto bg-background">
      {/* 1. 기록 사진 */}
      {/* 이미지가 화면 너비에 맞게 표시되고 높이는 비율에 맞게 자동 조절 */}
      <div>
        <img
          src={record.imageUrl}
          alt={record.altText}
          className="w-full h-auto" // 너비 100%, 높이 자동
        />
      </div>

      {/* 2. 기록 텍스트 */}
      {/* 사진과 텍스트 카드 사이에 공간을 주기 위해 padding 또는 margin 사용 */}
      {/* 여기서는 카드 자체에 약간의 상단 마진을 줄 수 있지만, p-4로 감싸서 전체적인 여백 확보 */}
      <div className="p-4">
        <Card className="shadow-sm">
          {' '}
          {/* 카드 컴포넌트 사용, 약간의 그림자 */}
          {/* CardContent는 내부에 기본 패딩(보통 p-6)을 가짐, 필요시 p-4 등으로 조정 */}
          <CardContent className="p-4 space-y-2">
            {record.notes.map((note, index) => (
              <p
                key={index}
                className="text-sm text-foreground leading-relaxed"
              >
                {/* leading-relaxed: 줄 간격 약간 넓게 */}
                {note}
              </p>
            ))}
          </CardContent>
        </Card>
      </div>
    </div> // End of main container
  );
};

export default RecordDetailPage;

// --- 중요: 상위 레이아웃 구조 예시 ---
// 이 RecordDetailPage 컴포넌트를 사용하는 부모 컴포넌트(예: AppLayout)는
// 다음과 같은 구조를 가져야 하단바 위에 내용이 올바르게 배치됩니다.

/*
import BottomNavigationBar from '@/components/layout/BottomNavigationBar'; // 실제 경로로 수정
import RecordDetailPage from '@/components/pages/RecordDetailPage'; // 실제 경로로 수정

function AppLayout() {
  return (
    // 전체 화면 높이를 차지하고, flex-col로 자식 요소(main, nav)를 세로 배치
    <div className="flex flex-col h-screen">

      // 메인 콘텐츠 영역: flex-1으로 남은 공간을 모두 차지하고,
      // 내부 콘텐츠가 넘칠 수 있으므로 overflow-y-hidden 또는 내용 컴포넌트에서 스크롤 처리
      <main className="flex-1 overflow-y-hidden">
         // RecordDetailPage가 flex-1과 overflow-y-auto를 가지므로 여기서 스크롤 처리
         <RecordDetailPage />
      </main>

      // 하단 네비게이션 바: 고정된 높이를 가짐
      <BottomNavigationBar />

    </div>
  );
}
*/
