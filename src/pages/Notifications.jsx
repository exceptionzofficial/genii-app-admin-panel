import { useState } from 'react';
import {
    Plus,
    Send,
    Bell,
    Users,
    Clock,
    CheckCircle
} from 'lucide-react';

const mockNotifications = [
    { id: 1, title: 'New Physics Material Available', message: 'Check out the new Laws of Motion notes for State Board!', targetClass: ['12', 'neet'], targetBoard: 'state', sentAt: '2026-01-05 10:30', status: 'sent', recipients: 420 },
    { id: 2, title: 'CBSE Exam Preparation Tips', message: 'Important tips for your upcoming CBSE board exams.', targetClass: ['10', '12'], targetBoard: 'cbse', sentAt: '2026-01-04 14:00', status: 'sent', recipients: 380 },
    { id: 3, title: 'Chemistry Video Series', message: 'New organic chemistry video series is live!', targetClass: ['12', 'neet'], targetBoard: 'all', sentAt: '2026-01-03 09:00', status: 'sent', recipients: 810 },
    { id: 4, title: 'App Update Available', message: 'Update to the latest version for new features.', targetClass: ['all'], targetBoard: 'all', sentAt: '2026-01-02 16:00', status: 'sent', recipients: 1220 },
];

const Notifications = () => {
    const [notifications] = useState(mockNotifications);
    const [showModal, setShowModal] = useState(false);
    const [selectedClasses, setSelectedClasses] = useState([]);
    const [selectedBoard, setSelectedBoard] = useState('all');

    const toggleClass = (classId) => {
        if (selectedClasses.includes(classId)) {
            setSelectedClasses(selectedClasses.filter(c => c !== classId));
        } else {
            setSelectedClasses([...selectedClasses, classId]);
        }
    };

    const getClassBadges = (classes) => {
        if (classes.includes('all')) {
            return <span className="badge primary">All Students</span>;
        }
        return classes.map(c => {
            const label = c === 'neet' ? 'NEET' : `Class ${c}`;
            return <span key={c} className="badge primary" style={{ marginRight: 4 }}>{label}</span>;
        });
    };

    const getBoardLabel = (board) => {
        if (board === 'all') return 'All Boards';
        return board === 'state' ? 'State Board' : 'CBSE';
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Push Notifications</h1>
                    <p className="page-subtitle">Send targeted notifications to students</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Plus size={18} />
                    Send Notification
                </button>
            </div>

            {/* Stats */}
            <div className="stat-grid" style={{ marginBottom: 24 }}>
                <div className="stat-card">
                    <div className="stat-icon primary">
                        <Bell size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>{notifications.length}</h3>
                        <p>Total Sent</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon success">
                        <Users size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>1,220</h3>
                        <p>Total Recipients</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon info">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>98%</h3>
                        <p>Delivery Rate</p>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon warning">
                        <Clock size={24} />
                    </div>
                    <div className="stat-info">
                        <h3>0</h3>
                        <p>Scheduled</p>
                    </div>
                </div>
            </div>

            {/* Notifications List */}
            <div className="card">
                <div className="card-header">
                    <h3 className="card-title">Recent Notifications</h3>
                </div>

                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Notification</th>
                                <th>Board</th>
                                <th>Target Classes</th>
                                <th>Recipients</th>
                                <th>Sent At</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {notifications.map((notif) => (
                                <tr key={notif.id}>
                                    <td>
                                        <div>
                                            <div style={{ fontWeight: 500, marginBottom: 4 }}>{notif.title}</div>
                                            <div style={{ fontSize: 12, color: '#7F8C8D' }}>{notif.message}</div>
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>{getBoardLabel(notif.targetBoard)}</td>
                                    <td>{getClassBadges(notif.targetClass)}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Users size={14} style={{ color: '#7F8C8D' }} />
                                            {notif.recipients.toLocaleString()}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Clock size={14} style={{ color: '#7F8C8D' }} />
                                            {notif.sentAt}
                                        </div>
                                    </td>
                                    <td>
                                        <span className="badge success">
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <CheckCircle size={14} />
                                                Sent
                                            </span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Send Notification Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 550 }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Send Push Notification</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Notification Title</label>
                            <input type="text" className="form-input" placeholder="Enter notification title" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Message</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                placeholder="Enter notification message..."
                                style={{ resize: 'vertical' }}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Board</label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {[
                                    { id: 'all', label: 'All Boards' },
                                    { id: 'state', label: 'State Board' },
                                    { id: 'cbse', label: 'CBSE' },
                                ].map(option => (
                                    <label
                                        key={option.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 16px',
                                            border: `2px solid ${selectedBoard === option.id ? '#1ABC9C' : '#E0E0E0'}`,
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            background: selectedBoard === option.id ? 'rgba(26,188,156,0.1)' : 'transparent'
                                        }}
                                    >
                                        <input
                                            type="radio"
                                            name="board"
                                            checked={selectedBoard === option.id}
                                            onChange={() => setSelectedBoard(option.id)}
                                            style={{ display: 'none' }}
                                        />
                                        {selectedBoard === option.id ? (
                                            <CheckCircle size={16} style={{ color: '#1ABC9C' }} />
                                        ) : (
                                            <div style={{ width: 16, height: 16, border: '2px solid #E0E0E0', borderRadius: '50%' }} />
                                        )}
                                        <span style={{ fontSize: 14 }}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Classes</label>
                            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                                {[
                                    { id: 'all', label: 'All Students' },
                                    { id: '10', label: 'Class 10' },
                                    { id: '11', label: 'Class 11' },
                                    { id: '12', label: 'Class 12' },
                                    { id: 'neet', label: 'NEET' },
                                ].map(option => (
                                    <label
                                        key={option.id}
                                        style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: 8,
                                            padding: '8px 16px',
                                            border: `2px solid ${selectedClasses.includes(option.id) ? '#1ABC9C' : '#E0E0E0'}`,
                                            borderRadius: 8,
                                            cursor: 'pointer',
                                            background: selectedClasses.includes(option.id) ? 'rgba(26,188,156,0.1)' : 'transparent'
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={selectedClasses.includes(option.id)}
                                            onChange={() => toggleClass(option.id)}
                                            style={{ display: 'none' }}
                                        />
                                        {selectedClasses.includes(option.id) ? (
                                            <CheckCircle size={16} style={{ color: '#1ABC9C' }} />
                                        ) : (
                                            <div style={{ width: 16, height: 16, border: '2px solid #E0E0E0', borderRadius: 4 }} />
                                        )}
                                        <span style={{ fontSize: 14 }}>{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary">
                                <Send size={16} />
                                Send Now
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Notifications;
