import { useState } from 'react';
import {
    Search,
    Filter,
    FileText,
    Video,
    Crown,
    Truck,
    Package,
    Clock,
    CheckCircle,
    XCircle,
    MapPin,
    Phone,
    Edit2,
    Eye,
    ChevronDown
} from 'lucide-react';

// Mock digital orders data
const mockDigitalOrders = [
    { id: 'ORD001', user: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 9876543210', class: 'Class 12', package: 'Complete Bundle', amount: 4500, date: '2026-01-10', status: 'completed', paymentId: 'pay_ABC123' },
    { id: 'ORD002', user: 'Priya Sharma', email: 'priya@example.com', phone: '+91 9876543211', class: 'Class 11', package: 'All PDFs', amount: 1800, date: '2026-01-09', status: 'completed', paymentId: 'pay_DEF456' },
    { id: 'ORD003', user: 'Amit Singh', email: 'amit@example.com', phone: '+91 9876543212', class: 'NEET', package: 'All Videos', amount: 3500, date: '2026-01-08', status: 'completed', paymentId: 'pay_GHI789' },
    { id: 'ORD004', user: 'Sneha Patel', email: 'sneha@example.com', phone: '+91 9876543213', class: 'Class 10', package: 'Complete Bundle', amount: 3000, date: '2026-01-07', status: 'completed', paymentId: 'pay_JKL012' },
    { id: 'ORD005', user: 'Vikram Reddy', email: 'vikram@example.com', phone: '+91 9876543214', class: 'Class 12', package: 'All PDFs', amount: 2000, date: '2026-01-06', status: 'refunded', paymentId: 'pay_MNO345' },
];

// Mock hard copy orders data
const mockHardCopyOrders = [
    { id: 'HC001', user: 'Rahul Kumar', email: 'rahul@example.com', phone: '+91 9876543210', class: 'Class 12', amount: 3600, date: '2026-01-08', status: 'delivered', address: '123, Gandhi Nagar, Chennai - 600001', trackingId: 'TRK123456789' },
    { id: 'HC002', user: 'Anita Gupta', email: 'anita@example.com', phone: '+91 9876543215', class: 'Class 11', amount: 3100, date: '2026-01-09', status: 'shipped', address: '456, Nehru Street, Coimbatore - 641001', trackingId: 'TRK987654321' },
    { id: 'HC003', user: 'Suresh Menon', email: 'suresh@example.com', phone: '+91 9876543216', class: 'NEET', amount: 4100, date: '2026-01-10', status: 'processing', address: '789, Anna Salai, Madurai - 625001', trackingId: null },
    { id: 'HC004', user: 'Kavitha Iyer', email: 'kavitha@example.com', phone: '+91 9876543217', class: 'Class 10', amount: 2600, date: '2026-01-07', status: 'processing', address: '321, MG Road, Salem - 636001', trackingId: null },
];

function Orders() {
    const [activeTab, setActiveTab] = useState('digital');
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [digitalOrders, setDigitalOrders] = useState(mockDigitalOrders);
    const [hardCopyOrders, setHardCopyOrders] = useState(mockHardCopyOrders);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [newStatus, setNewStatus] = useState('');
    const [trackingId, setTrackingId] = useState('');

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return <CheckCircle size={14} />;
            case 'processing':
                return <Clock size={14} />;
            case 'shipped':
                return <Truck size={14} />;
            case 'refunded':
            case 'cancelled':
                return <XCircle size={14} />;
            default:
                return <Package size={14} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered':
                return 'status-success';
            case 'processing':
                return 'status-warning';
            case 'shipped':
                return 'status-info';
            case 'refunded':
            case 'cancelled':
                return 'status-error';
            default:
                return '';
        }
    };

    const getPackageIcon = (pkg) => {
        if (pkg.includes('Bundle')) return <Crown size={16} className="icon-bundle" />;
        if (pkg.includes('Video')) return <Video size={16} className="icon-video" />;
        return <FileText size={16} className="icon-pdf" />;
    };

    const openStatusModal = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.status);
        setTrackingId(order.trackingId || '');
        setShowStatusModal(true);
    };

    const handleStatusUpdate = () => {
        if (activeTab === 'hardcopy') {
            setHardCopyOrders(prev => prev.map(order =>
                order.id === selectedOrder.id
                    ? { ...order, status: newStatus, trackingId: trackingId || order.trackingId }
                    : order
            ));
        }
        setShowStatusModal(false);
        setSelectedOrder(null);
    };

    const filteredDigitalOrders = digitalOrders.filter(order => {
        const matchesSearch = order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    const filteredHardCopyOrders = hardCopyOrders.filter(order => {
        const matchesSearch = order.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            order.id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
        return matchesSearch && matchesStatus;
    });

    // Calculate stats
    const totalDigitalRevenue = digitalOrders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.amount, 0);
    const totalHardCopyRevenue = hardCopyOrders.filter(o => o.status !== 'cancelled').reduce((sum, o) => sum + o.amount, 0);
    const pendingHardCopy = hardCopyOrders.filter(o => o.status === 'processing').length;

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Orders Management</h1>
                    <p className="page-subtitle">Track and manage all customer orders</p>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="orders-stats">
                <div className="stat-card">
                    <div className="stat-icon digital">
                        <Crown size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">₹{totalDigitalRevenue.toLocaleString()}</span>
                        <span className="stat-label">Digital Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon hardcopy">
                        <Truck size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">₹{totalHardCopyRevenue.toLocaleString()}</span>
                        <span className="stat-label">Hard Copy Revenue</span>
                    </div>
                </div>
                <div className="stat-card">
                    <div className="stat-icon pending">
                        <Clock size={20} />
                    </div>
                    <div className="stat-info">
                        <span className="stat-value">{pendingHardCopy}</span>
                        <span className="stat-label">Pending Shipments</span>
                    </div>
                </div>
            </div>

            {/* Tabs */}
            <div className="orders-tabs">
                <button
                    className={`tab-btn ${activeTab === 'digital' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('digital'); setStatusFilter('all'); }}
                >
                    <FileText size={18} />
                    <span>Digital Orders</span>
                    <span className="tab-count">{digitalOrders.length}</span>
                </button>
                <button
                    className={`tab-btn ${activeTab === 'hardcopy' ? 'active' : ''}`}
                    onClick={() => { setActiveTab('hardcopy'); setStatusFilter('all'); }}
                >
                    <Truck size={18} />
                    <span>Hard Copy Orders</span>
                    <span className="tab-count">{hardCopyOrders.length}</span>
                </button>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search by name, email, or order ID..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown">
                    <Filter size={16} />
                    <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        <option value="all">All Status</option>
                        {activeTab === 'digital' ? (
                            <>
                                <option value="completed">Completed</option>
                                <option value="refunded">Refunded</option>
                            </>
                        ) : (
                            <>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </>
                        )}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
            </div>

            {/* Orders Table */}
            <div className="orders-table-container">
                {activeTab === 'digital' ? (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Class</th>
                                <th>Package</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredDigitalOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="order-id">{order.id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <span className="customer-name">{order.user}</span>
                                            <span className="customer-email">{order.email}</span>
                                        </div>
                                    </td>
                                    <td>{order.class}</td>
                                    <td>
                                        <div className="package-badge">
                                            {getPackageIcon(order.package)}
                                            <span>{order.package}</span>
                                        </div>
                                    </td>
                                    <td className="amount">₹{order.amount.toLocaleString()}</td>
                                    <td>{new Date(order.date).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span>{order.status}</span>
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                ) : (
                    <table className="orders-table">
                        <thead>
                            <tr>
                                <th>Order ID</th>
                                <th>Customer</th>
                                <th>Class</th>
                                <th>Delivery Address</th>
                                <th>Amount</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredHardCopyOrders.map(order => (
                                <tr key={order.id}>
                                    <td className="order-id">{order.id}</td>
                                    <td>
                                        <div className="customer-info">
                                            <span className="customer-name">{order.user}</span>
                                            <span className="customer-phone">
                                                <Phone size={12} /> {order.phone}
                                            </span>
                                        </div>
                                    </td>
                                    <td>{order.class}</td>
                                    <td>
                                        <div className="address-cell">
                                            <MapPin size={14} />
                                            <span>{order.address}</span>
                                        </div>
                                    </td>
                                    <td className="amount">₹{order.amount.toLocaleString()}</td>
                                    <td>
                                        <span className={`status-badge ${getStatusClass(order.status)}`}>
                                            {getStatusIcon(order.status)}
                                            <span>{order.status}</span>
                                        </span>
                                        {order.trackingId && (
                                            <div className="tracking-id">Track: {order.trackingId}</div>
                                        )}
                                    </td>
                                    <td>
                                        <button className="btn-action" onClick={() => openStatusModal(order)}>
                                            <Edit2 size={14} />
                                            <span>Update</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>

            {/* Status Update Modal */}
            {showStatusModal && selectedOrder && (
                <div className="modal-overlay" onClick={() => setShowStatusModal(false)}>
                    <div className="modal-content" onClick={e => e.stopPropagation()}>
                        <h3>Update Order Status</h3>
                        <p className="modal-order-id">Order: {selectedOrder.id}</p>

                        <div className="form-group">
                            <label>Status</label>
                            <select value={newStatus} onChange={(e) => setNewStatus(e.target.value)}>
                                <option value="processing">Processing</option>
                                <option value="shipped">Shipped</option>
                                <option value="delivered">Delivered</option>
                            </select>
                        </div>

                        {newStatus === 'shipped' && (
                            <div className="form-group">
                                <label>Tracking ID</label>
                                <input
                                    type="text"
                                    value={trackingId}
                                    onChange={(e) => setTrackingId(e.target.value)}
                                    placeholder="Enter tracking ID"
                                />
                            </div>
                        )}

                        <div className="modal-actions">
                            <button className="btn-cancel" onClick={() => setShowStatusModal(false)}>Cancel</button>
                            <button className="btn-save" onClick={handleStatusUpdate}>Update Status</button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .orders-stats {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                    gap: 16px;
                    margin-bottom: 24px;
                }

                .stat-card {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    background: white;
                    padding: 20px;
                    border-radius: 12px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .stat-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                }

                .stat-icon.digital {
                    background: rgba(241, 196, 15, 0.15);
                    color: #f39c12;
                }

                .stat-icon.hardcopy {
                    background: rgba(155, 89, 182, 0.15);
                    color: #9b59b6;
                }

                .stat-icon.pending {
                    background: rgba(231, 76, 60, 0.15);
                    color: #e74c3c;
                }

                .stat-info {
                    display: flex;
                    flex-direction: column;
                }

                .stat-value {
                    font-size: 20px;
                    font-weight: 700;
                    color: #2c3e50;
                }

                .stat-label {
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .orders-tabs {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 20px;
                }

                .tab-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: white;
                    border: 2px solid #ecf0f1;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #7f8c8d;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .tab-btn:hover {
                    border-color: #1abc9c;
                    color: #1abc9c;
                }

                .tab-btn.active {
                    background: #1abc9c;
                    border-color: #1abc9c;
                    color: white;
                }

                .tab-count {
                    padding: 2px 8px;
                    background: rgba(0,0,0,0.1);
                    border-radius: 10px;
                    font-size: 12px;
                }

                .tab-btn.active .tab-count {
                    background: rgba(255,255,255,0.2);
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

                .orders-table-container {
                    background: white;
                    border-radius: 12px;
                    overflow-x: auto;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .orders-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .orders-table th {
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

                .orders-table td {
                    padding: 16px;
                    font-size: 14px;
                    color: #2c3e50;
                    border-bottom: 1px solid #f5f5f5;
                }

                .order-id {
                    font-family: monospace;
                    font-weight: 600;
                    color: #1abc9c;
                }

                .customer-info {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .customer-name {
                    font-weight: 600;
                }

                .customer-email, .customer-phone {
                    font-size: 12px;
                    color: #7f8c8d;
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .package-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 6px;
                    padding: 4px 10px;
                    background: #f8f9fa;
                    border-radius: 6px;
                    font-size: 13px;
                }

                .icon-bundle { color: #f39c12; }
                .icon-video { color: #3498db; }
                .icon-pdf { color: #e74c3c; }

                .amount {
                    font-weight: 700;
                    color: #27ae60;
                }

                .status-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-success {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }

                .status-warning {
                    background: rgba(241, 196, 15, 0.1);
                    color: #f39c12;
                }

                .status-info {
                    background: rgba(52, 152, 219, 0.1);
                    color: #3498db;
                }

                .status-error {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .address-cell {
                    display: flex;
                    align-items: flex-start;
                    gap: 6px;
                    max-width: 250px;
                    font-size: 13px;
                    color: #7f8c8d;
                }

                .address-cell svg {
                    flex-shrink: 0;
                    margin-top: 2px;
                    color: #9b59b6;
                }

                .tracking-id {
                    font-size: 11px;
                    color: #3498db;
                    margin-top: 4px;
                }

                .btn-action {
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

                .btn-action:hover {
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

                .modal-content {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 400px;
                    margin: 20px;
                }

                .modal-content h3 {
                    margin: 0 0 8px 0;
                    font-size: 18px;
                    color: #2c3e50;
                }

                .modal-order-id {
                    font-size: 13px;
                    color: #7f8c8d;
                    margin-bottom: 20px;
                }

                .form-group {
                    margin-bottom: 16px;
                }

                .form-group label {
                    display: block;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7f8c8d;
                    margin-bottom: 6px;
                }

                .form-group select,
                .form-group input {
                    width: 100%;
                    padding: 10px 14px;
                    border: 1px solid #ecf0f1;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .form-group select:focus,
                .form-group input:focus {
                    outline: none;
                    border-color: #1abc9c;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    margin-top: 24px;
                }

                .modal-actions button {
                    flex: 1;
                    padding: 12px;
                    border: none;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-cancel {
                    background: #ecf0f1;
                    color: #7f8c8d;
                }

                .btn-save {
                    background: #1abc9c;
                    color: white;
                }

                .btn-save:hover {
                    background: #16a085;
                }

                @media (max-width: 768px) {
                    .orders-tabs {
                        flex-direction: column;
                    }

                    .tab-btn {
                        justify-content: center;
                    }

                    .orders-table th:nth-child(4),
                    .orders-table td:nth-child(4) {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default Orders;
