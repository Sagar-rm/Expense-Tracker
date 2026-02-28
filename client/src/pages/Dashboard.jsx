import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { analyticsAPI, expenseAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { formatCurrency, formatRelativeDate, CATEGORY_COLORS, CATEGORY_ICONS, getCurrentMonthYear } from '../utils/helpers';
import {
    StatCard, RiskBanner, InsightCard, BudgetProgress,
    LoadingSpinner, CategoryBadge
} from '../components/ui/Components';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { PlusCircle, TrendingUp, ArrowRight, Sparkles, Brain } from 'lucide-react';

const CustomTooltip = ({ active, payload }) => {
    if (active && payload?.length) {
        return (
            <div style={{
                background: '#1a1d26', border: '1px solid #2a2f45',
                borderRadius: '10px', padding: '12px 16px',
            }}>
                <p style={{ margin: 0, fontWeight: '600', color: '#e8eaf0', fontSize: '14px' }}>
                    {payload[0].name}
                </p>
                <p style={{ margin: '4px 0 0', color: '#6366f1', fontWeight: '700', fontSize: '16px' }}>
                    ₹{Math.round(payload[0].value).toLocaleString('en-IN')}
                </p>
            </div>
        );
    }
    return null;
};

export default function Dashboard() {
    const { user } = useAuth();
    const [summary, setSummary] = useState(null);
    const [trends, setTrends] = useState(null);
    const [prediction, setPrediction] = useState(null);
    const [recentExpenses, setRecentExpenses] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);
        try {
            const [summaryRes, trendsRes, predRes, expRes] = await Promise.allSettled([
                analyticsAPI.getMonthlySummary(),
                analyticsAPI.getTrends(),
                analyticsAPI.getPrediction(),
                expenseAPI.getAll({ limit: 5, sort: '-date' }),
            ]);

            if (summaryRes.status === 'fulfilled') setSummary(summaryRes.value.data);
            if (trendsRes.status === 'fulfilled') setTrends(trendsRes.value.data);
            if (predRes.status === 'fulfilled') setPrediction(predRes.value.data);
            if (expRes.status === 'fulfilled') setRecentExpenses(expRes.value.data.expenses);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <LoadingSpinner size={40} />;

    const pieData = summary?.categoryBreakdown?.map(c => ({
        name: c._id,
        value: c.total,
    })) || [];

    const trendData = trends?.monthlyTrends || [];

    return (
        <div style={{ maxWidth: '1200px' }}>
            {/* Header */}
            <div style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start',
                marginBottom: '28px', flexWrap: 'wrap', gap: '12px'
            }}>
                <div>
                    <h1 style={{
                        margin: 0, fontSize: '24px', fontWeight: '800', color: '#e8eaf0',
                        fontFamily: 'Space Grotesk'
                    }}>
                        Good {getGreeting()}, {user?.name?.split(' ')[0]} 👋
                    </h1>
                    <p style={{ margin: '4px 0 0', color: '#9ca3af', fontSize: '14px' }}>
                        {getCurrentMonthYear()} · Here's your financial snapshot
                    </p>
                </div>
                <Link to="/add-expense">
                    <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <PlusCircle size={16} />
                        Add Expense
                    </button>
                </Link>
            </div>

            {/* Risk Banner */}
            {summary?.riskAlert && (
                <RiskBanner risk={summary.riskAlert.risk} message={summary.riskAlert.message} />
            )}

            {/* Stat Cards */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px', marginBottom: '24px'
            }}>
                <StatCard
                    icon="💸"
                    label="This Month"
                    value={formatCurrency(summary?.currentMonthTotal || 0)}
                    subtitle={`${summary?.currentMonthCount || 0} transactions`}
                    trend={summary?.riskAlert?.growthPercent}
                />
                <StatCard
                    icon="🎯"
                    label="Monthly Budget"
                    value={formatCurrency(summary?.monthlyBudget || 0)}
                    subtitle="Your spending limit"
                />
                <StatCard
                    icon="💰"
                    label="Remaining"
                    value={formatCurrency(Math.max(0, summary?.budgetRemaining || 0))}
                    subtitle={summary?.budgetRemaining < 0 ? '⚠️ Over budget!' : 'Available to spend'}
                    gradient={summary?.budgetRemaining < 0 ? 'linear-gradient(135deg, rgba(239,68,68,0.08), #12141a)' : undefined}
                />
                <StatCard
                    icon="🔮"
                    label="AI Prediction"
                    value={prediction?.predictedAmount ? formatCurrency(prediction.predictedAmount) : '—'}
                    subtitle={prediction?.confidence ? `${prediction.confidence} confidence` : 'Next month estimate'}
                />
            </div>

            {/* Budget Progress */}
            {summary && (
                <div className="card" style={{ marginBottom: '24px' }}>
                    <h3 style={{ margin: '0 0 16px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        📊 Budget Usage — {getCurrentMonthYear()}
                    </h3>
                    <BudgetProgress spent={summary.currentMonthTotal} budget={summary.monthlyBudget} />
                </div>
            )}

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}
                className="charts-grid">

                {/* Pie Chart */}
                <div className="card">
                    <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        🥧 Spending by Category
                    </h3>
                    {pieData.length > 0 ? (
                        <>
                            <ResponsiveContainer width="100%" height={220}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={90}
                                        paddingAngle={3}
                                        dataKey="value"
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={CATEGORY_COLORS[entry.name] || '#6b7280'}
                                                stroke="transparent"
                                            />
                                        ))}
                                    </Pie>
                                    <Tooltip content={<CustomTooltip />} />
                                </PieChart>
                            </ResponsiveContainer>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', marginTop: '8px' }}>
                                {pieData.slice(0, 4).map(d => (
                                    <div key={d.name} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: CATEGORY_COLORS[d.name], flexShrink: 0 }} />
                                            <span style={{ fontSize: '12px', color: '#9ca3af' }}>
                                                {CATEGORY_ICONS[d.name]} {d.name}
                                            </span>
                                        </div>
                                        <span style={{ fontSize: '12px', fontWeight: '600', color: '#e8eaf0' }}>
                                            ₹{Math.round(d.value).toLocaleString('en-IN')}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>
                            No expenses this month yet
                        </div>
                    )}
                </div>

                {/* Line Chart */}
                <div className="card">
                    <h3 style={{ margin: '0 0 20px', fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                        📈 6-Month Spending Trend
                    </h3>
                    {trendData.length > 0 ? (
                        <ResponsiveContainer width="100%" height={280}>
                            <LineChart data={trendData}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#2a2f45" />
                                <XAxis
                                    dataKey="month"
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    axisLine={{ stroke: '#2a2f45' }}
                                    tickLine={false}
                                />
                                <YAxis
                                    tick={{ fill: '#6b7280', fontSize: 11 }}
                                    axisLine={false}
                                    tickLine={false}
                                    tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                                />
                                <Tooltip content={<CustomTooltip />} />
                                <Line
                                    type="monotone"
                                    dataKey="total"
                                    stroke="#6366f1"
                                    strokeWidth={2.5}
                                    dot={{ fill: '#6366f1', r: 4 }}
                                    activeDot={{ r: 6, fill: '#8b5cf6' }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '40px', color: '#6b7280', fontSize: '14px' }}>
                            Add expenses to see trends
                        </div>
                    )}
                </div>
            </div>

            {/* AI Insights + Recent Expenses */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }} className="bottom-grid">
                {/* AI Insights */}
                <div className="card">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <div style={{
                            width: '28px', height: '28px',
                            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                            borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center'
                        }}>
                            <Brain size={14} color="white" />
                        </div>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                            AI Insights
                        </h3>
                        <span style={{
                            fontSize: '10px', background: 'rgba(99,102,241,0.15)', color: '#6366f1',
                            padding: '2px 7px', borderRadius: '20px', fontWeight: '600',
                        }}>SMART</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {summary?.insights?.length > 0 ? (
                            summary.insights.map((insight, i) => (
                                <InsightCard key={i} delay={i * 100} {...insight} />
                            ))
                        ) : (
                            <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: '13px' }}>
                                <Sparkles size={24} style={{ marginBottom: '8px', color: '#6366f1' }} />
                                <div>Add expenses to get AI insights</div>
                            </div>
                        )}
                    </div>

                    {/* Prediction Card */}
                    {prediction?.predictedAmount > 0 && (
                        <div style={{
                            marginTop: '16px', padding: '14px',
                            background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.05))',
                            border: '1px solid rgba(99,102,241,0.2)',
                            borderRadius: '10px',
                        }}>
                            <div style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '4px' }}>
                                🔮 Next Month Prediction
                            </div>
                            <div className="amount" style={{ fontSize: '22px', fontWeight: '700', color: '#6366f1' }}>
                                {formatCurrency(prediction.predictedAmount)}
                            </div>
                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '4px' }}>
                                {prediction.trendMessage || prediction.message}
                            </div>
                        </div>
                    )}
                </div>

                {/* Recent Expenses */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                        <h3 style={{ margin: 0, fontSize: '15px', fontWeight: '600', color: '#e8eaf0' }}>
                            🧾 Recent Expenses
                        </h3>
                        <Link to="/expenses" style={{
                            color: '#6366f1', textDecoration: 'none', fontSize: '13px',
                            display: 'flex', alignItems: 'center', gap: '4px', fontWeight: '500'
                        }}>
                            View all <ArrowRight size={14} />
                        </Link>
                    </div>
                    {recentExpenses.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {recentExpenses.map((exp, i) => (
                                <div key={exp._id} style={{
                                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                    padding: '10px 12px',
                                    background: '#1a1d26', borderRadius: '10px',
                                    animation: `fadeInUp 0.3s ease ${i * 60}ms forwards`,
                                    opacity: 0
                                }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <div style={{
                                            width: '36px', height: '36px',
                                            background: `${CATEGORY_COLORS[exp.category]}15`,
                                            borderRadius: '10px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            fontSize: '16px', flexShrink: 0
                                        }}>
                                            {CATEGORY_ICONS[exp.category] || '💰'}
                                        </div>
                                        <div>
                                            <div style={{ fontSize: '13px', fontWeight: '500', color: '#e8eaf0', maxWidth: '140px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                                {exp.description}
                                            </div>
                                            <div style={{ fontSize: '11px', color: '#6b7280', marginTop: '2px' }}>
                                                {formatRelativeDate(exp.date)}
                                            </div>
                                        </div>
                                    </div>
                                    <div style={{ fontWeight: '700', fontSize: '14px', color: '#ef4444', fontFamily: 'Space Grotesk' }}>
                                        -{formatCurrency(exp.amount)}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div style={{ textAlign: 'center', padding: '30px', color: '#6b7280', fontSize: '13px' }}>
                            <div style={{ fontSize: '32px', marginBottom: '8px' }}>📭</div>
                            No expenses yet.{' '}
                            <Link to="/add-expense" style={{ color: '#6366f1', textDecoration: 'none' }}>Add one!</Link>
                        </div>
                    )}
                </div>
            </div>

            <style>{`
        @media (max-width: 768px) {
          .charts-grid, .bottom-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
        </div>
    );
}

function getGreeting() {
    const h = new Date().getHours();
    if (h < 12) return 'morning';
    if (h < 17) return 'afternoon';
    return 'evening';
}
