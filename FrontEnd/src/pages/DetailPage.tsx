// 싹 다 날려도 되는 부분이라 임시로
import { useParams } from 'react-router-dom';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';

const DetailPage = () => {
  const { whiskyId } = useParams();

  return (
    <ScrollArea className="flex-1 bg-background">
      <div style={{ paddingBottom: '150px' }}>
        <div className="p-4">DetailPage {whiskyId}</div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default DetailPage;

// import React, { useState, useEffect, useRef, useCallback } from 'react';

// // --- shadcn/ui 컴포넌트 임포트 ---
// // 실제 프로젝트에서는 shadcn/ui 설치 및 설정에 따라 경로가 달라질 수 있습니다.
// import { Button } from '@/components/shadcn/Button';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
// } from '@/components/shadcn/card';
// import {
//   Avatar,
//   AvatarImage,
//   AvatarFallback,
// } from '@/components/shadcn/avatar';
// import { Separator } from '@/components/shadcn/separator';
// import { ScrollArea } from '@/components/shadcn/scroll-area';
// import { Heart, Star, MessageCircle } from 'lucide-react';

// // --- 데이터 타입 정의 ---
// interface TastingNotes {
//   nose: string[]; // 향
//   palate: string[]; // 맛
//   finish: string[]; // 피니시
// }

// interface Review {
//   id: string;
//   author: string;
//   avatarUrl?: string; // 사용자 아바타 URL (옵션)
//   rating: number; // 평점 (1-5)
//   comment: string;
//   imageUrl?: string; // 리뷰 첨부 이미지 URL (옵션)
//   createdAt: string; // 작성일시 (ISO 문자열 등)
// }

// interface WhiskyData {
//   whiskyId: string;
//   name: string; // 술 이름 (예: 맥캘란 12년산 쉐리 오크)
//   englishName: string; // 술 영문 이름 (예: Macallan 12 Years Sherry Oak)
//   whiskyImg: string; // 대표 이미지 URL
//   abv: number; // 도수 (예: 40)
//   type: string; // 종류 (예: Single Malt Whisky)
//   brewery: string; // 양조장 (예: Macallan)
//   region: string; // 나라, 지역 (예: Scotland, Speyside)
//   tastingNotes: TastingNotes;
//   isPick: boolean; // Whiskeep's Pick 여부
//   isLiked: boolean; // 사용자의 좋아요 여부
// }

// // --- API 호출 함수 (가상) ---
// // 실제로는 백엔드 API를 호출하는 로직으로 대체해야 합니다.
// const fetchWhiskyDetail = async (whiskyId: string): Promise<WhiskyData> => {
//   console.log(`Fetching whisky detail for ID: ${whiskyId}`);
//   // 가상 데이터 반환 (API 응답 시뮬레이션)
//   await new Promise((resolve) => setTimeout(resolve, 500)); // 네트워크 지연 시뮬레이션
//   return {
//     id: whiskyId,
//     name: '맥캘란 12년산 쉐리 오크',
//     englishName: 'Macallan 12 Years Sherry Oak',
//     imageUrl: 'https://placehold.co/400x300/E8D5B1/7F5539?text=[위스키+이미지]', // 실제 이미지 URL로 교체
//     abv: 40,
//     type: 'Single Malt Whisky',
//     brewery: 'Macallan',
//     countryRegion: 'Scotland, Speyside',
//     tastingNotes: {
//       nose: ['Sherry', 'Sweet', 'Fruit'],
//       palate: ['Sherry', 'Sweet', 'Oak'],
//       finish: ['Sherry', 'Oak', 'Sweet'],
//     },
//     isPick: true,
//     isLiked: false, // 초기 좋아요 상태
//   };
// };

// const fetchReviews = async (
//   whiskyId: string,
//   page: number,
//   limit: number,
// ): Promise<{ reviews: Review[]; hasMore: boolean }> => {
//   console.log(
//     `Fetching reviews for ID: ${whiskyId}, Page: ${page}, Limit: ${limit}`,
//   );
//   // 가상 데이터 반환 (API 응답 시뮬레이션)
//   await new Promise((resolve) => setTimeout(resolve, 800)); // 네트워크 지연 시뮬레이션

//   const totalReviews = 50; // 예시: 총 리뷰 수
//   const offset = (page - 1) * limit;
//   const mockReviews: Review[] = Array.from({ length: limit }, (_, i) => {
//     const reviewIndex = offset + i + 1;
//     if (reviewIndex > totalReviews) return null; // 총 리뷰 수를 넘으면 null 반환

//     return {
//       id: `review-${whiskyId}-${reviewIndex}`,
//       author: `사용자 ${reviewIndex}`,
//       avatarUrl: `https://placehold.co/40x40/aabbcc/ffffff?text=U${reviewIndex}`,
//       rating: Math.floor(Math.random() * 3) + 3, // 3, 4, 5점 랜덤
//       comment: `정말 맛있는 위스키입니다! ${reviewIndex}번째 후기. ${'맛있다! '.repeat(Math.random() * 5)}`,
//       imageUrl:
//         Math.random() > 0.5
//           ? `https://placehold.co/100x100/dddddd/777777?text=Review+${reviewIndex}`
//           : undefined,
//       createdAt: new Date(Date.now() - i * 3600000 * 24).toISOString(), // 가상 작성일
//     };
//   }).filter((review): review is Review => review !== null); // null 제거

//   const hasMore = offset + limit < totalReviews;

//   return { reviews: mockReviews, hasMore };
// };

// // --- 컴포넌트 ---
// const WhiskyDetailPage: React.FC = () => {
//   const [whiskyData, setWhiskyData] = useState<WhiskyData | null>(null);
//   const [reviews, setReviews] = useState<Review[]>([]);
//   const [isLoading, setIsLoading] = useState<boolean>(true);
//   const [isLiking, setIsLiking] = useState<boolean>(false); // 좋아요 처리 중 상태
//   const [isFetchingReviews, setIsFetchingReviews] = useState<boolean>(false);
//   const [reviewPage, setReviewPage] = useState<number>(1);
//   const [hasMoreReviews, setHasMoreReviews] = useState<boolean>(true);
//   const scrollAreaRef = useRef<HTMLDivElement>(null);

//   const whiskyId = 'macallan-12-sherry'; // 예시 ID, 실제로는 props나 라우터 파라미터에서 가져옴

//   // 위스키 상세 정보 로드
//   useEffect(() => {
//     const loadWhiskyData = async () => {
//       setIsLoading(true);
//       try {
//         const data = await fetchWhiskyDetail(whiskyId);
//         setWhiskyData(data);
//       } catch (error) {
//         console.error('Failed to fetch whisky details:', error);
//         // TODO: 에러 처리 UI 추가
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     loadWhiskyData();
//   }, [whiskyId]);

//   // 첫 페이지 리뷰 로드
//   useEffect(() => {
//     // 컴포넌트 마운트 시 또는 whiskyId 변경 시 첫 페이지 로드
//     if (whiskyId && reviewPage === 1) {
//       const loadInitialReviews = async () => {
//         if (isFetchingReviews) return;
//         setIsFetchingReviews(true);
//         try {
//           const { reviews: newReviews, hasMore } = await fetchReviews(
//             whiskyId,
//             1,
//             5,
//           ); // 첫 페이지(1) 로드
//           setReviews(newReviews); // 기존 리뷰 덮어쓰기
//           setHasMoreReviews(hasMore);
//           setReviewPage(hasMore ? 2 : 1); // 다음 페이지 번호 설정 또는 1로 유지
//         } catch (error) {
//           console.error('Failed to fetch initial reviews:', error);
//           setReviews([]); // 에러 시 리뷰 초기화
//           setHasMoreReviews(false); // 더 이상 로드할 수 없음
//         } finally {
//           setIsFetchingReviews(false);
//         }
//       };
//       loadInitialReviews();
//     }
//     // reviewPage가 1이 아닐 때는 이 useEffect가 동작하지 않도록 함
//     // 무한 스크롤 로직은 handleScroll에서 처리
//   }, [whiskyId]); // reviewPage, hasMoreReviews, isFetchingReviews 제거, 초기 로드만 담당

//   // 좋아요 버튼 클릭 핸들러
//   const handleLikeClick = async () => {
//     if (!whiskyData || isLiking) return;
//     setIsLiking(true);
//     // 가상 API 호출 (실제로는 백엔드에 좋아요 상태 업데이트 요청)
//     await new Promise((resolve) => setTimeout(resolve, 300));
//     setWhiskyData((prevData) =>
//       prevData ? { ...prevData, isLiked: !prevData.isLiked } : null,
//     );
//     setIsLiking(false);
//   };

//   // 무한 스크롤 핸들러
//   const handleScroll = useCallback(
//     (event: React.UIEvent<HTMLDivElement>) => {
//       const target = event.currentTarget;
//       // 스크롤이 맨 아래 근처에 도달했는지 확인 (예: 100px 이내)
//       const isNearBottom =
//         target.scrollHeight - target.scrollTop - target.clientHeight < 100;

//       if (isNearBottom && hasMoreReviews && !isFetchingReviews) {
//         console.log('Near bottom, fetching more reviews for page:', reviewPage);
//         // 다음 페이지 리뷰 로드
//         const loadMoreReviews = async () => {
//           setIsFetchingReviews(true);
//           try {
//             // 현재 reviewPage 상태를 사용하여 다음 페이지 로드
//             const { reviews: newReviews, hasMore } = await fetchReviews(
//               whiskyId,
//               reviewPage,
//               5,
//             );
//             setReviews((prevReviews) => [...prevReviews, ...newReviews]);
//             setHasMoreReviews(hasMore);
//             if (hasMore) {
//               // 성공적으로 로드한 경우에만 페이지 번호 증가
//               setReviewPage((prevPage) => prevPage + 1);
//             }
//           } catch (error) {
//             console.error('Failed to fetch more reviews:', error);
//             // 에러 발생 시 추가 로드를 시도하지 않도록 hasMoreReviews를 false로 설정할 수 있음
//             // setHasMoreReviews(false);
//           } finally {
//             setIsFetchingReviews(false);
//           }
//         };
//         loadMoreReviews();
//       }
//     },
//     [hasMoreReviews, isFetchingReviews, whiskyId, reviewPage],
//   ); // reviewPage 의존성 유지

//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p>데이터 로딩 중...</p>
//         {/* 로딩 스피너 등 추가 가능 */}
//       </div>
//     );
//   }

//   if (!whiskyData) {
//     return (
//       <div className="flex items-center justify-center h-full">
//         <p>위스키 정보를 불러오는데 실패했습니다.</p>
//       </div>
//     );
//   }

//   return (
//     <div className="bg-gray-100 font-sans">
//       {/* 모바일 컨테이너 */}
//       <div
//         className="relative mx-auto bg-white shadow-lg overflow-hidden"
//         style={{ maxWidth: '412px', height: '915px' }}
//       >
//         {/* 상단 헤더 */}
//         <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between p-4 bg-gradient-to-b from-black/30 to-transparent">
//           <h1 className="text-xl font-bold text-white">WHISKEEP</h1>
//           <Button
//             variant="ghost"
//             size="icon"
//             className={`text-white ${whiskyData.isLiked ? 'text-red-500 fill-red-500' : ''} hover:bg-white/20`}
//             onClick={handleLikeClick}
//             disabled={isLiking}
//             aria-label="Like"
//           >
//             <Heart className="w-6 h-6" />
//           </Button>
//         </header>
//         {/* 메인 컨텐츠 영역 (스크롤 가능) */}
//         <ScrollArea
//           className="h-full"
//           ref={scrollAreaRef}
//           onScroll={handleScroll}
//         >
//           {/* 이미지 섹션 */}
//           <div className="relative h-64 sm:h-80">
//             <img
//               src={whiskyData.imageUrl}
//               alt={`${whiskyData.name} 이미지`}
//               className="object-cover w-full h-full"
//               onError={(e) =>
//                 (e.currentTarget.src =
//                   'https://placehold.co/412x320/cccccc/ffffff?text=Image+Not+Found')
//               }
//             />
//             <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
//           </div>
//           {/* 컨텐츠 패딩 */}
//           <div className="p-4 space-y-6">
//             {/* Whiskeep's Pick */}
//             {whiskyData.isPick && (
//               <Button className="bg-pink-100 text-pink-700 border-pink-300">
//                 Whiskeep's Pick
//               </Button>
//             )}

//             {/* 위스키 이름 및 기본 정보 */}
//             <div className="flex items-start justify-between">
//               <div>
//                 <h2 className="text-2xl font-bold">{whiskyData.name}</h2>
//                 <p className="text-sm text-gray-500">
//                   {whiskyData.englishName} / {whiskyData.abv}%
//                 </p>
//               </div>
//             </div>

//             <Separator />

//             {/* 취향 분석 (Placeholder) */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>홍길동 님 취향 분석 (Tasting)</CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="flex items-center justify-center h-32 bg-gray-100 rounded-md">
//                   <p className="text-gray-500">[취향 분석 차트 영역]</p>
//                   {/* 여기에 Recharts 등을 이용한 차트 구현 */}
//                 </div>
//               </CardContent>
//             </Card>

//             {/* 상세 정보 */}
//             <Card>
//               <CardContent className="pt-6 space-y-2">
//                 <InfoRow label="양조장" value={whiskyData.brewery} />
//                 <InfoRow label="나라, 지역" value={whiskyData.countryRegion} />
//                 <InfoRow label="도수" value={`${whiskyData.abv}%`} />
//                 <InfoRow label="종류" value={whiskyData.type} />
//                 <p className="text-sm text-gray-600 pt-2">
//                   [위스키에 대한 추가 설명이 필요하면 여기에 넣습니다. 이미지에
//                   있는 텍스트를 참고하여 넣을 수 있습니다.]
//                 </p>
//               </CardContent>
//             </Card>

//             {/* 테이스팅 노트 */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>Tasting Notes</CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-2">
//                 <TastingNoteRow
//                   label="향 (Nose)"
//                   notes={whiskyData.tastingNotes.nose}
//                 />
//                 <TastingNoteRow
//                   label="맛 (Palate)"
//                   notes={whiskyData.tastingNotes.palate}
//                 />
//                 <TastingNoteRow
//                   label="피니시 (Finish)"
//                   notes={whiskyData.tastingNotes.finish}
//                 />
//               </CardContent>
//             </Card>

//             {/* 기록 노트 (무한 스크롤) */}
//             <Card>
//               <CardHeader>
//                 <CardTitle>기록 노트</CardTitle>
//                 <div className="flex items-center text-sm text-muted-foreground pt-1">
//                   <Star
//                     className="w-4 h-4 mr-1 text-yellow-500 fill-yellow-500"
//                     filled
//                   />
//                   <span>4.2 (880+)</span> {/* 예시 평점 */}
//                 </div>
//               </CardHeader>
//               <CardContent>
//                 <div className="space-y-4">
//                   {reviews.map((review) => (
//                     <ReviewItem key={review.id} review={review} />
//                   ))}
//                   {isFetchingReviews && (
//                     <div className="flex justify-center py-4">
//                       <p>리뷰 로딩 중...</p>
//                       <svg
//                         className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary"
//                         xmlns="http://www.w3.org/2000/svg"
//                         fill="none"
//                         viewBox="0 0 24 24"
//                       >
//                         <circle
//                           className="opacity-25"
//                           cx="12"
//                           cy="12"
//                           r="10"
//                           stroke="currentColor"
//                           strokeWidth="4"
//                         ></circle>
//                         <path
//                           className="opacity-75"
//                           fill="currentColor"
//                           d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
//                         ></path>
//                       </svg>
//                     </div>
//                   )}
//                   {!isFetchingReviews &&
//                     !hasMoreReviews &&
//                     reviews.length > 0 && (
//                       <p className="text-center text-gray-500 text-sm py-4">
//                         모든 리뷰를 불러왔습니다.
//                       </p>
//                     )}
//                   {!isFetchingReviews &&
//                     !hasMoreReviews &&
//                     reviews.length === 0 && (
//                       <p className="text-center text-gray-500 text-sm py-4">
//                         아직 작성된 리뷰가 없습니다.
//                       </p>
//                     )}
//                 </div>
//               </CardContent>
//             </Card>
//           </div>{' '}
//           {/* End of p-4 */}
//           {/* 스크롤 영역 하단 여백 */}
//           <div className="h-20"></div>
//         </ScrollArea>{' '}
//         {/* End of ScrollArea */}
//         {/* 하단 네비게이션 바 (Placeholder) */}
//         <footer className="absolute bottom-0 left-0 right-0 h-16 bg-white border-t border-gray-200 flex items-center justify-around">
//           {/* 네비게이션 아이콘들 */}
//           <button className="p-2 text-gray-500 hover:text-primary">
//             <MessageCircle className="w-6 h-6" />
//           </button>
//           <button className="p-2 text-gray-500 hover:text-primary">
//             <Star className="w-6 h-6" />
//           </button>
//           <button className="p-2 text-primary">
//             <Heart className="w-7 h-7" />
//           </button>{' '}
//           {/* 현재 페이지 표시 */}
//           <button className="p-2 text-gray-500 hover:text-primary">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="w-6 h-6"
//             >
//               <path d="M12 2a10 10 0 1 0 10 10H12V2Z" />
//               <path d="M12 12a10 10 0 0 0-4.9 1.4" />
//               <path d="M12 12a10 10 0 0 1 4.9 1.4" />
//             </svg>
//           </button>
//           <button className="p-2 text-gray-500 hover:text-primary">
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               width="24"
//               height="24"
//               viewBox="0 0 24 24"
//               fill="none"
//               stroke="currentColor"
//               strokeWidth="2"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               className="w-6 h-6"
//             >
//               <circle cx="12" cy="12" r="1" />
//               <circle cx="12" cy="5" r="1" />
//               <circle cx="12" cy="19" r="1" />
//             </svg>
//           </button>
//         </footer>
//       </div>{' '}
//       {/* End of Mobile Container */}
//     </div>
//   );
// };

// // --- 보조 컴포넌트 ---

// // 상세 정보 행
// const InfoRow = ({ label, value }: { label: string; value: string }) => (
//   <div className="flex justify-between text-sm">
//     <span className="text-gray-500">{label}</span>
//     <span className="font-medium text-right">{value}</span>
//   </div>
// );

// // 테이스팅 노트 행
// const TastingNoteRow = ({
//   label,
//   notes,
// }: {
//   label: string;
//   notes: string[];
// }) => (
//   <div className="flex flex-col sm:flex-row sm:justify-between text-sm">
//     <span className="text-gray-500 w-20 shrink-0 mb-1 sm:mb-0">{label}</span>
//     <span className="font-medium text-left sm:text-right">
//       {notes.join(', ')}
//     </span>
//   </div>
// );

// // 리뷰 아이템
// const ReviewItem: React.FC<{ review: Review }> = ({ review }) => (
//   <div className="border-b pb-4 last:border-b-0">
//     <div className="flex items-start space-x-3">
//       <Avatar className="h-8 w-8">
//         <AvatarImage src={review.avatarUrl} alt={review.author} />
//         <AvatarFallback>{review.author.charAt(0)}</AvatarFallback>
//       </Avatar>
//       <div className="flex-1 space-y-1">
//         <div className="flex items-center justify-between">
//           <p className="text-sm font-medium">{review.author}</p>
//           {/* 작성 시간 표시 (예: '5시간 전', '어제') 라이브러리 사용 권장 */}
//           <p className="text-xs text-gray-400">
//             {new Date(review.createdAt).toLocaleDateString()}
//           </p>
//         </div>
//         <div className="flex items-center">
//           {[1, 2, 3, 4, 5].map((star) => (
//             <Star
//               key={star}
//               className={`w-4 h-4 ${review.rating >= star ? 'text-yellow-500 fill-yellow-500' : 'text-gray-300'}`}
//               filled={review.rating >= star}
//             />
//           ))}
//         </div>
//         <p className="text-sm text-gray-700">{review.comment}</p>
//         {review.imageUrl && (
//           <img
//             src={review.imageUrl}
//             alt="리뷰 이미지"
//             className="mt-2 rounded-md max-w-[100px] max-h-[100px] object-cover"
//             onError={(e) => (e.currentTarget.style.display = 'none')} // 이미지 로드 실패 시 숨김
//           />
//         )}
//       </div>
//     </div>
//   </div>
// );

// export default WhiskyDetailPage; // 메인 컴포넌트 내보내기
