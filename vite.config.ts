import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  envDir: './env',  // Specifies that .env is in ./env directory
  plugins: [
    react(),
  ],
  build: {
    rollupOptions: {
      plugins: [
        {
          name: 'log-env-variables',
          generateBundle() {
            // Logs the value of the environment variable during the build process
            console.log('VITE_GITHUB_TOKEN:', process.env.VITE_GITHUB_TOKEN);
          }
        }
      ]
    }
  }
});
