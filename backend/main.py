from fastapi import FastAPI  # type: ignore
from fastapi.middleware.cors import CORSMiddleware  # type: ignore
from pydantic import BaseModel  # type: ignore
import joblib  # type: ignore
import numpy as np  # type: ignore
import os

app = FastAPI()

# Allow requests from your frontend (Next.js)
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:3000")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        frontend_url, 
        "http://localhost:3000", 
        "https://fake-account-detector-alpha.vercel.app",
        "https://fake-account-detector.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the trained model
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "model", "model_compressed.joblib")

try:
    model = joblib.load(MODEL_PATH)
    print("✅ Model loaded successfully!")
except Exception as e:
    print(f"⚠️ Warning: Could not load model - {e}")
    model = None

# Define input structure for profile data
class ProfileData(BaseModel):
    username: str
    followers: float
    following: float
    posts: float
    profilePicture: int  # 0 or 1
    isVerified: int  # 0 or 1
    accountAge: float
    bio: str
    bioLength: int
    postsWithLinks: float
    avgLikesPerPost: float
    avgCommentsPerPost: float
    followersToFollowingRatio: float
    postFrequency: float
    hashtagsPerPost: float
    externalLinks: float
    platform: str

def extract_features(data: ProfileData):
    """
    Extract features from profile data to match the model's expected input.
    
    Based on the model's training features, we need to map:
    - pos: posts count
    - flg: following count
    - flr: followers count
    - bl: bio length
    - pic: has profile picture (1/0)
    - lin: external links in bio
    - cl: avg comments per post
    - cz: (derived) comment/like ratio
    - ni: (derived) engagement score
    - erl: (derived) engagement rate likes
    - erc: (derived) engagement rate comments
    - lt: avg likes per post
    - hc: hashtags per post
    - pr: posting frequency (posts per week)
    - fo: follower:following ratio
    - cs: posts with external links
    - pi: profile picture indicator (same as pic)
    """
    
    # Calculate derived metrics
    followers = max(data.followers, 1)  # Avoid division by zero
    posts = max(data.posts, 1)
    
    # Engagement rates
    engagement_rate_likes = (data.avgLikesPerPost / followers) * 100 if followers > 0 else 0
    engagement_rate_comments = (data.avgCommentsPerPost / followers) * 100 if followers > 0 else 0
    
    # Comment to like ratio
    comment_like_ratio = (data.avgCommentsPerPost / data.avgLikesPerPost) if data.avgLikesPerPost > 0 else 0
    
    # Overall engagement score (normalized)
    engagement_score = (data.avgLikesPerPost + data.avgCommentsPerPost) / posts if posts > 0 else 0
    
    # Feature vector matching model's expected order
    features = [
        data.posts,                          # pos
        data.following,                      # flg
        data.followers,                      # flr
        data.bioLength,                      # bl
        data.profilePicture,                 # pic
        data.externalLinks,                  # lin
        data.avgCommentsPerPost,             # cl
        comment_like_ratio,                  # cz
        engagement_score,                    # ni
        engagement_rate_likes,               # erl
        engagement_rate_comments,            # erc
        data.avgLikesPerPost,                # lt
        data.hashtagsPerPost,                # hc
        data.postFrequency,                  # pr
        data.followersToFollowingRatio,      # fo
        data.postsWithLinks,                 # cs
        data.profilePicture,                 # pi
    ]
    
    return np.array(features).reshape(1, -1)

def analyze_profile(data: ProfileData):
    """
    Analyze profile data and provide insights even without ML model.
    """
    # Calculate risk factors
    risk_factors = []
    risk_score = 0
    
    # 1. Follower/Following ratio analysis
    if data.followersToFollowingRatio < 0.1:
        risk_factors.append("Very low follower-to-following ratio")
        risk_score += 20
    elif data.followersToFollowingRatio > 10:
        risk_factors.append("Unusually high follower-to-following ratio")
        risk_score += 10
    
    # 2. Profile completeness
    if data.profilePicture == 0:
        risk_factors.append("No profile picture")
        risk_score += 15
    
    if data.bioLength < 10:
        risk_factors.append("Very short or no bio")
        risk_score += 10
    
    # 3. Account age
    if data.accountAge < 0.5:
        risk_factors.append("Very new account (less than 6 months)")
        risk_score += 15
    
    # 4. Engagement analysis
    if data.posts > 0:
        engagement_rate = ((data.avgLikesPerPost + data.avgCommentsPerPost) / data.followers) * 100 if data.followers > 0 else 0
        
        if engagement_rate < 0.5:
            risk_factors.append("Very low engagement rate")
            risk_score += 15
        elif engagement_rate > 50:
            risk_factors.append("Unusually high engagement rate")
            risk_score += 10
    
    # 5. Posting behavior
    if data.postFrequency > 20:
        risk_factors.append("Extremely high posting frequency")
        risk_score += 10
    elif data.posts > 0 and data.postFrequency < 0.5:
        risk_factors.append("Very low posting activity")
        risk_score += 5
    
    # 6. External links
    if data.externalLinks > 3:
        risk_factors.append("High number of external links")
        risk_score += 10
    
    # 7. Content analysis
    if data.posts > 0:
        link_post_ratio = (data.postsWithLinks / data.posts) * 100
        if link_post_ratio > 50:
            risk_factors.append("More than 50% of posts contain external links")
            risk_score += 15
    
    # Cap risk score at 100
    risk_score = min(risk_score, 100)
    
    return risk_score, risk_factors

@app.get("/")
def home():
    return {
        "message": "Fake Account Detection API is running!",
        "version": "2.0",
        "model_loaded": model is not None
    }

@app.get("/health")
def health_check():
    return {
        "status": "healthy",
        "model_status": "loaded" if model is not None else "not_loaded"
    }

@app.post("/api/scan")
def scan_profile(data: ProfileData):
    """
    Scan a social media profile for fake account indicators.
    Uses ML model if available, otherwise uses rule-based analysis.
    """
    
    try:
        # Perform rule-based analysis
        risk_score, risk_factors = analyze_profile(data)
        
        # If model is available, use it for prediction
        if model is not None:
            try:
                features = extract_features(data)
                prediction = model.predict(features)[0]
                prediction_proba = model.predict_proba(features)[0]
                
                # Get confidence (probability of predicted class)
                confidence = int(max(prediction_proba) * 100)
                
                # Combine ML prediction with rule-based analysis
                is_fake = bool(prediction == 1)  # Assuming 1 = fake, 0 = real
                confidence = int(float(max(prediction_proba)) * 100)
                
                # Adjust confidence based on risk factors
                if len(risk_factors) > 3:
                    confidence = min(confidence + 10, 100)
                
            except Exception as e:
                print(f"Model prediction error: {e}")
                # Fall back to rule-based
                is_fake = risk_score > 50
                confidence = risk_score
        else:
            # Use rule-based analysis only
            is_fake = risk_score > 50
            confidence = risk_score
        
        # Determine account status
        if confidence >= 80:
            account_status = "Highly Suspicious" if is_fake else "Highly Genuine"
            predicted_class = "Fake" if is_fake else "Authentic"
        elif confidence >= 60:
            account_status = "Suspicious" if is_fake else "Likely Genuine"
            predicted_class = "Questionable" if is_fake else "Probably Real"
        else:
            account_status = "Uncertain"
            predicted_class = "Needs Review"
        
        # Generate detailed analysis
        details = {
            "accountAge": f"{data.accountAge:.1f} years" if data.accountAge > 0 else "Unknown",
            "followerRatio": f"1:{data.followersToFollowingRatio:.2f}" if data.followersToFollowingRatio > 0 else "N/A",
            "bioSentiment": "Present" if data.bioLength > 10 else "Minimal/Absent",
            "profilePicture": "Present" if data.profilePicture == 1 else "Absent",
            "postingActivity": get_activity_level(data.postFrequency),
            "engagementRate": f"{((data.avgLikesPerPost + data.avgCommentsPerPost) / data.followers * 100):.2f}%" if data.followers > 0 else "N/A",
            "verificationStatus": "Verified" if data.isVerified == 1 else "Not Verified"
        }
        
        # Build response
        result = {
            "success": True,
            "isFake": is_fake,
            "confidence": confidence,
            "accountStatus": account_status,
            "predictedClass": predicted_class,
            "riskFactors": risk_factors if risk_factors else ["Profile appears normal"],
            "details": details,
            "profileData": {
                "username": data.username,
                "followers": int(data.followers),
                "following": int(data.following),
                "posts_count": int(data.posts),
                "is_verified": data.isVerified == 1,
                "biography": data.bio[:100] + "..." if data.bio and len(data.bio) > 100 else data.bio, # type: ignore
            },
            "analysis": {
                "method": "ML Model + Rule-Based" if model is not None else "Rule-Based Only",
                "features_analyzed": 17,
                "risk_score": risk_score
            }
        }
        
        return result
        
    except Exception as e:
        print(f"Error during scan: {e}")
        return {
            "success": False,
            "error": str(e),
            "message": "An error occurred during profile analysis"
        }

def get_activity_level(post_frequency):
    """Categorize posting activity level"""
    if post_frequency >= 10:
        return "Very High"
    elif post_frequency >= 5:
        return "High"
    elif post_frequency >= 2:
        return "Moderate"
    elif post_frequency >= 0.5:
        return "Low"
    else:
        return "Very Low"

@app.get("/api/stats")
def get_stats():
    """Get API statistics"""
    return {
        "model_loaded": model is not None,
        "features_count": 17,
        "supported_platforms": ["Instagram", "Facebook", "Twitter"],
        "api_version": "2.0"
    }

if __name__ == "__main__":
    import uvicorn  # type: ignore
    uvicorn.run(app, host="0.0.0.0", port=8000)
