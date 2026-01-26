
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      /**
       * We externalize these modules because they are provided via the <script type="importmap">
       * in index.html. This prevents Vite/Rollup from trying to resolve them from 
       * node_modules during the build process on Vercel.
       */
      external: [
        'react',
        'react-dom',
        'react-dom/client',
        'lucide-react',
        '@google/genai',
        'firebase/app',
        'firebase/firestore',
        'react-player'
      ],
    },
  },
});
