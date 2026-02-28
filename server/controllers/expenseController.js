const Expense = require('../models/Expense');
const { categorizeExpense } = require('../services/categorizationService');

// @desc Add new expense
// @route POST /api/expenses
const addExpense = async (req, res) => {
    try {
        const { amount, description, date, category, isRecurring, tags } = req.body;

        if (!amount || !description) {
            return res.status(400).json({ message: 'Amount and description are required' });
        }

        // Auto-categorize if no category provided
        const autoCategory = category || categorizeExpense(description);

        const expense = await Expense.create({
            userId: req.user._id,
            amount: parseFloat(amount),
            description,
            category: autoCategory,
            date: date || new Date(),
            isRecurring: isRecurring || false,
            tags: tags || [],
        });

        res.status(201).json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get all expenses for user
// @route GET /api/expenses
const getExpenses = async (req, res) => {
    try {
        const {
            category,
            startDate,
            endDate,
            page = 1,
            limit = 20,
            sort = '-date'
        } = req.query;

        const query = { userId: req.user._id };

        if (category && category !== 'All') {
            query.category = category;
        }

        if (startDate || endDate) {
            query.date = {};
            if (startDate) query.date.$gte = new Date(startDate);
            if (endDate) query.date.$lte = new Date(endDate);
        }

        const total = await Expense.countDocuments(query);
        const expenses = await Expense.find(query)
            .sort(sort)
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        res.json({
            expenses,
            total,
            page: parseInt(page),
            pages: Math.ceil(total / limit),
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get single expense
// @route GET /api/expenses/:id
const getExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });
        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }
        res.json(expense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Update expense
// @route PUT /api/expenses/:id
const updateExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        const { amount, description, date, category, isRecurring, tags } = req.body;

        expense.amount = amount !== undefined ? parseFloat(amount) : expense.amount;
        expense.description = description || expense.description;
        expense.date = date || expense.date;
        expense.category = category || (description ? categorizeExpense(description) : expense.category);
        expense.isRecurring = isRecurring !== undefined ? isRecurring : expense.isRecurring;
        expense.tags = tags || expense.tags;

        const updatedExpense = await expense.save();
        res.json(updatedExpense);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Delete expense
// @route DELETE /api/expenses/:id
const deleteExpense = async (req, res) => {
    try {
        const expense = await Expense.findOne({ _id: req.params.id, userId: req.user._id });

        if (!expense) {
            return res.status(404).json({ message: 'Expense not found' });
        }

        await expense.deleteOne();
        res.json({ message: 'Expense removed successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { addExpense, getExpenses, getExpense, updateExpense, deleteExpense };
