import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import toast from 'react-hot-toast';
import { User, Lock, DollarSign, Save } from 'lucide-react';

export default function Profile() {
    const { user, updateUser } = useAuth();
    const [form, setForm] = useState({
        name: user?.name || '',
        monthlyBudget: user?.monthlyBudget || 10000,
        currentPassword: '',
        newPassword: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSave = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const payload = { name: form.name, monthlyBudget: parseFloat(form.monthlyBudget) };
            if (form.newPassword) payload.password = form.newPassword;

            const { data } = await authAPI.updateProfile(payload);
            updateUser(data);
            toast.success('Profile updated successfully!');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Update failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '560px' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '800', color: '#e8eaf0', fontFamily: 'Space Grotesk' }}>
                    Profile Settings
                </h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                    Manage your account and preferences
                </p>
            </div>

            {/* Avatar Card */}
            <div className="card" style={{ marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '20px' }}>
                <div style={{
                    width: '72px', height: '72px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '50%',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '28px', fontWeight: '700', color: 'white',
                    flexShrink: 0,
                    boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                }}>
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
                <div>
                    <div style={{ fontSize: '18px', fontWeight: '700', color: '#e8eaf0', fontFamily: 'Space Grotesk' }}>
                        {user?.name}
                    </div>
                    <div style={{ fontSize: '14px', color: '#9ca3af', marginTop: '2px' }}>{user?.email}</div>
                    <div style={{
                        display: 'inline-block', marginTop: '6px',
                        fontSize: '11px', background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                        padding: '3px 10px', borderRadius: '20px', fontWeight: '600'
                    }}>
                        ✨ FinTrack Pro
                    </div>
                </div>
            </div>

            {/* Settings Form */}
            <div className="card">
                <form onSubmit={handleSave} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>

                    {/* Personal Info */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <User size={16} color="#6366f1" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8eaf0' }}>Personal Info</span>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Full Name</label>
                                <input
                                    id="profile-name"
                                    name="name"
                                    type="text"
                                    className="input-field"
                                    value={form.name}
                                    onChange={handleChange}
                                />
                            </div>
                            <div>
                                <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Email Address</label>
                                <input
                                    type="email"
                                    className="input-field"
                                    value={user?.email}
                                    disabled
                                    style={{ opacity: 0.5, cursor: 'not-allowed' }}
                                />
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Budget */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <DollarSign size={16} color="#10b981" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8eaf0' }}>Monthly Budget</span>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Budget Amount (₹)
                            </label>
                            <div style={{ position: 'relative' }}>
                                <span style={{
                                    position: 'absolute', left: '14px', top: '50%',
                                    transform: 'translateY(-50%)', color: '#10b981', fontWeight: '700', fontSize: '16px'
                                }}>₹</span>
                                <input
                                    id="profile-budget"
                                    name="monthlyBudget"
                                    type="number"
                                    className="input-field"
                                    value={form.monthlyBudget}
                                    onChange={handleChange}
                                    min="0"
                                    style={{ paddingLeft: '32px', fontSize: '16px', fontWeight: '600', fontFamily: 'Space Grotesk' }}
                                />
                            </div>
                            <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                                Current: ₹{user?.monthlyBudget?.toLocaleString('en-IN')}
                            </div>
                        </div>
                    </div>

                    <hr className="divider" />

                    {/* Change Password */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                            <Lock size={16} color="#f59e0b" />
                            <span style={{ fontSize: '14px', fontWeight: '600', color: '#e8eaf0' }}>Change Password</span>
                        </div>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                New Password
                                <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '4px' }}>(leave empty to keep current)</span>
                            </label>
                            <input
                                id="profile-password"
                                name="newPassword"
                                type="password"
                                className="input-field"
                                placeholder="New password (min 6 characters)"
                                value={form.newPassword}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    <button
                        id="profile-save"
                        type="submit"
                        className="btn-primary"
                        disabled={loading}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
                            padding: '14px', fontSize: '15px', opacity: loading ? 0.7 : 1
                        }}
                    >
                        <Save size={16} />
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </form>
            </div>

            {/* Stats */}
            <div className="card" style={{ marginTop: '20px' }}>
                <h3 style={{ margin: '0 0 16px', fontSize: '14px', fontWeight: '600', color: '#9ca3af' }}>
                    ACCOUNT INFO
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        ['Member since', new Date(user?.createdAt || Date.now()).toLocaleDateString('en-IN', { month: 'long', year: 'numeric' })],
                        ['Account type', 'FinTrack Premium'],
                        ['AI Insights', 'Enabled ✅'],
                    ].map(([k, v]) => (
                        <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <span style={{ fontSize: '13px', color: '#9ca3af' }}>{k}</span>
                            <span style={{ fontSize: '13px', fontWeight: '500', color: '#e8eaf0' }}>{v}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
