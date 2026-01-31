import express from 'express';
import * as envChecker from '../services/env-checker.js';

const router = express.Router();

router.get('/check', async (req, res) => {
  try {
    const tools = ['git', 'npm', 'node', 'pnpm', 'claude'];
    const results = {};

    for (const tool of tools) {
      results[tool] = await envChecker.checkTool(tool);
    }

    res.json(results);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/check/:tool', async (req, res) => {
  try {
    const { tool } = req.params;
    const result = await envChecker.checkTool(tool);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/install', async (req, res) => {
  try {
    const { tool } = req.body;
    const result = await envChecker.installTool(tool);
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
