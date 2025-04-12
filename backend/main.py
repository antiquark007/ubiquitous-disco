# app.py - Main FastAPI application
from fastapi import FastAPI, HTTPException, Depends, Form, Query, Body, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, EmailStr
from pymongo import MongoClient
from bson.objectid import ObjectId
from datetime import datetime
from dotenv import load_dotenv
from typing import List, Dict, Any, Optional
import bcrypt
import os
import json
import asyncio
import uvicorn

# Import the DyslexiaAnalysisSystem class
from models.dyslexia_system import DyslexiaAnalysisSystem

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="Dyslexia No More", 
    description="A comprehensive platform for dyslexia assessment and support",
    version="1.0.0"
)

# Enable CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# MongoDB Setup with improved error handling
try:
    client = MongoClient(os.getenv("MONGO_URI"), serverSelectionTimeoutMS=5000)
    # Test the connection
    client.server_info()
    print("MongoDB connection successful")
    db = client["dyslexia_db"]
    users = db["users"]
    quizzes = db["quizzes"]
    analysis_results = db["analysis_results"]
    user_responses = db["user_responses"] 
except Exception as e:
    print(f"MongoDB connection error: {e}")

# Initialize the dyslexia analysis system
analysis_system = DyslexiaAnalysisSystem()

# Create directory for visualizations
if not os.path.exists("dyslexia_analysis_results"):
    os.makedirs("dyslexia_analysis_results")

# Mount static files directory for visualizations
app.mount("/visualizations", StaticFiles(directory="dyslexia_analysis_results"), name="visualizations")

# =====================
# Pydantic Models
# =====================

# User Models
class SignupRequest(BaseModel):
    name: str
    email: EmailStr
    password: str
    phone: str
    dob: str
    profile_photo: str = ""
    language: str = ""
    about: str = ""

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class UpdateUserRequest(BaseModel):
    name: str = None
    phone: str = None
    dob: str = None
    profile_photo: str = None
    language: str = None
    about: str = None

# Quiz Models
class QuizOption(BaseModel):
    id: str
    text: str
    isCorrect: bool

class QuizQuestion(BaseModel):
    id: str
    text: str
    options: List[QuizOption]
    explanation: Optional[str] = None

class Quiz(BaseModel):
    id: int
    title: str
    description: str
    difficulty: str
    timeLimit: int
    questions: int
    icon: str
    question_list: List[QuizQuestion] = []

class QuizSubmission(BaseModel):
    user_id: str
    quiz_id: int 
    score: int
    completed_at: datetime = None
    answers: dict = {}

# Analysis Models
class AnalysisRequest(BaseModel):
    duration: int = 10
    simulate: bool = False
    user_id: Optional[str] = None

class AnalysisResponse(BaseModel):
    indicators: List[str]
    indicator_scores: Dict[str, float]
    dyslexia_likelihood_percentage: float
    risk_level: str
    confidence_percentage: float
    reading_profile: Dict[str, List[str]]
    visualization_url: Optional[str] = None
    
# Add this new model for quiz completion data
class QuizCompletion(BaseModel):
    quizId: int
    timeTaken: int  # Time in seconds
    correctAnswers: int
    totalQuestions: int

# =====================
# Routes - Core API
# =====================

@app.get("/")
def home():
    return {"message": "Dyslexia No More API is running"}

# =====================
# Routes - User Management
# =====================

@app.post("/signup")
def signup(data: SignupRequest):
    if users.find_one({"email": data.email}):
        raise HTTPException(status_code=409, detail="User already exists")
    
    hashed_pw = bcrypt.hashpw(data.password.encode('utf-8'), bcrypt.gensalt())

    user = {
        "name": data.name,
        "email": data.email,
        "password": hashed_pw,
        "phone": data.phone,
        "dob": data.dob,
        "profile_photo": data.profile_photo,
        "language": data.language,
        "about": data.about,
        "created_at": datetime.utcnow(),
        "quiz_progress": [],
        "analysis_history": []
    }

    result = users.insert_one(user)
    return {
        "message": "User created",
        "id": str(result.inserted_id)
    }

@app.post("/login")
def login(data: LoginRequest):
    user = users.find_one({"email": data.email})
    if not user or not bcrypt.checkpw(data.password.encode('utf-8'), user["password"]):
        raise HTTPException(status_code=401, detail="Invalid email or password")

    return {
        "message": "Login successful",
        "user_id": str(user["_id"])  
    }

@app.get("/profile")
def get_profile(user_id: str = Query(..., description="User ID from MongoDB")):
    try:
        user = users.find_one({"_id": ObjectId(user_id)})
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    user.pop("password")  # Don't expose password hash
    user["id"] = str(user.pop("_id"))
    return user

@app.put("/update_profile")
def update_profile(user_id: str = Query(..., description="User ID to update"), data: UpdateUserRequest = Body(...)):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    update_data = {k: v for k, v in data.dict().items() if v is not None}
    if not update_data:
        raise HTTPException(status_code=400, detail="No data provided for update")

    result = users.update_one({"_id": oid}, {"$set": update_data})
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User updated successfully"}

@app.delete("/delete_user")
def delete_user(user_id: str = Query(...)):
    try:
        oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    result = users.delete_one({"_id": oid})
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="User not found")

    return {"message": "User deleted successfully"}

@app.get("/users")
def get_all_users():
    all_users = []
    for user in users.find():
        user.pop("password", None)
        user["id"] = str(user.pop("_id"))
        all_users.append(user)
    return all_users

# =====================
# Routes - Quiz Management
# =====================

@app.get("/quizzes")
def get_quizzes():
    """Get all available quizzes (summary data only)"""
    # Define the quiz summaries directly to match your frontend requirements
    quiz_summaries = [
        {
            "id": 1,
            "title": "Beginner Level",
            "description": "Start your journey with basic concepts and simple questions.",
            "difficulty": "Easy",
            "timeLimit": 15,
            "questions": 10,
            "icon": "Brain" # Store as string, frontend will render the component
        },
        {
            "id": 2,
            "title": "Intermediate Level",
            "description": "Challenge yourself with more complex scenarios and questions.",
            "difficulty": "Medium",
            "timeLimit": 20,
            "questions": 15,
            "icon": "Target"
        },
        {
            "id": 3,
            "title": "Advanced Level",
            "description": "Test your mastery with advanced concepts and challenging questions.",
            "difficulty": "Hard",
            "timeLimit": 25,
            "questions": 20,
            "icon": "Trophy"
        }
    ]
    
    return quiz_summaries

@app.get("/quiz/{quiz_id}")
def get_quiz(quiz_id: int):
    """Get a specific quiz by ID with all questions"""
    print(f"Looking for quiz with ID: {quiz_id}, type: {type(quiz_id)}")
    quiz = quizzes.find_one({"id": quiz_id})
    print(f"Found quiz: {quiz}")
    if not quiz:
        raise HTTPException(status_code=404, detail=f"Quiz with ID {quiz_id} not found")
    return quiz

@app.post("/init_quizzes")
def initialize_quizzes():
    """Initialize the database with quiz data"""
    quiz_data = [ ]  # Add your quiz data here
    if quiz_data:
        # Insert quiz data
        quizzes.insert_many(quiz_data)
        return {"message": f"Initialized {len(quiz_data)} quizzes"}
    return {"message": "No quiz data to initialize"}

# @app.post("/quiz/submit")
# def submit_quiz_result(submission: QuizSubmission):
#     """Submit quiz results for a user"""
#     try:
#         user_oid = ObjectId(submission.user_id)
#     except Exception:
#         raise HTTPException(status_code=400, detail="Invalid user ID")

#     # Check if user exists
#     user = users.find_one({"_id": user_oid})
#     if not user:
#         raise HTTPException(status_code=404, detail="User not found")

#     # Check if quiz exists
#     quiz = quizzes.find_one({"id": submission.quiz_id})
#     if not quiz:
#         raise HTTPException(status_code=404, detail="Quiz not found")

#     # Update user's quiz progress
#     submission_data = submission.dict()
#     submission_data["completed_at"] = datetime.utcnow()
    
#     # Store in users collection
#     users.update_one(
#         {"_id": user_oid},
#         {
#             "$push": {
#                 "quiz_progress": {
#                     "quiz_id": submission.quiz_id,
#                     "score": submission.score,
#                     "completed_at": submission_data["completed_at"],
#                     "answers": submission.answers
#                 }
#             }
#         }
#     )
    
#     return {"message": "Quiz results submitted successfully"}

@app.post("/quiz/submit")
def submit_quiz_result(
    user_id: str = Query(..., description="User ID from MongoDB"),
    quiz_data: dict = Body(...)
):
    """Submit quiz results for a user with user_id as query parameter"""
    try:
        user_oid = ObjectId(user_id)
    except Exception:
        raise HTTPException(status_code=400, detail="Invalid user ID")

    # Check if user exists
    user = users.find_one({"_id": user_oid})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    # Check if quiz exists
    quiz = quizzes.find_one({"id": quiz_data.get("quizId")})
    if not quiz:
        raise HTTPException(status_code=404, detail=f"Quiz with ID {quiz_data.get('quizId')} not found")
    
    # Calculate score percentage
    score_percentage = round((quiz_data.get("correctAnswers", 0) / quiz_data.get("totalQuestions", 1)) * 100)
    
    # Create response document
    response_document = {
        "user_id": user_id,
        "quiz_id": quiz_data.get("quizId"),
        "time_taken": quiz_data.get("timeTaken"),
        "correct_answers": quiz_data.get("correctAnswers"),
        "total_questions": quiz_data.get("totalQuestions"),
        "score_percentage": score_percentage,
        "completed_at": datetime.utcnow(),
        "quiz_title": quiz.get("title", "Unknown Quiz")
    }
    
    # Insert into the user_responses collection
    user_responses.insert_one(response_document)
    
    # Update the user document for quick access to user's quiz history
    users.update_one(
        {"_id": user_oid},
        {
            "$push": {
                "quiz_completions": {
                    "quiz_id": quiz_data.get("quizId"),
                    "score_percentage": score_percentage,
                    "completed_at": response_document["completed_at"]
                }
            }
        }
    )
    
    return {
        "message": "Quiz results submitted successfully",
        "score_percentage": score_percentage,
        "quiz_id": quiz_data.get("quizId"),
        "completed_at": response_document["completed_at"].isoformat()
    }

# =====================
# Routes - Dyslexia Analysis
# =====================

@app.post("/analyze/simulate", response_model=AnalysisResponse)
async def simulate_analysis(request: AnalysisRequest = Body(...)):
    """Endpoint to run a simulated analysis without camera/audio"""
    try:
        # Generate simulated data
        facial_data = {
            "expressions": {
                "neutral": 45.5,
                "confused": 25.3,
                "concentrated": 15.7,
                "frustrated": 10.2,
                "happy": 3.3
            },
            "dominant_expression": "neutral",
            "confidence_score": 68.2,
            "total_frames": 150
        }
        
        audio_data = {
            "reading_speed": 115.7,
            "speed_assessment": "Below Average",
            "hesitations": 7,
            "hesitations_per_minute": 7.8,
            "pronunciation_errors": 4,
            "speech_clarity_percentage": 80.0,
            "fluency_score": 77.0,
            "reading_rhythm_score": 72.5,
            "overall_audio_score": 74.8
        }
        
        eye_data = {
            "fixations": 48,
            "fixations_percentage": 40.0,
            "regressions": 24,
            "regressions_percentage": 20.0,
            "saccades": 48,
            "saccades_percentage": 40.0,
            "eye_stability_percentage": 70.0,
            "saccade_efficiency_percentage": 66.7,
            "reading_efficiency_score": 52.0
        }
        
        # Generate report
        report = analysis_system.generate_dyslexia_analysis_report(facial_data, audio_data, eye_data)
        
        # Create visualization
        visualization_file = analysis_system.visualize_results(facial_data, audio_data, eye_data, report)
        
        # Add visualization URL if available
        if visualization_file:
            report["visualization_url"] = f"/visualizations/{os.path.basename(visualization_file)}"
        
        # If user_id is provided, save the result
        if request.user_id:
            try:
                user_oid = ObjectId(request.user_id)
                # Save analysis result to user's history
                analysis_result = {
                    "user_id": request.user_id,
                    "date": datetime.utcnow(),
                    "report": report,
                    "type": "simulated"
                }
                
                # Save to analysis_results collection
                result_id = analysis_results.insert_one(analysis_result).inserted_id
                
                # Update user's analysis history
                users.update_one(
                    {"_id": user_oid},
                    {"$push": {"analysis_history": str(result_id)}}
                )
            except Exception as e:
                print(f"Error saving analysis result: {e}")
        
        return report
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/analysis/history/{user_id}")
async def get_analysis_history(user_id: str):
    """Get analysis history for a specific user"""
    try:
        user_oid = ObjectId(user_id)
        
        # Find user to get analysis history IDs
        user = users.find_one({"_id": user_oid})
        if not user:
            raise HTTPException(status_code=404, detail="User not found")
        
        # Get analysis history IDs
        history_ids = user.get("analysis_history", [])
        
        # Get analysis results
        history = []
        for result_id in history_ids:
            try:
                result = analysis_results.find_one({"_id": ObjectId(result_id)})
                if result:
                    result["_id"] = str(result["_id"])
                    history.append(result)
            except Exception as e:
                print(f"Error fetching analysis result {result_id}: {e}")
        
        return history
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# WebSocket route for real-time analysis
@app.websocket("/ws/analyze")
async def websocket_analyze(websocket: WebSocket):
    await websocket.accept()
    
    try:
        # Send initial connection message
        await websocket.send_json({"status": "connected", "message": "Ready to start analysis"})
        
        # Wait for client to send start message
        start_data = await websocket.receive_json()
        
        if start_data.get("command") == "start":
            # Get user_id if provided
            user_id = start_data.get("user_id")
            
            # Send status update
            await websocket.send_json({"status": "starting", "message": "Starting analysis process"})
            
            # Initialize analysis process
            analysis_system.initialize_camera()
            
            # Start audio recording
            analysis_system.start_audio_recording()
            await websocket.send_json({"status": "recording", "message": "Audio recording started"})
            
            # Run facial expression analysis
            await websocket.send_json({"status": "analyzing", "phase": "facial", "message": "Analyzing facial expressions"})
            facial_data = analysis_system.analyze_facial_expressions(duration=10)
            await websocket.send_json({"status": "complete", "phase": "facial", "data": facial_data})
            
            # Run eye tracking analysis
            await websocket.send_json({"status": "analyzing", "phase": "eyes", "message": "Analyzing eye movements"})
            eye_data = analysis_system.analyze_eye_tracking(duration=10)
            await websocket.send_json({"status": "complete", "phase": "eyes", "data": eye_data})
            
            # Stop audio recording and analyze
            analysis_system.stop_audio_recording()
            await websocket.send_json({"status": "analyzing", "phase": "audio", "message": "Analyzing audio data"})
            audio_data = analysis_system.analyze_audio()
            await websocket.send_json({"status": "complete", "phase": "audio", "data": audio_data})
            
            # Clean up
            analysis_system.release_camera()
            
            # Generate final report
            await websocket.send_json({"status": "processing", "message": "Generating final report"})
            report = analysis_system.generate_dyslexia_analysis_report(facial_data, audio_data, eye_data)
            
            # Create visualization
            visualization_file = analysis_system.visualize_results(facial_data, audio_data, eye_data, report)
            
            # Add visualization URL if available
            if visualization_file:
                report["visualization_url"] = f"/visualizations/{os.path.basename(visualization_file)}"
            
            # Save analysis result if user_id is provided
            if user_id:
                try:
                    # Save analysis result to database
                    analysis_result = {
                        "user_id": user_id,
                        "date": datetime.utcnow(),
                        "report": report,
                        "type": "real-time"
                    }
                    
                    # Save to analysis_results collection
                    result_id = analysis_results.insert_one(analysis_result).inserted_id
                    
                    # Update user's analysis history
                    users.update_one(
                        {"_id": ObjectId(user_id)},
                        {"$push": {"analysis_history": str(result_id)}}
                    )
                    
                    # Add result ID to the report
                    report["result_id"] = str(result_id)
                except Exception as e:
                    print(f"Error saving analysis result: {e}")
            
            # Send final results
            await websocket.send_json({"status": "complete", "report": report})
            
    except WebSocketDisconnect:
        print("Client disconnected")
    except Exception as e:
        await websocket.send_json({"status": "error", "message": str(e)})
    finally:
        # Ensure resources are released
        if hasattr(analysis_system, 'camera') and analysis_system.camera is not None:
            analysis_system.release_camera()
        
        if hasattr(analysis_system, 'recording') and analysis_system.recording:
            analysis_system.stop_audio_recording()

# =====================
# Main Entry Point
# =====================

if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=int(os.environ.get("PORT", 8000)), reload=True)