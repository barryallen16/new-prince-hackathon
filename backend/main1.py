from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import random

text_model = joblib.load('text_model.joblib')

motivational_responses = {
    "Low": [
        "You're doing amazing! Keep spreading positivity wherever you go.",
        "Your strength is inspiring—keep up the great work!",
        "You’ve got a bright spirit! Celebrate the little wins today.",
        "Keep that positive energy flowing—you’re on the right track!",
        "You’re thriving! Take a moment to appreciate how far you’ve come."
    ],
    "Medium": [
        "It’s okay to have off days—take a deep breath and give yourself some grace.",
        "You’re stronger than you realize. Maybe try a calming activity like journaling?",
        "Some days are tougher, but you’ve got this! How about a warm cup of tea to relax?",
        "You’re doing your best, and that’s enough. Take it one step at a time.",
        "It’s okay to feel this way. Maybe a short walk or some music can lift your spirits?"
    ],
    "High": [
        "You’re not alone in this—reaching out to a friend or loved one can make a big difference.",
        "Tough moments don’t last forever. You’re enough, just as you are, and help is always there.",
        "It’s okay to feel overwhelmed. Consider talking to someone you trust when you’re ready.",
        "You’re stronger than you think, even on hard days. Small steps forward are still progress.",
        "You deserve care and support—don’t hesitate to reach out to someone who can listen."
    ]
}

def analyze_text(text):
    return text_model.predict([text])[0]

app = Flask(__name__)
CORS(app)  

@app.route('/predict_text', methods=['POST'])
def predict_text():
    try:
        data = request.get_json()
        text = data['text']
        risk_score = analyze_text(text)  
        risk_score = int(risk_score)  
        risk_label = {0: 'Low', 1: 'Medium', 2: 'High'}[risk_score]
        
        message = random.choice(motivational_responses[risk_label])
        
        return jsonify({
            'risk': risk_label,
            'score': risk_score,
            'message': message
        })
    except Exception as e:
        return jsonify({'error': str(e)}), 400

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)