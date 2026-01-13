import { useState } from 'react';
import {
    Search,
    Filter,
    Eye,
    ChevronDown,
    User,
    Mail,
    Phone,
    GraduationCap,
    School,
    MapPin,
    Calendar,
    FileText,
    Video,
    Crown,
    Truck
} from 'lucide-react';

// Mock users data
const mockUsers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 9876543210', class: 'class12', board: 'state', school: 'Government Higher Secondary School, Chennai', pincode: '600001', registeredAt: '2026-01-05', purchases: ['bundle', 'hardcopy'] },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', class: 'class11', board: 'cbse', school: 'Kendriya Vidyalaya, Coimbatore', pincode: '641001', registeredAt: '2026-01-06', purchases: ['pdfs'] },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', phone: '+91 9876543212', class: 'neet', board: null, school: 'NEET Coaching Academy', pincode: '625001', registeredAt: '2026-01-07', purchases: ['videos'] },
    { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 9876543213', class: 'class10', board: 'state', school: 'St. Mary\'s School, Salem', pincode: '636001', registeredAt: '2026-01-08', purchases: ['bundle'] },
    { id: 5, name: 'Vikram Reddy', email: 'vikram@example.com', phone: '+91 9876543214', class: 'class12', board: 'cbse', school: 'Delhi Public School, Madurai', pincode: '625002', registeredAt: '2026-01-09', purchases: [] },
    { id: 6, name: 'Anita Gupta', email: 'anita@example.com', phone: '+91 9876543215', class: 'class11', board: 'state', school: 'Government Girls School, Chennai', pincode: '600002', registeredAt: '2026-01-10', purchases: ['hardcopy'] },
];

const classOptions = [
    { id: 'all', name: 'All Classes' },
    { id: 'class10', name: 'Class 10' },
    { id: 'class11', name: 'Class 11' },
    { id: 'class12', name: 'Class 12' },
    { id: 'neet', name: 'NEET' },
];

const boardOptions = [
    { id: 'all', name: 'All Boards' },
    { id: 'state', name: 'State Board' },
    { id: 'cbse', name: 'CBSE' },
];

function Users() {
    const [users] = useState(mockUsers);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [selectedUser, setSelectedUser] = useState(null);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.phone.includes(searchTerm);
        const matchesClass = classFilter === 'all' || user.class === classFilter;
        const matchesBoard = boardFilter === 'all' || user.board === boardFilter || (user.class === 'neet' && boardFilter === 'all');
        return matchesSearch && matchesClass && matchesBoard;
    });

    const getClassName = (classId) => {
        const cls = classOptions.find(c => c.id === classId);
        return cls ? cls.name : classId;
    };

    const getBoardName = (boardId) => {
        if (!boardId) return 'N/A';
        const board = boardOptions.find(b => b.id === boardId);
        return board ? board.name : boardId;
    };

    const getPurchaseBadge = (purchase) => {
        switch (purchase) {
            case 'pdfs':
                return <span className="purchase-badge pdf"><FileText size={12} /> PDFs</span>;
            case 'videos':
                return <span className="purchase-badge video"><Video size={12} /> Videos</span>;
            case 'bundle':
                return <span className="purchase-badge bundle"><Crown size={12} /> Bundle</span>;
            case 'hardcopy':
                return <span className="purchase-badge hardcopy"><Truck size={12} /> Hard Copy</span>;
            default:
                return null;
        }
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Students Management</h1>
                    <p className="page-subtitle">View and manage registered students</p>
                </div>
                <div className="header-stats">
                    <span className="total-count">{users.length} Total Students</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or phone..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown">
                    <GraduationCap size={16} />
                    <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                        {classOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
                <div className="filter-dropdown">
                    <Filter size={16} />
                    <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
                        {boardOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
            </div>

            {/* Users Table */}
            <div className="users-table-container">
                <table className="users-table">
                    <thead>
                        <tr>
                            <th>Student</th>
                            <th>Class & Board</th>
                            <th>School</th>
                            <th>Purchases</th>
                            <th>Registered</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.map(user => (
                            <tr key={user.id}>
                                <td>
                                    <div className="user-info">
                                        <div className="user-avatar">
                                            <User size={20} />
                                        </div>
                                        <div className="user-details">
                                            <span className="user-name">{user.name}</span>
                                            <span className="user-contact">
                                                <Mail size={12} /> {user.email}
                                            </span>
                                            <span className="user-contact">
                                                <Phone size={12} /> {user.phone}
                                            </span>
                                        </div>
                                    </div>
                                </td>
                                <td>
                                    <div className="class-board-info">
                                        <span className="class-badge">{getClassName(user.class)}</span>
                                        {user.board && (
                                            <span className={`board-badge ${user.board}`}>{getBoardName(user.board)}</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <div className="school-info">
                                        <School size={14} />
                                        <span>{user.school}</span>
                                        <span className="pincode">
                                            <MapPin size={10} /> {user.pincode}
                                        </span>
                                    </div>
                                </td>
                                <td>
                                    <div className="purchases-list">
                                        {user.purchases.length > 0 ? (
                                            user.purchases.map(p => getPurchaseBadge(p))
                                        ) : (
                                            <span className="no-purchases">No purchases</span>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    <span className="date">
                                        <Calendar size={12} />
                                        {new Date(user.registeredAt).toLocaleDateString()}
                                    </span>
                                </td>
                                <td>
                                    <button className="btn-view" onClick={() => setSelectedUser(user)}>
                                        <Eye size={14} />
                                        View
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* User Detail Modal */}
            {selectedUser && (
                <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
                    <div className="modal-content user-modal" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <div className="modal-user-avatar">
                                <User size={32} />
                            </div>
                            <div>
                                <h3>{selectedUser.name}</h3>
                                <p>Registered on {new Date(selectedUser.registeredAt).toLocaleDateString()}</p>
                            </div>
                        </div>

                        <div className="modal-body">
                            <div className="detail-row">
                                <Mail size={16} />
                                <span>{selectedUser.email}</span>
                            </div>
                            <div className="detail-row">
                                <Phone size={16} />
                                <span>{selectedUser.phone}</span>
                            </div>
                            <div className="detail-row">
                                <GraduationCap size={16} />
                                <span>{getClassName(selectedUser.class)} {selectedUser.board && `• ${getBoardName(selectedUser.board)}`}</span>
                            </div>
                            <div className="detail-row">
                                <School size={16} />
                                <span>{selectedUser.school}</span>
                            </div>
                            <div className="detail-row">
                                <MapPin size={16} />
                                <span>Pincode: {selectedUser.pincode}</span>
                            </div>

                            <div className="purchases-section">
                                <h4>Purchases</h4>
                                <div className="purchases-grid">
                                    {selectedUser.purchases.length > 0 ? (
                                        selectedUser.purchases.map(p => getPurchaseBadge(p))
                                    ) : (
                                        <span className="no-purchases">No purchases yet</span>
                                    )}
                                </div>
                            </div>
                        </div>

                        <button className="btn-close" onClick={() => setSelectedUser(null)}>Close</button>
                    </div>
                </div>
            )}

            <style>{`
                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .header-stats {
                    display: flex;
                    gap: 12px;
                }

                .total-count {
                    padding: 8px 16px;
                    background: rgba(26, 188, 156, 0.1);
                    color: #1abc9c;
                    font-weight: 600;
                    font-size: 14px;
                    border-radius: 8px;
                }

                .filters-bar {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                    flex-wrap: wrap;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    min-width: 280px;
                    background: white;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1px solid #ecf0f1;
                }

                .search-box input {
                    flex: 1;
                    border: none;
                    outline: none;
                    font-size: 14px;
                }

                .search-box svg {
                    color: #bdc3c7;
                }

                .filter-dropdown {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    background: white;
                    padding: 10px 16px;
                    border-radius: 10px;
                    border: 1px solid #ecf0f1;
                    position: relative;
                }

                .filter-dropdown select {
                    appearance: none;
                    border: none;
                    outline: none;
                    font-size: 14px;
                    padding-right: 20px;
                    cursor: pointer;
                    background: transparent;
                }

                .dropdown-icon {
                    position: absolute;
                    right: 12px;
                    pointer-events: none;
                    color: #bdc3c7;
                }

                .users-table-container {
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .users-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .users-table th {
                    text-align: left;
                    padding: 16px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7f8c8d;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: #f8f9fa;
                    border-bottom: 1px solid #ecf0f1;
                }

                .users-table td {
                    padding: 16px;
                    font-size: 14px;
                    color: #2c3e50;
                    border-bottom: 1px solid #f5f5f5;
                    vertical-align: top;
                }

                .user-info {
                    display: flex;
                    gap: 12px;
                }

                .user-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 44px;
                    height: 44px;
                    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
                    color: white;
                    border-radius: 12px;
                }

                .user-details {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .user-name {
                    font-weight: 600;
                    color: #2c3e50;
                }

                .user-contact {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .class-board-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .class-badge {
                    display: inline-block;
                    padding: 4px 10px;
                    background: #3498db;
                    color: white;
                    font-size: 12px;
                    font-weight: 600;
                    border-radius: 6px;
                }

                .board-badge {
                    display: inline-block;
                    padding: 3px 8px;
                    font-size: 11px;
                    font-weight: 600;
                    border-radius: 4px;
                }

                .board-badge.state {
                    background: rgba(26, 188, 156, 0.1);
                    color: #1abc9c;
                }

                .board-badge.cbse {
                    background: rgba(155, 89, 182, 0.1);
                    color: #9b59b6;
                }

                .school-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                    font-size: 13px;
                    color: #7f8c8d;
                }

                .school-info svg {
                    color: #95a5a6;
                }

                .pincode {
                    display: flex;
                    align-items: center;
                    gap: 2px;
                    font-size: 11px;
                    color: #95a5a6;
                }

                .purchases-list {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                }

                .purchase-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 8px;
                    font-size: 11px;
                    font-weight: 600;
                    border-radius: 6px;
                }

                .purchase-badge.pdf {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .purchase-badge.video {
                    background: rgba(155, 89, 182, 0.1);
                    color: #9b59b6;
                }

                .purchase-badge.bundle {
                    background: rgba(241, 196, 15, 0.1);
                    color: #f39c12;
                }

                .purchase-badge.hardcopy {
                    background: rgba(52, 152, 219, 0.1);
                    color: #3498db;
                }

                .no-purchases {
                    font-size: 12px;
                    color: #bdc3c7;
                    font-style: italic;
                }

                .date {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                    color: #7f8c8d;
                }

                .btn-view {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 6px 12px;
                    background: #ecf0f1;
                    border: none;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7f8c8d;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-view:hover {
                    background: #1abc9c;
                    color: white;
                }

                /* Modal */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0,0,0,0.5);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                }

                .modal-content.user-modal {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 480px;
                    margin: 20px;
                }

                .modal-header {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin-bottom: 24px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #ecf0f1;
                }

                .modal-user-avatar {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
                    color: white;
                    border-radius: 16px;
                }

                .modal-header h3 {
                    margin: 0;
                    font-size: 18px;
                    color: #2c3e50;
                }

                .modal-header p {
                    margin: 4px 0 0;
                    font-size: 13px;
                    color: #7f8c8d;
                }

                .modal-body {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .detail-row {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 10px 12px;
                    background: #f8f9fa;
                    border-radius: 8px;
                    font-size: 14px;
                    color: #2c3e50;
                }

                .detail-row svg {
                    color: #1abc9c;
                }

                .purchases-section {
                    margin-top: 16px;
                    padding-top: 16px;
                    border-top: 1px solid #ecf0f1;
                }

                .purchases-section h4 {
                    margin: 0 0 12px;
                    font-size: 14px;
                    color: #7f8c8d;
                }

                .purchases-grid {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 8px;
                }

                .btn-close {
                    width: 100%;
                    margin-top: 20px;
                    padding: 12px;
                    background: #ecf0f1;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #7f8c8d;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-close:hover {
                    background: #2c3e50;
                    color: white;
                }

                @media (max-width: 768px) {
                    .users-table th:nth-child(3),
                    .users-table td:nth-child(3),
                    .users-table th:nth-child(5),
                    .users-table td:nth-child(5) {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default Users;
