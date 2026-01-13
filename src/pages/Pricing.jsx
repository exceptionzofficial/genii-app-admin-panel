import { useState } from 'react';
import {
    IndianRupee,
    Edit2,
    Save,
    X,
    FileText,
    Video,
    Crown,
    Truck,
    Check
} from 'lucide-react';

// Initial pricing data (would come from backend in real app)
const initialPricing = {
    class10: {
        name: 'Class 10',
        pdfs: { price: 1500, originalPrice: 2000 },
        videos: { price: 2000, originalPrice: 2500 },
        bundle: { price: 3000, originalPrice: 4000 },
        hardCopy: { price: 2500, shipping: 100 }
    },
    class11: {
        name: 'Class 11',
        pdfs: { price: 1800, originalPrice: 2500 },
        videos: { price: 2500, originalPrice: 3200 },
        bundle: { price: 4000, originalPrice: 5200 },
        hardCopy: { price: 3000, shipping: 100 }
    },
    class12: {
        name: 'Class 12',
        pdfs: { price: 2000, originalPrice: 2800 },
        videos: { price: 3000, originalPrice: 3800 },
        bundle: { price: 4500, originalPrice: 6000 },
        hardCopy: { price: 3500, shipping: 100 }
    },
    neet: {
        name: 'NEET',
        pdfs: { price: 2500, originalPrice: 3500 },
        videos: { price: 3500, originalPrice: 4500 },
        bundle: { price: 5500, originalPrice: 7500 },
        hardCopy: { price: 4000, shipping: 100 }
    }
};

function Pricing() {
    const [pricing, setPricing] = useState(initialPricing);
    const [editingClass, setEditingClass] = useState(null);
    const [editForm, setEditForm] = useState({});
    const [saveSuccess, setSaveSuccess] = useState(null);

    const handleEdit = (classId) => {
        setEditingClass(classId);
        setEditForm({ ...pricing[classId] });
    };

    const handleCancel = () => {
        setEditingClass(null);
        setEditForm({});
    };

    const handleSave = (classId) => {
        setPricing(prev => ({
            ...prev,
            [classId]: editForm
        }));
        setEditingClass(null);
        setSaveSuccess(classId);
        setTimeout(() => setSaveSuccess(null), 2000);
    };

    const updatePrice = (type, field, value) => {
        setEditForm(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: parseInt(value) || 0
            }
        }));
    };

    const calculateDiscount = (original, current) => {
        if (original <= current) return 0;
        return Math.round(((original - current) / original) * 100);
    };

    return (
        <div className="page-container">
            <div className="page-header">
                <div>
                    <h1 className="page-title">Pricing Management</h1>
                    <p className="page-subtitle">Configure pricing for each class and package type</p>
                </div>
            </div>

            {/* Pricing Cards Grid */}
            <div className="pricing-grid">
                {Object.entries(pricing).map(([classId, classData]) => (
                    <div key={classId} className={`pricing-class-card ${saveSuccess === classId ? 'save-success' : ''}`}>
                        <div className="pricing-card-header">
                            <h2>{classData.name}</h2>
                            {editingClass === classId ? (
                                <div className="edit-actions">
                                    <button className="btn-icon btn-save" onClick={() => handleSave(classId)}>
                                        <Save size={16} />
                                    </button>
                                    <button className="btn-icon btn-cancel" onClick={handleCancel}>
                                        <X size={16} />
                                    </button>
                                </div>
                            ) : (
                                <button className="btn-icon btn-edit" onClick={() => handleEdit(classId)}>
                                    <Edit2 size={16} />
                                </button>
                            )}
                            {saveSuccess === classId && (
                                <span className="save-indicator">
                                    <Check size={14} /> Saved
                                </span>
                            )}
                        </div>

                        {/* Digital Packages */}
                        <div className="package-section">
                            <h3>Digital Packages</h3>

                            {/* PDFs Package */}
                            <div className="package-row">
                                <div className="package-info">
                                    <FileText size={18} className="package-icon pdf" />
                                    <span className="package-name">All PDFs</span>
                                </div>
                                {editingClass === classId ? (
                                    <div className="price-inputs">
                                        <div className="input-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                value={editForm.pdfs?.price || ''}
                                                onChange={(e) => updatePrice('pdfs', 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Original</label>
                                            <input
                                                type="number"
                                                value={editForm.pdfs?.originalPrice || ''}
                                                onChange={(e) => updatePrice('pdfs', 'originalPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="package-pricing">
                                        <span className="current-price">₹{classData.pdfs.price.toLocaleString()}</span>
                                        <span className="original-price">₹{classData.pdfs.originalPrice.toLocaleString()}</span>
                                        <span className="discount-badge">
                                            {calculateDiscount(classData.pdfs.originalPrice, classData.pdfs.price)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Videos Package */}
                            <div className="package-row">
                                <div className="package-info">
                                    <Video size={18} className="package-icon video" />
                                    <span className="package-name">All Videos</span>
                                </div>
                                {editingClass === classId ? (
                                    <div className="price-inputs">
                                        <div className="input-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                value={editForm.videos?.price || ''}
                                                onChange={(e) => updatePrice('videos', 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Original</label>
                                            <input
                                                type="number"
                                                value={editForm.videos?.originalPrice || ''}
                                                onChange={(e) => updatePrice('videos', 'originalPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="package-pricing">
                                        <span className="current-price">₹{classData.videos.price.toLocaleString()}</span>
                                        <span className="original-price">₹{classData.videos.originalPrice.toLocaleString()}</span>
                                        <span className="discount-badge">
                                            {calculateDiscount(classData.videos.originalPrice, classData.videos.price)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>

                            {/* Bundle Package */}
                            <div className="package-row bundle-row">
                                <div className="package-info">
                                    <Crown size={18} className="package-icon bundle" />
                                    <span className="package-name">Complete Bundle</span>
                                    <span className="popular-tag">Popular</span>
                                </div>
                                {editingClass === classId ? (
                                    <div className="price-inputs">
                                        <div className="input-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                value={editForm.bundle?.price || ''}
                                                onChange={(e) => updatePrice('bundle', 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Original</label>
                                            <input
                                                type="number"
                                                value={editForm.bundle?.originalPrice || ''}
                                                onChange={(e) => updatePrice('bundle', 'originalPrice', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="package-pricing">
                                        <span className="current-price">₹{classData.bundle.price.toLocaleString()}</span>
                                        <span className="original-price">₹{classData.bundle.originalPrice.toLocaleString()}</span>
                                        <span className="discount-badge">
                                            {calculateDiscount(classData.bundle.originalPrice, classData.bundle.price)}% OFF
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Hard Copy */}
                        <div className="package-section">
                            <h3>Hard Copy</h3>
                            <div className="package-row">
                                <div className="package-info">
                                    <Truck size={18} className="package-icon hardcopy" />
                                    <span className="package-name">Printed Materials</span>
                                </div>
                                {editingClass === classId ? (
                                    <div className="price-inputs">
                                        <div className="input-group">
                                            <label>Price</label>
                                            <input
                                                type="number"
                                                value={editForm.hardCopy?.price || ''}
                                                onChange={(e) => updatePrice('hardCopy', 'price', e.target.value)}
                                            />
                                        </div>
                                        <div className="input-group">
                                            <label>Shipping</label>
                                            <input
                                                type="number"
                                                value={editForm.hardCopy?.shipping || ''}
                                                onChange={(e) => updatePrice('hardCopy', 'shipping', e.target.value)}
                                            />
                                        </div>
                                    </div>
                                ) : (
                                    <div className="package-pricing">
                                        <span className="current-price">₹{classData.hardCopy.price.toLocaleString()}</span>
                                        <span className="shipping-info">+ ₹{classData.hardCopy.shipping} shipping</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <style>{`
                .pricing-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
                    gap: 24px;
                }

                .pricing-class-card {
                    background: white;
                    border-radius: 16px;
                    padding: 24px;
                    box-shadow: 0 2px 8px rgba(0,0,0,0.08);
                    transition: all 0.3s ease;
                }

                .pricing-class-card.save-success {
                    box-shadow: 0 0 0 2px #27ae60;
                }

                .pricing-card-header {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin-bottom: 20px;
                    padding-bottom: 16px;
                    border-bottom: 1px solid #ecf0f1;
                }

                .pricing-card-header h2 {
                    font-size: 20px;
                    font-weight: 700;
                    color: #2c3e50;
                    margin: 0;
                }

                .edit-actions {
                    display: flex;
                    gap: 8px;
                }

                .btn-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 32px;
                    height: 32px;
                    border: none;
                    border-radius: 8px;
                    cursor: pointer;
                    transition: all 0.2s;
                }

                .btn-edit {
                    background: #ecf0f1;
                    color: #7f8c8d;
                }

                .btn-edit:hover {
                    background: #1abc9c;
                    color: white;
                }

                .btn-save {
                    background: #27ae60;
                    color: white;
                }

                .btn-save:hover {
                    background: #229954;
                }

                .btn-cancel {
                    background: #e74c3c;
                    color: white;
                }

                .btn-cancel:hover {
                    background: #c0392b;
                }

                .save-indicator {
                    display: flex;
                    align-items: center;
                    gap: 4px;
                    font-size: 12px;
                    color: #27ae60;
                    font-weight: 600;
                }

                .package-section {
                    margin-bottom: 20px;
                }

                .package-section:last-child {
                    margin-bottom: 0;
                }

                .package-section h3 {
                    font-size: 12px;
                    font-weight: 600;
                    color: #95a5a6;
                    text-transform: uppercase;
                    letter-spacing: 0.5px;
                    margin-bottom: 12px;
                }

                .package-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    padding: 12px;
                    background: #f8f9fa;
                    border-radius: 10px;
                    margin-bottom: 8px;
                }

                .bundle-row {
                    background: linear-gradient(135deg, #fff9e6 0%, #fff3cc 100%);
                    border: 1px solid #f1c40f;
                }

                .package-info {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                }

                .package-icon {
                    padding: 6px;
                    border-radius: 6px;
                }

                .package-icon.pdf {
                    background: rgba(231, 76, 60, 0.1);
                    color: #e74c3c;
                }

                .package-icon.video {
                    background: rgba(52, 152, 219, 0.1);
                    color: #3498db;
                }

                .package-icon.bundle {
                    background: rgba(241, 196, 15, 0.2);
                    color: #f39c12;
                }

                .package-icon.hardcopy {
                    background: rgba(155, 89, 182, 0.1);
                    color: #9b59b6;
                }

                .package-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: #2c3e50;
                }

                .popular-tag {
                    font-size: 10px;
                    font-weight: 700;
                    color: #f39c12;
                    background: rgba(241, 196, 15, 0.2);
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .package-pricing {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                }

                .current-price {
                    font-size: 16px;
                    font-weight: 700;
                    color: #1abc9c;
                }

                .original-price {
                    font-size: 13px;
                    color: #95a5a6;
                    text-decoration: line-through;
                }

                .discount-badge {
                    font-size: 10px;
                    font-weight: 700;
                    color: #27ae60;
                    background: rgba(39, 174, 96, 0.1);
                    padding: 2px 6px;
                    border-radius: 4px;
                }

                .shipping-info {
                    font-size: 12px;
                    color: #7f8c8d;
                }

                .price-inputs {
                    display: flex;
                    gap: 8px;
                }

                .input-group {
                    display: flex;
                    flex-direction: column;
                    gap: 2px;
                }

                .input-group label {
                    font-size: 10px;
                    color: #95a5a6;
                    text-transform: uppercase;
                }

                .input-group input {
                    width: 80px;
                    padding: 6px 8px;
                    border: 1px solid #bdc3c7;
                    border-radius: 6px;
                    font-size: 14px;
                    font-weight: 600;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: #1abc9c;
                }

                @media (max-width: 768px) {
                    .pricing-grid {
                        grid-template-columns: 1fr;
                    }

                    .package-row {
                        flex-direction: column;
                        align-items: flex-start;
                        gap: 12px;
                    }

                    .price-inputs {
                        width: 100%;
                    }

                    .input-group {
                        flex: 1;
                    }

                    .input-group input {
                        width: 100%;
                    }
                }
            `}</style>
        </div>
    );
}

export default Pricing;
