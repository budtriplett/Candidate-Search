import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
  envDir: './', 
  base: '/', 
  build: {
    outDir: 'dist', 
    rollupOptions: {
      plugins: [
        {
          name: 'log-env-variables',
          generateBundle() {
            console.log('VITE_GITHUB_TOKEN during build:', process.env.VITE_GITHUB_TOKEN);
          }
        }
      ]
    }
  },
  define: {
    'process.env': process.env, 
    'import.meta.env.VITE_GITHUB_TOKEN': JSON.stringify(process.env.VITE_GITHUB_TOKEN), 
  },
  plugins: [react()], 
});