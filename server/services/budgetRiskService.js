/**
 * Budget Risk Alert Service
 * Analyzes spending patterns and generates risk alerts
 */

/**
 * Calculate budget risk level
 * @param {number} totalSpent - Total amount spent this month
 * @param {number} monthlyBudget - User's monthly budget
 * @param {number} lastMonthTotal - Total spent last month
 * @returns {Object} - Risk alert object
 */
const calculateBudgetRisk = (totalSpent, monthlyBudget, lastMonthTotal) => {
    const budgetUsagePercent = (totalSpent / monthlyBudget) * 100;

    let growthPercent = 0;
    if (lastMonthTotal > 0) {
        growthPercent = ((totalSpent - lastMonthTotal) / lastMonthTotal) * 100;
    }

    // HIGH risk: Exceeded budget
    if (totalSpent > monthlyBudget) {
        return {
            risk: 'HIGH',
            level: 3,
            color: '#ef4444',
            message: `🚨 Budget Exceeded! You've spent ₹${Math.round(totalSpent).toLocaleString()} which is ₹${Math.round(totalSpent - monthlyBudget).toLocaleString()} over your budget.`,
            budgetUsagePercent: Math.round(budgetUsagePercent),
            growthPercent: Math.round(growthPercent),
        };
    }

    // HIGH risk: Spending growth > 30%
    if (growthPercent > 30 && lastMonthTotal > 0) {
        return {
            risk: 'HIGH',
            level: 3,
            color: '#ef4444',
            message: `🚨 Rapid spending growth! Your spending increased by ${Math.round(growthPercent)}% compared to last month.`,
            budgetUsagePercent: Math.round(budgetUsagePercent),
            growthPercent: Math.round(growthPercent),
        };
    }

    // MEDIUM risk: Using > 80% of budget
    if (budgetUsagePercent > 80) {
        return {
            risk: 'MEDIUM',
            level: 2,
            color: '#f59e0b',
            message: `⚠️ Warning! You've used ${Math.round(budgetUsagePercent)}% of your monthly budget. Only ₹${Math.round(monthlyBudget - totalSpent).toLocaleString()} remaining.`,
            budgetUsagePercent: Math.round(budgetUsagePercent),
            growthPercent: Math.round(growthPercent),
        };
    }

    // MEDIUM risk: Spending growth > 20%
    if (growthPercent > 20 && lastMonthTotal > 0) {
        return {
            risk: 'MEDIUM',
            level: 2,
            color: '#f59e0b',
            message: `⚠️ Your spending increased by ${Math.round(growthPercent)}% from last month. Monitor your expenses carefully.`,
            budgetUsagePercent: Math.round(budgetUsagePercent),
            growthPercent: Math.round(growthPercent),
        };
    }

    // LOW risk: Everything is fine
    return {
        risk: 'LOW',
        level: 1,
        color: '#10b981',
        message: `✅ Great! You've used ${Math.round(budgetUsagePercent)}% of your budget. You're on track!`,
        budgetUsagePercent: Math.round(budgetUsagePercent),
        growthPercent: Math.round(growthPercent),
    };
};

/**
 * Generate AI-style spending insights
 * @param {Object} analytics - Analytics data
 * @returns {Array} - Array of insight strings
 */
const generateInsights = (analytics) => {
    const insights = [];
    const { categoryBreakdown, currentMonthTotal, lastMonthTotal, monthlyBudget } = analytics;

    // Category-specific insights
    if (categoryBreakdown && categoryBreakdown.length > 0) {
        const topCategory = categoryBreakdown[0];
        const topPercent = Math.round((topCategory.total / currentMonthTotal) * 100);

        if (topPercent > 40) {
            insights.push({
                type: 'warning',
                icon: '📊',
                title: 'Top Spending Category',
                message: `You're spending ${topPercent}% of your budget on ${topCategory._id}. Consider diversifying.`,
            });
        }

        // Food spending alert
        const foodCategory = categoryBreakdown.find(c => c._id === 'Food & Dining');
        if (foodCategory) {
            const foodPercent = Math.round((foodCategory.total / currentMonthTotal) * 100);
            if (foodPercent > 30) {
                insights.push({
                    type: 'tip',
                    icon: '🍽️',
                    title: 'Food Spending High',
                    message: `You're spending ${foodPercent}% more on food. Try cooking at home to save ₹${Math.round(foodCategory.total * 0.4).toLocaleString()}/month.`,
                });
            }
        }
    }

    // Month-over-month insight
    if (lastMonthTotal > 0) {
        const change = ((currentMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        if (change > 0) {
            insights.push({
                type: 'alert',
                icon: '📈',
                title: 'Spending Increase',
                message: `Your spending increased by ${Math.round(change)}% compared to last month.`,
            });
        } else if (change < -10) {
            insights.push({
                type: 'success',
                icon: '🎉',
                title: 'Great Savings!',
                message: `Excellent! You reduced spending by ${Math.abs(Math.round(change))}% compared to last month!`,
            });
        }
    }

    // Budget usage insight
    const budgetUsed = (currentMonthTotal / monthlyBudget) * 100;
    const daysElapsed = new Date().getDate();
    const totalDays = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate();
    const expectedUsage = (daysElapsed / totalDays) * 100;

    if (budgetUsed > expectedUsage + 15) {
        insights.push({
            type: 'warning',
            icon: '⏰',
            title: 'Spending Pace Alert',
            message: `You've used ${Math.round(budgetUsed)}% of budget with ${daysElapsed} days gone. At this pace, you'll exceed budget.`,
        });
    }

    if (insights.length === 0) {
        insights.push({
            type: 'success',
            icon: '✨',
            title: 'Looking Good!',
            message: 'Your spending habits are healthy. Keep it up!',
        });
    }

    return insights;
};

module.exports = { calculateBudgetRisk, generateInsights };
