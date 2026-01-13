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
    Eye
} from 'lucide-react';

// Stats data
const statsData = [
    {
        id: 1,
        label: 'Total Students',
        value: '1,247',
        change: '+12%',
        trend: 'up',
        icon: Users,
        color: '#3498db'
    },
    {
        id: 2,
        label: 'Total Revenue',
        value: '₹4,52,890',
        change: '+18%',
        trend: 'up',
        icon: IndianRupee,
        color: '#27ae60'
    },
    {
        id: 3,
        label: 'PDF Sales',
        value: '423',
        change: '+8%',
        trend: 'up',
        icon: FileText,
        color: '#e74c3c'
    },
    {
        id: 4,
        label: 'Video Sales',
        value: '312',
        change: '+15%',
        trend: 'up',
        icon: Video,
        color: '#9b59b6'
    }
];

// Class-wise distribution
const classDistribution = [
    { name: 'Class 10', students: 342, revenue: 102600, color: '#3498db' },
    { name: 'Class 11', students: 287, revenue: 114800, color: '#9b59b6' },
    { name: 'Class 12', students: 398, revenue: 179100, color: '#e67e22' },
    { name: 'NEET', students: 220, revenue: 121000, color: '#1abc9c' },
];

// Recent orders
const recentOrders = [
    { id: 'ORD001', user: 'Rahul Kumar', class: 'Class 12', package: 'Complete Bundle', amount: 4500, status: 'completed', date: '2 hours ago' },
    { id: 'ORD002', user: 'Priya Sharma', class: 'Class 11', package: 'All PDFs', amount: 1800, status: 'completed', date: '3 hours ago' },
    { id: 'HC001', user: 'Amit Singh', class: 'NEET', package: 'Hard Copy', amount: 4100, status: 'processing', date: '5 hours ago' },
    { id: 'ORD003', user: 'Sneha Patel', class: 'Class 10', package: 'All Videos', amount: 2000, status: 'completed', date: '6 hours ago' },
    { id: 'HC002', user: 'Vikram Reddy', class: 'Class 12', package: 'Hard Copy', amount: 3600, status: 'shipped', date: '1 day ago' },
];

// Popular content
const popularContent = [
    { id: 1, title: 'Mathematics - Complete Guide', type: 'PDF', class: 'Class 10', views: 2345, purchases: 234 },
    { id: 2, title: 'NEET Physics Complete', type: 'Video', class: 'NEET', views: 1876, purchases: 189 },
    { id: 3, title: 'Chemistry - Organic Reactions', type: 'PDF', class: 'Class 12', views: 1654, purchases: 167 },
    { id: 4, title: 'Biology - Cell Structure', type: 'Video', class: 'Class 11', views: 1432, purchases: 145 },
];

function Dashboard() {
    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <CheckCircle size={14} />;
            case 'processing': return <Clock size={14} />;
            case 'shipped': return <Truck size={14} />;
            default: return <Package size={14} />;
        }
    };

    const getStatusClass = (status) => {
        switch (status) {
            case 'completed': return 'status-success';
            case 'processing': return 'status-warning';
            case 'shipped': return 'status-info';
            default: return '';
        }
    };

    const getPackageIcon = (pkg) => {
        if (pkg === 'Complete Bundle') return <Crown size={14} className="icon-bundle" />;
        if (pkg === 'All Videos') return <Video size={14} className="icon-video" />;
        if (pkg === 'Hard Copy') return <Truck size={14} className="icon-hardcopy" />;
        return <FileText size={14} className="icon-pdf" />;
    };

    const totalRevenue = classDistribution.reduce((sum, c) => sum + c.revenue, 0);

    return (
        <div className="page-container dashboard-page">
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
                {/* Class Distribution */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Class Distribution</h3>
                        <span className="card-subtitle">Students & Revenue by Class</span>
                    </div>
                    <div className="class-distribution">
                        {classDistribution.map(cls => (
                            <div key={cls.name} className="class-row">
                                <div className="class-info">
                                    <div className="class-color" style={{ backgroundColor: cls.color }}></div>
                                    <span className="class-name">{cls.name}</span>
                                </div>
                                <div className="class-stats">
                                    <span className="class-students">{cls.students} students</span>
                                    <span className="class-revenue">₹{cls.revenue.toLocaleString()}</span>
                                </div>
                                <div className="class-bar-container">
                                    <div
                                        className="class-bar"
                                        style={{
                                            width: `${(cls.revenue / totalRevenue) * 100}%`,
                                            backgroundColor: cls.color
                                        }}
                                    ></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Recent Orders */}
                <div className="dashboard-card">
                    <div className="card-header">
                        <h3>Recent Orders</h3>
                        <button className="view-all-btn">View All</button>
                    </div>
                    <div className="orders-list">
                        {recentOrders.map(order => (
                            <div key={order.id} className="order-row">
                                <div className="order-info">
                                    <div className="order-package">
                                        {getPackageIcon(order.package)}
                                        <span>{order.package}</span>
                                    </div>
                                    <span className="order-user">{order.user} • {order.class}</span>
                                </div>
                                <div className="order-details">
                                    <span className="order-amount">₹{order.amount.toLocaleString()}</span>
                                    <span className={`order-status ${getStatusClass(order.status)}`}>
                                        {getStatusIcon(order.status)}
                                        {order.status}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Popular Content */}
                <div className="dashboard-card full-width">
                    <div className="card-header">
                        <h3>Popular Content</h3>
                        <span className="card-subtitle">Most viewed & purchased materials</span>
                    </div>
                    <div className="content-table">
                        <div className="table-header">
                            <span>Content</span>
                            <span>Type</span>
                            <span>Class</span>
                            <span>Views</span>
                            <span>Purchases</span>
                        </div>
                        {popularContent.map(content => (
                            <div key={content.id} className="table-row">
                                <span className="content-title">{content.title}</span>
                                <span className={`content-type ${content.type.toLowerCase()}`}>
                                    {content.type === 'PDF' ? <FileText size={14} /> : <Video size={14} />}
                                    {content.type}
                                </span>
                                <span className="content-class">{content.class}</span>
                                <span className="content-views">
                                    <Eye size={14} />
                                    {content.views.toLocaleString()}
                                </span>
                                <span className="content-purchases">
                                    <ShoppingCart size={14} />
                                    {content.purchases}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <style>{`
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

                .stat-change.up {
                    color: #27ae60;
                }

                .stat-change.down {
                    color: #e74c3c;
                }

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

                .dashboard-card.full-width {
                    grid-column: 1 / -1;
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

                /* Class Distribution */
                .class-distribution {
                    display: flex;
                    flex-direction: column;
                    gap: 16px;
                }

                .class-row {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .class-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .class-color {
                    width: 12px;
                    height: 12px;
                    border-radius: 4px;
                }

                .class-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .class-stats {
                    display: flex;
                    justify-content: space-between;
                    font-size: 12px;
                }

                .class-students {
                    color: #7f8c8d;
                }

                .class-revenue {
                    font-weight: 600;
                    color: #27ae60;
                }

                .class-bar-container {
                    height: 6px;
                    background: #ecf0f1;
                    border-radius: 3px;
                    overflow: hidden;
                }

                .class-bar {
                    height: 100%;
                    border-radius: 3px;
                    transition: width 0.3s ease;
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

                .icon-bundle { color: #f39c12; }
                .icon-video { color: #9b59b6; }
                .icon-pdf { color: #e74c3c; }
                .icon-hardcopy { color: #3498db; }

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

                /* Content Table */
                .content-table {
                    display: flex;
                    flex-direction: column;
                }

                .table-header, .table-row {
                    display: grid;
                    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
                    padding: 12px 16px;
                    gap: 12px;
                    align-items: center;
                }

                .table-header {
                    font-size: 11px;
                    font-weight: 600;
                    color: #95a5a6;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    background: #f8f9fa;
                    border-radius: 8px;
                }

                .table-row {
                    border-bottom: 1px solid #f5f5f5;
                }

                .content-title {
                    font-size: 13px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .content-type {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    font-weight: 500;
                }

                .content-type.pdf { color: #e74c3c; }
                .content-type.video { color: #9b59b6; }

                .content-class {
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .content-views, .content-purchases {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 13px;
                    color: #2c3e50;
                }

                .content-views svg { color: #3498db; }
                .content-purchases svg { color: #27ae60; }

                @media (max-width: 1024px) {
                    .dashboard-grid {
                        grid-template-columns: 1fr;
                    }
                }

                @media (max-width: 768px) {
                    .table-header, .table-row {
                        grid-template-columns: 2fr 1fr 1fr;
                    }

                    .table-header span:nth-child(3),
                    .table-row span:nth-child(3),
                    .table-header span:nth-child(4),
                    .table-row span:nth-child(4) {
                        display: none;
                    }
                }
            `}</style>
        </div>
    );
}

export default Dashboard;
