import { useEffect, useState } from 'react';
import './EnvironmentPage.css';

const TOOLS = ['git', 'npm', 'node', 'pnpm', 'claude'];

export default function EnvironmentPage() {
  const [tools, setTools] = useState({});
  const [loading, setLoading] = useState(true);
  const [installing, setInstalling] = useState(null);

  useEffect(() => {
    checkAll();
  }, []);

  const checkAll = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/env/check');
      const data = await res.json();
      setTools(data);
    } catch (error) {
      console.error('检查失败:', error);
    }
    setLoading(false);
  };

  const installTool = async (tool) => {
    setInstalling(tool);
    try {
      const res = await fetch('/api/env/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tool }),
      });
      const data = await res.json();
      if (data.success) {
        await checkAll();
      } else {
        alert(`安装失败: ${data.message || data.error}`);
      }
    } catch (error) {
      alert(`安装失败: ${error.message}`);
    }
    setInstalling(null);
  };

  const installableTools = ['claude', 'pnpm'];

  const getToolIcon = (tool) => {
    const icons = {
      git: (
        <svg viewBox="0 0 24 24" fill="#F05032" width="48" height="48">
          <path d="M23.546 10.93L13.067.452c-.604-.603-1.582-.603-2.188 0L8.708 2.627l2.76 2.76c.645-.215 1.379-.07 1.889.441.516.515.658 1.258.438 1.9l2.658 2.66c.645-.223 1.387-.078 1.9.435.721.72.721 1.884 0 2.604-.719.719-1.881.719-2.6 0-.539-.541-.674-1.337-.404-1.996L12.86 8.955v6.525c.176.086.342.203.488.348.713.721.713 1.883 0 2.6-.719.721-1.889.721-2.609 0-.719-.719-.719-1.879 0-2.598.182-.18.387-.316.605-.406V8.835c-.217-.091-.424-.222-.6-.401-.545-.545-.676-1.342-.396-2.009L7.636 3.7.45 10.881c-.6.605-.6 1.584 0 2.189l10.48 10.477c.604.604 1.582.604 2.186 0l10.43-10.43c.605-.603.605-1.582 0-2.187"/>
        </svg>
      ),
      npm: (
        <svg viewBox="0 0 24 24" fill="#CB3837" width="48" height="48">
          <path d="M0 7.334v8h6.666v1.332H12v-1.332h12v-8H0zm6.666 6.664H5.334v-4H3.999v4H1.335V8.667h5.331v5.331zm4 0v1.336H8.001V8.667h5.334v5.332h-2.669v-.001zm12.001 0h-1.33v-4h-1.336v4h-1.335v-4h-1.33v4h-2.671V8.667h8.002v5.331zM10.665 10H12v2.667h-1.335V10z"/>
        </svg>
      ),
      node: (
        <svg viewBox="0 0 24 24" fill="#339933" width="48" height="48">
          <path d="M11.998,24c-0.321,0-0.641-0.084-0.922-0.247l-2.936-1.737c-0.438-0.245-0.224-0.332-0.08-0.383 c0.585-0.203,0.703-0.25,1.328-0.604c0.065-0.037,0.151-0.023,0.218,0.017l2.256,1.339c0.082,0.045,0.197,0.045,0.272,0l8.795-5.076 c0.082-0.047,0.134-0.141,0.134-0.238V6.921c0-0.099-0.053-0.192-0.137-0.242l-8.791-5.072c-0.081-0.047-0.189-0.047-0.271,0 L3.075,6.68C2.99,6.729,2.936,6.825,2.936,6.921v10.15c0,0.097,0.054,0.189,0.139,0.235l2.409,1.392 c1.307,0.654,2.108-0.116,2.108-0.89V7.787c0-0.142,0.114-0.253,0.256-0.253h1.115c0.139,0,0.255,0.112,0.255,0.253v10.021 c0,1.745-0.95,2.745-2.604,2.745c-0.508,0-0.909,0-2.026-0.551L2.28,18.675c-0.57-0.329-0.922-0.945-0.922-1.604V6.921 c0-0.659,0.353-1.275,0.922-1.603l8.795-5.082c0.557-0.315,1.296-0.315,1.848,0l8.794,5.082c0.57,0.329,0.924,0.944,0.924,1.603 v10.15c0,0.659-0.354,1.273-0.924,1.604l-8.794,5.078C12.643,23.916,12.324,24,11.998,24z M19.099,13.993 c0-1.9-1.284-2.406-3.987-2.763c-2.731-0.361-3.009-0.548-3.009-1.187c0-0.528,0.235-1.233,2.258-1.233 c1.807,0,2.473,0.389,2.747,1.607c0.024,0.115,0.129,0.199,0.247,0.199h1.141c0.071,0,0.138-0.031,0.186-0.081 c0.048-0.054,0.074-0.123,0.067-0.196c-0.177-2.098-1.571-3.076-4.388-3.076c-2.508,0-4.004,1.058-4.004,2.833 c0,1.925,1.488,2.457,3.895,2.695c2.88,0.282,3.103,0.703,3.103,1.269c0,0.983-0.789,1.402-2.642,1.402 c-2.327,0-2.839-0.584-3.011-1.742c-0.02-0.124-0.126-0.215-0.253-0.215h-1.137c-0.141,0-0.254,0.112-0.254,0.253 c0,1.482,0.806,3.248,4.655,3.248C17.501,17.007,19.099,15.91,19.099,13.993z"/>
        </svg>
      ),
      pnpm: (
        <svg viewBox="0 0 24 24" fill="#F69220" width="48" height="48">
          <path d="M0 0v7.5h7.5V0zm8.25 0v7.5h7.498V0zm8.25 0v7.5H24V0zM8.25 8.25v7.5h7.498v-7.5zm8.25 0v7.5H24v-7.5zM0 16.5V24h7.5v-7.5zm8.25 0V24h7.498v-7.5zm8.25 0V24H24v-7.5z"/>
        </svg>
      ),
      claude: (
        <svg viewBox="0 0 24 24" fill="#CC9B7A" width="48" height="48">
          <path d="M14.4 2.4c-.9-1.6-2.9-2.2-4.5-1.3-1.6.9-2.2 2.9-1.3 4.5l8.4 14.6c.9 1.6 2.9 2.2 4.5 1.3 1.6-.9 2.2-2.9 1.3-4.5L14.4 2.4zM7.2 9.6c-.9-1.6-2.9-2.2-4.5-1.3C1.1 9.2.5 11.2 1.4 12.8l8.4 14.6c.9 1.6 2.9 2.2 4.5 1.3 1.6-.9 2.2-2.9 1.3-4.5L7.2 9.6z"/>
        </svg>
      )
    };
    return icons[tool] || <svg viewBox="0 0 24 24" fill="#999" width="48" height="48"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/></svg>;
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2>环境检查</h2>
        <button className="refresh-btn" onClick={checkAll} disabled={loading}>
          刷新
        </button>
      </div>
      {loading ? (
        <div className="loading-state">检查中...</div>
      ) : (
        <div className="env-cards">
          {TOOLS.map((tool) => {
            const info = tools[tool] || {};
            return (
              <div key={tool} className={`env-card ${info.installed ? 'installed' : 'not-installed'}`}>
                <div className="card-icon">{getToolIcon(tool)}</div>
                <div className="card-content">
                  <h3 className="card-title">{tool.charAt(0).toUpperCase() + tool.slice(1)}</h3>
                  {info.installed ? (
                    <div className="card-status installed">
                      <span className="status-badge">已安装</span>
                      <span className="version-text">v{info.version}</span>
                    </div>
                  ) : (
                    <div className="card-status not-installed">
                      <span className="status-badge">未安装</span>
                    </div>
                  )}
                </div>
                {!info.installed && installableTools.includes(tool) && (
                  <button
                    className="card-install-btn"
                    onClick={() => installTool(tool)}
                    disabled={installing === tool}
                  >
                    {installing === tool ? '安装中...' : '一键安装'}
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
