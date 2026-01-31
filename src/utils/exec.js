import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function executeCommand(command, options = {}) {
  const { timeout = 30000 } = options;
  return await execAsync(command, { timeout });
}
