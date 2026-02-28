import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

export default function Register() {
    const [form, setForm] = useState({ name: '', email: '', password: '', monthlyBudget: '' });
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.name || !form.email || !form.password) return toast.error('Please fill all required fields');
        if (form.password.length < 6) return toast.error('Password must be at least 6 characters');
        setLoading(true);
        try {
            await register(form.name, form.email, form.password, parseFloat(form.monthlyBudget) || 10000);
            toast.success('Account created! Welcome to FinTrack AI 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: '#0a0b0f', padding: '40px 20px',
            backgroundImage: 'radial-gradient(ellipse at 20% 50%, rgba(99,102,241,0.07) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(139,92,246,0.05) 0%, transparent 60%)',
        }}>
            <div style={{ width: '100%', maxWidth: '440px' }} className="animate-fade-in-up">
                {/* Logo */}
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{
                        width: '56px', height: '56px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '28px', margin: '0 auto 16px',
                        boxShadow: '0 0 30px rgba(99,102,241,0.4)',
                    }}>💎</div>
                    <h1 style={{
                        fontFamily: 'Space Grotesk', fontSize: '26px', fontWeight: '800',
                        color: '#e8eaf0', margin: '0 0 8px'
                    }}>
                        Create your account
                    </h1>
                    <p style={{ color: '#9ca3af', margin: 0, fontSize: '14px' }}>
                        Start tracking smarter with AI insights
                    </p>
                </div>

                <div className="card" style={{ padding: '28px' }}>
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {/* Full Name */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Full Name <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                id="reg-name"
                                name="name"
                                type="text"
                                className="input-field"
                                placeholder="John Doe"
                                value={form.name}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Email Address <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <input
                                id="reg-email"
                                name="email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={form.email}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* Password */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Password <span style={{ color: '#ef4444' }}>*</span>
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="reg-password"
                                    name="password"
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="Min 6 characters"
                                    value={form.password}
                                    onChange={handleChange}
                                    required
                                    style={{ paddingRight: '44px' }}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    style={{
                                        position: 'absolute', right: '12px', top: '50%',
                                        transform: 'translateY(-50%)',
                                        background: 'none', border: 'none', cursor: 'pointer',
                                        color: '#6b7280', display: 'flex', alignItems: 'center'
                                    }}
                                >
                                    {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Monthly Budget */}
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Monthly Budget (₹)
                                <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '4px' }}>(Optional)</span>
                            </label>
                            <input
                                id="reg-budget"
                                name="monthlyBudget"
                                type="number"
                                className="input-field"
                                placeholder="e.g. 20000"
                                value={form.monthlyBudget}
                                onChange={handleChange}
                                min="0"
                            />
                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                Default is ₹10,000 — you can change this anytime
                            </div>
                        </div>

                        <button
                            id="register-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px',
                                fontSize: '15px', marginTop: '4px',
                                opacity: loading ? 0.7 : 1,
                            }}
                        >
                            {loading ? (
                                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                                    <span style={{
                                        width: '16px', height: '16px',
                                        border: '2px solid rgba(255,255,255,0.3)',
                                        borderTopColor: 'white', borderRadius: '50%',
                                        animation: 'spin 0.8s linear infinite',
                                        display: 'inline-block'
                                    }} />
                                    Creating account...
                                </span>
                            ) : 'Create Account →'}
                        </button>
                    </form>
                </div>

                <p style={{ textAlign: 'center', marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
                    Already have an account?{' '}
                    <Link to="/login" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
}
