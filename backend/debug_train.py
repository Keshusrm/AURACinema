import os
import pandas as pd
from ml_engine import load_data, build_tfidf, extract_primary_genre
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import LabelEncoder
import time

def debug_train():
    print("Loading data...")
    df = load_data()
    print(f"Data loaded: {len(df)} rows")
    
    tfidf, X = build_tfidf(df)
    print(f"TF-IDF matrix shape: {X.shape}")
    
    df["primary_genre"] = df["listed_in"].apply(extract_primary_genre)
    le = LabelEncoder()
    y = le.fit_transform(df["primary_genre"])
    print(f"Unique genres: {len(le.classes_)}")
    
    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
    print(f"Train size: {X_train.shape[0]}, Test size: {X_test.shape[0]}")
    
    models = [
        ("Logistic Regression", LogisticRegression(max_iter=1000)),
        ("KNN", KNeighborsClassifier(n_neighbors=5)),
        ("Naive Bayes", MultinomialNB()),
        ("Random Forest", RandomForestClassifier(n_estimators=100))
    ]
    
    for name, model in models:
        print(f"Testing {name}...")
        start = time.time()
        model.fit(X_train, y_train)
        print(f"  {name} fit in {time.time() - start:.4f}s")
        start = time.time()
        model.predict(X_test)
        print(f"  {name} predict in {time.time() - start:.4f}s")

if __name__ == "__main__":
    debug_train()
