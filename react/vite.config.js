import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // main 브랜치에서 추가된 define 설정을 유지합니다.
  define: {
    'import.meta.env.VITE_OWM_KEY': JSON.stringify('0cfe5550c93741a70f8a3c3edb2a8da5')
  },
  // view/공지사항-백엔드-연동 브랜치의 자세한 proxy 설정을 사용합니다.
  server: {
    proxy: {
      // '/api'로 시작하는 모든 요청을 http://localhost:8080 (Spring Boot 서버)으로 전달합니다.
      '/api': {
        target: 'http://localhost:8080', // Spring Boot API 서버 주소
        changeOrigin: true, // HTTP 요청 헤더의 Host 값을 대상 서버의 값으로 변경합니다.
      }
    }
  }
})