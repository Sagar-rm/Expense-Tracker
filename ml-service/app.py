from flask import Flask, request, jsonify
from flask_cors import CORS
from model import predict_expense, detect_trend

app = Flask(__name__)
CORS(app)

@app.route('/health', methods=['GET'])
def health():
    return jsonify({'status': 'OK', 'message': '🤖 ML Service is running'})

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        monthly_data = data.get('monthlyData', [])
        
        if not monthly_data or len(monthly_data) < 2:
            return jsonify({
                'error': 'Insufficient data',
                'message': 'Need at least 2 months of data'
            }), 400
        
        result = predict_expense(monthly_data)
        trend = detect_trend(monthly_data)
        
        return jsonify({
            **result,
            **trend
        })
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/analyze', methods=['POST'])
def analyze():
    try:
        data = request.get_json()
        monthly_data = data.get('monthlyData', [])
        
        if not monthly_data:
            return jsonify({'error': 'No data provided'}), 400
        
        trend = detect_trend(monthly_data)
        
        return jsonify(trend)
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🤖 Starting ML Microservice on port 8000...")
    app.run(host='0.0.0.0', port=8000, debug=True)
