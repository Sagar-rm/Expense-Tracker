import { useState, useEffect } from 'react';
import { analyticsAPI } from '../services/api';
import { formatCurrency, CATEGORY_COLORS, CATEGORY_ICONS } from '../utils/helpers';
import { LoadingSpinner, InsightCard } from '../components/ui/Components';
import {
    LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
    XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
    AreaChart, Area
} from 'recharts';

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: '#1a1d26', border: '1px solid #2a2f45',
                borderRadius: '10px', padding: '12px 16px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)'
            }}>
                {label && <p style={{ margin: '0 0 4px', fontSize: '12px', color: '#6b7280' }}>{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ margin: 0, fontWeight: '700', color: p.color || '#6366f1', fontSize: '15px' }}>
                        {typeof p.value === 'number' ? formatCurrency(p.value) : p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

export default function Analytics() {
    const [trends, setTrends] = useState(null);
    const [categories, setCategories] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAll();
    }, []);

    const fetchAll = async () => {
        setLoading(true);
        try {
            const [t, c, p] = await Promise.allSettled([
                analyticsAPI.getTrends(),
                analyticsAPI.getCategories(),
                analyticsAPI.getPrediction(),
            ]);
            if (t.status === 'fulfilled') setTrends(t.value.data);
            if (c.status === 'fulfilled') setCategories(c.value.data);
            if (p.status === 'fulfilled') setPrediction(p.value.data);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner size={40} />;

    const trendData = trends?.monthlyTrends || [];
    const categoryData = categories?.categories || [];

    // Build prediction chart data (last + predicted)
    const predictionChartData = [...trendData];
    if (prediction?.predictedAmount && trendData.length > 0) {
        predictionChartData.push({
            month: 'Next Month (Predicted)',
            total: prediction.predictedAmount,
            predicted: true,
        });
    }

    return (
        <div style={{ maxWidth: '1100px' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{ margin: '0 0 6px', fontSize: '24px', fontWeight: '800', color: '#e8eaf0', fontFamily: 'Space Grotesk' }}>
                    📊 Analytics & Insights
                </h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                    AI-powered analysis of your spending patterns
                </p>
            </div>

            {/* Trend Alert */}
            {trends?.consecutiveGrowthMonths >= 2 && (
                <div style={{
                    marginBottom: '24px', padding: '16px 20px',
                    background: 'rgba(245,158,11,0.08)',
                    border: '1px solid rgba(245,158,11,0.25)',
                    borderLeft: '4px solid #f59e0b',
                    borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px'
                }}>
                    <span style={{ fontSize: '24px' }}>📈</span>
                    <div>
                        <div style={{ fontWeight: '700', color: '#f59e0b', fontSize: '14px' }}>Spending Growth Alert</div>
                        <div style={{ color: '#9ca3af', fontSize: '13px', marginTop: '2px' }}>
                            Your spending has increased for {trends.consecutiveGrowthMonths} consecutive months. Time to review your budget!
                        </div>
                    </div>
                </div>
            )}

            {/* Prediction Card */}
            {prediction?.predictedAmount > 0 && (
                <div className="card" style={{ marginBottom: '24px', background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05))' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                        <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '32px', height: '32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                                    borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    fontSize: '16px'
                                }}>🔮</div>
                                <div>
                                    <div style={{ fontSize: '13px', fontWeight: '600', color: '#9ca3af' }}>AI PREDICTION</div>
                                    <div style={{ fontSize: '11px', color: '#6b7280' }}>Next month estimate</div>
                                </div>
                            </div>
                            <div className="amount" style={{ fontSize: '36px', fontWeight: '800', color: '#e8eaf0' }}>
                                {formatCurrency(prediction.predictedAmount)}
                            </div>
                        </div>
                        <div style={{ background: '#1a1d26', padding: '16px', borderRadius: '12px', minWidth: '200px' }}>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '8px' }}>PREDICTION DETAILS</div>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                {[
                                    ['Confidence', prediction.confidence],
                                    ['Trend', prediction.trend || 'N/A'],
                                    ['Data Points', `${prediction.monthlyData?.length || 0} months`],
                                ].map(([k, v]) => (
                                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between' }}>
                                        <span style={{ fontSize: '12px', color: '#6b7280' }}>{k}</span>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#e8eaf0', textTransform: 'capitalize' }}>{v}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                    {prediction.trendMessage && (
                        <div style={{ marginTop: '14px', fontSize: '13px', color: '#a5b4fc', borderTop: '1px solid rgba(99,102,241,0.2)', paddingTop: '14px' }}>
                            {prediction.trendMessage}
                        </div>
                    )}
                </div>
            )}

            {/* Charts Row 1: Area + Bar */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }} className="charts-grid">
                {/* Area Chart */}
                <div className="card">
                    <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        📈 Spending Trend with Prediction
                    </h3>
                    {predictionChartData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <AreaChart data={predictionChartData}>
                                <defs>
                                    <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3} />
                                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                                <XAxis dataKey="month" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false} />
                                <YAxis tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Area
                                    type="monotone" dataKey="total"
                                    stroke="#6366f1" strokeWidth={2.5}
                                    fill="url(#colorTotal)"
                                    dot={({ cx, cy, payload }) => (
                                        <circle cx={cx} cy={cy} r={4}
                                            fill={payload.predicted ? '#f59e0b' : '#6366f1'}
                                            stroke={payload.predicted ? '#f59e0b' : '#6366f1'} strokeWidth={2} />
                                    )}
                                />
                            </AreaChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                            No trend data available yet
                        </div>
                    )}
                    <div style={{ display: 'flex', gap: '16px', marginTop: '8px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '12px', height: '2px', background: '#6366f1', borderRadius: '1px' }} />
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>Actual</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '10px', height: '10px', background: '#f59e0b', borderRadius: '50%' }} />
                            <span style={{ fontSize: '11px', color: '#6b7280' }}>Predicted</span>
                        </div>
                    </div>
                </div>

                {/* Category Bar Chart */}
                <div className="card">
                    <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        🏆 Top Categories This Month
                    </h3>
                    {categoryData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={260}>
                            <BarChart data={categoryData.slice(0, 6)} layout="vertical">
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" horizontal={false} />
                                <XAxis type="number" tick={{ fill: '#6b7280', fontSize: 10 }} axisLine={false} tickLine={false}
                                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`} />
                                <YAxis type="category" dataKey="_id" tick={{ fill: '#9ca3af', fontSize: 11 }} axisLine={false} tickLine={false} width={100}
                                    tickFormatter={v => `${CATEGORY_ICONS[v] || '💰'} ${v.split(' ')[0]}`} />
                                <Tooltip content={<CustomTooltip />} />
                                <Bar dataKey="total" radius={[0, 6, 6, 0]}>
                                    {categoryData.slice(0, 6).map((entry, index) => (
                                        <Cell key={index} fill={CATEGORY_COLORS[entry._id] || '#6366f1'} />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>
                            No category data available
                        </div>
                    )}
                </div>
            </div>

            {/* Category Breakdown Table */}
            {categoryData.length > 0 && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        💡 Category Breakdown
                    </h3>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: '12px' }}>
                        {categoryData.map((cat) => (
                            <div key={cat._id} style={{
                                padding: '14px 16px',
                                background: '#1a1d26',
                                borderRadius: '10px',
                                border: `1px solid ${CATEGORY_COLORS[cat._id] || '#6b7280'}20`,
                            }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                        <span style={{ fontSize: '18px' }}>{CATEGORY_ICONS[cat._id] || '💰'}</span>
                                        <span style={{ fontSize: '13px', fontWeight: '600', color: '#e8eaf0' }}>{cat._id}</span>
                                    </div>
                                    <span style={{
                                        fontSize: '11px', fontWeight: '700',
                                        color: CATEGORY_COLORS[cat._id] || '#6b7280',
                                        background: `${CATEGORY_COLORS[cat._id] || '#6b7280'}15`,
                                        padding: '2px 8px', borderRadius: '20px'
                                    }}>
                                        {cat.percentage}%
                                    </span>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <span className="amount" style={{ fontSize: '16px', fontWeight: '700', color: '#e8eaf0' }}>
                                        {formatCurrency(cat.total)}
                                    </span>
                                    <span style={{ fontSize: '12px', color: '#6b7280' }}>{cat.count} transactions</span>
                                </div>
                                <div className="progress-bar" style={{ marginTop: '8px' }}>
                                    <div className="progress-fill" style={{
                                        width: `${cat.percentage}%`,
                                        background: CATEGORY_COLORS[cat._id] || '#6366f1',
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
