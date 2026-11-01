import {defineConfig} from 'vite';
import basicSsl from '@vitejs/plugin-basic-ssl';

const useSsl = process.env.VITE_SSL === 'true';

export default defineConfig({
  mode: 'development',
  assetsInclude: '**/*.html',
  base: './',
  plugins: useSsl ? [basicSsl()] : [],
  server: {
    host: true,
    port: 5173
  },
  resolve: {
    alias: {
      'three/addons/': 'three/examples/jsm/'
    }
  }
});
