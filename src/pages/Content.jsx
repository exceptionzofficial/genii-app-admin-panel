import { useState } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    Eye,
    FileText,
    Video,
    Filter,
    Upload,
    Star
} from 'lucide-react';

const mockContent = [
    { id: 1, title: 'Physics - Laws of Motion Notes', type: 'pdf', board: 'state', targetClass: ['11', '12'], subject: 'Physics', isFree: false, rating: 4.8, pages: 25, status: 'published' },
    { id: 2, title: 'Chemistry - Periodic Table Guide', type: 'pdf', board: 'state', targetClass: ['11', '12', 'neet'], subject: 'Chemistry', isFree: true, rating: 4.6, pages: 18, status: 'published' },
    { id: 3, title: 'Mathematics - Trigonometry Formulas', type: 'pdf', board: 'state', targetClass: ['10', '11', '12'], subject: 'Mathematics', isFree: false, rating: 4.9, pages: 12, status: 'published' },
    { id: 4, title: 'Biology - Cell Structure Notes', type: 'pdf', board: 'state', targetClass: ['11', '12', 'neet'], subject: 'Biology', isFree: false, rating: 4.7, pages: 20, status: 'draft' },
    { id: 5, title: 'Physics - Mechanics Complete Lecture', type: 'video', board: 'state', targetClass: ['11', '12'], subject: 'Physics', isFree: false, rating: 4.7, duration: '45 min', status: 'published' },
    { id: 6, title: 'Chemistry - Organic Reactions', type: 'video', board: 'state', targetClass: ['12', 'neet'], subject: 'Chemistry', isFree: true, rating: 4.8, duration: '38 min', status: 'published' },
    { id: 7, title: 'CBSE Physics - Modern Physics Notes', type: 'pdf', board: 'cbse', targetClass: ['12'], subject: 'Physics', isFree: false, rating: 4.9, pages: 30, status: 'published' },
    { id: 8, title: 'CBSE Chemistry - Chemical Bonding', type: 'pdf', board: 'cbse', targetClass: ['11', '12'], subject: 'Chemistry', isFree: false, rating: 4.7, pages: 22, status: 'published' },
    { id: 9, title: 'CBSE Biology - Human Physiology', type: 'pdf', board: 'cbse', targetClass: ['11', '12', 'neet'], subject: 'Biology', isFree: true, rating: 4.8, pages: 35, status: 'published' },
    { id: 10, title: 'CBSE Physics - Electromagnetism Lecture', type: 'video', board: 'cbse', targetClass: ['12'], subject: 'Physics', isFree: false, rating: 4.9, duration: '52 min', status: 'published' },
];

const Content = () => {
    const [content] = useState(mockContent);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [filterBoard, setFilterBoard] = useState('all');
    const [activeTab, setActiveTab] = useState('all');
    const [showModal, setShowModal] = useState(false);

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesType = filterType === 'all' || item.type === filterType;
        const matchesBoard = filterBoard === 'all' || item.board === filterBoard;
        const matchesTab = activeTab === 'all' || item.status === activeTab;
        return matchesSearch && matchesType && matchesBoard && matchesTab;
    });

    const getClassBadges = (classes) => {
        return classes.map(c => {
            const label = c === 'neet' ? 'NEET' : `Class ${c}`;
            return <span key={c} className="badge primary" style={{ marginRight: 4 }}>{label}</span>;
        });
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Management</h1>
                    <p className="page-subtitle">Upload and manage PDFs and videos for students</p>
                </div>
                <button className="btn btn-primary" onClick={() => setShowModal(true)}>
                    <Upload size={18} />
                    Upload Content
                </button>
            </div>

            {/* Tabs */}
            <div className="tabs">
                <button
                    className={`tab ${activeTab === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveTab('all')}
                >
                    All Content ({content.length})
                </button>
                <button
                    className={`tab ${activeTab === 'published' ? 'active' : ''}`}
                    onClick={() => setActiveTab('published')}
                >
                    Published ({content.filter(c => c.status === 'published').length})
                </button>
                <button
                    className={`tab ${activeTab === 'draft' ? 'active' : ''}`}
                    onClick={() => setActiveTab('draft')}
                >
                    Draft ({content.filter(c => c.status === 'draft').length})
                </button>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: 20 }}>
                <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center' }}>
                    <div className="search-box" style={{ flex: 1, minWidth: 250 }}>
                        <Search size={18} />
                        <input
                            type="text"
                            placeholder="Search content by title or subject..."
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
                            style={{ width: 120 }}
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All Types</option>
                            <option value="pdf">PDF</option>
                            <option value="video">Video</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Content Table */}
            <div className="card">
                <div className="table-container">
                    <table className="table">
                        <thead>
                            <tr>
                                <th>Content</th>
                                <th>Type</th>
                                <th>Board</th>
                                <th>Classes</th>
                                <th>Price</th>
                                <th>Rating</th>
                                <th>Status</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredContent.map((item) => (
                                <tr key={item.id}>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                            <div style={{
                                                width: 40,
                                                height: 40,
                                                borderRadius: 8,
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                background: item.type === 'pdf' ? 'rgba(231,76,60,0.1)' : 'rgba(52,152,219,0.1)',
                                                color: item.type === 'pdf' ? '#E74C3C' : '#3498DB'
                                            }}>
                                                {item.type === 'pdf' ? <FileText size={20} /> : <Video size={20} />}
                                            </div>
                                            <div>
                                                <span style={{ fontWeight: 500, display: 'block', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                    {item.title}
                                                </span>
                                                <span style={{ fontSize: 12, color: '#7F8C8D' }}>
                                                    {item.type === 'pdf' ? `${item.pages} pages` : item.duration}
                                                </span>
                                            </div>
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.type === 'pdf' ? 'error' : 'info'}`}>
                                            {item.type.toUpperCase()}
                                        </span>
                                    </td>
                                    <td style={{ fontSize: 13 }}>
                                        {item.board === 'state' ? 'State Board' : 'CBSE'}
                                    </td>
                                    <td>{getClassBadges(item.targetClass)}</td>
                                    <td style={{ fontWeight: 500 }}>
                                        {item.isFree ? (
                                            <span style={{ color: '#27AE60' }}>Free</span>
                                        ) : (
                                            <span>₹{item.type === 'pdf' ? '49' : '99'}</span>
                                        )}
                                    </td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                                            <Star size={14} style={{ color: '#F39C12', fill: '#F39C12' }} />
                                            {item.rating}
                                        </div>
                                    </td>
                                    <td>
                                        <span className={`badge ${item.status === 'published' ? 'success' : 'warning'}`}>
                                            {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
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
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Upload Modal */}
            {showModal && (
                <div className="modal-overlay" onClick={() => setShowModal(false)}>
                    <div className="modal" onClick={(e) => e.stopPropagation()} style={{ maxWidth: 600 }}>
                        <div className="modal-header">
                            <h3 className="modal-title">Upload New Content</h3>
                            <button className="modal-close" onClick={() => setShowModal(false)}>
                                <Plus size={16} style={{ transform: 'rotate(45deg)' }} />
                            </button>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Content Title</label>
                            <input type="text" className="form-input" placeholder="Enter content title" />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Content Type</label>
                                <select className="form-select">
                                    <option value="">Select type</option>
                                    <option value="pdf">PDF</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Board</label>
                                <select className="form-select">
                                    <option value="">Select board</option>
                                    <option value="state">State Board</option>
                                    <option value="cbse">CBSE</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Subject</label>
                            <select className="form-select">
                                <option value="">Select subject</option>
                                <option value="physics">Physics</option>
                                <option value="chemistry">Chemistry</option>
                                <option value="mathematics">Mathematics</option>
                                <option value="biology">Biology</option>
                                <option value="english">English</option>
                                <option value="science">Science</option>
                            </select>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Target Classes</label>
                            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                                {['10', '11', '12', 'NEET'].map(c => (
                                    <label key={c} style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer' }}>
                                        <input type="checkbox" />
                                        <span>{c === 'NEET' ? 'NEET' : `Class ${c}`}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                            <div className="form-group">
                                <label className="form-label">Pricing</label>
                                <select className="form-select">
                                    <option value="free">Free</option>
                                    <option value="paid">Paid (₹49 PDF / ₹99 Video)</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select className="form-select">
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group">
                            <label className="form-label">Upload File</label>
                            <div style={{
                                border: '2px dashed #E0E0E0',
                                borderRadius: 8,
                                padding: 40,
                                textAlign: 'center',
                                cursor: 'pointer'
                            }}>
                                <Upload size={32} style={{ color: '#7F8C8D', marginBottom: 8 }} />
                                <p style={{ color: '#7F8C8D', fontSize: 14 }}>
                                    Drag and drop your file here, or click to browse
                                </p>
                                <p style={{ color: '#95A5A6', fontSize: 12, marginTop: 4 }}>
                                    Supported: PDF, MP4, WebM (Max 500MB)
                                </p>
                            </div>
                        </div>

                        <div className="modal-footer">
                            <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                            <button className="btn btn-primary">Upload Content</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Content;
