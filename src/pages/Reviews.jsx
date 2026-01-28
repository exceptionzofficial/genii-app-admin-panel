import { useState, useEffect } from 'react';
import {
    Star,
    Plus,
    Edit2,
    Trash2,
    Search,
    X,
    Save,
    Loader2,
    MessageSquare,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const API_URL = 'https://genii-backend.vercel.app/api';

function Reviews() {
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingReview, setEditingReview] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        userName: '',
        studentClass: '',
        rating: 5,
        comment: '',
        status: 'active'
    });

    const fetchReviews = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/reviews`);
            const data = await response.json();
            if (data.success) {
                setReviews(data.data);
            }
        } catch (error) {
            console.error('Error fetching reviews:', error);
            showNotification('Failed to fetch reviews', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleAddNew = () => {
        setEditingReview(null);
        setFormData({
            userName: '',
            studentClass: '',
            rating: 5,
            comment: '',
            status: 'active'
        });
        setShowAddModal(true);
    };

    const handleEdit = (review) => {
        setEditingReview(review);
        setFormData({
            userName: review.userName,
            studentClass: review.studentClass || '',
            rating: review.rating || 5,
            comment: review.comment || '',
            status: review.status || 'active'
        });
        setShowAddModal(true);
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this review?')) return;
        try {
            const response = await fetch(`${API_URL}/reviews/${id}`, {
                method: 'DELETE'
            });
            const result = await response.json();
            if (result.success) {
                showNotification('Review deleted successfully');
                fetchReviews();
            }
        } catch (error) {
            showNotification('Failed to delete review', 'error');
        }
    };

    const handleSave = async () => {
        if (!formData.userName || !formData.comment) {
            showNotification('Name and comment are required', 'error');
            return;
        }

        try {
            setSaving(true);
            const url = editingReview
                ? `${API_URL}/reviews/${editingReview.reviewId}`
                : `${API_URL}/reviews`;
            const method = editingReview ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            });

            const result = await response.json();
            if (result.success) {
                showNotification(editingReview ? 'Review updated!' : 'Review added!');
                setShowAddModal(false);
                fetchReviews();
            } else {
                throw new Error(result.message);
            }
        } catch (error) {
            showNotification(error.message || 'Failed to save review', 'error');
        } finally {
            setSaving(false);
        }
    };

    const filteredReviews = reviews.filter(r =>
        r.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        r.comment.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="page-container">
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">Reviews Management</h1>
                    <p className="page-subtitle">Manage student testimonials for the home page</p>
                </div>
                <button className="btn btn-primary" onClick={handleAddNew}>
                    <Plus size={18} />
                    <span>Add Review</span>
                </button>
            </div>

            <div className="card" style={{ marginBottom: '24px' }}>
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        className="form-input"
                        placeholder="Search reviews by name or comment..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{ paddingLeft: '40px' }}
                    />
                </div>
            </div>

            {loading ? (
                <div className="loading-state" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '60px' }}>
                    <Loader2 size={32} className="spin" />
                    <p style={{ marginTop: '12px', color: 'var(--text-secondary)' }}>Loading reviews...</p>
                </div>
            ) : filteredReviews.length === 0 ? (
                <div className="empty-state card">
                    <MessageSquare size={48} />
                    <h3>No reviews found</h3>
                    <p>Add some student testimonials to show on the home page</p>
                </div>
            ) : (
                <div className="reviews-grid">
                    {filteredReviews.map(review => (
                        <div key={review.reviewId} className="card review-card">
                            <div className="review-card-header">
                                <div className="stars">
                                    {[...Array(5)].map((_, i) => (
                                        <Star
                                            key={i}
                                            size={14}
                                            fill={i < review.rating ? "#f1c40f" : "none"}
                                            color={i < review.rating ? "#f1c40f" : "#bdc3c7"}
                                        />
                                    ))}
                                </div>
                                <span className={`badge ${review.status === 'active' ? 'success' : 'info'}`}>
                                    {review.status}
                                </span>
                            </div>
                            <h3 className="reviewer-name">{review.userName}</h3>
                            <p className="reviewer-class">{review.studentClass}</p>
                            <p className="review-text">"{review.comment}"</p>
                            <div className="review-actions">
                                <button className="action-btn" title="Edit" onClick={() => handleEdit(review)}>
                                    <Edit2 size={16} />
                                </button>
                                <button className="action-btn danger" title="Delete" onClick={() => handleDelete(review.reviewId)}>
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {showAddModal && (
                <div className="modal-overlay" onClick={() => !saving && setShowAddModal(false)}>
                    <div className="modal" style={{ maxWidth: '600px' }} onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3 className="modal-title">{editingReview ? 'Edit Review' : 'Add New Review'}</h3>
                            <button className="modal-close" onClick={() => setShowAddModal(false)}>
                                <X size={20} />
                            </button>
                        </div>
                        <div className="form-content" style={{ marginTop: '20px' }}>
                            <div className="form-group">
                                <label className="form-label">Student Name *</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.userName}
                                    onChange={e => setFormData({ ...formData, userName: e.target.value })}
                                    placeholder="e.g. Rahul Sharma"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Class/Context</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.studentClass}
                                    onChange={e => setFormData({ ...formData, studentClass: e.target.value })}
                                    placeholder="e.g. Class 10th Student"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Rating (1-5)</label>
                                <div className="rating-select" style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
                                    {[1, 2, 3, 4, 5].map(num => (
                                        <Star
                                            key={num}
                                            size={24}
                                            style={{ cursor: 'pointer' }}
                                            fill={num <= formData.rating ? "#f1c40f" : "none"}
                                            color={num <= formData.rating ? "#f1c40f" : "#bdc3c7"}
                                            onClick={() => setFormData({ ...formData, rating: num })}
                                        />
                                    ))}
                                </div>
                            </div>
                            <div className="form-group">
                                <label className="form-label">Comment/Review *</label>
                                <textarea
                                    className="form-input"
                                    style={{ minHeight: '120px', resize: 'vertical' }}
                                    value={formData.comment}
                                    onChange={e => setFormData({ ...formData, comment: e.target.value })}
                                    placeholder="What did the student say exactly?"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Status</label>
                                <select
                                    className="form-select"
                                    value={formData.status}
                                    onChange={e => setFormData({ ...formData, status: e.target.value })}
                                >
                                    <option value="active">Active (Visible)</option>
                                    <option value="hidden">Hidden</option>
                                </select>
                            </div>
                        </div>
                        <div className="modal-footer" style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                            <button className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                            <button className="btn btn-primary" onClick={handleSave} disabled={saving}>
                                {saving ? <Loader2 size={16} className="spin" /> : <Save size={16} />}
                                <span>{saving ? 'Saving...' : 'Save Review'}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .reviews-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                }
                .review-card {
                    padding: 24px;
                    display: flex;
                    flex-direction: column;
                }
                .review-card-header { 
                    display: flex; 
                    justify-content: space-between; 
                    align-items: center; 
                    margin-bottom: 16px; 
                }
                .stars { display: flex; gap: 4px; }
                .reviewer-name { 
                    font-size: 18px; 
                    font-weight: 700; 
                    color: var(--text-primary); 
                    margin-bottom: 4px; 
                }
                .reviewer-class { 
                    font-size: 13px; 
                    color: var(--text-secondary); 
                    margin-bottom: 16px; 
                }
                .review-text { 
                    font-size: 14px; 
                    color: var(--text-primary); 
                    line-height: 1.6; 
                    font-style: italic; 
                    margin-bottom: 24px;
                    flex: 1;
                }
                .review-actions { 
                    display: flex; 
                    justify-content: flex-end; 
                    gap: 12px; 
                    padding-top: 16px;
                    border-top: 1px solid var(--border-light);
                }
                .notification {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    padding: 16px 24px;
                    border-radius: var(--radius-md);
                    background: white;
                    box-shadow: var(--shadow-lg);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 2000;
                    animation: slideIn 0.3s ease;
                }
                .notification.success { border-left: 4px solid var(--success); }
                .notification.error { border-left: 4px solid var(--error); }
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
                .spin {
                    animation: spin 1s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .action-btn.danger:hover {
                    color: var(--error);
                    background: rgba(231, 76, 60, 0.1);
                }
            `}</style>
        </div>
    );
}

export default Reviews;
