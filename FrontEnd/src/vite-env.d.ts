/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_KAKAO_REST_API_KEY: string
  readonly VITE_REDIRECT_URI: string
  // 기타 환경 변수들...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
