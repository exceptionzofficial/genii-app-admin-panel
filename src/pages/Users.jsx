import { useState } from 'react';
import {
    Search,
    Edit2,
    Trash2,
    Eye,
    Filter,
    Download,
    FileText,
    Video,
    Crown
} from 'lucide-react';

const mockUsers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', whatsapp: '+91 9876543210', class: '12', board: 'state', pincode: '110001', subscription: { allPdfs: false, allVideos: false, purchasedItems: [1, 5] } },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', whatsapp: '+91 9876543211', class: 'neet', board: 'cbse', pincode: '400001', subscription: { allPdfs: true, allVideos: true, purchasedItems: [] } },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', whatsapp: '+91 9876543212', class: '11', board: 'state', pincode: '560001', subscription: { allPdfs: false, allVideos: false, purchasedItems: [] } },
    { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', whatsapp: '+91 9876543213', class: '10', board: 'cbse', pincode: '380001', subscription: { allPdfs: true, allVideos: false, purchasedItems: [3] } },
    { id: 5, name: 'Vikram Reddy', email: 'vikram@example.com', whatsapp: '+91 9876543214', class: '12', board: 'state', pincode: '500001', subscription: { allPdfs: false, allVideos: true, purchasedItems: [2, 4] } },
    { id: 6, name: 'Anjali Gupta', email: 'anjali@example.com', whatsapp: '+91 9876543215', class: 'neet', board: 'cbse', pincode: '302001', subscription: { allPdfs: false, allVideos: false, purchasedItems: [1] } },
];

const classLabels = {
    '10': 'Class 10',
    '11': 'Class 11',
    '12': 'Class 12',
    'neet': 'NEET'
};

const getSubscriptionType = (subscription) => {
    if (subscription.allPdfs && subscription.allVideos) {
        return { label: 'Complete Access', badge: 'warning', icon: Crown };
    } else if (subscription.allPdfs) {
        return { label: 'All PDFs', badge: 'error', icon: FileText };
    } else if (subscription.allVideos) {
        return { label: 'All Videos', badge: 'info', icon: Video };
    } else if (subscription.purchasedItems.length > 0) {
        return { label: `${subscription.purchasedItems.length} Items`, badge: 'primary', icon: null };
    }
    return { label: 'None', badge: 'secondary', icon: null };
};

const Users = () => {
    const [users] = useState(mockUsers);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterClass, setFilterClass] = useState('all');
    const [filterBoard, setFilterBoard] = useState('all');

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesClass = filterClass === 'all' || user.class === filterClass;
        const matchesBoard = filterBoard === 'all' || user.board === filterBoard;
        return matchesSearch && matchesClass && matchesBoard;
    });

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students Management</h1>
                    <p className="page-subtitle">Manage all registered students and their subscriptions</p>
                </div>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-box" style={{ flex: 1, minWidth: 250 }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search students by name or email..."
                            className="form-input"
                            style={{ paddingLeft: 40 }}
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Filter size={18} style={{ color: '#7F8C8D' }} />
                        <select
                            className="form-select"
                            style={{ width: 130 }}
                            value={filterBoard}
                            onChange={(e) => setFilterBoard(e.target.value)}
                        >
                            <option value="all">All Boards</option>
                            <option value="state">State Board</option>
                            <option value="cbse">CBSE</option>
                        </select>
                        <select
                            className="form-select"
                            style={{ width: 150 }}
                            value={filterClass}
                            onChange={(e) => setFilterClass(e.target.value)}
                        >
                            <option value="all">All Classes</option>
                            <option value="10">Class 10</option>
                            <option value="11">Class 11</option>
                            <option value="12">Class 12</option>
                            <option value="neet">NEET</option>
                        </select>
                    </div>

                    <button className="btn btn-secondary">
                        <Download size={18} />
                        Export
                    </button>
                </div>
            </div>

            {/* Users Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>WhatsApp</th>
                                <th>Class</th>
                                <th>Board</th>
                                <th>Subscription</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredUsers.map((user) => {
                                const subType = getSubscriptionType(user.subscription);
                                return (
                                    <tr key={user.id}>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                                <div className="avatar">{user.name.charAt(0)}</div>
                                                <div>
                                                    <div style={{ fontWeight: 500 }}>{user.name}</div>
                                                    <div style={{ fontSize: 12, color: '#7F8C8D' }}>{user.email}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 13 }}>{user.whatsapp}</td>
                                        <td><span className="badge primary">{classLabels[user.class]}</span></td>
                                        <td style={{ fontSize: 13 }}>
                                            {user.board === 'state' ? 'State Board' : 'CBSE'}
                                        </td>
                                        <td>
                                            <span className={`badge ${subType.badge}`} style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                                                {subType.icon && <subType.icon size={12} />}
                                                {subType.label}
                                            </span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', gap: 4 }}>
                                                <button className="action-btn" title="View">
                                                    <Eye size={16} />
                                                </button>
                                                <button className="action-btn" title="Edit">
                                                    <Edit2 size={16} />
                                                </button>
                                                <button className="action-btn danger" title="Delete">
                                                    <Trash2 size={16} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '16px 0',
                    borderTop: '1px solid #f0f0f0',
                    marginTop: 16
                }}>
                    <span style={{ fontSize: 13, color: '#7F8C8D' }}>
                        Showing {filteredUsers.length} of {users.length} students
                    </span>
                    <div style={{ display: 'flex', gap: 8 }}>
                        <button className="btn btn-secondary btn-sm" disabled>Previous</button>
                        <button className="btn btn-primary btn-sm">1</button>
                        <button className="btn btn-secondary btn-sm">2</button>
                        <button className="btn btn-secondary btn-sm">3</button>
                        <button className="btn btn-secondary btn-sm">Next</button>
                    </div>
                </div>
            </div>

        </div>
    );
};

export default Users;
