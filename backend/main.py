"""
Fake Account Detector - FastAPI Backend
========================================
Loads a pre-trained Scikit-Learn Random Forest model and serves
binary predictions (Real / Fake) through a REST API.
"""

import os
import numpy as np
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from typing import List

# ---------------------------------------------------------------------------
# App Setup
# ---------------------------------------------------------------------------
app = FastAPI(
    title="Fake Account Detector API",
    description="Binary classification API for detecting fake social media accounts.",
    version="1.0.0",
)

# CORS – allow the Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Model Loading
# ---------------------------------------------------------------------------
MODEL_PATH = os.path.join(os.path.dirname(__file__), "model_compressed.joblib")

model = None


@app.on_event("startup")
def load_model():
    """Load the trained model at application startup."""
    global model
    if not os.path.exists(MODEL_PATH):
        print(f"Warning: Model file not found at {MODEL_PATH}")
        print("   Place 'model_compressed.joblib' in the backend/ directory.")
        return
    model = joblib.load(MODEL_PATH)
    print(f"Success: Model loaded successfully from {MODEL_PATH}")


# ---------------------------------------------------------------------------
# 4-Class → Binary Mapping
# ---------------------------------------------------------------------------
# The model was trained on a 4-class dataset with LabelEncoder:
#   a (automated/bot) = 0  → Fake
#   i (inactive)      = 1  → Fake
#   r (real)           = 2  → Real
#   s (spam)           = 3  → Fake
#
# Only class index 2 corresponds to a genuine account.

CLASS_TO_BINARY = {
    0: "Fake",   # a – automated
    1: "Fake",   # i – inactive / suspicious
    2: "Real",   # r – real
    3: "Fake",   # s – spam
}


def map_to_binary(prediction: int) -> str:
    """Convert 4-class model output to binary Real/Fake label."""
    return CLASS_TO_BINARY.get(prediction, "Fake")


def compute_binary_confidence(probabilities: np.ndarray) -> float:
    """
    Derive a binary confidence score from 4-class predict_proba output.

    For 'Real' → confidence = P(class 2)
    For 'Fake' → confidence = P(class 0) + P(class 1) + P(class 3) = 1 - P(class 2)
    """
    p_real = float(probabilities[2]) if len(probabilities) > 2 else 0.0
    p_fake = 1.0 - p_real

    # If the model predicts Real, confidence is p_real; otherwise p_fake
    if p_real >= p_fake:
        return round(p_real * 100, 2)
    else:
        return round(p_fake * 100, 2)


# ---------------------------------------------------------------------------
# Pydantic Schema
# ---------------------------------------------------------------------------
class AccountFeatures(BaseModel):
    """Input schema – 12 features describing a social-media profile."""

    Followers: float = Field(..., description="Number of followers")
    Following: float = Field(..., description="Number of accounts followed")
    Posts: float = Field(..., description="Total number of posts")
    Profile_Pic: int = Field(..., ge=0, le=1, description="1 = has profile picture, 0 = no")
    Verified: int = Field(..., ge=0, le=1, description="1 = verified account, 0 = not")
    Account_Age: float = Field(..., description="Account age in years")
    Avg_Likes: float = Field(..., description="Average likes per post")
    Avg_Comments: float = Field(..., description="Average comments per post")
    Posts_Per_Week: float = Field(..., description="Average posts per week")
    Avg_Hashtags: float = Field(..., description="Average hashtags per post")
    Posts_With_Links: float = Field(..., description="Number of posts containing external links")
    Links_In_Bio: float = Field(..., description="Number of external links in the bio")


class PredictionResponse(BaseModel):
    """Output schema for the /predict endpoint."""

    prediction: str = Field(..., description="Binary label: 'Real' or 'Fake'")
    confidence_score: float = Field(..., description="Confidence percentage (0-100)")


# ---------------------------------------------------------------------------
# Feature Preparation
# ---------------------------------------------------------------------------
def prepare_features(data: AccountFeatures) -> np.ndarray:
    """
    Convert the 12 user-supplied features into the 17-feature vector
    the model expects.

    Model feature order (from training dataset):
      pos, flw, flg, bl, pic, lin, cl, cz, ni, erl, erc, lt, hc, pr, fo, cs, pi

    Mapping from AccountFeatures:
      pos  ← Posts
      flw  ← Followers
      flg  ← Following
      bl   ← 0 (bio length – not collected, default 0)
      pic  ← Profile_Pic
      lin  ← Links_In_Bio
      cl   ← 0 (caption length – default)
      cz   ← 0 (default)
      ni   ← 0 (default)
      erl  ← Avg_Likes
      erc  ← Avg_Comments
      lt   ← Account_Age (proxy for account lifetime)
      hc   ← Avg_Hashtags
      pr   ← Posts_With_Links / max(Posts, 1) (ratio)
      fo   ← Verified (follower-organic proxy)
      cs   ← Posts_Per_Week (content-speed proxy)
      pi   ← Following / max(Followers, 1) (interaction ratio)
    """
    posts = data.Posts
    followers = data.Followers
    following = data.Following

    feature_vector = np.array([[
        posts,                                              # pos
        followers,                                          # flw
        following,                                          # flg
        0,                                                  # bl  (bio length – default)
        data.Profile_Pic,                                   # pic
        data.Links_In_Bio,                                  # lin
        0,                                                  # cl  (caption length – default)
        0,                                                  # cz  (default)
        0,                                                  # ni  (default)
        data.Avg_Likes,                                     # erl
        data.Avg_Comments,                                  # erc
        data.Account_Age,                                   # lt
        data.Avg_Hashtags,                                  # hc
        data.Posts_With_Links / max(posts, 1),              # pr
        data.Verified,                                      # fo
        data.Posts_Per_Week,                                 # cs
        following / max(followers, 1),                      # pi
    ]], dtype=np.float64)

    return feature_vector


# ---------------------------------------------------------------------------
# Endpoints
# ---------------------------------------------------------------------------
@app.get("/", tags=["Health"])
def health_check():
    """Health-check / root route."""
    return {
        "status": "online",
        "model_loaded": model is not None,
        "message": "Fake Account Detector API v1.0",
    }


@app.post("/predict", response_model=PredictionResponse, tags=["Prediction"])
def predict(account: AccountFeatures):
    """
    Accept profile features and return a binary Real/Fake prediction
    with a confidence score.
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Ensure 'model_compressed.joblib' is present.",
        )

    features = prepare_features(account)

    # Prediction
    raw_prediction = int(model.predict(features)[0])
    probabilities = model.predict_proba(features)[0]

    binary_label = map_to_binary(raw_prediction)
    confidence = compute_binary_confidence(probabilities)

    return PredictionResponse(
        prediction=binary_label,
        confidence_score=confidence,
    )


@app.get("/test_samples", tags=["Testing"])
def test_samples():
    """
    Run two hardcoded test samples through the model to verify
    end-to-end functionality.
    """
    if model is None:
        raise HTTPException(
            status_code=503,
            detail="Model not loaded. Ensure 'model_compressed.joblib' is present.",
        )

    # Test samples as AccountFeatures
    samples = [
        {
            "name": "Real Sample",
            "data": AccountFeatures(
                Followers=5400, Following=620, Posts=840,
                Profile_Pic=1, Verified=1, Account_Age=5.2,
                Avg_Likes=620, Avg_Comments=45, Posts_Per_Week=4.0,
                Avg_Hashtags=4.0, Posts_With_Links=1, Links_In_Bio=1,
            ),
        },
        {
            "name": "Fake Sample",
            "data": AccountFeatures(
                Followers=25, Following=4500, Posts=40,
                Profile_Pic=0, Verified=0, Account_Age=0.1,
                Avg_Likes=0, Avg_Comments=0, Posts_Per_Week=35.0,
                Avg_Hashtags=35.0, Posts_With_Links=40, Links_In_Bio=5,
            ),
        },
    ]

    results = []
    for sample in samples:
        features = prepare_features(sample["data"])
        raw_pred = int(model.predict(features)[0])
        proba = model.predict_proba(features)[0]
        binary_label = map_to_binary(raw_pred)
        confidence = compute_binary_confidence(proba)

        results.append({
            "sample_name": sample["name"],
            "input": sample["data"].model_dump(),
            "raw_model_class": raw_pred,
            "prediction": binary_label,
            "confidence_score": confidence,
            "class_probabilities": {
                f"class_{i}": round(float(p), 4) for i, p in enumerate(proba)
            },
        })

    return {"test_results": results}


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
