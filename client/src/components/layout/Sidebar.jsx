import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    LayoutDashboard, PlusCircle, BarChart3, Settings,
    LogOut, Menu, X, Wallet, TrendingUp, ChevronRight
} from 'lucide-react';

const navItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/expenses', icon: Wallet, label: 'Expenses' },
    { path: '/add-expense', icon: PlusCircle, label: 'Add Expense' },
    { path: '/analytics', icon: BarChart3, label: 'Analytics' },
    { path: '/profile', icon: Settings, label: 'Profile' },
];

export default function Sidebar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [mobileOpen, setMobileOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const SidebarContent = () => (
        <div style={{
            display: 'flex', flexDirection: 'column', height: '100%',
            padding: '24px 16px', gap: '8px'
        }}>
            {/* Logo */}
            <div style={{
                display: 'flex', alignItems: 'center', gap: '12px',
                padding: '0 8px 24px', borderBottom: '1px solid #2a2f45',
                marginBottom: '8px'
            }}>
                <div style={{
                    width: '40px', height: '40px',
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    borderRadius: '12px',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: '20px', flexShrink: 0
                }}>
                    💎
                </div>
                <div>
                    <div style={{
                        fontFamily: 'Space Grotesk, sans-serif',
                        fontWeight: '700', fontSize: '16px', color: '#e8eaf0'
                    }}>
                        FinTrack AI
                    </div>
                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Smart Expense Tracker</div>
                </div>
            </div>

            {/* Nav Items */}
            <nav style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '4px' }}>
                {navItems.map(({ path, icon: Icon, label }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) => `sidebar-item ${isActive ? 'active' : ''}`}
                        onClick={() => setMobileOpen(false)}
                    >
                        <Icon size={18} />
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* User Card */}
            <div style={{
                marginTop: 'auto',
                padding: '14px',
                background: '#1a1d26',
                borderRadius: '12px',
                border: '1px solid #2a2f45',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '36px', height: '36px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '50%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '14px', fontWeight: '700', color: 'white', flexShrink: 0
                    }}>
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                            fontSize: '13px', fontWeight: '600', color: '#e8eaf0',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis'
                        }}>
                            {user?.name}
                        </div>
                        <div style={{ fontSize: '11px', color: '#6b7280' }}>
                            Budget: ₹{user?.monthlyBudget?.toLocaleString('en-IN')}
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    style={{
                        display: 'flex', alignItems: 'center', gap: '6px',
                        marginTop: '10px', color: '#ef4444', background: 'none', border: 'none',
                        cursor: 'pointer', fontSize: '13px', fontWeight: '500', padding: '4px 0',
                        fontFamily: 'Inter, sans-serif', transition: 'opacity 0.2s'
                    }}
                    onMouseEnter={e => e.currentTarget.style.opacity = '0.7'}
                    onMouseLeave={e => e.currentTarget.style.opacity = '1'}
                >
                    <LogOut size={14} />
                    <span>Logout</span>
                </button>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside style={{
                width: '240px',
                background: '#0e1018',
                borderRight: '1px solid #2a2f45',
                height: '100vh',
                position: 'fixed',
                top: 0, left: 0,
                display: 'none',
                flexDirection: 'column',
                zIndex: 100,
            }}
                className="sidebar-desktop"
            >
                <SidebarContent />
            </aside>

            {/* Mobile Header */}
            <header style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                background: 'rgba(10, 11, 15, 0.95)',
                backdropFilter: 'blur(20px)',
                borderBottom: '1px solid #2a2f45',
                padding: '12px 20px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}
                className="mobile-header"
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{
                        width: '32px', height: '32px',
                        background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                        borderRadius: '10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        fontSize: '16px'
                    }}>💎</div>
                    <span style={{ fontFamily: 'Space Grotesk', fontWeight: '700', fontSize: '16px', color: '#e8eaf0' }}>
                        FinTrack AI
                    </span>
                </div>
                <button
                    onClick={() => setMobileOpen(!mobileOpen)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#e8eaf0', padding: '4px' }}
                >
                    {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                </button>
            </header>

            {/* Mobile Drawer */}
            {mobileOpen && (
                <>
                    <div
                        onClick={() => setMobileOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
                            zIndex: 300, backdropFilter: 'blur(4px)'
                        }}
                    />
                    <div style={{
                        position: 'fixed', top: 0, left: 0, bottom: 0,
                        width: '260px', background: '#0e1018',
                        zIndex: 400, borderRight: '1px solid #2a2f45',
                        animation: 'slideInLeft 0.3s ease',
                    }}>
                        <SidebarContent />
                    </div>
                </>
            )}

            <style>{`
        @media (min-width: 769px) {
          .sidebar-desktop { display: flex !important; }
          .mobile-header { display: none !important; }
        }
        @media (max-width: 768px) {
          .sidebar-desktop { display: none !important; }
        }
      `}</style>
        </>
    );
}
