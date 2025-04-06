import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/shadcn/avatar';
import { Button } from '@/components/shadcn/Button';
import { Camera, Pencil, Image as ImageIcon, X } from 'lucide-react';
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@/components/shadcn/drawer';
import Btn from '@/components/ui/Btn';
import { ScrollArea, ScrollBar } from '@/components/shadcn/scroll-area';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMyPageQuery } from '@/hooks/queries/useMyPageQuery';
import {
  useCheckNicknameMutation,
  useUpdateUserMutation,
} from '@/hooks/mutations/useMyPageMutations';

const MyPage = () => {
  const { data: userData, isLoading } = useMyPageQuery();
  const { mutate: checkNickname } = useCheckNicknameMutation();
  const { mutate: updateUser, isPending } = useUpdateUserMutation();

  const [nicknameEditable, setNicknameEditable] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [nicknameCheckMessage, setNicknameCheckMessage] = useState('');
  const [editedNickname, setEditedNickname] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [changesMade, setChangesMade] = useState(false);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (userData) {
      setEditedNickname(userData.nickname);
    }
  }, [userData]);

  const handleNicknameEditClick = () => {
    setNicknameEditable(true);
    setNicknameChecked(false);
    setChangesMade(true);
  };

  const handleCheckDuplicate = () => {
    if (!editedNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    checkNickname(editedNickname, {
      onSuccess: (isAvailable) => {
        if (isAvailable) {
          setNicknameCheckMessage('사용 가능한 닉네임입니다.');
          setNicknameChecked(true);
        } else {
          setNicknameCheckMessage('이미 사용 중인 닉네임입니다.');
          setNicknameChecked(false);
        }
      },
      onError: () => {
        setNicknameCheckMessage('중복 확인 중 오류가 발생했습니다.');
        setNicknameChecked(false);
      },
    });
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setChangesMade(true);
    }
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleSaveChanges = () => {
    if (nicknameEditable && !nicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (nicknameEditable && !editedNickname.trim()) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    updateUser(
      {
        nickname: editedNickname,
        profileImage: selectedImage,
      },
      {
        onSuccess: (updatedUser) => {
          alert('프로필이 수정되었습니다.');
          setChangesMade(false);
          setNicknameEditable(false);
          setNicknameChecked(false);
          setSelectedImage(null);

          const userInfoToSave = {
            nickname: updatedUser.nickname,
            profileImg: updatedUser.profileImg,
          };

          sessionStorage.setItem('user', JSON.stringify(userInfoToSave));

          navigate('/mypage');
        },
      },
    );
  };

  const handleCancelChanges = () => {
    if (userData) {
      setEditedNickname(userData.nickname);
    }
    setNicknameEditable(false);
    setNicknameChecked(false);
    setNicknameCheckMessage('');
    setSelectedImage(null);
    setChangesMade(false);
  };

  if (isLoading || !userData) return <div>로딩 중...</div>;

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
                src={
                  selectedImage
                    ? URL.createObjectURL(selectedImage)
                    : userData?.profileImg || 'https://github.com/shadcn.png'
                }
                alt="사용자 프로필 이미지"
              />
              <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
            </Avatar>

            <Drawer>
              <DrawerTrigger asChild>
                <button
                  className="absolute bottom-1 right-1 rounded-full bg-gray-200 p-2 text-gray-600 transition-colors hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600"
                  aria-label="프로필 이미지 변경"
                >
                  <Camera size={20} />
                </button>
              </DrawerTrigger>

              <DrawerContent className="bg-background">
                <DrawerHeader className="flex items-center justify-between px-4 pt-4 sm:px-6">
                  <DrawerTitle className="text-lg font-semibold">
                    사진 등록하기
                  </DrawerTitle>
                  <DrawerClose asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="-mr-2 h-8 w-8"
                      aria-label="닫기"
                    >
                      <X size={20} />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="grid gap-3 p-4 sm:p-6">
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 py-6 text-base"
                  >
                    <Camera size={20} className="text-muted-foreground" />
                    카메라로 촬영하기
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full justify-start gap-3 py-6 text-base"
                    onClick={handleChooseFromGallery}
                  >
                    <ImageIcon size={20} className="text-muted-foreground" />
                    갤러리에서 선택하기
                  </Button>
                  <input
                    type="file"
                    ref={fileInputRef}
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <p className="text-sm text-text-muted">기본 프로필 이미지</p>
        </div>

        <div className="mb-8 w-full space-y-5 px-4 sm:px-0 sm:max-w-sm sm:mx-auto">
          <InfoRow label="이름" value={userData.name} />
          <InfoRow label="이메일" value={userData.email} />

          <div className="flex items-center justify-between gap-2">
            <span className="w-16 text-sm font-medium text-foreground">
              닉네임
            </span>
            {nicknameEditable ? (
              <input
                value={editedNickname}
                onChange={(e) => {
                  setEditedNickname(e.target.value);
                  setNicknameChecked(false);
                  setChangesMade(true);
                }}
                className="flex-1 text-right text-sm border px-2 py-1 rounded"
                placeholder="닉네임을 입력하세요"
              />
            ) : (
              <span className="flex-1 text-right text-sm text-primary-dark">
                {userData.nickname}
              </span>
            )}
            {nicknameEditable ? (
              <Button size="sm" onClick={handleCheckDuplicate}>
                중복확인
              </Button>
            ) : (
              <button
                onClick={handleNicknameEditClick}
                className="ml-2 p-1 text-muted-foreground hover:text-foreground"
                aria-label="닉네임 수정"
              >
                <Pencil size={16} />
              </button>
            )}
          </div>

          {nicknameEditable && nicknameCheckMessage && (
            <p
              className={`text-sm ${nicknameChecked ? 'text-blue-500' : 'text-red-500'}`}
            >
              {nicknameCheckMessage}
            </p>
          )}
        </div>

        <div className="mb-10 flex justify-center gap-4">
          <Btn
            text="저장"
            size="m"
            color="color-wood-70"
            textColor="text-white"
            onClick={handleSaveChanges}
            disabled={
              isPending ||
              !changesMade ||
              (nicknameEditable && (!editedNickname.trim() || !nicknameChecked))
            }
          />
          <Btn
            text="취소"
            size="m"
            color="color-text-muted-40"
            textColor="text-white"
            onClick={handleCancelChanges}
            disabled={!changesMade}
          />
        </div>

        <div className="mt-auto flex items-center justify-center gap-3 text-sm text-muted-foreground">
          <button
            onClick={() => console.log('로그아웃 클릭')}
            className="hover:underline hover:text-foreground"
          >
            로그아웃
          </button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button
            onClick={() => console.log('회원 탈퇴 클릭')}
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

const InfoRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex items-center justify-between">
    <span className="w-16 text-sm font-medium text-foreground">{label}</span>
    <span className="flex-1 text-right text-sm text-primary-30">{value}</span>
    <div className="w-6"></div>
  </div>
);

export default MyPage;
