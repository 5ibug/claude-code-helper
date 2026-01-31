import fs from 'fs/promises';
import path from 'path';
import os from 'os';

const CONFIG_PATH = path.join(os.homedir(), '.claude.json');

export function getConfigPath() {
  return CONFIG_PATH;
}

export async function getConfig() {
  try {
    const content = await fs.readFile(CONFIG_PATH, 'utf-8');
    return JSON.parse(content);
  } catch (error) {
    if (error.code === 'ENOENT') {
      return {};
    }
    throw error;
  }
}

export async function getConfigValue(key) {
  const config = await getConfig();
  return config[key];
}

export async function setConfigValue(key, value) {
  const config = await getConfig();
  config[key] = value;
  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
  return value;
}

export async function toggleConfig(key) {
  const currentValue = await getConfigValue(key);
  const newValue = currentValue === true ? false : true;
  return await setConfigValue(key, newValue);
}

export async function toggleNestedConfig(parentKey, nestedKey) {
  const config = await getConfig();

  // 确保父对象存在
  if (!config[parentKey] || typeof config[parentKey] !== 'object') {
    config[parentKey] = {};
  }

  // 切换嵌套值
  const currentValue = config[parentKey][nestedKey];
  const newValue = currentValue === true ? false : true;
  config[parentKey][nestedKey] = newValue;

  await fs.writeFile(CONFIG_PATH, JSON.stringify(config, null, 2));
  return newValue;
}
