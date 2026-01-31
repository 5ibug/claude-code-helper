import os from 'os';
import path from 'path';

export function getClaudeConfigPath() {
  return path.join(os.homedir(), '.claude.json');
}

export function isWindows() {
  return process.platform === 'win32';
}

export function isMac() {
  return process.platform === 'darwin';
}

export function isLinux() {
  return process.platform === 'linux';
}
