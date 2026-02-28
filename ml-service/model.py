import numpy as np

def predict_expense(monthly_data):
    """
    Predict next month's expense using Linear Regression.
    
    Args:
        monthly_data: List of monthly expense totals (e.g., [5000, 7000, 6500])
    
    Returns:
        dict with predictedAmount and confidence
    """
    try:
        data = [float(x) for x in monthly_data]
        n = len(data)
        
        # X values: indices 0, 1, 2, ...
        X = np.array(range(n), dtype=float)
        y = np.array(data, dtype=float)
        
        # Linear regression: y = mx + b
        # Using least squares method
        x_mean = np.mean(X)
        y_mean = np.mean(y)
        
        numerator = np.sum((X - x_mean) * (y - y_mean))
        denominator = np.sum((X - x_mean) ** 2)
        
        if denominator == 0:
            slope = 0
        else:
            slope = numerator / denominator
        
        intercept = y_mean - slope * x_mean
        
        # Predict next month (index = n)
        predicted = slope * n + intercept
        predicted_amount = max(0, round(predicted))
        
        # Calculate R-squared for confidence
        y_pred = slope * X + intercept
        ss_res = np.sum((y - y_pred) ** 2)
        ss_tot = np.sum((y - y_mean) ** 2)
        r_squared = 1 - (ss_res / ss_tot) if ss_tot != 0 else 0
        
        # Determine confidence level
        if r_squared > 0.8:
            confidence = 'high'
        elif r_squared > 0.5:
            confidence = 'medium'
        else:
            confidence = 'low'
        
        return {
            'predictedAmount': predicted_amount,
            'confidence': confidence,
            'r_squared': round(float(r_squared), 3),
            'slope': round(float(slope), 2),
            'message': f'Prediction based on {n} months of data with {confidence} confidence',
            'source': 'ml_service'
        }
    
    except Exception as e:
        # Fallback: use simple average with trend
        avg = sum(float(x) for x in monthly_data) / len(monthly_data)
        return {
            'predictedAmount': round(avg),
            'confidence': 'low',
            'message': 'Simple average prediction (fallback)',
            'error': str(e),
            'source': 'fallback'
        }


def detect_trend(monthly_data):
    """
    Detect spending trend from monthly data.
    
    Returns:
        dict with trend info
    """
    try:
        data = [float(x) for x in monthly_data]
        n = len(data)
        
        if n < 2:
            return {'trend': 'insufficient_data', 'consecutiveGrowth': 0}
        
        # Count consecutive growth months
        consecutive_growth = 0
        for i in range(n - 1, 0, -1):
            if data[i] > data[i - 1]:
                consecutive_growth += 1
            else:
                break
        
        # Overall trend
        if n >= 2:
            first_half = np.mean(data[:n//2])
            second_half = np.mean(data[n//2:])
            growth_rate = ((second_half - first_half) / first_half) * 100 if first_half > 0 else 0
        else:
            growth_rate = 0
        
        if growth_rate > 15:
            trend = 'increasing'
        elif growth_rate < -15:
            trend = 'decreasing'
        else:
            trend = 'stable'
        
        return {
            'trend': trend,
            'growthRate': round(float(growth_rate), 1),
            'consecutiveGrowthMonths': consecutive_growth,
            'trendMessage': _get_trend_message(trend, consecutive_growth, growth_rate)
        }
    
    except Exception as e:
        return {'trend': 'unknown', 'error': str(e)}


def _get_trend_message(trend, consecutive_growth, growth_rate):
    if trend == 'increasing':
        if consecutive_growth >= 3:
            return f"⚠️ Your spending increased for {consecutive_growth} consecutive months!"
        return f"📈 Spending is trending upward by {abs(round(growth_rate))}%"
    elif trend == 'decreasing':
        return f"✅ Great! Spending is trending down by {abs(round(growth_rate))}%"
    else:
        return "📊 Spending is stable — keep it up!"
