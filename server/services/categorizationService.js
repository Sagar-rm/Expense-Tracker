/**
 * Smart Auto-Categorization Service
 * Uses keyword matching to categorize expenses based on description
 */

const categoryKeywords = {
    'Food & Dining': [
        'swiggy', 'zomato', 'restaurant', 'cafe', 'coffee', 'pizza', 'burger',
        'food', 'lunch', 'dinner', 'breakfast', 'snack', 'hotel', 'biryani',
        'starbucks', 'mcdonalds', 'kfc', 'dominos', 'subway', 'eat', 'meal',
        'bakery', 'juice', 'tea', 'dosa', 'idli', 'roti', 'noodles', 'sushi',
        'dunkin', 'chipotle', 'taco', 'nandos', 'barbeque', 'bbq', 'dhaba'
    ],
    'Transport': [
        'uber', 'ola', 'rapido', 'auto', 'taxi', 'bus', 'metro', 'railway',
        'train', 'flight', 'fuel', 'petrol', 'diesel', 'toll', 'parking',
        'lyft', 'grab', 'commute', 'travel', 'cab', 'bike', 'rickshaw',
        'airbus', 'indigo', 'spicejet', 'air india', 'vistara', 'ferry'
    ],
    'Shopping': [
        'amazon', 'flipkart', 'myntra', 'ajio', 'meesho', 'nykaa', 'blinkit',
        'zepto', 'shopping', 'clothes', 'shirt', 'jeans', 'shoes', 'bag',
        'accessories', 'watch', 'jewellery', 'fashion', 'dress', 'mall',
        'store', 'purchase', 'buy', 'order', 'delivery', 'snapdeal', 'ebay'
    ],
    'Entertainment': [
        'netflix', 'prime', 'hotstar', 'youtube', 'spotify', 'movie', 'cinema',
        'theatre', 'concert', 'game', 'gaming', 'steam', 'playstation', 'xbox',
        'subscription', 'music', 'show', 'web series', 'ott', 'bookmyshow',
        'pvr', 'inox', 'amusement', 'park', 'event', 'ticket', 'disney'
    ],
    'Health & Medical': [
        'hospital', 'doctor', 'medicine', 'pharmacy', 'clinic', 'medical',
        'health', 'gym', 'fitness', 'yoga', 'insurance', 'diagnostic',
        'lab', 'test', 'scan', 'dental', 'eye', 'surgery', 'consultation',
        'apollo', 'fortis', 'max', 'aiims', 'prescription', 'tablet', 'syrup'
    ],
    'Education': [
        'udemy', 'coursera', 'college', 'university', 'school', 'tuition',
        'books', 'stationery', 'fees', 'exam', 'course', 'learning',
        'certification', 'training', 'workshop', 'seminar', 'library',
        'notebook', 'pen', 'pencil', 'education', 'study', 'skillshare'
    ],
    'Utilities': [
        'electricity', 'water', 'internet', 'wifi', 'broadband', 'phone',
        'mobile', 'recharge', 'bill', 'jio', 'airtel', 'bsnl', 'vi',
        'gas', 'lpg', 'cylinder', 'power', 'connection', 'dth', 'cable',
        'maintenance', 'society', 'rent communication'
    ],
    'Housing': [
        'rent', 'deposit', 'maintenance', 'repair', 'furniture', 'appliance',
        'house', 'flat', 'apartment', 'pg', 'hostel', 'property', 'emi',
        'home loan', 'interior', 'paint', 'cleaning', 'laundry', 'hotel stay'
    ],
    'Travel': [
        'trip', 'holiday', 'vacation', 'tour', 'trek', 'resort', 'airbnb',
        'makemytrip', 'goibibo', 'cleartrip', 'yatra', 'irctc', 'passport',
        'visa', 'baggage', 'luggage', 'backpack', 'goa', 'kerala', 'manali'
    ],
    'Groceries': [
        'grocery', 'vegetables', 'fruits', 'milk', 'eggs', 'bread', 'oil',
        'rice', 'dal', 'atta', 'sugar', 'salt', 'spices', 'dmort', 'dmart',
        'bigbasket', 'grofers', 'blinkit', 'instamart', 'jiomart', 'reliance',
        'super market', 'supermarket', 'bazaar', 'mandi', 'kirana'
    ],
};

/**
 * Auto-categorize an expense based on its description
 * @param {string} description - The expense description
 * @returns {string} - The matched category or 'Other'
 */
const categorizeExpense = (description) => {
    if (!description) return 'Other';

    const lowerDesc = description.toLowerCase().trim();

    for (const [category, keywords] of Object.entries(categoryKeywords)) {
        for (const keyword of keywords) {
            if (lowerDesc.includes(keyword.toLowerCase())) {
                return category;
            }
        }
    }

    return 'Other';
};

/**
 * Get category emoji
 * @param {string} category
 * @returns {string}
 */
const getCategoryEmoji = (category) => {
    const emojis = {
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
    return emojis[category] || '💰';
};

module.exports = { categorizeExpense, getCategoryEmoji, categoryKeywords };
