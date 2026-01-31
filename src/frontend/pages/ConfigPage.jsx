import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './ConfigPage.css';

export default function ConfigPage() {
  const { t } = useTranslation();
  const [config, setConfig] = useState({});
  const [configPath, setConfigPath] = useState('');
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(null);
  const [claudeVersion, setClaudeVersion] = useState(null);

  useEffect(() => {
    loadConfig();
    checkClaudeVersion();
  }, []);

  const checkClaudeVersion = async () => {
    try {
      const res = await fetch('/api/env/check');
      const data = await res.json();
      if (data.claude && data.claude.installed) {
        setClaudeVersion(data.claude.version);
      }
    } catch (error) {
      console.error('检查 Claude 版本失败:', error);
    }
  };

  const compareVersion = (version, target) => {
    if (!version) return -1;
    const v1 = version.split('.').map(Number);
    const v2 = target.split('.').map(Number);
    for (let i = 0; i < Math.max(v1.length, v2.length); i++) {
      const num1 = v1[i] || 0;
      const num2 = v2[i] || 0;
      if (num1 > num2) return 1;
      if (num1 < num2) return -1;
    }
    return 0;
  };

  const isVersionGte = (version, target) => {
    return compareVersion(version, target) >= 0;
  };

  const getConfigItems = () => {
    const items = [
      { key: 'hasCompletedOnboarding', label: t('config.skipLogin'), description: t('config.skipLoginDesc') },
    ];

    // 始终显示所有配置项，但根据版本添加提示
    const isNewVersion = claudeVersion && isVersionGte(claudeVersion, '2.0.62');

    // includeCoAuthoredBy 配置项
    items.push({
      key: 'includeCoAuthoredBy',
      label: t('config.aiAttribution'),
      description: t('config.aiAttributionDesc'),
      warning: isNewVersion ? t('config.deprecatedIn', { version: '2.0.62' }) : null
    });

    // attribution.commits 配置项
    items.push({
      key: 'attribution',
      nestedKey: 'commits',
      label: t('config.aiAttributionCommits'),
      description: t('config.aiAttributionCommitsDesc'),
      isNested: true,
      warning: !isNewVersion ? t('config.requiresVersion', { version: '2.0.62' }) : null
    });

    // attribution.pullRequests 配置项
    items.push({
      key: 'attribution',
      nestedKey: 'pullRequests',
      label: t('config.aiAttributionPRs'),
      description: t('config.aiAttributionPRsDesc'),
      isNested: true,
      warning: !isNewVersion ? t('config.requiresVersion', { version: '2.0.62' }) : null
    });

    return items;
  };

  const loadConfig = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/config');
      const data = await res.json();
      const { _configPath, ...configData } = data;
      setConfigPath(_configPath || '');
      setConfig(configData);
    } catch (error) {
      console.error('加载配置失败:', error);
    }
    setLoading(false);
  };

  const toggleConfig = async (key, nestedKey = null) => {
    const toggleKey = nestedKey ? `${key}.${nestedKey}` : key;
    setToggling(toggleKey);
    try {
      const body = nestedKey ? { nestedKey } : {};
      const res = await fetch(`/api/config/toggle/${key}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (data.success) {
        if (nestedKey) {
          // 更新嵌套配置
          setConfig(prev => ({
            ...prev,
            [key]: {
              ...prev[key],
              [nestedKey]: data[key][nestedKey]
            }
          }));
        } else {
          setConfig(prev => ({ ...prev, [key]: data[key] }));
        }
      }
    } catch (error) {
      alert(`${t('config.toggleFailed')}: ${error.message}`);
      loadConfig();
    }
    setToggling(null);
  };

  const getConfigValue = (item) => {
    if (item.isNested) {
      return config[item.key]?.[item.nestedKey] === true;
    }
    return config[item.key] === true;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>{t('config.title')}</h2>
        <button className="refresh-btn" onClick={loadConfig} disabled={loading}>
          🔄 {t('common.refresh')}
        </button>
      </div>
      {configPath && (
        <div style={{ padding: '0 24px', fontSize: '12px', color: '#666', marginBottom: '12px' }}>
          {t('config.configFile')}: {configPath}
        </div>
      )}
      <div className="page-content">
        {loading ? (
          <div className="loading-state">{t('config.loadingConfig')}</div>
        ) : (
          <div className="config-list">
            {getConfigItems().map((item) => {
              const itemKey = item.isNested ? `${item.key}.${item.nestedKey}` : item.key;
              const isChecked = getConfigValue(item);
              return (
                <div key={itemKey} className="config-item">
                  <div className="config-info">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span className="config-name">{item.label}</span>
                      {item.warning && (
                        <span style={{
                          fontSize: '11px',
                          color: '#ff9800',
                          background: '#fff3e0',
                          padding: '2px 8px',
                          borderRadius: '4px',
                          fontWeight: '500'
                        }}>
                          {item.warning}
                        </span>
                      )}
                    </div>
                    <span className="config-desc">{item.description}</span>
                  </div>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={() => toggleConfig(item.key, item.nestedKey)}
                      disabled={toggling === itemKey}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
