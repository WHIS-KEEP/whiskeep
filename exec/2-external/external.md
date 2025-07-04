## Google & Kakao OAuth 로그인 구현 절차

### 1. OAuth 플랫폼 등록 (Google / Kakao 개발자 콘솔)

1. 클라이언트 ID, 클라이언트 시크릿 발급  
2. Redirect URI 등록  
3. 사용자 동의 항목 설정 (이메일, 프로필 등)  

### 2. OAuth 인증 요청 → 인가 코드 수신

1. 사용자를 Google/Kakao 로그인 페이지로 리다이렉트  
2. 로그인 성공 시, 설정한 Redirect URI로 인가 코드 전달

### 3. 인가 코드로 액세스 토큰 요청

1. 백엔드에서 인가 코드로 Access Token 요청, 성공 시 반환 

### 4. Access Token으로 사용자 정보 요청

1. Google/Kakao API를 호출하여 사용자 이메일, 이름 등 기본 정보 획득

### 5. 회원가입 또는 로그인 처리

받은 사용자 정보로 기존 회원 여부 확인  

1. 신규: 회원가입 처리  
2. 기존: 로그인 처리 및 세션/JWT 발급  

