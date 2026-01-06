import { useState } from 'react';
import {
    Save,
    CreditCard,
    Bell,
    Shield,
    Globe,
    Key,
    FileText,
    Video,
    Crown
} from 'lucide-react';

const Settings = () => {
    const [activeTab, setActiveTab] = useState('general');

    const tabs = [
        { id: 'general', label: 'General', icon: Globe },
        { id: 'pricing', label: 'Pricing', icon: CreditCard },
        { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'security', label: 'Security', icon: Shield },
    ];

    const renderTabContent = () => {
        switch (activeTab) {
            case 'general':
                return (
                    <div>
                        <h3 style={{ marginBottom: 20 }}>General Settings</h3>

                        <div className="form-group">
                            <label className="form-label">App Name</label>
                            <input type="text" className="form-input" defaultValue="Genii Books" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Support Email</label>
                            <input type="email" className="form-input" defaultValue="support@geniibooks.com" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">Support WhatsApp</label>
                            <input type="tel" className="form-input" defaultValue="+91 9876543210" />
                        </div>

                        <div className="form-group">
                            <label className="form-label">About Text</label>
                            <textarea
                                className="form-input"
                                rows={4}
                                defaultValue="Genii Books is an educational platform providing quality study materials (PDFs and Videos) for Class 10, 11, 12, and NEET students across State Board and CBSE."
                            />
                        </div>

                        <button className="btn btn-primary">
                            <Save size={16} />
                            Save Changes
                        </button>
                    </div>
                );

            case 'pricing':
                return (
                    <div>
                        <h3 style={{ marginBottom: 20 }}>Subscription Plans</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20, marginBottom: 30 }}>
                            {[
                                { id: 'all_pdfs', name: 'All PDFs Access', price: 999, icon: FileText, color: '#E74C3C', description: 'Access to all PDF materials' },
                                { id: 'all_videos', name: 'All Videos Access', price: 1499, icon: Video, color: '#3498DB', description: 'Access to all video lectures' },
                                { id: 'all_content', name: 'Complete Access', price: 1999, icon: Crown, color: '#F39C12', description: 'Access to all PDFs + Videos', popular: true },
                            ].map(plan => (
                                <div key={plan.id} className="card" style={{ padding: 20, position: 'relative' }}>
                                    {plan.popular && (
                                        <div style={{
                                            position: 'absolute',
                                            top: -10,
                                            right: 16,
                                            background: plan.color,
                                            color: '#fff',
                                            fontSize: 10,
                                            fontWeight: 600,
                                            padding: '4px 12px',
                                            borderRadius: 4
                                        }}>
                                            POPULAR
                                        </div>
                                    )}
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                        <div style={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: 10,
                                            background: `${plan.color}15`,
                                            color: plan.color,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <plan.icon size={22} />
                                        </div>
                                        <div>
                                            <div style={{ fontWeight: 600 }}>{plan.name}</div>
                                            <div style={{ fontSize: 12, color: '#7F8C8D' }}>{plan.description}</div>
                                        </div>
                                    </div>
                                    <div className="form-group" style={{ marginBottom: 0 }}>
                                        <label className="form-label">Price (INR) / Year</label>
                                        <input type="number" className="form-input" defaultValue={plan.price} />
                                    </div>
                                </div>
                            ))}
                        </div>

                        <h3 style={{ marginBottom: 20 }}>Individual Purchase Pricing</h3>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 20 }}>
                            <div className="card" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: 'rgba(231,76,60,0.1)',
                                        color: '#E74C3C',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <FileText size={20} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>Single PDF</span>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Price (INR)</label>
                                    <input type="number" className="form-input" defaultValue={49} />
                                </div>
                            </div>

                            <div className="card" style={{ padding: 20 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                                    <div style={{
                                        width: 40,
                                        height: 40,
                                        borderRadius: 8,
                                        background: 'rgba(52,152,219,0.1)',
                                        color: '#3498DB',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center'
                                    }}>
                                        <Video size={20} />
                                    </div>
                                    <span style={{ fontWeight: 600 }}>Single Video</span>
                                </div>
                                <div className="form-group" style={{ marginBottom: 0 }}>
                                    <label className="form-label">Price (INR)</label>
                                    <input type="number" className="form-input" defaultValue={99} />
                                </div>
                            </div>
                        </div>

                        <button className="btn btn-primary">
                            <Save size={16} />
                            Update Pricing
                        </button>
                    </div>
                );

            case 'notifications':
                return (
                    <div>
                        <h3 style={{ marginBottom: 20 }}>Notification Settings</h3>

                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>New User Notifications</div>
                                    <div style={{ fontSize: 13, color: '#7F8C8D' }}>Get notified when a new user registers</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Subscription Alerts</div>
                                    <div style={{ fontSize: 13, color: '#7F8C8D' }}>Get notified for new subscriptions and cancellations</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" defaultChecked />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <div className="card" style={{ padding: 20, marginBottom: 16 }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontWeight: 500 }}>Daily Reports</div>
                                    <div style={{ fontSize: 13, color: '#7F8C8D' }}>Receive daily summary reports via email</div>
                                </div>
                                <label className="switch">
                                    <input type="checkbox" />
                                    <span className="slider"></span>
                                </label>
                            </div>
                        </div>

                        <button className="btn btn-primary">
                            <Save size={16} />
                            Save Preferences
                        </button>
                    </div>
                );

            case 'security':
                return (
                    <div>
                        <h3 style={{ marginBottom: 20 }}>Security Settings</h3>

                        <div className="card" style={{ padding: 20, marginBottom: 20 }}>
                            <h4 style={{ marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                                <Key size={18} />
                                Change Password
                            </h4>

                            <div className="form-group">
                                <label className="form-label">Current Password</label>
                                <input type="password" className="form-input" placeholder="Enter current password" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">New Password</label>
                                <input type="password" className="form-input" placeholder="Enter new password" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Confirm New Password</label>
                                <input type="password" className="form-input" placeholder="Confirm new password" />
                            </div>

                            <button className="btn btn-primary">Update Password</button>
                        </div>

                        <div className="card" style={{ padding: 20 }}>
                            <h4 style={{ marginBottom: 16 }}>API Keys</h4>

                            <div className="form-group">
                                <label className="form-label">RevenueCat API Key (Android)</label>
                                <input type="text" className="form-input" placeholder="Enter RevenueCat API key" />
                            </div>

                            <div className="form-group">
                                <label className="form-label">Firebase Server Key</label>
                                <input type="text" className="form-input" placeholder="Enter Firebase server key" />
                            </div>

                            <button className="btn btn-primary">
                                <Save size={16} />
                                Save API Keys
                            </button>
                        </div>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <div>
            {/* Page Header */}
            <div className="page-header">
                <div>
                    <h1 className="page-title">Settings</h1>
                    <p className="page-subtitle">Manage app settings and configurations</p>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
                {/* Settings Nav */}
                <div className="card" style={{ padding: 8, height: 'fit-content' }}>
                    {tabs.map(tab => (
                        <div
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: 12,
                                padding: '12px 16px',
                                borderRadius: 8,
                                cursor: 'pointer',
                                background: activeTab === tab.id ? 'rgba(26,188,156,0.1)' : 'transparent',
                                color: activeTab === tab.id ? '#1ABC9C' : '#2C3E50',
                                fontWeight: activeTab === tab.id ? 600 : 400,
                                transition: 'all 0.2s ease'
                            }}
                        >
                            <tab.icon size={18} />
                            <span>{tab.label}</span>
                        </div>
                    ))}
                </div>

                {/* Settings Content */}
                <div className="card">
                    {renderTabContent()}
                </div>
            </div>

            <style>{`
        .switch {
          position: relative;
          display: inline-block;
          width: 48px;
          height: 24px;
        }
        .switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }
        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: #E0E0E0;
          transition: .3s;
          border-radius: 24px;
        }
        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 3px;
          bottom: 3px;
          background-color: white;
          transition: .3s;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0,0,0,0.2);
        }
        input:checked + .slider {
          background-color: #1ABC9C;
        }
        input:checked + .slider:before {
          transform: translateX(24px);
        }
        @media (max-width: 768px) {
          .settings-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
        </div>
    );
};

export default Settings;
