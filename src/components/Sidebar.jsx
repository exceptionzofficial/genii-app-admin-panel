import {
    LayoutDashboard,
    Users,
    FileText,
    IndianRupee,
    ShoppingCart,
    Bell,
    Settings,
    BookOpen,
    LogOut,
    Star,
    HelpCircle
} from 'lucide-react';

const Sidebar = ({ isOpen, currentPage, onNavigate }) => {
    const mainNavItems = [
        { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
        { id: 'content', label: 'Content', icon: FileText },
        { id: 'mcqs', label: 'MCQs', icon: HelpCircle },
        { id: 'orders', label: 'Orders', icon: ShoppingCart },
        { id: 'users', label: 'Students', icon: Users },
        { id: 'reviews', label: 'Reviews', icon: Star },
    ];

    const systemNavItems = [
        { id: 'notifications', label: 'Notifications', icon: Bell },
        // { id: 'settings', label: 'Settings', icon: Settings }, // Commented out as per user request
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
                    {mainNavItems.map((item) => (
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
                    {systemNavItems.map((item) => (
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
