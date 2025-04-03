import logo from '@/assets/logo.svg';

const BeginnerSurveyPage = () => {
  return (
    <div className="min-h-screen bg-[var(--bg-muted)]">
      {/* Header 대신 */}
      <div
        className="flex items-center justify-between"
        style={{ padding: '1.25rem' }}
      >
        <div className="flex items-center">
          <img src={logo} alt="Wiskeep" className="h-7 w-auto" />
        </div>
      </div>
      {/* 질문 총 7개 들어감 */}
      질문 총 7개 들어갈 예정
    </div>
  );
};

export default BeginnerSurveyPage;
