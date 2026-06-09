import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        institucional: resolve(__dirname, 'institucional.html'),
        portalNoticias: resolve(__dirname, 'portal-noticias.html'),
        aprovados: resolve(__dirname, 'aprovados.html'),
      },
    },
  },
});
