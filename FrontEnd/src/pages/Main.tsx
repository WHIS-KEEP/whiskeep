import useAuth from '@/store/useContext';

const Main = () => {
  const { user } = useAuth();
  return (
    <div className="flex-1 p-4 overflow-auto">
      <p className="text-text-main">
        여기가 진짜 메인으로 카드 등의 정보 나열될 곳.
      </p>
      <p className="text-text-main">{user?.nickname}님 환영합니다!</p>
    </div>
  );
};

export default Main;
