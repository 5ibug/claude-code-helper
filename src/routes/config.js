import express from 'express';
import * as configManager from '../services/config-manager.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const config = await configManager.getConfig();
    const configPath = configManager.getConfigPath();
    res.json({ ...config, _configPath: configPath });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.get('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const value = await configManager.getConfigValue(key);
    res.json({ [key]: value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { value } = req.body;
    await configManager.setConfigValue(key, value);
    res.json({ success: true, [key]: value });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/toggle/:key', async (req, res) => {
  try {
    const { key } = req.params;
    const { nestedKey } = req.body;

    if (nestedKey) {
      // 处理嵌套属性，如 attribution.commits
      const value = await configManager.toggleNestedConfig(key, nestedKey);
      res.json({ success: true, [key]: { [nestedKey]: value } });
    } else {
      const value = await configManager.toggleConfig(key);
      res.json({ success: true, [key]: value });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
