import { Separator } from '@/components/shadcn/separator'; // shadcn/ui의 Separator 컴포넌트
import { AspectRatio } from '@/components/shadcn/aspect-ratio'; // shadcn/ui의 AspectRatio 컴포넌트 (없다면 `npx shadcn-ui@latest add aspect-ratio` 로 추가)
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'; // ScrollArea, ScrollBar 임포트 추가

// 이 컴포넌트는 특정 술에 대한 상세 정보와 사용자가 기록한 사진들을 보여줍니다.
// 하단 네비게이션 바는 포함하지 않습니다.

const WhiskyRecordPage = () => {
  // --- Placeholder Data ---
  // 실제 애플리케이션에서는 API 호출 등을 통해 데이터를 받아옵니다.
  const whisky = {
    nameKr: '맥 캘란 12 년산 쉐리 오크 40%',
    nameEn: 'Macallan 12 Years Sherry Oak 40%',
    imageUrl: '/images/macallan-12-sherry.jpg', // 실제 이미지 경로로 변경 필요
    records: [
      { id: 1, imageUrl: './assets/example.png' }, // 실제 이미지 경로로 변경 필요
      { id: 2, imageUrl: '/assets/images/record-2.jpg' },
      { id: 3, imageUrl: '/assets/images/record-3.jpg' },
      { id: 4, imageUrl: '/assets/images/record-4.jpg' },
      { id: 5, imageUrl: '/assets/images/record-5.jpg' },
      { id: 6, imageUrl: '/assets/images/record-6.jpg' },
      { id: 7, imageUrl: '/assets/images/record-7.jpg' },
      { id: 8, imageUrl: '/assets/images/record-8.jpg' },
      { id: 9, imageUrl: '/assets/images/record-9.jpg' },
    ],
  };
  // --- End Placeholder Data ---

  const recordCount = whisky.records.length;

  return (
    // ScrollArea 컴포넌트로 교체
    <ScrollArea className="rounded-[18px] flex-1 bg-background">
      {/* 컨텐츠 내부에 패딩 적용 */}
      <div className="p-4 space-y-6">
        {/* 1. 위스키 정보 섹션 */}
        <div className="flex flex-col items-center space-y-4">
          {/* 위스키 병 이미지 */}
          {/* max-w-xs: 이미지 최대 너비 제한, mx-auto: 가운데 정렬 */}
          <div className="w-full max-w-xs mx-auto">
            {/* AspectRatio를 사용하여 이미지 비율 고정 (예: 1:1 또는 다른 비율) */}
            {/* object-contain을 사용하면 AspectRatio 없이도 비율 유지하며 표시 가능 */}
            <img
              src={whisky.imageUrl}
              alt={`${whisky.nameEn} bottle`}
              className="object-contain w-full h-auto rounded-md shadow-sm" // contain으로 비율 유지
            />
          </div>

          {/* 위스키 이름 및 정보 */}
          <div className="text-center">
            <h1 className="text-xl font-semibold text-foreground">
              {whisky.nameKr}
            </h1>
            <p className="text-sm text-muted-foreground">{whisky.nameEn}</p>
          </div>
        </div>

        {/* 구분선 */}
        <Separator className="my-4" />

        {/* 2. 나의 기록 섹션 */}
        <div className="space-y-3">
          {/* 기록 제목 */}
          <h2 className="text-lg font-semibold text-foreground">
            나의 기록 ({recordCount})
          </h2>

          {/* 기록 이미지 그리드 */}
          {/* grid grid-cols-3: 3열 그리드, gap-1: 아이템 간 작은 간격 */}
          <div className="grid grid-cols-3 gap-1">
            {whisky.records.map((record) => (
              // AspectRatio를 사용하여 정사각형 그리드 아이템 만들기
              <AspectRatio
                key={record.id}
                ratio={1 / 1}
                className="bg-muted rounded-sm overflow-hidden"
              >
                <img
                  src={record.imageUrl}
                  alt={`Record ${record.id}`}
                  className="object-cover w-full h-full transition-transform hover:scale-105" // cover로 채우고, hover 시 약간 확대
                />
              </AspectRatio>
            ))}
            {/* 기록이 없을 경우 메시지 표시 (옵션) */}
            {recordCount === 0 && (
              <p className="col-span-3 text-center text-muted-foreground py-4">
                아직 기록이 없습니다.
              </p>
            )}
          </div>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default WhiskyRecordPage;
