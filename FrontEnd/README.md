# A409 PJT Front-End Guide (React 19)

<br>

## 0. 기본 세팅

1. node.js 설치 : https://nodejs.org/en/download
2. cmd에서 npm -v 와 node -v 입력을 통해 설치 확인

<br>

## 1. 프로젝트 환경 활성화

1. pnpm install

<br>

## 2. 설치된 것들

0. vite : 번들러
1. shadcn/ui : UI 컴포넌트 라이브러리
2. tailwindcss : CSS 프레임워크
3. zustand : 상태관리
4. axios : 통신
5. react-query : 훅

<br>

## 3. (2) 관련 참고 문헌

1. https://ui.shadcn.com/docs
2. https://tailwindcss.com/docs/installation/using-vite
3. https://zustand.docs.pmnd.rs
4. https://github.com/sindresorhus/ky-universal#readme
5. https://tanstack.com/query/latest/docs/framework/react/overview

<br>

## 4. 스타일 가이드

1. 색상 코드
   ![color code](./Color.png)
2. border 값
   - 버튼 또는 유사한 역할을 담당하는 소형 컴포넌트의 경우 rounded-md (6px)
   - 프레임을 담당하는 컴포넌트(ex. 카드)는 rounded-xl (12px)
   - 그 외 디테일한 조정은 https://tailwindcss.com/docs/border-radius 참고
3. CSS 입력
   ex. 버튼 예시 : <Button text="선택" size="l" color="color-text-muted-40" onClick={handleClick} />
   text와 size, color, 핸들러 관련에 한해 커스텀이 되도록 세팅
   text: 자유
   size: s, m, l, 그 외 내장 세팅은 Button.tsx 참고
   color: color-wood-70, color-text-muted-40, color-primary, color-primary-50, color-point-red 이렇게 일단은 구성
   이벤트 관련 : 백엔드 기능 추가시에 점차 추가
