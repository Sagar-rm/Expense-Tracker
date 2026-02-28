import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { Eye, EyeOff, Zap, TrendingUp, Shield } from 'lucide-react';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPass, setShowPass] = useState(false);
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email || !password) return toast.error('Please fill all fields');
        setLoading(true);
        try {
            await login(email, password);
            toast.success('Welcome back! 🎉');
            navigate('/dashboard');
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    const features = [
        { icon: <Zap size={16} />, text: 'AI-powered expense categorization' },
        { icon: <TrendingUp size={16} />, text: 'Spending predictions & trend analysis' },
        { icon: <Shield size={16} />, text: 'Smart budget risk alerts' },
    ];

    return (
        <div style={{
            minHeight: '100vh', display: 'flex',
            background: '#0a0b0f',
        }}>
            {/* Left Banner */}
            <div style={{
                flex: 1, display: 'none',
                background: 'linear-gradient(135deg, #0e1018 0%, #12141a 50%, #1a1d26 100%)',
                padding: '60px',
                flexDirection: 'column',
                justifyContent: 'center',
                position: 'relative',
                overflow: 'hidden',
            }}
                className="auth-banner"
            >
                {/* Background orbs */}
                <div style={{
                    position: 'absolute', width: '400px', height: '400px',
                    background: 'radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%)',
                    borderRadius: '50%', top: '10%', left: '10%',
                    filter: 'blur(40px)',
                }} />
                <div style={{
                    position: 'absolute', width: '300px', height: '300px',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, transparent 70%)',
                    borderRadius: '50%', bottom: '20%', right: '10%',
                    filter: 'blur(40px)',
                }} />

                <div style={{ position: 'relative', zIndex: 1 }}>
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '48px'
                    }}>
                        <div style={{
                            width: '48px', height: '48px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '14px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '24px'
                        }}>💎</div>
                        <span style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '22px', color: '#e8eaf0' }}>
                            FinTrack AI
                        </span>
                    </div>

                    <h1 style={{
                        fontSize: '42px', fontWeight: '800', lineHeight: 1.2, marginBottom: '20px',
                        fontFamily: 'Space Grotesk', margin: '0 0 20px'
                    }}>
                        <span className="gradient-text">Smarter</span>
                        <br />
                        <span style={{ color: '#e8eaf0' }}>Money Tracking</span>
                    </h1>

                    <p style={{ color: '#9ca3af', fontSize: '16px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '380px' }}>
                        AI-powered insights help you understand your spending patterns and save more every month.
                    </p>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        {features.map((f, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <div style={{
                                    width: '32px', height: '32px',
                                    background: 'rgba(99,102,241,0.15)',
                                    borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    color: '#6366f1', flexShrink: 0
                                }}>
                                    {f.icon}
                                </div>
                                <span style={{ color: '#9ca3af', fontSize: '14px' }}>{f.text}</span>
                            </div>
                        ))}
                    </div>

                    {/* Stats */}
                    <div style={{
                        display: 'flex', gap: '32px', marginTop: '56px',
                        borderTop: '1px solid #2a2f45', paddingTop: '32px'
                    }}>
                        {[['₹2.4L+', 'Saved by users'], ['94%', 'Prediction accuracy'], ['1M+', 'Expenses tracked']].map(([val, label]) => (
                            <div key={val}>
                                <div style={{ fontFamily: 'Space Grotesk', fontSize: '24px', fontWeight: '700' }} className="gradient-text">{val}</div>
                                <div style={{ fontSize: '12px', color: '#6b7280' }}>{label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Right: Login Form */}
            <div style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
                padding: '40px 20px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }} className="animate-fade-in-up">
                    <div style={{ marginBottom: '36px' }}>
                        <h2 style={{
                            fontSize: '28px', fontWeight: '800', color: '#e8eaf0', margin: '0 0 8px',
                            fontFamily: 'Space Grotesk'
                        }}>
                            Welcome back
                        </h2>
                        <p style={{ color: '#9ca3af', margin: 0 }}>Sign in to your account to continue</p>
                    </div>

                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Email Address
                            </label>
                            <input
                                id="login-email"
                                type="email"
                                className="input-field"
                                placeholder="you@example.com"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>
                                Password
                            </label>
                            <div style={{ position: 'relative' }}>
                                <input
                                    id="login-password"
                                    type={showPass ? 'text' : 'password'}
                                    className="input-field"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
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

                        <button
                            id="login-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{
                                width: '100%', padding: '14px',
                                fontSize: '15px', marginTop: '8px',
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
                                    Signing in...
                                </span>
                            ) : 'Sign In'}
                        </button>
                    </form>

                    {/* Demo credentials */}
                    <div style={{
                        marginTop: '20px', padding: '14px', borderRadius: '10px',
                        background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)',
                    }}>
                        <p style={{ fontSize: '12px', color: '#6366f1', fontWeight: '600', margin: '0 0 4px' }}>
                            🧪 Demo Account
                        </p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', margin: 0 }}>
                            Register a new account to get started
                        </p>
                    </div>

                    <p style={{ textAlign: 'center', marginTop: '24px', fontSize: '14px', color: '#6b7280' }}>
                        Don't have an account?{' '}
                        <Link to="/register" style={{ color: '#6366f1', fontWeight: '600', textDecoration: 'none' }}>
                            Create account
                        </Link>
                    </p>
                </div>
            </div>

            <style>{`
        @media (min-width: 768px) { .auth-banner { display: flex !important; } }
      `}</style>
        </div>
    );
}
