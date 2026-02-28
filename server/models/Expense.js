const mongoose = require('mongoose');

const CATEGORIES = [
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

const expenseSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    amount: {
        type: Number,
        required: [true, 'Amount is required'],
        min: [0, 'Amount must be positive'],
    },
    category: {
        type: String,
        enum: CATEGORIES,
        default: 'Other',
    },
    description: {
        type: String,
        required: [true, 'Description is required'],
        trim: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
    isRecurring: {
        type: Boolean,
        default: false,
    },
    tags: [String],
}, { timestamps: true });

module.exports = mongoose.model('Expense', expenseSchema);
module.exports.CATEGORIES = CATEGORIES;
