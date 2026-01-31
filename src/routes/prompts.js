import express from 'express';
import * as promptsDb from '../services/prompts-db.js';

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const prompts = promptsDb.getAllPrompts();
    res.json(prompts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: '名称和内容不能为空' });
    }
    const id = promptsDb.addPrompt(name, content);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: '名称和内容不能为空' });
    }
    promptsDb.updatePrompt(id, name, content);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    promptsDb.deletePrompt(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/:id/activate', async (req, res) => {
  try {
    const { id } = req.params;
    promptsDb.activatePrompt(id);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.post('/save-temp', async (req, res) => {
  try {
    const { name, content } = req.body;
    if (!name || !content) {
      return res.status(400).json({ error: '名称和内容不能为空' });
    }
    const id = promptsDb.saveTempAsNew(name, content);
    res.json({ success: true, id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
