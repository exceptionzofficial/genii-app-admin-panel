import { useState } from 'react';
import {
    Search,
    Edit2,
    XCircle,
    Filter,
    Download,
    FileText,
    Video,
    Crown,
    Calendar,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const mockSubscriptions = [
    { id: 1, user: 'Rahul Kumar', email: 'rahul@example.com', class: '12', plan: 'Complete Access', planType: 'all_content', amount: 1999, startDate: '2026-01-15', expiryDate: '2027-01-15', status: 'active' },
    { id: 2, user: 'Priya Sharma', email: 'priya@example.com', class: 'neet', plan: 'All PDFs', planType: 'all_pdfs', amount: 999, startDate: '2025-12-20', expiryDate: '2026-12-20', status: 'active' },
    { id: 3, user: 'Amit Singh', email: 'amit@example.com', class: '11', plan: 'All Videos', planType: 'all_videos', amount: 1499, startDate: '2025-06-01', expiryDate: '2026-06-01', status: 'expired' },
    { id: 4, user: 'Sneha Patel', email: 'sneha@example.com', class: '10', plan: 'Complete Access', planType: 'all_content', amount: 1999, startDate: '2025-11-30', expiryDate: '2026-11-30', status: 'active' },
    { id: 5, user: 'Vikram Reddy', email: 'vikram@example.com', class: '12', plan: 'All PDFs', planType: 'all_pdfs', amount: 999, startDate: '2026-02-28', expiryDate: '2027-02-28', status: 'active' },
    { id: 6, user: 'Anjali Gupta', email: 'anjali@example.com', class: 'neet', plan: 'All Videos', planType: 'all_videos', amount: 1499, startDate: '2025-03-15', expiryDate: '2026-03-15', status: 'cancelled' },
];

const plans = [
    { id: 'all_pdfs', name: 'All PDFs Access', price: 999, subscribers: 320, icon: FileText, color: '#E74C3C' },
    { id: 'all_videos', name: 'All Videos Access', price: 1499, subscribers: 280, icon: Video, color: '#3498DB' },
    { id: 'all_content', name: 'Complete Access', price: 1999, subscribers: 450, icon: Crown, color: '#F39C12', popular: true },
];

const Subscriptions = () => {
    const [subscriptions] = useState(mockSubscriptions);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState('all');
    const [filterPlan, setFilterPlan] = useState('all');
    const [showTerminateModal, setShowTerminateModal] = useState(false);
    const [selectedSub, setSelectedSub] = useState(null);

    const filteredSubs = subscriptions.filter(sub => {
        const matchesSearch = sub.user.toLowerCase().includes(searchQuery.toLowerCase()) ||
            sub.email.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesStatus = filterStatus === 'all' || sub.status === filterStatus;
        const matchesPlan = filterPlan === 'all' || sub.planType === filterPlan;
        return matchesSearch && matchesStatus && matchesPlan;
    });

    const getStatusIcon = (status) => {
        switch (status) {
            case 'active': return <CheckCircle size={16} />;
            case 'expired': return <AlertCircle size={16} />;
            case 'cancelled': return <XCircle size={16} />;
            default: return null;
        }
    };

    const getPlanIcon = (planType) => {
        switch (planType) {
            case 'all_pdfs': return <FileText size={14} />;
            case 'all_videos': return <Video size={14} />;
            case 'all_content': return <Crown size={14} />;
            default: return null;
        }
    };

    const getPlanBadge = (planType) => {
        switch (planType) {
            case 'all_pdfs': return 'error';
            case 'all_videos': return 'info';
            case 'all_content': return 'warning';
            default: return 'primary';
        }
    };

    const handleTerminate = (sub) => {
        setSelectedSub(sub);
        setShowTerminateModal(true);
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Subscriptions</h1>
                    <p className="page-subtitle">Manage student subscriptions and plans</p>
                </div>
                <button className="btn btn-secondary">
                    <Download size={18} />
                    Export Report
                </button>
            </div>

            {/* Plans Overview */}
            <div className="stat-grid" style={{ marginBottom: 24 }}>
                {plans.map((plan) => (
                    <div key={plan.id} className="stat-card" style={{ position: 'relative' }}>
                        {plan.popular && (
                            <div style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: plan.color,
                                color: '#fff',
                                fontSize: 10,
                                fontWeight: 600,
                                padding: '2px 8px',
                                borderRadius: 4
                            }}>
                                POPULAR
                            </div>
                        )}
                        <div style={{
                            width: 48,
                            height: 48,
                            borderRadius: 12,
                            background: `${plan.color}15`,
                            color: plan.color,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}>
                            <plan.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{plan.subscribers}</h3>
                            <p>{plan.name}</p>
                            <div style={{ marginTop: 8, fontWeight: 600, color: '#1ABC9C' }}>
                                ₹{plan.price.toLocaleString()} / year
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-box" style={{ flex: 1, minWidth: 250 }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search by student name or email..."
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
                            style={{ width: 160 }}
                            value={filterPlan}
                            onChange={(e) => setFilterPlan(e.target.value)}
                        >
                            <option value="all">All Plans</option>
                            <option value="all_pdfs">All PDFs</option>
                            <option value="all_videos">All Videos</option>
                            <option value="all_content">Complete Access</option>
                        </select>
                        <select
                            className="form-select"
                            style={{ width: 130 }}
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="all">All Status</option>
                            <option value="active">Active</option>
                            <option value="expired">Expired</option>
                            <option value="cancelled">Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Subscriptions Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Student</th>
                                <th>Plan</th>
                                <th>Amount</th>
                                <th>Start Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredSubs.map((sub) => (
                                <tr key={sub.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div className="avatar">{sub.user.charAt(0)}</div>
                                            <div>
                                                <div style={{ fontWeight: 500 }}>{sub.user}</div>
                                                <div style={{ fontSize: 12, color: '#7F8C8D' }}>{sub.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${getPlanBadge(sub.planType)}`} style={{ display: 'flex', alignItems: 'center', gap: 4, width: 'fit-content' }}>
                                            {getPlanIcon(sub.planType)}
                                            {sub.plan}
                                        </span>
                                    </td>
                                    <td style={{ fontWeight: 500 }}>₹{sub.amount.toLocaleString()}</td>
                                    <td style={{ fontSize: 13 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={14} style={{ color: '#7F8C8D' }} />
                                            {sub.startDate}
                                        </div>
                                    </td>
                                    <td style={{ fontSize: 13 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Calendar size={14} style={{ color: '#7F8C8D' }} />
                                            {sub.expiryDate}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${sub.status === 'active' ? 'success' : sub.status === 'expired' ? 'warning' : 'error'}`}>
                                            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                {getStatusIcon(sub.status)}
                                                {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                                            </span>
                                        </span>
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', gap: 4 }}>
                                            <button className="action-btn" title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            {sub.status === 'active' && (
                                                <button
                                                    className="action-btn danger"
                                                    title="Terminate"
                                                    onClick={() => handleTerminate(sub)}
                                                >
                                                    <XCircle size={16} />
                                                </button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Terminate Modal */}
            {showTerminateModal && selectedSub && (
                <div className="modal-overlay" onClick={() => setShowTerminateModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">Terminate Subscription</h3>
                            <button className="modal-close" onClick={() => setShowTerminateModal(false)}>
                                <XCircle size={16} />
                            </button>
                        </div>

                        <div style={{ textAlign: 'center', padding: '20px 0' }}>
                            <div style={{
                                width: 60,
                                height: 60,
                                borderRadius: '50%',
                                background: 'rgba(231,76,60,0.1)',
                                color: '#E74C3C',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                margin: '0 auto 16px'
                            }}>
                                <AlertCircle size={32} />
                            </div>
                            <h4 style={{ marginBottom: 8 }}>Are you sure?</h4>
                            <p style={{ fontSize: 14, color: '#7F8C8D' }}>
                                This will terminate the <strong>{selectedSub.plan}</strong> subscription for <strong>{selectedSub.user}</strong>.
                                <br />This action cannot be undone.
                            </p>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowTerminateModal(false)}>Cancel</button>
                            <button className="btn btn-danger">Terminate Subscription</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Subscriptions;
