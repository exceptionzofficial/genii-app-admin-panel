import { useState, useEffect } from 'react';
import {
    Users,
    FileText,
    Video,
    IndianRupee,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    ShoppingCart,
    Crown,
    Truck,
    Package,
    Clock,
    CheckCircle,
    Eye,
    Loader2,
    RefreshCw
} from 'lucide-react';

const API_URL = 'https://genii-backend.vercel.app/api';

function Dashboard() {
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalRevenue: 0,
        digitalOrders: 0,
        hardcopyOrders: 0,
        pendingOrders: 0,
        completedOrders: 0
    });
    const [recentOrders, setRecentOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Fetch dashboard data
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            setError('');

            // Fetch all data in parallel
            const [usersRes, ordersStatsRes, ordersRes] = await Promise.all([
                fetch(`${API_URL}/users`),
                fetch(`${API_URL}/orders/stats`),
                fetch(`${API_URL}/orders/admin?limit=5`)
            ]);

            const usersData = await usersRes.json();
            const ordersStatsData = await ordersStatsRes.json();
            const ordersData = await ordersRes.json();

            if (usersData.success) {
                setStats(prev => ({
                    ...prev,
                    totalStudents: usersData.count || usersData.data?.length || 0
                }));
            }

            if (ordersStatsData.success) {
                setStats(prev => ({
                    ...prev,
                    totalRevenue: ordersStatsData.data?.totalRevenue || 0,
                    digitalOrders: ordersStatsData.data?.digitalOrders || 0,
                    hardcopyOrders: ordersStatsData.data?.hardcopyOrders || 0,
                    pendingOrders: ordersStatsData.data?.pendingOrders || 0,
                    completedOrders: ordersStatsData.data?.completedOrders || 0
                }));
            }

            if (ordersData.success) {
                setRecentOrders(ordersData.data?.slice(0, 5) || []);
            }

        } catch (err) {
            console.error('Dashboard fetch error:', err);
            setError('Failed to load dashboard data');
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered': return <CheckCircle size={14} />;
            case 'processing':
            case 'pending': return <Clock size={14} />;
            case 'shipped': return <Truck size={14} />;
            default: return <Package size={14} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed':
            case 'delivered': return 'status-success';
            case 'processing':
            case 'pending': return 'status-warning';
            case 'shipped': return 'status-info';
            default: return '';
        }
    };

    const getPackageIcon = (orderType) => {
        if (orderType === 'hardcopy') return <Truck size={14} className="icon-hardcopy" />;
        return <FileText size={14} className="icon-pdf" />;
    };

    const statsData = [
        {
            id: 1,
            label: 'Total Students',
            value: stats.totalStudents.toLocaleString(),
            change: '+12%',
            trend: 'up',
            icon: Users,
            color: '#3498db'
        },
        {
            id: 2,
            label: 'Total Revenue',
            value: `₹${stats.totalRevenue.toLocaleString()}`,
            change: '+18%',
            trend: 'up',
            icon: IndianRupee,
            color: '#27ae60'
        },
        {
            id: 3,
            label: 'Digital Orders',
            value: stats.digitalOrders.toString(),
            change: '+8%',
            trend: 'up',
            icon: FileText,
            color: '#e74c3c'
        },
        {
            id: 4,
            label: 'Hardcopy Orders',
            value: stats.hardcopyOrders.toString(),
            change: '+15%',
            trend: 'up',
            icon: Truck,
            color: '#9b59b6'
        }
    ];

    if (loading) {
        return (
            <div className="page-container dashboard-page">
                <div className="loading-state">
                    <Loader2 size={40} className="spin" />
                    <p>Loading dashboard...</p>
                </div>
                <style>{`
                    .loading-state {
                        display: flex;
                        flex-direction: column;
                        align-items: center;
                        justify-content: center;
                        min-height: 400px;
                        gap: 16px;
                        color: #7f8c8d;
                    }
                    .loading-state .spin {
                        animation: spin 1s linear infinite;
                    }
                    @keyframes spin {
                        from { transform: rotate(0deg); }
                        to { transform: rotate(360deg); }
                    }
                `}</style>
            </div>
        );
    }

    return (
        <div className="page-container dashboard-page">
            {/* Header with refresh */}
            <div className="dashboard-header">
                <div>
                    <h1 className="page-title">Dashboard</h1>
                    <p className="page-subtitle">Overview of your business</p>
                </div>
                <button className="refresh-btn" onClick={fetchDashboardData}>
                    <RefreshCw size={18} />
                    Refresh
                </button>
            </div>

            {error && (
                <div className="error-banner">
                    {error}
                    <button onClick={fetchDashboardData}>Retry</button>
                </div>
            )}

            {/* Stats Grid */}
            <div className="stats-grid">
                {statsData.map(stat => (
                    <div key={stat.id} className="stat-card">
                        <div className="stat-icon" style={{ backgroundColor: `${stat.color}15`, color: stat.color }}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-content">
                            <span className="stat-label">{stat.label}</span>
                            <span className="stat-value">{stat.value}</span>
                            <span className={`stat-change ${stat.trend}`}>
                                {stat.trend === 'up' ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change} this month
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <div className="dashboard-grid">
                {/* Order Summary */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Order Summary</h3>
                        <span className="card-subtitle">Pending & Completed</span>
                    </div>
                    <div className="order-summary">
                        <div className="summary-item">
                            <div className="summary-icon pending">
                                <Clock size={20} />
                            </div>
                            <div className="summary-info">
                                <span className="summary-number">{stats.pendingOrders}</span>
                                <span className="summary-label">Pending Orders</span>
                            </div>
                        </div>
                        <div className="summary-item">
                            <div className="summary-icon completed">
                                <CheckCircle size={20} />
                            </div>
                            <div className="summary-info">
                                <span className="summary-number">{stats.completedOrders}</span>
                                <span className="summary-label">Completed Orders</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="orders-list">
                        {recentOrders.length > 0 ? (
                            recentOrders.map(order => (
                                <div key={order.orderId} className="order-row">
                                    <div className="order-info">
                                        <div className="order-package">
                                            {getPackageIcon(order.orderType)}
                                            <span>{order.packageType || order.orderType || 'Order'}</span>
                                        </div>
                                        <span className="order-user">{order.phone} • {order.classId || 'N/A'}</span>
                                    </div>
                                    <div className="order-details">
                                        <span className="order-amount">₹{(order.amount || 0).toLocaleString()}</span>
                                        <span className={`order-status ${getStatusClass(order.orderStatus)}`}>
                                            {getStatusIcon(order.orderStatus)}
                                            {order.orderStatus || 'pending'}
                                        </span>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="no-orders">
                                <Package size={32} />
                                <p>No orders yet</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <style>{`
                .dashboard-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 24px;
                }

                .dashboard-header .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 10px 20px;
                    background: white;
                    border: 1px solid #ecf0f1;
                    border-radius: 10px;
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .dashboard-header .refresh-btn:hover {
                    background: #1abc9c;
                    color: white;
                    border-color: #1abc9c;
                }

                .error-banner {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px 20px;
                    background: rgba(231, 76, 60, 0.1);
                    border: 1px solid rgba(231, 76, 60, 0.3);
                    border-radius: 10px;
                    color: #e74c3c;
                    margin-bottom: 20px;
                }

                .error-banner button {
                    padding: 6px 12px;
                    background: #e74c3c;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                }

                .dashboard-page .stats-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
                    gap: 20px;
                    margin-bottom: 24px;
                }

                .stat-card {
                    display: flex;
                    align-items: flex-start;
                    gap: 16px;
                    background: white;
                    padding: 20px;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .stat-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 52px;
                    height: 52px;
                    border-radius: 14px;
                }

                .stat-content {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .stat-label {
                    font-size: 13px;
                    color: #7f8c8d;
                }

                .stat-value {
                    font-size: 24px;
                    font-weight: 700;
                    color: #2c3e50;
                }

                .stat-change {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .stat-change.up { color: #27ae60; }
                .stat-change.down { color: #e74c3c; }

                .dashboard-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 20px;
                }

                .dashboard-card {
                    background: white;
                    padding: 24px;
                    border-radius: 16px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                }

                .card-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                }

                .card-header h3 {
                    font-size: 16px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }

                .card-subtitle {
                    font-size: 12px;
                    color: #95a5a6;
                }

                .view-all-btn {
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

                .view-all-btn:hover {
                    background: #1abc9c;
                    color: white;
                }

                /* Order Summary */
                .order-summary {
                    display: flex;
                    gap: 20px;
                }

                .summary-item {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    background: #f8f9fa;
                    border-radius: 12px;
                }

                .summary-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    border-radius: 12px;
                }

                .summary-icon.pending {
                    background: rgba(241, 196, 15, 0.1);
                    color: #f39c12;
                }

                .summary-icon.completed {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }

                .summary-info {
                    display: flex;
                    flex-direction: column;
                }

                .summary-number {
                    font-size: 28px;
                    font-weight: 700;
                    color: #2c3e50;
                }

                .summary-label {
                    font-size: 13px;
                    color: #7f8c8d;
                }

                /* Orders List */
                .orders-list {
                    display: flex;
                    flex-direction: column;
                    gap: 12px;
                }

                .order-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 10px;
                }

                .order-info {
                    display: flex;
                    flex-direction: column;
                    gap: 4px;
                }

                .order-package {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 13px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .icon-hardcopy { color: #3498db; }
                .icon-pdf { color: #e74c3c; }

                .order-user {
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .order-details {
                    display: flex;
                    flex-direction: column;
                    align-items: flex-end;
                    gap: 4px;
                }

                .order-amount {
                    font-size: 14px;
                    font-weight: 700;
                    color: #27ae60;
                }

                .order-status {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 11px;
                    font-weight: 600;
                    padding: 2px 8px;
                    border-radius: 10px;
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

                .no-orders {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 40px;
                    color: #bdc3c7;
                    gap: 12px;
                }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;
