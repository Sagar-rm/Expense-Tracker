// Utility functions

export const CATEGORIES = [
    'Food & Dining',
    'Transport',
    'Shopping',
    'Entertainment',
    'Health & Medical',
    'Education',
    'Utilities',
    'Housing',
    'Travel',
    'Groceries',
    'Other',
];

export const CATEGORY_ICONS = {
    'Food & Dining': '🍽️',
    'Transport': '🚗',
    'Shopping': '🛍️',
    'Entertainment': '🎬',
    'Health & Medical': '🏥',
    'Education': '📚',
    'Utilities': '💡',
    'Housing': '🏠',
    'Travel': '✈️',
    'Groceries': '🛒',
    'Other': '💰',
};

export const CATEGORY_COLORS = {
    'Food & Dining': '#ef4444',
    'Transport': '#3b82f6',
    'Shopping': '#8b5cf6',
    'Entertainment': '#ec4899',
    'Health & Medical': '#10b981',
    'Education': '#06b6d4',
    'Utilities': '#f59e0b',
    'Housing': '#6366f1',
    'Travel': '#14b8a6',
    'Groceries': '#84cc16',
    'Other': '#6b7280',
};

export const formatCurrency = (amount, currency = '₹') => {
    return `${currency}${Math.round(amount).toLocaleString('en-IN')}`;
};

export const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    });
};

export const formatRelativeDate = (date) => {
    const now = new Date();
    const d = new Date(date);
    const diff = Math.floor((now - d) / (1000 * 60 * 60 * 24));

    if (diff === 0) return 'Today';
    if (diff === 1) return 'Yesterday';
    if (diff < 7) return `${diff} days ago`;
    return formatDate(date);
};

export const getMonthName = (monthIndex) => {
    const months = ['January', 'February', 'March', 'April', 'May', 'June',
        'July', 'August', 'September', 'October', 'November', 'December'];
    return months[monthIndex];
};

export const getCurrentMonthYear = () => {
    const now = new Date();
    return `${getMonthName(now.getMonth())} ${now.getFullYear()}`;
};

export const getRiskColor = (risk) => {
    const colors = {
        HIGH: '#ef4444',
        MEDIUM: '#f59e0b',
        LOW: '#10b981',
    };
    return colors[risk] || '#6b7280';
};

export const truncate = (str, length = 30) => {
    return str?.length > length ? `${str.substring(0, length)}...` : str;
};
