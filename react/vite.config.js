import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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