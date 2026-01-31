import Database from 'better-sqlite3';
import path from 'path';
import os from 'os';
import fs from 'fs';
import crypto from 'crypto';

const DB_DIR = path.join(os.homedir(), '.claude');
const DB_PATH = path.join(DB_DIR, 'prompts.db');
const CLAUDE_MD_PATH = path.join(DB_DIR, 'CLAUDE.md');

// 确保目录存在
if (!fs.existsSync(DB_DIR)) {
  fs.mkdirSync(DB_DIR, { recursive: true });
}

const db = new Database(DB_PATH);

// 初始化数据库表
db.exec(`
  CREATE TABLE IF NOT EXISTS prompts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    content TEXT NOT NULL,
    content_md5 TEXT NOT NULL,
    is_active INTEGER DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

// 添加 content_md5 字段（如果不存在）
try {
  db.exec(`ALTER TABLE prompts ADD COLUMN content_md5 TEXT`);
} catch (error) {
  // 字段已存在，忽略错误
}

function calculateMd5(content) {
  return crypto.createHash('md5').update(content, 'utf-8').digest('hex');
}

export function getAllPrompts() {
  const prompts = db.prepare('SELECT * FROM prompts ORDER BY created_at ASC').all();

  // 读取当前 CLAUDE.md 文件内容
  let currentContent = '';
  let currentMd5 = '';
  if (fs.existsSync(CLAUDE_MD_PATH)) {
    currentContent = fs.readFileSync(CLAUDE_MD_PATH, 'utf-8');
    currentMd5 = calculateMd5(currentContent);
  }

  // 检查是否有匹配的提示词
  const matchedPrompt = prompts.find(p => p.content_md5 === currentMd5);

  // 如果当前文件内容不为空且没有匹配的提示词，添加临时项
  const result = [...prompts];
  if (currentContent && !matchedPrompt) {
    result.unshift({
      id: 'temp',
      name: '临时（当前文件内容）',
      content: currentContent,
      content_md5: currentMd5,
      is_active: 1,
      is_temp: true,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    });
  } else if (matchedPrompt) {
    // 更新匹配的提示词的激活状态
    result.forEach(p => {
      p.is_active = p.id === matchedPrompt.id ? 1 : 0;
    });
  }

  return result;
}

export function getActivePrompt() {
  return db.prepare('SELECT * FROM prompts WHERE is_active = 1').get();
}

export function addPrompt(name, content) {
  const contentMd5 = calculateMd5(content);
  const stmt = db.prepare('INSERT INTO prompts (name, content, content_md5) VALUES (?, ?, ?)');
  const result = stmt.run(name, content, contentMd5);
  return result.lastInsertRowid;
}

export function updatePrompt(id, name, content) {
  const contentMd5 = calculateMd5(content);
  const stmt = db.prepare('UPDATE prompts SET name = ?, content = ?, content_md5 = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?');
  return stmt.run(name, content, contentMd5, id);
}

export function deletePrompt(id) {
  const stmt = db.prepare('DELETE FROM prompts WHERE id = ?');
  return stmt.run(id);
}

export function activatePrompt(id) {
  const prompt = db.prepare('SELECT * FROM prompts WHERE id = ?').get(id);
  if (!prompt) {
    throw new Error('提示词不存在');
  }

  // 将提示词内容写入 CLAUDE.md
  fs.writeFileSync(CLAUDE_MD_PATH, prompt.content, 'utf-8');

  return true;
}

export function saveTempAsNew(name, content) {
  return addPrompt(name, content);
}

export function getClaudeMdPath() {
  return CLAUDE_MD_PATH;
}
