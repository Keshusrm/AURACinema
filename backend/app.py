"""
Aura Cinema — FastAPI Application
Exposes /recommend and /model-stats endpoints
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import Optional

from ml_engine import engine

# ─── App Setup ────────────────────────────────────────────────────────────────

app = FastAPI(
    title="Aura Cinema API",
    description="AI-Powered Movie & Series Recommender — 4 ML Models",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ─── Request / Response Models ────────────────────────────────────────────────

class RecommendRequest(BaseModel):
    query: str
    top_n: Optional[int] = Field(default=5, ge=1, le=20)


# ─── Startup Event ────────────────────────────────────────────────────────────

@app.on_event("startup")
async def startup_event():
    """Train models on startup to ensure first request is fast."""
    print("\n🎬 Aura Cinema — API is starting...")
    print("   [Background] Training ML models...")
    try:
        engine.train()
        print("   ✅ Models trained and ready!\n")
    except Exception as e:
        print(f"   ❌ Error during startup training: {e}\n")


# ─── Endpoints ────────────────────────────────────────────────────────────────

@app.post("/recommend")
async def recommend(req: RecommendRequest):
    """Get ML-powered recommendations for a free-text query."""
    result = engine.recommend(query=req.query, top_n=req.top_n)
    return result


@app.get("/model-stats")
async def model_stats():
    """Return evaluation metrics for all 4 trained models."""
    return engine.get_model_stats()


@app.get("/")
async def root():
    return {
        "service": "Aura Cinema API",
        "version": "1.0.0",
        "endpoints": ["/recommend", "/model-stats"],
    }
