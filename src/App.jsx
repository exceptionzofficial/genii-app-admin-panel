import { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Content from './pages/Content';
import Orders from './pages/Orders';
import Notifications from './pages/Notifications';
import Settings from './pages/Settings';
import Reviews from './pages/Reviews';
import './App.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState('dashboard');

  const toggleSidebar = () => setSidebarOpen(!sidebarOpen);
  const closeSidebar = () => setSidebarOpen(false);

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'users':
        return <Users />;
      case 'content':
        return <Content />;

      case 'orders':
        return <Orders />;
      case 'notifications':
        return <Notifications />;
      case 'reviews':
        return <Reviews />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="admin-layout">
      <div
        className={`sidebar-overlay ${sidebarOpen ? 'visible' : ''}`}
        onClick={closeSidebar}
      />
      <Sidebar
        isOpen={sidebarOpen}
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          closeSidebar();
        }}
      />
      <Header onMenuToggle={toggleSidebar} currentPage={currentPage} />
      <main className="main-content">
        {renderPage()}
      </main>
    </div>
  );
}

export default App;
