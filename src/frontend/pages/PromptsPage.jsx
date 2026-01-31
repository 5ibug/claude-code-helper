import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './PromptsPage.css';

export default function PromptsPage() {
  const { t } = useTranslation();
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [newPrompt, setNewPrompt] = useState({ name: '', content: '' });
  const [editingPrompt, setEditingPrompt] = useState(null);

  useEffect(() => {
    loadPrompts();
  }, []);

  const loadPrompts = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/prompts');
      const data = await res.json();
      setPrompts(data);
    } catch (error) {
      console.error('加载提示词失败:', error);
    }
    setLoading(false);
  };

  const activatePrompt = async (id) => {
    setActivating(id);
    try {
      const res = await fetch(`/api/prompts/${id}/activate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadPrompts();
      } else {
        alert(`${t('prompts.activateFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('prompts.activateFailed')}: ${error.message}`);
    }
    setActivating(null);
  };

  const deletePrompt = async (id) => {
    if (id === 'temp') {
      alert(t('prompts.cannotDeleteTemp'));
      return;
    }
    if (!confirm(t('prompts.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/prompts/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadPrompts();
      } else {
        alert(`${t('prompts.deleteFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('prompts.deleteFailed')}: ${error.message}`);
    }
  };

  const saveTempPrompt = async (prompt) => {
    const name = window.prompt(t('prompts.enterPromptName'), t('prompts.customPrompt'));
    if (!name) return;

    try {
      const res = await fetch('/api/prompts/save-temp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, content: prompt.content }),
      });
      const data = await res.json();
      if (data.success) {
        await loadPrompts();
      } else {
        alert(`${t('prompts.saveFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('prompts.saveFailed')}: ${error.message}`);
    }
  };

  const addPrompt = async () => {
    if (!newPrompt.name.trim() || !newPrompt.content.trim()) {
      alert(t('prompts.fillComplete'));
      return;
    }
    try {
      const res = await fetch('/api/prompts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPrompt),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewPrompt({ name: '', content: '' });
        await loadPrompts();
      } else {
        alert(`${t('prompts.addFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('prompts.addFailed')}: ${error.message}`);
    }
  };

  const openEditModal = (prompt) => {
    setEditingPrompt({ ...prompt });
    setShowEditModal(true);
  };

  const updatePrompt = async () => {
    if (!editingPrompt.name.trim() || !editingPrompt.content.trim()) {
      alert(t('prompts.fillComplete'));
      return;
    }
    try {
      const res = await fetch(`/api/prompts/${editingPrompt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingPrompt.name, content: editingPrompt.content }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingPrompt(null);
        await loadPrompts();
      } else {
        alert(`${t('prompts.updateFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('prompts.updateFailed')}: ${error.message}`);
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{t('prompts.title')}</h2>
        <div>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            ➕ {t('common.add')}
          </button>
          <button className="refresh-btn" onClick={loadPrompts} disabled={loading}>
            🔄 {t('common.refresh')}
          </button>
        </div>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading-state">{t('common.loading')}</div>
        ) : (
          <div className="prompts-list">
            {prompts.map((prompt) => (
              <div key={prompt.id} className={`prompt-item ${prompt.is_active === 1 ? 'active' : ''} ${prompt.is_temp ? 'temp' : ''}`}>
                <div className="prompt-header">
                  <span className="prompt-name">{prompt.name}</span>
                  {prompt.is_active === 1 && <span className="active-badge">{prompt.is_temp ? t('prompts.temp') : t('common.activated')}</span>}
                </div>
                <div className="prompt-content">{prompt.content.substring(0, 200)}...</div>
                <div className="prompt-actions">
                  {prompt.is_temp ? (
                    <button
                      className="save-btn"
                      onClick={() => saveTempPrompt(prompt)}
                    >
                      {t('prompts.saveAsNew')}
                    </button>
                  ) : (
                    <>
                      {prompt.is_active !== 1 && (
                        <button
                          className="activate-btn"
                          onClick={() => activatePrompt(prompt.id)}
                          disabled={activating === prompt.id}
                        >
                          {activating === prompt.id ? t('common.activating') : t('common.activate')}
                        </button>
                      )}
                      <button className="edit-btn" onClick={() => openEditModal(prompt)}>
                        {t('common.edit')}
                      </button>
                      <button className="delete-btn" onClick={() => deletePrompt(prompt.id)}>
                        {t('common.delete')}
                      </button>
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('prompts.addTitle')}</h3>
            <input
              type="text"
              placeholder={t('prompts.promptNamePlaceholder')}
              value={newPrompt.name}
              onChange={(e) => setNewPrompt({ ...newPrompt, name: e.target.value })}
            />
            <textarea
              placeholder={t('prompts.promptContentPlaceholder')}
              value={newPrompt.content}
              onChange={(e) => setNewPrompt({ ...newPrompt, content: e.target.value })}
              rows={10}
            />
            <div className="modal-actions">
              <button onClick={addPrompt}>{t('common.confirm')}</button>
              <button onClick={() => setShowAddModal(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingPrompt && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('prompts.editTitle')}</h3>
            <input
              type="text"
              placeholder={t('prompts.promptNamePlaceholder')}
              value={editingPrompt.name}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, name: e.target.value })}
            />
            <textarea
              placeholder={t('prompts.promptContentPlaceholder')}
              value={editingPrompt.content}
              onChange={(e) => setEditingPrompt({ ...editingPrompt, content: e.target.value })}
              rows={10}
            />
            <div className="modal-actions">
              <button onClick={updatePrompt}>{t('common.confirm')}</button>
              <button onClick={() => setShowEditModal(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
