import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { apiRouter } from './api/index';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;
  const isProduction = process.env.NODE_ENV === 'production';

  app.use(express.json());

  // Mount serverless /api routes
  app.use('/api', apiRouter);

  // Root level aliases for health and psiavailability
  app.get('/health', (req, res) => {
    res.redirect(307, '/api/health');
  });
  app.get('/psiavailability', (req, res) => {
    res.redirect(307, '/api/psiavailability');
  });

  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`SG Weather & Outdoor server running on port ${PORT}`);
  });
}

startServer();
