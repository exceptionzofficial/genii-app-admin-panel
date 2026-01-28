import { useState, useEffect } from 'react';
import {
    Plus,
    Send,
    Bell,
    Users,
    Clock,
    CheckCircle,
    Loader2,
    X,
    AlertCircle
} from 'lucide-react';

const API_URL = 'https://genii-backend.vercel.app/api';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [formData, setFormData] = useState({
        title: '',
        message: '',
        targetBoard: 'all',
        targetClasses: []
    });

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/notifications`);
            const data = await response.json();
            if (data.success) {
                setNotifications(data.data);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNotifications();
    }, []);

    const toggleClass = (classId) => {
        const { targetClasses } = formData;
        if (targetClasses.includes(classId)) {
            setFormData({
                ...formData,
                targetClasses: targetClasses.filter(c => c !== classId)
            });
        } else {
            setFormData({
                ...formData,
                targetClasses: [...targetClasses, classId]
            });
        }
    };

    const handleSend = async () => {
        if (!formData.title || !formData.message || formData.targetClasses.length === 0) {
            alert('Please fill all fields and select at least one target class');
            return;
        }

        try {
            setSending(true);
            const response = await fetch(`${API_URL}/notifications`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });
            const data = await response.json();
            if (data.success) {
                setShowModal(false);
                setFormData({
                    title: '',
                    message: '',
                    targetBoard: 'all',
                    targetClasses: []
                });
                fetchNotifications();
            }
        } catch (error) {
            console.error('Error sending notification:', error);
            alert('Failed to send notification');
        } finally {
            setSending(false);
        }
    };

    const getClassBadges = (classes) => {
        if (!classes) return null;
        if (classes.includes('all')) {
            return <span className="badge primary">All Students</span>;
        }
        return classes.map(c => {
            const label = c === 'neet' ? 'NEET' : `Class ${c}`;
            return <span key={c} className="badge primary" style={{ marginRight: 4, marginBottom: 4 }}>{label}</span>;
        });
    };

    const getBoardLabel = (board) => {
        if (board === 'all') return 'All Boards';
        return board === 'state' ? 'State Board' : 'CBSE';
    };

    return (
        <div className="page-container">
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
                        <h3>{notifications.reduce((acc, n) => acc + (n.recipients || 0), 0)}</h3>
                        <p>Est. Recipients</p>
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

                {loading ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <Loader2 size={32} className="spin" />
                        <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading notifications...</p>
                    </div>
                ) : notifications.length === 0 ? (
                    <div style={{ padding: '60px', textAlign: 'center' }}>
                        <Bell size={48} style={{ color: 'var(--text-muted)', marginBottom: '16px' }} />
                        <h3>No notifications sent yet</h3>
                        <p style={{ color: 'var(--text-secondary)' }}>Start by sending your first targeted notification.</p>
                    </div>
                ) : (
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Notification Content</th>
                                    <th>Target Board</th>
                                    <th>Target Classes</th>
                                    <th>Sent At</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {notifications.map((notif) => (
                                    <tr key={notif.notificationId}>
                                        <td style={{ maxWidth: '300px' }}>
                                            <div>
                                                <div style={{ fontWeight: 600, marginBottom: 4 }}>{notif.title}</div>
                                                <div style={{ fontSize: 13, color: '#7F8C8D' }}>{notif.message}</div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge info">{getBoardLabel(notif.targetBoard)}</span>
                                        </td>
                                        <td>
                                            <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                                                {getClassBadges(notif.targetClasses)}
                                            </div>
                                        </td>
                                        <td style={{ fontSize: 13 }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <Clock size={14} style={{ color: '#7F8C8D' }} />
                                                {new Date(notif.createdAt).toLocaleString()}
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
                )}
            </div>

            {/* Send Notification Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => !sending && setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h3 className="modal-title">New Push Notification</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <X size={20} />
                            </button>
                        </div>

                        <div style={{ padding: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Notification Title</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="e.g. New Physics Course Live!"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Message</label>
                                <textarea
                                    className="form-input"
                                    rows={3}
                                    placeholder="Enter the notification message students will see..."
                                    style={{ resize: 'vertical' }}
                                    value={formData.message}
                                    onChange={e => setFormData({ ...formData, message: e.target.value })}
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
                                                border: `2px solid ${formData.targetBoard === option.id ? 'var(--primary)' : '#E0E0E0'}`,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                background: formData.targetBoard === option.id ? 'rgba(26,188,156,0.1)' : 'transparent'
                                            }}
                                        >
                                            <input
                                                type="radio"
                                                name="board"
                                                checked={formData.targetBoard === option.id}
                                                onChange={() => setFormData({ ...formData, targetBoard: option.id })}
                                                style={{ display: 'none' }}
                                            />
                                            {formData.targetBoard === option.id ? <CheckCircle size={16} /> : <div style={{ width: 16, height: 16, border: '2px solid #E0E0E0', borderRadius: '50%' }} />}
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
                                        { id: 'class10', label: 'Class 10' },
                                        { id: 'class11', label: 'Class 11' },
                                        { id: 'class12', label: 'Class 12' },
                                        { id: 'neet', label: 'NEET' },
                                    ].map(option => (
                                        <label
                                            key={option.id}
                                            style={{
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: 8,
                                                padding: '8px 16px',
                                                border: `2px solid ${formData.targetClasses.includes(option.id) ? 'var(--primary)' : '#E0E0E0'}`,
                                                borderRadius: 8,
                                                cursor: 'pointer',
                                                background: formData.targetClasses.includes(option.id) ? 'rgba(26,188,156,0.1)' : 'transparent'
                                            }}
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.targetClasses.includes(option.id)}
                                                onChange={() => toggleClass(option.id)}
                                                style={{ display: 'none' }}
                                            />
                                            {formData.targetClasses.includes(option.id) ? <CheckCircle size={16} /> : <div style={{ width: 16, height: 16, border: '2px solid #E0E0E0', borderRadius: 4 }} />}
                                            <span style={{ fontSize: 14 }}>{option.label}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)} disabled={sending}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSend} disabled={sending}>
                                {sending ? <Loader2 size={16} className="spin" /> : <Send size={16} />}
                                {sending ? 'Sending...' : 'Send Notification'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .spin { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            `}</style>
        </div>
    );
};

export default Notifications;
