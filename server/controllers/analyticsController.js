const Expense = require('../models/Expense');
const User = require('../models/User');
const axios = require('axios');
const { calculateBudgetRisk, generateInsights } = require('../services/budgetRiskService');

// @desc Get monthly summary
// @route GET /api/analytics/monthly-summary
const getMonthlySummary = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endOfLastMonth = new Date(now.getFullYear(), now.getMonth(), 0);

        // Current month expenses
        const currentMonthExpenses = await Expense.aggregate([
            { $match: { userId, date: { $gte: startOfMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        // Last month expenses
        const lastMonthExpenses = await Expense.aggregate([
            { $match: { userId, date: { $gte: startOfLastMonth, $lte: endOfLastMonth } } },
            { $group: { _id: null, total: { $sum: '$amount' }, count: { $sum: 1 } } }
        ]);

        // Category breakdown for current month
        const categoryBreakdown = await Expense.aggregate([
            { $match: { userId, date: { $gte: startOfMonth } } },
            { $group: { _id: '$category', total: { $sum: '$amount' }, count: { $sum: 1 } } },
            { $sort: { total: -1 } }
        ]);

        const currentMonthTotal = currentMonthExpenses[0]?.total || 0;
        const lastMonthTotal = lastMonthExpenses[0]?.total || 0;
        const user = await User.findById(userId);

        const riskAlert = calculateBudgetRisk(currentMonthTotal, user.monthlyBudget, lastMonthTotal);
        const insights = generateInsights({
            categoryBreakdown,
            currentMonthTotal,
            lastMonthTotal,
            monthlyBudget: user.monthlyBudget,
        });

        res.json({
            currentMonthTotal,
            lastMonthTotal,
            currentMonthCount: currentMonthExpenses[0]?.count || 0,
            categoryBreakdown,
            monthlyBudget: user.monthlyBudget,
            budgetRemaining: user.monthlyBudget - currentMonthTotal,
            riskAlert,
            insights,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get spending trends (last 6 months)
// @route GET /api/analytics/trends
const getSpendingTrends = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyTrends = await Expense.aggregate([
            { $match: { userId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Format the data
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const formattedTrends = monthlyTrends.map(item => ({
            month: `${months[item._id.month - 1]} ${item._id.year}`,
            total: Math.round(item.total),
            count: item.count,
        }));

        // Detect consecutive growth
        let consecutiveGrowth = 0;
        for (let i = 1; i < formattedTrends.length; i++) {
            if (formattedTrends[i].total > formattedTrends[i - 1].total) {
                consecutiveGrowth++;
            } else {
                consecutiveGrowth = 0;
            }
        }

        // Category trends
        const categoryTrends = await Expense.aggregate([
            { $match: { userId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { category: '$category', month: { $month: '$date' }, year: { $year: '$date' } },
                    total: { $sum: '$amount' },
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        res.json({
            monthlyTrends: formattedTrends,
            consecutiveGrowthMonths: consecutiveGrowth,
            categoryTrends,
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get spending prediction from ML service
// @route GET /api/analytics/prediction
const getPrediction = async (req, res) => {
    try {
        const userId = req.user._id;
        const now = new Date();
        const sixMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 5, 1);

        const monthlyTotals = await Expense.aggregate([
            { $match: { userId, date: { $gte: sixMonthsAgo } } },
            {
                $group: {
                    _id: { year: { $year: '$date' }, month: { $month: '$date' } },
                    total: { $sum: '$amount' },
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        const monthlyData = monthlyTotals.map(m => m.total);

        if (monthlyData.length < 2) {
            return res.json({
                predictedAmount: monthlyData[0] || 0,
                confidence: 'low',
                message: 'Not enough data for prediction',
                monthlyData,
            });
        }

        try {
            // Try ML microservice
            const mlResponse = await axios.post(
                `${process.env.ML_SERVICE_URL}/predict`,
                { monthlyData },
                { timeout: 5000 }
            );

            res.json({
                ...mlResponse.data,
                monthlyData,
            });
        } catch (mlError) {
            // Fallback: simple linear regression
            const n = monthlyData.length;
            const xSum = (n * (n - 1)) / 2;
            const xSquaredSum = (n * (n - 1) * (2 * n - 1)) / 6;
            const ySum = monthlyData.reduce((a, b) => a + b, 0);
            const xySum = monthlyData.reduce((sum, y, i) => sum + i * y, 0);

            const slope = (n * xySum - xSum * ySum) / (n * xSquaredSum - xSum * xSum);
            const intercept = (ySum - slope * xSum) / n;
            const predictedAmount = Math.max(0, Math.round(intercept + slope * n));

            res.json({
                predictedAmount,
                confidence: 'medium',
                message: 'Prediction based on spending trend',
                monthlyData,
                source: 'fallback',
            });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// @desc Get category analysis
// @route GET /api/analytics/categories
const getCategoryAnalysis = async (req, res) => {
    try {
        const userId = req.user._id;
        const { month, year } = req.query;

        const targetDate = new Date(year || new Date().getFullYear(), (month || new Date().getMonth() + 1) - 1, 1);
        const endOfMonth = new Date(targetDate.getFullYear(), targetDate.getMonth() + 1, 0);

        const categoryData = await Expense.aggregate([
            { $match: { userId, date: { $gte: targetDate, $lte: endOfMonth } } },
            {
                $group: {
                    _id: '$category',
                    total: { $sum: '$amount' },
                    count: { $sum: 1 },
                    avgAmount: { $avg: '$amount' },
                }
            },
            { $sort: { total: -1 } }
        ]);

        const totalAmount = categoryData.reduce((sum, c) => sum + c.total, 0);
        const enriched = categoryData.map(cat => ({
            ...cat,
            percentage: Math.round((cat.total / totalAmount) * 100),
            avgAmount: Math.round(cat.avgAmount),
        }));

        res.json({ categories: enriched, totalAmount });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

module.exports = { getMonthlySummary, getSpendingTrends, getPrediction, getCategoryAnalysis };
