#!/usr/bin/env node

import { startServer } from '../src/server.js';

startServer().then(({ url, port }) => {
  console.log(`
╔══════════════════════════════════════╗
║   Claude Code Helper is running!     ║
╠══════════════════════════════════════╣
║   Dashboard: ${url.padEnd(26)}║
║   Press Ctrl+C to stop               ║
╚══════════════════════════════════════╝
  `);
}).catch(error => {
  console.error('Failed to start server:', error.message);
  process.exit(1);
});
