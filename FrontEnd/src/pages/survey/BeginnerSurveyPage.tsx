import logo from '@/assets/logo.svg';
import FlavorScoreQuestion from '@/components/ui/survey/FlavorScoreQuestion';
import PreferenceOrderQuestion from '@/components/ui/survey/PreferenceOrderQuestion';
import { useBeginnerSurveyMutation } from '@/hooks/mutations/useSurveyMutation';
import { BeginnerSurveyRequest } from '@/lib/api/survey';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import fruitImg from '@/assets/survey/fruit.avif';
import sweetImg from '@/assets/survey/sweet.jpg';
import spicyImg from '@/assets/survey/spicy.jpg';
import oakyImg from '@/assets/survey/oaky.jpg';
import herbalImg from '@/assets/survey/herbal.jpg';
import brinyImg from '@/assets/survey/salty.jpg';

type FlavorKey = 'fruity' | 'sweet' | 'spicy' | 'oaky' | 'herbal' | 'briny';

const flavorItems = ['향', '맛', '여운'];
const scoreQuestions: {
  key: FlavorKey;
  text: string;
  example: string;
  image: string;
}[] = [
  {
    key: 'fruity',
    text: ' 과일을 얼마나 좋아하시나요?',
    example: '예: 사과, 오렌지, 바나나, 자두, 체리 등',
    image: fruitImg,
  },
  {
    key: 'sweet',
    text: '단 향이나 단맛이 나는 음식을 얼마나 좋아하시나요?',
    example: '예: 바닐라, 초콜릿, 꿀, 카라멜, 셰리 와인 같은 풍미',
    image: sweetImg,
  },
  {
    key: 'spicy',
    text: '후추, 생강, 계피처럼 알싸하거나 매콤한 향이 나는 음식을 얼마나 좋아하시나요?',
    example:
      '예 : 후추 스테이크, 생강 쿠키, 스파이시 라면, 계피 맛이나 향이 나는 음식',
    image: spicyImg,
  },
  {
    key: 'oaky',
    text: '고소하거나 구수한 향을 얼마나 좋아하시나요?',
    example: '예: 고소한 견과류, 구운 곡물, 통나무향, 오트밀 쿠키',
    image: oakyImg,
  },
  {
    key: 'herbal',
    text: '풀내음, 꽃향기, 민트 같은 허브 계열 향을 얼마나 좋아하시나요?',
    example: '예: 민트 초콜릿, 꽃차, 허브티, 라벤더, 에스프레소',
    image: herbalImg,
  },
  {
    key: 'briny',
    text: '짭조름한 바다 향(소금, 해조류, 요오드향 등)이 나는 음식이나 향을 얼마나 좋아하시나요?',
    example: '예: 미역국, 조개구이, 해산물 요리, 해초칩',
    image: brinyImg,
  },
];

const BeginnerSurveyPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [order, setOrder] = useState<string[]>(flavorItems);
  const [scores, setScores] = useState<BeginnerSurveyRequest['tastingScore']>({
    fruity: 3,
    sweet: 3,
    spicy: 3,
    oaky: 3,
    herbal: 3,
    briny: 3,
  });

  const { mutate: submitSurvey } = useBeginnerSurveyMutation();

  const handleScoreChange = (key: string, val: number) => {
    setScores((prev) => ({ ...prev, [key]: val }));
  };

  const handleNext = () => {
    if (step < 6) setStep(step + 1);
    else {
      submitSurvey(
        {
          preferenceOrder: getPreferenceWeight(order),
          tastingScore: scores,
        },
        {
          onSuccess: () => navigate('/preference/complete'),
          onError: () => navigate('*'),
        },
      );
    }
  };

  const handlePrev = () => {
    if (step > 0) setStep(step - 1);
  };

  // 순서 기반으로 가중치 반환
  const getPreferenceWeight = (order: string[]): number[] => {
    const weights = [0.5, 0.3, 0.2];
    const result: Record<string, number> = {};
    order.forEach((item, idx) => {
      if (item === '향') result.nosing = weights[idx];
      if (item === '맛') result.tasting = weights[idx];
      if (item === '여운') result.finish = weights[idx];
    });
    return [result.nosing, result.tasting, result.finish];
  };
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
      {step === 0 ? (
        <PreferenceOrderQuestion
          items={order}
          onChange={setOrder}
          onNext={handleNext}
        />
      ) : (
        <FlavorScoreQuestion
          question={scoreQuestions[step - 1].text}
          example={scoreQuestions[step - 1].example}
          imageSrc={scoreQuestions[step - 1].image}
          value={scores[scoreQuestions[step - 1].key]}
          onChange={(val) =>
            handleScoreChange(scoreQuestions[step - 1].key, val)
          }
          onPrev={handlePrev}
          onNext={handleNext}
        />
      )}
    </div>
  );
};

export default BeginnerSurveyPage;
