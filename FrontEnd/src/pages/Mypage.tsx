import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/button';
import { Camera, Pencil, Image as ImageIcon, X } from 'lucide-react'; // Image, X 아이콘 추가
// Drawer 컴포넌트 임포트
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn/drawer';
import Btn from '@/components/ui/Btn';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area'; // ScrollArea, ScrollBar 임포트 추가

const MyPage = () => {
  const userData = {
    name: '김싸피',
    email: 'ssafy.K@ssafy.com',
    nickname: '발렌타인12409',
    profileImageUrl: 'https://github.com/shadcn.png',
  };

  // 이미지 변경 메뉴 관련 핸들러 (실제 구현 필요)
  const handleTakePhoto = () => {
    console.log('카메라로 촬영하기 클릭');
    // TODO: 카메라 실행 로직
    // Drawer를 닫아야 한다면 DrawerClose 사용 또는 상태 관리 필요
  };

  const handleChooseFromGallery = () => {
    console.log('갤러리에서 선택하기 클릭');
    // TODO: 갤러리 열기 로직 (input type="file" 등)
  };

  // (기존 닉네임 수정, 저장, 취소, 로그아웃, 회원탈퇴 핸들러는 그대로 둠)
  const handleNicknameEditClick = () => console.log('닉네임 수정 클릭');
  const handleSaveChanges = () => console.log('저장 버튼 클릭');
  const handleCancelChanges = () => console.log('취소 버튼 클릭');
  const handleLogout = () => console.log('로그아웃 클릭');
  const handleWithdrawal = () => console.log('회원 탈퇴 클릭');

  return (
    <ScrollArea className="flex-1 bg-background rounded-[18px]">
      <div className="p-4 pb-57">
        <h2 className="mb-6 text-lg font-semibold text-foreground">
          마이페이지
        </h2>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-2">
            <Avatar className="h-32 w-32 border">
              <AvatarImage
                src={userData.profileImageUrl}
                alt="사용자 프로필 이미지"
              />
              <AvatarFallback>{userData.name?.charAt(0) || 'U'}</AvatarFallback>
            </Avatar>

            {/* --- Drawer 시작 --- */}
            <Drawer>
              {/* DrawerTrigger가 기존 카메라 버튼 역할을 하도록 asChild 사용 */}
              <DrawerTrigger asChild>
                <button
                  className="absolute bottom-1 right-1 rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  aria-label="프로필 이미지 변경"
                >
                  <Camera size={20} />
                </button>
              </DrawerTrigger>

              {/* DrawerContent: 화면 하단에서 올라오는 실제 메뉴 부분 */}
              <DrawerContent className="bg-background">
                {' '}
                {/* 배경색 적용 */}
                <DrawerHeader className="flex items-center justify-between px-4 pt-4 sm:px-6">
                  {' '}
                  {/* 패딩 및 정렬 */}
                  <DrawerTitle className="text-lg font-semibold">
                    사진 등록하기
                  </DrawerTitle>
                  {/* 닫기 버튼 */}
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-2 h-8 w-8"
                      aria-label="닫기"
                    >
                      {' '}
                      {/* 크기 및 마진 조정 */}
                      <X size={20} />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                {/* 메뉴 옵션 */}
                <div className="grid gap-3 p-4 sm:p-6">
                  {' '}
                  {/* 내부 패딩 및 간격 */}
                  <Button
                    variant="outline" // 테두리 버튼 스타일
                    className="w-full justify-start gap-3 py-6 text-base" // 왼쪽 정렬, 아이콘 간격, 충분한 높이, 폰트 크기
                    onClick={handleTakePhoto}
                  >
                    <Camera size={20} className="text-muted-foreground" />{' '}
                    {/* 아이콘 색상 */}
                    카메라로 촬영하기
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 py-6 text-base"
                    onClick={handleChooseFromGallery}
                  >
                    <ImageIcon size={20} className="text-muted-foreground" />{' '}
                    {/* Image 아이콘 사용 */}
                    갤러리에서 선택하기
                  </Button>
                </div>
                {/* 필요시 DrawerFooter 사용 */}
                {/* <DrawerFooter>
                  <DrawerClose asChild>
                    <Button variant="outline">취소</Button>
                  </DrawerClose>
                </DrawerFooter> */}
              </DrawerContent>
            </Drawer>
            {/* --- Drawer 끝 --- */}
          </div>
          <p className="text-sm text-text-muted">기본 프로필 이미지</p>
        </div>
        {/* 사용자 정보 섹션 (이전과 동일) */}
        <div className="mb-8 w-full space-y-5 px-4 sm:px-0 sm:max-w-sm sm:mx-auto">
          <div className="flex items-center justify-between">
            <span className="w-16 text-sm font-medium text-foreground">
              이름
            </span>
            <span className="flex-1 text-right text-sm text-primary-30">
              {userData.name}
            </span>
            <div className="w-6"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="w-16 text-sm font-medium text-foreground">
              이메일
            </span>
            <span className="flex-1 text-right text-sm text-primary-30">
              {userData.email}
            </span>
            <div className="w-6"></div>
          </div>
          <div className="flex items-center justify-between">
            <span className="w-16 text-sm font-medium text-foreground">
              닉네임
            </span>
            <span className="flex-1 text-right text-sm text-primary-dark">
              {userData.nickname}
            </span>
            <button
              onClick={handleNicknameEditClick}
              className="ml-2 p-1 text-muted-foreground hover:text-foreground"
              aria-label="닉네임 수정"
            >
              <Pencil size={16} />
            </button>
          </div>
        </div>
        {/* 저장/취소 버튼 섹션 (이전과 동일) */}
        <div className="mb-10 flex justify-center gap-4">
          <Btn
            text="저장"
            size="m"
            color="color-wood-70"
            textColor="text-white"
            onClick={handleSaveChanges}
          />
          <Btn
            text="취소"
            size="m"
            color="color-text-muted-40"
            textColor="text-white"
            onClick={handleCancelChanges}
          />
        </div>
        {/* 로그아웃/회원탈퇴 섹션 (이전과 동일) */}
        <div className="mt-auto flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <button
            onClick={handleLogout}
            className="hover:underline hover:text-foreground"
          >
            로그아웃
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={handleWithdrawal}
            className="hover:underline hover:text-foreground"
          >
            회원 탈퇴하기
          </button>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default MyPage;
