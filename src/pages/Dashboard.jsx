import {
    Users,
    FileText,
    CreditCard,
    TrendingUp,
    ArrowUpRight,
    ArrowDownRight,
    Eye,
    Download,
    Video,
    Crown
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';

const revenueData = [
    { name: 'Jan', value: 45000 },
    { name: 'Feb', value: 52000 },
    { name: 'Mar', value: 48000 },
    { name: 'Apr', value: 61000 },
    { name: 'May', value: 55000 },
    { name: 'Jun', value: 67000 },
];

const subscriptionDistribution = [
    { name: 'All PDFs', value: 320, color: '#E74C3C' },
    { name: 'All Videos', value: 280, color: '#3498DB' },
    { name: 'Complete Access', value: 450, color: '#F39C12' },
];

const boardDistribution = [
    { name: 'State Board', students: 680, color: '#1ABC9C' },
    { name: 'CBSE', students: 540, color: '#9B59B6' },
];

const recentUsers = [
    { id: 1, name: 'Rahul Kumar', email: 'rahul@example.com', whatsapp: '+91 9876543210', class: 'Class 12', board: 'State Board', status: 'Active', date: '2 hours ago' },
    { id: 2, name: 'Priya Sharma', email: 'priya@example.com', whatsapp: '+91 9876543211', class: 'NEET', board: 'CBSE', status: 'Active', date: '5 hours ago' },
    { id: 3, name: 'Amit Singh', email: 'amit@example.com', whatsapp: '+91 9876543212', class: 'Class 11', board: 'State Board', status: 'Pending', date: '1 day ago' },
    { id: 4, name: 'Sneha Patel', email: 'sneha@example.com', whatsapp: '+91 9876543213', class: 'Class 10', board: 'CBSE', status: 'Active', date: '2 days ago' },
];

const popularContent = [
    { id: 1, title: 'Physics - Laws of Motion Notes', type: 'PDF', board: 'State', rating: 4.8, views: 1245 },
    { id: 2, title: 'Chemistry - Organic Reactions', type: 'Video', board: 'CBSE', rating: 4.7, views: 982 },
    { id: 3, title: 'Mathematics - Trigonometry Formulas', type: 'PDF', board: 'State', rating: 4.9, views: 876 },
    { id: 4, title: 'Biology - Human Physiology', type: 'Video', board: 'CBSE', rating: 4.8, views: 754 },
];

const Dashboard = () => {
    const stats = [
        {
            label: 'Total Students',
            value: '1,220',
            change: '+12%',
            positive: true,
            icon: Users,
            color: 'primary'
        },
        {
            label: 'PDF Subscriptions',
            value: '320',
            change: '+8%',
            positive: true,
            icon: FileText,
            color: 'error'
        },
        {
            label: 'Video Subscriptions',
            value: '280',
            change: '+15%',
            positive: true,
            icon: Video,
            color: 'info'
        },
        {
            label: 'Complete Access',
            value: '450',
            change: '+22%',
            positive: true,
            icon: Crown,
            color: 'warning'
        },
    ];

    return (
        <div>
            {/* Stats Grid */}
            <div className="stat-grid">
                {stats.map((stat, index) => (
                    <div key={index} className="stat-card">
                        <div className={`stat-icon ${stat.color}`}>
                            <stat.icon size={24} />
                        </div>
                        <div className="stat-info">
                            <h3>{stat.value}</h3>
                            <p>{stat.label}</p>
                            <div className={`stat-change ${stat.positive ? 'positive' : 'negative'}`}>
                                {stat.positive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
                                {stat.change} from last month
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid-2" style={{ marginBottom: 24 }}>
                {/* Revenue Chart */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Revenue Overview</h3>
                        <select className="form-select" style={{ width: 'auto' }}>
                            <option>Last 6 Months</option>
                            <option>Last Year</option>
                        </select>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <LineChart data={revenueData}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#7F8C8D" fontSize={12} />
                            <YAxis stroke="#7F8C8D" fontSize={12} />
                            <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                            <Line
                                type="monotone"
                                dataKey="value"
                                stroke="#1ABC9C"
                                strokeWidth={2}
                                dot={{ fill: '#1ABC9C', strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Board Distribution */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Students by Board</h3>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                        <BarChart data={boardDistribution}>
                            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                            <XAxis dataKey="name" stroke="#7F8C8D" fontSize={12} />
                            <YAxis stroke="#7F8C8D" fontSize={12} />
                            <Tooltip />
                            <Bar dataKey="students" fill="#1ABC9C" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Subscription Distribution */}
            <div className="card" style={{ marginBottom: 24 }}>
                <div className="card-header">
                    <h3 className="card-title">Subscription Distribution</h3>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 40, padding: 20 }}>
                    <ResponsiveContainer width={200} height={200}>
                        <PieChart>
                            <Pie
                                data={subscriptionDistribution}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={80}
                                dataKey="value"
                            >
                                {subscriptionDistribution.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <Tooltip />
                        </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                        {subscriptionDistribution.map((item) => (
                            <div key={item.name} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color }} />
                                <span style={{ fontSize: 14 }}>{item.name}</span>
                                <span style={{ fontSize: 14, fontWeight: 600, marginLeft: 4 }}>{item.value}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Tables Row */}
            <div className="grid-2">
                {/* Recent Users */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Recent Registrations</h3>
                        <button className="btn btn-secondary btn-sm">View All</button>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>Board</th>
                                    <th>Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.map((user) => (
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
                                        <td><span className="badge primary">{user.class}</span></td>
                                        <td style={{ fontSize: 13 }}>{user.board}</td>
                                        <td>
                                            <span className={`badge ${user.status === 'Active' ? 'success' : 'warning'}`}>
                                                {user.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Popular Content */}
                <div className="card">
                    <div className="card-header">
                        <h3 className="card-title">Popular Content</h3>
                        <button className="btn btn-secondary btn-sm">View All</button>
                    </div>
                    <div className="table-container">
                        <table className="table">
                            <thead>
                                <tr>
                                    <th>Content</th>
                                    <th>Type</th>
                                    <th>Board</th>
                                    <th>Rating</th>
                                </tr>
                            </thead>
                            <tbody>
                                {popularContent.map((content) => (
                                    <tr key={content.id}>
                                        <td style={{ fontWeight: 500, maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{content.title}</td>
                                        <td>
                                            <span className={`badge ${content.type === 'PDF' ? 'error' : 'info'}`}>
                                                {content.type}
                                            </span>
                                        </td>
                                        <td style={{ fontSize: 13 }}>{content.board}</td>
                                        <td>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                                <span style={{ color: '#F39C12' }}>★</span>
                                                {content.rating}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
