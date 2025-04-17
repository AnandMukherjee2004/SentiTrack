import pandas as pd
import re
import joblib
from nltk.corpus import stopwords
from nltk.stem import PorterStemmer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

# Load dataset
df = pd.read_csv("IMDB Dataset.csv")

# NLTK setup
ps = PorterStemmer()
stop_words = set(stopwords.words("english"))

# Preprocessing function
def preprocess(text):
    text = text.lower()
    text = re.sub(r'<.*?>', '', text)  # remove HTML
    text = re.sub(r'[^\w\s]', '', text)  # remove punctuation
    words = text.split()
    filtered = [ps.stem(w) for w in words if w not in stop_words or w == 'not']
    return " ".join(filtered)

# Apply preprocessing
df['review'] = df['review'].apply(preprocess)
df['sentiment'] = df['sentiment'].map({'positive': 1, 'negative': 0})

# Vectorization
vectorizer = TfidfVectorizer(max_features=5000, ngram_range=(1, 2))
X = vectorizer.fit_transform(df['review']).toarray()
y = df['sentiment']

# Model training
model = LogisticRegression(max_iter=1000)
model.fit(X, y)

# Save model and vectorizer
joblib.dump(model, "sentiment_model.pkl")
joblib.dump(vectorizer, "vectorizer.pkl")
