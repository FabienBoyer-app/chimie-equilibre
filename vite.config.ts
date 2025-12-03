import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Important : Cela permet d'utiliser process.env.API_KEY dans le code client
      // Netlify injectera la variable d'environnement lors du build
      'process.env.API_KEY': JSON.stringify(env.API_KEY)
    }
  };
});