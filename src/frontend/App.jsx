import { useState } from 'react';
import './i18n';
import Layout from './components/Layout';
import HomePage from './pages/HomePage';
import ApiConfigPage from './pages/ApiConfigPage';
import PromptsPage from './pages/PromptsPage';
import ConfigPage from './pages/ConfigPage';

const PAGES = {
  home: 'home',
  'api-config': 'api-config',
  prompts: 'prompts',
  config: 'config',
};

function App() {
  const [currentPage, setCurrentPage] = useState(PAGES.home);

  const renderPage = () => {
    switch (currentPage) {
      case PAGES.home:
        return <HomePage />;
      case PAGES['api-config']:
        return <ApiConfigPage />;
      case PAGES.prompts:
        return <PromptsPage />;
      case PAGES.config:
        return <ConfigPage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <Layout currentPage={currentPage} onPageChange={setCurrentPage}>
      {renderPage()}
    </Layout>
  );
}

export default App;
