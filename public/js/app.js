async function checkEnvironment() {
  const resultsDiv = document.getElementById('env-results');
  resultsDiv.innerHTML = '<div class="loading">检查中...</div>';

  try {
    const response = await fetch('/api/env/check');
    const data = await response.json();

    resultsDiv.innerHTML = '';

    Object.entries(data).forEach(([tool, info]) => {
      const item = document.createElement('div');
      item.className = `env-item ${info.installed ? 'installed' : 'not-installed'}`;

      const nameSpan = document.createElement('span');
      nameSpan.className = 'env-name';
      nameSpan.textContent = tool.charAt(0).toUpperCase() + tool.slice(1);

      const rightDiv = document.createElement('div');
      rightDiv.style.display = 'flex';
      rightDiv.style.alignItems = 'center';
      rightDiv.style.gap = '15px';

      if (info.installed) {
        const versionSpan = document.createElement('span');
        versionSpan.className = 'env-version';
        versionSpan.textContent = info.version;
        rightDiv.appendChild(versionSpan);
      } else if (tool === 'claude' || tool === 'pnpm') {
        const btn = document.createElement('button');
        btn.className = 'btn';
        btn.textContent = '一键安装';
        btn.onclick = () => installTool(tool);
        rightDiv.appendChild(btn);
      }

      item.appendChild(nameSpan);
      item.appendChild(rightDiv);
      resultsDiv.appendChild(item);
    });
  } catch (error) {
    resultsDiv.innerHTML = `<div class="error">检查失败: ${error.message}</div>`;
  }
}

async function installTool(tool) {
  try {
    const response = await fetch('/api/env/install', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ tool })
    });
    const data = await response.json();

    if (data.success) {
      alert(`${tool} 安装成功！`);
      checkEnvironment();
    } else {
      alert(`安装失败: ${data.message || data.error}`);
    }
  } catch (error) {
    alert(`安装失败: ${error.message}`);
  }
}

async function loadConfig() {
  const resultsDiv = document.getElementById('config-results');
  resultsDiv.innerHTML = '<div class="loading">加载配置...</div>';

  try {
    const response = await fetch('/api/config');
    const config = await response.json();

    resultsDiv.innerHTML = '';

    const item = document.createElement('div');
    item.className = 'env-item';

    const nameSpan = document.createElement('span');
    nameSpan.className = 'env-name';
    nameSpan.textContent = '跳过登录 (hasCompletedOnboarding)';

    const toggleDiv = document.createElement('div');
    toggleDiv.className = 'toggle-switch';

    const label = document.createElement('label');
    label.className = 'toggle-checkbox';

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = config.hasCompletedOnboarding === true;
    checkbox.onchange = () => toggleConfig('hasCompletedOnboarding');

    const slider = document.createElement('span');
    slider.className = 'toggle-slider';

    label.appendChild(checkbox);
    label.appendChild(slider);
    toggleDiv.appendChild(label);
    item.appendChild(nameSpan);
    item.appendChild(toggleDiv);
    resultsDiv.appendChild(item);

  } catch (error) {
    resultsDiv.innerHTML = `<div class="error">加载失败: ${error.message}</div>`;
  }
}

async function toggleConfig(key) {
  try {
    const response = await fetch(`/api/config/toggle/${key}`, {
      method: 'POST'
    });
    await response.json();
  } catch (error) {
    alert(`切换失败: ${error.message}`);
    loadConfig();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  checkEnvironment();
  loadConfig();
});
