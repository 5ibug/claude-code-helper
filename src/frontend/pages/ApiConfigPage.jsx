import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ApiConfigPage.css';

export default function ApiConfigPage() {
  const { t } = useTranslation();
  const [configs, setConfigs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activating, setActivating] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showSaveCurrentModal, setShowSaveCurrentModal] = useState(false);
  const [unsavedConfig, setUnsavedConfig] = useState(null);
  const [newConfig, setNewConfig] = useState({
    name: '',
    ANTHROPIC_AUTH_TOKEN: '',
    ANTHROPIC_BASE_URL: '',
    ANTHROPIC_DEFAULT_HAIKU_MODEL: '',
    ANTHROPIC_DEFAULT_OPUS_MODEL: '',
    ANTHROPIC_DEFAULT_SONNET_MODEL: '',
    ANTHROPIC_MODEL: ''
  });
  const [editingConfig, setEditingConfig] = useState(null);
  const [saveCurrentName, setSaveCurrentName] = useState('');

  useEffect(() => {
    loadConfigs();
  }, []);

  const loadConfigs = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/api-config');
      const data = await res.json();
      setConfigs(data.configs || []);
      setUnsavedConfig(data.unsaved_config);
    } catch (error) {
      console.error('加载配置失败:', error);
    }
    setLoading(false);
  };

  const activateConfig = async (id) => {
    setActivating(id);
    try {
      const res = await fetch(`/api/api-config/${id}/activate`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.activateFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.activateFailed')}: ${error.message}`);
    }
    setActivating(null);
  };

  const clearConfig = async () => {
    if (!confirm(t('apiConfig.confirmClear'))) return;
    try {
      const res = await fetch('/api/api-config/clear', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.clearFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.clearFailed')}: ${error.message}`);
    }
  };

  const deleteConfig = async (id) => {
    if (!confirm(t('apiConfig.confirmDelete'))) return;
    try {
      const res = await fetch(`/api/api-config/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.deleteFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.deleteFailed')}: ${error.message}`);
    }
  };

  const addConfig = async () => {
    if (!newConfig.name.trim() || !newConfig.ANTHROPIC_AUTH_TOKEN.trim()) {
      alert(t('apiConfig.nameRequired'));
      return;
    }

    const env = {
      ANTHROPIC_AUTH_TOKEN: newConfig.ANTHROPIC_AUTH_TOKEN,
      ANTHROPIC_BASE_URL: newConfig.ANTHROPIC_BASE_URL
    };

    if (newConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
      env.ANTHROPIC_DEFAULT_HAIKU_MODEL = newConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    }
    if (newConfig.ANTHROPIC_DEFAULT_OPUS_MODEL) {
      env.ANTHROPIC_DEFAULT_OPUS_MODEL = newConfig.ANTHROPIC_DEFAULT_OPUS_MODEL;
    }
    if (newConfig.ANTHROPIC_DEFAULT_SONNET_MODEL) {
      env.ANTHROPIC_DEFAULT_SONNET_MODEL = newConfig.ANTHROPIC_DEFAULT_SONNET_MODEL;
    }
    if (newConfig.ANTHROPIC_MODEL) {
      env.ANTHROPIC_MODEL = newConfig.ANTHROPIC_MODEL;
    }

    try {
      const res = await fetch('/api/api-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newConfig.name, env }),
      });
      const data = await res.json();
      if (data.success) {
        setShowAddModal(false);
        setNewConfig({
          name: '',
          ANTHROPIC_AUTH_TOKEN: '',
          ANTHROPIC_BASE_URL: '',
          ANTHROPIC_DEFAULT_HAIKU_MODEL: '',
          ANTHROPIC_DEFAULT_OPUS_MODEL: '',
          ANTHROPIC_DEFAULT_SONNET_MODEL: '',
          ANTHROPIC_MODEL: ''
        });
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.addFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.addFailed')}: ${error.message}`);
    }
  };

  const openEditModal = (config) => {
    setEditingConfig({
      id: config.id,
      name: config.name,
      ANTHROPIC_AUTH_TOKEN: config.env.ANTHROPIC_AUTH_TOKEN || '',
      ANTHROPIC_BASE_URL: config.env.ANTHROPIC_BASE_URL || '',
      ANTHROPIC_DEFAULT_HAIKU_MODEL: config.env.ANTHROPIC_DEFAULT_HAIKU_MODEL || '',
      ANTHROPIC_DEFAULT_OPUS_MODEL: config.env.ANTHROPIC_DEFAULT_OPUS_MODEL || '',
      ANTHROPIC_DEFAULT_SONNET_MODEL: config.env.ANTHROPIC_DEFAULT_SONNET_MODEL || '',
      ANTHROPIC_MODEL: config.env.ANTHROPIC_MODEL || ''
    });
    setShowEditModal(true);
  };

  const updateConfig = async () => {
    if (!editingConfig.name.trim() || !editingConfig.ANTHROPIC_AUTH_TOKEN.trim()) {
      alert(t('apiConfig.nameRequired'));
      return;
    }

    const env = {
      ANTHROPIC_AUTH_TOKEN: editingConfig.ANTHROPIC_AUTH_TOKEN,
      ANTHROPIC_BASE_URL: editingConfig.ANTHROPIC_BASE_URL
    };

    if (editingConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL) {
      env.ANTHROPIC_DEFAULT_HAIKU_MODEL = editingConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL;
    }
    if (editingConfig.ANTHROPIC_DEFAULT_OPUS_MODEL) {
      env.ANTHROPIC_DEFAULT_OPUS_MODEL = editingConfig.ANTHROPIC_DEFAULT_OPUS_MODEL;
    }
    if (editingConfig.ANTHROPIC_DEFAULT_SONNET_MODEL) {
      env.ANTHROPIC_DEFAULT_SONNET_MODEL = editingConfig.ANTHROPIC_DEFAULT_SONNET_MODEL;
    }
    if (editingConfig.ANTHROPIC_MODEL) {
      env.ANTHROPIC_MODEL = editingConfig.ANTHROPIC_MODEL;
    }

    try {
      const res = await fetch(`/api/api-config/${editingConfig.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: editingConfig.name, env }),
      });
      const data = await res.json();
      if (data.success) {
        setShowEditModal(false);
        setEditingConfig(null);
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.updateFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.updateFailed')}: ${error.message}`);
    }
  };

  const saveCurrentConfig = async () => {
    if (!saveCurrentName.trim()) {
      alert(t('apiConfig.configNameRequired'));
      return;
    }

    try {
      const res = await fetch('/api/api-config/save-current', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: saveCurrentName }),
      });
      const data = await res.json();
      if (data.success) {
        setShowSaveCurrentModal(false);
        setSaveCurrentName('');
        await loadConfigs();
      } else {
        alert(`${t('apiConfig.saveFailed')}: ${data.error}`);
      }
    } catch (error) {
      alert(`${t('apiConfig.saveFailed')}: ${error.message}`);
    }
  };

  const hasActiveConfig = configs.some(c => c.is_active);
  const hasBaseUrl = unsavedConfig?.env?.ANTHROPIC_BASE_URL;
  const isUsingProxy = !hasActiveConfig && hasBaseUrl;
  const isNotUsingProxy = !hasActiveConfig && !hasBaseUrl;

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{t('apiConfig.title')}</h2>
        <div>
          <button className="clear-btn" onClick={clearConfig}>
            🚫 {t('apiConfig.noProxy')}
          </button>
          <button className="add-btn" onClick={() => setShowAddModal(true)}>
            ➕ {t('common.add')}
          </button>
          <button className="refresh-btn" onClick={loadConfigs} disabled={loading}>
            🔄 {t('common.refresh')}
          </button>
        </div>
      </div>
      <div className="page-content">
        {loading ? (
          <div className="loading-state">{t('common.loading')}</div>
        ) : (
          <>
            {isNotUsingProxy && (
              <div className="warning-banner">
                ⚠️ {t('apiConfig.warningNoProxy')}
              </div>
            )}
            {isUsingProxy && (
              <div className="info-banner">
                🌐 {t('apiConfig.usingProxy', { url: hasBaseUrl })}
                <button className="save-current-btn" onClick={() => setShowSaveCurrentModal(true)}>
                  {t('apiConfig.saveCurrentConfig')}
                </button>
              </div>
            )}
            {unsavedConfig && hasActiveConfig && (
              <div className="info-banner">
                💡 {t('apiConfig.unsavedConfigDetected')}
                <button className="save-current-btn" onClick={() => setShowSaveCurrentModal(true)}>
                  {t('apiConfig.saveCurrentConfig')}
                </button>
              </div>
            )}
            <div className="configs-list">
              {configs.map((config) => (
                <div key={config.id} className={`config-item ${config.is_active ? 'active' : ''}`}>
                  <div className="config-header">
                    <span className="config-name">{config.name}</span>
                    {config.is_active && <span className="active-badge">{t('common.activated')}</span>}
                  </div>
                  <div className="config-details">
                    <div className="config-field">
                      <span className="field-label">{t('apiConfig.token')}:</span>
                      <span className="field-value">{config.env.ANTHROPIC_AUTH_TOKEN?.substring(0, 20)}...</span>
                    </div>
                    <div className="config-field">
                      <span className="field-label">{t('apiConfig.baseUrl')}:</span>
                      <span className="field-value">{config.env.ANTHROPIC_BASE_URL || t('apiConfig.default')}</span>
                    </div>
                    {config.env.ANTHROPIC_MODEL && (
                      <div className="config-field">
                        <span className="field-label">{t('apiConfig.model')}:</span>
                        <span className="field-value">{config.env.ANTHROPIC_MODEL}</span>
                      </div>
                    )}
                  </div>
                  <div className="config-actions">
                    {!config.is_active && (
                      <button
                        className="activate-btn"
                        onClick={() => activateConfig(config.id)}
                        disabled={activating === config.id}
                      >
                        {activating === config.id ? t('common.activating') : t('common.activate')}
                      </button>
                    )}
                    <button className="edit-btn" onClick={() => openEditModal(config)}>
                      {t('common.edit')}
                    </button>
                    <button className="delete-btn" onClick={() => deleteConfig(config.id)}>
                      {t('common.delete')}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h3>{t('apiConfig.addTitle')}</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder={t('apiConfig.configNamePlaceholder')}
                value={newConfig.name}
                onChange={(e) => setNewConfig({ ...newConfig, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="ANTHROPIC_AUTH_TOKEN *"
                value={newConfig.ANTHROPIC_AUTH_TOKEN}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_AUTH_TOKEN: e.target.value })}
              />
              <input
                type="text"
                placeholder="ANTHROPIC_BASE_URL"
                value={newConfig.ANTHROPIC_BASE_URL}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_BASE_URL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_MODEL (${t('common.optional')})`}
                value={newConfig.ANTHROPIC_MODEL}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_HAIKU_MODEL (${t('common.optional')})`}
                value={newConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_DEFAULT_HAIKU_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_SONNET_MODEL (${t('common.optional')})`}
                value={newConfig.ANTHROPIC_DEFAULT_SONNET_MODEL}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_DEFAULT_SONNET_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_OPUS_MODEL (${t('common.optional')})`}
                value={newConfig.ANTHROPIC_DEFAULT_OPUS_MODEL}
                onChange={(e) => setNewConfig({ ...newConfig, ANTHROPIC_DEFAULT_OPUS_MODEL: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={addConfig}>{t('common.confirm')}</button>
              <button onClick={() => setShowAddModal(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingConfig && (
        <div className="modal-overlay" onClick={() => setShowEditModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <h3>{t('apiConfig.editTitle')}</h3>
            <div className="form-grid">
              <input
                type="text"
                placeholder={t('apiConfig.configNamePlaceholder')}
                value={editingConfig.name}
                onChange={(e) => setEditingConfig({ ...editingConfig, name: e.target.value })}
              />
              <input
                type="text"
                placeholder="ANTHROPIC_AUTH_TOKEN *"
                value={editingConfig.ANTHROPIC_AUTH_TOKEN}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_AUTH_TOKEN: e.target.value })}
              />
              <input
                type="text"
                placeholder="ANTHROPIC_BASE_URL"
                value={editingConfig.ANTHROPIC_BASE_URL}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_BASE_URL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_MODEL (${t('common.optional')})`}
                value={editingConfig.ANTHROPIC_MODEL}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_HAIKU_MODEL (${t('common.optional')})`}
                value={editingConfig.ANTHROPIC_DEFAULT_HAIKU_MODEL}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_DEFAULT_HAIKU_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_SONNET_MODEL (${t('common.optional')})`}
                value={editingConfig.ANTHROPIC_DEFAULT_SONNET_MODEL}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_DEFAULT_SONNET_MODEL: e.target.value })}
              />
              <input
                type="text"
                placeholder={`ANTHROPIC_DEFAULT_OPUS_MODEL (${t('common.optional')})`}
                value={editingConfig.ANTHROPIC_DEFAULT_OPUS_MODEL}
                onChange={(e) => setEditingConfig({ ...editingConfig, ANTHROPIC_DEFAULT_OPUS_MODEL: e.target.value })}
              />
            </div>
            <div className="modal-actions">
              <button onClick={updateConfig}>{t('common.confirm')}</button>
              <button onClick={() => setShowEditModal(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}

      {showSaveCurrentModal && (
        <div className="modal-overlay" onClick={() => setShowSaveCurrentModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{t('apiConfig.saveCurrentTitle')}</h3>
            <p className="modal-hint">{t('apiConfig.saveCurrentHint')}</p>
            <input
              type="text"
              placeholder={t('apiConfig.enterConfigName')}
              value={saveCurrentName}
              onChange={(e) => setSaveCurrentName(e.target.value)}
              autoFocus
            />
            <div className="modal-actions">
              <button onClick={saveCurrentConfig}>{t('common.confirm')}</button>
              <button onClick={() => setShowSaveCurrentModal(false)}>{t('common.cancel')}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
