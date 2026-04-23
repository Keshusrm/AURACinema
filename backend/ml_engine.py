"""
Aura Cinema — ML Recommendation Engine
Trains 4 models: Logistic Regression, KNN, Naive Bayes, Random Forest
Provides content-based recommendations using TF-IDF + cosine similarity
"""

import os
import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LogisticRegression
from sklearn.neighbors import KNeighborsClassifier, NearestNeighbors
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import (
    accuracy_score,
    precision_score,
    recall_score,
    f1_score,
    confusion_matrix,
)
from sklearn.preprocessing import LabelEncoder

# ─── Data Loading ────────────────────────────────────────────────────────────

DATA_PATH = os.path.join(os.path.dirname(__file__), "data", "aura_cinema_titles.csv")


def load_data():
    """Load and preprocess Netflix titles CSV."""
    df = pd.read_csv(DATA_PATH)
    # Fill NaN with empty strings
    for col in ["director", "cast", "country", "date_added", "rating", "duration", "listed_in", "description"]:
        df[col] = df[col].fillna("")
    # Create combined text feature ("soup")
    df["soup"] = (
        df["title"] + " " +
        df["director"] + " " +
        df["cast"] + " " +
        df["listed_in"] + " " +
        df["description"]
    )
    return df


# ─── Feature Engineering ─────────────────────────────────────────────────────

def build_tfidf(df):
    """Build TF-IDF matrix from the soup column."""
    tfidf = TfidfVectorizer(
        max_features=5000,
        ngram_range=(1, 2),
        stop_words="english",
    )
    tfidf_matrix = tfidf.fit_transform(df["soup"])
    return tfidf, tfidf_matrix


def extract_primary_genre(listed_in_str):
    """Extract the first genre from listed_in."""
    genres = [g.strip() for g in listed_in_str.split(",") if g.strip()]
    return genres[0] if genres else "Unknown"


# ─── Model Training & Evaluation ─────────────────────────────────────────────

class AuraCinemaEngine:
    """Core ML engine: trains 4 classifiers and provides KNN-based recommendations."""

    def __init__(self):
        self.df = None
        self.tfidf = None
        self.tfidf_matrix = None
        self.knn_model = None  # NearestNeighbors for recommendation
        self.model_scores = {}
        self.best_model = None
        self._trained = False

    def train(self):
        """Load data, build features, train and evaluate all 4 models."""
        print("   [1/6] Loading data and building TF-IDF...")
        # Load
        self.df = load_data()
        self.tfidf, self.tfidf_matrix = build_tfidf(self.df)

        # ── Prepare classification targets ────────────────────────────
        # Target 1: type (Movie / TV Show)
        le_type = LabelEncoder()
        y_type = le_type.fit_transform(self.df["type"])

        # Target 2: primary genre
        self.df["primary_genre"] = self.df["listed_in"].apply(extract_primary_genre)
        le_genre = LabelEncoder()
        y_genre = le_genre.fit_transform(self.df["primary_genre"])

        X = self.tfidf_matrix

        # ── Train/test split (use genre as target for classifier eval) ─
        X_train, X_test, y_train, y_test = train_test_split(
            X, y_genre, test_size=0.2, random_state=42
        )

        # Determine number of unique classes
        n_classes = len(np.unique(y_genre))
        n_test_classes = len(np.unique(y_test))

        # Averaging strategy
        avg = "weighted"

        # ── 1. Logistic Regression ────────────────────────────────────
        print("   [2/6] Training Logistic Regression...")
        lr = LogisticRegression(max_iter=1000, random_state=42, solver="lbfgs")
        lr.fit(X_train, y_train)
        y_pred_lr = lr.predict(X_test)
        self.model_scores["logistic_regression"] = self._eval(y_test, y_pred_lr, avg)

        # ── 2. KNN Classifier (for evaluation) ───────────────────────
        print("   [3/6] Training KNN Classifier...")
        k = min(5, self.df.shape[0] - 1)
        knn_clf = KNeighborsClassifier(n_neighbors=max(k, 1), metric="cosine", algorithm="brute")
        knn_clf.fit(X_train, y_train)
        y_pred_knn = knn_clf.predict(X_test)
        self.model_scores["knn"] = self._eval(y_test, y_pred_knn, avg)

        # ── 3. Naive Bayes ────────────────────────────────────────────
        print("   [4/6] Training Naive Bayes...")
        nb = MultinomialNB()
        nb.fit(X_train, y_train)
        y_pred_nb = nb.predict(X_test)
        self.model_scores["naive_bayes"] = self._eval(y_test, y_pred_nb, avg)

        # ── 4. Random Forest ──────────────────────────────────────────
        print("   [5/6] Training Random Forest...")
        rf = RandomForestClassifier(n_estimators=100, random_state=42)
        rf.fit(X_train, y_train)
        y_pred_rf = rf.predict(X_test)
        self.model_scores["random_forest"] = self._eval(y_test, y_pred_rf, avg)

        # ── Determine best model by F1 ────────────────────────────────
        self.best_model = max(
            self.model_scores,
            key=lambda m: self.model_scores[m]["f1"],
        )

        # ── KNN for recommendation (unsupervised nearest neighbors) ───
        print("   [6/6] Building Recommendation Engine...")
        self.knn_model = NearestNeighbors(
            n_neighbors=min(10, len(self.df)),
            metric="cosine",
            algorithm="brute",
        )
        self.knn_model.fit(self.tfidf_matrix)

        self._trained = True
        return self.model_scores

    @staticmethod
    def _eval(y_true, y_pred, avg):
        """Compute classification metrics."""
        return {
            "accuracy": round(float(accuracy_score(y_true, y_pred)), 4),
            "precision": round(float(precision_score(y_true, y_pred, average=avg, zero_division=0)), 4),
            "recall": round(float(recall_score(y_true, y_pred, average=avg, zero_division=0)), 4),
            "f1": round(float(f1_score(y_true, y_pred, average=avg, zero_division=0)), 4),
            "confusion_matrix": confusion_matrix(y_true, y_pred).tolist(),
        }

    # ─── Recommendation ──────────────────────────────────────────────────────

    def recommend(self, query: str, top_n: int = 5):
        """
        Given a free-text query, return the top_n most relevant titles
        using KNN cosine similarity on TF-IDF vectors.
        """
        if not self._trained:
            self.train()

        # Transform query to TF-IDF space
        query_vec = self.tfidf.transform([query])

        # Find nearest neighbors
        distances, indices = self.knn_model.kneighbors(query_vec, n_neighbors=min(top_n, len(self.df)))

        results = []
        for dist, idx in zip(distances[0], indices[0]):
            row = self.df.iloc[idx]
            relevance = round(float(1 - dist), 4)  # cosine similarity = 1 - cosine distance
            results.append({
                "show_id": row["show_id"],
                "title": row["title"],
                "type": row["type"],
                "description": row["description"],
                "director": row["director"],
                "cast": row["cast"],
                "listed_in": row["listed_in"],
                "rating": row["rating"],
                "release_year": int(row["release_year"]),
                "duration": row["duration"],
                "country": row["country"],
                "relevance_score": max(relevance, 0.0),
                "model_used": "KNN",
            })

        return {
            "results": results,
            "model_scores": self.model_scores,
            "best_model": self.best_model,
        }

    def get_model_stats(self):
        """Return full model evaluation statistics."""
        if not self._trained:
            self.train()
        return {
            "model_scores": self.model_scores,
            "best_model": self.best_model,
        }


# Singleton engine instance
engine = AuraCinemaEngine()
