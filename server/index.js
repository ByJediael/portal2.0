import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '..', 'dist');
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || '0.0.0.0';

const app = express();

if (process.env.NODE_ENV === 'production' || process.env.TRUST_PROXY === '1') {
  app.set('trust proxy', 1);
}

app.get('/health', (_req, res) => {
  res.json({ ok: true, service: 'portal' });
});

if (fs.existsSync(DIST_DIR)) {
  app.use(express.static(DIST_DIR, { index: 'index.html' }));

  app.get('*', (req, res, next) => {
    if (req.path.includes('.')) {
      return res.status(404).type('text/plain').send('Not found');
    }
    res.sendFile(path.join(DIST_DIR, 'index.html'), (err) => {
      if (err) next(err);
    });
  });
} else {
  console.warn(`[portal] dist/ ausente em ${DIST_DIR}. Rode npm run build na raiz.`);
  app.use((_req, res) => {
    res.status(503).type('text/plain').send('Build de produção não encontrado (dist/).');
  });
}

app.listen(PORT, HOST, () => {
  console.log(`Portal rodando em http://${HOST}:${PORT}`);
});
