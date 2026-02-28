import { useState, useEffect } from 'react';
import {
    Search,
    Plus,
    Edit2,
    Trash2,
    HelpCircle,
    Save,
    X,
    PlusCircle,
    MinusCircle,
    Loader2,
    CheckCircle,
    AlertCircle,
    Filter,
    ChevronDown,
    ChevronUp,
    MoreVertical,
    LayoutGrid,
    List,
    BookOpen,
    Clock,
    Check
} from 'lucide-react';

const API_URL = 'https://genii-backend.vercel.app/api';

const classOptions = [
    { id: 'all', name: 'All Classes', color: '#3498db' },
    { id: 'class10', name: 'Class 10', color: '#e67e22' },
    { id: 'class11', name: 'Class 11', color: '#2ecc71' },
    { id: 'class12', name: 'Class 12', color: '#9b59b6' },
    { id: 'neet', name: 'NEET', color: '#e74c3c' },
];

const boardOptions = [
    { id: 'all', name: 'All Boards' },
    { id: 'state', name: 'State Board' },
    { id: 'cbse', name: 'CBSE' },
];

const subjectOptions = [
    'Mathematics', 'Physics', 'Chemistry', 'Biology',
    'Science', 'English', 'Social Science', 'Botany', 'Zoology'
];

function MCQs() {
    const [mcqSets, setMcqSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [showModal, setShowModal] = useState(false);
    const [editingSet, setEditingSet] = useState(null);
    const [saving, setSaving] = useState(false);
    const [notification, setNotification] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        classId: 'class10',
        board: 'state',
        subject: 'Mathematics',
        status: 'published',
        questions: [
            { question: '', options: ['', '', '', ''], correctAnswer: 0 }
        ]
    });

    useEffect(() => {
        fetchMcqSets();
    }, [classFilter, boardFilter]);

    const fetchMcqSets = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams({ type: 'mcq' });
            if (classFilter !== 'all') params.append('classId', classFilter);
            if (boardFilter !== 'all') params.append('board', boardFilter);

            const response = await fetch(`${API_URL}/content/admin?${params.toString()}`);
            const data = await response.json();

            if (data.success) {
                setMcqSets(data.data || []);
            }
        } catch (error) {
            console.error('Error fetching MCQs:', error);
            showNotification('Failed to fetch MCQs', 'error');
        } finally {
            setLoading(false);
        }
    };

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const handleOpenModal = (set = null) => {
        if (set) {
            setEditingSet(set);
            setFormData({
                title: set.title,
                description: set.description || '',
                classId: set.classId,
                board: set.board || 'state',
                subject: set.subject,
                status: set.status || 'published',
                questions: set.questions || [{ question: '', options: ['', '', '', ''], correctAnswer: 0 }]
            });
        } else {
            setEditingSet(null);
            setFormData({
                title: '',
                description: '',
                classId: 'class10',
                board: 'state',
                subject: 'Mathematics',
                status: 'published',
                questions: [
                    { question: '', options: ['', '', '', ''], correctAnswer: 0 }
                ]
            });
        }
        setShowModal(true);
    };

    const handleAddQuestion = () => {
        setFormData({
            ...formData,
            questions: [...formData.questions, { question: '', options: ['', '', '', ''], correctAnswer: 0 }]
        });
    };

    const handleRemoveQuestion = (index) => {
        if (formData.questions.length === 1) return;
        const newQuestions = formData.questions.filter((_, i) => i !== index);
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[index][field] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...formData.questions];
        newQuestions[qIndex].options[oIndex] = value;
        setFormData({ ...formData, questions: newQuestions });
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            setSaving(true);
            const method = editingSet ? 'PUT' : 'POST';
            const url = editingSet ? `${API_URL}/content/${editingSet.contentId}` : `${API_URL}/content`;

            const payload = {
                ...formData,
                type: 'mcq',
                updatedAt: new Date().toISOString()
            };

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (data.success) {
                showNotification(`MCQ Set ${editingSet ? 'updated' : 'created'} successfully`);
                setShowModal(false);
                fetchMcqSets();
            } else {
                showNotification(data.message || 'Error saving MCQ', 'error');
            }
        } catch (error) {
            console.error('Save error:', error);
            showNotification('Failed to save MCQ', 'error');
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (contentId) => {
        if (!window.confirm('Are you sure you want to delete this MCQ set? This action cannot be undone.')) return;

        try {
            const response = await fetch(`${API_URL}/content/${contentId}`, {
                method: 'DELETE'
            });

            const data = await response.json();

            if (data.success) {
                showNotification('MCQ Set deleted successfully');
                fetchMcqSets();
            }
        } catch (error) {
            console.error('Delete error:', error);
            showNotification('Failed to delete MCQ', 'error');
        }
    };

    const filteredSets = mcqSets.filter(set =>
        set.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        set.subject.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="mcq-admin-container">
            {/* Page Header */}
            <header className="page-header-premium">
                <div className="header-left">
                    <div className="title-with-icon">
                        <div className="icon-badge">
                            <HelpCircle size={28} />
                        </div>
                        <div>
                            <h1>MCQ Bank</h1>
                            <p>Design and manage interactive practice assessments</p>
                        </div>
                    </div>
                </div>
                <div className="header-actions">
                    <div className="view-toggle-btns">
                        <button
                            className={`toggle-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            <LayoutGrid size={18} />
                        </button>
                        <button
                            className={`toggle-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            <List size={18} />
                        </button>
                    </div>
                    <button className="btn-create-mcq" onClick={() => handleOpenModal()}>
                        <Plus size={20} />
                        <span>Create Practice Set</span>
                    </button>
                </div>
            </header>

            {notification && (
                <div className={`notification-anim ${notification.type}`}>
                    {notification.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
                    <span>{notification.message}</span>
                </div>
            )}

            {/* Filters Section */}
            <section className="filters-section-premium">
                <div className="search-box-premium">
                    <Search size={20} />
                    <input
                        type="text"
                        placeholder="Search assessments by topic or subject..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-group-premium">
                    <div className="select-wrapper">
                        <Filter size={16} />
                        <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                            {classOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                    <div className="select-wrapper">
                        <BookOpen size={16} />
                        <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
                            {boardOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.name}</option>)}
                        </select>
                    </div>
                </div>
            </section>

            {/* Content Display */}
            <div className="content-display-area">
                {loading ? (
                    <div className="loading-state-premium">
                        <Loader2 size={48} className="spin-slow" />
                        <h3>Curating assessment sets...</h3>
                    </div>
                ) : filteredSets.length === 0 ? (
                    <div className="empty-state-premium">
                        <div className="empty-icon-bg">
                            <PlusCircle size={60} />
                        </div>
                        <h3>No MCQs Found</h3>
                        <p>You haven't added any practice sets for this selection yet.</p>
                        <button className="btn-outline" onClick={() => handleOpenModal()}>
                            Add Your First MCQ
                        </button>
                    </div>
                ) : viewMode === 'grid' ? (
                    <div className="mcq-grid-premium">
                        {filteredSets.map((set) => (
                            <div key={set.contentId} className="mcq-card-premium">
                                <div className="card-top-decorator" style={{ backgroundColor: classOptions.find(c => c.id === set.classId)?.color || '#3498db' }}></div>
                                <div className="mcq-card-header">
                                    <span className="subject-label">{set.subject}</span>
                                    <div className="status-indicator">
                                        <div className={`status-dot ${set.status}`}></div>
                                        <span className="status-text">{set.status}</span>
                                    </div>
                                </div>
                                <div className="mcq-card-body">
                                    <h3 className="card-title-text">{set.title}</h3>
                                    <p className="card-description-text">{set.description || 'No description provided.'}</p>
                                </div>
                                <div className="mcq-card-stats">
                                    <div className="stat-item">
                                        <HelpCircle size={14} />
                                        <span>{set.questions?.length || 0} Questions</span>
                                    </div>
                                    <div className="stat-item">
                                        <Clock size={14} />
                                        <span>{new Date(set.updatedAt || set.createdAt).toLocaleDateString()}</span>
                                    </div>
                                </div>
                                <div className="mcq-card-footer">
                                    <span className="class-badge">
                                        {classOptions.find(c => c.id === set.classId)?.name}
                                    </span>
                                    <div className="action-row">
                                        <button className="icon-btn edit" title="Edit Assessment" onClick={() => handleOpenModal(set)}>
                                            <Edit2 size={18} />
                                        </button>
                                        <button className="icon-btn delete" title="Remove" onClick={() => handleDelete(set.contentId)}>
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="table-wrapper-premium">
                        <table className="table-premium">
                            <thead>
                                <tr>
                                    <th>Assessment Title</th>
                                    <th>Grade & Board</th>
                                    <th>Subject</th>
                                    <th>Volume</th>
                                    <th>Visibility</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredSets.map((set) => (
                                    <tr key={set.contentId}>
                                        <td>
                                            <div className="title-cell-premium">
                                                <div className="title-icon">
                                                    <FileText size={18} />
                                                </div>
                                                <div>
                                                    <span className="main-title">{set.title}</span>
                                                    <span className="sub-detail">{set.description?.substring(0, 40)}...</span>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="meta-cell">
                                                <span className="badge-class">{classOptions.find(c => c.id === set.classId)?.name}</span>
                                                <span className="divider">•</span>
                                                <span className="text-secondary">{set.board}</span>
                                            </div>
                                        </td>
                                        <td><span className="subject-tag">{set.subject}</span></td>
                                        <td><span className="q-count-badge">{set.questions?.length || 0} Qs</span></td>
                                        <td>
                                            <span className={`status-pill ${set.status}`}>
                                                {set.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="action-btns-premium">
                                                <button className="btn-icon edit" onClick={() => handleOpenModal(set)}><Edit2 size={16} /></button>
                                                <button className="btn-icon delete" onClick={() => handleDelete(set.contentId)}><Trash2 size={16} /></button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* MCQ Modal Premium */}
            {showModal && (
                <div className="modal-overlay-premium">
                    <div className="glass-modal mcq-editor">
                        <div className="modal-sidebar-decor"></div>
                        <div className="modal-header-premium">
                            <div className="modal-title-area">
                                <div className="modal-icon-bg">
                                    <PlusCircle size={24} />
                                </div>
                                <div>
                                    <h2>{editingSet ? 'Assessment Architect' : 'New Assessment Builder'}</h2>
                                    <p>{editingSet ? `Modifying "${editingSet.title}"` : 'Constructing a new interactive practice set'}</p>
                                </div>
                            </div>
                            <button className="modal-close-icon" onClick={() => setShowModal(false)}><X size={24} /></button>
                        </div>

                        <form onSubmit={handleSave} className="assessment-form">
                            <div className="form-layout-split">
                                <div className="assessment-details-panel">
                                    <div className="panel-inner">
                                        <h4>Configuration</h4>
                                        <div className="form-group-fancy">
                                            <label>Set Title</label>
                                            <input
                                                type="text"
                                                required
                                                value={formData.title}
                                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                                placeholder="e.g., Quantum Mechanics Part 1"
                                            />
                                        </div>
                                        <div className="form-group-fancy">
                                            <label>Objective / Description</label>
                                            <textarea
                                                rows="3"
                                                value={formData.description}
                                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                                placeholder="Describe the learning outcomes of this set"
                                            />
                                        </div>
                                        <div className="form-row-compact">
                                            <div className="form-group-fancy">
                                                <label>Class</label>
                                                <select
                                                    value={formData.classId}
                                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                                >
                                                    {classOptions.filter(o => o.id !== 'all').map(opt => (
                                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                                    ))}
                                                </select>
                                            </div>
                                            <div className="form-group-fancy">
                                                <label>Subject</label>
                                                <select
                                                    value={formData.subject}
                                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                                >
                                                    {subjectOptions.map(opt => (
                                                        <option key={opt} value={opt}>{opt}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        <div className="form-group-fancy">
                                            <label>Publication Status</label>
                                            <div className="status-selector-fancy">
                                                <div
                                                    className={`status-option ${formData.status === 'published' ? 'selected active' : ''}`}
                                                    onClick={() => setFormData({ ...formData, status: 'published' })}
                                                >
                                                    <CheckCircle size={18} />
                                                    <span>Published</span>
                                                </div>
                                                <div
                                                    className={`status-option ${formData.status === 'draft' ? 'selected draft' : ''}`}
                                                    onClick={() => setFormData({ ...formData, status: 'draft' })}
                                                >
                                                    <Clock size={18} />
                                                    <span>Draft Mode</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="question-composer-panel">
                                    <div className="composer-header-sticky">
                                        <div className="header-label">
                                            <h4>Question Canvas</h4>
                                            <span className="q-chip">{formData.questions.length} Items</span>
                                        </div>
                                        <button type="button" className="btn-append-question" onClick={handleAddQuestion}>
                                            <Plus size={18} /> Add New Entry
                                        </button>
                                    </div>

                                    <div className="question-scroller">
                                        {formData.questions.map((q, qIndex) => (
                                            <div key={qIndex} className="question-entry-card">
                                                <div className="q-card-header">
                                                    <div className="q-num-badge">Q{qIndex + 1}</div>
                                                    <button type="button" className="btn-entry-remove" onClick={() => handleRemoveQuestion(qIndex)}>
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                                <div className="q-card-body">
                                                    <div className="form-group-plain">
                                                        <label>Question Prompt</label>
                                                        <textarea
                                                            placeholder="State the question clearly..."
                                                            value={q.question}
                                                            onChange={(e) => handleQuestionChange(qIndex, 'question', e.target.value)}
                                                            required
                                                        />
                                                    </div>
                                                    <div className="options-composer">
                                                        <label>Response Options (Select the correct one)</label>
                                                        <div className="options-matrix">
                                                            {q.options.map((opt, oIndex) => (
                                                                <div key={oIndex} className={`option-input-group ${q.correctAnswer === oIndex ? 'active' : ''}`}>
                                                                    <div className="input-with-indicator">
                                                                        <div
                                                                            className="correct-hitbox"
                                                                            onClick={() => handleQuestionChange(qIndex, 'correctAnswer', oIndex)}
                                                                        >
                                                                            <div className="radio-aesthetic">
                                                                                {q.correctAnswer === oIndex && <Check size={12} />}
                                                                            </div>
                                                                        </div>
                                                                        <input
                                                                            type="text"
                                                                            value={opt}
                                                                            onChange={(e) => handleOptionChange(qIndex, oIndex, e.target.value)}
                                                                            placeholder={`Option ${String.fromCharCode(65 + oIndex)}`}
                                                                            required
                                                                        />
                                                                    </div>
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <footer className="assessment-footer">
                                <div className="footer-stats">
                                    <span>Payload Size: ~{(JSON.stringify(formData).length / 1024).toFixed(1)} KB</span>
                                </div>
                                <div className="footer-btns">
                                    <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Discard Changes</button>
                                    <button type="submit" className="btn-save-final" disabled={saving}>
                                        {saving ? <Loader2 className="spin-fast" /> : <Save size={20} />}
                                        {editingSet ? 'Update Assessment' : 'Launch Assessment'}
                                    </button>
                                </div>
                            </footer>
                        </form>
                    </div>
                </div>
            )}

            <style>{`
                /* Global Root Variables for Admin Theme (if not already set) */
                :root {
                    --admin-primary: #6366f1;
                    --admin-primary-dark: #4f46e5;
                    --admin-success: #10b981;
                    --admin-warning: #f59e0b;
                    --admin-danger: #ef4444;
                    --admin-bg: #f8fafc;
                    --admin-card: #ffffff;
                    --admin-text-main: #1e293b;
                    --admin-text-sub: #64748b;
                    --admin-border: #e2e8f0;
                    --admin-radius-lg: 12px;
                    --admin-shadow-sm: 0 1px 3px rgba(0,0,0,0.1);
                    --admin-shadow-md: 0 4px 6px -1px rgba(0,0,0,0.1);
                }

                .mcq-admin-container {
                    padding: 24px;
                    background: var(--admin-bg);
                    min-height: 100vh;
                    font-family: 'Inter', -apple-system, sans-serif;
                }

                /* Header Styling */
                .page-header-premium {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 32px;
                }

                .title-with-icon {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .icon-badge {
                    width: 56px;
                    height: 56px;
                    background: white;
                    color: var(--admin-primary);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 16px;
                    box-shadow: var(--admin-shadow-md);
                }

                .title-with-icon h1 {
                    font-size: 28px;
                    font-weight: 800;
                    color: var(--admin-text-main);
                    margin: 0;
                }

                .title-with-icon p {
                    color: var(--admin-text-sub);
                    margin: 4px 0 0;
                }

                .header-actions {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .view-toggle-btns {
                    display: flex;
                    background: #e2e8f0;
                    padding: 4px;
                    border-radius: 10px;
                }

                .toggle-btn {
                    padding: 8px 12px;
                    border: none;
                    background: transparent;
                    color: #64748b;
                    cursor: pointer;
                    border-radius: 8px;
                    transition: all 0.2s;
                    display: flex;
                    align-items: center;
                }

                .toggle-btn.active {
                    background: white;
                    color: var(--admin-primary);
                    box-shadow: 0 2px 4px rgba(0,0,0,0.05);
                }

                .btn-create-mcq {
                    background: var(--admin-primary);
                    color: white;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 600;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
                }

                .btn-create-mcq:hover {
                    background: var(--admin-primary-dark);
                    transform: translateY(-2px);
                }

                /* Filters Section */
                .filters-section-premium {
                    background: white;
                    padding: 16px 24px;
                    border-radius: 16px;
                    box-shadow: var(--admin-shadow-sm);
                    margin-bottom: 24px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    gap: 24px;
                }

                .search-box-premium {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .search-box-premium svg {
                    position: absolute;
                    left: 16px;
                    color: #94a3b8;
                }

                .search-box-premium input {
                    width: 100%;
                    padding: 12px 16px 12px 48px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .search-box-premium input:focus {
                    outline: none;
                    border-color: var(--admin-primary);
                    box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1);
                }

                .filter-group-premium {
                    display: flex;
                    gap: 12px;
                }

                .select-wrapper {
                    position: relative;
                    display: flex;
                    align-items: center;
                }

                .select-wrapper svg {
                    position: absolute;
                    left: 12px;
                    color: #94a3b8;
                    pointer-events: none;
                }

                .select-wrapper select {
                    padding: 10px 16px 10px 36px;
                    border: 1px solid #e2e8f0;
                    border-radius: 10px;
                    background: white;
                    font-weight: 500;
                    color: #475569;
                    cursor: pointer;
                    appearance: none;
                    min-width: 160px;
                }

                /* Grid Card Styles */
                .mcq-grid-premium {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 24px;
                }

                .mcq-card-premium {
                    background: white;
                    border-radius: 20px;
                    padding: 24px;
                    position: relative;
                    overflow: hidden;
                    box-shadow: var(--admin-shadow-sm);
                    transition: all 0.3s;
                    border: 1px solid #f1f5f9;
                    display: flex;
                    flex-direction: column;
                }

                .mcq-card-premium:hover {
                    box-shadow: 0 10px 25px -5px rgba(0,0,0,0.1);
                    transform: translateY(-4px);
                }

                .card-top-decorator {
                    position: absolute;
                    top: 0;
                    left: 0;
                    right: 0;
                    height: 6px;
                }

                .mcq-card-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 20px;
                }

                .subject-label {
                    background: #f1f5f9;
                    color: #475569;
                    padding: 4px 12px;
                    border-radius: 30px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .status-indicator {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                }

                .status-dot {
                    width: 8px;
                    height: 8px;
                    border-radius: 50%;
                }

                .status-dot.published { background: var(--admin-success); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4); }
                .status-dot.draft { background: var(--admin-warning); }

                .status-text {
                    font-size: 12px;
                    color: #64748b;
                    font-weight: 500;
                    text-transform: capitalize;
                }

                .card-title-text {
                    font-size: 19px;
                    font-weight: 700;
                    color: var(--admin-text-main);
                    margin: 0 0 10px;
                    line-height: 1.4;
                }

                .card-description-text {
                    font-size: 14px;
                    color: var(--admin-text-sub);
                    line-height: 1.6;
                    margin: 0;
                    display: -webkit-box;
                    -webkit-line-clamp: 2;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }

                .mcq-card-stats {
                    display: flex;
                    gap: 16px;
                    margin-top: 20px;
                    padding-bottom: 20px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    color: #94a3b8;
                    font-size: 13px;
                }

                .mcq-card-footer {
                    margin-top: 16px;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .class-badge {
                    font-size: 13px;
                    font-weight: 600;
                    color: #64748b;
                }

                .action-row {
                    display: flex;
                    gap: 8px;
                }

                .icon-btn {
                    width: 38px;
                    height: 38px;
                    border-radius: 10px;
                    border: none;
                    background: #f8fafc;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .icon-btn.edit { color: var(--admin-primary); }
                .icon-btn.delete { color: var(--admin-danger); }

                .icon-btn.edit:hover { background: #eef2ff; color: #4338ca; }
                .icon-btn.delete:hover { background: #fef2f2; color: #b91c1c; }

                /* Table Styling Premium */
                .table-wrapper-premium {
                    background: white;
                    border-radius: 16px;
                    box-shadow: var(--admin-shadow-sm);
                    overflow: hidden;
                    border: 1px solid #f1f5f9;
                }

                .table-premium {
                    width: 100%;
                    border-collapse: collapse;
                }

                .table-premium th {
                    background: #f8fafc;
                    padding: 16px 24px;
                    text-align: left;
                    font-size: 12px;
                    font-weight: 700;
                    color: #64748b;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                }

                .table-premium td {
                    padding: 16px 24px;
                    border-bottom: 1px solid #f1f5f9;
                }

                .title-cell-premium {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .title-icon {
                    width: 40px;
                    height: 40px;
                    background: #f1f5f9;
                    color: #475569;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .main-title {
                    display: block;
                    font-weight: 600;
                    color: var(--admin-text-main);
                }

                .sub-detail {
                    font-size: 12px;
                    color: var(--admin-text-sub);
                }

                .badge-class {
                    background: #eef2ff;
                    color: #4338ca;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 600;
                }

                .status-pill {
                    padding: 4px 12px;
                    border-radius: 20px;
                    font-size: 11px;
                    font-weight: 700;
                    text-transform: uppercase;
                }

                .status-pill.published { background: #d1fae5; color: #065f46; }
                .status-pill.draft { background: #fef3c7; color: #92400e; }

                /* Modal Premium Styles */
                .modal-overlay-premium {
                    fixed: 0;
                    position: fixed;
                    top: 0; left: 0; right: 0; bottom: 0;
                    background: rgba(15, 23, 42, 0.6);
                    backdrop-filter: blur(8px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 1000;
                    padding: 24px;
                }

                .glass-modal {
                    background: white;
                    border-radius: 28px;
                    width: 100%;
                    max-width: 1200px;
                    height: 90vh;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25);
                    position: relative;
                }

                .modal-sidebar-decor {
                    position: absolute;
                    left: 0; top: 0; bottom: 0;
                    width: 8px;
                    background: var(--admin-primary);
                }

                .modal-header-premium {
                    padding: 32px 40px;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .modal-title-area {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                }

                .modal-icon-bg {
                    width: 48px;
                    height: 48px;
                    background: #eef2ff;
                    color: var(--admin-primary);
                    border-radius: 12px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }

                .modal-title-area h2 {
                    margin: 0;
                    font-size: 24px;
                    font-weight: 800;
                }

                .modal-title-area p {
                    margin: 4px 0 0;
                    color: #64748b;
                }

                .modal-close-icon {
                    background: none;
                    border: none;
                    color: #94a3b8;
                    cursor: pointer;
                    transition: color 0.2s;
                }

                .modal-close-icon:hover { color: #1e293b; }

                .assessment-form {
                    flex: 1;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .form-layout-split {
                    flex: 1;
                    display: grid;
                    grid-template-columns: 380px 1fr;
                    overflow: hidden;
                }

                .assessment-details-panel {
                    border-right: 1px solid #f1f5f9;
                    background: #f8fafc;
                    padding: 32px 40px;
                    overflow-y: auto;
                }

                .assessment-details-panel h4 {
                    font-size: 14px;
                    text-transform: uppercase;
                    color: #94a3b8;
                    margin-bottom: 24px;
                    letter-spacing: 1px;
                }

                .form-group-fancy {
                    margin-bottom: 24px;
                }

                .form-group-fancy label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #475569;
                    margin-bottom: 8px;
                }

                .form-group-fancy input, 
                .form-group-fancy select, 
                .form-group-fancy textarea {
                    width: 100%;
                    padding: 12px 14px;
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    background: white;
                    font-size: 15px;
                    transition: all 0.2s;
                }

                .form-group-fancy input:focus { border-color: var(--admin-primary); outline: none; box-shadow: 0 0 0 4px rgba(99, 102, 241, 0.1); }

                .form-row-compact {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .status-selector-fancy {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 12px;
                }

                .status-option {
                    padding: 12px;
                    border-radius: 12px;
                    border: 1px solid #e2e8f0;
                    background: white;
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                    color: #64748b;
                }

                .status-option span { font-size: 12px; font-weight: 600; }

                .status-option.selected.active {
                    background: #ecfdf5;
                    border-color: var(--admin-success);
                    color: var(--admin-success);
                }

                .status-option.selected.draft {
                    background: #fffbeb;
                    border-color: var(--admin-warning);
                    color: var(--admin-warning);
                }

                /* Question Composer Area */
                .question-composer-panel {
                    padding: 0;
                    display: flex;
                    flex-direction: column;
                    overflow: hidden;
                }

                .composer-header-sticky {
                    padding: 24px 40px;
                    background: white;
                    border-bottom: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    z-index: 10;
                }

                .header-label {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .header-label h4 { margin: 0; font-size: 18px; font-weight: 700; color: #1e293b; }

                .q-chip {
                    background: #eef2ff;
                    color: var(--admin-primary);
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 12px;
                    font-weight: 700;
                }

                .btn-append-question {
                    background: #f1f5f9;
                    border: none;
                    color: #475569;
                    padding: 10px 18px;
                    border-radius: 10px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-append-question:hover { background: #e2e8f0; color: #1e293b; }

                .question-scroller {
                    flex: 1;
                    padding: 32px 40px;
                    overflow-y: auto;
                    background: #f1f5f9;
                    display: flex;
                    flex-direction: column;
                    gap: 24px;
                }

                .question-entry-card {
                    background: white;
                    border-radius: 20px;
                    box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);
                    padding: 32px;
                    border: 1px solid #e2e8f0;
                }

                .q-card-header {
                    display: flex;
                    justify-content: space-between;
                    margin-bottom: 24px;
                }

                .q-num-badge {
                    width: 36px;
                    height: 36px;
                    background: #1e293b;
                    color: white;
                    border-radius: 10px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: 800;
                    font-size: 14px;
                }

                .btn-entry-remove {
                    background: #fef2f2;
                    color: var(--admin-danger);
                    border: none;
                    width: 36px;
                    height: 36px;
                    border-radius: 10px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-entry-remove:hover { background: var(--admin-danger); color: white; }

                .form-group-plain label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 12px;
                }

                .form-group-plain textarea {
                    width: 100%;
                    padding: 16px;
                    border: 1px solid #e2e8f0;
                    border-radius: 16px;
                    font-size: 16px;
                    line-height: 1.6;
                    min-height: 100px;
                    background: #f8fafc;
                }

                .options-composer {
                    margin-top: 32px;
                }

                .options-composer label {
                    display: block;
                    font-size: 13px;
                    font-weight: 700;
                    color: #64748b;
                    margin-bottom: 16px;
                }

                .options-matrix {
                    display: grid;
                    grid-template-columns: 1fr 1fr;
                    gap: 16px;
                }

                .option-input-group {
                    border: 1px solid #e2e8f0;
                    border-radius: 12px;
                    transition: all 0.2s;
                }

                .option-input-group.active {
                    border-color: var(--admin-success);
                    background: #f0fdf4;
                }

                .input-with-indicator {
                    display: flex;
                    align-items: center;
                }

                .correct-hitbox {
                    padding: 0 16px;
                    cursor: pointer;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    border-right: 1px solid #e2e8f0;
                }

                .radio-aesthetic {
                    width: 20px;
                    height: 20px;
                    border: 2px solid #cbd5e1;
                    border-radius: 6px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background: white;
                    color: var(--admin-success);
                }

                .option-input-group.active .radio-aesthetic {
                    border-color: var(--admin-success);
                    background: var(--admin-success);
                    color: white;
                }

                .input-with-indicator input {
                    flex: 1;
                    padding: 12px 16px;
                    border: none;
                    background: transparent;
                    font-size: 14px;
                    font-weight: 500;
                }

                .input-with-indicator input:focus { outline: none; }

                /* Modal Footer Styling */
                .assessment-footer {
                    padding: 24px 40px;
                    background: white;
                    border-top: 1px solid #f1f5f9;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .footer-stats span {
                    font-size: 12px;
                    color: #94a3b8;
                    font-weight: 600;
                }

                .footer-btns {
                    display: flex;
                    gap: 16px;
                }

                .btn-cancel {
                    background: #f1f5f9;
                    color: #475569;
                    border: none;
                    padding: 12px 24px;
                    border-radius: 12px;
                    font-weight: 700;
                    cursor: pointer;
                }

                .btn-save-final {
                    background: var(--admin-primary);
                    color: white;
                    border: none;
                    padding: 12px 32px;
                    border-radius: 12px;
                    font-weight: 700;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    cursor: pointer;
                    box-shadow: 0 4px 14px rgba(99, 102, 241, 0.4);
                }

                /* Misc Animations */
                .spin-slow { animation: spin 3s linear infinite; }
                .spin-fast { animation: spin 1s linear infinite; }
                @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

                .notification-anim {
                    position: fixed;
                    top: 24px;
                    right: 24px;
                    background: white;
                    padding: 16px 24px;
                    border-radius: 12px;
                    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1);
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    z-index: 1100;
                    animation: slideIn 0.3s ease;
                    border-left: 4px solid var(--admin-primary);
                }

                .notification-anim.success { border-color: var(--admin-success); color: #065f46; }
                .notification-anim.error { border-color: var(--admin-danger); color: #991b1b; }

                @keyframes slideIn {
                    from { opacity: 0; transform: translateX(20px); }
                    to { opacity: 1; transform: translateX(0); }
                }

                @media (max-width: 1024px) {
                    .form-layout-split { grid-template-columns: 1fr; }
                    .assessment-details-panel { border-right: none; border-bottom: 1px solid #f1f5f9; }
                }
            `}</style>
        </div>
    );
}

export default MCQs;
