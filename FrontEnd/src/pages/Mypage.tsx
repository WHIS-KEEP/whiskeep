// 📁 MyPage.tsx
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
import API from '@/lib/util/axiosInstance';
import { useEffect, useRef, useState } from 'react';

interface UserData {
  name: string;
  email: string;
  nickname: string;
  profileImageUrl?: string;
}

const MyPage = () => {
  const [userData, setUserData] = useState<UserData>({
    name: '',
    email: '',
    nickname: '',
    profileImageUrl: '',
  });
  const [newNickname, setNewNickname] = useState('');
  const [nicknameEditable, setNicknameEditable] = useState(false);
  const [nicknameChecked, setNicknameChecked] = useState(false);
  const [editedNickname, setEditedNickname] = useState(userData.nickname);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [changesMade, setChangesMade] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    API.get('/members').then((response) => {
      setUserData({
        name: response.data.name,
        email: response.data.email,
        nickname: response.data.nickname,
        profileImageUrl:
          response.data.profileImg || 'https://github.com/shadcn.png',
      });
    });
  }, []);

  const handleTakePhoto = () => {
    console.log('카메라로 촬영하기 클릭');
  };

  const handleChooseFromGallery = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setChangesMade(true);
    }
  };

  const handleNicknameEditClick = () => {
    setNicknameEditable(true);
    setNewNickname(userData.nickname);
    setNicknameChecked(false);
    setChangesMade(true);
  };

  const handleCheckDuplicate = () => {
    API.post(`/members/check-nickname`, { nickname: editedNickname }).then(
      (res) => {
        if (res.data.available) {
          alert('사용 가능한 닉네임입니다.');
          setNicknameChecked(true);
        } else {
          alert('이미 사용 중인 닉네임입니다.');
          setNicknameChecked(false);
        }
      },
    );
  };

  const handleSaveChanges = async () => {
    if (!nicknameChecked) {
      alert('닉네임 중복 확인을 해주세요.');
      return;
    }

    if (!editedNickname) {
      alert('닉네임을 입력해주세요.');
      return;
    }

    const formData = new FormData();

    const member = {
      nickname: editedNickname,
    };

    formData.append(
      'member',
      new Blob([JSON.stringify(member)], { type: 'application/json' }),
    );

    if (selectedImage) {
      formData.append('profileImg', selectedImage);
    }

    await API.put('/members', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

    alert('프로필이 수정되었습니다.');
    setChangesMade(false);
    setNicknameEditable(false);
    setNicknameChecked(false);
  };

  const handleCancelChanges = () => {
    setNicknameEditable(false);
    setNicknameChecked(false);
    setSelectedImage(null);
    setChangesMade(false);
  };

  return (
    <ScrollArea className="flex-1 bg-background rounded-[18px]">
      <div className="p-4 pb-57">
        <h2 className="mb-6 text-lg font-semibold text-foreground">마이페이지</h2>
        <div className="mb-8 flex flex-col items-center">
          <div className="relative mb-2">
            <Avatar className="h-32 w-32 border">
              <AvatarImage
                src={selectedImage ? URL.createObjectURL(selectedImage) : userData?.profileImageUrl}
                alt="사용자 프로필 이미지"
              />
              <AvatarFallback>{userData.name?.charAt(0) || 'U'}</AvatarFallback>
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
                  <DrawerTitle className="text-lg font-semibold">사진 등록하기</DrawerTitle>
                  <DrawerClose asChild>
                    <Button variant="ghost" size="icon" className="-mr-2 h-8 w-8" aria-label="닫기">
                      <X size={20} />
                    </Button>
                  </DrawerClose>
                </DrawerHeader>
                <div className="grid gap-3 p-4 sm:p-6">
                  <Button variant="outline" className="w-full justify-start gap-3 py-6 text-base" onClick={handleTakePhoto}>
                    <Camera size={20} className="text-muted-foreground" />
                    카메라로 촬영하기
                  </Button>
                  <Button variant="outline" className="w-full justify-start gap-3 py-6 text-base" onClick={handleChooseFromGallery}>
                    <ImageIcon size={20} className="text-muted-foreground" />
                    갤러리에서 선택하기
                  </Button>
                  <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleImageChange} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
          <p className="text-sm text-text-muted">기본 프로필 이미지</p>
        </div>

        <div className="mb-8 w-full space-y-5 px-4 sm:px-0 sm:max-w-sm sm:mx-auto">
          <div className="flex items-center justify-between">
            <span className="w-16 text-sm font-medium text-foreground">이름</span>
            <span className="flex-1 text-right text-sm text-primary-30">{userData.name}</span>
            <div className="w-6"></div>
          </div>

          <div className="flex items-center justify-between">
            <span className="w-16 text-sm font-medium text-foreground">이메일</span>
            <span className="flex-1 text-right text-sm text-primary-30">{userData.email}</span>
            <div className="w-6"></div>
          </div>

          <div className="flex items-center justify-between gap-2">
            <span className="w-16 text-sm font-medium text-foreground">닉네임</span>
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
              <span className="flex-1 text-right text-sm text-primary-dark">{userData.nickname}</span>
            )}
            {nicknameEditable ? (
              <Button size="sm" onClick={handleCheckDuplicate}>중복확인</Button>
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
        </div>

        <div className="mb-10 flex justify-center gap-4">
          <Btn
            text="저장"
            size="m"
            color="color-wood-70"
            textColor="text-white"
            onClick={handleSaveChanges}
            disabled={!changesMade || (nicknameEditable && !nicknameChecked)}
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
          <button onClick={() => console.log('로그아웃 클릭')} className="hover:underline hover:text-foreground">로그아웃</button>
          <span className="text-gray-300 dark:text-gray-600">|</span>
          <button onClick={() => console.log('회원 탈퇴 클릭')} className="hover:underline hover:text-foreground">회원 탈퇴하기</button>
        </div>
      </div>
      <ScrollBar orientation="vertical" />
    </ScrollArea>
  );
};

export default MyPage;
