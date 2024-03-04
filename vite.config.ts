import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/microservices/org-custom-app/', // here the name of your Microservice
  plugins: [vue()],
});
