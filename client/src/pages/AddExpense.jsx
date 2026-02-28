import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { expenseAPI } from '../services/api';
import toast from 'react-hot-toast';
import { CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/helpers';
import { Sparkles, CheckCircle } from 'lucide-react';

export default function AddExpense() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        amount: '',
        description: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        isRecurring: false,
    });
    const [loading, setLoading] = useState(false);
    const [autoCateg, setAutoCateg] = useState(null);
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }));
    };

    const handleDescriptionChange = async (e) => {
        const val = e.target.value;
        setForm(p => ({ ...p, description: val }));

        // Client-side keyword preview
        if (val.length > 3 && !form.category) {
            const previewCategory = previewCategorize(val);
            if (previewCategory !== 'Other') {
                setAutoCateg(previewCategory);
            } else {
                setAutoCateg(null);
            }
        } else {
            setAutoCateg(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!form.amount || !form.description) {
            return toast.error('Amount and description are required');
        }
        if (parseFloat(form.amount) <= 0) {
            return toast.error('Amount must be greater than 0');
        }

        setLoading(true);
        try {
            await expenseAPI.create(form);
            setSuccess(true);
            toast.success('Expense added! Auto-categorized by AI 🤖');
            setTimeout(() => {
                navigate('/expenses');
            }, 1500);
        } catch (err) {
            toast.error(err.response?.data?.message || 'Failed to add expense');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                minHeight: '50vh', gap: '16px', animation: 'bounceIn 0.5s ease'
            }}>
                <div style={{
                    width: '80px', height: '80px',
                    background: 'rgba(16,185,129,0.15)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <CheckCircle size={40} color="#10b981" />
                </div>
                <h2 style={{ color: '#e8eaf0', margin: 0, fontFamily: 'Space Grotesk' }}>Expense Added!</h2>
                <p style={{ color: '#9ca3af', margin: 0 }}>Redirecting to expenses...</p>
            </div>
        );
    }

    return (
        <div style={{ maxWidth: '600px' }}>
            <div style={{ marginBottom: '28px' }}>
                <h1 style={{
                    margin: '0 0 6px', fontSize: '24px', fontWeight: '800',
                    color: '#e8eaf0', fontFamily: 'Space Grotesk'
                }}>
                    Add New Expense
                </h1>
                <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                    AI will auto-categorize based on your description
                </p>
            </div>

            <div className="card">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                    {/* Amount */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
                            Amount (₹) <span style={{ color: '#ef4444' }}>*</span>
                        </label>
                        <div style={{ position: 'relative' }}>
                            <span style={{
                                position: 'absolute', left: '14px', top: '50%',
                                transform: 'translateY(-50%)',
                                color: '#6366f1', fontWeight: '700', fontSize: '18px',
                                fontFamily: 'Space Grotesk'
                            }}>₹</span>
                            <input
                                id="expense-amount"
                                name="amount"
                                type="number"
                                className="input-field"
                                placeholder="0.00"
                                value={form.amount}
                                onChange={handleChange}
                                required
                                min="0"
                                step="0.01"
                                style={{
                                    paddingLeft: '36px', fontSize: '20px', fontWeight: '700',
                                    fontFamily: 'Space Grotesk'
                                }}
                            />
                        </div>
                    </div>

                    {/* Description */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
                            Description <span style={{ color: '#ef4444' }}>*</span>
                            <span style={{
                                marginLeft: '8px', fontSize: '11px',
                                background: 'rgba(99,102,241,0.1)', color: '#6366f1',
                                padding: '2px 8px', borderRadius: '20px', fontWeight: '600'
                            }}>
                                🤖 AI auto-categorizes
                            </span>
                        </label>
                        <input
                            id="expense-description"
                            name="description"
                            type="text"
                            className="input-field"
                            placeholder='e.g. "Swiggy dinner", "Uber ride", "Netflix subscription"'
                            value={form.description}
                            onChange={handleDescriptionChange}
                            required
                        />
                        {autoCateg && (
                            <div style={{
                                marginTop: '8px', display: 'flex', alignItems: 'center', gap: '6px',
                                color: '#10b981', fontSize: '12px',
                                animation: 'fadeIn 0.3s ease',
                            }}>
                                <Sparkles size={12} />
                                <span>Auto-detected: <strong>{CATEGORY_ICONS[autoCateg]} {autoCateg}</strong></span>
                            </div>
                        )}
                    </div>

                    {/* Category Override */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
                            Category
                            <span style={{ color: '#6b7280', fontWeight: '400', marginLeft: '4px' }}>
                                (leave empty for AI detection)
                            </span>
                        </label>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px' }}>
                            {CATEGORIES.map(cat => (
                                <button
                                    key={cat}
                                    type="button"
                                    onClick={() => setForm(p => ({ ...p, category: p.category === cat ? '' : cat }))}
                                    style={{
                                        padding: '8px 10px',
                                        borderRadius: '8px',
                                        border: `1px solid ${form.category === cat ? CATEGORY_COLORS[cat] + '60' : '#2a2f45'}`,
                                        background: form.category === cat ? `${CATEGORY_COLORS[cat]}15` : '#1a1d26',
                                        cursor: 'pointer',
                                        fontSize: '11px',
                                        fontWeight: '500',
                                        color: form.category === cat ? '#e8eaf0' : '#9ca3af',
                                        transition: 'all 0.2s',
                                        textAlign: 'left',
                                        fontFamily: 'Inter, sans-serif',
                                    }}
                                >
                                    {CATEGORY_ICONS[cat]} {cat}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Date */}
                    <div>
                        <label style={{ fontSize: '13px', fontWeight: '500', color: '#9ca3af', display: 'block', marginBottom: '8px' }}>
                            Date
                        </label>
                        <input
                            id="expense-date"
                            name="date"
                            type="date"
                            className="input-field"
                            value={form.date}
                            onChange={handleChange}
                            max={new Date().toISOString().split('T')[0]}
                        />
                    </div>

                    {/* Recurring */}
                    <div style={{
                        display: 'flex', alignItems: 'center', gap: '12px',
                        padding: '14px', background: '#1a1d26', borderRadius: '10px',
                        border: '1px solid #2a2f45'
                    }}>
                        <input
                            id="expense-recurring"
                            name="isRecurring"
                            type="checkbox"
                            checked={form.isRecurring}
                            onChange={handleChange}
                            style={{ width: '16px', height: '16px', cursor: 'pointer', accentColor: '#6366f1' }}
                        />
                        <div>
                            <label htmlFor="expense-recurring" style={{ fontSize: '14px', fontWeight: '500', color: '#e8eaf0', cursor: 'pointer' }}>
                                🔄 Recurring Expense
                            </label>
                            <div style={{ fontSize: '12px', color: '#6b7280' }}>
                                Mark if this expense repeats monthly (rent, subscriptions, etc.)
                            </div>
                        </div>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: '12px', paddingTop: '8px' }}>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => navigate(-1)}
                            style={{ flex: 1 }}
                        >
                            Cancel
                        </button>
                        <button
                            id="add-expense-submit"
                            type="submit"
                            className="btn-primary"
                            disabled={loading}
                            style={{ flex: 2, opacity: loading ? 0.7 : 1 }}
                        >
                            {loading ? 'Adding...' : '+ Add Expense'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

// Client-side preview categorization
function previewCategorize(description) {
    const maps = {
        'Food & Dining': ['swiggy', 'zomato', 'pizza', 'burger', 'restaurant', 'cafe', 'food', 'lunch', 'dinner', 'kfc', 'mcdonalds', 'dominos'],
        'Transport': ['uber', 'ola', 'rapido', 'taxi', 'bus', 'metro', 'petrol', 'toll'],
        'Shopping': ['amazon', 'flipkart', 'myntra', 'shopping', 'clothes'],
        'Entertainment': ['netflix', 'prime', 'spotify', 'movie', 'cinema', 'gaming'],
        'Health & Medical': ['hospital', 'doctor', 'pharmacy', 'gym', 'medicine'],
        'Education': ['udemy', 'coursera', 'college', 'tuition', 'books'],
        'Utilities': ['electricity', 'internet', 'wifi', 'phone', 'recharge', 'jio', 'airtel'],
        'Housing': ['rent', 'maintenance', 'house'],
        'Travel': ['trip', 'holiday', 'flight', 'hotel', 'airbnb'],
        'Groceries': ['grocery', 'vegetables', 'milk', 'bigbasket', 'dmart'],
    };
    const lower = description.toLowerCase();
    for (const [cat, kws] of Object.entries(maps)) {
        if (kws.some(k => lower.includes(k))) return cat;
    }
    return 'Other';
}
