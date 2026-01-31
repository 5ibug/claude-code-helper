import express from 'express';
import portfinder from 'portfinder';
import path from 'path';
import { fileURLToPath } from 'url';
import { readFileSync } from 'fs';
import { openBrowser } from './services/launcher.js';
import { checkAdminPermission, getPermissionWarning } from './services/permission-checker.js';
import envRoutes from './routes/env.js';
import envVarsRoutes from './routes/envvars.js';
import configRoutes from './routes/config.js';
import promptsRoutes from './routes/prompts.js';
import apiConfigRoutes from './routes/api-config.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DIST_DIR = path.join(__dirname, '../dist');
const packageJson = JSON.parse(readFileSync(path.join(__dirname, '../package.json'), 'utf-8'));

export async function startServer() {
  const hasAdminPermission = await checkAdminPermission();

  if (!hasAdminPermission) {
    console.warn('\n' + '='.repeat(70));
    console.warn(getPermissionWarning());
    console.warn('='.repeat(70) + '\n');
  }

  const app = express();

  app.use(express.json());
  app.use(express.static(DIST_DIR));

  app.use('/api/env', envRoutes);
  app.use('/api/envvars', envVarsRoutes);
  app.use('/api/config', configRoutes);
  app.use('/api/prompts', promptsRoutes);
  app.use('/api/api-config', apiConfigRoutes);

  app.get('/api/version', (req, res) => {
    res.json({ version: packageJson.version });
  });

  app.get('*', (req, res) => {
    res.sendFile(path.join(DIST_DIR, 'index.html'));
  });

  portfinder.basePort = 3000;
  const port = await portfinder.getPortPromise();
  const url = `http://localhost:${port}`;

  const server = app.listen(port, async () => {
    console.log(`Server listening on port ${port}`);
    await openBrowser(url);
  });

  return { url, port, server };
}
