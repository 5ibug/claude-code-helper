import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs/promises';

const execAsync = promisify(exec);
const router = express.Router();

// Claude Code 相关的环境变量列表
const CLAUDE_ENV_VARS = [
  'CLAUDE_CODE_GIT_BASH_PATH'
];

// 获取 Claude Code 相关的环境变量
router.get('/', async (req, res) => {
  try {
    const platform = process.platform;
    let allEnvVars = {};

    if (platform === 'win32') {
      const { stdout } = await execAsync('powershell -Command "[Environment]::GetEnvironmentVariables(\'Machine\') | ConvertTo-Json"', {
        encoding: 'utf8',
        maxBuffer: 10 * 1024 * 1024
      });
      allEnvVars = JSON.parse(stdout);
    } else {
      const { stdout } = await execAsync('printenv');
      const lines = stdout.trim().split('\n');
      lines.forEach(line => {
        if (line.includes('=')) {
          const idx = line.indexOf('=');
          const name = line.substring(0, idx);
          const value = line.substring(idx + 1);
          allEnvVars[name] = value;
        }
      });
    }

    // 只返回 Claude Code 相关的环境变量
    const claudeEnvVars = CLAUDE_ENV_VARS
      .filter(name => allEnvVars[name])
      .map(name => ({ name, value: allEnvVars[name] }));

    res.json(claudeEnvVars);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// 添加环境变量
router.post('/', async (req, res) => {
  try {
    const { name, value } = req.body;

    if (!name || !name.trim()) {
      return res.status(400).json({ success: false, message: '变量名不能为空' });
    }

    const platform = process.platform;

    if (platform === 'win32') {
      const escapedValue = value.replace(/"/g, '`"');
      await execAsync(`powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-Command', '[Environment]::SetEnvironmentVariable(''${name}'', ''${escapedValue}'', ''Machine'')'" -Wait`);
    } else if (platform === 'darwin') {
      await execAsync(`sudo launchctl setenv ${name} "${value}"`);
      const profilePath = '/etc/profile';
      const exportLine = `\nexport ${name}="${value}"\n`;
      await execAsync(`echo '${exportLine}' | sudo tee -a ${profilePath}`);
      await execAsync(`source ${profilePath}`).catch(() => {});
      process.env[name] = value;
    } else {
      const envFilePath = '/etc/environment';
      const content = await fs.readFile(envFilePath, 'utf8').catch(() => '');
      const lines = content.split('\n').filter(line => !line.startsWith(`${name}=`));
      lines.push(`${name}="${value}"`);
      await execAsync(`echo '${lines.join('\n')}' | sudo tee ${envFilePath}`);
      await execAsync(`source ${envFilePath}`).catch(() => {});
      process.env[name] = value;
    }

    res.json({ success: true, message: '环境变量已添加并立即生效' });
  } catch (error) {
    if (error.message.includes('permission') || error.message.includes('denied')) {
      res.status(403).json({ success: false, message: '需要管理员权限才能修改系统环境变量' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// 更新环境变量（仅限 Claude Code 相关）
router.put('/:name', async (req, res) => {
  try {
    const { name } = req.params;
    const { value } = req.body;

    // 验证是否为允许修改的环境变量
    if (!CLAUDE_ENV_VARS.includes(name)) {
      return res.status(403).json({
        success: false,
        message: '只能修改 Claude Code 相关的环境变量'
      });
    }

    if (!value || !value.trim()) {
      return res.status(400).json({
        success: false,
        message: '变量值不能为空'
      });
    }

    const platform = process.platform;

    if (platform === 'win32') {
      const escapedValue = value.replace(/"/g, '`"');
      await execAsync(`powershell -Command "Start-Process powershell -Verb RunAs -ArgumentList '-Command', '[Environment]::SetEnvironmentVariable(''${name}'', ''${escapedValue}'', ''Machine'')'" -Wait`);
      res.json({ success: true, message: '环境变量已更新（需要重启应用生效）' });
    } else if (platform === 'darwin') {
      await execAsync(`sudo launchctl setenv ${name} "${value}"`);
      const profilePath = '/etc/profile';
      const content = await fs.readFile(profilePath, 'utf8').catch(() => '');
      const lines = content.split('\n').filter(line => !line.includes(`export ${name}=`));
      lines.push(`export ${name}="${value}"`);
      await execAsync(`echo '${lines.join('\n')}' | sudo tee ${profilePath}`);
      await execAsync(`source ${profilePath}`).catch(() => {});
      process.env[name] = value;
      res.json({ success: true, message: '环境变量已更新并立即生效' });
    } else {
      const envFilePath = '/etc/environment';
      const content = await fs.readFile(envFilePath, 'utf8').catch(() => '');
      const lines = content.split('\n').filter(line => !line.startsWith(`${name}=`));
      lines.push(`${name}="${value}"`);
      await execAsync(`echo '${lines.join('\n')}' | sudo tee ${envFilePath}`);
      await execAsync(`source ${envFilePath}`).catch(() => {});
      process.env[name] = value;
      res.json({ success: true, message: '环境变量已更新并立即生效' });
    }
  } catch (error) {
    if (error.message.includes('permission') || error.message.includes('denied')) {
      res.status(403).json({ success: false, message: '需要管理员权限才能修改系统环境变量' });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
});

// 删除环境变量路由已移除，因为我们不允许删除 Claude Code 环境变量

export default router;
