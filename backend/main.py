from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import joblib
import numpy as np
import os   # 👈 ADD THIS

app = FastAPI()

# Allow requests from your frontend (Next.js)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ FIXED MODEL LOADING
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model_compressed.joblib")
model = joblib.load(MODEL_PATH)

# Define input structure
class AccountData(BaseModel):
    pos: float
    flg: float
    flr: float
    bl: float
    pic: int
    lin: int
    cl: float
    cz: float
    ni: float
    erl: float
    erc: float
    lt: float
    hc: float
    pr: float
    fo: float
    cs: float
    pi: float

@app.get("/")
def home():
    return {"message": "Fake Account Detection API is running!"}

@app.get("/health")
def health_check():
    return {"status": "healthy"}

@app.post("/api/scan")
def scan_profile(data: dict):
    # Example dummy logic
    username = data.get("profileUrl", "")
    result = {
        "success": True,
        "isFake": "fake" in username.lower(),
        "confidence": 89,
        "accountStatus": "Fake" if "fake" in username.lower() else "Real",
        "predictedClass": "Suspicious" if "fake" in username.lower() else "Legit",
        "details": {
            "accountAge": "2 years",
            "followerRatio": "1:3",
            "bioSentiment": "Positive",
            "profilePicture": "Present",
            "postingActivity": "High"
        },
        "profileData": {
            "username": username,
            "followers": 500,
            "following": 200,
            "posts_count": 120,
            "profile_pic_url": "https://i.pravatar.cc/150?u=" + username,
        }
    }
    return result
