// Reusable UI components

export const StatCard = ({ icon, label, value, subtitle, gradient, trend }) => (
    <div className="card animate-fade-in-up" style={{
        background: gradient || '#12141a',
        position: 'relative',
        overflow: 'hidden',
    }}>
        <div style={{
            position: 'absolute', top: 0, right: 0,
            width: '120px', height: '120px',
            background: 'radial-gradient(circle, rgba(99,102,241,0.08) 0%, transparent 70%)',
            borderRadius: '50%', transform: 'translate(30%, -30%)',
        }} />
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
            <div>
                <div style={{ fontSize: '24px', marginBottom: '8px' }}>{icon}</div>
                <div style={{ fontSize: '12px', color: '#9ca3af', fontWeight: '500', marginBottom: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {label}
                </div>
                <div className="amount" style={{ fontSize: '28px', fontWeight: '700', color: '#e8eaf0' }}>
                    {value}
                </div>
                {subtitle && (
                    <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>{subtitle}</div>
                )}
            </div>
            {trend !== undefined && (
                <div style={{
                    fontSize: '12px', fontWeight: '600',
                    color: trend >= 0 ? '#ef4444' : '#10b981',
                    background: trend >= 0 ? 'rgba(239,68,68,0.1)' : 'rgba(16,185,129,0.1)',
                    padding: '4px 8px', borderRadius: '6px',
                }}>
                    {trend >= 0 ? '↑' : '↓'} {Math.abs(Math.round(trend))}%
                </div>
            )}
        </div>
    </div>
);

export const RiskBanner = ({ risk, message }) => {
    if (!risk) return null;
    const classMap = {
        HIGH: 'risk-banner-high',
        MEDIUM: 'risk-banner-medium',
        LOW: 'risk-banner-low',
    };

    return (
        <div className={classMap[risk]} style={{
            borderRadius: '12px',
            padding: '14px 18px',
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.5s ease',
        }}>
            <span style={{ fontSize: '20px' }}>
                {risk === 'HIGH' ? '🚨' : risk === 'MEDIUM' ? '⚠️' : '✅'}
            </span>
            <div>
                <div style={{
                    fontSize: '12px', fontWeight: '700', letterSpacing: '1px', marginBottom: '2px',
                    color: risk === 'HIGH' ? '#ef4444' : risk === 'MEDIUM' ? '#f59e0b' : '#10b981'
                }}>
                    {risk} RISK
                </div>
                <div style={{ fontSize: '13px', color: '#e8eaf0' }}>{message}</div>
            </div>
        </div>
    );
};

export const InsightCard = ({ type, icon, title, message, delay = 0 }) => {
    const colorMap = {
        success: { border: '#10b981', bg: 'rgba(16,185,129,0.08)', text: '#10b981' },
        warning: { border: '#f59e0b', bg: 'rgba(245,158,11,0.08)', text: '#f59e0b' },
        alert: { border: '#ef4444', bg: 'rgba(239,68,68,0.08)', text: '#ef4444' },
        tip: { border: '#6366f1', bg: 'rgba(99,102,241,0.08)', text: '#6366f1' },
    };
    const colors = colorMap[type] || colorMap.tip;

    return (
        <div style={{
            background: colors.bg,
            border: `1px solid ${colors.border}30`,
            borderLeft: `3px solid ${colors.border}`,
            borderRadius: '10px',
            padding: '14px 16px',
            animation: `fadeInUp 0.5s ease ${delay}ms forwards`,
            opacity: 0,
        }}>
            <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                <span style={{ fontSize: '18px', lineHeight: 1 }}>{icon}</span>
                <div>
                    <div style={{ fontSize: '13px', fontWeight: '600', color: colors.text, marginBottom: '2px' }}>
                        {title}
                    </div>
                    <div style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5 }}>{message}</div>
                </div>
            </div>
        </div>
    );
};

export const BudgetProgress = ({ spent, budget }) => {
    const percent = Math.min((spent / budget) * 100, 100);
    const getColor = () => {
        if (percent > 90) return '#ef4444';
        if (percent > 70) return '#f59e0b';
        return '#10b981';
    };

    return (
        <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span style={{ fontSize: '13px', color: '#9ca3af' }}>Budget Used</span>
                <span style={{ fontSize: '13px', fontWeight: '600', color: getColor() }}>
                    {Math.round(percent)}%
                </span>
            </div>
            <div className="progress-bar">
                <div className="progress-fill" style={{
                    width: `${percent}%`,
                    background: percent > 90
                        ? 'linear-gradient(90deg, #f59e0b, #ef4444)'
                        : percent > 70
                            ? 'linear-gradient(90deg, #10b981, #f59e0b)'
                            : 'linear-gradient(90deg, #6366f1, #10b981)',
                }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px' }}>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>₹{Math.round(spent).toLocaleString('en-IN')}</span>
                <span style={{ fontSize: '12px', color: '#6b7280' }}>₹{budget?.toLocaleString('en-IN')}</span>
            </div>
        </div>
    );
};

export const LoadingSpinner = ({ size = 32 }) => (
    <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        height: '200px'
    }}>
        <div style={{
            width: size, height: size,
            border: '3px solid #2a2f45',
            borderTopColor: '#6366f1',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
        }} />
    </div>
);

export const EmptyState = ({ icon = '📭', title, message }) => (
    <div style={{
        display: 'flex', flexDirection: 'column', alignItems: 'center',
        padding: '60px 20px', textAlign: 'center', gap: '12px'
    }}>
        <div style={{ fontSize: '48px' }}>{icon}</div>
        <div style={{ fontSize: '16px', fontWeight: '600', color: '#e8eaf0' }}>{title}</div>
        <div style={{ fontSize: '14px', color: '#6b7280', maxWidth: '300px' }}>{message}</div>
    </div>
);

export const Modal = ({ isOpen, onClose, title, children }) => {
    if (!isOpen) return null;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 1000,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '20px',
        }}>
            <div
                onClick={onClose}
                style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.7)',
                    backdropFilter: 'blur(8px)',
                }}
            />
            <div className="card animate-bounce-in" style={{
                position: 'relative', zIndex: 1,
                width: '100%', maxWidth: '480px',
                maxHeight: '90vh', overflowY: 'auto',
            }}>
                <div style={{
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    marginBottom: '20px'
                }}>
                    <h2 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#e8eaf0' }}>
                        {title}
                    </h2>
                    <button
                        onClick={onClose}
                        style={{
                            background: '#22263a', border: 'none', cursor: 'pointer',
                            color: '#9ca3af', width: '32px', height: '32px', borderRadius: '8px',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            fontSize: '18px', fontFamily: 'monospace', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => { e.target.style.background = '#ef4444'; e.target.style.color = 'white'; }}
                        onMouseLeave={e => { e.target.style.background = '#22263a'; e.target.style.color = '#9ca3af'; }}
                    >
                        ×
                    </button>
                </div>
                {children}
            </div>
        </div>
    );
};

export const CategoryBadge = ({ category }) => {
    const icons = {
        'Food & Dining': '🍽️', 'Transport': '🚗', 'Shopping': '🛍️',
        'Entertainment': '🎬', 'Health & Medical': '🏥', 'Education': '📚',
        'Utilities': '💡', 'Housing': '🏠', 'Travel': '✈️',
        'Groceries': '🛒', 'Other': '💰',
    };
    return (
        <span style={{
            fontSize: '12px', padding: '3px 8px', borderRadius: '6px',
            background: 'rgba(99,102,241,0.1)', color: '#a5b4fc',
            fontWeight: '500', display: 'inline-flex', alignItems: 'center', gap: '4px'
        }}>
            {icons[category] || '💰'} {category}
        </span>
    );
};
