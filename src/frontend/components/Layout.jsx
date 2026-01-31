import { useTranslation } from 'react-i18next';
import './Layout.css';

const MENU_ITEMS = [
  { id: 'home', labelKey: 'nav.home', icon: '🏠' },
  { id: 'api-config', labelKey: 'nav.apiConfig', icon: '🔑' },
  { id: 'prompts', labelKey: 'nav.prompts', icon: '💬' },
  { id: 'config', labelKey: 'nav.config', icon: '📝' },
];

export default function Layout({ currentPage, onPageChange, children }) {
  const { t, i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'zh' ? 'en' : 'zh';
    i18n.changeLanguage(newLang);
    localStorage.setItem('language', newLang);
  };

  return (
    <div className="layout">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1>{t('app.title')}</h1>
          <button className="lang-switch" onClick={toggleLanguage} title={i18n.language === 'zh' ? 'Switch to English' : '切换到中文'}>
            {i18n.language === 'zh' ? '🇺🇸' : '🇨🇳'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {MENU_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
              onClick={() => onPageChange(item.id)}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{t(item.labelKey)}</span>
            </button>
          ))}
        </nav>
      </aside>
      <main className="main-content">
        {children}
      </main>
    </div>
  );
}
