from flask import Flask, request, jsonify
import joblib
import re
import nltk
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from flask_cors import CORS

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

# Load model and vectorizer
model = joblib.load("sentiment_model.pkl")
vectorizer = joblib.load("vectorizer.pkl")

# Preprocessing setup
ps = PorterStemmer()
stop_words = set(stopwords.words("english"))

def preprocess(text):
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # remove HTML
    text = re.sub(r'[^\w\s]', '', text)  # remove punctuation
    words = text.split()
    filtered = [ps.stem(w) for w in words if w not in stop_words or w == 'not']
    return " ".join(filtered)

@app.route('/api/predict', methods=['POST'])
def predict():
    data = request.get_json()
    review = data.get("review", "")
    
    if not review.strip():
        return jsonify({"error": "Empty review"}), 400

    processed = preprocess(review)
    vectorized = vectorizer.transform([processed]).toarray()
    prediction = model.predict(vectorized)[0]
    sentiment = "Positive" if prediction == 1 else "Negative"
    return jsonify({"sentiment": sentiment})

if __name__ == '__main__':
    app.run(debug=True)
