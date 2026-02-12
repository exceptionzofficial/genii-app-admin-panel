import { useState, useEffect } from 'react';
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
    Star,
    ChevronDown,
    X,
    Save,
    Loader2,
    CheckCircle,
    AlertCircle
} from 'lucide-react';

const API_URL = 'https://genii-backend.vercel.app/api';

const classOptions = [
    { id: 'all', name: 'All Classes' },
    { id: 'class10', name: 'Class 10' },
    { id: 'class11', name: 'Class 11' },
    { id: 'class12', name: 'Class 12' },
    { id: 'neet', name: 'NEET' },
    { id: 'hardcopy', name: 'Hard Copy' },
];

const boardOptions = [
    { id: 'all', name: 'All Boards' },
    { id: 'state', name: 'State Board' },
    { id: 'cbse', name: 'CBSE' },
];

const typeOptions = [
    { id: 'all', name: 'All Types' },
    { id: 'pdf', name: 'PDFs' },
    { id: 'video', name: 'Videos' },
];

const subjectOptions = ['Mathematics', 'Physics', 'Chemistry', 'Biology', 'Science', 'English', 'Social Science', 'Botany', 'Zoology'];

function Content() {
    const [content, setContent] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [classFilter, setClassFilter] = useState('all');
    const [boardFilter, setBoardFilter] = useState('all');
    const [typeFilter, setTypeFilter] = useState('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingContent, setEditingContent] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState('');
    const [notification, setNotification] = useState(null);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
        type: 'pdf',
        classId: 'class10',
        board: 'state',
        subject: 'Mathematics',
        chapters: '',
        pages: '',
        lessons: '',
        duration: '',
        previewPages: 5,
        price: 199,
        isFree: false,
        status: 'draft',
        fileUrl: '',
        thumbnailUrl: '',
        publicId: ''
    });

    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedThumbnail, setSelectedThumbnail] = useState(null);
    const [uploadPercent, setUploadPercent] = useState(0);

    // Fetch content from API
    const fetchContent = async () => {
        try {
            setLoading(true);
            const params = new URLSearchParams();
            if (classFilter !== 'all') params.append('classId', classFilter);
            if (boardFilter !== 'all') params.append('board', boardFilter);
            if (typeFilter !== 'all') params.append('type', typeFilter);

            const response = await fetch(`${API_URL}/content/admin?${params}`);
            const data = await response.json();

            if (data.success) {
                setContent(data.data);
            }
        } catch (error) {
            console.error('Error fetching content:', error);
            showNotification('Failed to fetch content', 'error');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchContent();
    }, [classFilter, boardFilter, typeFilter]);

    const showNotification = (message, type = 'success') => {
        setNotification({ message, type });
        setTimeout(() => setNotification(null), 3000);
    };

    const filteredContent = content.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.subject.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    const getClassName = (classId) => {
        const cls = classOptions.find(c => c.id === classId);
        return cls ? cls.name : classId;
    };

    const getBoardName = (boardId) => {
        if (!boardId) return 'N/A';
        const board = boardOptions.find(b => b.id === boardId);
        return board ? board.name : boardId;
    };

    const handleAddNew = () => {
        setEditingContent(null);
        setFormData({
            title: '',
            description: '',
            type: 'pdf',
            classId: 'class10',
            board: 'state',
            subject: 'Mathematics',
            chapters: '',
            pages: '',
            lessons: '',
            duration: '',
            previewPages: 5,
            price: 199,
            isFree: false,
            status: 'draft',
            fileUrl: '',
            thumbnailUrl: '',
            publicId: ''
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setShowAddModal(true);
    };

    const handleEdit = (item) => {
        setEditingContent(item);
        setFormData({
            title: item.title,
            description: item.description || '',
            type: item.type,
            classId: item.classId,
            board: item.board || 'state',
            subject: item.subject,
            chapters: item.chapters || '',
            pages: item.pages || '',
            lessons: item.lessons || '',
            duration: item.duration || '',
            previewPages: item.previewPages || 5,
            price: item.price || 0,
            isFree: item.isFree || false,
            status: item.status,
            fileUrl: item.fileUrl || '',
            thumbnailUrl: item.thumbnailUrl || '',
            publicId: item.publicId || ''
        });
        setSelectedFile(null);
        setSelectedThumbnail(null);
        setShowAddModal(true);
    };

    // Direct S3 upload using presigned URL (bypasses Vercel 4.5MB limit)
    const uploadFile = async (file, type) => {
        try {
            // Step 1: Get presigned URL from backend
            setUploadProgress('Preparing upload...');
            const folder = type === 'pdf' ? 'pdfs' : 'videos';

            const presignedResponse = await fetch(`${API_URL}/upload/presigned`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    folder: folder
                })
            });

            const presignedData = await presignedResponse.json();

            if (!presignedData.success) {
                throw new Error(presignedData.message || 'Failed to get upload URL');
            }

            const { uploadUrl, publicUrl, key } = presignedData.data;

            // Step 2: Upload directly to S3 with progress tracking
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();

                xhr.upload.addEventListener('progress', (event) => {
                    if (event.lengthComputable) {
                        const percent = Math.round((event.loaded / event.total) * 100);
                        setUploadPercent(percent);
                        const uploadedMB = (event.loaded / 1024 / 1024).toFixed(1);
                        const totalMB = (event.total / 1024 / 1024).toFixed(1);
                        setUploadProgress(`Uploading ${type.toUpperCase()}... ${percent}% (${uploadedMB}/${totalMB} MB)`);
                    }
                });

                xhr.addEventListener('load', () => {
                    if (xhr.status >= 200 && xhr.status < 300) {
                        resolve({
                            success: true,
                            data: {
                                url: publicUrl,
                                key: key
                            }
                        });
                    } else {
                        reject(new Error(`Upload failed with status ${xhr.status}`));
                    }
                });

                xhr.addEventListener('error', () => {
                    reject(new Error('Network error during upload'));
                });

                xhr.addEventListener('abort', () => {
                    reject(new Error('Upload was cancelled'));
                });

                xhr.open('PUT', uploadUrl);
                xhr.setRequestHeader('Content-Type', file.type);
                xhr.send(file);
            });
        } catch (error) {
            throw error;
        }
    };

    // Direct S3 upload for thumbnails using presigned URL
    const uploadThumbnail = async (file) => {
        try {
            setUploadProgress('Uploading thumbnail...');

            const presignedResponse = await fetch(`${API_URL}/upload/presigned`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    fileName: file.name,
                    fileType: file.type,
                    folder: 'thumbnails'
                })
            });

            const presignedData = await presignedResponse.json();

            if (!presignedData.success) {
                throw new Error(presignedData.message || 'Failed to get upload URL');
            }

            const { uploadUrl, publicUrl } = presignedData.data;

            // Upload directly to S3
            const uploadResponse = await fetch(uploadUrl, {
                method: 'PUT',
                headers: { 'Content-Type': file.type },
                body: file
            });

            if (!uploadResponse.ok) {
                throw new Error('Thumbnail upload failed');
            }

            return {
                success: true,
                data: { url: publicUrl }
            };
        } catch (error) {
            return { success: false, error: error.message };
        }
    };

    const handleSave = async () => {
        try {
            setUploading(true);
            let fileUrl = formData.fileUrl;
            let thumbnailUrl = formData.thumbnailUrl;
            let publicId = formData.publicId;

            // Upload main file if selected
            if (selectedFile) {
                setUploadProgress(`Uploading ${formData.type.toUpperCase()}...`);
                const uploadResult = await uploadFile(selectedFile, formData.type);

                if (!uploadResult.success) {
                    throw new Error(uploadResult.message || 'File upload failed');
                }

                fileUrl = uploadResult.data.url;
                publicId = uploadResult.data.publicId;
            }

            // Upload thumbnail if selected
            if (selectedThumbnail) {
                setUploadProgress('Uploading thumbnail...');
                const thumbResult = await uploadThumbnail(selectedThumbnail);

                if (thumbResult.success) {
                    thumbnailUrl = thumbResult.data.url;
                }
            }

            setUploadProgress('Saving content...');

            const contentData = {
                ...formData,
                fileUrl,
                thumbnailUrl,
                publicId,
                board: formData.classId === 'neet' ? null : formData.board,
                chapters: formData.type === 'pdf' ? parseInt(formData.chapters) || 0 : 0,
                pages: formData.type === 'pdf' ? parseInt(formData.pages) || 0 : 0,
                lessons: formData.type === 'video' ? parseInt(formData.lessons) || 0 : 0,
            };

            const url = editingContent
                ? `${API_URL}/content/${editingContent.contentId || editingContent._id}`
                : `${API_URL}/content`;

            const method = editingContent ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(contentData)
            });

            const result = await response.json();

            if (result.success) {
                showNotification(editingContent ? 'Content updated successfully!' : 'Content created successfully!');
                setShowAddModal(false);
                fetchContent();
            } else {
                throw new Error(result.message || 'Failed to save content');
            }
        } catch (error) {
            console.error('Save error:', error);
            showNotification(error.message, 'error');
        } finally {
            setUploading(false);
            setUploadProgress('');
            setUploadPercent(0);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this content?')) return;

        try {
            const response = await fetch(`${API_URL}/content/${id}`, {
                method: 'DELETE'
            });

            const result = await response.json();

            if (result.success) {
                showNotification('Content deleted successfully!');
                fetchContent();
            }
        } catch (error) {
            showNotification('Failed to delete content', 'error');
        }
    };

    const toggleStatus = async (id) => {
        try {
            const response = await fetch(`${API_URL}/content/${id}/status`, {
                method: 'PUT'
            });

            const result = await response.json();

            if (result.success) {
                showNotification(`Content ${result.data.status === 'published' ? 'published' : 'unpublished'}!`);
                fetchContent();
            }
        } catch (error) {
            showNotification('Failed to update status', 'error');
        }
    };

    return (
        <div className="page-container">
            {/* Notification */}
            {notification && (
                <div className={`notification ${notification.type}`}>
                    {notification.type === 'success' ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
                    <span>{notification.message}</span>
                </div>
            )}

            <div className="page-header">
                <div>
                    <h1 className="page-title">Content Management</h1>
                    <p className="page-subtitle">Upload and manage PDFs and Video courses</p>
                </div>
                <button className="btn-add" onClick={handleAddNew}>
                    <Plus size={18} />
                    <span>Add Content</span>
                </button>
            </div>

            {/* Stats */}
            <div className="content-stats">
                <div className="stat-item">
                    <FileText size={20} />
                    <span className="stat-value">{content.filter(c => c.type === 'pdf').length}</span>
                    <span className="stat-label">PDFs</span>
                </div>
                <div className="stat-item">
                    <Video size={20} />
                    <span className="stat-value">{content.filter(c => c.type === 'video').length}</span>
                    <span className="stat-label">Videos</span>
                </div>
                <div className="stat-item">
                    <Eye size={20} />
                    <span className="stat-value">{content.reduce((sum, c) => sum + (c.views || 0), 0).toLocaleString()}</span>
                    <span className="stat-label">Total Views</span>
                </div>
            </div>

            {/* Filters */}
            <div className="filters-bar">
                <div className="search-box">
                    <Search size={18} />
                    <input
                        type="text"
                        placeholder="Search content..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="filter-dropdown">
                    <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)}>
                        {classOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
                <div className="filter-dropdown">
                    <select value={boardFilter} onChange={(e) => setBoardFilter(e.target.value)}>
                        {boardOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
                <div className="filter-dropdown">
                    <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
                        {typeOptions.map(opt => (
                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                        ))}
                    </select>
                    <ChevronDown size={14} className="dropdown-icon" />
                </div>
            </div>

            {/* Content Grid */}
            {loading ? (
                <div className="loading-state">
                    <Loader2 size={32} className="spin" />
                    <p>Loading content...</p>
                </div>
            ) : filteredContent.length === 0 ? (
                <div className="empty-state">
                    <FileText size={48} />
                    <h3>No content found</h3>
                    <p>Start by adding some PDFs or Videos</p>
                    <button className="btn-add" onClick={handleAddNew}>
                        <Plus size={18} />
                        <span>Add Content</span>
                    </button>
                </div>
            ) : (
                <div className="content-grid">
                    {filteredContent.map(item => (
                        <div key={item.contentId || item._id} className="content-card">
                            <div className="content-header">
                                <div className={`content-type-badge ${item.type}`}>
                                    {item.type === 'pdf' ? <FileText size={14} /> : <Video size={14} />}
                                    <span>{item.type.toUpperCase()}</span>
                                </div>
                                <span className={`status-badge ${item.status}`}>
                                    {item.status}
                                </span>
                                {item.isFree && (
                                    <span className="status-badge free">
                                        Free
                                    </span>
                                )}
                            </div>

                            {item.thumbnailUrl && (
                                <div className="content-thumbnail">
                                    <img src={item.thumbnailUrl} alt={item.title} />
                                </div>
                            )}

                            <h3 className="content-title">{item.title}</h3>

                            {item.description && (
                                <p className="content-description">{item.description.substring(0, 100)}...</p>
                            )}

                            <div className="content-meta">
                                <span className="meta-item class">{getClassName(item.classId)}</span>
                                {item.board && <span className="meta-item board">{getBoardName(item.board)}</span>}
                                <span className="meta-item subject">{item.subject}</span>
                            </div>

                            <div className="content-details">
                                {item.type === 'pdf' ? (
                                    <>
                                        <span>{item.chapters || 0} Chapters</span>
                                        <span>{item.pages || 0} Pages</span>
                                    </>
                                ) : (
                                    <>
                                        <span>{item.lessons || 0} Lessons</span>
                                        <span>{item.duration || 'N/A'}</span>
                                    </>
                                )}
                            </div>

                            <div className="content-stats-row">
                                <span><Eye size={14} /> {(item.views || 0).toLocaleString()}</span>
                                <span><Star size={14} /> {item.purchases || 0}</span>
                            </div>

                            <div className="content-actions">
                                <button className="btn-action" onClick={() => handleEdit(item)}>
                                    <Edit2 size={14} />
                                </button>
                                <button className="btn-action" onClick={() => toggleStatus(item.contentId || item._id)}>
                                    {item.status === 'published' ? 'Unpublish' : 'Publish'}
                                </button>
                                <button className="btn-action delete" onClick={() => handleDelete(item.contentId || item._id)}>
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <div className="modal-overlay" onClick={() => !uploading && setShowAddModal(false)}>
                    <div className="modal-content large" onClick={e => e.stopPropagation()}>
                        <div className="modal-header">
                            <h3>{editingContent ? 'Edit Content' : 'Add New Content'}</h3>
                            {!uploading && (
                                <button className="btn-close-modal" onClick={() => setShowAddModal(false)}>
                                    <X size={20} />
                                </button>
                            )}
                        </div>

                        <div className="form-grid">
                            <div className="form-group full-width">
                                <label>Title *</label>
                                <input
                                    type="text"
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    placeholder="Enter content title"
                                    disabled={uploading}
                                />
                            </div>

                            <div className="form-group full-width">
                                <label>Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Enter description"
                                    rows={3}
                                    disabled={uploading}
                                />
                            </div>

                            <div className="form-group">
                                <label>Type *</label>
                                <select
                                    value={formData.type}
                                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                                    disabled={uploading || editingContent}
                                >
                                    <option value="pdf">PDF</option>
                                    <option value="video">Video</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Class *</label>
                                <select
                                    value={formData.classId}
                                    onChange={(e) => setFormData({ ...formData, classId: e.target.value })}
                                    disabled={uploading}
                                >
                                    {classOptions.filter(c => c.id !== 'all').map(opt => (
                                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.classId !== 'neet' && (
                                <div className="form-group">
                                    <label>Board *</label>
                                    <select
                                        value={formData.board}
                                        onChange={(e) => setFormData({ ...formData, board: e.target.value })}
                                        disabled={uploading}
                                    >
                                        {boardOptions.filter(b => b.id !== 'all').map(opt => (
                                            <option key={opt.id} value={opt.id}>{opt.name}</option>
                                        ))}
                                    </select>
                                </div>
                            )}

                            <div className="form-group">
                                <label>Subject *</label>
                                <select
                                    value={formData.subject}
                                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                                    disabled={uploading}
                                >
                                    {subjectOptions.map(sub => (
                                        <option key={sub} value={sub}>{sub}</option>
                                    ))}
                                </select>
                            </div>

                            {formData.type === 'pdf' ? (
                                <>
                                    <div className="form-group">
                                        <label>Chapters</label>
                                        <input
                                            type="number"
                                            value={formData.chapters}
                                            onChange={(e) => setFormData({ ...formData, chapters: e.target.value })}
                                            placeholder="Number of chapters"
                                            disabled={uploading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Pages</label>
                                        <input
                                            type="number"
                                            value={formData.pages}
                                            onChange={(e) => setFormData({ ...formData, pages: e.target.value })}
                                            placeholder="Number of pages"
                                            disabled={uploading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Preview Pages (Free)</label>
                                        <input
                                            type="number"
                                            value={formData.previewPages}
                                            onChange={(e) => setFormData({ ...formData, previewPages: e.target.value })}
                                            placeholder="5"
                                            disabled={uploading}
                                        />
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="form-group">
                                        <label>Lessons</label>
                                        <input
                                            type="number"
                                            value={formData.lessons}
                                            onChange={(e) => setFormData({ ...formData, lessons: e.target.value })}
                                            placeholder="Number of lessons"
                                            disabled={uploading}
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label>Duration</label>
                                        <input
                                            type="text"
                                            value={formData.duration}
                                            onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                            placeholder="e.g. 45 hours"
                                            disabled={uploading}
                                        />
                                    </div>
                                </>
                            )}

                            <div className="form-group">
                                <label>Price (₹)</label>
                                <input
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                                    placeholder="e.g. 199"
                                    min="0"
                                    disabled={uploading || formData.isFree}
                                />
                            </div>

                            <div className="form-group" style={{ flexDirection: 'row', alignItems: 'center', gap: '10px', paddingTop: '20px' }}>
                                <input
                                    type="checkbox"
                                    id="isFree"
                                    checked={formData.isFree}
                                    onChange={(e) => setFormData({ ...formData, isFree: e.target.checked })}
                                    style={{ width: '20px', height: '20px', cursor: 'pointer' }}
                                    disabled={uploading}
                                />
                                <label htmlFor="isFree" style={{ cursor: 'pointer', fontSize: '14px', color: '#2c3e50' }}>Is this free content?</label>
                            </div>

                            <div className="form-group">
                                <label>Status</label>
                                <select
                                    value={formData.status}
                                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                    disabled={uploading}
                                >
                                    <option value="draft">Draft</option>
                                    <option value="published">Published</option>
                                </select>
                            </div>

                            {/* File Upload */}
                            <div className="form-group full-width">
                                <label>
                                    <Upload size={14} /> Upload {formData.type === 'pdf' ? 'PDF' : 'Video'} File
                                </label>
                                <div className="file-upload-area">
                                    <input
                                        type="file"
                                        accept={formData.type === 'pdf' ? '.pdf' : 'video/*'}
                                        onChange={(e) => setSelectedFile(e.target.files[0])}
                                        disabled={uploading}
                                    />
                                    {selectedFile ? (
                                        <div className="file-selected">
                                            {formData.type === 'pdf' ? <FileText size={20} /> : <Video size={20} />}
                                            <span>{selectedFile.name}</span>
                                            <span className="file-size">({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</span>
                                        </div>
                                    ) : formData.fileUrl ? (
                                        <div className="file-existing">
                                            <CheckCircle size={16} />
                                            <span>File already uploaded</span>
                                        </div>
                                    ) : (
                                        <div className="file-placeholder">
                                            <Upload size={24} />
                                            <span>Click to select {formData.type === 'pdf' ? 'PDF' : 'video'} file</span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Thumbnail Upload */}
                            <div className="form-group full-width">
                                <label>
                                    <Upload size={14} /> Upload Thumbnail (Optional)
                                </label>
                                <div className="file-upload-area thumbnail">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={(e) => setSelectedThumbnail(e.target.files[0])}
                                        disabled={uploading}
                                    />
                                    {selectedThumbnail ? (
                                        <div className="file-selected">
                                            <img src={URL.createObjectURL(selectedThumbnail)} alt="Preview" className="thumb-preview" />
                                            <span>{selectedThumbnail.name}</span>
                                        </div>
                                    ) : formData.thumbnailUrl ? (
                                        <div className="file-existing">
                                            <img src={formData.thumbnailUrl} alt="Current" className="thumb-preview" />
                                            <span>Current thumbnail</span>
                                        </div>
                                    ) : (
                                        <div className="file-placeholder">
                                            <Upload size={24} />
                                            <span>Click to select thumbnail image</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {uploading && (
                            <div className="upload-progress-container">
                                <div className="upload-progress-header">
                                    <Loader2 size={16} className="spin" />
                                    <span>{uploadProgress}</span>
                                </div>
                                <div className="progress-bar-track">
                                    <div
                                        className="progress-bar-fill"
                                        style={{ width: `${uploadPercent}%` }}
                                    />
                                </div>
                                <div className="progress-stats">
                                    <span>{uploadPercent}% complete</span>
                                    {selectedFile && (
                                        <span>{(selectedFile.size / 1024 / 1024).toFixed(1)} MB</span>
                                    )}
                                </div>
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="btn-cancel"
                                onClick={() => setShowAddModal(false)}
                                disabled={uploading}
                            >
                                Cancel
                            </button>
                            <button
                                className="btn-save"
                                onClick={handleSave}
                                disabled={uploading || !formData.title}
                            >
                                {uploading ? (
                                    <Loader2 size={16} className="spin" />
                                ) : (
                                    <Save size={16} />
                                )}
                                <span>{uploading ? 'Uploading...' : (editingContent ? 'Update' : 'Create')}</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style>{`
                .notification {
                    position: fixed;
                    top: 20px;
                    right: 20px;
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 14px 20px;
                    background: white;
                    border-radius: 10px;
                    box-shadow: 0 4px 20px rgba(0,0,0,0.15);
                    z-index: 1100;
                    animation: slideIn 0.3s ease;
                }

                .notification.success {
                    border-left: 4px solid #27ae60;
                    color: #27ae60;
                }

                .notification.error {
                    border-left: 4px solid #e74c3c;
                    color: #e74c3c;
                }

                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }

                .loading-state, .empty-state {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    justify-content: center;
                    padding: 60px 20px;
                    background: white;
                    border-radius: 16px;
                    color: #7f8c8d;
                }

                .empty-state h3 {
                    margin: 16px 0 8px;
                    color: #2c3e50;
                }

                .empty-state .btn-add {
                    margin-top: 20px;
                }

                .spin {
                    animation: spin 1s linear infinite;
                }

                /* Upload Progress Bar */
                .upload-progress-container {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    border-radius: 12px;
                    padding: 20px;
                    margin: 16px 0;
                    border: 1px solid #dee2e6;
                }

                .upload-progress-header {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    margin-bottom: 12px;
                    color: #1abc9c;
                    font-weight: 600;
                    font-size: 14px;
                }

                .progress-bar-track {
                    height: 12px;
                    background: #e9ecef;
                    border-radius: 6px;
                    overflow: hidden;
                    box-shadow: inset 0 2px 4px rgba(0,0,0,0.1);
                }

                .progress-bar-fill {
                    height: 100%;
                    background: linear-gradient(90deg, #1abc9c 0%, #16a085 50%, #1abc9c 100%);
                    background-size: 200% 100%;
                    border-radius: 6px;
                    transition: width 0.3s ease;
                    animation: progressShine 1.5s ease-in-out infinite;
                }

                @keyframes progressShine {
                    0% { background-position: 200% 0; }
                    100% { background-position: -200% 0; }
                }

                .progress-stats {
                    display: flex;
                    justify-content: space-between;
                    margin-top: 10px;
                    font-size: 12px;
                    color: #6c757d;
                }

                .progress-stats span:first-child {
                    font-weight: 600;
                    color: #1abc9c;
                }

                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .page-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    flex-wrap: wrap;
                    gap: 16px;
                }

                .btn-add {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 12px 20px;
                    background: linear-gradient(135deg, #1abc9c 0%, #16a085 100%);
                    border: none;
                    border-radius: 10px;
                    color: white;
                    font-size: 14px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-add:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 12px rgba(26, 188, 156, 0.3);
                }

                .content-stats {
                    display: flex;
                    gap: 24px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }

                .stat-item {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 16px 24px;
                    background: white;
                    border-radius: 12px;
                    box-shadow: 0 2px 6px rgba(0,0,0,0.06);
                }

                .stat-item svg { color: #1abc9c; }
                .stat-value { font-size: 20px; font-weight: 700; color: #2c3e50; }
                .stat-label { font-size: 13px; color: #7f8c8d; }

                .filters-bar {
                    display: flex;
                    gap: 12px;
                    margin-bottom: 24px;
                    flex-wrap: wrap;
                }

                .search-box {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    flex: 1;
                    min-width: 240px;
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

                .search-box svg { color: #bdc3c7; }

                .filter-dropdown {
                    position: relative;
                    background: white;
                    border-radius: 10px;
                    border: 1px solid #ecf0f1;
                }

                .filter-dropdown select {
                    appearance: none;
                    border: none;
                    outline: none;
                    padding: 10px 36px 10px 16px;
                    font-size: 14px;
                    cursor: pointer;
                    background: transparent;
                }

                .dropdown-icon {
                    position: absolute;
                    right: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    pointer-events: none;
                    color: #bdc3c7;
                }

                .content-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
                    gap: 20px;
                }

                .content-card {
                    background: white;
                    border-radius: 16px;
                    padding: 20px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.06);
                    transition: all 0.2s;
                }

                .content-card:hover {
                    transform: translateY(-2px);
                    box-shadow: 0 4px 16px rgba(0,0,0,0.1);
                }

                .content-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    margin-bottom: 12px;
                }

                .content-type-badge {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    padding: 4px 10px;
                    border-radius: 6px;
                    font-size: 11px;
                    font-weight: 700;
                }

                .content-type-badge.pdf {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .content-type-badge.video {
                    background: rgba(155, 89, 182, 0.1);
                    color: #9b59b6;
                }

                .status-badge {
                    padding: 4px 10px;
                    border-radius: 10px;
                    font-size: 11px;
                    font-weight: 600;
                    text-transform: capitalize;
                }

                .status-badge.published {
                    background: rgba(39, 174, 96, 0.1);
                    color: #27ae60;
                }

                .status-badge.draft {
                    background: rgba(241, 196, 15, 0.1);
                    color: #f39c12;
                }
                
                .status-badge.free {
                    background: rgba(46, 204, 113, 0.1);
                    color: #27ae60;
                }

                .content-thumbnail {
                    width: 100%;
                    height: 140px;
                    border-radius: 10px;
                    overflow: hidden;
                    margin-bottom: 12px;
                }

                .content-thumbnail img {
                    width: 100%;
                    height: 100%;
                    object-fit: cover;
                }

                .content-title {
                    font-size: 16px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0 0 8px;
                    line-height: 1.4;
                }

                .content-description {
                    font-size: 13px;
                    color: #7f8c8d;
                    margin: 0 0 12px;
                    line-height: 1.5;
                }

                .content-meta {
                    display: flex;
                    flex-wrap: wrap;
                    gap: 6px;
                    margin-bottom: 12px;
                }

                .meta-item {
                    padding: 3px 8px;
                    border-radius: 4px;
                    font-size: 11px;
                    font-weight: 600;
                }

                .meta-item.class { background: rgba(52, 152, 219, 0.1); color: #3498db; }
                .meta-item.board { background: rgba(26, 188, 156, 0.1); color: #1abc9c; }
                .meta-item.subject { background: rgba(127, 140, 141, 0.1); color: #7f8c8d; }

                .content-details {
                    display: flex;
                    gap: 16px;
                    font-size: 13px;
                    color: #7f8c8d;
                    margin-bottom: 12px;
                }

                .content-stats-row {
                    display: flex;
                    gap: 16px;
                    font-size: 13px;
                    color: #7f8c8d;
                    padding-top: 12px;
                    border-top: 1px solid #f5f5f5;
                    margin-bottom: 12px;
                }

                .content-stats-row span {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                }

                .content-stats-row svg { color: #bdc3c7; }

                .content-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-action {
                    flex: 1;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 4px;
                    padding: 8px;
                    background: #f8f9fa;
                    border: none;
                    border-radius: 8px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7f8c8d;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-action:hover { background: #1abc9c; color: white; }
                .btn-action.delete:hover { background: #e74c3c; }

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
                    padding: 20px;
                }

                .modal-content {
                    background: white;
                    border-radius: 16px;
                    width: 100%;
                    max-width: 600px;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-content.large {
                    max-width: 700px;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px 24px;
                    border-bottom: 1px solid #ecf0f1;
                    position: sticky;
                    top: 0;
                    background: white;
                    z-index: 10;
                }

                .modal-header h3 { margin: 0; font-size: 18px; color: #2c3e50; }

                .btn-close-modal {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    background: #f8f9fa;
                    border: none;
                    border-radius: 8px;
                    color: #7f8c8d;
                    cursor: pointer;
                }

                .form-grid {
                    display: grid;
                    grid-template-columns: repeat(2, 1fr);
                    gap: 16px;
                    padding: 24px;
                }

                .form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 6px;
                }

                .form-group.full-width { grid-column: 1 / -1; }

                .form-group label {
                    display: flex;
                    align-items: center;
                    gap: 6px;
                    font-size: 12px;
                    font-weight: 600;
                    color: #7f8c8d;
                }

                .form-group input,
                .form-group select,
                .form-group textarea {
                    padding: 10px 14px;
                    border: 1px solid #ecf0f1;
                    border-radius: 8px;
                    font-size: 14px;
                }

                .form-group input:focus,
                .form-group select:focus,
                .form-group textarea:focus {
                    outline: none;
                    border-color: #1abc9c;
                }

                .form-group input:disabled,
                .form-group select:disabled,
                .form-group textarea:disabled {
                    background: #f8f9fa;
                    cursor: not-allowed;
                }

                .file-upload-area {
                    position: relative;
                    border: 2px dashed #ecf0f1;
                    border-radius: 10px;
                    padding: 20px;
                    text-align: center;
                    transition: all 0.2s;
                    cursor: pointer;
                }

                .file-upload-area:hover {
                    border-color: #1abc9c;
                    background: rgba(26, 188, 156, 0.02);
                }

                .file-upload-area input[type="file"] {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    opacity: 0;
                    cursor: pointer;
                }

                .file-placeholder, .file-selected, .file-existing {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 8px;
                    color: #7f8c8d;
                }

                .file-selected, .file-existing {
                    color: #27ae60;
                }

                .file-size {
                    font-size: 12px;
                    color: #95a5a6;
                }

                .thumb-preview {
                    width: 80px;
                    height: 60px;
                    object-fit: cover;
                    border-radius: 6px;
                }

                .upload-progress {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 10px;
                    padding: 16px;
                    background: rgba(26, 188, 156, 0.1);
                    color: #1abc9c;
                    font-weight: 600;
                }

                .modal-actions {
                    display: flex;
                    gap: 12px;
                    padding: 20px 24px;
                    border-top: 1px solid #ecf0f1;
                    position: sticky;
                    bottom: 0;
                    background: white;
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
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 6px;
                }

                .btn-cancel { background: #ecf0f1; color: #7f8c8d; }
                .btn-save { background: #1abc9c; color: white; }
                .btn-save:hover { background: #16a085; }
                .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

                @media (max-width: 768px) {
                    .content-grid { grid-template-columns: 1fr; }
                    .form-grid { grid-template-columns: 1fr; }
                }
            `}</style>
        </div>
    );
}

export default Content;
