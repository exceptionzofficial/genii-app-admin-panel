import {
    LayoutDashboard,
    Users,
    FileText,
    CreditCard,
    Bell,
    BookOpen,
    LogOut
} from 'lucide-react';

const Sidebar = ({ isOpen, currentPage, onNavigate }) => {
    const navItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'users', label: 'Students', icon: Users },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'subscriptions', label: 'Subscriptions', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
    ];

    return (
        <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <BookOpen size={24} />
                </div>
                <div>
                    <div className="sidebar-title">Genii Books</div>
                    <div className="sidebar-subtitle">Admin Panel</div>
                </div>
            </div>

            <nav className="sidebar-nav">
                <div className="nav-section">
                    <div className="nav-section-title">Main Menu</div>
                    {navItems.slice(0, 4).map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="nav-section">
                    <div className="nav-section-title">System</div>
                    {navItems.slice(4).map((item) => (
                        <div
                            key={item.id}
                            className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                            onClick={() => onNavigate(item.id)}
                        >
                            <item.icon size={20} />
                            <span>{item.label}</span>
                        </div>
                    ))}
                </div>

                <div className="nav-section" style={{ marginTop: 'auto', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                    <div className="nav-item">
                        <LogOut size={20} />
                        <span>Logout</span>
                    </div>
                </div>
            </nav>
        </aside>
    );
};

export default Sidebar;
