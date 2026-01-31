import express from 'express';
import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const router = express.Router();

const SETTINGS_PATH = path.join(os.homedir(), '.claude', 'settings.json');

// 获取当前 settings.json 的内容
async function getCurrentSettings() {
  try {
    const content = await fs.readFile(SETTINGS_PATH, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    return { env: {} };
  }
}

// 写入 settings.json
async function writeSettings(settings) {
  const dir = path.dirname(SETTINGS_PATH);
  await fs.mkdir(dir, { recursive: true });
  await fs.writeFile(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf8');
}

// 比较两个配置是否相同
function isConfigEqual(config1, config2) {
  const keys1 = Object.keys(config1).sort();
  const keys2 = Object.keys(config2).sort();

  if (keys1.length !== keys2.length) return false;

  for (let i = 0; i < keys1.length; i++) {
    if (keys1[i] !== keys2[i]) return false;
    if (config1[keys1[i]] !== config2[keys2[i]]) return false;
  }

  return true;
}

// 获取所有 API 配置
router.get('/', async (req, res) => {
  try {
    const currentSettings = await getCurrentSettings();
    const currentEnv = currentSettings.env || {};

    // 从数据库或文件读取所有保存的配置
    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      configs = [];
    }

    // 标记当前启用的配置
    configs = configs.map(config => ({
      ...config,
      is_active: isConfigEqual(config.env, currentEnv)
    }));

    // 检查是否有未保存的配置（settings 有内容但不在列表中）
    const hasCurrentConfig = Object.keys(currentEnv).length > 0;
    const isCurrentConfigSaved = configs.some(c => c.is_active);
    const hasUnsavedConfig = hasCurrentConfig && !isCurrentConfigSaved;

    res.json({
      configs,
      unsaved_config: hasUnsavedConfig ? { env: currentEnv } : null
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加新配置
router.post('/', async (req, res) => {
  try {
    const { name, env } = req.body;

    if (!name || !env) {
      return res.status(400).json({ error: '名称和配置不能为空' });
    }

    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      configs = [];
    }

    const newConfig = {
      id: Date.now().toString(),
      name,
      env,
      created_at: new Date().toISOString()
    };

    configs.push(newConfig);

    const dir = path.dirname(configsPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(configsPath, JSON.stringify(configs, null, 2), 'utf8');

    res.json({ success: true, id: newConfig.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 更新配置
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, env } = req.body;

    if (!name || !env) {
      return res.status(400).json({ error: '名称和配置不能为空' });
    }

    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      return res.status(404).json({ error: '配置不存在' });
    }

    const index = configs.findIndex(c => c.id === id);
    if (index === -1) {
      return res.status(404).json({ error: '配置不存在' });
    }

    const oldConfig = configs[index];
    configs[index] = {
      ...oldConfig,
      name,
      env,
      updated_at: new Date().toISOString()
    };

    await fs.writeFile(configsPath, JSON.stringify(configs, null, 2), 'utf8');

    // 如果编辑的是当前启用的配置，同步更新 settings.json
    const currentSettings = await getCurrentSettings();
    if (isConfigEqual(oldConfig.env, currentSettings.env || {})) {
      await writeSettings({ env });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 删除配置
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      return res.status(404).json({ error: '配置不存在' });
    }

    configs = configs.filter(c => c.id !== id);
    await fs.writeFile(configsPath, JSON.stringify(configs, null, 2), 'utf8');

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 启用配置
router.post('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;

    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      return res.status(404).json({ error: '配置不存在' });
    }

    const config = configs.find(c => c.id === id);
    if (!config) {
      return res.status(404).json({ error: '配置不存在' });
    }

    await writeSettings({ env: config.env });

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 清空配置（不走中转）
router.post('/clear', async (req, res) => {
  try {
    await writeSettings({ env: {} });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 保存当前 settings 中的配置
router.post('/save-current', async (req, res) => {
  try {
    const { name } = req.body;

    if (!name) {
      return res.status(400).json({ error: '名称不能为空' });
    }

    const currentSettings = await getCurrentSettings();
    const currentEnv = currentSettings.env || {};

    if (Object.keys(currentEnv).length === 0) {
      return res.status(400).json({ error: '当前没有配置可保存' });
    }

    const configsPath = path.join(os.homedir(), '.claude', 'api-configs.json');
    let configs = [];

    try {
      const content = await fs.readFile(configsPath, 'utf8');
      configs = JSON.parse(content);
    } catch (error) {
      configs = [];
    }

    const newConfig = {
      id: Date.now().toString(),
      name,
      env: currentEnv,
      created_at: new Date().toISOString()
    };

    configs.push(newConfig);

    const dir = path.dirname(configsPath);
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(configsPath, JSON.stringify(configs, null, 2), 'utf8');

    res.json({ success: true, id: newConfig.id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
