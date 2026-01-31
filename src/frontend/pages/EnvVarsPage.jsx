import { useEffect, useState } from 'react';
import './EnvVarsPage.css';

const CLAUDE_ENV_VARS = [
  {
    name: 'CLAUDE_CODE_GIT_BASH_PATH',
    description: 'Windows 中使用 Claude Code 需要填 git 的 bash.exe 文件路径',
    example: 'C:\\Program Files\\Git\\bin\\bash.exe'
  }
];

export default function EnvVarsPage() {
  const [envVars, setEnvVars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingVar, setEditingVar] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadEnvVars();
  }, []);

  const loadEnvVars = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/envvars');
      const systemVars = await res.json();

      const mergedVars = CLAUDE_ENV_VARS.map(claudeVar => {
        const systemVar = systemVars.find(v => v.name === claudeVar.name);
        return {
          ...claudeVar,
          value: systemVar?.value || '',
          isSet: !!systemVar
        };
      });

      setEnvVars(mergedVars);
    } catch (error) {
      console.error('加载失败:', error);
    }
    setLoading(false);
  };

  const handleSave = async (name, value) => {
    if (!value.trim()) {
      alert('变量值不能为空');
      return;
    }
    try {
      const res = await fetch(`/api/envvars/${name}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ value }),
      });
      const data = await res.json();
      if (data.success) {
        await loadEnvVars();
        setEditingVar(null);
      } else {
        alert(`保存失败: ${data.message || data.error}`);
      }
    } catch (error) {
      alert(`保存失败: ${error.message}`);
    }
  };

  const filteredVars = envVars.filter(v =>
    v.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    v.value.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>Claude Code 环境变量</h2>
        <div className="header-actions">
          <input
            type="text"
            className="search-input"
            placeholder="搜索环境变量..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {loading ? (
        <div className="loading-state">加载中...</div>
      ) : (
        <div className="envvars-list">
          {filteredVars.map((envVar) => (
            <div key={envVar.name} className={`envvar-card ${envVar.isSet ? 'is-set' : 'not-set'}`}>
              <div className="card-header">
                <div className="var-name-section">
                  <h3 className="var-name">{envVar.name}</h3>
                  <span className={`status-badge ${envVar.isSet ? 'set' : 'unset'}`}>
                    {envVar.isSet ? '已设置' : '未设置'}
                  </span>
                </div>
                <p className="var-description">{envVar.description}</p>
              </div>

              <div className="card-body">
                {editingVar === envVar.name ? (
                  <div className="edit-section">
                    <input
                      type="text"
                      className="edit-input"
                      defaultValue={envVar.value}
                      placeholder={envVar.example}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleSave(envVar.name, e.target.value);
                        } else if (e.key === 'Escape') {
                          setEditingVar(null);
                        }
                      }}
                      autoFocus
                    />
                    <div className="edit-actions">
                      <button
                        className="action-btn save"
                        onClick={(e) => {
                          const input = e.target.closest('.edit-section').querySelector('.edit-input');
                          handleSave(envVar.name, input.value);
                        }}
                      >
                        保存
                      </button>
                      <button
                        className="action-btn cancel"
                        onClick={() => setEditingVar(null)}
                      >
                        取消
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="view-section">
                    <div className="value-display">
                      {envVar.value ? (
                        <span className="value-text">{envVar.value}</span>
                      ) : (
                        <span className="value-placeholder">示例: {envVar.example}</span>
                      )}
                    </div>
                    <button
                      className="action-btn edit"
                      onClick={() => setEditingVar(envVar.name)}
                    >
                      {envVar.isSet ? '编辑' : '设置'}
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
          {filteredVars.length === 0 && (
            <div className="empty-state">
              没有找到匹配的环境变量
            </div>
          )}
        </div>
      )}
    </div>
  );
}
