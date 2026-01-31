import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export async function checkAdminPermission() {
  const platform = process.platform;

  try {
    if (platform === 'win32') {
      const { stdout } = await execAsync('net session 2>&1');
      return !stdout.includes('拒绝访问') && !stdout.includes('Access is denied');
    } else {
      const { stdout } = await execAsync('id -u');
      const uid = parseInt(stdout.trim());
      if (uid === 0) {
        return true;
      }
      try {
        await execAsync('sudo -n true 2>&1');
        return true;
      } catch {
        return false;
      }
    }
  } catch (error) {
    return false;
  }
}

export function getPermissionWarning() {
  const platform = process.platform;

  if (platform === 'win32') {
    return '警告: 当前未以管理员身份运行。环境变量管理功能需要管理员权限。\n请右键点击程序，选择"以管理员身份运行"。';
  } else {
    return '警告: 当前用户没有 sudo 权限。环境变量管理功能需要 root 权限。\n请使用 sudo 运行此程序，或确保当前用户在 sudoers 列表中。';
  }
}
