import { Menu, Bell, Search, User } from 'lucide-react';

const pageTitles = {
    dashboard: 'Dashboard',
    users: 'Students Management',
    content: 'Content Management',
    subscriptions: 'Subscriptions',
    notifications: 'Notifications',
    settings: 'Settings',
};

const Header = ({ onMenuToggle, currentPage }) => {
    return (
        <header className="header">
            <div className="header-left">
                <button className="menu-toggle" onClick={onMenuToggle}>
                    <Menu size={24} />
                </button>
                <h1 className="header-title">{pageTitles[currentPage] || 'Dashboard'}</h1>
            </div>

            <div className="header-right">
                <div className="search-box" style={{ position: 'relative', display: 'none' }}>
                    <Search size={18} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#7F8C8D' }} />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="form-input"
                        style={{ paddingLeft: 40, width: 250 }}
                    />
                </div>

                <button className="header-btn" style={{ position: 'relative' }}>
                    <Bell size={20} />
                    <span style={{
                        position: 'absolute',
                        top: 6,
                        right: 6,
                        width: 8,
                        height: 8,
                        background: '#E74C3C',
                        borderRadius: '50%',
                    }} />
                </button>

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    paddingLeft: 16,
                    borderLeft: '1px solid #E0E0E0'
                }}>
                    <div className="avatar">
                        <User size={18} />
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                        <span style={{ fontSize: 14, fontWeight: 600 }}>Admin</span>
                        <span style={{ fontSize: 11, color: '#7F8C8D' }}>Super Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
