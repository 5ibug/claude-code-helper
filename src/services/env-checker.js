import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const TOOL_COMMANDS = {
  git: 'git --version',
  npm: 'npm -v',
  node: 'node -v',
  pnpm: 'pnpm -v',
  claude: 'claude --version'
};

const VERSION_REGEXES = {
  git: /git version ([\d]+\.[\d]+\.[\d]+)/i,
  npm: /^([\d.]+)$/,
  node: /^v?([\d.]+)$/,
  pnpm: /^([\d.]+)$/,
  claude: /claude code v?([\d.]+)/i
};

const INSTALL_COMMANDS = {
  claude: 'npm install -g @anthropic-ai/claude-code',
  pnpm: 'npm install -g pnpm'
};

export async function checkTool(tool) {
  const command = TOOL_COMMANDS[tool];
  if (!command) {
    throw new Error(`Unknown tool: ${tool}`);
  }

  try {
    const { stdout } = await execAsync(command, { timeout: 5000 });
    const regex = VERSION_REGEXES[tool];
    const match = stdout.match(regex);
    const version = match ? match[1] : stdout.trim();

    return { installed: true, version };
  } catch (error) {
    return { installed: false, version: null };
  }
}

export async function installTool(tool) {
  const command = INSTALL_COMMANDS[tool];
  if (!command) {
    throw new Error(`Cannot install tool: ${tool}`);
  }

  try {
    await execAsync(command, { timeout: 120000 });
    return { success: true, message: `${tool} installed successfully` };
  } catch (error) {
    throw new Error(`Failed to install ${tool}: ${error.message}`);
  }
}
