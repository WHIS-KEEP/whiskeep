import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import NotFoundImage from '../assets/notfound.png'; // 이미지 import

const NotFound = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const navigationDelay = 3000;
    setTimeout(() => {
      navigate('/main');
    }, navigationDelay);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] p-6 bg-bg-muted rounded-lg">
      <img
        src={NotFoundImage}
        alt="페이지를 찾을 수 없음"
        className="mb-4"
        style={{ maxWidth: '400px', height: 'auto' }}
      />
      <h1 className="text-4xl font-bold mb-4 text-primary">
        ): 404 Not Found :(
      </h1>
      <p className="text-xl mb-6 text-text-muted">페이지를 찾을 수 없습니다.</p>
      <p className="text-md mb-6 text-text-muted">
        5초 후에 홈으로 돌아갑니다.
      </p>
    </div>
  );
};

export default NotFound;
