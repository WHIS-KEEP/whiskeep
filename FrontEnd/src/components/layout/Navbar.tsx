import { House, List, Camera, Wine, UserRound } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <>
      {/* 중앙 정렬을 위한 컨테이너 추가 */}
      <div className="fixed bottom-0 left-0 right-0 w-full flex justify-center z-40">
        {/* 배경색을 위한 고정된 요소 - max-width 적용 */}
        <div className="w-full max-w-[460px] h-[62px] bg-white border-t border-primary-30 shadow-lg"></div>
      </div>

      {/* 실제 NavBar 콘텐츠도 동일한 max-width 적용 */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex justify-center">
        <div className="w-full max-w-[460px]">
          <div
            className="flex items-center justify-between px-6"
            style={{ paddingTop: '0.6rem', paddingBottom: '0.6rem' }}
          >
            <div className="flex items-center justify-around w-full">
              <div className="relative flex flex-col items-center">
                {isActive('/main') && (
                  <span className="absolute top-[-0.5rem] w-2 h-2 rounded-full bg-primary-dark"></span>
                )}
                <Link to="/main" className="flex flex-col items-center">
                  <House
                    color={
                      isActive('/main')
                        ? 'var(--primary-dark)'
                        : 'var(--primary-50)'
                    }
                    size={30}
                  />
                  <span
                    className={`text-xs font-medium mt-1 ${isActive('/main') ? 'text-primary-dark' : 'text-primary-50'}`}
                  ></span>
                </Link>
              </div>
              <div className="relative flex flex-col items-center">
                {isActive('/list') && (
                  <span className="absolute top-[-0.5rem] w-2 h-2 rounded-full bg-primary-dark"></span>
                )}
                <Link to="/list" className="flex flex-col items-center">
                  <List
                    color={
                      isActive('/list')
                        ? 'var(--primary-dark)'
                        : 'var(--primary-50)'
                    }
                    size={30}
                  />
                  <span
                    className={`text-xs font-medium mt-1 ${isActive('/list') ? 'text-primary-dark' : 'text-primary-50'}`}
                  ></span>
                </Link>
              </div>

              {/* 카메라 아이콘과 원형 배경 */}
              <div className="relative flex flex-col items-center">
                {isActive('/ocr') && (
                  <span className="absolute top-[-0.5rem] w-2 h-2 rounded-full bg-primary-dark"></span>
                )}
                {/* 카메라 부분을 위로 올리기 위해 transform 사용 */}
                <Link to="/ocr" className="flex flex-col items-center">
                  <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div
                      className="w-[54px] h-[54px] rounded-full flex justify-center items-center shadow-lg"
                      style={{ backgroundColor: 'var(--primary-dark)' }}
                    >
                      <Camera color="white" size={36} />
                    </div>
                  </div>
                  {/* 빈 공간 (카메라 아이콘 위치 확보) */}
                  <div className="w-[32px] opacity-0">
                    <div className="h-[40px]"></div>
                  </div>
                  <span
                    className={`text-xs font-medium mt-1 ${isActive('/ocr') ? 'text-primary-dark' : 'text-primary-50'}`}
                  ></span>
                </Link>
              </div>

              <div className="relative flex flex-col items-center">
                {isActive('/collection') && (
                  <span className="absolute top-[-0.5rem] w-2 h-2 rounded-full bg-primary-dark"></span>
                )}
                <Link to="/collection" className="flex flex-col items-center">
                  <Wine
                    color={
                      isActive('/collection')
                        ? 'var(--primary-dark)'
                        : 'var(--primary-50)'
                    }
                    size={30}
                  />
                  <span
                    className={`text-xs font-medium mt-1 ${isActive('/collection') ? 'text-primary-dark' : 'text-primary-50'}`}
                  ></span>
                </Link>
              </div>
              <div className="relative flex flex-col items-center">
                {isActive('/mypage') && (
                  <span className="absolute top-[-0.5rem] w-2 h-2 rounded-full bg-primary-dark"></span>
                )}
                <Link to="/mypage" className="flex flex-col items-center">
                  <UserRound
                    color={
                      isActive('/mypage')
                        ? 'var(--primary-dark)'
                        : 'var(--primary-50)'
                    }
                    size={30}
                  />
                  <span
                    className={`text-xs font-medium mt-1 ${isActive('/mypage') ? 'text-primary-dark' : 'text-primary-50'}`}
                  ></span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Navbar;
