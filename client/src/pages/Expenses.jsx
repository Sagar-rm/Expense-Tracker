import { useState, useEffect } from 'react';
import { expenseAPI } from '../services/api';
import { formatCurrency, formatDate, CATEGORIES, CATEGORY_ICONS, CATEGORY_COLORS } from '../utils/helpers';
import { LoadingSpinner, EmptyState, Modal, CategoryBadge } from '../components/ui/Components';
import toast from 'react-hot-toast';
import { Search, Filter, Trash2, Edit3, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Expenses() {
    const [expenses, setExpenses] = useState([]);
    const [total, setTotal] = useState(0);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [filters, setFilters] = useState({ category: 'All', startDate: '', endDate: '' });
    const [editExpense, setEditExpense] = useState(null);
    const [deleteId, setDeleteId] = useState(null);
    const [editForm, setEditForm] = useState({});

    useEffect(() => {
        fetchExpenses();
    }, [page, filters]);

    const fetchExpenses = async () => {
        setLoading(true);
        try {
            const params = { page, limit: 15, ...filters };
            if (params.category === 'All') delete params.category;
            if (!params.startDate) delete params.startDate;
            if (!params.endDate) delete params.endDate;

            const { data } = await expenseAPI.getAll(params);
            setExpenses(data.expenses);
            setTotal(data.total);
            setTotalPages(data.pages);
        } catch (err) {
            toast.error('Failed to fetch expenses');
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        try {
            await expenseAPI.delete(deleteId);
            toast.success('Expense deleted');
            setDeleteId(null);
            fetchExpenses();
        } catch {
            toast.error('Failed to delete');
        }
    };

    const handleEditSave = async () => {
        try {
            await expenseAPI.update(editExpense._id, editForm);
            toast.success('Expense updated!');
            setEditExpense(null);
            fetchExpenses();
        } catch {
            toast.error('Failed to update');
        }
    };

    const openEdit = (exp) => {
        setEditExpense(exp);
        setEditForm({
            amount: exp.amount,
            description: exp.description,
            category: exp.category,
            date: exp.date?.split('T')[0],
        });
    };

    const handleFilterChange = (key, value) => {
        setFilters(p => ({ ...p, [key]: value }));
        setPage(1);
    };

    return (
        <div style={{ maxWidth: '900px' }}>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
                <div>
                    <h1 style={{ margin: '0 0 4px', fontSize: '24px', fontWeight: '800', color: '#e8eaf0', fontFamily: 'Space Grotesk' }}>
                        All Expenses
                    </h1>
                    <p style={{ margin: 0, color: '#9ca3af', fontSize: '14px' }}>
                        {total} {total === 1 ? 'expense' : 'expenses'} found
                    </p>
                </div>
                <Link to="/add-expense">
                    <button className="btn-primary">+ Add Expense</button>
                </Link>
            </div>

            {/* Filters */}
            <div className="card" style={{ marginBottom: '20px', padding: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center' }}>
                    {/* Category filter */}
                    <div style={{ flex: '1', minWidth: '160px' }}>
                        <select
                            id="filter-category"
                            value={filters.category}
                            onChange={e => handleFilterChange('category', e.target.value)}
                            className="input-field"
                            style={{ cursor: 'pointer' }}
                        >
                            <option value="All">All Categories</option>
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                            ))}
                        </select>
                    </div>

                    {/* Date range */}
                    <div style={{ flex: '1', minWidth: '140px' }}>
                        <input
                            type="date"
                            className="input-field"
                            value={filters.startDate}
                            onChange={e => handleFilterChange('startDate', e.target.value)}
                            placeholder="From date"
                        />
                    </div>
                    <div style={{ flex: '1', minWidth: '140px' }}>
                        <input
                            type="date"
                            className="input-field"
                            value={filters.endDate}
                            onChange={e => handleFilterChange('endDate', e.target.value)}
                            placeholder="To date"
                        />
                    </div>

                    <button
                        onClick={() => { setFilters({ category: 'All', startDate: '', endDate: '' }); setPage(1); }}
                        className="btn-secondary"
                        style={{ whiteSpace: 'nowrap' }}
                    >
                        Clear Filters
                    </button>
                </div>
            </div>

            {/* Expense List */}
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
                {loading ? (
                    <LoadingSpinner />
                ) : expenses.length === 0 ? (
                    <EmptyState
                        icon="📭"
                        title="No expenses found"
                        message="Try adjusting your filters or add a new expense."
                    />
                ) : (
                    <>
                        {/* Table Header */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr auto auto auto',
                            gap: '16px',
                            padding: '12px 20px',
                            borderBottom: '1px solid #2a2f45',
                            background: '#1a1d26',
                        }}>
                            {['Description & Category', 'Date', 'Amount', 'Actions'].map(h => (
                                <div key={h} style={{ fontSize: '11px', fontWeight: '600', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                    {h}
                                </div>
                            ))}
                        </div>

                        {/* Rows */}
                        {expenses.map((exp, i) => (
                            <div key={exp._id} style={{
                                display: 'grid',
                                gridTemplateColumns: '1fr auto auto auto',
                                gap: '16px',
                                padding: '14px 20px',
                                borderBottom: '1px solid #1a1d26',
                                alignItems: 'center',
                                transition: 'background 0.2s',
                                animation: `fadeInUp 0.3s ease ${i * 40}ms forwards`,
                                opacity: 0,
                            }}
                                onMouseEnter={e => e.currentTarget.style.background = '#1a1d26'}
                                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                            >
                                {/* Description */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <div style={{
                                        width: '40px', height: '40px',
                                        background: `${CATEGORY_COLORS[exp.category] || '#6b7280'}15`,
                                        borderRadius: '10px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        fontSize: '18px', flexShrink: 0
                                    }}>
                                        {CATEGORY_ICONS[exp.category] || '💰'}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#e8eaf0' }}>
                                            {exp.description}
                                        </div>
                                        <CategoryBadge category={exp.category} />
                                        {exp.isRecurring && (
                                            <span style={{ fontSize: '11px', color: '#6366f1', marginLeft: '6px' }}>🔄 recurring</span>
                                        )}
                                    </div>
                                </div>

                                {/* Date */}
                                <div style={{ fontSize: '13px', color: '#9ca3af', whiteSpace: 'nowrap' }}>
                                    {formatDate(exp.date)}
                                </div>

                                {/* Amount */}
                                <div style={{
                                    fontWeight: '700', fontSize: '15px', color: '#ef4444',
                                    fontFamily: 'Space Grotesk', whiteSpace: 'nowrap'
                                }}>
                                    -{formatCurrency(exp.amount)}
                                </div>

                                {/* Actions */}
                                <div style={{ display: 'flex', gap: '6px' }}>
                                    <button
                                        onClick={() => openEdit(exp)}
                                        style={{
                                            background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)',
                                            color: '#6366f1', borderRadius: '8px', cursor: 'pointer',
                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Edit"
                                    >
                                        <Edit3 size={14} />
                                    </button>
                                    <button
                                        onClick={() => setDeleteId(exp._id)}
                                        style={{
                                            background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)',
                                            color: '#ef4444', borderRadius: '8px', cursor: 'pointer',
                                            width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        title="Delete"
                                    >
                                        <Trash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div style={{
                                display: 'flex', justifyContent: 'center', alignItems: 'center',
                                gap: '12px', padding: '16px', borderTop: '1px solid #2a2f45'
                            }}>
                                <button
                                    onClick={() => setPage(p => p - 1)}
                                    disabled={page === 1}
                                    className="btn-secondary"
                                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    <ChevronLeft size={14} /> Prev
                                </button>
                                <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage(p => p + 1)}
                                    disabled={page === totalPages}
                                    className="btn-secondary"
                                    style={{ padding: '8px 12px', display: 'flex', alignItems: 'center', gap: '4px' }}
                                >
                                    Next <ChevronRight size={14} />
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>

            {/* Edit Modal */}
            <Modal isOpen={!!editExpense} onClose={() => setEditExpense(null)} title="Edit Expense">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                        <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Amount (₹)</label>
                        <input
                            type="number"
                            className="input-field"
                            value={editForm.amount}
                            onChange={e => setEditForm(p => ({ ...p, amount: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Description</label>
                        <input
                            type="text"
                            className="input-field"
                            value={editForm.description}
                            onChange={e => setEditForm(p => ({ ...p, description: e.target.value }))}
                        />
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Category</label>
                        <select
                            className="input-field"
                            value={editForm.category}
                            onChange={e => setEditForm(p => ({ ...p, category: e.target.value }))}
                        >
                            {CATEGORIES.map(c => (
                                <option key={c} value={c}>{CATEGORY_ICONS[c]} {c}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label style={{ fontSize: '13px', color: '#9ca3af', display: 'block', marginBottom: '6px' }}>Date</label>
                        <input
                            type="date"
                            className="input-field"
                            value={editForm.date}
                            onChange={e => setEditForm(p => ({ ...p, date: e.target.value }))}
                        />
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        <button className="btn-secondary" onClick={() => setEditExpense(null)} style={{ flex: 1 }}>Cancel</button>
                        <button className="btn-primary" onClick={handleEditSave} style={{ flex: 2 }}>Save Changes</button>
                    </div>
                </div>
            </Modal>

            {/* Delete Confirm Modal */}
            <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Delete Expense">
                <p style={{ color: '#9ca3af', marginTop: 0 }}>
                    Are you sure you want to delete this expense? This action cannot be undone.
                </p>
                <div style={{ display: 'flex', gap: '12px' }}>
                    <button className="btn-secondary" onClick={() => setDeleteId(null)} style={{ flex: 1 }}>Cancel</button>
                    <button className="btn-danger" onClick={handleDelete} style={{ flex: 1 }}>Delete</button>
                </div>
            </Modal>
        </div>
    );
}
