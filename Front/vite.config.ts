import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
    plugins: [react()],
    server: {
        proxy: {
            // 프론트에서 /api 로 호출 → 원격 /openviduback/api 로 전달
            '/api': {
                target: 'https://i13e106.p.ssafy.io',
                changeOrigin: true,
                secure: false,
                rewrite: (path) => path.replace(/^\/api/, '/openviduback/api'),
            },
        },
    },
});
