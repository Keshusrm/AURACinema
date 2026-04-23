# 🎬 Aura Cinema

**AI-Powered Movie & Series Recommender — The Celestial Curator**

Aura Cinema is a premium, full-stack movie recommendation platform that leverages machine learning to discover content tailored to your mood. Featuring a stunning cosmic-themed interface, it not only suggests what to watch but also provides deep insights into the AI models driving the recommendations.

---

## ✨ Key Features

- **🚀 Smart Search**: Free-text search powered by TF-IDF and Cosine Similarity.
- **🧠 Quad-Model Intelligence**: Simultaneously evaluates 4 distinct ML models:
  - Logistic Regression
  - K-Nearest Neighbors (KNN)
  - Naive Bayes
  - Random Forest
- **📊 Model Insights**: Interactive visualizations of model performance, including Accuracy, Precision, Recall, and Confusion Matrices.
- **🌌 Celestial UI**: A high-end, responsive design featuring glassmorphism, smooth animations (Framer Motion), and a custom cosmic color palette.
- **⚡ Optimized Performance**: Lazy-loaded components, optimized dependency pre-bundling, and pre-trained models on startup.

---

## 🛠️ Technology Stack

### **Frontend**
- **React 18** + **Vite** (Lightning-fast dev & build)
- **Tailwind CSS** (Utility-first styling)
- **Framer Motion** (Premium animations & transitions)
- **Recharts** (Data visualization for model stats)
- **Zustand** (Minimalist state management)
- **Axios** (Backend communication)

### **Backend**
- **FastAPI** (High-performance Python API)
- **Scikit-learn** (Machine learning engine)
- **Pandas & NumPy** (Data processing)
- **Uvicorn** (ASGI server)

---

## 🚀 Getting Started

### **Prerequisites**
- Node.js (v18+)
- Python 3.9+
- Git

### **Installation**

1. **Clone the Repository**
   ```bash
   git clone https://github.com/Keshusrm/AURACinema.git
   cd AURACinema
   ```

2. **Backend Setup**
   ```bash
   cd backend
   python3 -m venv venv
   source venv/bin/activate
   pip install -r requirements.txt
   ```

3. **Frontend Setup**
   ```bash
   cd ../frontend
   npm install
   ```

### **Running the Application**

You can use the provided startup script in the root directory:
```bash
./start.sh
```

Or start them manually:
- **Backend**: `cd backend && uvicorn app:app --reload`
- **Frontend**: `cd frontend && npm run dev`

---

## 🔬 How the AI Works

Aura Cinema uses a **Content-Based Filtering** approach. 
1. **Feature Extraction**: It combines movie titles, directors, cast, genres, and descriptions into a "content soup."
2. **Vectorization**: Converts text features into numerical vectors using `TfidfVectorizer`.
3. **Similarity Calculation**: Uses `NearestNeighbors` (KNN) with cosine similarity to find the most relevant matches for your query.
4. **Evaluation**: Periodically evaluates itself against the dataset to ensure the best model is used for your recommendations.

---

## 📸 UI Preview

*Aura Cinema features a dark, cosmic aesthetic with vibrant purple accents and golden highlights for premium content.*

---

## 📄 License
This project is for educational purposes. Feel free to use and adapt!

Created with 💜 by **Keshusrm**
